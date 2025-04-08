import type { Dayjs } from 'dayjs';
import type { SelectChangeEvent } from '@mui/material';
import type { IRoleItem } from 'src/contexts/types/role';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
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
  Table,
  Paper,
  Select,
  Checkbox,
  TableRow,
  MenuItem,
  FormGroup,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  InputLabel,
  FormControl,
  OutlinedInput,
  TableContainer,
  FormControlLabel,
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
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedModulesForPermission, setSelectedModulesForPermission] = useState<string[]>([]);
  const [modulePermissions, setModulePermissions] = useState<{ [key: string]: string[] }>({});
  const [createdAt, setCreatedAt] = useState<Dayjs | null>(dayjs());
  const [tempPermissions, setTempPermissions] = useState<string[]>([]);
  const ITEM_HEIGHT = 48;

  const allModules = [
    { label: 'Acceuil', value: 'Acceuil' },
    { label: "Statistiques d'usage ", value: "Statistiques d'usage " },
    { label: 'Performances ', value: 'Performances ' },
    { label: 'Suivi des erreurs ', value: 'Suivi des erreurs ' },
    { label: 'Logs', value: 'Logs' },
    { label: 'Utilisateurs', value: 'Utilisateurs' },
    { label: 'Comptes', value: 'Comptes' },
    { label: 'Rôles', value: 'Rôles' },
    { label: 'Permissions', value: 'Permissions' },
    { label: "Gestion d'apprentissage ", value: "Gestion d'apprentissage " },
    { label: 'Gestion des challenges ', value: 'Gestion des challenges ' },
    { label: 'Ressources multimedias ', value: 'Ressources multimedias ' },
    { label: 'Gestion des ameliorations', value: 'Gestion des ameliorations' },
    { label: 'Gestion des plans ', value: 'Gestion des plans ' },
    { label: 'Suivi & Facturation', value: 'Suivi & Facturation' },
    { label: 'Notifications', value: 'Notifications' },
    { label: 'Gestion des FAQs ', value: 'Gestion des FAQs ' },
    { label: 'Gestion des tickets ', value: 'Gestion des tickets ' },
    { label: 'Configuration du chatbot', value: 'Configuration du chatbot' },
    { label: 'Configurations', value: 'Configurations' },
    { label: 'Tableau de bord', value: 'Tableau de bord' },
    { label: 'Gestion des assistants', value: 'Gestion des assistants' },
    { label: 'Moderation et signalement', value: 'Moderation et signalement' },
  ];
  const allPermissions = [
    { label: 'Administration', value: 'Administration' },
    { label: 'Lecture', value: 'Lecture' },
    { label: 'Écriture', value: 'Écriture' },
    { label: 'Suppression', value: 'Suppression' },
    { label: 'Export', value: 'Export' },
    { label: 'Import', value: 'Import' },
  ];

  // Réinitialiser les modules sélectionnés pour les permissions quand la liste des modules change
  useEffect(() => {
    // Supprimer les modules qui ne sont plus dans selectedModules de selectedModulesForPermission
    setSelectedModulesForPermission((prev) =>
      prev.filter((module) => selectedModules.includes(module))
    );
  }, [selectedModules]);

  const handleModuleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newSelectedModules = typeof value === 'string' ? value.split(',') : value;

    setSelectedModules(newSelectedModules);

    // Identifier les modules supprimés
    const removedModules = selectedModules.filter((module) => !newSelectedModules.includes(module));

    // Mettre à jour modulePermissions en supprimant les modules qui ont été retirés
    if (removedModules.length > 0) {
      setModulePermissions((prevPermissions) => {
        const updatedPermissions = { ...prevPermissions };
        removedModules.forEach((module) => {
          delete updatedPermissions[module];
        });
        return updatedPermissions;
      });
    }
  };

  // Fonction pour supprimer un module spécifique du chip
  const handleDeleteModule = (moduleToDelete: string) => {
    // Supprimer de selectedModules
    setSelectedModules(selectedModules.filter((module) => module !== moduleToDelete));

    // Supprimer de selectedModulesForPermission
    setSelectedModulesForPermission((prev) => prev.filter((module) => module !== moduleToDelete));

    // Supprimer de modulePermissions
    setModulePermissions((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions };
      delete updatedPermissions[moduleToDelete];
      return updatedPermissions;
    });
  };

  const handleModuleSelectionForPermission = (module: string) => {
    setSelectedModulesForPermission((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const handleTempPermissionChange = (permission: string) => {
    setTempPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((p) => p !== permission)
        : [...prevPermissions, permission]
    );
  };

  const handleApplyPermissions = () => {
    if (selectedModulesForPermission.length === 0 || tempPermissions.length === 0) {
      return;
    }

    const updatedPermissions = { ...modulePermissions };
    selectedModulesForPermission.forEach((module) => {
      updatedPermissions[module] = [...tempPermissions];
    });
    setModulePermissions(updatedPermissions);

    // Réinitialiser les sélections temporaires
    setSelectedModulesForPermission([]);
    setTempPermissions([]);
  };

  const handleSubmit = () => {
    if (name && description && Object.keys(modulePermissions).length > 0 && createdAt) {
      const flatPermissions: string[] = [];

      Object.entries(modulePermissions).forEach(([module, permissions]) => {
        permissions.forEach((permission) => {
          flatPermissions.push(`${module}:${permission}`);
        });
      });

      const newRole: IRoleItem = {
        id: String(Math.floor(Math.random() * 1000000)),
        name,
        description,
        permissionLevel: flatPermissions,
        createdAt: createdAt.toDate(),
      };

      const promise = new Promise((resolve) => setTimeout(resolve, 1000));

      toast.promise(promise, {
        loading: 'Chargement...',
        success: 'Ajout du rôle avec succès!',
        error: "Échec de l'ajout du rôle!",
      });

      addRole(newRole);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedModules([]);
    setSelectedModulesForPermission([]);
    setModulePermissions({});
    setTempPermissions([]);
    setCreatedAt(dayjs());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = name && description && Object.keys(modulePermissions).length > 0 && createdAt;

  // Rendre les permissions actuelles pour un module
  const renderCurrentPermissions = (module: string) => {
    const permissions = modulePermissions[module] || [];
    if (permissions.length === 0) {
      return 'Aucune permission';
    }
    return permissions
      .map((p) => allPermissions.find((item) => item.value === p)?.label || p)
      .join(', ');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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

        {/* Module Selection */}
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
          <InputLabel id="modules-select-label">Modules</InputLabel>
          <Select
            labelId="modules-select-label"
            id="modules-select"
            multiple
            value={selectedModules}
            onChange={handleModuleChange}
            input={<OutlinedInput label="Modules" sx={{ borderRadius: 1.5 }} />}
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
                    label={allModules.find((m) => m.value === value)?.label || value}
                    size="small"
                    onDelete={() => handleDeleteModule(value)}
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
              minHeight: '56px',
              '& .MuiOutlinedInput-input': {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                padding: '14px',
                height: 'auto',
              },
            }}
          >
            {allModules.map((module) => (
              <MenuItem
                key={module.value}
                value={module.value}
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
                <Checkbox checked={selectedModules.includes(module.value)} />
                {module.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Configuration des permissions */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Configuration des permissions
        </Typography>

        {/* Tableau des permissions existantes */}
        {Object.keys(modulePermissions).length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Module</TableCell>
                  <TableCell>Permissions attribuées</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(modulePermissions).map((module) => (
                  <TableRow key={module}>
                    <TableCell>
                      {allModules.find((m) => m.value === module)?.label || module}
                    </TableCell>
                    <TableCell>{renderCurrentPermissions(module)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Sélection de modules et permissions */}
        {selectedModules.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Modules Disponibles</TableCell>
                  <TableCell>Permissions à Attribuer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ verticalAlign: 'top' }}>
                    <FormGroup>
                      {selectedModules.map((module) => (
                        <FormControlLabel
                          key={module}
                          control={
                            <Checkbox
                              checked={selectedModulesForPermission.includes(module)}
                              onChange={() => handleModuleSelectionForPermission(module)}
                            />
                          }
                          label={allModules.find((m) => m.value === module)?.label || module}
                        />
                      ))}
                    </FormGroup>
                  </TableCell>
                  <TableCell style={{ verticalAlign: 'top' }}>
                    <FormGroup>
                      {allPermissions.map((permission) => (
                        <FormControlLabel
                          key={permission.value}
                          control={
                            <Checkbox
                              checked={tempPermissions.includes(permission.value)}
                              onChange={() => handleTempPermissionChange(permission.value)}
                            />
                          }
                          label={permission.label}
                        />
                      ))}
                    </FormGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Apply Permissions Button */}
        {selectedModules.length > 0 && (
          <Button
            onClick={handleApplyPermissions}
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            disabled={selectedModulesForPermission.length === 0 || tempPermissions.length === 0}
          >
            Appliquer les permissions
          </Button>
        )}

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
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
