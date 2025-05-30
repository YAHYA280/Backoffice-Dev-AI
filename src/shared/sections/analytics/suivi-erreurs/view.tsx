'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import {
  errorManagementData,
  successRateChartData,
  pedagogicalRecommendations,
  exercisesWithHighFailureRate
} from 'src/shared/_mock/_suivi-erreurs';

import { SuiviErreursFilters } from './components/suivi-erreurs-filters';
import { ErrorManagementOverview } from './components/suivi-erreurs-overview';
import { SuiviErreursExercisesTable } from './components/suivi-erreurs-table';
import { SuiviErreursSuccessChart } from './components/suivi-erreurs-success-chart';
import { SuiviErreursRecommendations } from './components/suivi-erreurs-recommendations';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function SuiviErreursView({ title = 'Suivi des erreurs' }: Props) {
  const handleFilterChange = (filters: any) => {
    
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Vue d&apos;ensemble sur les performances des étudiants et l&apos;identification des exercices et concepts difficiles
        </Typography>
      </Box>

      <Card sx={{ mb: 5 }}>
        <CardContent>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ mb: { xs: 2, md: 0 } }}>
              Vue d&apos;ensemble
            </Typography>
            <Box sx={{ width: { xs: '100%', md: '70%' } }}>
              <SuiviErreursFilters onFilterChange={handleFilterChange} />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Overview Cards */}
          <Box sx={{ p: 1 }}>
            <ErrorManagementOverview data={errorManagementData} />
          </Box>
        </CardContent>
      </Card>

      {/* Exercises Table */}
      <SuiviErreursExercisesTable tableData={exercisesWithHighFailureRate} sx={{ mb: 5 }} />

      {/* Success Rate Chart */}
      <SuiviErreursSuccessChart chartData={successRateChartData} sx={{ mb: 5 }} />

      {/* Recommendations */}
      <SuiviErreursRecommendations data={pedagogicalRecommendations} />
    </DashboardContent>
  );
}