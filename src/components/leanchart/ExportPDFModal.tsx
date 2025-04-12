import React from "react";
import { FileText } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ExportPDF, ExportPDFViewer } from "@/utils/ExportPDF";

interface ExportPDFModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  images: string[] | null;
  onTriggerClick: () => void;
  bundleTitle: string;
}

const ExportPDFModal: React.FC<ExportPDFModalProps> = ({ open, setOpen, images, onTriggerClick, bundleTitle }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
  onClick={onTriggerClick}
  className="bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
>
  <FileText className="w-5 h-5 text-gray-700" />
</button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] h-[92vh] p-4 bg-white border border-gray-600">
        <div className="flex items-center justify-between mt-4 mb-4">
          <h2 className="text-xl font-semibold">Aperçu PDF des graphes</h2>
          {images && (
            <PDFDownloadLink
              document={<ExportPDF images={images} bundleTitle={bundleTitle}/>}
              fileName="leancharts.pdf"
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Télécharger le PDF
            </PDFDownloadLink >
          )}
        </div>

        {images && (
          <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden flex justify-center items-start">
            <ExportPDFViewer images={images} bundleTitle={bundleTitle}/>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportPDFModal;
