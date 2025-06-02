'use client';

import React from 'react';

import { PaymentConfigHeader } from '../components/layout/PaymentConfigHeader';
import { PaymentConfigContainer } from '../components/layout/PaymentConfigContainer';
import { StripeGeneralConfig } from '../components/stripe/StripeGeneralConfig';
import { useStripeConfig } from '../hooks/useStripeConfig';

export default function StripeConfigView() {
  const { config, loading, error, saveConfig, refetch } = useStripeConfig();

  const isConfigured = Boolean(config?.liveSecretKey || config?.sandboxSecretKey);

  const handleSave = async (newConfig: typeof config) => {
    if (newConfig) {
      await saveConfig(newConfig);
    }
  };

  return (
    <PaymentConfigContainer>
      <PaymentConfigHeader
        title="Configuration Stripe"
        description="Configurez votre intégration Stripe pour accepter les paiements en ligne de manière sécurisée"
        isConfigured={isConfigured}
        isActive={config?.active}
        mode={config?.mode}
      />

      <StripeGeneralConfig
        stripeConfig={config || undefined}
        loading={loading}
        error={error}
        onSave={handleSave}
        onReset={refetch}
      />
    </PaymentConfigContainer>
  );
}
