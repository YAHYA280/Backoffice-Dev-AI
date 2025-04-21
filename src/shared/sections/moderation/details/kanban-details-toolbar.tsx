import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// ----------------------------------------------------------------------

type Props = {
  liked: boolean;
  taskName: string;
  taskStatus: string;
  onLike: () => void;
  onDelete: () => void;
  onCloseDetails: () => void;
};

export function KanbanDetailsToolbar({
  liked,
  onLike,
  taskName,
  onDelete,
  taskStatus,
  onCloseDetails,
}: Props) {
  const smUp = useResponsive('up', 'sm');

  const confirm = useBoolean();

  const popover = usePopover();

  const [status, setStatus] = useState("Nouveau");

  const handleChangeStatus = useCallback(
    (newValue: string) => {
      popover.onClose();
      setStatus(newValue);
    },
    [popover]
  );

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(2.5, 1, 2.5, 2.5),
          borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <ConditionalComponent isValid={!smUp}>
          <Tooltip title="Back">
            <IconButton onClick={onCloseDetails} sx={{ mr: 1 }}>
              {faChevronLeft ?
                <FontAwesomeIcon icon={faChevronLeft} /> :
                <span>←</span>}
            </IconButton>
          </Tooltip>
        </ConditionalComponent>

        <Button
          size="small"
          variant="soft"
          endIcon={<FontAwesomeIcon icon={faChevronDown} style={{ width: 16, marginLeft: '-0.5rem' }} />}
          onClick={popover.onOpen}
        >
          {status}
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {['Nouveau', 'En cours', 'résolu', 'rejeté'].map((option) => (
            <MenuItem
              key={option}
              selected={status === option}
              onClick={() => {
                handleChangeStatus(option);
              }}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Etes-vous sûr de vouloir supprimer <strong> {taskName} </strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}
