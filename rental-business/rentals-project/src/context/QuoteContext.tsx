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

  function addItem(product, quantity = 1) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          quantity,
          image: product.image
        }
      ];
    });
  }

  function updateQuantity(id, quantity) {
    const numericQuantity = Number(quantity);

    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: numericQuantity }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function clearQuote() {
    setItems([]);
    setRentalDates({ start: '', end: '' });
    setFulfillmentType('pickup');
    setDeliveryAddress('');
  }

  const value = useMemo(() => {
    return {
      items,
      rentalDates,
      fulfillmentType,
      deliveryAddress,
      setRentalDates,
      setFulfillmentType,
      setDeliveryAddress,
      addItem,
      updateQuantity,
      removeItem,
      clearQuote
    };
  }, [items, rentalDates, fulfillmentType, deliveryAddress]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error('useQuote must be used inside a QuoteProvider');
  }

  return context;
}