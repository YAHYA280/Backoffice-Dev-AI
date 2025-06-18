'use client';

import type { Chapter } from 'src/types/chapter';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faTimes,
  faClock,
  faFileAlt,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Stack,
  alpha,
  Paper,
  Drawer,
  Avatar,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate/variants/fade';

import { DIFFICULTE_OPTIONS } from '../../types';


interface ChapitreDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  chapitre: Chapter;
  onViewExercices?: () => void;
}

const ChapitreDetailDrawer = ({
  open,
  onClose,
  chapitre,
  onViewExercices,
}: ChapitreDetailDrawerProps) => {
  const theme = useTheme();

  const difficulteOption =
    DIFFICULTE_OPTIONS.find((option) => option.value === chapitre.difficulty) ||
    DIFFICULTE_OPTIONS[0];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
          p: 0,
          boxShadow: theme.customShadows?.z16,
          overflowY: 'auto',
        },
      }}
    >
      {/* Header with background and icon */}
      <Box
        component={m.div}
        initial="initial"
        animate="animate"
        variants={varFade().in}
        sx={{
          p: 3,
          pb: 5,
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
          color: 'white',
        }}
      >
        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha('#fff', 0.9),
              color: 'primary.main',
              boxShadow: theme.customShadows?.z8,
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            {chapitre.order}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              {chapitre.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={difficulteOption.label}
                size="small"
                sx={{
                  bgcolor: alpha(difficulteOption.bgColor, 0.8),
                  color: difficulteOption.color,
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ p: 3 }}>
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Description du chapitre
          </Typography>
          <Typography variant="body2">
            {chapitre.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

        {/* Information Cards */}
        <Stack
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          direction="row"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.info.lighter, 0.5),
            }}
          >
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{
                color: theme.palette.info.main,
                fontSize: 24,
                marginBottom: 8,
              }}
            />
            <Typography variant="h5" color="text.primary">
              {/* {chapitre.exercicesCount || 0} */}
              {0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Exercices
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.success.lighter, 0.5),
            }}
          >
            <FontAwesomeIcon
              icon={faGraduationCap}
              style={{
                color: theme.palette.success.main,
                fontSize: 24,
                marginBottom: 8,
              }}
            />
            <Typography variant="h5" color="text.primary">
              {/* {chapitre.competencesCount || 4} */}
              {0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compétences
            </Typography>
          </Paper>
        </Stack>

        {/* Detailed Information List */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Informations détaillées
          </Typography>

          <List
            sx={{
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows?.z1,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {chapitre.order}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Ordre
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    Chapitre {chapitre.order}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: 'warning.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faClock} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Durée estimée
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {/* {chapitre.dureeEstimee || '3h30'} */}
                    {0}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faBook} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Difficulté
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box sx={{ mt: 0.5, ml: 6 }}>
                    <Chip
                      label={difficulteOption.label}
                      size="small"
                      sx={{
                        bgcolor: difficulteOption.bgColor,
                        color: difficulteOption.color,
                      }}
                    />
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChapitreDetailDrawer;
