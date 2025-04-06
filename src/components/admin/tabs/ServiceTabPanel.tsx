import React, { useEffect, useState } from "react"
import { Service } from "@/types/Service"
import { FilePlus, Trash2 } from "lucide-react"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "@/services/serviceService"
import { toastError, toastSuccess } from "@/utils/toastUtils"

interface Props {
  enterpriseId: number
}

const ServiceTabPanel: React.FC<Props> = ({ enterpriseId }) => {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchServices(enterpriseId)
      .then((s) => {
        setServices(s)
        if (s.length > 0) setSelectedService(s[0])
      })
      .catch(() => toastError("Erreur lors du chargement des services."))
  }, [enterpriseId])

  const handleSaveService = async (service: Service) => {
    try {
      const saved = service.id ? await updateService(service) : await createService(service)
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
      console.error("Erreur lors de la sauvegarde du service :", error)
    }
  }

  const handleDeleteService = async () => {
    if (!selectedService) return
    try {
      await deleteService(selectedService.id)
      setServices((prev) => prev.filter((s) => s.id !== selectedService.id))
      setSelectedService(null)
      toastSuccess("Service supprimé avec succès.")
    } catch (error) {
      toastError("Erreur lors de la suppression du service.")
      console.error("Erreur lors de la suppression du service :", error)
    }
  }

  return (
    <div className="flex w-full">
      <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
        <ul className="space-y-2">
          {services.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setSelectedService(s)}
                className={`w-full text-left p-2 rounded ${
                  selectedService?.id === s.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
                }`}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between gap-2 mt-6">
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            onClick={() =>
              setSelectedService({ id: 0, id_enterprise: enterpriseId, name: "" })
            }
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
            title="Supprimer ce service ?"
            description={`ATTENTION : Vous allez supprimer le service "${selectedService?.name}" définitivement.`}
            onConfirm={handleDeleteService}
          />
        </div>
      </div>

      <div className="w-4/5 p-6 border-t">
        {selectedService && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Nom du service</span>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={selectedService.name}
                onChange={(e) =>
                  setSelectedService({ ...selectedService, name: e.target.value })
                }
              />
            </label>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleSaveService(selectedService)}
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceTabPanel