// components/admin/tabs/BundleTabPanel.tsx
import React from "react"
import { FilePlus, Trash2 } from "lucide-react"
import { Bundle } from "@/types/Bundle"
import BundleAdminPanel from "@/components/admin/BundleAdminPanel"
import DeleteConfirmationDialog from "@/utils/DeleteConfirmationDialog"

interface Props {
  bundles: Bundle[]
  selectedBundle: Bundle | null
  onSelectBundle: (bundle: Bundle) => void
  onSaveBundle: (bundle: Bundle) => void
  onDeleteBundle: () => void
  showDeleteDialog: boolean
  setShowDeleteDialog: (open: boolean) => void
}

const BundleTabPanel: React.FC<Props> = ({
  bundles,
  selectedBundle,
  onSelectBundle,
  onSaveBundle,
  onDeleteBundle,
  showDeleteDialog,
  setShowDeleteDialog,
}) => {
  return (
    <div className="flex w-full">
      <div className="w-1/5 p-4 border-r border-t bg-gray-50 flex flex-col justify-between">
        <ul className="space-y-2">
          {bundles.map((bundle) => (
            <li key={bundle.id}>
              <button
                onClick={() => onSelectBundle(bundle)}
                className={`w-full text-left p-2 rounded ${
                  selectedBundle?.id === bundle.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-200"
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
            onClick={() =>
              onSelectBundle({
                id: 0,
                icon: "CirclePlus",
                shortName: "",
                longName: "",
                displayorder: 0,
              })
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
            title="Supprimer ce bundle ?"
            description={`ATTENTION : Vous allez supprimer le bundle "${selectedBundle?.shortName}" définitivement. Cette action est irréversible.`}
            onConfirm={onDeleteBundle}
          />
        </div>
      </div>

      <div className="w-4/5 p-6 border-t">
        <BundleAdminPanel bundle={selectedBundle} onSave={onSaveBundle} />
      </div>
    </div>
  )
}

export default BundleTabPanel