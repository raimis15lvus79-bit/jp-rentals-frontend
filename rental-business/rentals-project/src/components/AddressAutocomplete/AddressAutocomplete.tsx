import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

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

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (apiKey) {
  setOptions({
    key: apiKey,
  });
}

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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const placeListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const onChangeRef = useRef(onChange);
  const onSelectAddressRef = useRef(onSelectAddress);

  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onSelectAddressRef.current = onSelectAddress;
  }, [onSelectAddress]);

  useEffect(() => {
    let active = true;

    async function setupAutocomplete() {
      if (!inputRef.current || autocompleteRef.current) return;

      if (!apiKey) {
        setLoadError('Google Maps API key is missing.');
        return;
      }

      try {
        await importLibrary('places');

        if (!active || !inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'place_id', 'geometry'],
        });

        const listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          const formattedAddress = place.formatted_address ?? '';
          const placeId = place.place_id ?? '';
          const lat = place.geometry?.location?.lat?.() ?? null;
          const lng = place.geometry?.location?.lng?.() ?? null;

          if (!formattedAddress || !placeId) {
            onSelectAddressRef.current(null);
            return;
          }

          onChangeRef.current(formattedAddress);
          onSelectAddressRef.current({
            formattedAddress,
            placeId,
            lat,
            lng,
          });
        });

        autocompleteRef.current = autocomplete;
        placeListenerRef.current = listener;
        setIsReady(true);
      } catch {
        if (active) {
          setLoadError('Address lookup is temporarily unavailable. Please try again.');
        }
      }
    }

    setupAutocomplete();

    return () => {
      active = false;
      placeListenerRef.current?.remove();
      placeListenerRef.current = null;
      autocompleteRef.current = null;
    };
  }, []);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
    onSelectAddress(null);
  }

  return (
    <div className="quote-address-autocomplete">
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        autoComplete="street-address"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={error ? 'quote-input-error' : ''}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${helpId} ${errorId}` : helpId}
      />

      <p id={helpId} className="quote-help-text">
        {loadError || helpText}
        {!loadError && !isReady ? ' Loading address suggestions...' : ''}
      </p>

      {error ? (
        <p id={errorId} className="quote-field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}