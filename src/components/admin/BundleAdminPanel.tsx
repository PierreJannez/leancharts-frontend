import React, { useState, useEffect } from "react"
import { Bundle } from "@/types/Bundle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import IconSelect from "@/utils/IconSelect"

interface BundleAdminPanelProps {
  bundle: Bundle | null;
  onSave: (bundle: Bundle) => void;
}

const emptyBundle: Bundle = {
  id: -1, // ➕ -1 ou tout autre valeur par défaut pour indiquer une création
  icon: "home",
  shortName: "New Bundle",
  longName: "New Bundle",
  displayorder: 0,
};

const BundleAdminPanel: React.FC<BundleAdminPanelProps> = ({ bundle, onSave }) => {
  const [form, setForm] = useState<Bundle>(bundle ?? emptyBundle);

  useEffect(() => {
    setForm(bundle ?? emptyBundle);
  }, [bundle]);

  const isNew = form.id === -1;

  const handleChange = (field: keyof Bundle, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Card>
      <CardContent className="p-6 grid gap-4">
        <h2 className="text-lg font-semibold">{isNew ? "Create a new bundle" : "Modify the bundle"}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <IconSelect
              label="Icon"
              value={form.icon}
              onChange={(newIcon) => handleChange("icon", newIcon)}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Short name</Label>
          <Input value={form.shortName} onChange={(e) => handleChange("shortName", e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Full name</Label>
          <Input value={form.longName} onChange={(e) => handleChange("longName", e.target.value)} />
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit}>
            {isNew ? "Create" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleAdminPanel;