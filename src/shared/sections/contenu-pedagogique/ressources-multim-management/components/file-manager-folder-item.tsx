import type { CardProps } from '@mui/material/Card';
import type { IFolderManager } from 'src/contexts/types/file';

import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faDotCircle, faEllipsisV, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { FileManagerNewFolderDialog } from './file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

type Props = CardProps & {
  selected?: boolean;
  onDelete: () => void;
  onSelect?: () => void;
  folder: IFolderManager;
};

export function FileManagerFolderItem({
  sx,
  folder,
  selected,
  onSelect,
  onDelete,
  ...other
}: Props) {

  const popover = usePopover();

  const confirm = useBoolean();

  const details = useBoolean();

  const checkbox = useBoolean();

  const editFolder = useBoolean();


  const [folderName, setFolderName] = useState(folder.name);

  const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  }, []);


  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>

      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>
    </Stack>
  );

  const renderIcon = (
    <Box
      onMouseEnter={checkbox.onTrue}
      onMouseLeave={checkbox.onFalse}
      sx={{ width: 36, height: 36 }}
    >
      {(checkbox.value || selected) && onSelect ? (
        <Checkbox
          checked={selected}
          onClick={onSelect}
          icon={<FontAwesomeIcon icon={faDotCircle} />}
          checkedIcon={<FontAwesomeIcon icon={faCheckCircle} />}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <Box
          component="img"
          src={`${CONFIG.site.basePath}/assets/icons/files/ic-folder.svg`}
          sx={{ width: 1, height: 1 }}
        />
      )}
    </Box>
  );
  const renderText = (
    <ListItemText
      onClick={details.onTrue}
      primary={folder.name}
      secondary={
        <>
          {fData(folder.size)}
          <Box
            component="span"
            sx={{
              mx: 0.75,
              width: 2,
              height: 2,
              borderRadius: '50%',
              bgcolor: 'currentColor',
            }}
          />
          {folder.totalFiles} fichiers
        </>
      }
      primaryTypographyProps={{ noWrap: true, typography: 'subtitle1' }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );

  const renderAvatar = (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 24,
          height: 24,
          '&:first-of-type': { fontSize: 12 },
        },
      }}
    >
      {folder.shared?.map((person) => (
        <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          gap: 1,
          p: 2.5,
          maxWidth: 222,
          display: 'flex',
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          bgcolor: 'transparent',
          flexDirection: 'column',
          alignItems: 'flex-start',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        {renderIcon}

        {renderAction}

        {renderText}

        {!!folder?.shared?.length && renderAvatar}
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
              editFolder.onTrue();
            }}
          >
            <FontAwesomeIcon icon={faPen} />
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

      <FileManagerNewFolderDialog
        open={editFolder.value}
        onClose={editFolder.onFalse}
        title="Edit Folder"
        onUpdate={() => {
          editFolder.onFalse();
          setFolderName(folderName);
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
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
