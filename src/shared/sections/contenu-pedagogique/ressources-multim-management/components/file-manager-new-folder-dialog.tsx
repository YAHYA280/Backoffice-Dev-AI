import type { DialogProps } from '@mui/material/Dialog';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';
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

import { Upload } from 'src/shared/components/upload';
import ConditionalComponent from 'src/shared/components/conditional-component/ConditionalComponent';

const hierarchy = [
  {
    niveau: 'Niveau 1',
  },
  {
    niveau: 'Niveau 2',
  },
];

type Props = DialogProps & {
  open: boolean;
  title?: string;
  folderName?: string;
  onClose: () => void;
  onCreate?: () => void;      // ← folder mode
  onUpload?: () => void;      // ← import mode
  onUpdate?: () => void;
  onChangeFolderName?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  onUpload,
  folderName,
  onChangeFolderName,
  title = 'Téléverser les fichiers',
  ...other
}: Props) {
  // File‐upload state
  const [files, setFiles] = useState<(File | string)[]>([]);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedNiveau, setSelectedNiveau] = useState('');

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setFileName('');
      setDescription('');
      setTags([]);
      setSelectedNiveau('');
    }
  }, [open]);

  const handleDrop = useCallback((accepted: File[]) => {
    setFiles((f) => [...f, ...accepted]);
  }, []);

  const handleUploadClick = () => {
    if (onUpload) onUpload();
    else onClose();
  };

  const handleRemoveFile = (f: File | string) => setFiles((prev) => prev.filter((x) => x !== f));
  const handleRemoveAll = () => setFiles([]);

  const isUploadDisabled = !fileName || !description || files.length === 0;

  const handleNiveauChange = (e: SelectChangeEvent<string>) => {
    setSelectedNiveau(e.target.value);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: 3, fontWeight: 'bold', fontSize: '1.25rem' }}>
        {title}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '& .MuiFormControl-root, & .MuiTextField-root': { size: 'small', variant: 'outlined', borderRadius: 1 }
        }}
      >
        {onCreate || onUpdate ? (
          // ── FOLDER MODE ───────────────────────────────────────────────────────────
          <TextField
            fullWidth
            label="Nom du dossier"
            value={folderName}
            onChange={onChangeFolderName}
          />
        ) : (
          // ── IMPORT MODE ───────────────────────────────────────────────────────────
          <>
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
                required
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
              />
              <FormControl fullWidth>
                <InputLabel>Niveau</InputLabel>
                <Select value={selectedNiveau} label="Niveau" onChange={handleNiveauChange}>
                  {hierarchy.map((h) => <MenuItem key={h.niveau} value={h.niveau}>{h.niveau}</MenuItem>)}
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={(_e, v) => setTags(v)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const tagProps = getTagProps({ index });
                    return (
                      <Chip
                        {...tagProps}
                        label={option}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    );
                  })
                }
                renderInput={(params) => <TextField {...params} label="Tags" placeholder="#Ajouter des tags" />}
              />
            </Stack>
            <Upload
              multiple
              value={files}
              onDrop={handleDrop}
              onRemove={handleRemoveFile}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {onCreate || onUpdate ? (
          // ── FOLDER MODE BUTTON ─────────────────────────────────────────────────
          <Button variant="contained" color='primary' onClick={onCreate || onUpdate}>
            {onUpdate ? "Enregistrer" : "Créer"}
          </Button>
        ) : (
          // ── IMPORT MODE BUTTONS ───────────────────────────────────────────────
          <>
            <Button
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faCloudUploadAlt} />}
              onClick={handleUploadClick}
              color='primary'
              disabled={isUploadDisabled}
            >
              Téléverser
            </Button>
            <ConditionalComponent isValid={!!files.length}>
              <Button variant="outlined" color="primary" onClick={handleRemoveAll}>
                Supprimer tout
              </Button>
            </ConditionalComponent>
          </>
        )}
        <Button variant="outlined" color="primary" onClick={onClose}>
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
}