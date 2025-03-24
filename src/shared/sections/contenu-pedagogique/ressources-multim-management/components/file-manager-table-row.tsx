'use client';

import type { FileDetail, IFileManager, IFolderManager } from 'src/contexts/types/file';

import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faDownload,
  faEllipsisV,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { alpha, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';

import { fData } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { FileThumbnail } from 'src/shared/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { FileDetailDrawer } from './FileDetailDrawer';
import { FileManagerModifierDialog } from './file-manager-modifier-dialog';

export type ColumnDefinition = {
  id: string;
  label: string;
  width?: number;
};

type Props = {
  row: IFileManager;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  columns?: ColumnDefinition[];
  folder: IFolderManager;
};

export function FileManagerTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  folder,
  columns,
}: Props) {
  const theme = useTheme();
  const details = useBoolean();
  const confirm = useBoolean();
  const popover = usePopover();
  const editFolder = useBoolean();
  const consultFolder = useBoolean();

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => {},
  });

  const defaultStyles = {
    border: 'none',
    '&:first-of-type': {
      borderLeft: 'none',
    },
    '&:last-of-type': {
      borderRight: 'none',
    },
  };

  const rowStyle = {
    borderRadius: 2,
    borderBottom: `1px solid ${theme.palette.divider}`,
    [`&.${tableRowClasses.selected}, &:hover`]: {
      backgroundColor: theme.palette.action.hover,
      boxShadow: theme.customShadows.z20,
      transition: theme.transitions.create(['background-color', 'box-shadow'], {
        duration: theme.transitions.duration.shortest,
      }),
    },
    [`& .${tableCellClasses.root}`]: { ...defaultStyles },
    ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
  };

  if (columns && columns.length > 0) {
    return (
      <>
        <TableRow selected={selected} sx={rowStyle}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selected}
              onDoubleClick={() => {}}
              onClick={onSelectRow}
              inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `row-checkbox` }}
            />
          </TableCell>
          {columns.map((col) => {
            switch (col.id) {
              case 'name':
                return (
                  <TableCell
                    key="name"
                    onClick={handleClick}
                    sx={{
                      maxWidth: 180,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ maxWidth: 180, overflow: 'hidden' }}
                    >
                      <FileThumbnail file={row.type} />
                      <Typography
                        noWrap
                        variant="subtitle1"
                        sx={{
                          maxWidth: 120,
                          cursor: 'pointer',
                          fontWeight: details.value ? 600 : 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                );
              case 'size':
                return (
                  <TableCell key="size" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2">{fData(row.size)}</Typography>
                  </TableCell>
                );
              case 'type':
                return (
                  <TableCell key="type" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2">{row.type}</Typography>
                  </TableCell>
                );
              case 'createdAt':
                return (
                  <TableCell key="createdAt" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    <ListItemText
                      primary={dayjs(row.createdAt).format('DD/MM/YYYY')}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ mt: 0.5, component: 'span', variant: 'caption' }}
                    />
                  </TableCell>
                );
              case 'modifiedAt':
                return (
                  <TableCell key="modifiedAt" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    <ListItemText
                      primary={dayjs(row.modifiedAt).format('DD/MM/YYYY')}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ mt: 0.5, component: 'span', variant: 'caption' }}
                    />
                  </TableCell>
                );
              case 'actions':
                return (
                  <TableCell key="actions" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                      <Tooltip title="Voir détails">
                        <IconButton
                          color="info"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            consultFolder.onTrue();
                          }}
                          aria-label="Voir détails"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            editFolder.onTrue();
                          }}
                          sx={{
                            transition: (themee) => themee.transitions.create(['background-color']),
                            '&:hover': {
                              backgroundColor: (themee) =>
                                alpha(themee.palette.primary.main, 0.08),
                            },
                          }}
                          aria-label="Modifier"
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirm.onTrue();
                          }}
                          sx={{
                            transition: (muiTheme) =>
                              muiTheme.transitions.create(['background-color']),
                            '&:hover': {
                              backgroundColor: (muiTheme) =>
                                muiTheme.palette.error.lighter || 'rgba(0,0,0,0.08)',
                            },
                          }}
                          aria-label="Supprimer"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger">
                        <IconButton
                          color="default"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`${row.name} a été téléchargé`);
                          }}
                          sx={{
                            transition: (muiTheme) =>
                              muiTheme.transitions.create(['background-color']),
                            '&:hover': {
                              backgroundColor: (muiTheme) =>
                                muiTheme.palette.primary.lighter || 'rgba(0,0,0,0.08)',
                            },
                          }}
                          aria-label="Télécharger"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                );
              default:
                return null;
            }
          })}
        </TableRow>
        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{ arrow: { placement: 'right-top' } }}
        >
          <MenuList>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <MenuItem onClick={editFolder.onTrue}>
              <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: 8 }} />
              Modifier
            </MenuItem>
            <MenuItem
              onClick={() => {
                toast.success(`${row.name} a été téléchargé`);
                popover.onClose();
              }}
            >
              <FontAwesomeIcon icon={faDownload} style={{ marginRight: 8 }} />
              Télécharger
            </MenuItem>
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <FontAwesomeIcon icon={faTrash} />
              Supprimer
            </MenuItem>
          </MenuList>
        </CustomPopover>
        <FileManagerModifierDialog
          open={editFolder.value}
          onClose={editFolder.onFalse}
          title="Modifier le fichier"
          onUpdate={() => {
            editFolder.onFalse();
          }}
          fileData={row}
        />
        {consultFolder.value ? (
          <FileDetailDrawer
            open={consultFolder.value}
            onClose={consultFolder.onFalse}
            file={row as FileDetail}
          />
        ) : (
          <>
          </>
        )}
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Supprimer"
          content="Êtes-vous sûr de vouloir supprimer ?"
          action={
            <Button variant="contained" color="error" onClick={onDeleteRow}>
              Supprimer
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      <TableRow selected={selected} sx={rowStyle}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => {}}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `row-checkbox` }}
          />
        </TableCell>
        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={row.type} />
            <Typography
              noWrap
              variant="subtitle1"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                fontWeight: 'fontWeightBold',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {row.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{fData(row.size)}</Typography>
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{row.type}</Typography>
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(row.createdAt)}
            secondary={fTime(row.createdAt)}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', variant: 'caption' }}
          />
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(row.modifiedAt)}
            secondary={fTime(row.modifiedAt)}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', variant: 'caption' }}
          />
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem>
            <FontAwesomeIcon icon={faPenToSquare} />
            Modifier
          </MenuItem>
          <MenuItem
            onClick={() => {
              toast.success(`${row.name} a été téléchargé`);
              popover.onClose();
            }}
            sx={{ color: 'default' }}
          >
            <FontAwesomeIcon icon={faDownload} />
            Télécharger
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <FontAwesomeIcon icon={faTrash} />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer ?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}