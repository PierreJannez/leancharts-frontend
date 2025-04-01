import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import LeanChartAdminPanel from "@/components/admin/LeanChartAdminPanel"
import BundleAdminPanel from "@/components/admin/BundleAdminPanel"
import { Bundle } from "@/types/Bundle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchLeanCharts, updateLeanChart } from "@/services/leanChartService"
import { LeanChart } from "@/types/LeanChart"
import { updateBundle } from "@/services/bundleService"

interface AdminPageProps {
  initialBundles: Bundle[];
}

const AdminPage: React.FC<AdminPageProps> = ({ initialBundles }) => {
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(initialBundles[0] || null);
  const [leanCharts, setLeanCharts] = useState<LeanChart[]>([]);
  const [selectedChart, setSelectedChart] = useState<LeanChart | null>(null);

  const handleUpdateBundle = async (updated: Bundle) => {
    try {
      const saved = await updateBundle(updated); // 🔄 Envoie au backend
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

  const handleSaveChart = async (chart: LeanChart) => {
    try {
      console.log("AdminPage.handleSaveChart->chart", chart);
      const savedChart = await updateLeanChart(chart);
      setLeanCharts((prev) => {
        const exists = prev.find((c) => c.id === savedChart.id);
        return exists
          ? prev.map((c) => (c.id === savedChart.id ? savedChart : c))
          : [...prev, savedChart];
      });
      setSelectedChart(savedChart);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du LeanChart:", error);
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Configuration</h1>

      <div className="border rounded-md shadow-sm bg-white">
        <Tabs defaultValue="bundles" className="w-full">
          <div className="border-b px-4 pt-4">
            <TabsList>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
              <TabsTrigger value="leancharts">LeanCharts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bundles">
            <div className="flex">
              <div className="w-64 p-4 border-r bg-gray-50">
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
              </div>
              <div className="flex-1 p-6">
                <BundleAdminPanel bundle={selectedBundle} onSave={handleUpdateBundle} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leancharts">
            <div className="flex">
              <div className="w-64 p-4 border-r bg-gray-50">
                <div className="mb-4">
                  <Select
                    value={selectedBundle?.id.toString()}
                    onValueChange={handleBundleChange}
                  >
                    <SelectTrigger>
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
                </div>
                <ul className="space-y-2">
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
              <div className="flex-1 p-6">
                {selectedChart && (
                  <LeanChartAdminPanel
                    leanChart={selectedChart}
                    onSave={handleSaveChart}
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
