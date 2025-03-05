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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import CommentIcon from '@mui/icons-material/Comment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import { Niveau } from '../view/apprentissage-view';

// -- 1) Define two custom components for "container" and "item" layout. --
function GridContainer({ children, spacing = 0 }: { children: ReactNode; spacing?: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: (theme) => theme.spacing(-(spacing / 2)),
      }}
    >
      {children}
    </Box>
  );
}

function GridItem({
  children,
  xs,
  sm,
  md,
}: {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
}) {
  // Convert MUI grid columns to a percentage width
  const getWidth = (value: number | undefined) => (value ? `${(value / 12) * 100}%` : '100%');

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
      }}
    >
      {children}
    </Box>
  );
}

// -- 2) Define your component props. --
type NiveauDetailsProps = {
  niveau: Niveau;
  onEdit: () => void;
  onDelete: () => void;
  onManageMatieres: () => void;
  onBack: () => void;
  open: boolean;
};

// -- 3) Main component. --
export default function NiveauDetails({
  niveau,
  onEdit,
  onDelete,
  onManageMatieres,
  onBack,
  open,
}: NiveauDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            bgcolor: 'primary.main',
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
                {niveau.nom}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <CalendarTodayIcon style={{ marginRight: '8px', fontSize: '0.875rem' }} />
                <Typography variant="subtitle2">Créé le {niveau.dateCreation}</Typography>
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
                <Typography variant="body1">{niveau.description}</Typography>
              </Paper>
            </GridItem>

            {/* Observation section (if any) */}
            {niveau.observation && (
              <GridItem xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <CommentIcon style={{ marginRight: '8px' }} />
                  Observations
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
                  <Typography variant="body1">{niveau.observation}</Typography>
                </Paper>
              </GridItem>
            )}

            {/* Statistics section */}
            <GridItem xs={12}>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <GridContainer spacing={2}>
                  <GridItem xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" color="primary.main">
                        4
                      </Typography>
                      <Typography variant="body2">Matières</Typography>
                    </Box>
                  </GridItem>
                  <GridItem xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" color="primary.main">
                        25
                      </Typography>
                      <Typography variant="body2">Élèves</Typography>
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
              onClick={onManageMatieres}
              size={isMobile ? 'small' : 'medium'}
            >
              Gérer les Matières
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                onClick={onEdit}
                size={isMobile ? 'small' : 'medium'}
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
