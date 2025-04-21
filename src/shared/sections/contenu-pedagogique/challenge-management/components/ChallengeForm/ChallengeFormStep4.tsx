import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Grid,
  Chip,
  List,
  Stack,
  Paper,
  Divider,
  ListItem,
  Accordion,
  Typography,
  ListItemIcon,
  ListItemText,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { QuestionType } from '../../types';
import { DIFFICULTE_OPTIONS, METHODE_CALCUL_SCORE_OPTIONS } from '../../constants';

import type { StepProps } from './types';

// Définition des icônes utilisées pour les types de questions
const QUESTION_TYPE_OPTIONS = [
  { value: QuestionType.QCM, label: 'QCM' },
  { value: QuestionType.OUVERTE, label: 'Question ouverte' },
  { value: QuestionType.MINIJEU, label: 'Mini-jeu' },
  { value: QuestionType.VISUEL, label: 'Jeu visuel' },
];

export const ChallengeFormStep4: React.FC<StepProps> = ({ form }) => {
  const { watch } = form;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          <FontAwesomeIcon icon={faCheck} style={{ marginRight: '8px' }} />
          Récapitulatif du Challenge
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      {/* Preview of the challenge summary */}
      <Grid item xs={12}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nom du challenge
              </Typography>
              <Typography variant="h6">{watch('nom')}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">{watch('description')}</Typography>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Difficulté
                </Typography>
                <Chip
                  size="small"
                  label={DIFFICULTE_OPTIONS.find((opt) => opt.value === watch('difficulte'))?.label}
                  sx={{
                    backgroundColor: DIFFICULTE_OPTIONS.find(
                      (opt) => opt.value === watch('difficulte')
                    )?.bgColor,
                    color: DIFFICULTE_OPTIONS.find((opt) => opt.value === watch('difficulte'))
                      ?.color,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Durée
                </Typography>
                <Typography variant="body2">{watch('timer')} minutes</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Nombre de tentatives
                </Typography>
                <Typography variant="body2">
                  {watch('nbTentatives') === 0 ? 'Illimité' : watch('nbTentatives')}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Questions aléatoires
                </Typography>
                <Typography variant="body2">
                  {watch('isRandomQuestions') ? 'Oui' : 'Non'}
                </Typography>
              </Box>
            </Stack>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Méthode de calcul du score
              </Typography>
              <Typography variant="body2">
                {
                  METHODE_CALCUL_SCORE_OPTIONS.find(
                    (opt) => opt.value === watch('scoreConfiguration.methode')
                  )?.label
                }
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Questions ({watch('questions')?.length || 0})
              </Typography>

              {watch('questions')?.length > 0 ? (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Voir les questions ({watch('questions')?.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {watch('questions')?.map((question, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle1">
                          Q{index + 1}: {question.texte}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {QUESTION_TYPE_OPTIONS.find((opt) => opt.value === question.type)?.label}{' '}
                          · {question.points} points
                        </Typography>

                        {question.type === QuestionType.QCM && question.reponses ? (
                          <List dense>
                            {question.reponses.map((reponse, i) => (
                              <ListItem key={i}>
                                <ListItemIcon sx={{ minWidth: '30px' }}>
                                  {reponse.estCorrecte ? (
                                    <FontAwesomeIcon icon={faCheck} color="green" />
                                  ) : (
                                    <FontAwesomeIcon icon={faTimes} color="red" />
                                  )}
                                </ListItemIcon>
                                <ListItemText primary={reponse.texte} />
                              </ListItem>
                            ))}
                          </List>
                        ) : null}
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <Typography color="error">
                  Aucune question n&apos;a été ajoutée. Veuillez retourner à l&apos;étape 3.
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChallengeFormStep4;
