import type { INotificationType } from 'src/contexts/types/notification';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { Box, Tooltip, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { NOTIFICATION_TYPE_OPTIONS, NOTIFICATION_STATUS_OPTIONS } from 'src/shared/_mock/_notification';

import { Label } from 'src/shared/components/label';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';

import {NotificationDetails} from './notification-details';


// ----------------------------------------------------------------------
type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
  isFilterable?: boolean;
};
type Props = {
  row: INotificationType;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  hideStatus: boolean;
  visibleColumns: Column[];
};

export function NotificationTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  hideStatus = false,
  visibleColumns,
}: Props) {
  const confirm = useBoolean();
  const resendNotification = useBoolean();
  const openDetails = useBoolean();

  const isColumnVisible = (columnId: string) => visibleColumns.some((col) => col.id === columnId);
  
  // Get type label
  const getTypeLabel = (typeValue: string) => {
    const type = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === typeValue);
    return type ? type.label : typeValue;
  };
  
  // Get status label
  const getStatusLabel = (statusValue: string) => {
    const status = NOTIFICATION_STATUS_OPTIONS.find((option) => option.value === statusValue);
    return status ? status.label : statusValue;
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
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

        {isColumnVisible('title') && (
          <TableCell
            sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            <Stack spacing={2} direction="row" alignItems="center">
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="body2" noWrap>
                    {row.title}
                  </Typography>
                }
                secondary={
                  <Link
                    noWrap
                    variant="body2"
                    onClick={openDetails.onTrue}
                    sx={{ color: 'text.disabled', cursor: 'pointer' }}
                  >
                    Voir détails
                  </Link>
                }
              />
            </Stack>
          </TableCell>
        )}
        
        {isColumnVisible('sentDate') && (
          <TableCell>
            <ListItemText
              primary={row.sentDate ? fDate(row.sentDate) : 'Non disponible'}
              secondary={row.sentDate ? fTime(row.sentDate) : ''}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
            />
          </TableCell>
        )}

        {isColumnVisible('type') && (
          <TableCell>
            <Label
              variant="soft"
              color={
                (row.type === 'information' && 'info') ||
                (row.type === 'promotional' && 'primary') ||
                (row.type === 'reminder' && 'warning') ||
                (row.type === 'alert' && 'error') ||
                'default'
              }
            >
              {getTypeLabel(row.type)}
            </Label>
          </TableCell>
        )}
        
        {isColumnVisible('channel') && (
          <TableCell>
            <Stack direction="row" spacing={1}>
              {row.channel.map((ch) => (
                <Chip
                  key={ch}
                  label={ch === 'email' ? 'Email' : ch === 'sms' ? 'SMS' : 'Push'}
                  size="small"
                  color={
                    ch === 'email' ? 'primary' : 
                    ch === 'sms' ? 'secondary' : 
                    'default'
                  }
                  variant="outlined"
                />
              ))}
            </Stack>
          </TableCell>
        )}
        
        {isColumnVisible('status') && !hideStatus ? (
          <TableCell>
            <Label variant="soft" color={getStatusColor(row.status)}>
              {getStatusLabel(row.status)}
            </Label>
          </TableCell>
        ) : (
          <></>
        )}
        
        {isColumnVisible('recipients') && (
          <TableCell>
            {Array.isArray(row.recipients) ? (
              <Typography variant="body2">
                {row.recipients.length} destinataire(s)
              </Typography>
            ) : (
              <Typography variant="body2">
                {row.recipients.name} ({row.recipients.count})
              </Typography>
            )}
          </TableCell>
        )}
        
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1, zIndex: 1, position: 'sticky' }}>
            <Tooltip title="Voir détails">
              <IconButton size="small" onClick={openDetails.onTrue} color="info">
                <FontAwesomeIcon icon={faEye} size="xs" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Renvoyer">
              <IconButton 
                size="small" 
                onClick={resendNotification.onTrue} 
                color="success"
                disabled={row.status === 'sent'}
              >
                <FontAwesomeIcon icon={faPaperPlane} size="xs" />
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

      {/* You'd need to create these components */}
      <NotificationDetails open={openDetails.value} onClose={openDetails.onFalse} notification={row} />
      
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer cette notification?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}