import Papa from "papaparse";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleBackendError } from "@/utils/errorUtils";
import { updateShortTermChartValue, updateLongTermChartValue } from "@/services/leanChartDataService";

interface ImportCSVModalProps {
  chartId: number;
  onImportFinished?: () => void;
}

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({ chartId, onImportFinished }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"shortTerm" | "longTerm">("shortTerm");

  const handleImport = async () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as {
          date: string;
          target: string;
          value: string;
          comment?: string;
        }[];

        const parsedRows = rows.map((row) => ({
          date: row.date,
          target: parseFloat(row.target),
          value: parseFloat(row.value),
          comment: row.comment ?? "",
        }));

        try {
          if (selectedType === "shortTerm") {
            for (const row of parsedRows) {
              await updateShortTermChartValue(chartId, row.date, row.target, row.value, row.comment);
            }
          } else {
            for (const row of parsedRows) {
              await updateLongTermChartValue(chartId, row.date, row.target, row.value, row.comment);
            }
          }

          setError(null);
          onImportFinished?.();
        } catch (error) {
          console.error("Erreur pendant l'import CSV:", error);
          setError("Erreur lors de l'import des données.");
          handleBackendError(error);
        }
      },
    });
  };

  return (
    <div className="space-y-4 bg-white/90 backdrop-blur-sm p-4 rounded shadow ">
      <h2 className="text-md font-semibold text-gray-800 mb-2">Importer des données CSV</h2>
      <div className="flex justify-between items-center gap-2 ">
        <Button
          variant={selectedType === "shortTerm" ? "default" : "outline"}
          onClick={() => setSelectedType("shortTerm")}
        >
          Court Terme
        </Button>
        <Button
          variant={selectedType === "longTerm" ? "default" : "outline"}
          onClick={() => setSelectedType("longTerm")}
        >
          Long Terme
        </Button>
      </div>

      <Input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleImport} disabled={!file}>
        Importer les données {selectedType === "shortTerm" ? "Short term" : "Long term"}
      </Button>
    </div>
  );
};

export default ImportCSVModal;