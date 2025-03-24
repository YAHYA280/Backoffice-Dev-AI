'use client';

import type { CardProps } from '@mui/material/Card';
import type { FileDetail, IFileManager, IFolderManager } from 'src/contexts/types/file';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faCircle,
  faDownload,
  faEllipsisV,
  faCheckCircle,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
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

type Props = CardProps & {
  selected?: boolean;
  file: IFileManager;
  onDelete: () => void;
  onSelect?: () => void;
  onDeleteRow?: () => void;
  folder: IFolderManager;
};

export function FileManagerFileItem({ file, selected, onSelect, onDelete, sx, ...other }: Props) {
  const theme = useTheme();
  const confirm = useBoolean();
  const details = useBoolean();
  const popover = usePopover();
  const editFolder = useBoolean();
  const consultFolder = useBoolean();
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
          inputProps={{ id: `item-checkbox-${file.id}`, 'aria-label': 'Item checkbox' }}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <FileThumbnail file={file.type} sx={{ width: 1, height: 1 }} />
      )}
    </Box>
  );

  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      <Tooltip title="Actions">
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen} size="small">
          <FontAwesomeIcon icon={faEllipsisV} />
        </IconButton>
      </Tooltip>
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
          cursor: 'pointer',
          fontWeight: details.value ? 600 : 400,
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
              popover.onClose();
              consultFolder.onTrue();
            }}
          >
            <FontAwesomeIcon icon={faEye} style={{ marginRight: 8, color: theme.palette.info.main }} />
            Voir détails
          </MenuItem>
          <MenuItem
            onClick={() => {
              editFolder.onTrue();
              popover.onClose();
            }}
            sx={{ color: theme.palette.error.main }}
          >
            <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: 8, color: theme.palette.primary.main }} />
            Modifier
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: theme.palette.error.main }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8, color: theme.palette.error.main }} />
            Supprimer
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem
            onClick={() => {
              toast.success(`${file.name} a été téléchargé`);
              popover.onClose();
            }}
          >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: 8, color: 'default' }} />
            Télécharger
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
        fileData={file}
      />
      {consultFolder.value ? (
        <FileDetailDrawer
          open={consultFolder.value}
          onClose={consultFolder.onFalse}
          file={file as FileDetail}
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
          <Button variant="contained" color="error" onClick={onDelete}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}