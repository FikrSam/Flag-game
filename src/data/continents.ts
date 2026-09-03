export interface Continent {
  id: string;
  name: string;
  countryCount: number;
  status: 'playable' | 'coming_soon';
  description: string;
}

export const CONTINENTS: Continent[] = [
  {
    id: 'europe',
    name: 'Europe',
    countryCount: 44,
    status: 'playable',
    description: '44 countries • Includes 6 microstates'
  },
  {
    id: 'africa',
    name: 'Africa',
    countryCount: 54,
    status: 'playable',
    description: '54 countries • Continental & island nations'
  },
  {
    id: 'south_america',
    name: 'South America',
    countryCount: 12,
    status: 'playable',
    description: '12 countries • Andes, Amazon & Patagonia'
  },
  {
    id: 'asia',
    name: 'Asia',
    countryCount: 49,
    status: 'playable',
    description: '49 countries • Silk Road, Steppes & Archipelagos'
  },
  {
    id: 'north_america',
    name: 'North America',
    countryCount: 23,
    status: 'playable',
    description: '23 countries • Great Lakes, Maya & Caribbean'
  },
  {
    id: 'oceania',
    name: 'Oceania',
    countryCount: 14,
    status: 'playable',
    description: '14 countries • Coral atolls, Outback & Polynesia'
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    countryCount: 0,
    status: 'coming_soon',
    description: 'No sovereign territories'
  }
];

