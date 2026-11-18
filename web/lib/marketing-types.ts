export type ProjectState = "active" | "incubation" | "vision";

/** Halftone instrument kinds of the retired V1 capability grid. Kept here
 *  because `lib/i18n/en.ts` (`Dict["modules"]["items"]`) still types its
 *  `kind` field with it after the V1 components were removed. */
export type HalftoneKind =
  | "runtime"
  | "memory"
  | "orchestration"
  | "observability"
  | "evaluations"
  | "security";

export type NavCopy = {
  home: string;
  projects: string;
  about: string;
  contribute: string;
  github: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  skipToContent: string;
};

export type HeroCopy = {
  /** Static title text ending before the rotating word (usually with a colon). */
  title: string;
  /** Words rendered in Orbital lettering inside the title; first word is the
   *  static fallback. Also joined into the accessible title text. */
  titleWords: readonly string[];
  description: string;
  primaryAction: string;
  secondaryAction: string;
  note: string;
  pauseMotion: string;
  resumeMotion: string;
  reducedMotion: string;
};

export type FooterCopy = {
  statement: string;
  independence: string;
  sections: string;
  projects: string;
  resources: string;
  discussions: string;
  handbook: string;
  handbookPending: string;
  conduct: string;
  security: string;
  trademark: string;
  contactPending: string;
  builtOpen: string;
};
