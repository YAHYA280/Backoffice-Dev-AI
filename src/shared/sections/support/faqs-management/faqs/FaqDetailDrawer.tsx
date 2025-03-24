'use client';

import type { IFaqItem } from 'src/contexts/types/faq';

import React from 'react';
import dayjs from 'dayjs';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTags,
  faTimes,
  faInfoCircle,
  faCalendarAlt,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Stack,
  Paper,
  alpha,
  Drawer,
  Avatar,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate/variants/fade';

interface FaqDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  faq: IFaqItem;
}

export function FaqDetailDrawer({ open, onClose, faq }: FaqDetailDrawerProps) {
  const theme = useTheme();

  const createdDate = faq.datePublication 
    ? dayjs(faq.datePublication).format('DD/MM/YYYY') 
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
            '&:hover': { backgroundColor: alpha('#fff', 0.1) },
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
            <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {faq.title}
            </Typography>
          </Box>
        </Stack>
      </Box>
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
            Réponse
          </Typography>
          <Typography variant="body2">
            {faq.reponse || 'Aucune réponse disponible.'}
          </Typography>
        </Paper>
        <Box
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
        >
          <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
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
            {faq.statut ? (
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
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: 'secondary.main',
                        }}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Statut
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {faq.statut}
                    </Typography>
                  }
                />
              </ListItem>
            ):(
              <>
              </>
            )}
            {faq.categorie ? (
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
                        <FontAwesomeIcon icon={faTags} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Catégorie
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {faq.categorie}
                    </Typography>
                  }
                />
              </ListItem>
            ):(
              <>
              </>
            )}
            {faq.datePublication ? (
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
                      {createdDate}
                    </Typography>
                  }
                />
              </ListItem>
            ):(
              <>
              </>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}