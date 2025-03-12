import type { IRoleItem } from 'src/contexts/types/role';

import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

type RoleDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  role: IRoleItem | null;
};

export function UserRoleDetailsDialog({ open, onClose, role }: RoleDetailsDialogProps) {
  if (!role) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: (theme) => `0 16px 32px 0 ${alpha(theme.palette.primary.dark, 0.12)}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Détails sur le rôle
          </Typography>
        </Stack>
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: 'background.paper',
            boxShadow: (theme) => `0 2px 8px 0 ${alpha(theme.palette.common.black, 0.08)}`,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'background.default',
              transform: 'translateY(-2px)',
              boxShadow: (theme) => `0 4px 12px 0 ${alpha(theme.palette.common.black, 0.12)}`,
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{ p: 3, bgcolor: (theme) => alpha(theme.palette.background.default, 0.4) }}
      >
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Nom du rôle */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 12px 24px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontSize: '0.75rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 1,
                    },
                  }}
                >
                  Nom du rôle
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                    letterSpacing: 0.2,
                  }}
                >
                  {role.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Description */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 12px 24px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontSize: '0.75rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 1,
                    },
                  }}
                >
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.6,
                    minHeight: '80px',
                  }}
                >
                  {role.description || (
                    <Box
                      component="span"
                      sx={{
                        fontStyle: 'italic',
                        color: 'text.disabled',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80px',
                        border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                        borderRadius: 1,
                      }}
                    >
                      Aucune description disponible
                    </Box>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Permissions */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 12px 24px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontSize: '0.75rem',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 1,
                    },
                  }}
                >
                  Permissions
                </Typography>
                {role.permissionLevel && role.permissionLevel.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {role.permissionLevel.map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        variant="filled"
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.dark',
                          fontWeight: 600,
                          borderRadius: 1.5,
                          py: 0.5,
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                            transform: 'translateY(-2px)',
                            boxShadow: (theme) =>
                              `0 4px 8px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
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
                      border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                      borderRadius: 1,
                    }}
                  >
                    Aucune permission définie
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Date de création */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 2,
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                transition: 'all 0.3s ease-in-out',
                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 12px 24px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontSize: '0.75rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 1,
                    },
                  }}
                >
                  Date de création
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.6,
                    minHeight: '80px',
                  }}
                >
                  {role.createdAt ? (
                    new Date(role.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        fontStyle: 'italic',
                        color: 'text.disabled',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80px',
                        border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                        borderRadius: 1,
                      }}
                    >
                      Aucune date de création disponible
                    </Box>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          px: 3,
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
          borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
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
            boxShadow: (theme) => `0 4px 12px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: (theme) => `0 8px 16px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
