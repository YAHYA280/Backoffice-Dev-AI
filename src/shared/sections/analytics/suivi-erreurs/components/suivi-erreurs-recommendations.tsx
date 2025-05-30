import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Stack, IconButton } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { Scrollbar } from 'src/shared/components/scrollbar';

// ----------------------------------------------------------------------

type RecommendationData = {
  id: string;
  title: string;
  description: string;
  percentage: number;
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  data: RecommendationData[];
};

export function SuiviErreursRecommendations({
  title = 'Recommandations pédagogiques',
  subheader,
  data,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        sx={{ mb: 2 }}
        action={
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              startIcon={<FileDownloadIcon />}
              sx={{ mr: 1 }}
            >
              Exporter
            </Button>
            <IconButton size="small">
              <FilterListIcon />
            </IconButton>
          </Stack>
        }
      />

      <Scrollbar sx={{ maxHeight: 'auto' }}>
        <Box sx={{ p: 3, pt: 0 }}>
          {data.map((item) => (
            <RecommendationItem key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = {
  item: RecommendationData;
};

function RecommendationItem({ item }: ItemProps) {
  return (
    <Card 
      sx={{ 
        mb: 2, 
        p: 3, 
        boxShadow: 0,
        bgcolor: 'background.neutral',
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
          }}
        >
          <LightbulbIcon />
        </Avatar>
        
        <Box sx={{ width: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {item.title}
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {item.description}
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              size="small" 
              color="primary"
            >
              Voir détails
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              color="primary"
            >
              Proposer contenu
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}