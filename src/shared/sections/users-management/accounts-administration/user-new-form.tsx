'use client';

import type { IRoleItem } from 'src/contexts/types/role';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { faChild, faUserShield } from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Check as CheckIcon,
  Search as SearchIcon,
  FamilyRestroom as ParentIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  Step,
  List,
  Chip,
  Alert,
  Paper,
  Stack,
  Button,
  Select,
  Avatar,
  Stepper,
  Divider,
  MenuItem,
  TextField,
  StepLabel,
  Container,
  Typography,
  InputLabel,
  CardContent,
  FormControl,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { toast } from 'src/shared/components/snackbar';
import { Field, schemaHelper } from 'src/shared/components/hook-form';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import {
  apiService,
  type IUserItem,
  type UserRequest,
  type AdminRequest,
  type ChildRequest,
  type ParentRequest,
} from '../api.service';

// Schéma de base pour tous les utilisateurs
const baseUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'Le prénom est requis.' }),
  lastName: zod.string().min(1, { message: 'Le nom est requis.' }),
  email: zod
    .string()
    .min(1, { message: 'Adresse e-mail requise.' })
    .email({ message: 'Adresse e-mail invalide.' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  birthDate: zod.string().min(1, { message: 'La date de naissance est requise.' }),
});

// Schéma pour le rôle
const roleSchema = zod.object({
  selectedRole: zod.enum(['admin', 'parent', 'child'], {
    errorMap: () => ({ message: 'Veuillez sélectionner un rôle' }),
  }),
});

// Schéma pour les champs spécifiques selon le rôle
const roleSpecificSchema = zod.object({
  selectedParent: zod
    .object({
      id: zod.string().or(zod.number()),
      firstName: zod.string(),
      lastName: zod.string(),
      email: zod.string().email(),
      userType: zod.string(),
      role: zod.string(),
      status: zod.string(),
      lastLogin: zod.any().nullable(),
      createdAt: zod.any(),
    })
    .nullable()
    .optional(),
  selectedAdminRoles: zod.array(zod.union([zod.string(), zod.number()])).optional(),
});

// Schéma complet combiné
const fullFormSchema = baseUserSchema.merge(roleSchema).merge(roleSpecificSchema);

const steps = ['Sélection du rôle', 'Informations personnelles', 'Configuration', 'Confirmation'];

export default function AddUserInterface() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'parent' | 'child' | ''>('');
  const [selectedParent, setSelectedParent] = useState<IUserItem | null>(null);
  const [selectedAdminRoles, setSelectedAdminRoles] = useState<string[]>([]);
  const [searchParent, setSearchParent] = useState('');
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});
  const [parents, setParents] = useState<IUserItem[]>([]);
  const [administrationRoles, setAdministrationRoles] = useState<IRoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      firstName: 'aaa',
      lastName: 'aaaa',
      email: 'aaaa@gmail.com',
      phoneNumber: '',
      birthDate: '10/05/2025',
      selectedRole: '' as 'admin' | 'parent' | 'child' | '',
      selectedParent: null as IUserItem | null,
      selectedAdminRoles: [] as string[],
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await apiService.role.getAllRoles();
        setAdministrationRoles(data);
      } catch (err) {
        console.error('Erreur lors du chargement des rôles:', err);
      }
    };
    const fetchParents = async () => {
      try {
        const data = await apiService.user.getAllUsers({ roleSearch: 'PARENT' });
        setParents(data.users);
      } catch (err) {
        console.error('Erreur lors du chargement des parents:', err);
      }
    };
    fetchRoles();
    fetchParents();
  }, []);

  // Fonction pour nettoyer les erreurs et états non pertinents selon le rôle
  const cleanUpRoleSpecificData = (role: string) => {
    // Nettoie les erreurs de step
    setStepErrors({});

    // Nettoie les erreurs du formulaire pour les champs non pertinents
    if (role !== 'child') {
      setSelectedParent(null);
      setValue('selectedParent', null);
      clearErrors('selectedParent');
    }

    if (role !== 'admin') {
      setSelectedAdminRoles([]);
      setValue('selectedAdminRoles', []);
      clearErrors('selectedAdminRoles');
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    setStepErrors({});

    if (step === 0) {
      const isValid = await trigger(['selectedRole']);
      return isValid;
    }

    if (step === 1) {
      const isValid = await trigger(['firstName', 'lastName', 'email', 'phoneNumber', 'birthDate']);
      return isValid;
    }

    if (step === 2) {
      const newErrors: { [key: string]: string } = {};

      if (selectedRole === 'child') {
        if (!selectedParent) {
          newErrors.parent = 'Veuillez sélectionner un parent';
        }
      }

      if (selectedRole === 'admin') {
        if (selectedAdminRoles.length === 0) {
          newErrors.adminRoles = 'Veuillez sélectionner au moins un rôle administrateur';
        }
      }

      // Pour le rôle parent, pas de validation spécifique nécessaire à l'étape 2
      if (selectedRole === 'parent') {
        // Aucune validation supplémentaire requise
      }

      setStepErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    return true;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    const isValid = await validateStep(activeStep);
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
      setStepErrors({});
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setActiveStep((prevStep) => prevStep - 1);
    setStepErrors({});
  };

  const handleRoleSelection = (role: 'admin' | 'parent' | 'child') => {
    setSelectedRole(role);
    setValue('selectedRole', role);

    // Nettoie les données spécifiques aux autres rôles
    cleanUpRoleSpecificData(role);

    // Force la validation du champ selectedRole
    trigger(['selectedRole']);
  };

  const onSubmit = async (data: any) => {
    // Validation finale avant soumission
    const isValid = await validateStep(activeStep);
    if (!isValid) return;

    const baseUserData: UserRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      birthDate: data.birthDate ? dayjs(data.birthDate).format('YYYY-MM-DD') : '',
    };

    setIsLoading(true);
    try {
      if (selectedRole === 'admin') {
        const adminData: AdminRequest = {
          ...baseUserData,
          roleIds: selectedAdminRoles,
        };
        await apiService.user.addAdmin(adminData);
      } else if (selectedRole === 'parent') {
        const parentData: ParentRequest = baseUserData;
        await apiService.user.addParent(parentData);
      } else if (selectedRole === 'child') {
        const childData: ChildRequest = {
          ...baseUserData,
          parentId: selectedParent?.id ?? '',
        };
        await apiService.user.addChild(childData);
      }

      toast.success('Compte créé avec succès !');

      // Reset complet du formulaire
      setActiveStep(0);
      setSelectedRole('');
      setSelectedParent(null);
      setSelectedAdminRoles([]);
      setStepErrors({});
      setSearchParent('');

      methods.reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        birthDate: '',
        selectedRole: '' as 'admin' | 'parent' | 'child' | '',
        selectedParent: null,
        selectedAdminRoles: [],
      });
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;

      if (backendMessage === 'Email already exists') {
        toast.error('Cet email est déjà utilisé.');
      } else if (backendMessage === 'Missing data') {
        toast.error('Données manquantes.');
      } else {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        toast.error("Échec de l'ajout de l'utilisateur!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FontAwesomeIcon icon={faUserShield} style={{ fontSize: 40, color: '#1976d2' }} />;
      case 'parent':
        return <ParentIcon sx={{ fontSize: 40, color: '#388e3c' }} />;
      case 'child':
        return <FontAwesomeIcon icon={faChild} style={{ fontSize: 40, color: '#f57c00' }} />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'parent':
        return 'Parent';
      case 'child':
        return 'Enfant';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
              Quel type de compte souhaitez-vous créer ?
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  role: 'admin',
                  title: 'Administrateur',
                  description: 'Accès complet au système et gestion des utilisateurs',
                },
                {
                  role: 'parent',
                  title: 'Parent',
                  description: 'Gestion des comptes enfants et suivi des activités',
                },
                {
                  role: 'child',
                  title: 'Enfant',
                  description: 'Accès au contenu éducatif adapté',
                },
              ].map((option) => (
                <Grid item xs={12} md={4} key={option.role}>
                  <Card
                    variant={selectedRole === option.role ? 'elevation' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      border:
                        selectedRole === option.role ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor: selectedRole === option.role ? '#f3f7ff' : 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => handleRoleSelection(option.role as any)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      {getRoleIcon(option.role)}
                      <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.description}
                      </Typography>
                      {selectedRole === option.role && (
                        <CheckIcon sx={{ color: '#1976d2', mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {errors.selectedRole && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.selectedRole.message}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Informations personnelles
              </Typography>
              <Box
                display="grid"
                rowGap={3}
                columnGap={2}
                gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}
                sx={{ mb: 2 }}
              >
                <Field.Text name="firstName" label="Prénom" />
                <Field.Text name="lastName" label="Nom" />
                <Field.Text name="email" label="Adresse e-mail" />
                <Field.Phone name="phoneNumber" label="Numéro de téléphone" />
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="Date de naissance"
                      value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange(newValue.format('YYYY-MM-DD'));
                        } else {
                          field.onChange('');
                        }
                      }}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: { '& .MuiInputBase-root': { height: 48 } },
                          error: Boolean(fieldState.error),
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </LocalizationProvider>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Configuration spécifique
            </Typography>

            {selectedRole === 'child' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Sélectionner le parent
                </Typography>
                <TextField
                  fullWidth
                  label="Rechercher un parent"
                  value={searchParent}
                  onChange={(e) => setSearchParent(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                />
                <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <List>
                    {parents
                      .filter(
                        (parent) =>
                          searchParent === '' ||
                          `${parent.firstName} ${parent.lastName}`
                            .toLowerCase()
                            .includes(searchParent.toLowerCase()) ||
                          parent.email.toLowerCase().includes(searchParent.toLowerCase())
                      )
                      .map((parent) => (
                        <ListItemButton
                          key={parent.id}
                          selected={selectedParent?.id === parent.id}
                          onClick={() => {
                            setSelectedParent(parent);
                            setValue('selectedParent', parent);
                            if (stepErrors.parent) {
                              setStepErrors((prev) => ({ ...prev, parent: '' }));
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: '#388e3c' }}>
                              {parent.firstName.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${parent.firstName} ${parent.lastName}`}
                            secondary={parent.email}
                          />
                          {selectedParent?.id === parent.id && (
                            <CheckIcon sx={{ color: '#1976d2' }} />
                          )}
                        </ListItemButton>
                      ))}
                  </List>
                </Paper>
                {stepErrors.parent && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {stepErrors.parent}
                  </Alert>
                )}
              </Box>
            )}

            {selectedRole === 'admin' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Rôles administrateur
                </Typography>
                <FormControl fullWidth error={!!stepErrors.adminRoles} sx={{ mb: 2 }}>
                  <InputLabel id="select-admin-roles-label">Sélectionner les rôles</InputLabel>

                  <Select
                    labelId="select-admin-roles-label"
                    id="select-admin-roles"
                    multiple
                    value={selectedAdminRoles}
                    onChange={(e) => {
                      const value = e.target.value as string[];
                      setSelectedAdminRoles(value);
                      setValue('selectedAdminRoles', value);
                      if (stepErrors.adminRoles && value.length > 0) {
                        setStepErrors((prev) => ({ ...prev, adminRoles: '' }));
                      }
                    }}
                    label="Sélectionner les rôles"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pt: 0.5, pb: 0.5 }}>
                        {selected.map((value) => {
                          const role = administrationRoles.find((r) => r.id === value);
                          return <Chip key={value} label={role?.name} size="small" />;
                        })}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {administrationRoles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Box>
                          <Typography variant="body1">{role.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>

                  {stepErrors.adminRoles && (
                    <FormHelperText>{stepErrors.adminRoles}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}

            {selectedRole === 'parent' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ParentIcon sx={{ fontSize: 60, color: '#388e3c', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Configuration du compte parent
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Le compte parent sera créé avec les permissions par défaut. Vous pourrez gérer les
                  comptes enfants après la création.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
              Confirmation
            </Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getRoleIcon(selectedRole)}
                  <Box>
                    <Typography variant="h6">{getRoleLabel(selectedRole)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type de compte sélectionné
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nom complet
                    </Typography>
                    <Typography variant="body1">
                      {methods.getValues('firstName')} {methods.getValues('lastName')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{methods.getValues('email')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Téléphone
                    </Typography>
                    <Typography variant="body1">{methods.getValues('phoneNumber')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date de naissance
                    </Typography>
                    <Typography variant="body1">
                      {methods.getValues('birthDate')
                        ? dayjs(methods.getValues('birthDate')).format('DD/MM/YYYY')
                        : ''}
                    </Typography>
                  </Grid>
                </Grid>

                {selectedRole === 'child' && selectedParent && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Parent associé
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#388e3c', width: 32, height: 32 }}>
                          {selectedParent.firstName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {selectedParent.firstName} {selectedParent.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selectedParent.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

                {selectedRole === 'admin' && selectedAdminRoles.length > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Rôles administrateur
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedAdminRoles.map((roleId) => {
                          const role = administrationRoles.find((r) => r.id === roleId);
                          return <Chip key={roleId} label={role?.name} color="primary" />;
                        })}
                      </Box>
                    </Box>
                  </>
                )}
              </Stack>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <CustomBreadcrumbs
          heading="Ajouter un compte utilisateur"
          links={[
            { name: 'Tableau de bord', href: paths.dashboard.root },
            { name: 'Utilisateurs', href: paths.dashboard.users.accounts },
            { name: 'Ajouter un compte' },
          ]}
        />
      </Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ minHeight: 400 }}>{renderStepContent()}</Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                  Retour
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                  >
                    {isLoading ? 'Création en cours...' : "Créer l'utilisateur"}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext} variant="contained" color="primary">
                    Suivant
                  </Button>
                )}
              </Box>
            </form>
          </FormProvider>
        </Paper>
      </Container>
    </DashboardContent>
  );
}
