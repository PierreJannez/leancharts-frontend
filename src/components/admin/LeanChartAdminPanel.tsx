import React, { useState, useEffect } from "react"
import { LeanChart } from "@/types/LeanChart"
import { Card, CardContent } from "@/components/ui/card"
import LeanChartEditor from "@/components/leanchart/LeanChartEditor"
import { toast } from "sonner"

interface LeanChartAdminPanelProps {
  leanChart: LeanChart;
  bundleId: string;
  onSave: (chart: LeanChart) => void;
}

const LeanChartAdminPanel: React.FC<LeanChartAdminPanelProps> = ({ leanChart, onSave }) => {
  const [form, setForm] = useState<LeanChart | null>(leanChart ?? null);

  useEffect(() => {
    setForm(leanChart ?? null);
  }, [leanChart]);

  const handleSave = (updatedChart: LeanChart) => {
    onSave(updatedChart); // ← ce chart est bien celui modifié dans LeanChartEditor
    toast.success("Modifications du LeanChart envoyées !");
  };

  return (
    <div className="grid gap-6">
      {!form ? (
        <div className="text-muted-foreground">Aucun LeanChart sélectionné.</div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <LeanChartEditor
              initialLeanChart={form}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeanChartAdminPanel