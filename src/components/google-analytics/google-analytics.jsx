
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/api/base-url';

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const loadGTagOnce = async () => {
      if (window.__GA_LOADED__) return;

      try {
        const response = await axios.get(
         `${BASE_URL}/api/getGTag`
        );

        const gtagHtml = response?.data?.data?.gtag;
        if (!gtagHtml) return;

        const container = document.createElement('div');
        container.innerHTML = gtagHtml;

        container.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script');

          if (oldScript.src) {
            newScript.src = oldScript.src;
            newScript.async = true;
          } else {
            newScript.text = oldScript.textContent;
          }

          document.head.appendChild(newScript);
        });

        window.__GA_LOADED__ = true;
      } catch (err) {
        console.error('GA load failed', err);
      }
    };

    const timer = setTimeout(() => {
  loadGTagOnce();
}, 8000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;
