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

// Standard Mercator projection centered on Oceania
const projection = d3.geoMercator()
  .center([150, -22])
  .scale(380)
  .translate([width / 2 - 20, height / 2]);

const pathGenerator = d3.geoPath().projection(projection);

function filterOceaniaGeometry(geometry: any, code: string) {
  if (!geometry) return null;
  if (geometry.type === 'Polygon') return geometry;
  if (geometry.type === 'MultiPolygon') {
    const validPolys = geometry.coordinates.filter((poly: any) => {
      const pts = poly[0];
      const avgLon = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
      const avgLat = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
      if (code === 'AU') {
        // Main Australian continent + Tasmania
        return avgLat >= -44 && avgLat <= -10 && avgLon >= 112 && avgLon <= 154;
      }
      if (code === 'NZ') {
        // North & South Island (exclude Chatham at -176°W across 180° meridian)
        return avgLat >= -48 && avgLat <= -34 && avgLon >= 165 && avgLon <= 179;
      }
      if (code === 'KI') {
        // Kiribati: Gilbert Islands near 173°E
        return avgLon >= 168 && avgLon <= 180;
      }
      if (code === 'FJ') {
        return avgLon >= 175 && avgLon <= 180;
      }
      return true;
    });
    if (validPolys.length === 0) return null;
    return {
      type: 'MultiPolygon',
      coordinates: validPolys
    };
  }
  return geometry;
}

// Surrounding context landmasses (Indonesia, Philippines, Timor-Leste)
const CONTEXT_NUMERICS = ['360', '608', '626'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const d = pathGenerator(f);
  return d;
}).filter(Boolean);

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
  { numeric: '036', code: 'AU', name: 'Australia', capital: 'Canberra', region: 'Australasia', funFact: 'The world\'s only continent occupied by a single country, home to the Great Barrier Reef and unique marsupials.' },
  { numeric: '554', code: 'NZ', name: 'New Zealand', capital: 'Wellington', region: 'Australasia', funFact: 'The first nation to grant women the right to vote (in 1893) and world-renowned for stunning fjord landscapes.' },
  { numeric: '598', code: 'PG', name: 'Papua New Guinea', capital: 'Port Moresby', region: 'Melanesia', funFact: 'The most linguistically diverse country on Earth, with over 840 living languages spoken.' },
  { numeric: '242', code: 'FJ', name: 'Fiji', capital: 'Suva', region: 'Melanesia', funFact: 'An archipelago of over 330 tropical islands, famed for pristine coral reefs and world-class rugby sevens.' },
  { numeric: '090', code: 'SB', name: 'Solomon Islands', capital: 'Honiara', region: 'Melanesia', funFact: 'Home to the world\'s largest double-barrier reef system and legendary WWII Pacific battlefields like Guadalcanal.' },
  { numeric: '548', code: 'VU', name: 'Vanuatu', capital: 'Port Vila', region: 'Melanesia', funFact: 'The birthplace of modern bungee jumping, inspired by the ancient land-diving ritual known as "Naghol."' },
  { numeric: '882', code: 'WS', name: 'Samoa', capital: 'Apia', region: 'Polynesia', funFact: 'One of the oldest Polynesian cultures with traditional "Fa\'a Samoa" communal customs and famous ocean trenches.', isMicrostate: true },
  { numeric: '296', code: 'KI', name: 'Kiribati', capital: 'South Tarawa', region: 'Micronesia', funFact: 'The only country situated in all four hemispheres (Northern, Southern, Eastern, and Western).', isMicrostate: true },
  { numeric: '583', code: 'FM', name: 'Micronesia', capital: 'Palikir', region: 'Micronesia', funFact: 'Features Nan Madol, an ancient ruined city built entirely atop artificial coral reef islands.', isMicrostate: true },
  { numeric: '776', code: 'TO', name: 'Tonga', capital: "Nuku'alofa", region: 'Polynesia', funFact: 'Known as the "Friendly Islands," it is the only Pacific nation that never completely lost its indigenous monarchy.', isMicrostate: true },
  { numeric: '584', code: 'MH', name: 'Marshall Islands', capital: 'Majuro', region: 'Micronesia', funFact: 'Consists of 29 low-lying coral atolls and over 1,150 individual islands spanning 750,000 square miles of ocean.', isMicrostate: true },
  { numeric: '585', code: 'PW', name: 'Palau', capital: 'Ngerulmud', region: 'Micronesia', funFact: 'Created the world\'s very first shark sanctuary in 2009 and home to the famous Jellyfish Lake.', isMicrostate: true },
  { numeric: '798', code: 'TV', name: 'Tuvalu', capital: 'Funafuti', region: 'Polynesia', funFact: 'One of the smallest and least visited nations; famous for its sought-after internet domain extension ".tv."', isMicrostate: true },
  { numeric: '520', code: 'NR', name: 'Nauru', capital: 'Yaren', region: 'Micronesia', funFact: 'The third-smallest sovereign country in the world (21 km²) and the smallest independent island republic.', isMicrostate: true }
];

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'AU': [134, -25],
  'NZ': [173, -41],
  'PG': [144, -5.5],
  'FJ': [178, -17.8],
  'SB': [160, -9.5],
  'VU': [168, -16],
  'WS': [172.5, -13.6],
  'KI': [173.0, 1.4],
  'FM': [158.2, 6.9],
  'TO': [175.2, -21.2],
  'MH': [171.2, 7.1],
  'PW': [134.5, 7.5],
  'TV': [179.2, -8.5],
  'NR': [166.9, -0.53]
};

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature) {
    const filteredGeo = { ...geoFeature, geometry: filterOceaniaGeometry(geoFeature.geometry, cDef.code) };
    if (filteredGeo.geometry) {
      pathD = pathGenerator(filteredGeo) || '';
      const bounds = pathGenerator.bounds(filteredGeo);
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

  // Accessible targeting disc for microstates & small islands
  if (cDef.isMicrostate) {
    const r = 10;
    if (!pathD || bbox.width < 12 || bbox.height < 12) {
      pathD = `M ${centroid[0] - r} ${centroid[1]} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
      bbox = {
        x: Math.round(centroid[0] - r),
        y: Math.round(centroid[1] - r),
        width: r * 2,
        height: r * 2
      };
    }
  }

  // Read SVG flag data
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
    isMicrostate: !!cDef.isMicrostate
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
console.log(`Successfully generated src/data/oceaniaData.ts with all ${resultCountries.length} Oceania nations.`);
