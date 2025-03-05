'use client';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Grid,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
  Chip,
  Drawer,
  Tab,
  Tabs,
} from '@mui/material';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPencilAlt,
  faTrashAlt,
  faCalendarAlt,
  faInfoCircle,
  faClipboard,
  faFileAlt,
  faCog,
  faClock,
  faLink,
  faPlay,
  faTasks,
  faPaperclip,
  faBookReader,
} from '@fortawesome/free-solid-svg-icons';

import { Exercice } from '../view/apprentissage-view';

type ExerciceDetailsProps = {
  exercice: Exercice;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ExerciceDetails({
  exercice,
  onEdit,
  onDelete,
  onBack,
}: ExerciceDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Drawer
      anchor="right"
      open={true}
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
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>

            <Box>
              <Typography variant="h6" component="h2">
                {exercice.titre}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{ marginRight: '8px', fontSize: '0.875rem' }}
                />
                <Typography variant="subtitle2">Créé le {exercice.dateCreation}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab
              icon={<FontAwesomeIcon icon={faInfoCircle} />}
              label="Détails"
              sx={{ textTransform: 'none' }}
            />
            {exercice.ressources && (
              <Tab
                icon={<FontAwesomeIcon icon={faPaperclip} />}
                label="Ressources"
                sx={{ textTransform: 'none' }}
              />
            )}
            {exercice.configuration && (
              <Tab
                icon={<FontAwesomeIcon icon={faCog} />}
                label="Config"
                sx={{ textTransform: 'none' }}
              />
            )}
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '8px' }} />
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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    15
                  </Typography>
                  <Typography variant="body2">Questions</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    25
                  </Typography>
                  <Typography variant="body2">Min. estimées</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    80%
                  </Typography>
                  <Typography variant="body2">Taux de réussite</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    42
                  </Typography>
                  <Typography variant="body2">Tentatives</Typography>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: '8px' }} />
              Ressources
            </Typography>

            {exercice.ressources ? (
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
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucune ressource disponible
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ressources suggérées
              </Typography>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    style={{ marginRight: '16px', color: theme.palette.primary.main }}
                  />
                  <Typography variant="body2">Document de cours (.pdf)</Typography>
                </Paper>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon
                    icon={faPlay}
                    style={{ marginRight: '16px', color: theme.palette.error.main }}
                  />
                  <Typography variant="body2">Vidéo explicative</Typography>
                </Paper>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <FontAwesomeIcon
                    icon={faLink}
                    style={{ marginRight: '16px', color: theme.palette.info.main }}
                  />
                  <Typography variant="body2">Lien vers des exercices interactifs</Typography>
                </Paper>
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} />
              Configuration
            </Typography>

            {exercice.configuration ? (
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
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucune configuration spécifique
              </Typography>
            )}

            {exercice.planification && (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', mt: 3 }}
                >
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
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
          </TabPanel>
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
              startIcon={<FontAwesomeIcon icon={faPlay} />}
              size={isMobile ? 'small' : 'medium'}
              color="primary"
            >
              Commencer l'exercice
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faPencilAlt} />}
                onClick={onEdit}
                size={isMobile ? 'small' : 'medium'}
              >
                Modifier
              </Button>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
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
