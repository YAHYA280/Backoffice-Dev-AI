import type { CardProps } from '@mui/material/Card';
import type { FileDetail, IFolderManager } from 'src/contexts/types/file';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faStar, faTrash, faDownload, faDotCircle, faEllipsisV, faCheckCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { FileDetailDrawer } from './FileDetailDrawer';
import { FileManagerModifierDialog } from './file-manager-modifier-dialog';

export function FileManagerFolderItem({
  sx,
  folder,
  selected,
  onSelect,
  onDelete,
  onDoubleClick,
  ...other
}: CardProps & {
  selected?: boolean;
  onDelete: () => void;
  onSelect?: () => void;
  onDoubleClick?: () => void;
  folder: IFolderManager;
}) {
  const theme = useTheme();
  const popover = usePopover();
  const confirm = useBoolean();
  const checkbox = useBoolean();
  const editFolder = useBoolean();
  const details = useBoolean();
  const [isFavorite, setIsFavorite] = useState(folder.isFavorited);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (onDoubleClick) {
      e.preventDefault();
      e.stopPropagation();
      onDoubleClick();
    }
  };

  const handleDownload = () => {
    window.open(folder.url, '_blank');
    popover.onClose();
  };

  const handleToggleFavorite = () => {
    setIsFavorite((fav) => !fav);
    popover.onClose();
  };

  
  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>
    </Stack>
  );


  const renderIcon = (
    <Box sx={{ width: 36, height: 36 }}>
      {selected ? (
        <Checkbox
          checked
          onClick={onSelect}
          icon={<FontAwesomeIcon icon={faDotCircle} />}
          checkedIcon={<FontAwesomeIcon icon={faCheckCircle} />}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <Box
          component="img"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/files/ic-folder.svg`}
          sx={{ width: 1, height: 1, cursor: 'pointer' }}
          onClick={onSelect}
        />
      )}
    </Box>
  );
  
  const renderText = (
    <ListItemText
      primary={folder.name}
      secondary={
        <>
          <Box
            component="span"
            sx={{ mx: 0.75, width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }}
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

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          gap: 1,
          p: 2.5,
          maxWidth: 222,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          cursor: 'pointer',
          position: 'relative',
          bgcolor: checkbox.value || selected ? 'background.paper' : 'transparent',
          boxShadow: checkbox.value || selected ? theme.customShadows.z20 : undefined,
          ...sx,
        }}
        onClick={(e) => {
          if (onSelect) {
            onSelect();
          }
        }}
        onDoubleClick={handleDoubleClick}
        {...other}
      >
        {renderIcon}
        {renderAction}
        {renderText}
      </Paper>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} />&nbsp;Télécharger
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
              details.onTrue();
            }}
          >
            <FontAwesomeIcon icon={faEye} style={{ marginRight: 8 }} />
            Voir détails
          </MenuItem>
          <MenuItem onClick={handleToggleFavorite}>
            <FontAwesomeIcon icon={faStar} />&nbsp;
            {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem
            onClick={() => {
              editFolder.onTrue();
              popover.onClose();
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: 8 }} />
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
            <FontAwesomeIcon icon={faTrash} />&nbsp;Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

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
      <FileDetailDrawer
        open={details.value}
        onClose={details.onFalse}
        file={folder as unknown as FileDetail}
      />
      <FileManagerModifierDialog
        open={editFolder.value}
        onClose={editFolder.onFalse}
        title="Modifier le dossier"
        onUpdate={() => editFolder.onFalse()}
        fileData={folder}
      />
    </>
  );
}