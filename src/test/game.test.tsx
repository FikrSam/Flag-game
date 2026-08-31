import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EUROPE_COUNTRIES } from '../data/europeData';
import { CONTINENTS } from '../data/continents';
import { App } from '../App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('FlagQuest Basic Geography Game', () => {
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

    it('has Europe marked as playable and other continents coming soon', () => {
      const europe = CONTINENTS.find(c => c.id === 'europe');
      expect(europe?.status).toBe('playable');

      const nonEurope = CONTINENTS.filter(c => c.id !== 'europe');
      expect(nonEurope.length).toBe(6);
      nonEurope.forEach(c => expect(c.status).toBe('coming_soon'));
    });
  });

  describe('2. Continent Select & Navigation', () => {
    it('renders continent selection screen with Europe', () => {
      render(<App />);

      expect(screen.getByText(/FlagQuest/i)).toBeInTheDocument();
      expect(screen.getByText(/Pick a continent/i)).toBeInTheDocument();
      expect(screen.getByText(/Play Europe/i)).toBeInTheDocument();
    });

    it('starts European game on selecting Europe', () => {
      render(<App />);

      const playEuropeBtn = screen.getByText(/Play Europe/i);
      fireEvent.click(playEuropeBtn);

      expect(screen.getByText(/Europe/i)).toBeInTheDocument();
      expect(screen.getByText(/Flags/i)).toBeInTheDocument();
      expect(screen.getByText(/SCORE/i)).toBeInTheDocument();
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

    it('auto-places country without score when clicking "Show me"', () => {
      render(<App />);
      fireEvent.click(screen.getByText(/Play Europe/i));

      const showMeButtons = screen.getAllByText(/Show me/i);
      expect(showMeButtons.length).toBeGreaterThan(0);

      fireEvent.click(showMeButtons[0]);

      // Score stays 0
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
