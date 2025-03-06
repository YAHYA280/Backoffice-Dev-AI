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
  faBook,
  faFileAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { Matiere } from '../../types';

interface MatiereDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  matiere: Matiere;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewChapitres?: () => void;
}

const MatiereDetailDrawer = ({
  open,
  onClose,
  matiere,
  onEdit,
  onDelete,
  onViewChapitres,
}: MatiereDetailDrawerProps) => (
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
      <Typography variant="h6">Détails de la matière</Typography>
      <IconButton onClick={onClose} edge="end">
        <FontAwesomeIcon icon={faTimes} />
      </IconButton>
    </Box>

    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Avatar
          sx={{
            bgcolor: matiere.couleur,
            width: 56,
            height: 56,
            fontSize: '1.5rem',
          }}
        >
          {matiere.icon}
        </Avatar>
        <Typography variant="h5" fontWeight="bold">
          {matiere.nom}
        </Typography>
      </Stack>

      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Description :
      </Typography>
      <Typography variant="body1" paragraph>
        {matiere.description}
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
                <FontAwesomeIcon icon={faBook} style={{ color: '#2065D1' }} />
                <Typography variant="body2">Chapitres:</Typography>
                <Chip
                  label={matiere.chapitresCount}
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
                <FontAwesomeIcon icon={faFileAlt} style={{ color: '#2065D1' }} />
                <Typography variant="body2">Exercices totaux:</Typography>
                <Chip
                  label="18" // Hardcoded for now
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
                  label="12h" // Hardcoded for now
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
        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={onViewChapitres}>
          Voir les chapitres
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

export default MatiereDetailDrawer;
