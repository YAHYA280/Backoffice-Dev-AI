'use client';

import type { ReactNode } from 'react';

import path from 'path';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
import { useTheme, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

interface Props {
  children: ReactNode;
}

const TABS = [
  { label: 'Carte bancaire', value: 'credit_card' },
  { label: 'Virement bancaire', value: 'bank_transfer' },
];

export default function PaymentMethodsLayout({ children }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const lastSegment = pathname?.split('/').filter(Boolean).pop() || 'paypal'; // valeur par défaut
  const [value, setValue] = useState<string>(lastSegment);

  const handleClick = (tabValue: string) => {
    const basePath = path.join(paths.dashboard.paiements.payment_configuration, '/');
    router.push(`${basePath}${tabValue}`);
    setValue(tabValue);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (Number.isNaN(Number(newValue))) {
      setValue(newValue);
    }
  };

  return (
    <TabContext value={value}>
      <Box sx={{ width: '100%', typography: 'subtitle1' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{
              '& .MuiTab-root': {
                color: 'inherit',
                '&.Mui-selected': { color: theme.palette.primary.main },
              },
              '& .MuiTabs-indicator': { backgroundColor: theme.palette.primary.main },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                onClick={() => handleClick(tab.value)}
              />
            ))}
          </TabList>
        </Box>
        <Container maxWidth="lg" sx={{ paddingY: 4 }}>
          {children}
        </Container>
      </Box>
    </TabContext>
  );
}
