'use client';

import type { AuditEvent } from 'src/contexts/types/audit';

import { useMemo, useState, useCallback } from 'react';
import {
  faCog,
  faEdit,
  faPlus,
  faTimes,
  faTrash,
  faHistory,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { AuditActionType } from 'src/contexts/types/audit';
import { mockAuditEvents, getFieldTranslation } from 'src/shared/_mock/_audit';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { FontAwesome } from 'src/shared/components/fontawesome';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// ----------------------------------------------------------------------

export type HistoryDrawerProps = {
  data?: AuditEvent[];
  sx?: any;
  onClick?: () => void;
  entityTypeFilter?: string | null;
};

// Mapping des chemins d'URL aux types d'entité
const PATH_TO_ENTITY_MAP: Record<string, string> = {
  [paths.dashboard.paiements.root]: 'Payment',
  [paths.dashboard.configuration.root]: 'Configuration',
  [paths.dashboard.user.root]: 'User',
  [paths.dashboard.users.root]: 'User',
};

// Composant bouton pour afficher l'historique
export function HistoryButton({ onClick, sx, count = 0, ...other }: any) {
  const theme = useTheme();

  return (
    <Tooltip title="Historique des audits">
      <IconButton
        onClick={onClick}
        sx={{
          color: theme.palette.mode === 'light' ? 'text.primary' : 'text.secondary',
          ...sx,
        }}
        {...other}
      >
        <Badge badgeContent={count} color="error">
          <FontAwesome icon={faHistory} />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}

// Format de la date pour l'affichage
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

// Couleurs et icônes pour les différentes actions
const getActionInfo = (action: AuditActionType): { color: string; icon: any; text: string } => {
  switch (action) {
    case AuditActionType.CREATE:
      return { color: 'success.main', icon: faPlus, text: 'Création' };
    case AuditActionType.UPDATE:
      return { color: 'info.main', icon: faEdit, text: 'Modification' };
    case AuditActionType.DELETE:
      return { color: 'error.main', icon: faTrash, text: 'Suppression' };
    case AuditActionType.CONFIGURATION:
      return { color: 'warning.main', icon: faCog, text: 'Changement paramètre' };
    default:
      return { color: 'text.primary', icon: faEdit, text: 'Action' };
  }
};

// Formatter la valeur selon son type
const formatValue = (value: any, fieldType: string): string => {
  if (value === null || value === undefined) return '—';

  switch (fieldType) {
    case 'boolean':
      return value ? 'Oui' : 'Non';
    case 'number':
      return typeof value === 'number' ? value.toLocaleString('fr-FR') : String(value);
    default:
      return String(value);
  }
};

// Obtenir la couleur différentielle entre ancien et nouveau
const getChangeColor = (oldValue: any, newValue: any, fieldType: string): string => {
  if (oldValue === null && newValue !== null) return 'success.main';
  if (fieldType === 'boolean' && oldValue !== newValue)
    return newValue ? 'success.main' : 'error.main';
  return 'info.main';
};

// Composant principal du drawer d'historique
export function HistoryDrawer({ data, sx, entityTypeFilter, ...other }: HistoryDrawerProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleViewAll = useCallback(() => {
    handleCloseDrawer();
    router.push(paths.dashboard.audit);
  }, [handleCloseDrawer, router]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  // Déterminer le type d'entité actuel basé sur le pathname
  const currentEntityType = useMemo(() => {
    if (entityTypeFilter) return entityTypeFilter;

    // Chercher dans le map des chemins
    const match = Object.entries(PATH_TO_ENTITY_MAP).find(([pathPart]) =>
      pathname.includes(pathPart)
    );

    if (match) {
      return match[1]; // entityType
    }

    return null;
  }, [pathname, entityTypeFilter]);

  // Récupérer les données d'historique filtrées par type d'entité
  const historyData = useMemo(() => {
    // Si des données sont fournies via props, les utiliser
    const sourceData = data?.length ? data : mockAuditEvents;

    // Filtrer par type d'entité si nécessaire
    return currentEntityType
      ? sourceData.filter((event) => event.entityType === currentEntityType)
      : sourceData;
  }, [currentEntityType, data]);

  // Compter le nombre d'événements récents (moins de 7 jours)
  const recentEventsCount = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return currentEntityType
      ? mockAuditEvents.filter(
          (event) => event.entityType === currentEntityType && event.timestamp > sevenDaysAgo
        ).length
      : mockAuditEvents.filter((event) => event.timestamp > sevenDaysAgo).length;
  }, [currentEntityType]);

  // Génération d'initiales pour avatar
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  return (
    <>
      <HistoryButton onClick={handleOpenDrawer} sx={sx} count={recentEventsCount} {...other} />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: { xs: 320, sm: 400 } } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <FontAwesome icon={faTimes} />
        </IconButton>

        <Stack sx={{ p: 3, pt: 7 }}>
          <Typography variant="h6">Historique des audits</Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 400, sm: 500 } }}>
          <Stack spacing={2} sx={{ p: 2.5 }}>
            {historyData.length > 0 ? (
              historyData.map((item) => {
                const { color, icon, text } = getActionInfo(item.actionType);
                const isExpanded = expandedItems[item.id] || false;

                return (
                  <Stack
                    key={item.id}
                    spacing={1.5}
                    sx={{
                      p: 2,
                      borderRadius: 1.5,
                      bgcolor: 'background.neutral',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {/* En-tête de l'audit */}
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: color,
                          color: 'common.white',
                        }}
                      >
                        <FontAwesome icon={icon} />
                      </Avatar>

                      <Stack spacing={0.2} sx={{ flexGrow: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle2">
                            {text} {item.entityType}
                          </Typography>

                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {formatDate(item.timestamp)}
                          </Typography>
                        </Stack>

                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>
                            ID:
                          </Box>{' '}
                          {item.entityId}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Informations sur l'utilisateur */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {getInitials(item.userName)}
                      </Avatar>

                      <Typography variant="body2">{item.userName}</Typography>
                    </Stack>

                    {/* Bouton pour voir les détails */}
                    <ConditionalComponent isValid={item.changes.length > 0}>
                      <>
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => toggleExpanded(item.id)}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          {isExpanded ? 'Masquer les détails' : 'Voir les détails'} (
                          {item.changes.length})
                        </Button>
                        <ConditionalComponent isValid={isExpanded}>
                          <Box sx={{ pl: 1 }}>
                            {item.changes.map((change, idx) => (
                              <Stack
                                key={`${item.id}-change-${idx}`}
                                direction="row"
                                spacing={1}
                                sx={{
                                  p: 1,
                                  mb: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  border: `1px dashed ${theme.palette.divider}`,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    minWidth: 70,
                                  }}
                                >
                                  {getFieldTranslation(change.fieldName) || 'Non défini'}:
                                </Typography>

                                <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                                  <ConditionalComponent isValid={change.oldValue !== null}>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'line-through',
                                        wordBreak: 'break-word',
                                      }}
                                    >
                                      {formatValue(change.oldValue, change.fieldType)}
                                    </Typography>
                                  </ConditionalComponent>

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: getChangeColor(
                                        change.oldValue,
                                        change.newValue,
                                        change.fieldType
                                      ),
                                      fontWeight: 'medium',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {formatValue(change.newValue, change.fieldType)}
                                  </Typography>
                                </Stack>
                              </Stack>
                            ))}
                          </Box>
                        </ConditionalComponent>
                      </>
                    </ConditionalComponent>
                  </Stack>
                );
              })
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: 0.7,
                }}
              >
                <FontAwesome
                  icon={faHistory}
                  style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}
                />
                <Typography variant="body2">
                  {currentEntityType
                    ? `Aucun historique d'audit disponible pour les ${currentEntityType}s`
                    : "Aucun historique d'audit disponible"}
                </Typography>
              </Box>
            )}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5, borderTop: `dashed 1px ${theme.palette.divider}` }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleViewAll}
            startIcon={<FontAwesome icon={faHistory} />}
          >
            Voir tous les audits
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

// Composant wrapper qui détermine dynamiquement le type d'entité basé sur le pathname
export function DynamicHistoryDrawer(props: Omit<HistoryDrawerProps, 'entityTypeFilter'>) {
  const pathname = usePathname();

  // Déterminer le type d'entité actuel basé sur le pathname
  const currentEntityType = useMemo(() => {
    // Chercher dans le map des chemins
    const match = Object.entries(PATH_TO_ENTITY_MAP).find(([pathPart]) =>
      pathname.includes(pathPart)
    );

    if (match) {
      return match[1]; // entityType
    }
    return null;
  }, [pathname]);

  return <HistoryDrawer {...props} entityTypeFilter={currentEntityType} />;
}
