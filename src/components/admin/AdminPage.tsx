import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import LeanChartAdminPanel from "@/components/admin/LeanChartAdminPanel"
import BundleAdminPanel from "@/components/admin/BundleAdminPanel"

const AdminPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Configuration</h1>

      <div className="border rounded-md shadow-sm bg-white">
        <Tabs defaultValue="leancharts" className="w-full">
          {/* Onglets */}
          <div className="border-b px-4 pt-4">
            <TabsList>
              <TabsTrigger value="leancharts">LeanCharts</TabsTrigger>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu onglet LeanCharts */}
          <TabsContent value="leancharts">
            <div className="flex">
              <div className="w-64 p-4 border-r bg-gray-50">
                {/* Liste des LeanCharts (à venir) */}
              </div>
              <div className="flex-1 p-6">
                <LeanChartAdminPanel />
              </div>
            </div>
          </TabsContent>

          {/* Contenu onglet Bundles */}
          <TabsContent value="bundles">
            <div className="flex">
              <div className="w-64 p-4 border-r bg-gray-50">
                {/* Liste des Bundles (à venir) */}
              </div>
              <div className="flex-1 p-6">
                <BundleAdminPanel />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPage