export interface AIAssistantHistoryEntry {
    id: string;
    date: string;
    user: string;
    section: string; // Ex: "Gestion des Réponses IA"
    action: "add" | "modify" | "delete";
    comment: string;
  }
  
  export class AIAssistantHistoryService {
    private static STORAGE_KEY = "assistant_modification_history";
  
    static getHistory(): AIAssistantHistoryEntry[] {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    }
  
    static addEntry(entry: AIAssistantHistoryEntry) {
      const history = this.getHistory();
      history.unshift(entry); // Ajouter au début
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }
  
    static clearHistory() {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }