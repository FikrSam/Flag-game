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

// Standard Mercator projection: 0 skew, 0 shear, straight horizontal parallels & vertical meridians
const projection = d3.geoMercator()
  .center([18, 2])
  .scale(400)
  .translate([width / 2 - 10, height / 2 - 15]);

const pathGenerator = d3.geoPath().projection(projection);

// Filter out distant subantarctic islands (e.g. Prince Edward Islands in South Africa at lat -47)
function filterAfricanGeometry(geometry: any) {
  if (!geometry) return null;
  if (geometry.type === 'Polygon') return geometry;
  if (geometry.type === 'MultiPolygon') {
    const validPolys = geometry.coordinates.filter((poly: any) => {
      const pts = poly[0];
      const avgLon = pts.reduce((s: number, p: number[]) => s + p[0], 0) / pts.length;
      const avgLat = pts.reduce((s: number, p: number[]) => s + p[1], 0) / pts.length;
      return avgLat >= -36 && avgLat <= 38 && avgLon >= -26 && avgLon <= 58;
    });
    if (validPolys.length === 0) return null;
    return {
      type: 'MultiPolygon',
      coordinates: validPolys
    };
  }
  return geometry;
}

// Surrounding context landmasses (Europe, Middle East)
const CONTEXT_NUMERICS = ['792', '682', '887', '760', '376', '400', '724', '620', '250', '380', '300'];
const contextLandFeatures = countriesGeo.filter((f: any) => CONTEXT_NUMERICS.includes(f.id));
const contextLandPaths = contextLandFeatures.map((f: any) => {
  const filtered = { ...f, geometry: filterAfricanGeometry(f.geometry) };
  const d = pathGenerator(filtered);
  return d;
}).filter(Boolean);

// Microstate specific lat/longs
const MICROSTATE_COORDS: Record<string, [number, number]> = {
  'CV': [-23.6, 15.1],
  'ST': [6.6, 0.3],
  'SC': [55.5, -4.7],
  'MU': [57.5, -20.3],
  'KM': [43.3, -11.6],
  'SZ': [31.5, -26.5],
  'LS': [28.2, -29.6],
  'DJ': [42.6, 11.8],
  'GM': [-15.3, 13.4],
  'RW': [29.9, -1.9],
  'BI': [29.9, -3.4],
  'GQ': [10.0, 1.8],
  'SL': [-11.8, 8.5]
};

const CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'EG': [30.0, 26.5],
  'ZA': [24.5, -29.0],
  'SO': [46.0, 5.0],
  'DZ': [2.8, 28.0],
  'LY': [17.5, 26.5],
  'CD': [23.5, -2.5],
  'AO': [17.5, -12.5],
  'MZ': [35.0, -18.5],
  'MG': [47.0, -19.0],
  'MA': [-6.0, 32.0]
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
  { numeric: '012', code: 'DZ', name: 'Algeria', capital: 'Algiers', region: 'Northern', funFact: 'The largest country in Africa and home to vast expanses of the Sahara Desert.' },
  { numeric: '024', code: 'AO', name: 'Angola', capital: 'Luanda', region: 'Southern', funFact: 'Home to the giant sable antelope and spectacular Kalandula Falls.' },
  { numeric: '204', code: 'BJ', name: 'Benin', capital: 'Porto-Novo', region: 'Western', funFact: 'Birthplace of the Vodun (Voodoo) religion and historical Kingdom of Dahomey.' },
  { numeric: '072', code: 'BW', name: 'Botswana', capital: 'Gaborone', region: 'Southern', funFact: 'Contains the Okavango Delta, one of the world\'s premier wildlife sanctuaries.' },
  { numeric: '854', code: 'BF', name: 'Burkina Faso', capital: 'Ouagadougou', region: 'Western', funFact: 'Known as the "Land of Upright People", famous for FESPACO film festival.' },
  { numeric: '108', code: 'BI', name: 'Burundi', capital: 'Gitega', region: 'Eastern', funFact: 'Renowned for the sacred Royal Drummers of Burundi.' },
  { numeric: '132', code: 'CV', name: 'Cabo Verde', capital: 'Praia', region: 'Microstate', funFact: 'An archipelago nation famous for Morna music and legendary singer Cesária Évora.' },
  { numeric: '120', code: 'CM', name: 'Cameroon', capital: 'Yaoundé', region: 'Central', funFact: 'Often called "Africa in miniature" due to its rich cultural and geographical diversity.' },
  { numeric: '140', code: 'CF', name: 'Central African Republic', capital: 'Bangui', region: 'Central', funFact: 'Contains Dzanga-Sangha National Park, famous for forest elephants and lowland gorillas.' },
  { numeric: '148', code: 'TD', name: 'Chad', capital: 'N\'Djamena', region: 'Central', funFact: 'Home to Lake Chad and the dramatic rock arches of the Ennedi Plateau.' },
  { numeric: '174', code: 'KM', name: 'Comoros', capital: 'Moroni', region: 'Microstate', funFact: 'Known as the "Perfume Islands" for producing fragrant ylang-ylang oil.' },
  { numeric: '180', code: 'CD', name: 'DR Congo', capital: 'Kinshasa', region: 'Central', funFact: 'Home to the Congo Basin, the second largest tropical rainforest on Earth.' },
  { numeric: '178', code: 'CG', name: 'Republic of the Congo', capital: 'Brazzaville', region: 'Central', funFact: 'Known for the colorful and elegant La Sape fashion subculture.' },
  { numeric: '384', code: 'CI', name: 'Côte d\'Ivoire', capital: 'Yamoussoukro', region: 'Western', funFact: 'The world\'s leading producer and exporter of cocoa beans.' },
  { numeric: '262', code: 'DJ', name: 'Djibouti', capital: 'Djibouti', region: 'Eastern', funFact: 'Lake Assal in Djibouti is the lowest point in Africa and saltiest lake outside Antarctica.' },
  { numeric: '818', code: 'EG', name: 'Egypt', capital: 'Cairo', region: 'Northern', funFact: 'Home to the ancient Pyramids of Giza and the historic Nile River valley.' },
  { numeric: '226', code: 'GQ', name: 'Equatorial Guinea', capital: 'Malabo', region: 'Central', funFact: 'The only sovereign country in Africa with Spanish as an official national language.' },
  { numeric: '232', code: 'ER', name: 'Eritrea', capital: 'Asmara', region: 'Eastern', funFact: 'Asmara is famous for its remarkably preserved modernist Italian architecture.' },
  { numeric: '748', code: 'SZ', name: 'Eswatini', capital: 'Mbabane', region: 'Southern', funFact: 'One of the world\'s last remaining absolute monarchies, known for Reed Dance ceremonies.' },
  { numeric: '231', code: 'ET', name: 'Ethiopia', capital: 'Addis Ababa', region: 'Eastern', funFact: 'The ancient birthplace of coffee, with its unique Ge\'ez calendar and script.' },
  { numeric: '266', code: 'GA', name: 'Gabon', capital: 'Libreville', region: 'Central', funFact: 'Over 85% covered by pristine rainforest, dedicated to national conservation parks.' },
  { numeric: '270', code: 'GM', name: 'Gambia', capital: 'Banjul', region: 'Western', funFact: 'The smallest country in mainland Africa, stretching along the banks of the Gambia River.' },
  { numeric: '288', code: 'GH', name: 'Ghana', capital: 'Accra', region: 'Western', funFact: 'The first sub-Saharan African nation to gain independence from colonial rule (1957).' },
  { numeric: '324', code: 'GN', name: 'Guinea', capital: 'Conakry', region: 'Western', funFact: 'Holds the world\'s largest bauxite reserves and headwaters of the Niger River.' },
  { numeric: '624', code: 'GW', name: 'Guinea-Bissau', capital: 'Bissau', region: 'Western', funFact: 'Includes the pristine Bijagós archipelago, a UNESCO Biosphere Reserve.' },
  { numeric: '404', code: 'KE', name: 'Kenya', capital: 'Nairobi', region: 'Eastern', funFact: 'Renowned for the Maasai Mara Great Migration and world-champion distance runners.' },
  { numeric: '426', code: 'LS', name: 'Lesotho', capital: 'Maseru', region: 'Southern', funFact: 'The "Kingdom in the Sky" — the only independent state entirely above 1,400 meters altitude.' },
  { numeric: '430', code: 'LR', name: 'Liberia', capital: 'Monrovia', region: 'Western', funFact: 'Africa\'s oldest modern republic, founded in 1847 by freed African Americans.' },
  { numeric: '434', code: 'LY', name: 'Libya', capital: 'Tripoli', region: 'Northern', funFact: 'Features majestic Roman ruins at Leptis Magna on the Mediterranean coast.' },
  { numeric: '450', code: 'MG', name: 'Madagascar', capital: 'Antananarivo', region: 'Eastern', funFact: 'Over 90% of its wildlife, including lemurs and baobabs, is found nowhere else on Earth.' },
  { numeric: '454', code: 'MW', name: 'Malawi', capital: 'Lilongwe', region: 'Eastern', funFact: 'Known as the "Warm Heart of Africa", home to massive freshwater Lake Malawi.' },
  { numeric: '466', code: 'ML', name: 'Mali', capital: 'Bamako', region: 'Western', funFact: 'Historic home of Timbuktu, ancient manuscripts, and legendary ruler Mansa Musa.' },
  { numeric: '478', code: 'MR', name: 'Mauritania', capital: 'Nouakchott', region: 'Western', funFact: 'Contains the "Eye of the Sahara" (Richat Structure), visible from space.' },
  { numeric: '480', code: 'MU', name: 'Mauritius', capital: 'Port Louis', region: 'Microstate', funFact: 'Tropical volcanic island in the Indian Ocean, formerly the only home of the dodo bird.' },
  { numeric: '504', code: 'MA', name: 'Morocco', capital: 'Rabat', region: 'Northern', funFact: 'Home to the University of al-Qarawiyyin in Fez (859 AD), the oldest university in the world.' },
  { numeric: '508', code: 'MZ', name: 'Mozambique', capital: 'Maputo', region: 'Eastern', funFact: 'Has over 2,500 km of Indian Ocean coastline with coral reefs and whale sharks.' },
  { numeric: '516', code: 'NA', name: 'Namibia', capital: 'Windhoek', region: 'Southern', funFact: 'Home to the Namib Desert, the oldest desert in the world, with giant red dunes at Sossusvlei.' },
  { numeric: '562', code: 'NE', name: 'Niger', capital: 'Niamey', region: 'Western', funFact: 'Home to the historic mudbrick Agadez Mosque and the ancient cross-Saharan trade routes.' },
  { numeric: '566', code: 'NG', name: 'Nigeria', capital: 'Abuja', region: 'Western', funFact: 'The most populous nation in Africa and powerhouse of Nollywood cinema and Afrobeats music.' },
  { numeric: '646', code: 'RW', name: 'Rwanda', capital: 'Kigali', region: 'Eastern', funFact: 'Known as the "Land of a Thousand Hills", famous for mountain gorilla conservation.' },
  { numeric: '678', code: 'ST', name: 'São Tomé and Príncipe', capital: 'São Tomé', region: 'Microstate', funFact: 'The second smallest African state, famous for organic cocoa and dramatic volcanic peaks.' },
  { numeric: '686', code: 'SN', name: 'Senegal', capital: 'Dakar', region: 'Western', funFact: 'Home to the historic Island of Gorée and the famous pink waters of Lake Retba.' },
  { numeric: '690', code: 'SC', name: 'Seychelles', capital: 'Victoria', region: 'Microstate', funFact: 'An archipelago of 115 islands with giant Aldabra tortoises and the Coco de Mer palm.' },
  { numeric: '694', code: 'SL', name: 'Sierra Leone', capital: 'Freetown', region: 'Western', funFact: 'Freetown was established in 1792 as a haven for liberated slaves.' },
  { numeric: '706', code: 'SO', name: 'Somalia', capital: 'Mogadishu', region: 'Eastern', funFact: 'Has the longest coastline on mainland Africa along the Gulf of Aden and Indian Ocean.' },
  { numeric: '710', code: 'ZA', name: 'South Africa', capital: 'Pretoria', region: 'Southern', funFact: 'The "Rainbow Nation" with 11 official languages, Table Mountain, and Kruger National Park.' },
  { numeric: '728', code: 'SS', name: 'South Sudan', capital: 'Juba', region: 'Eastern', funFact: 'The world\'s newest recognized sovereign nation, gaining independence in 2011.' },
  { numeric: '729', code: 'SD', name: 'Sudan', capital: 'Khartoum', region: 'Northern', funFact: 'Has more ancient Nubian pyramids (over 200 at Meroë) than Egypt.' },
  { numeric: '834', code: 'TZ', name: 'Tanzania', capital: 'Dodoma', region: 'Eastern', funFact: 'Home to Mount Kilimanjaro (highest peak in Africa), the Serengeti, and spice island Zanzibar.' },
  { numeric: '768', code: 'TG', name: 'Togo', capital: 'Lomé', region: 'Western', funFact: 'Lomé is famous for its vibrant Grand Marché and traditional handicrafts.' },
  { numeric: '788', code: 'TN', name: 'Tunisia', capital: 'Tunis', region: 'Northern', funFact: 'Site of ancient Carthage and the iconic blue-and-white clifftop town of Sidi Bou Said.' },
  { numeric: '800', code: 'UG', name: 'Uganda', capital: 'Kampala', region: 'Eastern', funFact: 'Dubbed the "Pearl of Africa" by Winston Churchill for its lush equatorial landscapes.' },
  { numeric: '894', code: 'ZM', name: 'Zambia', capital: 'Lusaka', region: 'Eastern', funFact: 'Shares Victoria Falls ("The Smoke that Thunders"), the world\'s largest waterfall curtain.' },
  { numeric: '716', code: 'ZW', name: 'Zimbabwe', capital: 'Harare', region: 'Southern', funFact: 'Named after Great Zimbabwe, the medieval stone city built without mortar.' }
];

const resultCountries: any[] = [];

for (const cDef of COUNTRY_DEFINITIONS) {
  const geoFeature = countriesGeo.find((f: any) => f.id === cDef.numeric);
  let pathD = '';
  let centroid: [number, number] = [0, 0];
  let bbox = { x: 0, y: 0, width: 100, height: 100 };

  if (geoFeature) {
    const filteredGeo = { ...geoFeature, geometry: filterAfricanGeometry(geoFeature.geometry) };
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

  // Microstate target dot
  const isMicrostate = cDef.region === 'Microstate' || ['SZ', 'LS', 'DJ', 'GM', 'RW', 'BI', 'GQ', 'SL'].includes(cDef.code);
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

const fileContent = `import type { CountryData } from '../types/game';
export type { CountryData };

export const AFRICA_MAP_CONFIG = {
  viewBox: "0 0 1000 800",
  width: 1000,
  height: 800,
};

export const AFRICA_CONTEXT_LAND_PATHS: string[] = ${JSON.stringify(contextLandPaths, null, 2)};

export const AFRICA_COUNTRIES: CountryData[] = ${JSON.stringify(resultCountries, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/africaData.ts'), fileContent, 'utf8');
console.log(`Successfully generated src/data/africaData.ts with accurate bounds.`);
