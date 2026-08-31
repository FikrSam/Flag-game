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

// Standard Mercator projection: un-skewed, flat horizontal parallels & vertical meridians
const projection = d3.geoMercator()
  .center([-60, -22])
  .scale(550)
  .translate([width / 2, height / 2 - 10]);

const pathGenerator = d3.geoPath().projection(projection);

// Filter out distant overseas islands (e.g. Easter Island for Chile at -109°W, Galápagos at -90°W)
function filterSouthAmericaGeometry(geometry: any) {
  if (!geometry) return null;
  if (geometry.type === 'Polygon') return geometry;
  if (geometry.type === 'MultiPolygon') {
    const validPolys = geometry.coordinates.filter((poly: any) => {
      const pts = poly[0];
      const avgLon = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
      const avgLat = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
      return avgLat >= -56 && avgLat <= 15 && avgLon >= -82 && avgLon <= -34;
    });
    if (validPolys.length === 0) return null;
    return {
      type: 'MultiPolygon',
      coordinates: validPolys
    };
  }
  return geometry;
}

// Surrounding context landmasses (Central America, Caribbean, Falklands)
const CONTEXT_NUMERICS = ['591', '188', '558', '780', '192', '214', '332', '388', '250', '238', '084'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const d = pathGenerator(f);
  return d;
}).filter(Boolean);

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'AR': [-64.0, -35.0],
  'BO': [-64.5, -16.5],
  'BR': [-53.0, -10.0],
  'CL': [-71.0, -33.5],
  'CO': [-73.0, 4.0],
  'EC': [-78.5, -1.5],
  'GY': [-59.0, 5.0],
  'PY': [-58.0, -23.5],
  'PE': [-75.0, -9.5],
  'SR': [-56.0, 4.0],
  'UY': [-56.0, -32.5],
  'VE': [-66.0, 7.5]
};

interface CountryDef {
  numeric: string;
  code: string;
  name: string;
  capital: string;
  region: string;
  funFact: string;
}

const COUNTRY_DEFINITIONS: CountryDef[] = [
  { numeric: '032', code: 'AR', name: 'Argentina', capital: 'Buenos Aires', region: 'Southern Cone', funFact: 'Home to the magnificent Iguazú Falls, Mount Aconcagua, and the birthplace of the tango dance.' },
  { numeric: '068', code: 'BO', name: 'Bolivia', capital: 'Sucre', region: 'Andean', funFact: 'Contains the Salar de Uyuni, the world\'s largest salt flat, which acts as a giant mirror when flooded.' },
  { numeric: '076', code: 'BR', name: 'Brazil', capital: 'Brasília', region: 'Eastern', funFact: 'The largest country in South America, home to 60% of the Amazon rainforest and legendary Carnival.' },
  { numeric: '152', code: 'CL', name: 'Chile', capital: 'Santiago', region: 'Southern Cone', funFact: 'The longest north-south country in the world (over 4,300 km), featuring the hyper-arid Atacama Desert.' },
  { numeric: '170', code: 'CO', name: 'Colombia', capital: 'Bogotá', region: 'Northern', funFact: 'The only country in South America with coastlines on both the Pacific Ocean and Caribbean Sea.' },
  { numeric: '218', code: 'EC', name: 'Ecuador', capital: 'Quito', region: 'Andean', funFact: 'Named after the Equator line; Mount Chimborazo\'s summit is the closest point on Earth to the Sun.' },
  { numeric: '328', code: 'GY', name: 'Guyana', capital: 'Georgetown', region: 'Guianas', funFact: 'The only English-speaking sovereign nation in South America, home to spectacular Kaieteur Falls.' },
  { numeric: '600', code: 'PY', name: 'Paraguay', capital: 'Asunción', region: 'Southern Cone', funFact: 'Over 90% of the population speaks indigenous Guaraní alongside Spanish, both official languages.' },
  { numeric: '604', code: 'PE', name: 'Peru', capital: 'Lima', region: 'Andean', funFact: 'Heartland of the ancient Inca Empire, famous for the iconic 15th-century mountain citadel Machu Picchu.' },
  { numeric: '740', code: 'SR', name: 'Suriname', capital: 'Paramaribo', region: 'Guianas', funFact: 'The smallest independent country in South America, with Dutch as its official language and ~93% forest cover.' },
  { numeric: '858', code: 'UY', name: 'Uruguay', capital: 'Montevideo', region: 'Southern Cone', funFact: 'Hosted and won the very first FIFA World Cup in 1930; generates over 95% of its electricity from renewables.' },
  { numeric: '862', code: 'VE', name: 'Venezuela', capital: 'Caracas', region: 'Northern', funFact: 'Home to Angel Falls, the world\'s highest uninterrupted waterfall plunging 979 meters from a tabletop mountain.' }
];

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature) {
    const filteredGeo = { ...geoFeature, geometry: filterSouthAmericaGeometry(geoFeature.geometry) };
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

  // Read SVG content from public/flags
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
    isMicrostate: false
  });
}

const fileContent = `import type { CountryData } from '../types/game';
export type { CountryData };

export const SOUTH_AMERICA_MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const SOUTH_AMERICA_CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const SOUTH_AMERICA_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/southAmericaData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/southAmericaData.ts with all 12 South American countries.`);
