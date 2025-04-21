import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faPaperclip } from '@fortawesome/free-solid-svg-icons';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function KanbanDetailsCommentInput() {
  const { user } = useMockedUser();

  return (
    <Stack direction="row" spacing={2} sx={{ py: 3, px: 2.5 }}>
      <Avatar src={user?.photoURL} alt={user?.displayName}>
        {user?.displayName?.charAt(0).toUpperCase()}
      </Avatar>

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1, bgcolor: 'transparent' }}>
        <InputBase fullWidth multiline rows={2} placeholder="Type a message" sx={{ px: 1 }} />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" flexGrow={1}>
          <IconButton>
            <FontAwesomeIcon icon={faImages} />
          </IconButton>

          <IconButton>
            <FontAwesomeIcon icon={faPaperclip} />
          </IconButton>
          </Stack>

          <Button variant="contained">Commenter</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
