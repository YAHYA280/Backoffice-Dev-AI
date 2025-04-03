import type { CardProps } from '@mui/material/Card';

import { faB, faBell, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { fToNow } from 'src/utils/format-time';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { FontAwesome } from 'src/shared/components/fontawesome';

// ----------------------------------------------------------------------

type FilterValues = {
  level: string;
  dateRange: string;
  searchQuery: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  filters: FilterValues;
}

// Mock disengaged users data
const mockUsers = [
  {
    id: 'u1',
    name: 'Emma Dupont',
    level: 'CP',
    lastLogin: new Date('2025-03-28T10:15:00'),
    engagementDrop: 37,
    avatarUrl: '/assets/avatars/avatar_1.jpg',
  },
  {
    id: 'u2',
    name: 'Lucas Martin',
    level: 'CM1',
    lastLogin: new Date('2025-03-26T14:30:00'),
    engagementDrop: 42,
    avatarUrl: '/assets/avatars/avatar_2.jpg',
  },
  {
    id: 'u3',
    name: 'Léa Bernard',
    level: 'CM2',
    lastLogin: new Date('2025-03-25T09:45:00'),
    engagementDrop: 29,
    avatarUrl: '/assets/avatars/avatar_3.jpg',
  },
  {
    id: 'u4',
    name: 'Hugo Petit',
    level: 'CP',
    lastLogin: new Date('2025-03-23T16:20:00'),
    engagementDrop: 46,
    avatarUrl: '/assets/avatars/avatar_4.jpg',
  },
  {
    id: 'u5',
    name: 'Camille Roux',
    level: 'CM1',
    lastLogin: new Date('2025-03-20T11:10:00'),
    engagementDrop: 51,
    avatarUrl: '/assets/avatars/avatar_5.jpg',
  },
];

export default function DisengagedUsersList({ title, subheader, filters, ...other }: Props) {
  // In a real app, we would filter the list based on filters
  const filteredUsers = mockUsers.filter((user) => {
    if (filters.level !== 'all' && user.level !== filters.level) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return user.name.toLowerCase().includes(query) || user.level.toLowerCase().includes(query);
    }

    return true;
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button size="small" color="primary" endIcon={<FontAwesome icon={faBell} width={18} />}>
            Notifier tous
          </Button>
        }
      />

      <Scrollbar>
        <Stack sx={{ p: 0 }}>
          {filteredUsers.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<FontAwesome icon={faChevronRight} width={18} sx={{ ml: -0.5 }} />}
        >
          Voir tous
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type UserItemProps = {
  user: {
    id: string;
    name: string;
    level: string;
    lastLogin: Date;
    engagementDrop: number;
    avatarUrl: string;
  };
};

function UserItem({ user }: UserItemProps) {
  const { name, level, lastLogin, engagementDrop, avatarUrl } = user;

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
        >
          Notifier
        </Button>
      </Tooltip>
    </Stack>
  );
}
