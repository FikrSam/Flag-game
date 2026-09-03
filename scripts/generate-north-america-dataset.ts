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

// Standard Mercator projection centered on North America & Caribbean
const projection = d3.geoMercator()
  .center([-96, 42])
  .scale(320)
  .translate([width / 2, height / 2 + 10]);

const pathGenerator = d3.geoPath().projection(projection);

function filterNorthAmericaGeometry(geometry: any) {
  if (!geometry) return null;
  if (geometry.type === 'Polygon') return geometry;
  if (geometry.type === 'MultiPolygon') {
    const validPolys = geometry.coordinates.filter((poly: any) => {
      const pts = poly[0];
      const avgLon = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
      const avgLat = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
      // Exclude eastern hemisphere Aleutians (crossing 180°) and extreme arctic above 75°N
      return avgLat >= 5 && avgLat <= 75 && avgLon >= -175 && avgLon <= -50;
    });
    if (validPolys.length === 0) return null;
    return {
      type: 'MultiPolygon',
      coordinates: validPolys
    };
  }
  return geometry;
}

// Surrounding context landmasses (Northern South America, Greenland)
const CONTEXT_NUMERICS = ['170', '862', '304', '254', '534', '531'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const filtered = { ...f, geometry: filterNorthAmericaGeometry(f.geometry) };
  return pathGenerator(filtered);
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
  { numeric: '124', code: 'CA', name: 'Canada', capital: 'Ottawa', region: 'Northern America', funFact: 'Has the longest coastline in the world (over 202,080 km) and more lakes than all other countries combined.' },
  { numeric: '840', code: 'US', name: 'United States', capital: 'Washington, D.C.', region: 'Northern America', funFact: 'Home to 63 National Parks and the world’s longest cave system, Mammoth Cave in Kentucky.' },
  { numeric: '484', code: 'MX', name: 'Mexico', capital: 'Mexico City', region: 'Central America', funFact: 'Introduced chocolate, chili, and corn to the world; home to the ancient Mayan pyramid of Chichen Itza.' },
  { numeric: '320', code: 'GT', name: 'Guatemala', capital: 'Guatemala City', region: 'Central America', funFact: 'Heartland of the ancient Maya civilization, famous for the magnificent jungle temples of Tikal.' },
  { numeric: '084', code: 'BZ', name: 'Belize', capital: 'Belmopan', region: 'Central America', funFact: 'Home to the Great Blue Hole and the second-largest coral barrier reef system on Earth.' },
  { numeric: '222', code: 'SV', name: 'El Salvador', capital: 'San Salvador', region: 'Central America', funFact: 'Known as the "Land of Volcanoes," it is the smallest and most densely populated Central American country.' },
  { numeric: '340', code: 'HN', name: 'Honduras', capital: 'Tegucigalpa', region: 'Central America', funFact: 'First country to establish a designated national dolphin reserve and home to ancient Copán ruins.' },
  { numeric: '558', code: 'NI', name: 'Nicaragua', capital: 'Managua', region: 'Central America', funFact: 'Features Lake Nicaragua, Central America’s largest lake, home to rare freshwater bull sharks.' },
  { numeric: '188', code: 'CR', name: 'Costa Rica', capital: 'San José', region: 'Central America', funFact: 'Contains ~5% of Earth\'s total biodiversity while holding no standing military army since 1948.' },
  { numeric: '591', code: 'PA', name: 'Panama', capital: 'Panama City', region: 'Central America', funFact: 'The only place on Earth where you can see the sun rise over the Pacific and set over the Atlantic.' },
  { numeric: '192', code: 'CU', name: 'Cuba', capital: 'Havana', region: 'Caribbean', funFact: 'The largest island in the Caribbean, famed for vintage American automobiles and UNESCO biosphere reserves.' },
  { numeric: '388', code: 'JM', name: 'Jamaica', capital: 'Kingston', region: 'Caribbean', funFact: 'The birthplace of Reggae music and home to the majestic mist-covered Blue Mountains.' },
  { numeric: '332', code: 'HT', name: 'Haiti', capital: 'Port-au-Prince', region: 'Caribbean', funFact: 'The world\'s first independent Black-led republic, established in 1804 after a successful revolution.' },
  { numeric: '214', code: 'DO', name: 'Dominican Republic', capital: 'Santo Domingo', region: 'Caribbean', funFact: 'Home to Pico Duarte (the Caribbean’s highest peak) and the oldest European city in the Americas.' },
  { numeric: '044', code: 'BS', name: 'Bahamas', capital: 'Nassau', region: 'Caribbean', funFact: 'An archipelago of over 700 islands and cays known for crystal-clear turquoise waters and swimming pigs.' },
  { numeric: '780', code: 'TT', name: 'Trinidad and Tobago', capital: 'Port of Spain', region: 'Caribbean', funFact: 'Birthplace of the steelpan (the only acoustic instrument invented in the 20th century) and Calypso.' },
  { numeric: '052', code: 'BB', name: 'Barbados', capital: 'Bridgetown', region: 'Caribbean', funFact: 'The easternmost Caribbean island, legendary birthplace of rum and global icon Rihanna.', isMicrostate: true },
  { numeric: '662', code: 'LC', name: 'Saint Lucia', capital: 'Castries', region: 'Caribbean', funFact: 'Famed for the dramatic volcanic Gros Piton and Petit Piton spires rising straight from the sea.', isMicrostate: true },
  { numeric: '670', code: 'VC', name: 'Saint Vincent and the Grenadines', capital: 'Kingstown', region: 'Caribbean', funFact: 'Comprises 32 tropical islands, including active stratovolcano La Soufrière.', isMicrostate: true },
  { numeric: '308', code: 'GD', name: 'Grenada', capital: "St. George's", region: 'Caribbean', funFact: 'Known as the "Spice Isle" for being one of the world\'s largest exporters of nutmeg and mace.', isMicrostate: true },
  { numeric: '028', code: 'AG', name: 'Antigua and Barbuda', capital: "St. John's", region: 'Caribbean', funFact: 'Boasts 365 distinct pristine beaches — famously "one for every single day of the year."', isMicrostate: true },
  { numeric: '212', code: 'DM', name: 'Dominica', capital: 'Roseau', region: 'Caribbean', funFact: 'Known as the "Nature Isle of the Caribbean," home to Boiling Lake and lush rainforest reserves.', isMicrostate: true },
  { numeric: '659', code: 'KN', name: 'Saint Kitts and Nevis', capital: 'Basseterre', region: 'Caribbean', funFact: 'The smallest sovereign nation in the Western Hemisphere, both in land area and population.', isMicrostate: true }
];

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'CA': [-100, 56],
  'US': [-98, 38.5],
  'MX': [-102, 23.5],
  'GT': [-90.2, 15.5],
  'BZ': [-88.7, 17.2],
  'SV': [-88.9, 13.8],
  'HN': [-86.5, 14.8],
  'NI': [-85.2, 12.8],
  'CR': [-84.1, 9.8],
  'PA': [-80.5, 8.5],
  'CU': [-79.5, 22.0],
  'JM': [-77.3, 18.1],
  'HT': [-72.5, 19.0],
  'DO': [-70.5, 19.0],
  'BS': [-76.5, 24.5],
  'TT': [-61.3, 10.5],
  'BB': [-59.5, 13.2],
  'LC': [-61.0, 13.9],
  'VC': [-61.2, 13.25],
  'GD': [-61.7, 12.1],
  'AG': [-61.8, 17.1],
  'DM': [-61.35, 15.4],
  'KN': [-62.7, 17.3]
};

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature) {
    const filteredGeo = { ...geoFeature, geometry: filterNorthAmericaGeometry(geoFeature.geometry) };
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

  // Small island beacon support
  if (cDef.isMicrostate) {
    const r = 9;
    if (!pathD || bbox.width < 10 || bbox.height < 10) {
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

export const NORTH_AMERICA_MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const NORTH_AMERICA_CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const NORTH_AMERICA_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/northAmericaData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/northAmericaData.ts with all ${resultCountries.length} North American nations.`);
