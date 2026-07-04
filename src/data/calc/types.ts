/** Calculator registry model — one entry drives page, widget, search index and schema. */

export interface CalcField {
  id: string;
  label: string;
  type: 'number' | 'date' | 'select';
  /** shown after the input, e.g. "%", "kg", "months" */
  suffix?: string;
  placeholder?: string;
  defaultValue?: string;
  min?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface CalcDef {
  /** URL: /calc/{slug}/ — matches how people search, e.g. "percentage-calculator" */
  slug: string;
  /** H1 & card name, e.g. "Percentage Calculator" */
  name: string;
  icon: string;
  /** meta description (~155 chars, answer + differentiator) */
  description: string;
  /** bold answer-first lead sentence on the page */
  lead: string;
  fields: CalcField[];
  /** id used to select the compute function in the client widget */
  computeId: string;
  /** formula section, plain sentences */
  formula: string;
  /** worked example sentence */
  example: string;
  /** optional context paragraph (uniqueness) */
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}
