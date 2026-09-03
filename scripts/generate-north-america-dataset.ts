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

// Authentic Conic Equal Area projection for North America
const projection = d3.geoConicEqualArea()
  .parallels([20, 60])
  .rotate([96, 0])
  .center([0, 38])
  .scale(460)
  .translate([width / 2 + 10, height / 2 - 10]);

const pathGenerator = d3.geoPath().projection(projection);

// Filter out Aleutian islands crossing 180° into the Eastern Hemisphere and distant overseas territories
function filterNAGeometry(geometry: any) {
  if (!geometry) return null;
  if (geometry.type === 'Polygon') return geometry;
  if (geometry.type === 'MultiPolygon') {
    const validPolys = geometry.coordinates.filter((poly: any) => {
      const pts = poly[0];
      const avgLon = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
      const avgLat = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
      return avgLon <= -50 && avgLon >= -175 && avgLat >= 5 && avgLat <= 85;
    });
    if (validPolys.length === 0) return null;
    return {
      type: 'MultiPolygon',
      coordinates: validPolys
    };
  }
  return geometry;
}

// Surrounding context landmasses (South America: Colombia, Venezuela; Greenland, Bermuda)
const CONTEXT_NUMERICS = ['170', '862', '304', '060'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const d = pathGenerator(f);
  return d;
}).filter(Boolean);

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'CA': [-106.0, 56.0],
  'US': [-98.5, 39.5],
  'MX': [-102.5, 23.5],
  'GT': [-90.2, 15.5],
  'BZ': [-88.5, 17.2],
  'SV': [-88.9, 13.8],
  'HN': [-86.5, 15.0],
  'NI': [-85.2, 12.8],
  'CR': [-84.0, 10.0],
  'PA': [-80.2, 8.5],
  'CU': [-79.5, 22.0],
  'BS': [-77.4, 25.0],
  'HT': [-72.3, 19.0],
  'DO': [-70.2, 19.0],
  'JM': [-77.3, 18.1],
  'TT': [-61.2, 10.5],
  'BB': [-59.5, 13.2],
  'LC': [-61.0, 14.0],
  'VC': [-61.2, 13.2],
  'GD': [-61.7, 12.1],
  'AG': [-61.8, 17.1],
  'DM': [-61.4, 15.4],
  'KN': [-62.7, 17.3]
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
  { numeric: '124', code: 'CA', name: 'Canada', capital: 'Ottawa', region: 'Northern', funFact: 'Contains more than half of all natural lakes on planet Earth and has the longest coastline in the world.' },
  { numeric: '840', code: 'US', name: 'United States', capital: 'Washington, D.C.', region: 'Northern', funFact: 'Home to Yellowstone (1872), the world\'s very first national park, and 50 diverse states.' },
  { numeric: '484', code: 'MX', name: 'Mexico', capital: 'Mexico City', region: 'Central', funFact: 'Introduced chocolate, chili, and corn to the world; Mexico City is built over ancient Aztec Tenochtitlan.' },
  { numeric: '320', code: 'GT', name: 'Guatemala', capital: 'Guatemala City', region: 'Central', funFact: 'The birthplace of Mayan culture and home to Tikal, one of the grandest ancient Mesoamerican cities.' },
  { numeric: '084', code: 'BZ', name: 'Belize', capital: 'Belmopan', region: 'Central', funFact: 'Features the Belize Barrier Reef and the Great Blue Hole, a giant marine sinkhole over 300 meters across.' },
  { numeric: '222', code: 'SV', name: 'El Salvador', capital: 'San Salvador', region: 'Central', funFact: 'Known as the "Land of Volcanoes" with over 20 active volcanoes, and the smallest mainland American nation.' },
  { numeric: '340', code: 'HN', name: 'Honduras', capital: 'Tegucigalpa', region: 'Central', funFact: 'Home to the ancient Maya ruins of Copán, famous for its magnificent carved hieroglyphic stairway.' },
  { numeric: '558', code: 'NI', name: 'Nicaragua', capital: 'Managua', region: 'Central', funFact: 'Lake Nicaragua contains the world\'s only known freshwater-adapted oceanic bull sharks.' },
  { numeric: '188', code: 'CR', name: 'Costa Rica', capital: 'San José', region: 'Central', funFact: 'Houses roughly 5% of all global biodiversity despite covering only 0.03% of Earth\'s surface.' },
  { numeric: '591', code: 'PA', name: 'Panama', capital: 'Panama City', region: 'Central', funFact: 'The only place on Earth where you can see the sun rise over the Pacific and set over the Atlantic.' },
  { numeric: '192', code: 'CU', name: 'Cuba', capital: 'Havana', region: 'Caribbean', funFact: 'The largest island nation in the Caribbean, famed for vintage American automobiles and cigars.' },
  { numeric: '044', code: 'BS', name: 'Bahamas', capital: 'Nassau', region: 'Caribbean', funFact: 'An archipelago of over 700 islands and cays surrounded by some of the clearest turquoise waters on Earth.' },
  { numeric: '332', code: 'HT', name: 'Haiti', capital: 'Port-au-Prince', region: 'Caribbean', funFact: 'The first independent republic in Latin America and the Caribbean, founded following a successful 1804 revolution.' },
  { numeric: '214', code: 'DO', name: 'Dominican Republic', capital: 'Santo Domingo', region: 'Caribbean', funFact: 'Santo Domingo is the oldest permanent European settlement in the Americas (founded in 1496).' },
  { numeric: '388', code: 'JM', name: 'Jamaica', capital: 'Kingston', region: 'Caribbean', funFact: 'The birthplace of reggae music, Bob Marley, and the fastest sprinters in Olympic history.' },
  { numeric: '780', code: 'TT', name: 'Trinidad and Tobago', capital: 'Port of Spain', region: 'Caribbean', funFact: 'Invented the steelpan (steel drum), the only acoustic musical instrument developed in the 20th century.' },
  { numeric: '052', code: 'BB', name: 'Barbados', capital: 'Bridgetown', region: 'Caribbean', isMicrostate: true, funFact: 'The birthplace of rum (Mount Gay, established 1703) and megastar Rihanna, designated a National Hero.' },
  { numeric: '662', code: 'LC', name: 'Saint Lucia', capital: 'Castries', region: 'Caribbean', isMicrostate: true, funFact: 'The only sovereign country in the world named after an actual historical woman (Saint Lucy of Syracuse).' },
  { numeric: '670', code: 'VC', name: 'Saint Vincent and the Grenadines', capital: 'Kingstown', region: 'Caribbean', isMicrostate: true, funFact: 'Consists of 32 stunning volcanic islands and cays, famous for black and golden sand beaches.' },
  { numeric: '308', code: 'GD', name: 'Grenada', capital: 'St. George\'s', region: 'Caribbean', isMicrostate: true, funFact: 'Known as the "Island of Spice" for being one of the world\'s top producers of aromatic nutmeg and mace.' },
  { numeric: '028', code: 'AG', name: 'Antigua and Barbuda', capital: 'St. John\'s', region: 'Caribbean', isMicrostate: true, funFact: 'Boasts 365 distinct white and pink sandy beaches — famously one for every day of the year.' },
  { numeric: '212', code: 'DM', name: 'Dominica', capital: 'Roseau', region: 'Caribbean', isMicrostate: true, funFact: 'Known as the "Nature Isle of the Caribbean," home to the world\'s second-largest thermal boiling lake.' },
  { numeric: '659', code: 'KN', name: 'Saint Kitts and Nevis', capital: 'Basseterre', region: 'Caribbean', isMicrostate: true, funFact: 'The smallest sovereign state in the Americas, both in land area (261 km²) and population.' }
];

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature) {
    const filteredGeo = { ...geoFeature, geometry: filterNAGeometry(geoFeature.geometry) };
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

  // Dedicated accessible beacon polygon for microstates or tiny islands
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

export const NORTH_AMERICA_MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const NORTH_AMERICA_CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const NORTH_AMERICA_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/northAmericaData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/northAmericaData.ts with all 23 North American countries.`);
