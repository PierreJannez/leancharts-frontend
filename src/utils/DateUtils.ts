import { parse, format } from "date-fns";
import { enUS } from "date-fns/locale";

export const formatFrShortDateLabel = (dateStr: string): string => {
    // Ex: input "04-03-2024" → convert to "2024-03-04"
    const [day, month, year] = dateStr.split("-");
    const date = new Date(`${year}-${month}-${day}`);
  
    const weekday = date.toLocaleDateString("en-EN", { weekday: "short" });
    const dayOfMonth = date.toLocaleDateString("en-EN", { day: "2-digit" });
    const displayDate = `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}\n${dayOfMonth}`
    return displayDate;
  };

   // Fonction pour normaliser la date (dd-mm-yyyy -> yyyy-mm-dd)
   export const getMonthYear = (dateString: string) => {
    const [, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-01`);
  
    // Récupérer le nom du mois en format abrégé
    const monthShort = date.toLocaleString("en-EN", { month: "short" });
  
    // Majuscule + ajouter un point final (au cas où certains mois n’en auraient pas)
    const formattedMonth = `${monthShort.charAt(0).toUpperCase()}${monthShort.slice(1).replace(/\.*$/, "")}.`;
  
    const shortYear = year.slice(-2);
  
    return `${formattedMonth}\n${shortYear}`;
  };

  export const formatMonthKeyToLabel = (monthKey: string): string => {
    const date = parse(monthKey, "yyyy-MM", new Date());
    return format(date, "MMMM yyyy", { locale: enUS });
  };
  