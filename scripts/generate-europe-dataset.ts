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

// High accuracy conic equal area projection tailored for Europe with 13°E central meridian (0 tilt)
const projection = d3.geoConicEqualArea()
  .center([13, 53])
  .rotate([-13, 0])
  .parallels([35, 65])
  .scale(1050)
  .translate([width / 2 + 20, height / 2 + 30]);

const pathGenerator = d3.geoPath().projection(projection);

// Filter out overseas territories and distant oceanic islands (e.g. French Guiana, Réunion, Azores, Svalbard)
// Keeps European mainland, British Isles, Iceland, and Mediterranean islands.
function filterEuropeanGeometry(geometry: any, countryCode?: string) {
  if (!geometry) return null;

  const isEuropeanPoint = (lon: number, lat: number) => {
    // Iceland check
    if (countryCode === 'IS' || (lon >= -25 && lon <= -12 && lat >= 63 && lat <= 67)) {
      return true;
    }
    // General European bounds (excluding Azores / Greenland / Svalbard / Overseas)
    return lon >= -11 && lon <= 45 && lat >= 34 && lat <= 72;
  };

  if (geometry.type === 'Polygon') {
    const pts = geometry.coordinates[0];
    const avgLon = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
    const avgLat = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
    if (isEuropeanPoint(avgLon, avgLat)) {
      return geometry;
    }
    return null;
  }

  if (geometry.type === 'MultiPolygon') {
    const validPolys = geometry.coordinates.filter((poly: any) => {
      const pts = poly[0];
      const avgLon = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
      const avgLat = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
      return isEuropeanPoint(avgLon, avgLat);
    });
    if (validPolys.length === 0) return null;
    return {
      type: 'MultiPolygon',
      coordinates: validPolys
    };
  }

  return geometry;
}

// Microstate specific lat/longs
const MICROSTATE_COORDS: Record<string, [number, number]> = {
  'AD': [1.52, 42.50],
  'MC': [7.42, 43.73],
  'SM': [12.45, 43.93],
  'VA': [12.45, 41.90],
  'LI': [9.52, 47.16],
  'MT': [14.45, 35.90],
  'LU': [6.13, 49.61],
  'CY': [33.38, 35.18]
};

// Natural Earth centroids for countries with non-contiguous territories
const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'FR': [2.6, 46.8],
  'GR': [22.4, 38.6],
  'NO': [9.0, 61.0],
  'IT': [12.8, 42.6],
  'ES': [-3.6, 40.2],
  'GB': [-1.5, 53.0],
  'DK': [9.8, 55.8],
  'HR': [16.2, 45.2],
  'UA': [31.5, 49.0],
  'SE': [15.0, 61.5],
  'FI': [26.0, 63.5],
  'PT': [-8.2, 39.6],
  'TR': [33.0, 39.0]
};

interface CountryDef {
  numeric: string;
  code: string;
  name: string;
  capital: string;
  region: 'Western' | 'Northern' | 'Eastern' | 'Southern' | 'Microstate';
  funFact: string;
}

const COUNTRY_DEFINITIONS: CountryDef[] = [
  { numeric: '008', code: 'AL', name: 'Albania', capital: 'Tirana', region: 'Southern', funFact: 'Albania has more than 173,000 concrete bunkers built across the countryside.' },
  { numeric: '020', code: 'AD', name: 'Andorra', capital: 'Andorra la Vella', region: 'Microstate', funFact: 'Andorra is the only co-principality in the world, jointly headed by the Bishop of Urgell and France\'s President.' },
  { numeric: '040', code: 'AT', name: 'Austria', capital: 'Vienna', region: 'Western', funFact: 'Austria is home to Tiergarten Schönbrunn (1752), the world\'s oldest continuously operating zoo.' },
  { numeric: '112', code: 'BY', name: 'Belarus', capital: 'Minsk', region: 'Eastern', funFact: 'Contains Belovezhskaya Pushcha, Europe\'s largest ancient primeval forest with wild bison.' },
  { numeric: '056', code: 'BE', name: 'Belgium', capital: 'Brussels', region: 'Western', funFact: 'Belgium produces over 220,000 tons of chocolate per year and invented the French fry.' },
  { numeric: '070', code: 'BA', name: 'Bosnia and Herzegovina', capital: 'Sarajevo', region: 'Southern', funFact: 'Sarajevo was the first city in Europe to operate a regular, full-day electric tram service (1885).' },
  { numeric: '100', code: 'BG', name: 'Bulgaria', capital: 'Sofia', region: 'Eastern', funFact: 'Bulgaria supplies approximately 70% of the world\'s natural rose oil for high-end perfumery.' },
  { numeric: '191', code: 'HR', name: 'Croatia', capital: 'Zagreb', region: 'Southern', funFact: 'Croatia is the homeland of the Dalmatian dog breed and invented the necktie (cravat).' },
  { numeric: '196', code: 'CY', name: 'Cyprus', capital: 'Nicosia', region: 'Southern', funFact: 'According to mythology, Cyprus is the birthplace of the Greek goddess Aphrodite.' },
  { numeric: '203', code: 'CZ', name: 'Czechia', capital: 'Prague', region: 'Eastern', funFact: 'Czechia has the world\'s highest beer consumption per capita and hundreds of historic castles.' },
  { numeric: '208', code: 'DK', name: 'Denmark', capital: 'Copenhagen', region: 'Northern', funFact: 'Denmark is the birthplace of LEGO and its flag is the oldest continuously used national flag.' },
  { numeric: '233', code: 'EE', name: 'Estonia', capital: 'Tallinn', region: 'Northern', funFact: 'More than 99% of state services are digitized; Estonia pioneered internet voting worldwide.' },
  { numeric: '246', code: 'FI', name: 'Finland', capital: 'Helsinki', region: 'Northern', funFact: 'Finland has over 3 million saunas and is consistently ranked the happiest country in the world.' },
  { numeric: '250', code: 'FR', name: 'France', capital: 'Paris', region: 'Western', funFact: 'France is the most visited tourist destination on Earth and produces over 1,000 types of cheese.' },
  { numeric: '276', code: 'DE', name: 'Germany', capital: 'Berlin', region: 'Western', funFact: 'Germany has more than 20,000 castles and over 1,500 distinct kinds of sausages.' },
  { numeric: '300', code: 'GR', name: 'Greece', capital: 'Athens', region: 'Southern', funFact: 'Birthplace of Western philosophy, the Olympic Games, democracy, and political science.' },
  { numeric: '348', code: 'HU', name: 'Hungary', capital: 'Budapest', region: 'Eastern', funFact: 'Hungarians invented the Rubik\'s Cube, the ballpoint pen (Bíró), and the hologram.' },
  { numeric: '352', code: 'IS', name: 'Iceland', capital: 'Reykjavik', region: 'Northern', funFact: 'Iceland is 100% powered by renewable energy, has active volcanoes, and zero mosquitoes.' },
  { numeric: '372', code: 'IE', name: 'Ireland', capital: 'Dublin', region: 'Western', funFact: 'The Emerald Isle has no wild native snakes and gave the world Halloween.' },
  { numeric: '380', code: 'IT', name: 'Italy', capital: 'Rome', region: 'Southern', funFact: 'Italy boasts 59 UNESCO World Heritage Sites — more than any other country on the planet.' },
  { numeric: '428', code: 'LV', name: 'Latvia', capital: 'Riga', region: 'Northern', funFact: 'Riga features the world\'s highest concentration of magnificent Art Nouveau architecture.' },
  { numeric: '438', code: 'LI', name: 'Liechtenstein', capital: 'Vaduz', region: 'Microstate', funFact: 'Liechtenstein is a doubly landlocked Alpine nation and world leader in dental prosthetics.' },
  { numeric: '440', code: 'LT', name: 'Lithuania', capital: 'Vilnius', region: 'Northern', funFact: 'Lithuanian is one of the oldest surviving Indo-European languages, closely linked to Sanskrit.' },
  { numeric: '442', code: 'LU', name: 'Luxembourg', capital: 'Luxembourg City', region: 'Western', funFact: 'Luxembourg was the first country in the world to make all public transit 100% free of charge.' },
  { numeric: '470', code: 'MT', name: 'Malta', capital: 'Valletta', region: 'Southern', funFact: 'Malta\'s prehistoric Megalithic Temples are older than both Stonehenge and the Pyramids.' },
  { numeric: '498', code: 'MD', name: 'Moldova', capital: 'Chisinau', region: 'Eastern', funFact: 'Moldova contains Mileștii Mici, the world\'s largest wine cellar with over 2 million bottles.' },
  { numeric: '492', code: 'MC', name: 'Monaco', capital: 'Monaco', region: 'Microstate', funFact: 'Monaco is the second-smallest sovereign state in the world and host of the Grand Prix.' },
  { numeric: '499', code: 'ME', name: 'Montenegro', capital: 'Podgorica', region: 'Southern', funFact: 'Home to the Tara River Canyon, the longest and deepest river gorge in all of Europe.' },
  { numeric: '528', code: 'NL', name: 'Netherlands', capital: 'Amsterdam', region: 'Western', funFact: 'The Netherlands has roughly 23 million bicycles for a population of 18 million residents.' },
  { numeric: '807', code: 'MK', name: 'North Macedonia', capital: 'Skopje', region: 'Southern', funFact: 'Lake Ohrid in North Macedonia is one of Europe\'s deepest and oldest lakes.' },
  { numeric: '578', code: 'NO', name: 'Norway', capital: 'Oslo', region: 'Northern', funFact: 'Norway invented modern snow skiing, is home to the midnight sun, and awards the Nobel Peace Prize.' },
  { numeric: '616', code: 'PL', name: 'Poland', capital: 'Warsaw', region: 'Eastern', funFact: 'Wieliczka Salt Mine near Krakow features full underground chapels and statues.' },
  { numeric: '620', code: 'PT', name: 'Portugal', capital: 'Lisbon', region: 'Southern', funFact: 'Portugal is Europe\'s oldest nation-state with identical borders since 1297.' },
  { numeric: '642', code: 'RO', name: 'Romania', capital: 'Bucharest', region: 'Eastern', funFact: 'Romania is home to Europe\'s largest population of brown bears and legendary Bran Castle.' },
  { numeric: '674', code: 'SM', name: 'San Marino', capital: 'San Marino', region: 'Microstate', funFact: 'Founded in 301 AD atop Mount Titano, San Marino is the oldest constitutional republic.' },
  { numeric: '688', code: 'RS', name: 'Serbia', capital: 'Belgrade', region: 'Southern', funFact: 'Serbia was the birthplace of 18 Roman emperors and world-changing inventor Nikola Tesla.' },
  { numeric: '703', code: 'SK', name: 'Slovakia', capital: 'Bratislava', region: 'Eastern', funFact: 'Slovakia has the highest density of medieval castles and châteaux per capita.' },
  { numeric: '705', code: 'SI', name: 'Slovenia', capital: 'Ljubljana', region: 'Southern', funFact: 'Over 60% of Slovenia is forested, and it is home to over 10,000 underground karst caves.' },
  { numeric: '724', code: 'ES', name: 'Spain', capital: 'Madrid', region: 'Southern', funFact: 'Spain produces over 40% of the world\'s olive oil and is home to Gaudi\'s Sagrada Família.' },
  { numeric: '752', code: 'SE', name: 'Sweden', capital: 'Stockholm', region: 'Northern', funFact: 'Sweden invented the safety match, zipper, dynamite (Alfred Nobel), and Spotify.' },
  { numeric: '756', code: 'CH', name: 'Switzerland', capital: 'Bern', region: 'Western', funFact: 'Switzerland has 4 national languages, 208 mountains over 3,000m, and the longest train tunnel.' },
  { numeric: '804', code: 'UA', name: 'Ukraine', capital: 'Kyiv', region: 'Eastern', funFact: 'Ukraine is the largest country entirely in Europe, renowned for its fertile golden grain fields.' },
  { numeric: '826', code: 'GB', name: 'United Kingdom', capital: 'London', region: 'Western', funFact: 'The UK is where modern football was codified, and the Industrial Revolution began.' },
  { numeric: '336', code: 'VA', name: 'Vatican City', capital: 'Vatican City', region: 'Microstate', funFact: 'The smallest independent state on Earth, home to St. Peter\'s Basilica and the Sistine Chapel.' }
];

// Extract background landmasses from Natural Earth
const CONTEXT_NUMERICS = ['792', '643', '504', '012', '788', '818', '760', '368', '364', '268', '051', '031', '398'];

const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const filtered = { ...f, geometry: filterEuropeanGeometry(f.geometry) };
  const d = pathGenerator(filtered);
  return d;
}).filter(Boolean);

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature) {
    const filteredGeo = { ...geoFeature, geometry: filterEuropeanGeometry(geoFeature.geometry, cDef.code) };
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
  if (MICROSTATE_COORDS[cDef.code]) {
    const projected = projection(MICROSTATE_COORDS[cDef.code]) || [0, 0];
    centroid = [Math.round(projected[0] * 10) / 10, Math.round(projected[1] * 10) / 10];
  } else if (CENTROID_OVERRIDES[cDef.code]) {
    const projected = projection(CENTROID_OVERRIDES[cDef.code]) || [0, 0];
    centroid = [Math.round(projected[0] * 10) / 10, Math.round(projected[1] * 10) / 10];
  } else if (geoFeature) {
    const c = d3.geoCentroid(geoFeature);
    const projected = projection(c) || [0, 0];
    centroid = [Math.round(projected[0] * 10) / 10, Math.round(projected[1] * 10) / 10];
  }

  // Dedicated accessible polygon for microstates
  const isMicrostate = cDef.region === 'Microstate';
  if (!pathD && isMicrostate) {
    const r = 9;
    pathD = `M ${centroid[0] - r} ${centroid[1]} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
    bbox = {
      x: Math.round(centroid[0] - r),
      y: Math.round(centroid[1] - r),
      width: r * 2,
      height: r * 2
    };
  }

  // Read raw SVG content from flag-icons
  const flagSvgPath = path.resolve(`node_modules/flag-icons/flags/4x3/${cDef.code.toLowerCase()}.svg`);
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

const fileContent = `// Sourced directly from Natural Earth 50m TopoJSON via D3-geo projection
import type { CountryData } from '../types/game';

export const MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const EUROPE_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};

export const REGIONS = ['All', 'Western', 'Northern', 'Eastern', 'Southern', 'Microstate'] as const;
export type RegionFilter = typeof REGIONS[number];
`;

fs.writeFileSync(path.resolve('src/data/europeData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/europeData.ts with ${resultCountries.length} countries.`);
