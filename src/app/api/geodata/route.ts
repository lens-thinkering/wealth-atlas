import { NextResponse } from 'next/server';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

export const revalidate = 86400; // 24h server-side cache

export async function GET() {
  try {
    const res = await fetch(GEOJSON_URL);
    if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
    const raw = await res.json();

    // Slim the payload: drop all properties except ISO_A3 and country name
    const slim = {
      type: 'FeatureCollection',
      features: (raw.features as any[]).map((f) => ({
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          ISO_A3: f.properties.ISO_A3 as string,
          name: f.properties.ADMIN as string,
        },
      })),
    };

    return NextResponse.json(slim);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch geodata' }, { status: 500 });
  }
}
