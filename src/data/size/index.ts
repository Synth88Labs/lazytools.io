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

SIZE_TOOLS.push(
  {
    slug: 'clothing-size-converter',
    name: 'Clothing Size Converter (Women)',
    icon: '👗',
    description:
      "Convert women's clothing and dress sizes between US, UK, EU, FR, IT, AU and JP — with letter sizes. Standard chart plus vanity-sizing guidance; runs in your browser.",
    lead: 'A US 8 dress is a UK 12, an EU 38, a FR 40, an IT 44 and a JP 13 — six labels for one garment.',
    measureSteps: [
      'Know one size in any system — US, UK, EU, FR, IT, AU or JP — and select it in the converter.',
      'For fitted garments, check the brand’s own measurements chart too: bust, waist and hip in cm beat any size number.',
      'Between sizes or shopping a slim-cut label? Size up — returns cost more than room.',
      'Letter sizes (S/M/L) are the loosest mapping of all: verify against the numeric size when it matters.',
    ],
    note:
      'The conversions follow fixed offsets — UK = US + 4, EU = US + 30, FR = US + 32, IT = US + 36, JP = US + 5 — but "vanity sizing" has shifted real garments over the decades: a 1970s US 12 is close to a modern US 6. Brands also deliberately cut generous or slim. The chart gets you to the right rack; the garment measurements confirm the fit.',
    faqs: [
      {
        q: 'What is a US size 8 in European sizes?',
        a: 'EU/DE 38, FR/ES 40 and IT 44 — European countries use different scales, which trips up shoppers who expect one "EU size". In the UK and Australia it is a 12, in Japan a 13.',
      },
      {
        q: 'Why do France, Italy and Germany all differ?',
        a: 'Each national system evolved from different base measurements: Italian numbers run ~6 above French, which run ~2 above German/EU. The converter maps all three from any starting point.',
      },
      {
        q: 'What is vanity sizing?',
        a: 'The decades-long drift of size labels downward: as average bodies grew, brands relabeled larger garments with smaller numbers to flatter shoppers. A modern US 8 fits a body that would have worn a US 12–14 in the 1970s — and it is why two same-size garments from different brands fit differently.',
      },
      {
        q: 'Is an S/M/L size reliable across brands?',
        a: 'Least reliable of all: "M" commonly spans US 8–10 at one brand and US 6–8 at another. Use the numeric size where available, and garment measurements for anything fitted.',
      },
    ],
    keywords: ['clothing size converter', 'dress size conversion', 'us to eu dress size', 'us to uk size', 'international clothing sizes', 'women size chart'],
  },
  {
    slug: 'kids-shoe-size-converter',
    name: "Kids' Shoe Size Converter",
    icon: '👶',
    description:
      "Convert children's shoe sizes between US (C/Y), UK, EU and foot length in cm — with typical ages from baby to big kid. Measure-and-fit guidance included.",
    lead: "Kids' US sizes run 0C–13.5C then restart at 1Y–7Y — a US 10C is a UK 9, an EU 27, and fits a ~16.5 cm foot (age 3.5–4.5, typically).",
    measureSteps: [
      'Stand the child on paper against a wall (heel touching), mark the longest toe, and measure in cm — afternoon is best, feet swell during the day.',
      'Measure both feet and use the larger; add about 0.8 cm (a thumb’s width) of growing room.',
      'Enter the centimeters in the converter — it finds the nearest size with the typical age as a cross-check.',
      'Re-measure every 2–3 months under age 4, every 4–6 months after: small feet can grow half a size per season.',
    ],
    note:
      'The "C" (child) scale runs to 13.5C, then the "Y" (youth) scale restarts at 1Y — so a 1Y is BIGGER than a 13C, the single most confusing thing about US kids\' sizing. UK kids\' sizes run one below US; EU sizes just keep counting up the adult scale. Ages on any chart are population averages: two healthy four-year-olds can be three sizes apart, which is why the centimeter measurement always wins.',
    faqs: [
      {
        q: "Why do US kids' sizes go 13C and then 1Y?",
        a: 'The child scale (C) ends at 13.5C and the youth scale (Y) restarts at 1 — a leftover from the old barleycorn system. 1Y is one step LARGER than 13.5C, not smaller. Youth sizes continue to 7Y, which overlaps adult women\'s ~8.5.',
      },
      {
        q: 'What size shoe for a 2-year-old?',
        a: 'Typically US 6C–8C (EU 22–25, foot 13–14.6 cm) — but the range is wide. Measure the foot in cm and add 0.8 cm of room rather than buying by age.',
      },
      {
        q: 'How much growing room should kids\' shoes have?',
        a: 'About 0.8 cm (a thumb\'s width) beyond the longest toe — enough for months of growth without being sloppy. More than ~1.5 cm causes tripping and poor gait.',
      },
      {
        q: 'Do youth sizes convert to women\'s sizes?',
        a: 'Yes — women\'s US size ≈ youth size + 1.5. A 5Y is roughly a women\'s 6.5, which is why big-kid sneakers are a known budget trick for smaller women\'s feet.',
      },
    ],
    keywords: ['kids shoe size converter', 'children shoe size chart', 'toddler shoe size by age', 'youth shoe sizes', 'kids shoe size cm', '1y vs 13c'],
  },
  {
    slug: 'hat-size-converter',
    name: 'Hat Size Converter',
    icon: '🎩',
    description:
      'Convert hat sizes between head circumference (cm/inches), US and UK fitted sizes and S–XXL letters. Fitted size ≈ head circumference in inches ÷ π.',
    lead: 'A 57 cm head wears a US 7⅛ fitted hat (UK 7) — a size M — because fitted sizes are simply the head’s diameter in inches.',
    measureSteps: [
      'Wrap a soft tape (or string, then a ruler) around the head where a hat sits: mid-forehead, above the ears, around the widest back point.',
      'Keep it comfortably snug — one finger should slip beneath the tape.',
      'Read the circumference in cm or inches and enter it — the converter returns fitted and letter sizes.',
      'Between sizes? Choose the larger: hats shrink slightly with wear and weather; heads don’t.',
    ],
    note:
      'The old-school "fitted" number is elegant: it\'s the head circumference in inches divided by π — effectively the diameter of your head — quoted in eighths. That\'s why a 22" head (56 cm) wears a size 7 (22 ÷ 3.1416 ≈ 7.0). UK fitted sizes run exactly ⅛ smaller than US for the same head, an artifact of different measuring conventions between hatmakers.',
    faqs: [
      {
        q: 'How do I measure my head for a hat?',
        a: 'Tape around mid-forehead, above the ears and the widest point at the back, comfortably snug. Average adult heads run 54–58 cm (21¼–22¾ in); read the fitted size straight from the converter.',
      },
      {
        q: 'What do fitted hat sizes like 7¼ mean?',
        a: 'Head circumference in inches divided by π — the diameter, in eighths of an inch. 7¼ ≈ 22.8 in ≈ 58 cm circumference. Baseball fitted caps (New Era 59FIFTY) use exactly this scale.',
      },
      {
        q: 'What hat size is a size M?',
        a: 'Commonly 56–57 cm (US fitted 7–7⅛). Letters vary slightly by maker: S ≈ 54–55, M ≈ 56–57, L ≈ 58–59, XL ≈ 60–61 cm.',
      },
      {
        q: 'Are UK and US hat sizes the same?',
        a: 'Nearly — UK fitted sizes run ⅛ smaller than US for the same head (US 7⅛ = UK 7). Continental sizing skips the arithmetic and just uses centimeters.',
      },
    ],
    keywords: ['hat size converter', 'hat size chart', 'measure head for hat', 'fitted hat sizes', '7 1/4 hat size in cm', 'us to uk hat size'],
  }
);

export function getSizeTool(slug: string): SizeToolDef | undefined {
  return SIZE_TOOLS.find((t) => t.slug === slug);
}
