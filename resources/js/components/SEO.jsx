import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component for dynamic page titles and meta tags
 * Usage: <SEO title="Page Title" description="Page description" />
 */
const SEO = ({
  title = 'Best Vision EyeCare - Premier Eye Clinic in Tanzania',
  description = 'Best Vision EyeCare is the leading eye clinic in Mwanza, Tanzania. We offer comprehensive eye examinations, contact lens fitting, eyewear, vision therapy, and community eye health programs.',
  keywords = 'eye clinic Tanzania, optometrist Mwanza, eye examination, contact lenses, eyewear, vision care, Best Vision EyeCare',
  image = null,
  type = 'website',
  noindex = false,
}) => {
  const location = useLocation();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.bestvision-eyecare.co.tz';
  const fullUrl = `${baseUrl}${location.pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('author', 'Best Vision EyeCare');
    updateMetaTag('language', 'English');
    updateMetaTag('revisit-after', '7 days');
    updateMetaTag('theme-color', '#667eea');

    // Open Graph Tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:url', fullUrl, 'property');
    updateMetaTag('og:image', imageUrl, 'property');
    updateMetaTag('og:image:width', '1200', 'property');
    updateMetaTag('og:image:height', '630', 'property');
    updateMetaTag('og:site_name', 'Best Vision EyeCare', 'property');
    updateMetaTag('og:locale', 'en_US', 'property');

    // Twitter Card Tags - MUST use 'name' attribute, not 'property'
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:url', fullUrl, 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', imageUrl, 'name');

    // Geo Tags
    updateMetaTag('geo.region', 'TZ-26');
    updateMetaTag('geo.placename', 'Dar es Salaam');
    updateMetaTag('geo.position', '-6.7924;39.2083');
    updateMetaTag('ICBM', '-6.7924, 39.2083');

    // Business Information
    updateMetaTag('contact', 'info@bestvision-eyecare.co.tz');
    updateMetaTag('phone', '+255 678 110 376');
    updateMetaTag('address', 'Mwanza, Tanzania');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Structured Data (JSON-LD) for LocalBusiness
    let structuredDataScript = document.getElementById('structured-data');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': fullUrl,
      name: 'Best Vision EyeCare',
      description: description,
      url: baseUrl,
      telephone: '+255678110376',
      email: 'info@bestvision-eyecare.co.tz',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mwanza, Tanzania',
        addressLocality: 'Mwanza',
        addressCountry: 'TZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '-2.5164',
        longitude: '32.9176',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '17:00',
      },
      image: imageUrl,
      priceRange: '$$',
      areaServed: {
        '@type': 'City',
        name: 'Mwanza',
      },
      service: [
        'Comprehensive Eye Examinations',
        'Contact Lens Fitting',
        'Eyewear & Spectacles',
        'Pediatric Eye Care',
        'Dry Eye Treatment',
        'Vision Therapy',
        'Cataract Screening',
        'Low Vision Aids',
      ],
    };

    structuredDataScript.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, type, noindex, fullUrl, baseUrl, imageUrl]);

  return null;
};

export default SEO;