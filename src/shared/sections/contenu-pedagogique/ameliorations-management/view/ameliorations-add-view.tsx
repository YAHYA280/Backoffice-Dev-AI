import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    Box,
    Grid,
    Chip,
    Modal,
    Stack,
    Select,
    Button,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    IconButton,
    FormControl
} from '@mui/material';

import { _emails } from 'src/shared/_mock';

import { Field } from 'src/shared/components/hook-form';

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

export function AddAmeliorationModal({
    open,
    onClose,
    onSubmit,
}: AddAmeliorationModalProps) {
    const methods = useForm();

    const [niveau, setNiveau] = useState<NiveauType | ''>('');
    const [matiere, setMatiere] = useState('');
    const [exercice, setExercice] = useState<string[]>([]);
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [attachments] = useState<FileList | []>([]);
    const [assignee, setAssignee] = useState<string[]>([]);

    useEffect(() => {
        setMatiere('');
        setExercice([]);
    }, [niveau]);

    useEffect(() => {
        setExercice([]);
    }, [matiere]);

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
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    {/* Close Button (Top Right) */}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
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
                                <Select value={niveau} onChange={(e) => setNiveau(e.target.value as NiveauType)}>
                                    {niveaux.map((niv) => (
                                        <MenuItem key={niv} value={niv}>{niv}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Matière</InputLabel>
                                <Select
                                    value={matiere}
                                    onChange={(e) => setMatiere(e.target.value)}
                                    disabled={!niveau}
                                >
                                    {niveau && matieresByNiveau[niveau]?.map((mat) => (
                                        <MenuItem key={mat} value={mat}>{mat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Exercice</InputLabel>
                        <Select
                            multiple
                            value={exercice}
                            onChange={(e) => setExercice(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                            disabled={!matiere}
                            renderValue={(selected) => (
                                <Stack direction="row" spacing={1}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Stack>
                            )}
                        >
                            {matiere && exercicesByMatiere[matiere]?.map((ex) => (
                                <MenuItem key={ex} value={ex}>
                                    {ex}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <FormControl fullWidth margin="normal">
                        <InputLabel>Assigner à</InputLabel>
                        <Select
                            multiple
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

                    <FormControl fullWidth  >
                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Pièces jointes</Typography>
                            <Field.CustomUpload multiple thumbnail name="attachements" 
                                onUpload={() => console.info('ON UPLOAD')} />
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
                        <Button variant="outlined" onClick={onClose} >
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
