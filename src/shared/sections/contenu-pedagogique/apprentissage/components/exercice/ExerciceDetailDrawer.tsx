'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faVideo,
  faImage,
  faLaptop,
  faFileAlt,
  faFilePdf,
  faClipboard,
  faHeadphones,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Grid,
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

import { STATUT_OPTIONS } from '../../types';

import type { Exercice } from '../../types';

interface ExerciceDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  exercice: Exercice;
}

const ExerciceDetailDrawer = ({ open, onClose, exercice }: ExerciceDetailDrawerProps) => {
  const theme = useTheme();

  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === exercice.statut) || STATUT_OPTIONS[0];

  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'pdf':
        return faFilePdf;
      case 'audio':
        return faHeadphones;
      case 'vidéo':
      case 'video':
        return faVideo;
      case 'interactive':
        return faLaptop;
      case 'image':
        return faImage;
      default:
        return faFileAlt;
    }
  };

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
            }}
          >
            <FontAwesomeIcon icon={faFileAlt} size="lg" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              {exercice.titre}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={statutOption.label}
                size="small"
                sx={{
                  bgcolor: alpha(statutOption.bgColor, 0.8),
                  color: statutOption.color,
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
            Description de l&apos;exercice
          </Typography>
          <Typography variant="body2">
            {exercice.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

        {/* Ressources */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Ressources
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z1,
            }}
          >
            <Grid container spacing={1}>
              {exercice.ressources && exercice.ressources.length > 0 ? (
                exercice.ressources.map((resource, index) => (
                  <Grid item key={index}>
                    <Chip
                      icon={<FontAwesomeIcon icon={getResourceIcon(resource)} />}
                      label={resource}
                      sx={{
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.lighter, 0.5),
                        color: 'text.primary',
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune ressource disponible
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>

        {/* Évaluation et objectifs */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Évaluation et objectifs
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
                      <FontAwesomeIcon icon={faClipboard} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Notation
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    20 points
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
                      <FontAwesomeIcon icon={faGraduationCap} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Compétences visées
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    3 compétences
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ExerciceDetailDrawer;
