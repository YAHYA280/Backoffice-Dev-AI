'use client';

import type { IPaymentMethod } from 'src/contexts/types/payment';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { paths } from 'src/routes/paths';

import { useGetPaymentMethods } from 'src/utils/payment';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TablePaginationCustom,
} from 'src/shared/components/table';

import PaymentMethodTableRow from './methods-table-row';

// Composant pour le squelette de chargement
const TableSkeleton = () => (
  <Card>
    <TableContainer sx={{ position: 'relative', overflow: 'unset', maxWidth: '1420px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '300px' }} align="center">
              Nom
            </TableCell>
            <TableCell sx={{ width: '300px', pl: '50px' }} align="center">
              Activé
            </TableCell>
            <TableCell sx={{ width: '520px' }} align="center">
              Description
            </TableCell>
            <TableCell sx={{ width: '300px' }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <Scrollbar>
        <Table size="medium" sx={{ minWidth: 800 }}>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton animation="wave" height={40} />
                </TableCell>
                <TableCell>
                  <Skeleton animation="wave" height={40} />
                </TableCell>
                <TableCell>
                  <Skeleton animation="wave" height={40} width="80%" />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Skeleton animation="wave" height={40} width={40} variant="circular" />
                    <Skeleton animation="wave" height={40} width={40} variant="circular" />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  </Card>
);

export default function PaymentMethodsView() {
  const table = useTable({ defaultOrderBy: 'title' });
  const { paymentMethodsData, paymentMethodsError, paymentMethodsLoading } = useGetPaymentMethods();
  const [tableData, setTableData] = useState<IPaymentMethod[]>([]);

  const denseHeight = table.dense ? 56 : 76;

  useEffect(() => {
    if (paymentMethodsData) {
      setTableData(paymentMethodsData);
    }
  }, [paymentMethodsData]);

  const isEmptyData = !paymentMethodsLoading && !tableData.length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Méthodes de paiements"
          links={[
            {
              name: 'Tableau de bord',
              href: paths.dashboard.root,
            },
            {
              name: 'Paiements',
              href: paths.dashboard.paiements.root,
            },
            {
              name: 'Configuration des paiements',
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <ConditionalComponent isValid={paymentMethodsLoading}>
          <TableSkeleton />
        </ConditionalComponent>
        <ConditionalComponent isValid={paymentMethodsError}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              fontSize: '1rem',
            }}
          >
            Impossible de charger les méthodes de paiement. Veuillez réessayer plus tard.
          </Alert>
        </ConditionalComponent>
        <ConditionalComponent isValid={!paymentMethodsLoading && !paymentMethodsError}>
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset', maxWidth: '1420px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: { xs: '120px', md: '300px' } }} align="center">
                      <Typography variant="subtitle2">Nom</Typography>
                    </TableCell>
                    <TableCell
                      sx={{ width: { xs: '100px', md: '300px' }, pl: { xs: '20px', md: '50px' } }}
                      align="center"
                    >
                      <Typography variant="subtitle2">Activé</Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        width: { xs: '200px', md: '520px' },
                        display: { xs: 'none', md: 'table-cell' },
                      }}
                      align="center"
                    >
                      <Typography variant="subtitle2">Description</Typography>
                    </TableCell>
                    <TableCell sx={{ width: { xs: '100px', md: '300px' } }} align="center">
                      <Typography variant="subtitle2">Actions</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>

              <Scrollbar>
                <Table
                  size={table.dense ? 'small' : 'medium'}
                  sx={{ minWidth: { xs: 500, md: 800 } }}
                >
                  <TableBody>
                    <ConditionalComponent
                      isValid={isEmptyData}
                      defaultComponent={tableData
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <PaymentMethodTableRow key={row.id} row={row} />
                        ))}
                    >
                      <TableRow>
                        <TableCell colSpan={4} sx={{ py: 10 }}>
                          <Typography variant="subtitle1" textAlign="center">
                            Aucune méthode de paiement disponible
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </ConditionalComponent>

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                    />

                    <ConditionalComponent isValid={tableData.length === 0}>
                      <TableNoData notFound />
                    </ConditionalComponent>
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <ConditionalComponent isValid={tableData.length > 0}>
              <TablePaginationCustom
                count={tableData.length}
                page={table.page}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                onRowsPerPageChange={table.onChangeRowsPerPage}
                dense={table.dense}
                onChangeDense={table.onChangeDense}
                sx={{
                  '& .MuiTablePagination-root': {
                    borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                  },
                }}
              />
            </ConditionalComponent>
          </Card>
        </ConditionalComponent>
      </Container>
    </LocalizationProvider>
  );
}
