import type { Level, LevelList } from 'src/types/level';

import React from 'react';
import { m } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faCode,
  faTimes,
  faClock,
  faFileAlt,
  faToggleOn,
  faCalendarAlt,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Stack,
  alpha,
  Paper,
  Drawer,
  Avatar,
  Switch,
  Tooltip,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate/variants/fade';

interface NiveauDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  niveau: LevelList;
  onViewMatieres?: () => void;
  onToggleActive?: (niveau: Level, active: boolean) => void;
}
export function fDate(date: Date | string | number, newFormat = 'dd MMMM yyyy') {
  return format(new Date(date), newFormat, { locale: fr });
}

const NiveauDetailDrawer = ({
  open,
  onClose,
  niveau,
  onViewMatieres,
  onToggleActive,
}: NiveauDetailDrawerProps) => {
  const theme = useTheme();

  const formattedDate = niveau.createdAt ? fDate(niveau.createdAt) : 'Non définie';

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onToggleActive) {
      onToggleActive(niveau, event.target.checked);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
          p: 0,
          boxShadow: theme.customShadows?.z16,
          overflowY: 'auto',
        },
      }}
    >
      {/* Header with background and icon */}
      <Box
        component={m.div}
        initial="initial"
        animate="animate"
        variants={varFade().in}
        sx={{
          p: 3,
          pb: 5,
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
          color: 'white',
        }}
      >
        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha('#fff', 0.9),
              color: 'primary.main',
              boxShadow: theme.customShadows?.z8,
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} size="lg" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              {niveau.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={niveau.code}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                }}
              />

              {niveau.active !== false ? (
                <Chip
                  label="Actif"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.7),
                    color: 'white',
                    fontWeight: 'fontWeightMedium',
                  }}
                />
              ) : (
                <Chip
                  label="Inactif"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.7),
                    color: 'white',
                    fontWeight: 'fontWeightMedium',
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ p: 3 }}>
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Description du niveau
          </Typography>
          <Typography variant="body2">
            {niveau.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

        {/* Information Cards */}
        <Stack
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          direction="row"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.info.lighter, 0.5),
            }}
          >
            <FontAwesomeIcon
              icon={faBook}
              style={{
                color: theme.palette.info.main,
                fontSize: 24,
                marginBottom: 8,
              }}
            />
            <Typography variant="h5" color="text.primary">
              {niveau.subjectsCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Matières
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.success.lighter, 0.5),
            }}
          >
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{
                color: theme.palette.success.main,
                fontSize: 24,
                marginBottom: 8,
              }}
            />
            <Typography variant="h5" color="text.primary">
              {/* {niveau.exercicesCount || 22} */}
              {0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Exercices
            </Typography>
          </Paper>
        </Stack>

        {/* Detailed Information List */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Informations détaillées
          </Typography>

          <List
            sx={{
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows?.z1,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCode} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Code
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {niveau.code}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: 'warning.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Date de création
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {formattedDate}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faToggleOn} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Statut
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box
                    sx={{
                      mt: 0.5,
                      ml: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body1">
                      {niveau.active !== false ? 'Actif' : 'Inactif'}
                    </Typography>

                    {onToggleActive && (
                      <Tooltip title={niveau.active !== false ? 'Désactiver' : 'Activer'}>
                        <Switch
                          size="small"
                          checked={niveau.active !== false}
                          onChange={handleToggleActive}
                          color="success"
                        />
                      </Tooltip>
                    )}
                  </Box>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faClock} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Dernière modification
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {niveau.updatedAt ? fDate(niveau.updatedAt) : 'Non modifié'}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NiveauDetailDrawer;
