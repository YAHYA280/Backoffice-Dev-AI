import type { DialogProps } from '@mui/material/Dialog';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export type FileData = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  niveau?: string;
  matiere?: string;
  chapitre?: string;
  exercice?: string;
};

type Props = DialogProps & {
  open: boolean;
  title?: string;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
  fileData?: FileData;
};

export function FileManagerModifierDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  fileData,
  title = 'Modifier un fichier',
  ...other
}: Props) {
  const [files, setFiles] = useState<(File | string)[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedNiveau, setSelectedNiveau] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setFileName('');
      setDescription('');
      setTags([]);
      setSelectedNiveau('');
    } else if (fileData) {
      setFileName(fileData.name || '');
      setDescription(fileData.description || '');
      setTags(fileData.tags || []);
      setSelectedNiveau(fileData.niveau || '');
    }
  }, [open, fileData]);


  const handleUpload = () => {
    onClose();
  };


  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const isUploadDisabled = !fileName && files.length === 0;

  const niveauOptions = ['Niveau 1', 'Niveau 2'];




  const handleNiveauChange = (event: SelectChangeEvent<string>) => {
    setSelectedNiveau(event.target.value);

  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
          fontWeight: 'bold',
          fontSize: '1.25rem',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          pt: 2,
          pb: 2,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '& .MuiFormControl-root, & .MuiTextField-root': {
            variant: 'outlined',
            size: 'small',
            backgroundColor: (theme) => theme.palette.background.paper,
            borderRadius: 1,
          },
        }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            required
            label="Nom"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="niveau-label">Niveau</InputLabel>
            <Select
              labelId="niveau-label"
              id="niveau-select"
              value={selectedNiveau}
              label="Niveau"
              onChange={handleNiveauChange}
            >
              {niveauOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={tags}
            onChange={(event, newValue) => setTags(newValue)}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  size="small"
                  variant="filled"
                  label={option}
                  key={option}
                  sx={{ mr: 0.5 }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="#Ajouter des tags" label="Tags" />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          color='primary'
          startIcon={<FontAwesomeIcon icon={faCloudUploadAlt} />}
          onClick={handleUpload}
          disabled={isUploadDisabled}
        >
          Mettre à jour
        </Button>
        {files.length > 0 ? (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Supprimer tout
          </Button>
        ) : (
          <>
          </>
        )}
        {(onCreate || onUpdate) ? (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="outlined" color='primary' onClick={onCreate || onUpdate}>
              {onUpdate ? 'Enregistrer' : 'Créer'}
            </Button>
          </Stack>
        ) : (
          <>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}