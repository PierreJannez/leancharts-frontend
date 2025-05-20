import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { setupTeam } from "@/services/teamSetupService"
import { handleBackendError } from "@/utils/errorUtils"

export default function TeamSetupPanel({ onNext, onCancel }: { onNext: (id_service: number, id_team: number) => void; onCancel: () => void }) {
  const [serviceName, setServiceName] = useState("")
  const [teamName, setTeamName] = useState("")

const handleSubmit = async () => {
  if (!serviceName.trim() || !teamName.trim()) {
    toast.error("Both service and team name are required.")
    return
  }

  try {
    const result = await setupTeam(serviceName.trim(), teamName.trim())
    onNext(result.id_service, result.id_team)
  } catch (err) {
    handleBackendError(err);
  }
}
  return (
    <div className="max-w-md mx-auto p-6 border rounded space-y-6">
      <h2 className="text-2xl font-bold">Set up your team</h2>

      <div className="space-y-2">
        <Label htmlFor="service">Service</Label>
        <Input
          id="service"
          placeholder="My Service"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="team">Team</Label>
        <Input
          id="team"
          placeholder="My Team"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Next</Button>
      </div>
    </div>
  )
}
