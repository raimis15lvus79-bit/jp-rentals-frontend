import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from 'react';

type FulfillmentType = 'pickup' | 'delivery';

type RentalDates = {
  start: string;
  end: string;
};

type QuoteItem = {
  id: string | number;
  name: string;
  image: string;
  pricingLabel: string;
  priceCents: number;
  quantity: number;
};

type Product = {
  id: string | number;
  name: string;
  image: string;
  pricingLabel: string;
  priceCents: number;
};

type QuoteContextValue = {
  items: QuoteItem[];
  rentalDates: RentalDates;
  fulfillmentType: FulfillmentType;
  deliveryAddress: string;
  addItem: (product: Product) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, nextQuantity: string | number) => void;
  clearQuote: () => void;
  setRentalDates: Dispatch<SetStateAction<RentalDates>>;
  setFulfillmentType: Dispatch<SetStateAction<FulfillmentType>>;
  setDeliveryAddress: Dispatch<SetStateAction<string>>;
};

type QuoteProviderProps = {
  children: ReactNode;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: QuoteProviderProps) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [rentalDates, setRentalDates] = useState<RentalDates>({
    start: '',
    end: ''
  });
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  function addItem(product: Product) {
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

  function removeItem(productId: string | number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function updateQuantity(productId: string | number, nextQuantity: string | number) {
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

  const value = useMemo<QuoteContextValue>(
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

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);

  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }

  return context;
}