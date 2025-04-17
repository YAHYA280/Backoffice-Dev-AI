import type { IUserItem } from 'src/contexts/types/user';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import { Stack, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { _cin, _parents } from 'src/shared/_mock';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { Form, Field, schemaHelper } from 'src/shared/components/hook-form';

export const NewUserSchema = zod.object({
  avatarUrl: schemaHelper.file({ message: { required_error: 'Avatar is required!' } }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  birthDate: zod.string().min(1, { message: 'La date de naissance est requise.' }),
  country: schemaHelper.objectOrNull<string | null>({
    message: { required_error: 'Country is required!' },
  }),
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

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

type Props = {
  currentUser?: IUserItem;
};

export function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const parents = _parents;
  const [parentSearch] = useState('');
  const filteredParents = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(parentSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(parentSearch.toLowerCase())
  );

  const existingCIN = _cin.length > 0 ? _cin[0] : null;

  const [cinRectoFile, setCinRectoFile] = useState<File | null>(null);
  const [cinVersoFile, setCinVersoFile] = useState<File | null>(null);
  const [rectoOpen, setRectoOpen] = useState(false);
  const [versoOpen, setVersoOpen] = useState(false);

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
      parentId: currentUser && 'parentId' in currentUser ? currentUser.parentId : '',
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

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (cinRectoFile) data.cinRecto = cinRectoFile;
      if (cinVersoFile) data.cinVerso = cinVersoFile;

      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(currentUser ? 'Update success!' : 'Create success!');
      reset();
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              p: 3,
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
              <></>
            )}

            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      color: 'text.disabled',
                    }}
                  >
                    Importez une image (JPEG, PNG ou GIF)
                    <br />
                    Taille maximale : {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {values.role === 'Parent' ? (
              <>
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => setRectoOpen(!rectoOpen)}
                  >
                    <Label color="default" sx={{ mr: 1 }}>
                      CIN recto
                    </Label>
                    <FontAwesomeIcon
                      icon={rectoOpen ? faChevronDown : faChevronRight}
                      style={{ width: 20, height: 20 }}
                    />
                  </Box>
                  {rectoOpen && existingCIN ? (
                    <Box
                      component="img"
                      src={existingCIN.recto}
                      alt="CIN Recto"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: 400,
                        borderRadius: 1,
                        border: '1px solid #ccc',
                        mt: 2,
                      }}
                    />
                  ) : null}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => setVersoOpen(!versoOpen)}
                  >
                    <Label color="default" sx={{ mr: 1 }}>
                      CIN verso
                    </Label>
                    <FontAwesomeIcon
                      icon={versoOpen ? faChevronDown : faChevronRight}
                      style={{ width: 20, height: 20 }}
                    />
                  </Box>
                  {versoOpen && existingCIN ? (
                    <Box
                      component="img"
                      src={existingCIN.verso}
                      alt="CIN Verso"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: 400,
                        borderRadius: 1,
                        border: '1px solid #ccc',
                        mt: 2,
                      }}
                    />
                  ) : null}
                </Box>
              </>
            ) : (
              <></>
            )}
            <Box sx={{ flexGrow: 1 }} />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              p: 3,
            }}
          >
            <Box
              display="grid"
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
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

              <Field.CountrySelect
                fullWidth
                name="country"
                label="Pays"
                placeholder="Choisissez un pays"
              />
              <Field.Text name="state" label="Région" />
              <Field.Text name="city" label="Ville" />
              <Field.Text name="address" label="Adresse" />
              <Field.Text name="zipCode" label="Code postal" />

              {values.role === 'Enfant' ? (
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field, fieldState }) => {
                    const defaultSelection = field.value
                      ? filteredParents.find((p) => p.id === field.value)
                      : filteredParents[0] || null;

                    if (!field.value && filteredParents[0]) {
                      field.onChange(filteredParents[0].id);
                    }

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
                          />
                        )}
                        clearOnEscape
                      />
                    );
                  }}
                />
              ) : (
                <></>
              )}
            </Box>

            {values.role === 'Parent' ? (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Réimporter CIN
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Recto
                    </Typography>
                    <Button variant="contained" component="label">
                      Choisir un fichier
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
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Fichier sélectionné : {cinRectoFile.name}
                      </Typography>
                    ) : (
                      <></>
                    )}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Verso
                    </Typography>
                    <Button variant="contained" component="label">
                      Choisir un fichier
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
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Fichier sélectionné : {cinVersoFile.name}
                      </Typography>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Stack>
              </Box>
            ) : (
              <></>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ textAlign: 'right', mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                color="primary"
              >
                {!currentUser ? 'Create user' : 'Enregistrer les modifications'}
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
