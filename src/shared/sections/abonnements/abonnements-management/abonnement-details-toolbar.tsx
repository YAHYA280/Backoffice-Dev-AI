'use client';

import type { StackProps } from '@mui/material/Stack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faFileAlt,
  faArchive,
  faArrowLeft,
  faCloudUpload,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink: string;
  editLink: string;
  liveLink: string;
  publish: string;
  onChangePublish: (newValue: string) => void;
  publishOptions: {
    value: string;
    label: string;
  }[];
};

export function AbonnementDetailsToolbar({
  publish,
  backLink,
  editLink,
  liveLink,
  publishOptions,
  onChangePublish,
  sx,
  ...other
}: Props) {
  const popover = usePopover();

  return (
    <>
      <Stack spacing={1.5} direction="row" sx={{ mb: { xs: 3, md: 5 }, ...sx }} {...other}>
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
        >
          Retour
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {publish === 'published' && (
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <FontAwesomeIcon icon={faPen} />
          </IconButton>
        </Tooltip>

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!publish}
          loadingIndicator="Loading…"
          endIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {publish}
        </LoadingButton>
      </Stack>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          {publishOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === publish}
              onClick={() => {
                popover.onClose();
                onChangePublish(option.value);
              }}
            >
              {option.value === 'published' && <FontAwesomeIcon icon={faCloudUpload} />}
              {option.value === 'draft' && <FontAwesomeIcon icon={faFileAlt} />}
              {option.value === 'archived' && <FontAwesomeIcon icon={faArchive} />}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
