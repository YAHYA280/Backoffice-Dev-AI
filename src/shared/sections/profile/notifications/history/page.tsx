'use client';

import React, { useState } from 'react';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Tab,
  Card,
  Tabs,
  Menu,
  Stack,
  Button,
  Divider,
  Checkbox,
  MenuItem,
  Container,
  TextField,
  Typography,
  Pagination,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Star as StarIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  StarBorder as StarBorderIcon,
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  NotificationsOff as NotificationsOffIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// Import des données mock
import { fToNow, MOCK_NOTIFICATIONS } from 'src/shared/_mock/MOCK_NOTIFICATIONS';

enum FilterTab {
  ALL = 'all',
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
  FAVORITES = 'favorites'  // Nouvelle valeur pour les favoris
}

export default function NotificationHistoryPage() {
  const [filter, setFilter] = useState<FilterTab>(FilterTab.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentNotificationId, setCurrentNotificationId] = useState<string | null>(null);

  // Filtrer les notifications selon l'onglet sélectionné
  const filteredNotifications = MOCK_NOTIFICATIONS.filter((notification) => {
    if (filter === FilterTab.ALL && !notification.isArchived) return true;
    if (filter === FilterTab.UNREAD) return !notification.isRead && !notification.isArchived;
    if (filter === FilterTab.READ) return notification.isRead && !notification.isArchived;
    if (filter === FilterTab.ARCHIVED) return notification.isArchived;
    if (filter === FilterTab.FAVORITES) return notification.isFavorite; // Nouveau filtre pour favoris
    return false;
  }).filter((notification) =>
    searchQuery === '' ||
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterChange = (_: React.SyntheticEvent, newValue: FilterTab) => {
    setFilter(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectNotification = (id: string) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleMarkAllAsRead = () => {
    // Implémentation à faire
    console.log('Marquer tout comme lu');
  };

  const handleDeleteSelected = () => {
    // Implémentation à faire
    console.log('Supprimer la sélection', selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentNotificationId(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentNotificationId(null);
  };

  const handleMarkAsRead = () => {
    // Implémentation à faire
    console.log('Marquer comme lu', currentNotificationId);
    handleMenuClose();
  };

  const handleMarkAsUnread = () => {
    // Implémentation à faire
    console.log('Marquer comme non lu', currentNotificationId);
    handleMenuClose();
  };

  const handleArchive = () => {
    // Implémentation à faire
    console.log('Archiver', currentNotificationId);
    handleMenuClose();
  };

  const handleDelete = () => {
    // Implémentation à faire
    console.log('Supprimer', currentNotificationId);
    handleMenuClose();
  };

  const handleToggleFavorite = () => {
    // Implémentation à faire
    console.log('Basculer favori', currentNotificationId);
    handleMenuClose();
  };

  // Fonction pour obtenir l'icône en fonction du type de notification
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <NotificationsActiveIcon color="error" />;
      case 'warning':
        return <NotificationsIcon color="warning" />;
      case 'success':
        return <NotificationsIcon color="success" />;
      default:
        return <NotificationsIcon color="info" />;
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        {/* En-tête de la page */}
        <Box mb={4}>
          <Button
            component={RouterLink}
            href={paths.dashboard.profile.notifications}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Retour aux notifications
          </Button>

          <Typography variant="h4">Liste des notifications</Typography>
        </Box>

        <Card>
          <Tabs
            value={filter}
            onChange={handleFilterChange}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            <Tab label="Tout" value={FilterTab.ALL} />
            <Tab label="Non lue" value={FilterTab.UNREAD} />
            <Tab label="Lue" value={FilterTab.READ} />
            <Tab label="Favoris" value={FilterTab.FAVORITES} />  {/* Nouvel onglet */}
            <Tab label="Archivée" value={FilterTab.ARCHIVED} />
          </Tabs>

          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Rechercher des notifications..."
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.disabled', mr: 1 }} />,
              }}
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ flexGrow: 1, maxWidth: 500 }}
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<MarkEmailReadIcon />}
                onClick={handleMarkAllAsRead}
                disabled={filteredNotifications.length === 0}
              >
                Tout marquer comme lu
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteSelected}
                disabled={selectedNotifications.length === 0}
              >
                Supprimer la sélection
              </Button>
            </Stack>
          </Box>

          <Divider />

          {filteredNotifications.length > 0 ? (
            <>
              {/* Conteneur avec défilement */}
              <Box
                sx={{
                  maxHeight: '500px', // Hauteur maximale du conteneur
                  overflow: 'auto',   // Active le défilement si nécessaire
                  p: 1
                }}
              >
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    sx={{
                      p: 2,
                      m: 1,
                      bgcolor: notification.isRead ? 'background.paper' : alpha('#4caf50', 0.08),
                      borderLeft: notification.isRead ? '4px solid transparent' : '4px solid #4caf50',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                        sx={{ mr: 1, mt: -0.5 }}
                      />

                      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getNotificationIcon(notification.type)}
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {notification.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {notification.description}
                        </Typography>

                        <Typography variant="caption" color="text.disabled">
                          {fToNow(notification.createdAt)}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, notification.id)}
                        sx={{ ml: 1 }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                ))}
              </Box>

              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Pagination count={Math.ceil(MOCK_NOTIFICATIONS.length / 5)} color="primary" />
              </Box>
            </>
          ) : (
            <Box sx={{ py: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <NotificationsOffIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucune notification trouvée
              </Typography>
            </Box>
          )}
        </Card>
      </Container>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMarkAsRead}>
          <ListItemIcon>
            <MarkEmailReadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Marquer comme lu</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMarkAsUnread}>
          <ListItemIcon>
            <MarkEmailUnreadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Marquer comme non lu</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleToggleFavorite}>
          <ListItemIcon>
            {MOCK_NOTIFICATIONS.find(notif => notif.id === currentNotificationId)?.isFavorite ?
              <StarIcon fontSize="small" color="warning" /> :
              <StarBorderIcon fontSize="small" />
            }
          </ListItemIcon>
          <ListItemText>{MOCK_NOTIFICATIONS.find(notif => notif.id === currentNotificationId)?.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleArchive}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archiver</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
