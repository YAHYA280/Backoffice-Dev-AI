import type { CardProps } from '@mui/material/Card';
import type { IFileManager } from 'src/contexts/types/file';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faCircle, faEllipsisV, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { maxLine } from 'src/shared/theme/styles';

import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { FileThumbnail } from 'src/shared/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { FileManagerModifierDialog } from './file-manager-modifier-dialog';

// ----------------------------------------------------------------------

type Props = CardProps & {
  selected?: boolean;
  file: IFileManager;
  onDelete: () => void;
  onSelect?: () => void;
};

export function FileManagerFileItem({ file, selected, onSelect, onDelete, sx, ...other }: Props) {
  const theme = useTheme();

  const confirm = useBoolean();

  const details = useBoolean();

  const popover = usePopover();
  const editFolder = useBoolean();

  const checkbox = useBoolean();

  useCopyToClipboard();




  const renderIcon = (
    <Box
      onMouseEnter={checkbox.onTrue}
      onMouseLeave={checkbox.onFalse}
      sx={{ display: 'inline-flex', width: 36, height: 36 }}
    >
      {(checkbox.value || selected) && onSelect ? (
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<FontAwesomeIcon icon={faCircle} />}
          checkedIcon={<FontAwesomeIcon icon={faCheckCircle} />}
          inputProps={{ id: `item-checkbox-${file.id}`, 'aria-label': `Item checkbox` }}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <FileThumbnail file={file.type} sx={{ width: 1, height: 1 }} />
      )}
    </Box>
  );

  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>
    </Stack>
  );

  const renderText = (
    <>
      <Typography
        variant="subtitle2"
        onClick={details.onTrue}
        sx={{
          ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
          mt: 2,
          mb: 0.5,
          width: 1,
        }}
      >
        {file.name}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        sx={{
          maxWidth: 0.99,
          whiteSpace: 'nowrap',
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        {fData(file.size)}

        <Box
          component="span"
          sx={{
            mx: 0.75,
            width: 2,
            height: 2,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: 'currentColor',
          }}
        />
        <Typography noWrap component="span" variant="caption">
          {fDateTime(file.modifiedAt)}
        </Typography>
      </Stack>
    </>
  );

  const renderAvatar = (
    <AvatarGroup
      max={3}
      sx={{
        mt: 1,
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 24,
          height: 24,
          '&:first-of-type': { fontSize: 12 },
        },
      }}
    >
      {file.shared?.map((person) => (
        <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          display: 'flex',
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          bgcolor: 'transparent',
          flexDirection: 'column',
          alignItems: 'flex-start',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        {renderIcon}

        {renderText}

        {renderAvatar}

        {renderAction}
      </Paper>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>

        <MenuItem
  onClick={() => {
    editFolder.onTrue();
  }}
>
  <FontAwesomeIcon icon={faPen} style={{ marginRight: 8 }} />
  Modifier
</MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

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
        title=" le fichier"
        onUpdate={() => {
          editFolder.onFalse();
        }}
        fileData={file}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer ?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}
