import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { getIcon } from "../utils/icons";

// Define the Group interface
interface Bundle {
  id: number;
  shortName: string;
  longName: string;
  icon: string;
}

interface HeaderProps {
  menuItems: Bundle[];
  onSelectBundle: (bundleId: number, bundleName: string) => void;
  onLogout: () => void; // 👈 Ajout de la prop
}

const Header: React.FC<HeaderProps> = ({ menuItems, onSelectBundle, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="relative bg-white text-black p-4 shadow-md">
      <div className="mx-auto flex justify-between items-center">
        {/* Left side: menu + logo */}
        <div className="flex items-center">
          <button
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="px-2 font-bold">Lean Graph</h1>
        </div>

        {/* Right side: logout */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onLogout}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      {isMenuOpen && (
        <div className="absolute border border-gray-200 bg-white w-36 shadow-lg rounded-md z-50 mt-2">
          <nav>
            <ul>
              {menuItems.map((bundle) => {
                const IconComponent = getIcon(bundle.icon);
                return (
                  <li key={bundle.id}>
                    <button
                      className="flex text-black items-center gap-2 py-2 px-4 hover:bg-blue-50 rounded w-full text-left"
                      onClick={() => {
                        onSelectBundle(bundle.id, bundle.shortName);
                        navigate(`/bundle/${bundle.shortName}`);
                        setIsMenuOpen(false);
                      }}
                    >
                      <IconComponent size={16} className="text-black" />
                      {bundle.shortName}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;