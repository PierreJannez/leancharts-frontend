import React, { useState } from "react";
import { ChartData, LeanChart } from "../../types/LeanChart";
import { MessageSquare } from "lucide-react";
import { formatFrShortDateLabel } from "../../utils/DateUtils";
import TooltipPortal from "./TooltipPortal";
import CommentModal from "./CommentModal";

interface StandardShortTermInputTableProps {
  leanChart: LeanChart | undefined;
  onValueChange: (entry: ChartData, newValue: number) => void;
  onTargetChange: (entry: ChartData, newTarget: number) => void;
  onCommentChange: (entry: ChartData, newComment: string) => void;
  onMainTargetChange: (newTarget: number) => void; // 👈 nouvelle prop
}

const StandardShortTermInputTable: React.FC<StandardShortTermInputTableProps> = ({
  leanChart,
  onValueChange,
  onTargetChange,
  onCommentChange,
  onMainTargetChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [hoveredEntry, setHoveredEntry] = useState<ChartData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [currentEntry, setCurrentEntry] = useState<ChartData | null>(null);
  const [bulkTarget, setBulkTarget] = useState<number>(leanChart?.shortTermMainTarget || 0);

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
        <div className="flex justify-between items-center">
          <h2 className="text-left text-md font-medium text-gray-700">Court Terme</h2>

          <div className="flex items-center gap-2">
            
            <input
              type="number"
              value={bulkTarget}
              onChange={async (e) => {
                const newTarget = Number(e.target.value);
                const prevTarget = bulkTarget;

                setBulkTarget(newTarget);
                leanChart.shortTermMainTarget = newTarget;

                try {
                  await onMainTargetChange(newTarget); // ⚠️ doit être async
                } catch (error) {
                  console.error("Erreur lors de la mise à jour de la cible principale :", error);
                  setBulkTarget(prevTarget); // rollback
                  leanChart.shortTermMainTarget = prevTarget;
                }
              }}
              className="border border-gray-300 rounded p-1 text-sm w-14 text-center bg-white"
            />
              <button
              onClick={applyBulkTarget}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Répartir la cible
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
                  <input
                    type="number"
                    value={
                      Number(leanChart.nbDecimal) === 0
                        ? Number(entry.target).toFixed(leanChart.nbDecimal)
                        : entry.target
                    }
                    onChange={(e) => onTargetChange(entry, Number(e.target.value))}
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
                  <input
                    type="number"
                    value={
                      Number(leanChart.nbDecimal) === 0
                        ? Number(entry.value).toFixed(leanChart.nbDecimal)
                        : entry.value
                    }
                    onChange={(e) => handleValueChange(entry, Number(e.target.value))}
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
                  <MessageSquare
                    className={`w-8 h-8 cursor-pointer rounded-full p-1 ${
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
    </>
  );
};

export default StandardShortTermInputTable;
