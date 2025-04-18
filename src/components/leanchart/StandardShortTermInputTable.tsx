import React, { useState } from "react";
import { ChartData, LeanChart } from "../../types/LeanChart";
import { MessageCircleWarning, UploadCloud } from "lucide-react";
import { formatFrShortDateLabel } from "../../utils/DateUtils";
import TooltipPortal from "./TooltipPortal";
import CommentModal from "./CommentModal";
import ImportCSVModal from "../importation/ImportCSVModal";
import { Button } from "@/components/ui/button"
import SmartNumberInput from "@/utils/SmartNumberInput";

interface StandardShortTermInputTableProps {
  leanChart: LeanChart | undefined;
  onValueChange: (entry: ChartData, newValue: number) => void;
  onTargetChange: (entry: ChartData, newTarget: number) => void;
  onCommentChange: (entry: ChartData, newComment: string) => void;
  onMainTargetChange: (newTarget: number) => void; // 👈 nouvelle prop
  onRefreshRequested?: () => void; // 👈 nouvelle prop facultative
}

const StandardShortTermInputTable: React.FC<StandardShortTermInputTableProps> = ({
  leanChart,
  onValueChange,
  onTargetChange,
  onCommentChange,
  onMainTargetChange,
  onRefreshRequested
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [hoveredEntry, setHoveredEntry] = useState<ChartData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [currentEntry, setCurrentEntry] = useState<ChartData | null>(null);
  const [bulkTarget, setBulkTarget] = useState<number>(leanChart?.shortTermMainTarget || 0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const values = leanChart?.shortTermData || [];

  if (!leanChart) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const handleValueChange = (entry: ChartData, newValue: number) => {
    onValueChange(entry, newValue);
  };

  const openModal = (entry: ChartData) => {
    setCurrentComment(entry.comment);
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };

  const saveComment = () => {
    if (currentEntry) {
      onCommentChange(currentEntry, currentComment);
    }
    setIsModalOpen(false);
  };

  const applyBulkTarget = () => {
    if (leanChart.isCumulative) 
    {
      const days = leanChart.shortTermData.length;
      const targetPerDay = Number((bulkTarget / days).toFixed(leanChart.nbDecimal));
      let cumulativeTarget = 0;
      leanChart.shortTermData.forEach((entry) => {
        cumulativeTarget += targetPerDay;
        entry.target = cumulativeTarget;
        onTargetChange(entry, cumulativeTarget);
      });
    } else {
        leanChart.shortTermData.forEach((entry) => {
          entry.target = bulkTarget;
          onTargetChange(entry, bulkTarget);
      });
    }
  }

  return (
    <>
      <div className="w-full mb-4">
      <div className="grid grid-cols-3 items-center">
        {/* Colonne 1 : Titre "Short term" */}
        <div className="flex items-center gap-2">
          <h2 className="text-left text-md font-medium text-gray-700">Short term</h2>
        </div>

        {/* Colonne 2 : Bouton Import centré */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsImportModalOpen(true)} 
            className="flex items-center gap-1 text-sm bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100 transition-colors"
            title="Upload a CSV file"
          >
            <UploadCloud size={24} />
          </button>
        </div>

        {/* Colonne 3 : Champ + bouton de répartition */}
        <div className="flex justify-end items-center gap-2">
          <input
            type="number"
            value={bulkTarget}
            onChange={async (e) => {
              const newTarget = Number(e.target.value);
              const prevTarget = bulkTarget;
              setBulkTarget(newTarget);
              leanChart.shortTermMainTarget = newTarget;
              try {
                await onMainTargetChange(newTarget);
              } catch (error) {
                console.error("Erreur lors de la mise à jour de la cible principale :", error);
                setBulkTarget(prevTarget);
                leanChart.shortTermMainTarget = prevTarget;
              }
            }}
            className="border border-gray-300 rounded p-1 text-sm w-14 text-center bg-white"
          />
          <button
            onClick={applyBulkTarget}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Distribute the target
          </button>
        </div>
      </div>
        <hr className="mt-2 border-gray-300" />
      </div>
      <div className="flex flex-col items-center mt-4 w-full">
        <div className="w-full overflow-x-auto">
          <div className="grid gap-[3px] w-full min-w-[600px]">
            <div
              className="grid gap-[3px] w-full text-center text-xs text-gray-700"
              style={{ gridTemplateColumns: `repeat(${values.length + 1}, 1fr)` }}
            >
              <div className="text-left"></div>
              {values.map((entry) => (
                <div key={entry.date}>
                  {formatFrShortDateLabel(entry.date).split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>

            <div
              className="grid gap-[3px] w-full items-center text-xs text-gray-700"
              style={{ gridTemplateColumns: `1fr repeat(${values.length}, 1fr)` }}
            >
              <div className="text-left">Target</div>
              {values.map((entry) => (
                <div key={entry.date} className="text-center">
                  <SmartNumberInput
                    value={Number(entry.target)}
                    onChange={(val) => onTargetChange(entry, val)}
                    nbDecimal={leanChart.nbDecimal}
                    className="w-full text-xs text-center border border-gray-300 rounded bg-white"
                  />
                </div>
              ))}
            </div>

            <div
              className="grid gap-[3px] w-full items-center text-xs text-gray-700"
              style={{ gridTemplateColumns: `1fr repeat(${values.length}, 1fr)` }}
            >
              <div className="text-left">Valeur</div>
              {values.map((entry) => (              
                <div key={entry.date} className="text-center">
                  <SmartNumberInput
                    value={Number(entry.value)}
                    onChange={(val) => handleValueChange(entry, val)}
                    nbDecimal={leanChart.nbDecimal}
                    className="w-full text-xs text-center border border-gray-300 rounded bg-white"
                  />
                </div>               
              ))}
            </div>
            <div
              className="grid gap-[3px] w-full items-center text-xs text-gray-700"
              style={{ gridTemplateColumns: `1fr repeat(${values.length}, 1fr)` }}
            >
              <div className="text-left">Note</div>
              {values.map((entry) => (
                <div
                  key={entry.date}
                  className="relative flex justify-center items-center"
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    setHoveredEntry(entry);
                    setTooltipPosition({
                      top: rect.top,
                      left: rect.left + rect.width / 2,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredEntry(null);
                    setTooltipPosition(null);
                  }}
                >
                  <MessageCircleWarning
                    className={`w-7 h-7 cursor-pointer rounded-full p-1 ${
                      entry.comment ? "text-blue-500 bg-blue-100" : "text-gray-300"
                    }`}
                    onClick={() => openModal(entry)}
                  />
                  {hoveredEntry && tooltipPosition && hoveredEntry.comment && (
                    <TooltipPortal position={tooltipPosition}>
                      <div className="bg-gray-700 text-white text-xs rounded px-2 py-1 shadow-lg max-w-xs whitespace-pre-wrap">
                        {hoveredEntry.comment}
                      </div>
                    </TooltipPortal>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CommentModal
        open={isModalOpen}
        comment={currentComment}
        onChange={setCurrentComment}
        onCancel={() => setIsModalOpen(false)}
        onSave={saveComment}
      />

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full border border-gray-400">
            <ImportCSVModal
              chartId={leanChart.id}
              onImportFinished={() => {
                setIsImportModalOpen(false);
                onRefreshRequested?.(); // 👈 appelle le parent pour recharger
              }}
            />
          <div className="mt-4 text-right">
              <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}  
    </>
    
  );
};

export default StandardShortTermInputTable;
