import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

describe('HomePage component', () => {
  it('displays the main rental-services content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(
  screen.getByRole('heading', {
    name: /chairs, tables, games, concessions for backyard/i
  })
).toBeInTheDocument();

    expect(
      screen.getByText(
        /JP Rentals and Events serves Kaukauna, the Fox Valley, and Green Bay/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Popular rentals')).toBeInTheDocument();
    expect(screen.getByText('Perfect for')).toBeInTheDocument();
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Service area')).toBeInTheDocument();
    expect(screen.getByText('Need pricing for your event?')).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', { name: /Request Pricing/i }).length
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByRole('link', { name: /Browse Rentals/i }).length
    ).toBeGreaterThan(0);

    expect(
      screen.getByRole('link', { name: /Start Your Quote/i })
    ).toBeInTheDocument();
  });
});