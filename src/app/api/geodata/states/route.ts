import { NextResponse } from 'next/server';

// PublicaMundi US states GeoJSON — has `name` property per feature
const STATES_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

const STATE_NAME_TO_CODE: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR',
  California: 'CA', Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE',
  Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
  Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS',
  Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
};

export const revalidate = 86400;

export async function GET() {
  try {
    const res = await fetch(STATES_URL);
    if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
    const raw = await res.json();

    const slim = {
      type: 'FeatureCollection',
      features: (raw.features as any[])
        .map((f) => {
          const name: string = f.properties?.name ?? '';
          const code = STATE_NAME_TO_CODE[name];
          if (!code) return null;
          return {
            type: 'Feature',
            geometry: f.geometry,
            properties: { ISO_A3: code, name },
          };
        })
        .filter(Boolean),
    };

    return NextResponse.json(slim);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch state geodata' }, { status: 500 });
  }
}
