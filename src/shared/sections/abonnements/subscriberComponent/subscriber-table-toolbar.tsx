import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { ISubscriberFilters } from 'src/contexts/types/subscriber';

import { useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<ISubscriberFilters>;
  options: {
    subscriptions: string[];
  };
};

export function SubscriberTableToolbar({ filters, options, onResetPage }: Props) {
  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ subscriptions: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 }, p: '25px' }}>
      <InputLabel htmlFor="subscriber-filter-service-select-label" sx={{ p: '30px' }}>
        Abonnements
      </InputLabel>

      <Select
        multiple
        value={filters.state.subscriptions}
        onChange={handleFilterService}
        input={<OutlinedInput label="Abonnements" />}
        renderValue={(selected) => selected.map((value) => value).join(', ')}
        inputProps={{ id: 'subscriber-filter-service-select-label' }}
        sx={{ textTransform: 'capitalize' }}
      >
        {options.subscriptions.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox
              disableRipple
              size="small"
              checked={filters.state.subscriptions.includes(option)}
            />
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
