'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { primary } from 'src/shared/theme/core';

import RHFCode from 'src/shared/components/hook-form/rhf-code';

import { useAuthContext } from 'src/auth/hooks';

const VerifyCodeSchema = z.object({
  code: z.string().min(6, 'Le code doit être à 6 chiffres').nonempty('Code est requis'),
});

export default function JwtVerifyView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const { verifyResetCode } = useAuthContext();

  const defaultValues = {
    code: '',
    token: token || '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await verifyResetCode?.(data.token, data.code);
      router.push(paths.auth.newPassword);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFCode name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Vérifier
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="primary"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        Annuler
      </Link>
    </Stack>
  );

  const renderHead = (
    <Stack alignItems="center">
      <FontAwesomeIcon icon={faEnvelope} size="5x" color={primary.main} width={30} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h4">Merci de consulter vos emails!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Nous avons envoyé un code de confirmation à 6 chiffres à votre adresse e-mail. Veuillez
          saisir le code dans la case ci-dessous pour vérifier votre adresse e-mail.
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
