
import type { IAIAssistantItem, AIAssistantFilteringProps } from 'src/types/ai-assistant';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Fonction pour récupérer un assistant depuis localStorage
const fetchAssistantById = (id: string): IAIAssistantItem | null => {
  try {
    const storedAssistants: IAIAssistantItem[] = JSON.parse(localStorage.getItem('assistants') || '[]');
    return storedAssistants.find(assistant => assistant.id === id) || null;
  } catch (error) {
    console.error("Erreur lors de la récupération des assistants :", error);
    return null;
  }
};

// Type pour le composant LabelValuePair
type LabelValuePairProps = {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
  fullWidth?: boolean;
};

// Composant pour afficher une paire label/valeur
function LabelValuePair({ label, value, multiline = false, fullWidth = false }: LabelValuePairProps) {
  return (
    <Box sx={{ mb: 2, width: fullWidth ? '100%' : 'auto' }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography 
        variant="body1"
        component="div"
        sx={{ 
          fontWeight: multiline ? 'normal' : 'medium',
          lineHeight: multiline ? 1.6 : 1.5,
          overflow: multiline ? 'auto' : 'hidden',
          textOverflow: multiline ? 'clip' : 'ellipsis',
          whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
          maxHeight: multiline ? '150px' : 'auto',
        }}
      >
        {value || '-'}
      </Typography>
    </Box>
  );
}

export default function AIAssistantDescription({ assistantId }: AIAssistantFilteringProps) {
  const [assistant, setAssistant] = useState<IAIAssistantItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId) {
      setError("Aucun assistant sélectionné.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = fetchAssistantById(assistantId);
      if (!data) {
        throw new Error("L'assistant sélectionné n'existe pas.");
      }
      setAssistant(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }, [assistantId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!assistant) {
    return <Alert severity="warning">Aucune donnée disponible pour cet assistant.</Alert>;
  }

  // Utiliser lastUpdated au lieu de updatedAt
  const formattedDate = assistant.lastUpdated 
    ? typeof assistant.lastUpdated === 'string' 
      ? assistant.lastUpdated.split('T')[0] 
      : assistant.lastUpdated.toISOString().split('T')[0]
    : '';

  return (
    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          {assistant.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ID: {assistant.id}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              bgcolor: assistant.status === 'active' ? '#e8f5e9' : '#ffebee',
              color: assistant.status === 'active' ? '#2e7d32' : '#c62828',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem'
            }}
          >
            {assistant.status === 'active' ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Première section: informations de base sur deux colonnes */}
      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <LabelValuePair label="Type d'assistant" value={assistant.type} />
          <LabelValuePair label="Matière" value={assistant.subject} />
          <LabelValuePair label="Niveau scolaire" value={assistant.educationLevel} />
        </Box>
        <Box>
          <LabelValuePair label="Chapitre" value={assistant.chapter} />
          <LabelValuePair label="Exercice" value={assistant.exercise} />
          <LabelValuePair label="Dernière modification" value={formattedDate} />
        </Box>
      </Box>

      {/* Section description sur toute la largeur */}
      <Box sx={{ mt: 3, width: '100%' }}>
        <LabelValuePair 
          label="Description" 
          value={assistant.description} 
          multiline 
          fullWidth
        />
      </Box>
    </Box>
  );
}