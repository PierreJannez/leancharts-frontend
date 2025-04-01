import React, { useState, useEffect } from "react"
import { Bundle } from "@/types/Bundle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import IconSelect from "@/utils/IconSelect";

interface BundleAdminPanelProps {
  bundle: Bundle | null;
  onSave: (bundle: Bundle) => void;
}

const BundleAdminPanel: React.FC<BundleAdminPanelProps> = ({ bundle, onSave }) => {
  const [form, setForm] = useState<Bundle | null>(bundle);

  useEffect(() => {
    setForm(bundle);
  }, [bundle]);

  if (!form) {
    return <p className="text-muted-foreground">Veuillez sélectionner un bundle à éditer.</p>;
  }

  const handleChange = (field: keyof Bundle, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = () => {
    if (!form) return;
    onSave(form); // Délègue toute la logique à AdminPage
    toast.success("Modifications envoyées !");
  };

  return (
    <Card>
      <CardContent className="p-6 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <IconSelect
                label="Icône"
                value={form.icon}
                onChange={(newIcon) => handleChange("icon", newIcon)}
              />
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Nom court</Label>
          <Input value={form.shortName} onChange={(e) => handleChange("shortName", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Nom long</Label>
          <Input value={form.longName} onChange={(e) => handleChange("longName", e.target.value)} />
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleAdminPanel;