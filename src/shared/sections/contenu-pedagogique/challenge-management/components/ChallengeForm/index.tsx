import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTimes,
  faClock,
  faCheck,
  faQuestion,
  faInfoCircle,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Step,
  Paper,
  Stack,
  Button,
  Stepper,
  StepLabel,
  Typography,
  CircularProgress,
} from '@mui/material';

import { challengeFormSchema } from './types';
// Importer correctement les composants d'étape en utilisant les imports nommés
import { ChallengeFormStep1 } from './ChallengeFormStep1';
import { ChallengeFormStep2 } from './ChallengeFormStep2';
import { ChallengeFormStep3 } from './ChallengeFormStep3';
import { ChallengeFormStep4 } from './ChallengeFormStep4';
import { Difficulty, ChallengeStatus } from '../../types';
import { MESSAGE_FINAL_DEFAUT, DEFAULT_SCORE_CONFIGURATION } from '../../constants';

import type { ChallengeFormData, ChallengeFormProps } from './types';

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  niveaux = [],
  prerequisChallenges = [],
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  const generateId = () => `tmp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Utilisez un objet de valeurs par défaut complet si initialValues n'est pas fourni
  const defaultValues = initialValues || {
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
  };

  const initialMultimedias =
    defaultValues.multimedias?.map((item) => ({
      ...item,
      id: item.id || generateId(),
    })) || [];

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      ...defaultValues,
      multimedias: initialMultimedias,
      questions: defaultValues.questions || [],
    } as ChallengeFormData,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    trigger,
    formState: { isValid },
    watch,
  } = form;
  const questions = watch('questions');

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
      label: 'Questions du Challenge',
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

  const renderStepContent = (step: number) => {
    const commonProps = {
      form,
      niveaux,
      prerequisChallenges,
      generateId,
    };

    switch (step) {
      case 0:
        return <ChallengeFormStep1 {...commonProps} />;
      case 1:
        return <ChallengeFormStep2 {...commonProps} />;
      case 2:
        return <ChallengeFormStep3 {...commonProps} />;
      case 3:
        return <ChallengeFormStep4 {...commonProps} />;
      default:
        return null;
    }
  };

  const handleFormSubmit = (data: ChallengeFormData) => {
    // Make sure all questions have proper IDs before submitting
    const finalQuestions = data.questions.map((q, idx) => {
      // Ensure all elements have IDs
      const elements = (q.elements || []).map((element) => ({
        ...element,
        id: element.id || generateId(),
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

    // Create a properly formatted Challenge object
    const challengeData = {
      // Générer un nouvel ID si on crée un nouveau challenge, sinon utiliser l'ID existant
      id: (defaultValues as any).id || generateId(),
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
      niveau: data.niveauId
        ? {
            id: data.niveauId,
            nom: niveaux.find((n) => n.id === data.niveauId)?.nom || '',
          }
        : undefined,
    };

    // Submit the formatted challenge data
    onSubmit(challengeData);
  };

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
          color="primary"
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
            color="primary"
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting || !isValid || questions?.length === 0}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faSave} />
            }
          >
            {(defaultValues as any).id ? 'Mettre à jour' : 'Créer le challenge'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
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
          variant="outlined"
          color="warning"
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
