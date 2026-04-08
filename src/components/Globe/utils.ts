import * as THREE from 'three';

export const GLOBE_RADIUS = 2;

/** Convert lat/lng degrees to a 3D point on the sphere surface */
export function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Convert a sphere surface point back to [lat, lng] */
export function vectorToLatLng(v: THREE.Vector3): [number, number] {
  const n = v.clone().normalize();
  const lat = Math.asin(Math.max(-1, Math.min(1, n.y))) * (180 / Math.PI);
  const lng = Math.atan2(n.z, -n.x) * (180 / Math.PI) - 180;
  return [lat, lng];
}

export interface GeoFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: [number, number][][][] | [number, number][][];
  };
  properties: {
    ISO_A3: string;
    name: string;
  };
}

export interface FeatureBBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/** Get all coordinate rings from a feature */
export function getRings(feature: GeoFeature): [number, number][][] {
  if (feature.geometry.type === 'Polygon') {
    return feature.geometry.coordinates as [number, number][][];
  }
  return (feature.geometry.coordinates as [number, number][][][]).flat(1);
}

/** Compute axis-aligned bounding box in lat/lng space */
export function getFeatureBBox(feature: GeoFeature): FeatureBBox {
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;
  for (const ring of getRings(feature)) {
    for (const [lng, lat] of ring) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    }
  }
  return { minLat, maxLat, minLng, maxLng };
}

/** Build a THREE.BufferGeometry of line segments for country borders */
export function buildBorderGeometry(feature: GeoFeature): THREE.BufferGeometry {
  const positions: number[] = [];
  for (const ring of getRings(feature)) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [lngA, latA] = ring[i];
      const [lngB, latB] = ring[i + 1];
      // Slightly raised above sphere surface to avoid z-fighting
      const a = latLngToVector3(latA, lngA, GLOBE_RADIUS + 0.002);
      const b = latLngToVector3(latB, lngB, GLOBE_RADIUS + 0.002);
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

/** Ray-casting point-in-ring test (2D lat/lng space) */
function pointInRing(lat: number, lng: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; // xi = lng, yi = lat
    const [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** Find which GeoJSON feature contains the given lat/lng point */
export function findFeatureAtPoint(
  lat: number,
  lng: number,
  features: GeoFeature[],
  bboxes: Map<string, FeatureBBox>
): GeoFeature | null {
  // Normalize lng to -180..180
  const normLng = ((lng + 540) % 360) - 180;

  for (const feature of features) {
    // Bounding box pre-filter
    const bbox = bboxes.get(feature.properties.ISO_A3);
    if (
      bbox &&
      (lat < bbox.minLat || lat > bbox.maxLat || normLng < bbox.minLng || normLng > bbox.maxLng)
    ) {
      continue;
    }

    // Full polygon test — only outer rings (index 0 of each polygon)
    const outerRings: [number, number][][] =
      feature.geometry.type === 'Polygon'
        ? [(feature.geometry.coordinates as [number, number][][])[0]]
        : (feature.geometry.coordinates as [number, number][][][]).map((poly) => poly[0]);

    for (const ring of outerRings) {
      if (pointInRing(lat, normLng, ring)) return feature;
    }
  }
  return null;
}
