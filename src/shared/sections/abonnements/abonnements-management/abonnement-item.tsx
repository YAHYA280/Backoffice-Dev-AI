import type { IAbonnementItem } from 'src/types/abonnement';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPen,
  faUsers,
  faClock,
  faTools,
  faTrashAlt,
  faMoneyBill,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
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

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <FontAwesomeIcon icon={faTools} width={16} />
            {abonnement.features.length} fonctionnalités
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: abonnement.type,
              icon: <FontAwesomeIcon icon={faClock} style={{ width: 16, flexShrink: 0 }} />,
            },
            {
              label: `${fCurrency(abonnement.price.amount)} / ${abonnement.price.interval}`,
              icon: <FontAwesomeIcon icon={faMoneyBill} style={{ width: 16, flexShrink: 0 }} />,
            },
            {
              label: `${abonnement.duration} jours`,
              icon: <FontAwesomeIcon icon={faClock} style={{ width: 16, flexShrink: 0 }} />,
            },
            {
              label: abonnement.publish,
              icon: <FontAwesomeIcon icon={faUsers} style={{ width: 16, flexShrink: 0 }} />,
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
            <FontAwesomeIcon icon={faEye} />
            Afficher
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <FontAwesomeIcon icon={faPen} />
            Modifier
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
