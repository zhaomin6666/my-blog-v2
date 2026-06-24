"use client";

import { Terminal, ArrowRight } from "lucide-react";
import type { HomepageSection } from "@/lib/homepage/homepage-types";
import { useSettings } from "@/lib/settings-context";
import { getStyleTokens } from "@/lib/stylePresets";
import { t } from "@/lib/translations";
import { MainSectionId } from "@/lib/types";

interface HeroOverviewProps {
  homepageSections?: HomepageSection[];
  onOpenTerminal?: () => void;
  onNavigate?: (sectionId: MainSectionId) => void;
}

function selectHeroSection(
  sections: HomepageSection[] | undefined,
  lang: "zh" | "en",
): HomepageSection | undefined {
  const visibleSections = sections?.filter((section) => section.visible) ?? [];
  return (
    visibleSections.find(
      (section) => section.lang === lang && section.key === "hero",
    ) ?? visibleSections.find((section) => section.key === "hero")
  );
}

export function HeroOverview({
  homepageSections,
  onOpenTerminal,
  onNavigate,
}: HeroOverviewProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === "macos";
  const heroSection = selectHeroSection(homepageSections, lang);
  const title = heroSection?.title.trim() || t("hero.title", lang);
  const subtitle =
    heroSection?.subtitle.trim() ||
    heroSection?.contentMarkdown.trim() ||
    t("hero.subtitle", lang);

  return (
    <div
      className={`p-6 md:p-10 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}
    >
      <div className="space-y-5 max-w-3xl">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`}
        >
          <span className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`} />
          <span
            className={`text-xs ${isMacos ? "font-medium" : "font-mono"} ${tokens.textMuted}`}
          >
            {t("hero.badge", lang)}
          </span>
        </div>

        {/* Title */}
        <h1
          className={`${isMacos ? "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight" : "text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-tight"} ${tokens.textPrimary}`}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className={`${isMacos ? "text-base leading-relaxed" : "text-sm font-mono leading-relaxed"} ${tokens.textSecondary} max-w-2xl`}
        >
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate?.("projects")}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition-all duration-150 active:scale-95 ${
              isMacos
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:opacity-90"
                : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono font-medium uppercase tracking-wider hover:opacity-90"
            }`}
          >
            {t("hero.cta.projects", lang)}
            <ArrowRight size={14} />
          </button>
          {onOpenTerminal && (
            <button
              onClick={onOpenTerminal}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm transition-all duration-150 active:scale-95 ${
                isMacos
                  ? `${tokens.nestedCardBg} ${tokens.nestedCardBorder} rounded-full font-medium hover:bg-white/60 dark:hover:bg-black/40`
                  : `${tokens.nestedCardBg} ${tokens.nestedCardBorder} font-mono font-medium uppercase tracking-wider hover:border-zinc-400 dark:hover:border-zinc-600`
              } ${tokens.textPrimary}`}
            >
              <Terminal size={14} />
              {t("hero.cta.terminal", lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
