import { createContext, useContext, useMemo, useState } from 'react';

const QuoteContext = createContext(null);

export function QuoteProvider({ children }) {
  const [items, setItems] = useState([]);
  const [rentalDates, setRentalDates] = useState({
    start: '',
    end: ''
  });
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  function addItem(product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1
        }
      ];
    });
  }

  function removeItem(productId) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function updateQuantity(productId, nextQuantity) {
    const parsedQuantity = Number(nextQuantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: parsedQuantity }
          : item
      )
    );
  }

  function clearQuote() {
    setItems([]);
    setRentalDates({
      start: '',
      end: ''
    });
    setFulfillmentType('pickup');
    setDeliveryAddress('');
  }

  const value = useMemo(
    () => ({
      items,
      rentalDates,
      fulfillmentType,
      deliveryAddress,
      addItem,
      removeItem,
      updateQuantity,
      clearQuote,
      setRentalDates,
      setFulfillmentType,
      setDeliveryAddress
    }),
    [items, rentalDates, fulfillmentType, deliveryAddress]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }

  return context;
}