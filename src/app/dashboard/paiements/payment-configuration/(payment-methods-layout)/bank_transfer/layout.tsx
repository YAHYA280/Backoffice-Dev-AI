import { Snackbar } from 'src/shared/components/snackbar';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Snackbar />
      {children}
    </>
  );
}
