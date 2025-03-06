'use client';

import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPenToSquare,
  faTrash,
  faFileAlt,
  faClock,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import { Chapitre, DIFFICULTE_OPTIONS } from '../../types';

interface ChapitreDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  chapitre: Chapitre;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewExercices?: () => void;
}

const ChapitreDetailDrawer = ({
  open,
  onClose,
  chapitre,
  onEdit,
  onDelete,
  onViewExercices,
}: ChapitreDetailDrawerProps) => {
  // Find difficulty option based on chapitre.difficulte
  const difficulteOption =
    DIFFICULTE_OPTIONS.find((option) => option.value === chapitre.difficulte) ||
    DIFFICULTE_OPTIONS[0];

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
        <Typography variant="h6">Détails du chapitre</Typography>
        <IconButton onClick={onClose} edge="end">
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar
            sx={{
              bgcolor: '#E9F2FF',
              color: '#2065D1',
              width: 40,
              height: 40,
            }}
          >
            {chapitre.ordre}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {chapitre.nom}
          </Typography>
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={`Difficulté: ${difficulteOption.label}`}
            size="small"
            sx={{
              backgroundColor: difficulteOption.bgColor,
              color: difficulteOption.color,
            }}
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Description :
        </Typography>
        <Typography variant="body1" paragraph>
          {chapitre.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Statistiques :
        </Typography>

        <List disablePadding>
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={faFileAlt} style={{ color: '#2065D1' }} />
                  <Typography variant="body2">Exercices:</Typography>
                  <Chip
                    label={chapitre.exercicesCount}
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
                  <FontAwesomeIcon icon={faClock} style={{ color: '#2065D1' }} />
                  <Typography variant="body2">Durée estimée:</Typography>
                  <Chip
                    label="3h30" // Hardcoded for now
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
                  <Typography variant="body2">Compétences:</Typography>
                  <Chip
                    label="4" // Hardcoded for now
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
          <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={onViewExercices}>
            Voir les exercices
          </Button>

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

export default ChapitreDetailDrawer;
