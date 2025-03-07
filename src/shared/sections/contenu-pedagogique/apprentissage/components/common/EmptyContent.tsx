import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';

import { Box, styled, Typography } from '@mui/material';

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(8, 2),
}));

interface EmptyContentProps {
  title: string;
  description?: string;
  img?: string;
  sx?: SxProps<Theme>;
}

export const EmptyContent = ({ title, description, img, sx }: EmptyContentProps) => (
  <StyledRoot sx={sx}>
    {img && (
      <Box
        component="img"
        src={img}
        alt="empty content"
        sx={{
          height: 240,
          mb: 3,
        }}
      />
    )}

    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>

    {description && (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    )}
  </StyledRoot>
);
