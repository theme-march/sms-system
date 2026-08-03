import type { CSSProperties } from "react";
import type { WebsiteContent } from "@/src/lib/website-content";

export type WebsiteThemeStyle = CSSProperties & {
  "--site-primary": string;
  "--site-secondary": string;
  "--site-background": string;
  "--site-border": string;
};

export function websiteThemeStyle(
  theme: WebsiteContent["theme"],
): WebsiteThemeStyle {
  return {
    "--site-primary": theme.primary,
    "--site-secondary": theme.secondary,
    "--site-background": theme.background,
    "--site-border": theme.border,
  };
}
