import type { ISubscriberItem } from 'src/contexts/types/subscriber';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

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

import { fDate, fTime } from 'src/utils/format-time';

import { PAYMENT_METHOD_OPTIONS } from 'src/shared/_mock/_payment';
import { BILLING_CYCLE_OPTIONS } from 'src/shared/_mock/_subscriber';

import { Label } from 'src/shared/components/label';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';

import { SubscriberDetails } from './subscriber-details';

// ----------------------------------------------------------------------
type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
  isFilterable?: boolean;
};
type Props = {
  row: ISubscriberItem;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  hideStatus: boolean;
  visibleColumns: Column[];
};

export function SubscriberTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  hideStatus = false,
  visibleColumns,
}: Props) {
  const confirm = useBoolean();
  const sendEmail = useBoolean();
  const openDetails = useBoolean();

  const isColumnVisible = (columnId: string) => visibleColumns.some((col) => col.id === columnId);
  
  // Generate a avatar placeholder for the subscriber based on their name
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}` 
      : parts[0].substring(0, 2);
  };

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
              alt={row.name}
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: selected ? 'primary.main' : 'primary.light' 
              }}
            >
              {getInitials(row.name)}
            </Avatar>
            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.name}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={openDetails.onTrue}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >
                  {row.email || 'Non disponible'}
                </Link>
              }
            />
          </Stack>
        </TableCell>
        
        {isColumnVisible('email') && (
          <TableCell
          sx={{ 
            maxWidth: 160, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}
        >
          <Typography variant="body2" noWrap>{row.email}</Typography>
        </TableCell>
        )}
        
        {isColumnVisible('phone') && (
          <TableCell>
            <Typography variant="body2">{row.phone || 'Non disponible'}</Typography>
          </TableCell>
        )}
        
        {isColumnVisible('subscriptionStartDate') && (
          <TableCell>
            <ListItemText
              primary={row.subscriptionStartDate ? fDate(row.subscriptionStartDate) : 'Non disponible'}
              secondary={row.subscriptionStartDate ? fTime(row.subscriptionStartDate) : ''}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
            />
          </TableCell>
        )}
        
        {isColumnVisible('subscriptionEndDate') && (
          <TableCell>
            <ListItemText
              primary={row.subscriptionEndDate ? fDate(row.subscriptionEndDate) : 'Non disponible'}
              secondary={row.subscriptionEndDate ? fTime(row.subscriptionEndDate) : ''}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
            />
          </TableCell>
        )}

        {isColumnVisible('billingCycle') && (
          <TableCell>
            <Typography variant="body2">
              {BILLING_CYCLE_OPTIONS.find((option) => option.value === row.billingCycle)?.label || 
                'Non disponible'}
            </Typography>
          </TableCell>
        )}
        
        {isColumnVisible('paymentMethod') && (
          <TableCell>
            <Typography variant="body2">
              {PAYMENT_METHOD_OPTIONS.find((option) => option.value === row.paymentMethod)?.label ||
                'Non disponible'}
            </Typography>
          </TableCell>
        )}
        
        {isColumnVisible('status') && !hideStatus ? (
          <TableCell>
            <Label
              variant="soft"
              color={
                (row.status === 'active' && 'success') ||
                (row.status === 'pending' && 'warning') ||
                (row.status === 'inactive' && 'error') ||
                'default'
              }
            >
              {(row.status === 'active' && 'Actif') ||
                (row.status === 'pending' && 'En attente') ||
                (row.status === 'inactive' && 'Inactif') ||
                row.status || 'Inconnu'}
            </Label>
          </TableCell>
        ) : null}
        
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1, zIndex: 1, position: 'sticky' }}>
            <Tooltip title="Voir détails">
              <IconButton size="small" onClick={openDetails.onTrue} color="info">
                <FontAwesomeIcon icon={faEye} size="xs" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Envoyer email">
              <IconButton size="small" onClick={sendEmail.onTrue} color="success">
                <FontAwesomeIcon icon={faEnvelope} size="xs" />
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

      <SubscriberDetails
        subscriber={row}
        openDetails={openDetails}
        onDeleteSubscriber={onDeleteRow}
        onCloseDetails={openDetails.onFalse}
      />
      
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer cet abonné?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}