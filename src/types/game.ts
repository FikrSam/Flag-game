export interface CountryData {
  id: string;
  numeric: string;
  name: string;
  capital: string;
  region: string;
  funFact: string;
  flagDataUri: string;
  path: string;
  centroid: [number, number];
  bbox: { x: number; y: number; width: number; height: number };
  isMicrostate: boolean;
}

