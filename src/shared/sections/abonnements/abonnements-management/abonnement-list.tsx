import type { IAbonnementItem } from 'src/types/abonnement';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { AbonnementItem } from './abonnement-item'; // Assurez-vous d'avoir un composant AbonnementItem similaire à JobItem

// ----------------------------------------------------------------------

type Props = {
  abonnements: IAbonnementItem[];
};

export function AbonnementList({ abonnements }: Props) {
  const router = useRouter();

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.abonnements.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.abonnements.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id: string) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {abonnements.map((abonnement) => (
          <AbonnementItem
            key={abonnement.id}
            abonnement={abonnement}
            onView={() => handleView(abonnement.id)}
            onEdit={() => handleEdit(abonnement.id)}
            onDelete={() => handleDelete(abonnement.id)}
          />
        ))}
      </Box>

      {abonnements.length > 8 && (
        <Pagination
          count={Math.ceil(abonnements.length / 8)} // Affichage dynamique du nombre de pages basé sur les abonnements
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
