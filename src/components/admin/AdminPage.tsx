import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bundle } from "@/types/Bundle"
import { LeanChart } from "@/types/LeanChart"
import { toastSuccess, toastError } from "@/utils/toastUtils"

import { User } from "@/types/User"
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService"
import UserTabPanel from "@/components/admin/tabs/UserTabPanel"

import { Service } from "@/types/Service"
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "@/services/serviceService"
import ServiceTabPanel from "@/components/admin/tabs/ServiceTabPanel"

import { Team } from "@/types/Team"
import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "@/services/teamService"
import TeamTabPanel from "@/components/admin/tabs/TeamTabPanel"

import {
  updateBundle,
  createBundle,
  deleteBundle,
} from "@/services/bundleService"
import BundleTabPanel from "@/components/admin/tabs/BundleTabPanel"

import {
  fetchLeanCharts,
  updateLeanChart,
  createLeanChart,
  deleteLeanChart,
} from "@/services/leanChartService"
import LeanChartTabPanel from "@/components/admin/tabs/LeanChartsTabPanel"

interface AdminPageProps {
  initialBundles: Bundle[]
  onBundleUpdate: (bundle: Bundle) => void
  client: User
}

const AdminPage: React.FC<AdminPageProps> = ({ initialBundles, onBundleUpdate, client }) => {

  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false)

  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showDeleteServiceDialog, setShowDeleteServiceDialog] = useState(false)

  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [showDeleteTeamDialog, setShowDeleteTeamDialog] = useState(false)

  const [bundles, setBundles] = useState<Bundle[]>(initialBundles)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(initialBundles[0] || null)
  const [showDeleteBundleDialog, setShowDeleteBundleDialog] = useState(false)
  
  const [leanCharts, setLeanCharts] = useState<LeanChart[]>([])
  const [selectedChart, setSelectedChart] = useState<LeanChart | null>(null)
  const [showDeleteChartDialog, setShowDeleteChartDialog] = useState(false)

  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    console.log("🔥 useEffect USERS lancé", client)
    if (!client) return;
  
    fetchUsers(client.id_enterprise).then((list) => {
      console.log("✅ utilisateurs chargés", list)
      setUsers(list)
      setSelectedUser(list[0] ?? null)
    })
  }, [client])

  useEffect(() => {
    fetchServices(client.id_enterprise).then((s) => {
      console.log("✅ services récupérés", s)
      setServices(s)
      setSelectedService(s[0] ?? null)
    })
  }, [client])

  useEffect(() => {
    if (selectedServiceId) {
      fetchTeams(selectedServiceId).then((t) => {
        setTeams(t)
        setSelectedTeam(t[0] ?? null)
      })
    }
  }, [selectedServiceId])

  useEffect(() => {
    if (activeTab === "teams" && selectedService) {
      setSelectedServiceId(selectedService.id)
    }
  }, [activeTab, selectedService])

  const handleSaveUser = async (user: User) => {
    try {
      const saved = user.id
        ? await updateUser(user)
        : await createUser(user)
  
      setUsers((prev) => {
        const idx = prev.findIndex((u) => u.id === saved.id)
        return idx >= 0
          ? [...prev.slice(0, idx), saved, ...prev.slice(idx + 1)]
          : [...prev, saved]
      })
  
      setSelectedUser(saved)
      toastSuccess("Utilisateur enregistré avec succès.")
    } catch (error) {
      toastError("Erreur lors de la sauvegarde de l'utilisateur.")
      console.error(error)
    }
  }
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await deleteUser(selectedUser.id)
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
      setSelectedUser(null)
      toastSuccess("Utilisateur supprimé avec succès.")
    } catch (error) {
      toastError("Erreur lors de la suppression de l'utilisateur.")
      console.error(error)
    }
  }

  const handleSaveService = async (service: Service) => {
    try {
      const saved = service.id
        ? await updateService(service)
        : await createService(service)
  
      setServices((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id)
        return idx >= 0
          ? [...prev.slice(0, idx), saved, ...prev.slice(idx + 1)]
          : [...prev, saved]
      })
      setSelectedService(saved)
      toastSuccess("Service enregistré avec succès.")
    } catch (error) {
      toastError("Erreur lors de la sauvegarde du service.")
      console.error("Erreur lors de la sauvegarde du service", error)
    }
  }
  
  const handleDeleteService = async () => {
    if (!selectedService) return
    try {
      await deleteService(selectedService.id)
      setServices((prev) => prev.filter((s) => s.id !== selectedService.id))
      setSelectedService(null)
      toastSuccess("Service supprimé avec succès.")
    } catch (error: any) {
      if (error.response?.status === 409) {
        toastError(error.response.data?.error || "Conflit : suppression impossible.")
      } else {
        toastError("Erreur lors de la suppression du service.")
        console.error("Erreur lors de la suppression du service", error)
      }
    }
  }
  
  const handleServiceChange = (id: number) => {
    setSelectedServiceId(id)
  }
  
  const handleSaveTeam = async (team: Team) => {
    try {
      const saved = team.id
        ? await updateTeam(team)
        : await createTeam(team)
  
      setTeams((prev) => {
        const idx = prev.findIndex((t) => t.id === saved.id)
        return idx >= 0
          ? [...prev.slice(0, idx), saved, ...prev.slice(idx + 1)]
          : [...prev, saved]
      })
      setSelectedTeam(saved)
      toastSuccess("Équipe enregistrée avec succès.")
    } catch (error) {
      toastError("Erreur lors de la sauvegarde de l’équipe.")
      console.error(error)
    }
  }
  
  const handleDeleteTeam = async () => {
    if (!selectedTeam) return
    try {
      await deleteTeam(selectedTeam.id)
      setTeams((prev) => prev.filter((t) => t.id !== selectedTeam.id))
      setSelectedTeam(null)
      toastSuccess("Équipe supprimée avec succès.")
    } catch (error) {
      toastError("Erreur lors de la suppression de l’équipe.")
      console.error(error)
    }
  }

  const handleCreateOrUpdateBundle = async (bundle: Bundle) => {
    try {
      let saved
      if (bundle.id) {
        saved = await updateBundle(bundle)
      } else {
        saved = await createBundle({ ...bundle }, client.id)
      }

      setBundles((prev) => {
        const index = prev.findIndex((b) => b.id === saved.id)
        if (index !== -1) {
          const newList = [...prev]
          newList[index] = saved
          return newList
        }
        return [...prev, saved]
      })

      setSelectedBundle(saved)
      onBundleUpdate(saved)
    } catch (error) {
      toastError("Erreur lors de la sauvegarde du bundle")
      console.error("Erreur lors de la sauvegarde du bundle:", error)
    }
  }

  const handleDeleteSelectedBundle = async () => {
    if (!selectedBundle) return

    try {
      await deleteBundle(selectedBundle.id)

      setBundles((prev) => prev.filter((b) => b.id !== selectedBundle.id))
      setSelectedBundle(bundles[0] ?? null)

      toastSuccess("Bundle supprimé avec succès.")
    } catch (error: any) {
      if (error.response?.status === 409) {
        toastError("Ce bundle ne peut pas être supprimé car il contient encore des LeanCharts.")
      } else {
        toastError("Une erreur est survenue lors de la suppression du bundle.")
        console.error("Erreur lors de la suppression du bundle :", error)
      }
    }
  }

  const handleBundleChange = (id: string) => {
    const bundle = bundles.find((b) => b.id.toString() === id)
    if (bundle) {
      setSelectedBundle(bundle)
    }
  }

  useEffect(() => {
    if (selectedBundle) {
      fetchLeanCharts(selectedBundle.id).then((charts) => {
        setLeanCharts(charts)
        setSelectedChart(charts[0] || null)
      })
    }
  }, [selectedBundle])

  const handleSelectChart = (chart: LeanChart) => {
    setSelectedChart(chart)
  }

  const handleCreateOrUpdateLeanChart = async (chart: LeanChart) => {
    try {
      let savedChart: LeanChart

      if (chart.id === -1) {
        savedChart = await createLeanChart(chart, selectedBundle?.id ?? 0)
      } else {
        savedChart = await updateLeanChart(chart)
      }

      setLeanCharts((prev) => {
        const exists = prev.find((c) => c.id === savedChart.id)
        return exists
          ? prev.map((c) => (c.id === savedChart.id ? savedChart : c))
          : [...prev, savedChart]
      })

      setSelectedChart(savedChart)
      toastSuccess("LeanChart enregistré avec succès.")
    } catch (error) {
      toastError("Erreur lors de la création/mise à jour du LeanChart")
      console.error("Erreur lors de la création/mise à jour du LeanChart:", error)
    }
  }

  const handleDeleteSelectedLeanChart = async () => {
    if (!selectedChart) return

    try {
      if (selectedChart.id !== -1) {
        await deleteLeanChart(selectedChart.id)
      }

      setLeanCharts((prev) => prev.filter((chart) => chart.id !== selectedChart.id))
      setSelectedChart(null)
      toastSuccess("LeanChart supprimé avec succès.")
    } catch (error) {
      toastError("Erreur lors de la suppression du LeanChart")
      console.error("Erreur lors de la suppression du LeanChart :", error)
    }
  }
  
  return (
    <div className="w-3/4 mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Configuration</h1>
      <div className="border rounded-md shadow-sm">
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">        
          <div className="px-4 pt-4 mb-0">
            <TabsList>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>              
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
              <TabsTrigger value="leancharts">LeanCharts</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="services">
            <ServiceTabPanel
              services={services}
              selectedService={selectedService}
              onSelectService={setSelectedService}
              onSaveService={handleSaveService}
              onDeleteService={handleDeleteService}
              showDeleteDialog={showDeleteServiceDialog}
              setShowDeleteDialog={setShowDeleteServiceDialog}
              enterpriseId={client.id_enterprise}
            />
          </TabsContent>

          <TabsContent value="teams">
            <TeamTabPanel
              services={services}
              selectedServiceId={selectedServiceId}
              onServiceChange={handleServiceChange}
              teams={teams}
              selectedTeam={selectedTeam}
              onSelectTeam={setSelectedTeam}
              onSaveTeam={handleSaveTeam}
              onDeleteTeam={handleDeleteTeam}
              showDeleteDialog={showDeleteTeamDialog}
              setShowDeleteDialog={setShowDeleteTeamDialog}
            />
          </TabsContent>

          <TabsContent value="users">
            <UserTabPanel
              users={users}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              showDeleteDialog={showDeleteUserDialog}
              setShowDeleteDialog={setShowDeleteUserDialog}
              enterpriseId={client.id_enterprise}
              services={services} // ✅ injecte la liste des services ici
              selectedService={selectedService} // 👈 ici
            />
          </TabsContent>

          <TabsContent value="bundles">            
            <BundleTabPanel
              bundles={bundles}
              selectedBundle={selectedBundle}
              onSelectBundle={setSelectedBundle}
              onSaveBundle={handleCreateOrUpdateBundle}
              onDeleteBundle={handleDeleteSelectedBundle}
              showDeleteDialog={showDeleteBundleDialog}
              setShowDeleteDialog={setShowDeleteBundleDialog}
            />
          </TabsContent>

          <TabsContent value="leancharts">
            <LeanChartTabPanel
              bundles={bundles}
              selectedBundle={selectedBundle}
              leanCharts={leanCharts}
              selectedChart={selectedChart}
              onSelectChart={handleSelectChart}
              onSaveChart={handleCreateOrUpdateLeanChart}
              onDeleteChart={handleDeleteSelectedLeanChart}
              showDeleteDialog={showDeleteChartDialog}
              setShowDeleteDialog={setShowDeleteChartDialog}
              onBundleChange={handleBundleChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPage