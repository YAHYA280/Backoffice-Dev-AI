import { useRef, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faEraser, faGripLines, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/shared/theme/styles';

import { Label } from 'src/shared/components/label';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { KanbanInputName } from '../components/kanban-input-name';

// ----------------------------------------------------------------------

type Props = {
  handleProps?: any;
  totalTasks?: number;
  columnName: string;
  onClearColumn?: () => void;
  onDeleteColumn?: () => void;
  onToggleAddTask?: () => void;
  onUpdateColumn?: (inputName: string) => void;
};

export function KanbanColumnToolBar({
  columnName,
  totalTasks,
  handleProps,
  onClearColumn,
  onDeleteColumn,
  onUpdateColumn,
}: Props) {
  const renameRef = useRef<HTMLInputElement>(null);

  const popover = usePopover();

  const confirmDialog = useBoolean();

  const [name, setName] = useState(columnName);

  useEffect(() => {
    if (popover.open) {
      if (renameRef.current) {
        renameRef.current.focus();
      }
    }
  }, [popover.open]);

  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleKeyUpUpdateColumn = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (renameRef.current) {
          renameRef.current.blur();
        }
        onUpdateColumn?.(name);
      }
    },
    [name, onUpdateColumn]
  );

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center">
          <Label
            sx={{
              borderRadius: '50%',
              borderColor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.24),
            }}
          >
            {totalTasks}
          </Label>

          <KanbanInputName
            inputRef={renameRef}
            placeholder="Nom de la colonne"
            value={name}
            onChange={handleChangeName}
            onKeyUp={handleKeyUpUpdateColumn}
            inputProps={{ id: `input-column-${name}` }}
            sx={{ mx: 1 }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </IconButton>

          <IconButton size="small" {...handleProps}>
            <FontAwesomeIcon icon={faGripLines} />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem onClick={popover.onClose}>
            <FontAwesomeIcon icon={faPen} style={{ marginRight: 8 }} />
            Renommer
          </MenuItem>

          <MenuItem
            onClick={() => {
              onClearColumn?.();
              popover.onClose();
            }}
          >
            <FontAwesomeIcon icon={faEraser} style={{ marginRight: 8 }} />
            Vider
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirmDialog.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Supprimer"
        content={
          <>
            Etes-vous sûr de vouloir supprimer la colonne?
            <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
              <strong> NOTE: </strong> Toutes les tâches liées à cette catégorie seront également supprimées.
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteColumn?.();
              confirmDialog.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </>
  );
}
