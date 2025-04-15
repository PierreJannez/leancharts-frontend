import React, { useState, useEffect } from "react";

interface SmartNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  nbDecimal?: number;
  className?: string;
}

const SmartNumberInput: React.FC<SmartNumberInputProps> = ({
  value,
  onChange,
  nbDecimal = 0,
  className = "",
}) => {
  const [input, setInput] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // 🟡 Synchronisation de la valeur externe avec le champ (si pas en édition)
  useEffect(() => {
    if (!isEditing) {
      if (value === null || value === undefined || isNaN(value)) {
        setInput("");
      } else {
        console.log("🚀 Vérification de la valeur : ", value);  
        setInput(value.toFixed(nbDecimal));
      }
    }
  }, [value, nbDecimal, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // ✅ Autorise virgule ou point comme séparateur décimal
    raw = raw.replace(",", ".");

    setIsEditing(true);
    setInput(raw);

    // 🔁 Autorise les états intermédiaires
    if (raw === "" || raw === "-" || raw === "." || raw === "-.") {
      return;
    }

    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (input === "" || input === "-" || input === "." || input === "-.") {
      setInput("");
      return;
    }

    const parsed = parseFloat(input);
    if (!isNaN(parsed)) {
      const fixed = parsed.toFixed(nbDecimal);
      setInput(fixed);
    } else {
      setInput("");
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={input}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
};

export default SmartNumberInput;