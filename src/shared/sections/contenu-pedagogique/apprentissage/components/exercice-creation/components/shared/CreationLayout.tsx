// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/shared/CreationLayout.tsx

'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faEye } from '@fortawesome/free-solid-svg-icons';

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
  maxWidth = 'lg',
  sx,
}) => {
  const theme = useTheme();

  const getModeColor = () =>
    mode === 'ai' ? theme.palette.secondary.main : theme.palette.primary.main;

  const getModeGradient = () =>
    mode === 'ai'
      ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth={maxWidth} sx={{ py: 3, ...sx }}>
      <m.div variants={containerVariants} initial="hidden" animate="visible">
        {/* En-tête avec breadcrumbs */}
        <m.div variants={itemVariants}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumbs separator="›">
                {breadcrumbs.map((crumb, index) => (
                  <MuiLink
                    key={index}
                    component="button"
                    variant="body2"
                    color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                    onClick={crumb.onClick}
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {crumb.label}
                  </MuiLink>
                ))}
              </Breadcrumbs>
            )}

            {/* Titre principal */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Bouton retour */}
                  {actions?.onBack && (
                    <IconButton
                      onClick={actions.onBack}
                      sx={{
                        bgcolor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          bgcolor: getModeColor(),
                          color: 'white',
                        },
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                    </IconButton>
                  )}

                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: getModeGradient(),
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5,
                      }}
                    >
                      {title}
                    </Typography>

                    {subtitle && (
                      <Typography variant="body1" color="text.secondary">
                        {subtitle}
                      </Typography>
                    )}

                    {/* Badge du mode */}
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        mt: 1,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        bgcolor:
                          mode === 'ai'
                            ? theme.palette.secondary.lighter
                            : theme.palette.primary.lighter,
                        color: getModeColor(),
                        fontSize: '0.875rem',
                        fontWeight: 'medium',
                      }}
                    >
                      {mode === 'ai' ? '🤖 Mode IA' : '✋ Mode Manuel'}
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Actions principales */}
              <Stack direction="row" spacing={1}>
                {actions?.onPreview && (
                  <Button
                    variant="outlined"
                    startIcon={<FontAwesomeIcon icon={faEye} />}
                    onClick={actions.onPreview}
                    sx={{ minWidth: 120 }}
                  >
                    Aperçu
                  </Button>
                )}

                {actions?.onSave && (
                  <Button
                    variant="contained"
                    startIcon={<FontAwesomeIcon icon={faSave} />}
                    onClick={actions.onSave}
                    disabled={!actions.canSave || actions.isSaving}
                    sx={{
                      minWidth: 120,
                      bgcolor: getModeColor(),
                      '&:hover': {
                        bgcolor:
                          mode === 'ai' ? theme.palette.secondary.dark : theme.palette.primary.dark,
                      },
                    }}
                  >
                    {actions.isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                )}

                {actions?.customActions}
              </Stack>
            </Box>
          </Stack>
        </m.div>

        {/* Barre de progression */}
        {showProgress && typeof progress === 'number' && (
          <m.div variants={itemVariants}>
            <Card
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Progression de la création
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {Math.round(progress)}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      background: getModeGradient(),
                      borderRadius: 4,
                    },
                  }}
                />
              </Stack>
            </Card>
          </m.div>
        )}

        {/* Contenu principal */}
        <m.div variants={itemVariants}>
          <Card
            sx={{
              overflow: 'hidden',
              borderRadius: 3,
              boxShadow: theme.customShadows?.z16,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {children}
          </Card>
        </m.div>

        {/* Actions en bas de page */}
        {(actions?.onCancel || actions?.customActions) && (
          <m.div variants={itemVariants}>
            <Card
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <Box>
                  {actions?.onCancel && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={actions.onCancel}
                      disabled={actions?.isSaving}
                    >
                      Annuler
                    </Button>
                  )}
                </Box>

                <Box>{actions?.customActions}</Box>
              </Stack>
            </Card>
          </m.div>
        )}
      </m.div>
    </Container>
  );
};

export default CreationLayout;
