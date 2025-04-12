// _mock_learning_content.ts
// Données mockées pour les matières, chapitres et exercices

// Structure des matières avec chapitres et exercices
export const contentStructure: Record<string, Record<string, string[]>> = {
    // Mathématiques
    'Mathématiques': {
      'Additions et Soustractions': ['exercice-addition-1', 'exercice-soustraction-1'],
      'Multiplications et Divisions': ['exercice-multiplication-1', 'exercice-division-1'],
      'Géométrie de Base': ['exercice-formes-1', 'exercice-mesures-1'],
      'Problèmes Simples': ['exercice-probleme-1', 'exercice-probleme-2'],
    },
    // Français
    'Français': {
      'Lecture et Compréhension': ['exercice-lecture-1', 'exercice-comprehension-1'],
      'Écriture et Orthographe': ['exercice-ecriture-1', 'exercice-orthographe-1'],
      'Grammaire de Base': ['exercice-grammaire-1', 'exercice-conjugaison-1'],
      'Vocabulaire': ['exercice-vocabulaire-1', 'exercice-vocabulaire-2'],
    },
    // Histoire
    'Histoire': {
      'Préhistoire et Antiquité': ['exercice-prehistoire-1', 'exercice-antiquite-1'],
      'Moyen Âge': ['exercice-moyen-age-1', 'exercice-moyen-age-2'],
      'Renaissance': ['exercice-renaissance-1', 'exercice-renaissance-2'],
      'Révolution Française': ['exercice-revolution-1', 'exercice-revolution-2'],
    },
    // Géographie
    'Géographie': {
      'Mon Village et Ma Région': ['exercice-village-1', 'exercice-region-1'],
      'La France': ['exercice-france-1', 'exercice-france-2'],
      'L\'Europe': ['exercice-europe-1', 'exercice-europe-2'],
      'Le Monde': ['exercice-monde-1', 'exercice-monde-2'],
    },
    // Anglais
    'Anglais': {
      'Salutations et Présentations': ['exercice-salutations-1', 'exercice-presentations-1'],
      'Nombres et Couleurs': ['exercice-nombres-1', 'exercice-couleurs-1'],
      'Animaux et Aliments': ['exercice-animaux-1', 'exercice-aliments-1'],
      'Phrases Simples': ['exercice-phrases-1', 'exercice-phrases-2'],
    },
    // Sciences
    'Sciences': {
      'Plantes et Animaux': ['exercice-plantes-1', 'exercice-animaux-1'],
      'Le Corps Humain': ['exercice-corps-1', 'exercice-corps-2'],
      'Les Matériaux': ['exercice-materiaux-1', 'exercice-materiaux-2'],
      'L\'Eau et l\'Air': ['exercice-eau-1', 'exercice-air-1'],
    }
  };
  
  // Liste de toutes les matières disponibles
  export const allSubjects = Object.keys(contentStructure);
  
  // Fonction pour obtenir les chapitres d'une matière
  export const getChaptersBySubject = (subject: string): string[] => {
    if (contentStructure[subject]) {
      return Object.keys(contentStructure[subject]);
    }
    return [];
  };
  
  // Fonction pour obtenir les exercices d'un chapitre dans une matière
  export const getExercisesByChapter = (subject: string, chapter: string): string[] => {
    if (contentStructure[subject] && contentStructure[subject][chapter]) {
      return contentStructure[subject][chapter];
    }
    return [];
  };
  
  // Tous les niveaux disponibles
  export const allLevels = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
  
  // Tous les types d'assistants disponibles
  export const allAssistantTypes = ['accueil', 'recherche', 'Apprentissge'];
  
  // Mapping des statistiques de satisfaction par matière
  export const subjectSatisfactionStats: Record<string, {satisfactionRate: number, totalResponses: number}> = {
    'Mathématiques': { satisfactionRate: 88, totalResponses: 450 },
    'Français': { satisfactionRate: 91, totalResponses: 480 },
    'Histoire': { satisfactionRate: 85, totalResponses: 320 },
    'Géographie': { satisfactionRate: 84, totalResponses: 300 },
    'Anglais': { satisfactionRate: 89, totalResponses: 290 },
    'Sciences': { satisfactionRate: 92, totalResponses: 380 }
  };
  
  // Mapping des statistiques de satisfaction par niveau
  export const levelSatisfactionStats: Record<string, {satisfactionRate: number, totalResponses: number}> = {
    'cp': { satisfactionRate: 93, totalResponses: 320 },
    'ce1': { satisfactionRate: 91, totalResponses: 350 },
    'ce2': { satisfactionRate: 89, totalResponses: 380 },
    'cm1': { satisfactionRate: 87, totalResponses: 400 },
    'cm2': { satisfactionRate: 85, totalResponses: 430 }
  };