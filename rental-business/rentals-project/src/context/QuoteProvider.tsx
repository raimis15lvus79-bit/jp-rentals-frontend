import { useMemo, useState, type ReactNode } from 'react';
import {
  QuoteContext,
  type CustomerInfo,
  type DeliveryAddressDetails,
  type FulfillmentType,
  type QuoteItem,
  type RentalDates,
} from './QuoteContext';

type QuoteProviderProps = {
  children: ReactNode;
};

export function QuoteProvider({ children }: QuoteProviderProps) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [rentalDates, setRentalDates] = useState<RentalDates>({
    start: '',
    end: '',
  });
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryAddressDetails, setDeliveryAddressDetails] =
    useState<DeliveryAddressDetails | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    notes: '',
  });

  function addItem(item: Omit<QuoteItem, 'quantity'>) {
    setItems((current) => {
      const existingItem = current.find((entry) => entry.id === item.id);

      if (existingItem) {
        return current.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }

  function removeItem(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId));
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;

    setItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }

  function clearQuote() {
    setItems([]);
    setRentalDates({ start: '', end: '' });
    setFulfillmentType('pickup');
    setDeliveryAddress('');
    setDeliveryAddressDetails(null);
    setCustomerInfo({
      fullName: '',
      email: '',
      phone: '',
      eventType: '',
      guestCount: '',
      notes: '',
    });
  }

  const value = useMemo(
    () => ({
      items,
      rentalDates,
      fulfillmentType,
      deliveryAddress,
      deliveryAddressDetails,
      customerInfo,
      setCustomerInfo,
      addItem,
      removeItem,
      updateQuantity,
      setRentalDates,
      setFulfillmentType,
      setDeliveryAddress,
      setDeliveryAddressDetails,
      clearQuote,
    }),
    [
      items,
      rentalDates,
      fulfillmentType,
      deliveryAddress,
      deliveryAddressDetails,
      customerInfo,
    ]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}