import { Home, Bug, Clock3, TrendingUp, Smile, SmilePlus, ChartColumnIncreasing, HelpCircle } from "lucide-react";

const ICONS_MAP: Record<string, React.ElementType> = {
  "home": Home,
  "bug": Bug,
  "clock-3": Clock3,
  "trending-up": TrendingUp,
  "smile": Smile,
  "smile-plus": SmilePlus,
  "chart-column-increasing": ChartColumnIncreasing
};

/**
 * Get the Lucide icon dynamically.
 * @param iconName The name of the icon as a string.
 * @returns The corresponding Lucide icon component, or a default fallback.
 */
export const getIcon = (iconName: string): React.ElementType => {
  return ICONS_MAP[iconName] || HelpCircle; // Defaults to HelpCircle if not found
};