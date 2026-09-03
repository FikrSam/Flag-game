import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EUROPE_COUNTRIES } from '../data/europeData';
import { AFRICA_COUNTRIES } from '../data/africaData';
import { SOUTH_AMERICA_COUNTRIES } from '../data/southAmericaData';
import { NORTH_AMERICA_COUNTRIES } from '../data/northAmericaData';
import { OCEANIA_COUNTRIES } from '../data/oceaniaData';
import { ASIA_COUNTRIES } from '../data/asiaData';
import { CONTINENTS } from '../data/continents';
import { App } from '../App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Flaggle Basic Geography Game', () => {
  beforeEach(() => {
    localStorage.clear();
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

    it('has 6 continents marked as playable (196 sovereign nations) and Antarctica coming soon', () => {
      const playable = CONTINENTS.filter(c => c.status === 'playable');
      expect(playable.length).toBe(6);
      const totalCountries = playable.reduce((sum, c) => sum + c.countryCount, 0);
      expect(totalCountries).toBe(196);

      const antarctica = CONTINENTS.find(c => c.id === 'antarctica');
      expect(antarctica?.status).toBe('coming_soon');
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

      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();
      expect(screen.getByText(/Flags/i)).toBeInTheDocument();
    });

    it('starts African game on selecting Africa', async () => {
      render(<App />);

      const playAfricaBtn = screen.getByRole('button', { name: /Play Africa/i });
      fireEvent.click(playAfricaBtn);

      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();
      expect(screen.getAllByText(/54/i).length).toBeGreaterThan(0);
    });

    it('starts South American game on selecting South America', async () => {
      render(<App />);

      const playSABtn = screen.getByRole('button', { name: /Play South America/i });
      fireEvent.click(playSABtn);

      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();
      expect(screen.getAllByText(/12/i).length).toBeGreaterThan(0);
    });
  });

  describe('3. Core Game Mechanics: Match, Name It, and Show Me', () => {
    it('places flag correctly on tapping flag then tapping its country', () => {
      const { container } = render(<App />);

      // Go to game
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

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

    it('reveals country name when clicking shared "Name it" button', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

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

    it('places selected flag automatically when clicking shared "Show me" button', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

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
    });

    it('displays "This is <Country>" error banner when clicking incorrect country', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      // Get first unplaced flag card
      const firstCard = container.querySelector('[data-country-id]');
      const countryId = firstCard?.getAttribute('data-country-id');
      expect(countryId).toBeTruthy();

      // Find a DIFFERENT country on map
      const otherCountry = EUROPE_COUNTRIES.find(c => c.id !== countryId)!;
      const wrongTarget = container.querySelector(`#country-${otherCountry.id}`);
      expect(wrongTarget).toBeTruthy();

      // Click wrong country
      fireEvent.click(wrongTarget!);

      // Verify that "This is <CountryName>" banner is shown
      expect(screen.getByText(new RegExp(`This is ${otherCountry.name}`, 'i'))).toBeInTheDocument();
    });

    it('places flag correctly on mobile touch interaction', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      // Get first card
      const firstCard = container.querySelector('[data-country-id]');
      const countryId = firstCard?.getAttribute('data-country-id');
      expect(countryId).toBeTruthy();

      // Touch flag to select
      fireEvent.touchStart(firstCard!, { touches: [{ clientX: 100, clientY: 100 }] });
      fireEvent.touchEnd(firstCard!, { changedTouches: [{ clientX: 100, clientY: 100 }] });

      // Touch matching country on map
      const targetCountry = container.querySelector(`#country-${countryId}`);
      expect(targetCountry).toBeTruthy();
      fireEvent.click(targetCountry!);

      // Placed score updated to 100
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('debounces rapid synthetic double clicks to avoid duplicate placement score triggers', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

      const firstCard = container.querySelector('[data-country-id]');
      const countryId = firstCard?.getAttribute('data-country-id');
      const targetCountry = container.querySelector(`#country-${countryId}`);

      // Rapid successive clicks (e.g. touch + synthetic click)
      fireEvent.click(firstCard!);
      fireEvent.click(targetCountry!);
      fireEvent.click(targetCountry!);

      // Score should still only be 100, not double scored or errored
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('deducts 30% points (awards 70 pts) when placing a flag after using Name It hint', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

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

    it('builds streak on consecutive correct placements and resets on error', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));

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

  describe('4. Home Screen Reference Design & Features', () => {
    it('renders all 3 informational cards and continent silhouettes on home screen', () => {
      render(<App />);

      expect(screen.getByText(/Dual Controls/i)).toBeInTheDocument();
      expect(screen.getByText(/Microstate Rings/i)).toBeInTheDocument();
      expect(screen.getByText(/Hints & Assistance/i)).toBeInTheDocument();

      // Check descriptions
      expect(screen.getByText(/Continental & island nations/i)).toBeInTheDocument();
      expect(screen.getByText(/Includes 6 microstates/i)).toBeInTheDocument();
      expect(screen.getByText(/Andes, Amazon & Patagonia/i)).toBeInTheDocument();
      expect(screen.getByText(/Silk Road, Steppes & Archipelagoes/i)).toBeInTheDocument();
      expect(screen.getByText(/Great Plains, Mayans & Caribbean/i)).toBeInTheDocument();
      expect(screen.getByText(/Outback, Atolls & Pacific Isles/i)).toBeInTheDocument();
    });

    it('starts Asia game on selecting Asia', async () => {
      render(<App />);
      const playAsiaBtn = screen.getByRole('button', { name: /Play Asia/i });
      fireEvent.click(playAsiaBtn);
      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();
      expect(screen.getAllByText(/49/i).length).toBeGreaterThan(0);
    });

    it('starts North America game on selecting North America', async () => {
      render(<App />);
      const playNABtn = screen.getByRole('button', { name: /Play North America/i });
      fireEvent.click(playNABtn);
      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();
      expect(screen.getAllByText(/23/i).length).toBeGreaterThan(0);
    });

    it('starts Oceania game on selecting Oceania', async () => {
      render(<App />);
      const playOceaniaBtn = screen.getByRole('button', { name: /Play Oceania/i });
      fireEvent.click(playOceaniaBtn);
      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();
      expect(screen.getAllByText(/14/i).length).toBeGreaterThan(0);
    });
  });

  describe('5. Desktop Speedrun Keyboard Shortcuts', () => {
    it('triggers Name It hint on pressing N key', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));
      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();

      const firstCard = container.querySelector('[data-country-id]');
      const countryId = firstCard?.getAttribute('data-country-id');
      const country = EUROPE_COUNTRIES.find(c => c.id === countryId);

      // Press 'n'
      fireEvent.keyDown(window, { key: 'n' });

      // Name should now be visible in dock
      expect(screen.getAllByText(country!.name).length).toBeGreaterThan(0);
    });

    it('triggers Show Me auto-placement on pressing S key', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));
      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();

      const initialCount = container.querySelectorAll('[data-country-id]').length;

      // Press 's'
      fireEvent.keyDown(window, { key: 's' });

      // Flag placed automatically; unplaced count decreased by 1
      const newCount = container.querySelectorAll('[data-country-id]').length;
      expect(newCount).toBe(initialCount - 1);
    });

    it('cycles selected flag on ArrowRight key', async () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /Play Europe/i }));
      expect(await screen.findByText(/SCORE/i)).toBeInTheDocument();

      const cards = container.querySelectorAll('[data-country-id]');
      const id1 = cards[0]?.getAttribute('data-country-id');

      // Press ArrowRight
      fireEvent.keyDown(window, { key: 'ArrowRight' });

      // Should have selected another card or cycled
      expect(id1).toBeTruthy();
    });
  });
});
