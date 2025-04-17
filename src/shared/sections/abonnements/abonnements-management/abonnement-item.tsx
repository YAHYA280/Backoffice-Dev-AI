import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPen,
  faBook,
  faUsers,
  faChild,
  faTrashAlt,
  faMoneyBill,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { getPublishLabel } from 'src/shared/_mock';

import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  abonnement: IAbonnementItem;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function AbonnementItem({ abonnement, onView, onEdit, onDelete }: Props) {
  const popover = usePopover();

  // Déterminer quel prix afficher en fonction de l'intervalle par défaut
  const getPriceDisplay = () => {
    if (!abonnement.price) return '0 €';

    if (abonnement.price.defaultInterval === 'Mensuel') {
      return `${fCurrency(abonnement.price.monthly)} /mois`;
    }
    if (abonnement.price.defaultInterval === 'Semestriel') {
      return `${fCurrency(abonnement.price.semiannual)} /6 mois`;
    }
    if (abonnement.price.defaultInterval === 'Annuel') {
      return `${fCurrency(abonnement.price.annual)} /an`;
    }

    // Fallback sur le format original
    return `${fCurrency(abonnement.price.monthly)} / Mensuel`;
  };

  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href={paths.dashboard.abonnements.details(abonnement.id)}
                color="inherit"
              >
                {abonnement.title}
              </Link>
            }
            secondary={`Créé le: ${fDate(abonnement.createdAt)}`}
            primaryTypographyProps={{ typography: 'subtitle1' }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }} noWrap>
            {abonnement.shortDescription}
          </Typography>

          {abonnement.promoDetails &&
            abonnement.promoDetails.discountPercentage &&
            abonnement.promoDetails.discountPercentage > 0 && (
              <Chip
                label={`-${abonnement.promoDetails.discountPercentage}%`}
                color="error"
                size="small"
                sx={{ mt: 1, alignSelf: 'flex-start' }}
              />
            )}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: getPriceDisplay(),
              icon: <FontAwesomeIcon icon={faMoneyBill} style={{ width: 16, flexShrink: 0 }} />,
            },
            {
              label: getPublishLabel(abonnement.publish),
              icon: <FontAwesomeIcon icon={faUsers} style={{ width: 16, flexShrink: 0 }} />,
            },
            {
              label: `${abonnement.nbr_children_access || 0} enfants`,
              icon: <FontAwesomeIcon icon={faChild} style={{ width: 16, flexShrink: 0 }} />,
            },
            {
              label: `${abonnement.nbr_subjects || 0} Matières`,
              icon: <FontAwesomeIcon icon={faBook} style={{ width: 16, flexShrink: 0 }} />,
            },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onView();
            }}
          >
            <FontAwesomeIcon icon={faEye} style={{ marginRight: 8 }} />
            Afficher
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <FontAwesomeIcon icon={faPen} style={{ marginRight: 8 }} />
            Modifier
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: 8 }} />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
