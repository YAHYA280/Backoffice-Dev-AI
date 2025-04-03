import type { IAIAssistantItem } from 'src/types/ai-assistant';

export function updateAssistantsWithFakeDates() {
  const assistants = JSON.parse(localStorage.getItem('assistants') || '[]');
  const updatedAssistants = assistants.map((assistant: IAIAssistantItem) => {
    if (!assistant.createdAt || assistant.createdAt === "-") {
      assistant.createdAt = new Date(
        2023 + Math.random() * 2,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ).toISOString();
    }
    
    // ➕ Ajouter dateAjoute si elle n'existe pas
    if (!assistant.dateAjoute) {
      assistant.dateAjoute = new Date().toISOString();
    }
    
    return assistant;
  });

  localStorage.setItem('assistants', JSON.stringify(updatedAssistants));
}
