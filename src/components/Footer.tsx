import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-600 text-white text-center p-4 mt-8">
      <p>&copy; {new Date().getFullYear()} Lean Charts. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;