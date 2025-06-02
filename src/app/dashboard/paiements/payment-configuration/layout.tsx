'use client';

import { Snackbar } from 'src/shared/components/snackbar';

type Props = {
  children: React.ReactNode;
};

export default function PaymentConfigurationLayout({ children }: Props) {
  return (
    <>
      <Snackbar />
      {children}
    </>
  );
}
