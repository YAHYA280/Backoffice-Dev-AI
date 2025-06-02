// Path: src/shared/sections/paiements/payment-configuration/hooks/usePaymentConfigurations.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

import type {
  StripeConfig,
  CreditCardConfig,
  BankTransferConfig,
  ConfigurationStatus,
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
  webhookSecret: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCreditCardConfig: CreditCardConfig = {
  id: '1',
  active: false,
  title: 'Carte bancaire',
  allowedBrands: ['Visa', 'Mastercard'],
  disabledBrands: [],
  vaulting: false,
  threeDSecure: 'REQUIRED',
  displayLogos: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockBankTransferConfig: BankTransferConfig = {
  id: '1',
  active: false,
  title: 'Virement bancaire',
  description: 'Effectuez le paiement directement depuis votre compte bancaire',
  instructions: "Veuillez indiquer l'ID de votre commande en référence.",
  showAccountDetails: true,
  bankAccounts: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Utility functions for localStorage simulation
const getStorageKey = (configType: string) => `payment-config-${configType}`;

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt);
      if (parsed.updatedAt) parsed.updatedAt = new Date(parsed.updatedAt);
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// API simulation functions
const fetchStripeConfig = async (): Promise<StripeConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return loadFromStorage(getStorageKey('stripe'), mockStripeConfig);
};

const updateStripeConfig = async (config: StripeConfig): Promise<ApiResponse<StripeConfig>> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate potential API error
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

  const updatedConfig: StripeConfig = {
    ...config,
    updatedAt: new Date(),
  };

  saveToStorage(getStorageKey('stripe'), updatedConfig);

  return {
    success: true,
    data: updatedConfig,
    message: 'Configuration Stripe mise à jour avec succès',
  };
};

const fetchCreditCardConfig = async (): Promise<CreditCardConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return loadFromStorage(getStorageKey('credit-card'), mockCreditCardConfig);
};

const updateCreditCardConfig = async (
  config: CreditCardConfig
): Promise<ApiResponse<CreditCardConfig>> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (Math.random() < 0.05) {
    throw new Error('Erreur de connexion au serveur');
  }

  if (!config.title.trim()) {
    throw new Error('Le titre est requis');
  }

  const updatedConfig: CreditCardConfig = {
    ...config,
    updatedAt: new Date(),
  };

  saveToStorage(getStorageKey('credit-card'), updatedConfig);

  return {
    success: true,
    data: updatedConfig,
    message: 'Configuration carte bancaire mise à jour avec succès',
  };
};

const fetchBankTransferConfig = async (): Promise<BankTransferConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return loadFromStorage(getStorageKey('bank-transfer'), mockBankTransferConfig);
};

const updateBankTransferConfig = async (
  config: BankTransferConfig
): Promise<ApiResponse<BankTransferConfig>> => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (Math.random() < 0.05) {
    throw new Error('Erreur de connexion au serveur');
  }

  if (!config.title.trim()) {
    throw new Error('Le titre est requis');
  }

  if (!config.description.trim()) {
    throw new Error('La description est requise');
  }

  const updatedConfig: BankTransferConfig = {
    ...config,
    updatedAt: new Date(),
  };

  saveToStorage(getStorageKey('bank-transfer'), updatedConfig);

  return {
    success: true,
    data: updatedConfig,
    message: 'Configuration virement bancaire mise à jour avec succès',
  };
};

// Individual configuration hooks
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

// Combined configuration hook
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

// Configuration status hook
export const usePaymentConfigStatus = (): ConfigurationStatus => {
  const { stripe, creditCard, bankTransfer } = usePaymentConfigurations();

  const getStripeStatus = () => {
    if (!stripe.config) return { configured: false, active: false };

    const hasKeys = stripe.config.liveSecretKey || stripe.config.sandboxSecretKey;
    return {
      configured: !!hasKeys,
      active: stripe.config.active && !!hasKeys,
      mode: stripe.config.mode,
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
    if (!bankTransfer.config) return { configured: false, active: false, accountsCount: 0 };

    const hasAccounts = bankTransfer.config.bankAccounts?.length > 0;
    return {
      configured: !!bankTransfer.config.title && hasAccounts,
      active: bankTransfer.config.active && hasAccounts,
      accountsCount: bankTransfer.config.bankAccounts?.length || 0,
    };
  };

  return {
    stripe: getStripeStatus(),
    creditCard: getCreditCardStatus(),
    bankTransfer: getBankTransferStatus(),
  };
};
