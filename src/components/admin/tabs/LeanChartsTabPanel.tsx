// components/admin/tabs/LeanChartTabPanel.tsx
import React from "react"
import { FilePlus, Trash2 } from "lucide-react"
import { Bundle } from "@/types/Bundle"
import { LeanChart } from "@/types/LeanChart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LeanChartAdminPanel from "@/components/admin/LeanChartAdminPanel"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"

interface Props {
  bundles: Bundle[]
  selectedBundle: Bundle | null
  leanCharts: LeanChart[]
  selectedChart: LeanChart | null
  onSelectChart: (chart: LeanChart) => void
  onSaveChart: (chart: LeanChart) => void
  onDeleteChart: () => void
  showDeleteDialog: boolean
  setShowDeleteDialog: (open: boolean) => void
  onBundleChange: (id: string) => void
}

const LeanChartsTabPanel: React.FC<Props> = ({
  bundles,
  selectedBundle,
  leanCharts,
  selectedChart,
  onSelectChart,
  onSaveChart,
  onDeleteChart,
  showDeleteDialog,
  setShowDeleteDialog,
  onBundleChange,
}) => {
  return (
    <div className="flex w-full">
      <div className="w-1/5 p-4 border-r border-t bg-gray-50">
        <div className="mb-4 space-y-2">
          <Select value={selectedBundle?.id.toString()} onValueChange={onBundleChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un bundle" />
            </SelectTrigger>
            <SelectContent>
              {bundles.map((bundle) => (
                <SelectItem key={bundle.id} value={bundle.id.toString()}>
                  {bundle.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ul className="space-y-2 w-full">
            {leanCharts.map((chart) => (
              <li key={chart.id}>
                <button
                  onClick={() => onSelectChart(chart)}
                  className={`w-full text-left p-2 rounded ${
                    selectedChart?.id === chart.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
                  }`}
                >
                  {chart.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between gap-2 mt-6">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Créer un nouveau LeanChart"
            onClick={() =>
              onSelectChart({
                id: -1,
                UXComponent: "StandardLeanChart",
                name: "New Chart",
                icon: "smile",
                isCumulative: false,
                isPositiveColorAboveTarget: true,
                negativeColor: "#ef4444",
                positiveColor: "#10b981",
                nbDecimal: 0,
                longTermTitle: "New",
                longTermxLabel: "",
                longTermyLabel: "",
                longTermMainTarget: 0,
                shortTermTitle: "New",
                shortTermxLabel: "",
                shortTermyLabel: "",
                shortTermMainTarget: 0,
                displayOrder: 0,
                longTermData: [],
                shortTermData: [],
                cumulLongTermData: [],
                cumulShortTermData: [],
              })
            }
          >
            <FilePlus className="w-6 h-6 text-gray-600" />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Supprimer le LeanChart sélectionné"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>

          <DeleteConfirmationDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Supprimer ce LeanChart ?"
            description={`ATTENTION : Vous allez supprimer le LeanChart "${selectedChart?.name}" et toutes ses données associées. Cette action est définitive.`}
            onConfirm={onDeleteChart}
          />
        </div>
      </div>

      <div className="w-4/5 p-6 border-t">
        {selectedChart && (
          <LeanChartAdminPanel
            leanChart={selectedChart}
            onSave={onSaveChart}
            bundleId={selectedBundle?.id.toString() || ""}
          />
        )}
      </div>
    </div>
  )
}

export default LeanChartsTabPanel