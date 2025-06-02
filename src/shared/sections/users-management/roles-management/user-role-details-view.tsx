import {
  getPermissionTypeLabelByValue,
  getSubModuleLabelByValue,
  type IRoleItem,
} from 'src/contexts/types/role';

import { m } from 'framer-motion';
import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { varFade } from 'src/shared/components/animate/variants/fade';
import ConditionalComponent from 'src/shared/components/conditional-component/ConditionalComponent';

// Structure regroupée pour l'affichage
interface GroupedPermission {
  subModule: string;
  permissionType: string[];
}

type UserRoleDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
  role: IRoleItem | null;
};

export function UserRoleDetailsDrawer({ open, onClose, role }: UserRoleDetailsDrawerProps) {
  const theme = useTheme();
  const [visibleCount, setVisibleCount] = useState(5);

  // Regrouper les permissions par sous-module
  const groupedPermissions = useMemo(() => {
    if (!role?.permissions || !role.permissions.length) return [];

    const moduleMap = new Map<string, string[]>();

    role.permissions.forEach((permission) => {
      if (!moduleMap.has(permission.subModule)) {
        moduleMap.set(permission.subModule, []);
      }
      moduleMap.get(permission.subModule)?.push(permission.permissionType);
    });

    return Array.from(moduleMap).map(([subModule, permissionType]) => ({
      subModule,
      permissionType,
    })) as GroupedPermission[];
  }, [role?.permissions]);

  if (!role) return null;

  // Format date if available
  const formattedDate = role.createdAt
    ? new Date(role.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Non définie';

  // Handler to load 5 more modules
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const totalModules = groupedPermissions.length || 0;
  const visibleModules = groupedPermissions.slice(0, visibleCount);

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
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.8)} 0%, ${alpha(
            theme.palette.primary.main,
            0.8
          )} 100%)`,
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
              Détails sur le rôle
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={role.name}
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
        {/* Description of the role */}
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
            Description du rôle
          </Typography>
          <Typography variant="body2">
            {role.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

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
                      Nom du rôle
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {role.name}
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

        {/* Modules and Permissions in an Accordion style */}
        <Box
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          sx={{ mb: 3, mt: 3 }}
        >
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Modules et Permissions
          </Typography>

          <ConditionalComponent isValid={groupedPermissions.length > 0}>
            <>
              {/* Display only the first 'visibleCount' modules */}
              {visibleModules.map((moduleItem, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {getSubModuleLabelByValue(moduleItem.subModule) ?? 'Sous-module inconnue'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {moduleItem.permissionType.map((permission, idx) => (
                        <Chip
                          key={idx}
                          label={getPermissionTypeLabelByValue(permission) ?? 'Permission inconnue'}
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
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* "Show more" button if not all modules are displayed */}
              {visibleCount < totalModules && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="outlined" onClick={handleShowMore} sx={{ borderRadius: 2 }}>
                    Voir plus
                  </Button>
                </Box>
              )}
            </>
          </ConditionalComponent>
        </Box>
      </Box>
    </Drawer>
  );
}
