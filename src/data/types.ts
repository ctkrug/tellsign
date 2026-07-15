/** How a tell is matched against text. */
export type TellKind = "word" | "phrase";

/** Broad grouping used for the meter legend and per-category weighting. */
export type TellCategory =
  | "inflated-verb"
  | "hedge"
  | "transition-crutch"
  | "rule-of-three"
  | "disclaimer"
  | "vague-intensifier";

export interface Tell {
  /** Stable identifier, used as a React-free key and in tests. */
  id: string;
  /** The literal word or phrase to match, lowercase. */
  term: string;
  kind: TellKind;
  category: TellCategory;
  /** Relative severity, 1 (mild) to 3 (strong signal), feeds the meter. */
  weight: 1 | 2 | 3;
  /** Plain-language reason shown in the tooltip. */
  explanation: string;
}
