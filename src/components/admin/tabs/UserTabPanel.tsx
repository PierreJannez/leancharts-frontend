import React, { useEffect, useState } from "react"
import { handleBackendError } from "@/utils/errorUtils"
import { FilePlus, Trash2 } from "lucide-react"
import { User } from "@/types/User"
import { Service } from "@/types/Service"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"
import { fetchUsers, createUser, updateUser, deleteUser } from "@/services/userService"
import { fetchServices } from "@/services/serviceService"
import { toastSuccess } from "@/utils/toastUtils"

interface Props {
  enterpriseId: number
}

const UserTabPanel: React.FC<Props> = ({ enterpriseId }) => {
  const [users, setUsers] = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchUsers(enterpriseId)
      .then((u) => {
        setUsers(u)
        setSelectedUser(u[0] ?? null)
      })
      .catch((error) => handleBackendError(error))

    fetchServices(enterpriseId)
      .then(setServices)
      .catch((error) => handleBackendError(error))
  }, [enterpriseId])

  const handleSaveUser = async (user: User) => {
    try {
      const saved = user.id ? await updateUser(user) : await createUser(user)
      setUsers((prev) => {
        const idx = prev.findIndex((u) => u.id === saved.id)
        return idx >= 0
          ? [...prev.slice(0, idx), saved, ...prev.slice(idx + 1)]
          : [...prev, saved]
      })
      setSelectedUser(saved)
      toastSuccess("Utilisateur enregistré avec succès.")
    } catch (error) {
        handleBackendError(error)
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
        handleBackendError(error)  
    }
  }

  return (
    <div className="flex w-full">
      {/* Liste des utilisateurs */}
      <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-2 rounded ${
                  selectedUser?.id === user.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
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
              const defaultServiceId = services[0]?.id ?? -1
              setSelectedUser({
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
            onConfirm={handleDeleteUser}
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
                  setSelectedUser({ ...selectedUser, id_service: parseInt(e.target.value) })
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
                  setSelectedUser({ ...selectedUser, firstName: e.target.value })
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
                  setSelectedUser({ ...selectedUser, lastName: e.target.value })
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
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </div>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleSaveUser(selectedUser)}
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