export interface IAIAssistantDetailLevel {
    level: number; // Niveau entre 1 et 5
  }
  
export class AIAssistantDetailLevelService {
    private static STORAGE_KEY = "assistant_detail_level";
  
    // Récupérer le niveau de détail depuis localStorage
    static getDetailLevel(): IAIAssistantDetailLevel {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { level: 3 }; // Niveau 3 par défaut
    }
  
    // Sauvegarder le niveau de détail dans localStorage
    static saveDetailLevel(settings: IAIAssistantDetailLevel) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    }
  
    // Récupérer le niveau de détail pour un assistant spécifique
    static getDetailLevelById(assistantId: string): IAIAssistantDetailLevel {
      const key = `${this.STORAGE_KEY}_${assistantId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : { level: 3 }; // Niveau 3 par défaut
    }
  
    // Sauvegarder le niveau de détail pour un assistant spécifique
    static saveDetailLevelById(assistantId: string, settings: IAIAssistantDetailLevel) {
      const key = `${this.STORAGE_KEY}_${assistantId}`;
      localStorage.setItem(key, JSON.stringify(settings));
    }
  
    // Obtenir les descriptions pour chaque niveau
    static getLevelDescriptions(): string[] {
      return [
        "Niveau 1 : Indices minimaux",
        "Niveau 2 : Indices basiques",
        "Niveau 3 : Indices modérés : explications concises des concepts clés",
        "Niveau 4 : Indices détaillés avec exemples concrets",
        "Niveau 5 : Indices très détaillés avec explication approfondie",
      ];
    }
  
    // Obtenir les exemples pour chaque niveau
    static getLevelExamples(): string[] {
      return [
        "Exemple (Niveau 1) : 'Vérifie la terminaison du verbe.'",
        "Exemple (Niveau 2) : 'Pense aux règles du présent de l'indicatif.'",
        "Exemple (Niveau 3) : 'Les verbes du 1er groupe prennent -e, -es, -e…'",
        "Exemple (Niveau 4) : 'Regarde comment le radical change en fonction du pronom.'",
        "Exemple (Niveau 5) : 'Ce verbe suit une conjugaison irrégulière, voici la règle complète…'",
      ];
    }
  }