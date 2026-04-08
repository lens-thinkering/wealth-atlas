"use client";

import { useRef, useMemo, useCallback } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import {
  GeoFeature,
  FeatureBBox,
  buildBorderGeometry,
  getFeatureBBox,
  vectorToLatLng,
  findFeatureAtPoint,
  GLOBE_RADIUS,
} from './utils';

const COLOR_DEFAULT = new THREE.Color('#1a3320');
const COLOR_HOVERED = new THREE.Color('#39ff14');
const COLOR_SELECTED = new THREE.Color('#00f5ff');

interface CountryLayerProps {
  features: GeoFeature[];
  selectedISO: string | null;
  onHover: (iso: string | null, name: string | null) => void;
  onSelect: (iso: string, name: string) => void;
}

export default function CountryLayer({
  features,
  selectedISO,
  onHover,
  onSelect,
}: CountryLayerProps) {
  const lineRefs = useRef<Map<string, THREE.LineSegments>>(new Map());
  const prevHoveredISO = useRef<string | null>(null);

  // Pre-compute geometries and bounding boxes
  const { borderGeos, bboxes } = useMemo(() => {
    const borderGeos = features.map((f) => ({
      iso: f.properties.ISO_A3,
      name: f.properties.name,
      geo: buildBorderGeometry(f),
    }));
    const bboxes = new Map<string, FeatureBBox>(
      features.map((f) => [f.properties.ISO_A3, getFeatureBBox(f)])
    );
    return { borderGeos, bboxes };
  }, [features]);

  const setLineColor = useCallback(
    (iso: string, color: THREE.Color) => {
      const line = lineRefs.current.get(iso);
      if (line) (line.material as THREE.LineBasicMaterial).color.copy(color);
    },
    []
  );

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const [lat, lng] = vectorToLatLng(event.point);
      const feature = findFeatureAtPoint(lat, lng, features, bboxes);
      const newISO = feature?.properties.ISO_A3 ?? null;

      if (newISO === prevHoveredISO.current) return;

      // Reset previous hover (unless it's the selected country)
      if (prevHoveredISO.current && prevHoveredISO.current !== selectedISO) {
        setLineColor(prevHoveredISO.current, COLOR_DEFAULT);
      }

      // Apply hover color (unless it's the selected country)
      if (newISO && newISO !== selectedISO) {
        setLineColor(newISO, COLOR_HOVERED);
      }

      prevHoveredISO.current = newISO;
      onHover(newISO, feature?.properties.name ?? null);
    },
    [features, bboxes, selectedISO, setLineColor, onHover]
  );

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      const [lat, lng] = vectorToLatLng(event.point);
      const feature = findFeatureAtPoint(lat, lng, features, bboxes);
      if (feature) {
        onSelect(feature.properties.ISO_A3, feature.properties.name);
        // Highlight selected in blue
        lineRefs.current.forEach((line, iso) => {
          const mat = line.material as THREE.LineBasicMaterial;
          if (iso === feature.properties.ISO_A3) {
            mat.color.copy(COLOR_SELECTED);
          } else if (iso !== prevHoveredISO.current) {
            mat.color.copy(COLOR_DEFAULT);
          }
        });
      }
    },
    [features, bboxes, onSelect]
  );

  const handlePointerLeave = useCallback(() => {
    if (prevHoveredISO.current && prevHoveredISO.current !== selectedISO) {
      setLineColor(prevHoveredISO.current, COLOR_DEFAULT);
    }
    prevHoveredISO.current = null;
    onHover(null, null);
  }, [selectedISO, setLineColor, onHover]);

  return (
    <group>
      {/* Invisible hit sphere for pointer events */}
      <mesh
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Country border lines */}
      {borderGeos.map(({ iso, geo }) => (
        <lineSegments
          key={iso}
          ref={(el: THREE.LineSegments | null) => {
            if (el) lineRefs.current.set(iso, el);
            else lineRefs.current.delete(iso);
          }}
          geometry={geo}
        >
          <lineBasicMaterial
            color={iso === selectedISO ? COLOR_SELECTED : COLOR_DEFAULT}
          />
        </lineSegments>
      ))}
    </group>
  );
}
