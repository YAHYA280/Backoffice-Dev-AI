'use client';

import type { IUserItem } from 'src/contexts/types/user';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye,faBan,faEdit,faUndo,faTrash,faPause,faUnlock,faEllipsisV,faUserCheck,} from '@fortawesome/free-solid-svg-icons';

import Menu from '@mui/material/Menu';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Label } from 'src/shared/components/label';

type Props = {
  row: IUserItem;
  selected: boolean;
  onSelectRow: () => void;
  statusFilter?: string;
};

export function UserTableRow({ row, selected, onSelectRow, statusFilter = 'Tous' }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <TableRow hover selected={selected} tabIndex={-1}>
      <TableCell onClick={onSelectRow}>{`${row.firstName  } ${  row.lastName}`}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.role}</TableCell>
      {statusFilter === 'Tous' && (
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
      )}
      <TableCell>{row.createdAt}</TableCell>
      <TableCell>{row.lastLogin}</TableCell>
      {statusFilter === 'Suspendu' && <TableCell>{row.dureRestante} jours</TableCell>}
      <TableCell>
        <IconButton onClick={handleOpenMenu}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </IconButton>
        <Menu open={menuOpen} anchorEl={anchorEl} onClose={handleCloseMenu} PaperProps={{ sx: { width: 200 } }}>
          {row.status === 'Actif' && (
            <>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faEye} color="#2196F3" />
                </ListItemIcon>
                <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faEdit} color="#4CAF50" />
                </ListItemIcon>
                <ListItemText primary="Modifier" sx={{ color: '#4CAF50' }} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faTrash} color="#F44336" />
                </ListItemIcon>
                <ListItemText primary="Supprimer" sx={{ color: '#F44336' }} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faBan} color="#212121" />
                </ListItemIcon>
                <ListItemText primary="Bloquer" sx={{ color: '#212121' }} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faPause} color="#FF9800" />
                </ListItemIcon>
                <ListItemText primary="Suspendre" sx={{ color: '#FF9800' }} />
              </MenuItem>
            </>
          )}
          {row.status === 'Supprimé' && (
            <>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faEye} color="#2196F3" />
                </ListItemIcon>
                <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faUndo} color="#4CAF50" />
                </ListItemIcon>
                <ListItemText primary="Restaurer" sx={{ color: '#4CAF50' }} />
              </MenuItem>
            </>
          )}
          {row.status === 'Bloqué' && (
            <>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faEye} color="#2196F3" />
                </ListItemIcon>
                <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faUnlock} color="#22bb33" />
                </ListItemIcon>
                <ListItemText primary="Débloquer" sx={{ color: '#22bb33' }} />
              </MenuItem>
            </>
          )}
          {row.status === 'Suspendu' && (
            <>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faEye} color="#2196F3" />
                </ListItemIcon>
                <ListItemText primary="Afficher" sx={{ color: '#2196F3' }} />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faUserCheck} color="#22bb33" />
                </ListItemIcon>
                <ListItemText primary="Réactivé" sx={{ color: '#22bb33' }} />
              </MenuItem>
            </>
          )}
        </Menu>
      </TableCell>
    </TableRow>
  );
}
