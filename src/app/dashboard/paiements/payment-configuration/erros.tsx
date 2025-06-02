'use client';

import { useEffect } from 'react';

import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Box, Alert, Button, Container, Typography } from '@mui/material';

export default function PaymentConfigError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Payment configuration error:', error);
  }, [error]);

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Alert
          severity="error"
          sx={{
            width: '100%',
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Erreur de configuration des paiements
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Une erreur s&apos;est produite lors du chargement de la configuration des paiements.
          </Typography>
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={reset} color="error">
            Réessayer
          </Button>
        </Alert>
      </Box>
    </Container>
  );
}
