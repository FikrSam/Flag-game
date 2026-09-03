import * as topojson from 'topojson-client';
import * as d3 from 'd3-geo';
import fs from 'fs';
import path from 'path';

// Load authentic Natural Earth 50m world dataset
const worldPath = path.resolve('node_modules/world-atlas/countries-50m.json');
const worldData = JSON.parse(fs.readFileSync(worldPath, 'utf8'));
const countriesGeo = (topojson.feature(worldData, worldData.objects.countries) as any).features;

const width = 1000;
const height = 800;

// Pacific-centered Mercator projection (rotate [-165, 0] seamlessly avoids 180° antimeridian cuts)
const projection = d3.geoMercator()
  .rotate([-165, 0])
  .center([0, -18])
  .scale(440)
  .translate([width / 2, height / 2 - 20]);

const pathGenerator = d3.geoPath().projection(projection);

// Surrounding context landmasses (Indonesia, Philippines, East Timor)
const CONTEXT_NUMERICS = ['360', '608', '626'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const d = pathGenerator(f);
  return d;
}).filter(Boolean);

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'AU': [134.0, -25.0],
  'NZ': [174.0, -41.5],
  'PG': [144.0, -6.0],
  'FJ': [178.0, -17.8],
  'SB': [160.0, -9.5],
  'VU': [168.3, -16.0],
  'WS': [-172.1, -13.75],
  'KI': [173.0, 1.4],
  'TO': [-175.2, -21.17],
  'FM': [158.2, 6.9],
  'MH': [171.2, 7.1],
  'PW': [134.5, 7.5],
  'TV': [179.2, -8.5],
  'NR': [166.9, -0.53]
};

interface CountryDef {
  numeric: string;
  code: string;
  name: string;
  capital: string;
  region: string;
  funFact: string;
  isMicrostate?: boolean;
}

const COUNTRY_DEFINITIONS: CountryDef[] = [
  { numeric: '036', code: 'AU', name: 'Australia', capital: 'Canberra', region: 'Australasia', funFact: 'Home to the Great Barrier Reef (largest living structure on Earth) and unique marsupials like kangaroos and koalas.' },
  { numeric: '554', code: 'NZ', name: 'New Zealand', capital: 'Wellington', region: 'Polynesia', funFact: 'First self-governing country in the world to give all women the right to vote in parliamentary elections (1893).' },
  { numeric: '598', code: 'PG', name: 'Papua New Guinea', capital: 'Port Moresby', region: 'Melanesia', funFact: 'The most linguistically diverse nation on Earth, with over 840 distinct living indigenous languages spoken.' },
  { numeric: '242', code: 'FJ', name: 'Fiji', capital: 'Suva', region: 'Melanesia', funFact: 'An archipelago of more than 330 islands, celebrated worldwide for rugby sevens and warm traditional kava ceremonies.' },
  { numeric: '090', code: 'SB', name: 'Solomon Islands', capital: 'Honiara', region: 'Melanesia', funFact: 'Site of pivotal WWII Pacific battles including Guadalcanal; houses Marovo Lagoon, the world\'s largest saltwater lagoon.' },
  { numeric: '548', code: 'VU', name: 'Vanuatu', capital: 'Port Vila', region: 'Melanesia', funFact: 'The birthplace of modern bungee jumping, inspired by the ancient Pentecost Island land-diving (Naghol) ritual.' },
  { numeric: '882', code: 'WS', name: 'Samoa', capital: 'Apia', region: 'Polynesia', funFact: 'Known as the "Cradle of Polynesia" where the centuries-old traditional Fa\'a Samoa (the Samoan Way) guides daily life.' },
  { numeric: '296', code: 'KI', name: 'Kiribati', capital: 'Tarawa', region: 'Micronesia', funFact: 'The only nation in the world situated in all four hemispheres (Northern, Southern, Eastern, and Western).' },
  { numeric: '776', code: 'TO', name: 'Tonga', capital: 'Nukuʻalofa', region: 'Polynesia', isMicrostate: true, funFact: 'The only Pacific island nation that was never formally colonized by a foreign power, maintaining its native monarchy.' },
  { numeric: '583', code: 'FM', name: 'Micronesia', capital: 'Palikir', region: 'Micronesia', isMicrostate: true, funFact: 'Home to Nan Madol, a mysterious ancient ruined city built on artificial coral stone islets atop a lagoon.' },
  { numeric: '584', code: 'MH', name: 'Marshall Islands', capital: 'Majuro', region: 'Micronesia', isMicrostate: true, funFact: 'Consists of 29 low-lying coral atolls and over 1,100 islets; home to the legendary Bikini Atoll marine reserve.' },
  { numeric: '585', code: 'PW', name: 'Palau', capital: 'Ngerulmud', region: 'Micronesia', isMicrostate: true, funFact: 'Created the world\'s first shark sanctuary in 2009 and requires visitors to sign an ecological passport pledge upon entry.' },
  { numeric: '798', code: 'TV', name: 'Tuvalu', capital: 'Funafuti', region: 'Polynesia', isMicrostate: true, funFact: 'The fourth-smallest sovereign nation in the world, famously leasing its valuable ".tv" country-code web domain.' },
  { numeric: '520', code: 'NR', name: 'Nauru', capital: 'Yaren', region: 'Micronesia', isMicrostate: true, funFact: 'The world\'s smallest independent island nation (21 km²) and the only sovereign state without an official capital city.' }
];

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature && geoFeature.geometry) {
    pathD = pathGenerator(geoFeature) || '';
    const bounds = pathGenerator.bounds(geoFeature);
    if (bounds) {
      const [[x0, y0], [x1, y1]] = bounds;
      bbox = {
        x: Math.round(x0),
        y: Math.round(y0),
        width: Math.max(1, Math.round(x1 - x0)),
        height: Math.max(1, Math.round(y1 - y0))
      };
    }
  }

  // Centroid computation
  if (CENTROID_OVERRIDES[cDef.code]) {
    const projected = projection(CENTROID_OVERRIDES[cDef.code]) || [0, 0];
    centroid = [Math.round(projected[0] * 10) / 10, Math.round(projected[1] * 10) / 10];
  } else if (geoFeature) {
    const c = d3.geoCentroid(geoFeature);
    const projected = projection(c) || [0, 0];
    centroid = [Math.round(projected[0] * 10) / 10, Math.round(projected[1] * 10) / 10];
  }

  // Dedicated accessible beacon polygon for microstates or tiny atolls
  const isMicrostate = !!cDef.isMicrostate;
  if (!pathD || isMicrostate) {
    const r = 9;
    if (!pathD) {
      pathD = `M ${centroid[0] - r} ${centroid[1]} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
      bbox = {
        x: Math.round(centroid[0] - r),
        y: Math.round(centroid[1] - r),
        width: r * 2,
        height: r * 2
      };
    }
  }

  // Read raw SVG content from public/flags
  const flagSvgPath = path.resolve(`public/flags/${cDef.code.toLowerCase()}.svg`);
  let flagDataUri = `/flags/${cDef.code.toLowerCase()}.svg`;
  if (fs.existsSync(flagSvgPath)) {
    const rawSvg = fs.readFileSync(flagSvgPath, 'utf8');
    const base64 = Buffer.from(rawSvg).toString('base64');
    flagDataUri = `data:image/svg+xml;base64,${base64}`;
  }

  resultCountries.push({
    id: cDef.code,
    numeric: cDef.numeric,
    name: cDef.name,
    capital: cDef.capital,
    region: cDef.region,
    funFact: cDef.funFact,
    flagDataUri,
    path: pathD,
    centroid,
    bbox,
    isMicrostate
  });
}

const fileContent = `import type { CountryData } from '../types/game';
export type { CountryData };

export const OCEANIA_MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const OCEANIA_CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const OCEANIA_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/oceaniaData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/oceaniaData.ts with all 14 Oceania countries.`);
