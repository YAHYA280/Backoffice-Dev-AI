// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/shared/CreationLayout.tsx

'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faEye,
  faRobot,
  faUser,
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Stack,
  Button,
  useTheme,
  Container,
  Typography,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  LinearProgress,
  Alert,
  Chip,
  Badge,
  Tooltip,
  alpha,
} from '@mui/material';

import type { CreationMode } from '../../types/exercise-types';

interface CreationLayoutProps {
  mode: CreationMode;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
  progress?: number;
  children: ReactNode;
  actions?: {
    onBack?: () => void;
    onSave?: () => void;
    onPreview?: () => void;
    onCancel?: () => void;
    isSaving?: boolean;
    canSave?: boolean;
    customActions?: ReactNode;
  };
  showProgress?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  sx?: any;
  hasUnsavedChanges?: boolean;
  errors?: Record<string, string>;
  warnings?: Record<string, string>;
}

const CreationLayout: React.FC<CreationLayoutProps> = ({
  mode,
  title,
  subtitle,
  breadcrumbs,
  progress,
  children,
  actions,
  showProgress = true,
  maxWidth = 'xl',
  sx,
  hasUnsavedChanges = false,
  errors = {},
  warnings = {},
}) => {
  const theme = useTheme();

  const getModeConfig = () => {
    if (mode === 'ai') {
      return {
        color: theme.palette.secondary.main,
        lightColor: theme.palette.secondary.light,
        lighterColor: alpha(theme.palette.secondary.main, 0.1),
        gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
        icon: faRobot,
        label: 'Génération IA',
        description: 'Assisté par intelligence artificielle',
      };
    }
    return {
      color: theme.palette.primary.main,
      lightColor: theme.palette.primary.light,
      lighterColor: alpha(theme.palette.primary.main, 0.1),
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      icon: faUser,
      label: 'Création manuelle',
      description: 'Contrôle total du contenu',
    };
  };

  const modeConfig = getModeConfig();
  const hasErrors = Object.keys(errors).length > 0;
  const hasWarnings = Object.keys(warnings).length > 0;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: 'easeOut',
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

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${modeConfig.lighterColor} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
        ...sx,
      }}
    >
      <Container maxWidth={maxWidth} sx={{ py: { xs: 2, md: 4 } }}>
        <m.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Enhanced Header */}
          <m.div variants={headerVariants}>
            <Card
              sx={{
                mb: 3,
                overflow: 'hidden',
                background: modeConfig.gradient,
                color: 'white',
                boxShadow: theme.customShadows?.z16,
                borderRadius: 3,
              }}
            >
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <Breadcrumbs
                    separator="›"
                    sx={{
                      mb: 2,
                      '& .MuiBreadcrumbs-separator': {
                        color: alpha('#fff', 0.7),
                      },
                    }}
                  >
                    {breadcrumbs.map((crumb, index) => (
                      <MuiLink
                        key={index}
                        component="button"
                        variant="body2"
                        onClick={crumb.onClick}
                        sx={{
                          color: index === breadcrumbs.length - 1 ? 'white' : alpha('#fff', 0.8),
                          textDecoration: 'none',
                          fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                          '&:hover': {
                            textDecoration: 'underline',
                            color: 'white',
                          },
                        }}
                      >
                        {crumb.label}
                      </MuiLink>
                    ))}
                  </Breadcrumbs>
                )}

                {/* Main Header Content */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      {/* Back Button */}
                      {actions?.onBack && (
                        <IconButton
                          onClick={actions.onBack}
                          sx={{
                            bgcolor: alpha('#fff', 0.15),
                            color: 'white',
                            '&:hover': {
                              bgcolor: alpha('#fff', 0.25),
                              transform: 'translateX(-2px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </IconButton>
                      )}

                      {/* Mode Badge */}
                      <Chip
                        icon={<FontAwesomeIcon icon={modeConfig.icon} />}
                        label={modeConfig.label}
                        sx={{
                          bgcolor: alpha('#fff', 0.2),
                          color: 'white',
                          fontWeight: 'bold',
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />

                      {/* Unsaved Changes Badge */}
                      {hasUnsavedChanges && (
                        <Chip
                          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
                          label="Non sauvegardé"
                          size="small"
                          sx={{
                            bgcolor: theme.palette.warning.main,
                            color: 'white',
                            fontWeight: 'medium',
                          }}
                        />
                      )}
                    </Stack>

                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{
                        mb: 1,
                        fontSize: { xs: '1.75rem', md: '2.5rem' },
                        background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {title}
                    </Typography>

                    {subtitle && (
                      <Typography
                        variant="h6"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 400,
                          fontSize: { xs: '1rem', md: '1.125rem' },
                        }}
                      >
                        {subtitle}
                      </Typography>
                    )}

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        opacity: 0.8,
                        fontSize: '0.875rem',
                      }}
                    >
                      {modeConfig.description}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                    {actions?.onPreview && (
                      <Button
                        variant="outlined"
                        startIcon={<FontAwesomeIcon icon={faEye} />}
                        onClick={actions.onPreview}
                        sx={{
                          color: 'white',
                          borderColor: alpha('#fff', 0.5),
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: alpha('#fff', 0.1),
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Aperçu
                      </Button>
                    )}

                    {actions?.onSave && (
                      <Badge badgeContent={hasUnsavedChanges ? '!' : null} color="warning">
                        <Button
                          variant="contained"
                          startIcon={
                            actions.isSaving ? (
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  border: '2px solid currentColor',
                                  borderTop: '2px solid transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 1s linear infinite',
                                  '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                  },
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon icon={faSave} />
                            )
                          }
                          onClick={actions.onSave}
                          disabled={!actions.canSave || actions.isSaving}
                          sx={{
                            bgcolor: alpha('#fff', 0.2),
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: alpha('#fff', 0.3),
                              transform: 'translateY(-1px)',
                            },
                            '&:disabled': {
                              bgcolor: alpha('#fff', 0.1),
                              color: alpha('#fff', 0.5),
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {actions.isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                      </Badge>
                    )}

                    {actions?.customActions}
                  </Stack>
                </Box>
              </Box>

              {/* Enhanced Progress Bar */}
              {showProgress && typeof progress === 'number' && (
                <Box sx={{ px: { xs: 2, md: 4 }, pb: 2 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Progression de la création
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(progress)}%
                      </Typography>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 12,
                          borderRadius: 6,
                          bgcolor: alpha('#fff', 0.2),
                          '& .MuiLinearProgress-bar': {
                            background:
                              'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                            borderRadius: 6,
                            boxShadow: '0 2px 8px rgba(255,255,255,0.3)',
                          },
                        }}
                      />

                      {/* Progress Glow Effect */}
                      {progress > 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: `${progress}%`,
                            height: 12,
                            borderRadius: 6,
                            background:
                              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                            animation: 'shimmer 2s infinite',
                            '@keyframes shimmer': {
                              '0%': { transform: 'translateX(-100%)' },
                              '100%': { transform: 'translateX(100%)' },
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Stack>
                </Box>
              )}
            </Card>
          </m.div>

          {/* Error and Warning Alerts */}
          <m.div variants={itemVariants}>
            {hasErrors && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  },
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Erreurs de validation détectées
                </Typography>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>
                      <Typography variant="body2">{error}</Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}

            {hasWarnings && !hasErrors && (
              <Alert
                severity="warning"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                  },
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Suggestions d'amélioration
                </Typography>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {Object.entries(warnings).map(([field, warning]) => (
                    <li key={field}>
                      <Typography variant="body2">{warning}</Typography>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </m.div>

          {/* Main Content */}
          <m.div variants={itemVariants}>
            <Card
              sx={{
                overflow: 'hidden',
                borderRadius: 3,
                boxShadow: theme.customShadows?.z16,
                border: hasErrors
                  ? `2px solid ${theme.palette.error.main}`
                  : hasWarnings
                    ? `2px solid ${theme.palette.warning.main}`
                    : `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.customShadows?.z20,
                },
              }}
            >
              {children}
            </Card>
          </m.div>

          {/* Bottom Actions */}
          {(actions?.onCancel || actions?.customActions) && (
            <m.div variants={itemVariants}>
              <Card
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  borderRadius: 2,
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box>
                    {actions?.onCancel && (
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={actions.onCancel}
                        disabled={actions?.isSaving}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {hasUnsavedChanges && (
                      <Tooltip title="Vous avez des modifications non sauvegardées">
                        <Chip
                          icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
                          label="Modifications non sauvegardées"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </Tooltip>
                    )}

                    {actions?.customActions}
                  </Box>
                </Stack>
              </Card>
            </m.div>
          )}
        </m.div>
      </Container>
    </Box>
  );
};

export default CreationLayout;
