import React, { useEffect, useState } from "react"
import { handleBackendError } from "@/utils/errorUtils"
import { FilePlus, Trash2 } from "lucide-react"
import { Bundle } from "@/types/Bundle"
import { Team } from "@/types/Team"
import { Service } from "@/types/Service"
import BundleAdminPanel from "@/components/admin/BundleAdminPanel"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { fetchServices } from "@/services/serviceService"
import { fetchTeams } from "@/services/teamService"
import {
  fetchBundlesByTeam,
  createBundle,
  updateBundle,
  deleteBundle,
} from "@/services/bundleService"
import { toastError, toastSuccess } from "@/utils/toastUtils"
import { useRefresh } from "@/contexts/RefreshContext"


interface Props {
  enterpriseId: number
}

const BundleTabPanel: React.FC<Props> = ({ enterpriseId }) => {
  const [services, setServices] = useState<Service[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [bundles, setBundles] = useState<Bundle[]>([])

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { triggerRefresh } = useRefresh();
  

  // Load services on mount
  useEffect(() => {
    fetchServices(enterpriseId)
      .then(setServices)
      .catch(() => toastError("Error loading services."))
  }, [enterpriseId])

  // Load teams when service changes
  useEffect(() => {
    if (!selectedServiceId) return
    fetchTeams(selectedServiceId)
      .then((t) => {
        setTeams(t)
        if (t.length > 0) setSelectedTeamId(t[0].id)
      })
      .catch((error) => handleBackendError(error))
  }, [selectedServiceId])

  // Load bundles when team changes
  useEffect(() => {
    if (!selectedTeamId) return
    fetchBundlesByTeam(selectedTeamId)
      .then((b) => {
        setBundles(b)
        if (b.length > 0) {
          setSelectedBundle(b[0])
        } else {
          setSelectedBundle({
            id: 0,
            icon: "home",
            shortName: "New Bundle",
            longName: "New Bundle",
            displayorder: 0,
          })
        }
      })
      .catch((error) => handleBackendError(error))
  }, [selectedTeamId])

  const handleSaveBundle = async (bundle: Bundle) => {
    if (!selectedTeamId) {
      toastError("Please select a team first.")
      return
    }

    try {
      const saved = bundle.id === 0
        ? await createBundle(bundle, selectedTeamId)
        : await updateBundle(bundle)

      const updatedList = bundle.id === 0
        ? [...bundles, saved]
        : bundles.map((b) => (b.id === saved.id ? saved : b))

      setBundles(updatedList)
      setSelectedBundle(saved)
      toastSuccess("Bundle successfully registered.")
      triggerRefresh();      
    } catch (error) {
        handleBackendError(error)
    }
  }

  const handleDeleteBundle = async () => {
    if (!selectedBundle || selectedBundle.id === 0) return

    try {
      await deleteBundle(selectedBundle.id)
      const newList = bundles.filter((b) => b.id !== selectedBundle.id)
      setBundles(newList)
      setSelectedBundle(newList[0] ?? null)
      setShowDeleteDialog(false)
      toastSuccess("Bundle successfully deleted.")
      triggerRefresh();      
    } catch (error) {
        handleBackendError(error)
    }
  }

  return (
    <div className="flex w-full">
      <div className="w-1/5 p-4 border-r border-t bg-gray-50">
        <div className="mb-4 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Service</label>
          <Select
            value={selectedServiceId?.toString() ?? ""}
            onValueChange={(value) => setSelectedServiceId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="text-sm font-semibold text-gray-700">Team</label>
          <Select
            value={selectedTeamId?.toString() ?? ""}
            onValueChange={(value) => setSelectedTeamId(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ul className="space-y-2 mt-4">
          {bundles.map((bundle) => (
            <li key={bundle.id}>
              <button
                onClick={() => setSelectedBundle(bundle)}
                className={`w-full text-left p-2 rounded ${
                  selectedBundle?.id === bundle.id
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-gray-200"
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
            title="Create a new bundle"
            onClick={() =>
              setSelectedBundle({
                id: 0,
                icon: "home",
                shortName: "New Bundle",
                longName: "New Bundle",
                displayorder: 0,
              })
            }
          >
            <FilePlus className="w-6 h-6 text-gray-600" />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Delete this bundle"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete this bundle ?"
          description={`WARNING: You are going to delete the bundle "${selectedBundle?.shortName}" permanently.`}
          onConfirm={handleDeleteBundle}
        />
      </div>

      <div className="w-4/5 p-6 border-t">
        <BundleAdminPanel bundle={selectedBundle} onSave={handleSaveBundle} />
      </div>
    </div>
  )
}

export default BundleTabPanel