import type { ICGUCard } from 'src/contexts/types/configuration';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { useRouter } from 'src/routes/hooks';

import { SearchNotFound } from 'src/shared/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: ICGUCard[];
  onSearch: (inputValue: string) => void;
  hrefItem: (title: string) => string;
  loading?: boolean;
};

export function ConfigurationSearch({ query, results, onSearch, hrefItem, loading }: Props) {
  const router = useRouter();

  const theme = useTheme();

  const handleClick = (title: string) => {
    router.push(hrefItem(title));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query && results.length > 0) {
      if (event.key === 'Enter') {
        handleClick(results[0].id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: '100%', sm: 320 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={query} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: { minWidth: 320, maxWidth: { xs: '90vw', sm: 400 } },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
              py: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Rechercher..."
          onKeyUp={handleKeyUp}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ marginLeft: '8px', color: theme.palette.primary.main }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    style={{ marginRight: '-16px', color: 'text.secondary' }}
                  />
                ) : (
                  <> </>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          size="small"
        />
      )}
      renderOption={(props, cgu, { inputValue }) => {
        const matches = match(cgu.title, inputValue);
        const parts = parse(cgu.title, matches);

        return (
          <li {...props} key={cgu.id}>
            <Avatar
              key={cgu.id}
              alt={cgu.title}
              src={
                typeof cgu.author.avatarUrl === 'string'
                  ? cgu.author.avatarUrl
                  : cgu.author.avatarUrl instanceof File
                    ? URL.createObjectURL(cgu.author.avatarUrl)
                    : undefined
              }
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <Link
              key={inputValue}
              underline="none"
              onClick={() => handleClick(cgu.title)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <Typography
                component="div"
                sx={{
                  typography: 'body2',
                  fontWeight: 'fontWeightMedium',
                }}
              >
                {parts.map((part, index) => (
                  <Typography
                    key={index}
                    component="span"
                    color={part.highlight ? 'primary.main' : 'textPrimary'}
                    sx={{
                      typography: 'body2',
                      fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                    }}
                  >
                    {part.text}
                  </Typography>
                ))}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  mt: 0.5,
                }}
              >
                Version {cgu.version} •{' '}
                {cgu.publishDate
                  ? new Date(cgu.publishDate).toLocaleDateString()
                  : 'No publish date available'}
              </Typography>
            </Link>
          </li>
        );
      }}
    />
  );
}
