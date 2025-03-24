import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IInvoiceFilters } from 'src/contexts/types/invoice';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/shared/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<IInvoiceFilters>;
};

export function InvoiceTableFiltersResult({ filters, totalResults, onResetPage, sx }: Props) {
  const handleRemoveSubscription = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.subscriptions.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ subscriptions: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Subscription:" isShow={!!filters.state.subscriptions.length}>
        {filters.state.subscriptions.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveSubscription(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
