export const formatFrShortDateLabel = (dateStr: string): string => {
    // Ex: input "04-03-2024" → convert to "2024-03-04"
    const [day, month, year] = dateStr.split("-");
    const date = new Date(`${year}-${month}-${day}`);
  
    const weekday = date.toLocaleDateString("fr-FR", { weekday: "short" });
    const dayOfMonth = date.toLocaleDateString("fr-FR", { day: "2-digit" });
  
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}\n${dayOfMonth}`;
  };