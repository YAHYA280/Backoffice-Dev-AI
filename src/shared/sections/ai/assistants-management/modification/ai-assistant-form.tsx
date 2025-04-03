import type { SelectChangeEvent } from '@mui/material';
import type { IAIAssistantItem } from 'src/types/ai-assistant';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import {
  Stack,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  DialogTitle,
  OutlinedInput,
  DialogActions,
  DialogContent,
} from '@mui/material';

import {
  AI_ASSISTANT_CHAPTERS,
  AI_ASSISTANT_SUBJECTS,
  AI_ASSISTANT_EXERCISES,
  AI_ASSISTANT_TYPE_OPTIONS,
  AI_ASSISTANT_EDUCATION_LEVELS,
} from 'src/shared/_mock/_ai-assistant';

interface AIAssistantFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IAIAssistantItem) => void;
  onDelete?: (id: string) => void;
  initialData?: IAIAssistantItem | null;
  isEdit?: boolean;
}

export function AIAssistantForm({
  open,
  onClose,
  onSubmit,
  onDelete,
  initialData = null,
  isEdit = false
}: AIAssistantFormProps) {

  const [formData, setFormData] = useState<IAIAssistantItem>({
    id: '',
    name: '',
    description: '', // Added description field
    type: '',
    educationLevel: '',
    subject: '',
    chapter: '',
    exercise: '',
    status: 'active',
    lastUpdated: new Date().toISOString(),
    avatarUrl: '',
  });

  // Remplir le formulaire avec les données initiales lorsqu'on est en mode édition
  useEffect(() => {
    if (initialData && open) {
      setFormData({
        ...initialData,
        // Assurer que les valeurs nulles sont converties en chaînes vides pour le formulaire
        description: initialData.description || '', // Handle description
        subject: initialData.subject || '',
        chapter: initialData.chapter || '',
        exercise: initialData.exercise || '',
      });
    } else if (!initialData && open && !isEdit) {
      // Réinitialiser le formulaire en mode création
      setFormData({
        id: '',
        name: '',
        description: '', // Reset description
        type: '',
        educationLevel: '',
        subject: '',
        chapter: '',
        exercise: '',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        avatarUrl: '',
      });
    }
  }, [initialData, open, isEdit]);

  const isJapprends = formData.type === 'japprends';

  // Updated to use SelectChangeEvent from Material UI
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Mettre à jour le lastUpdated
    const updatedData = {
      ...formData,
      lastUpdated: new Date().toISOString(),
      // Convertir les champs vides en null pour correspondre au type IAIAssistantItem
      description: formData.description || null, // Handle empty description
      subject: formData.subject || null,
      chapter: formData.chapter || null,
      exercise: formData.exercise || null,
    };

    onSubmit(updatedData);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && formData.id) {
      onDelete(formData.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Modifier l'Assistant IA" : "Ajouter un Assistant IA"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={2}>
          <TextField
            label="Nom de l'assistant"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          {/* New Description TextField */}
          <TextField
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Décrivez les fonctionnalités de cet assistant..."
          />

          <FormControl fullWidth>
            <InputLabel>Type d&apos;assistant</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              {AI_ASSISTANT_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Niveau scolaire</InputLabel>
            <Select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
            >
              {AI_ASSISTANT_EDUCATION_LEVELS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {isJapprends && (
            <>
              <FormControl fullWidth>
                <InputLabel>Matière</InputLabel>
                <Select
                  name="subject"
                  value={formData.subject || ''}
                  onChange={handleChange}
                >
                  {AI_ASSISTANT_SUBJECTS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Chapitre</InputLabel>
                <Select
                  name="chapter"
                  value={formData.chapter || ''}
                  onChange={handleChange}
                  input={<OutlinedInput label="Chapitre" />}
                >
                  {AI_ASSISTANT_CHAPTERS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Exercice</InputLabel>
                <Select
                  name="exercise"
                  value={formData.exercise || ''}
                  onChange={handleChange}
                  input={<OutlinedInput label="Exercice" />}
                >
                  {AI_ASSISTANT_EXERCISES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="active">Actif</MenuItem>
              <MenuItem value="inactive">Inactif</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {isEdit ? "Retour" : "Annuler"}
        </Button>

        {isEdit && onDelete && (
          <Button
            onClick={handleDelete}
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
          >
            Supprimer l&apos;assistant
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={isEdit ? <FontAwesomeIcon icon={faPen} /> : <FontAwesomeIcon icon={faPlus} />}
        >
          {isEdit ? "Enregistrer les modifications" : "Créer l'assistant"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
