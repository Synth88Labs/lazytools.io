/**
 * Adsterra ad units + master switch.
 *
 * All Adsterra keys/zones live here so placement components stay declarative and
 * a single flag turns the whole thing off. Ads render in PRODUCTION builds only
 * (dev/local never loads them) to avoid invalid impressions against the account.
 * Set ADS_ENABLED to `false` to disable ads even in production.
 */
export const ADS_ENABLED = import.meta.env.PROD;

export interface AdUnit {
  key: string;
  width: number;
  height: number;
  /** The Adsterra invoke/iframe script URL for this zone. */
  src: string;
}

/** atOptions-style banner zones (each rendered in its own isolated iframe). */
export const AD_UNITS = {
  /** 728×90 leaderboard */
  leaderboard: { key: '231416cc5fc9e1d95070d1d92ae9dd0a', width: 728, height: 90, src: 'https://lightlyenergeticevolution.com/231416cc5fc9e1d95070d1d92ae9dd0a/invoke.js' },
  /** 320×50 mobile banner */
  mobile: { key: '933988eaeebbdbccb6cc42ccb460d123', width: 320, height: 50, src: 'https://lightlyenergeticevolution.com/933988eaeebbdbccb6cc42ccb460d123/invoke.js' },
  /** 300×250 medium rectangle */
  rectangle: { key: '4daa6e824e0036b081f76cad92369814', width: 300, height: 250, src: 'https://bauval.org/22/4daa6e824e0036b081f76cad92369814' },
  /** 160×600 wide skyscraper */
  skyscraper: { key: 'b8907c73974f40a396360eb1627119ab', width: 160, height: 600, src: 'https://bauval.org/22/b8907c73974f40a396360eb1627119ab' },
  /** 160×300 half skyscraper */
  halfSky: { key: 'a38d3ec7ada4f66f14282ac7e2219022', width: 160, height: 300, src: 'https://bauval.org/22/a38d3ec7ada4f66f14282ac7e2219022' },
  /** 468×60 banner */
  banner468: { key: '279a3d8d379ae4d3e91c442e11f93cef', width: 468, height: 60, src: 'https://bauval.org/22/279a3d8d379ae4d3e91c442e11f93cef' },
} as const satisfies Record<string, AdUnit>;

/** Native banner (container-div based, not atOptions). */
export const NATIVE_UNIT = {
  key: '9188099fe2e40fc1b918601e31051df4',
  src: 'https://lightlyenergeticevolution.com/9188099fe2e40fc1b918601e31051df4/invoke.js',
};

/** Direct/Smart link — a monetised redirect URL, used for an explicit "sponsored" link, never a hidden auto-redirect. */
export const SMART_LINK = 'https://lightlyenergeticevolution.com/sp8ypmaz?key=ad0e6c0d9ae43d87c7de4ccea0305668';
