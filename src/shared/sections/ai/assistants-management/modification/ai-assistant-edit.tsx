import type { SelectChangeEvent } from '@mui/material';
import type { IAIAssistantItem } from 'src/types/ai-assistant';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  AI_ASSISTANT_SUBJECTS,
  AI_ASSISTANT_TYPE_OPTIONS,
  AI_ASSISTANT_STATUS_OPTIONS,
  AI_ASSISTANT_EDUCATION_LEVELS,
} from 'src/shared/_mock/_ai-assistant';


// Fonction fictive pour simuler la récupération des données d'un assistant
const fetchAssistantById = async (id: string): Promise<IAIAssistantItem> => ({
  id,
  name: 'Assistant exemple',
  educationLevel: 'college',
  type: 'Apprentissge',
  subject: 'math',
  chapter: 'Chapitre 1',
  exercise: 'Exercice 2',
  status: 'active',
});

type AIAssistantEditProps = {
  assistantId: string;
};

export default function AIAssistantEdit({ assistantId }: AIAssistantEditProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<IAIAssistantItem>({
    id: '',
    name: '',
    educationLevel: '',
    type: '',
    subject: '',
    chapter: '',
    exercise: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(true);
  const confirmDelete = useBoolean();

  useEffect(() => {
    const loadAssistant = async () => {
      try {
        const data = await fetchAssistantById(assistantId);
        setFormData(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'assistant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssistant();
  }, [assistantId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log('Modifications enregistrées:', formData);
    // TODO: Envoyer formData à l'API ici
    router.push('/dashboard/personalization-ai'); // Mettre à jour le chemin si nécessaire
  };



  if (loading) return <Typography>Chargement...</Typography>;
  if (!formData) return <Typography>Assistant non trouvé</Typography>;

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Modifier l&apos;Assistant IA
      </Typography>
      <Stack spacing={2}>
        <TextField label="Nom de l'assistant" name="name" value={formData.name} onChange={handleChange} fullWidth />
        <TextField select label="Type d'assistant" name="type" value={formData.type} onChange={handleChange} fullWidth>
          {AI_ASSISTANT_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Niveau scolaire" name="educationLevel" value={formData.educationLevel} onChange={handleChange} fullWidth>
          {AI_ASSISTANT_EDUCATION_LEVELS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        {formData.type === 'Apprentissge' && (
          <>
            <TextField select label="Matière" name="subject" value={formData.subject || ''} onChange={handleChange} fullWidth>
              {AI_ASSISTANT_SUBJECTS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField label="Chapitre" name="chapter" value={formData.chapter || ''} onChange={handleChange} fullWidth />
            <TextField label="Exercice" name="exercise" value={formData.exercise || ''} onChange={handleChange} fullWidth />
          </>
        )}
        <TextField select label="Statut" name="status" value={formData.status} onChange={handleChange} fullWidth>
          {AI_ASSISTANT_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="contained" color="error" onClick={confirmDelete.onTrue}>
            Supprimer l&apos;assistant
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enregistrer les modifications
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
