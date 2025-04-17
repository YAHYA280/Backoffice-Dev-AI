// components/tabs/PersonalInfoTab.tsx
import type { UseFormReturn } from 'react-hook-form';
import type { IUserItem } from 'src/contexts/types/user';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Card, Grid, Button, TextField, Typography } from '@mui/material';

import { _parents } from 'src/shared/_mock';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { Form, Field } from 'src/shared/components/hook-form';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

export const UserManagementSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email est requis!' })
    .email({ message: 'Email doit être une adresse valide!' }),
  phoneNumber: zod.string().min(1, { message: 'Numéro de téléphone est requis!' }),
  birthDate: zod.string().min(1, { message: 'La date de naissance est requise.' }),
  address: zod.string().min(1, { message: 'Adresse est requise!' }),
  country: zod.string().min(1, { message: 'Pays est requis!' }),
  company: zod.string().min(1, { message: 'Company is required!' }),
  state: zod.string().min(1, { message: 'Région est requise!' }),
  city: zod.string().min(1, { message: 'Ville est requise!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  zipCode: zod.string().min(1, { message: 'Code postal est requis!' }),
  status: zod.string(),
  isVerified: zod.boolean(),
  parentId: zod.string().optional(),
  daily_question_limit: zod.number().optional(),
});

export type UserManagementSchemaType = zod.infer<typeof UserManagementSchema>;

interface PersonalInfoTabProps {
  currentUser?: IUserItem;
  methods: UseFormReturn<UserManagementSchemaType>;
  values: UserManagementSchemaType;
  isEditing: boolean;
  existingCIN: any;
  avatarSrc?: string;
  handleEdit: () => void;
  handleCancel: () => void;
  setIsEditing: (arg0: boolean) => void;
  userParent?: IUserItem | null;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  currentUser,
  methods,
  values,
  isEditing,
  existingCIN,
  avatarSrc,
  handleEdit,
  handleCancel,
  setIsEditing,
  userParent,
}) => {
  const { control } = methods;
  const parents = _parents;
  const [parentSearch] = useState('');
  const filteredParents = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(parentSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(parentSearch.toLowerCase())
  );
  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <Form methods={methods}>
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <ConditionalComponent isValid={!!currentUser}>
              <>
                <Label color="success" sx={{ position: 'absolute', top: 16, left: 16 }}>
                  {values.role}
                </Label>
                <Label color="warning" sx={{ position: 'absolute', top: 16, right: 16 }}>
                  {values.status}
                </Label>
              </>
            </ConditionalComponent>

            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
              {avatarSrc ? (
                <Box
                  component="img"
                  src={avatarSrc}
                  alt="Avatar"
                  sx={{ width: 120, height: 120, borderRadius: '50%', mx: 'auto' }}
                />
              ) : (
                <Typography variant="caption">Aucun avatar</Typography>
              )}
            </Box>

            <ConditionalComponent isValid={values.role === 'Parent' && existingCIN}>
              <>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Pièces d&apos;identité
                </Typography>
                <Card
                  sx={{
                    mb: 2,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    CIN recto
                  </Typography>
                  <Box
                    component="img"
                    src={existingCIN.recto}
                    alt="CIN Recto"
                    sx={{
                      width: '100%',
                      maxWidth: 300,
                      height: 'auto',
                      borderRadius: 1,
                      border: '1px solid #ccc',
                    }}
                  />
                </Card>
                <Card
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    CIN verso
                  </Typography>
                  <Box
                    component="img"
                    src={existingCIN.verso}
                    alt="CIN Verso"
                    sx={{
                      width: '100%',
                      maxWidth: 300,
                      height: 'auto',
                      borderRadius: 1,
                      border: '1px solid #ccc',
                    }}
                  />
                </Card>
              </>
            </ConditionalComponent>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card
            sx={{
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Informations de contact</Typography>
              <ConditionalComponent
                isValid={!isEditing}
                defaultComponent={
                  <Box>
                    <Button
                      startIcon={<SaveIcon />}
                      variant="contained"
                      onClick={onSubmit}
                      type="submit"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Sauvegarder
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      variant="outlined"
                      color="error"
                      size="small"
                    >
                      Annuler
                    </Button>
                  </Box>
                }
              >
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  variant="outlined"
                  size="small"
                >
                  Modifier
                </Button>
              </ConditionalComponent>
            </Box>

            <Box
              display="grid"
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="firstName" label="Prénom" InputProps={{ readOnly: true }} />
              <Field.Text name="lastName" label="Nom" InputProps={{ readOnly: true }} />
              <Field.Text name="email" label="Adresse e-mail" InputProps={{ readOnly: true }} />
              <Field.Phone name="phoneNumber" label="Numéro de téléphone" disabled={!isEditing} />
              <Controller
                name="birthDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Date de naissance"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={() => {}}
                    disabled
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { '& .MuiInputBase-root': { height: 48 } },
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />
              <Field.CountrySelect
                name="country"
                label="Pays"
                placeholder="Choisissez un pays"
                disabled={!isEditing}
              />
              <Field.Text name="state" label="Région" InputProps={{ readOnly: !isEditing }} />
              <Field.Text name="city" label="Ville" InputProps={{ readOnly: !isEditing }} />
              <Field.Text name="address" label="Adresse" InputProps={{ readOnly: !isEditing }} />
              <Field.Text
                name="zipCode"
                label="Code postal"
                InputProps={{ readOnly: !isEditing }}
              />
            </Box>

            <ConditionalComponent isValid={values.role === 'Enfant'}>
              <Box sx={{ mt: 3 }}>
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field, fieldState }) => {
                    // Utiliser userParent s'il est disponible, sinon chercher dans filteredParents
                    const defaultSelection = userParent
                      ? { id: userParent.id, name: userParent.firstName, email: userParent.email }
                      : field.value
                        ? filteredParents.find((p) => p.id === field.value)
                        : null;

                    return (
                      <Autocomplete
                        options={filteredParents}
                        getOptionLabel={(option) => `${option.name} (${option.email})`}
                        value={defaultSelection}
                        onChange={(event, newValue) => {
                          field.onChange(newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Parent"
                            variant="outlined"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                        disabled={!isEditing}
                        clearOnEscape
                      />
                    );
                  }}
                />
              </Box>
            </ConditionalComponent>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
};

export default PersonalInfoTab;
