export interface Continent {
  id: string;
  name: string;
  icon: string;
  countryCount: number;
  status: 'playable' | 'coming_soon';
  tagline: string;
  silhouetteColor: string;
  buttonClass: string;
}

export const CONTINENTS: Continent[] = [
  {
    id: 'africa',
    name: 'Africa',
    icon: '🌍',
    countryCount: 54,
    status: 'playable',
    tagline: 'From the Atlas to the Cape',
    silhouetteColor: '#f59e0b',
    buttonClass: 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold shadow-md shadow-amber-950/40'
  },
  {
    id: 'europe',
    name: 'Europe',
    icon: '🇪🇺',
    countryCount: 44,
    status: 'playable',
    tagline: 'Reykjavík to the Urals',
    silhouetteColor: '#38bdf8',
    buttonClass: 'bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold shadow-md shadow-sky-950/40'
  },
  {
    id: 'south_america',
    name: 'South America',
    icon: '🌎',
    countryCount: 12,
    status: 'playable',
    tagline: 'The Andes and the Amazon',
    silhouetteColor: '#10b981',
    buttonClass: 'bg-[#059669] hover:bg-[#047857] text-white font-bold shadow-md shadow-emerald-950/40'
  },
  {
    id: 'asia',
    name: 'Asia',
    icon: '🌏',
    countryCount: 49,
    status: 'coming_soon',
    tagline: 'The Levant to the Pacific',
    silhouetteColor: '#24344d',
    buttonClass: 'bg-[#121929] border border-slate-800/60 text-slate-500 font-medium cursor-not-allowed opacity-60'
  },
  {
    id: 'north_america',
    name: 'North America',
    icon: '🌎',
    countryCount: 23,
    status: 'coming_soon',
    tagline: 'The Arctic to the Isthmus',
    silhouetteColor: '#24344d',
    buttonClass: 'bg-[#121929] border border-slate-800/60 text-slate-500 font-medium cursor-not-allowed opacity-60'
  },
  {
    id: 'oceania',
    name: 'Oceania',
    icon: '🏝️',
    countryCount: 14,
    status: 'coming_soon',
    tagline: 'Across the South Pacific',
    silhouetteColor: '#24344d',
    buttonClass: 'bg-[#121929] border border-slate-800/60 text-slate-500 font-medium cursor-not-allowed opacity-60'
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    icon: '❄️',
    countryCount: 0,
    status: 'coming_soon',
    tagline: 'The one with no flags',
    silhouetteColor: '#24344d',
    buttonClass: 'bg-[#121929] border border-slate-800/60 text-slate-500 font-medium cursor-not-allowed opacity-60'
  }
];
