import { wordTells } from "./tells-words";
import { phraseTells } from "./tells-phrases";
import type { Tell } from "./types";

export type { Tell, TellCategory, TellKind } from "./types";

/** The full corpus: every known tell, word- and phrase-level. */
export const allTells: Tell[] = [...wordTells, ...phraseTells];
