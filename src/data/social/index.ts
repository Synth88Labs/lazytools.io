/** Social & Creator calculators — deterministic marketing/creator math, client-side. */

export type SocialWidget =
  | 'engagement' | 'cpm' | 'cpc' | 'ctr' | 'roas' | 'cpa'
  | 'youtube' | 'tiktok' | 'follower-growth' | 'influencer-rate';

export interface SocialToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: SocialWidget;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const SOCIAL_TOOLS: SocialToolDef[] = [
  {
    slug: 'engagement-rate-calculator',
    name: 'Engagement Rate Calculator',
    icon: '💬',
    description: 'Calculate your social media engagement rate from likes, comments, shares and followers. Instant, in your browser, nothing uploaded.',
    lead: 'Enter your likes, comments, shares and follower count to get your engagement rate, the single number brands look at most.',
    widget: 'engagement',
    how: 'Engagement rate measures how actively your audience interacts with your content relative to its size. The most common formula divides total interactions (likes, comments, shares and saves) by your follower count and multiplies by 100 to get a percentage. This calculator does that instantly. A higher rate means a more responsive, valuable audience, which is why it often matters more to brands than raw follower count. Everything is computed in your browser; nothing is sent anywhere.',
    note: 'Engagement rate by followers is the standard, but you can also measure it by reach or impressions (interactions ÷ reach), which tends to be higher because reach is usually smaller than follower count. Rates vary a lot by platform and audience size: smaller accounts often post higher percentages than mega-accounts.',
    faqs: [
      { q: 'What is a good engagement rate?', a: 'It depends on platform and size, but as a rough guide: under 1% is low, 1 to 3% is average, 3 to 6% is strong, and above 6% is excellent. Smaller accounts tend to see higher rates than very large ones, so compare against accounts of similar size.' },
      { q: 'How is engagement rate calculated?', a: 'The common formula is (likes + comments + shares + saves) ÷ followers × 100. Some people measure it against reach or impressions instead of followers, which usually gives a higher number because reach is smaller than total followers.' },
      { q: 'Why does engagement rate matter more than followers?', a: 'A large but inactive following produces few interactions and little real influence. Engagement rate shows how many people actually respond to your content, which predicts reach, trust and conversions far better than a follower count that may include inactive or bought accounts.' },
      { q: 'Should I use followers or reach in the formula?', a: 'Use followers for a stable, comparable number that brands recognise. Use reach when you want to know how engaging a specific post was relative to the people who actually saw it. Be consistent so your numbers stay comparable over time.' },
      { q: 'Is my data uploaded?', a: 'No. The calculation runs in your browser and nothing you enter is sent to a server.' },
    ],
    keywords: ['engagement rate calculator', 'social media engagement rate', 'instagram engagement rate', 'how to calculate engagement rate', 'engagement rate formula', 'tiktok engagement rate'],
  },
  {
    slug: 'cpm-calculator',
    name: 'CPM Calculator',
    icon: '📣',
    description: 'Calculate CPM (cost per 1,000 impressions) from ad spend and impressions. Instant marketing math in your browser.',
    lead: 'Enter your ad spend and impressions to get CPM, the cost to reach one thousand people.',
    widget: 'cpm',
    how: 'CPM stands for cost per mille, Latin for cost per thousand, and it is the price of 1,000 ad impressions. The formula is spend ÷ impressions × 1,000. It is the standard way to compare the cost of reach across campaigns, platforms and placements, because it normalises spend to a fixed number of views. This calculator computes it instantly in your browser.',
    note: 'CPM measures the cost of reach, not results. A low CPM is cheap exposure but says nothing about whether people clicked or bought, for that you want CPC, CTR, CPA and ROAS. Use CPM to compare awareness buys; use the others to judge performance.',
    faqs: [
      { q: 'What is CPM?', a: 'CPM is cost per 1,000 impressions (mille is Latin for thousand). It tells you how much you pay to show your ad a thousand times, which makes it easy to compare the cost of reach across platforms and campaigns.' },
      { q: 'How do you calculate CPM?', a: 'CPM = total ad spend ÷ impressions × 1,000. For example, $500 spent for 120,000 impressions is $500 ÷ 120,000 × 1,000 = $4.17 CPM.' },
      { q: 'What is a good CPM?', a: 'It varies hugely by platform, audience and season. There is no universal "good" number; compare your CPM against your own past campaigns and against the same platform and targeting. Highly specific audiences and competitive seasons push CPM up.' },
      { q: 'Is a lower CPM always better?', a: 'Not necessarily. A low CPM means cheap reach, but cheap reach that does not convert is wasted. Always read CPM alongside click-through rate and cost per acquisition to know whether the cheap impressions are actually working.' },
      { q: 'Is anything uploaded?', a: 'No. The math runs entirely in your browser.' },
    ],
    keywords: ['cpm calculator', 'cost per mille', 'cost per thousand impressions', 'how to calculate cpm', 'cpm formula', 'advertising cpm'],
  },
  {
    slug: 'cpc-calculator',
    name: 'CPC Calculator',
    icon: '🖱️',
    description: 'Calculate CPC (cost per click) from ad spend and clicks. Quick advertising math, in your browser.',
    lead: 'Enter your ad spend and number of clicks to get your cost per click.',
    widget: 'cpc',
    how: 'CPC, cost per click, is how much you pay on average for each click on your ad. The formula is simply spend ÷ clicks. It tells you the cost of getting someone to act on an ad rather than merely see it, which is why it is a core metric for performance campaigns. This calculator returns it instantly, computed in your browser.',
    note: 'CPC depends on your click-through rate and your bid: a more relevant ad with a higher CTR usually earns a lower CPC because platforms reward engagement. To judge whether a CPC is worthwhile, compare it to the value of a click, how often clicks turn into customers and what each customer is worth.',
    faqs: [
      { q: 'What is CPC?', a: 'CPC is cost per click, the average amount you pay each time someone clicks your ad. It is calculated as total spend ÷ total clicks and is a key efficiency metric for paid traffic.' },
      { q: 'How do I lower my CPC?', a: 'Improve ad relevance and click-through rate (better creative, tighter targeting, stronger offers), since platforms reward engaging ads with cheaper clicks. Refining keywords and audiences and removing poor performers also helps.' },
      { q: 'What is the difference between CPC and CPM?', a: 'CPC charges per click (performance); CPM charges per 1,000 impressions (reach). CPC ties cost to action, while CPM ties cost to exposure. Many campaigns track both to balance awareness and response.' },
      { q: 'What is a good CPC?', a: 'It varies by industry, platform and competition. Compare against your own history and, crucially, against the value of a click: a $2 CPC is excellent if a click is worth $10 and terrible if it is worth $0.50.' },
      { q: 'Is my data uploaded?', a: 'No. The calculation is done locally in your browser.' },
    ],
    keywords: ['cpc calculator', 'cost per click calculator', 'how to calculate cpc', 'cpc formula', 'average cost per click', 'ppc cpc'],
  },
  {
    slug: 'ctr-calculator',
    name: 'CTR Calculator',
    icon: '👆',
    description: 'Calculate click-through rate (CTR) from clicks and impressions. Instant marketing math, in your browser.',
    lead: 'Enter clicks and impressions to get your click-through rate as a percentage.',
    widget: 'ctr',
    how: 'Click-through rate (CTR) is the percentage of people who clicked after seeing your ad, link or email. The formula is clicks ÷ impressions × 100. It measures how compelling your creative and targeting are at turning views into clicks, and it directly affects your costs: higher CTR usually means cheaper clicks and better ad placement. This calculator computes it instantly in your browser.',
    note: 'A "good" CTR depends entirely on context, a search ad, a display banner, an email and an organic search result all have very different typical rates. Display banners often sit well under 1%, while a well-matched search ad or email can be several percent. Compare like with like.',
    faqs: [
      { q: 'What is click-through rate (CTR)?', a: 'CTR is the share of viewers who clicked, calculated as clicks ÷ impressions × 100. It shows how effective your headline, creative and targeting are at earning a click from the people who saw your content.' },
      { q: 'What is a good CTR?', a: 'It depends heavily on the channel. Display banner ads often run below 1%, search ads commonly land a few percent, and a well-targeted email can be higher still. Benchmark against the same channel and your own past results.' },
      { q: 'How is CTR calculated?', a: 'CTR = clicks ÷ impressions × 100. For example, 450 clicks from 30,000 impressions is 450 ÷ 30,000 × 100 = 1.5%.' },
      { q: 'Why does CTR matter?', a: 'A higher CTR usually lowers your cost per click and improves ad rank, because platforms favour ads people engage with. It also signals that your message matches your audience, which tends to improve everything downstream.' },
      { q: 'Is anything sent to a server?', a: 'No. The CTR is computed in your browser.' },
    ],
    keywords: ['ctr calculator', 'click through rate calculator', 'how to calculate ctr', 'ctr formula', 'click-through rate', 'email ctr calculator'],
  },
  {
    slug: 'roas-calculator',
    name: 'ROAS Calculator',
    icon: '💹',
    description: 'Calculate ROAS (return on ad spend) from revenue and ad spend. See how many dollars you earn per dollar spent.',
    lead: 'Enter the revenue your ads generated and what you spent to get your return on ad spend.',
    widget: 'roas',
    how: 'ROAS, return on ad spend, tells you how many dollars of revenue each dollar of advertising produced. The formula is revenue ÷ ad spend, usually shown as a ratio (for example 4×) or a percentage (400%). It is the headline profitability metric for ad campaigns: a ROAS of 4 means $4 back for every $1 spent. This calculator returns both the ratio and the percentage, computed in your browser.',
    note: 'ROAS measures revenue, not profit. A ROAS of 4 can still lose money if your margins, shipping and overhead eat more than 75% of revenue. Work out your break-even ROAS (1 ÷ profit margin) and aim comfortably above it. ROAS also depends on accurate revenue attribution.',
    faqs: [
      { q: 'What is ROAS?', a: 'ROAS is return on ad spend: the revenue generated for every dollar spent on advertising, calculated as revenue ÷ ad spend. A ROAS of 5 means you earned $5 in revenue for each $1 of ad spend.' },
      { q: 'What is a good ROAS?', a: 'It depends on your margins. A common rule of thumb is 4× (400%) for ecommerce, but the real target is your break-even ROAS, which is 1 ÷ profit margin. If your margin is 25%, you break even at 4×; above that you profit.' },
      { q: 'What is the difference between ROAS and ROI?', a: 'ROAS compares revenue to ad spend only. ROI (return on investment) compares profit to total cost, including product, shipping and overhead. ROAS is simpler and ad-focused; ROI is the fuller profitability picture.' },
      { q: 'How do I calculate break-even ROAS?', a: 'Break-even ROAS = 1 ÷ profit margin. For a 20% margin, that is 1 ÷ 0.20 = 5×, so you need a ROAS above 5 to profit. Use this as the floor your campaigns must clear.' },
      { q: 'Is my data uploaded?', a: 'No. Everything is calculated locally in your browser.' },
    ],
    keywords: ['roas calculator', 'return on ad spend', 'how to calculate roas', 'roas formula', 'break even roas', 'advertising roi'],
  },
  {
    slug: 'cpa-calculator',
    name: 'CPA Calculator',
    icon: '🎯',
    description: 'Calculate CPA (cost per acquisition) from ad spend and conversions. Know what each customer costs you.',
    lead: 'Enter your ad spend and number of conversions to get your cost per acquisition.',
    widget: 'cpa',
    how: 'CPA, cost per acquisition (or cost per action), is how much you pay on average to win one conversion, a sale, sign-up or lead. The formula is spend ÷ conversions. It is the bottom-line efficiency metric for performance marketing, because it ties your ad budget directly to results rather than to clicks or impressions. This calculator computes it instantly in your browser.',
    note: 'CPA is only useful next to customer value. A $30 CPA is a bargain if each customer is worth $200 and a disaster if they are worth $20. Compare CPA to your average order value or customer lifetime value to know whether a campaign is actually profitable.',
    faqs: [
      { q: 'What is CPA?', a: 'CPA is cost per acquisition: the average ad spend needed to produce one conversion (a sale, sign-up or lead), calculated as spend ÷ conversions. It connects your budget directly to results.' },
      { q: 'How is CPA calculated?', a: 'CPA = total ad spend ÷ number of conversions. For example, $1,200 spent for 48 conversions is $1,200 ÷ 48 = $25 per acquisition.' },
      { q: 'What is a good CPA?', a: 'A good CPA is comfortably below the value of a customer. Compare CPA to your average order value or customer lifetime value: if a customer is worth $150 and your CPA is $30, the campaign is healthy.' },
      { q: 'What is the difference between CPA and CPC?', a: 'CPC is the cost of a click; CPA is the cost of a conversion. Many clicks do not convert, so CPA is always higher than CPC and is the truer measure of whether ad spend turns into customers.' },
      { q: 'Is anything uploaded?', a: 'No. The calculation runs in your browser.' },
    ],
    keywords: ['cpa calculator', 'cost per acquisition calculator', 'cost per action', 'how to calculate cpa', 'cpa formula', 'marketing cpa'],
  },
  {
    slug: 'youtube-money-calculator',
    name: 'YouTube Money Calculator',
    icon: '▶️',
    description: 'Estimate YouTube ad earnings from views and RPM. Set your own RPM range for a realistic estimate. In your browser.',
    lead: 'Enter your monthly views and an RPM range to estimate your YouTube ad revenue.',
    widget: 'youtube',
    how: 'YouTube pays creators a share of ad revenue, usually described as RPM, revenue per 1,000 views, which is what you actually keep after YouTube takes its cut (roughly 45% of ad revenue). Estimated earnings are views ÷ 1,000 × RPM. Because RPM swings enormously by niche, audience location and season, this calculator takes a low and a high RPM and shows a realistic range rather than a single misleading number. It computes in your browser.',
    note: 'RPM is not the same as CPM. CPM is what advertisers pay before YouTube\'s share; RPM is what lands in your pocket after the split and after factoring in views that show no ads. Finance, tech and business niches tend to command much higher RPM than entertainment or gaming. Ad revenue is also only one income stream, sponsorships, memberships and merch often earn more.',
    faqs: [
      { q: 'How much does YouTube pay per 1,000 views?', a: 'It varies widely by niche and audience, but creator RPM commonly falls somewhere between about $1 and $5 per 1,000 views, and can be higher in finance or business niches and lower in entertainment. This tool lets you set a low and high RPM to bracket your estimate.' },
      { q: 'What is the difference between CPM and RPM?', a: 'CPM is what advertisers pay per 1,000 ad impressions before YouTube\'s cut; RPM is your revenue per 1,000 video views after YouTube takes roughly 45% and after accounting for views that did not show ads. RPM is the number that matters for your earnings.' },
      { q: 'Why is my estimate a range?', a: 'Because real RPM is not fixed, it depends on your niche, where viewers are, the time of year and how many videos are monetised. A range (low RPM to high RPM) is far more honest than a single guess.' },
      { q: 'Does this include sponsorships and memberships?', a: 'No. This estimates ad revenue only. Many creators earn more from sponsorships, channel memberships, Super Thanks and merchandise than from ads, so your total income can be well above this figure.' },
      { q: 'Is my data uploaded?', a: 'No. The estimate is calculated in your browser.' },
    ],
    keywords: ['youtube money calculator', 'youtube earnings calculator', 'how much does youtube pay', 'youtube rpm calculator', 'youtube ad revenue', 'youtube income estimator'],
  },
  {
    slug: 'tiktok-money-calculator',
    name: 'TikTok Money Calculator',
    icon: '🎵',
    description: 'Estimate TikTok Creativity Program earnings from qualified views. Adjustable per-1,000-views rate. In your browser.',
    lead: 'Enter your qualified views and a per-1,000-views rate to estimate your TikTok creator earnings.',
    widget: 'tiktok',
    how: 'TikTok\'s Creativity Program pays eligible creators for qualified views on longer videos (generally over one minute). Payouts are often described per 1,000 qualified views, so estimated earnings are views ÷ 1,000 × rate. Reported rates vary, so this calculator takes a low and high rate and shows a range. It runs entirely in your browser.',
    note: 'Not all views qualify: videos must meet length and eligibility rules, and only "qualified" views count, which can be a fraction of total views. Rates also change over time and differ by region. Treat the output as a rough ballpark, and remember creators often earn far more from brand deals and the Creator Marketplace than from the program itself.',
    faqs: [
      { q: 'How much does TikTok pay per 1,000 views?', a: 'Under the Creativity Program, widely-cited estimates put payouts roughly in the range of $0.40 to $1.00 per 1,000 qualified views, much higher than the old Creator Fund. Actual rates vary by region, content and time, so treat any figure as an estimate.' },
      { q: 'What counts as a qualified view?', a: 'Qualified views are views that meet TikTok\'s eligibility rules for the Creativity Program, which generally require original videos longer than one minute and exclude certain view types. Only qualified views earn, so they are usually fewer than your total views.' },
      { q: 'Why is the earnings figure an estimate?', a: 'Because the real rate is not published as a fixed number and depends on region, content type, engagement and how many of your views qualify. A low-to-high range is more realistic than a single number.' },
      { q: 'Do creators earn more from brand deals?', a: 'Very often, yes. Sponsorships, affiliate links and the TikTok Creator Marketplace frequently out-earn program payouts, especially for creators with engaged niche audiences.' },
      { q: 'Is anything uploaded?', a: 'No. The estimate is computed locally in your browser.' },
    ],
    keywords: ['tiktok money calculator', 'tiktok earnings calculator', 'how much does tiktok pay', 'tiktok creativity program', 'tiktok creator fund calculator', 'tiktok income'],
  },
  {
    slug: 'follower-growth-calculator',
    name: 'Follower Growth Calculator',
    icon: '📈',
    description: 'Project your future follower count from a monthly growth rate, compounded. Plan milestones. In your browser.',
    lead: 'Enter your current followers, a monthly growth rate and a time horizon to project your future audience.',
    widget: 'follower-growth',
    how: 'Follower growth compounds: each month\'s new followers become part of the base that grows next month. This calculator projects your audience as current followers × (1 + monthly rate)^months, the compound-growth formula, and shows both the projected total and the net gain. It is a quick way to set realistic milestones and see the power of steady, compounding growth. Everything computes in your browser.',
    note: 'Real growth is rarely a smooth percentage, viral posts, algorithm changes and seasonality make it lumpy, so treat the projection as a planning guide, not a promise. A modest but consistent monthly rate compounds into surprisingly large numbers over a year or two, which is the real lesson of the calculation.',
    faqs: [
      { q: 'How do I project follower growth?', a: 'Use compound growth: projected followers = current × (1 + monthly rate)^months. For example, 10,000 followers growing 8% a month for 12 months projects to about 25,000. This tool does the compounding for you.' },
      { q: 'What is a realistic monthly growth rate?', a: 'It varies by platform, niche and effort, but steady accounts often grow a few percent a month, while fast-growing ones can exceed 10%. Early, small accounts can post high percentages simply because the base is small.' },
      { q: 'Why use compound growth instead of simple addition?', a: 'Because each month\'s gains add to the base that grows next month, exactly like compound interest. Simple addition undercounts long-term growth; compounding reflects how audiences actually snowball.' },
      { q: 'Is this a guarantee of growth?', a: 'No. It is a projection based on a constant rate. Real growth is uneven, so use it to set goals and understand compounding, not to predict exact numbers.' },
      { q: 'Is my data uploaded?', a: 'No. The projection is calculated in your browser.' },
    ],
    keywords: ['follower growth calculator', 'instagram growth calculator', 'social media growth projection', 'follower milestone calculator', 'audience growth rate', 'tiktok follower growth'],
  },
  {
    slug: 'influencer-rate-calculator',
    name: 'Influencer Rate Calculator',
    icon: '🤝',
    description: 'Estimate a fair sponsored-post rate from your follower count and engagement rate. A ballpark to negotiate from.',
    lead: 'Enter your followers and engagement rate to get a ballpark sponsored-post price range.',
    widget: 'influencer-rate',
    how: 'There is no official price list for sponsored content, but a widely-used rule of thumb starts around $10 per 1,000 followers and adjusts up or down for engagement, because an engaged audience is worth more than a passive one. This calculator applies that baseline, scales it by your engagement rate, and shows a negotiating range. It is a starting point, computed in your browser, not a quote.',
    note: 'Real rates depend on far more than followers: niche, content quality, exclusivity, usage rights, deliverables (a single story costs less than a produced video), and the brand\'s budget. High-engagement micro-influencers often command rates well above the baseline because their audiences convert. Use this as an anchor, then negotiate on value.',
    faqs: [
      { q: 'How much should I charge for a sponsored post?', a: 'A common starting point is about $10 per 1,000 followers, adjusted for engagement, niche and deliverables. So a 25,000-follower account might anchor around $250 and move up for strong engagement or more work. Treat it as a floor to negotiate from, not a fixed price.' },
      { q: 'Does engagement rate affect my rate?', a: 'Yes, significantly. Brands pay for results, and an engaged audience converts better, so high-engagement accounts, especially micro-influencers, often charge well above the per-follower baseline. This calculator scales the estimate by your engagement rate.' },
      { q: 'What else affects influencer pricing?', a: 'Niche and buying power of the audience, content format (a produced video costs more than a story), exclusivity, usage and licensing rights, turnaround time, and the brand\'s budget. These can move the real price far from any simple per-follower figure.' },
      { q: 'Is the number a guaranteed rate?', a: 'No. It is a ballpark to anchor negotiation. Every deal is different; use the range as a starting point and justify your price with your engagement, niche and the value you deliver.' },
      { q: 'Is my data uploaded?', a: 'No. The estimate is calculated locally in your browser.' },
    ],
    keywords: ['influencer rate calculator', 'sponsored post price calculator', 'how much to charge for sponsored post', 'influencer pricing', 'instagram sponsored post rate', 'influencer rate card'],
  },
];
