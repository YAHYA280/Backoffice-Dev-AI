// Create a new file named types.ts in the same directory as AIAssistantCustomizationService.ts
export interface IAIAssistantCustomizationSettings {
  responseType: ("text" | "audio" | "image")[]; // Changed to array for multiple selections
  inputType: "text" | "audio" | "image"; // Entrées utilisateur possibles
  welcomeMessage: string; // Message d'accueil personnalisé
  motivationalPhrases: string[]; // Liste de phrases de motivation
  helpPhrases: string[]; // Liste de phrases d'aide
  audioFormat: "mp3" | "wav" | "aac"; // Format audio préféré
  voiceTranscription: boolean; // Activation/désactivation de la transcription vocale
  imageSupport: boolean; // Activation/désactivation du support d'images
  imageFormat: ("jpg" | "png"  | "svg")[]; // Formats d'image pris en charge
  deletionHistory: { phrase: string; date: string; type: "motivation" | "aide" }[]; // Historique des suppressions
}