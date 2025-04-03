import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { Box, Button, MenuList, MenuItem } from '@mui/material'; // Import des icônes FontAwesome

import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  sort: string;
  onSort: (newValue: string) => void;
  sortOptions: {
    value: string;
    label: string;
  }[];
};

export function AbonnementSort({ sort, onSort, sortOptions }: Props) {
  const popover = usePopover();

  return (
    <>
      <Button
        disableRipple
        color="primary"
        onClick={popover.onOpen}
        endIcon={
          <FontAwesomeIcon
            icon={popover.open ? faChevronUp : faChevronDown}
            style={{ width: 16 }}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
      >
        Trier par:
        <Box
          component="span"
          sx={{ ml: 0.5, fontWeight: 'fontWeightBold', textTransform: 'capitalize' }}
        >
          {sort}
        </Box>
      </Button>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === sort}
              onClick={() => {
                popover.onClose();
                onSort(option.label);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
