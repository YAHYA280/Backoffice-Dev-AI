import type { IPermission } from 'src/shared/_mock/_permission';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { varFade } from 'src/shared/components/animate/variants/fade';

type PermissionDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  permission: IPermission | null;
};

export function UserPermissionDetailsDrawer({ open, onClose, permission }: PermissionDetailsDrawerProps) {
  const theme = useTheme();

  if (!permission) return null;

  // Format date if available
  const formattedDate = permission.createdAt
    ? new Date(permission.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Non définie';

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
          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              Détails sur la permission
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={permission.name}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                }}
              />
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
            Description de la permission
          </Typography>
          <Typography variant="body2">
            {permission.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

        {/* Rôles associés */}
        <Box
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Rôles associés
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
            }}
          >
            { ( permission.roles && permission.roles.length > 0 ) ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {permission.roles.map((role, index) => (
                  <Chip
                    key={index}
                    label={role}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.dark',
                      fontWeight: 600,
                      borderRadius: 1.5,
                      py: 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 8px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 1,
                }}
              >
                Aucun rôle associé
              </Box>
            )}
          </Paper>
        </Box>

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
                      <FontAwesomeIcon icon={faCog} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Nom de la permission
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {permission.name}
                  </Typography>
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
          </List>
        </Box>

        {/* Action Button */}
        <Box
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          sx={{ mt: 4, textAlign: 'center', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.2s',
              color: 'primary.contrastText',
              backgroundColor: 'primary.main',
              boxShadow: theme.customShadows?.primary,
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Fermer
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}