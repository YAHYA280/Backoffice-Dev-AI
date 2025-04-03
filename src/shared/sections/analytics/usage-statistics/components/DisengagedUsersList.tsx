import type { CardProps } from '@mui/material/Card';
import type { FilterValues } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useState } from 'react';
import { faBell, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { fToNow } from 'src/utils/format-time';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { FontAwesome } from 'src/shared/components/fontawesome';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

// ----------------------------------------------------------------------

// Définir les types pour les utilisateurs et les parents
export type ChildUser = {
  id: string;
  name: string;
  level: string;
  lastLogin: Date;
  engagementDrop: number;
  avatarUrl: string;
};

export type ParentUser = {
  id: string;
  name: string;
  childLevel: string;
  lastLogin: Date;
  missedUpdates: number;
  avatarUrl: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  filters: FilterValues;
  view: 'children' | 'parents';
}

export default function DisengagedUsersList({ title, subheader, filters, view, ...other }: Props) {
  const { childrenData, parentsData } = useAnalyticsApi(view, filters);
  const [openDialog, setOpenDialog] = useState(false);

  // Ne pas créer une liste unifiée, traiter les deux listes séparément
  const childrenList = childrenData?.disengagedUsers || [];
  const parentsList = parentsData?.nonActiveParents || [];

  // Display only first 5 items in the card
  const displayedChildren = childrenList.slice(0, 5);
  const displayedParents = parentsList.slice(0, 5);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNotifyAll = () => {
    // Cette fonction serait utilisée pour notifier tous les utilisateurs
    // Implémentation d'API à ajouter ici
    alert(
      `${view === 'children' ? 'Notification envoyée à tous les enfants' : 'Message envoyé à tous les parents'}`
    );
  };

  return (
    <>
      <Card {...other}>
        <CardHeader
          title={title || (view === 'children' ? 'Utilisateurs à risque' : 'Parents peu actifs')}
          subheader={subheader}
          action={
            <Button
              size="small"
              color="primary"
              endIcon={<FontAwesome icon={faBell} width={18} />}
              onClick={handleNotifyAll}
            >
              {view === 'children' ? 'Notifier tous' : 'Contacter tous'}
            </Button>
          }
        />

        <Scrollbar>
          <Stack sx={{ p: 0 }}>
            {view === 'children'
              ? displayedChildren.map((user) => <ChildItem key={user.id} user={user} />)
              : displayedParents.map((parent) => <ParentItem key={parent.id} parent={parent} />)}
          </Stack>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            size="small"
            color="inherit"
            endIcon={<FontAwesome icon={faChevronRight} width={18} sx={{ ml: -0.5 }} />}
            onClick={handleOpenDialog}
          >
            Voir tous
          </Button>
        </Box>
      </Card>

      {/* Dialog pour "Voir tous" */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        aria-labelledby="detailed-users-dialog-title"
      >
        <DialogTitle id="detailed-users-dialog-title">
          {view === 'children' ? 'Tous les utilisateurs à risque' : 'Tous les parents peu actifs'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Scrollbar sx={{ maxHeight: 500 }}>
            <Stack spacing={1}>
              {view === 'children'
                ? childrenList.map((user) => <ChildItem key={user.id} user={user} />)
                : parentsList.map((parent) => <ParentItem key={parent.id} parent={parent} />)}
            </Stack>
          </Scrollbar>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Fermer
          </Button>
          <Button
            onClick={handleNotifyAll}
            color="primary"
            startIcon={<FontAwesome icon={faBell} />}
          >
            {view === 'children' ? 'Notifier tous' : 'Contacter tous'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

type ChildItemProps = {
  user: ChildUser;
};

function ChildItem({ user }: ChildItemProps) {
  const { name, level, lastLogin, engagementDrop, avatarUrl } = user;

  const handleNotify = () => {
    // Implémentation à ajouter pour notifier un utilisateur spécifique
    alert(`Notification envoyée à ${name}`);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        py: 2,
        px: 3,
        transition: 'background-color 0.3s ease',
        '&:hover': { bgcolor: 'background.neutral' },
        '&:not(:last-of-type)': {
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        },
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
          <Chip
            label={level}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.75rem',
              color: 'text.secondary',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            • Dernière connexion {fToNow(lastLogin)}
          </Typography>
        </Stack>
      </Box>

      <Chip label={`-${engagementDrop}%`} size="small" color="error" sx={{ borderRadius: 1 }} />

      <Tooltip title="Envoyer une notification">
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<FontAwesome icon={faBell} />}
          onClick={handleNotify}
        >
          Notifier
        </Button>
      </Tooltip>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type ParentItemProps = {
  parent: ParentUser;
};

function ParentItem({ parent }: ParentItemProps) {
  const { name, childLevel, lastLogin, missedUpdates, avatarUrl } = parent;

  const handleContact = () => {
    // Implémentation à ajouter pour contacter un parent spécifique
    alert(`Message envoyé à ${name}`);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        py: 2,
        px: 3,
        transition: 'background-color 0.3s ease',
        '&:hover': { bgcolor: 'background.neutral' },
        '&:not(:last-of-type)': {
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        },
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
          <Chip
            label={`Parent ${childLevel}`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.75rem',
              color: 'text.secondary',
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            • Dernière connexion {fToNow(lastLogin)}
          </Typography>
        </Stack>
      </Box>

      <Chip
        label={`${missedUpdates} mises à jour manquées`}
        size="small"
        color="warning"
        sx={{ borderRadius: 1 }}
      />

      <Tooltip title="Envoyer un rappel">
        <Button size="small" variant="outlined" color="primary" onClick={handleContact}>
          Contacter
        </Button>
      </Tooltip>
    </Stack>
  );
}
