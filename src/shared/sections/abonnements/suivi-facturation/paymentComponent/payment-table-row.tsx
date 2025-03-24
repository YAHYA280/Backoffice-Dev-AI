import type { IPaymentItem } from 'src/contexts/types/payment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt, faFileInvoice } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { Box, Tooltip, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { PAYMENT_METHOD_OPTIONS } from 'src/shared/_mock/_payment';

import { Label } from 'src/shared/components/label';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';

import { PaymentDetails } from './payment-details';
import { GenerateInvoiceDialog } from './payment-generate-invoice-dialog-dialog';

// ----------------------------------------------------------------------
type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
  isFilterable?: boolean;
};
type Props = {
  row: IPaymentItem;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  hideStatus: boolean;
  visibleColumns: Column[];
};

export function PaymentTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  hideStatus = false,
  visibleColumns,
}: Props) {
  const confirm = useBoolean();
  const generateFacture = useBoolean();
  const openDetails = useBoolean();

  const isColumnVisible = (columnId: string) => visibleColumns.some((col) => col.id === columnId);
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>

        <TableCell
          sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              alt={row.subscriber?.name}
              src={row.subscriber?.avatarUrl}
              sx={{ width: 48, height: 48 }}
            />
            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.subscriber?.name}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={openDetails.onTrue}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >
                  {row.transactionId ? row.transactionId : 'Non disponible'}
                </Link>
              }
            />
          </Stack>
        </TableCell>
        {isColumnVisible('paymentDate') && (
          <TableCell>
            <ListItemText
              primary={row.paymentDate ? fDate(row.paymentDate) : 'Non disponible'}
              secondary={row.paymentDate ? fTime(row.paymentDate) : ''}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
            />
          </TableCell>
        )}

        {isColumnVisible('amount') && (
          <TableCell sx={{ paddingLeft: 4 }}>{row.amount ? fCurrency(row.amount) : 0}</TableCell>
        )}
        {isColumnVisible('paymentMethod') && (
          <TableCell sx={{ paddingLeft: 4 }}>
            <Typography>
              {' '}
              {PAYMENT_METHOD_OPTIONS.find((option) => option.value === row.paymentMethod)?.label ||
                'Non disponible'}
            </Typography>
          </TableCell>
        )}
        {isColumnVisible('status') && !hideStatus ? (
          <TableCell sx={{ paddingLeft: 4 }}>
            <Label
              variant="soft"
              color={
                (row.status === 'success' && 'success') ||
                (row.status === 'pending' && 'warning') ||
                (row.status === 'failed' && 'error') ||
                (row.status === 'refunded' && 'success') ||
                'default'
              }
            >
              {(row.status === 'success' && 'Réussi') ||
                (row.status === 'pending' && 'En attente') ||
                (row.status === 'failed' && 'Échoué') ||
                (row.status === 'refunded' && 'Remboursée') ||
                'default'}
            </Label>
          </TableCell>
        ) : (
          <></>
        )}
        {isColumnVisible('invoiceGenerated') && (
          <TableCell sx={{ paddingLeft: 4 }}>
            <Label
              variant="soft"
              color={
                (row.invoiceGenerated === true && 'info') ||
                (row.invoiceGenerated === false && 'warning') ||
                'default'
              }
            >
              {(row.invoiceGenerated === true && 'Oui') ||
                (row.invoiceGenerated === false && 'Non') ||
                'default'}
            </Label>
          </TableCell>
        )}
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1, zIndex: 1, position: 'sticky' }}>
            <Tooltip title="Voir détails">
              <IconButton size="small" onClick={openDetails.onTrue} color="info">
                <FontAwesomeIcon icon={faEye} size="xs" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Générer Facture">
              <IconButton size="small" onClick={generateFacture.onTrue} color="success">
                <FontAwesomeIcon icon={faFileInvoice} size="xs" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Supprimer">
              <IconButton size="small" onClick={confirm.onTrue} color="error">
                <FontAwesomeIcon icon={faTrashAlt} size="xs" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      <GenerateInvoiceDialog
        open={generateFacture.value}
        onClose={generateFacture.onFalse}
        payment={row}
      />
      <PaymentDetails
        payment={row}
        openDetails={openDetails}
        onDeleteInvoice={onDeleteRow}
        onCloseDetails={openDetails.onFalse}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}
