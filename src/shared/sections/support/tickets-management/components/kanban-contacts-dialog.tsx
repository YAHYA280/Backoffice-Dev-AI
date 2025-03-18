import type { IKanbanAssignee } from 'src/contexts/types/kanban';

import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { _contacts } from 'src/shared/_mock';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { SearchNotFound } from 'src/shared/components/search-not-found';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

type Props = {
  open: boolean;
  onClose: () => void;
  assignee?: IKanbanAssignee | null; 
  onSelectAssignee: (assignee: IKanbanAssignee | null) => void;
};

export function KanbanContactsDialog({ assignee = null, open, onClose, onSelectAssignee }: Props) {
  const [searchContact, setSearchContact] = useState('');

  const handleSearchContacts = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchContact(event.target.value);
  }, []);

  const dataFiltered = applyFilter({ inputData: _contacts, query: searchContact });

  const notFound = !dataFiltered.length && !!searchContact;

  const handleAssign = (contact: IKanbanAssignee) => {
    onSelectAssignee(contact);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Contacts <Typography component="span">({_contacts.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchContact}
          onChange={handleSearchContacts}
          placeholder="Rechercher..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faSearch} style={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {notFound ? (
          <SearchNotFound query={searchContact} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 6, px: 2.5 }}>
            <Box component="ul">
              {dataFiltered.map((contact) => {
                const isAssigned = assignee?.id === contact.id;

                return (
                  <Box
                    component="li"
                    key={contact.id}
                    sx={{
                      gap: 2,
                      display: 'flex',
                      height: ITEM_HEIGHT,
                      alignItems: 'center',
                    }}
                  >
                    <Avatar src={contact.avatarUrl} />

                    <ListItemText
                      primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={contact.name}
                      secondary={contact.email}
                    />

                    <Button
                      size="small"
                      color={isAssigned ? 'primary' : 'inherit'}
                      startIcon={
                        <FontAwesomeIcon
                          width={16}
                          icon={isAssigned ? faCheck : faPlus}
                          style={{ marginRight: '-0.5rem' }}
                        />
                      }
                      onClick={() => handleAssign(contact)}
                    >
                      {isAssigned ? 'Assignée' : 'Attribuer'}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: IKanbanAssignee[];
};

function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    inputData = inputData.filter(
      (contact) =>
        contact.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        contact.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
