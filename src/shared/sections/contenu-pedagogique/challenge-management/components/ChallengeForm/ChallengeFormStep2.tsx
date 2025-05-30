import React from 'react';
import { Controller } from 'react-hook-form';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Box,
  Grid,
  Paper,
  Slider,
  Switch,
  Select,
  Divider,
  MenuItem,
  TextField,
  FormGroup,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { ScoreMethod } from '../../types';
import {
  TENTATIVES_OPTIONS,
  MOCK_PREREQUIS_CHALLENGES,
  METHODE_CALCUL_SCORE_OPTIONS,
} from '../../constants';

import type { StepProps } from './types';

export const ChallengeFormStep2: React.FC<StepProps> = ({
  form,
  niveaux = [],
  prerequisChallenges = [],
}) => {
  // Add errors to the destructuring here
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const niveauId = watch('niveauId');
  const scoreMethod = watch('scoreConfiguration.methode');
  const prerequisId = watch('prerequisId');

  const allPrerequisChallenges = [...prerequisChallenges, ...MOCK_PREREQUIS_CHALLENGES];

  const filteredPrerequisChallenges = niveauId
    ? allPrerequisChallenges.filter((challenge) => challenge.niveau?.id === niveauId)
    : allPrerequisChallenges;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
          Paramètres du challenge
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Box sx={{ px: 1, py: 2 }}>
          <Controller
            name="timer"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <Typography id="timer-slider" gutterBottom>
                  Durée du timer: {value} minutes
                </Typography>
                <Slider
                  value={value || 5}
                  onChange={(_, newValue) => onChange(newValue)}
                  aria-labelledby="timer-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={5}
                  max={60}
                  // Remove the 'required' attribute here as it's not supported by Slider
                />
                {errors.timer && <FormHelperText error>{errors.timer.message}</FormHelperText>}
              </>
            )}
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="nbTentatives"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.nbTentatives}>
              <InputLabel>Nombre de tentatives autorisées</InputLabel>
              <Select {...field} label="Nombre de tentatives autorisées" required>
                {TENTATIVES_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.nbTentatives && (
                <FormHelperText>{errors.nbTentatives.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl component="fieldset">
          <FormGroup>
            <Controller
              name="isRandomQuestions"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Switch checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
                  }
                  label="Ordre aléatoire des questions"
                />
              )}
            />
          </FormGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Configuration du Score
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="scoreConfiguration.methode"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.scoreConfiguration?.methode}>
              <InputLabel>Méthode de calcul du score</InputLabel>
              <Select {...field} label="Méthode de calcul du score" required>
                {METHODE_CALCUL_SCORE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {METHODE_CALCUL_SCORE_OPTIONS.find((o) => o.value === field.value)?.description}
              </FormHelperText>
              {errors.scoreConfiguration?.methode && (
                <FormHelperText error>{errors.scoreConfiguration?.methode.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>

      {/* Additional parameters based on score method selected */}

      <ConditionalComponent isValid={scoreMethod === ScoreMethod.TEMPS}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Bonus de temps (points)"
            type="number"
            fullWidth
            placeholder="Ex: 10 points bonus par minute restante"
            onChange={(e) => {
              const parametres = JSON.stringify({
                pointsParBonneReponse: 10,
                bonusTemps: parseInt(e.target.value, 10) || 0,
              });
              setValue('scoreConfiguration.parametres', parametres);
            }}
          />
        </Grid>
      </ConditionalComponent>

      <ConditionalComponent isValid={scoreMethod === ScoreMethod.PENALITES}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pénalité par erreur (points)"
            type="number"
            fullWidth
            placeholder="Ex: -5 points par erreur"
            onChange={(e) => {
              const parametres = JSON.stringify({
                pointsParBonneReponse: 10,
                penaliteParErreur: parseInt(e.target.value, 10) || 0,
              });
              setValue('scoreConfiguration.parametres', parametres);
            }}
          />
        </Grid>
      </ConditionalComponent>

      <Grid item xs={12}>
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Prérequis (Challenge dépendant)
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Controller
                name="prerequisId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="prerequis-select-label">Challenge prérequis</InputLabel>
                    <Select
                      {...field}
                      labelId="prerequis-select-label"
                      label="Challenge prérequis"
                      displayEmpty
                      id="prerequis-select"
                    >
                      <MenuItem value="none">
                        <em>Aucun prérequis</em>
                      </MenuItem>
                      {filteredPrerequisChallenges.map((challenge) => (
                        <MenuItem key={challenge.id} value={challenge.id}>
                          {challenge.nom}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Sélectionnez un challenge qui doit être complété avant
                      {niveauId && filteredPrerequisChallenges.length === 0 && (
                        <Typography variant="caption" color="error" display="block">
                          Aucun challenge disponible pour ce niveau
                        </Typography>
                      )}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <ConditionalComponent isValid={prerequisId !== 'none'}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="prerequisPourcentage"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        label="Pourcentage minimum requis"
                        type="number"
                        variant="outlined"
                        InputProps={{
                          inputProps: { min: 0, max: 100 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography variant="body2">%</Typography>
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Ex: 70"
                        helperText="Score minimum nécessaire pour accéder à ce challenge"
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </ConditionalComponent>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Messages de fin
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="messageSucces"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Message de succès"
              fullWidth
              multiline
              rows={2}
              placeholder="Ex: Félicitations ! Vous avez réussi le challenge avec brio !"
              required
              error={!!errors.messageSucces}
              helperText={errors.messageSucces?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Controller
          name="messageEchec"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Message d'échec"
              fullWidth
              multiline
              rows={2}
              placeholder="Ex: Pas de chance cette fois-ci. Essayez encore !"
              required
              error={!!errors.messageEchec}
              helperText={errors.messageEchec?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default ChallengeFormStep2;
