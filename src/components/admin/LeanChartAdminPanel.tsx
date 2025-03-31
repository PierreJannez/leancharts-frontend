import React, { useState } from "react"
import { LeanChart } from "@/types/LeanChart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LeanChartEditor from "@/components/leanchart/LeanChartEditor"
import { PlusCircle, Pencil } from "lucide-react"

const sampleChart: LeanChart = {
    UXComponent: "StandardLeanChart",
    name: "Nouveau graphique",
    icon: "Activity",
    isCumulative: false,
    isPositiveColorAboveTarget: true,
    negativeColor: "#FF0000",
    positiveColor: "#00FF00",
    nbDecimal: 1,
    longTermTitle: "Objectif LT",
    longTermxLabel: "Mois",
    longTermyLabel: "Valeur",
    longTermMainTarget: 100,
    shortTermTitle: "Objectif CT",
    shortTermxLabel: "Semaine",
    shortTermyLabel: "Valeur",
    shortTermMainTarget: 80,
    displayOrder: 0,
    id: 0,
    longTermData: [],
    shortTermData: [],
    cumulLongTermData: [],
    cumulShortTermData: []
}

const LeanChartAdminPanel: React.FC = () => {
  const [leanCharts, setLeanCharts] = useState<LeanChart[]>([])
  const [selectedChart, setSelectedChart] = useState<LeanChart | null>(null)

  const handleSave = (chart: LeanChart) => {
    setLeanCharts((prev) => {
      const exists = prev.find((c) => c.id === chart.id)
      return exists
        ? prev.map((c) => (c.id === chart.id ? chart : c))
        : [...prev, chart]
    })
    setSelectedChart(null)
  }

  const handleNew = () => {
    setSelectedChart({ ...sampleChart, id: Date.now() })
  }

  const handleEdit = (chart: LeanChart) => {
    setSelectedChart(chart)
  }

  return (
    <div className="grid gap-6">
      {!selectedChart && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mes LeanCharts</h2>
            <Button onClick={handleNew} size="sm">
              <PlusCircle className="w-4 h-4 mr-2" /> Nouveau
            </Button>
          </div>

          {leanCharts.length === 0 ? (
            <p className="text-muted-foreground">Aucun LeanChart pour le moment.</p>
          ) : (
            <div className="grid gap-4">
              {leanCharts.map((chart) => (
                <Card key={chart.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{chart.name}</p>
                    <p className="text-xs text-muted-foreground">{chart.icon} • {chart.UXComponent}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(chart)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {selectedChart && (
        <Card>
          <CardContent className="p-6">
            <LeanChartEditor
              initialData={selectedChart}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LeanChartAdminPanel
