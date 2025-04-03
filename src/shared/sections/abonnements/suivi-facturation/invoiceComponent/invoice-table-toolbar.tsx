import type { KeyboardEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IInvoiceFilters } from 'src/contexts/types/invoice';

import { useRef, useState, useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

type Props = {
  onResetPage: () => void;
  filters: UseSetStateReturn<IInvoiceFilters>;
  options: {
    subscriptions: string[];
  };
};

export function InvoiceTableToolbar({ filters, options, onResetPage }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleFilterService = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ subscriptions: newValue });
    },
    [filters, onResetPage]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Empêche la propagation des touches alphabétiques
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.stopPropagation();
    }
  };

  const filteredSubscriptions = options.subscriptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <FormControl
      sx={{
        flexShrink: 0,
        width: { xs: 1, md: 190 },
        p: '25px',
      }}
    >
      <InputLabel htmlFor="invoice-filter-service-select-label" sx={{ p: '30px' }}>
        Abonnements
      </InputLabel>

      <Select
        ref={selectRef}
        multiple
        value={filters.state.subscriptions}
        onChange={handleFilterService}
        input={<OutlinedInput label="Abonnements" />}
        renderValue={(selected) => selected.map((value) => value).join(', ')}
        inputProps={{ id: 'invoice-filter-service-select-label' }}
        sx={{ textTransform: 'capitalize' }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 400,
            },
            onClick: (event: { target: Node; stopPropagation: () => void }) => {
              // Empeche la fermeture du menu si on clique sur le champ de recherche ou ses enfants
              const searchField = searchInputRef.current;
              if (
                searchField &&
                (searchField === event.target || searchField.contains(event.target as Node))
              ) {
                event.stopPropagation();
              }
            },
          },
        }}
      >
        <MenuItem
          disableRipple
          sx={{
            px: 2,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <TextField
            ref={searchInputRef}
            placeholder="Rechercher un abonnement"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => {
              e.stopPropagation();
              // Force le menu à rester ouvert
              selectRef.current?.focus();
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                fieldset: {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
        </MenuItem>

        {filteredSubscriptions.map((option) => (
          <MenuItem
            key={option}
            value={option}
            onClick={(e) => {
              // Empêche la fermeture du menu
              e.stopPropagation();
              // Garde le focus sur le champ de recherche
              searchInputRef.current?.focus();
            }}
          >
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
