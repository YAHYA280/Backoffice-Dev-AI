import type { UniqueIdentifier } from '@dnd-kit/core';
import type { IKanbanTask } from 'src/contexts/types/kanban';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { SearchNotFound } from 'src/shared/components/search-not-found';

type Props = {
  query: string;
  loading?: boolean;
  results: IKanbanTask[];
  onSearch: (inputValue: string) => void;
};

export function AmeliorationSearch({ query, results, onSearch, loading }: Props) {
  const handleClick = (id: UniqueIdentifier) => {
    console.log("Navigating to task:", id);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query && event.key === 'Enter') {
      const selectItem = results.find((amelioration) => 
        amelioration.name.toLowerCase().includes(query.toLowerCase()) ||
        (amelioration.description && amelioration.description.toLowerCase().includes(query.toLowerCase()))
      );

      if (selectItem) {
        handleClick(selectItem.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: { placement: 'bottom-start', sx: { minWidth: 320 } },
        paper: { sx: { [` .${autocompleteClasses.option}`]: { pl: 0.75 } } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Chercher par titre ou description..."
          onKeyUp={handleKeyUp}
          size='small'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faSearch} style={{ marginLeft: 8, color: 'gray' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: -24 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, amelioration, { inputValue }) => {
        const matchesName = match(amelioration.name, inputValue);
        const partsName = parse(amelioration.name, matchesName);

        const matchesDesc = amelioration.description ? match(amelioration.description, inputValue) : [];
        const partsDesc = amelioration.description ? parse(amelioration.description, matchesDesc) : [];

        return (
          <Box component="li" {...props} onClick={() => handleClick(amelioration.id)} key={amelioration.id}>
            <Avatar
              key={amelioration.id}
              alt={amelioration.name}
              variant="rounded"
              sx={{ mr: 1.5, width: 48, height: 48, flexShrink: 0, borderRadius: 1 }}
            />

            <div>
              {partsName.map((part, index) => (
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

              {amelioration.description && (
                <Typography variant="body2" color="text.secondary">
                  {partsDesc.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 'bold' : 'normal' }}>
                      {part.text}
                    </span>
                  ))}
                </Typography>
              )}
            </div>
          </Box>
        );
      }}
    />
  );
}
