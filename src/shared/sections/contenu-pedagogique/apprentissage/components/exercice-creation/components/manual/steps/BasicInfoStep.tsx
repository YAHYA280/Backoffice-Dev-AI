// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/BasicInfoStep.tsx

'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faLightbulb,
  faTag,
  faClock,
  faGraduationCap,
  faBookOpen,
  faChartLine,
  faCheckCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  Chip,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  LinearProgress,
  Stack,
  Tooltip,
  IconButton,
  alpha,
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import type { CreationFormData, DifficultyLevel } from '../../../types/exercise-types';

interface BasicInfoStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const DIFFICULTY_OPTIONS = [
  {
    value: 'easy',
    label: 'Facile',
    description: 'Concepts de base et rappels',
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    icon: '🟢',
    estimatedTime: 10,
  },
  {
    value: 'medium',
    label: 'Moyen',
    description: 'Application et analyse',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: '🟠',
    estimatedTime: 20,
  },
  {
    value: 'hard',
    label: 'Difficile',
    description: 'Synthèse et évaluation',
    color: '#F44336',
    bgColor: '#FFEBEE',
    icon: '🔴',
    estimatedTime: 35,
  },
] as const;

const SUGGESTED_TAGS = [
  'grammaire',
  'conjugaison',
  'orthographe',
  'vocabulaire',
  'compréhension',
  'mathématiques',
  'algèbre',
  'géométrie',
  'statistiques',
  'probabilités',
  'sciences',
  'physique',
  'chimie',
  'biologie',
  'géologie',
  'histoire',
  'géographie',
  'littérature',
  'philosophie',
  'arts',
  'révision',
  'évaluation',
  'contrôle',
  'exercices',
  'quiz',
];

const SUBJECT_SUGGESTIONS = [
  'Français',
  'Mathématiques',
  'Sciences',
  'Histoire-Géographie',
  'Anglais',
  'Physique-Chimie',
  'SVT',
  'Philosophie',
  'Arts',
  'EPS',
  'Technologie',
  'Informatique',
];

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const fields = ['title', 'description', 'subject', 'difficulty'];
    const completed = fields.filter((field) => {
      const value = (data as any)[field];
      return value && String(value).trim().length > 0;
    }).length;
    return (completed / fields.length) * 100;
  };

  const completionPercentage = getCompletionPercentage();

  // Get difficulty config
  const selectedDifficulty = DIFFICULTY_OPTIONS.find((opt) => opt.value === data.difficulty);

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

  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {/* Header Section */}
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
              <FontAwesomeIcon icon={faInfoCircle} />
            </Avatar>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Informations de base
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Définissez les informations principales de votre exercice
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progression
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary.main">
                  {Math.round(completionPercentage)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  },
                }}
              />
            </Box>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Title Field */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  border: errors.title ? 2 : 1,
                  borderColor: errors.title
                    ? 'error.main'
                    : focusedField === 'title'
                      ? 'primary.main'
                      : 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: errors.title ? 'error.main' : 'primary.main',
                    boxShadow: theme.customShadows?.z8,
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FontAwesomeIcon icon={faBookOpen} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Titre de l'exercice *
                    </Typography>

                    <TextField
                      fullWidth
                      value={data.title}
                      onChange={(e) => onChange({ title: e.target.value })}
                      onFocus={() => setFocusedField('title')}
                      onBlur={() => setFocusedField(null)}
                      error={!!errors.title}
                      helperText={errors.title || `${data.title.length}/200 caractères`}
                      inputProps={{ maxLength: 200 }}
                      placeholder="Ex: Les verbes du premier groupe au présent"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />

                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<FontAwesomeIcon icon={faLightbulb} />}
                        label="Conseil: Soyez précis et engageant"
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/* Description Field */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  border: errors.description ? 2 : 1,
                  borderColor: errors.description
                    ? 'error.main'
                    : focusedField === 'description'
                      ? 'primary.main'
                      : 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: errors.description ? 'error.main' : 'primary.main',
                    boxShadow: theme.customShadows?.z8,
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: 'info.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Description *
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={data.description}
                      onChange={(e) => onChange({ description: e.target.value })}
                      onFocus={() => setFocusedField('description')}
                      onBlur={() => setFocusedField(null)}
                      error={!!errors.description}
                      helperText={
                        errors.description || `${data.description.length}/1000 caractères`
                      }
                      inputProps={{ maxLength: 1000 }}
                      placeholder="Décrivez les objectifs et le contenu de l'exercice..."
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/* Subject and Chapter */}
          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: 'success.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Matière
                    </Typography>

                    <Autocomplete
                      freeSolo
                      options={SUBJECT_SUGGESTIONS}
                      value={data.subject}
                      onChange={(_, newValue) => onChange({ subject: newValue || '' })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.subject}
                          helperText={errors.subject}
                          placeholder="Ex: Français, Mathématiques, Sciences..."
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: 'warning.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FontAwesomeIcon icon={faBookOpen} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Chapitre
                    </Typography>

                    <TextField
                      fullWidth
                      value={data.chapter}
                      disabled
                      placeholder="Défini automatiquement"
                      helperText="Le chapitre est défini automatiquement"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.grey[500], 0.05),
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/* Difficulty and Duration */}
          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: 'error.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Niveau de difficulté *
                    </Typography>

                    <FormControl fullWidth error={!!errors.difficulty}>
                      <Select
                        value={data.difficulty}
                        onChange={(e) =>
                          onChange({ difficulty: e.target.value as DifficultyLevel })
                        }
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                        }}
                        renderValue={(selected) => {
                          const option = DIFFICULTY_OPTIONS.find((opt) => opt.value === selected);
                          return option ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ fontSize: '1.2rem' }}>{option.icon}</Box>
                              <Typography fontWeight="medium">{option.label}</Typography>
                            </Box>
                          ) : (
                            selected
                          );
                        }}
                      >
                        {DIFFICULTY_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box
                              sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}
                            >
                              <Box sx={{ fontSize: '1.2rem' }}>{option.icon}</Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {option.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                              <Chip
                                label={`~${option.estimatedTime}min`}
                                size="small"
                                sx={{
                                  bgcolor: option.bgColor,
                                  color: option.color,
                                  fontWeight: 'medium',
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {selectedDifficulty && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`Temps estimé: ~${selectedDifficulty.estimatedTime} minutes`}
                          size="small"
                          sx={{
                            bgcolor: selectedDifficulty.bgColor,
                            color: selectedDifficulty.color,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: 'info.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FontAwesomeIcon icon={faClock} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Durée personnalisée
                    </Typography>

                    <TextField
                      fullWidth
                      type="number"
                      value={data.estimatedDuration}
                      onChange={(e) =>
                        onChange({
                          estimatedDuration: Math.max(1, parseInt(e.target.value, 10) || 1),
                        })
                      }
                      inputProps={{ min: 1, max: 300 }}
                      helperText="Entre 1 et 300 minutes"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            minutes
                          </Typography>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/* Enhanced Tags Section */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: 'secondary.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    <FontAwesomeIcon icon={faTag} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Mots-clés ({data.tags.length}/20)
                      </Typography>

                      <Tooltip title="Les mots-clés améliorent la découvrabilité de votre exercice">
                        <IconButton size="small">
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Autocomplete
                      multiple
                      freeSolo
                      options={SUGGESTED_TAGS}
                      value={data.tags}
                      onChange={(_, newValue) => {
                        const validTags = newValue.slice(0, 20);
                        onChange({ tags: validTags });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={data.tags.length === 0 ? 'Ajouter des mots-clés...' : ''}
                          helperText="Appuyez sur Entrée pour ajouter un mot-clé"
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option}
                            label={option}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                          />
                        ))
                      }
                      disabled={data.tags.length >= 20}
                    />

                    {data.tags.length === 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Suggestions populaires:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {SUGGESTED_TAGS.slice(0, 8).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              clickable
                              onClick={() => {
                                if (!data.tags.includes(tag) && data.tags.length < 20) {
                                  onChange({ tags: [...data.tags, tag] });
                                }
                              }}
                              sx={{
                                borderRadius: 2,
                                '&:hover': {
                                  bgcolor: 'primary.lighter',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/* Enhanced Summary */}
          <Grid item xs={12}>
            <m.div variants={cardVariants}>
              <Card
                sx={{
                  p: 4,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
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
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </Avatar>

                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      📋 Résumé des informations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vérifiez les détails de votre exercice
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Niveau
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {selectedDifficulty && (
                          <>
                            <Box sx={{ fontSize: '1.2rem' }}>{selectedDifficulty.icon}</Box>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedDifficulty.label}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Durée estimée
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ mt: 1 }}>
                        {data.estimatedDuration} min
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Mots-clés
                      </Typography>
                      <Typography variant="body2" fontWeight="medium" sx={{ mt: 1 }}>
                        {data.tags.length} ajoutés
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Progression
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={
                            completionPercentage === 100 ? faCheckCircle : faExclamationTriangle
                          }
                          color={
                            completionPercentage === 100
                              ? theme.palette.success.main
                              : theme.palette.warning.main
                          }
                        />
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={completionPercentage === 100 ? 'success.main' : 'warning.main'}
                        >
                          {completionPercentage === 100
                            ? '✓ Étape 1/4'
                            : `${Math.round(completionPercentage)}% complété`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Validation Status */}
                <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                  <List dense>
                    {[
                      { field: 'title', label: 'Titre', required: true },
                      { field: 'description', label: 'Description', required: true },
                      { field: 'subject', label: 'Matière', required: false },
                      { field: 'difficulty', label: 'Difficulté', required: true },
                    ].map((item) => {
                      const value = (data as any)[item.field];
                      const isValid = value && String(value).trim().length > 0;
                      const hasError = !!errors[item.field];

                      return (
                        <ListItem key={item.field} disablePadding sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <FontAwesomeIcon
                              icon={
                                hasError
                                  ? faExclamationTriangle
                                  : isValid
                                    ? faCheckCircle
                                    : faInfoCircle
                              }
                              color={
                                hasError
                                  ? theme.palette.error.main
                                  : isValid
                                    ? theme.palette.success.main
                                    : theme.palette.grey[400]
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                color={
                                  hasError
                                    ? 'error.main'
                                    : isValid
                                      ? 'success.main'
                                      : 'text.secondary'
                                }
                              >
                                {item.label} {item.required && '*'}
                              </Typography>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              </Card>
            </m.div>
          </Grid>
        </Grid>
      </Box>
    </m.div>
  );
};

export default BasicInfoStep;
