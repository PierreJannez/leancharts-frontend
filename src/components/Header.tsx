import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  UserCircle,
  LogOut,
  Settings,
  MessageSquarePlus,
  ChevronDown,
} from "lucide-react"
import { getIcon } from "../utils/icons"
import { useAuth } from "@/contexts/AuthContext"
import { fetchTeams } from "@/services/teamService"
import { fetchBundlesByTeam } from "@/services/bundleService"

import { Team } from "@/types/Team"
import { Bundle } from "@/types/Bundle"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import miroIcon from "/miro.svg"

const Header: React.FC<{
  onSelectBundle: (bundleId: number, bundleName: string) => void
  onLogout: () => void
}> = ({ onSelectBundle, onLogout }) => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const [iframeModalOpen, setIframeModalOpen] = useState(false)

  const iframeURL = `${window.location.origin}/login`
  const iframeCode = `<iframe src="${iframeURL}" width="75%" height="75%" style="border: none;" sandbox="allow-modals
 allow-forms allow-scripts allow-same-origin allow-popups allow-downloads allow-popups-to-escape-sandbox"></iframe>`;  
  useEffect(() => {
    if (user?.id_service) {
      fetchTeams(user.id_service).then((t) => {
        setTeams(t)
        if (t.length > 0) {
          const firstTeam = t[0]
          setSelectedTeamId(firstTeam.id)
        }
      })
    }
  }, [user])

  useEffect(() => {
    if (selectedTeamId) {
      fetchBundlesByTeam(selectedTeamId).then((fetchedBundles) => {
        setBundles(fetchedBundles)
        if (fetchedBundles.length > 0) {
          const firstBundle = fetchedBundles[0]
          setSelectedBundle(firstBundle)
          onSelectBundle(firstBundle.id, firstBundle.shortName)
          navigate(`/bundle/${firstBundle.shortName}`)
        }
      })
    }
  }, [selectedTeamId])

  const handleLogout = () => {
    logout()
    onLogout()
  }

  return (
    <header className="relative bg-white border-b p-4 shadow-sm">
      <div className="mx-auto flex justify-between items-start">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Easy Charts</h1>
          </div>
          {user && (
            <div className="text-sm text-gray-600 font-medium mt-1">
              {user.enterprise} - {user.firstName} {user.lastName}
            </div>
          )}
        </div>

        <div className="flex items-end gap-6 ml-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-gray-700">Team</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 border px-3 py-1.5 rounded text-sm bg-white hover:bg-gray-50">
                  {selectedTeamId
                    ? teams.find((t) => t.id === selectedTeamId)?.name
                    : "Select a team"}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {teams.map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={
                      selectedTeamId === team.id ? "bg-blue-50 font-semibold" : ""
                    }
                  >
                    {team.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedTeamId && bundles.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-700">Bundle</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 border px-3 py-1.5 rounded text-sm bg-white hover:bg-gray-50">
                    {selectedBundle ? selectedBundle.shortName : "Select a bundle"}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {bundles.map((bundle) => {
                    const Icon = getIcon(bundle.icon)
                    return (
                      <DropdownMenuItem
                        key={bundle.id}
                        onClick={() => {
                          setSelectedBundle(bundle)
                          onSelectBundle(bundle.id, bundle.shortName)
                          navigate(`/bundle/${bundle.shortName}`)
                        }}
                        className="flex items-center gap-2"
                      >
                        <Icon size={16} className="text-gray-700" />
                        {bundle.shortName}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://forms.gle/QuUwMgfCYeXDnGhP9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2 inline-block" />
            Give your opinion
          </a>

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded hover:bg-gray-100">
                  <UserCircle className="w-6 h-6 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/admin")}> 
                  <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
                  Setup
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIframeModalOpen(true)}>
                  <img src={miroIcon} alt="Miro" className="w-4 h-4 mr-2" />
                  Miro Embed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2 text-muted-foreground" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Dialog open={iframeModalOpen} onOpenChange={setIframeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed this app in Miro</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto">
            {iframeCode}
          </div>
          <button
            className="mt-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              navigator.clipboard.writeText(iframeCode)
            }}
          >
            Copy iFrame Code
          </button>
        </DialogContent>
      </Dialog>

    </header>
  )
}

export default Header
