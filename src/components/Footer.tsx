import React from "react";
import { VERSION } from "@/version";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-600 text-white text-center p-4 mt-8">
      <p>&copy; {new Date().getFullYear()} Lean Charts. Tous droits réservés.</p>
      <span className="text-xs text-gray-400">Version {VERSION}</span>
    </footer>
  );
};

export default Footer;