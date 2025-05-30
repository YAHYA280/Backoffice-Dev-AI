import type { CardProps } from '@mui/material/Card';
import type { FileDetail, IFileManager, IFolderManager } from 'src/contexts/types/file';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faStar,
  faTrash,
  faCircle,
  faDownload,
  faEllipsisV,
  faPenToSquare,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { maxLine } from 'src/shared/theme/styles';

import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { FileThumbnail } from 'src/shared/components/file-thumbnail';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { FileDetailDrawer } from './FileDetailDrawer';
import { FileManagerModifierDialog } from './file-manager-modifier-dialog';

export function FileManagerFileItem({
  file,
  selected,
  onSelect,
  onDelete,
  sx,
  ...other
}: CardProps & {
  selected?: boolean;
  file: IFileManager;
  onDelete: () => void;
  onSelect?: () => void;
  folder: IFolderManager;
}) {
  const theme = useTheme();
  const confirm = useBoolean();
  const editFile = useBoolean();
  const consultFile = useBoolean();
  const popover = usePopover();
  const checkbox = useBoolean();

  useCopyToClipboard();

  const [isFavorite, setIsFavorite] = useState(file.isFavorited);

  const handleDownload = () => {
    window.open(file.url, '_blank');
    toast.success(`${file.name} téléchargé`);
    popover.onClose();
  };

  const handleToggleFavorite = () => {
    setIsFavorite((fav) => !fav);
    toast.success(
      isFavorite ? `${file.name} retiré des favoris` : `${file.name} ajouté aux favoris`
    );
    popover.onClose();
  };

  const renderIcon = (
    <Box sx={{ display: 'inline-flex', width: 36, height: 36 }}>
      {selected ? (
        <Checkbox
          checked
          onClick={onSelect}
          icon={<FontAwesomeIcon icon={faCircle} />}
          checkedIcon={<FontAwesomeIcon icon={faCheckCircle} />}
          inputProps={{ id: `item-checkbox-${file.id}`, 'aria-label': 'Item checkbox' }}
          sx={{ width: 1, height: 1 }}
        />
      ) : (
        <Box sx={{ width: 1, height: 1, cursor: 'pointer' }} onClick={onSelect}>
          <FileThumbnail file={file.type} sx={{ width: 1, height: 1 }} />
        </Box>
      )}
    </Box>
  );

  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
      <Tooltip title="Actions">
        <IconButton
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
          size="small"
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const renderText = (
    <Typography
      variant="subtitle2"
      sx={{
        ...maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
        mt: 2,
        mb: 0.5,
        width: 1,
        fontWeight: 400,
      }}
    >
      {file.name}
    </Typography>
  );

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          cursor: 'pointer',
          bgcolor: checkbox.value || selected ? 'background.paper' : 'transparent',
          boxShadow: checkbox.value || selected ? theme.customShadows.z20 : undefined,
          ...sx,
        }}
        {...other}
      >
        {renderIcon}
        {renderText}
        {renderAction}
      </Paper>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: 8 }} />
            Télécharger
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
              consultFile.onTrue();
            }}
          >
            <FontAwesomeIcon icon={faEye} style={{ marginRight: 8 }} />
            Voir détails
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem onClick={handleToggleFavorite}>
            <FontAwesomeIcon
              icon={faStar}
              style={{ marginRight: 8, color: isFavorite ? '#fdd835' : undefined }}
            />
            {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem
            onClick={() => {
              popover.onClose();
              editFile.onTrue();
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
            sx={{ color: theme.palette.error.main }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <FileManagerModifierDialog
        open={editFile.value}
        onClose={editFile.onFalse}
        title="Modifier le fichier"
        onUpdate={editFile.onFalse}
        fileData={file}
      />

      <FileDetailDrawer
        open={consultFile.value}
        onClose={consultFile.onFalse}
        file={file as FileDetail}
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
