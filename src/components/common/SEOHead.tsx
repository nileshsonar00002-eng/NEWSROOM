import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authorName?: string;
  categoryName?: string;
  tags?: string[];
  articleSlug?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  authorName = 'NEWSORA Editorial Team',
  categoryName,
  tags = [],
  articleSlug
}) => {
  const { language } = useLanguage();

  const siteTitle = 'NEWSORA • News That Moves You';
  const defaultDesc = 'Verified, in-depth, mobile-first journalism across India and the World in English and Hindi.';
  const defaultImage = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
  const baseUrl = 'https://newsora.in';

  const fullTitle = title ? `${title} | NEWSORA` : siteTitle;
  const metaDesc = description || defaultDesc;
  const metaImage = image || defaultImage;
  const canonicalUrl = url || `${baseUrl}/${language}${articleSlug ? `/news/${articleSlug}` : ''}`;

  useEffect(() => {
    // 1. Dynamic document title
    document.title = fullTitle;

    // 2. Set or update standard meta tags
    const setMeta = (nameAttr: string, valAttr: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${valAttr}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, valAttr);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('name', 'description', metaDesc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', metaDesc);
    setMeta('property', 'og:image', metaImage);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', metaDesc);
    setMeta('name', 'twitter:image', metaImage);

    // 3. Set canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;

    // 4. Set hreflang tags for multi-language versions
    const langs = ['en', 'hi'];
    langs.forEach((lng) => {
      let linkHreflang = document.querySelector(`link[rel="alternate"][hreflang="${lng}"]`) as HTMLLinkElement;
      if (!linkHreflang) {
        linkHreflang = document.createElement('link');
        linkHreflang.rel = 'alternate';
        linkHreflang.hreflang = lng;
        document.head.appendChild(linkHreflang);
      }
      linkHreflang.href = `${baseUrl}/${lng}${articleSlug ? `/news/${articleSlug}` : ''}`;
    });

    // 5. Injected JSON-LD Structured Data
    const existingJsonLd = document.getElementById('newsora-jsonld');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    const script = document.createElement('script');
    script.id = 'newsora-jsonld';
    script.type = 'application/ld+json';

    if (type === 'article') {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': title,
        'description': metaDesc,
        'image': [metaImage],
        'datePublished': publishedTime || new Date().toISOString(),
        'dateModified': publishedTime || new Date().toISOString(),
        'author': {
          '@type': 'Person',
          'name': authorName
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'NEWSORA Digital Media',
          'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/favicon.svg`
          }
        },
        'articleSection': categoryName || 'News',
        'keywords': tags.join(', ')
      };
      script.text = JSON.stringify(articleSchema);
    } else {
      const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsMediaOrganization',
        'name': 'NEWSORA',
        'url': baseUrl,
        'logo': `${baseUrl}/favicon.svg`,
        'sameAs': [
          'https://twitter.com/newsoranews',
          'https://facebook.com/newsoranews'
        ]
      };
      script.text = JSON.stringify(orgSchema);
    }

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('newsora-jsonld');
      if (el) el.remove();
    };
  }, [fullTitle, metaDesc, metaImage, canonicalUrl, type, language, articleSlug, publishedTime, authorName, categoryName, tags]);

  return null;
};
