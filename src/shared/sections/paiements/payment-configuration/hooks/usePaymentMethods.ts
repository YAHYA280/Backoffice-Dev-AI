// Path: src/shared/sections/paiements/payment-configuration/hooks/usePaymentMethods.ts

'use client';

import { useState, useEffect } from 'react';

import type { PaymentMethod, ApiResponse } from '../types/payment.types';

// Mock payment methods data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    type: 'credit_card',
    title: 'Configuration Stripe',
    description: 'Configurez votre intégration Stripe pour traiter les paiements',
    active: false,
    icon: 'stripe',
  },
  {
    id: 'credit_card',
    type: 'credit_card',
    title: 'Carte Bancaire',
    description: 'Configurez les options de paiement par carte bancaire',
    active: false,
    icon: 'credit_card',
  },
  {
    id: 'bank_transfer',
    type: 'bank_transfer',
    title: 'Virement Bancaire',
    description: 'Configurez les options de virement bancaire',
    active: false,
    icon: 'bank_transfer',
  },
  {
    id: 'paypal',
    type: 'paypal',
    title: 'PayPal',
    description: 'Intégrez PayPal comme méthode de paiement',
    active: false,
    icon: 'paypal',
  },
  {
    id: 'apple_pay',
    type: 'apple_pay',
    title: 'Apple Pay',
    description: 'Acceptez les paiements Apple Pay',
    active: false,
    icon: 'apple_pay',
  },
];

// API simulation functions
const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Get from sessionStorage for demo purposes
  const stored = sessionStorage.getItem('payment-methods');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockPaymentMethods;
    }
  }
  return mockPaymentMethods;
};

const updatePaymentMethodStatus = async (
  methodId: string,
  active: boolean
): Promise<ApiResponse<PaymentMethod>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate potential API error
  if (Math.random() < 0.05) {
    throw new Error('Erreur de connexion au serveur');
  }

  // Get current methods
  const stored = sessionStorage.getItem('payment-methods');
  let methods = mockPaymentMethods;

  if (stored) {
    try {
      methods = JSON.parse(stored);
    } catch {
      methods = mockPaymentMethods;
    }
  }

  // Update the specific method
  const updatedMethods = methods.map((method) =>
    method.id === methodId ? { ...method, active } : method
  );

  // Save back to sessionStorage
  sessionStorage.setItem('payment-methods', JSON.stringify(updatedMethods));

  const updatedMethod = updatedMethods.find((m) => m.id === methodId);

  return {
    success: true,
    data: updatedMethod,
    message: `Méthode de paiement ${active ? 'activée' : 'désactivée'} avec succès`,
  };
};

const updatePaymentMethod = async (
  methodId: string,
  updates: Partial<PaymentMethod>
): Promise<ApiResponse<PaymentMethod>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate potential API error
  if (Math.random() < 0.05) {
    throw new Error('Erreur de connexion au serveur');
  }

  // Get current methods
  const stored = sessionStorage.getItem('payment-methods');
  let methods = mockPaymentMethods;

  if (stored) {
    try {
      methods = JSON.parse(stored);
    } catch {
      methods = mockPaymentMethods;
    }
  }

  // Update the specific method
  const updatedMethods = methods.map((method) =>
    method.id === methodId ? { ...method, ...updates } : method
  );

  // Save back to sessionStorage
  sessionStorage.setItem('payment-methods', JSON.stringify(updatedMethods));

  const updatedMethod = updatedMethods.find((m) => m.id === methodId);

  return {
    success: true,
    data: updatedMethod,
    message: 'Méthode de paiement mise à jour avec succès',
  };
};

// Custom hook for payment methods
export const usePaymentMethods = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPaymentMethods();
      setMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const toggleMethodStatus = async (methodId: string, active: boolean) => {
    const response = await updatePaymentMethodStatus(methodId, active);
    if (response.success && response.data) {
      setMethods((prev) =>
        prev.map((method) => (method.id === methodId ? response.data! : method))
      );
    }
    return response;
  };

  const updateMethod = async (methodId: string, updates: Partial<PaymentMethod>) => {
    const response = await updatePaymentMethod(methodId, updates);
    if (response.success && response.data) {
      setMethods((prev) =>
        prev.map((method) => (method.id === methodId ? response.data! : method))
      );
    }
    return response;
  };

  const getMethodById = (methodId: string) => methods.find((method) => method.id === methodId);

  const getActiveMethodsCount = () => methods.filter((method) => method.active).length;

  const getMethodsByType = (type: PaymentMethod['type']) =>
    methods.filter((method) => method.type === type);

  useEffect(() => {
    loadMethods();
  }, []);

  return {
    methods,
    loading,
    error,
    toggleMethodStatus,
    updateMethod,
    getMethodById,
    getActiveMethodsCount,
    getMethodsByType,
    refetch: loadMethods,
  };
};

// Hook for individual payment method
export const usePaymentMethod = (methodId: string) => {
  const { methods, loading, error, toggleMethodStatus, updateMethod, refetch } =
    usePaymentMethods();

  const method = methods.find((m) => m.id === methodId);

  const toggleStatus = async (active: boolean) => toggleMethodStatus(methodId, active);

  const update = async (updates: Partial<PaymentMethod>) => updateMethod(methodId, updates);

  return {
    method,
    loading,
    error,
    toggleStatus,
    update,
    refetch,
  };
};
