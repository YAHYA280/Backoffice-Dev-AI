// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/ConfigStep.tsx

'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faGraduationCap,
  faEye,
  faShuffle,
  faLightbulb,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faAward,
  faInfoCircle,
  faChartBar,
  faRocket,
  faMagic,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Grid,
  Switch,
  Slider,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  TextField,
  Stack,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Tooltip,
  IconButton,
  LinearProgress,
  alpha,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
} from '@mui/material';

import type { CreationFormData, ExerciseConfig } from '../../../types/exercise-types';

interface ConfigStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const CONFIG_PRESETS = [
  {
    id: 'beginner',
    name: 'Débutant',
    description: 'Configuration idéale pour les nouveaux apprenants',
    icon: faGraduationCap,
    color: '#4CAF50',
    config: {
      allowRetries: true,
      maxRetries: 5,
      showCorrectAnswers: true,
      shuffleQuestions: false,
      shuffleAnswers: false,
      passingScore: 60,
      enableHints: true,
      enableExplanations: true,
      timeLimit: undefined,
    },
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Configuration équilibrée pour la plupart des cas',
    icon: faCheckCircle,
    color: '#2196F3',
    config: {
      allowRetries: true,
      maxRetries: 3,
      showCorrectAnswers: true,
      shuffleQuestions: true,
      shuffleAnswers: true,
      passingScore: 70,
      enableHints: true,
      enableExplanations: true,
      timeLimit: 30,
    },
  },
  {
    id: 'exam',
    name: 'Examen',
    description: 'Configuration stricte pour les évaluations',
    icon: faAward,
    color: '#FF5722',
    config: {
      allowRetries: false,
      maxRetries: 1,
      showCorrectAnswers: false,
      shuffleQuestions: true,
      shuffleAnswers: true,
      passingScore: 80,
      enableHints: false,
      enableExplanations: false,
      timeLimit: 45,
    },
  },
];

const ConfigStep: React.FC<ConfigStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string>('attempts');

  const handleConfigChange = (configUpdates: Partial<ExerciseConfig>) => {
    onChange({
      config: {
        ...data.config,
        ...configUpdates,
      },
    });
  };

  const applyPreset = (preset: (typeof CONFIG_PRESETS)[0]) => {
    handleConfigChange(preset.config);
  };

  // Calculate configuration completion
  const getConfigCompletion = () => {
    const totalSettings = 8;
    let configured = 0;

    if (data.config.passingScore !== undefined) configured++;
    if (data.config.allowRetries !== undefined) configured++;
    if (data.config.showCorrectAnswers !== undefined) configured++;
    if (data.config.shuffleQuestions !== undefined) configured++;
    if (data.config.shuffleAnswers !== undefined) configured++;
    if (data.config.enableHints !== undefined) configured++;
    if (data.config.enableExplanations !== undefined) configured++;
    if (data.config.timeLimit !== undefined || data.config.timeLimit === undefined) configured++;

    return (configured / totalSettings) * 100;
  };

  const configCompletion = getConfigCompletion();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const renderPresets = () => (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        🎯 Presets de configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choisissez une configuration prédéfinie ou personnalisez selon vos besoins
      </Typography>

      <Grid container spacing={2}>
        {CONFIG_PRESETS.map((preset) => (
          <Grid item xs={12} md={4} key={preset.id}>
            <Card
              sx={{
                p: 3,
                cursor: 'pointer',
                border: 2,
                borderColor: 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: preset.color,
                  transform: 'translateY(-4px)',
                  boxShadow: theme.customShadows?.z12,
                  bgcolor: alpha(preset.color, 0.02),
                },
              }}
              onClick={() => applyPreset(preset)}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: alpha(preset.color, 0.1),
                    color: preset.color,
                  }}
                >
                  <FontAwesomeIcon icon={preset.icon} size="lg" />
                </Avatar>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {preset.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {preset.description}
                </Typography>

                <Stack spacing={1}>
                  <Chip
                    label={
                      preset.config.allowRetries
                        ? `${preset.config.maxRetries} tentatives`
                        : '1 tentative'
                    }
                    size="small"
                    sx={{ bgcolor: alpha(preset.color, 0.1), color: preset.color }}
                  />
                  <Chip
                    label={`Score requis: ${preset.config.passingScore}%`}
                    size="small"
                    variant="outlined"
                  />
                  {preset.config.timeLimit && (
                    <Chip
                      label={`${preset.config.timeLimit} min max`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  );

  const renderAdvancedConfig = () => (
    <Box>
      {/* Attempts and Time */}
      <Accordion
        expanded={expandedSection === 'attempts'}
        onChange={() => setExpandedSection(expandedSection === 'attempts' ? '' : 'attempts')}
        sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
      >
        <AccordionSummary
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2,
            '&.Mui-expanded': {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faClock} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Tentatives et temps
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configurez les tentatives autorisées et le temps limite
              </Typography>
            </Box>

            <Chip
              label={
                data.config.allowRetries
                  ? `${data.config.maxRetries || 'Illimitées'} tentatives`
                  : '1 tentative'
              }
              size="small"
              color="primary"
            />
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.config.allowRetries}
                    onChange={(e) =>
                      handleConfigChange({
                        allowRetries: e.target.checked,
                        maxRetries: e.target.checked ? data.config.maxRetries || 3 : 1,
                      })
                    }
                    color="primary"
                  />
                }
                label="Autoriser plusieurs tentatives"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Permet aux étudiants de refaire l'exercice
              </Typography>
            </Grid>

            {data.config.allowRetries && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>
                    Nombre maximum de tentatives: {data.config.maxRetries || 3}
                  </FormLabel>
                  <Slider
                    value={data.config.maxRetries || 3}
                    onChange={(_, value) => handleConfigChange({ maxRetries: value as number })}
                    min={1}
                    max={10}
                    step={1}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 3, label: '3' },
                      { value: 5, label: '5' },
                      { value: 10, label: '∞' },
                    ]}
                    valueLabelDisplay="auto"
                    sx={{ mt: 2 }}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Switch
                  checked={!!data.config.timeLimit}
                  onChange={(e) =>
                    handleConfigChange({
                      timeLimit: e.target.checked ? 30 : undefined,
                    })
                  }
                />
                <Typography variant="subtitle2">Limiter le temps de l'exercice</Typography>
              </Box>

              {data.config.timeLimit && (
                <TextField
                  type="number"
                  label="Temps limite (minutes)"
                  value={data.config.timeLimit}
                  onChange={(e) =>
                    handleConfigChange({
                      timeLimit: parseInt(e.target.value, 10) || undefined,
                    })
                  }
                  inputProps={{ min: 1, max: 180 }}
                  sx={{ maxWidth: 200 }}
                  helperText="Entre 1 et 180 minutes"
                />
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Scoring */}
      <Accordion
        expanded={expandedSection === 'scoring'}
        onChange={() => setExpandedSection(expandedSection === 'scoring' ? '' : 'scoring')}
        sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
      >
        <AccordionSummary
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.05),
            borderRadius: 2,
            '&.Mui-expanded': {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.success.main,
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faAward} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Score et évaluation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Définissez les critères de réussite
              </Typography>
            </Box>

            <Chip label={`${data.config.passingScore}% requis`} size="small" color="success" />
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 2 }}>
                  Score de réussite requis: {data.config.passingScore}%
                </FormLabel>
                <Slider
                  value={data.config.passingScore}
                  onChange={(_, value) => handleConfigChange({ passingScore: value as number })}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 70, label: '70%' },
                    { value: 100, label: '100%' },
                  ]}
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-track': {
                      background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 50%, ${theme.palette.success.main} 100%)`,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Pourcentage minimum pour valider l'exercice
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.config.showCorrectAnswers}
                    onChange={(e) => handleConfigChange({ showCorrectAnswers: e.target.checked })}
                    color="success"
                  />
                }
                label="Afficher les corrections après soumission"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Montre les bonnes réponses et explications
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Question Behavior */}
      <Accordion
        expanded={expandedSection === 'behavior'}
        onChange={() => setExpandedSection(expandedSection === 'behavior' ? '' : 'behavior')}
        sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
      >
        <AccordionSummary
          sx={{
            bgcolor: alpha(theme.palette.info.main, 0.05),
            borderRadius: 2,
            '&.Mui-expanded': {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.info.main,
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faShuffle} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Comportement des questions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ordre et présentation des questions
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
              {data.config.shuffleQuestions && <Chip label="Mélange Q" size="small" color="info" />}
              {data.config.shuffleAnswers && <Chip label="Mélange R" size="small" color="info" />}
            </Stack>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.config.shuffleQuestions}
                    onChange={(e) => handleConfigChange({ shuffleQuestions: e.target.checked })}
                    color="info"
                  />
                }
                label="Mélanger l'ordre des questions"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Présente les questions dans un ordre aléatoire
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.config.shuffleAnswers}
                    onChange={(e) => handleConfigChange({ shuffleAnswers: e.target.checked })}
                    color="info"
                  />
                }
                label="Mélanger les options de réponse"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Mélange les choix multiples et correspondances
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Help and Hints */}
      <Accordion
        expanded={expandedSection === 'help'}
        onChange={() => setExpandedSection(expandedSection === 'help' ? '' : 'help')}
        sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
      >
        <AccordionSummary
          sx={{
            bgcolor: alpha(theme.palette.warning.main, 0.05),
            borderRadius: 2,
            '&.Mui-expanded': {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.warning.main,
                color: 'white',
              }}
            >
              <FontAwesomeIcon icon={faLightbulb} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Aide et accompagnement
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Options d'assistance pour les étudiants
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
              {data.config.enableHints && <Chip label="Indices" size="small" color="warning" />}
              {data.config.enableExplanations && (
                <Chip label="Explications" size="small" color="warning" />
              )}
            </Stack>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.config.enableHints}
                    onChange={(e) => handleConfigChange({ enableHints: e.target.checked })}
                    color="warning"
                  />
                }
                label="Activer les indices"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Affiche un bouton d'aide sur les questions qui en ont
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.config.enableExplanations}
                    onChange={(e) => handleConfigChange({ enableExplanations: e.target.checked })}
                    color="warning"
                  />
                }
                label="Activer les explications détaillées"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                Montre les explications détaillées dans les résultats
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderConfigSummary = () => (
    <Card
      sx={{
        p: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
        border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            width: 48,
            height: 48,
          }}
        >
          <FontAwesomeIcon icon={faRocket} />
        </Avatar>

        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            🎯 Configuration finale
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Votre exercice est prêt avec ces paramètres
          </Typography>
        </Box>
      </Box>

      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Configuration complétée
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="primary.main">
            {Math.round(configCompletion)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={configCompletion}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            },
          }}
        />
      </Box>

      {/* Summary Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Tentatives
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {data.config.allowRetries ? `${data.config.maxRetries || '∞'}` : '1'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Temps limite
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {data.config.timeLimit ? `${data.config.timeLimit}min` : '∞'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Score requis
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {data.config.passingScore}%
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Fonctionnalités
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="info.main">
              {
                [
                  data.config.showCorrectAnswers && 'Corrections',
                  data.config.enableHints && 'Indices',
                  data.config.shuffleQuestions && 'Mélange',
                  data.config.enableExplanations && 'Explications',
                ].filter(Boolean).length
              }
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Features List */}
      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Fonctionnalités activées :
      </Typography>

      <List dense>
        {[
          { key: 'showCorrectAnswers', label: 'Affichage des corrections', icon: faEye },
          { key: 'enableHints', label: "Indices d'aide", icon: faLightbulb },
          { key: 'enableExplanations', label: 'Explications détaillées', icon: faInfoCircle },
          { key: 'shuffleQuestions', label: 'Mélange des questions', icon: faShuffle },
          { key: 'shuffleAnswers', label: 'Mélange des réponses', icon: faShuffle },
        ].map((feature) => {
          const isEnabled = (data.config as any)[feature.key];
          return (
            <ListItem key={feature.key} disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FontAwesomeIcon
                  icon={isEnabled ? faCheckCircle : faExclamationTriangle}
                  color={isEnabled ? theme.palette.success.main : theme.palette.grey[400]}
                />
              </ListItemIcon>
              <ListItemText
                primary={feature.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: isEnabled ? 'text.primary' : 'text.secondary',
                }}
              />
              <ListItemSecondaryAction>
                <FontAwesomeIcon
                  icon={isEnabled ? faToggleOn : faToggleOff}
                  color={isEnabled ? theme.palette.success.main : theme.palette.grey[400]}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: theme.palette.primary.main,
                fontSize: '2rem',
              }}
            >
              <FontAwesomeIcon icon={faCog} />
            </Avatar>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Configuration avancée
            </Typography>

            <Typography variant="h6" color="text.secondary">
              Personnalisez le comportement et les paramètres de votre exercice
            </Typography>
          </Box>
        </m.div>

        {/* Tabs */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  mx: 0.5,
                },
                '& .Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Tab
                icon={<FontAwesomeIcon icon={faMagic} />}
                label="Presets rapides"
                iconPosition="start"
              />
              <Tab
                icon={<FontAwesomeIcon icon={faCog} />}
                label="Configuration détaillée"
                iconPosition="start"
              />
              <Tab
                icon={<FontAwesomeIcon icon={faChartBar} />}
                label="Résumé"
                iconPosition="start"
              />
            </Tabs>
          </Box>
        </m.div>

        {/* Tab Content */}
        {activeTab === 0 && <m.div variants={itemVariants}>{renderPresets()}</m.div>}

        {activeTab === 1 && <m.div variants={itemVariants}>{renderAdvancedConfig()}</m.div>}

        {activeTab === 2 && <m.div variants={itemVariants}>{renderConfigSummary()}</m.div>}

        {/* Success Alert */}
        <m.div variants={itemVariants}>
          <Alert
            severity="success"
            sx={{
              mt: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.success.light}`,
            }}
            icon={<FontAwesomeIcon icon={faCheckCircle} />}
          >
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Configuration terminée ! 🎉
            </Typography>
            <Typography variant="body2">
              Votre exercice est maintenant configuré et prêt à être sauvegardé. Vous pouvez encore
              modifier ces paramètres si nécessaire.
            </Typography>
          </Alert>
        </m.div>
      </Box>
    </m.div>
  );
};

export default ConfigStep;
