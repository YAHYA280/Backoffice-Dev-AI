import type { IAIAssistantItem } from 'src/types/ai-assistant';

// ----------------------------------------------------------------------  

export const AI_ASSISTANT_STATUS_OPTIONS = [   
  { value: 'active', label: 'Actif' },   
  { value: 'inactive', label: 'Inactif' }, 
];  

export const AI_ASSISTANT_TYPE_OPTIONS = [   
  { value: 'japprends', label: "J'apprends" },   
  { value: 'accueil', label: 'Accueil' },   
  { value: 'recherche', label: 'Recherche' }, 
];  

export const AI_ASSISTANT_EDUCATION_LEVELS = [   
  { value: 'CP', label: 'CP' },   
  { value: 'CE1', label: 'CE1' },   
  { value: 'CE2', label: 'CE2' },   
  { value: 'CM1', label: 'CM1' },   
  { value: 'CM2', label: 'CM2' }, 
];  

export const AI_ASSISTANT_CHAPTERS = [   
  { value: 'chapitre-1', label: 'Chapitre 1' },   
  { value: 'chapitre-2', label: 'Chapitre 2' },   
  { value: 'chapitre-3', label: 'Chapitre 3' },   
  { value: 'chapitre-4', label: 'Chapitre 4' }, 
];  

export const AI_ASSISTANT_EXERCISES = [   
  { value: 'exercice-1', label: 'Exercice 1' },   
  { value: 'exercice-2', label: 'Exercice 2' },   
  { value: 'exercice-3', label: 'Exercice 3' },   
  { value: 'exercice-4', label: 'Exercice 4' }, 
];  

export const AI_ASSISTANT_SUBJECTS = [   
  { value: 'Mathématiques', label: 'Mathématiques' },   
  { value: 'Français', label: 'Français' },   
  { value: 'Histoire', label: 'Histoire' },   
  { value: 'Géographie', label: 'Géographie' },   
  { value: 'Anglais', label: 'Anglais' }, 
];  

// Create sample descriptions based on the assistant type and subject
const getAssistantDescription = (type: string, subject: string | null, educationLevel: string): string => {
  if (type === 'japprends') {
    const subjectName = AI_ASSISTANT_SUBJECTS.find(s => s.value === subject)?.label || '';
    const levelName = AI_ASSISTANT_EDUCATION_LEVELS.find(l => l.value === educationLevel)?.label || '';
    return `Assistant pédagogique pour l'apprentissage de ${subjectName} au niveau ${levelName}. Aide les élèves à comprendre les concepts, résoudre des exercices et progresser dans leur apprentissage.`;
  }
  
  if (type === 'accueil') {
    return `Assistant d'accueil pour guider les utilisateurs et répondre aux questions fréquentes sur la plateforme. Aide à naviguer et trouver les ressources appropriées.`;
  }
  
  if (type === 'recherche') {
    return `Assistant de recherche permettant d'explorer les contenus éducatifs. Facilite la découverte de ressources pertinentes et apporte une aide contextuelle.`;
  }
  
  return `Assistant IA polyvalent pour améliorer l'expérience d'apprentissage.`;
};

// ----------------------------------------------------------------------  

export const _mockAIAssistants: IAIAssistantItem[] = [...Array(10)].map((_, index) => {   
  const type = AI_ASSISTANT_TYPE_OPTIONS[index % AI_ASSISTANT_TYPE_OPTIONS.length].value;   
  const educationLevel = AI_ASSISTANT_EDUCATION_LEVELS[index % AI_ASSISTANT_EDUCATION_LEVELS.length].value;
  const subject = type === 'japprends' ? AI_ASSISTANT_SUBJECTS[index % AI_ASSISTANT_SUBJECTS.length].value : null;   
  const chapter = type === 'japprends' ? AI_ASSISTANT_CHAPTERS[index % AI_ASSISTANT_CHAPTERS.length].value : null;   
  const exercise = type === 'japprends' ? AI_ASSISTANT_EXERCISES[index % AI_ASSISTANT_EXERCISES.length].value : null;      
  
  return {     
    id: `ai-assistant-${index + 1}`,     
    name: `Assistant IA ${index + 1}`,     
    description: getAssistantDescription(type, subject, educationLevel),
    type,     
    status: index % 2 === 0 ? 'active' : 'inactive',     
    educationLevel,     
    subject,     
    chapter,     
    exercise,     
    lastUpdated: new Date().toISOString(),     
    avatarUrl: '',   
  }; 
});  

// Ajouter au moins 5 assistants de type "J'apprends" pour garantir leur présence 
for (let i = 0; i < 5; i += 1) {   
  const educationLevel = AI_ASSISTANT_EDUCATION_LEVELS[i % AI_ASSISTANT_EDUCATION_LEVELS.length].value;
  const subject = AI_ASSISTANT_SUBJECTS[i % AI_ASSISTANT_SUBJECTS.length].value;
  
  _mockAIAssistants[i] = {     
    id: `ai-assistant-japprends-${i + 1}`,     
    name: `J'apprends ${i + 1}`,     
    description: getAssistantDescription('japprends', subject, educationLevel),
    type: 'japprends',     
    status: 'active',     
    educationLevel,     
    subject,     
    chapter: AI_ASSISTANT_CHAPTERS[i % AI_ASSISTANT_CHAPTERS.length].value,     
    exercise: AI_ASSISTANT_EXERCISES[i % AI_ASSISTANT_EXERCISES.length].value,     
    lastUpdated: new Date().toISOString(),     
    avatarUrl: '',   
  }; 
}