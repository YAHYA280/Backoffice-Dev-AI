'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Drawer,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { SettingsPanel } from './components/SettingsPanel';
import { NotificationSidebar } from './components/NotificationSidebar';
import { MOCK_NOTIFICATIONS } from './data';

const NotificationsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Count of unread notifications for badge
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.isArchived).length;

  // Handlers for notification actions (these would typically modify state or call API)
  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id);
    // Here you would typically update your notifications state or call an API
  };

  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorite:', id);
  };

  const handleArchive = (id: string) => {
    console.log('Archive:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete:', id);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Small screen notification toggle button (fixed position) */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 100,
          }}
        >
          <IconButton
            color="primary"
            size="large"
            onClick={toggleSidebar}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 4,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Box>
      )}

      {/* Desktop layout */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        {/* Home button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          component={RouterLink}
          href={paths.dashboard.root}
          sx={{ mt: 2 }}
        >
          Retour à l&apos;accueil
        </Button>

        {/* Notification button (desktop only) */}
        {!isMobile && (
          <IconButton
            color="primary"
            onClick={toggleSidebar}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Main content */}
      <Box>
        <SettingsPanel openSidebar={toggleSidebar} />
      </Box>

      {/* Notification sidebar as drawer */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={sidebarOpen}
        onClose={closeSidebar}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : 500,
            height: isMobile ? '80%' : '100%',
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0,
          },
        }}
      >
        <NotificationSidebar
          onClose={closeSidebar}
          onMarkAsRead={handleMarkAsRead}
          onToggleFavorite={handleToggleFavorite}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      </Drawer>
    </Container>
  );
};

export default NotificationsPage;
