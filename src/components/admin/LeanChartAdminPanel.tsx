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

const emptyChart: LeanChart = {
  id: 0,
  name: "",
  icon: "CirclePlus",
  UXComponent: "StandardLeanChart",
  shortTermTitle: "",
  shortTermxLabel: "",
  shortTermyLabel: "",
  longTermTitle: "",
  longTermxLabel: "",
  longTermyLabel: "",
  nbDecimal: 0,
  positiveColor: "#10b981",
  negativeColor: "#ef4444",
  isPositiveColorAboveTarget: true,
  shortTermMainTarget: 0,
  longTermMainTarget: 0,
  isCumulative: false,
  cumulLongTermData: [],
  cumulShortTermData: [],
  shortTermData: [],
  longTermData: [],
  displayOrder: 0, 
};

const LeanChartAdminPanel: React.FC<LeanChartAdminPanelProps> = ({ leanChart, onSave }) => {
  const [form, setForm] = useState<LeanChart>(leanChart ?? emptyChart);

  useEffect(() => {
    setForm(leanChart ?? emptyChart);
  }, [leanChart]);

  const isNew = form.id === -1;

  const handleSave = (updatedChart: LeanChart) => {
    onSave(updatedChart); // ← ce chart est bien celui modifié dans LeanChartEditor
    toast.success(isNew ? "LeanChart créé avec succès !" : "Modifications enregistrées !");
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