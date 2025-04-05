import React from "react"
import { User } from "@/types/User"
import { FilePlus, Trash2 } from "lucide-react"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"
import { Service } from "@/types/Service"

interface Props {
    users: User[]
    selectedUser: User | null
    onSelectUser: (user: User) => void
    onSaveUser: (user: User) => void
    onDeleteUser: () => void
    showDeleteDialog: boolean
    setShowDeleteDialog: (open: boolean) => void
    enterpriseId: number
    services: Service[] // ✅ nouveau
    selectedService: Service | null // 👈 nouveau
  }

const UserTabPanel: React.FC<Props> = ({
  users,
  selectedUser,
  onSelectUser,
  onSaveUser,
  onDeleteUser,
  showDeleteDialog,
  setShowDeleteDialog,
  enterpriseId,
  services,
  selectedService // ✅ nouveau
}) => {
  return (
    <div className="flex w-full">
      {/* Liste des utilisateurs */}
      <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => onSelectUser(user)}
                className={`w-full text-left p-2 rounded ${
                  selectedUser?.id === user.id
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-gray-200"
                }`}
              >
                {user.firstName} {user.lastName}
              </button>
            </li>
          ))}
        </ul>

        {/* Boutons ajout/suppression */}
        <div className="flex justify-between gap-2 mt-6">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            onClick={() => {
                const defaultServiceId =
                  selectedService?.id ?? (services.length > 0 ? services[0].id : -1)
              
                onSelectUser({
                  id: 0,
                  id_enterprise: enterpriseId,
                  id_service: defaultServiceId,
                  firstName: "",
                  lastName: "",
                  email: "",
                })
              }}
          >
            <FilePlus className="w-6 h-6 text-gray-600" />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-6 h-6 text-gray-600" />
          </button>

          <DeleteConfirmationDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Supprimer cet utilisateur ?"
            description={`ATTENTION : Vous allez supprimer l'utilisateur "${selectedUser?.firstName} ${selectedUser?.lastName}".`}
            onConfirm={onDeleteUser}
          />
        </div>
      </div>

      {/* Formulaire utilisateur */}
      <div className="w-4/5 p-6 border-t">
        {selectedUser && (
          <div className="space-y-4">

            {/* Champ Service */}
            <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">Service</label>
            <select
                className="flex-1 p-2 border rounded"
                value={selectedUser.id_service ?? -1}
                onChange={(e) =>
                onSelectUser({ ...selectedUser, id_service: parseInt(e.target.value) })
                }
            >
                <option value={-1}>Aucun</option>
                {services.map((service) => (
                <option key={service.id} value={service.id}>
                    {service.name}
                </option>
                ))}
            </select>
            </div>        

            {/* Champ Prénom */}
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                value={selectedUser.firstName}
                onChange={(e) =>
                  onSelectUser({ ...selectedUser, firstName: e.target.value })
                }
              />
            </div>

            {/* Champ Nom */}
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                value={selectedUser.lastName}
                onChange={(e) =>
                  onSelectUser({ ...selectedUser, lastName: e.target.value })
                }
              />
            </div>

            {/* Champ Email */}
            <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="flex-1 p-2 border rounded"
                value={selectedUser.email}
                onChange={(e) =>
                  onSelectUser({ ...selectedUser, email: e.target.value })
                }
              />
            </div>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onSaveUser(selectedUser)}
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserTabPanel