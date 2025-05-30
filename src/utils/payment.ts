import type {
  IPaymentMethod,
  ICreditCardConfig,
  IBankTransferConfig,
} from 'src/contexts/types/payment';

import { useMemo, useState, useEffect } from 'react';

// Données mockées pour les méthodes de paiement
export const _paymentMethods: IPaymentMethod[] = [
  {
    id: 'credit_card',
    type: 'credit_card',
    order: 2,
    title: 'Carte Bancaire',
    active: true,
    description: 'Utilisez votre carte bancaire pour payer rapidement et en toute sécurité.',
  },
  {
    id: 'bank_transfer',
    type: 'bank_transfer',
    order: 3,
    title: 'Virement Bancaire',
    active: true,
    description: 'Payez directement à partir de votre compte bancaire.',
  },
];

// Données mockées pour les comptes bancaires
export const mockBankAccounts = [
  {
    name: 'Compte Exemple A',
    number: '000123456A',
    bank: 'Banque de A',
    code: '123456',
    IBAN: 'FR14 2004 1010 0505 0001 3M02 606',
    bic_swift: 'BICA123',
  },
  {
    name: 'Compte Exemple B',
    number: '000654321B',
    bank: 'Banque de B',
    code: '654321',
    IBAN: 'FR76 3000 6000 0112 3456 7890 189',
    bic_swift: 'BICB456',
  },
];

// Données supplémentaires pour les configurations
const mockConfigData = {
  credit_card: {
    id: 1,
    active: true,
    title: 'Carte Bancaire',
    logos: ['visa', 'mastercard', 'american-express'],
    disabledCreditCards: ['diners'],
    vaulting: true,
    contingencyFor3DSecure: 'REQUIRED',
  },
  bank_transfer: {
    id: 2,
    active: true,
    title: 'Virement Bancaire',
    accountId: mockBankAccounts[0].name,
    description: 'Instructions de paiement par virement bancaire.',
    bankAccounts: mockBankAccounts,
  },
};

// Stockage local des données
let localPaymentMethods = [..._paymentMethods];
const localConfigData = { ...mockConfigData };

// Fonction pour simuler un délai réseau
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// //////////////general configuration//////////////////////

export function useGetPaymentMethods() {
  const [data, setData] = useState<IPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    setIsValidating(true);
    try {
      // Simuler un appel API
      await delay(600);
      setData(localPaymentMethods);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return useMemo(
    () => ({
      paymentMethodsData: data,
      paymentMethodsLoading: isLoading,
      paymentMethodsError: error,
      paymentMethodsValidating: isValidating,
      refetch: fetchData,
    }),
    [data, error, isLoading, isValidating]
  );
}

export async function changePaymentMethodStatus(paymentMethod: string) {
  // Simuler un appel API
  await delay(300);

  // Mettre à jour les données locales
  localPaymentMethods = localPaymentMethods.map((item) => {
    if (item.type === paymentMethod) {
      return { ...item, active: !item.active };
    }
    return item;
  });

  return true;
}

// ////////////////////bank transfer configuration//////////////////////

export function useGetBankTranferConfig() {
  const [data, setData] = useState<IBankTransferConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    setIsValidating(true);
    try {
      // Simuler un appel API
      await delay(600);
      setData(localConfigData.bank_transfer as unknown as IBankTransferConfig);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return useMemo(
    () => ({
      bankTranferConfigData: data,
      bankTranferConfigLoading: isLoading,
      bankTranferConfigError: error,
      bankTranferConfigValidating: isValidating,
      refetch: fetchData,
    }),
    [data, error, isLoading, isValidating]
  );
}

export async function updateBankTrasnferConf(config: IBankTransferConfig) {
  // Simuler un appel API
  await delay(400);

  // Mettre à jour les données locales
  localConfigData.bank_transfer = {
    ...localConfigData.bank_transfer,
    ...config,
  };

  // Mettre également à jour la méthode de paiement si nécessaire
  localPaymentMethods = localPaymentMethods.map((item) => {
    if (item.type === 'bank_transfer') {
      return {
        ...item,
        active: config.active !== undefined ? config.active : item.active,
        title: config.title !== undefined ? config.title : item.title,
      };
    }
    return item;
  });

  return localConfigData.bank_transfer;
}

// ////////////////////credit card configuration//////////////////////

export function useGetCreditCardConfig() {
  const [data, setData] = useState<ICreditCardConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    setIsValidating(true);
    try {
      // Simuler un appel API
      await delay(600);
      setData(localConfigData.credit_card as unknown as ICreditCardConfig);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return useMemo(
    () => ({
      creditCardConfigData: data,
      creditCardConfigLoading: isLoading,
      creditCardConfigError: error,
      creditCardConfigValidating: isValidating,
      refetch: fetchData,
    }),
    [data, error, isLoading, isValidating]
  );
}

export async function updateCreditCardConfig(config: ICreditCardConfig) {
  // Simuler un appel API
  await delay(400);

  // Mettre à jour les données locales
  localConfigData.credit_card = {
    ...localConfigData.credit_card,
    ...config,
  };

  // Mettre également à jour la méthode de paiement si nécessaire
  localPaymentMethods = localPaymentMethods.map((item) => {
    if (item.type === 'credit_card') {
      return {
        ...item,
        active: config.active !== undefined ? config.active : item.active,
        title: config.title !== undefined ? config.title : item.title,
      };
    }
    return item;
  });

  return localConfigData.credit_card;
}
