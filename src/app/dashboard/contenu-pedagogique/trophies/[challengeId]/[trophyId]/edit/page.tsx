'use client';

import type { Trophy } from 'src/shared/sections/contenu-pedagogique/challenge-management/types';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { Box, Paper, Typography, CircularProgress } from '@mui/material';

import {
  mockTrophies,
  useChallenges,
} from 'src/shared/sections/contenu-pedagogique/challenge-management';
import ChallengeEditTrophy from 'src/shared/sections/contenu-pedagogique/challenge-management/components/ChallengeEditTrophy';

interface SimplifiedChallenge {
  id: string;
  titre: string;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const challengeId = params.challengeId as string;
  const trophyId = params.trophyId as string;

  const [challenge, setChallenge] = useState<SimplifiedChallenge | null>(null);
  const [trophy, setTrophy] = useState<Trophy | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchChallengeDetails, selectedChallenge, loading: challengeLoading } = useChallenges();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (challengeId) {
          await fetchChallengeDetails(challengeId);
        }

        if (trophyId) {
          const found = mockTrophies.find((t) => t.id === trophyId);
          setTrophy(found || null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [challengeId, fetchChallengeDetails, trophyId]);

  useEffect(() => {
    if (selectedChallenge) {
      setChallenge({
        id: selectedChallenge.id,
        titre: selectedChallenge.nom,
      });
    }
  }, [selectedChallenge]);

  const handleSave = async (updatedTrophy: Trophy) => {
    console.log('Trophée mis à jour (mock):', updatedTrophy);

    // Update the mock trophy in the mock data
    const trophyIndex = mockTrophies.findIndex((t) => t.id === trophyId);
    if (trophyIndex !== -1) {
      // Update trophy in the local array
      mockTrophies[trophyIndex] = updatedTrophy;
    }

    // Redirect to trophy list
    if (challengeId) {
      router.push(`/dashboard/contenu-pedagogique/trophies/${challengeId}`);
    }
  };

  // Loading state
  if (loading || challengeLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Chargement...
        </Typography>
      </Box>
    );
  }

  // Error state with centered message and icon
  if (!challenge || !trophy) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" color="error">
            Données introuvables
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Impossible de trouver le trophée ou le challenge demandé.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <ChallengeEditTrophy trophy={trophy} challengeTitle={challenge.titre} onSave={handleSave} />
  );
}
