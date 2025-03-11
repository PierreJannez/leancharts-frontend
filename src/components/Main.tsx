import React from "react";

const Main: React.FC = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center">Bienvenue !</h2>
        <p className="text-gray-600 text-center">
          Ceci est le contenu principal de l'application. Vous pouvez ajouter vos propres éléments ici.
        </p>
      </div>
    </div>
  );
};

export default Main;