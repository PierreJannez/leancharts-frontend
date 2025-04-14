import React, { useState, useMemo } from "react";
import { LeanChart, ChartData } from "../../types/LeanChart"; // Assurez-vous que ce type est correctement défini
import { MessageSquare } from "lucide-react"; // Importer l'icône de commentaire depuis Lucide
import { getMonthYear } from "../../utils/DateUtils";
import TooltipPortal from "./TooltipPortal";
import CommentModal from "./CommentModal";


interface StandardLongTermeInputTableProps {
  leanChart: LeanChart | undefined; // Le graphique long terme
  onValueChange: (entry: ChartData, newValue: number) => void; // Callback pour gérer les changements de valeur
  onTargetChange: (entry: ChartData, newTarget: number) => void; // Callback pour gérer les changements de target
  onCommentChange: (entry: ChartData, newComment: string) => void; // Callback pour gérer les changements de commentaire
}

const StandardLongTermInputTable: React.FC<StandardLongTermeInputTableProps> = ({ leanChart, onValueChange, onTargetChange, onCommentChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture de la modale
  const [currentComment, setCurrentComment] = useState(""); // État pour stocker le commentaire en cours d'édition
  const [hoveredEntry1, setHoveredEntry1] = useState<ChartData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [currentEntry1, setCurrentEntry1] = useState<ChartData | null>(null);

  const values = useMemo(() => {
    if (!leanChart) return [];
    return leanChart.longTermData.map((entry) => ({
      date: entry.date,
      value: entry.value,
      target: entry.target,
      comment: entry.comment,
    }));
  }, [leanChart]);

  if (!leanChart) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  console.log("StandardLongTermeInputTableProps->leanchart.nbDecimal", leanChart.nbDecimal);

  // Fonction pour ouvrir la modale
  const openModal = (entry: ChartData) => {
    setCurrentComment(entry.comment); // Charger le commentaire actuel
    setCurrentEntry1(entry); // Stocker l'entrée actuelle
    setIsModalOpen(true); // Ouvrir la modale
  };

  // Fonction pour enregistrer le commentaire
  const saveComment = () => {
    if (currentEntry1) {
      onCommentChange(currentEntry1, currentComment); // Appeler le callback pour enregistrer le commentaire
    }
    setIsModalOpen(false); // Fermer la modale
  };

  return (
    <>
      {/* Titre et trait horizontal */}
      <div className="w-full mb-4">
        <h2 className="text-left text-md font-medium text-gray-700">Long term</h2>
        <hr className="mt-2 border-gray-300" />
      </div>

      <div className="flex flex-col items-center mt-4 w-full">
        {/* Conteneur avec défilement horizontal */}
        <div className="w-full overflow-x-auto">
          {/* Conteneur global avec une grille pour aligner les titres et les champs */}
          <div className="grid gap-[3px] w-full ">
            {/* Ligne des titres (nom du jour et numéro du mois) */}
            <div
              className="grid gap-[3px] w-full text-center text-xs font-medium text-gray-700"
              style={{
                gridTemplateColumns: `repeat(${values.length + 1}, 1fr)`, // Une colonne pour les titres et une pour chaque champ
              }}
            >
              <div></div> {/* Colonne vide pour aligner avec les titres */}
              {values.map((entry) => (
                <div key={entry.date}>
                  {getMonthYear(entry.date).split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>

            {/* Section pour Target */}
            <div
              className="grid gap-[3px] w-full items-center text-xs font-medium text-gray-700"
              style={{
                gridTemplateColumns: `1fr repeat(${values.length}, 1fr)`, // Une colonne pour le titre et une pour chaque champ
              }}
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
                    onChange={(e) => onTargetChange(entry, Number(e.target.value))} // Appelle onTargetChange
                    className="w-full px-1 py-0.5 text-xs text-center border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Section pour Valeur */}
            <div
              className="grid gap-[3px] w-full items-center text-xs font-medium text-gray-700"
              style={{
                gridTemplateColumns: `1fr repeat(${values.length}, 1fr)`, // Une colonne pour le titre et une pour chaque champ
              }}
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
                    onChange={(e) => onValueChange(entry, Number(e.target.value))} // Appelle onValueChange
                    className="w-full px-1 py-0.5 text-xs text-center border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Section pour Comment */}
            <div
              className="grid gap-[3px] w-full items-center text-xs font-medium text-gray-700"
              style={{
                gridTemplateColumns: `1fr repeat(${values.length}, 1fr)`, // Une colonne pour le titre et une pour chaque champ
              }}
            >
              <div className="text-left">Note</div>
              {values.map((entry) => (
                <div
                  key={entry.date}
                  className="relative flex justify-center items-center"
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    setHoveredEntry1(entry);
                    setTooltipPosition({
                      top: rect.top,
                      left: rect.left + rect.width / 2,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredEntry1(null);
                    setTooltipPosition(null);
                  }}
                >
                  <MessageSquare
                    className={`w-8 h-8 cursor-pointer rounded-full p-1 ${
                      entry.comment ? "text-blue-500 bg-blue-100" : "text-gray-300"
                    }`}
                    onClick={() => openModal(entry)}
                  />
                  {hoveredEntry1 && tooltipPosition && hoveredEntry1.comment && (
                    <TooltipPortal position={tooltipPosition}>
                      <div className="bg-gray-700 text-white text-xs rounded px-2 py-1 shadow-lg max-w-xs whitespace-pre-wrap">
                        {hoveredEntry1.comment}
                      </div>
                    </TooltipPortal>
                  )}
                </div>
              ))}
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
      </div>
    </>
  );
};

export default StandardLongTermInputTable;