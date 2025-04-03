import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import LeanChartAdminPanel from "@/components/admin/LeanChartAdminPanel"
import BundleAdminPanel from "@/components/admin/BundleAdminPanel"
import { Bundle } from "@/types/Bundle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchLeanCharts, updateLeanChart, createLeanChart } from "@/services/leanChartService"
import { LeanChart } from "@/types/LeanChart"
import { updateBundle, createBundle } from "@/services/bundleService"
import { FilePlus, Trash2 } from "lucide-react"

interface AdminPageProps {
  initialBundles: Bundle[];
  onBundleUpdate: (bundle: Bundle) => void;
  clientId: number;
}

const AdminPage: React.FC<AdminPageProps> = ({ initialBundles, onBundleUpdate, clientId }) => {
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(initialBundles[0] || null);
  const [leanCharts, setLeanCharts] = useState<LeanChart[]>([]);
  const [selectedChart, setSelectedChart] = useState<LeanChart | null>(null);

  const handleCreateOrUpdateBundle = async (bundle: Bundle) => {
    try {
      let saved;
      if (bundle.id) {
        saved = await updateBundle(bundle);
      } else {
        saved = await createBundle({ ...bundle }, clientId);
      }
      setBundles((prev) => {
        const index = prev.findIndex((b) => b.id === saved.id);
        if (index !== -1) {
          const newList = [...prev];
          newList[index] = saved;
          return newList;
        }
        return [...prev, saved];
      });
      setSelectedBundle(saved);
      onBundleUpdate(saved);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du bundle:", error);
    }
  };

  const handleBundleChange = (id: string) => {
    const bundle = bundles.find((b) => b.id.toString() === id);
    if (bundle) {
      setSelectedBundle(bundle);
    }
  };

  const handleSelectChart = (chart: LeanChart) => {
    setSelectedChart(chart);
  };

  const handleCreateOrUpdateLeanChart = async (chart: LeanChart) => {
    try {
      let savedChart: LeanChart;
  
      if (chart.id === -1) {
        // Création d’un nouveau LeanChart
        savedChart = await createLeanChart(chart, selectedBundle?.id ?? 0);
      } else {
        // Mise à jour d’un LeanChart existant
        savedChart = await updateLeanChart(chart);
      }
  
      setLeanCharts((prev) => {
        const exists = prev.find((c) => c.id === savedChart.id);
        return exists
          ? prev.map((c) => (c.id === savedChart.id ? savedChart : c))
          : [...prev, savedChart];
      });
  
      setSelectedChart(savedChart);
    } catch (error) {
      console.error("Erreur lors de la création/mise à jour du LeanChart:", error);
    }
  };

  useEffect(() => {
    if (selectedBundle) {
      fetchLeanCharts(selectedBundle.id).then((charts) => {
        setLeanCharts(charts);
        setSelectedChart(charts[0] || null);
      });
    }
  }, [selectedBundle]);

  return (
    <div className="w-3/4 mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Configuration</h1>
      <div className="border rounded-md shadow-sm bg-red">
        <Tabs defaultValue="bundles" className="w-full">
          <div className="px-4 pt-4 mb-0">
            <TabsList>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
              <TabsTrigger value="leancharts">LeanCharts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bundles">
            <div className="flex w-full">
              <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
                <ul className="space-y-2">
                  {bundles.map((bundle) => (
                    <li key={bundle.id}>
                      <button
                        onClick={() => setSelectedBundle(bundle)}
                        className={`w-full text-left p-2 rounded ${
                          selectedBundle?.id === bundle.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
                        }`}
                      >
                        {bundle.shortName}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between gap-2 mt-6">
                  <button
                    className="p-2 rounded hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedBundle({ id: 0, icon: "CirclePlus", shortName: "", longName: "", displayorder: 0 })}
                  >
                    <FilePlus className="w-6 h-6 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                    <Trash2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="w-4/5 p-6 border-t">
                <BundleAdminPanel bundle={selectedBundle} onSave={handleCreateOrUpdateBundle} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leancharts">
          <div className="flex w-full">
            <div className="w-1/5 p-4 border-r border-t bg-gray-50">                
                <div className="mb-4 space-y-2">
                  <Select
                    value={selectedBundle?.id.toString()}
                    onValueChange={handleBundleChange}
                  >
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
                          onClick={() => handleSelectChart(chart)}
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

                {/* --- Bouton Ajouter LeanChart --- */}
                <div className="flex justify-between gap-2 mt-6">
                  <button
                    className="p-2 rounded hover:bg-gray-100 transition-colors"
                    title="Créer un nouveau LeanChart"
                    onClick={() => setSelectedChart({
                      id: -1,
                      UXComponent: "StandardLeanChart", // ou "CumulativeLeanChart" selon le choix par défaut
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
                  <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                    <Trash2 className="w-6 h-6 text-gray-600" />
                  </button>
                </div>             
              </div>
              
              <div className="w-4/5 p-6 border-t">
                {selectedChart && (
                  <LeanChartAdminPanel
                    leanChart={selectedChart}
                    onSave={handleCreateOrUpdateLeanChart}
                    bundleId={selectedBundle?.id.toString() || ""}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
