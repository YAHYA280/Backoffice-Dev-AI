'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/shared/assets/icons';

import { RHFTextField } from 'src/shared/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function AmplifyForgotPasswordView() {
  const { forgotPassword } = useAuthContext();

  const router = useRouter();

  // Zod schema
  const ForgotPasswordSchema = z.object({
    email: z
      .string()
      .email('Email doit être une adresse e-mail valide')
      .nonempty('Email est requis'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword?.(data.email);

      const href = `${paths.auth.forgotPasswordSuccess}`;
      router.push(href);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Adresse électronique" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Envoyer demande
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
        <FontAwesomeIcon icon={faChevronLeft} width={16} />
        Revenir pour vous connecter
      </Link>
    </Stack>
  );

  const renderHead = (
    <Stack alignItems="center">
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center' }}>
        <Typography variant="h5">Avez-vous oublié votre mot de passe?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Veuillez saisir l&apos;adresse e-mail associée à votre compte et nous vous enverrons un
          lien pour réinitialiser votre mot de passe.
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate autoComplete="off">
          {renderForm}
        </form>
      </FormProvider>
    </>
  );
}
