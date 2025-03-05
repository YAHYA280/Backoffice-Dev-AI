'use client';

import React, { ReactNode, useState } from 'react';
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
  Tabs,
  Tab,
  SxProps,
  Theme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AssignmentIcon from '@mui/icons-material/Assignment';

/* -------------------------------------------------------------------
   1) If you have Exercice in ../view/apprentissage-view, import it.
   Otherwise, define it inline here as shown.
------------------------------------------------------------------- */
export interface Exercice {
  id: number;
  titre: string;
  dateCreation: string;
  description?: string;
  ressources?: string;
  configuration?: string;
  planification?: string;
}

type ExerciceDetailsProps = {
  exercice: Exercice;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  open: boolean;
  chapitreColor: string;
};

// -------------------------------------------------------------------
// 2) Create two custom components: GridContainer and GridItem
//    to mimic the MUI Grid container & item usage.
// -------------------------------------------------------------------
type GridContainerProps = {
  children: ReactNode;
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
  children: ReactNode;
  xs?: number; // from 1 to 12
  sm?: number;
  md?: number;
  sx?: SxProps<Theme>;
};

function GridItem({ children, xs, sm, md, sx }: GridItemProps) {
  // Convert MUI grid columns to a percentage width
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
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

// -------------------------------------------------------------------
// 3) Main Component
// -------------------------------------------------------------------
export default function ExerciceDetails({
  exercice,
  onEdit,
  onDelete,
  onBack,
  open,
  chapitreColor,
}: ExerciceDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
                {exercice.titre}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <CalendarTodayIcon style={{ marginRight: '8px', fontSize: '0.875rem' }} />
                <Typography variant="subtitle2">Créé le {exercice.dateCreation}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<InfoIcon />} label="Détails" sx={{ textTransform: 'none' }} />
            {exercice.ressources && (
              <Tab icon={<AttachFileIcon />} label="Ressources" sx={{ textTransform: 'none' }} />
            )}
            {exercice.configuration && (
              <Tab icon={<SettingsIcon />} label="Config" sx={{ textTransform: 'none' }} />
            )}
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
          {/* Details Tab */}
          {tabValue === 0 && (
            <>
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
                <Typography variant="body1">{exercice.description}</Typography>
              </Paper>

              {/* Statistiques fictives */}
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <GridContainer spacing={2}>
                <GridItem xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: chapitreColor }}>
                      15
                    </Typography>
                    <Typography variant="body2">Questions</Typography>
                  </Paper>
                </GridItem>
                <GridItem xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: chapitreColor }}>
                      25
                    </Typography>
                    <Typography variant="body2">Min. estimées</Typography>
                  </Paper>
                </GridItem>
                <GridItem xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      80%
                    </Typography>
                    <Typography variant="body2">Taux de réussite</Typography>
                  </Paper>
                </GridItem>
                <GridItem xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      42
                    </Typography>
                    <Typography variant="body2">Tentatives</Typography>
                  </Paper>
                </GridItem>
              </GridContainer>
            </>
          )}

          {/* Resources Tab */}
          {tabValue === 1 && exercice.ressources && (
            <>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachFileIcon style={{ marginRight: '8px' }} />
                Ressources
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1">{exercice.ressources}</Typography>
              </Paper>
            </>
          )}

          {/* Configuration Tab */}
          {tabValue === 2 && exercice.configuration && (
            <>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon style={{ marginRight: '8px' }} />
                Configuration
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1">{exercice.configuration}</Typography>
              </Paper>

              {exercice.planification && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', mt: 3 }}
                  >
                    <CalendarTodayIcon style={{ marginRight: '8px' }} />
                    Planification
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1">{exercice.planification}</Typography>
                  </Paper>
                </>
              )}
            </>
          )}
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
              startIcon={<PlayArrowIcon />}
              onClick={() => {}}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                bgcolor: chapitreColor,
                '&:hover': { bgcolor: `${chapitreColor}dd` },
              }}
            >
              Commencer l'exercice
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
                  '&:hover': { borderColor: `${chapitreColor}dd` },
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
