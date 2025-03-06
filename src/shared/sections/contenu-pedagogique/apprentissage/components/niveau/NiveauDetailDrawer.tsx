// src/shared/sections/contenu-pedagogique/apprentissage/components/niveau/NiveauDetailDrawer.tsx
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
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPenToSquare,
  faTrash,
  faBook,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Niveau } from '../../types';

interface NiveauDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  niveau: Niveau;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewMatieres?: () => void;
}

const NiveauDetailDrawer = ({
  open,
  onClose,
  niveau,
  onEdit,
  onDelete,
  onViewMatieres,
}: NiveauDetailDrawerProps) => (
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
      <Typography variant="h6">Détails du niveau</Typography>
      <IconButton onClick={onClose} edge="end">
        <FontAwesomeIcon icon={faTimes} />
      </IconButton>
    </Box>

    <Box sx={{ p: 3 }}>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Nom :
      </Typography>
      <Typography variant="body1" paragraph>
        {niveau.nom}
      </Typography>

      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Code :
      </Typography>
      <Typography variant="body1" paragraph>
        {niveau.code}
      </Typography>

      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Description :
      </Typography>
      <Typography variant="body1" paragraph>
        {niveau.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Autres informations :
      </Typography>

      <List disablePadding>
        <ListItem disablePadding sx={{ py: 1 }}>
          <ListItemText
            primary={
              <Stack direction="row" spacing={1} alignItems="center">
                <FontAwesomeIcon icon={faBook} style={{ color: '#2065D1' }} />
                <Typography variant="body2">Matières:</Typography>
                <Chip
                  label={niveau.matieresCount || 0}
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
                  label="22" // Hardcoded for now
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
        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={onViewMatieres}>
          Voir les matières
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

export default NiveauDetailDrawer;
