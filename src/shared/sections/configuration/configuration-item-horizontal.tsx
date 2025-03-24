import type { ICGUCard } from 'src/contexts/types/configuration';

import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Chip, alpha, Tooltip } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { maxLine } from 'src/shared/theme/styles';

import { Label } from 'src/shared/components/label';

// ----------------------------------------------------------------------

type Props = {
  cgu: ICGUCard;
};

export function ConfigurationItemHorizontal({ cgu }: Props) {
  const theme = useTheme();

  const router = useRouter();

  const { title, author, active, publishDate, version, description, lastModifiedAt } = cgu;

  const handleViewDetails = () => {
    router.push(paths.dashboard.configuration.details(title));
  };

  const handleEdit = () => {
    router.push(paths.dashboard.configuration.edit(title));
  };

  const handleDelete = () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    toast.promise(promise, {
      loading: 'Chargement...',
      success: 'Le text légal est supprimé avec succès!',
      error: "Quelque chose s'est mal passé!",
    });
  };

  return (
    <Card sx={{ display: 'flex' }}>
      <Stack spacing={1} sx={{ p: theme.spacing(3, 3, 2, 3), width: '100%' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Label variant="soft" color={(active && 'info') || 'default'}>
            {active ? 'Publié' : 'Brouillon'}
          </Label>

          <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
            {publishDate ? fDate(publishDate) : 'Non publié'}
          </Box>
        </Box>

        <Stack spacing={1} flexGrow={1}>
          <Link
            component={RouterLink}
            href={paths.dashboard.configuration.details(title)}
            color="inherit"
            variant="subtitle2"
            sx={{ ...maxLine({ line: 2 }) }}
          >
            {title}
          </Link>

          <Typography variant="body2" sx={{ ...maxLine({ line: 2 }), color: 'text.secondary' }}>
            {description || 'Aucune description'}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Version: {version}
          </Typography>

          {/* Display the author's name in a Chip */}
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <Chip
              label={author.name}
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.grey[400],
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: 'primary.dark',
                '& .MuiChip-label': {
                  fontSize: '0.75rem',
                },
              }}
            />
          </Box>
        </Stack>

        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: '10px' }}>
          {/* Modification date */}
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Modifié le: {fDate(lastModifiedAt)}
          </Typography>

          {/* Action Buttons with tooltips */}
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Voir">
              <IconButton onClick={handleViewDetails} color="info" size="small" sx={{ p: 0.75 }}>
                <FontAwesomeIcon icon={faEye} fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Modifier">
              <IconButton onClick={handleEdit} color="primary" size="small" sx={{ p: 0.75 }}>
                <FontAwesomeIcon icon={faPen} fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Supprimer">
              <IconButton
                onClick={handleDelete}
                color="error"
                size="small"
                sx={{ p: 0.75 }}
              >
                <FontAwesomeIcon icon={faTrash} fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
