'use client';

import type { Alerte } from 'src/shared/_mock/_logs';

import dayjs from 'dayjs';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPause } from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog/confirm-dialog';

type Props = {
  row: Alerte;
  selected: boolean;
  handleSelectAlerteRow: () => void;
  columns: Array<{ id: string; label: string; width?: number }>;
};

export function AlerteTableRow({
  row,
  selected,
  handleSelectAlerteRow,
  columns,
}: Props) {
  const confirmBlock = useBoolean();
  const confirmSuspend = useBoolean();
  const [userNameExpanded, setUserNameExpanded] = React.useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = React.useState(false);

  const handleUserNameToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setUserNameExpanded((prev) => !prev);
  };

  const handleDescriptionToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDescriptionExpanded((prev) => !prev);
  };

  const renderCellContent = (colId: string) => {
    switch (colId) {
      case 'select':
        return (
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAlerteRow();
            }}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': 'row checkbox' }}
          />
        );
      case 'titre':
        return row.titre;
      case 'userName':
        return (
          <div
            role="button"
            tabIndex={0}
            onClick={handleUserNameToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleUserNameToggle(e as any);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            {userNameExpanded || row.userName.length <= 20
              ? row.userName
              : `${row.userName.substring(0, 20)}...`}
          </div>
        );
      case 'description':
        return (
          <div
            role="button"
            tabIndex={0}
            onClick={handleDescriptionToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDescriptionToggle(e as any);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            {descriptionExpanded || row.description.length <= 38
              ? row.description
              : `${row.description.substring(0, 38)}...`}
          </div>
        );
      case 'dateAlerte':
        return dayjs(row.dateAlerte).format('DD/MM/YYYY HH:mm:ss');
      case 'criticite':
        return (
          <Label
            variant="soft"
            sx={{
              ...(row.criticite === 'Élevé' && {
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                color: '#F44336',
              }),
              ...(row.criticite === 'Modéré' && {
                bgcolor: 'rgba(255, 152, 0, 0.1)',
                color: '#FF9800',
              }),
              ...(row.criticite === 'Faible' && {
                bgcolor: 'rgb(186, 248, 193)',
                color: '#22bb33',
              }),
              ...(!['Élevé', 'Modéré', 'Faible'].includes(row.criticite) && {
                bgcolor: 'rgba(145, 158, 171, 0.16)',
                color: 'text.secondary',
              }),
            }}
          >
            {row.criticite}
          </Label>
        );
      case 'actions':
        return (
          <Stack direction="row" justifyContent="center" spacing={0.5}>
            <Tooltip title="Bloquer">
              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmBlock.onTrue();
                }}
                sx={{
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.error.lighter || 'rgba(0,0,0,0.08)',
                  },
                }}
              >
                <FontAwesomeIcon icon={faBan} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Suspendre">
              <IconButton
                color="warning"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmSuspend.onTrue();
                }}
                sx={{
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.warning.lighter || 'rgba(0,0,0,0.08)',
                  },
                }}
              >
                <FontAwesomeIcon icon={faPause} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      default:
        return (row as any)[colId];
    }
  };

  return (
    <>
      <TableRow hover selected={selected} tabIndex={-1}>
        {columns.map((col) => (
          <TableCell
            key={col.id}
            sx={{
              width: col.width,
              textAlign: col.id === 'actions' ? 'center' : 'left',
            }}
          >
            {renderCellContent(col.id)}
          </TableCell>
        ))}
      </TableRow>

      <ConfirmDialog
        open={confirmBlock.value}
        onClose={confirmBlock.onFalse}
        title={`Bloquer utilisateur : ${row.userName}`}
        content="Êtes-vous sûr de vouloir bloquer cet utilisateur ?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              toast.success(`L'utilisateur a été bloqué avec succès.`);
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
        title={`Suspendre l'utilisateur : ${row.userName}`}
        content="Êtes-vous sûr de vouloir suspendre cet utilisateur ?"
        action={
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              toast.success(`L'utilisateur a été suspendu avec succès.`);
              confirmSuspend.onFalse();
            }}
          >
            Suspendre
          </Button>
        }
      />
    </>
  );
}

export default AlerteTableRow;
