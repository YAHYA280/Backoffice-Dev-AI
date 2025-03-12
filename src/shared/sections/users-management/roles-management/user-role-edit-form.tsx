import type { IRoleItem } from 'src/contexts/types/role';

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
  FormControl,
  OutlinedInput,
} from '@mui/material';

import { allPermissions } from 'src/shared/_mock/_role';
import { LocalizationProvider } from 'src/shared/locales';

import { toast } from 'src/shared/components/snackbar';

// ----------------------------------------------------------------------

export type RoleEditSchemaType = zod.infer<typeof RoleQuickEditSchema>;

export const RoleQuickEditSchema = zod.object({
  id: zod.string().min(1, { message: 'Role ID is required!' }),
  name: zod.string().min(1, { message: 'Role name is required!' }),
  description: zod.string().min(1, { message: 'Role description is required!' }),
  permissionLevel: zod
    .array(zod.string())
    .min(1, { message: 'At least one permission level is required!' }),
  createdAt: zod.date({ required_error: 'Creation date is required!' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentRole?: IRoleItem | null;
  onUpdateRole: (updatedRole: IRoleItem) => void;
};

export function UserRoleEditForm({ currentRole, open, onClose, onUpdateRole }: Props) {
  const defaultValues = useMemo(
    () => ({
      id: currentRole?.id || '',
      name: currentRole?.name || '',
      description: currentRole?.description || '',
      permissionLevel: currentRole?.permissionLevel || [],
      createdAt: currentRole?.createdAt ? new Date(currentRole.createdAt) : new Date(),
    }),
    [currentRole]
  );

  const methods = useForm<RoleEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(RoleQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const currentPermissions = watch('permissionLevel');

  useEffect(() => {
    if (currentRole) {
      reset(defaultValues);
    }
  }, [currentRole, reset, defaultValues]);

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

      onUpdateRole({
        id: data.id,
        name: data.name,
        description: data.description,
        permissionLevel: data.permissionLevel,
        createdAt: data.createdAt,
      });
    } catch (error) {
      console.error(error);
    }
  });

  // Function to handle deletion of a permission tag
  const handleDeletePermission = (permissionToDelete: string) => {
    const updatedPermissions = currentPermissions.filter(
      (permission) => permission !== permissionToDelete
    );

    setValue('permissionLevel', updatedPermissions, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
            overflow: 'hidden',
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
            color: 'primary.main',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Modifier le rôle</Typography>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Alert
            variant="outlined"
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 1.5,
              '& .MuiAlert-icon': {
                color: 'primary.main',
              },
            }}
          >
            Modifier les détails du rôle
          </Alert>

          {/* Role Name */}
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
                label="Nom du rôle"
                name="name"
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
                sx={{ mb: 1 }}
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
                error={!!errors.description}
                helperText={errors.description?.message}
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
                sx={{ mt: 1, mb: 1 }}
              />
            )}
          />

          {/* Permissions */}
          <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.permissionLevel}>
            <InputLabel id="permissions-select-label">Permissions</InputLabel>
            <Controller
              name="permissionLevel"
              control={methods.control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  labelId="permissions-select-label"
                  value={field.value || []}
                  onChange={(event) => field.onChange(event.target.value)}
                  input={<OutlinedInput label="Permissions" sx={{ borderRadius: 1.5 }} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          onDelete={() => handleDeletePermission(value)}
                          onMouseDown={(event) => {
                            event.stopPropagation();
                          }}
                          sx={{
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontWeight: 500,
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
                    minHeight: 56,
                    '& .MuiOutlinedInput-input': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.5,
                      padding: '14px',
                      height: 'auto',
                      minHeight: '42px',
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
                        borderRadius: 12,
                        marginTop: 8,
                      },
                    },
                  }}
                >
                  {allPermissions.map((permission) => (
                    <MenuItem key={permission} value={permission}>
                      {permission}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.permissionLevel && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.permissionLevel.message}
              </Typography>
            )}
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

        <DialogActions
          sx={{ p: 2.5, bgcolor: (theme) => alpha(theme.palette.background.default, 0.4) }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 1.5,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            sx={{
              borderRadius: 1.5,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 2,
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
  );
}
