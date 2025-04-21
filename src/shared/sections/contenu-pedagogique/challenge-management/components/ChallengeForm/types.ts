import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import {
  Challenge,
  QuestionType,
  Difficulty,
  ChallengeStatus,
  ScoreMethod,
  MultimediaType,
} from '../../types';
import { DEFAULT_SCORE_CONFIGURATION, MESSAGE_FINAL_DEFAUT } from '../../constants';

// Types pour les réponses modifiables
export interface EditableReponse {
  id?: string;
  texte: string;
  estCorrecte: boolean;
}

// Types pour les questions modifiables
export interface EditableQuestion {
  id?: string;
  texte: string;
  type: QuestionType;
  ordre?: number;
  points: number;
  duree: number;
  reponses: EditableReponse[];
  fichier_image?: File | null;
  fichier_video?: File | null;
  isRequired?: boolean;
  elements?: {
    id?: string;
    texte?: string;
    position?: number;
    cible?: string;
  }[];
  reponseAttendue?: string;
}

// Schéma de validation
export const challengeFormSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  statut: z.nativeEnum(ChallengeStatus, {
    errorMap: () => ({ message: 'Le statut est requis' }),
  }),
  datePublication: z.string().min(1, 'La date de publication est requise'),
  dateCreation: z.string().optional(),
  dateMiseAJour: z.string().optional(),
  niveauId: z.string().optional(),
  difficulte: z.nativeEnum(Difficulty, {
    errorMap: () => ({ message: 'Le niveau de difficulté est requis' }),
  }),
  timer: z.number().min(1, "Le timer doit être d'au moins 1 minute"),
  nbTentatives: z.number().min(1, "Le nombre de tentatives doit être d'au moins 1"),
  isRandomQuestions: z.boolean().optional(),
  messageSucces: z.string().optional().default(MESSAGE_FINAL_DEFAUT.success),
  messageEchec: z.string().optional().default(MESSAGE_FINAL_DEFAUT.failure),
  prerequisId: z.string().optional(),
  prerequisPourcentage: z.number().optional(),
  scoreConfiguration: z
    .object({
      id: z.string().optional(),
      methode: z.nativeEnum(ScoreMethod),
      parametres: z.string(),
    })
    .default(DEFAULT_SCORE_CONFIGURATION),
  multimedias: z
    .array(
      z.object({
        id: z.string(),
        type: z.nativeEnum(MultimediaType),
        url: z.string(),
      })
    )
    .optional()
    .default([]),
  fichiers_supplementaires: z.array(z.custom<File>()).optional().default([]),
  questions: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.nativeEnum(QuestionType),
        texte: z.string().min(1, 'Le texte de la question est requis'),
        ordre: z.number().optional(),
        points: z.number().min(0, 'Les points doivent être positifs'),
        duree: z.number().min(0, 'La durée doit être positive'),
        isRequired: z.boolean().optional().default(true),
        reponses: z
          .array(
            z.object({
              id: z.string().optional(),
              texte: z.string().min(1, 'Le texte de la réponse est requis'),
              estCorrecte: z.boolean().optional().default(false),
              ordre: z.number().optional(),
            })
          )
          .optional()
          .default([]),
        reponseAttendue: z.string().optional(),
        elements: z
          .array(
            z.object({
              id: z.string().optional(),
              texte: z.string().optional(),
              position: z.number().optional(),
              cible: z.string().optional(),
            })
          )
          .optional()
          .default([]),
      })
    )
    .min(1, 'Au moins une question est requise')
    .default([]),
});

// Type pour les données du formulaire
export type ChallengeFormData = z.infer<typeof challengeFormSchema>;

// Props communs pour les étapes du formulaire
export interface StepProps {
  form: UseFormReturn<ChallengeFormData>;
  niveaux?: { id: string; nom: string }[];
  prerequisChallenges?: Challenge[];
  generateId: () => string;
}

// Props pour le composant QuestionSidebar
export interface QuestionSidebarProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: EditableQuestion) => void;
  question: EditableQuestion | null;
  isEditing: boolean;
  questionNumber: number;
}

// Props pour le composant ChallengeForm principal
export interface ChallengeFormProps {
  initialValues?: Partial<Challenge>;
  onSubmit: (data: Challenge) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  niveaux?: { id: string; nom: string }[];
  prerequisChallenges?: Challenge[];
}
