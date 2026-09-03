import type { CountryData } from '../types/game';

export interface LoadedContinent {
  id: string;
  name: string;
  countries: CountryData[];
  contextLandPaths: string[];
  mapConfig: {
    viewBox: string;
    width: number;
    height: number;
  };
}

const continentCache = new Map<string, LoadedContinent>();

export function getCachedContinentData(continentId: string): LoadedContinent | null {
  return continentCache.get(continentId) || null;
}

export function setCachedContinentData(continentId: string, data: LoadedContinent): void {
  continentCache.set(continentId, data);
}

export async function loadContinentData(continentId: string): Promise<LoadedContinent> {
  if (continentCache.has(continentId)) {
    return continentCache.get(continentId)!;
  }

  let loaded: LoadedContinent;

  switch (continentId) {
    case 'africa': {
      const mod = await import('./africaData');
      loaded = {
        id: 'africa',
        name: 'Africa',
        countries: mod.AFRICA_COUNTRIES,
        contextLandPaths: mod.AFRICA_CONTEXT_LAND_PATHS,
        mapConfig: mod.AFRICA_MAP_CONFIG
      };
      break;
    }
    case 'south_america': {
      const mod = await import('./southAmericaData');
      loaded = {
        id: 'south_america',
        name: 'South America',
        countries: mod.SOUTH_AMERICA_COUNTRIES,
        contextLandPaths: mod.SOUTH_AMERICA_CONTEXT_LAND_PATHS,
        mapConfig: mod.SOUTH_AMERICA_MAP_CONFIG
      };
      break;
    }
    case 'north_america': {
      const mod = await import('./northAmericaData');
      loaded = {
        id: 'north_america',
        name: 'North America',
        countries: mod.NORTH_AMERICA_COUNTRIES,
        contextLandPaths: mod.NORTH_AMERICA_CONTEXT_LAND_PATHS,
        mapConfig: mod.NORTH_AMERICA_MAP_CONFIG
      };
      break;
    }
    case 'oceania': {
      const mod = await import('./oceaniaData');
      loaded = {
        id: 'oceania',
        name: 'Oceania',
        countries: mod.OCEANIA_COUNTRIES,
        contextLandPaths: mod.OCEANIA_CONTEXT_LAND_PATHS,
        mapConfig: mod.OCEANIA_MAP_CONFIG
      };
      break;
    }
    case 'asia': {
      const mod = await import('./asiaData');
      loaded = {
        id: 'asia',
        name: 'Asia',
        countries: mod.ASIA_COUNTRIES,
        contextLandPaths: mod.ASIA_CONTEXT_LAND_PATHS,
        mapConfig: mod.ASIA_MAP_CONFIG
      };
      break;
    }
    case 'europe':
    default: {
      const mod = await import('./europeData');
      loaded = {
        id: 'europe',
        name: 'Europe',
        countries: mod.EUROPE_COUNTRIES,
        contextLandPaths: mod.CONTEXT_LAND_PATHS,
        mapConfig: mod.MAP_CONFIG
      };
      break;
    }
  }

  continentCache.set(continentId, loaded);
  return loaded;
}
