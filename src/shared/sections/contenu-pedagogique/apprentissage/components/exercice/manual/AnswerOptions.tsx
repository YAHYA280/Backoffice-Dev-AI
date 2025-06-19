'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faCheck,
  faTimes,
  faCircle,
  faSquare,
  faLightbulb,
  faCheckCircle,
  faCheckSquare,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Stack,
  Radio,
  Switch,
  Button,
  Tooltip,
  Checkbox,
  TextField,
  Typography,
  IconButton,
  FormControlLabel,
  alpha,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface AnswerOptionsProps {
  options: AnswerOption[];
  allowMultiple: boolean;
  onOptionsChange: (options: AnswerOption[]) => void;
  onAllowMultipleChange: (allowMultiple: boolean) => void;
  minOptions?: number;
  maxOptions?: number;
  showExplanations?: boolean;
}

export const AnswerOptions = ({
  options,
  allowMultiple,
  onOptionsChange,
  onAllowMultipleChange,
  minOptions = 2,
  maxOptions = 10,
  showExplanations = false,
}: AnswerOptionsProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});

  const generateId = () => `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddOption = () => {
    if (options.length < maxOptions) {
      const newOption: AnswerOption = {
        id: generateId(),
        text: '',
        isCorrect: false,
      };
      onOptionsChange([...options, newOption]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > minOptions) {
      const newOptions = options.filter((_, i) => i !== index);
      onOptionsChange(newOptions);
    }
  };

  const handleOptionChange = (index: number, field: keyof AnswerOption, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    // If switching to single correct answer mode and this option is marked correct
    // unmark all other options
    if (!allowMultiple && field === 'isCorrect' && value === true) {
      newOptions.forEach((opt, i) => {
        if (i !== index) {
          opt.isCorrect = false;
        }
      });
    }

    onOptionsChange(newOptions);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newOptions = [...options];
    const [draggedOption] = newOptions.splice(draggedIndex, 1);
    newOptions.splice(dropIndex, 0, draggedOption);

    onOptionsChange(newOptions);
    setDraggedIndex(null);
  };

  const correctCount = options.filter((opt) => opt.isCorrect).length;
  const hasValidation = correctCount > 0 && options.every((opt) => opt.text.trim() !== '');

  return (
    <Box>
      {/* Header Controls */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={allowMultiple}
              onChange={(e) => onAllowMultipleChange(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <FontAwesomeIcon
                icon={allowMultiple ? faCheckSquare : faCheckCircle}
                style={{ marginRight: 4 }}
              />
              <Typography variant="body2">
                {allowMultiple ? 'Réponses multiples' : 'Réponse unique'}
              </Typography>
            </Stack>
          }
        />

        {showExplanations && (
          <FormControlLabel
            control={
              <Switch
                checked={Object.keys(showHints).length > 0}
                onChange={(e) =>
                  setShowHints(
                    e.target.checked
                      ? options.reduce((acc, opt) => ({ ...acc, [opt.id]: true }), {})
                      : {}
                  )
                }
                color="info"
              />
            }
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <FontAwesomeIcon icon={faLightbulb} style={{ marginRight: 4 }} />
                <Typography variant="body2">Explications</Typography>
              </Stack>
            }
          />
        )}
      </Stack>

      {/* Validation Status */}
      <Box sx={{ mb: 2 }}>
        {correctCount === 0 ? (
          <Chip
            icon={<FontAwesomeIcon icon={faTimes} />}
            label="Aucune réponse correcte définie"
            color="error"
            size="small"
            variant="outlined"
          />
        ) : (
          <Chip
            icon={<FontAwesomeIcon icon={faCheck} />}
            label={`${correctCount} réponse${correctCount > 1 ? 's' : ''} correcte${correctCount > 1 ? 's' : ''}`}
            color="success"
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      {/* Options List */}
      <Stack spacing={2}>
        <AnimatePresence>
          {options.map((option, index) => (
            <Card
              key={option.id}
              component={m.div}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              sx={{
                p: 2,
                cursor: 'move',
                position: 'relative',
                bgcolor: option.isCorrect
                  ? (theme) => alpha(theme.palette.success.lighter, 0.5)
                  : 'background.paper',
                border: '1px solid',
                borderColor: option.isCorrect ? 'success.light' : 'divider',
                '&:hover': {
                  boxShadow: (theme) => theme.customShadows?.z8,
                },
                opacity: draggedIndex === index ? 0.5 : 1,
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* Drag Handle */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text.disabled',
                      cursor: 'grab',
                      '&:active': { cursor: 'grabbing' },
                    }}
                  >
                    <FontAwesomeIcon icon={faGripVertical} />
                  </Box>

                  {/* Correct Answer Control */}
                  <Box sx={{ pt: 0.5 }}>
                    {allowMultiple ? (
                      <Checkbox
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        color="success"
                        icon={<FontAwesomeIcon icon={faSquare} />}
                        checkedIcon={<FontAwesomeIcon icon={faCheckSquare} />}
                      />
                    ) : (
                      <Radio
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        color="success"
                        icon={<FontAwesomeIcon icon={faCircle} />}
                        checkedIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                      />
                    )}
                  </Box>

                  {/* Option Text */}
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      variant="outlined"
                      size="small"
                      error={!option.text.trim()}
                      helperText={!option.text.trim() ? 'Le texte est requis' : ''}
                      InputProps={{
                        sx: {
                          bgcolor: 'background.paper',
                        },
                      }}
                    />

                    {/* Explanation Field */}
                    {showHints[option.id] && (
                      <Box
                        component={m.div}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        sx={{ mt: 1 }}
                      >
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={option.explanation || ''}
                          onChange={(e) => handleOptionChange(index, 'explanation', e.target.value)}
                          placeholder="Explication pour cette option (optionnel)"
                          variant="outlined"
                          size="small"
                          InputProps={{
                            sx: {
                              bgcolor: (theme) => alpha(theme.palette.info.lighter, 0.3),
                              fontSize: '0.875rem',
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Actions */}
                  <Stack direction="row" spacing={0.5}>
                    {showExplanations && (
                      <Tooltip
                        title={
                          showHints[option.id] ? "Masquer l'explication" : 'Ajouter une explication'
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            setShowHints({
                              ...showHints,
                              [option.id]: !showHints[option.id],
                            })
                          }
                          sx={{
                            color: showHints[option.id] ? 'info.main' : 'text.disabled',
                          }}
                        >
                          <FontAwesomeIcon icon={faLightbulb} />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveOption(index)}
                        disabled={options.length <= minOptions}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                          },
                          '&:disabled': {
                            color: 'text.disabled',
                          },
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>

                {/* Option Label */}
                {option.isCorrect && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Chip
                      label="Correct"
                      size="small"
                      color="success"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 'fontWeightBold',
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Card>
          ))}
        </AnimatePresence>
      </Stack>

      {/* Add Option Button */}
      <Button
        variant="outlined"
        fullWidth
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={handleAddOption}
        disabled={options.length >= maxOptions}
        sx={{
          mt: 2,
          borderStyle: 'dashed',
          '&:hover': {
            borderStyle: 'dashed',
          },
        }}
      >
        Ajouter une option {options.length >= maxOptions && `(Max ${maxOptions})`}
      </Button>

      {/* Instructions */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        • Glissez-déposez pour réorganiser les options
        <br />• {allowMultiple ? 'Cochez' : 'Sélectionnez'} les réponses correctes
        {showExplanations && <br />}
        {showExplanations && '• Ajoutez des explications pour aider les étudiants'}
      </Typography>
    </Box>
  );
};
