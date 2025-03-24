'use client';

import type { IAbonnementSubscribers } from 'src/contexts/types/common';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import ListItemText from '@mui/material/ListItemText';

// ----------------------------------------------------------------------

type Props = {
  subscribers: IAbonnementSubscribers[];
};

export function AbonnementDetailsSubscribers({ subscribers }: Props) {
  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
      >
        {subscribers.map((subscriber) => (
          <Card key={subscriber.id} sx={{ p: 3, gap: 2, display: 'flex' }}>
            <Avatar
              alt={subscriber.name}
              src={subscriber.avatarUrl}
              sx={{ width: 48, height: 48 }}
            />

            <Stack spacing={2}>
              <ListItemText
                primary={subscriber.name}
                secondary={subscriber.role}
                secondaryTypographyProps={{
                  mt: 0.5,
                  component: 'span',
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              />
            </Stack>
          </Card>
        ))}
      </Box>

      <Pagination count={10} sx={{ mt: { xs: 5, md: 8 }, mx: 'auto' }} />
    </>
  );
}
