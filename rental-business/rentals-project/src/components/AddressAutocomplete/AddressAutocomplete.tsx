import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';

type MapboxFeature = {
  id: string;
  text: string;
  place_name: string;
  center?: [number, number];
};

type MapboxGeocodingResponse = {
  features: MapboxFeature[];
};

type AddressSelection = {
  formattedAddress: string;
  placeId: string;
  lat: number | null;
  lng: number | null;
};

type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (selection: AddressSelection | null) => void;
  error?: string;
  helpText?: string;
  placeholder?: string;
};

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export function AddressAutocomplete({
  value,
  onChange,
  onSelectAddress,
  error,
  helpText = 'Start typing and choose a suggested address.',
  placeholder = 'Enter delivery address',
}: AddressAutocompleteProps) {
  const inputId = useId();
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const listboxId = `${inputId}-listbox`;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimerRef = useRef<number | null>(null);

  const [suggestions, setSuggestions] = useState<
    Array<{
      id: string;
      text: string;
      placeName: string;
      center: [number, number] | null;
    }>
  >([]);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
  if (!mapboxToken) {
    setLoadError('Mapbox access token is missing.');
    setIsReady(false);
    setIsLoading(false);
    return;
  }

  setIsReady(true);
}, []);

  useEffect(() => {
    let isActive = true;

    async function fetchSuggestions(query: string) {
      if (!query || query.trim().length < 3 || !mapboxToken) {
  setSuggestions([]);
  setShowSuggestions(false);
  setActiveIndex(-1);
  setIsLoading(false);
  return;
}

      setIsLoading(true);
      setLoadError('');

      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxToken}&types=address&country=US&limit=5`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch address suggestions');
        }

        const data: MapboxGeocodingResponse = await response.json();

        if (!isActive) return;

        if (data.features && data.features.length > 0) {
          const results = data.features.map((feature: MapboxFeature) => ({
            id: feature.id,
            text: feature.text,
            placeName: feature.place_name,
            center: feature.center as [number, number] | null,
          }));

          setSuggestions(results);
          setShowSuggestions(true);
          setActiveIndex(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
          setActiveIndex(-1);
        }
      } catch (fetchError) {
        console.error('Mapbox geocoding error:', fetchError);
        if (isActive) {
          setSuggestions([]);
          setShowSuggestions(false);
          setActiveIndex(-1);
          setLoadError('Address lookup is temporarily unavailable.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    const debounceTimer = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => {
      isActive = false;
      window.clearTimeout(debounceTimer);
    };
  }, [value]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    onChange(nextValue);
    onSelectAddress(null);
    setSelectedAddress('');
    setShowSuggestions(nextValue.trim().length >= 3);
    setActiveIndex(-1);
  }

  function handleSelectSuggestion(suggestion: {
    id: string;
    text: string;
    placeName: string;
    center: [number, number] | null;
  }) {
    const formattedAddress = suggestion.placeName;
    const lat = suggestion.center ? suggestion.center[1] : null;
    const lng = suggestion.center ? suggestion.center[0] : null;

    onChange(formattedAddress);
    onSelectAddress({
      formattedAddress,
      placeId: suggestion.id,
      lat,
      lng,
    });

    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedAddress(formattedAddress);
    setActiveIndex(-1);
  }

  function handleBlur() {
    blurTimerRef.current = window.setTimeout(() => {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }, 150);
  }

  function handleFocus() {
    if (value.trim().length >= 3 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => {
        const nextIndex = current < suggestions.length - 1 ? current + 1 : 0;
        return nextIndex;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => {
        const nextIndex = current > 0 ? current - 1 : suggestions.length - 1;
        return nextIndex;
      });
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    }
  }

  return (
    <div className="quote-address-autocomplete" style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id={inputId}
          name="deliveryAddress"
          type="text"
          role="combobox"
          autoComplete="street-address"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={error ? 'quote-input-error' : ''}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${helpId} ${errorId}` : helpId}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-activedescendant={
            activeIndex >= 0 && suggestions[activeIndex]
              ? `${inputId}-option-${activeIndex}`
              : undefined
          }
          style={{
            paddingRight: selectedAddress && !error ? '40px' : '12px',
            transition: 'padding-right 0.2s ease',
          }}
        />

        {selectedAddress && !error && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#28a745',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.667 5.167L7.5 14.333L3.333 10.167"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="quote-address-suggestions"
          style={{
            position: 'absolute',
            zIndex: 1000,
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            width: '100%',
            listStyle: 'none',
            padding: 0,
            margin: '4px 0 0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`${inputId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => {
                event.preventDefault();
                if (blurTimerRef.current) {
                  window.clearTimeout(blurTimerRef.current);
                }
                handleSelectSuggestion(suggestion);
              }}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                backgroundColor: index === activeIndex ? '#f5f5f5' : '#fff',
              }}
            >
              {suggestion.placeName}
            </li>
          ))}
        </ul>
      )}

      <p id={helpId} className="quote-help-text">
        {loadError || helpText}
        {!loadError && !isReady ? ' Loading address suggestions...' : ''}
        {isLoading && !loadError ? ' Searching...' : ''}
      </p>

      {error ? (
        <p id={errorId} className="quote-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}