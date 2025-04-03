import React, { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { LeanChart } from "@/types/LeanChart"
import ColorPickerInput from "@/utils/ColorPickerInput";
import IconSelect from "@/utils/IconSelect";

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
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="long">Long Terme</TabsTrigger>
          <TabsTrigger value="short">Court Terme</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Nom</Label>
              <Input className={inputClass} value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div>
              <IconSelect
                label="Icône"
                value={form.icon}
                onChange={(newIcon) => handleChange("icon", newIcon)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Composant UX</Label>
              <Input className={inputClass} value={form.UXComponent} onChange={(e) => handleChange("UXComponent", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="flex items-center gap-4">
              <Label className="text-xs text-gray-500">Cumulé ?</Label>
              <Switch checked={form.isCumulative} onCheckedChange={(v) => handleChange("isCumulative", v)} />
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-xs text-gray-500">Vert si au-dessus de la cible ?</Label>
              <Switch checked={form.isPositiveColorAboveTarget} onCheckedChange={(v) => handleChange("isPositiveColorAboveTarget", v)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Couleur positive</Label>
              <ColorPickerInput
                label="Couleur positive"
                value={form.positiveColor}
                onChange={(newColor) => handleChange("positiveColor", newColor)}
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Couleur négative</Label>
              <ColorPickerInput
                label="Couleur négative"
                value={form.negativeColor}
                onChange={(newColor) => handleChange("negativeColor", newColor)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="mb-1 block text-xs text-gray-500">Nombre de décimales</Label>
            <Input type="number" className={inputClass} value={form.nbDecimal} onChange={(e) => handleChange("nbDecimal", parseInt(e.target.value))} />
          </div>
        </TabsContent>

        <TabsContent value="long">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Titre</Label>
              <Input className={inputClass} value={form.longTermTitle} onChange={(e) => handleChange("longTermTitle", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Axe X</Label>
              <Input className={inputClass} value={form.longTermxLabel} onChange={(e) => handleChange("longTermxLabel", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Axe Y</Label>
              <Input className={inputClass} value={form.longTermyLabel} onChange={(e) => handleChange("longTermyLabel", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-1 block text-xs text-gray-500">Cible principale</Label>
            <Input type="number" className={inputClass} value={form.longTermMainTarget} onChange={(e) => handleChange("longTermMainTarget", parseFloat(e.target.value))} />
          </div>
        </TabsContent>

        <TabsContent value="short">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Titre</Label>
              <Input className={inputClass} value={form.shortTermTitle} onChange={(e) => handleChange("shortTermTitle", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Axe X</Label>
              <Input className={inputClass} value={form.shortTermxLabel} onChange={(e) => handleChange("shortTermxLabel", e.target.value)} />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-gray-500">Axe Y</Label>
              <Input className={inputClass} value={form.shortTermyLabel} onChange={(e) => handleChange("shortTermyLabel", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-1 block text-xs text-gray-500">Cible principale</Label>
            <Input type="number" className={inputClass} value={form.shortTermMainTarget} onChange={(e) => handleChange("shortTermMainTarget", parseFloat(e.target.value))} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="secondary" onClick={handleReset}>Réinitialiser</Button>
        <Button onClick={handleSubmit}>Enregistrer

        </Button>
      </div>
    </div>
  )
}

export default LeanChartEditorLite