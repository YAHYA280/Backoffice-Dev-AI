import { useForm, FormProvider } from 'react-hook-form';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Box,
  Grid,
  Chip,
  Modal,
  Stack,
  alpha,
  Select,
  Button,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  OutlinedInput,
} from '@mui/material';

import { _emails } from 'src/shared/_mock';

import { RHFUpload } from '../components/rhf-upload';

const niveaux = ['CP', 'CM1', 'CM2', 'CE1', 'CE2'] as const;
type NiveauType = (typeof niveaux)[number];

const matieresByNiveau: Record<NiveauType, string[]> = {
  CP: ['Mathématiques', 'Français'],
  CM1: ['Mathématiques', 'Français', 'Sciences'],
  CM2: ['Mathématiques', 'Français', 'Histoire'],
  CE1: ['Mathématiques', 'Français'],
  CE2: ['Mathématiques', 'Français', 'Sciences', 'Histoire'],
};

const exercicesByMatiere: Record<string, string[]> = {
  Mathématiques: ['Addition', 'Soustraction', 'Multiplication'],
  Français: ['Grammaire', 'Orthographe', 'Lecture'],
  Sciences: ['Électricité', 'Écosystèmes'],
  Histoire: ['Révolution Française', 'Préhistoire'],
};

type AddAmeliorationModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    titre: string;
    description: string;
    niveau: NiveauType;
    matiere: string;
    exercice: string[];
    attachments: FileList | [];
    assignee: string[];
  }) => void;
};

export function AddAmeliorationModal({ open, onClose, onSubmit }: AddAmeliorationModalProps) {
  const methods = useForm({
    defaultValues: {
      images: [],
    },
  });

  const { setValue, watch } = methods;
  const values = watch();

  const [niveau, setNiveau] = useState<NiveauType | ''>('');
  const [matiere, setMatiere] = useState('');
  const [exercice, setExercice] = useState<string[]>([]);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<FileList | []>([]);
  const [assignee, setAssignee] = useState<string[]>([]);

  useEffect(() => {
    setMatiere('');
    setExercice([]);
  }, [niveau]);

  useEffect(() => {
    setExercice([]);
  }, [matiere]);

  // File handling methods
  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file: File) => file !== inputFile);
      setValue('images', filtered);

      // Update attachments state if needed for form submission
      if (filtered && filtered.length > 0) {
        const fileListObj = createFileList(filtered);
        setAttachments(fileListObj);
      } else {
        setAttachments([]);
      }
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
    setAttachments([]);
  }, [setValue]);

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    console.info('ON UPLOAD', files);
    if (files && files.length > 0) {
      const fileListObj = createFileList(files);
      setAttachments(fileListObj);
    }
  };

  // Helper function to convert array to FileList
  const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });
    return dataTransfer.files;
  };

  const onSubmitHandler = () => {
    onSubmit({
      titre,
      description,
      niveau: niveau as NiveauType,
      matiere,
      exercice,
      attachments,
      assignee,
    });
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflow: 'auto',
          }}
        >
          {/* Close Button (Top Right) */}
          <IconButton
            onClick={onClose}
            sx={{
              marginTop: -0.5,
              float: 'right',
              zIndex: 1,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: alpha('#000', 0.04),
              },
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>

          <Typography variant="h6" mb={2} textAlign="left">
            Ajouter une amélioration
          </Typography>

          <TextField
            fullWidth
            label="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Niveau</InputLabel>
                <Select
                  input={<OutlinedInput label="Niveau" />}
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value as NiveauType)}
                >
                  {niveaux.map((niv) => (
                    <MenuItem key={niv} value={niv}>
                      {niv}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Matière</InputLabel>
                <Select
                  input={<OutlinedInput label="Matière" />}
                  value={matiere}
                  onChange={(e) => setMatiere(e.target.value)}
                  disabled={!niveau}
                >
                  {niveau ? (
                    matieresByNiveau[niveau]?.map((mat) => (
                      <MenuItem key={mat} value={mat}>
                        {mat}
                      </MenuItem>
                    ))
                  ) : (
                    <> </>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControl
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                  },
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  fontWeight: 600,
                },
              },
            }}
          >
            <InputLabel>Exercice</InputLabel>
            <Select
              multiple
              input={<OutlinedInput label="Exercice" sx={{ borderRadius: 1.5 }} />}
              value={exercice}
              onChange={(e) =>
                setExercice(
                  typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                )
              }
              disabled={!matiere}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5,
                    borderRadius: 8,
                    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                  },
                },
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      onDelete={() => setExercice(exercice.filter((ex) => ex !== value))}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontWeight: 600,
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
              sx={{
                minHeight: '56px',
                '& .MuiOutlinedInput-input': {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  padding: '14px',
                  height: 'auto',
                },
              }}
            >
              {matiere ? (
                exercicesByMatiere[matiere]?.map((ex) => (
                  <MenuItem
                    key={ex}
                    value={ex}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      my: 0.5,
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      },
                      '&.Mui-selected': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                        },
                      },
                    }}
                  >
                    {ex}
                  </MenuItem>
                ))
              ) : (
                <> </>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Assigner à</InputLabel>
            <Select
              multiple
              input={<OutlinedInput label="Assigner à" />}
              value={assignee}
              onChange={(e) => setAssignee(e.target.value as string[])}
              renderValue={(selected) => (
                <Stack direction="row" spacing={1}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Stack>
              )}
            >
              {_emails.map((email) => (
                <MenuItem key={email} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Pièces jointes</Typography>
              <Box
                sx={{
                  border: '1px dashed rgba(145, 158, 171, 0.32)',
                  borderRadius: 1,
                  p: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                <RHFUpload
                  multiple
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={() => console.info('ON UPLOAD')}
                  sx={{
                    '& .upload-placeholder': {
                      bgcolor: 'background.neutral',
                    },
                    '& .upload-img-placeholder': {
                      height: 80,
                    },
                    '& .upload-drop-zone': {
                      py: 2,
                    },
                  }}
                />
              </Box>
            </Stack>
          </FormControl>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
            }}
          >
            <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.main' }}>
              Annuler
            </Button>
            <Button variant="contained" color="primary" onClick={onSubmitHandler}>
              Ajouter
            </Button>
          </Box>
        </Box>
      </Modal>
    </FormProvider>
  );
}
