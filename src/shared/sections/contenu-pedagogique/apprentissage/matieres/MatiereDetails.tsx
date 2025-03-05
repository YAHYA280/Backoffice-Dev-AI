'use client';

import React, { ReactNode } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  Drawer,
  SxProps,
  Theme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';

/* ------------------------------------------------------------------
   1) If you do NOT have a real matiere-utils.ts, define inline below.
   Otherwise, remove these and import from '../utils/matiere-utils'
------------------------------------------------------------------ */
export interface Matiere {
  id: number;
  nom: string;
  description: string;
  dateCreation: string;
  couleur?: string;
  icone?: string;
}
export function getIconForMatiere(nom: string) {
  return <InfoIcon />; // Minimal placeholder; replace with your logic
}
export function getColorForMatiere(matiere: Matiere) {
  return matiere.couleur ?? '#607D8B'; // minimal placeholder
}

/* ------------------------------------------------------------------
   2) Create two custom components for "GridContainer" & "GridItem"
   that accept spacing, sx, and breakpoints.
------------------------------------------------------------------ */
type GridContainerProps = {
  children: ReactNode;
  spacing?: number;
  /** Add optional sx for extra styling */
  sx?: SxProps<Theme>;
};

function GridContainer({ children, spacing = 0, sx }: GridContainerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: (theme) => theme.spacing(-(spacing / 2)),
        ...sx, // Merge in any extra styles from the sx prop
      }}
    >
      {children}
    </Box>
  );
}

type GridItemProps = {
  children: ReactNode;
  xs?: number; // 1 to 12
  sm?: number; // 1 to 12
  md?: number; // 1 to 12
  sx?: SxProps<Theme>;
};

function GridItem({ children, xs, sm, md, sx }: GridItemProps) {
  // Helper to convert MUI grid columns to a percentage (like 12-col layout)
  const getWidth = (val: number | undefined) => (val ? `${(val / 12) * 100}%` : '100%');

  return (
    <Box
      sx={{
        width: getWidth(xs),
        padding: (theme) => theme.spacing(1),
        '@media (min-width:600px)': {
          width: getWidth(sm),
        },
        '@media (min-width:900px)': {
          width: getWidth(md),
        },
        ...sx, // Merge in any extra styles from the sx prop
      }}
    >
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------
   3) Define your MatiereDetailsProps & Main Component
------------------------------------------------------------------ */
type MatiereDetailsProps = {
  matiere: Matiere;
  onEdit: () => void;
  onDelete: () => void;
  onManageChapitres: () => void;
  onBack: () => void;
  open: boolean;
};

export default function MatiereDetails({
  matiere,
  onEdit,
  onDelete,
  onManageChapitres,
  onBack,
  open,
}: MatiereDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const color = getColorForMatiere(matiere);

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
            bgcolor: color,
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
                {matiere.nom}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <CalendarTodayIcon style={{ marginRight: '8px', fontSize: '0.875rem' }} />
                <Typography variant="subtitle2">Créée le {matiere.dateCreation}</Typography>
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
                <Typography variant="body1">{matiere.description}</Typography>
              </Paper>
            </GridItem>

            {/* Style information */}
            <GridItem xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations
              </Typography>
              <GridContainer spacing={2} sx={{ mb: 3 }}>
                <GridItem xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Couleur
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: color,
                        mr: 1,
                      }}
                    />
                    <Typography>{matiere.couleur || 'Couleur par défaut'}</Typography>
                  </Box>
                </GridItem>

                <GridItem xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Icône
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: `${color}20`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                      }}
                    >
                      {getIconForMatiere(matiere.nom)}
                    </Box>
                    <Typography>{matiere.icone || 'Icône par défaut'}</Typography>
                  </Box>
                </GridItem>
              </GridContainer>
            </GridItem>

            {/* Statistics section */}
            <GridItem xs={12}>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <GridContainer spacing={2}>
                  <GridItem xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color }}>
                        3
                      </Typography>
                      <Typography variant="body2">Chapitres</Typography>
                    </Box>
                  </GridItem>
                  <GridItem xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color }}>
                        12
                      </Typography>
                      <Typography variant="body2">Exercices</Typography>
                    </Box>
                  </GridItem>
                  <GridItem xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color }}>
                        8
                      </Typography>
                      <Typography variant="body2">Ressources</Typography>
                    </Box>
                  </GridItem>
                  <GridItem xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" sx={{ color }}>
                        85%
                      </Typography>
                      <Typography variant="body2">Progression</Typography>
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
              onClick={onManageChapitres}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                bgcolor: color,
                '&:hover': { bgcolor: `${color}dd` },
              }}
            >
              Gérer les Chapitres
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                onClick={onEdit}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  borderColor: color,
                  color: color,
                  '&:hover': { borderColor: `${color}dd` },
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
