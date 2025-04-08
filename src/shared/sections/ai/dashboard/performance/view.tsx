'use client';

import React, { useState } from 'react';

import { Grid } from '@mui/material';

import { DATA_AI_COMPARISON, CATEGORIES_AI_ASSISTANT } from 'src/shared/_mock/_ai';

import { AiQueryAnalysis } from './aiQueryAnalysis';
import { AssistantComparison } from './assistantComparison';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export default function AIPerformanceView({ title = 'Performance des Assistants' }: Props) {
  const generateRandomData = (length: number, min: number, max: number) =>
    Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  
  const [periode, setPeriode] = useState<'Hebdomadaire' | 'Mensuel' | 'Annuel'>('Hebdomadaire');

  const PERIOD_CATEGORIES = {
    Hebdomadaire: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    Mensuel: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    Annuel: ['2021', '2022', '2023'],
  };
  
  const chartData = {
    categories: PERIOD_CATEGORIES[periode],
    series: CATEGORIES_AI_ASSISTANT.map((category) => ({
      name: category,
      data: [
        {
          name: 'Nombre de requêtes',
          data: generateRandomData(PERIOD_CATEGORIES[periode].length, 10, 100),
        },
        {
          name: 'Temps de réponse',
          data: generateRandomData(PERIOD_CATEGORIES[periode].length, 1, 10),
        },
        {
          name: "Taux d'utilisation",
          data: generateRandomData(PERIOD_CATEGORIES[periode].length, 20, 80),
        },
      ],
    })),
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <AiQueryAnalysis
          id="demo__4"
          title="Analyse des Requêtes"
          subheader="(+43%) than last year"
          periode={periode}
          onPeriodeChange={setPeriode}
          chart={chartData}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <AssistantComparison
          title="Analyse Comparative des Assistants"
          chart={{
            series: [
              {
                name: 'Nombre de requêtes',
                categories: CATEGORIES_AI_ASSISTANT,
                data: [DATA_AI_COMPARISON['Nombre de requêtes']],
              },
              {
                name: 'Temps de réponse',
                categories: CATEGORIES_AI_ASSISTANT,
                data: [DATA_AI_COMPARISON['Temps de réponse']],
              },
              {
                name: "Taux d'utilisation",
                categories: CATEGORIES_AI_ASSISTANT,
                data: [DATA_AI_COMPARISON["Taux d'utilisation"]],
              },
            ],
          }}
        />
      </Grid>
    </Grid>
  );
}