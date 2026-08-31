export interface Continent {
  id: string;
  name: string;
  icon: string;
  countryCount: number;
  status: 'playable' | 'coming_soon';
}

export const CONTINENTS: Continent[] = [
  { id: 'europe', name: 'Europe', icon: '🇪🇺', countryCount: 44, status: 'playable' },
  { id: 'africa', name: 'Africa', icon: '🌍', countryCount: 54, status: 'playable' },
  { id: 'asia', name: 'Asia', icon: '🌏', countryCount: 49, status: 'coming_soon' },
  { id: 'north_america', name: 'North America', icon: '🌎', countryCount: 23, status: 'coming_soon' },
  { id: 'south_america', name: 'South America', icon: '🌎', countryCount: 12, status: 'playable' },
  { id: 'oceania', name: 'Oceania', icon: '🏝️', countryCount: 14, status: 'coming_soon' },
  { id: 'antarctica', name: 'Antarctica', icon: '❄️', countryCount: 0, status: 'coming_soon' }
];
