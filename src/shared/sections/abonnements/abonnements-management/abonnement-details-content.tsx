'use client';

import type { IAbonnementItem, AssistantConfiguration } from 'src/contexts/types/abonnement';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTag,
  faBook,
  faChild,
  faRobot,
  faCalendar,
  faQuestion,
  faMicrophone,
} from '@fortawesome/free-solid-svg-icons';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { getIntervalLabel } from 'src/shared/_mock';

// ----------------------------------------------------------------------

const AI_MODEL_NAMES = {
  chatgpt3: 'ChatGPT 3.5',
  chatgpt4: 'ChatGPT 4',
  chatgpt5: 'ChatGPT 5',
  claude3: 'Claude 3',
  claude3_5: 'Claude 3.5',
  claude4: 'Claude 4',
};

const TTS_MODEL_NAMES = {
  tts_standard: 'Standard',
  tts_premium: 'Premium',
  tts_neural: 'Neural',
  tts_premium_plus: 'Premium+',
};

type Props = {
  abonnement?: IAbonnementItem;
};

export function AbonnementDetailsContent({ abonnement }: Props) {
  // Fonction pour formater les noms des assistants disponibles
  const formatAssistantsInfo = (assistants?: AssistantConfiguration) => {
    if (!assistants) return '-';

    const availableAssistants = [];
    if (assistants.devoir.access) availableAssistants.push('Devoir');
    if (assistants.recherche.access) availableAssistants.push('Recherche');
    if (assistants.japprends.access) availableAssistants.push("J'apprends");

    return availableAssistants.length ? availableAssistants.join(', ') : 'Aucun';
  };

  const renderContent = (
    <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">{abonnement?.title}</Typography>

      <Typography variant="body2">{abonnement?.shortDescription}</Typography>

      <Typography variant="body2">{abonnement?.fullDescription}</Typography>
    </Card>
  );

  const renderOverview = (
    <Card sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
      {[
        {
          label: 'Date de creation',
          value: fDate(abonnement?.createdAt),
          icon: <FontAwesomeIcon icon={faCalendar} />,
        },
        ...(abonnement?.lastPublishedDate
          ? [
              {
                label: 'Date de la dernière publication',
                value: fDate(abonnement?.lastPublishedDate),
                icon: <FontAwesomeIcon icon={faCalendar} />,
              },
            ]
          : []),
        ...(abonnement?.expiredAt
          ? [
              {
                label: "Date d'expiration",
                value: fDate(abonnement?.expiredAt),
                icon: <FontAwesomeIcon icon={faCalendar} />,
              },
            ]
          : []),
        ...(abonnement?.lastarchivedDate
          ? [
              {
                label: "Date d'archivage",
                value: fDate(abonnement?.lastarchivedDate),
                icon: <FontAwesomeIcon icon={faCalendar} />,
              },
            ]
          : []),
        {
          label: 'Statut',
          value: abonnement?.publish,
          icon: <FontAwesomeIcon icon={faTag} />,
        },
        {
          label: "Nombre d'abonnés",
          value: abonnement?.totalSubscribers || 0,
          icon: <FontAwesomeIcon icon={faChild} />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.primary',
              typography: 'subtitle2',
            }}
          />
        </Stack>
      ))}
    </Card>
  );

  const renderPricing = (
    <Card sx={{ p: 3, mt: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">Tarification</Typography>

      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Prix mensuel:
          </Typography>
          <Typography variant="body2">{fCurrency(abonnement?.price?.monthly || 0)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Prix semestriel:
          </Typography>
          <Typography variant="body2">{fCurrency(abonnement?.price?.semiannual || 0)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Prix annuel:
          </Typography>
          <Typography variant="body2">{fCurrency(abonnement?.price?.annual || 0)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            Intervalle par défaut:
          </Typography>
          <Typography variant="body2">
            {getIntervalLabel(abonnement?.price?.defaultInterval) || 'Mensuel'}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );

  const renderLimits = (
    <Card sx={{ p: 3, mt: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">Limites d&apos;utilisation</Typography>

      {[
        {
          label: "Nombre d'enfants autorisés",
          value: abonnement?.nbr_children_access || 0,
          icon: <FontAwesomeIcon icon={faChild} />,
        },
        {
          label: 'Questions quotidiennes par enfant',
          value: abonnement?.daily_question_limit || 0,
          icon: <FontAwesomeIcon icon={faQuestion} />,
        },
        {
          label: 'Matières accessibles',
          value: abonnement?.nbr_subjects || 0,
          icon: <FontAwesomeIcon icon={faBook} />,
        },
        {
          label: 'Assistants IA accessibles',
          value: formatAssistantsInfo(abonnement?.assistants),
          icon: <FontAwesomeIcon icon={faRobot} />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row" alignItems="center">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.primary',
              typography: 'subtitle2',
            }}
          />
        </Stack>
      ))}
    </Card>
  );

  const renderAssistantsDetails = (
    <Card sx={{ p: 3, mt: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">Détails des assistants</Typography>

      {abonnement?.assistants && (
        <Stack spacing={2}>
          {/* Assistant Devoir */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FontAwesomeIcon icon={faRobot} />
              <Typography variant="subtitle2">Assistant Devoir</Typography>
              <Chip
                size="small"
                color={abonnement.assistants.devoir.access ? 'success' : 'error'}
                label={abonnement.assistants.devoir.access ? 'Activé' : 'Désactivé'}
              />
            </Stack>

            {abonnement.assistants.devoir.access && (
              <Stack spacing={1} sx={{ pl: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Modèle de texte:
                  </Typography>
                  <Typography variant="body2">
                    {abonnement.assistants.devoir.textModel || 'Non spécifié'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={faMicrophone} size="sm" />
                  <Typography variant="body2" color="text.secondary">
                    Synthèse vocale:
                  </Typography>
                  <Typography variant="body2">
                    {abonnement.assistants.devoir.ttsModel || 'Non spécifié'}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Stack>

          <Divider />

          {/* Assistant Recherche */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FontAwesomeIcon icon={faRobot} />
              <Typography variant="subtitle2">Assistant Recherche</Typography>
              <Chip
                size="small"
                color={abonnement.assistants.recherche.access ? 'success' : 'error'}
                label={abonnement.assistants.recherche.access ? 'Activé' : 'Désactivé'}
              />
            </Stack>

            {abonnement.assistants.recherche.access && (
              <Stack spacing={1} sx={{ pl: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Modèle de texte:
                  </Typography>
                  <Typography variant="body2">
                    {abonnement.assistants.recherche.textModel || 'Non spécifié'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={faMicrophone} size="sm" />
                  <Typography variant="body2" color="text.secondary">
                    Synthèse vocale:
                  </Typography>
                  <Typography variant="body2">
                    {abonnement.assistants.recherche.ttsModel || 'Non spécifié'}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Stack>

          <Divider />

          {/* Assistant J'apprends */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <FontAwesomeIcon icon={faRobot} />
              <Typography variant="subtitle2">Assistant J&apos;apprends</Typography>
              <Chip
                size="small"
                color={abonnement.assistants.japprends.access ? 'success' : 'error'}
                label={abonnement.assistants.japprends.access ? 'Activé' : 'Désactivé'}
              />
            </Stack>

            {abonnement.assistants.japprends.access && (
              <Stack spacing={1} sx={{ pl: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Modèle de texte:
                  </Typography>
                  <Typography variant="body2">
                    {abonnement.assistants.japprends.textModel || 'Non spécifié'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon icon={faMicrophone} size="sm" />
                  <Typography variant="body2" color="text.secondary">
                    Synthèse vocale:
                  </Typography>
                  <Typography variant="body2">
                    {abonnement.assistants.japprends.ttsModel || 'Non spécifié'}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </Card>
  );

  const renderPromo = abonnement?.promoDetails ? (
    <Paper variant="outlined" sx={{ p: 3, mt: 3, gap: 2, borderRadius: 2 }}>
      <Typography variant="h6">Promotion</Typography>
      <Typography variant="body2">
        {`Remise : ${abonnement?.promoDetails.discountPercentage}%` || 'Remise Non spécifié'}
      </Typography>
      <Typography variant="body2">{`Valable jusqu'au : ${fDate(abonnement?.promoDetails.validUntil) || 'Non spécifié'}`}</Typography>
    </Paper>
  ) : null;

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
        {renderLimits}
        {renderAssistantsDetails}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
        {renderPricing}
        {renderPromo}
      </Grid>
    </Grid>
  );
}
