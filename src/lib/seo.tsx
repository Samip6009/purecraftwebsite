/**
 * SEO Helpers - JSON-LD, meta templates, and structured data
 * SSR-friendly: these return static objects/JSX for head injection
 */

import { Helmet } from 'react-helmet';

// Site configuration - Nepal-focused SEO
export const siteConfig = {
  name: 'Pure Craft',
  fullName: 'Pure Craft — Digital Marketing Agency in Nepal',
  tagline: 'Performance Marketing for Nepal Businesses',
  description: 'Pure Craft is Nepal\'s leading digital marketing agency. Performance-driven marketing, AI appointment setting, and lead generation for growing businesses in Nepal.',
  url: 'https://samipkc.com.np',
  logo: '/pure-craft-logo.svg',
  email: 'hello@samipkc.com.np',
  phone: '+9779810071283',
  socials: {
    instagram: 'https://www.instagram.com/purecraft.media?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    facebook: 'https://www.facebook.com/profile.php?id=61576632570565',
  },
  address: {
    locality: 'Kathmandu',
    region: 'Bagmati',
    country: 'NP',
    countryName: 'Nepal',
  },
  keywords: [
    'Pure Craft',
    'Pure Craft Digital Marketing',
    'Marketing Agency Nepal',
    'Marketing Agency in Nepal',
    'Digital Marketing Nepal',
    'Performance Marketing Nepal',
    'Lead Generation Nepal',
    'AI Appointment Setting Nepal',
  ],
  areaServed: ['Nepal', 'South Asia'],
};

// JSON-LD Organization schema - Nepal-focused
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MarketingAgency',
  name: siteConfig.name,
  legalName: 'Pure Craft Digital Marketing Agency',
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
  areaServed: siteConfig.areaServed.map(area => ({
    '@type': 'Country',
    name: area,
  })),
  knowsAbout: [
    'Digital Marketing',
    'Performance Marketing',
    'Lead Generation',
    'AI Appointment Setting',
    'Social Media Marketing',
    'Paid Advertising',
  ],
  slogan: siteConfig.tagline,
};

// JSON-LD LocalBusiness schema for Nepal SEO
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: siteConfig.fullName,
  image: `${siteConfig.url}${siteConfig.logo}`,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati',
    addressCountry: 'NP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 27.7172,
    longitude: 85.3240,
  },
  priceRange: '$$',
  openingHours: 'Mo-Fr 09:00-18:00',
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

// JSON-LD Service schema for digital marketing in Nepal
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Digital Marketing & AI Appointment Setting in Nepal',
  provider: {
    '@type': 'MarketingAgency',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  description: 'Performance-driven digital marketing services for Nepal businesses. AI-powered appointment setting, lead generation, and paid advertising.',
  areaServed: {
    '@type': 'Country',
    name: 'Nepal',
  },
  serviceType: ['Digital Marketing', 'Performance Marketing', 'Lead Generation', 'AI Appointment Setting', 'Paid Advertising'],
};

// JSON-LD ImageObject template
export function generateImageSchema(image: {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: image.url.startsWith('http') ? image.url : `${siteConfig.url}${image.url}`,
    name: image.alt,
    description: image.caption || image.alt,
    width: image.width,
    height: image.height,
    copyrightHolder: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}

// JSON-LD VideoObject template
export function generateVideoSchema(video: {
  url: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration?: string;
  uploadDate?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${siteConfig.url}${video.thumbnailUrl}`,
    contentUrl: video.url.startsWith('http') ? video.url : `${siteConfig.url}${video.url}`,
    uploadDate: video.uploadDate || new Date().toISOString(),
    duration: video.duration,
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
    : siteConfig.fullName;
  const normalizedPath = path?.startsWith('/') ? path : `/${path}`;
  const url = `${siteConfig.url}${normalizedPath === '//' ? '/' : normalizedPath}`;
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={siteConfig.keywords.join(', ')} />
      <link rel="canonical" href={url} />
      
      {/* Geo targeting for Nepal */}
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Kathmandu, Nepal" />
      <meta name="geo.position" content="27.7172;85.3240" />
      <meta name="ICBM" content="27.7172, 85.3240" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={`${siteConfig.name} - Digital Marketing Agency in Nepal`} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />

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

      {/* JSON-LD - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* JSON-LD - LocalBusiness for Nepal */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      
      {/* JSON-LD - WebSite */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* JSON-LD - Service */}
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
