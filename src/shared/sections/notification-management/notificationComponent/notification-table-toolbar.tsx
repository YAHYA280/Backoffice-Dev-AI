import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { INotificationFilters } from 'src/contexts/types/notification';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { NOTIFICATION_TYPE_OPTIONS, NOTIFICATION_CHANNEL_OPTIONS } from 'src/shared/_mock/_notification';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<INotificationFilters>;
};

export function NotificationTableToolbar({ filters, onResetPage }: Props) {
  const handleFilterType = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ type: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterChannel = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ channel: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 190 },
        }}
      >
        <InputLabel htmlFor="notification-filter-type-select-label">
          Type
        </InputLabel>

        <Select
          value={filters.state.type}
          onChange={handleFilterType}
          input={<OutlinedInput label="Type" />}
          inputProps={{ id: 'notification-filter-type-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {NOTIFICATION_TYPE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 190 },
        }}
      >
        <InputLabel htmlFor="notification-filter-channel-select-label">
          Canal
        </InputLabel>

        <Select
          value={filters.state.channel}
          onChange={handleFilterChannel}
          input={<OutlinedInput label="Canal" />}
          inputProps={{ id: 'notification-filter-channel-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="">Tous</MenuItem>
          {NOTIFICATION_CHANNEL_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    </Box>
  );
}