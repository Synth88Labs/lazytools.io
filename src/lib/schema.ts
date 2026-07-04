import { SITE } from './site';

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    description: SITE.description,
    email: SITE.email,
    sameAs: [SITE.github],
    parentOrganization: {
      '@type': 'Organization',
      name: SITE.parent.name,
      url: SITE.parent.url,
    },
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

export function webApplicationSchema(opts: { name: string; url: string; description: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    url: `${SITE.url}${opts.url}`,
    description: opts.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (runs in the browser)',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Runs 100% in your browser',
      'No file or data upload — private by architecture',
      'Free, no sign-up, no limits',
      'Works offline after first load',
    ],
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function collectionPageSchema(opts: { name: string; url: string; description: string; items: { name: string; url: string }[] }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    url: `${SITE.url}${opts.url}`,
    description: opts.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: `${SITE.url}${item.url}`,
      })),
    },
  };
}
