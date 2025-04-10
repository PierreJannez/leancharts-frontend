// components/ui/NumericInputWithNegativeSupport.tsx
import React from "react";
import { Input } from "@/components/ui/input";  

interface NumericInputProps {
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

const NumericInputWithNegativeSupport: React.FC<NumericInputProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  id,
  name,
  disabled,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "-" || val === "") {
      onChange(val);
    } else {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <Input
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
      disabled={disabled}
    />
  );
};

export default NumericInputWithNegativeSupport;