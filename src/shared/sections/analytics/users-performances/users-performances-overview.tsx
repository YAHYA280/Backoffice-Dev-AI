import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import LinearProgress from '@mui/material/LinearProgress';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { varAlpha } from 'src/shared/theme/styles';

import ConditionalComponent from 'src/shared/components/conditional-component/ConditionalComponent';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: {
    label: string;
    value: number;
    totalValue: string;
    additionalInfo?: string | null;
    trend?: string | null;
    icon: string;
  }[];
};

export function UsersPerformancesOverview({ title, subheader, data, ...other }: Props) {
  return (
    <Card {...other}>
      <ConditionalComponent isValid={!!title}>
        <CardHeader title={title} subheader={subheader} />
      </ConditionalComponent>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: 'wrap',
          gap: 2,
          p: 3,
        }}
      >
        {data.map((progress) => (
          <Item key={progress.label} progress={progress} />
        ))}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  progress: Props['data'][number];
};

function Item({ progress }: ItemProps) {
  const getIcon = () => {
    switch (progress.icon) {
      case 'user':
        return <PersonIcon sx={{ color: '#5B8AF5', fontSize: 24 }} />;
      case 'chart':
        return <ShowChartIcon sx={{ color: '#31A76C', fontSize: 24 }} />;
      case 'group':
        return <GroupIcon sx={{ color: '#5B8AF5', fontSize: 24 }} />;
      case 'award':
        return <EmojiEventsIcon sx={{ color: '#FFB547', fontSize: 24 }} />;
      default:
        return <PersonIcon sx={{ color: '#5B8AF5', fontSize: 24 }} />;
    }
  };

  const getProgressColor = () => {
    switch (progress.icon) {
      case 'user':
        return 'primary';
      case 'chart':
        return 'success';
      case 'group':
        return 'primary';
      case 'award':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getBackgroundColor = () => {
    switch (progress.icon) {
      case 'user':
        return '#ECF2FF';
      case 'chart':
        return '#E8F7F0';
      case 'group':
        return '#ECF2FF';
      case 'award':
        return '#FFF8E7';
      default:
        return '#ECF2FF';
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
          {progress.label}
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

      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h3">{progress.totalValue}</Typography>

        <ConditionalComponent isValid={!!progress.additionalInfo}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {progress.additionalInfo}
          </Typography>
        </ConditionalComponent>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={getProgressColor()}
        sx={{
          height: 6,
          mt: 2,
          mb: 1,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.12),
          borderRadius: 1,
        }}
      />
    </Card>
  );
}
