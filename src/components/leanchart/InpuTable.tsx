import React, { useState } from "react";
import { ChartData, ChartDescription } from "../../types/LeanChartData"; // Assurez-vous que ce type est correctement défini
import { MessageSquare } from "lucide-react"; // Importer l'icône de commentaire depuis Lucide

interface InputTableProps {
  shortTermChart: ChartDescription | undefined; // Le graphique court terme
  onValueChange: (entry: ChartData, newValue: number) => void; // Callback pour gérer les changements de valeur
  onTargetChange: (entry: ChartData, newTarget: number) => void; // Callback pour gérer les changements de target
  onCommentChange: (entry: ChartData, newComment: string) => void; // Callback pour gérer les changements de commentaire
}

const InputTable: React.FC<InputTableProps> = ({ shortTermChart, onValueChange, onTargetChange, onCommentChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture de la modale
  const [currentComment, setCurrentComment] = useState(""); // État pour stocker le commentaire en cours d'édition
  const [currentEntry, setCurrentEntry] = useState<ChartData | null>(null); // État pour stocker l'entrée en cours d'édition
  const [hoveredEntry, setHoveredEntry] = useState<ChartData | null>(null); // État pour gérer l'entrée survolée

  if (!shortTermChart || !Array.isArray(shortTermChart.values)) {
    return <p className="text-center text-gray-500">Aucun graphique disponible</p>;
  }

  const { values } = shortTermChart;

  // Fonction pour normaliser la date (dd-mm-yyyy -> yyyy-mm-dd)
  const normalizeDate = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  // Fonction pour obtenir le nom du jour et le numéro dans le mois
  const formatDate = (dateString: string) => {
    const normalizedDate = normalizeDate(dateString); // Normaliser la date
    const date = new Date(normalizedDate); // Créer un objet Date valide
    if (isNaN(date.getTime())) {
      return "Date invalide"; // Gérer les dates invalides
    }
    const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" }); // Nom du jour (ex: lun., mar.)
    const dayNumber = date.getDate(); // Numéro dans le mois
    return `${dayName} ${dayNumber}`;
  };

  // Fonction pour ouvrir la modale
  const openModal = (entry: ChartData) => {
    setCurrentComment(entry.comment); // Charger le commentaire actuel
    setCurrentEntry(entry); // Stocker l'entrée actuelle
    setIsModalOpen(true); // Ouvrir la modale
  };

  // Fonction pour enregistrer le commentaire
  const saveComment = () => {
    if (currentEntry) {
      onCommentChange(currentEntry, currentComment); // Appeler le callback pour enregistrer le commentaire
    }
    setIsModalOpen(false); // Fermer la modale
  };

  return (
    <div className="flex flex-col items-center mt-4 w-full">
      {/* Conteneur avec défilement horizontal */}
      <div className="w-full overflow-x-auto">
        {/* Conteneur global avec une grille pour aligner les titres et les champs */}
        <div className="grid gap-[3px] w-full min-w-[600px]">
          {/* Ligne des titres (nom du jour et numéro du mois) */}
          <div
            className="grid gap-[3px] w-full text-center text-xs font-medium text-gray-700"
            style={{
              gridTemplateColumns: `repeat(${values.length + 1}, 1fr)`, // Une colonne pour les titres et une pour chaque champ
            }}
          >
            <div></div> {/* Colonne vide pour aligner avec les titres */}
            {values.map((entry) => (
              <div key={entry.date}>{formatDate(entry.date)}</div>
            ))}
          </div>

          {/* Section pour Target */}
          <div
            className="grid gap-[3px] w-full items-center text-sm font-medium text-gray-700"
            style={{
              gridTemplateColumns: `1fr repeat(${values.length}, 1fr)`, // Une colonne pour le titre et une pour chaque champ
            }}
          >
            <div className="text-left">Target</div>
            {values.map((entry) => (
              <div key={entry.date} className="text-center">
                <input
                  type="number"
                  value={Number(entry.target).toFixed(0)}
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
            className="grid gap-[3px] w-full items-center text-sm font-medium text-gray-700"
            style={{
              gridTemplateColumns: `1fr repeat(${values.length}, 1fr)`, // Une colonne pour le titre et une pour chaque champ
            }}
          >
            <div className="text-left">Valeur</div>
            {values.map((entry) => (
              <div key={entry.date} className="text-center">
                <input
                  type="number"
                  value={Number(entry.value).toFixed(0)}
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
            className="grid gap-[3px] w-full items-center text-sm font-medium text-gray-700"
            style={{
              gridTemplateColumns: `1fr repeat(${values.length}, 1fr)`, // Une colonne pour le titre et une pour chaque champ
            }}
          >
            <div className="text-left">Note</div>
            {values.map((entry) => (
              <div
                key={entry.date}
                className="relative flex justify-center items-center"
                onMouseEnter={() => setHoveredEntry(entry)} // Définir l'entrée survolée
                onMouseLeave={() => setHoveredEntry(null)} // Réinitialiser l'entrée survolée
              >
                {/* Icône de commentaire */}
                <MessageSquare
                  className={`w-5 h-5 cursor-pointer ${
                    entry.comment ? "text-blue-500" : "text-gray-300"
                  }`} // Bleu si un commentaire existe, gris clair sinon
                  onClick={() => openModal(entry)} // Ouvrir la modale au clic
                />
                {/* Tooltip pour afficher le commentaire */}
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

      {/* Modale pour éditer le commentaire */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-medium mb-4">Modifier le commentaire</h2>
            <textarea
              className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)} // Mettre à jour le commentaire
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                onClick={() => setIsModalOpen(false)} // Fermer la modale sans enregistrer
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={saveComment} // Enregistrer le commentaire
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputTable;