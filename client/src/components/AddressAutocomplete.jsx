import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddressAutocomplete = ({ value, onChange, placeholder, className, required }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchText) => {
    if (!searchText || searchText.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    try {
      // Using Photon API (OpenStreetMap data, permissive CORS and limits, free)
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchText)}&limit=5`
      );
      
      const formattedSuggestions = data.features.map(f => {
        const p = f.properties;
        const addressParts = [p.name, p.street, p.city, p.state, p.country].filter(Boolean);
        return {
          place_id: p.osm_id || Math.random().toString(),
          display_name: addressParts.join(', ')
        };
      });
      
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange({ target: { value: newValue } });
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (newValue.length >= 3) {
      setIsOpen(true);
      timeoutRef.current = setTimeout(() => {
        fetchSuggestions(newValue);
      }, 500); // 500ms debounce
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (suggestion) => {
    const address = suggestion.display_name;
    setQuery(address);
    onChange({ target: { value: address } });
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={className}
        required={required}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
      />
      
      {isOpen && (query.length >= 3) && (
        <ul className="absolute z-[100] w-full bg-white border border-gray-200 shadow-xl rounded-lg mt-1 max-h-60 overflow-y-auto">
          {loading && <li className="p-3 text-gray-500 text-sm">Searching...</li>}
          
          {!loading && suggestions.length === 0 && (
            <li className="p-3 text-gray-500 text-sm">No addresses found</li>
          )}
          
          {!loading && suggestions.map((suggestion) => (
            <li 
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="p-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
