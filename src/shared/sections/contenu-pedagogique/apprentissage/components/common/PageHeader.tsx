'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Stack, Button, styled, Typography } from '@mui/material';

const StyledRoot = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(3),
}));

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
  sx?: SxProps<Theme>;
}

export const PageHeader = ({ title, actionLabel, onActionClick, sx }: PageHeaderProps) => (
  <StyledRoot sx={sx}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
      <Typography variant="h4" color="text.primary">
        {title}
      </Typography>

      {actionLabel && onActionClick && (
        <Button
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      )}
    </Stack>
  </StyledRoot>
);
