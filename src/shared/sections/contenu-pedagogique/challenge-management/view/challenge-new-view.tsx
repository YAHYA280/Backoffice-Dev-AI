'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Box, Card, alpha, Stack, Button, useTheme, Container, Typography } from '@mui/material';

import { useChallenges } from '../hooks/useChallenge';
import { ChallengeForm } from '../components/ChallengeForm';

import type { Challenge } from '../types';

// Mock data (same as in your view.tsx)
const MOCK_NIVEAUX = [
  { id: '1', nom: 'CP1 - Cours Préparatoire 1' },
  { id: '2', nom: 'CP2 - Cours Préparatoire 2' },
  { id: '3', nom: 'CE1 - Cours Élémentaire 1' },
  { id: '4', nom: 'CE2 - Cours Élémentaire 2' },
  { id: '5', nom: 'CM1 - Cours Moyen 1' },
  { id: '6', nom: 'CM2 - Cours Moyen 2' },
];

export function NewChallengeView() {
  const router = useRouter();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleAddChallenge } = useChallenges();

  const handleSubmit = async (data: Challenge) => {
    setIsSubmitting(true);
    try {
      await handleAddChallenge(data);
      // Navigate back to the challenges list after successful submission
      router.push('/dashboard/contenu-pedagogique/challenges');
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the challenges list
    router.push('/dashboard/contenu-pedagogique/challenges');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Button
          color="primary"
          onClick={handleCancel}
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          sx={{ mb: 2 }}
        >
          Retour à la liste des challenges
        </Button>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            mb: 4,
            pb: 3,
            borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.24)}`,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
            }}
          >
            <FontAwesomeIcon icon={faTrophy} size="lg" />
          </Box>
          <Box>
            <Typography variant="h4">Créer un nouveau challenge</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Configurez tous les paramètres de votre nouveau challenge pédagogique
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Card
        sx={{
          p: 3,
          boxShadow: theme.customShadows?.z16,
          borderRadius: 2,
          mb: 4,
        }}
      >
        <ChallengeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          niveaux={MOCK_NIVEAUX}
          prerequisChallenges={[]}
        />
      </Card>
    </Container>
  );
}
