import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  jsonLd?: object | object[];
}

export function SEO({ title, description, canonical, keywords = [], jsonLd }: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {canonical && <link rel="canonical" href={canonical} />}
      {/* Open Graph / Twitter */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* Structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {Array.isArray(jsonLd)
            ? JSON.stringify(jsonLd)
            : JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
