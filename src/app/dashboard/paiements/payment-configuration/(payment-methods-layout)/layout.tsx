'use client';

import PaymentMethodsLayout from 'src/shared/layouts/payment';

import { Snackbar } from 'src/shared/components/snackbar';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <PaymentMethodsLayout>
      <Snackbar />
      {children}
    </PaymentMethodsLayout>
  );
}
