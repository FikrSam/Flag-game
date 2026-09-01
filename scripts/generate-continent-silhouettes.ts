import * as topojson from 'topojson-client';
import * as d3 from 'd3-geo';
import fs from 'fs';
import path from 'path';

const worldData = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const countries = (topojson.feature(worldData, worldData.objects.countries) as any).features;

const CONTINENT_SPECS: Record<string, { center: [number, number], scale: number, latMin?: number, latMax?: number, lonMin?: number, lonMax?: number }> = {
  africa: {
    center: [20, 2],
    scale: 130,
    latMin: -36, latMax: 38, lonMin: -20, lonMax: 55
  },
  europe: {
    center: [15, 54],
    scale: 155,
    latMin: 34, latMax: 72, lonMin: -25, lonMax: 45
  },
  south_america: {
    center: [-60, -22],
    scale: 120,
    latMin: -56, latMax: 15, lonMin: -85, lonMax: -30
  },
  asia: {
    center: [90, 32],
    scale: 70,
    latMin: -10, latMax: 75, lonMin: 40, lonMax: 150
  },
  north_america: {
    center: [-98, 48],
    scale: 70,
    latMin: 10, latMax: 75, lonMin: -168, lonMax: -50
  },
  oceania: {
    center: [140, -25],
    scale: 100,
    latMin: -48, latMax: 0, lonMin: 110, lonMax: 180
  },
  antarctica: {
    center: [0, -90],
    scale: 85
  }
};

const width = 200;
const height = 140;

const results: Record<string, string> = {};

for (const [key, spec] of Object.entries(CONTINENT_SPECS)) {
  let projection: d3.GeoProjection;
  if (key === 'antarctica') {
    projection = d3.geoAzimuthalEquidistant()
      .center(spec.center)
      .scale(spec.scale)
      .translate([width / 2, height / 2]);
  } else {
    projection = d3.geoMercator()
      .center(spec.center)
      .scale(spec.scale)
      .translate([width / 2, height / 2]);
  }

  const pathGen = d3.geoPath().projection(projection);

  const matchingFeatures = countries.filter((f: any) => {
    if (key === 'antarctica') return f.id === '010';
    if (!f.geometry) return false;
    const c = d3.geoCentroid(f);
    if (!c) return false;
    const [lon, lat] = c;
    if (spec.latMin !== undefined && (lat < spec.latMin || lat > (spec.latMax || 90))) return false;
    if (spec.lonMin !== undefined && (lon < spec.lonMin || lon > (spec.lonMax || 180))) return false;
    return true;
  });

  const combinedPath = matchingFeatures.map((f: any) => pathGen(f)).filter(Boolean).join(' ');
  results[key] = combinedPath;
}

const fileContent = `export const CONTINENT_SILHOUETTES: Record<string, string> = ${JSON.stringify(results, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/continentSilhouettes.ts'), fileContent, 'utf8');
console.log('Successfully generated src/data/continentSilhouettes.ts');
