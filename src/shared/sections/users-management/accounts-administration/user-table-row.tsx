'use client';

import type { IUserItem } from 'src/contexts/types/user';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye,faBan,faEdit,faUndo,faTrash,faPause,faUnlock,faEllipsisV,faUserCheck,} from '@fortawesome/free-solid-svg-icons';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Select, TextField, InputLabel, FormControl } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog/confirm-dialog';

const SUSPEND_DURATIONS = [7, 14, 30];

type Props = {
  row: IUserItem;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  statusFilter?: string;
};

export function UserTableRow({ row, selected, onEditRow, onSelectRow, statusFilter = 'Tous' }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const router = useRouter();
  const confirmDelete = useBoolean();
  const confirmBlock = useBoolean();
  const confirmSuspend = useBoolean();
  const confirmReactivate = useBoolean();
  const confirmUnblock = useBoolean();
  const confirmRestore = useBoolean();

  const [blockReason, setBlockReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState(SUSPEND_DURATIONS[0]);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TableRow hover selected={selected} tabIndex={-1}>
        <TableCell onClick={onSelectRow}>{`${row.firstName  } ${  row.lastName}`}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.role}</TableCell>
        {statusFilter === 'Tous' ? (
          <TableCell>
            <Label
              variant="soft"
              sx={{
                ...(row.status === 'Actif' && { bgcolor: 'rgb(186, 248, 193)', color: '#22bb33' }),
                ...(row.status === 'Supprimé' && { bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' }),
                ...(row.status === 'Bloqué' && { bgcolor: 'rgba(33, 33, 33, 0.1)', color: '#212121' }),
                ...(row.status === 'Suspendu' && { bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' }),
                ...(!['Actif', 'Supprimé', 'Bloqué', 'Suspendu'].includes(row.status) && {
                  bgcolor: 'rgba(145, 158, 171, 0.16)',
                  color: 'text.secondary',
                }),
              }}
            >
              {row.status}
            </Label>
          </TableCell>
        ) : (
          <>
          </>
        )}

        <TableCell>{row.createdAt}</TableCell>
        <TableCell>{row.lastLogin}</TableCell>
        {statusFilter === 'Suspendu' ? (
          <TableCell>{row.dureRestante} jours</TableCell>
        ) : (
          <>
          </>
        )}
        <TableCell>
          <IconButton onClick={handleOpenMenu}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </IconButton>
          <Menu open={menuOpen} anchorEl={anchorEl} onClose={handleCloseMenu} PaperProps={{ sx: { width: 200 } }}>
            {row.status === 'Actif' ? (
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
                  <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
                </MenuItem>
                <MenuItem
              onClick={() => {
                onEditRow();
              }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEdit} color="#4CAF50" />
                  </ListItemIcon>
                  <ListItemText primary="Modifier" sx={{ color: '#4CAF50' }} />
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
            ): (
              <>
              </>
            )}
            {row.status === 'Supprimé' ? (
              <>
                <MenuItem
              onClick={() => {
                handleCloseMenu();
                router.push(paths.dashboard.user.consulter(row.id));
              }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEye} color="#2196F3" />
                  </ListItemIcon>
                  <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
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
            ): (
              <>
              </>
            )}
            {row.status === 'Bloqué' ? (
              <>
                <MenuItem
              onClick={() => {
                handleCloseMenu();
                router.push(paths.dashboard.user.consulter(row.id));
              }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEye} color="#2196F3" />
                  </ListItemIcon>
                  <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
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
            ): (
              <>
              </>
            )}
            {row.status === 'Suspendu' ? (
              <>
                <MenuItem
              onClick={() => {
                handleCloseMenu();
                router.push(paths.dashboard.user.consulter(row.id));
              }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEye} color="#2196F3" />
                  </ListItemIcon>
                  <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
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
                  <ListItemText primary="Réactivé" sx={{ color: '#22bb33' }} />
                </MenuItem>
              </>
            ): (
              <>
              </>
            )}
            {!['Actif', 'Supprimé', 'Bloqué', 'Suspendu'].includes(row.status) ? (
              <MenuItem>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEye} color="#2196F3" />
                  </ListItemIcon>
                  <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
                </MenuItem>
            ): (
              <>
              </>
            )}
          </Menu>
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={`Supprimer l'utilisateur : ${`${row.firstName  } ${  row.lastName}`}`}
        content="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été supprimé avec succès.`);
              confirmDelete.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmBlock.value}
        onClose={confirmBlock.onFalse}
        title={`Bloquer l'utilisateur : ${`${row.firstName  } ${  row.lastName}`}`}
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
            onClick={() => {
              toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été bloqué avec succès.`);
              confirmBlock.onFalse();
            }}
          >
            Bloquer
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmSuspend.value}
        onClose={confirmSuspend.onFalse}
        title={`Suspendre l'utilisateur : ${`${row.firstName  } ${  row.lastName}`}`}
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
              <InputLabel id="suspend-duration-label">Durée</InputLabel>
              <Select
                labelId="suspend-duration-label"
                label="Durée"
                value={suspendDuration || ''}
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
            onClick={() => {
              toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été suspendu pour ${suspendDuration} jours.`);
              confirmSuspend.onFalse();
            }}
            disabled={!suspendReason.trim() || !suspendDuration}
          >
            Suspendre
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmReactivate.value}
        onClose={confirmReactivate.onFalse}
        title={`Réactiver l'utilisateur : ${`${row.firstName  } ${  row.lastName}`}`}
        content={
          <>
            <TextField
              fullWidth
              label="Motif de suspension"
              value={row.motif}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Durée de suspension"
              value={`${row.duree} jours`}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Jours restants"
              value={`${row.dureRestante || 0} jours`}
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
          </>
        }
        action={
          <Button 
            variant="contained"
            color="success"
            onClick={() => {
              toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été réactivé avec succès.`);
              confirmReactivate.onFalse();
            }}
          >
            Réactiver
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmUnblock.value}
        onClose={confirmUnblock.onFalse}
        title={`Débloquer l'utilisateur : ${`${row.firstName  } ${  row.lastName}`}`}
        content={
          <TextField
            fullWidth
            label="Motif de blocage"
            value={row.reason}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />
        }
        action={
          <Button 
            variant="contained"
            color="success"
            onClick={() => {
              toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été débloqué avec succès.`);
              confirmUnblock.onFalse();
            }}
          >
            Débloquer
          </Button>
        }
      />
      <ConfirmDialog
        open={confirmRestore.value}
        onClose={confirmRestore.onFalse}
        title={`Restaurer l'utilisateur : ${`${row.firstName  } ${  row.lastName}`}`}
        content={`Êtes-vous sûr de vouloir restaurer l'utilisateur ${`${row.firstName  } ${  row.lastName}`} ?`}
        action={
          <Button 
            variant="contained"
            color="success"
            onClick={() => {
              toast.success(`L'utilisateur ${row.firstName} ${row.lastName} a été restauré avec succès.`);
              confirmRestore.onFalse();
            }}
          >
            Restaurer
          </Button>
        }
      />
    </>
  );
}
