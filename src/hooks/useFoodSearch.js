import { useState } from 'react';
import axios from 'axios';

function useFoodSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchFood = async (query) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      const url = `https://world.openfoodfacts.net/cgi/search.pl`;
      const response = await axios.get(url, {
        params: {
          search_terms: query,
          search_simple: 1,
          action: 'process',
          json: 1,
          page_size: 10
        }
      });

      const filtered = (response.data.products || []).filter(
        p => (p.product_name || p.product_name_en || p.brands || p.generic_name)
      );

      setResults(filtered);
    } catch (err) {
      if (err.response) {
        setError(`Server error: ${err.response.status}. Please try again.`);
      } else if (err.request) {
        setError('Network error. Check your connection and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, hasSearched, searchFood };
}

export default useFoodSearch;
