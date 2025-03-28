import React, { useState, useMemo } from "react";
import { LeanChart, ChartData } from "../../types/LeanChart"; // Assurez-vous que ce type est correctement défini
import { MessageSquare } from "lucide-react"; // Importer l'icône de commentaire depuis Lucide

interface StandardLongTermeInputTableProps {
  leanChart: LeanChart | undefined; // Le graphique long terme
  onValueChange: (entry: ChartData, newValue: number) => void; // Callback pour gérer les changements de valeur
  onTargetChange: (entry: ChartData, newTarget: number) => void; // Callback pour gérer les changements de target
  onCommentChange: (entry: ChartData, newComment: string) => void; // Callback pour gérer les changements de commentaire
}

const StandardLongTermInputTable: React.FC<StandardLongTermeInputTableProps> = ({ leanChart, onValueChange, onTargetChange, onCommentChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture de la modale
  const [currentComment, setCurrentComment] = useState(""); // État pour stocker le commentaire en cours d'édition
  const [currentEntry1, setCurrentEntry1] = useState<ChartData | null>(null); // État pour stocker l'entrée en cours d'édition
  const [hoveredEntry1, setHoveredEntry1] = useState<ChartData | null>(null); // État pour gérer l'entrée survolée

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

  // Fonction pour normaliser la date (dd-mm-yyyy -> yyyy-mm-dd)
  const getMonthYear = (dateString: string) => {
    const [, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
    
    // Récupérer le nom du mois avec la première lettre en majuscule
    const monthName = date.toLocaleString("fr-FR", { month: "long" });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
    // Extraire les deux derniers chiffres de l'année
    const shortYear = year.slice(-2);
  
    return `${capitalizedMonth} ${shortYear}`;
  };

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
        <h2 className="text-left text-md font-medium text-gray-700">Saisie des données à long terme</h2>
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
                <div key={entry.date}>{getMonthYear(entry.date)}</div>
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
                  onMouseEnter={() => setHoveredEntry1(entry)}
                  onMouseLeave={() => setHoveredEntry1(null)}
                >
                  <MessageSquare
                    className={`w-5 h-5 cursor-pointer rounded-full p-1 ${
                      entry.comment ? "text-blue-500 bg-blue-100" : "text-gray-300"
                    }`}
                    onClick={() => openModal(entry)}
                  />
                  {hoveredEntry1 === entry && entry.comment && (
                    <div className="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg">
                      {entry.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modale pour éditer le commentaire */}
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
      </div>
    </>
  );
};

export default StandardLongTermInputTable;