import type { ICGUCard } from 'src/contexts/types/configuration';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ConfigurationItemSkeleton } from './configuration-skeleton';
import { ConfigurationItemHorizontal } from './configuration-item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  cgus: ICGUCard[];
  loading?: boolean;
};

export function ConfigurationListHorizontal({ cgus, loading }: Props) {
  const renderLoading = <ConfigurationItemSkeleton variant="horizontal" />;

  const renderList = cgus.map((cgu) => <ConfigurationItemHorizontal key={cgu.id} cgu={cgu} />);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {cgus.length > 8 ? (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
