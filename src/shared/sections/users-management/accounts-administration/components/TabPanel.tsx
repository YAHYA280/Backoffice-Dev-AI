import React from 'react';

import Box from '@mui/material/Box';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <ConditionalComponent isValid={value === index}>
        <Box sx={{ pt: 3 }}>{children}</Box>{' '}
      </ConditionalComponent>
    </div>
  );
};

export default TabPanel;
