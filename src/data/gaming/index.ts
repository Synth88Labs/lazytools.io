/** Gaming tools — calculators, converters and generators for gamers. Client-side only. */

export type GamingWidget =
  | 'sens' | 'edpi' | 'kda' | 'pokemon' | 'mc-circle' | 'mc-stack'
  | 'gacha' | 'dice-prob' | 'fov' | 'teams';

export interface GamingToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: GamingWidget;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const GAMING_TOOLS: GamingToolDef[] = [
  {
    slug: 'mouse-sensitivity-converter',
    name: 'Mouse Sensitivity Converter',
    icon: '🖱️',
    description: 'Convert your mouse sensitivity between games (Valorant, CS2, Apex, Overwatch 2 and more) so your aim feels identical. In your browser.',
    lead: 'Convert your sensitivity from one game to another so the same flick covers the same distance. Pick the games and enter your current sens.',
    widget: 'sens',
    how: 'Every game turns your view by a slightly different amount per mouse count, a value called yaw. To keep your muscle memory, you want the same real-world distance to turn you 360 degrees (your cm/360) in both games, at the same DPI. The conversion is newSens = oldSens × (oldGameYaw ÷ newGameYaw), because the DPI term cancels out. This tool stores the yaw for popular titles and does the arithmetic instantly in your browser, so your aim carries over.',
    note: 'This converts the in-game sensitivity value while keeping your mouse DPI the same. It covers games that use the standard yaw model (Source-engine titles, Valorant, Apex, Overwatch 2 and similar). Games with bespoke sensitivity systems, like Fortnite\'s percentage sliders or Rainbow Six Siege, do not map cleanly and are not listed. If you change DPI as well, adjust proportionally.',
    faqs: [
      { q: 'How do I convert sensitivity between games?', a: 'Match your cm/360 (the mouse distance for a full turn) at the same DPI. The formula is newSens = oldSens × oldGameYaw ÷ newGameYaw. This tool has the yaw values built in, so you just pick both games and enter your current sensitivity.' },
      { q: 'What is cm/360?', a: 'cm/360 is how many centimetres you move your mouse to turn a full 360 degrees in game. It is the truest measure of sensitivity because it is independent of DPI and in-game numbers, keeping it equal across games keeps your aim consistent.' },
      { q: 'Does DPI need to be the same?', a: 'This converter assumes you keep the same DPI and only change the in-game value, which is the usual case. If you also change DPI, scale the result by oldDPI ÷ newDPI to keep the same cm/360.' },
      { q: 'Why is Fortnite or Rainbow Six not listed?', a: 'Those games use non-standard sensitivity systems (percentage sliders, custom curves) that do not share the simple yaw model, so a clean one-number conversion is not possible. The listed games all use the standard model.' },
      { q: 'Is anything uploaded?', a: 'No. The conversion runs entirely in your browser.' },
    ],
    keywords: ['mouse sensitivity converter', 'sensitivity converter', 'valorant to cs2 sensitivity', 'cs2 to valorant sens', 'apex sensitivity converter', 'cm/360 calculator'],
  },
  {
    slug: 'edpi-calculator',
    name: 'eDPI Calculator',
    icon: '🎯',
    description: 'Calculate eDPI (effective DPI) from your mouse DPI and in-game sensitivity to compare your aim settings fairly with anyone. In your browser.',
    lead: 'Enter your mouse DPI and in-game sensitivity to get your eDPI, the number that lets you compare settings with any other player.',
    widget: 'edpi',
    how: 'eDPI, effective DPI, is simply your mouse DPI multiplied by your in-game sensitivity. Because two players can reach the same real sensitivity with different DPI-and-sens combinations (800 DPI at 2.0 equals 1600 DPI at 1.0), the raw sens number alone is meaningless for comparison. eDPI multiplies them into one figure you can compare directly against pros or teammates in the same game. It computes instantly in your browser.',
    note: 'eDPI is only comparable within the same game, because each game scales its sensitivity differently. To compare across games, use cm/360 or the mouse sensitivity converter instead. Lower eDPI means slower, more precise aim; most competitive FPS players sit in a surprisingly low range.',
    faqs: [
      { q: 'What is eDPI?', a: 'eDPI (effective DPI) is mouse DPI × in-game sensitivity. It collapses two separate settings into one number so you can compare your true sensitivity with other players in the same game, regardless of which DPI they use.' },
      { q: 'How do I calculate eDPI?', a: 'Multiply your mouse DPI by your in-game sensitivity. For example, 800 DPI × 1.6 sens = 1,280 eDPI. This tool does it instantly.' },
      { q: 'What is a good eDPI?', a: 'It depends on the game, but competitive FPS players typically use lower eDPI for precision. Compare yours against pros in the same title rather than chasing a universal number; consistency matters more than any specific value.' },
      { q: 'Can I compare eDPI across different games?', a: 'No. Each game scales sensitivity differently, so eDPI is only meaningful within one game. To match your aim across games, use cm/360 or a sensitivity converter.' },
      { q: 'Is my data uploaded?', a: 'No. The calculation runs in your browser.' },
    ],
    keywords: ['edpi calculator', 'effective dpi calculator', 'what is edpi', 'edpi valorant', 'how to calculate edpi', 'mouse sensitivity edpi'],
  },
  {
    slug: 'kda-calculator',
    name: 'KDA Calculator',
    icon: '⚔️',
    description: 'Calculate your KDA ratio and K/D from kills, assists and deaths for any game. Instant, in your browser.',
    lead: 'Enter your kills, assists and deaths to get your KDA ratio and your K/D.',
    widget: 'kda',
    how: 'KDA measures combat performance by combining kills and assists against deaths. The standard formula is (kills + assists) ÷ deaths, which rewards both finishing and contributing. This tool also shows K/D (kills ÷ deaths) for games that track that instead. When deaths are zero, the calculation treats them as one to avoid dividing by zero, giving a sensible "perfect game" figure. It runs instantly in your browser.',
    note: 'KDA rewards assists, which matters in team games like League of Legends and Overwatch where enabling kills is as valuable as securing them. K/D ignores assists and suits pure fraggers. Neither captures objectives, utility or clutch factor, so treat them as one signal of performance, not the whole story.',
    faqs: [
      { q: 'How is KDA calculated?', a: 'KDA = (kills + assists) ÷ deaths. For example, 12 kills, 8 assists and 5 deaths is (12 + 8) ÷ 5 = 4.0 KDA. If deaths are zero, they are counted as one so the number stays meaningful.' },
      { q: 'What is the difference between KDA and K/D?', a: 'K/D (kills ÷ deaths) counts only kills against deaths. KDA adds assists into the numerator, rewarding players who help secure kills, which is why team-based games favour KDA while pure shooters often show K/D.' },
      { q: 'What is a good KDA?', a: 'A KDA above 1 means you contribute more than you die; competitive players often aim for 3 or higher. The bar varies by game, role and mode, support and objective roles may post higher KDA with fewer kills.' },
      { q: 'Why count a zero-death game as one death?', a: 'Dividing by zero is undefined, so a perfect, no-death game would break the formula. Treating deaths as one gives a clean, high number that reflects the flawless game without an error.' },
      { q: 'Is anything uploaded?', a: 'No. The calculation runs locally in your browser.' },
    ],
    keywords: ['kda calculator', 'kd calculator', 'kill death ratio calculator', 'how to calculate kda', 'kda ratio', 'kd ratio calculator'],
  },
  {
    slug: 'pokemon-type-calculator',
    name: 'Pokémon Type Calculator',
    icon: '🔴',
    description: 'See a Pokémon\'s weaknesses and resistances from its type(s). Full Gen 6+ type chart, instant, in your browser.',
    lead: 'Pick a Pokémon\'s type (up to two) to instantly see what it is weak to, resists and is immune to.',
    widget: 'pokemon',
    how: 'Every Pokémon takes more or less damage depending on the attacking move\'s type versus its own type(s). This calculator uses the full modern (Generation 6 and later) type chart: pick one or two defending types and it multiplies the chart values across them to show the combined matchups, grouped into double-weak (×4), weak (×2), resisted (×½), doubly resisted (×¼) and immune (×0). It is the fast way to plan a counter or build a team, computed instantly in your browser.',
    note: 'Dual types can create extremes: a Grass/Ground Pokémon is ×4 weak to Ice, while some combinations gain immunities (Ground is immune to Electric). This tool shows defensive matchups (what hurts your Pokémon); offensive coverage is the inverse. The chart reflects the current 18-type generation and does not include older-generation quirks.',
    faqs: [
      { q: 'How do I find a Pokémon\'s weaknesses?', a: 'Select its type or types here. The tool multiplies the type chart across both and lists everything that hits for ×4, ×2, ×½, ×¼ or ×0, so you can see exactly what to attack with and what to avoid.' },
      { q: 'How do dual-type weaknesses work?', a: 'Multiply the two types\' multipliers for the attacking type. If both types are weak (×2 each) you get ×4, if one is weak and the other resists (×2 and ×½) they cancel to ×1, and if either is immune (×0) the whole thing is ×0.' },
      { q: 'Which generation is the type chart from?', a: 'This uses the Generation 6 and later chart, the current 18 types including Fairy and the updated Steel and Ghost interactions. It matches modern games.' },
      { q: 'Does this show offensive or defensive matchups?', a: 'Defensive, what hurts or resists a Pokémon of the chosen type(s). For offence, flip it: a type your Pokémon is weak to is one that other Pokémon of that type would take super-effective damage from.' },
      { q: 'Is anything uploaded?', a: 'No. The whole chart runs in your browser.' },
    ],
    keywords: ['pokemon type calculator', 'pokemon weakness calculator', 'pokemon type chart', 'pokemon type effectiveness', 'what is super effective against', 'pokemon dual type weakness'],
  },
  {
    slug: 'minecraft-circle-generator',
    name: 'Minecraft Circle Generator',
    icon: '🟩',
    description: 'Generate a pixel-perfect circle or sphere outline for Minecraft builds at any diameter. Block-by-block grid, in your browser.',
    lead: 'Choose a diameter to get a block-by-block circle you can copy into your Minecraft build, hollow or filled.',
    widget: 'mc-circle',
    how: 'Minecraft has no curves, only blocks, so a "circle" is really a careful staircase of blocks that approximates one. This generator computes which cells of a grid fall on a circle of your chosen diameter, using a distance test from the centre, and draws them as blocks. Toggle between a hollow outline (for rings, towers and domes) and a filled disc, and read off the exact block count. It renders instantly in your browser.',
    note: 'Odd diameters give a circle with a single centre block and are usually the cleanest; even diameters share the centre across four blocks. For a sphere or dome, build stacked circles of changing diameter. Very large circles look rounder because the block stair-stepping becomes proportionally smaller.',
    faqs: [
      { q: 'How do I make a circle in Minecraft?', a: 'Because Minecraft uses blocks, a circle is an approximation. Pick a diameter here, and the generator shows exactly which blocks to place for a round outline. Build the highlighted blocks row by row.' },
      { q: 'What is the best diameter for a clean circle?', a: 'Odd diameters (like 7, 9, 13) tend to look cleaner because they have a single central block and symmetric sides. Larger diameters always look rounder because the stair-stepping is smaller relative to the whole.' },
      { q: 'How do I build a sphere or dome?', a: 'Stack circles of changing diameter: start small, grow to the full diameter at the middle, then shrink again. Generating each layer\'s circle here and stacking them produces a sphere or dome.' },
      { q: 'What is the difference between hollow and filled?', a: 'Hollow gives just the ring of blocks, ideal for towers, pools and rings. Filled gives a solid disc, ideal for floors and platforms. Toggle between them and the block count updates.' },
      { q: 'Is anything uploaded?', a: 'No. The circle is generated in your browser.' },
    ],
    keywords: ['minecraft circle generator', 'pixel circle generator', 'minecraft circle chart', 'minecraft sphere generator', 'how to make a circle in minecraft', 'minecraft round build'],
  },
  {
    slug: 'minecraft-stack-calculator',
    name: 'Minecraft Stack Calculator',
    icon: '📦',
    description: 'Convert a number of Minecraft items into stacks, chests, double chests and shulker boxes. Handles 64, 16 and 1 stack sizes.',
    lead: 'Enter how many items you have to see how many stacks, chests and shulker boxes they fill.',
    widget: 'mc-stack',
    how: 'Minecraft storage is counted in stacks and containers of fixed size: most items stack to 64, some (like ender pearls and signs) to 16, and tools stack to 1. A chest has 27 slots, a double chest 54, and a shulker box 27. This calculator divides your item count by the stack size and by each container\'s capacity, so you instantly know how many stacks, chests and shulkers you need. It runs in your browser.',
    note: 'A shulker box holds 27 stacks, the same slots as a single chest, but it keeps its contents when broken, which is why it is the unit of choice for sorting and transport. A double chest filled with shulker boxes holds an enormous amount: 54 boxes × 27 stacks × 64 items. Pick the right stack size for your item, as it changes every total.',
    faqs: [
      { q: 'How many items are in a stack in Minecraft?', a: 'Most items stack to 64. Some stack to 16 (ender pearls, snowballs, eggs, signs, honey bottles), and tools, weapons, armour and potions do not stack at all (stack size 1). Choose the matching stack size for an accurate total.' },
      { q: 'How many items fit in a chest?', a: 'A single chest has 27 slots, so 27 × 64 = 1,728 of a normal item. A double chest has 54 slots (3,456 items). A shulker box also has 27 slots. This tool converts any item count into chests and shulkers.' },
      { q: 'How many stacks are in a shulker box?', a: 'A shulker box holds 27 slots, so 27 full stacks, which is 1,728 of a 64-stack item. Shulkers keep their contents when mined, making them the standard unit for storage and transport.' },
      { q: 'How do I count non-stacking items?', a: 'Set the stack size to 1. Tools, armour, potions and similar items each take a full slot, so 27 of them fill a chest and the stack count equals the item count.' },
      { q: 'Is anything uploaded?', a: 'No. The math runs in your browser.' },
    ],
    keywords: ['minecraft stack calculator', 'minecraft stacks to items', 'how many items in a stack minecraft', 'minecraft chest calculator', 'shulker box calculator', 'minecraft inventory calculator'],
  },
  {
    slug: 'gacha-probability-calculator',
    name: 'Gacha Probability Calculator',
    icon: '🎰',
    description: 'Calculate your real chance of pulling a gacha unit over multiple pulls, and how many pulls you need for 50/90/99% odds. In your browser.',
    lead: 'Enter the drop rate and how many pulls you have to see your real chance of getting at least one, and the pulls needed for better odds.',
    widget: 'gacha',
    how: 'A single pull\'s drop rate is misleadingly small, but over many pulls the odds of getting at least one add up. The chance of at least one success in n independent pulls is 1 − (1 − p)^n, where p is the per-pull rate. This calculator applies that formula and also inverts it to tell you how many pulls you need for 50%, 90% and 99% confidence. It computes instantly in your browser, so you can plan your spending with real numbers instead of hope.',
    note: 'This assumes each pull is independent at a flat rate. Many gacha games add a pity system (a guaranteed drop after a set number of pulls) and rate-ups, which this simple model does not include, so your real odds on those games are usually better than the flat estimate once pity is near. Still, the base formula is the honest starting point.',
    faqs: [
      { q: 'How do I calculate gacha pull probability?', a: 'The chance of at least one success in n pulls is 1 − (1 − p)^n, where p is the drop rate as a decimal. For a 0.6% rate over 90 pulls, that is 1 − (1 − 0.006)^90 ≈ 42%. This tool does it for you.' },
      { q: 'Why is my chance lower than I expect?', a: 'Because low per-pull rates compound slowly. Even 90 pulls at 0.6% leaves a large chance of nothing, which is exactly why pity systems exist. The maths is unintuitive: getting to 90% confidence often takes far more pulls than people guess.' },
      { q: 'How many pulls do I need to be almost guaranteed?', a: 'The tool shows the pulls needed for 50%, 90% and 99% confidence at your rate. Note that reaching 99% takes many more pulls than 50%, each extra nine of certainty costs roughly the same number of pulls again.' },
      { q: 'Does this account for pity systems?', a: 'No. This uses a flat, independent rate. Games with pity (a guaranteed drop after N pulls) or rate-ups give better real odds near the pity threshold, so treat this as the no-pity baseline.' },
      { q: 'Is anything uploaded?', a: 'No. The probability is computed in your browser.' },
    ],
    keywords: ['gacha probability calculator', 'gacha calculator', 'genshin pull calculator', 'drop rate calculator', 'chance of at least one', 'gacha odds calculator'],
  },
  {
    slug: 'dice-probability-calculator',
    name: 'Dice Probability Calculator',
    icon: '🎲',
    description: 'Calculate the probability of any sum with any number of dice and sides, exactly, at least or at most, with a distribution chart. In your browser.',
    lead: 'Choose the number of dice, sides and a target sum to see the exact odds, plus the full probability distribution.',
    widget: 'dice-prob',
    how: 'Rolling several dice and adding them produces a bell-shaped distribution, not a flat one, because middle sums can be made many ways while extremes can be made only one way. This calculator computes the exact distribution for any number of dice with any number of sides by counting every combination, then gives you the probability of hitting a target sum exactly, at least, or at most, and draws the full distribution. It is ideal for tabletop RPGs and board games, and it runs in your browser.',
    note: 'The classic example is 2d6: a sum of 7 is the most likely (six ways to make it) while 2 and 12 are rarest (one way each). Adding more dice makes the distribution narrower and more sharply peaked around the average. This covers independent, fair dice; weighted or exploding dice are not modelled.',
    faqs: [
      { q: 'What are the odds of rolling a 7 with two dice?', a: 'With two six-sided dice there are 36 equally likely outcomes and six of them sum to 7, so the probability is 6 ÷ 36 = 16.67%, the highest of any sum. This calculator shows this and the odds for every other sum.' },
      { q: 'Why is 7 more likely than 2 or 12 on 2d6?', a: 'Because there are more ways to make a middle sum. A 7 can be rolled as 1+6, 2+5, 3+4 and their reverses (six ways), while a 2 can only be 1+1 (one way). More combinations means higher probability.' },
      { q: 'How do I calculate probability for multiple dice?', a: 'Count the number of combinations that produce each sum and divide by the total number of outcomes (sides^dice). This tool does the counting for any number of dice and sides and shows exact, at-least and at-most probabilities.' },
      { q: 'What does the chart show?', a: 'The full probability distribution: each bar is the chance of that sum, with your target highlighted. It makes the bell shape of multi-dice rolls obvious at a glance.' },
      { q: 'Is anything uploaded?', a: 'No. The distribution is computed in your browser.' },
    ],
    keywords: ['dice probability calculator', 'dice odds calculator', 'probability of rolling', '2d6 probability', 'dnd dice probability', 'dice roll statistics'],
  },
  {
    slug: 'fov-calculator',
    name: 'FOV Calculator',
    icon: '👁️',
    description: 'Convert field of view (FOV) between aspect ratios so your view feels the same on 16:9, 21:9, 4:3 and ultrawide monitors. In your browser.',
    lead: 'Enter a horizontal FOV and convert it between aspect ratios so the game feels the same on any monitor.',
    widget: 'fov',
    how: 'Field of view set as a single number means different things on different aspect ratios, because most games scale FOV horizontally (Hor+). To keep the same vertical view, and therefore the same feel, when you change monitors, you recompute the horizontal FOV. This calculator converts using vFOV = 2·atan(tan(hFOV/2) ÷ aspect) and back out at the new aspect, so a 90° FOV on 4:3 becomes the matching wider number on 16:9 or 21:9. It computes instantly in your browser.',
    note: 'Hor+ (horizontal-plus) is the common scaling where a wider monitor shows more at the sides while keeping the same vertical view, which is what this tool matches. Some older games use Vert- scaling, which crops instead, there, a wider monitor shows less vertically. Knowing which your game uses tells you whether an ultrawide helps or hurts your view.',
    faqs: [
      { q: 'How do I convert FOV between aspect ratios?', a: 'Keep the vertical FOV constant and recompute horizontal for the new aspect: vFOV = 2·atan(tan(hFOV/2) ÷ aspect), then the new hFOV = 2·atan(tan(vFOV/2) × newAspect). This tool does it, so a 4:3 FOV becomes its matching 16:9 or 21:9 value.' },
      { q: 'What is Hor+ and Vert- FOV scaling?', a: 'Hor+ (horizontal-plus) widens your view at the sides on wider monitors while keeping the vertical view, which most modern games use. Vert- crops the top and bottom instead, so an ultrawide shows less vertically. This tool matches Hor+.' },
      { q: 'What FOV should I use on an ultrawide monitor?', a: 'Set the FOV that gives you the vertical view you like, then this converter shows the matching horizontal number on 21:9 or 32:9, so your aim and sense of space stay consistent with a 16:9 setup.' },
      { q: 'Why does my FOV feel different on a new monitor?', a: 'Because the same FOV number produces a different vertical view at a different aspect ratio. Converting it (keeping vertical FOV constant) restores the familiar feel; this tool gives you that converted value.' },
      { q: 'Is anything uploaded?', a: 'No. The conversion runs in your browser.' },
    ],
    keywords: ['fov calculator', 'field of view calculator', 'fov converter aspect ratio', 'ultrawide fov calculator', 'hor+ fov', '16:9 to 21:9 fov'],
  },
  {
    slug: 'random-team-generator',
    name: 'Random Team Generator',
    icon: '👥',
    description: 'Randomly split a list of names into balanced teams for games, sports and group projects. Fair shuffle, in your browser.',
    lead: 'Paste your names, choose how many teams, and get a fair random split in one click.',
    widget: 'teams',
    how: 'This generator shuffles your list of names with a Fisher-Yates shuffle, the standard algorithm for an unbiased random order, then deals them out round-robin into the number of teams you choose. Round-robin dealing keeps the teams as even in size as possible, so eight names across two teams give four and four, and seven names give four and three. Every shuffle is fresh and fair, and it all runs in your browser.',
    note: 'The split is purely random and balanced only by count, not by skill. For pickup games that is exactly what you want; for competitive balance you would seed or captain-pick instead. Because it runs locally, you can reshuffle as many times as you like and nothing you enter is stored or uploaded.',
    faqs: [
      { q: 'How do I randomly split people into teams?', a: 'Paste one name per line, choose the number of teams, and click shuffle. The tool randomises the order fairly and deals names out evenly, giving you balanced-size teams instantly.' },
      { q: 'Are the teams balanced?', a: 'They are balanced in size, as even as the numbers allow (round-robin dealing), but not by skill. The split is purely random, which is ideal for casual and pickup games.' },
      { q: 'Is the shuffle actually random?', a: 'Yes. It uses the Fisher-Yates shuffle, the standard unbiased shuffling algorithm, so every arrangement is equally likely. Reshuffle as often as you like for a fresh split.' },
      { q: 'Can I make more than two teams?', a: 'Yes, choose any number from 2 to 12. Names are dealt evenly across all of them, so sizes stay as equal as possible.' },
      { q: 'Is my list uploaded?', a: 'No. The names stay in your browser and are never sent anywhere.' },
    ],
    keywords: ['random team generator', 'team randomizer', 'random team picker', 'split into teams', 'group generator', 'random group maker'],
  },
];
