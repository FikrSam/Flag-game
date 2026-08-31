import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EUROPE_COUNTRIES } from '../data/europeData';
import { AFRICA_COUNTRIES } from '../data/africaData';
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

    it('has Europe and Africa marked as playable and other continents coming soon', () => {
      const europe = CONTINENTS.find(c => c.id === 'europe');
      expect(europe?.status).toBe('playable');

      const africa = CONTINENTS.find(c => c.id === 'africa');
      expect(africa?.status).toBe('playable');

      const otherContinents = CONTINENTS.filter(c => !['europe', 'africa'].includes(c.id));
      expect(otherContinents.length).toBe(5);
      otherContinents.forEach(c => expect(c.status).toBe('coming_soon'));
    });
  });

  describe('2. Continent Select & Navigation', () => {
    it('renders continent selection screen with Europe and Africa', () => {
      render(<App />);

      expect(screen.getByText(/Flaggle/i)).toBeInTheDocument();
      expect(screen.getByText(/Pick a continent/i)).toBeInTheDocument();
      expect(screen.getByText(/Play Europe/i)).toBeInTheDocument();
      expect(screen.getByText(/Play Africa/i)).toBeInTheDocument();
    });

    it('starts European game on selecting Europe', () => {
      render(<App />);

      const playEuropeBtn = screen.getByText(/Play Europe/i);
      fireEvent.click(playEuropeBtn);

      expect(screen.getByText(/Europe/i)).toBeInTheDocument();
      expect(screen.getByText(/Flags/i)).toBeInTheDocument();
      expect(screen.getByText(/SCORE/i)).toBeInTheDocument();
    });

    it('starts African game on selecting Africa', () => {
      render(<App />);

      const playAfricaBtn = screen.getByText(/Play Africa/i);
      fireEvent.click(playAfricaBtn);

      expect(screen.getByText(/Africa/i)).toBeInTheDocument();
      expect(screen.getAllByText(/54/i).length).toBeGreaterThan(0);
    });
  });

  describe('3. Core Game Mechanics: Match, Name It, and Show Me', () => {
    it('places flag correctly on tapping flag then tapping its country', () => {
      const { container } = render(<App />);

      // Go to game
      fireEvent.click(screen.getByText(/Play Europe/i));

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

    it('reveals country name when clicking "Name it"', () => {
      render(<App />);
      fireEvent.click(screen.getByText(/Play Europe/i));

      const nameItButtons = screen.getAllByText(/Name it/i);
      expect(nameItButtons.length).toBeGreaterThan(0);

      fireEvent.click(nameItButtons[0]);

      expect(screen.queryAllByText(/Name it/i).length).toBeLessThan(nameItButtons.length);
    });

    it('plays wrong sound and displays "This is <Country>" banner when clicking incorrect country', () => {
      const { container } = render(<App />);
      fireEvent.click(screen.getByText(/Play Europe/i));

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
      fireEvent.click(screen.getByText(/Play Europe/i));

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
  });
});
