'use client';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

import { Niveau } from '../view/apprentissage-view';

type NiveauListProps = {
  niveaux: Niveau[];
  onSelect: (niveau: Niveau) => void;
  onAdd: () => void;
  onEdit: (niveau: Niveau, event: React.MouseEvent) => void;
  onDelete: (niveau: Niveau, event: React.MouseEvent) => void;
  onViewDetails: (niveau: Niveau, event: React.MouseEvent) => void;
};

export default function NiveauList({
  niveaux,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onViewDetails,
}: NiveauListProps) {
  // Empty state
  if (niveaux.length === 0) {
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            p: 2,
            bgcolor: (theme) => theme.palette.primary.main,
            color: 'white',
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Niveaux</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            size="small"
            sx={{
              bgcolor: 'white',
              color: (theme) => theme.palette.primary.main,
              '&:hover': { bgcolor: '#f7f7f7' },
            }}
          >
            Ajouter Niveau
          </Button>
        </Box>

        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <FolderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucun niveau disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre premier niveau pour commencer à organiser votre contenu pédagogique.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
              Ajouter un Niveau
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          p: 2,
          bgcolor: (theme) => theme.palette.primary.main,
          color: 'white',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Niveaux</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          size="small"
          sx={{
            bgcolor: 'white',
            color: (theme) => theme.palette.primary.main,
            '&:hover': { bgcolor: '#f7f7f7' },
          }}
        >
          Ajouter Niveau
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {niveaux.map((niveau) => (
            <Box
              key={niveau.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'background.default',
                },
                cursor: 'pointer',
              }}
              onClick={() => onSelect(niveau)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <FolderIcon
                  sx={{
                    mr: 2,
                    color: (theme) => theme.palette.primary.main,
                  }}
                />
                <Typography>{niveau.nom}</Typography>
              </Box>

              <Box>
                <Tooltip title="Détails">
                  <IconButton
                    size="small"
                    onClick={(e) => onViewDetails(niveau, e)}
                    sx={{ color: 'info.main' }}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={(e) => onEdit(niveau, e)}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Supprimer">
                  <IconButton
                    size="small"
                    onClick={(e) => onDelete(niveau, e)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
