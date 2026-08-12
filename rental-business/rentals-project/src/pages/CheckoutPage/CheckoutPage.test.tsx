import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CheckoutPage } from './CheckoutPage';
import { API_URL } from '../../config';

const mockNavigate = vi.fn();
const mockUseQuote = vi.fn();
const mockClearQuote = vi.fn();
const mockSetCustomerInfo = vi.fn();
const mockSetDeliveryAddress = vi.fn();
const mockSetDeliveryAddressDetails = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/QuoteContext', () => ({
  useQuote: () => mockUseQuote(),
}));

const baseQuoteState = {
  items: [],
  rentalDates: { start: '', end: '' },
  fulfillmentType: 'pickup' as const,
  deliveryAddress: '',
  deliveryAddressDetails: null,
  customerInfo: {
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    notes: '',
  },
  setCustomerInfo: mockSetCustomerInfo,
  setDeliveryAddress: mockSetDeliveryAddress,
  setDeliveryAddressDetails: mockSetDeliveryAddressDetails,
  clearQuote: mockClearQuote,
};

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the empty state when there are no quote items', () => {
    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [],
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('No rental items in your quote.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse rentals/i })).toBeInTheDocument();
  });

  it('renders the checkout form and quote summary', () => {
    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 4,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Submit your rental inquiry.')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByText(/1 item selected/i)).toBeInTheDocument();
    expect(screen.getByText(/4 total pieces/i)).toBeInTheDocument();
    expect(screen.getByText(/white resin folding chairs x 4/i)).toBeInTheDocument();
  });

  it('shows validation errors when required contact fields are missing', () => {
    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    expect(screen.getByText('Please enter your full name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
    expect(screen.getByText('Please select an event type.')).toBeInTheDocument();
    expect(
      screen.getByText('Please fix the highlighted fields before submitting.')
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows an error for an invalid email address', () => {
    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'not-an-email' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9205551234' },
    });

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday-party' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows quote-detail errors when rental dates are missing', () => {
    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '', end: '' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jordan@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9205551234' },
    });

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday-party' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    expect(screen.getByText('Please choose a rental start date.')).toBeInTheDocument();
    expect(screen.getByText('Please choose a rental end date.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('requires a delivery address when fulfillment type is delivery', async () => {
    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
      fulfillmentType: 'delivery',
      deliveryAddress: '',
      deliveryAddressDetails: null,
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jordan@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9205551234' },
    });

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday-party' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    const alerts = await screen.findAllByRole('alert');
    expect(
      alerts.some((alert) =>
        within(alert).queryByText(/please enter a delivery address/i)
      )
    ).toBe(true);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('submits the inquiry, clears the quote, and navigates to success', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Request received' }),
    });

    vi.stubGlobal('fetch', mockFetch);

    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jordan@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9205551234' },
    });

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday-party' },
    });

    fireEvent.change(screen.getByLabelText(/estimated guest count/i), {
      target: { value: '40' },
    });

    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'Please confirm pickup timing.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_URL}/api/quotes`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    await waitFor(() => expect(mockClearQuote).toHaveBeenCalled());
    await waitFor(() => expect(mockSetCustomerInfo).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/checkout/success'));
  });

  it('shows a loading state while submitting', async () => {
    let resolveFetch:
      | ((value: { ok: boolean; json: () => Promise<{ message: string }> }) => void)
      | undefined;

    const pendingFetch = new Promise<{ ok: boolean; json: () => Promise<{ message: string }> }>(
      (resolve) => {
        resolveFetch = resolve;
      }
    );

    const mockFetch = vi.fn().mockReturnValue(pendingFetch);
    vi.stubGlobal('fetch', mockFetch);

    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jordan@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9205551234' },
    });

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday-party' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    expect(screen.getByRole('button', { name: /submitting inquiry/i })).toBeDisabled();

    resolveFetch?.({
      ok: true,
      json: async () => ({ message: 'Request received' }),
    });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/checkout/success'));
  });

  it('shows an error message when the request fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Server error' }),
    });

    vi.stubGlobal('fetch', mockFetch);

    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jordan@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9205551234' },
    });

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday-party' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/problem submitting your inquiry/i);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockClearQuote).not.toHaveBeenCalled();
  });

  it('shows an error message when fetch rejects', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    mockUseQuote.mockReturnValue({
      ...baseQuoteState,
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          quantity: 2,
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Jordan Smith' },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jordan@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '9205551234' },
    });

    fireEvent.change(screen.getByLabelText(/event type/i), {
      target: { value: 'birthday-party' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/problem submitting your inquiry/i);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockClearQuote).not.toHaveBeenCalled();
  });
});