import type { Theme } from '@mui/material/styles';
import type { IAIAssistantItem, IAIAssistantTableColumns } from 'src/types/ai-assistant';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faEdit, faRobot, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

// Import FontAwesome icons

import { ConfirmDialog } from 'src/shared/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: IAIAssistantItem;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onEditRow: () => void;
  onSettingsRow: () => void;
  onOpenDeleteConfirm: () => void;
  visibleColumns: IAIAssistantTableColumns;
  cellStyle?: any;
};

export function AIAssistantTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onSettingsRow,
  onOpenDeleteConfirm,
  visibleColumns,
  cellStyle,
}: Props) {
  const confirm = useBoolean();

  // Fonction pour formatter la date
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return '-';
    try {
      if (dateString instanceof Date) {
        return dateString.toLocaleDateString();
      }
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return String(dateString);
    }
  };

  // On utilise le style passé en prop, ou on définit un style par défaut si aucun n'est fourni
  const defaultCellStyle = {
    backgroundColor: (theme: Theme) => theme.palette.background.neutral,
    color: (theme: Theme) => theme.palette.text.primary,
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    fontWeight: 'normal',
    padding: '12px 16px',
  };

  // Utiliser le style passé en prop ou le style par défaut
  const appliedStyle = cellStyle || defaultCellStyle;

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          width: '100%',
          '&.Mui-selected': {
            backgroundColor: (theme) => theme.palette.action.selected,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          },
        }}
      >
        <TableCell padding="checkbox" sx={appliedStyle}>
          <Checkbox checked={selected} onChange={onSelectRow} />
        </TableCell>

        {visibleColumns.name && (
          <TableCell sx={appliedStyle}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '140%' }}>
              <FontAwesomeIcon icon={faRobot} style={{ color: 'primary.main', fontSize: '1rem' }} />
              <Box sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {row.name || '-'}
              </Box>
            </Stack>
          </TableCell>
        )}

        {visibleColumns.type && (
          <TableCell sx={appliedStyle}>
            {row.type === 'Apprentissge' ? 'Apprentissge' : row.type || '-'}
          </TableCell>
        )}
        {visibleColumns.dateAjoute && (
          <TableCell sx={appliedStyle}>{formatDate(row.dateAjoute)}</TableCell>
        )}
        {visibleColumns.educationLevel && (
          <TableCell sx={appliedStyle}>{row.educationLevel || '-'}</TableCell>
        )}
        {visibleColumns.subject && <TableCell sx={appliedStyle}>{row.subject || '-'}</TableCell>}
        {visibleColumns.chapter && <TableCell sx={appliedStyle}>{row.chapter || '-'}</TableCell>}
        {visibleColumns.exercise && <TableCell sx={appliedStyle}>{row.exercise || '-'}</TableCell>}
        {visibleColumns.status && (
          <TableCell sx={appliedStyle}>
            <Box
              sx={{
                padding: '2px 3px',
                borderRadius: '5px',
                backgroundColor:
                  row.status === 'active' ? 'rgba(2, 255, 2, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                display: 'inline-block',
                fontWeight: 'bold',
                color:
                  (row.status === 'success' && 'success.main') ||
                  (row.status === 'pending' && 'warning.main') ||
                  (row.status === 'failed' && 'error.main') ||
                  (row.status === 'refunded' && 'success.main') ||
                  'text.primary',
              }}
            >
              {row.status}
            </Box>
          </TableCell>
        )}

        <TableCell align="right" sx={appliedStyle}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="Modifier">
              <IconButton color="primary" onClick={onEditRow}>
                <FontAwesomeIcon icon={faEdit} style={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Paramètres">
              <IconButton color="info" onClick={onSettingsRow}>
                <FontAwesomeIcon icon={faCog} style={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Supprimer">
              <IconButton color="error" onClick={onOpenDeleteConfirm}>
                <FontAwesomeIcon icon={faTrashAlt} style={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer cet assistant?"
        action={
          <IconButton color="error" onClick={onDeleteRow}>
            <FontAwesomeIcon icon={faCheck} style={{ fontSize: '1rem' }} />
          </IconButton>
        }
      />
    </>
  );
}
