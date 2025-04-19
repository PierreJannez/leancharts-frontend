import React, { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { LeanChart } from "@/types/LeanChart"
import ColorPickerInput from "@/utils/ColorPickerInput";
import IconSelect from "@/utils/IconSelect";
import NumericInputWithNegativeSupport from "@/utils/NumericInputWithNegativeSupport";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  initialLeanChart: LeanChart
  onSave: (data: LeanChart) => void
}

const LeanChartEditorLite: React.FC<Props> = ({ initialLeanChart, onSave }) => {
  const [form, setForm] = useState<LeanChart>(initialLeanChart)

  useEffect(() => {
    setForm(initialLeanChart)
  }, [initialLeanChart])

  const handleChange = (field: keyof LeanChart, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => setForm(initialLeanChart)

  const handleSubmit = () => {
    onSave(form)
  }

  const inputClass = "focus-visible:ring-0 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]"

  return (
    <div className="grid gap-6 text-sm text-gray-800">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="long">Long term</TabsTrigger>
          <TabsTrigger value="short">Short term</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Name</Label>
              <Input className={inputClass} value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <IconSelect
                  label="Icon"
                  value={form.icon}
                  onChange={(newIcon) => handleChange("icon", newIcon)}
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs text-gray-500">Periodicity</Label>
                <Select value={form.periodicity || 'daily'} onValueChange={(value) => handleChange('periodicity', value)}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder="Select periodicity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="flex items-center gap-4">
              <Label className="text-xs text-gray-500">Cumulated?</Label>
              <Switch checked={form.isCumulative} onCheckedChange={(v) => handleChange("isCumulative", v)} />
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-xs text-gray-500">Green if above the target ?</Label>
              <Switch checked={form.isPositiveColorAboveTarget} onCheckedChange={(v) => handleChange("isPositiveColorAboveTarget", v)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <ColorPickerInput
                label="Positive color"
                value={form.positiveColor}
                onChange={(newColor) => handleChange("positiveColor", newColor)}
              />
            </div>
            <div>
              <ColorPickerInput
                label="Negative color"
                value={form.negativeColor}
                onChange={(newColor) => handleChange("negativeColor", newColor)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-4">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Number of decimal places</Label>
              <Input type="number" className={inputClass} value={form.nbDecimal} onChange={(e) => handleChange("nbDecimal", parseInt(e.target.value))} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Minimum</Label>
              <NumericInputWithNegativeSupport
                value={typeof form.min === "number" ? form.min : form.min || ""}
                onChange={(val) => handleChange("min", val)}
                className={inputClass}
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Maximum</Label>
              <NumericInputWithNegativeSupport
                value={typeof form.max === "number" ? form.max : form.max || ""}
                onChange={(val) => handleChange("max", val)}
                className={inputClass}
              />
            </div>
          </div>

          {form.min > form.max && (
            <p className="text-red-500 text-xs mt-2">
              The minimum must be less than or equal to the maximum.
            </p>
          )}
        </TabsContent>

        <TabsContent value="long">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Title</Label>
              <Input className={inputClass} value={form.longTermTitle} onChange={(e) => handleChange("longTermTitle", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Axis X</Label>
              <Input className={inputClass} value={form.longTermxLabel} onChange={(e) => handleChange("longTermxLabel", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Axis Y</Label>
              <Input className={inputClass} value={form.longTermyLabel} onChange={(e) => handleChange("longTermyLabel", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-1 block text-xs text-gray-500">Main target</Label>
            <Input type="number" className={inputClass} value={form.longTermMainTarget} onChange={(e) => handleChange("longTermMainTarget", parseFloat(e.target.value))} />
          </div>
        </TabsContent>

        <TabsContent value="short">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Title</Label>
              <Input className={inputClass} value={form.shortTermTitle} onChange={(e) => handleChange("shortTermTitle", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Axis X</Label>
              <Input className={inputClass} value={form.shortTermxLabel} onChange={(e) => handleChange("shortTermxLabel", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Y axis</Label>
              <Input className={inputClass} value={form.shortTermyLabel} onChange={(e) => handleChange("shortTermyLabel", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-1 block text-xs text-gray-500">Main target</Label>
            <Input type="number" className={inputClass} value={form.shortTermMainTarget} onChange={(e) => handleChange("shortTermMainTarget", parseFloat(e.target.value))} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="secondary" onClick={handleReset}>Reset</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  )
}

export default LeanChartEditorLite;