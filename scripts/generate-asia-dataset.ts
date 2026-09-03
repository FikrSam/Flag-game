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

// Authentic Conic Equal Area projection for Asia
const projection = d3.geoConicEqualArea()
  .parallels([15, 45])
  .rotate([-85, 0])
  .center([0, 24])
  .scale(430)
  .translate([width / 2 - 30, height / 2 - 10]);

const pathGenerator = d3.geoPath().projection(projection);

// Surrounding context landmasses (Russia, Egypt, Greece, Bulgaria, Ukraine, Papua New Guinea)
const CONTEXT_NUMERICS = ['643', '818', '300', '100', '804', '598'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const d = pathGenerator(f);
  return d;
}).filter(Boolean);

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'AF': [66.0, 33.8],
  'AM': [44.8, 40.2],
  'AZ': [47.5, 40.3],
  'BH': [50.55, 26.0],
  'BD': [90.2, 23.8],
  'BT': [90.4, 27.5],
  'BN': [114.7, 4.5],
  'KH': [104.9, 12.5],
  'CN': [103.8, 35.5],
  'CY': [33.2, 35.1],
  'GE': [43.5, 42.0],
  'IN': [79.0, 22.0],
  'ID': [118.0, -2.5],
  'IR': [53.5, 32.5],
  'IQ': [43.8, 33.2],
  'IL': [35.0, 31.5],
  'JP': [138.0, 36.5],
  'JO': [36.5, 31.2],
  'KZ': [67.0, 48.0],
  'KW': [47.5, 29.3],
  'KG': [74.5, 41.3],
  'LA': [102.5, 19.5],
  'LB': [35.8, 33.9],
  'MY': [102.0, 4.0],
  'MV': [73.5, 3.2],
  'MN': [103.5, 46.8],
  'MM': [96.0, 21.0],
  'NP': [84.0, 28.3],
  'KP': [127.2, 40.0],
  'OM': [57.0, 21.5],
  'PK': [69.5, 30.0],
  'PS': [35.2, 31.9],
  'PH': [122.0, 13.0],
  'QA': [51.2, 25.3],
  'SA': [45.0, 24.0],
  'SG': [103.8, 1.35],
  'KR': [127.8, 36.0],
  'LK': [80.7, 7.8],
  'SY': [38.5, 35.0],
  'TW': [121.0, 23.7],
  'TJ': [71.0, 38.8],
  'TH': [101.0, 15.5],
  'TL': [125.7, -8.8],
  'TR': [35.0, 39.0],
  'TM': [59.5, 39.0],
  'AE': [54.0, 24.0],
  'UZ': [64.5, 41.5],
  'VN': [106.0, 16.0],
  'YE': [48.0, 15.5]
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
  { numeric: '004', code: 'AF', name: 'Afghanistan', capital: 'Kabul', region: 'Central', funFact: 'The historic crossroads of the Silk Road; lapis lazuli gemstones have been mined here for over 6,000 years.' },
  { numeric: '051', code: 'AM', name: 'Armenia', capital: 'Yerevan', region: 'Western', funFact: 'The first country in the world to officially adopt Christianity as its state religion in 301 AD.' },
  { numeric: '031', code: 'AZ', name: 'Azerbaijan', capital: 'Baku', region: 'Western', funFact: 'Known as the "Land of Fire"; home to Yanar Dag, a natural gas fire that has blazed continuously for centuries.' },
  { numeric: '048', code: 'BH', name: 'Bahrain', capital: 'Manama', region: 'Middle East', isMicrostate: true, funFact: 'An archipelago celebrated for its ancient Dilmun civilization and historic 4,000-year pearl diving trade.' },
  { numeric: '050', code: 'BD', name: 'Bangladesh', capital: 'Dhaka', region: 'South', funFact: 'Home to the Sundarbans, the world\'s largest mangrove forest, inhabited by endangered Royal Bengal tigers.' },
  { numeric: '064', code: 'BT', name: 'Bhutan', capital: 'Thimphu', region: 'South', funFact: 'The only carbon-negative nation on Earth; measures national success via "Gross National Happiness" rather than GDP.' },
  { numeric: '096', code: 'BN', name: 'Brunei', capital: 'Bandar Seri Begawan', region: 'Southeast', funFact: 'Houses Istana Nurul Iman, the world\'s largest residential palace with 1,788 rooms and 257 bathrooms.' },
  { numeric: '116', code: 'KH', name: 'Cambodia', capital: 'Phnom Penh', region: 'Southeast', funFact: 'Features Angkor Wat, the largest religious monument in the world, spanning over 162 hectares.' },
  { numeric: '156', code: 'CN', name: 'China', capital: 'Beijing', region: 'East', funFact: 'Birthplace of papermaking, the compass, gunpowder, and printing (the Four Great Inventions).' },
  { numeric: '196', code: 'CY', name: 'Cyprus', capital: 'Nicosia', region: 'Western', funFact: 'According to classical mythology, Cyprus is the birthplace of Aphrodite, the ancient Greek goddess of love.' },
  { numeric: '268', code: 'GE', name: 'Georgia', capital: 'Tbilisi', region: 'Western', funFact: 'The cradle of winemaking; archaeological evidence proves continuous wine production for over 8,000 years.' },
  { numeric: '356', code: 'IN', name: 'India', capital: 'New Delhi', region: 'South', funFact: 'The world\'s most populous nation, birthplace of chess, yoga, ayurveda, and the mathematical concept of zero.' },
  { numeric: '360', code: 'ID', name: 'Indonesia', capital: 'Jakarta', region: 'Southeast', funFact: 'The world\'s largest island nation (over 17,500 islands) and only habitat of the prehistoric Komodo dragon.' },
  { numeric: '364', code: 'IR', name: 'Iran', capital: 'Tehran', region: 'Middle East', funFact: 'Heartland of ancient Persia, famed for world-renowned Persian rugs, saffron, and Persepolis architecture.' },
  { numeric: '368', code: 'IQ', name: 'Iraq', capital: 'Baghdad', region: 'Middle East', funFact: 'Ancient Mesopotamia ("the Cradle of Civilization"), where writing (cuneiform) and the wheel originated.' },
  { numeric: '376', code: 'IL', name: 'Israel', capital: 'Jerusalem', region: 'Middle East', funFact: 'Has the lowest point on dry land on Earth (Dead Sea shore, 430m below sea level) and highest tech startups per capita.' },
  { numeric: '392', code: 'JP', name: 'Japan', capital: 'Tokyo', region: 'East', funFact: 'Comprises 6,852 islands; home to the world\'s oldest continuous hereditary monarchy, dating back over 2,600 years.' },
  { numeric: '400', code: 'JO', name: 'Jordan', capital: 'Amman', region: 'Middle East', funFact: 'Home to the ancient Nabataean rock-carved city of Petra, one of the New Seven Wonders of the World.' },
  { numeric: '398', code: 'KZ', name: 'Kazakhstan', capital: 'Astana', region: 'Central', funFact: 'The world\'s largest landlocked country by area, home to Baikonur Cosmodrome, where Yuri Gagarin entered space.' },
  { numeric: '414', code: 'KW', name: 'Kuwait', capital: 'Kuwait City', region: 'Middle East', funFact: 'The Kuwaiti Dinar is consistently the highest-valued sovereign currency unit in the world.' },
  { numeric: '417', code: 'KG', name: 'Kyrgyzstan', capital: 'Bishkek', region: 'Central', funFact: 'Contains Issyk-Kul, the world\'s second-largest alpine lake, which never freezes despite high Tian Shan elevation.' },
  { numeric: '418', code: 'LA', name: 'Laos', capital: 'Vientiane', region: 'Southeast', funFact: 'The only landlocked country in Southeast Asia, traversed by the mighty Mekong River and lush karst mountains.' },
  { numeric: '422', code: 'LB', name: 'Lebanon', capital: 'Beirut', region: 'Middle East', funFact: 'Home to ancient Phoenician port cities Byblos and Tyre, and the historic Cedars of God forest.' },
  { numeric: '458', code: 'MY', name: 'Malaysia', capital: 'Kuala Lumpur', region: 'Southeast', funFact: 'Home to the Petronas Towers (tallest twin towers in the world) and Taman Negara, a 130-million-year-old rainforest.' },
  { numeric: '462', code: 'MV', name: 'Maldives', capital: 'Malé', region: 'South', isMicrostate: true, funFact: 'The lowest and flattest country on Earth, with an average natural ground elevation of just 1.5 meters above sea level.' },
  { numeric: '496', code: 'MN', name: 'Mongolia', capital: 'Ulaanbaatar', region: 'East', funFact: 'The most sparsely populated sovereign state in the world, famous for nomadic traditions and horse culture.' },
  { numeric: '104', code: 'MM', name: 'Myanmar', capital: 'Naypyidaw', region: 'Southeast', funFact: 'The plains of Bagan contain more than 2,000 ancient Buddhist temples and pagodas built between the 9th and 13th centuries.' },
  { numeric: '524', code: 'NP', name: 'Nepal', capital: 'Kathmandu', region: 'South', funFact: 'Home to Mount Everest (8,848m) and 8 of the world\'s 10 tallest peaks; only nation with a non-quadrilateral flag.' },
  { numeric: '408', code: 'KP', name: 'North Korea', capital: 'Pyongyang', region: 'East', funFact: 'Contains the Rungrado 1st of May Stadium in Pyongyang, the largest operational stadium by seating capacity on Earth.' },
  { numeric: '512', code: 'OM', name: 'Oman', capital: 'Muscat', region: 'Middle East', funFact: 'The oldest continuously independent state in the Arab world, historic trading capital of frankincense.' },
  { numeric: '586', code: 'PK', name: 'Pakistan', capital: 'Islamabad', region: 'South', funFact: 'Contains K2 (world\'s second-highest peak) and manufactures over 70% of all hand-stitched soccer balls globally.' },
  { numeric: '275', code: 'PS', name: 'Palestine', capital: 'Ramallah', region: 'Middle East', funFact: 'Home to Jericho, widely recognized by archaeologists as one of the oldest continuously inhabited cities in the world.' },
  { numeric: '608', code: 'PH', name: 'Philippines', capital: 'Manila', region: 'Southeast', funFact: 'An archipelago of 7,641 islands; the world\'s leading producer of coconuts and the global texting capital.' },
  { numeric: '634', code: 'QA', name: 'Qatar', capital: 'Doha', region: 'Middle East', funFact: 'Surrounded by the Persian Gulf, Qatar successfully hosted the 2022 FIFA World Cup, the first in the Arab world.' },
  { numeric: '682', code: 'SA', name: 'Saudi Arabia', capital: 'Riyadh', region: 'Middle East', funFact: 'Contains the Rub\' al Khali (Empty Quarter), the world\'s largest contiguous sand desert, and Islamic holy cities Mecca and Medina.' },
  { numeric: '702', code: 'SG', name: 'Singapore', capital: 'Singapore', region: 'Southeast', isMicrostate: true, funFact: 'A global garden city-state with one of the world\'s busiest seaports and highest life expectancies.' },
  { numeric: '410', code: 'KR', name: 'South Korea', capital: 'Seoul', region: 'East', funFact: 'Global powerhouse of culture, robotics, high-speed rail, semiconductor fabrication, and internet connectivity.' },
  { numeric: '144', code: 'LK', name: 'Sri Lanka', capital: 'Colombo', region: 'South', funFact: 'Known as the "Pearl of the Indian Ocean," famous for world-class Ceylon tea and ancient Sigiriya rock fortress.' },
  { numeric: '760', code: 'SY', name: 'Syria', capital: 'Damascus', region: 'Middle East', funFact: 'Damascus is one of the oldest continuously inhabited cities in recorded human history (over 11,000 years).' },
  { numeric: '158', code: 'TW', name: 'Taiwan', capital: 'Taipei', region: 'East', funFact: 'Produces over 60% of the world\'s semiconductors and over 90% of the most advanced microchips.' },
  { numeric: '762', code: 'TJ', name: 'Tajikistan', capital: 'Dushanbe', region: 'Central', funFact: 'More than 90% of the country is covered by majestic mountains; home to the breathtaking Pamir Highway.' },
  { numeric: '764', code: 'TH', name: 'Thailand', capital: 'Bangkok', region: 'Southeast', funFact: 'The only country in Southeast Asia that was never colonized by European powers; known as the "Land of Smiles."' },
  { numeric: '626', code: 'TL', name: 'Timor-Leste', capital: 'Dili', region: 'Southeast', funFact: 'Asia\'s newest nation (restored sovereignty in 2002); surrounding reefs have the highest marine biodiversity on Earth.' },
  { numeric: '792', code: 'TR', name: 'Turkey', capital: 'Ankara', region: 'Western', funFact: 'Straddles two continents across the Bosphorus strait; Istanbul is the only metropolis in the world on two continents.' },
  { numeric: '795', code: 'TM', name: 'Turkmenistan', capital: 'Ashgabat', region: 'Central', funFact: 'Home to the "Gates of Hell" (Darvaza gas crater), a fiery natural gas crater burning continuously since 1971.' },
  { numeric: '784', code: 'AE', name: 'United Arab Emirates', capital: 'Abu Dhabi', region: 'Middle East', funFact: 'Home to the Burj Khalifa in Dubai, the tallest building and freestanding structure in the world (828 meters).' },
  { numeric: '860', code: 'UZ', name: 'Uzbekistan', capital: 'Tashkent', region: 'Central', funFact: 'A doubly landlocked country featuring legendary Silk Road oasis cities Samarkand, Bukhara, and Khiva.' },
  { numeric: '704', code: 'VN', name: 'Vietnam', capital: 'Hanoi', region: 'Southeast', funFact: 'Home to Son Doong, the largest cave on Earth by volume, possessing its own subterranean jungle and weather system.' },
  { numeric: '887', code: 'YE', name: 'Yemen', capital: 'Sana\'a', region: 'Middle East', funFact: 'Home to Shibam, dubbed the "Manhattan of the Desert," featuring 16th-century multi-story high-rise mudbrick towers.' }
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

  // Dedicated accessible beacon polygon for microstates or tiny island states
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

export const ASIA_MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const ASIA_CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const ASIA_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/asiaData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/asiaData.ts with all 49 Asian countries.`);
