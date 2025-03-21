import React, { useState, useMemo } from "react";
import { ChartData, LeanChart } from "../../types/LeanChart";
import { MessageSquare } from "lucide-react";
import {formatFrShortDateLabel} from "../../utils/DateUtils";

interface StandardShortTermInputTableProps {
  leanChart: LeanChart | undefined;
  onValueChange: (entry: ChartData, newValue: number) => void;
  onTargetChange: (entry: ChartData, newTarget: number) => void;
  onCommentChange: (entry: ChartData, newComment: string) => void;
}

const StandardShortTermInputTable: React.FC<StandardShortTermInputTableProps> = ({
  leanChart,
  onValueChange,
  onTargetChange,
  onCommentChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [currentEntry, setCurrentEntry] = useState<ChartData | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<ChartData | null>(null);

  const values = useMemo(() => {
    if (!leanChart) return [];
    return leanChart.shortTermData.map((entry) => ({
      date: entry.date,
      value: entry.value,
      target: entry.target,
      comment: entry.comment,
    }));
  }, [leanChart]);


  
  if (!leanChart) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  // Gestion du changement de valeur 
  const handleValueChange = (entry: ChartData, newValue: number) => {
    onValueChange(entry, newValue);
  };

  // Fonction pour ouvrir la modale
  const openModal = (entry: ChartData) => {
    setCurrentComment(entry.comment);
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };

  // Fonction pour enregistrer le commentaire
  const saveComment = () => {
    if (currentEntry) {
      onCommentChange(currentEntry, currentComment);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full mb-4">
        <h2 className="text-left text-md font-medium text-gray-700">Saisie des données</h2>
        <hr className="mt-2 border-gray-300" />
      </div>

      <div className="flex flex-col items-center mt-4 w-full">
        <div className="w-full overflow-x-auto">
          <div className="grid gap-[3px] w-full min-w-[600px]">
            <div
              className="grid gap-[3px] w-full text-center text-xs text-gray-700"
              style={{ gridTemplateColumns: `repeat(${values.length + 1}, 1fr)` }}
            >
              <div></div>
              {values.map((entry) => (
                <div key={entry.date}>{formatFrShortDateLabel(entry.date)}</div>
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
                    value={Number(entry.target).toFixed(0)}
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
                    value={Number(entry.value).toFixed(0)}
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
                  onMouseEnter={() => setHoveredEntry(entry)}
                  onMouseLeave={() => setHoveredEntry(null)}
                >
                  <MessageSquare
                    className={`w-5 h-5 cursor-pointer rounded-full p-1 ${
                      entry.comment ? "text-blue-500 bg-blue-100" : "text-gray-300"
                    }`}
                    onClick={() => openModal(entry)}
                  />
                  {hoveredEntry === entry && entry.comment && (
                    <div className="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">
                      {entry.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-medium mb-4">Modifier le commentaire</h2>
            <textarea
              className="w-full h-32 p-2 border border-gray-300 rounded"
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={() => setIsModalOpen(false)}>
                Annuler
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={saveComment}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StandardShortTermInputTable;