'use client';

import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faUsers, faCalendar, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  abonnement?: IAbonnementItem;
};

export function AbonnementDetailsContent({ abonnement }: Props) {
  const renderContent = (
    <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">{abonnement?.title}</Typography>

      <Typography variant="body2">{abonnement?.shortDescription}</Typography>

      <Typography variant="body2">{abonnement?.fullDescription}</Typography>

      <Stack spacing={2}>
        <Typography variant="h6">fonctionnalités</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          {abonnement?.features.map((feature) => (
            <Chip key={feature} label={feature} variant="soft" />
          ))}
        </Stack>
      </Stack>
    </Card>
  );

  const renderOverview = (
    <Card sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
      {[
        {
          label: 'Date de publication',
          value: fDate(abonnement?.createdAt),
          icon: <FontAwesomeIcon icon={faCalendar} />,
        },
        {
          label: "Date d'expiration",
          value: fDate(abonnement?.expiredAt),
          icon: <FontAwesomeIcon icon={faCalendar} />,
        },
        {
          label: "Date d'archivage",
          value: fDate(abonnement?.archivedAt),
          icon: <FontAwesomeIcon icon={faCalendar} />,
        },
        {
          label: "Prix de l'abonnement",
          value: `${fCurrency(abonnement?.price.amount)} / ${abonnement?.price.interval}`,
          icon: <FontAwesomeIcon icon={faMoneyBillAlt} />,
        },
        {
          label: "Nombre total d'abonnés",
          value: abonnement?.totalSubscribers,
          icon: <FontAwesomeIcon icon={faUsers} />,
        },
        {
          label: 'Statut',
          value: abonnement?.publish,
          icon: <FontAwesomeIcon icon={faTag} />,
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

  const renderPromo = abonnement?.promoDetails ? (
    <Paper variant="outlined" sx={{ p: 3, mt: 3, gap: 2, borderRadius: 2 }}>
      <Typography variant="h6">Promotion</Typography>
      <Typography variant="body2">
        {`Remise : ${abonnement?.promoDetails.discountPercentage}%`}
      </Typography>
      <Typography variant="body2">{`Valable jusqu'au : ${fDate(abonnement?.promoDetails.validUntil)}`}</Typography>
    </Paper>
  ) : null;

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
        {renderPromo}
      </Grid>
    </Grid>
  );
}
