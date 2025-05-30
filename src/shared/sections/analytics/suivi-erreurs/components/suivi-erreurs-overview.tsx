import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

import ConditionalComponent from 'src/shared/components/conditional-component/ConditionalComponent';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: {
    label: string;
    value: number | string;
    description: string;
    trend: {
      value: number;
      isPositive: boolean;
    } | null;
    icon: string;
  }[];
};

export function ErrorManagementOverview({ title, subheader, data, ...other }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        flexWrap: 'wrap',
        gap: 2,
      }}
      {...other}
    >
      {data.map((item) => (
        <Item key={item.label} item={item} />
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  item: Props['data'][number];
};

function Item({ item }: ItemProps) {
  const getIcon = () => {
    switch (item.icon) {
      case 'error':
        return <ErrorOutlineIcon sx={{ color: '#FF4842', fontSize: 24 }} />;
      case 'exercise':
        return <AssignmentLateIcon sx={{ color: '#FF4842', fontSize: 24 }} />;
      case 'concept':
        return <PsychologyIcon sx={{ color: '#FF4842', fontSize: 24 }} />;
      case 'student':
        return <PeopleIcon sx={{ color: '#FF4842', fontSize: 24 }} />;
      default:
        return <ErrorOutlineIcon sx={{ color: '#FF4842', fontSize: 24 }} />;
    }
  };

  const getBackgroundColor = () => {
    switch (item.icon) {
      case 'error':
        return '#FFECEB';
      case 'exercise':
        return '#FFECEB';
      case 'concept':
        return '#FFECEB';
      case 'student':
        return '#FFECEB';
      default:
        return '#FFECEB';
    }
  };

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
        <Box
          sx={{
            p: 1,
            borderRadius: '50%',
            bgcolor: getBackgroundColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getIcon()}
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h3" sx={{ mr: 1 }}>
          {item.value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', alignSelf: 'flex-end', mb: 0.5 }}>
          {item.description}
        </Typography>
      </Box>

      <ConditionalComponent isValid={!!item.trend}>
        <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
          {item.trend?.isPositive ? (
            <ArrowDropDownIcon sx={{ color: 'success.main' }} />
          ) : (
            <ArrowDropUpIcon sx={{ color: 'error.main' }} />
          )}
          <Typography
            variant="caption"
            sx={{
              color: item.trend?.isPositive ? 'success.main' : 'error.main',
            }}
          >
            {item.trend?.value}% par rapport au mois dernier
          </Typography>
        </Stack>
      </ConditionalComponent>
    </Card>
  );
}