import type { IFileManager, IFolderManager } from 'src/contexts/types/file';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEye, faTrashAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
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

import { varAlpha } from 'src/shared/theme/styles';

import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { FileThumbnail } from 'src/shared/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { FileManagerModifierDialog } from './file-manager-modifier-dialog'
import { FileManagerConsulterDialog } from './file-manager-consulter-dialog';

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

export function FileManagerTableRow({ row, selected, onSelectRow, onDeleteRow, folder, columns }: Props) {
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
    doubleClick: () => console.info('DOUBLE CLICK'),
  });


  const defaultStyles = {
    borderTop: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
    },
  };

  if (columns && columns.length > 0) {
    return (
      <>
        <TableRow
          selected={selected}
          sx={{
            borderRadius: 2,
            [`&.${tableRowClasses.selected}, &:hover`]: {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
              transition: theme.transitions.create(['background-color', 'box-shadow'], {
                duration: theme.transitions.duration.shortest,
              }),
              '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
            },
            [`& .${tableCellClasses.root}`]: { ...defaultStyles },
            ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
          }}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={selected}
              onDoubleClick={() => console.info('ON DOUBLE CLICK')}
              onClick={onSelectRow}
              inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `row-checkbox` }}
            />
          </TableCell>
          {columns.map((col) => {
            switch (col.id) {
              case 'name':
                return (
                  <TableCell key="name" onClick={handleClick}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <FileThumbnail file={row.type} />
                      <Typography
                        noWrap
                        variant="inherit"
                        sx={{
                          maxWidth: 360,
                          cursor: 'pointer',
                          ...(details.value && { fontWeight: 'fontWeightBold' }),
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
                    {fData(row.size)}
                  </TableCell>
                );
              case 'type':
                return (
                  <TableCell key="type" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    {row.type}
                  </TableCell>
                );
              case 'createdAt':
                return (
                  <TableCell key="createdAt" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    <ListItemText
                      primary={fDate(row.createdAt)}
                      secondary={fTime(row.createdAt)}
                      primaryTypographyProps={{ typography: 'body2' }}
                      secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
                    />
                  </TableCell>
                );
              case 'modifiedAt':
                return (
                  <TableCell key="modifiedAt" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
                    <ListItemText
                      primary={fDate(row.modifiedAt)}
                      secondary={fTime(row.modifiedAt)}
                      primaryTypographyProps={{ typography: 'body2' }}
                      secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
                    />
                  </TableCell>
                );
              case 'actions':
                return (
                  <TableCell key="actions" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                    <IconButton onClick={consultFolder.onTrue} aria-label="Consulter">
                      <FontAwesomeIcon icon={faEye} />
                    </IconButton>
                    <IconButton onClick={editFolder.onTrue} aria-label="Modifier">
                      <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                    <IconButton onClick={confirm.onTrue} aria-label="Supprimer" sx={{ color: 'error.main' }}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </IconButton>
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
              <FontAwesomeIcon icon={faPen} style={{ marginRight: 8 }} />
              Modifier
            </MenuItem>
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
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


<FileManagerConsulterDialog
        open={consultFolder.value}
        onClose={consultFolder.onFalse}
        title="Visualiser le fichier"
        onUpdate={() => {
          consultFolder.onFalse();
          // Optionally, update your file data here...
        }}
        fileData={row}
      />
    
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
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': { backgroundColor: 'background.paper', boxShadow: theme.customShadows.z20 },
          },
          [`& .${tableCellClasses.root}`]: { ...defaultStyles },
          ...(details.value && { [`& .${tableCellClasses.root}`]: { ...defaultStyles } }),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `row-checkbox` }}
          />
        </TableCell>
        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={row.type} />
            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {row.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(row.size)}
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {row.type}
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(row.createdAt)}
            secondary={fTime(row.createdAt)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>
        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(row.modifiedAt)}
            secondary={fTime(row.modifiedAt)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
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
            <FontAwesomeIcon icon={faPen} />
            Modifier
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
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
