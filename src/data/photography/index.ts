/** Photography calculator registry. One entry drives a /photography/ page. */

export interface PhotographyToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'dof' | 'fov' | 'crop' | 'ev' | 'hyperfocal' | 'timelapse' | 'print' | 'sunny16';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const PHOTOGRAPHY_TOOLS: PhotographyToolDef[] = [
  {
    slug: 'depth-of-field-calculator',
    name: 'Depth of Field Calculator',
    icon: '🎞️',
    widget: 'dof',
    description: 'Calculate depth of field — the near and far limits of sharp focus — from your sensor, focal length, aperture and subject distance. In your browser.',
    lead: 'Enter your sensor, focal length, aperture and subject distance to get the depth of field — the zone that will look sharp.',
    how: 'Depth of field is the range of distances that appear acceptably sharp. The tool computes the hyperfocal distance from your focal length, aperture and the sensor\'s circle of confusion (its diagonal ÷ 1500), then the near and far limits around your subject. Smaller apertures (higher f-numbers), shorter lenses and farther subjects all increase the depth of field.',
    note: 'Depth of field extends about twice as far behind the subject as in front (roughly a 1:2 split) at normal distances. When the subject reaches the hyperfocal distance, the far limit becomes infinity — everything from half the hyperfocal distance to the horizon is sharp.',
    faqs: [
      { q: 'What is depth of field?', a: 'The range of distances in a photo that look acceptably sharp. A shallow depth of field (blurry background) comes from wide apertures and long lenses; a deep one (everything sharp) from small apertures and wide lenses.' },
      { q: 'How do I calculate depth of field?', a: 'From the hyperfocal distance H = focal²⁄(f-number × circle of confusion) + focal, then the near limit s(H−f)⁄(H+s−2f) and far limit s(H−f)⁄(H−s) for a subject at distance s. The tool does it for your sensor and settings.' },
      { q: 'How do I get a blurry background?', a: 'Use a wide aperture (low f-number like f/1.8), a longer focal length, get closer to your subject, and put more distance between the subject and the background. All of these shrink the depth of field.' },
      { q: 'How do I keep everything in focus?', a: 'Use a small aperture (high f-number like f/11–f/16), a wider lens, and focus at or near the hyperfocal distance. That maximises the depth of field for landscapes.' },
      { q: 'Does sensor size affect depth of field?', a: 'Yes — for the same field of view and aperture, a larger sensor gives shallower depth of field. That\'s why full-frame cameras blur backgrounds more easily than phones. The tool accounts for this through the circle of confusion.' },
    ],
    keywords: ['depth of field calculator', 'dof calculator', 'depth of field chart', 'bokeh calculator', 'focus distance calculator', 'sharp focus range', 'photography dof'],
  },
  {
    slug: 'field-of-view-calculator',
    name: 'Field of View Calculator',
    icon: '📷',
    widget: 'fov',
    description: 'Calculate a lens\'s field of view (angle of view) from the sensor and focal length — horizontal, vertical and diagonal — plus the frame size at any distance. In your browser.',
    lead: 'Enter your sensor and focal length to get the angle of view — and how much of a scene fits in the frame at a given distance.',
    how: 'The angle of view is how wide a scene a lens captures: 2 × arctan(sensor dimension ÷ (2 × focal length)), worked out separately for the sensor\'s width, height and diagonal. From the angle and a subject distance, the tool also gives the real-world width and height of the frame you\'ll capture.',
    note: 'A shorter focal length or a larger sensor gives a wider angle of view. On full frame, a 50mm lens is "normal" (about 47° diagonal, close to human central vision); under about 35mm is wide-angle, and over about 85mm is telephoto.',
    faqs: [
      { q: 'What is field of view in photography?', a: 'How much of a scene a lens and sensor capture, expressed as an angle. A wide-angle lens has a large field of view (fits a lot in); a telephoto has a narrow one (magnifies a small area).' },
      { q: 'How do I calculate angle of view?', a: 'Angle of view = 2 × arctan(sensor dimension ÷ (2 × focal length)). Use the sensor\'s width for the horizontal angle, height for vertical, and diagonal for the diagonal angle. The tool computes all three.' },
      { q: 'What focal length gives a "normal" view?', a: 'Roughly the sensor\'s diagonal — about 43–50mm on full frame, 28–35mm on APS-C, 25mm on Micro Four Thirds. A normal lens sees the scene at about the same magnification as your eye.' },
      { q: 'How much will fit in my frame at a distance?', a: 'The tool gives the frame\'s real width and height at any subject distance from the angle of view. For example a 24mm lens on full frame captures roughly a 15 × 10 m area at 10 m.' },
      { q: 'How does sensor size change the field of view?', a: 'A smaller sensor "crops" the view, giving a narrower field of view for the same lens. That\'s the crop factor — a 50mm lens on APS-C frames like a 75–80mm lens does on full frame.' },
    ],
    keywords: ['field of view calculator', 'angle of view calculator', 'fov calculator photography', 'lens field of view', 'camera fov calculator', 'focal length angle', 'frame size calculator'],
  },
  {
    slug: 'crop-factor-calculator',
    name: 'Crop Factor & Equivalent Focal Length Calculator',
    icon: '🔲',
    widget: 'crop',
    description: 'Calculate a sensor\'s crop factor and the full-frame-equivalent focal length and aperture of any lens. Compare formats fairly. In your browser.',
    lead: 'Pick a sensor and enter a lens to get its crop factor and the full-frame-equivalent focal length and aperture.',
    how: 'The crop factor is the full-frame diagonal (43.3mm) divided by your sensor\'s diagonal — a smaller sensor has a bigger crop factor. Multiply your lens\'s focal length by it for the equivalent full-frame field of view, and (for depth-of-field and total-light comparison) multiply the aperture by it too.',
    note: 'Equivalent aperture is about matching depth of field and background blur across formats — it does not change exposure. An f/1.8 lens still exposes as f/1.8 on any sensor; only its blur behaves like a larger f-number on a smaller sensor. So a 50mm f/1.8 on Micro Four Thirds frames and blurs like a 100mm f/3.6 on full frame.',
    faqs: [
      { q: 'What is crop factor?', a: 'The ratio of a full-frame sensor\'s diagonal to your sensor\'s, showing how much a smaller sensor "crops" the view. APS-C is about 1.5–1.6×, Micro Four Thirds 2×. Multiply focal length by it for the full-frame-equivalent framing.' },
      { q: 'What is equivalent focal length?', a: 'The focal length that would give the same field of view on full frame. A 35mm lens on a 1.5× APS-C body has a 52.5mm equivalent — it frames like a 52.5mm lens does on full frame.' },
      { q: 'Does crop factor affect aperture and exposure?', a: 'It affects depth of field and total light gathered (the "equivalent aperture"), but not exposure. An f/2.8 lens meters and exposes as f/2.8 on every sensor — you don\'t change your settings for crop.' },
      { q: 'What is equivalent aperture?', a: 'The f-number × crop factor — used only to compare depth of field and background blur between formats. A 25mm f/1.4 on MFT (2× crop) gives the same framing and blur as a 50mm f/2.8 on full frame, though it still exposes at f/1.4.' },
      { q: 'Why do smaller sensors have more depth of field?', a: 'To get the same field of view you use a shorter lens (or stand closer), and shorter lenses have more depth of field at the same aperture. That\'s captured by the equivalent aperture being a higher number on smaller sensors.' },
    ],
    keywords: ['crop factor calculator', 'equivalent focal length calculator', 'crop factor chart', 'aps-c to full frame', 'equivalent aperture calculator', 'sensor crop calculator', 'focal length equivalent'],
  },
  {
    slug: 'exposure-value-calculator',
    name: 'Exposure Value (EV) Calculator',
    icon: '☀️',
    widget: 'ev',
    description: 'Calculate the exposure value (EV) from aperture, shutter speed and ISO — and see equivalent exposure combinations that give the same brightness. In your browser.',
    lead: 'Enter an aperture, shutter speed and ISO to get the exposure value — and a table of equivalent settings that expose the same.',
    how: 'Exposure value combines aperture and shutter into one number: EV = log₂(f-number² ÷ shutter time), quoted at ISO 100, with higher ISO lowering the light needed. Because it\'s a base-2 logarithm, each whole EV is one "stop" — a doubling or halving of light. The tool lists aperture/shutter pairs that all produce the same exposure.',
    note: 'The equivalent-exposure table is the heart of the exposure triangle: open the aperture and you must speed up the shutter to match, trading depth of field against motion blur. Every row captures the same total light.',
    faqs: [
      { q: 'What is exposure value (EV)?', a: 'A single number combining aperture and shutter speed: EV = log₂(f-number² ÷ shutter seconds) at ISO 100. It measures how much light a given exposure lets in — higher EV means less light (bright scene).' },
      { q: 'What is a "stop" in photography?', a: 'A doubling or halving of light — one whole EV. Opening the aperture one stop, halving the shutter time, or doubling the ISO each change the exposure by one stop.' },
      { q: 'What are equivalent exposures?', a: 'Different aperture/shutter combinations that let in the same total light, so the photo is equally bright. For example f/8 at 1/125 and f/4 at 1/500 are equivalent — the tool lists them for your settings.' },
      { q: 'How does ISO affect exposure value?', a: 'Doubling the ISO makes the sensor twice as sensitive, so you need one stop less light — it lowers the scene EV required by 1 for each doubling. The EV shown is normalised to ISO 100.' },
      { q: 'How do I use the exposure triangle?', a: 'Balance aperture (depth of field), shutter (motion), and ISO (noise) to reach the exposure the scene needs. If you open the aperture for blur, speed up the shutter to keep the same brightness — that\'s what the equivalents show.' },
    ],
    keywords: ['exposure value calculator', 'ev calculator photography', 'exposure triangle calculator', 'equivalent exposure calculator', 'stops calculator', 'aperture shutter iso calculator', 'exposure calculator'],
  },
  {
    slug: 'hyperfocal-distance-calculator',
    name: 'Hyperfocal Distance Calculator',
    icon: '🏔️',
    widget: 'hyperfocal',
    description: 'Calculate the hyperfocal distance — focus there and everything from half that distance to infinity is sharp. Maximise depth of field for landscapes. In your browser.',
    lead: 'Enter your sensor, focal length and aperture to get the hyperfocal distance — the focus point that maximises sharpness to infinity.',
    how: 'The hyperfocal distance is the closest focus point that still keeps the horizon acceptably sharp. It\'s H = focal² ÷ (f-number × circle of confusion) + focal. Focus there and the depth of field runs from half the hyperfocal distance all the way to infinity — the deepest possible sharpness for that lens and aperture.',
    note: 'This is the classic landscape technique: rather than focusing on the horizon (which wastes near sharpness) or the foreground (which loses the distance), focus at the hyperfocal distance for the most front-to-back sharpness. Wider lenses and smaller apertures bring it closer, letting you keep nearby foreground sharp too.',
    faqs: [
      { q: 'What is the hyperfocal distance?', a: 'The nearest distance you can focus at while keeping objects at infinity acceptably sharp. Focusing there gives the maximum depth of field — from half the hyperfocal distance to infinity.' },
      { q: 'How do I calculate hyperfocal distance?', a: 'H = focal length² ÷ (f-number × circle of confusion) + focal length. For a 24mm lens at f/8 on full frame it\'s about 2.5 m, so focusing at 2.5 m keeps everything from ~1.25 m to infinity sharp.' },
      { q: 'How do I use hyperfocal focusing for landscapes?', a: 'Set your aperture (often f/8–f/11), find the hyperfocal distance for your lens, and focus there — not on the horizon. Everything from half that distance to infinity will be sharp, maximising front-to-back detail.' },
      { q: 'Why not just focus at infinity?', a: 'Focusing at infinity keeps distant objects sharp but wastes the depth of field that could extend toward you — your foreground goes soft sooner. Focusing at the hyperfocal distance captures the nearest possible sharp foreground while still holding the horizon.' },
      { q: 'What affects the hyperfocal distance?', a: 'It shrinks (comes closer) with a wider lens, a smaller aperture (higher f-number), and a smaller sensor. A wide lens at f/11 can have a hyperfocal distance of a metre or two, making near-to-far sharpness easy.' },
    ],
    keywords: ['hyperfocal distance calculator', 'hyperfocal calculator', 'landscape focus calculator', 'hyperfocal distance chart', 'maximum depth of field', 'focus for landscapes', 'hyperfocal focusing'],
  },
  {
    slug: 'time-lapse-calculator',
    name: 'Time-Lapse Calculator',
    icon: '⏱️',
    widget: 'timelapse',
    description: 'Plan a time-lapse: calculate the shooting time, interval, number of photos, final clip length and card space needed. In your browser.',
    lead: 'Enter your shooting time, interval and playback frame rate to get the final clip length, number of photos and storage needed.',
    how: 'A time-lapse plays many still photos back as video. The number of photos is the shooting time divided by the interval between shots; the clip length is that photo count divided by the playback frame rate. The tool also estimates the memory-card space from your photo file size.',
    note: 'A shorter interval makes smoother, longer footage but needs many more frames and much more card space. As a rule, capturing enough for even a short clip takes a long shoot — an hour at a 5-second interval yields only about 24 seconds of 30 fps video.',
    faqs: [
      { q: 'How do I calculate a time-lapse?', a: 'Photos = shooting time ÷ interval; final clip length = photos ÷ playback frame rate. Shooting for 1 hour at a 5-second interval gives about 720 photos, which at 30 fps is roughly a 24-second clip.' },
      { q: 'What interval should I use for a time-lapse?', a: 'It depends on the motion: 1–3 seconds for fast clouds or traffic, 5–15 seconds for slow clouds or crowds, and 20–30+ seconds for stars or sunsets. Shorter intervals give smoother but shorter results per hour of shooting.' },
      { q: 'How many photos do I need for a time-lapse?', a: 'At least the playback frame rate × the desired clip length — for a 10-second clip at 30 fps you need 300 photos. The tool works out the count from your interval and shooting time.' },
      { q: 'How much storage does a time-lapse need?', a: 'Photos × file size. Shooting RAW (20–40 MB each) for thousands of frames adds up fast — a long time-lapse can easily fill many gigabytes. The tool estimates the card space from your photo size.' },
      { q: 'How long should I shoot a time-lapse?', a: 'Work backwards: for an N-second clip at F fps you need N×F photos, so shooting time = N×F×interval. A 20-second, 30 fps clip at a 4-second interval needs 600 photos and 40 minutes of shooting.' },
    ],
    keywords: ['time lapse calculator', 'timelapse calculator', 'time lapse interval calculator', 'time lapse length calculator', 'timelapse photos calculator', 'time lapse planner', 'interval calculator photography'],
  },
  {
    slug: 'print-resolution-calculator',
    name: 'Print Size & Resolution Calculator',
    icon: '🖨️',
    widget: 'print',
    description: 'Calculate the maximum print size from your image\'s pixel dimensions at a given DPI — and the megapixels and print quality. In your browser.',
    lead: 'Enter your image\'s pixel dimensions and target DPI to get the maximum print size, megapixels and a quality rating.',
    how: 'Print size in inches is simply the pixel count divided by the print resolution in DPI (dots per inch). The tool works out the print\'s width and height at your chosen DPI, the image\'s megapixels, and rates the quality — 300 DPI is the gold standard for photo prints, while large posters look fine at much less.',
    note: 'Viewing distance matters: a billboard printed at 20 DPI looks sharp from across the street, while a photo book needs 300 DPI up close. So a lower DPI isn\'t "worse" — it\'s appropriate for bigger prints seen from farther away.',
    faqs: [
      { q: 'How big can I print my photo?', a: 'Divide the pixel dimensions by the DPI. A 6000 × 4000 pixel (24 MP) image prints about 20 × 13 inches at 300 DPI, or a much larger 40 × 27 inches at 150 DPI for a poster.' },
      { q: 'What DPI should I print at?', a: '300 DPI for sharp photo prints viewed up close, 200 DPI for good quality, and 150 DPI or less for large prints and posters seen from a distance. The right DPI depends on viewing distance.' },
      { q: 'How many megapixels do I need to print?', a: 'For a quality 8 × 10 inch print at 300 DPI you need about 7 MP; for 16 × 20 inches, about 29 MP. But you can print much bigger at lower DPI for wall art viewed from a distance.' },
      { q: 'What is DPI vs PPI?', a: 'PPI (pixels per inch) describes the digital image; DPI (dots per inch) describes the printed output. In everyday use they\'re used interchangeably for print resolution — pixels ÷ inches.' },
      { q: 'Can I print a low-resolution image large?', a: 'Yes, if it\'ll be viewed from a distance — the lower the DPI, the larger you can print, and big prints are rarely inspected up close. Upscaling software can also add pixels, though it can\'t create true new detail.' },
    ],
    keywords: ['print resolution calculator', 'print size calculator', 'dpi calculator', 'megapixels to print size', 'ppi calculator print', 'photo print size calculator', 'image size for printing'],
  },
  {
    slug: 'sunny-16-calculator',
    name: 'Sunny 16 Exposure Calculator',
    icon: '🔆',
    widget: 'sunny16',
    description: 'Get correct exposure settings without a light meter using the Sunny 16 rule — shutter speeds for each light condition and aperture, from your ISO. In your browser.',
    lead: 'Enter your ISO and aperture to get the right shutter speed for every light condition, using the Sunny 16 rule.',
    how: 'The Sunny 16 rule says that in bright sunlight at f/16, the correct shutter speed is about 1 ÷ ISO seconds. From that anchor, each softer light condition needs one more stop of light (a wider aperture or slower shutter). The tool builds the table for your ISO and chosen aperture, so you can expose by eye.',
    note: 'It\'s a starting point based on incident sunlight, not a replacement for a meter — but it\'s remarkably reliable outdoors and a great way to learn how aperture, shutter and ISO relate. It also rescues you when a meter fails or you\'re shooting film without one.',
    faqs: [
      { q: 'What is the Sunny 16 rule?', a: 'A guideline for exposure without a meter: in bright sun, set the aperture to f/16 and the shutter speed to 1 ÷ ISO seconds (ISO 100 → 1/100 s). Softer light needs wider apertures or slower shutters.' },
      { q: 'How does Sunny 16 work for cloudy weather?', a: 'Each step of softer light opens up by a stop from f/16: f/11 for hazy sun, f/8 for cloudy-bright, f/5.6 for overcast, f/4 for heavy overcast or open shade. The tool shows the matching shutter for your settings.' },
      { q: 'What shutter speed for ISO 400 in sun?', a: 'By Sunny 16, about 1/400 s at f/16 in bright sun. At f/8 (two stops brighter) you\'d use 1/1600 s to keep the same exposure. The tool calculates it for any ISO and aperture.' },
      { q: 'Is the Sunny 16 rule accurate?', a: 'Surprisingly so for outdoor daylight — it\'s based on the fairly constant intensity of direct sunlight. It\'s a reliable starting point, though you should adjust for backlight, very light or dark subjects, and check results.' },
      { q: 'Why learn Sunny 16 with modern cameras?', a: 'It teaches how aperture, shutter and ISO trade off, gives you a sanity check on your meter, and lets you shoot confidently in tricky metering situations or with fully manual/film cameras.' },
    ],
    keywords: ['sunny 16 calculator', 'sunny 16 rule', 'exposure without meter', 'sunny 16 chart', 'film exposure calculator', 'daylight exposure calculator', 'sunny sixteen rule'],
  },
];

export const getPhotographyTool = (slug: string) => PHOTOGRAPHY_TOOLS.find((t) => t.slug === slug);
