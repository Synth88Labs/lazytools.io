/** Home & DIY material-estimator registry. One entry drives a /home/ page. */

export interface HomeToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'paint' | 'tile' | 'concrete' | 'mulch' | 'wallpaper'
    | 'gravel' | 'drywall' | 'roofing' | 'lawn' | 'fence' | 'deck' | 'boardfoot';
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

HOME_TOOLS.push(
  {
    slug: 'gravel-calculator',
    name: 'Gravel & Aggregate Calculator',
    icon: '🪨',
    widget: 'gravel',
    description: 'Calculate how much gravel, stone or aggregate you need — the volume and the weight in tonnes — from the area and depth. Metric or imperial, in your browser.',
    lead: 'Enter the area to cover and the depth, and get the gravel volume and weight in tonnes (or US tons), plus bulk-bag count.',
    how: 'Gravel is a volume job: area × depth. The tool converts your length, width and depth into a volume, then multiplies by the material’s density to get the weight. Gravel and crushed stone typically weigh about 1.4–1.6 tonnes per cubic metre; you can change the density for your specific material.',
    note: 'Density varies by stone type and moisture — pea gravel, crushed rock and sand differ — so adjust the figure for an accurate weight. Suppliers usually sell aggregate by the tonne or bulk bag (about 0.5–0.8 m³).',
    faqs: [
      { q: 'How much gravel do I need?', a: 'Multiply the area by the depth to get the volume, then multiply by the density for the weight. For 20 m² at 5 cm deep: 20 × 0.05 = 1 m³ ≈ 1.5 tonnes of gravel.' },
      { q: 'How deep should a gravel layer be?', a: 'About 5 cm (2 in) for a decorative topping, and 10–15 cm (4–6 in) or more, over a sub-base, for a driveway that bears vehicle weight.' },
      { q: 'How much does gravel weigh?', a: 'Roughly 1.4–1.6 tonnes per cubic metre (about 1.2–1.4 US tons per cubic yard), depending on the stone and moisture. Enter the specific density if you know it.' },
      { q: 'How many bulk bags is that?', a: 'A bulk (jumbo) bag holds about 0.5–0.8 m³, so divide your volume by the bag size. For loose delivery, order by the tonne.' },
      { q: 'Does this work for sand and crushed stone?', a: 'Yes — enter the appropriate density (sand ≈ 1.6 t/m³, crushed stone ≈ 1.5 t/m³) and the tool gives the volume and weight.' },
    ],
    keywords: ['gravel calculator', 'aggregate calculator', 'how much gravel do i need', 'stone calculator', 'gravel tonnes calculator', 'crushed stone calculator'],
  },
  {
    slug: 'drywall-calculator',
    name: 'Drywall & Plasterboard Calculator',
    icon: '🧱',
    widget: 'drywall',
    description: 'Calculate how many sheets of drywall (plasterboard) you need for walls and ceilings — from the area, sheet size and a waste allowance. Metric or imperial, in your browser.',
    lead: 'Enter the wall or ceiling area and your sheet size, add a waste allowance, and get the number of drywall sheets to buy.',
    how: 'The tool divides the total area by the area of one sheet, then adds a waste percentage for cuts and offcuts. A standard sheet is 4 × 8 ft (32 sq ft ≈ 2.97 m²), though 4 × 12 ft and 1.2 × 2.4 m sheets are also common — enter your sheet size.',
    note: 'Allow about 10–15% waste for cuts around doors, windows and corners. Buy a spare sheet or two — a single damaged board mid-job is annoying, and offcuts are handy for patches.',
    faqs: [
      { q: 'How many sheets of drywall do I need?', a: 'Divide the wall and ceiling area by the area of one sheet, then add ~10–15% for waste. For 60 m² with 2.97 m² sheets: 60 ÷ 2.97 ≈ 21 sheets, plus waste ≈ 23–24.' },
      { q: 'What size is a standard drywall sheet?', a: 'In the US, 4 × 8 ft (32 sq ft); 4 × 12 ft is common for pros. In the UK/EU, plasterboard is often 1.2 × 2.4 m (2.88 m²). Enter your sheet size.' },
      { q: 'How much waste should I allow?', a: 'About 10% for simple rooms, up to 15% for rooms with many openings, angles or short walls where offcuts can’t be reused.' },
      { q: 'Do I count the ceiling?', a: 'Yes if you’re boarding it — add the ceiling area (length × width) to the wall area before dividing by the sheet size.' },
      { q: 'How much joint compound and tape do I need?', a: 'As a rough guide, about 0.5 kg of compound and 1 m of tape per m² of drywall, but this varies with the number of joints and coats.' },
    ],
    keywords: ['drywall calculator', 'plasterboard calculator', 'how many sheets of drywall', 'sheetrock calculator', 'drywall sheets needed', 'gypsum board calculator'],
  },
  {
    slug: 'roofing-calculator',
    name: 'Roofing Calculator',
    icon: '🏠',
    widget: 'roofing',
    description: 'Calculate roof area, roofing squares and shingle bundles from the footprint and pitch. Accounts for slope. Metric or imperial, in your browser.',
    lead: 'Enter your roof’s footprint and pitch, and get the true sloped area, the number of roofing squares and shingle bundles to order.',
    how: 'A pitched roof is larger than its footprint. The tool multiplies the footprint area by a slope factor — √(1 + (rise/run)²) — to get the true roof area, then converts to roofing squares (100 sq ft each) and shingle bundles (typically 3 bundles per square).',
    note: 'Add ~10–15% for waste, ridge caps, valleys and starter courses. This estimates one plane by footprint × slope factor; for complex roofs, add up each section. Always follow the shingle manufacturer’s coverage.',
    faqs: [
      { q: 'How do I calculate roof area from the footprint?', a: 'Multiply the footprint area by the slope factor √(1 + (rise/run)²). A 4/12 pitch has a factor of about 1.054, so a 100 m² footprint is about 105 m² of roof.' },
      { q: 'What is a roofing square?', a: 'A unit of roof area equal to 100 square feet (about 9.29 m²). Roofing materials are often quoted per square — asphalt shingles usually come 3 bundles to the square.' },
      { q: 'How many bundles of shingles do I need?', a: 'Divide the roof area by 100 sq ft to get squares, then multiply by 3 bundles per square (check your product). Add 10–15% for waste, ridges and valleys.' },
      { q: 'What is roof pitch?', a: 'The steepness, given as rise over a 12-unit run (e.g. 4/12 rises 4 inches per 12 across). Steeper pitches mean more roof area for the same footprint.' },
      { q: 'How much extra should I order?', a: 'About 10% for a simple gable roof and up to 15% for hips and valleys, plus starter and ridge-cap shingles.' },
    ],
    keywords: ['roofing calculator', 'roof area calculator', 'shingle calculator', 'roofing squares calculator', 'how many shingles do i need', 'roof pitch calculator'],
  },
  {
    slug: 'sod-grass-seed-calculator',
    name: 'Sod & Grass Seed Calculator',
    icon: '🌿',
    widget: 'lawn',
    description: 'Calculate how much sod (turf) or grass seed you need for a lawn — rolls and pallets, or seed weight — from the area. Metric or imperial, in your browser.',
    lead: 'Enter your lawn area and choose sod or seed: get the number of turf rolls and pallets, or the weight of grass seed to buy.',
    how: 'For sod, the tool divides the lawn area by the coverage of a turf roll (about 1 m² each) and a pallet (about 50 m²), adding a little for trimming. For seed, it multiplies the area by the seeding rate (grams per m² or pounds per 1,000 sq ft) for a new lawn or overseeding.',
    note: 'Typical new-lawn seeding is about 35 g/m² (1.5–2 lb per 1,000 sq ft); overseeding an existing lawn uses roughly half. Sod gives an instant lawn but costs more; seed is cheaper but slower. Add ~5% for shaping curved edges.',
    faqs: [
      { q: 'How much sod do I need?', a: 'Divide the lawn area by the coverage of one roll or pallet, then add ~5% for cuts and curves. For 200 m² with 1 m² rolls: about 210 rolls, or roughly 4 pallets.' },
      { q: 'How much grass seed do I need?', a: 'Multiply the area by the seeding rate. For a new lawn at 35 g/m², 100 m² needs about 3.5 kg of seed; overseeding uses about half that.' },
      { q: 'What is the difference between sod and seed?', a: 'Sod (turf) is pre-grown grass laid for an instant lawn — more expensive but immediate. Seed is far cheaper but takes weeks to establish and needs careful watering.' },
      { q: 'How big is a roll or pallet of sod?', a: 'Rolls vary by supplier but are often about 1 m² (or 2 × 0.5 m); a pallet typically covers around 50 m² (about 500 sq ft). Enter your supplier’s figures.' },
      { q: 'How much extra should I buy?', a: 'About 5% for sod to allow for trimming around edges and beds. For seed, a little extra covers thin spots and bare patches.' },
    ],
    keywords: ['sod calculator', 'grass seed calculator', 'turf calculator', 'how much sod do i need', 'how much grass seed', 'lawn calculator', 'sod pallets'],
  },
  {
    slug: 'fence-calculator',
    name: 'Fence Calculator',
    icon: '🪵',
    widget: 'fence',
    description: 'Calculate fence materials — posts, panels/sections and rails — from the fence length and post spacing. Metric or imperial, in your browser.',
    lead: 'Enter your fence length and post spacing, and get the number of posts, panels or sections, and rails you’ll need.',
    how: 'The number of sections is the fence length divided by the post spacing (rounded up), and the number of posts is the sections plus one (an extra for the final end). The tool also estimates rails, using two or three per section depending on the fence height.',
    note: 'A common post spacing is 2.4 m (8 ft) for panel fencing. Corners and gates need extra posts, and gate openings interrupt the run — plan those separately.',
    faqs: [
      { q: 'How many fence posts do I need?', a: 'Divide the fence length by the post spacing and round up to get the number of sections, then add one post for the far end. A 30 m fence at 2.4 m spacing needs 13 sections and 14 posts.' },
      { q: 'What is the standard fence post spacing?', a: 'About 2.4 m (8 ft) for panel fencing, or the width of your panels. Closer spacing is stronger and better in windy or exposed spots.' },
      { q: 'How many rails per section?', a: 'Two rails for fences up to about 1.2 m, and three for taller fences, to keep the boards straight and rigid. The tool uses this rule.' },
      { q: 'Do corners and gates need extra posts?', a: 'Yes — each corner and each side of a gate needs its own post, and gate posts should be heavier. Add these to the estimate for your layout.' },
      { q: 'How deep should fence posts be set?', a: 'Usually about a third of the above-ground height, or at least 600 mm (2 ft), set in concrete for stability — deeper for tall or exposed fences.' },
    ],
    keywords: ['fence calculator', 'fence post calculator', 'how many fence posts', 'fencing calculator', 'fence panels calculator', 'fence materials'],
  },
  {
    slug: 'deck-calculator',
    name: 'Deck Board Calculator',
    icon: '🪜',
    widget: 'deck',
    description: 'Calculate how many deck boards and how much decking you need — from the deck size, board width and gap. Metric or imperial, in your browser.',
    lead: 'Enter your deck dimensions and board size, and get the number of deck boards, the total decking length and the joists needed.',
    how: 'The number of board rows is the deck width divided by the board width plus the gap between boards. Multiplying by the deck length gives the total linear decking, and dividing by the board length gives the number of boards. Joists are estimated from the deck length and the joist spacing.',
    note: 'Leave a small gap (about 3–5 mm) between boards for drainage and expansion. Add ~10% for waste and cuts, and buy a few spares — board colour and grade can vary between packs.',
    faqs: [
      { q: 'How many deck boards do I need?', a: 'Divide the deck width by the board width plus the gap to get the number of rows, multiply by the deck length for total decking, then divide by the board length. Add ~10% for waste.' },
      { q: 'What gap should I leave between deck boards?', a: 'About 3–5 mm (⅛–³⁄₁₆ in) for timber, to allow drainage and seasonal movement. Composite boards have their own recommended gaps — check the manufacturer.' },
      { q: 'How far apart should deck joists be?', a: 'Commonly 400–600 mm (16–24 in) on centre, closer for thinner boards or diagonal decking. Follow local building guidance for structural decks.' },
      { q: 'How much decking waste should I allow?', a: 'About 10% for cuts and offcuts, more for diagonal or patterned layouts. Keep a couple of spare boards for repairs.' },
      { q: 'Does this include the frame?', a: 'It estimates the deck boards and joists; posts, beams and fixings depend on your design and ground conditions, so plan those separately.' },
    ],
    keywords: ['deck calculator', 'deck board calculator', 'how many deck boards', 'decking calculator', 'deck materials calculator', 'decking boards needed'],
  },
  {
    slug: 'board-foot-calculator',
    name: 'Board Foot Calculator',
    icon: '📏',
    widget: 'boardfoot',
    description: 'Calculate board feet of lumber from thickness, width and length — and the total for any quantity, with optional cost. Free, in-browser.',
    lead: 'Enter a board’s thickness, width and length to get its board feet — and the total (and cost) for any number of boards.',
    how: 'A board foot is 144 cubic inches of wood — a piece 1 inch thick, 12 inches wide and 1 foot long. The formula is (thickness × width × length in inches) ÷ 144, or (thickness_in × width_in × length_ft) ÷ 12. Multiply by the number of boards, and by the price per board foot for the cost.',
    note: 'Board feet measure volume, so a thicker board of the same face size counts as more. Hardwood is usually priced per board foot; softwood is often sold by the linear foot or piece.',
    faqs: [
      { q: 'How do I calculate board feet?', a: 'Board feet = (thickness × width × length, all in inches) ÷ 144. A 1 × 6 board that’s 8 ft (96 in) long is 1 × 6 × 96 ÷ 144 = 4 board feet.' },
      { q: 'What is a board foot?', a: 'A unit of lumber volume equal to 144 cubic inches — nominally a board 1 inch thick, 12 inches wide and 1 foot long. It’s the standard way hardwood is sold in North America.' },
      { q: 'How is board foot different from linear foot?', a: 'A linear (running) foot measures length only; a board foot measures volume (thickness × width × length). Two boards of the same length but different widths have different board feet.' },
      { q: 'Should I use nominal or actual dimensions?', a: 'For rough (unplaned) hardwood, use the actual thickness (often quoted in quarters, e.g. 4/4 = 1 in). For dimensional softwood, note that nominal sizes (2 × 4) are larger than actual (1.5 × 3.5 in).' },
      { q: 'How do I work out the cost?', a: 'Multiply the total board feet by the price per board foot. Enter a price and the tool shows the total cost.' },
    ],
    keywords: ['board foot calculator', 'board feet calculator', 'lumber calculator', 'how to calculate board feet', 'bf lumber calculator', 'wood board foot'],
  },
);

export const getHomeTool = (slug: string) => HOME_TOOLS.find((t) => t.slug === slug);
