'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTrash,
  faVideo,
  faImage,
  faLaptop,
  faFileAlt,
  faFilePdf,
  faClipboard,
  faHeadphones,
  faPenToSquare,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Grid,
  Stack,
  Drawer,
  Button,
  Divider,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { STATUT_OPTIONS } from '../../types';

import type { Exercice } from '../../types';

interface ExerciceDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  exercice: Exercice;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ExerciceDetailDrawer = ({
  open,
  onClose,
  exercice,
  onEdit,
  onDelete,
}: ExerciceDetailDrawerProps) => {
  // Find status option based on exercice.statut
  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === exercice.statut) || STATUT_OPTIONS[0];

  // Function to get icon for resource type
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
        sx: { width: { xs: '100%', sm: 400 }, p: 0 },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">Détails de l&quote;exercice</Typography>
        <IconButton onClick={onClose} edge="end">
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {exercice.titre}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={statutOption.label}
            size="small"
            sx={{
              backgroundColor: statutOption.bgColor,
              color: statutOption.color,
            }}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Description :
        </Typography>
        <Typography variant="body1" paragraph>
          {exercice.description}
        </Typography>

        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Ressources :
        </Typography>
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {exercice.ressources.map((resource, index) => (
            <Grid item key={index}>
              <Chip
                icon={<FontAwesomeIcon icon={getResourceIcon(resource)} />}
                label={resource}
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Évaluation et objectifs :
        </Typography>

        <List disablePadding>
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={faClipboard} style={{ color: '#2065D1' }} />
                  <Typography variant="body2">Notation:</Typography>
                  <Chip
                    label="20 points" // Hardcoded for now
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              }
            />
          </ListItem>

          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#2065D1' }} />
                  <Typography variant="body2">Compétences visées:</Typography>
                  <Chip
                    label="3" // Hardcoded for now
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              }
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 4 }}>
          <Stack direction="row" spacing={2}>
            {onEdit && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                onClick={onEdit}
                fullWidth
              >
                Modifier
              </Button>
            )}

            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<FontAwesomeIcon icon={faTrash} />}
                onClick={onDelete}
                fullWidth
              >
                Supprimer
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ExerciceDetailDrawer;
