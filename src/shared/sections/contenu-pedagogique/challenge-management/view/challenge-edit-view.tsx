'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  alpha,
  Stack,
  Button,
  useTheme,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';

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

interface EditChallengeViewProps {
  id: string;
}

export function EditChallengeView({ id }: EditChallengeViewProps) {
  const router = useRouter();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const { fetchChallengeDetails, handleUpdateChallenge } = useChallenges();

  useEffect(() => {
    const loadChallenge = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChallengeDetails(id);
        if (data) {
          setChallenge(data);
        } else {
          console.error('Challenge not found');
          router.push('/dashboard/contenu-pedagogique/challenges');
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
        router.push('/dashboard/contenu-pedagogique/challenges');
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [id, fetchChallengeDetails, router]);

  const handleSubmit = async (data: Challenge) => {
    if (!challenge) return;

    setIsSubmitting(true);
    try {
      await handleUpdateChallenge(challenge.id, data);
      // Navigate back to the challenges list after successful submission
      router.push('/dashboard/contenu-pedagogique/challenges');
    } catch (error) {
      console.error('Error updating challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the challenges list
    router.push('/dashboard/contenu-pedagogique/challenges');
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!challenge) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Button
            color="inherit"
            onClick={handleCancel}
            startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
            sx={{ mb: 2 }}
          >
            Retour à la liste des challenges
          </Button>
          <Typography variant="h4" color="error">
            Challenge non trouvé
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Button
          color="inherit"
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
            <Typography variant="h4">Modifier le challenge</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {challenge.nom}
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
          initialValues={challenge}
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
