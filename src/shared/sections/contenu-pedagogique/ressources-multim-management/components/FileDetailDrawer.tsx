import type { FileDetail } from 'src/contexts/types/file';

import React from 'react';
import dayjs from 'dayjs';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faFile,
  faTimes,
  faClock,
  faFileAlt,
  faArrowsAltH,
  faCalendarAlt,
  faGraduationCap,
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

import { fData } from 'src/utils/format-number';

import { FileThumbnail } from 'src/shared/components/file-thumbnail';
import { varFade } from 'src/shared/components/animate/variants/fade';

interface FileDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  file: FileDetail;
}

export function FileDetailDrawer({ open, onClose, file }: FileDetailDrawerProps) {
  const theme = useTheme();

  const createdDate = file.createdAt 
    ? dayjs(file.createdAt).format('DD/MM/YYYY') 
    : 'Non définie';
  const modifiedDate = file.modifiedAt 
    ? dayjs(file.modifiedAt).format('DD/MM/YYYY') 
    : 'Non modifié';

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
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.light,
            0.8
          )} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
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
            <FileThumbnail file={file.type} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {file.name}
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
            Description du fichier
          </Typography>
          <Typography variant="body2">
            {file.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>
        {file.tags && file.tags.length > 0 ? (
          <Stack
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade().inUp}
            direction="row"
            flexWrap="wrap"
            rowGap={2}
            columnGap={2}
            sx={{ mb: 3 }}
          >
            {file.tags.map((tag) => (
              <Paper
                key={tag}
                elevation={0}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: theme.customShadows?.z8,
                  bgcolor: alpha(theme.palette.info.lighter, 0.5),
                }}
              >
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tag}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ):(
          <>
          </>
        )}
        <Box
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
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
            {file.niveau && (
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
                        <FontAwesomeIcon icon={faGraduationCap} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Niveau
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {file.niveau}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {file.matiere && (
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
                        <FontAwesomeIcon icon={faBook} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Matière
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {file.matiere}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {file.chapitre && (
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
                        <FontAwesomeIcon icon={faFileAlt} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Chapitre
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {file.chapitre}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {file.exercice && (
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
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: 'info.main',
                        }}
                      >
                        <FontAwesomeIcon icon={faFileAlt} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Exercice
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {file.exercice}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {file.createdAt && (
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
            )}
            {file.modifiedAt && (
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
                      {modifiedDate}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {file.size !== undefined && (
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
                        <FontAwesomeIcon icon={faArrowsAltH} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Taille
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {fData(file.size)}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            {file.type && (
              <ListItem sx={{ py: 1.5 }}>
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
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          color: 'error.main',
                        }}
                      >
                        <FontAwesomeIcon icon={faFile} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Type
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {file.type}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}