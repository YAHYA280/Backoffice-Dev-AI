import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SearchNotFound } from 'src/shared/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (inputValue: string) => void;
  search: UseSetStateReturn<{
    query: string;
    results: IAbonnementItem[];
  }>;
};

export function AbonnementSearch({ search, onSearch }: Props) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(paths.dashboard.abonnements.details(id));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (search.state.query) {
      if (event.key === 'Enter') {
        const selectAbonnement = search.state.results.filter(
          (abonnement) => abonnement.title === search.state.query
        )[0];

        handleClick(selectAbonnement.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={search.state.results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={search.state.query} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Rechercher un abonnement..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ marginLeft: 8, color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, abonnement, { inputValue }) => {
        const matches = match(abonnement.title, inputValue); // Recherche par nom d'abonnement
        const parts = parse(abonnement.title, matches);

        return (
          <Box
            component="li"
            {...props}
            onClick={() => handleClick(abonnement.id)}
            key={abonnement.id}
          >
            <div>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}
