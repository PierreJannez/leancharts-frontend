import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom" // 👈 Ajout
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"

import { fetchTplServices } from "@/services/serviceTplService"
import { fetchTplBundles } from "@/services/tplBundleService"
import { fetchTplCharts, importSelectedCharts } from "@/services/tplChartService"
import { TplService } from "@/types/TplService"
import { Bundle } from "@/types/Bundle"
import { TplChart } from "@/types/TplChart"
import { handleBackendError } from "@/utils/errorUtils"
import { toast } from "sonner"

interface ChartSelectionMap {
  [bundle: string]: string[];
}

export default function ChartSelectionPanel() {
  const navigate = useNavigate(); // 👈 Hook pour redirection
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("currentUser") || "{}")
  );
  const [serviceName, setServiceName] = useState(user.service || "");
  const [teamName, setTeamName] = useState(user.team || "");

  const [selectedBundle, setSelectedBundle] = useState<string | undefined>()
  const [selectedService, setSelectedService] = useState<string | undefined>()
  const [selectedCharts, setSelectedCharts] = useState<number[]>([])
  const [services, setServices] = useState<TplService[]>([])
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [charts, setCharts] = useState<TplChart[]>([])
  const [chartMap, setChartMap] = useState<ChartSelectionMap>({})

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setUser(storedUser);
    setServiceName(storedUser.service || "");
    setTeamName(storedUser.team || "");
  }, []);

  useEffect(() => {
    fetchTplServices().then(setServices);
    fetchTplBundles().then(setBundles);
  }, [])

  useEffect(() => {
    const bundle = bundles.find((b) => b.shortName === selectedBundle);
    const service = services.find((s) => s.name === selectedService);

    if (bundle && service) {
      fetchTplCharts(bundle.id, service.id).then((data) => {
        setCharts(data);
        setSelectedCharts([]); // reset selected
      });
    } else {
      setCharts([]);
    }
  }, [selectedBundle, selectedService, bundles, services]);

  useEffect(() => {
    if (!selectedBundle) return;
    setChartMap(prev => {
      const updated = charts
        .filter(chart => selectedCharts.includes(chart.id))
        .map(chart => chart.name);
      return { ...prev, [selectedBundle]: updated };
    });
  }, [selectedCharts, selectedBundle, charts]);

  const updateUserField = (field: "service" | "team", value: string) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  }

  const toggleChart = (chartId: number) => {
    setSelectedCharts((prev) =>
      prev.includes(chartId) ? prev.filter((id) => id !== chartId) : [...prev, chartId]
    );
  }

  const handleImport = async () => {
    const bundles = Object.entries(chartMap).map(([bundle, charts]) => ({
      bundle,
      charts,
    }));

    if (!bundles.length || bundles.every((b) => b.charts.length === 0)) {
      toast.error("Please select at least one chart.");
      return;
    }

    try {
      const result = await importSelectedCharts(bundles, user.id_team);
      toast.success(result.message);
      navigate("/login"); // 👈 Redirection ici
    } catch (err) {
      handleBackendError(err);
    }
  }

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to skip this step?\nYou can always customize your indicators later."
    );
    if (confirmed) {
      navigate("/login");
    }
  };

  return (
    <div className="p-6 border rounded w-full max-w-md mx-auto space-y-6 h-[520px] overflow-hidden sm:px-8 sm:py-6 sm:h-auto sm:rounded-lg">
      <h2 className="text-2xl font-bold">Choose your charts</h2>

      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <Label>Service</Label>
          <Input
            value={serviceName}
            onChange={(e) => {
              setServiceName(e.target.value);
              updateUserField("service", e.target.value);
            }}
          />
        </div>

        <div className="space-y-1">
          <Label>Team</Label>
          <Input
            value={teamName}
            onChange={(e) => {
              setTeamName(e.target.value);
              updateUserField("team", e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-1">
          <Label>Bundles</Label>
          <Select onValueChange={setSelectedBundle} value={selectedBundle}>
            <SelectTrigger>
              <SelectValue placeholder="Bundle selected" />
            </SelectTrigger>
            <SelectContent>
              {bundles.map((bundle) => (
                <SelectItem key={bundle.id} value={bundle.shortName}>
                  {bundle.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1">
          <Label>Services</Label>
          <Select onValueChange={setSelectedService} value={selectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Service selected" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.name}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border p-4 rounded space-y-2 overflow-y-auto max-h-64 max-w-sm">
        <h3 className="font-semibold mb-2">Available predefined charts</h3>
        {charts.map((chart) => (
          <div key={chart.id} className="flex items-center space-x-2">
            <Checkbox
              id={`chart-${chart.id}`}
              checked={selectedCharts.includes(chart.id)}
              onCheckedChange={() => toggleChart(chart.id)}
            />
            <Label htmlFor={`chart-${chart.id}`}>{chart.name}</Label>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleImport}>Save</Button>
      </div>
    </div>
  )
}