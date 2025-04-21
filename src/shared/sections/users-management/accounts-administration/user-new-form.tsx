'use client';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import {
  faCheck,
  faChild,
  faSearch,
  faUserShield,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Card,
  Stack,
  Alert,
  Avatar,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { _parents, _ADMINISTRATION_ROLES } from 'src/shared/_mock';

import { toast } from 'src/shared/components/snackbar';
import { Form, Field, schemaHelper } from 'src/shared/components/hook-form';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { FilePreview } from './file-preview';

interface Parent {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

const administrationRoles = _ADMINISTRATION_ROLES;

const UserNewSchema = zod.object({
  firstName: zod.string().min(1, { message: 'Le prénom est requis.' }),
  lastName: zod.string().min(1, { message: 'Le nom est requis.' }),
  email: zod
    .string()
    .min(1, { message: 'Adresse e-mail requise.' })
    .email({ message: 'Adresse e-mail invalide.' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  birthDate: zod.string().min(1, { message: 'La date de naissance est requise.' }),
  role: zod.string().min(1, { message: 'Le rôle est requis.' }),
  parentId: zod.string().optional(),
  adminRole: zod.string().optional(),
});

export type UserNewSchemaType = zod.infer<typeof UserNewSchema>;

export default function UserNewPage() {
  const router = useRouter();

  const parents = _parents;
  const [parentSearch, setParentSearch] = useState('');
  const filteredParents = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(parentSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(parentSearch.toLowerCase())
  );

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birthDate: '',
      role: '',
      parentId: '',
      adminRole: '',
    }),
    []
  );

  const methods = useForm<UserNewSchemaType>({
    mode: 'all',
    resolver: zodResolver(UserNewSchema),
    defaultValues,
  });
  const { control, reset, handleSubmit, setValue, getValues, trigger, watch } = methods;
  const adminRole = watch('adminRole');

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [roleSelectionError, setRoleSelectionError] = useState<string | null>(null);
  const [adminRoleError, setAdminRoleError] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [invitationContent, setInvitationContent] = useState('');
  const [cinRectoFile, setCinRectoFile] = useState<File | null>(null);
  const [cinVersoFile, setCinVersoFile] = useState<File | null>(null);

  const buildDefaultInvitationText = useCallback(
    () =>
      `Invitation à rejoindre notre plateforme éducative

Bonjour ${getValues('lastName') || ''},

Votre compte a été créé avec succès sur notre plateforme éducative. 
Vous pouvez maintenant vous connecter en utilisant les informations suivantes :

Email : ${getValues('email') || ''}
Mot de passe temporaire : *******

Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :

[Activer mon compte]

Ce lien expirera dans 24 heures.

Cordialement,
L'équipe de la plateforme`,
    [getValues]
  );

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setValue('role', role);
    setRoleSelectionError(null);
    if (role !== 'admin') {
      setValue('adminRole', '');
    }
  };

  const handleParentSelect = (parent: Parent) => {
    setSelectedParent(parent);
    setValue('parentId', parent.id);
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      if (!selectedRole) {
        setRoleSelectionError('Veuillez sélectionner un rôle.');
        return;
      }
      if (selectedRole === 'admin' && !adminRole) {
        setAdminRoleError('Veuillez sélectionner un rôle administrateur.');
        return;
      }
      const fieldsToValidate = [
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'birthDate',
        'role',
      ];
      const isValid = await trigger(fieldsToValidate as any);
      if (!isValid) return;
      if (selectedRole === 'admin') {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (selectedRole === 'admin') {
      if (currentStep === 4) setCurrentStep(3);
      else if (currentStep === 3) setCurrentStep(1);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const onClose = () => {
    router.push(paths.dashboard.users.accounts);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const promise = new Promise((resolve) => setTimeout(resolve, 1000));
      toast.promise(promise, {
        loading: 'Création en cours...',
        success: 'Compte créé avec succès !',
        error: 'Erreur lors de la création du compte.',
      });
      await promise;
      console.info('DATA', data);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 4 }}
              justifyContent="center"
            >
              {[
                {
                  label: 'Administrateur',
                  value: 'admin',
                  description: 'Droits complets sur le système',
                  icon: <FontAwesomeIcon icon={faUserShield} />,
                },
                {
                  label: 'Parent',
                  value: 'parent',
                  description: 'Gestion des comptes enfants',
                  icon: <FontAwesomeIcon icon={faUserFriends} />,
                },
                {
                  label: 'Enfant',
                  value: 'enfant',
                  description: 'Accès limité au contenu éducatif',
                  icon: <FontAwesomeIcon icon={faChild} />,
                },
              ].map((role) => (
                <Card
                  key={role.value}
                  variant="outlined"
                  onClick={() => handleRoleSelect(role.value)}
                  sx={{
                    width: '100%',
                    cursor: 'pointer',
                    border: selectedRole === role.value ? '2px solid' : '1px solid',
                    borderColor: selectedRole === role.value ? '#C8FAD6' : 'divider',
                    bgcolor: selectedRole === role.value ? '#C8FAD6' : 'background.paper',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography fontSize="24px" sx={{ mb: 1 }}>
                      {role.icon}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {role.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="12px">
                      {role.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
            {roleSelectionError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {roleSelectionError}
              </Alert>
            ) : null}
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
              {selectedRole === 'admin' ? (
                <Controller
                  name="adminRole"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      error={!!adminRoleError}
                      sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}
                    >
                      <InputLabel>Rôle administratif</InputLabel>
                      <Select
                        {...field}
                        label="Rôle administratif"
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                          },
                          transformOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                        }}
                      >
                        {administrationRoles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {adminRoleError ? (
                        <Typography color="error" variant="caption" sx={{ mt: 1, ml: 1.5 }}>
                          {adminRoleError}
                        </Typography>
                      ) : null}
                    </FormControl>
                  )}
                />
              ) : null}
            </Box>
          </>
        );
      case 2:
        if (selectedRole === 'enfant') {
          return (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Vérification du compte parent
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Recherchez et sélectionnez le compte parent associé à cet enfant.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Recherche par nom ou adresse e-mail
              </Typography>
              <TextField
                fullWidth
                placeholder="Rechercher un parent..."
                value={parentSearch}
                onChange={(e) => setParentSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faSearch} style={{ width: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Stack spacing={1}>
                {filteredParents.map((parent) => (
                  <Box
                    key={parent.id}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: selectedParent?.id === parent.id ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor:
                        selectedParent?.id === parent.id ? 'primary.lighter' : 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() => handleParentSelect(parent)}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{parent.name.charAt(0)}</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {parent.name}
                        </Typography>
                        {parent.verified ? (
                          <Box
                            sx={{
                              ml: 1,
                              bgcolor: 'success.light',
                              color: 'success.dark',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                            }}
                          >
                            ✓
                          </Box>
                        ) : null}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {parent.email}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          );
        }
        if (selectedRole === 'parent') {
          return (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Vérification de CIN
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Veuillez télécharger votre CIN (Recto & Verso) pour vérification.
              </Typography>
              <Stack direction="column" spacing={4}>
                <Box>
                  <Button variant="contained" component="label">
                    Télécharger Recto
                    <input
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setCinRectoFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                  {cinRectoFile ? (
                    <Box sx={{ mt: 2 }}>
                      <FilePreview file={cinRectoFile} label="Recto" />
                    </Box>
                  ) : null}
                </Box>
                <Box>
                  <Button variant="contained" component="label">
                    Télécharger Verso
                    <input
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setCinVersoFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                  {cinVersoFile ? (
                    <Box sx={{ mt: 2 }}>
                      <FilePreview file={cinVersoFile} label="Verso" />
                    </Box>
                  ) : null}
                </Box>
              </Stack>
            </Box>
          );
        }
        return null;
      case 3:
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <FontAwesomeIcon icon={faCheck} style={{ width: 20, height: 20, color: 'white' }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Informations vérifiées
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                Les informations de l&apos;utilisateur ont été vérifiées et sont prêtes à être
                enregistrées.
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom fontWeight={500}>
              Résumé des informations
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 3, borderRadius: 1 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  rowGap: 2,
                  columnGap: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Nom complet:
                </Typography>
                <Typography variant="body2">
                  {getValues('firstName')} {getValues('lastName')}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Type de compte:
                </Typography>
                <Typography variant="body2">
                  {selectedRole === 'admin' && 'Administrateur'}
                  {selectedRole === 'parent' && 'Parent'}
                  {selectedRole === 'enfant' && 'Enfant'}
                </Typography>
                {selectedRole === 'admin' && getValues('adminRole') ? (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rôle administratif:
                    </Typography>
                    <Typography variant="body2">
                      {
                        administrationRoles.find((role) => role.value === getValues('adminRole'))
                          ?.label
                      }
                    </Typography>
                  </>
                ) : null}
                <Typography variant="subtitle2" color="text.secondary">
                  Email:
                </Typography>
                <Typography variant="body2">{getValues('email')}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Téléphone:
                </Typography>
                <Typography variant="body2">{getValues('phoneNumber')}</Typography>
                {selectedRole === 'enfant' && selectedParent ? (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Compte parent:
                    </Typography>
                    <Typography variant="body2">
                      {selectedParent.name} ({selectedParent.email})
                    </Typography>
                  </>
                ) : null}
              </Box>
            </Box>
          </>
        );
      case 4:
        return (
          <>
            <Box
              sx={{
                bgcolor: 'grey.100',
                p: 3,
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={500}>
                Modèle d&apos;email d&apos;invitation
              </Typography>
              {isCustomizing ? (
                <TextField
                  fullWidth
                  multiline
                  minRows={10}
                  value={invitationContent}
                  onChange={(e) => setInvitationContent(e.target.value)}
                />
              ) : (
                <Box
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'common.white',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {invitationContent || buildDefaultInvitationText()}
                </Box>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  if (!isCustomizing && !invitationContent) {
                    setInvitationContent(buildDefaultInvitationText());
                  }
                  setIsCustomizing((prev) => !prev);
                }}
              >
                {isCustomizing ? 'Enregistrer' : 'Personnaliser'}
              </Button>
              <Button variant="contained" onClick={onSubmit} color="primary">
                Envoyer l&apos;invitation
              </Button>
            </Box>
          </>
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

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={0}
            sx={{
              mb: 3,
              position: 'relative',
              // Increased thickness, color, and changed from 2px to 4px
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 4,
                bgcolor: 'grey.300',
                transform: 'translateY(-50%)',
                zIndex: 0,
              },
            }}
          >
            {[
              { label: 'Infos de base', step: 1 },
              { label: "Vérifier l'ID", step: 2 },
              { label: 'Confirmer', step: 3 },
              { label: 'Invitation', step: 4 },
            ].map((item) => (
              <Box
                key={item.step}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    // Slightly bigger step circles (36px → more visual weight)
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor:
                      item.step < currentStep
                        ? 'primary.main'
                        : item.step === currentStep
                          ? '#6495ED'
                          : 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    mb: 0.5,
                  }}
                >
                  {item.step < currentStep ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ width: 20, height: 20, color: 'white' }}
                    />
                  ) : (
                    item.step
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      item.step < currentStep
                        ? 'primary.main'
                        : item.step === currentStep
                          ? '#6495ED'
                          : 'text.disabled',
                    fontWeight: item.step === currentStep ? 'bold' : 'normal',
                    fontSize: 11, // slightly bigger for emphasis
                    textAlign: 'center',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Form methods={methods} onSubmit={onSubmit}>
            {renderStepContent()}
            {currentStep !== 4 ? (
              <Box
                sx={{
                  mt: 3,
                  p: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {currentStep > 1 ? (
                  <Button variant="outlined" onClick={handleBack}>
                    Retour
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={onClose}>
                    Annuler
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button variant="contained" onClick={handleContinue} color="primary">
                    {currentStep === 3 ? 'Confirmer' : 'Continuer'}
                  </Button>
                ) : null}
              </Box>
            ) : null}
          </Form>
        </Box>
      </Box>
    </DashboardContent>
  );
}
