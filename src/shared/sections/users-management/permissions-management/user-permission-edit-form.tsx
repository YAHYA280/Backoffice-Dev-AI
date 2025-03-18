import type { IPermission } from 'src/shared/_mock/_permission';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Chip,
  alpha,
  Select,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
 FormControl , OutlinedInput } from '@mui/material';

import roleData from 'src/shared/_mock/_role';
import { LocalizationProvider } from 'src/shared/locales';

import { toast } from 'src/shared/components/snackbar';



// ----------------------------------------------------------------------

export type PermissionEditSchemaType = zod.infer<typeof PermissionQuickEditSchema>;

export const PermissionQuickEditSchema = zod.object({
  id: zod.string().min(1, { message: 'Permission ID is required!' }),
  name: zod.string().min(1, { message: 'Permission name is required!' }),
  description: zod.string().min(1, { message: 'Permission description is required!' }),
  roles: zod.array(zod.string()).min(1, { message: 'At least one role is required!' }),
  createdAt: zod.date().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentPermission?: IPermission | null;
  onUpdatePermission: (updatedPermission: IPermission) => void;
};

export function UserPermissionEditDialog({
  currentPermission,
  open,
  onClose,
  onUpdatePermission,
}: Props) {
  const defaultValues = useMemo(
    () => ({
      id: currentPermission?.id || '',
      name: currentPermission?.name || '',
      description: currentPermission?.description || '',
      roles: currentPermission?.roles || [],
      createdAt: currentPermission?.createdAt,
    }),
    [currentPermission]
  );

  const allRoles = roleData.map((role) => role.name);

  const methods = useForm<PermissionEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(PermissionQuickEditSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue, watch } = methods;

  const currentRoles = watch('roles');

  useEffect(() => {
    if (currentPermission) {
      reset(defaultValues);
    }
  }, [currentPermission, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      onUpdatePermission({
        id: data.id,
        name: data.name,
        description: data.description,
        roles: data.roles,
        createdAt: currentPermission?.createdAt || new Date(),
      });
    } catch (error) {
      console.error(error);
    }
  });

  const handleDeleteRole = (roleToDelete: string) => {
    const updatedRoles = currentRoles.filter((role) => role !== roleToDelete);

    setValue('roles', updatedRoles, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            color: 'primary.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Modifier la permission</Typography>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pb: 2, mt: 2}}>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Modifier les détails de la permission
          </Alert>

          {/* Permission Name */}
          <Controller
            name="name"
            control={methods.control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                fullWidth
                type="text"
                margin="dense"
                variant="outlined"
                label="Nom de la permission"
                name="name"
              />
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={methods.control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="dense"
                variant="outlined"
                label="Description"
                multiline
                name="description"
                rows={4}
                sx={{ mt: 2 }}
              />
            )}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="permissions-select-label">Rôles</InputLabel>
            <Controller
              name="roles"
              control={methods.control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  labelId="roles-select-label"
                  value={field.value || []}
                  onChange={(event) => field.onChange(event.target.value)}
                  input={<OutlinedInput label="Rôles" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          onDelete={() => handleDeleteRole(value)}
                          onMouseDown={(event) => {
                            event.stopPropagation();
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    minHeight: 56,
                    '& .MuiOutlinedInput-input': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      padding: '14px',
                      height: 'auto',
                    },
                  }}
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
                        maxHeight: 190,
                      },
                    },
                  }}
                >
                  {allRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Date de création */}
          <Controller
            name="createdAt"
            control={methods.control}
            render={({ field }) => (
              <LocalizationProvider>
                <DatePicker
                  label="Date de création"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(newValue) => field.onChange(newValue?.toDate())}
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
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Annuler
          </Button>
          <Button onClick={onSubmit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
