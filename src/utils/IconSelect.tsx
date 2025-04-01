// components/IconSelect.tsx
import React from "react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Home, Bug, Clock3, TrendingUp, Smile, SmilePlus } from "lucide-react"
import { ChartColumnIncreasing } from "lucide-react" // ou autre si icône custom

const ICONS_MAP: Record<string, React.ElementType> = {
  "home": Home,
  "bug": Bug,
  "clock-3": Clock3,
  "trending-up": TrendingUp,
  "smile": Smile,
  "smile-plus": SmilePlus,
  "chart-column-increasing": ChartColumnIncreasing
}

interface IconSelectProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const IconSelect: React.FC<IconSelectProps> = ({ value, onChange, label }) => {
  return (
    <div className="space-y-1">
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir une icône" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ICONS_MAP).map(([key, Icon]) => (
            <SelectItem key={key} value={key} className="flex items-center gap-2">
              <Icon className="w-4 h-4 mr-2 inline-block" />
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default IconSelect