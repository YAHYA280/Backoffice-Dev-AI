// SubjectsModal.tsx
import type { ISubject } from 'src/contexts/types/common';

import React from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Grid,
  Card,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

interface SubjectsModalProps {
  open: boolean;
  onClose: () => void;
  subjects: ISubject[];
  onToggleSubject: (subjectId: string) => void;
  onSave: () => void;
}

export function SubjectsModal({
  open,
  onClose,
  subjects,
  onToggleSubject,
  onSave,
}: SubjectsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Gérer les matières</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {subjects.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject.id}>
              <Card
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: subject.isSelected ? 'primary.lighter' : 'background.paper',
                  border: subject.isSelected ? '1px solid' : '1px solid',
                  borderColor: subject.isSelected ? 'primary.main' : 'divider',
                }}
                onClick={() => onToggleSubject(subject.id)}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="subtitle2">{subject.name}</Typography>
                  <ConditionalComponent isValid={subject.isSelected}>
                    <CheckCircleIcon color="primary" />
                  </ConditionalComponent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={onSave} variant="contained">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
