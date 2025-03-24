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

const hierarchy = [
  {
    niveau: 'Niveau 1',
    matieres: [
      {
        matiere: 'Mathématiques',
        chapitres: [
          { chapitre: 'Algèbre', exercices: ['Exercice 1', 'Exercice 2'] },
          { chapitre: 'Géométrie', exercices: ['Exercice 3', 'Exercice 4'] },
        ],
      },
      {
        matiere: 'Physique',
        chapitres: [
          { chapitre: 'Mécanique', exercices: ['Exercice 5', 'Exercice 6'] },
          { chapitre: 'Optique', exercices: ['Exercice 7', 'Exercice 8'] },
        ],
      },
    ],
  },
  {
    niveau: 'Niveau 2',
    matieres: [
      {
        matiere: 'Chimie',
        chapitres: [
          { chapitre: 'Organique', exercices: ['Exercice 9', 'Exercice 10'] },
          { chapitre: 'Inorganique', exercices: ['Exercice 11', 'Exercice 12'] },
        ],
      },
      {
        matiere: 'Biologie',
        chapitres: [
          { chapitre: 'Cellule', exercices: ['Exercice 13', 'Exercice 14'] },
          { chapitre: 'Génétique', exercices: ['Exercice 15', 'Exercice 16'] },
        ],
      },
    ],
  },
];

type Props = DialogProps & {
  open: boolean;
  title?: string;
  folderName?: string;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = 'Téléverser les fichiers',
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
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleUpload = () => {
    onClose();
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const isUploadDisabled = !fileName || !description || files.length === 0;

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

  const currentNiveau = hierarchy.find((h) => h.niveau === selectedNiveau);
  const matieresOptions = currentNiveau ? currentNiveau.matieres : [];
  const currentMatiere = matieresOptions.find((m) => m.matiere === selectedMatiere);
  const chapitresOptions = currentMatiere ? currentMatiere.chapitres : [];
  const currentChapitre = chapitresOptions.find((c) => c.chapitre === selectedChapitre);
  const exercicesOptions = currentChapitre ? currentChapitre.exercices : [];

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
        {(onCreate || onUpdate) ? (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 2 }}
          />
        ) : (
          <>
          </>
        )}
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
              {hierarchy.map((h) => (
                <MenuItem key={h.niveau} value={h.niveau}>
                  {h.niveau}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedNiveau}>
            <InputLabel>Matière</InputLabel>
            <Select value={selectedMatiere} label="Matière" onChange={handleMatiereChange}>
              {matieresOptions.map((m) => (
                <MenuItem key={m.matiere} value={m.matiere}>
                  {m.matiere}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedMatiere}>
            <InputLabel>Chapitre</InputLabel>
            <Select value={selectedChapitre} label="Chapitre" onChange={handleChapitreChange}>
              {chapitresOptions.map((c) => (
                <MenuItem key={c.chapitre} value={c.chapitre}>
                  {c.chapitre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedChapitre}>
            <InputLabel>Exercice</InputLabel>
            <Select value={selectedExercice} label="Exercice" onChange={handleExerciceChange}>
              {exercicesOptions.map((ex) => (
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
          Téléverser
        </Button>
        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Supprimer tout
          </Button>
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