import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bundle } from "@/types/Bundle"

import { User } from "@/types/User"
import UserTabPanel from "@/components/admin/tabs/UserTabPanel"

import ServiceTabPanel from "@/components/admin/tabs/ServiceTabPanel"
import TeamTabPanel from "@/components/admin/tabs/TeamTabPanel"
import BundleTabPanel from "@/components/admin/tabs/BundleTabPanel"
import LeanChartTabPanel from "@/components/admin/tabs/LeanChartsTabPanel"

interface AdminPageProps {
  initialBundles: Bundle[]
  onBundleUpdate: (bundle: Bundle) => void
  client: User
}

const AdminPage: React.FC<AdminPageProps> = ({ client }) => {
  const [activeTab, setActiveTab] = useState("users")

  
  return (
      <div className="w-3/4 mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Configuration</h1>
        <div className="border rounded-md shadow-sm">
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4 mb-0">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
              <TabsTrigger value="leancharts">LeanCharts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users">
            <UserTabPanel
              enterpriseId={client.id_enterprise}
              />
          </TabsContent>

          <TabsContent value="services">
            <ServiceTabPanel
              enterpriseId={client.id_enterprise}
            />
          </TabsContent>

          <TabsContent value="teams">
            <TeamTabPanel
              enterpriseId={client.id_enterprise}
              />
          </TabsContent>

          <TabsContent value="bundles">
            <BundleTabPanel 
              enterpriseId={client.id_enterprise}
            />
          </TabsContent>

          <TabsContent value="leancharts">
            <LeanChartTabPanel
              enterpriseId={client.id_enterprise}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPage