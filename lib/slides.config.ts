export interface SlideConfig {
  id: string;
  label: string;
  shortLabel: string;
  accentColor: string;
}

export const SLIDES: SlideConfig[] = [
  { id: "hero",          label: "Welcome",             shortLabel: "01", accentColor: "#C9A84C" },
  { id: "why",           label: "Why Mall of America", shortLabel: "02", accentColor: "#C9A84C" },
  { id: "retail",        label: "Retail",              shortLabel: "03", accentColor: "#E8C97A" },
  { id: "luxury",        label: "Luxury",              shortLabel: "04", accentColor: "#C9A84C" },
  { id: "dining",        label: "Dining & Lifestyle",  shortLabel: "05", accentColor: "#C9A84C" },
  { id: "entertainment", label: "Entertainment",       shortLabel: "06", accentColor: "#C9A84C" },
  { id: "events",        label: "Events Platform",     shortLabel: "07", accentColor: "#C9A84C" },
  { id: "cta",           label: "Partner With Us",     shortLabel: "08", accentColor: "#C9A84C" },
];
