'use client';

import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import {FontAwesome} from 'src/shared/components/fontawesome';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const popover = usePopover();

  const mediaQuery = 'sm';

  const [workspace, setWorkspace] = useState(data[0]);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[0]) => {
      setWorkspace(newValue);
      popover.onClose();
    },
    [popover]
  );

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          ...sx,
        }}
        {...other}
      >
        <Box
          component="img"
          alt={workspace?.name}
          src={workspace?.logo}
          sx={{ width: 24, height: 24, borderRadius: '50%' }}
        />

        <Box
          component="span"
          sx={{
            typography: 'subtitle2',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {workspace?.name}
        </Box>

                <FontAwesome icon={faChevronDown} style={{ color: 'text.disabled' }} />

      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <MenuList sx={{ width: 240 }}>
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === workspace?.id}
              onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
            >
              <Avatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} />

              <Box component="span" sx={{ flexGrow: 1 }}>
                {option.name}
              </Box>
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
