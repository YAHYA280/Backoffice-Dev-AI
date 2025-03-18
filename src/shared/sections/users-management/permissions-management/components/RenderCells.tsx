import type { GridCellParams } from '@mui/x-data-grid';

import { Box , Chip, Link, Stack, Typography } from '@mui/material';

import { fDate, fTime } from 'src/utils/format-time';

interface RenderCellProps {
  params: GridCellParams;
}

interface RenderCellNameProps extends RenderCellProps {
  onViewRow: () => void;
}

export const RenderCellName = ({ params, onViewRow }: RenderCellNameProps) => (
  <Link noWrap color="inherit" variant="subtitle2" sx={{ cursor: 'pointer' }}>
    {params.row.name}
  </Link>
);

export const RenderCellDescription = ({ params }: RenderCellProps) => (
  <Typography variant="body2" sx={{ maxWidth: 650 }}>
    {params.row.description}
  </Typography>
);

export const RenderCellCreatedAt = ({ params }: RenderCellProps) => (
  <Stack spacing={0.5}>
    <Box component="span">{fDate(params.row.createdAt)}</Box>
    <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
      {fTime(params.row.createdAt)}
    </Box>
  </Stack>
);

export const RenderCellRoles = ({ params }: { params: any }) => {
  const { roles } = params.row;
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
      {roles.map((role: string) => (
        <Chip
          key={role}
          label={role}
          size= "small"
          color= 'primary'
        />
      ))}
    </Stack>
  );
};
