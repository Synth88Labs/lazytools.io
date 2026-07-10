/** Biology & Lab tool registry model. One entry drives a /biology/ page. */

export interface BioField {
  id: string;
  label: string;
  suffix?: string;
  defaultValue?: string;
  type?: 'number' | 'select';
  options?: { value: string; label: string }[];
}

export interface BioTool {
  slug: string;
  name: string;
  icon: string;
  /** which cluster it belongs to on the hub page */
  cluster: 'lab' | 'genetics';
  /** custom island id, or 'calc' for the declarative field→result widget */
  widget: 'sequence' | 'dilution' | 'punnett' | 'hardy-weinberg' | 'gc-tm' | 'calc';
  /** for widget:'calc' — the bio-compute function id + its input fields */
  computeId?: string;
  fields?: BioField[];
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}
