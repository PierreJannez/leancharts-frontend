import React from "react"
import { Team } from "@/types/Team"
import { Service } from "@/types/Service"
import { FilePlus, Trash2 } from "lucide-react"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  services: Service[]
  selectedServiceId: number | null
  onServiceChange: (id: number) => void

  teams: Team[]
  selectedTeam: Team | null
  onSelectTeam: (team: Team) => void
  onSaveTeam: (team: Team) => void
  onDeleteTeam: () => void
  showDeleteDialog: boolean
  setShowDeleteDialog: (open: boolean) => void
}

const TeamTabPanel: React.FC<Props> = ({
  services,
  selectedServiceId,
  onServiceChange,
  teams,
  selectedTeam,
  onSelectTeam,
  onSaveTeam,
  onDeleteTeam,
  showDeleteDialog,
  setShowDeleteDialog,
}) => {
  return (
    <div className="flex w-full">
      {/* Liste des équipes */}
      <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Dropdown service */}
          <Select
            value={selectedServiceId?.toString() ?? ""}
            onValueChange={(id) => onServiceChange(Number(id))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Liste des teams */}
          <ul className="space-y-2">
            {teams.map((team) => (
              <li key={team.id}>
                <button
                  onClick={() => onSelectTeam(team)}
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

        {/* Boutons ajouter/supprimer */}
        <div className="flex justify-between gap-2 mt-6">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Créer une nouvelle équipe"
            onClick={() =>
              onSelectTeam({
                id: 0,
                id_service: selectedServiceId ?? 0,
                name: "",
              })
            }
          >
            <FilePlus className="w-6 h-6 text-gray-600" />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Supprimer l'équipe sélectionnée"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>

          <DeleteConfirmationDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Supprimer cette équipe ?"
            description={`ATTENTION : Vous allez supprimer l'équipe "${selectedTeam?.name}" définitivement.`}
            onConfirm={onDeleteTeam}
          />
        </div>
      </div>

      {/* Formulaire de modification */}
      <div className="w-4/5 p-6 border-t">
        {selectedTeam && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nom de l'équipe</span>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={selectedTeam.name}
                onChange={(e) =>
                  onSelectTeam({ ...selectedTeam, name: e.target.value })
                }
              />
            </label>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onSaveTeam(selectedTeam)}
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamTabPanel