import React, { useEffect, useState } from "react"
import { handleBackendError } from "@/utils/errorUtils"
import { FilePlus, Trash2 } from "lucide-react"
import { Team } from "@/types/Team"
import { Service } from "@/types/Service"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchServices } from "@/services/serviceService"
import { fetchTeams, createTeam, updateTeam, deleteTeam } from "@/services/teamService"
import { toastError, toastSuccess } from "@/utils/toastUtils"

interface Props {
  enterpriseId: number
}

const TeamTabPanel: React.FC<Props> = ({ enterpriseId }) => {
  const [services, setServices] = useState<Service[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchServices(enterpriseId)
      .then(setServices)
      .catch((error) => handleBackendError(error))
  }, [enterpriseId])

  useEffect(() => {
    if (!selectedServiceId) return
    fetchTeams(selectedServiceId)
      .then((fetchedTeams) => {
        setTeams(fetchedTeams)
        setSelectedTeam(fetchedTeams[0] ?? null)
      })
      .catch((error) => handleBackendError(error))
  }, [selectedServiceId])

  const handleSaveTeam = async () => {
    if (!selectedTeam) return
    try {
      const saved = selectedTeam.id === 0
        ? await createTeam(selectedTeam)
        : await updateTeam(selectedTeam)

      const updatedList = selectedTeam.id === 0
        ? [...teams, saved]
        : teams.map((t) => (t.id === saved.id ? saved : t))

      setTeams(updatedList)
      setSelectedTeam(saved)
      toastSuccess("Team successfully registered.")
    } catch (error) {
        handleBackendError(error)
    }
  }

  const handleDeleteTeam = async () => {
    if (!selectedTeam || selectedTeam.id === 0) return
    try {
      await deleteTeam(selectedTeam.id)
      const remaining = teams.filter((t) => t.id !== selectedTeam.id)
      setTeams(remaining)
      setSelectedTeam(remaining[0] ?? null)
      toastSuccess("Team successfully deleted.")
    } catch (error) {
        handleBackendError(error)
    }
  }

  return (
    <div className="flex w-full">
      <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Service
            </label>
            <Select
              value={selectedServiceId?.toString() ?? ""}
              onValueChange={(id) => setSelectedServiceId(Number(id))}
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
          </div>

          <ul className="space-y-2 mt-2">
            {teams.map((team) => (
              <li key={team.id}>
                <button
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full text-left p-2 rounded ${
                    selectedTeam?.id === team.id
                      ? "bg-blue-100 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {team.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between gap-2 mt-6">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Create a new team"
            disabled={!selectedServiceId}
            onClick={() => {
              if (!selectedServiceId) {
                toastError("Please select a service first.")
                return
              }
              setSelectedTeam({
                id: 0,
                id_service: selectedServiceId,
                name: "",
              })
            }}
          >
            <FilePlus className="w-6 h-6 text-gray-600" />
          </button>

          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Delete selected team"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>

          <DeleteConfirmationDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Delete this team?"
            description={`WARNING: You are about to delete the team "${selectedTeam?.name}" permanently.`}
            onConfirm={handleDeleteTeam}
          />
        </div>
      </div>

      <div className="w-4/5 p-6 border-t">
        {selectedTeam && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
            Team name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={selectedTeam.name}
              onChange={(e) =>
                setSelectedTeam({ ...selectedTeam, name: e.target.value })
              }
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSaveTeam}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamTabPanel