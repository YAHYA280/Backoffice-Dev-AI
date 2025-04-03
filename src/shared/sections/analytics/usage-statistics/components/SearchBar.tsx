import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { FontAwesome } from 'src/shared/components/fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: 2,
      }}
    >
      <IconButton disabled sx={{ px: 2 }}>
        <FontAwesome icon={faSearch} width={24} />
      </IconButton>

      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Rechercher par nom d'utilisateur, niveau, ou statut"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {searchValue && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Effacer">
            <IconButton onClick={handleClear} edge="end">
              <FontAwesome icon={faXmark} width={20} />
            </IconButton>
          </Tooltip>
          <Divider sx={{ height: 28, mx: 0.5 }} orientation="vertical" />
        </Box>
      )}

      <Tooltip title="Rechercher">
        <IconButton
          color="primary"
          sx={{ p: '10px' }}
          onClick={handleSearch}
          aria-label="rechercher"
        >
          <FontAwesome icon={faSearch} width={20} />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
