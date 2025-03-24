import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IAbonnementFilters } from 'src/contexts/types/abonnement';

import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faTimes, faFilter } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Scrollbar } from 'src/shared/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  canReset: boolean;
  onOpen: () => void;
  onClose: () => void;
  filters: UseSetStateReturn<IAbonnementFilters>;
  options: {
    types: string[];
    PublishOptions: string[];
    features: string[];
  };
};

export function AbonnementFilters({ open, canReset, onOpen, onClose, filters, options }: Props) {
  const handleFilterType = useCallback(
    (newValue: string) => {
      const checked = filters.state.types.includes(newValue)
        ? filters.state.types.filter((value) => value !== newValue)
        : [...filters.state.types, newValue];

      filters.setState({ types: checked });
    },
    [filters]
  );

  const handleFilterPublish = useCallback(
    (newValue: string) => {
      filters.setState({ publishOptions: newValue });
    },
    [filters]
  );

  const handleFilterFeatures = useCallback(
    (newValue: string) => {
      const checked = filters.state.features.includes(newValue)
        ? filters.state.features.filter((value) => value !== newValue)
        : [...filters.state.features, newValue];

      filters.setState({ features: checked });
    },
    [filters]
  );

  const renderHead = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filtres
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={filters.onResetState}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <FontAwesomeIcon icon={faRedo} />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  const renderTypeFilters = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Types d&apos;abonnement
      </Typography>
      {options.types.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.state.types.includes(option)}
              onClick={() => handleFilterType(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderStatusFilter = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        statut
      </Typography>
      {options.PublishOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Radio
              checked={option === filters.state.publishOptions}
              onClick={() => handleFilterPublish(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderFeatures = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Fonctionnalités
      </Typography>
      {options.features.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.state.features.includes(option)}
              onClick={() => handleFilterFeatures(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <FontAwesomeIcon icon={faFilter} />
          </Badge>
        }
        onClick={onOpen}
      >
        Filtres
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        {renderHead}

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderTypeFilters}
            {renderStatusFilter}
            {renderFeatures}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
