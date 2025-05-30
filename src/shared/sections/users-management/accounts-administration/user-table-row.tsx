'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faBan,
  faUndo,
  faTrash,
  faPause,
  faUnlock,
  faEllipsisV,
  faUserCheck,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Select, Tooltip, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks';
import { getStatusLabel, mapUserTypeToRole } from 'src/contexts/types/user';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog/confirm-dialog';

import { apiService, type IUserItem } from '../api.service';

const SUSPEND_DURATIONS = [7, 14, 30];

type Props = {
  row: IUserItem;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  onRefresh?: () => void;
  statusFilter?: string;
  columns: Array<{ id: string; label: string; width?: string | number }>;
};

interface DeletedParent {
  id: string;
  lastName: string;
  firstName: string;
}

interface SuspensionRequest {
  reason: string;
  suspensionEnd: string;
}

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onRefresh,
  statusFilter = 'Tous',
  columns,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const router = useRouter();

  const confirmDelete = useBoolean();
  const confirmBlock = useBoolean();
  const confirmSuspend = useBoolean();
  const confirmReactivate = useBoolean();
  const confirmUnblock = useBoolean();
  const confirmRestore = useBoolean();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const [deletedParentInfo, setDeletedParentInfo] = useState<DeletedParent | null>(null);
  const confirmDeleteChildren = useBoolean();

  const [blockReason, setBlockReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState(SUSPEND_DURATIONS[0]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Fonction utilitaire pour calculer la date de fin de suspension
  const calculateSuspensionEndDate = (days: number): string =>
    dayjs().add(days, 'day').toISOString();

  // Fonction pour obtenir le type d'utilisateur normalisé
  const getUserType = (): string => row.role?.toLowerCase() || row.userType?.toLowerCase() || '';

  const handleDeleteUser = async () => {
    setIsDeleting(true);

    try {
      const userType = getUserType();

      switch (userType) {
        case 'parent':
          await apiService.user.deleteParent(row.id);
          toast.success(`Le parent ${row.firstName} ${row.lastName} a été supprimé avec succès.`);
          setDeletedParentInfo({ id: row.id, firstName: row.firstName, lastName: row.lastName });
          confirmDelete.onFalse();
          confirmDeleteChildren.onTrue();
          break;

        case 'child':
        case 'enfant':
          await apiService.user.deleteChild(row.id);
          toast.success(`L'enfant ${row.firstName} ${row.lastName} a été supprimé avec succès.`);
          confirmDelete.onFalse();
          if (onRefresh) onRefresh();
          break;

        case 'admin':
        case 'administrateur':
          await apiService.user.deleteAdmin(row.id);
          toast.success(
            `L'administrateur ${row.firstName} ${row.lastName} a été supprimé avec succès.`
          );
          confirmDelete.onFalse();
          if (onRefresh) onRefresh();
          break;

        default:
          throw new Error("Type d'utilisateur non reconnu");
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(
        `Erreur lors de la suppression: ${error.message || 'Une erreur inconnue est survenue'}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlockUser = async () => {
    setIsBlocking(true);

    try {
      const userType = getUserType();

      switch (userType) {
        case 'parent':
          await apiService.user.blockParent(row.id, blockReason);
          break;
        case 'child':
        case 'enfant':
          await apiService.user.blockChild(row.id, blockReason);
          break;
        case 'admin':
        case 'administrateur':
          await apiService.user.blockAdmin(row.id, blockReason);
          break;
        default:
          throw new Error("Type d'utilisateur non reconnu");
      }

      toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été bloqué avec succès.`);
      confirmBlock.onFalse();
      setBlockReason('');
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error('Erreur lors du blocage:', error);
      toast.error(`Erreur lors du blocage: ${error.message || 'Une erreur inconnue est survenue'}`);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleSuspendUser = async () => {
    if (!suspendReason.trim() || !suspendDuration) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setIsSuspending(true);

    try {
      const userType = getUserType();
      const suspensionEndDate = calculateSuspensionEndDate(suspendDuration);
      const suspensionRequest: SuspensionRequest = {
        reason: suspendReason,
        suspensionEnd: suspensionEndDate,
      };

      switch (userType) {
        case 'parent':
          await apiService.user.suspendParent(row.id, suspensionRequest);
          await apiService.user.suspendChildrenByParent(row.id, suspensionEndDate);
          break;
        case 'child':
        case 'enfant':
          await apiService.user.suspendChild(row.id, suspensionRequest);
          break;
        case 'admin':
        case 'administrateur':
          await apiService.user.suspendAdmin(row.id, suspensionRequest);
          break;
        default:
          throw new Error("Type d'utilisateur non reconnu");
      }

      toast.success(
        `L'utilisateur ${row.firstName} ${row.lastName} a été suspendu pour ${suspendDuration} jours.`
      );
      confirmSuspend.onFalse();
      setSuspendReason('');
      setSuspendDuration(SUSPEND_DURATIONS[0]);
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error('Erreur lors de la suspension:', error);
      toast.error(
        `Erreur lors de la suspension: ${error.message || 'Une erreur inconnue est survenue'}`
      );
    } finally {
      setIsSuspending(false);
    }
  };

  const handleReactivateUser = async () => {
    setIsReactivating(true);

    try {
      const userType = getUserType();

      switch (userType) {
        case 'parent':
          await apiService.user.reactivateParent(row.id);
          break;
        case 'child':
        case 'enfant':
          await apiService.user.reactivateChild(row.id);
          break;
        case 'admin':
        case 'administrateur':
          await apiService.user.reactivateAdmin(row.id);
          break;
        default:
          throw new Error("Type d'utilisateur non reconnu");
      }

      toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été réactivé avec succès.`);
      confirmReactivate.onFalse();
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error('Erreur lors de la réactivation:', error);
      toast.error(
        `Erreur lors de la réactivation: ${error.message || 'Une erreur inconnue est survenue'}`
      );
    } finally {
      setIsReactivating(false);
    }
  };

  const handleUnblockUser = async () => {
    setIsUnblocking(true);

    try {
      const userType = getUserType();

      switch (userType) {
        case 'parent':
          await apiService.user.reactivateParent(row.id);
          break;
        case 'child':
        case 'enfant':
          await apiService.user.reactivateChild(row.id);
          break;
        case 'admin':
        case 'administrateur':
          await apiService.user.reactivateAdmin(row.id);
          break;
        default:
          throw new Error("Type d'utilisateur non reconnu");
      }

      toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été débloqué avec succès.`);
      confirmUnblock.onFalse();
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error('Erreur lors du déblocage:', error);
      toast.error(
        `Erreur lors du déblocage: ${error.message || 'Une erreur inconnue est survenue'}`
      );
    } finally {
      setIsUnblocking(false);
    }
  };

  const handleRestoreUser = async () => {
    setIsRestoring(true);

    try {
      const userType = getUserType();

      switch (userType) {
        case 'parent':
          await apiService.user.deleteParent(row.id);
          break;
        case 'child':
        case 'enfant':
          await apiService.user.deleteChild(row.id);
          break;
        case 'admin':
        case 'administrateur':
          await apiService.user.deleteAdmin(row.id);
          break;
        default:
          throw new Error("Type d'utilisateur non reconnu");
      }

      toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été restauré avec succès.`);
      confirmRestore.onFalse();
      if (onRefresh) onRefresh();
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      toast.error(
        `Erreur lors de la restauration: ${error.message || 'Une erreur inconnue est survenue'}`
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDeleteChildren = async () => {
    if (!deletedParentInfo) return;

    setIsDeleting(true);
    try {
      await apiService.user.deleteChildrenByParent(deletedParentInfo.id);
      toast.success(
        `Les enfants de ${deletedParentInfo.firstName} ${deletedParentInfo.lastName} ont été supprimés avec succès.`
      );
    } catch (error: any) {
      console.error('Erreur lors de la suppression des enfants:', error);
      toast.error(
        `Erreur lors de la suppression des enfants: ${error.message || 'Une erreur inconnue est survenue'}`
      );
    } finally {
      setIsDeleting(false);
      confirmDeleteChildren.onFalse();
      setDeletedParentInfo(null);
      if (onRefresh) onRefresh();
    }
  };

  const handleCancelDeleteChildren = () => {
    confirmDeleteChildren.onFalse();
    setDeletedParentInfo(null);
    if (onRefresh) onRefresh();
  };

  const renderCellContent = (colId: string) => {
    switch (colId) {
      case 'select':
        return (
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
            inputProps={{
              id: `row-checkbox-${row.id}`,
              'aria-label': 'row checkbox',
            }}
          />
        );
      case 'name':
        return `${row.firstName} ${row.lastName}`;
      case 'email': {
        const fullEmail = row.email;
        return (
          <Tooltip title={fullEmail}>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {fullEmail}
            </Box>
          </Tooltip>
        );
      }
      case 'role':
        return mapUserTypeToRole(row.role);
      case 'statut':
        return (
          <Label
            variant="soft"
            sx={{
              ...(row.status === 'ACTIVE' && {
                bgcolor: 'rgb(186, 248, 193)',
                color: '#22bb33',
              }),
              ...(row.status === 'DELETED' && {
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                color: '#F44336',
              }),
              ...(row.status === 'BLOCKED' && {
                bgcolor: 'rgba(33, 33, 33, 0.1)',
                color: '#212121',
              }),
              ...(row.status === 'SUSPENDED' && {
                bgcolor: 'rgba(255, 152, 0, 0.1)',
                color: '#FF9800',
              }),
              ...(!['ACTIVE', 'DELETED', 'BLOCKED', 'SUSPENDED'].includes(row.status) && {
                bgcolor: 'rgba(145, 158, 171, 0.16)',
                color: 'text.secondary',
              }),
            }}
          >
            {getStatusLabel(row.status)}
          </Label>
        );
      case 'createdAt':
        return dayjs(row.createdAt).format('DD/MM/YYYY');
      case 'lastLogin':
        return row.lastLogin ? dayjs(row.lastLogin).format('DD/MM/YYYY') : '—';
      case 'actions':
        return (
          <>
            <IconButton onClick={handleOpenMenu}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </IconButton>
            <Menu
              open={menuOpen}
              anchorEl={anchorEl}
              onClose={handleCloseMenu}
              PaperProps={{ sx: { width: 200 } }}
            >
              {row.status === 'ACTIVE' ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      router.push(paths.dashboard.user.consulter(row.id));
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faEye} color="#2196F3" />
                    </ListItemIcon>
                    <ListItemText primary="Voir détails" sx={{ color: '#2196F3' }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      onEditRow();
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faPenToSquare} color="#F44336" />
                    </ListItemIcon>
                    <ListItemText primary="Modifier" sx={{ color: '#F44336' }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      confirmDelete.onTrue();
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faTrash} color="#F44336" />
                    </ListItemIcon>
                    <ListItemText primary="Supprimer" sx={{ color: '#F44336' }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      confirmBlock.onTrue();
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faBan} color="#212121" />
                    </ListItemIcon>
                    <ListItemText primary="Bloquer" sx={{ color: '#212121' }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      confirmSuspend.onTrue();
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faPause} color="#FF9800" />
                    </ListItemIcon>
                    <ListItemText primary="Suspendre" sx={{ color: '#FF9800' }} />
                  </MenuItem>
                </>
              ) : row.status === 'DELETED' ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      router.push(paths.dashboard.user.consulter(row.id));
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faEye} color="#2196F3" />
                    </ListItemIcon>
                    <ListItemText primary="Voir détails" sx={{ color: '#2196F3' }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      confirmRestore.onTrue();
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faUndo} color="#4CAF50" />
                    </ListItemIcon>
                    <ListItemText primary="Restaurer" sx={{ color: '#4CAF50' }} />
                  </MenuItem>
                </>
              ) : row.status === 'BLOCKED' ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      router.push(paths.dashboard.user.consulter(row.id));
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faEye} color="#2196F3" />
                    </ListItemIcon>
                    <ListItemText primary="Voir détails" sx={{ color: '#2196F3' }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      confirmUnblock.onTrue();
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faUnlock} color="#22bb33" />
                    </ListItemIcon>
                    <ListItemText primary="Débloquer" sx={{ color: '#22bb33' }} />
                  </MenuItem>
                </>
              ) : row.status === 'SUSPENDED' ? (
                <>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      router.push(paths.dashboard.user.consulter(row.id));
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faEye} color="#2196F3" />
                    </ListItemIcon>
                    <ListItemText primary="Voir détails" sx={{ color: '#2196F3' }} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      confirmReactivate.onTrue();
                    }}
                  >
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faUserCheck} color="#22bb33" />
                    </ListItemIcon>
                    <ListItemText primary="Réactiver" sx={{ color: '#22bb33' }} />
                  </MenuItem>
                </>
              ) : null}
            </Menu>
          </>
        );
      default:
        return (row as any)[colId];
    }
  };

  return (
    <>
      <TableRow hover selected={selected} tabIndex={-1}>
        {columns.map((col) => (
          <TableCell key={col.id} sx={{ width: col.width }}>
            {renderCellContent(col.id)}
          </TableCell>
        ))}
      </TableRow>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={`Supprimer l'utilisateur : ${row.firstName} ${row.lastName}`}
        content="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteUser}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        }
      />

      {/* Dialog de confirmation de suppression des enfants */}
      <ConfirmDialog
        open={confirmDeleteChildren.value}
        onClose={handleCancelDeleteChildren}
        title="Supprimer les enfants du parent ?"
        content={
          deletedParentInfo
            ? `Le parent ${deletedParentInfo.firstName} ${deletedParentInfo.lastName} a été supprimé. Souhaitez-vous également supprimer tous ses enfants ?`
            : ''
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteChildren}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Suppression...' : 'Oui'}
          </Button>
        }
      />

      {/* Dialog de blocage */}
      <ConfirmDialog
        open={confirmBlock.value}
        onClose={() => {
          confirmBlock.onFalse();
          setBlockReason('');
        }}
        title={`Bloquer l'utilisateur : ${row.firstName} ${row.lastName}`}
        content={
          <TextField
            fullWidth
            label="Motif (optionnel)"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleBlockUser}
            disabled={isBlocking}
            startIcon={isBlocking ? <CircularProgress size={20} /> : null}
          >
            {isBlocking ? 'Blocage...' : 'Bloquer'}
          </Button>
        }
      />

      {/* Dialog de suspension */}
      <ConfirmDialog
        open={confirmSuspend.value}
        onClose={() => {
          confirmSuspend.onFalse();
          setSuspendReason('');
          setSuspendDuration(SUSPEND_DURATIONS[0]);
        }}
        title={`Suspendre l'utilisateur : ${row.firstName} ${row.lastName}`}
        content={
          <>
            <TextField
              fullWidth
              label="Motif"
              required
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="suspend-duration-label">Durée *</InputLabel>
              <Select
                labelId="suspend-duration-label"
                label="Durée *"
                value={suspendDuration}
                onChange={(e) => setSuspendDuration(Number(e.target.value))}
              >
                <MenuItem value={7}>7 jours</MenuItem>
                <MenuItem value={14}>14 jours</MenuItem>
                <MenuItem value={30}>30 jours</MenuItem>
              </Select>
            </FormControl>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleSuspendUser}
            disabled={isSuspending || !suspendReason.trim() || !suspendDuration}
            startIcon={isSuspending ? <CircularProgress size={20} /> : null}
          >
            {isSuspending ? 'Suspension...' : 'Suspendre'}
          </Button>
        }
      />

      {/* Dialog de réactivation */}
      <ConfirmDialog
        open={confirmReactivate.value}
        onClose={confirmReactivate.onFalse}
        title={`Réactiver l'utilisateur : ${row.firstName} ${row.lastName}`}
        content="Êtes-vous sûr de vouloir réactiver cet utilisateur suspendu ?"
        action={
          <Button
            variant="contained"
            color="success"
            onClick={handleReactivateUser}
            disabled={isReactivating}
            startIcon={isReactivating ? <CircularProgress size={20} /> : null}
          >
            {isReactivating ? 'Réactivation...' : 'Réactiver'}
          </Button>
        }
      />

      {/* Dialog de déblocage */}
      <ConfirmDialog
        open={confirmUnblock.value}
        onClose={confirmUnblock.onFalse}
        title={`Débloquer l'utilisateur : ${row.firstName} ${row.lastName}`}
        content="Êtes-vous sûr de vouloir débloquer cet utilisateur ?"
        action={
          <Button
            variant="contained"
            color="success"
            onClick={handleUnblockUser}
            disabled={isUnblocking}
            startIcon={isUnblocking ? <CircularProgress size={20} /> : null}
          >
            {isUnblocking ? 'Déblocage...' : 'Débloquer'}
          </Button>
        }
      />

      {/* Dialog de restauration */}
      <ConfirmDialog
        open={confirmRestore.value}
        onClose={confirmRestore.onFalse}
        title={`Restaurer l'utilisateur : ${row.firstName} ${row.lastName}`}
        content="Êtes-vous sûr de vouloir restaurer cet utilisateur supprimé ?"
        action={
          <Button
            variant="contained"
            color="success"
            onClick={handleRestoreUser}
            disabled={isRestoring}
            startIcon={isRestoring ? <CircularProgress size={20} /> : null}
          >
            {isRestoring ? 'Restauration...' : 'Restaurer'}
          </Button>
        }
      />
    </>
  );
}
