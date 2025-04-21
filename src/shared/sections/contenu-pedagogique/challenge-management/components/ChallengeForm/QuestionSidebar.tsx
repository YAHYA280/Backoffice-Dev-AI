import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTimes,
  faImage,
  faVideo,
  faTrash,
  faPlus,
  faQuestion,
  faListOl,
  faGamepad,
  faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons';

import Checkbox from '@mui/material/Checkbox';
import {
  Box,
  Grid,
  Chip,
  Tabs,
  Tab,
  Stack,
  Button,
  Drawer,
  Switch,
  TextField,
  FormGroup,
  FormLabel,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  FormHelperText,
  alpha,
} from '@mui/material';

import { CustomUpload } from 'src/shared/components/upload/upload-custom';
import { QuestionType } from '../../types';
import { EditableQuestion, EditableReponse, QuestionSidebarProps } from './types';

const QUESTION_TYPE_OPTIONS = [
  {
    value: QuestionType.QCM,
    label: 'QCM',
    icon: faListOl,
    description: 'Question à choix multiples avec une ou plusieurs réponses correctes',
  },
  {
    value: QuestionType.OUVERTE,
    label: 'Question ouverte',
    icon: faQuestion,
    description: 'Question à réponse libre (texte court ou long)',
  },
  {
    value: QuestionType.MINIJEU,
    label: 'Mini-jeu',
    icon: faPuzzlePiece,
    description: 'Jeu interactif, puzzle, ou activité spéciale',
  },
  {
    value: QuestionType.VISUEL,
    label: 'Jeu visuel',
    icon: faGamepad,
    description: 'Interaction visuelle (glisser-déposer, cliquer, etc.)',
  },
];

export const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  open,
  onClose,
  onSave,
  question,
  isEditing,
  questionNumber,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<EditableQuestion | null>(question);

  // Reset currentQuestion when the prop changes
  useEffect(() => {
    setCurrentQuestion(question);
  }, [question]);

  if (!currentQuestion) {
    return null;
  }

  const handleSave = () => {
    if (!currentQuestion) return;
    onSave(currentQuestion);
  };

  const isValid =
    currentQuestion &&
    currentQuestion.texte &&
    !(
      currentQuestion.type === QuestionType.QCM &&
      (currentQuestion.reponses.length === 0 ||
        currentQuestion.reponses.some((r) => !r.texte) ||
        !currentQuestion.reponses.some((r) => r.estCorrecte))
    );

  const handleAddOption = () => {
    if (!currentQuestion) return;

    const newReponse: EditableReponse = { texte: '', estCorrecte: false };
    setCurrentQuestion({
      ...currentQuestion,
      reponses: [...currentQuestion.reponses, newReponse],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      reponses: currentQuestion.reponses.filter((_, i) => i !== index),
    });
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    if (!currentQuestion) return;

    const newReponses = [...currentQuestion.reponses];
    newReponses[index] = {
      ...newReponses[index],
      [field]: value,
    };
    setCurrentQuestion({
      ...currentQuestion,
      reponses: newReponses,
    });
  };

  const handleQuestionImageChange = (file: File) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_image: file,
      fichier_video: null,
    });
  };

  const handleQuestionVideoChange = (file: File) => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_video: file,
      fichier_image: null,
    });
  };

  const handleRemoveQuestionMedia = () => {
    if (!currentQuestion) return;

    setCurrentQuestion({
      ...currentQuestion,
      fichier_image: null,
      fichier_video: null,
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '80%', md: '50%', lg: '40%' },
          p: 3,
          overflow: 'auto',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">
          {isEditing ? 'Modifier la question' : 'Nouvelle question'}
        </Typography>
        <Chip label={`Question ${questionNumber}`} color="primary" variant="outlined" />
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="question-type-label">Type de question</InputLabel>
            <Select
              labelId="question-type-label"
              id="question-type-select"
              value={currentQuestion.type}
              label="Type de question"
              onChange={(e) => {
                // Reset options when changing question type
                const newType = e.target.value as QuestionType;
                const newReponses: EditableReponse[] =
                  newType === QuestionType.QCM
                    ? [
                        { texte: '', estCorrecte: false },
                        { texte: '', estCorrecte: false },
                      ]
                    : [];

                // Create updated question with the new type
                const updatedQuestion: EditableQuestion = {
                  ...currentQuestion,
                  type: newType,
                  reponses: newReponses,
                };

                // Add type-specific properties
                if (newType === QuestionType.OUVERTE) {
                  updatedQuestion.reponseAttendue = '';
                } else {
                  delete updatedQuestion.reponseAttendue;
                }

                if (newType === QuestionType.VISUEL || newType === QuestionType.MINIJEU) {
                  updatedQuestion.elements = [];
                } else {
                  delete updatedQuestion.elements;
                }

                setCurrentQuestion(updatedQuestion);
              }}
            >
              {QUESTION_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <FontAwesomeIcon icon={option.icon} />
                    </Box>
                    <Box>
                      <Typography variant="body1">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    </Box>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Choisissez le type de question adapté à votre contenu pédagogique
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Texte de la question"
            fullWidth
            multiline
            rows={2}
            value={currentQuestion.texte}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, texte: e.target.value })}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Points"
            type="number"
            fullWidth
            value={currentQuestion.points || 0}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                points: parseInt(e.target.value, 10) || 0,
              })
            }
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Durée (secondes)"
            type="number"
            fullWidth
            value={currentQuestion.duree || 0}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                duree: parseInt(e.target.value, 10) || 0,
              })
            }
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={currentQuestion.isRequired ?? true}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    isRequired: e.target.checked,
                  })
                }
              />
            }
            label="Question obligatoire"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Médias de la question (optionnel)
          </Typography>
          <Tabs
            value={
              currentQuestion.fichier_image
                ? 'image'
                : currentQuestion.fichier_video
                  ? 'video'
                  : 'none'
            }
            onChange={(_, value) => {
              if (value === 'none') {
                handleRemoveQuestionMedia();
              }
            }}
            sx={{ mb: 2 }}
          >
            <Tab value="none" label="Aucun média" />
            <Tab
              value="image"
              label="Image"
              icon={<FontAwesomeIcon icon={faImage} />}
              iconPosition="start"
            />
            <Tab
              value="video"
              label="Vidéo"
              icon={<FontAwesomeIcon icon={faVideo} />}
              iconPosition="start"
            />
          </Tabs>
          {!currentQuestion.fichier_image && !currentQuestion.fichier_video ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    Image
                  </FormLabel>
                  <CustomUpload
                    accept={{ 'image/*': [] }}
                    value={currentQuestion.fichier_image}
                    multiple={false}
                    onDrop={(acceptedFiles) => handleQuestionImageChange(acceptedFiles[0])}
                    onDelete={() => handleRemoveQuestionMedia()}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <FormLabel component="legend" sx={{ mb: 1 }}>
                    Vidéo
                  </FormLabel>
                  <CustomUpload
                    accept={{ 'video/*': [] }}
                    value={currentQuestion.fichier_video}
                    multiple={false}
                    onDrop={(acceptedFiles) => handleQuestionVideoChange(acceptedFiles[0])}
                    onDelete={() => handleRemoveQuestionMedia()}
                  />
                </FormControl>
              </Grid>
            </Grid>
          ) : null}

          {currentQuestion.fichier_image ? (
            <Box sx={{ position: 'relative' }}>
              <img
                src={URL.createObjectURL(currentQuestion.fichier_image)}
                alt="Aperçu de l'image"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: 'rgba(255,255,255,0.8)',
                }}
                onClick={handleRemoveQuestionMedia}
              >
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Box>
          ) : null}

          {currentQuestion.fichier_video ? (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ p: 1, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <FontAwesomeIcon icon={faVideo} />
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {currentQuestion.fichier_video.name}
                  </Typography>
                  <Typography variant="caption">
                    {(currentQuestion.fichier_video.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <IconButton size="small" onClick={handleRemoveQuestionMedia}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          ) : null}
        </Grid>

        {/* Question-type specific content */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          {currentQuestion.type === QuestionType.QCM ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Options de réponse
              </Typography>

              {currentQuestion.reponses.map((reponse, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={8}>
                    <TextField
                      label={`Option ${index + 1}`}
                      fullWidth
                      value={reponse.texte}
                      onChange={(e) => handleOptionChange(index, 'texte', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={reponse.estCorrecte || false}
                          onChange={(e) =>
                            handleOptionChange(index, 'estCorrecte', e.target.checked)
                          }
                        />
                      }
                      label="Correcte"
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveOption(index)}
                      disabled={currentQuestion.reponses.length <= 2}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={handleAddOption}
                sx={{ mt: 1 }}
              >
                Ajouter une option
              </Button>
            </>
          ) : null}

          {currentQuestion.type === QuestionType.OUVERTE ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Réponse attendue
              </Typography>
              <TextField
                label="Réponse attendue (facultatif)"
                fullWidth
                multiline
                rows={2}
                value={currentQuestion.reponseAttendue || ''}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    reponseAttendue: e.target.value,
                  })
                }
                helperText="Laissez vide si plusieurs réponses sont possibles ou si la réponse sera évaluée manuellement."
              />
            </>
          ) : null}

          {currentQuestion.type === QuestionType.VISUEL ||
          currentQuestion.type === QuestionType.MINIJEU ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {currentQuestion.type === QuestionType.VISUEL
                  ? 'Éléments du jeu visuel'
                  : 'Éléments du mini-jeu'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configurez les éléments interactifs pour ce{' '}
                {currentQuestion.type === QuestionType.VISUEL ? 'jeu visuel' : 'mini-jeu'}.
              </Typography>

              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: (theme) => alpha('#f5f5f5', 0.5),
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                }}
              >
                <Typography color="text.secondary">
                  La configuration avancée des éléments visuels peut être effectuée après la
                  création du challenge via l&apos;éditeur spécialisé.
                </Typography>
              </Box>
            </>
          ) : null}
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!isValid}>
          Sauvegarder
        </Button>
      </Box>
    </Drawer>
  );
};

export default QuestionSidebar;
