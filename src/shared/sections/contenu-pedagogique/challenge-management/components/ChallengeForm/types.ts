import type { UseFormReturn } from 'react-hook-form';

import { z } from 'zod';

import { MESSAGE_FINAL_DEFAUT, DEFAULT_SCORE_CONFIGURATION } from '../../constants';
import {
  Difficulty,
  ScoreMethod,
  QuestionType,
  MultimediaType,
  ChallengeStatus,
} from '../../types';

import type { Challenge } from '../../types';

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

// Schéma de validation amélioré
export const challengeFormSchema = z.object({
  nom: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  statut: z.nativeEnum(ChallengeStatus, {
    errorMap: () => ({ message: 'Le statut est requis et doit être une valeur valide' }),
  }),
  datePublication: z.string().min(1, 'La date de publication est requise'),
  dateCreation: z.string().optional(),
  dateMiseAJour: z.string().optional(),
  niveauId: z.string().optional(),
  difficulte: z.nativeEnum(Difficulty, {
    errorMap: () => ({
      message: 'Le niveau de difficulté est requis et doit être une valeur valide',
    }),
  }),
  timer: z
    .number()
    .min(5, "Le timer doit être d'au moins 5 minutes")
    .max(180, 'Le timer ne peut pas dépasser 180 minutes'),
  nbTentatives: z
    .number()
    .min(0, 'Pour des tentatives illimitées, utilisez 0. Sinon, utilisez un nombre positif')
    .refine((val) => val >= 0, {
      message: 'Le nombre de tentatives ne peut pas être négatif',
    }),
  isRandomQuestions: z.boolean().optional().default(false),
  messageSucces: z
    .string()
    .min(1, 'Le message de succès est requis')
    .max(250, 'Le message de succès ne peut pas dépasser 250 caractères')
    .optional()
    .default(MESSAGE_FINAL_DEFAUT.success),
  messageEchec: z
    .string()
    .min(1, "Le message d'échec est requis")
    .max(250, "Le message d'échec ne peut pas dépasser 250 caractères")
    .optional()
    .default(MESSAGE_FINAL_DEFAUT.failure),
  prerequisId: z.string().optional(),
  prerequisPourcentage: z
    .number()
    .min(0, 'Le pourcentage minimum ne peut pas être négatif')
    .max(100, 'Le pourcentage maximum est 100')
    .optional(),
  scoreConfiguration: z
    .object({
      id: z.string().optional(),
      methode: z.nativeEnum(ScoreMethod, {
        errorMap: () => ({
          message: 'La méthode de calcul du score est requise et doit être une valeur valide',
        }),
      }),
      parametres: z.string().min(1, 'Les paramètres du score sont requis'),
    })
    .default(DEFAULT_SCORE_CONFIGURATION),
  multimedias: z
    .array(
      z.object({
        id: z.string(),
        type: z.nativeEnum(MultimediaType, {
          errorMap: () => ({ message: 'Le type de multimédia doit être une valeur valide' }),
        }),
        url: z.string().url("L'URL du multimédia doit être une URL valide"),
      })
    )
    .optional()
    .default([]),
  fichiers_supplementaires: z.array(z.custom<File>()).optional().default([]),
  questions: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.nativeEnum(QuestionType, {
          errorMap: () => ({ message: 'Le type de question doit être une valeur valide' }),
        }),
        texte: z
          .string()
          .min(3, 'Le texte de la question doit contenir au moins 3 caractères')
          .max(500, 'Le texte de la question ne peut pas dépasser 500 caractères'),
        ordre: z.number().optional(),
        points: z
          .number()
          .min(0, 'Les points doivent être positifs ou nuls')
          .max(100, 'Les points ne peuvent pas dépasser 100'),
        duree: z
          .number()
          .min(5, "La durée doit être d'au moins 5 secondes")
          .max(600, 'La durée ne peut pas dépasser 10 minutes (600 secondes)'),
        isRequired: z.boolean().optional().default(true),
        reponses: z
          .array(
            z.object({
              id: z.string().optional(),
              texte: z
                .string()
                .min(1, 'Le texte de la réponse est requis')
                .max(250, 'Le texte de la réponse ne peut pas dépasser 250 caractères'),
              estCorrecte: z.boolean().optional().default(false),
              ordre: z.number().optional(),
            })
          )
          .optional()
          .default([])
          .refine((reponses) => reponses.length >= 2, {
            message: 'Un QCM doit avoir au moins 2 options de réponse',
            path: ['reponses'],
          }),
        reponseAttendue: z
          .string()
          .max(500, 'La réponse attendue ne peut pas dépasser 500 caractères')
          .optional(),
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
    .default([])
    .refine(
      (questions) =>
        questions.every(
          (q) =>
            q.type !== QuestionType.QCM ||
            (q.reponses && q.reponses.some((r) => r.estCorrecte === true))
        ),
      {
        message: 'Chaque question QCM doit avoir au moins une réponse correcte',
        path: ['questions'],
      }
    ),
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
