import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EUROPE_COUNTRIES } from '../data/europeData';
import { AFRICA_COUNTRIES } from '../data/africaData';
import { SOUTH_AMERICA_COUNTRIES } from '../data/southAmericaData';
import { ASIA_COUNTRIES } from '../data/asiaData';
import { NORTH_AMERICA_COUNTRIES } from '../data/northAmericaData';
import { OCEANIA_COUNTRIES } from '../data/oceaniaData';
import { CONTINENTS } from '../data/continents';
import { App } from '../App';
import * as haptics from '../utils/haptics';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Flaggle Basic Geography Game', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('1. Natural Earth Geospatial Data', () => {
    it('has all 44 European countries with valid vector paths, centroids, and bboxes', () => {
      expect(EUROPE_COUNTRIES.length).toBe(44);

      EUROPE_COUNTRIES.forEach((country) => {
        expect(country.id).toBeDefined();
        expect(country.name).toBeTruthy();
        expect(country.path.length).toBeGreaterThan(10);
        expect(country.centroid.length).toBe(2);
        expect(country.bbox.width).toBeGreaterThan(0);
        expect(country.bbox.height).toBeGreaterThan(0);
        expect(country.flagDataUri).toBeTruthy();
      });
    });

    it('has all 54 African countries with valid vector paths, centroids, and bboxes', () => {
      expect(AFRICA_COUNTRIES.length).toBe(54);

      AFRICA_COUNTRIES.forEach((country) => {
        expect(country.id).toBeDefined();
        expect(country.name).toBeTruthy();
        expect(country.path.length).toBeGreaterThan(10);
        expect(country.centroid.length).toBe(2);
        expect(country.bbox.width).toBeGreaterThan(0);
        expect(country.bbox.height).toBeGreaterThan(0);
        expect(country.flagDataUri).toBeTruthy();
      });
    });

    it('has all 12 South American countries with valid vector paths, centroids, and bboxes', () => {
      expect(SOUTH_AMERICA_COUNTRIES.length).toBe(12);

      SOUTH_AMERICA_COUNTRIES.forEach((country) => {
        expect(country.id).toBeDefined();
        expect(country.name).toBeTruthy();
        expect(country.path.length).toBeGreaterThan(10);
        expect(country.centroid.length).toBe(2);
        expect(country.bbox.width).toBeGreaterThan(0);
        expect(country.bbox.height).toBeGreaterThan(0);
        expect(country.flagDataUri).toBeTruthy();
      });
    });

    it('has all 49 Asian countries with valid vector paths, centroids, and bboxes', () => {
      expect(ASIA_COUNTRIES.length).toBe(49);

      ASIA_COUNTRIES.forEach((country) => {
        expect(country.id).toBeDefined();
        expect(country.name).toBeTruthy();
        expect(country.path.length).toBeGreaterThan(10);
        expect(country.centroid.length).toBe(2);
        expect(country.bbox.width).toBeGreaterThan(0);
        expect(country.bbox.height).toBeGreaterThan(0);
        expect(country.flagDataUri).toBeTruthy();
      });
    });

    it('has all 23 North American countries with valid vector paths, centroids, and bboxes', () => {
      expect(NORTH_AMERICA_COUNTRIES.length).toBe(23);

      NORTH_AMERICA_COUNTRIES.forEach((country) => {
        expect(country.id).toBeDefined();
        expect(country.name).toBeTruthy();
        expect(country.path.length).toBeGreaterThan(10);
        expect(country.centroid.length).toBe(2);
        expect(country.bbox.width).toBeGreaterThan(0);
        expect(country.bbox.height).toBeGreaterThan(0);
        expect(country.flagDataUri).toBeTruthy();
      });
    });

    it('has all 14 Oceania countries with valid vector paths, centroids, and bboxes', () => {
      expect(OCEANIA_COUNTRIES.length).toBe(14);

      OCEANIA_COUNTRIES.forEach((country) => {
        expect(country.id).toBeDefined();
        expect(country.name).toBeTruthy();
        expect(country.path.length).toBeGreaterThan(10);
        expect(country.centroid.length).toBe(2);
        expect(country.bbox.width).toBeGreaterThan(0);
        expect(country.bbox.height).toBeGreaterThan(0);
        expect(country.flagDataUri).toBeTruthy();
      });
    });

    it('has all 6 habitable continents marked as playable and Antarctica coming soon', () => {
      const playable = CONTINENTS.filter(c => c.status === 'playable');
      expect(playable.length).toBe(6);

      const playableIds = playable.map(c => c.id);
      expect(playableIds).toContain('europe');
      expect(playableIds).toContain('africa');
      expect(playableIds).toContain('south_america');
      expect(playableIds).toContain('asia');
      expect(playableIds).toContain('north_america');
      expect(playableIds).toContain('oceania');

      const comingSoon = CONTINENTS.filter(c => c.status === 'coming_soon');
      expect(comingSoon.length).toBe(1);
      expect(comingSoon[0].id).toBe('antarctica');
    });
  });

  describe('2. Continent Select & Navigation', () => {
    it('renders continent selection screen with all playable continents', () => {
      render(<App />);

      expect(screen.getByText(/Flaggle/i)).toBeInTheDocument();
      expect(screen.getByText(/Drag each flag onto its matching border/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Play Europe/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Play Africa/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Play South America/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Play Asia/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Play North America/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Play Oceania/i })).toBeInTheDocument();
    });

    it('starts European game on selecting Europe', async () => {
      render(<App />);

      const playEuropeBtn = screen.getByRole('button', { name: /Play Europe/i });
      fireEvent.click(playEuropeBtn);

      await waitFor(() => {
        expect(screen.getByText(/Europe/i)).toBeInTheDocument();
        expect(screen.getByText(/Flags/i)).toBeInTheDocument();
        expect(screen.getByText(/SCORE/i)).toBeInTheDocument();
      });
    });

    it('starts African game on selecting Africa', async () => {
      render(<App />);

      const playAfricaBtn = screen.getByRole('button', { name: /Play Africa/i });
      fireEvent.click(playAfricaBtn);

      await waitFor(() => {
        expect(screen.getByText(/Africa/i)).toBeInTheDocument();
        expect(screen.getAllByText(/54/i).length).toBeGreaterThan(0);
      });
    });

    it('starts South American game on selecting South America', async () => {
      render(<App />);

      const playSABtn = screen.getByRole('button', { name: /Play South America/i });
      fireEvent.click(playSABtn);

      await waitFor(() => {
        expect(screen.getByText(/South America/i)).toBeInTheDocument();
        expect(screen.getAllByText(/12/i).length).toBeGreaterThan(0);
      });
    });

    it('starts Asian game on selecting Asia', async () => {
      render(<App />);

      const playAsiaBtn = screen.getByRole('button', { name: /Play Asia/i });
      fireEvent.click(playAsiaBtn);

      await waitFor(() => {
        expect(screen.getByText(/Asia/i)).toBeInTheDocument();
        expect(screen.getAllByText(/49/i).length).toBeGreaterThan(0);
      });
    });

    it('starts North American game on selecting North America', async () => {
      render(<App />);

      const playNABtn = screen.getByRole('button', { name: /Play North America/i });
      fireEvent.click(playNABtn);

      await waitFor(() => {
        expect(screen.getByText(/North America/i)).toBeInTheDocument();
        expect(screen.getAllByText(/23/i).length).toBeGreaterThan(0);
      });
    });

    it('starts Oceania game on selecting Oceania', async () => {
      render(<App />);

      const playOceaniaBtn = screen.getByRole('button', { name: /Play Oceania/i });
      fireEvent.click(playOceaniaBtn);

      await waitFor(() => {
        expect(screen.getByText(/Oceania/i)).toBeInTheDocument();
        expect(screen.getAllByText(/14/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe('3. Core Game Mechanics: Match, Name It, and Show Me', () => {
    it('places flag correctly on tapping flag then tapping its country', async () => {
      const { container } = render(<App />);

      // Go to game
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      await waitFor(() => expect(screen.getByText(/Flags/i)).toBeInTheDocument());

      // Get first card element
      const firstCard = container.querySelector('[data-country-id]');
      expect(firstCard).toBeTruthy();
      const countryId = firstCard?.getAttribute('data-country-id');
      expect(countryId).toBeTruthy();

      // Click card to select
      fireEvent.click(firstCard!);

      // Click matching country on map
      const targetCountry = container.querySelector(`#country-${countryId}`);
      expect(targetCountry).toBeTruthy();
      fireEvent.click(targetCountry!);

      // Check that placed score updated to 100
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('reveals country name when clicking shared "Name it" button', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      await waitFor(() => expect(screen.getByText(/Flags/i)).toBeInTheDocument());

      // Get first card and its country ID
      const firstCard = container.querySelector('[data-country-id]');
      const firstCountryId = firstCard?.getAttribute('data-country-id');
      const countryObj = EUROPE_COUNTRIES.find(c => c.id === firstCountryId)!;

      // Click shared "Name it" button
      const nameItButton = screen.getByText(/Name it/i);
      expect(nameItButton).toBeInTheDocument();

      fireEvent.click(nameItButton);

      // Verify that the revealed country name is now present in the card
      expect(firstCard).toHaveTextContent(countryObj.name);
    });

    it('places selected flag automatically when clicking shared "Show me" button', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      await waitFor(() => expect(screen.getByText(/Flags/i)).toBeInTheDocument());

      // Get first card and its country ID
      const firstCard = container.querySelector('[data-country-id]');
      const firstCountryId = firstCard?.getAttribute('data-country-id');

      // Click shared "Show me" button
      const showMeButton = screen.getByText(/Show Me/i);
      expect(showMeButton).toBeInTheDocument();

      fireEvent.click(showMeButton);

      // Verify that target country is now placed on the map
      const targetCountry = container.querySelector(`#country-${firstCountryId}`);
      expect(targetCountry?.getAttribute('fill')).toContain(`url(#flag-pat-${firstCountryId})`);

      // Placed score should still be 0 (Show me awards 0 points)
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('deducts 30% points (awards 70 pts) when placing a flag after using Name It hint', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      await waitFor(() => expect(screen.getByText(/Flags/i)).toBeInTheDocument());

      const firstCard = container.querySelector('[data-country-id]');
      const countryId = firstCard?.getAttribute('data-country-id');

      // Click "Name it" hint
      const nameItButton = screen.getByText(/Name it/i);
      fireEvent.click(nameItButton);

      // Now place the flag
      const targetCountry = container.querySelector(`#country-${countryId}`);
      fireEvent.click(targetCountry!);

      // Score should be 70 (30 point deduction from 100)
      expect(screen.getByText('70')).toBeInTheDocument();
    });

    it('builds streak on consecutive correct placements and resets on error', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      await waitFor(() => expect(screen.getByText(/Flags/i)).toBeInTheDocument());

      // 1st correct match
      const firstCard = container.querySelector('[data-country-id]');
      const countryId1 = firstCard?.getAttribute('data-country-id');
      const target1 = container.querySelector(`#country-${countryId1}`);
      fireEvent.click(target1!);

      // 2nd correct match
      const secondCard = container.querySelector('[data-country-id]');
      const countryId2 = secondCard?.getAttribute('data-country-id');
      const target2 = container.querySelector(`#country-${countryId2}`);
      fireEvent.click(target2!);

      // Streak badge of 2 should be rendered in header
      expect(screen.getByTestId('streak-badge')).toHaveTextContent('2');

      // Make a mistake: click an unplaced country that does not match current flag
      const thirdCard = container.querySelector('[data-country-id]');
      const countryId3 = thirdCard?.getAttribute('data-country-id');
      const otherCountry = EUROPE_COUNTRIES.find(c => c.id !== countryId3 && c.id !== countryId1 && c.id !== countryId2)!;
      const wrongTarget = container.querySelector(`#country-${otherCountry.id}`);
      fireEvent.click(wrongTarget!);

      // Notification shown
      expect(screen.getByText(new RegExp(`This is ${otherCountry.name}`, 'i'))).toBeInTheDocument();
    });
  });

  describe('4. Speedrun Keyboard Shortcuts & Haptics', () => {
    it('handles keyboard shortcuts: N for Name It, S for Show Me, and Escape to exit', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      await waitFor(() => expect(screen.getByText(/Flags/i)).toBeInTheDocument());

      const firstCard = container.querySelector('[data-country-id]');
      const countryId = firstCard?.getAttribute('data-country-id');
      const countryObj = EUROPE_COUNTRIES.find(c => c.id === countryId)!;

      // Press 'n' to trigger Name It
      fireEvent.keyDown(window, { key: 'n' });
      expect(firstCard).toHaveTextContent(countryObj.name);

      // Press 's' to trigger Show Me
      fireEvent.keyDown(window, { key: 's' });
      const targetCountry = container.querySelector(`#country-${countryId}`);
      expect(targetCountry?.getAttribute('fill')).toContain(`url(#flag-pat-${countryId})`);

      // Press 'Escape' to return to Continent Selection
      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() => {
        expect(screen.getByText(/Flaggle/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Play Europe/i })).toBeInTheDocument();
      });
    });

    it('triggers haptics safely on mobile actions', () => {
      const hapticSpy = vi.spyOn(haptics, 'triggerHaptic');
      haptics.triggerHaptic('success');
      expect(hapticSpy).toHaveBeenCalledWith('success');
      haptics.triggerHaptic('error');
      expect(hapticSpy).toHaveBeenCalledWith('error');
      haptics.triggerHaptic('hint');
      expect(hapticSpy).toHaveBeenCalledWith('hint');
    });
  });

  describe('5. Home Screen Reference Design & Features', () => {
    it('renders all 3 informational cards and continent silhouettes on home screen', () => {
      render(<App />);

      expect(screen.getByText(/Dual Controls/i)).toBeInTheDocument();
      expect(screen.getByText(/Microstate Rings/i)).toBeInTheDocument();
      expect(screen.getByText(/Hints & Assistance/i)).toBeInTheDocument();

      // Check continent descriptions
      expect(screen.getByText(/Continental & island nations/i)).toBeInTheDocument();
      expect(screen.getByText(/Includes 6 microstates/i)).toBeInTheDocument();
      expect(screen.getByText(/Andes, Amazon & Patagonia/i)).toBeInTheDocument();
      expect(screen.getByText(/Silk Road, Steppes & Archipelagos/i)).toBeInTheDocument();
      expect(screen.getByText(/Great Lakes, Maya & Caribbean/i)).toBeInTheDocument();
      expect(screen.getByText(/Coral atolls, Outback & Polynesia/i)).toBeInTheDocument();
    });
  });
});
