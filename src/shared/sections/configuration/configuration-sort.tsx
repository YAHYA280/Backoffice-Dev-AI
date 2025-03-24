import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

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

export function ConfigurationSort({ sort, sortOptions, onSort }: Props) {
  const popover = usePopover();

  const getSortLabel = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <FontAwesomeIcon icon={popover.open ? faChevronUp : faChevronDown} />
        }
        sx={{ fontWeight: 'fontWeightSemiBold', textTransform: 'capitalize', color: 'primary.main' }}
      >
        Trier par:
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold', color: 'primary.main' }}>
          {getSortLabel(sort)}
        </Box>
      </Button>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={sort === option.value}
              onClick={() => {
                popover.onClose();
                onSort(option.value);
              }}
              sx = {{ color: 'primary.main',}}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
