// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/shared/CreationStepper.tsx

'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Step,
  Paper,
  Stack,
  Button,
  Stepper,
  StepLabel,
  useTheme,
  Typography,
  StepConnector,
  stepConnectorClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface CreationStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

interface CreationStepperProps {
  steps: CreationStep[];
  activeStep: number;
  completedSteps: number;
  onStepClick?: (step: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onCancel?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  cancelLabel?: string;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  isLoading?: boolean;
  orientation?: 'horizontal' | 'vertical';
  showNavigation?: boolean;
}

// Connecteur personnalisé
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
}));

// Icône personnalisée pour les étapes
const CustomStepIcon = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed
    ? theme.palette.success.main
    : ownerState.active
      ? theme.palette.primary.main
      : theme.palette.grey[300],
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: `3px solid ${ownerState.active ? theme.palette.primary.light : 'transparent'}`,
  boxShadow: ownerState.active || ownerState.completed ? theme.customShadows?.z8 : 'none',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.customShadows?.z12,
  },
}));

const StepIconComponent: React.FC<{
  icon: any;
  active: boolean;
  completed: boolean;
  onClick?: () => void;
}> = ({ icon, active, completed, onClick }) => (
  <CustomStepIcon ownerState={{ active, completed }} onClick={onClick}>
    {completed ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={icon} />}
  </CustomStepIcon>
);

const CreationStepper: React.FC<CreationStepperProps> = ({
  steps,
  activeStep,
  completedSteps,
  onStepClick,
  onNext,
  onPrev,
  onCancel,
  nextLabel = 'Suivant',
  prevLabel = 'Précédent',
  cancelLabel = 'Annuler',
  canGoNext = true,
  canGoPrev = true,
  isLoading = false,
  orientation = 'horizontal',
  showNavigation = true,
}) => {
  const theme = useTheme();

  const handleStepClick = (stepIndex: number) => {
    if (onStepClick && stepIndex <= completedSteps) {
      onStepClick(stepIndex);
    }
  };

  const isLastStep = activeStep === steps.length - 1;
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Barre de progression */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Étape {activeStep + 1} sur {steps.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}% complété
          </Typography>
        </Box>

        <Box
          sx={{
            height: 6,
            bgcolor: theme.palette.grey[200],
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <m.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              borderRadius: 3,
            }}
          />
        </Box>
      </Box>

      {/* Stepper */}
      <Stepper
        activeStep={activeStep}
        orientation={orientation}
        connector={<CustomConnector />}
        sx={{ mb: showNavigation ? 3 : 0 }}
      >
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel
              StepIconComponent={() => (
                <StepIconComponent
                  icon={step.icon}
                  active={index === activeStep}
                  completed={index < activeStep || index <= completedSteps}
                  onClick={() => handleStepClick(index)}
                />
              )}
              sx={{
                cursor: index <= completedSteps ? 'pointer' : 'default',
                '& .MuiStepLabel-label': {
                  fontWeight: index === activeStep ? 'bold' : 'normal',
                  color:
                    index === activeStep
                      ? theme.palette.primary.main
                      : index <= completedSteps
                        ? theme.palette.text.primary
                        : theme.palette.text.disabled,
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'inherit' }}>
                {step.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Étape actuelle - Détails */}
      <m.div
        key={activeStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.primary.lighter,
            border: `1px solid ${theme.palette.primary.light}`,
            mb: showNavigation ? 3 : 0,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon icon={steps[activeStep]?.icon} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {steps[activeStep]?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {steps[activeStep]?.description}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </m.div>

      {/* Navigation */}
      {showNavigation && (
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Box>
            {onCancel && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={onCancel}
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                {cancelLabel}
              </Button>
            )}

            {canGoPrev && activeStep > 0 && onPrev && (
              <Button
                variant="outlined"
                onClick={onPrev}
                disabled={isLoading}
                startIcon={
                  <FontAwesomeIcon icon={faChevronRight} style={{ transform: 'rotate(180deg)' }} />
                }
              >
                {prevLabel}
              </Button>
            )}
          </Box>

          <Box>
            {onNext && (
              <Button
                variant="contained"
                onClick={onNext}
                disabled={!canGoNext || isLoading}
                endIcon={isLastStep ? null : <FontAwesomeIcon icon={faChevronRight} />}
                sx={{
                  minWidth: 120,
                  fontWeight: 'bold',
                }}
              >
                {isLoading ? 'Chargement...' : isLastStep ? 'Terminer' : nextLabel}
              </Button>
            )}
          </Box>
        </Stack>
      )}
    </Paper>
  );
};

export default CreationStepper;
