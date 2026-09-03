import type { CountryData } from '../types/game';

export interface MapConfig {
  viewBox: string;
  width: number;
  height: number;
}

export interface ContinentGamePackage {
  id: string;
  name: string;
  countries: CountryData[];
  contextLandPaths: string[];
  mapConfig: MapConfig;
}

// In-memory cache so once a continent dataset is downloaded, subsequent switches are instantaneous
const continentCache = new Map<string, ContinentGamePackage>();

export function getCachedContinentData(continentId: string): ContinentGamePackage | undefined {
  return continentCache.get(continentId);
}

export function preloadContinentData(continentId: string): Promise<ContinentGamePackage> {
  return loadContinentData(continentId);
}

export async function loadContinentData(continentId: string): Promise<ContinentGamePackage> {
  if (continentCache.has(continentId)) {
    return continentCache.get(continentId)!;
  }

  let pkg: ContinentGamePackage;

  switch (continentId) {
    case 'africa': {
      const m = await import('./africaData');
      pkg = {
        id: 'africa',
        name: 'Africa',
        countries: m.AFRICA_COUNTRIES,
        contextLandPaths: m.AFRICA_CONTEXT_LAND_PATHS,
        mapConfig: m.AFRICA_MAP_CONFIG
      };
      break;
    }
    case 'south_america': {
      const m = await import('./southAmericaData');
      pkg = {
        id: 'south_america',
        name: 'South America',
        countries: m.SOUTH_AMERICA_COUNTRIES,
        contextLandPaths: m.SOUTH_AMERICA_CONTEXT_LAND_PATHS,
        mapConfig: m.SOUTH_AMERICA_MAP_CONFIG
      };
      break;
    }
    case 'north_america': {
      const m = await import('./northAmericaData');
      pkg = {
        id: 'north_america',
        name: 'North America',
        countries: m.NORTH_AMERICA_COUNTRIES,
        contextLandPaths: m.NORTH_AMERICA_CONTEXT_LAND_PATHS,
        mapConfig: m.NORTH_AMERICA_MAP_CONFIG
      };
      break;
    }
    case 'oceania': {
      const m = await import('./oceaniaData');
      pkg = {
        id: 'oceania',
        name: 'Oceania',
        countries: m.OCEANIA_COUNTRIES,
        contextLandPaths: m.OCEANIA_CONTEXT_LAND_PATHS,
        mapConfig: m.OCEANIA_MAP_CONFIG
      };
      break;
    }
    case 'asia': {
      const m = await import('./asiaData');
      pkg = {
        id: 'asia',
        name: 'Asia',
        countries: m.ASIA_COUNTRIES,
        contextLandPaths: m.ASIA_CONTEXT_LAND_PATHS,
        mapConfig: m.ASIA_MAP_CONFIG
      };
      break;
    }
    case 'europe':
    default: {
      const m = await import('./europeData');
      pkg = {
        id: 'europe',
        name: 'Europe',
        countries: m.EUROPE_COUNTRIES,
        contextLandPaths: m.CONTEXT_LAND_PATHS,
        mapConfig: m.MAP_CONFIG
      };
      break;
    }
  }

  continentCache.set(continentId, pkg);
  return pkg;
}
