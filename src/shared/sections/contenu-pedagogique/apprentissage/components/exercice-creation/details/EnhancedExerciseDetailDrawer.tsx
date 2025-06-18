// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/details/EnhancedExerciseDetailDrawer.tsx

'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faEdit,
  faRobot,
  faUser,
  faQuestionCircle,
  faCog,
  faFileAlt,
  faChartBar,
  faCalendar,
  faTag,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faLightbulb,
  faEye,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Drawer,
  useTheme,
  Typography,
  IconButton,
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tab,
  Tabs,
  alpha,
  LinearProgress,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate/variants/fade';
import type { Exercise } from '../types/exercise-types';

interface EnhancedExerciseDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  exercise: Exercise;
  onEdit?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>
);

const EnhancedExerciseDetailDrawer: React.FC<EnhancedExerciseDetailDrawerProps> = ({
  open,
  onClose,
  exercise,
  onEdit,
  onPreview,
  onExport,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const isAiGenerated = exercise.mode === 'ai';
  const questions = isAiGenerated
    ? (exercise as any).generatedQuestions || []
    : exercise.questions || [];

  const totalPoints = questions.reduce((sum: number, q: any) => sum + q.points, 0);

  // Statistiques des questions
  const questionStats = {
    total: questions.length,
    byType: questions.reduce((acc: any, q: any) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {}),
    byDifficulty: questions.reduce(
      (acc: any, q: any) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
      },
      { easy: 0, medium: 0, hard: 0 }
    ),
  };

  // Couleurs pour les statistiques
  const difficultyColors = {
    easy: theme.palette.success.main,
    medium: theme.palette.warning.main,
    hard: theme.palette.error.main,
  };

  const typeColors = {
    multiple_choice: theme.palette.primary.main,
    true_false: theme.palette.success.main,
    short_answer: theme.palette.info.main,
    long_answer: theme.palette.warning.main,
    fill_blanks: theme.palette.secondary.main,
    matching: theme.palette.error.main,
  };

  const renderBasicInfo = () => (
    <Box>
      {/* Métadonnées */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Créé le
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <FontAwesomeIcon icon={faCalendar} color={theme.palette.text.secondary} />
              <Typography variant="body2">
                {exercise.createdAt
                  ? new Date(exercise.createdAt).toLocaleDateString('fr-FR')
                  : 'Non défini'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Dernière modification
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <FontAwesomeIcon icon={faEdit} color={theme.palette.text.secondary} />
              <Typography variant="body2">
                {exercise.updatedAt
                  ? new Date(exercise.updatedAt).toLocaleDateString('fr-FR')
                  : 'Non défini'}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Statut
            </Typography>
            <Chip
              label={
                exercise.status === 'published'
                  ? 'Publié'
                  : exercise.status === 'draft'
                    ? 'Brouillon'
                    : 'Archivé'
              }
              color={
                exercise.status === 'published'
                  ? 'success'
                  : exercise.status === 'draft'
                    ? 'warning'
                    : 'default'
              }
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Mode de création
            </Typography>
            <Chip
              icon={<FontAwesomeIcon icon={isAiGenerated ? faRobot : faUser} />}
              label={isAiGenerated ? 'Généré par IA' : 'Création manuelle'}
              color={isAiGenerated ? 'secondary' : 'primary'}
              size="small"
            />
          </Grid>
        </Grid>
      </Card>

      {/* Tags */}
      {exercise.tags && exercise.tags.length > 0 && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            <FontAwesomeIcon icon={faTag} style={{ marginRight: 8 }} />
            Mots-clés
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {exercise.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>
        </Card>
      )}

      {/* Description complète */}
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Description complète
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {exercise.description || 'Aucune description disponible.'}
        </Typography>
      </Card>
    </Box>
  );

  const renderAiInfo = () => {
    if (!isAiGenerated || !(exercise as any).aiConfig) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Cet exercice n&apos;a pas été généré par IA
          </Typography>
        </Box>
      );
    }

    const { aiConfig } = exercise as any;

    return (
      <Box>
        {/* Configuration IA */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Configuration de génération
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Modèle utilisé
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {aiConfig.model || 'GPT-4'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Style d&apos;écriture
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {aiConfig.writingStyle || 'Standard'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Niveau éducatif
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {aiConfig.educationalLevel || 'Non spécifié'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Température
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {aiConfig.temperature || 0.7}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* Objectifs pédagogiques */}
        {aiConfig.learningObjectives && aiConfig.learningObjectives.length > 0 && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Objectifs d&apos;apprentissage
            </Typography>
            <Stack spacing={1}>
              {aiConfig.learningObjectives.map((objective: string, index: number) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={faCheckCircle} color={theme.palette.success.main} />
                  <Typography variant="body2">{objective}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        )}

        {/* Compétences */}
        {aiConfig.competencies && aiConfig.competencies.length > 0 && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Compétences visées
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {aiConfig.competencies.map((competency: string) => (
                <Chip key={competency} label={competency} size="small" color="info" />
              ))}
            </Stack>
          </Card>
        )}

        {/* Niveaux de Bloom */}
        {aiConfig.bloomTaxonomyLevels && aiConfig.bloomTaxonomyLevels.length > 0 && (
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Niveaux cognitifs (Bloom)
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {aiConfig.bloomTaxonomyLevels.map((level: string) => (
                <Chip key={level} label={level} size="small" variant="outlined" />
              ))}
            </Stack>
          </Card>
        )}
      </Box>
    );
  };

  const renderQuestions = () => (
    <Box>
      {/* Statistiques des questions */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Vue d&apos;ensemble des questions
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {questionStats.total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {totalPoints}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Points
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {exercise.estimatedDuration}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Minutes
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {Math.round(totalPoints / questionStats.total) || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pts/Q moy.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Répartition par difficulté */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Répartition par difficulté
        </Typography>

        {Object.entries(questionStats.byDifficulty).map(([difficulty, count]) => {
          const percentage =
            questionStats.total > 0 ? ((count as number) / questionStats.total) * 100 : 0;
          return (
            <Box key={difficulty} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {difficulty === 'easy'
                    ? 'Facile'
                    : difficulty === 'medium'
                      ? 'Moyen'
                      : 'Difficile'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {count as number} ({Math.round(percentage)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(
                    difficultyColors[difficulty as keyof typeof difficultyColors],
                    0.1
                  ),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: difficultyColors[difficulty as keyof typeof difficultyColors],
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          );
        })}
      </Card>

      {/* Répartition par type */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Types de questions
        </Typography>

        <Stack spacing={1}>
          {Object.entries(questionStats.byType).map(([type, count]) => (
            <Box
              key={type}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: typeColors[type as keyof typeof typeColors] || theme.palette.grey[400],
                  }}
                />
                <Typography variant="body2">
                  {type === 'multiple_choice'
                    ? 'Choix multiples'
                    : type === 'true_false'
                      ? 'Vrai/Faux'
                      : type === 'short_answer'
                        ? 'Réponse courte'
                        : type === 'long_answer'
                          ? 'Réponse longue'
                          : type === 'fill_blanks'
                            ? 'Texte à trous'
                            : type === 'matching'
                              ? 'Correspondance'
                              : type}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {count as number}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Liste des questions */}
      {questions.length > 0 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Aperçu des questions
          </Typography>

          <List disablePadding>
            {questions.slice(0, 5).map((question: any, index: number) => (
              <ListItem key={question.id} divider={index < Math.min(4, questions.length - 1)}>
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.75rem',
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={question.title}
                  secondary={`${question.points} points • ${question.difficulty}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Chip
                  label={question.type}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </ListItem>
            ))}

            {questions.length > 5 && (
              <ListItem>
                <ListItemText
                  primary={`Et ${questions.length - 5} autres questions...`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'text.secondary',
                    fontStyle: 'italic',
                  }}
                />
              </ListItem>
            )}
          </List>
        </Card>
      )}
    </Box>
  );

  const renderConfiguration = () => (
    <Box>
      {/* Paramètres généraux */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Paramètres de l&apos;exercice
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Tentatives autorisées
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {exercise.config.allowRetries
                ? `${exercise.config.maxRetries || 'Illimitées'} tentatives`
                : 'Une seule tentative'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Score de réussite requis
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {exercise.config.passingScore}%
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Temps limite
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {exercise.config.timeLimit ? `${exercise.config.timeLimit} minutes` : 'Aucune limite'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Difficulté globale
            </Typography>
            <Chip
              label={
                exercise.difficulty === 'easy'
                  ? 'Facile'
                  : exercise.difficulty === 'medium'
                    ? 'Moyen'
                    : 'Difficile'
              }
              size="small"
              sx={{
                bgcolor: `${difficultyColors[exercise.difficulty]}20`,
                color: difficultyColors[exercise.difficulty],
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Options activées */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Fonctionnalités activées
        </Typography>

        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FontAwesomeIcon
              icon={exercise.config.showCorrectAnswers ? faCheckCircle : faExclamationTriangle}
              color={
                exercise.config.showCorrectAnswers
                  ? theme.palette.success.main
                  : theme.palette.warning.main
              }
            />
            <Typography variant="body2">Affichage des corrections</Typography>
            <Chip
              label={exercise.config.showCorrectAnswers ? 'Activé' : 'Désactivé'}
              size="small"
              color={exercise.config.showCorrectAnswers ? 'success' : 'default'}
            />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <FontAwesomeIcon
              icon={exercise.config.enableHints ? faLightbulb : faExclamationTriangle}
              color={
                exercise.config.enableHints
                  ? theme.palette.success.main
                  : theme.palette.warning.main
              }
            />
            <Typography variant="body2">Indices d&apos;aide</Typography>
            <Chip
              label={exercise.config.enableHints ? 'Activé' : 'Désactivé'}
              size="small"
              color={exercise.config.enableHints ? 'success' : 'default'}
            />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <FontAwesomeIcon
              icon={exercise.config.shuffleQuestions ? faCheckCircle : faExclamationTriangle}
              color={
                exercise.config.shuffleQuestions
                  ? theme.palette.success.main
                  : theme.palette.warning.main
              }
            />
            <Typography variant="body2">Mélange des questions</Typography>
            <Chip
              label={exercise.config.shuffleQuestions ? 'Activé' : 'Désactivé'}
              size="small"
              color={exercise.config.shuffleQuestions ? 'success' : 'default'}
            />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <FontAwesomeIcon
              icon={exercise.config.enableExplanations ? faCheckCircle : faExclamationTriangle}
              color={
                exercise.config.enableExplanations
                  ? theme.palette.success.main
                  : theme.palette.warning.main
              }
            />
            <Typography variant="body2">Explications détaillées</Typography>
            <Chip
              label={exercise.config.enableExplanations ? 'Activé' : 'Désactivé'}
              size="small"
              color={exercise.config.enableExplanations ? 'success' : 'default'}
            />
          </Stack>
        </Stack>
      </Card>

      {/* Ressources (pour les exercices manuels) */}
      {exercise.mode === 'manual' && (exercise as any).resources && (
        <Card sx={{ p: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Ressources pédagogiques
          </Typography>

          {(exercise as any).resources.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Aucune ressource attachée
            </Typography>
          ) : (
            <List disablePadding>
              {(exercise as any).resources.map((resource: any, index: number) => (
                <ListItem
                  key={resource.id}
                  divider={index < (exercise as any).resources.length - 1}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faFileAlt} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary={resource.name}
                    secondary={resource.type}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Card>
      )}
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '70%', md: '60%', lg: '50%' },
          maxWidth: 900,
          p: 0,
          boxShadow: theme.customShadows?.z24,
        },
      }}
    >
      {/* En-tête avec gradient */}
      <Box
        component={m.div}
        initial="initial"
        animate="animate"
        variants={varFade().in}
        sx={{
          p: 3,
          pb: 2,
          position: 'relative',
          background: `linear-gradient(135deg, ${
            isAiGenerated ? theme.palette.secondary.main : theme.palette.primary.main
          } 0%, ${isAiGenerated ? theme.palette.secondary.dark : theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: alpha('#fff', 0.2),
              color: 'white',
              backdropFilter: 'blur(10px)',
            }}
          >
            <FontAwesomeIcon icon={isAiGenerated ? faRobot : faFileAlt} size="lg" />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {exercise.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<FontAwesomeIcon icon={isAiGenerated ? faRobot : faUser} />}
                label={isAiGenerated ? 'IA' : 'Manuel'}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                label={exercise.status === 'published' ? 'Publié' : 'Brouillon'}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Stack>
          </Box>
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {onPreview && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<FontAwesomeIcon icon={faEye} />}
              onClick={onPreview}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Aperçu
            </Button>
          )}

          {onExport && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<FontAwesomeIcon icon={faDownload} />}
              onClick={onExport}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Exporter
            </Button>
          )}

          {onEdit && (
            <Button
              variant="contained"
              size="small"
              startIcon={<FontAwesomeIcon icon={faEdit} />}
              onClick={onEdit}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Modifier
            </Button>
          )}
        </Stack>
      </Box>

      {/* Navigation par onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab
            icon={<FontAwesomeIcon icon={faFileAlt} />}
            label="Informations"
            iconPosition="start"
          />
          {isAiGenerated && (
            <Tab icon={<FontAwesomeIcon icon={faRobot} />} label="IA" iconPosition="start" />
          )}
          <Tab
            icon={<FontAwesomeIcon icon={faQuestionCircle} />}
            label="Questions"
            iconPosition="start"
          />
          <Tab icon={<FontAwesomeIcon icon={faCog} />} label="Configuration" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={activeTab} index={0}>
          {renderBasicInfo()}
        </TabPanel>

        {isAiGenerated && (
          <TabPanel value={activeTab} index={1}>
            {renderAiInfo()}
          </TabPanel>
        )}

        <TabPanel value={activeTab} index={isAiGenerated ? 2 : 1}>
          {renderQuestions()}
        </TabPanel>

        <TabPanel value={activeTab} index={isAiGenerated ? 3 : 2}>
          {renderConfiguration()}
        </TabPanel>
      </Box>
    </Drawer>
  );
};

export default EnhancedExerciseDetailDrawer;
