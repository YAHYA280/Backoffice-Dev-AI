import React, { useState } from 'react';
import { Box, Tab, Tabs, Card, Paper, Alert, Button, Snackbar, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

import { SettingsState, TabType } from '../type';
import { DEFAULT_SETTINGS } from '../data';

// Import all tab components
import { SystemTab } from '../tabs/SystemTab';
import { ProfileTab } from '../tabs/ProfileTab';
import { ActivityTab } from '../tabs/ActivityTab';
import { FrequencyTab } from '../tabs/FrequencyTab';
import { ChannelsTab } from '../tabs/ChannelsTab';

interface SettingsPanelProps {
  openSidebar: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ openSidebar }) => {
  const [activeTab, setActiveTab] = useState<TabType>('system');
  const [settings, setSettings] = useState<SettingsState>({ ...DEFAULT_SETTINGS });
  const [initialSettings] = useState<SettingsState>({ ...DEFAULT_SETTINGS });

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: TabType) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = <T extends keyof SettingsState>(
    category: T,
    field: keyof SettingsState[T],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving settings:', settings);

    setAlert({
      open: true,
      message: 'Vos préférences de notifications ont été enregistrées avec succès',
      severity: 'success',
    });
  };

  const handleCancel = () => {
    // Reset to initial settings
    setSettings({ ...initialSettings });

    setAlert({
      open: true,
      message: 'Modifications annulées',
      severity: 'info',
    });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Detect if settings have changed to enable/disable save button
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return (
    <Box>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <SettingsIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Paramètres des notifications
          </Typography>
        </Box>
        <Button variant="outlined" color="primary" onClick={openSidebar}>
          Voir les notifications
        </Button>
      </Box>

      <Card elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.neutral',
          }}
        >
          <Tab label="Système" value="system" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Profil" value="profile" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Activité" value="activity" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Fréquence" value="frequency" icon={<AccessTimeIcon />} iconPosition="start" />
          <Tab label="Canaux" value="channels" icon={<SendIcon />} iconPosition="start" />
        </Tabs>

        <Box p={3}>
          {activeTab === 'system' && (
            <SystemTab
              settings={settings.system}
              onChange={(field, value) => handleSettingChange('system', field, value)}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              settings={settings.profile}
              onChange={(field, value) => handleSettingChange('profile', field, value)}
            />
          )}
          {activeTab === 'activity' && (
            <ActivityTab
              settings={settings.activity}
              onChange={(field, value) => handleSettingChange('activity', field, value)}
            />
          )}
          {activeTab === 'frequency' && (
            <FrequencyTab
              settings={settings.frequency}
              onChange={(field, value) => handleSettingChange('frequency', field, value)}
            />
          )}
          {activeTab === 'channels' && (
            <ChannelsTab
              settings={settings.channels}
              onChange={(field, value) => handleSettingChange('channels', field, value)}
            />
          )}
        </Box>
      </Card>

      <Box display="flex" justifyContent="flex-end" gap={2} mb={4}>
        <Button variant="outlined" onClick={handleCancel} disabled={!hasChanges}>
          Annuler
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!hasChanges}>
          Enregistrer les modifications
        </Button>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
