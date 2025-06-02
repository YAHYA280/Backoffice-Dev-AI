'use client';

import React from 'react';

import { PaymentConfigHeader } from '../components/layout/PaymentConfigHeader';
import { PaymentConfigContainer } from '../components/layout/PaymentConfigContainer';
import { StripeCreditCardConfig } from '../components/stripe/StripeCreditCardConfig';
import { useCreditCardConfig, useStripeConfig } from '../hooks/useStripeConfig';

export default function CreditCardConfigView() {
  const { config: creditCardConfig, loading, error, saveConfig, refetch } = useCreditCardConfig();
  const { config: stripeConfig } = useStripeConfig();

  const isConfigured = Boolean(
    creditCardConfig?.title && (stripeConfig?.liveSecretKey || stripeConfig?.sandboxSecretKey)
  );

  const handleSave = async (newConfig: typeof creditCardConfig) => {
    if (newConfig) {
      await saveConfig(newConfig);
    }
  };

  return (
    <PaymentConfigContainer>
      <PaymentConfigHeader
        title="Configuration Carte Bancaire"
        description="Configurez les options de paiement par carte bancaire via Stripe avec des paramètres de sécurité avancés"
        isConfigured={isConfigured}
        isActive={creditCardConfig?.active}
        mode={stripeConfig?.mode}
      />

      <StripeCreditCardConfig
        creditCardConfig={creditCardConfig || undefined}
        loading={loading}
        error={error}
        onSave={handleSave}
        onReset={refetch}
      />
    </PaymentConfigContainer>
  );
}
