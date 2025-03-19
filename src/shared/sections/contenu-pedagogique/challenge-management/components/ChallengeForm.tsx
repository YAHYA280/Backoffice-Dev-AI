import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  faEye,
  faSave,
  faPlus,
  faTimes,
  faImage,
  faVideo,
  faTrash,
  faCheck,
  faClock,
  faListOl,
  faGamepad,
  faQuestion,
  faInfoCircle,
  faChevronLeft,
  faPuzzlePiece,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import Checkbox from '@mui/material/Checkbox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Tab,
  Grid,
  Chip,
  Step,
  List,
  Tabs,
  Stack,
  alpha,
  Paper,
  Button,
  Select,
  Switch,
  Slider,
  Dialog,
  Divider,
  Stepper,
  MenuItem,
  ListItem,
  TextField,
  FormGroup,
  FormLabel,
  StepLabel,
  Accordion,
  InputLabel,
  Typography,
  IconButton,
  FormControl,
  DialogTitle,
  ListItemText,
  ListItemIcon,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormHelperText,
  CircularProgress,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { Upload } from 'src/shared/components/upload';
import { CustomUpload } from 'src/shared/components/upload/upload-custom';

import { Difficulty, ScoreMethod, QuestionType, MultimediaType, ChallengeStatus } from '../types';
import {
  STATUT_OPTIONS,
  DIFFICULTE_OPTIONS,
  TENTATIVES_OPTIONS,
  MESSAGE_FINAL_DEFAUT,
  MOCK_PREREQUIS_CHALLENGES,
  DEFAULT_SCORE_CONFIGURATION,
  METHODE_CALCUL_SCORE_OPTIONS,
} from '../constants';

import type { Challenge } from '../types';

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

interface EditableReponse {
  id?: string;
  texte: string;
  estCorrecte: boolean;
}

interface EditableQuestion {
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

type ChallengeFormData = z.infer<typeof schema>;

interface ChallengeFormProps {
  initialValues?: Partial<Challenge>;
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
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<EditableQuestion | null>(null);

  const generateId = () => `tmp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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

  const {
    append: appendQuestion,
    remove: removeQuestion,
    swap: swapQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  // const isRandomQuestions = watch('isRandomQuestions');
  const niveauId = watch('niveauId');
  const scoreMethod = watch('scoreConfiguration.methode');
  const prerequisId = watch('prerequisId');
  const questions = watch('questions');

  const allPrerequisChallenges = [...prerequisChallenges, ...MOCK_PREREQUIS_CHALLENGES];

  const filteredPrerequisChallenges = niveauId
    ? allPrerequisChallenges.filter((challenge) => challenge.niveau?.id === niveauId)
    : allPrerequisChallenges;

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
    const newQuestion: EditableQuestion = {
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
    };
    setCurrentQuestion(newQuestion);
    setEditingQuestionIndex(null);
    setQuestionDialogOpen(true);
  };

  const openEditQuestionDialog = (index: number) => {
    const questionToEdit = { ...questions[index] };

    const editableQuestion: EditableQuestion = {
      id: questionToEdit.id,
      type: questionToEdit.type,
      texte: questionToEdit.texte,
      ordre: questionToEdit.ordre,
      points: questionToEdit.points || 10,
      duree: questionToEdit.duree || 60,
      isRequired: (questionToEdit as any).isRequired,
      fichier_image: null,
      fichier_video: null,
      reponses: (questionToEdit.reponses || []).map((rep) => ({
        id: rep.id,
        texte: rep.texte,
        estCorrecte: rep.estCorrecte,
      })),
    };

    if (questionToEdit.reponseAttendue) {
      editableQuestion.reponseAttendue = questionToEdit.reponseAttendue;
    }

    if (questionToEdit.elements) {
      editableQuestion.elements = questionToEdit.elements;
    }

    setCurrentQuestion(editableQuestion);
    setEditingQuestionIndex(index);
    setQuestionDialogOpen(true);
  };

  const handleCloseQuestionDialog = () => {
    setQuestionDialogOpen(false);
    setCurrentQuestion(null);
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion) return;

    const questionToSave = {
      id: currentQuestion.id || generateId(),
      type: currentQuestion.type,
      texte: currentQuestion.texte,
      ordre: currentQuestion.ordre || 0,
      points: currentQuestion.points,
      duree: currentQuestion.duree,
      isRequired: currentQuestion.isRequired === undefined ? true : currentQuestion.isRequired,
      reponses: currentQuestion.reponses.map((reponse) => ({
        id: reponse.id || generateId(),
        texte: reponse.texte,
        estCorrecte: reponse.estCorrecte,
      })),
    } as any;

    if (currentQuestion.reponseAttendue) {
      questionToSave.reponseAttendue = currentQuestion.reponseAttendue;
    }

    if (currentQuestion.elements && currentQuestion.elements.length > 0) {
      questionToSave.elements = currentQuestion.elements.map((element) => ({
        id: element.id || generateId(),
        texte: element.texte || '',
        position: element.position || 0,
        cible: element.cible || '',
      }));
    }

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionToSave;
      setValue('questions', updatedQuestions);
    } else {
      appendQuestion(questionToSave);
    }

    setQuestionDialogOpen(false);
    setCurrentQuestion(null);
  };

  const handleAddOption = () => {
    if (!currentQuestion) return;

    const newReponse: EditableReponse = { texte: '', estCorrecte: false };
    setCurrentQuestion({
      ...currentQuestion,
      reponses: [...currentQuestion.reponses, newReponse],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      reponses: currentQuestion.reponses.filter((_, i) => i !== index),
    });
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    if (!currentQuestion) return;

    const newReponses = [...currentQuestion.reponses];
    newReponses[index] = {
      ...newReponses[index],
      [field]: value,
    };
    setCurrentQuestion({
      ...currentQuestion,
      reponses: newReponses,
    });
  };

  const handleMoveQuestionUp = (index: number) => {
    if (index === 0) return;

    const updatedQuestions = [...questions];

    [updatedQuestions[index - 1], updatedQuestions[index]] = [
      updatedQuestions[index],
      updatedQuestions[index - 1],
    ];

    updatedQuestions.forEach((q, idx) => {
      q.ordre = idx;
    });

    setValue('questions', updatedQuestions);
  };

  const handleMoveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return;

    const updatedQuestions = [...questions];

    [updatedQuestions[index + 1], updatedQuestions[index]] = [
      updatedQuestions[index],
      updatedQuestions[index + 1],
    ];

    updatedQuestions.forEach((q, idx) => {
      q.ordre = idx;
    });

    setValue('questions', updatedQuestions);
  };

  const handleQuestionImageChange = (file: File) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_image: file,
      fichier_video: null,
    });
  };

  const handleQuestionVideoChange = (file: File) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_video: file,
      fichier_image: null,
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
        <Controller
          name="fichiers_supplementaires"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Documents supplémentaires (supports pédagogiques)
              </FormLabel>
              <Upload
                multiple
                thumbnail
                value={value || []}
                onDrop={(acceptedFiles) => {
                  const newFiles = value ? [...value, ...acceptedFiles] : acceptedFiles;
                  onChange(newFiles);
                }}
                onRemoveAll={() => {
                  onChange([]);
                }}
                onRemove={(file) => {
                  if (!value) return;
                  const filteredItems = value.filter((_file) => _file !== file);
                  onChange(filteredItems);
                }}
              />
            </FormControl>
          )}
        />
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
      {scoreMethod === ScoreMethod.TEMPS ? (
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
      ) : (
        <></>
      )}

      {scoreMethod === ScoreMethod.PENALITES ? (
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
      ) : (
        <></>
      )}

      <Grid item xs={12}>
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Prérequis (Challenge dépendant)
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Controller
                name="prerequisId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="prerequis-select-label">Challenge prérequis</InputLabel>
                    <Select
                      {...field}
                      labelId="prerequis-select-label"
                      label="Challenge prérequis"
                      displayEmpty
                      id="prerequis-select"
                    >
                      <MenuItem value="none">
                        <em>Aucun prérequis</em>
                      </MenuItem>
                      {filteredPrerequisChallenges.map((challenge) => (
                        <MenuItem key={challenge.id} value={challenge.id}>
                          {challenge.nom}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Sélectionnez un challenge qui doit être complété avant
                      {niveauId && filteredPrerequisChallenges.length === 0 ? (
                        <Typography variant="caption" color="error" display="block">
                          Aucun challenge disponible pour ce niveau
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {prerequisId !== 'none' ? (
              <Grid item xs={12} md={6}>
                <Controller
                  name="prerequisPourcentage"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        label="Pourcentage minimum requis"
                        type="number"
                        variant="outlined"
                        InputProps={{
                          inputProps: { min: 0, max: 100 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="body2">%</Typography>
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Ex: 70"
                        helperText="Score minimum nécessaire pour accéder à ce challenge"
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </Paper>
      </Grid>

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
                        size="medium"
                        sx={{ color: '#1976D2' }} // Blue color
                      >
                        <FontAwesomeIcon icon={faChevronLeft} rotation={90} fontSize="medium" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleMoveQuestionDown(index)}
                        disabled={index === questions.length - 1}
                        size="medium"
                        sx={{ color: '#388E3C' }} // Green color
                      >
                        <FontAwesomeIcon icon={faChevronLeft} rotation={270} fontSize="medium" />
                      </IconButton>
                      <IconButton onClick={() => openEditQuestionDialog(index)} size="medium">
                        <FontAwesomeIcon icon={faEye} fontSize="medium" />
                      </IconButton>
                      <IconButton
                        onClick={() => removeQuestion(index)}
                        size="medium"
                        sx={{ color: '#D32F2F' }}
                      >
                        <FontAwesomeIcon icon={faTrash} fontSize="medium" />
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
                        {question.type === QuestionType.QCM && question.reponses ? (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {question.reponses.length} options,{' '}
                            {question.reponses.filter((rep) => rep.estCorrecte).length} correcte(s)
                          </Typography>
                        ) : (
                          <></>
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
              Aucune question n&apos;a été ajoutée. Cliquez sur &apos;Ajouter une Question&apos;
              pour commencer.
            </Typography>
          </Paper>
        )}
      </Grid>

      {/* Question creation/edit dialog */}
      {currentQuestion ? (
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
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Type de question</InputLabel>
                  <Select
                    labelId="question-type-label"
                    id="question-type-select"
                    value={currentQuestion.type}
                    label="Type de question"
                    onChange={(e) => {
                      // Reset options when changing question type
                      const newType = e.target.value as QuestionType;
                      const newReponses: EditableReponse[] =
                        newType === QuestionType.QCM
                          ? [
                              { texte: '', estCorrecte: false },
                              { texte: '', estCorrecte: false },
                            ]
                          : [];

                      // Create updated question with the new type
                      const updatedQuestion: EditableQuestion = {
                        ...currentQuestion,
                        type: newType,
                        reponses: newReponses,
                      };

                      // Add type-specific properties
                      if (newType === QuestionType.OUVERTE) {
                        updatedQuestion.reponseAttendue = '';
                      } else {
                        delete updatedQuestion.reponseAttendue;
                      }

                      if (newType === QuestionType.VISUEL || newType === QuestionType.MINIJEU) {
                        updatedQuestion.elements = [];
                      } else {
                        delete updatedQuestion.elements;
                      }

                      setCurrentQuestion(updatedQuestion);
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: { zIndex: 1500 },
                      },
                    }}
                  >
                    {QUESTION_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main',
                            }}
                          >
                            <FontAwesomeIcon icon={option.icon} />
                          </Box>
                          <Box>
                            <Typography variant="body1">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Choisissez le type de question adapté à votre contenu pédagogique
                  </FormHelperText>
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
                {!currentQuestion.fichier_image && !currentQuestion.fichier_video ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <FormLabel component="legend" sx={{ mb: 1 }}>
                          Image
                        </FormLabel>
                        <CustomUpload
                          accept={{ 'image/*': [] }}
                          value={currentQuestion.fichier_image}
                          multiple={false}
                          onDrop={(acceptedFiles) => handleQuestionImageChange(acceptedFiles[0])}
                          onDelete={() => handleRemoveQuestionMedia()}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <FormLabel component="legend" sx={{ mb: 1 }}>
                          Vidéo
                        </FormLabel>
                        <CustomUpload
                          accept={{ 'video/*': [] }}
                          value={currentQuestion.fichier_video}
                          multiple={false}
                          onDrop={(acceptedFiles) => handleQuestionVideoChange(acceptedFiles[0])}
                          onDelete={() => handleRemoveQuestionMedia()}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                )}

                {currentQuestion.fichier_image ? (
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
                ) : (
                  <></>
                )}

                {currentQuestion.fichier_video ? (
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
                ) : (
                  <></>
                )}
              </Grid>

              {/* Question-type specific content */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                {currentQuestion.type === QuestionType.QCM ? (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Options de réponse
                    </Typography>

                    {currentQuestion.reponses.map((reponse, index) => (
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
                            disabled={currentQuestion.reponses.length <= 2}
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
                ) : (
                  <></>
                )}

                {currentQuestion.type === QuestionType.OUVERTE ? (
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
                ) : (
                  <></>
                )}

                {currentQuestion.type === QuestionType.VISUEL ||
                currentQuestion.type === QuestionType.MINIJEU ? (
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
                        création du challenge via l&apos;éditeur spécialisé.
                      </Typography>
                    </Paper>
                  </>
                ) : (
                  <></>
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
                  (currentQuestion.reponses.length === 0 ||
                    currentQuestion.reponses.some((r) => !r.texte) ||
                    !currentQuestion.reponses.some((r) => r.estCorrecte)))
              }
            >
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
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

                        {question.type === QuestionType.QCM && question.reponses ? (
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
                        ) : (
                          <></>
                        )}
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Typography color="error">
                  Aucune question n&apos;a été ajoutée. Veuillez retourner à l&apos;étape 3.
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
          // Corrected submit button implementation for the ChallengeForm component
          <Button
            variant="contained"
            type="submit"
            onClick={handleSubmit((data) => {
              // Make sure all questions have proper IDs before submitting
              const finalQuestions = data.questions.map((q, idx) => {
                // Ensure all elements have IDs
                const elements = (q.elements || []).map((element) => ({
                  ...element,
                  id: element.id || generateId(), // Ensure id is always a string
                }));

                return {
                  ...q,
                  id: q.id || generateId(),
                  ordre: idx,
                  reponses: (q.reponses || []).map((r) => ({
                    ...r,
                    id: r.id || generateId(),
                  })),
                  elements,
                };
              });

              // Fix ScoreConfiguration - ensure id is always present
              const scoreConfig = {
                ...data.scoreConfiguration,
                id: data.scoreConfiguration.id || generateId(),
              };

              // Create prerequis object if prerequisId is provided
              const prerequisChallenge = data.prerequisId
                ? prerequisChallenges.find((pc) => pc.id === data.prerequisId)
                : undefined;

              // Create a properly formatted Challenge object
              const challengeData: Challenge = {
                id: initialValues.id || generateId(),
                nom: data.nom,
                description: data.description,
                statut: data.statut,
                difficulte: data.difficulte,
                timer: data.timer,
                nbTentatives: data.nbTentatives,
                datePublication: data.datePublication,
                dateCreation: data.dateCreation || new Date().toISOString(),
                dateMiseAJour: new Date().toISOString(),
                messageSucces: data.messageSucces || MESSAGE_FINAL_DEFAUT.success,
                messageEchec: data.messageEchec || MESSAGE_FINAL_DEFAUT.failure,
                scoreConfiguration: scoreConfig,
                questions: finalQuestions,
                multimedias: data.multimedias || [],
                isRandomQuestions: data.isRandomQuestions || false,
                // prerequis: prerequisChallenge,
                niveau: data.niveauId
                  ? {
                      id: data.niveauId,
                      nom: niveaux.find((n) => n.id === data.niveauId)?.nom || '',
                    }
                  : undefined,
              };

              // Now submit the properly formatted challenge data
              onSubmit(challengeData);
            })}
            disabled={isSubmitting || !isValid || questions.length === 0}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faSave} />
            }
          >
            {initialValues.id ? 'Mettre à jour' : 'Créer le challenge'}
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
