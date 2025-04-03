import type { IAIAssistantCustomizationSettings } from '../../../../../types/types';

export class AIAssistantCustomizationService {
  private static STORAGE_KEY = "assistant_customization";
  
  static getCustomizationSettings(): IAIAssistantCustomizationSettings {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data
      ? JSON.parse(data)
      : {
          responseType: ["text"], // Changed to array with default ["text"]
          inputType: "text",
          welcomeMessage: "Bonjour ! Comment puis-je vous aider ?",
          motivationalPhrases: ["Excellent travail !", "Continue comme ça !", "Tu progresses bien !"],
          helpPhrases: ["Je vais t'expliquer la règle...", "Voici comment conjuguer ce verbe..."],
          audioFormat: "mp3",
          voiceTranscription: false,
          imageSupport: false,
          imageFormat: [],
          deletionHistory: [],
        };
  }
  
  static saveCustomizationSettings(settings: IAIAssistantCustomizationSettings) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }
}