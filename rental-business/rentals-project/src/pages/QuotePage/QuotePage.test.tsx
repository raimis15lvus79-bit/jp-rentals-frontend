import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QuotePage } from './QuotePage';

const mockNavigate = vi.fn();
const mockUseQuote = vi.fn();

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

describe('QuotePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the empty state when there are no quote items', () => {
    mockUseQuote.mockReturnValue({
      items: [],
      rentalDates: { start: '', end: '' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Your quote is empty.')).toBeInTheDocument();

    const emptyState = screen.getByText('Your quote is empty.').closest('section');
    expect(emptyState).not.toBeNull();

    expect(
      within(emptyState as HTMLElement).getByRole('link', { name: /browse rentals/i })
    ).toBeInTheDocument();
  });

  it('renders quote items and summary details', () => {
    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 4,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Rental items')).toBeInTheDocument();
    expect(screen.getByText('White resin folding chairs')).toBeInTheDocument();
    expect(screen.getByText(/Total quantity: 4/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-07-25 to 2026-07-26/i)).toBeInTheDocument();
  });

  it('shows validation errors when continuing with missing dates', () => {
    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 2,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '', end: '' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /continue to checkout from quote summary/i,
      })
    );

    expect(screen.getByText('Please select a start date.')).toBeInTheDocument();
    expect(screen.getByText('Please select an end date.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows a form-level error summary when the quote is invalid', () => {
    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 2,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '', end: '' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /continue to checkout from quote summary/i,
      })
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('Please fix the highlighted fields before continuing.')
    ).toBeInTheDocument();
  });

  it('requires a delivery address when delivery is selected', () => {
    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 2,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
      fulfillmentType: 'delivery',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /continue to checkout from quote summary/i,
      })
    );

    expect(
      screen.getByText('Please enter a delivery address.')
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to checkout when the quote is valid', () => {
    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 2,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /continue to checkout from quote summary/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('updates quantity when the user changes the number input', () => {
    const updateQuantity = vi.fn();

    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 2,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity,
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByDisplayValue('2'), {
      target: { value: '5' },
    });

    expect(updateQuantity).toHaveBeenCalledWith('chairs', 5);
  });

  it('updates quantity when the increase and decrease buttons are clicked', () => {
    const updateQuantity = vi.fn();

    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 2,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity,
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /increase quantity for white resin folding chairs/i,
      })
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /decrease quantity for white resin folding chairs/i,
      })
    );

    expect(updateQuantity).toHaveBeenNthCalledWith(1, 'chairs', 3);
    expect(updateQuantity).toHaveBeenNthCalledWith(2, 'chairs', 1);
  });

  it('shows the mobile summary continue button', () => {
    mockUseQuote.mockReturnValue({
      items: [
        {
          id: 'chairs',
          name: 'White resin folding chairs',
          priceCents: 350,
          pricingLabel: 'From',
          quantity: 2,
          image: '/chairs.jpg',
        },
      ],
      rentalDates: { start: '2026-07-25', end: '2026-07-26' },
      fulfillmentType: 'pickup',
      deliveryAddress: '',
      deliveryAddressDetails: null,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setRentalDates: vi.fn(),
      setFulfillmentType: vi.fn(),
      setDeliveryAddress: vi.fn(),
      setDeliveryAddressDetails: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', {
        name: /continue to checkout from mobile summary/i,
      })
    ).toBeInTheDocument();
  });
});