import type { IAbonnementFilters } from 'src/contexts/types/abonnement'; // Assurez-vous que le chemin est correct
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/shared/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<IAbonnementFilters>;
};

export function AbonnementFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveType = (inputValue: string) => {
    const newValue = filters.state.types.filter((item) => item !== inputValue);
    filters.setState({ types: newValue });
  };

  const handleRemoveStatus = () => {
    filters.setState({ publishOptions: '' });
  };

  const handleRemoveFeatures = (inputValue: string) => {
    const newValue = filters.state.features.filter((item) => item !== inputValue);
    filters.setState({ features: newValue });
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Types d'abonnement:" isShow={!!filters.state.types.length}>
        {filters.state.types.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveType(item)}
            deleteIcon={<FontAwesomeIcon icon={faTimes} />}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Statut:" isShow={filters.state.publishOptions !== ''}>
        <Chip
          {...chipProps}
          label={filters.state.publishOptions}
          onDelete={handleRemoveStatus}
          deleteIcon={<FontAwesomeIcon icon={faTimes} />}
        />
      </FiltersBlock>

      <FiltersBlock label="Features:" isShow={!!filters.state.features.length}>
        {filters.state.features.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveFeatures(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
