import type { ReactNode } from 'react';
import type { CardProps } from '@mui/material/Card';

import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

type OverviewItem = {
  label: string;
  totalValue: string;
  icon: ReactNode;
};

type Props = CardProps & {
  title?: string;
  data: OverviewItem[];
  filterIcon?: ReactNode;
};

export function LogsOverview({ title, data, filterIcon, ...other }: Props) {
  const iconColors = ['#5B8AF5', '#31A76C', '#ff3333', '#FFB547'];

  return (
    <Card {...other}>
      {title ?(
        <CardHeader
          title={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Typography variant="h6" component="span">
                {title}
              </Typography>
              {filterIcon}
            </Box>
          }
        />
      ) : (
        <>
        </>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: 'wrap',
          gap: 2,
          p: 3,
        }}
      >
        {data.map((item, index) => (
          <Item key={item.label} item={item} iconColor={iconColors[index] || '#000'} />
        ))}
      </Box>
    </Card>
  );
}

type ItemProps = {
  item: OverviewItem;
  iconColor: string;
};

function Item({ item, iconColor }: ItemProps) {
  const coloredIcon = React.isValidElement(item.icon)
    ? React.cloneElement(item.icon as React.ReactElement<{ style?: React.CSSProperties }>, {
        style: { color: iconColor },
      })
    : item.icon;

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 0,
        bgcolor: 'background.neutral',
        borderRadius: 2,
        flex: '1 1 0',
        minWidth: { xs: '100%', sm: '45%', md: '22%' },
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Box sx={{ typography: 'subtitle2', flexGrow: 1, color: 'text.secondary' }}>
          {item.label}
        </Box>
        {coloredIcon}
      </Stack>

      <Typography variant="h3" sx={{ mb: 0.5 }}>
        {item.totalValue}
      </Typography>
    </Card>
  );
}
