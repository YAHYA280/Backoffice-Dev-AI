import type { ICGUCard } from 'src/contexts/types/configuration';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faArrowLeft, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Grid,
  Paper,
  alpha,
  Avatar,
  Button,
  Switch,
  Container,
  Typography,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

interface ConfigurationDetailsViewProps {
  cgu: ICGUCard;
  onDelete?: (id: string) => void;
  onUpdateActive?: (id: string, active: boolean) => void;
}

export function ConfigurationDetailsView({ cgu, onDelete, onUpdateActive }: ConfigurationDetailsViewProps) {
  const router = useRouter();

  const {
    id,
    title,
    author,
    active,
    publishDate,
    expirationDate,
    version,
    description,
    content,
    lastModifiedAt,
  } = cgu;

  const handleEdit = () => {
    router.push(paths.dashboard.configuration.edit(title));
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    router.push(paths.dashboard.configuration.root);
  };

  const handleBack = () => {
    router.push(paths.dashboard.configuration.root);
  };

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdateActive) {
      onUpdateActive(id, event.target.checked);
    }
  };

  return (
    <DashboardContent>
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Détails du texte légal"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Configuration', href: paths.dashboard.configuration.root },
            { name: 'Textes légaux', href: paths.dashboard.configuration.root },
            { name: title },
          ]}
          action={
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
              onClick={handleBack}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: (theme) => alpha(theme.palette.divider, 0.5),
              }}
              size="small"
            >
              Retour
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: (theme) => `0 0 24px 0 ${alpha(theme.palette.primary.dark, 0.08)}`,
            overflow: 'hidden',
          }}
        >
          {/* Status Banner */}
          <Box
            sx={{
              py: 1,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: active ? 'success.lighter' : 'warning.lighter',
              borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <FontAwesomeIcon 
                icon={active ? faCheckCircle : faTimesCircle} 
                fontSize="small" 
                color={active ? '#229A16' : '#B78103'} 
              />
              <Typography variant="body2" fontWeight={600} color={active ? 'success.dark' : 'warning.dark'}>
                {active ? 'Document actif' : 'Document inactif'}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={active}
                  onChange={handleToggleActive}
                  color="success"
                />
              }
              label={
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {active ? 'Activer' : 'Activer'}
                </Typography>
              }
            />
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={2}
              mb={4}
            >
              <Box>
                <Typography variant="h4" gutterBottom={false}>
                  {title}
                </Typography>
                <Chip
                  label={`Version ${version}`}
                  size="small"
                  sx={{
                    mt: 1,
                    borderRadius: 1,
                    fontWeight: 600,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                  }}
                />
              </Box>

              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<FontAwesomeIcon icon={faPen} />}
                  onClick={handleEdit}
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Modifier
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FontAwesomeIcon icon={faTrash} />}
                  onClick={handleDelete}
                  color="error"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Supprimer
                </Button>
              </Box>
            </Box>

            {/* Meta Information */}
            <Box
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <MetaInfoItem 
                    label="Date de publication"
                    value={fDate(publishDate) ?? 'Non publié'}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetaInfoItem 
                    label="Date d'expiration"
                    value={fDate(expirationDate) ?? 'Aucune'}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetaInfoItem 
                    label="Dernière modification"
                    value={fDate(lastModifiedAt) ?? 'Non disponible'}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Auteur
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={
                        typeof author.avatarUrl === 'string'
                          ? author.avatarUrl
                          : author.avatarUrl instanceof File
                            ? URL.createObjectURL(author.avatarUrl) 
                            : undefined
                      }
                      alt={author.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2">{author.name}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Description */}
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Description
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {description || 'Aucune description'}
                </Typography>
              </Paper>
            </Box>

            {/* Content */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contenu
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  maxHeight: '400px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {content || 'Aucun contenu'}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Card>
      </Container>
    </DashboardContent>
  );
}

// Helper component for metadata items
const MetaInfoItem = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);
