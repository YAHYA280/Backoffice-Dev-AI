import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';

import { Stack, TableRow, Skeleton, TableCell } from '@mui/material';

interface TableSkeletonLoaderProps {
  rows?: number;
  columns?: number;
  sx?: SxProps<Theme>;
}

export const TableSkeletonLoader = ({ rows = 5, columns = 4, sx }: TableSkeletonLoaderProps) => (
  <>
    {[...Array(rows)].map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {columns > 0 && (
          <TableCell padding="checkbox">
            <Skeleton variant="rounded" width={20} height={20} />
          </TableCell>
        )}

        {[...Array(columns - 1)].map((colIndex) => (
          <TableCell key={colIndex}>
            <Stack spacing={1}>
              <Skeleton variant="text" width={colIndex === 0 ? 120 : '80%'} height={24} />
              {colIndex === 0 && <Skeleton variant="text" width="40%" height={16} />}
            </Stack>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);
