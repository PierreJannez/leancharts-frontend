import React, { useEffect, useState } from "react"
import { FilePlus, Trash2 } from "lucide-react"
import { Bundle } from "@/types/Bundle"
import { LeanChart } from "@/types/LeanChart"
import { Service } from "@/types/Service"
import { Team } from "@/types/Team"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"
import LeanChartAdminPanel from "@/components/admin/LeanChartAdminPanel"

import { fetchServices } from "@/services/serviceService"
import { fetchTeams } from "@/services/teamService"
import {
  createLeanChart,
  deleteLeanChart,
  fetchLeanCharts,
  updateLeanChart
} from "@/services/leanChartService"
import { fetchBundlesByTeam } from "@/services/bundleService"
import { toastError, toastSuccess } from "@/utils/toastUtils"

interface Props {
  enterpriseId: number
}

const LeanChartsTabPanel: React.FC<Props> = ({ enterpriseId }) => {
  const [services, setServices] = useState<Service[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [leanCharts, setLeanCharts] = useState<LeanChart[]>([])

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const [selectedChart, setSelectedChart] = useState<LeanChart | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchServices(enterpriseId)
      .then((s) => setServices(s))
      .catch(() => toastError("Erreur lors du chargement des services."))
  }, [enterpriseId])

  useEffect(() => {
    if (!selectedServiceId) {
      setTeams([])
      setBundles([])
      setLeanCharts([])
      setSelectedTeamId(null)
      setSelectedBundle(null)
      setSelectedChart(null)
      return
    }

    fetchTeams(selectedServiceId)
      .then((fetchedTeams) => {
        setTeams(fetchedTeams)
        if (fetchedTeams.length > 0) {
          setSelectedTeamId(fetchedTeams[0].id)
        } else {
          setSelectedTeamId(null)
          setBundles([])
          setLeanCharts([])
          setSelectedBundle(null)
          setSelectedChart(null)
        }
      })
      .catch(() => toastError("Erreur lors du chargement des équipes."))
  }, [selectedServiceId])

  useEffect(() => {
    if (!selectedTeamId) {
      setBundles([])
      setLeanCharts([])
      setSelectedBundle(null)
      setSelectedChart(null)
      return
    }

    fetchBundlesByTeam(selectedTeamId)
      .then((fetchedBundles) => {
        setBundles(fetchedBundles)
        if (fetchedBundles.length > 0) {
          setSelectedBundle(fetchedBundles[0])
        } else {
          setSelectedBundle(null)
          setLeanCharts([])
          setSelectedChart(null)
        }
      })
      .catch(() => toastError("Erreur lors du chargement des bundles."))
  }, [selectedTeamId])

  useEffect(() => {
    if (!selectedBundle) {
      setLeanCharts([])
      setSelectedChart(null)
      return
    }

    fetchLeanCharts(selectedBundle.id)
      .then((charts) => {
        setLeanCharts(charts)
        setSelectedChart(charts[0] || null)
      })
      .catch(() => toastError("Erreur lors du chargement des LeanCharts."))
  }, [selectedBundle])

  const handleSaveChart = async (chart: LeanChart) => {
    try {
      if (!selectedBundle) return toastError("Aucun bundle sélectionné.")

      const saved = chart.id === -1
        ? await createLeanChart(chart, selectedBundle.id)
        : await updateLeanChart(chart)

      setLeanCharts((prev) => {
        const idx = prev.findIndex((c) => c.id === saved.id)
        return idx >= 0
          ? [...prev.slice(0, idx), saved, ...prev.slice(idx + 1)]
          : [...prev, saved]
      })

      setSelectedChart(saved)
      toastSuccess("LeanChart enregistré avec succès.")
    } catch (err) {
      toastError("Erreur lors de la sauvegarde du LeanChart.")
      console.error(err)
    }
  }

  const handleDeleteChart = async () => {
    if (!selectedChart) return
    try {
      await deleteLeanChart(selectedChart.id)
      setLeanCharts((prev) => prev.filter((c) => c.id !== selectedChart.id))
      setSelectedChart(null)
      toastSuccess("LeanChart supprimé.")
    } catch (err) {
      toastError("Erreur lors de la suppression du LeanChart.")
      console.error(err)
    }
  }

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="w-1/5 p-4 border-r border-t bg-gray-50">
        <div className="space-y-3">
          {/* Service */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Service</label>
            <Select
              value={selectedServiceId?.toString() || ""}
              onValueChange={(v) => setSelectedServiceId(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Équipe */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Équipe</label>
            <Select
              value={selectedTeamId?.toString() || ""}
              onValueChange={(v) => setSelectedTeamId(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une équipe" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bundle */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Bundle</label>
            <Select
              disabled={bundles.length === 0}
              value={selectedBundle ? selectedBundle.id.toString() : ""}
              onValueChange={(v) =>
                setSelectedBundle(bundles.find((b) => b.id.toString() === v) || null)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un bundle" />
              </SelectTrigger>
              <SelectContent>
                {bundles.map((b) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {bundles.length === 0 && (
              <p className="text-xs text-muted-foreground italic mt-1">Aucun bundle pour cette équipe.</p>
            )}
          </div>
        </div>

        {/* Liste des LeanCharts */}
        <ul className="mt-4 space-y-2">
          {leanCharts.map((chart) => (
            <li key={chart.id}>
              <button
                onClick={() => setSelectedChart(chart)}
                className={`w-full text-left p-2 rounded ${
                  selectedChart?.id === chart.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
                }`}
              >
                {chart.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Boutons */}
        <div className="flex justify-between gap-2 mt-6">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Créer un nouveau LeanChart"
            onClick={() =>
              setSelectedChart({
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
            disabled={!selectedChart}
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Supprimer ce LeanChart ?"
          description={`ATTENTION : Vous allez supprimer le LeanChart "${selectedChart?.name}" définitivement.`}
          onConfirm={handleDeleteChart}
        />
      </div>

      {/* Formulaire d'édition */}
      <div className="w-4/5 p-6 border-t">
        {selectedChart && (
          <LeanChartAdminPanel
            leanChart={selectedChart}
            onSave={handleSaveChart}
            bundleId={selectedBundle?.id.toString() ?? ""}
          />
        )}
      </div>
    </div>
  )
}

export default LeanChartsTabPanel;