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

// Standard Mercator projection centered on Asia
const projection = d3.geoMercator()
  .center([85, 25])
  .scale(240)
  .translate([width / 2, height / 2]);

const pathGenerator = d3.geoPath().projection(projection);

function filterAsiaGeometry(geometry: any) {
  if (!geometry) return null;
  return geometry;
}

// Surrounding context landmasses (Russia, Egypt, Sudan, Australia, Greece)
const CONTEXT_NUMERICS = ['643', '818', '729', '036', '300', '804', '642', '100'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  return pathGenerator(f);
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
  { numeric: '004', code: 'AF', name: 'Afghanistan', capital: 'Kabul', region: 'Central Asia', funFact: 'Known as the "Crossroads of Central Asia," famed for ancient lapis lazuli mines and the Hindu Kush peaks.' },
  { numeric: '051', code: 'AM', name: 'Armenia', capital: 'Yerevan', region: 'Western Asia', funFact: 'The first nation in the world to adopt Christianity as its official state religion (in 301 AD).' },
  { numeric: '031', code: 'AZ', name: 'Azerbaijan', capital: 'Baku', region: 'Western Asia', funFact: 'Known as the "Land of Fire" due to burning natural gas vents like Yanar Dag and ancient Zoroastrian fire temples.' },
  { numeric: '048', code: 'BH', name: 'Bahrain', capital: 'Manama', region: 'Western Asia', funFact: 'An archipelago of 50 natural islands in the Persian Gulf, historically famed for rare natural pearls.', isMicrostate: true },
  { numeric: '050', code: 'BD', name: 'Bangladesh', capital: 'Dhaka', region: 'South Asia', funFact: 'Home to the Sundarbans, the world’s largest mangrove forest, inhabited by the royal Bengal tiger.' },
  { numeric: '064', code: 'BT', name: 'Bhutan', capital: 'Thimphu', region: 'South Asia', funFact: 'The world\'s only carbon-negative country, measuring development via Gross National Happiness.' },
  { numeric: '096', code: 'BN', name: 'Brunei', capital: 'Bandar Seri Begawan', region: 'Southeast Asia', funFact: 'A wealthy sultanate on Borneo boasting pristine virgin rainforest and the floating village Kampong Ayer.', isMicrostate: true },
  { numeric: '116', code: 'KH', name: 'Cambodia', capital: 'Phnom Penh', region: 'Southeast Asia', funFact: 'Home to Angkor Wat, the largest religious religious monument complex ever constructed on Earth.' },
  { numeric: '156', code: 'CN', name: 'China', capital: 'Beijing', region: 'East Asia', funFact: 'Home to the Great Wall (over 21,000 km) and the Terracotta Army; the world’s longest continuous civilization.' },
  { numeric: '196', code: 'CY', name: 'Cyprus', capital: 'Nicosia', region: 'Western Asia', funFact: 'Legendary mythological birthplace of goddess Aphrodite, surrounded by crystal-clear Mediterranean waters.', isMicrostate: true },
  { numeric: '268', code: 'GE', name: 'Georgia', capital: 'Tbilisi', region: 'Western Asia', funFact: 'The cradle of winemaking, with continuous traditional clay "qvevri" wine production dating back 8,000 years.' },
  { numeric: '356', code: 'IN', name: 'India', capital: 'New Delhi', region: 'South Asia', funFact: 'The birthplace of four major world religions (Hinduism, Buddhism, Jainism, Sikhism) and yoga.' },
  { numeric: '360', code: 'ID', name: 'Indonesia', capital: 'Jakarta', region: 'Southeast Asia', funFact: 'The world\'s largest island nation, encompassing over 17,500 islands and the habitat of the Komodo dragon.' },
  { numeric: '364', code: 'IR', name: 'Iran', capital: 'Tehran', region: 'Western Asia', funFact: 'Heir to the ancient Persian Empire with 27 UNESCO World Heritage sites and legendary Persian gardens.' },
  { numeric: '368', code: 'IQ', name: 'Iraq', capital: 'Baghdad', region: 'Western Asia', funFact: 'Ancient Mesopotamia, widely regarded as the cradle of civilization where writing (cuneiform) was invented.' },
  { numeric: '376', code: 'IL', name: 'Israel', capital: 'Jerusalem', region: 'Western Asia', funFact: 'Home to the Dead Sea, the lowest land elevation on Earth (430 meters below sea level).' },
  { numeric: '392', code: 'JP', name: 'Japan', capital: 'Tokyo', region: 'East Asia', funFact: 'An archipelago of nearly 7,000 islands famed for Shinkansen bullet trains, Mount Fuji, and ancient temples.' },
  { numeric: '400', code: 'JO', name: 'Jordan', capital: 'Amman', region: 'Western Asia', funFact: 'Home to the world wonder of Petra, the rose-red desert city carved directly into sandstone cliffs.' },
  { numeric: '398', code: 'KZ', name: 'Kazakhstan', capital: 'Astana', region: 'Central Asia', funFact: 'The world’s largest landlocked nation, featuring the Baikonur Cosmodrome where space exploration began.' },
  { numeric: '414', code: 'KW', name: 'Kuwait', capital: 'Kuwait City', region: 'Western Asia', funFact: 'Holds approximately 6% of the world’s proven oil reserves and uses the world\'s highest-valued currency (KWD).' },
  { numeric: '417', code: 'KG', name: 'Kyrgyzstan', capital: 'Bishkek', region: 'Central Asia', funFact: 'Features the dramatic Tian Shan mountains and Lake Issyk-Kul, the world’s second-largest alpine lake.' },
  { numeric: '418', code: 'LA', name: 'Laos', capital: 'Vientiane', region: 'Southeast Asia', funFact: 'The only landlocked country in Southeast Asia, known as the "Land of a Million Elephants."' },
  { numeric: '422', code: 'LB', name: 'Lebanon', capital: 'Beirut', region: 'Western Asia', funFact: 'Famed for ancient cedar forests mentioned in the Epic of Gilgamesh, dating back thousands of years.', isMicrostate: true },
  { numeric: '458', code: 'MY', name: 'Malaysia', capital: 'Kuala Lumpur', region: 'Southeast Asia', funFact: 'Home to the iconic Petronas Twin Towers, ancient Taman Negara rainforests, and Mount Kinabalu.' },
  { numeric: '462', code: 'MV', name: 'Maldives', capital: 'Malé', region: 'South Asia', funFact: 'The world\'s lowest-lying nation (average 1.5m above sea level), consisting of 26 natural coral atolls.', isMicrostate: true },
  { numeric: '496', code: 'MN', name: 'Mongolia', capital: 'Ulaanbaatar', region: 'East Asia', funFact: 'The most sparsely populated sovereign country on Earth, famed for nomadic horse cultures and the Gobi Desert.' },
  { numeric: '104', code: 'MM', name: 'Myanmar', capital: 'Naypyidaw', region: 'Southeast Asia', funFact: 'Home to the plain of Bagan, featuring over 2,200 ancient Buddhist temples, pagodas, and stupas.' },
  { numeric: '524', code: 'NP', name: 'Nepal', capital: 'Kathmandu', region: 'South Asia', funFact: 'Home to 8 of the world\'s 10 highest peaks, including Mount Everest (8,848m), and the only non-rectangular flag.' },
  { numeric: '408', code: 'KP', name: 'North Korea', capital: 'Pyongyang', region: 'East Asia', funFact: 'Home to the volcanic Mount Paektu with its deep Heaven Lake caldera along the Chinese border.' },
  { numeric: '512', code: 'OM', name: 'Oman', capital: 'Muscat', region: 'Western Asia', funFact: 'The oldest continuously independent state in the Arab world, famed for frankincense groves and ancient forts.' },
  { numeric: '586', code: 'PK', name: 'Pakistan', capital: 'Islamabad', region: 'South Asia', funFact: 'Home to K2 (second-highest mountain on Earth) and the ancient Indus Valley civilization site Mohenjo-daro.' },
  { numeric: '275', code: 'PS', name: 'Palestine', capital: 'Ramallah', region: 'Western Asia', funFact: 'Contains Jericho, widely recognized as one of the oldest continuously inhabited cities in human history.', isMicrostate: true },
  { numeric: '608', code: 'PH', name: 'Philippines', capital: 'Manila', region: 'Southeast Asia', funFact: 'An archipelago of over 7,640 islands boasting the Chocolate Hills and the world-famous Puerto Princesa Underground River.' },
  { numeric: '634', code: 'QA', name: 'Qatar', capital: 'Doha', region: 'Western Asia', funFact: 'A peninsula jutting into the Persian Gulf, featuring futuristic architecture and the Museum of Islamic Art.', isMicrostate: true },
  { numeric: '682', code: 'SA', name: 'Saudi Arabia', capital: 'Riyadh', region: 'Western Asia', funFact: 'Home to the Rub\' al Khali (the world\'s largest contiguous sand desert) and the holy cities Mecca and Medina.' },
  { numeric: '702', code: 'SG', name: 'Singapore', capital: 'Singapore', region: 'Southeast Asia', funFact: 'A global garden city-state home to Gardens by the Bay, Changi Jewel waterfall, and one of the world\'s busiest ports.', isMicrostate: true },
  { numeric: '410', code: 'KR', name: 'South Korea', capital: 'Seoul', region: 'East Asia', funFact: 'Global powerhouse of technology, K-pop, and cinema; home to ancient Joseon dynasty palaces and Jeju Island.' },
  { numeric: '144', code: 'LK', name: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', region: 'South Asia', funFact: 'Known as the "Pearl of the Indian Ocean," famous for Ceylon tea, ancient Sigiriya rock fortress, and wildlife.' },
  { numeric: '760', code: 'SY', name: 'Syria', capital: 'Damascus', region: 'Western Asia', funFact: 'Damascus is one of the oldest continuously inhabited capitals in the world, once a premier Silk Road trading hub.' },
  { numeric: '158', code: 'TW', name: 'Taiwan', capital: 'Taipei', region: 'East Asia', funFact: 'Leading global center for advanced microchips, famed for Taipei 101, night markets, and Taroko Gorge.' },
  { numeric: '762', code: 'TJ', name: 'Tajikistan', capital: 'Dushanbe', region: 'Central Asia', funFact: 'Over 90% mountainous, home to the dramatic Pamir Highway known as the "Roof of the World."' },
  { numeric: '764', code: 'TH', name: 'Thailand', capital: 'Bangkok', region: 'Southeast Asia', funFact: 'The only Southeast Asian nation never colonized by European powers, famed for golden royal temples and cuisine.' },
  { numeric: '626', code: 'TL', name: 'Timor-Leste', capital: 'Dili', region: 'Southeast Asia', funFact: 'Asia\'s newest sovereign democracy (restored 2002), situated along biodiverse coral triangle waters.' },
  { numeric: '792', code: 'TR', name: 'Turkey', capital: 'Ankara', region: 'Western Asia', funFact: 'Straddles two continents across the Bosphorus Strait; home to ancient Troy, Hagia Sophia, and Cappadocia.' },
  { numeric: '795', code: 'TM', name: 'Turkmenistan', capital: 'Ashgabat', region: 'Central Asia', funFact: 'Home to the "Gates of Hell" (Darvaza crater), a natural gas crater burning continuously since 1971.' },
  { numeric: '784', code: 'AE', name: 'United Arab Emirates', capital: 'Abu Dhabi', region: 'Western Asia', funFact: 'Home to Burj Khalifa (the world\'s tallest structure at 828m) and iconic Palm Jumeirah islands.' },
  { numeric: '860', code: 'UZ', name: 'Uzbekistan', capital: 'Tashkent', region: 'Central Asia', funFact: 'Heartland of the Great Silk Road, renowned for turquoise-tiled madrasahs in Samarkand and Bukhara.' },
  { numeric: '704', code: 'VN', name: 'Vietnam', capital: 'Hanoi', region: 'Southeast Asia', funFact: 'Home to Ha Long Bay\'s emerald waters and limestone karst islands, plus Son Doong, the world’s largest cave.' },
  { numeric: '887', code: 'YE', name: 'Yemen', capital: "Sana'a", region: 'Western Asia', funFact: 'Home to Shibam, the 16th-century "Manhattan of the Desert" made of multi-story mudbrick skyscrapers.' }
];

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'CN': [104, 35],
  'IN': [79, 21],
  'JP': [138, 36],
  'ID': [118, -2],
  'PH': [122, 12],
  'MY': [102, 3.5],
  'VN': [108, 14],
  'TH': [100.5, 15],
  'SA': [45, 24],
  'IR': [53, 32],
  'TR': [35, 39],
  'KZ': [67, 48],
  'SG': [103.8, 1.35],
  'BH': [50.55, 26.0],
  'MV': [73.5, 3.2],
  'QA': [51.2, 25.3],
  'CY': [33.0, 35.0],
  'LB': [35.8, 33.9],
  'BN': [114.7, 4.5]
};

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature) {
    const filteredGeo = { ...geoFeature, geometry: filterAsiaGeometry(geoFeature.geometry) };
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

  // Microstate circular target support
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

export const ASIA_MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const ASIA_CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const ASIA_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/asiaData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/asiaData.ts with all ${resultCountries.length} Asian nations.`);
