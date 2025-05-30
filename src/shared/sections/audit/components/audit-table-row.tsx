import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTimes,
  faArrowRight,
  faCalendarAlt,
  faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import {
  Box,
  Chip,
  Grid,
  Dialog,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { getFieldTranslation } from 'src/shared/_mock/_audit';
import {
  type AuditEvent,
  type AuditActionType,
  type AuditEntityType,
  getLabelAuditEntityType,
} from 'src/contexts/types/audit';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// ----------------------------------------------------------------------

// Component pour afficher le statut en fonction de l'action
const ActionChip = ({ actionType }: { actionType: AuditActionType }) => {
  const getChipProps = () => {
    switch (actionType) {
      case 'CREATE':
        return { label: 'Création', color: 'success' as const };
      case 'UPDATE':
        return { label: 'Modification', color: 'info' as const };
      case 'DELETE':
        return { label: 'Suppression', color: 'error' as const };
      case 'EXPORT':
        return { label: 'Export', color: 'warning' as const };
      default:
        return { label: actionType, color: 'default' as const };
    }
  };

  const { label, color } = getChipProps();
  return <Chip label={label} color={color} size="small" />;
};

// Component pour afficher l'entité
const EntityChip = ({ entityType }: { entityType: AuditEntityType }) => (
  <Chip label={getLabelAuditEntityType(entityType) || entityType} variant="outlined" size="small" />
);

// Composant pour afficher les détails de l'audit avec un design amélioré
const AuditDetailsDialog = ({
  open,
  onClose,
  auditLog,
}: {
  open: boolean;
  onClose: () => void;
  auditLog: AuditEvent;
}) => {
  const formatChanges = () => {
    if (!auditLog.changes || auditLog.changes.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">Aucun détail disponible</Typography>
        </Box>
      );
    }

    const {changes} = auditLog;

    return (
      <Stack spacing={1} sx={{ mt: 2 }}>
        {changes.map((change, index) => (
          <Box
            key={`${change.fieldName}-${index}`}
            sx={{
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'background.neutral',
              '&:hover': { bgcolor: 'background.paper', boxShadow: '0 0 5px rgba(0,0,0,0.1)' },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {getFieldTranslation(change.fieldName) || 'non spécifié'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Ancienne valeur
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    <ConditionalComponent
                      isValid={
                        change.oldValue !== undefined &&
                        change.oldValue !== null &&
                        change.oldValue !== ''
                      }
                      defaultComponent={
                        <Typography
                          component="span"
                          sx={{ fontStyle: 'italic', color: 'text.disabled' }}
                        >
                          Non défini
                        </Typography>
                      }
                    >
                      {String(change.oldValue)}
                    </ConditionalComponent>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  Nouvelle valeur
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    <ConditionalComponent
                      isValid={
                        change.newValue !== undefined &&
                        change.newValue !== null &&
                        change.newValue !== ''
                      }
                      defaultComponent={
                        <Typography
                          component="span"
                          sx={{ fontStyle: 'italic', color: 'text.disabled' }}
                        >
                          Non défini
                        </Typography>
                      }
                    >
                      {String(change.newValue)}
                    </ConditionalComponent>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[20],
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">
          Détails de l&apos;audit
          <ConditionalComponent isValid={!!auditLog.actionType}>
            <Box component="span" sx={{ ml: 1 }}>
              <ActionChip actionType={auditLog.actionType} />
            </Box>
          </ConditionalComponent>
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            color: 'grey.500',
            '&:hover': {
              color: 'grey.700',
              bgcolor: 'grey.100',
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Carte d'informations générales */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.neutral',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Date et heure
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {auditLog.timestamp ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                        {`${fDate(auditLog.timestamp)} à ${fTime(auditLog.timestamp)}`}
                      </Box>
                    ) : (
                      'Non disponible'
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Utilisateur
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Avatar
                      sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: 'primary.main' }}
                    >
                      {auditLog.userName?.charAt(0) || 'U'}
                    </Avatar>
                    {auditLog.userName || 'Non disponible'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Entité concernée
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EntityChip entityType={auditLog.entityType} />
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      (ID: {auditLog.entityId || 'Non disponible'})
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Identifiant de l&apos;opération
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}
                  >
                    {auditLog.id || 'Non disponible'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Modifications */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <FontAwesomeIcon icon={faExchangeAlt} size="sm" />
            Modifications apportées
          </Typography>

          <Box sx={{ maxHeight: '400px', overflow: 'auto', pr: 1 }}>{formatChanges()}</Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
  isFilterable?: boolean;
};

type Props = {
  row: AuditEvent;
  selected: boolean;
  onSelectRow: () => void;
  visibleColumns: Column[];
};

export function AuditTableRow({ row, selected, onSelectRow, visibleColumns }: Props) {
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

        <ConditionalComponent isValid={isColumnVisible('timestamp')}>
          <TableCell>
            <ListItemText
              primary={row.timestamp ? fDate(row.timestamp) : 'Non disponible'}
              secondary={row.timestamp ? fTime(row.timestamp) : ''}
              primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
            />
          </TableCell>
        </ConditionalComponent>

        <ConditionalComponent isValid={isColumnVisible('userName')}>
          <TableCell sx={{ paddingLeft: 4 }}>
            <Typography> {row.userName || 'Non disponible'}</Typography>
          </TableCell>
        </ConditionalComponent>

        <ConditionalComponent isValid={isColumnVisible('actionType')}>
          <TableCell sx={{ paddingLeft: 4 }}>
            <ActionChip actionType={row.actionType} />
          </TableCell>
        </ConditionalComponent>

        <ConditionalComponent isValid={isColumnVisible('entityType')}>
          <TableCell sx={{ paddingLeft: 4 }}>
            <EntityChip entityType={row.entityType} />
          </TableCell>
        </ConditionalComponent>

        <ConditionalComponent isValid={isColumnVisible('entityId')}>
          <TableCell sx={{ paddingLeft: 4 }}>
            <Typography> {row.entityId || 'Non disponible'}</Typography>
          </TableCell>
        </ConditionalComponent>

        <TableCell align="center">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              zIndex: 1,
              position: 'sticky',
            }}
          >
            <Tooltip title="Voir détails">
              <IconButton size="small" onClick={openDetails.onTrue} color="info">
                <FontAwesomeIcon icon={faEye} size="xs" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* Dialog pour afficher les détails de l'audit */}
      <AuditDetailsDialog open={openDetails.value} onClose={openDetails.onFalse} auditLog={row} />
    </>
  );
}
