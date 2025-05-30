'use client';

import React, { useState, useEffect } from 'react';

import { Box, Paper, Typography, CircularProgress } from '@mui/material';

import { useChallenges } from 'src/shared/sections/contenu-pedagogique/challenge-management';
import ChallengeTrophyList from 'src/shared/sections/contenu-pedagogique/challenge-management/components/ChallengeTrophyList';

interface SimplifiedChallenge {
  id: string;
  titre: string;
}

type Props = {
  params: { challengeId: string };
};

export default function Page({ params }: Props) {
  const { challengeId } = params;
  const [challenge, setChallenge] = useState<SimplifiedChallenge | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchChallengeDetails, selectedChallenge, loading: challengeLoading } = useChallenges();

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        await fetchChallengeDetails(challengeId);
      } catch (error) {
        console.error('Error fetching challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId, fetchChallengeDetails]);

  // When selectedChallenge changes (after fetching), create the simplified version
  useEffect(() => {
    if (selectedChallenge) {
      setChallenge({
        id: selectedChallenge.id,
        titre: selectedChallenge.nom,
      });
    }
  }, [selectedChallenge]);

  // Combined loading state from both local state and hook's loading state
  const isLoading = loading || challengeLoading;

  if (isLoading) {
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

  if (!challenge) {
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
            Challenge non trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Impossible de trouver le challenge demandé.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return <ChallengeTrophyList challenge={challenge} />;
}
