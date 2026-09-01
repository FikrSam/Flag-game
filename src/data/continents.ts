export interface Continent {
  id: string;
  name: string;
  icon: string;
  countryCount: number;
  status: 'playable' | 'coming_soon';
  tagline: string;
  detail: string;
  difficulty?: string;
  silhouetteColor: string;
  accentGlow: string;
  buttonGradient: string;
}

export const CONTINENTS: Continent[] = [
  {
    id: 'europe',
    name: 'Europe',
    icon: '🇪🇺',
    countryCount: 44,
    status: 'playable',
    tagline: 'From Reykjavík to the Caucasus',
    detail: '44 Sovereign Nations • 6 Microstates',
    difficulty: 'Moderate',
    silhouetteColor: '#38bdf8',
    accentGlow: 'from-sky-500/10 via-sky-500/5 to-transparent',
    buttonGradient: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-sky-950/60'
  },
  {
    id: 'africa',
    name: 'Africa',
    icon: '🌍',
    countryCount: 54,
    status: 'playable',
    tagline: 'From the Mediterranean to Cape Agulhas',
    detail: '54 Sovereign Nations • 6 Island States',
    difficulty: 'Challenging',
    silhouetteColor: '#f59e0b',
    accentGlow: 'from-amber-500/10 via-amber-500/5 to-transparent',
    buttonGradient: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-lg shadow-amber-950/60'
  },
  {
    id: 'south_america',
    name: 'South America',
    icon: '🌎',
    countryCount: 12,
    status: 'playable',
    tagline: 'The Andes, Patagonia & the Amazon Basin',
    detail: '12 Sovereign Nations • Fast Paced',
    difficulty: 'Quick Drill',
    silhouetteColor: '#10b981',
    accentGlow: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    buttonGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/60'
  },
  {
    id: 'asia',
    name: 'Asia',
    icon: '🌏',
    countryCount: 49,
    status: 'coming_soon',
    tagline: 'The Levant across Siberia to the Pacific',
    detail: '49 Nations in development',
    silhouetteColor: '#24344d',
    accentGlow: 'from-slate-800/10 to-transparent',
    buttonGradient: 'bg-[#101726] border border-slate-800/80 text-slate-500 font-medium cursor-not-allowed opacity-60'
  },
  {
    id: 'north_america',
    name: 'North America',
    icon: '🌎',
    countryCount: 23,
    status: 'coming_soon',
    tagline: 'The High Arctic to the Panama Isthmus',
    detail: '23 Nations & Caribbean Archipelago',
    silhouetteColor: '#24344d',
    accentGlow: 'from-slate-800/10 to-transparent',
    buttonGradient: 'bg-[#101726] border border-slate-800/80 text-slate-500 font-medium cursor-not-allowed opacity-60'
  },
  {
    id: 'oceania',
    name: 'Oceania',
    icon: '🏝️',
    countryCount: 14,
    status: 'coming_soon',
    tagline: 'Polynesia, Micronesia & Melanesia',
    detail: '14 Nations across the Pacific',
    silhouetteColor: '#24344d',
    accentGlow: 'from-slate-800/10 to-transparent',
    buttonGradient: 'bg-[#101726] border border-slate-800/80 text-slate-500 font-medium cursor-not-allowed opacity-60'
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    icon: '❄️',
    countryCount: 0,
    status: 'coming_soon',
    tagline: 'The Southern Ocean & Ice Sheets',
    detail: 'Scientific Research Stations Only',
    silhouetteColor: '#24344d',
    accentGlow: 'from-slate-800/10 to-transparent',
    buttonGradient: 'bg-[#101726] border border-slate-800/80 text-slate-500 font-medium cursor-not-allowed opacity-60'
  }
];
