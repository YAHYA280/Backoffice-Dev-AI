import type { Dayjs } from 'dayjs';
import type { SelectChangeEvent } from '@mui/material';
import type { IRoleItem } from 'src/contexts/types/role';

import dayjs from 'dayjs';
import { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Chip,
  Stack,
  alpha,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
} from '@mui/material';

import { LocalizationProvider } from 'src/shared/locales';

import { toast } from 'src/shared/components/snackbar';

// ----------------------------------------------------------------------

interface AddRoleFormDialogProps {
  open: boolean;
  onClose: () => void;
  addRole: (newRole: IRoleItem) => void;
}

export function AddRoleFormDialog({ open, onClose, addRole }: AddRoleFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<Dayjs | null>(dayjs());
  const ITEM_HEIGHT = 48;
  const allPermissions = [
    { label: 'Administration', value: 'Administration' },
    { label: 'Lecture', value: 'Lecture' },
    { label: 'Écriture', value: 'Écriture' },
    { label: 'Suppression', value: 'Suppression' },
    { label: 'Export', value: 'Export' },
    { label: 'Import', value: 'Import' },
  ];

  const handlePermissionChange = (event: SelectChangeEvent<typeof permissions>) => {
    const {
      target: { value },
    } = event;

    setPermissions(typeof value === 'string' ? value.split(',') : value);
  };

  // Handle chip deletion
  const handleDeleteChip = (permissionToDelete: string) => {
    setPermissions((currentPermissions) =>
      currentPermissions.filter((permission) => permission !== permissionToDelete)
    );
  };

  // Handle form submit
  const handleSubmit = () => {
    if (name && description && permissions.length > 0 && createdAt) {
      const newRole: IRoleItem = {
        id: String(Math.floor(Math.random() * 1000000)),
        name,
        description,
        permissionLevel: permissions,
        createdAt: createdAt.toDate(),
      };
      const promise = new Promise((resolve) => setTimeout(resolve, 1000));

      toast.promise(promise, {
        loading: 'Chargement...',
        success: 'Ajout du rôle avec succès!',
        error: "Échec de l'ajout du rôle!",
      });

      addRole(newRole);
      setName('');
      setDescription('');
      setPermissions([]);
      setCreatedAt(dayjs());
      onClose();
    }
  };

  // Handle form close
  const handleClose = () => {
    setName('');
    setDescription('');
    setPermissions([]);
    setCreatedAt(dayjs());
    onClose();
  };

  const isFormValid = name && description && permissions.length > 0 && createdAt;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: (theme) => `0 16px 32px 0 ${alpha(theme.palette.primary.dark, 0.12)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Ajouter un rôle
          </Typography>
        </Stack>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          sx={{
            bgcolor: 'background.paper',
            boxShadow: (theme) => `0 2px 8px 0 ${alpha(theme.palette.common.black, 0.08)}`,
            py: '2px',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'background.default',
              transform: 'translateY(-2px)',
              boxShadow: (theme) => `0 4px 12px 0 ${alpha(theme.palette.common.black, 0.12)}`,
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ p: 3, pt: 3, bgcolor: (theme) => alpha(theme.palette.background.default, 0.4) }}
      >
        <Typography sx={{ mb: 3, mt: 3, color: 'text.secondary', fontWeight: 500 }}>
          Veuillez renseigner les détails du rôle que vous souhaitez ajouter.
        </Typography>

        {/* Role Name */}
        <TextField
          autoFocus
          fullWidth
          type="text"
          margin="dense"
          variant="outlined"
          label="Nom du rôle"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            mt: 1,
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
        />

        {/* Description */}
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          label="Description"
          multiline
          rows={4}
          sx={{
            mt: 1,
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Permissions as Select with Tags */}
        <FormControl
          fullWidth
          sx={{
            mt: 2,
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
        >
          <InputLabel id="permissions-select-label">Permissions</InputLabel>
          <Select
            labelId="permissions-select-label"
            id="permissions-select"
            multiple
            value={permissions}
            onChange={handlePermissionChange}
            input={<OutlinedInput label="Permissions" sx={{ borderRadius: 1.5 }} />}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              PaperProps: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  borderRadius: 8,
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                },
              },
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={allPermissions.find((p) => p.value === value)?.label || value}
                    size="small"
                    onDelete={() => handleDeleteChip(value)}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 600,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  />
                ))}
              </Box>
            )}
            sx={{
              minHeight: '56p',
              '& .MuiOutlinedInput-input': {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                padding: '14px',
                height: 'auto',
              },
            }}
          >
            {allPermissions.map((permission) => (
              <MenuItem
                key={permission.value}
                value={permission.value}
                sx={{
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.5,
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                  '&.Mui-selected': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    },
                  },
                }}
              >
                {permission.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Created At Date Picker */}
        <LocalizationProvider>
          <DatePicker
            label="Date de création"
            value={createdAt}
            onChange={(newValue) => setCreatedAt(newValue)}
            format="DD/MM/YYYY"
            sx={{
              width: '100%',
              mt: 1,
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

      <DialogActions
        sx={{
          p: 2.5,
          px: 3,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
          borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s',
            borderColor: (theme) => alpha(theme.palette.divider, 0.5),
            '&:hover': {
              borderColor: 'divider',
              bgcolor: (theme) => alpha(theme.palette.divider, 0.08),
            },
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: (theme) => `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: 'all 0.2s',
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
  );
}
