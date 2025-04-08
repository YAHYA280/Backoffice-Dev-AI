import type { Dayjs } from 'dayjs';
import type { IPermission } from 'src/shared/_mock/_permission';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { LocalizationProvider } from 'src/shared/locales';

// ----------------------------------------------------------------------

interface UserPermissionAddDialogProps {
  open: boolean;
  onClose: () => void;
  addPermission: (newRole: IPermission) => void;
}

export function UserPermissionAddDialog({
  open,
  onClose,
  addPermission,
}: UserPermissionAddDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (open) {
      setCreatedAt(dayjs());
    }
  }, [open]);

  // Handle form submit
  const handleSubmit = () => {
    if (name && description && roles.length > 0) {
      const newPermission: IPermission = {
        id: String(Math.floor(Math.random() * 1000000)),
        name,
        description,
        roles,
        createdAt: new Date(),
      };

      addPermission(newPermission);
      setName('');
      setDescription('');
      setRoles([]);
      setCreatedAt(dayjs());
      onClose();
    }
  };

  // Handle form close
  const handleClose = () => {
    setName('');
    setDescription('');
    setRoles([]);
    setCreatedAt(dayjs());
    onClose();
  };

  const isFormValid = name && description && roles.length > 0 && createdAt;

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une permission</DialogTitle>

        <DialogContent sx={{ pb: 2 }}>
          <Typography sx={{ mb: 3 }}>
            Veuillez renseigner les détails de la permission que vous souhaitez ajouter.
          </Typography>

          {/* Permission Name */}
          <TextField
            autoFocus
            fullWidth
            type="text"
            margin="dense"
            variant="outlined"
            label="Nom de la permission"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Description */}
          <TextField
            fullWidth
            margin="dense"
            variant="outlined"
            label="Description"
            multiline
            rows={4}
            sx={{ mt: 2 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Created At Date Picker */}
          <LocalizationProvider>
            <DatePicker
              label="Date de création"
              value={createdAt}
              onChange={(newValue) => setCreatedAt(newValue)}
              format="DD/MM/YYYY"
              sx={{
                width: '100%',
                mt: 3,
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'dense',
                },
              }}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            variant="contained"
            sx={{
              color: 'primary.contrastText',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Enregister
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
