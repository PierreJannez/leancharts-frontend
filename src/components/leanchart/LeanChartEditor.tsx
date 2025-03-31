import React, { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { LeanChart } from "@/types/LeanChart"
import { toast } from "sonner"

interface Props {
  initialData: LeanChart
  onSave: (data: LeanChart) => void
}

const LeanChartEditorLite: React.FC<Props> = ({ initialData, onSave }) => {
  const [form, setForm] = useState<LeanChart>(initialData)

  const handleChange = (field: keyof LeanChart, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => setForm(initialData)

  const handleSubmit = () => {
    onSave(form)
    toast.success("Le LeanChart a bien été mis à jour.")
  }

  const isHexColor = (value: string) => /^#([0-9A-F]{3}){1,2}$/i.test(value)
  const inputClass = "focus-visible:ring-0 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]"

  return (
    <div className="grid gap-6 text-sm text-gray-800">
      <Accordion type="multiple" defaultValue={[]}>        
        <AccordionItem value="general">
          <AccordionTrigger>
            <span className="uppercase text-xs tracking-wide text-muted-foreground font-semibold">Général</span>
          </AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="mb-1 block text-xs text-gray-500">Nom</Label>
                <Input className={inputClass} value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-xs text-gray-500">Icône</Label>
                <Input className={inputClass} value={form.icon} onChange={(e) => handleChange("icon", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label className="mb-1 block text-xs text-gray-500">Composant UX</Label>
                <Input className={inputClass} value={form.UXComponent} onChange={(e) => handleChange("UXComponent", e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-xs text-gray-500">Ordre d'affichage</Label>
                <Input type="number" className={inputClass} value={form.displayOrder} onChange={(e) => handleChange("displayOrder", parseInt(e.target.value))} />
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
                <Input className={`${inputClass} ${!isHexColor(form.positiveColor) ? "border-red-500" : ""}`} value={form.positiveColor} onChange={(e) => handleChange("positiveColor", e.target.value)} />
              </div>
              <div>
                <Label className="mb-1 block text-xs text-gray-500">Couleur négative</Label>
                <Input className={`${inputClass} ${!isHexColor(form.negativeColor) ? "border-red-500" : ""}`} value={form.negativeColor} onChange={(e) => handleChange("negativeColor", e.target.value)} />
              </div>
            </div>

            <div className="mt-4">
              <Label className="mb-1 block text-xs text-gray-500">Nombre de décimales</Label>
              <Input type="number" className={inputClass} value={form.nbDecimal} onChange={(e) => handleChange("nbDecimal", parseInt(e.target.value))} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Long Terme */}
        <AccordionItem value="long">
          <AccordionTrigger>
            <span className="uppercase text-xs tracking-wide text-muted-foreground font-semibold">Long Terme</span>
          </AccordionTrigger>
          <AccordionContent className="mt-2">
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
          </AccordionContent>
        </AccordionItem>

        {/* Court Terme */}
        <AccordionItem value="short">
          <AccordionTrigger>
            <span className="uppercase text-xs tracking-wide text-muted-foreground font-semibold">Court Terme</span>
          </AccordionTrigger>
          <AccordionContent className="mt-2">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="secondary" onClick={handleReset}>Réinitialiser</Button>
        <Button onClick={handleSubmit}>Enregistrer</Button>
      </div>
    </div>
  )
}

export default LeanChartEditorLite
