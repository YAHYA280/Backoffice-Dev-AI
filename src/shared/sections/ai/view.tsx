'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/shared/layouts/dashboard';

// Import des composants pour chaque vue
import SatisfactionRateView from 'src/shared/sections/ai/dashboard/taux/view';
import AIPerformanceView from 'src/shared/sections/ai/dashboard/performance/view';
import CorrectionDashboard from 'src/shared/sections/ai/dashboard/correction/view';
// ----------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `ai-tab-${index}`,
    'aria-controls': `ai-tabpanel-${index}`,
  };
}

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export default function AIDashboardView({ title = 'Tableau de bord AI' }: Props) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>{title}</Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="AI dashboard tabs"
            sx={{ px: 2, pt: 2 }}
          >
            <Tab label="Évaluation du Taux de Satisfaction" {...a11yProps(0)} />
            <Tab label="Corrections et Réentraînement des Modèles IA" {...a11yProps(1)} />
            <Tab label="Performance des Assistants" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <SatisfactionRateView />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CorrectionDashboard />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <AIPerformanceView />
        </TabPanel>
      </Paper>
    </DashboardContent>
  );
}