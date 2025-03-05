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
  Badge,
  LinearProgress,
  Drawer,
  alpha, // Import alpha for color manipulation
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPencilAlt,
  faTrashAlt,
  faCalendarAlt,
  faInfoCircle,
  faList,
  faBookmark,
  faFlag,
  faClock,
  faClipboard,
  faGraduationCap,
  faBook,
  faLock,
  faLockOpen,
} from '@fortawesome/free-solid-svg-icons';

import { Chapitre } from '../view/apprentissage-view';

type ChapitreDetailsProps = {
  chapitre: Chapitre;
  onEdit: () => void;
  onDelete: () => void;
  onManageExercices: () => void;
  onBack: () => void;
};

export default function ChapitreDetails({
  chapitre,
  onEdit,
  onDelete,
  onManageExercices,
  onBack,
}: ChapitreDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Helper function to darken a color (replacement for theme.palette.darken)
  const darkenColor = (color: string, amount: number) => {
    return alpha(color, 1 - amount);
  };

  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficulte: string) => {
    const diffLower = difficulte.toLowerCase();
    if (diffLower.includes('facile')) return '#4CAF50';
    if (diffLower.includes('moyen')) return '#FF9800';
    if (diffLower.includes('difficile')) return '#F44336';
    return '#2196F3';
  };

  const chapitreColor = getDifficultyColor(chapitre.difficulte);

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
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>

            <Box>
              <Typography variant="h6" component="h2">
                {chapitre.nom}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{ marginRight: '8px', fontSize: '0.875rem' }}
                />
                <Typography variant="subtitle2">Créé le {chapitre.dateCreation}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
          <Grid container spacing={3}>
            {/* Description section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
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
            </Grid>

            {/* Details section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Détails
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Difficulté
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <FontAwesomeIcon
                        icon={faFlag}
                        style={{
                          marginRight: '8px',
                          color: chapitreColor,
                        }}
                      />
                      <Typography variant="body1">{chapitre.difficulte}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Ordre
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <FontAwesomeIcon
                        icon={faBookmark}
                        style={{
                          marginRight: '8px',
                          color: chapitreColor,
                        }}
                      />
                      <Typography variant="body1">{chapitre.ordre}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Conditions d'accès */}
            {chapitre.conditionsAcces && (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <FontAwesomeIcon
                    icon={faLock}
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
              </Grid>
            )}

            {/* Statistiques section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" color={chapitreColor}>
                        8
                      </Typography>
                      <Typography variant="body2">Exercices</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h4" color={chapitreColor}>
                        45
                      </Typography>
                      <Typography variant="body2">Minutes estimées</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
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
              startIcon={<FontAwesomeIcon icon={faList} />}
              onClick={onManageExercices}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                bgcolor: chapitreColor,
                '&:hover': {
                  bgcolor: darkenColor(chapitreColor, 0.2),
                },
              }}
            >
              Gérer les Exercices
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faPencilAlt} />}
                onClick={onEdit}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  borderColor: chapitreColor,
                  color: chapitreColor,
                  '&:hover': {
                    borderColor: darkenColor(chapitreColor, 0.2),
                  },
                }}
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
