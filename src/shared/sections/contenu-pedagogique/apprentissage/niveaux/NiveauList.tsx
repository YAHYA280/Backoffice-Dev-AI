'use client';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookIcon from '@mui/icons-material/Book';

import { Niveau } from '../view/apprentissage-view';

type NiveauListProps = {
  niveaux: Niveau[];
  onSelect: (niveau: Niveau) => void;
  onAdd: () => void;
};

export default function NiveauList({ niveaux, onSelect, onAdd }: NiveauListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#3F51B5'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Empty state
  if (niveaux.length === 0) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Liste des Niveaux</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
                size={isMobile ? 'small' : 'medium'}
              >
                Ajouter un Niveau
              </Button>
            </Box>
          }
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
              borderRadius: 2,
              maxWidth: 500,
            }}
          >
            <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucun niveau disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre premier niveau pour commencer à organiser votre contenu pédagogique.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} size="large">
              Ajouter un Niveau
            </Button>
          </Paper>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Liste des Niveaux</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
                size={isMobile ? 'small' : 'medium'}
              >
                Ajouter un Niveau
              </Button>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {niveaux.map((niveau, index) => (
              <Grid item xs={12} sm={6} md={4} key={niveau.id}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                      },
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        backgroundColor: colors[index % colors.length],
                      },
                    }}
                    onClick={() => onSelect(niveau)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <FolderIcon
                          sx={{
                            color: colors[index % colors.length],
                            fontSize: 40,
                            mr: 2,
                          }}
                        />
                        <Box>
                          <Typography variant="h6" noWrap sx={{ mb: 0.5 }}>
                            {niveau.nom}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon
                              sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              Créé le {niveau.dateCreation}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          height: 60,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {niveau.description}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2,
                        }}
                      >
                        <Tooltip title="Voir les détails">
                          <IconButton
                            size="small"
                            sx={{
                              color: colors[index % colors.length],
                              bgcolor: `${colors[index % colors.length]}10`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(niveau);
                            }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {niveau.observation && (
                          <Chip
                            label="Observations"
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              height: 24,
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}
