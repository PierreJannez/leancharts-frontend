import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { getIcon } from "../utils/icons"; // Import utility function

// Define the Group interface
interface Bundle {
  id: number;
  shortName: string;
  longName: string;
  icon: string;
}

interface HeaderProps {
  menuItems: Bundle[]; // Receive menu items as a prop
  onSelectBundle: (bundleId: number, bundleName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ menuItems, onSelectBundle: onSelectBundle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Enable programmatic navigation

  return (
    <header className="bg-white text-black p-4 shadow-md">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="px-2 font-bold">Opta Graph</h1>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute border border-gray-200 bg-white w-36 shadow-lg rounded-md z-50">
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
                        navigate(`/bundle/${bundle.shortName.toLowerCase()}`); // Navigate to the correct route
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