/**
 * SEO Helpers - JSON-LD, meta templates, and structured data
 * SSR-friendly: these return static objects/JSX for head injection
 */

import { Helmet } from 'react-helmet';

// Site configuration
export const siteConfig = {
  name: 'Pure Craft Digital Agency',
  tagline: 'Digital Marketing & AI Automation',
  description: 'Pure Craft is a premium digital marketing agency specializing in AI-powered appointment setting, lead generation, and growth automation for enterprises.',
  url: 'https://samipkc.com.np',
  logo: '/pure-craft-logo.png',
  email: 'hello@samipkc.com.np',
  phone: '+977-9800000000',
  socials: {
    instagram: 'https://instagram.com/purecraft.np',
    facebook: 'https://facebook.com/purecraft.np',
  },
  address: {
    locality: 'Kathmandu',
    region: 'Bagmati',
    country: 'NP',
  },
};

// JSON-LD Organization schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logo}`,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  sameAs: [siteConfig.socials.instagram, siteConfig.socials.facebook],
  address: {
    '@type': 'PostalAddress',
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.country,
  },
};

// JSON-LD WebSite schema (for search box)
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// JSON-LD Service schema for digital marketing
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Digital Marketing & AI Appointment Setting',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
  },
  description: 'Premium digital marketing services including AI-powered appointment setting, lead generation, social media marketing, and conversion optimization.',
  areaServed: 'Worldwide',
  serviceType: ['Digital Marketing', 'AI Automation', 'Lead Generation', 'Appointment Setting'],
};

// Page meta template interface
interface PageMetaProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    author?: string;
    tags?: string[];
  };
}

/**
 * SEOHead component - Renders meta tags and JSON-LD
 * Usage: <SEOHead title="Services" description="Our services..." />
 */
export function SEOHead({ 
  title,
  description = siteConfig.description,
  image = siteConfig.logo,
  path = '',
  type = 'website',
  article,
}: PageMetaProps) {
  const fullTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : `${siteConfig.name} - ${siteConfig.tagline}`;
  const url = `${siteConfig.url}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteConfig.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Article specific */}
      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:author" content={article.author} />
          {article.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
    </Helmet>
  );
}

// Article/Blog JSON-LD template
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedDate: string;
  modifiedDate?: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
  };
}

// Case study JSON-LD template
export function generateCaseStudySchema(caseStudy: {
  title: string;
  client: string;
  description: string;
  results: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseStudy.title,
    about: caseStudy.client,
    description: caseStudy.description,
    abstract: caseStudy.results.join('. '),
    creator: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}

export default SEOHead;
