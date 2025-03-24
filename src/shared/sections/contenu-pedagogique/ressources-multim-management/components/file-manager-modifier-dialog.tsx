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
  const [selectedMatiere, setSelectedMatiere] = useState<string>('');
  const [selectedChapitre, setSelectedChapitre] = useState<string>('');
  const [selectedExercice, setSelectedExercice] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setFileName('');
      setDescription('');
      setTags([]);
      setSelectedNiveau('');
      setSelectedMatiere('');
      setSelectedChapitre('');
      setSelectedExercice('');
    } else if (fileData) {
      setFileName(fileData.name || '');
      setDescription(fileData.description || '');
      setTags(fileData.tags || []);
      setSelectedNiveau(fileData.niveau || '');
      setSelectedMatiere(fileData.matiere || '');
      setSelectedChapitre(fileData.chapitre || '');
      setSelectedExercice(fileData.exercice || '');
    }
  }, [open, fileData]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    []
  );

  const handleUpload = () => {
    onClose();
  };

  const handleRemoveFile = (inputFile: File | string) => {
    setFiles((prev) => prev.filter((file) => file !== inputFile));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const isUploadDisabled = !fileName && files.length === 0;

  const niveauOptions = ['Niveau 1', 'Niveau 2'];

  const matiereOptions =
    selectedNiveau === 'Niveau 1'
      ? ['Matière 1', 'Matière 2']
      : selectedNiveau === 'Niveau 2'
      ? ['Matière 3', 'Matière 4']
      : [];

  const chapitreOptions =
    selectedMatiere === 'Matière 1'
      ? ['Chapitre 1', 'Chapitre 2']
      : selectedMatiere === 'Matière 2'
      ? ['Chapitre 3', 'Chapitre 4']
      : selectedMatiere === 'Matière 3'
      ? ['Chapitre 5', 'Chapitre 6']
      : selectedMatiere === 'Matière 4'
      ? ['Chapitre 7', 'Chapitre 8']
      : [];

  const exerciceMap: Record<string, string[]> = {
    'Chapitre 1': ['Exercice 1', 'Exercice 2'],
    'Chapitre 2': ['Exercice 3', 'Exercice 4'],
    'Chapitre 3': ['Exercice 5', 'Exercice 6'],
    'Chapitre 4': ['Exercice 7', 'Exercice 8'],
    'Chapitre 5': ['Exercice 9', 'Exercice 10'],
    'Chapitre 6': ['Exercice 11', 'Exercice 12'],
    'Chapitre 7': ['Exercice 13', 'Exercice 14'],
    'Chapitre 8': ['Exercice 15', 'Exercice 16'],
  };
  const exerciceOptions = selectedChapitre ? exerciceMap[selectedChapitre] || [] : [];

  const handleNiveauChange = (event: SelectChangeEvent<string>) => {
    setSelectedNiveau(event.target.value);
    setSelectedMatiere('');
    setSelectedChapitre('');
    setSelectedExercice('');
  };

  const handleMatiereChange = (event: SelectChangeEvent<string>) => {
    setSelectedMatiere(event.target.value);
    setSelectedChapitre('');
    setSelectedExercice('');
  };

  const handleChapitreChange = (event: SelectChangeEvent<string>) => {
    setSelectedChapitre(event.target.value);
    setSelectedExercice('');
  };

  const handleExerciceChange = (event: SelectChangeEvent<string>) => {
    setSelectedExercice(event.target.value);
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
            label="Nom du fichier"
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
          <FormControl fullWidth>
            <InputLabel>Niveau</InputLabel>
            <Select value={selectedNiveau} label="Niveau" onChange={handleNiveauChange}>
              {niveauOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedNiveau}>
            <InputLabel>Matière</InputLabel>
            <Select value={selectedMatiere} label="Matière" onChange={handleMatiereChange}>
              {matiereOptions.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedMatiere}>
            <InputLabel>Chapitre</InputLabel>
            <Select value={selectedChapitre} label="Chapitre" onChange={handleChapitreChange}>
              {chapitreOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedChapitre}>
            <InputLabel>Exercice</InputLabel>
            <Select value={selectedExercice} label="Exercice" onChange={handleExerciceChange}>
              {exerciceOptions.map((ex) => (
                <MenuItem key={ex} value={ex}>
                  {ex}
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
        <Upload
          multiple
          value={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
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
            <Button variant="soft" onClick={onCreate || onUpdate}>
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