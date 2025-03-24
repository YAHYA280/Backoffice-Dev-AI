'use client';

import type { IUserItem } from 'src/contexts/types/user';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _cin, _parents } from 'src/shared/_mock';

import { Label } from 'src/shared/components/label';
import { Form, Field, schemaHelper } from 'src/shared/components/hook-form';

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  avatarUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  birthDate: zod.string().min(1, { message: 'La date de naissance est requise.' }),
  country: schemaHelper.objectOrNull<string | null>({ message: { required_error: 'Country is required!' } }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  company: zod.string().min(1, { message: 'Company is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  zipCode: zod.string().min(1, { message: 'Zip code is required!' }),
  status: zod.string(),
  isVerified: zod.boolean(),
  parentId: zod.string().optional(),
  cinRecto: schemaHelper.file().optional(),
  cinVerso: schemaHelper.file().optional(),
});

type Props = {
  currentUser?: IUserItem;
};

export function UserConsulterForm({ currentUser }: Props) {
  const router = useRouter();
  const filteredParents = _parents;
  const existingCIN = _cin.length > 0 ? _cin[0] : null;
  const defaultValues = useMemo(
    () => ({
      status: currentUser?.status || '',
      avatarUrl: currentUser?.avatarUrl || null,
      isVerified: currentUser?.isVerified || true,
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      birthDate: currentUser?.birthDate != null ? String(currentUser.birthDate) : '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
      zipCode: currentUser?.zipCode || '',
      role: currentUser?.role || '',
      parentId: currentUser?.parentId || '',
      cinRecto: null,
      cinVerso: null,
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const { watch, control } = methods;
  const values = watch();

  const avatarSrc =
    typeof values.avatarUrl === 'object' && values.avatarUrl
      ? URL.createObjectURL(values.avatarUrl)
      : values.avatarUrl || undefined;

  return (
    <Form methods={methods} onSubmit={() => {}}>
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
            {currentUser ? (
              <>
                <Label color="success" sx={{ position: 'absolute', top: 16, left: 16 }}>
                  {values.role}
                </Label>
                <Label color="warning" sx={{ position: 'absolute', top: 16, right: 16 }}>
                  {values.status}
                </Label>
              </>
            ) : (
              <>
              </>
            )}
            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
              {values.avatarUrl ? (
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
            {values.role === 'Parent' ? (
              <>
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
                  {existingCIN ? (
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
                  ) : (
                    <>
                    </>
                  )}
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
                  {existingCIN ? (
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
                  ) : (
                    <>
                    </>
                  )}
                </Card>
              </>
            ) : (
              <>
              </>
            )}
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
            <Box
              display="grid"
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="firstName" label="Prénom" InputProps={{ readOnly: true }} />
              <Field.Text name="lastName" label="Nom" InputProps={{ readOnly: true }} />
              <Field.Text name="email" label="Adresse e-mail" InputProps={{ readOnly: true }} />
              <Field.Phone name="phoneNumber" label="Numéro de téléphone" disabled />
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
              <Field.CountrySelect name="country" label="Pays" placeholder="Choisissez un pays" disabled />
              <Field.Text name="state" label="Région" InputProps={{ readOnly: true }} />
              <Field.Text name="city" label="Ville" InputProps={{ readOnly: true }} />
              <Field.Text name="address" label="Adresse" InputProps={{ readOnly: true }} />
              <Field.Text name="zipCode" label="Code postal" InputProps={{ readOnly: true }} />
              {values.role === 'Enfant' ? (
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field, fieldState }) => {
                    const defaultSelection = field.value ? filteredParents.find((p) => p.id === field.value) : filteredParents[0] || null;
                    return (
                      <TextField
                        label="Parent"
                        variant="outlined"
                        value={
                          defaultSelection
                            ? `${defaultSelection.name} (${defaultSelection.email})`
                            : ''
                        }
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    );
                  }}
                />
              ) : (
                <>
                </>
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ textAlign: 'right', mt: 3 }}>
              <Button variant="outlined" onClick={() => router.push(paths.dashboard.users.accounts)}>
                Retour
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}