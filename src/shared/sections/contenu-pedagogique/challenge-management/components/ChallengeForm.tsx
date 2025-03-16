import { z } from 'zod';
import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTimes,
  faImage,
  faVideo,
  faTrash,
  faInfoCircle,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faEye,
  faListOl,
  faQuestion,
  faGamepad,
  faPuzzlePiece,
  faClock,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Chip,
  Stack,
  alpha,
  Paper,
  Button,
  Select,
  Switch,
  Slider,
  Divider,
  Tooltip,
  MenuItem,
  TextField,
  FormGroup,
  InputLabel,
  Typography,
  FormLabel,
  IconButton,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  CircularProgress,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { Upload } from 'src/shared/components/upload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Difficulty, ScoreMethod, MultimediaType, ChallengeStatus, QuestionType } from '../types';
import {
  STATUT_OPTIONS,
  DIFFICULTE_OPTIONS,
  TENTATIVES_OPTIONS,
  MESSAGE_FINAL_DEFAUT,
  DEFAULT_SCORE_CONFIGURATION,
  METHODE_CALCUL_SCORE_OPTIONS,
} from '../constants';

import type { Challenge, Question, Reponse } from '../types';

// Define constants for question types
const QUESTION_TYPE_OPTIONS = [
  {
    value: QuestionType.QCM,
    label: 'QCM',
    icon: faListOl,
    description: 'Question à choix multiples avec une ou plusieurs réponses correctes',
  },
  {
    value: QuestionType.OUVERTE,
    label: 'Question ouverte',
    icon: faQuestion,
    description: 'Question à réponse libre (texte court ou long)',
  },
  {
    value: QuestionType.MINIJEU,
    label: 'Mini-jeu',
    icon: faPuzzlePiece,
    description: 'Jeu interactif, puzzle, ou activité spéciale',
  },
  {
    value: QuestionType.VISUEL,
    label: 'Jeu visuel',
    icon: faGamepad,
    description: 'Interaction visuelle (glisser-déposer, cliquer, etc.)',
  },
];

// Extended Question type with media files
interface QuestionWithMedia extends Omit<Question, 'id' | 'reponses'> {
  id?: string;
  reponses?: Omit<Reponse, 'id'>[];
  fichier_image?: File | null;
  fichier_video?: File | null;
}

// Extended Challenge type with extra files
interface ChallengeWithFiles extends Omit<Challenge, 'id'> {
  id?: string;
  fichiers_supplementaires?: File[];
}

// Updated schema to match your types.ts
const schema = z.object({
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
              feedback: z.string().optional(),
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

type ChallengeFormData = z.infer<typeof schema>;

interface ChallengeFormProps {
  initialValues?: Partial<ChallengeWithFiles>;
  onSubmit: (data: Challenge) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  niveaux?: { id: string; nom: string }[];
  prerequisChallenges?: Challenge[];
}

export const ChallengeForm = ({
  initialValues = {
    nom: '',
    description: '',
    statut: ChallengeStatus.ACTIF,
    datePublication: '',
    difficulte: Difficulty.MOYEN,
    timer: 30,
    nbTentatives: 1,
    isRandomQuestions: false,
    scoreConfiguration: DEFAULT_SCORE_CONFIGURATION,
    multimedias: [],
    questions: [],
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  niveaux = [],
  prerequisChallenges = [],
}: ChallengeFormProps) => {
  // Step management
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  // Question editor state
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Temporary state for question being edited
  const [currentQuestion, setCurrentQuestion] = useState<QuestionWithMedia | null>(null);

  // Generate ID function
  const generateId = () => `tmp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Ensure initial multimedias have ids
  const initialMultimedias =
    initialValues.multimedias?.map((item) => ({
      ...item,
      id: item.id || generateId(),
    })) || [];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...initialValues,
      multimedias: initialMultimedias,
      questions: initialValues.questions || [],
    } as ChallengeFormData,
    mode: 'onChange',
  });

  // Use useFieldArray for questions
  const {
    append: appendQuestion,
    remove: removeQuestion,
    swap: swapQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  // Watch values for conditional rendering
  const isRandomQuestions = watch('isRandomQuestions');
  const niveauId = watch('niveauId');
  const statut = watch('statut');
  const scoreMethod = watch('scoreConfiguration.methode');
  const prerequisId = watch('prerequisId');
  const questions = watch('questions');

  // Define the steps
  const steps = [
    {
      label: 'Informations générales',
      description: 'Définissez les informations de base du challenge',
      icon: faInfoCircle,
    },
    {
      label: 'Paramètres',
      description: 'Configurez les paramètres du challenge',
      icon: faClock,
    },
    {
      label: 'Contenu des questions',
      description: 'Créez et organisez les questions',
      icon: faQuestion,
    },
    {
      label: 'Finalisation',
      description: 'Vérifiez et finalisez votre challenge',
      icon: faCheck,
    },
  ];

  // Step navigation functions
  const handleNext = async () => {
    let fieldsToValidate: string[] = [];

    switch (activeStep) {
      case 0:
        fieldsToValidate = [
          'nom',
          'description',
          'statut',
          'datePublication',
          'difficulte',
          'niveauId',
        ];
        break;
      case 1:
        fieldsToValidate = [
          'timer',
          'nbTentatives',
          'scoreConfiguration',
          'messageSucces',
          'messageEchec',
        ];
        break;
      case 2:
        fieldsToValidate = ['questions'];
        break;
      default:
        fieldsToValidate = [];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      setCompleted({ ...completed, [activeStep]: true });
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    if (step < activeStep || completed[step - 1]) {
      setActiveStep(step);
    }
  };

  // Format date for input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    return date.toISOString().slice(0, 16);
  };

  // Question dialog handlers
  const openNewQuestionDialog = () => {
    setCurrentQuestion({
      id: generateId(),
      type: QuestionType.QCM,
      texte: '',
      ordre: questions.length,
      points: 10,
      duree: 60,
      isRequired: true,
      fichier_image: null,
      fichier_video: null,
      reponses: [
        { texte: '', estCorrecte: false },
        { texte: '', estCorrecte: false },
      ],
    });
    setEditingQuestionIndex(null);
    setQuestionDialogOpen(true);
  };

  const openEditQuestionDialog = (index: number) => {
    // Make a copy to avoid modifying the watched value directly
    const questionToEdit = { ...questions[index] };

    // Add media properties
    const questionWithMedia: QuestionWithMedia = {
      ...questionToEdit,
      fichier_image: null,
      fichier_video: null,
      // Ensure reponses is an array
      reponses: questionToEdit.reponses || [],
    };

    setCurrentQuestion(questionWithMedia);
    setEditingQuestionIndex(index);
    setQuestionDialogOpen(true);
  };

  const handleCloseQuestionDialog = () => {
    setQuestionDialogOpen(false);
    setCurrentQuestion(null);
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion) return;

    // Prepare the question data for saving, adding generated IDs where needed
    const questionToSave: Question = {
      id: currentQuestion.id || generateId(),
      type: currentQuestion.type,
      texte: currentQuestion.texte,
      ordre: currentQuestion.ordre || 0,
      points: currentQuestion.points || 10,
      duree: currentQuestion.duree || 60,
      reponses: currentQuestion.reponses
        ? currentQuestion.reponses.map((reponse) => ({
            id: reponse.id || generateId(),
            texte: reponse.texte,
            estCorrecte: reponse.estCorrecte || false,
          }))
        : [],
    };

    if (currentQuestion.isRequired !== undefined) {
      (questionToSave as any).isRequired = currentQuestion.isRequired;
    }

    if (currentQuestion.reponseAttendue) {
      questionToSave.reponseAttendue = currentQuestion.reponseAttendue;
    }

    if (currentQuestion.elements && currentQuestion.elements.length > 0) {
      questionToSave.elements = currentQuestion.elements;
    }

    // Handle media uploads here - in a real application, you would upload the files
    // and store the URLs in the question object

    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionToSave;
      setValue('questions', updatedQuestions);
    } else {
      // Add new question
      appendQuestion(questionToSave as any);
    }

    setQuestionDialogOpen(false);
    setCurrentQuestion(null);
  };

  // Helper for question option management
  const handleAddOption = () => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      reponses: [...(currentQuestion.reponses || []), { texte: '', estCorrecte: false }],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!currentQuestion || !currentQuestion.reponses) return;

    setCurrentQuestion({
      ...currentQuestion,
      reponses: currentQuestion.reponses.filter((_, i) => i !== index),
    });
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    if (!currentQuestion || !currentQuestion.reponses) return;

    const newReponses = [...currentQuestion.reponses];
    newReponses[index] = { ...newReponses[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, reponses: newReponses });
  };

  // Handlers for question reordering
  const handleMoveQuestionUp = (index: number) => {
    if (index === 0) return;
    swapQuestion(index, index - 1);

    // Update ordre property
    const updatedQuestions = [...questions];
    updatedQuestions[index].ordre = index - 1;
    updatedQuestions[index - 1].ordre = index;
    setValue('questions', updatedQuestions);
  };

  const handleMoveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return;
    swapQuestion(index, index + 1);

    // Update ordre property
    const updatedQuestions = [...questions];
    updatedQuestions[index].ordre = index + 1;
    updatedQuestions[index + 1].ordre = index;
    setValue('questions', updatedQuestions);
  };

  // Handlers for question media
  const handleQuestionImageChange = (file: File) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_image: file,
      fichier_video: null, // Remove video if image is selected
    });
  };

  const handleQuestionVideoChange = (file: File) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_video: file,
      fichier_image: null, // Remove image if video is selected
    });
  };

  const handleRemoveQuestionMedia = () => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_image: null,
      fichier_video: null,
    });
  };

  // Function to render the current step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderGeneralInfoStep();
      case 1:
        return renderParametersStep();
      case 2:
        return renderQuestionsStep();
      case 3:
        return renderFinalizationStep();
      default:
        return null;
    }
  };

  // Step 1: General Information
  const renderGeneralInfoStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informations générales
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={8}>
        <Controller
          name="nom"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nom du challenge"
              fullWidth
              error={!!errors.nom}
              helperText={errors.nom?.message}
              placeholder="Ex: Challenge de mathématiques"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <Controller
          name="statut"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.statut}>
              <InputLabel>Statut</InputLabel>
              <Select
                {...field}
                label="Statut"
                renderValue={(selected) => {
                  const option = STATUT_OPTIONS.find((opt) => opt.value === selected);
                  return (
                    <Chip
                      size="small"
                      label={option?.label}
                      sx={{
                        backgroundColor: option?.bgColor,
                        color: option?.color,
                      }}
                    />
                  );
                }}
              >
                {STATUT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Chip
                      size="small"
                      label={option.label}
                      sx={{
                        backgroundColor: option.bgColor,
                        color: option.color,
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
              {errors.statut && <FormHelperText>{errors.statut.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              placeholder="Ex: Résoudre 10 problèmes de mathématiques en 30 minutes"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="difficulte"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.difficulte}>
              <InputLabel>Niveau de difficulté</InputLabel>
              <Select
                {...field}
                label="Niveau de difficulté"
                renderValue={(selected) => {
                  const option = DIFFICULTE_OPTIONS.find((opt) => opt.value === selected);
                  return (
                    <Chip
                      size="small"
                      label={option?.label}
                      sx={{
                        backgroundColor: option?.bgColor,
                        color: option?.color,
                      }}
                    />
                  );
                }}
              >
                {DIFFICULTE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Chip
                      size="small"
                      label={option.label}
                      sx={{
                        backgroundColor: option.bgColor,
                        color: option.color,
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
              {errors.difficulte && <FormHelperText>{errors.difficulte.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="niveauId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Niveau</InputLabel>
              <Select {...field} label="Niveau" displayEmpty>
                <MenuItem value="">
                  <em>Tous niveaux</em>
                </MenuItem>
                {niveaux.map((niveau) => (
                  <MenuItem key={niveau.id} value={niveau.id}>
                    {niveau.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="datePublication"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date de publication"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.datePublication}
              helperText={errors.datePublication?.message}
              value={formatDateForInput(field.value)}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        {initialValues.fichiers_supplementaires !== undefined && (
          <FormControl fullWidth>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Documents supplémentaires (supports pédagogiques)
            </FormLabel>
            <Upload
              multiple
              thumbnail
              value={initialValues.fichiers_supplementaires}
              onDrop={(acceptedFiles) => {
                if (initialValues.fichiers_supplementaires) {
                  initialValues.fichiers_supplementaires = [
                    ...initialValues.fichiers_supplementaires,
                    ...acceptedFiles,
                  ];
                } else {
                  initialValues.fichiers_supplementaires = acceptedFiles;
                }
              }}
              onRemoveAll={() => {
                if (initialValues.fichiers_supplementaires) {
                  initialValues.fichiers_supplementaires = [];
                }
              }}
              onRemove={(file) => {
                if (initialValues.fichiers_supplementaires) {
                  initialValues.fichiers_supplementaires =
                    initialValues.fichiers_supplementaires.filter((f) => f !== file);
                }
              }}
            />
          </FormControl>
        )}
      </Grid>
    </Grid>
  );

  // Step 2: Parameters
  const renderParametersStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Paramètres du challenge
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Box sx={{ px: 1, py: 2 }}>
          <Controller
            name="timer"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <Typography id="timer-slider" gutterBottom>
                  Durée du timer: {value} minutes
                </Typography>
                <Slider
                  value={value || 30}
                  onChange={(_, newValue) => onChange(newValue)}
                  aria-labelledby="timer-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={5}
                  max={120}
                />
              </>
            )}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="nbTentatives"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Nombre de tentatives autorisées</InputLabel>
              <Select {...field} label="Nombre de tentatives autorisées">
                {TENTATIVES_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl component="fieldset">
          <FormGroup>
            <Controller
              name="isRandomQuestions"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
                  }
                  label="Ordre aléatoire des questions"
                />
              )}
            />
          </FormGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Configuration du Score
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="scoreConfiguration.methode"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Méthode de calcul du score</InputLabel>
              <Select {...field} label="Méthode de calcul du score">
                {METHODE_CALCUL_SCORE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {METHODE_CALCUL_SCORE_OPTIONS.find((o) => o.value === field.value)?.description}
              </FormHelperText>
            </FormControl>
          )}
        />
      </Grid>

      {/* Additional parameters based on score method selected */}
      {scoreMethod === ScoreMethod.TEMPS && (
        <Grid item xs={12} md={6}>
          <TextField
            label="Bonus de temps (points)"
            type="number"
            fullWidth
            placeholder="Ex: 10 points bonus par minute restante"
            onChange={(e) => {
              const parametres = JSON.stringify({
                pointsParBonneReponse: 10,
                bonusTemps: parseInt(e.target.value, 10) || 0,
              });
              setValue('scoreConfiguration.parametres', parametres);
            }}
          />
        </Grid>
      )}

      {scoreMethod === ScoreMethod.PENALITES && (
        <Grid item xs={12} md={6}>
          <TextField
            label="Pénalité par erreur (points)"
            type="number"
            fullWidth
            placeholder="Ex: -5 points par erreur"
            onChange={(e) => {
              const parametres = JSON.stringify({
                pointsParBonneReponse: 10,
                penaliteParErreur: parseInt(e.target.value, 10) || 0,
              });
              setValue('scoreConfiguration.parametres', parametres);
            }}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Prérequis (Challenge dépendant)
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="prerequisId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Challenge prérequis</InputLabel>
              <Select {...field} label="Challenge prérequis" displayEmpty>
                <MenuItem value="">
                  <em>Aucun prérequis</em>
                </MenuItem>
                {prerequisChallenges.map((challenge) => (
                  <MenuItem key={challenge.id} value={challenge.id}>
                    {challenge.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Grid>

      {prerequisId && (
        <Grid item xs={12} md={6}>
          <Controller
            name="prerequisPourcentage"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Pourcentage minimum requis"
                type="number"
                fullWidth
                InputProps={{
                  inputProps: { min: 0, max: 100 },
                  endAdornment: <Typography variant="body2">%</Typography>,
                }}
                placeholder="Ex: 70"
              />
            )}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Messages de fin
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="messageSucces"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Message de succès"
              fullWidth
              multiline
              rows={2}
              placeholder="Ex: Félicitations ! Vous avez réussi le challenge avec brio !"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="messageEchec"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Message d'échec"
              fullWidth
              multiline
              rows={2}
              placeholder="Ex: Pas de chance cette fois-ci. Essayez encore !"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  // Step 3: Questions
  const renderQuestionsStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Questions du Challenge
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={openNewQuestionDialog}
          sx={{ mb: 3 }}
        >
          Ajouter une Question
        </Button>
      </Grid>

      <Grid item xs={12}>
        {questions && questions.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {questions.map((question, index) => (
              <Paper key={question.id || index} elevation={2} sx={{ mb: 2 }}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleMoveQuestionUp(index)}
                        disabled={index === 0}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} rotation={90} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleMoveQuestionDown(index)}
                        disabled={index === questions.length - 1}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} rotation={270} />
                      </IconButton>
                      <IconButton onClick={() => openEditQuestionDialog(index)}>
                        <FontAwesomeIcon icon={faEye} />
                      </IconButton>
                      <IconButton onClick={() => removeQuestion(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Stack>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemIcon>
                    <Chip
                      icon={
                        <FontAwesomeIcon
                          icon={
                            QUESTION_TYPE_OPTIONS.find((opt) => opt.value === question.type)
                              ?.icon || faQuestion
                          }
                        />
                      }
                      label={
                        QUESTION_TYPE_OPTIONS.find((opt) => opt.value === question.type)?.label ||
                        'Question'
                      }
                      color="primary"
                      variant="outlined"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {question.texte}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" color="text.primary">
                          {question.points} points · {question.duree} sec
                        </Typography>
                        {question.type === QuestionType.QCM && question.reponses && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {question.reponses.length} options,{' '}
                            {question.reponses.filter((rep) => rep.estCorrecte).length} correcte(s)
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: (theme) => alpha('#f5f5f5', 0.5),
              border: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography color="text.secondary">
              Aucune question n'a été ajoutée. Cliquez sur "Ajouter une Question" pour commencer.
            </Typography>
          </Paper>
        )}
      </Grid>

      {/* Question creation/edit dialog */}
      {currentQuestion && (
        <Dialog
          open={questionDialogOpen}
          onClose={handleCloseQuestionDialog}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {editingQuestionIndex !== null ? 'Modifier la question' : 'Nouvelle question'}
              </Typography>
              <Chip
                label={`Question ${editingQuestionIndex !== null ? editingQuestionIndex + 1 : questions.length + 1}`}
                color="primary"
                variant="outlined"
              />
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Type de question</InputLabel>
                  <Select
                    value={currentQuestion.type}
                    label="Type de question"
                    onChange={(e) => {
                      // Reset options when changing question type
                      const newReponses =
                        e.target.value === QuestionType.QCM
                          ? [
                              { texte: '', estCorrecte: false },
                              { texte: '', estCorrecte: false },
                            ]
                          : [];

                      setCurrentQuestion({
                        ...currentQuestion,
                        type: e.target.value as QuestionType,
                        reponses: newReponses,
                        reponseAttendue: e.target.value === QuestionType.OUVERTE ? '' : undefined,
                        elements:
                          e.target.value === QuestionType.VISUEL ||
                          e.target.value === QuestionType.MINIJEU
                            ? []
                            : undefined,
                      });
                    }}
                  >
                    {QUESTION_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <FontAwesomeIcon icon={option.icon} />
                          <Typography>{option.label}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Texte de la question"
                  fullWidth
                  multiline
                  rows={2}
                  value={currentQuestion.texte}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, texte: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Points"
                  type="number"
                  fullWidth
                  value={currentQuestion.points || 0}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      points: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Durée (secondes)"
                  type="number"
                  fullWidth
                  value={currentQuestion.duree || 0}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      duree: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentQuestion.isRequired ?? true}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          isRequired: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Question obligatoire"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Médias de la question (optionnel)
                </Typography>
                <Tabs
                  value={
                    currentQuestion.fichier_image
                      ? 'image'
                      : currentQuestion.fichier_video
                        ? 'video'
                        : 'none'
                  }
                  onChange={(_, value) => {
                    if (value === 'none') {
                      handleRemoveQuestionMedia();
                    }
                  }}
                  sx={{ mb: 2 }}
                >
                  <Tab value="none" label="Aucun média" />
                  <Tab
                    value="image"
                    label="Image"
                    icon={<FontAwesomeIcon icon={faImage} />}
                    iconPosition="start"
                  />
                  <Tab
                    value="video"
                    label="Vidéo"
                    icon={<FontAwesomeIcon icon={faVideo} />}
                    iconPosition="start"
                  />
                </Tabs>

                {!currentQuestion.fichier_image && !currentQuestion.fichier_video && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Upload
                        accept={{ 'image/*': [] }}
                        thumbnail
                        onDrop={(acceptedFiles) => {
                          if (acceptedFiles.length > 0) {
                            handleQuestionImageChange(acceptedFiles[0]);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            border: '1px dashed grey',
                            p: 3,
                            textAlign: 'center',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                          }}
                        >
                          <FontAwesomeIcon icon={faImage} size="2x" style={{ marginBottom: 8 }} />
                          <Typography>
                            Déposer une image ici ou cliquer pour sélectionner
                          </Typography>
                        </Box>
                      </Upload>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Upload
                        accept={{ 'video/*': [] }}
                        thumbnail
                        onDrop={(acceptedFiles) => {
                          if (acceptedFiles.length > 0) {
                            handleQuestionVideoChange(acceptedFiles[0]);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            border: '1px dashed grey',
                            p: 3,
                            textAlign: 'center',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                          }}
                        >
                          <FontAwesomeIcon icon={faVideo} size="2x" style={{ marginBottom: 8 }} />
                          <Typography>
                            Déposer une vidéo ici ou cliquer pour sélectionner
                          </Typography>
                        </Box>
                      </Upload>
                    </Grid>
                  </Grid>
                )}

                {currentQuestion.fichier_image && (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(currentQuestion.fichier_image)}
                      alt="Aperçu de l'image"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        display: 'block',
                        margin: '0 auto',
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(255,255,255,0.8)',
                      }}
                      onClick={handleRemoveQuestionMedia}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Box>
                )}

                {currentQuestion.fichier_video && (
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <FontAwesomeIcon icon={faVideo} />
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                          {currentQuestion.fichier_video.name}
                        </Typography>
                        <Typography variant="caption">
                          {(currentQuestion.fichier_video.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                        <IconButton size="small" onClick={handleRemoveQuestionMedia}>
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Box>
                )}
              </Grid>

              {/* Question-type specific content */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                {currentQuestion.type === QuestionType.QCM && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Options de réponse
                    </Typography>

                    {currentQuestion.reponses &&
                      currentQuestion.reponses.map((reponse, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                          <Grid item xs={8}>
                            <TextField
                              label={`Option ${index + 1}`}
                              fullWidth
                              value={reponse.texte}
                              onChange={(e) => handleOptionChange(index, 'texte', e.target.value)}
                              required
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={reponse.estCorrecte || false}
                                  onChange={(e) =>
                                    handleOptionChange(index, 'estCorrecte', e.target.checked)
                                  }
                                />
                              }
                              label="Correcte"
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveOption(index)}
                              disabled={
                                !currentQuestion.reponses || currentQuestion.reponses.length <= 2
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ))}

                    <Button
                      variant="outlined"
                      startIcon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={handleAddOption}
                      sx={{ mt: 1 }}
                    >
                      Ajouter une option
                    </Button>
                  </>
                )}

                {currentQuestion.type === QuestionType.OUVERTE && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Réponse attendue
                    </Typography>
                    <TextField
                      label="Réponse attendue (facultatif)"
                      fullWidth
                      multiline
                      rows={2}
                      value={currentQuestion.reponseAttendue || ''}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          reponseAttendue: e.target.value,
                        })
                      }
                      helperText="Laissez vide si plusieurs réponses sont possibles ou si la réponse sera évaluée manuellement."
                    />
                  </>
                )}

                {(currentQuestion.type === QuestionType.VISUEL ||
                  currentQuestion.type === QuestionType.MINIJEU) && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      {currentQuestion.type === QuestionType.VISUEL
                        ? 'Éléments du jeu visuel'
                        : 'Éléments du mini-jeu'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Configurez les éléments interactifs pour ce{' '}
                      {currentQuestion.type === QuestionType.VISUEL ? 'jeu visuel' : 'mini-jeu'}.
                    </Typography>

                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        bgcolor: (theme) => alpha('#f5f5f5', 0.5),
                        border: (theme) => `1px dashed ${theme.palette.divider}`,
                      }}
                    >
                      <Typography color="text.secondary">
                        La configuration avancée des éléments visuels peut être effectuée après la
                        création du challenge via l'éditeur spécialisé.
                      </Typography>
                    </Paper>
                  </>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseQuestionDialog} color="inherit">
              Annuler
            </Button>
            <Button
              onClick={handleSaveQuestion}
              variant="contained"
              disabled={
                !currentQuestion ||
                !currentQuestion.texte ||
                (currentQuestion.type === QuestionType.QCM &&
                  (!currentQuestion.reponses ||
                    currentQuestion.reponses.some((r) => !r.texte) ||
                    !currentQuestion.reponses.some((r) => r.estCorrecte)))
              }
            >
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  );

  // Step 4: Finalization
  const renderFinalizationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Récapitulatif du Challenge
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      {/* Preview of the challenge summary */}
      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nom du challenge
              </Typography>
              <Typography variant="h6">{watch('nom')}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">{watch('description')}</Typography>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Difficulté
                </Typography>
                <Chip
                  size="small"
                  label={DIFFICULTE_OPTIONS.find((opt) => opt.value === watch('difficulte'))?.label}
                  sx={{
                    backgroundColor: DIFFICULTE_OPTIONS.find(
                      (opt) => opt.value === watch('difficulte')
                    )?.bgColor,
                    color: DIFFICULTE_OPTIONS.find((opt) => opt.value === watch('difficulte'))
                      ?.color,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Durée
                </Typography>
                <Typography variant="body2">{watch('timer')} minutes</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Nombre de tentatives
                </Typography>
                <Typography variant="body2">
                  {watch('nbTentatives') === 0 ? 'Illimité' : watch('nbTentatives')}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Questions aléatoires
                </Typography>
                <Typography variant="body2">
                  {watch('isRandomQuestions') ? 'Oui' : 'Non'}
                </Typography>
              </Box>
            </Stack>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Méthode de calcul du score
              </Typography>
              <Typography variant="body2">
                {
                  METHODE_CALCUL_SCORE_OPTIONS.find(
                    (opt) => opt.value === watch('scoreConfiguration.methode')
                  )?.label
                }
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Questions ({watch('questions')?.length || 0})
              </Typography>

              {watch('questions')?.length > 0 ? (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Voir les questions ({watch('questions')?.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {watch('questions')?.map((question, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle1">
                          Q{index + 1}: {question.texte}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {QUESTION_TYPE_OPTIONS.find((opt) => opt.value === question.type)?.label}{' '}
                          · {question.points} points
                        </Typography>

                        {question.type === QuestionType.QCM && question.reponses && (
                          <List dense>
                            {question.reponses.map((reponse, i) => (
                              <ListItem key={i}>
                                <ListItemIcon sx={{ minWidth: '30px' }}>
                                  {reponse.estCorrecte ? (
                                    <FontAwesomeIcon icon={faCheck} color="green" />
                                  ) : (
                                    <FontAwesomeIcon icon={faTimes} color="red" />
                                  )}
                                </ListItemIcon>
                                <ListItemText primary={reponse.texte} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Typography color="error">
                  Aucune question n'a été ajoutée. Veuillez retourner à l'étape 3.
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Top progress stepper */}
      <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} sx={{ py: 1 }}>
          {steps.map((step, index) => (
            <Step key={step.label} completed={completed[index]}>
              <StepLabel
                optional={<Typography variant="caption">{step.description}</Typography>}
                onClick={() => handleStepClick(index)}
                sx={{ cursor: index <= activeStep || completed[index - 1] ? 'pointer' : 'default' }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={step.icon} />
                  <Typography>{step.label}</Typography>
                </Stack>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Current step content */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>
      </Paper>

      {/* Navigation buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
          startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
        >
          Précédent
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit as any)}
            disabled={isSubmitting || !isValid || questions.length === 0}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faSave} />
            }
          >
            {initialValues.nom ? 'Mettre à jour' : 'Créer le challenge'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<FontAwesomeIcon icon={faChevronRight} />}
          >
            Suivant
          </Button>
        )}
      </Box>

      {/* Cancel button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={onCancel}
          startIcon={<FontAwesomeIcon icon={faTimes} />}
        >
          Abandonner
        </Button>
      </Box>
    </Box>
  );
};

export default ChallengeForm;
