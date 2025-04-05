// components/admin/tabs/ServiceTabPanel.tsx
import React from "react"
import { Service } from "@/types/Service"
import { FilePlus, Trash2 } from "lucide-react"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"

interface Props {
  services: Service[]
  selectedService: Service | null
  onSelectService: (s: Service) => void
  onSaveService: (s: Service) => void
  onDeleteService: () => void
  showDeleteDialog: boolean
  setShowDeleteDialog: (v: boolean) => void
  enterpriseId: number
}

const ServiceTabPanel: React.FC<Props> = ({
  services,
  selectedService,
  onSelectService,
  onSaveService,
  onDeleteService,
  showDeleteDialog,
  setShowDeleteDialog,
  enterpriseId,
}) => {
  
  console.log("🔍 props ServiceTabPanel", services, selectedService)
  
  return (
    <div className="flex w-full">
      <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
        <ul className="space-y-2">
          {services.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onSelectService(s)}
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
              onSelectService({ id: 0, id_enterprise: enterpriseId, name: "" })
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
            onConfirm={onDeleteService}
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
                  onSelectService({ ...selectedService, name: e.target.value })
                }
              />
            </label>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => onSaveService(selectedService)}
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