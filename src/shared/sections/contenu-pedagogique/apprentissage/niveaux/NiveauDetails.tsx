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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookIcon from '@mui/icons-material/Book';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import CommentIcon from '@mui/icons-material/Comment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupIcon from '@mui/icons-material/Group';

import { Niveau } from '../view/apprentissage-view';

type NiveauDetailsProps = {
  niveau: Niveau;
  onEdit: () => void;
  onDelete: () => void;
  onManageMatieres: () => void;
  onBack: () => void;
};

export default function NiveauDetails({
  niveau,
  onEdit,
  onDelete,
  onManageMatieres,
  onBack,
}: NiveauDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 2,
          position: 'relative',
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <IconButton
              onClick={onBack}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="h2">
              {niveau.nom}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <CalendarTodayIcon fontSize="small" sx={{ mr: 1, fontSize: '0.875rem' }} />
              <Typography variant="subtitle2">Créé le {niveau.dateCreation}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <Grid container spacing={0}>
          {/* Left side - Details */}
          <Grid item xs={12} md={8} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} fontSize="small" />
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

            {niveau.observation && (
              <>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <CommentIcon sx={{ mr: 1 }} fontSize="small" />
                  Observations
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1">{niveau.observation}</Typography>
                </Paper>
              </>
            )}
          </Grid>

          {/* Right side - Actions */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderLeft: { xs: 'none', md: '1px solid' },
              borderColor: 'divider',
              bgcolor: 'background.default',
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>

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
            </Stack>

            {/* Additional info cards */}
            <Box sx={{ mt: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <LibraryBooksIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Matières disponibles
                  </Typography>
                  <Typography variant="h6">4 matières</Typography>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <GroupIcon sx={{ mr: 2, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Élèves inscrits
                  </Typography>
                  <Typography variant="h6">25 étudiants</Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
