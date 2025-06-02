// Path: src/shared/sections/paiements/payment-configuration/hooks/useStripeConfig.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

import type {
  StripeConfig,
  CreditCardConfig,
  BankTransferConfig,
  PaymentConfigResponse,
  ApiResponse,
} from '../types/payment.types';

// Mock data - replace with actual API calls
const mockStripeConfig: StripeConfig = {
  id: '1',
  active: false,
  mode: 'sandbox',
  liveSecretKey: '',
  sandboxSecretKey: '',
  webhookUrl: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCreditCardConfig: CreditCardConfig = {
  id: '1',
  active: false,
  title: 'Carte bancaire',
  logos: ['Visa', 'Mastercard'],
  disabledCreditCards: [],
  vaulting: false,
  contingencyFor3DSecure: 'REQUIRED',
};

const mockBankTransferConfig: BankTransferConfig = {
  id: '1',
  active: false,
  title: 'Virement bancaire',
  description: 'Payez directement sur notre compte bancaire',
  accountId: '',
  bankAccounts: [],
};

// API simulation functions
const fetchStripeConfig = async (): Promise<StripeConfig> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would be an API call
  // For demo purposes, we'll simulate with sessionStorage
  const stored = sessionStorage.getItem('stripe-config');
  if (stored) {
    try {
      const config = JSON.parse(stored);
      // Ensure dates are properly parsed
      return {
        ...config,
        createdAt: config.createdAt ? new Date(config.createdAt) : new Date(),
        updatedAt: config.updatedAt ? new Date(config.updatedAt) : new Date(),
      };
    } catch {
      return mockStripeConfig;
    }
  }
  return mockStripeConfig;
};

const updateStripeConfig = async (config: StripeConfig): Promise<ApiResponse<StripeConfig>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate potential API error (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Erreur de connexion au serveur');
  }

  // Validate required fields
  if (config.mode === 'live' && !config.liveSecretKey) {
    throw new Error('La clé secrète live est requise en mode production');
  }

  if (config.mode === 'sandbox' && !config.sandboxSecretKey) {
    throw new Error('La clé secrète sandbox est requise en mode test');
  }

  // Update config with current timestamp
  const updatedConfig: StripeConfig = {
    ...config,
    updatedAt: new Date(),
  };

  // Save to sessionStorage for demo
  sessionStorage.setItem('stripe-config', JSON.stringify(updatedConfig));

  return {
    success: true,
    data: updatedConfig,
    message: 'Configuration Stripe mise à jour avec succès',
  };
};

const fetchCreditCardConfig = async (): Promise<CreditCardConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const stored = sessionStorage.getItem('credit-card-config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockCreditCardConfig;
    }
  }
  return mockCreditCardConfig;
};

const updateCreditCardConfig = async (
  config: CreditCardConfig
): Promise<ApiResponse<CreditCardConfig>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate potential API error
  if (Math.random() < 0.05) {
    throw new Error('Erreur de connexion au serveur');
  }

  // Validate required fields
  if (!config.title.trim()) {
    throw new Error('Le titre est requis');
  }

  sessionStorage.setItem('credit-card-config', JSON.stringify(config));

  return {
    success: true,
    data: config,
    message: 'Configuration carte bancaire mise à jour avec succès',
  };
};

const fetchBankTransferConfig = async (): Promise<BankTransferConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const stored = sessionStorage.getItem('bank-transfer-config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockBankTransferConfig;
    }
  }
  return mockBankTransferConfig;
};

const updateBankTransferConfig = async (
  config: BankTransferConfig
): Promise<ApiResponse<BankTransferConfig>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate potential API error
  if (Math.random() < 0.05) {
    throw new Error('Erreur de connexion au serveur');
  }

  // Validate required fields
  if (!config.title.trim()) {
    throw new Error('Le titre est requis');
  }

  if (!config.description.trim()) {
    throw new Error('La description est requise');
  }

  sessionStorage.setItem('bank-transfer-config', JSON.stringify(config));

  return {
    success: true,
    data: config,
    message: 'Configuration virement bancaire mise à jour avec succès',
  };
};

// Main Stripe configuration hook
export const useStripeConfig = () => {
  const [config, setConfig] = useState<StripeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStripeConfig();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = async (newConfig: StripeConfig) => {
    const response = await updateStripeConfig(newConfig);
    if (response.success && response.data) {
      setConfig(response.data);
    }
    return response;
  };

  const clearError = () => setError(null);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    saveConfig,
    refetch: loadConfig,
    clearError,
  };
};

// Credit card configuration hook
export const useCreditCardConfig = () => {
  const [config, setConfig] = useState<CreditCardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCreditCardConfig();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = async (newConfig: CreditCardConfig) => {
    const response = await updateCreditCardConfig(newConfig);
    if (response.success && response.data) {
      setConfig(response.data);
    }
    return response;
  };

  const clearError = () => setError(null);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    saveConfig,
    refetch: loadConfig,
    clearError,
  };
};

// Bank transfer configuration hook
export const useBankTransferConfig = () => {
  const [config, setConfig] = useState<BankTransferConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBankTransferConfig();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = async (newConfig: BankTransferConfig) => {
    const response = await updateBankTransferConfig(newConfig);
    if (response.success && response.data) {
      setConfig(response.data);
    }
    return response;
  };

  const clearError = () => setError(null);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    saveConfig,
    refetch: loadConfig,
    clearError,
  };
};

// Combined configuration hook for dashboard overview
export const usePaymentConfigurations = () => {
  const stripeConfig = useStripeConfig();
  const creditCardConfig = useCreditCardConfig();
  const bankTransferConfig = useBankTransferConfig();

  const isLoading = stripeConfig.loading || creditCardConfig.loading || bankTransferConfig.loading;

  const hasErrors = !!(stripeConfig.error || creditCardConfig.error || bankTransferConfig.error);

  const errors = [stripeConfig.error, creditCardConfig.error, bankTransferConfig.error].filter(
    Boolean
  );

  const configuredMethodsCount = [
    stripeConfig.config?.liveSecretKey || stripeConfig.config?.sandboxSecretKey,
    creditCardConfig.config?.title,
    bankTransferConfig.config?.title && bankTransferConfig.config?.bankAccounts?.length,
  ].filter(Boolean).length;

  const activeMethodsCount = [
    stripeConfig.config?.active,
    creditCardConfig.config?.active,
    bankTransferConfig.config?.active,
  ].filter(Boolean).length;

  const refetchAll = async () => {
    await Promise.all([
      stripeConfig.refetch(),
      creditCardConfig.refetch(),
      bankTransferConfig.refetch(),
    ]);
  };

  const clearAllErrors = () => {
    stripeConfig.clearError();
    creditCardConfig.clearError();
    bankTransferConfig.clearError();
  };

  return {
    stripe: stripeConfig,
    creditCard: creditCardConfig,
    bankTransfer: bankTransferConfig,
    isLoading,
    hasErrors,
    errors,
    configuredMethodsCount,
    activeMethodsCount,
    refetchAll,
    clearAllErrors,
  };
};

// Utility hook for checking configuration status
export const usePaymentConfigStatus = () => {
  const { stripe, creditCard, bankTransfer } = usePaymentConfigurations();

  const getStripeStatus = () => {
    if (!stripe.config) return { configured: false, active: false };

    const hasKeys = stripe.config.liveSecretKey || stripe.config.sandboxSecretKey;
    return {
      configured: !!hasKeys,
      active: stripe.config.active && !!hasKeys,
    };
  };

  const getCreditCardStatus = () => {
    if (!creditCard.config) return { configured: false, active: false };

    return {
      configured: !!creditCard.config.title,
      active: creditCard.config.active,
    };
  };

  const getBankTransferStatus = () => {
    if (!bankTransfer.config) return { configured: false, active: false };

    const hasAccounts = bankTransfer.config.bankAccounts?.length > 0;
    return {
      configured: !!bankTransfer.config.title && hasAccounts,
      active: bankTransfer.config.active && hasAccounts,
    };
  };

  return {
    stripe: getStripeStatus(),
    creditCard: getCreditCardStatus(),
    bankTransfer: getBankTransferStatus(),
  };
};
