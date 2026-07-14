import { it, expect, describe, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';

describe('HomePage component', () => {
  let loadCart;

  beforeEach(() => {
    loadCart = vi.fn();
  });

  it('displays the main rental-services content', () => {
    render(
      <MemoryRouter>
        <HomePage cart={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText('Party rentals that make your event feel easy, fun, and memorable.')).toBeInTheDocument();
    expect(screen.getAllByText('White resin folding chairs').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nerf war rentals').length).toBeGreaterThan(0);
    expect(screen.getByText('Popular events')).toBeInTheDocument();
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Service area')).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByText('Let’s make your event happen.')).toBeInTheDocument();
  });

  it('submits the quote form to the backend endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Request received' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    render(
      <MemoryRouter>
        <HomePage cart={[]} loadCart={loadCart} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jordan' } });
    fireEvent.change(screen.getByLabelText(/event type/i), { target: { value: 'Birthday party' } });
    fireEvent.change(screen.getByLabelText(/event date/i), { target: { value: 'July 20' } });
    fireEvent.change(screen.getByLabelText(/what do you need/i), { target: { value: 'Tables and chairs' } });
    fireEvent.click(screen.getByRole('button', { name: /send request/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith('/api/quote-requests', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })));

    expect(await screen.findByText(/thanks for your request/i)).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});