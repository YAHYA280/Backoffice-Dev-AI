'use client';

import type { Dayjs } from 'dayjs';
import type { SelectChangeEvent } from '@mui/material';
import type { IRoleItem } from 'src/contexts/types/role';

import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  alpha,
  Paper,
  Button,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Container,
  FormGroup,
  Accordion,
  Typography,
  InputLabel,
  FormControl,
  ListItemText,
  OutlinedInput,
  LinearProgress,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import roleData from 'src/shared/_mock/_role';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

const ITEM_HEIGHT = 48;
const MAX_CHIPS = 5;

export default function UserRoleEditPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.id as string;

  const [currentRole, setCurrentRole] = useState<IRoleItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createdAt, setCreatedAt] = useState<Dayjs | null>(dayjs());

  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [modulePermissions, setModulePermissions] = useState<{ [key: string]: string[] }>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const confirmCancel = useBoolean();

  // For "Show More" in the permissions area
  const [visibleCount, setVisibleCount] = useState(5);

  // Example modules array
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

  // Permissions array
  const allPermissions = [
    { label: 'Administration', value: 'Administration' },
    { label: 'Lecture', value: 'Lecture' },
    { label: 'Écriture', value: 'Écriture' },
    { label: 'Suppression', value: 'Suppression' },
    { label: 'Export', value: 'Export' },
    { label: 'Import', value: 'Import' },
  ];

  const visibleModules = selectedModules.slice(0, visibleCount);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const role = roleData.find((r) => r.id === roleId);
        if (role) {
          setCurrentRole(role);
          setName(role.name);
          setDescription(role.description);
          setCreatedAt(dayjs(role.createdAt));

          const modules: string[] = [];
          const permissions: { [key: string]: string[] } = {};
          role.modulePermissions.forEach((item) => {
            modules.push(item.module);
            permissions[item.module] = item.permissions;
          });

          setSelectedModules(modules);
          setModulePermissions(permissions);
        } else {
          toast.error('Rôle non trouvé!');
          router.push(paths.dashboard.users.roles);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
        toast.error('Une erreur est survenue lors du chargement du rôle');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRole();
  }, [roleId, router]);

  useEffect(() => {
    setModulePermissions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((mod) => {
        if (!selectedModules.includes(mod)) {
          delete updated[mod];
        }
      });
      return updated;
    });
  }, [selectedModules]);

  const handleModuleChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const newSelected = typeof value === 'string' ? value.split(',') : value;
    setSelectedModules(newSelected);
  };

  const handleDeleteModule = (moduleToDelete: string) => {
    setSelectedModules((prev) => prev.filter((m) => m !== moduleToDelete));
    setModulePermissions((prev) => {
      const updated = { ...prev };
      delete updated[moduleToDelete];
      return updated;
    });
  };

  const handlePermissionToggle = (module: string, permission: string) => {
    setModulePermissions((prev) => {
      const current = prev[module] || [];
      if (current.includes(permission)) {
        return { ...prev, [module]: current.filter((p) => p !== permission) };
      }
      return { ...prev, [module]: [...current, permission] };
    });
  };

  const handleToggleAll = (module: string) => {
    const current = modulePermissions[module] || [];
    if (current.length === allPermissions.length) {
      setModulePermissions((prev) => ({ ...prev, [module]: [] }));
    } else {
      setModulePermissions((prev) => ({
        ...prev,
        [module]: allPermissions.map((p) => p.value),
      }));
    }
  };

  const isFormValid =
    name && description && Object.keys(modulePermissions).length > 0 && createdAt;

  const handleSubmit = async () => {
    if (!isFormValid || !currentRole) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Mise à jour du rôle avec succès!');
      router.push(paths.dashboard.users.roles);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du rôle');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    confirmCancel.onTrue();
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <Container maxWidth="lg">
          <Card sx={{ p: 3, position: 'relative' }}>
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            />
            <Box
              sx={{
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Chargement du rôle...
              </Typography>
            </Box>
          </Card>
        </Container>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier un rôle"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Utilisateurs', href: paths.dashboard.users.root },
          { name: 'Gestion des rôles', href: paths.dashboard.users.roles },
          { name: currentRole?.name || 'Modifier' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Container maxWidth="lg">
        <Card sx={{ p: 3, position: 'relative' }}>
          {isSaving && (
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            />
          )}

          <Grid container spacing={3}>
            {/* Role Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                label="Nom du rôle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                      },
                    },
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                      },
                    },
                  },
                }}
              />
            </Grid>

            {/* Modules List - White rows, only checkbox colored */}
            <Grid item xs={12}>
            <FormControl
    fullWidth
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 1.5,
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
      },
    }}
  >
                <InputLabel id="modules-select-label">Modules</InputLabel>
    <Select
      labelId="modules-select-label"
      multiple
      value={selectedModules}
      onChange={handleModuleChange}
      input={<OutlinedInput label="Modules" sx={{ borderRadius: 1.5 }} />}
      renderValue={(selected) => {
        const selArr = selected as string[];
        const displayed = selArr.slice(0, MAX_CHIPS);
        const hiddenCount = selArr.length - displayed.length;
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {displayed.map((mod) => (
              <Chip
                key={mod}
                label={allModules.find((m) => m.value === mod)?.label || mod}
                onDelete={() => handleDeleteModule(mod)}
                onMouseDown={(e) => e.stopPropagation()}
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
            {hiddenCount > 0 && (
              <Chip
                label={`+${hiddenCount}...`}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                  color: 'primary.main',
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              />
            )}
          </Box>
        );
      }}
      MenuProps={{
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
        PaperProps: {
          style: { 
            maxHeight: ITEM_HEIGHT * 6.5,
            marginTop: 8 // Ensure dropdown appears right below the select field
          },
        },
        // Ensure the dropdown appears directly beneath the select component
        disableScrollLock: true,
      }}
      sx={{
        minHeight: '56px',
        '& .MuiOutlinedInput-input': {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          padding: '14px',
        },
      }}
    >
      {allModules.map((module) => (
        <MenuItem
          key={module.value}
          value={module.value}
          sx={{
            borderRadius: 0, // Remove border radius
            py: 0.75,
            my: 0, // Remove vertical margin
            mx: 0, // Remove horizontal margin
            backgroundColor: 'transparent', // Ensure transparent background
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.1), // Very subtle hover
            },
            '&.Mui-selected': {
              backgroundColor: 'transparent', // No background when selected
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.1),
              },
            },
          }}
        >
          <Checkbox
            checked={selectedModules.includes(module.value)}
            sx={{
              color: (theme) => theme.palette.text.secondary,
              '&.Mui-checked': { color: 'primary.main' },
            }}
          />
          <ListItemText
            primary={module.label}
            sx={{ color: 'text.primary' }}
          />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
            </Grid>

            {/* Permissions Accordions */}
            {selectedModules.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Configuration des permissions par module
                  </Typography>

                  {visibleModules.map((mod) => (
                    <Accordion key={mod} sx={{ mb: 1, overflow: 'hidden' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {allModules.find((m) => m.value === mod)?.label || mod}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  modulePermissions[mod] &&
                                  modulePermissions[mod].length === allPermissions.length
                                }
                                indeterminate={
                                  modulePermissions[mod] &&
                                  modulePermissions[mod].length > 0 &&
                                  modulePermissions[mod].length < allPermissions.length
                                }
                                onChange={() => handleToggleAll(mod)}
                                sx={{
                                  '&.Mui-checked': { color: 'primary.main' },
                                }}
                              />
                            }
                            label="Tous"
                          />
                          {allPermissions.map((permission) => (
                            <FormControlLabel
                              key={permission.value}
                              control={
                                <Checkbox
                                  checked={
                                    modulePermissions[mod]
                                      ? modulePermissions[mod].includes(permission.value)
                                      : false
                                  }
                                  onChange={() =>
                                    handlePermissionToggle(mod, permission.value)
                                  }
                                  sx={{
                                    '&.Mui-checked': { color: 'primary.main' },
                                  }}
                                />
                              }
                              label={permission.label}
                            />
                          ))}
                        </FormGroup>
                      </AccordionDetails>
                    </Accordion>
                  ))}

                  {visibleCount < selectedModules.length && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setVisibleCount((prev) => prev + 5)}
                        sx={{ borderRadius: 2 }}
                      >
                        Voir plus
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="flex-end"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                  onClick={handleCancel}
                  sx={{
                    borderRadius: 1.5,
                    px: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Retour
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSaving}
                  startIcon={<FontAwesomeIcon icon={faSave} />}
                  sx={{
                    borderRadius: 1.5,
                    px: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: (theme) => `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                    color: 'primary.contrastText',
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }}
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <ConfirmDialog
  open={confirmCancel.value}
  onClose={confirmCancel.onFalse}
  title="Annuler les modifications"
  content="Êtes-vous sûr de vouloir annuler vos modifications ?"
  action={
    <Button
      variant="contained"
      color="error"
      onClick={() => {
        router.push(paths.dashboard.users.roles);
        confirmCancel.onFalse();
      }}
    >
      Annuler les modifications
    </Button>
  }
/>
    </DashboardContent>
  );
}
