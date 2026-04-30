import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * useSiteMeta: A custom hook to centrally manage and cache site configuration.
 * Reduces redundant API calls and ensures data consistency across the app.
 */
const useSiteMeta = () => {
  const [siteMeta, setSiteMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeta = async () => {
    try {
      const { data } = await api.get('/sitemeta');
      if (data.success) {
        setSiteMeta(data.data);
        // Sync document title if available
        if (data.data.siteTitle) {
          document.title = data.data.siteTitle;
        }
      }
    } catch (err) {
      console.error("SiteMeta Fetch Failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  // Return data and a refresh function
  return { siteMeta, loading, error, refreshMeta: fetchMeta };
};

export default useSiteMeta;
