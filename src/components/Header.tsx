import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, UserCircle, LogOut, Settings, MessageSquarePlus} from "lucide-react";
import { getIcon } from "../utils/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Ton hook personnalisé

interface Bundle {
  id: number;
  shortName: string;
  longName: string;
  icon: string;
}

interface HeaderProps {
  menuItems: Bundle[];
  onSelectBundle: (bundleId: number, bundleName: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ menuItems, onSelectBundle, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();       // 🧠 supprime le token + change l'état auth
    onLogout();     // 👈 côté app si tu veux rediriger ou nettoyer autre chose
  };

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
          <h1 className="px-2 font-bold">Lean Charts</h1>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://forms.gle/QuUwMgfCYeXDnGhP9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            LeanCharts - Donnez votre avis
          </a>
        </div>

        {/* Right side: user menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                  <UserCircle className="w-6 h-6 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                  Configuration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2 text-muted-foreground" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Dropdown menu (bundles) */}
      {isMenuOpen && (
        <div className="absolute border border-gray-200 bg-white w-40 shadow-lg rounded-md z-50 mt-2">
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