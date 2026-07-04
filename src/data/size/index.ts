/** Size-converter registry: page content for /size/ tools. */

export interface SizeToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  /** "how to measure" section, markdown-free sentences rendered as steps */
  measureSteps: string[];
  note: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const SIZE_TOOLS: SizeToolDef[] = [
  {
    slug: 'ring-size-converter',
    name: 'Ring Size Converter',
    icon: '💍',
    description:
      'Convert ring sizes between US, UK/AU letters, EU/ISO and millimeters — or find your size from a measured finger. Full chart included; runs 100% in your browser.',
    lead: 'Ring systems measure the same thing differently: a US 7 is a UK N and an EU/ISO 54.4 — all describing a 17.3 mm inner diameter.',
    measureSteps: [
      'Wrap a strip of paper or string snugly around the base of your finger (measure at the end of the day, when fingers are largest).',
      'Mark where it overlaps and measure the length in millimeters — that is your finger circumference, and directly your EU/ISO size.',
      'Enter it in the converter (or measure an existing ring’s inner diameter instead) — the nearest size in every system appears instantly.',
      'Between two sizes, or a wide band (>6 mm)? Choose the larger size.',
    ],
    note:
      'The EU/ISO 8653 standard sizes rings by inner circumference in millimeters, which is why measuring with a paper strip gives you the EU size directly. US numeric and UK letter sizes are fixed steps on the same scale — one UK letter per half US size. Knuckle larger than the finger base? Measure both and pick between them.',
    faqs: [
      {
        q: 'How do I measure my ring size at home?',
        a: 'Wrap a strip of paper snugly around the base of the finger, mark the overlap, and measure the length in mm. That circumference is your EU/ISO size; the converter maps it to US and UK instantly. Measure late in the day and size up if between sizes.',
      },
      {
        q: 'What is a US ring size 7 in UK and EU?',
        a: 'US 7 = UK/AU N = EU/ISO 54.4 (a 17.3 mm inner diameter). The full chart on this page covers US 3–13.',
      },
      {
        q: 'How accurate are string measurements?',
        a: 'Within about half a size when done snugly — string stretches, so paper is better. For an important purchase (engagement rings!), confirm with a jeweler’s sizer or measure a well-fitting ring’s inner diameter.',
      },
      {
        q: 'Are men’s and women’s ring sizes different systems?',
        a: 'No — the scales are identical. Typical ranges differ (women commonly US 5–8, men US 8–12), but a US 9 is the same physical size for anyone.',
      },
    ],
    keywords: ['ring size converter', 'ring size chart', 'us to uk ring size', 'measure ring size at home', 'ring size in mm'],
  },
  {
    slug: 'shoe-size-converter',
    name: 'Shoe Size Converter',
    icon: '👟',
    description:
      'Convert shoe sizes between US, UK, EU and centimeters for men and women — or find your size from your measured foot length. Charts included; 100% in your browser.',
    lead: 'A US men’s 9 is a UK 8, an EU 42.5 and a 26.5 cm foot — but brands vary, so foot length in centimeters is the only reliable ground truth.',
    measureSteps: [
      'Stand on a sheet of paper against a wall, heel touching the wall, wearing the socks you’d wear with the shoes.',
      'Mark the tip of your longest toe (it isn’t always the big toe) and measure wall-to-mark in centimeters.',
      'Measure both feet — they differ for most people — and use the larger one.',
      'Enter the centimeters in the converter; add ~0.5 cm of room for running shoes.',
    ],
    note:
      'Sizing systems differ at the root: EU sizes count Paris points (2/3 cm each), UK sizes count barleycorns (1/3 inch) from a different zero than US, and Japan sensibly just uses foot length in centimeters (the ISO "Mondopoint" idea). Because every brand cuts its lasts differently, treat converted sizes as the starting point and the centimeter measurement as the truth.',
    faqs: [
      {
        q: 'What is a US men’s 9 in EU and UK?',
        a: 'US men’s 9 = UK 8 = EU 42.5, fitting a ~26.5 cm foot. Women’s US 9 = UK 7 = EU 40 (~25 cm).',
      },
      {
        q: 'Why is my size different between brands?',
        a: 'Size numbers label the shoe’s last (the form it’s built on), and each brand shapes lasts differently — deviations of half a size are normal. Foot length in cm is brand-independent, which is why good size guides list it.',
      },
      {
        q: 'How do I convert women’s to men’s shoe sizes (US)?',
        a: 'Subtract about 1.5: a women’s US 8.5 corresponds to a men’s US 7 in athletic shoes. UK and EU sizes are mostly unisex scales.',
      },
      {
        q: 'Should I size up for running shoes?',
        a: 'Usually half a size (≈0.5 cm): feet swell during runs and toes need splay room. Fit them late in the day in your running socks.',
      },
    ],
    keywords: ['shoe size converter', 'us to eu shoe size', 'uk to us shoe size', 'shoe size chart cm', 'foot length to shoe size'],
  },
  {
    slug: 'bra-size-converter',
    name: 'Bra Size Converter',
    icon: '🩱',
    description:
      'Convert bra sizes between US, UK, EU, FR, IT and AU systems — with sister sizes. Body measurements never leave your browser.',
    lead: 'A US 34DD is a UK 34DD but an EU 75E and a FR 90E — band systems translate cleanly, cup letters diverge past D.',
    measureSteps: [
      'Band: measure snugly around the ribcage, directly under the bust, in inches or cm — exhale first; the tape should be level and firm.',
      'Bust: measure around the fullest point, unpadded, tape parallel to the floor.',
      'Cup = bust minus band: each inch (2.5 cm) of difference is one cup step (1" ≈ A, 2" ≈ B, 3" ≈ C…).',
      'Enter your current size in the converter to see every system plus your sister sizes.',
    ],
    note:
      'Sister sizes share the same cup volume on a different band: 34DD, 36D and 32DDD hold the same — the letter changes because cup letters are relative to the band. If a band rides up, go down a band and up a cup; if it digs in, the reverse. Roughly 8 in 10 people measure into a different size than they habitually buy, which is why the sister-size feature exists.',
    faqs: [
      {
        q: 'What is a sister size?',
        a: 'The same cup volume on a different band length. One band size down + one cup letter up (or the reverse) keeps volume constant: 34DD ↔ 32DDD ↔ 36D. Useful when a style fits in the cup but not the band.',
      },
      {
        q: 'What is a US 34DD in EU sizing?',
        a: '75E. The band converts 34→75 (inches to the EU cm scale), and the fifth cup is DD in the US ladder but E in the EU ladder.',
      },
      {
        q: 'Why do UK and US cups differ above D?',
        a: 'The ladders fork: US goes D, DD, DDD, G…; UK goes D, DD, E, F, FF, G…. A UK F is roughly a US DDD/G — always convert by counting cup steps, not matching letters.',
      },
      {
        q: 'Is my measurement data stored anywhere?',
        a: 'No. Like every LazyTools tool, the converter runs entirely in your browser — body measurements are never transmitted, logged or stored. You can verify with your browser’s network tab.',
      },
    ],
    keywords: ['bra size converter', 'us to eu bra size', 'sister size calculator', 'uk bra size conversion', '34dd in eu'],
  },
];

export function getSizeTool(slug: string): SizeToolDef | undefined {
  return SIZE_TOOLS.find((t) => t.slug === slug);
}
