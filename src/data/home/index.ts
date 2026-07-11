/** Home & DIY material-estimator registry. One entry drives a /home/ page. */

export interface HomeToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'paint' | 'tile' | 'concrete' | 'mulch' | 'wallpaper';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const HOME_TOOLS: HomeToolDef[] = [
  {
    slug: 'paint-calculator',
    name: 'Paint Calculator',
    icon: '🎨',
    widget: 'paint',
    description: 'Calculate how much paint you need for a room — from wall dimensions, coats and coverage, minus doors and windows. Metric or imperial, in your browser.',
    lead: 'Enter your room’s dimensions, the number of coats and your paint’s coverage, and get how much paint to buy — with doors and windows subtracted.',
    how: 'The wall area is the room perimeter times the height: 2 × (length + width) × height. The tool subtracts the area of doors and windows, multiplies by the number of coats, and divides by the paint’s coverage rate (how much area one litre or gallon covers) to give the paint needed. Add a little extra for touch-ups and buy whole cans.',
    note: 'Coverage varies by paint and surface — a typical emulsion covers about 10–12 m² per litre (≈ 350–400 sq ft per gallon), but porous or textured walls soak up more. Check the tin and adjust the coverage figure.',
    faqs: [
      { q: 'How much paint do I need for a room?', a: 'Work out the wall area (2 × (length + width) × height), subtract doors and windows, multiply by the number of coats, and divide by the paint’s coverage rate. For a 4 × 3 m room, 2.4 m high, two coats at 11 m²/L, that’s about 6 litres.' },
      { q: 'How many coats of paint should I apply?', a: 'Two coats is standard for good, even coverage. Use three when painting a light colour over a dark one, or on bare or patchy surfaces. One coat rarely looks even.' },
      { q: 'What is paint coverage?', a: 'The area one unit of paint covers — commonly 10–12 m² per litre or 350–400 sq ft per gallon for emulsion. Rough, porous or previously unpainted surfaces cover less, so use the lower figure.' },
      { q: 'Should I subtract doors and windows?', a: 'For a rough estimate you can ignore small openings, but subtracting them (a standard door is about 1.8–2 m²) avoids over-buying on rooms with lots of glazing.' },
      { q: 'How much extra paint should I buy?', a: 'Round up to whole cans and keep a little spare for touch-ups. Buying slightly over from the same batch avoids colour mismatches later.' },
    ],
    keywords: ['paint calculator', 'how much paint do i need', 'paint coverage calculator', 'wall paint calculator', 'room paint estimator', 'litres of paint'],
  },
  {
    slug: 'tile-calculator',
    name: 'Tile & Flooring Calculator',
    icon: '🔲',
    widget: 'tile',
    description: 'Calculate how many tiles or boxes you need for a floor or wall — from the area, tile size and a waste allowance. Metric or imperial, in your browser.',
    lead: 'Enter the area to cover and your tile size, add a waste allowance, and get the number of tiles and boxes to buy.',
    how: 'The tool divides the total area (length × width) by the area of a single tile to get the base tile count, then adds a waste percentage for cuts, breakages and future repairs. If you enter a box quantity, it also tells you how many boxes to buy, rounding up.',
    note: 'Allow 10% waste for a simple straight layout, and 15–20% for diagonal or herringbone patterns or a room with many cuts. Keeping a few spare tiles from the same batch is wise for future repairs.',
    faqs: [
      { q: 'How many tiles do I need?', a: 'Divide the area to cover by the area of one tile, then add a waste allowance (typically 10%). For 12 m² with 0.3 × 0.3 m tiles: 12 ÷ 0.09 = 134 tiles, plus 10% ≈ 148.' },
      { q: 'How much waste should I allow for tiles?', a: 'About 10% for a standard straight layout, and 15–20% for diagonal, herringbone or heavily cut rooms. Add extra if you want spares for future repairs.' },
      { q: 'How do I work out boxes of tiles?', a: 'Divide the total tiles needed (including waste) by the number of tiles per box and round up. Enter the box quantity and the tool does this for you.' },
      { q: 'Does this work for wall tiles and flooring?', a: 'Yes — the maths is the same for any tiled surface. Just enter the area of the wall or floor and the tile size.' },
      { q: 'Should I buy from the same batch?', a: 'Yes — tile colour can vary slightly between production batches, so buy all you need (plus spares) at once from the same batch number.' },
    ],
    keywords: ['tile calculator', 'how many tiles do i need', 'flooring calculator', 'tile estimator', 'tiles per square meter', 'floor tile calculator'],
  },
  {
    slug: 'concrete-calculator',
    name: 'Concrete Calculator',
    icon: '🧱',
    widget: 'concrete',
    description: 'Calculate the volume of concrete for a slab, footing or path — and the number of pre-mix bags — from length, width and thickness. Metric or imperial, in your browser.',
    lead: 'Enter the length, width and thickness of your slab or footing to get the concrete volume and the number of pre-mix bags to buy.',
    how: 'Concrete volume is length × width × thickness. The tool computes it in cubic metres (or cubic feet/yards), then divides by the yield of a pre-mix bag to estimate the bags needed. A little extra is added because concrete settles and spills, and part-bags round up.',
    note: 'Pre-mix bag yields differ: a 20 kg bag makes roughly 0.009–0.011 m³, an 80 lb bag about 0.6 ft³. For anything structural, over-order slightly — running short mid-pour is far worse than a spare bag.',
    faqs: [
      { q: 'How do I calculate concrete volume?', a: 'Multiply length × width × thickness, all in the same units. A 3 × 2 m slab, 0.1 m thick, is 3 × 2 × 0.1 = 0.6 m³ of concrete.' },
      { q: 'How many bags of concrete do I need?', a: 'Divide the volume by the yield of one bag. If a 20 kg bag yields about 0.01 m³, a 0.6 m³ slab needs roughly 60 bags — so for large pours, ready-mix delivery is usually cheaper.' },
      { q: 'How much extra concrete should I order?', a: 'Add about 5–10%: concrete settles, spills and sub-grades are rarely perfectly level. Running out during a pour creates a weak cold joint, so it’s better to have a little spare.' },
      { q: 'What thickness should a slab be?', a: 'It depends on the load — commonly 100 mm (4 in) for paths and patios, more for driveways or structural slabs. Follow local building guidance for load-bearing work.' },
      { q: 'Does this handle footings and columns?', a: 'Yes for rectangular shapes — enter the length, width and depth. For round columns, multiply π × radius² × height separately.' },
    ],
    keywords: ['concrete calculator', 'how much concrete do i need', 'concrete volume calculator', 'concrete bags calculator', 'cubic yards concrete', 'slab concrete calculator'],
  },
  {
    slug: 'mulch-soil-calculator',
    name: 'Mulch & Soil Calculator',
    icon: '🌱',
    widget: 'mulch',
    description: 'Calculate how much mulch, topsoil or compost you need — in cubic yards, cubic metres or bags — from the bed area and depth. Metric or imperial, in your browser.',
    lead: 'Enter your garden bed’s area and the depth you want to cover, and get the mulch or soil volume in cubic yards, cubic metres and bags.',
    how: 'The volume is area × depth. The tool converts your bed’s length and width and the desired depth into a volume, shown in cubic metres, cubic yards and litres, and estimates bags from a typical bag size. Deeper layers and larger beds need proportionally more.',
    note: 'A mulch layer is usually 5–8 cm (2–3 in) deep to suppress weeds and retain moisture; topsoil for a new bed is often deeper. Bulk delivery is far cheaper than bags once you pass roughly a cubic metre.',
    faqs: [
      { q: 'How much mulch do I need?', a: 'Multiply the bed area by the depth. For a 10 m² bed at 7.5 cm deep: 10 × 0.075 = 0.75 m³ (about 1 cubic yard) of mulch.' },
      { q: 'How deep should mulch be?', a: 'About 5–8 cm (2–3 inches) for most beds — enough to suppress weeds and hold moisture without smothering plants. Keep mulch away from plant stems and tree trunks.' },
      { q: 'How many bags of mulch or soil is that?', a: 'Divide the volume by the bag size (bagged mulch is often 50–75 litres / 2 cubic feet). The tool estimates bags, but bulk delivery is cheaper for larger volumes.' },
      { q: 'What is a cubic yard of mulch?', a: 'About 0.76 m³ — it covers roughly 10 m² (≈ 100 sq ft) at 7.5 cm (3 in) deep. Suppliers usually sell bulk mulch and soil by the cubic yard or cubic metre.' },
      { q: 'Does this work for compost and gravel too?', a: 'Yes — any material spread to a depth. Enter the area and depth; for gravel you can then convert the volume to weight using its density.' },
    ],
    keywords: ['mulch calculator', 'soil calculator', 'topsoil calculator', 'how much mulch do i need', 'cubic yards calculator', 'compost calculator', 'garden bed soil'],
  },
  {
    slug: 'wallpaper-calculator',
    name: 'Wallpaper Calculator',
    icon: '🧻',
    widget: 'wallpaper',
    description: 'Calculate how many rolls of wallpaper you need for a room — from the wall dimensions, roll size and pattern repeat. Metric or imperial, in your browser.',
    lead: 'Enter your room’s perimeter and height and the roll dimensions, and get how many rolls of wallpaper to buy — allowing for the pattern repeat.',
    how: 'The tool works out how many full drops (strips from ceiling to floor) each roll yields, given the wall height plus an allowance for trimming and pattern matching, then how many drops the room needs (perimeter ÷ roll width). Dividing one by the other, and rounding up, gives the number of rolls. A larger pattern repeat wastes more and needs more rolls.',
    note: 'A standard roll is about 10 m long and 0.53 m wide. Pattern repeats — especially large or “drop match” ones — increase waste because each strip must be aligned, so always round up and buy a spare roll from the same batch.',
    faqs: [
      { q: 'How many rolls of wallpaper do I need?', a: 'Find how many full-height strips one roll gives (roll length ÷ (wall height + trim + pattern repeat)), then how many strips the room needs (wall perimeter ÷ roll width), and divide. Round up and add a spare roll.' },
      { q: 'What is a pattern repeat?', a: 'The vertical distance before the design repeats. To line up adjacent strips you must waste up to one repeat per drop, so large repeats mean more rolls. A “free match” or plain paper wastes the least.' },
      { q: 'What size is a standard wallpaper roll?', a: 'Commonly about 10 metres long and 0.53 metres wide (a “Euro roll”), covering roughly 5 m². American rolls differ, so enter your roll’s actual dimensions.' },
      { q: 'Should I include doors and windows?', a: 'Using the full perimeter without subtracting openings gives a safe estimate and accounts for waste and matching. For large openings you can reduce the count slightly, but it’s safer to over-order.' },
      { q: 'Why buy from the same batch?', a: 'Wallpaper colour can vary between print batches. Buy all your rolls (plus a spare) with the same batch number so they match on the wall.' },
    ],
    keywords: ['wallpaper calculator', 'how many rolls of wallpaper', 'wallpaper rolls calculator', 'wallpaper estimator', 'wallpaper quantity', 'rolls of wallpaper needed'],
  },
];

export const getHomeTool = (slug: string) => HOME_TOOLS.find((t) => t.slug === slug);
