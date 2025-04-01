import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPickerInput: React.FC<ColorPickerInputProps> = ({ label, value, onChange }) => {
  const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(value);

  return (
    <div>
      <Label className="mb-1 block text-xs text-gray-500">{label}</Label>
      <div className="flex items-center gap-4">
        {/* Color selector */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 p-0 border rounded cursor-pointer"
        />

        {/* Manual hex input */}
        <Input
          className={`w-full focus-visible:ring-0 ${
            !isHexColor ? "border-red-500" : ""
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ColorPickerInput;