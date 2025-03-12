'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { NewPasswordIcon } from 'src/shared/assets/icons';

import { RHFTextField } from 'src/shared/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function AmplifyNewPasswordView() {
  const { newPassword } = useAuthContext();
  const router = useRouter();
  const password = useBoolean();
  const confirmPassword = useBoolean();

  const VerifySchema = z
    .object({
      password: z.string().min(6, 'Le mot de passe doit être au moins de 6 caractères'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: 'Les mots de passe doivent correspondre',
      path: ['confirmPassword'],
    });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await newPassword?.(data.password);
      router.push(paths.auth.newPasswordSuccess);
    } catch (error) {
      console.error(error);
    }
  });

  const renderHead = (
    <Stack alignItems="center">
      <NewPasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }} alignItems="center">
        <Typography variant="h3">Nouveau Mot de passe</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Mettez à jour votre mot de passe
        </Typography>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="password"
        label="Nouveau Mot de passe"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <FontAwesomeIcon icon={password.value ? faEye : faEyeSlash} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="confirmPassword"
        label="Confirmer nouveau mot de passe"
        type={confirmPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <FontAwesomeIcon icon={confirmPassword.value ? faEye : faEyeSlash} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Changer
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        Se connecter
      </Link>
    </Stack>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {renderHead}
        {renderForm}
      </form>
    </FormProvider>
  );
}
