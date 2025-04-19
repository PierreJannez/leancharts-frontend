// WeeklyShortTermInputTable.tsx
import React, { useState } from "react";
import { ChartData, LeanChart } from "../../types/LeanChart";
import { parse, startOfWeek, getISOWeek, format } from "date-fns";
import { MessageCircleWarning, UploadCloud } from "lucide-react";
import TooltipPortal from "./TooltipPortal";
import CommentModal from "./CommentModal";
import ImportCSVModal from "../importation/ImportCSVModal";
import { Button } from "@/components/ui/button";
import SmartNumberInput from "@/utils/SmartNumberInput";

interface ChartDataWithOriginal extends ChartData {
  originalDate: string;
}

interface Props {
  leanChart: LeanChart;
  onValueChange: (entry: ChartData, newValue: number) => void;
  onTargetChange: (entry: ChartData, newTarget: number) => void;
  onCommentChange: (entry: ChartData, newComment: string) => void;
  onMainTargetChange: (newTarget: number) => void;
  onRefreshRequested?: () => void;
}

function groupByWeek(data: ChartData[]): ChartDataWithOriginal[] {
  const weekMap = new Map<string, ChartDataWithOriginal>();

  data.forEach(({ date, value, target, comment }) => {
    const parsedDate = parse(date, 'dd-MM-yyyy', new Date());
    if (isNaN(parsedDate.getTime())) return;

    const weekStart = format(startOfWeek(parsedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const numericValue = Number(value);
    const numericTarget = Number(target);

    const existing = weekMap.get(weekStart);
    if (existing) {
      existing.value += numericValue;
      existing.target += numericTarget;
      existing.comment += comment ? `\n${comment}` : '';
    } else {
      weekMap.set(weekStart, {
        date: weekStart,
        originalDate: date, // pour sauvegarde
        value: numericValue,
        target: numericTarget,
        comment: comment || '',
      });
    }
  });

  return Array.from(weekMap.values());
}

const WeeklyShortTermInputTable: React.FC<Props> = ({
  leanChart,
  onValueChange,
  onTargetChange,
  onCommentChange,
  onMainTargetChange,
  onRefreshRequested,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [hoveredEntry, setHoveredEntry] = useState<ChartDataWithOriginal | null>(null);
  const [currentEntry, setCurrentEntry] = useState<ChartDataWithOriginal | null>(null);
  const [bulkTarget, setBulkTarget] = useState<number>(leanChart?.shortTermMainTarget || 0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const weeklyData = groupByWeek(leanChart.shortTermData);

  const handleModalOpen = (entry: ChartDataWithOriginal) => {
    setCurrentComment(entry.comment);
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };

  const saveComment = () => {
    if (currentEntry) {
      onCommentChange({ ...currentEntry, date: currentEntry.originalDate }, currentComment);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mb-4">
      <div className="grid grid-cols-3 items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-left text-md font-medium text-gray-700">Short term (weekly)</h2>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1 text-sm bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
            title="Upload a CSV file"
          >
            <UploadCloud size={24} />
          </button>
        </div>
        <div className="flex justify-end items-center gap-2">
          <input
            type="number"
            value={bulkTarget}
            onChange={(e) => setBulkTarget(Number(e.target.value))}
            className="border border-gray-300 rounded p-1 text-sm w-14 text-center bg-white"
          />
          <button
            onClick={() => {
              const perWeekTarget = bulkTarget;
              weeklyData.forEach((entry) => {
                entry.target = perWeekTarget;
                onTargetChange({ ...entry, date: entry.originalDate }, perWeekTarget);
              });
              onMainTargetChange(bulkTarget);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Distribute target
          </button>
        </div>
      </div>
      <hr className="mt-2 border-gray-300" />

      <div className="grid gap-[3px] w-full mt-4 text-xs text-gray-700 text-center">
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: `1fr repeat(${weeklyData.length}, 1fr)` }}>
          <div className="text-left">Week</div>
          {weeklyData.map((entry) => (
            <div key={`w-${entry.date}`}>W{getISOWeek(new Date(entry.date))}</div>
          ))}
        </div>

        <div className="grid gap-[3px] items-center" style={{ gridTemplateColumns: `1fr repeat(${weeklyData.length}, 1fr)` }}>
          <div className="text-left">Target</div>
          {weeklyData.map((entry) => (
            <div key={`t-${entry.date}`}>
              <SmartNumberInput
                value={Number(entry.target)}
                onChange={(val) => onTargetChange({ ...entry, date: entry.originalDate }, val)}
                nbDecimal={leanChart.nbDecimal}
                className="w-full text-center border border-gray-300 rounded bg-white"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-[3px] items-center" style={{ gridTemplateColumns: `1fr repeat(${weeklyData.length}, 1fr)` }}>
          <div className="text-left">Value</div>
          {weeklyData.map((entry) => (
            <div key={`v-${entry.date}`}>
              <SmartNumberInput
                value={Number(entry.value)}
                onChange={(val) => onValueChange({ ...entry, date: entry.originalDate }, val)}
                nbDecimal={leanChart.nbDecimal}
                className="w-full text-center border border-gray-300 rounded bg-white"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-[3px] items-center" style={{ gridTemplateColumns: `1fr repeat(${weeklyData.length}, 1fr)` }}>
          <div className="text-left">Comment</div>
          {weeklyData.map((entry) => (
            <div
              key={`c-${entry.date}`}
              className="relative flex justify-center items-center"
              onMouseEnter={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setHoveredEntry(entry);
                setTooltipPosition({ top: rect.top, left: rect.left + rect.width / 2 });
              }}
              onMouseLeave={() => {
                setHoveredEntry(null);
                setTooltipPosition(null);
              }}
            >
              <MessageCircleWarning
                className={`w-6 h-6 cursor-pointer rounded-full p-1 ${entry.comment ? "text-blue-500 bg-blue-100" : "text-gray-300"}`}
                onClick={() => handleModalOpen(entry)}
              />
              {hoveredEntry && tooltipPosition && hoveredEntry.comment && hoveredEntry.date === entry.date && (
                <TooltipPortal position={tooltipPosition}>
                  <div className="bg-gray-700 text-white text-xs rounded px-2 py-1 shadow-lg max-w-xs whitespace-pre-wrap">
                    {hoveredEntry.comment}
                  </div>
                </TooltipPortal>
              )}
            </div>
          ))}
        </div>
      </div>

      <CommentModal
        open={isModalOpen}
        comment={currentComment}
        onChange={setCurrentComment}
        onCancel={() => setIsModalOpen(false)}
        onSave={saveComment}
      />

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full border border-gray-400">
            <ImportCSVModal
              chartId={leanChart.id}
              onImportFinished={() => {
                setIsImportModalOpen(false);
                onRefreshRequested?.();
              }}
            />
            <div className="mt-4 text-right">
              <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyShortTermInputTable;
