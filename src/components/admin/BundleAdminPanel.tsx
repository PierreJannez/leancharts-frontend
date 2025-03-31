import React, { useState } from "react"
import { Bundle } from "@/types/Bundle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, PlusCircle } from "lucide-react"

const sampleBundle: Bundle = {
  id: Date.now(),
  icon: "Folder",
  shortName: "Nouveau",
  longName: "Nouveau bundle",
  displayorder: 0,
}

const BundleAdminPanel: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)

  const handleSave = (bundle: Bundle) => {
    setBundles((prev) => {
      const exists = prev.find((b) => b.id === bundle.id)
      return exists
        ? prev.map((b) => (b.id === bundle.id ? bundle : b))
        : [...prev, bundle]
    })
    setSelectedBundle(null)
  }

  const handleNew = () => {
    setSelectedBundle({ ...sampleBundle, id: Date.now() })
  }

  const handleEdit = (bundle: Bundle) => {
    setSelectedBundle(bundle)
  }

  const handleChange = (field: keyof Bundle, value: any) => {
    setSelectedBundle((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  return (
    <div className="grid gap-6">
      {!selectedBundle && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mes Bundles</h2>
            <Button onClick={handleNew} size="sm">
              <PlusCircle className="w-4 h-4 mr-2" /> Nouveau
            </Button>
          </div>

          {bundles.length === 0 ? (
            <p className="text-muted-foreground">Aucun bundle pour le moment.</p>
          ) : (
            <div className="grid gap-4">
              {bundles.map((bundle) => (
                <Card key={bundle.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{bundle.shortName}</p>
                    <p className="text-xs text-muted-foreground">{bundle.icon} • {bundle.longName}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(bundle)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {selectedBundle && (
        <Card>
          <CardContent className="p-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Icône</Label>
                <Input value={selectedBundle.icon} onChange={(e) => handleChange("icon", e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Ordre d'affichage</Label>
                <Input type="number" value={selectedBundle.displayorder} onChange={(e) => handleChange("displayorder", parseInt(e.target.value))} />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Nom court</Label>
              <Input value={selectedBundle.shortName} onChange={(e) => handleChange("shortName", e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Nom long</Label>
              <Input value={selectedBundle.longName} onChange={(e) => handleChange("longName", e.target.value)} />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="secondary" onClick={() => setSelectedBundle(null)}>Annuler</Button>
              <Button onClick={() => handleSave(selectedBundle)}>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BundleAdminPanel