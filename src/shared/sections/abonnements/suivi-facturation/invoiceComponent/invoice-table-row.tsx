import type { IInvoice } from 'src/contexts/types/invoice';
import type { LabelColor } from 'src/shared/components/label';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Box, Tooltip } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/shared/components/label';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';

import { InvoiceDetails } from './invoice-details';

// ----------------------------------------------------------------------
type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
  isFilterable?: boolean;
};
type Props = {
  row: IInvoice;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  hideStatus: boolean;
  visibleColumns: Column[];
};

export function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  hideStatus = false,
  visibleColumns,
}: Props) {
  const confirm = useBoolean();
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

        <TableCell>
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
                  {row.invoiceNumber}
                </Link>
              }
            />
          </Stack>
        </TableCell>
        {isColumnVisible('createDate') && (
          <TableCell>
            <ListItemText
              primary={row.createDate ? fDate(row.createDate) : 'Non disponible'}
              secondary={row.createDate ? fTime(row.createDate) : ''}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
            />
          </TableCell>
        )}

        {isColumnVisible('amount') && (
          <TableCell sx={{ paddingLeft: 4 }}>
            {row.amount ? fCurrency(row.amount) : fCurrency(0)}
          </TableCell>
        )}

        {isColumnVisible('status') && !hideStatus ? (
          <TableCell sx={{ paddingLeft: 4 }}>
            <Label
              variant="soft"
              color={
                (
                  {
                    paid: 'success',
                    pending: 'warning',
                    failed: 'error',
                    sent: 'success',
                    refunded: 'info',
                  } as Record<string, LabelColor>
                )[row.status] || 'success'
              }
            >
              {{
                paid: 'Payée',
                pending: 'En attente',
                failed: 'Échoué',
                sent: 'Envoyée',
                refunded: 'Remboursée',
              }[row.status] || 'default'}
            </Label>
          </TableCell>
        ) : (
          <></>
        )}

        {isColumnVisible('payment') && (
          <TableCell sx={{ paddingLeft: 4 }}>
            {row.payment.transactionId}
            {row.payment.transactionId ? row.payment.transactionId : 'Non disponible'}
          </TableCell>
        )}
        <TableCell align="right">
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end',
              zIndex: 1,
              position: 'sticky',
            }}
          >
            <Tooltip title="Voir détails">
              <IconButton size="small" onClick={openDetails.onTrue} color="info">
                <FontAwesomeIcon icon={faEye} size="xs" />
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

      <InvoiceDetails
        invoice={row}
        openDetails={openDetails}
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
