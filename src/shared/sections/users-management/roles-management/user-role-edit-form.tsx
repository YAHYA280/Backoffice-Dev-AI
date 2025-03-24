import type { IRoleItem } from 'src/contexts/types/role';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { m } from 'framer-motion';
import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Chip,
  List,
  Stack,
  alpha,
  Paper,
  Button,
  Drawer,
  Select,
  MenuItem,
  useTheme,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  ListItemText,
  OutlinedInput,
} from '@mui/material';

import { allPermissions } from 'src/shared/_mock/_role';
import { LocalizationProvider } from 'src/shared/locales';

import { toast } from 'src/shared/components/snackbar';
import { varFade } from 'src/shared/components/animate/variants/fade';

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

export function UserRoleEditDrawer({ currentRole, open, onClose, onUpdateRole }: Props) {
  const theme = useTheme();

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
        success: 'Mise à jour réussie!',
        error: 'Erreur de mise à jour!',
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
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
          p: 0,
          boxShadow: theme.customShadows?.z16,
          overflowY: 'auto',
        },
      }}
    >
      {/* Header with background and icon */}
      <Box
        component={m.div}
        initial="initial"
        animate="animate"
        variants={varFade().in}
        sx={{
          p: 3,
          pb: 5,
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.8)} 0%, ${alpha(
            theme.palette.primary.main,
            0.8
          )} 100%)`,
          color: 'white',
        }}
      >
        <IconButton
          onClick={handleClose}
          edge="end"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              Modifier rôle
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={currentRole?.name || 'NAME'}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ p: 3 }}>
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Modifier les détails du rôle
          </Typography>
          <Typography variant="body2">
            Vous pouvez modifier les informations et les permissions du rôle.
          </Typography>
        </Paper>

        {/* Form content */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <List
            sx={{
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows?.z1,
              borderRadius: 2,
              overflow: 'hidden',
              mb: 3,
            }}
          >
            <ListItemText
              sx={{ px: 3, py: 2 }}
              primary={
                <Typography variant="subtitle1" fontWeight="fontWeightBold">
                  Informations principales
                </Typography>
              }
            />

            <Box sx={{ px: 3, pb: 3 }}>
              {/* Role Name */}
              <Controller
                name="name"
                control={methods.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    variant="outlined"
                    label="Nom du rôle"
                    name="name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      sx: { borderRadius: 1.5 },
                    }}
                    sx={{ mb: 2.5 }}
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
                    sx={{ mb: 2.5 }}
                  />
                )}
              />

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
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'dense',
                          error: !!errors.createdAt,
                          helperText: errors.createdAt?.message,
                        },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          </List>

          {/* Permissions Section */}
          <List
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade().inUp}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows?.z1,
              borderRadius: 2,
              overflow: 'hidden',
              mb: 3,
            }}
          >
            <ListItemText
              sx={{ px: 3, py: 2 }}
              primary={
                <Typography variant="subtitle1" fontWeight="fontWeightBold">
                  Permissions
                </Typography>
              }
            />

            <Box sx={{ px: 3, pb: 3 }}>
              <FormControl fullWidth error={!!errors.permissionLevel}>
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
                                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                                color: 'primary.main',
                                fontWeight: 600,
                                borderRadius: 1,
                                '&:hover': {
                                  bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
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
                        },
                      }}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        PaperProps: {
                          style: {
                            maxHeight: 190,
                            borderRadius: 12,
                          },
                        },
                      }}
                    >
                      {allPermissions.map((permission) => (
                        <MenuItem
                          key={permission}
                          value={permission}
                          sx={{
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.5,
                            '&:hover': {
                              bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                            },
                            '&.Mui-selected': {
                              bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                              '&:hover': {
                                bgcolor: (t) => alpha(t.palette.primary.main, 0.16),
                              },
                            },
                          }}
                        >
                          {permission}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.permissionLevel ? (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.permissionLevel.message}
                  </Typography>
                ) : (
                  <></>
                )}
              </FormControl>
            </Box>
          </List>
        </Box>

        {/* Action buttons */}
        <Box
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
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
              color: 'primary.contrastText',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
