import merge from 'lodash.merge';
import {Article, WebPage, WithContext} from 'schema-dts';

export function renderMetatags(site: WebPage) {
  // generated from metatags.io
  return /*html*/`
<!-- Primary Meta Tags -->
<title>${site.headline}</title>
<meta name="title" content="${site.headline}">
<meta name="description" content="${site.description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${site.url}">
<meta property="og:title" content="${site.headline}">
<meta property="og:description" content="${site.description}">
<meta property="og:image" content="${site.image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${site.url}">
<meta property="twitter:title" content="${site.headline}">
<meta property="twitter:description" content="${site.description}">
<meta property="twitter:image" content="${site.image}">
  `;
}

// Structured microdata: render itemscope itemtype, itemprop attributes
// https://html.spec.whatwg.org/multipage/#toc-microdata

// JSON+LD is the recommended approach for Advanced Google SEO
// https://developers.google.com/search/docs/advanced/structured-data/article
export function renderAmp(article: WithContext<Article>) {
  const value = merge({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://google.com/article"
    },
    "headline": "Article headline",
    "image": [
      "https://via.placeholder.com/1200x630",
    ],
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": "Placeholder",
      "url": "https://via.placeholder.com/300x300",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Placeholder",
      "logo": {
        "@type": "ImageObject",
        "url": "https://via.placeholder.com/1200x630",
      }
    }
  }, article);
  return /*html*/`
<html amp>
  <head>
    <title>${article.headline}</title>
    <script type="application/ld+json">
      ${JSON.stringify(value)}
    </script>
  </head>
  <body>
  </body>
</html>
  `;
}