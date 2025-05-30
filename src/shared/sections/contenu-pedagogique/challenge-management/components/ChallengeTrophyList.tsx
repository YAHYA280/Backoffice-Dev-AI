import Link from 'next/link';
import { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { 
  Box, 
  Grid, 
  alpha, 
  Button, 
  useTheme,
  Typography
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { mockTrophies } from '../hooks/useChallenge';
import { ChallengeTrophyCard } from './ChallengeTrophyCard';

import type { Trophy } from '../types';

// ----------------------------------------------------------------------

interface ChallengeTrophyListProps {
  challenge: { id: string; titre: string };
}

export default function ChallengeTrophyList({ challenge }: ChallengeTrophyListProps) {
  const theme = useTheme();
  const [trophies, settrophies] = useState<Trophy[]>(
    mockTrophies.filter((t) => t.challengeId === challenge.id)
  );

  const handleEditTrophy = async (updatedTrophy: Trophy) => {
    // Update the trophy in your state
    try {
      const index = mockTrophies.findIndex(t => t.id === updatedTrophy.id);
      if (index !== -1) {
        mockTrophies[index] = updatedTrophy;
      }

    } catch (error) {
      console.error('Error updating trophy:', error);
      throw error;
    }
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Configuration des trophées"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Contenu pédagogique', href: paths.dashboard.contenu_pedagogique.root },
          { name: 'Gestion des challenges', href: paths.dashboard.contenu_pedagogique.challenges },
          { name: 'Configuration des trophées' },
        ]}
        action={
          <Link href={paths.dashboard.contenu_pedagogique.newTrophy(challenge.id)}>
            <Button
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              sx={{
                borderRadius: 1.5,
                boxShadow: theme.customShadows?.primary,
                textTransform: 'none',
                fontWeight: 600,
                color: theme.palette.common.white,
              }}
              color="primary"
            >
              Ajouter un trophée
            </Button>
          </Link>
        }
        sx={{ mb: { xs: 3, md: 4 } }}
      />
      
      <Box 
        sx={{ 
          backgroundColor: alpha(theme.palette.primary.lighter, 0.08),
          borderRadius: 2,
          p: 3,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.darker
          }}
        >
          {challenge.titre}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <Box component="span" sx={{ fontWeight: 'bold' }}>
            {trophies.length}
          </Box> 
          {trophies.length > 1 ? 'trophées disponibles' : 'trophée disponible'}
        </Typography>
      </Box>

      {trophies.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: alpha(theme.palette.background.neutral, 0.6),
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`
          }}
        >
          <Typography variant="body1" color="text.secondary" paragraph>
            Aucun trophée n&apos;est encore configuré pour ce challenge.
          </Typography>
          <Link href={paths.dashboard.contenu_pedagogique.newTrophy(challenge.id)}>
            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              sx={{ textTransform: 'none', color: theme.palette.primary.main }}
            >
              Ajouter votre premier trophée
            </Button>
          </Link>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {trophies.map((trophy) => (
            <Grid item xs={12} md={6} key={trophy.id}>
              <ChallengeTrophyCard
                trophy={trophy}
                onView={() => console.log('View', trophy.id)}
                onEdit={handleEditTrophy}
                onDelete={() => {
                  settrophies((prev) => prev.filter((t) => t.id !== trophy.id));
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardContent>
  );
}