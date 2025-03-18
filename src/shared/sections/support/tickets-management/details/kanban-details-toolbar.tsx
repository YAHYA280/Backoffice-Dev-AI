import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

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

  const popover = usePopover();

  const [status, setStatus] = useState(taskStatus);

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
        {!smUp ? (
          <Tooltip title="Retour">
            <IconButton onClick={onCloseDetails} sx={{ mr: 1 }}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}

        <Button
          size="small"
          variant="soft"
          endIcon={<FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: -4 }} />}
          onClick={popover.onOpen}
        >
          À faire
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-right' } }}
      >
        <MenuList>
          {['À faire', 'En cours', 'Résolue', 'Fermé'].map((option) => (
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
    </>
  );
}
