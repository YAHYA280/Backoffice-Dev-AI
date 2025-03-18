import type { UniqueIdentifier } from '@dnd-kit/core';

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

import type { IKanbanTask } from '../types/kanban';

type Props = {
  query: string;
  loading?: boolean;
  results: IKanbanTask[];
  onSearch: (inputValue: string) => void;
};

export function ModerationSearch({ query, results, onSearch, loading }: Props) {
  const handleClick = (id: UniqueIdentifier) => {
    console.log("Navigating to task:", id);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query && event.key === 'Enter') {
      const selectItem = results.find((task) =>
        task.name.toLowerCase().includes(query.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
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
      renderOption={(props, task, { inputValue }) => {
        const matchesName = match(task.name, inputValue);
        const partsName = parse(task.name, matchesName);

        const matchesDesc = task.description ? match(task.description, inputValue) : [];
        const partsDesc = task.description ? parse(task.description, matchesDesc) : [];

        return (
          <Box component="li" {...props} onClick={() => handleClick(task.id)} key={task.id}>
            <Avatar
              key={task.id}
              alt={task.name}
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
                  {part.text ? part.text : <></>}
                </Typography>
              ))}

              {task.description ? (
                <Typography variant="body2" color="text.secondary">
                  {partsDesc.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 'bold' : 'normal' }}>
                      {part.text ? part.text : <></>}
                    </span>
                  ))}
                </Typography>
              ) : <></>}
            </div>
          </Box>
        );
      }}
    />
  );
}