import { faUser, faChild } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';

import { FontAwesome } from 'src/shared/components/fontawesome';

// ----------------------------------------------------------------------

type Props = {
  view: 'children' | 'parents';
  onViewChange: (view: 'children' | 'parents') => void;
};

export default function ViewToggle({ view, onViewChange }: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">Afficher:</Typography>
        <ButtonGroup variant="outlined" aria-label="Sélecteur Enfants / Parents">
          <Button
            startIcon={<FontAwesome icon={faChild} />}
            variant={view === 'children' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('children')}
            sx={{ px: 3 }}
          >
            Enfants
          </Button>
          <Button
            startIcon={<FontAwesome icon={faUser} />}
            variant={view === 'parents' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('parents')}
            sx={{ px: 3 }}
          >
            Parents
          </Button>
        </ButtonGroup>
      </Stack>
    </Box>
  );
}
