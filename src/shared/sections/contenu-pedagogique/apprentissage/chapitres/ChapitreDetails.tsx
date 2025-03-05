'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Stack,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  LinearProgress,
  Tooltip,
  SxProps,
  Theme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InfoIcon from '@mui/icons-material/Info';
import LockIcon from '@mui/icons-material/Lock';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * If you have the Chapitre interface in '../view/apprentissage-view',
 * you can import from there:
 *    import { Chapitre } from '../view/apprentissage-view';
 *
 * Otherwise, define your Chapitre type here, for example:
 */
export interface Chapitre {
  id: number;
  nom: string;
  description: string;
  difficulte: string;
  ordre: number;
  conditionsAcces?: string;
  dateCreation: string;
}

type ChapitreDetailsProps = {
  chapitre: Chapitre;
  onEdit: () => void;
  onDelete: () => void;
  onManageExercices: () => void;
  onBack: () => void;
  open: boolean;
};

/* ---------------------------------------------
   1) Create two small components for "Grid"
      to mimic <Grid container> and <Grid item>.
--------------------------------------------- */
type GridContainerProps = {
  children: React.ReactNode;
  spacing?: number;
  sx?: SxProps<Theme>;
};

function GridContainer({ children, spacing = 0, sx }: GridContainerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: (theme) => theme.spacing(-(spacing / 2)),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

type GridItemProps = {
  children: React.ReactNode;
  xs?: number; // 1 to 12
  sm?: number; // 1 to 12
  md?: number; // 1 to 12
  sx?: SxProps<Theme>;
};

function GridItem({ children, xs, sm, md, sx }: GridItemProps) {
  // Convert MUI grid columns to a percentage
  const getWidth = (value: number | undefined) => (value ? `${(value / 12) * 100}%` : '100%');

  return (
    <Box
      sx={{
        width: getWidth(xs),
        padding: (theme) => theme.spacing(1),
        '@media (min-width:600px)': { width: getWidth(sm) },
        '@media (min-width:900px)': { width: getWidth(md) },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/* ---------------------------------------------
   2) Main ChapitreDetails component
--------------------------------------------- */
export default function ChapitreDetails({
  chapitre,
  onEdit,
  onDelete,
  onManageExercices,
  onBack,
  open,
}: ChapitreDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper: get color by difficulty
  const getDifficultyColor = (difficulte: string) => {
    const diffLower = difficulte.toLowerCase();
    if (diffLower.includes('facile')) return '#4CAF50';
    if (diffLower.includes('moyen')) return '#FF9800';
    if (diffLower.includes('difficile')) return '#F44336';
    return '#2196F3';
  };
  const chapitreColor = getDifficultyColor(chapitre.difficulte);

  // Helper: darken a color slightly
  const darkenColor = (color: string, amount: number) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const rgb = hexToRgb(color);
    if (!rgb) return color;

    const darken = (c: number) => Math.max(0, Math.floor(c * (1 - amount)));
    return `rgb(${darken(rgb.r)}, ${darken(rgb.g)}, ${darken(rgb.b)})`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="persistent"
      sx={{
        width: { xs: '100%', sm: 450 },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 450 },
          boxSizing: 'border-box',
          p: 0,
          height: '100%',
          border: 'none',
          boxShadow: '-4px 0px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: chapitreColor,
            color: 'white',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={onBack}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                mr: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box>
              <Typography variant="h6" component="h2">
                {chapitre.nom}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <CalendarTodayIcon style={{ marginRight: '8px', fontSize: '0.875rem' }} />
                <Typography variant="subtitle2">Créé le {chapitre.dateCreation}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
          <GridContainer spacing={3}>
            {/* Description section */}
            <GridItem xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon style={{ marginRight: '8px' }} />
                Description
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography variant="body1">{chapitre.description}</Typography>
              </Paper>
            </GridItem>

            {/* Details section */}
            <GridItem xs={12}>
              <Typography variant="h6" gutterBottom>
                Détails
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <GridContainer spacing={2}>
                  <GridItem xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Difficulté
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <FlagIcon
                        style={{
                          marginRight: '8px',
                          color: chapitreColor,
                        }}
                      />
                      <Typography variant="body1">{chapitre.difficulte}</Typography>
                    </Box>
                  </GridItem>
                  <GridItem xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Ordre
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <BookmarkIcon
                        style={{
                          marginRight: '8px',
                          color: chapitreColor,
                        }}
                      />
                      <Typography variant="body1">{chapitre.ordre}</Typography>
                    </Box>
                  </GridItem>
                </GridContainer>
              </Paper>
            </GridItem>

            {/* Conditions d'accès */}
            {chapitre.conditionsAcces && (
              <GridItem xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <LockIcon
                    style={{
                      marginRight: '8px',
                    }}
                  />
                  Conditions d'accès
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    mb: 3,
                  }}
                >
                  <Typography variant="body1">{chapitre.conditionsAcces}</Typography>
                </Paper>
              </GridItem>
            )}

            {/* Statistiques section */}
            <GridItem xs={12}>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <GridContainer spacing={2}>
                  <GridItem xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progression des exercices
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ width: '40px' }}>
                        75%
                      </Typography>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={75}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: `${chapitreColor}40`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: chapitreColor,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </GridItem>
                  <GridItem xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color: chapitreColor }}>
                        8
                      </Typography>
                      <Typography variant="body2">Exercices</Typography>
                    </Box>
                  </GridItem>
                  <GridItem xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color: chapitreColor }}>
                        45
                      </Typography>
                      <Typography variant="body2">Minutes estimées</Typography>
                    </Box>
                  </GridItem>
                </GridContainer>
              </Paper>
            </GridItem>
          </GridContainer>
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<FormatListBulletedIcon />}
              onClick={onManageExercices}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                bgcolor: chapitreColor,
                '&:hover': { bgcolor: darkenColor(chapitreColor, 0.2) },
              }}
            >
              Gérer les Exercices
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                onClick={onEdit}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  borderColor: chapitreColor,
                  color: chapitreColor,
                  '&:hover': { borderColor: darkenColor(chapitreColor, 0.2) },
                }}
              >
                Modifier
              </Button>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                size={isMobile ? 'small' : 'medium'}
              >
                Supprimer
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
