import Head from 'next/head'

/**
 * SEOHead - Reusable SEO component for Next.js pages
 */
export default function SEOHead({
  title,
  description,
  canonical,
  keywords = [],
  ogType = 'website',
  ogImage,
  ogImageAlt,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  twitterCard = 'summary_large_image',
  twitterSite = '@chaintree_dev',
  twitterCreator,
  jsonLd,
  noindex = false,
  nofollow = false,
  locale = 'en-US',
}) {
  const siteUrl = 'https://build.w3d.community'

  // Build canonical URL (absolute)
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined

  // Auto-append branding if not already present
  const fullTitle = typeof title === 'string' && title.trim() ? (title.includes('ChainTree') ? title : `${title} | ChainTree`) : 'ChainTree - Learn Web3 & Solana Development'
  const safeDescription = typeof description === 'string' ? description : (description ? String(description) : '')
  const safeKeywords = Array.isArray(keywords) ? keywords : []

  // Robots directive (only emit tag when restricting)
  const robotsContent =
    noindex || nofollow
      ? `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`
      : null

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={safeDescription} />
      {safeKeywords.length > 0 && <meta name="keywords" content={safeKeywords.join(', ')} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Robots */}
      {robotsContent && <meta name="robots" content={robotsContent} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:site_name" content="ChainTree" />
      <meta property="og:locale" content={locale} />
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
          <meta property="og:image:width" content={String(ogImageWidth)} />
          <meta property="og:image:height" content={String(ogImageHeight)} />
          <meta property="og:image:type" content="image/png" />
        </>
      )}

      {/* Twitter Card */}
      <meta property="twitter:card" content={twitterCard} />
      {canonicalUrl && <meta property="twitter:url" content={canonicalUrl} />}
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={safeDescription} />
      {ogImage && <meta property="twitter:image" content={ogImage} />}
      {twitterSite && <meta property="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta property="twitter:creator" content={twitterCreator} />}

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd], null, 2),
          }}
        />
      )}
    </Head>
  )
}
