'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faTimes,
  faSparkles,
  faHandPaper,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Stack,
  alpha,
  Dialog,
  Button,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate/variants/fade';

interface ExerciceModeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'ai' | 'manual') => void;
}

export const ExerciceModeSelector = ({
  open,
  onClose,
  onSelectMode,
}: ExerciceModeSelectorProps) => {
  const handleModeSelect = (mode: 'ai' | 'manual') => {
    onSelectMode(mode);
    // Note: onClose is called in the parent component after mode selection
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Fix: Prevent auto-close on backdrop click or escape key
        // Only allow explicit close via the close button
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible',
        },
      }}
      // Disable closing on backdrop click and escape key
      disableEscapeKeyDown
    >
      <DialogTitle
        sx={{
          position: 'relative',
          textAlign: 'center',
          pt: 5,
          pb: 3,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Typography variant="h4" component="h2" fontWeight="fontWeightBold">
          Choisir un mode de création
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Comment souhaitez-vous créer votre exercice ?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 2 }}>
          {/* AI Mode Card */}
          <Card
            component={m.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={varFade().inUp}
            sx={{
              flex: 1,
              p: 4,
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              border: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: (theme) => theme.palette.primary.main,
                boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
            }}
            onClick={() => handleModeSelect('ai')}
          >
            <Box
              component={m.div}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: (theme) => alpha(theme.palette.primary.lighter, 0.3),
              }}
            />

            <Stack spacing={3} alignItems="center" sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                <FontAwesomeIcon icon={faRobot} size="2x" />
                <FontAwesomeIcon
                  icon={faSparkles}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontSize: '0.8rem',
                  }}
                />
              </Box>

              <Typography variant="h5" fontWeight="fontWeightBold">
                Mode IA
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>
                Laissez l&apos;IA générer automatiquement les questions à partir de vos contenus et
                objectifs pédagogiques
              </Typography>

              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Choisir ce mode
              </Button>
            </Stack>
          </Card>

          {/* Manual Mode Card */}
          <Card
            component={m.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={varFade().inUp}
            sx={{
              flex: 1,
              p: 4,
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
              border: (theme) => `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: (theme) => theme.palette.info.main,
                boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.info.main, 0.2)}`,
              },
            }}
            onClick={() => handleModeSelect('manual')}
          >
            <Box
              component={m.div}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: (theme) => alpha(theme.palette.info.lighter, 0.3),
              }}
            />

            <Stack spacing={3} alignItems="center" sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                  color: 'info.main',
                }}
              >
                <FontAwesomeIcon icon={faHandPaper} size="2x" />
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    fontSize: '0.8rem',
                  }}
                />
              </Box>

              <Typography variant="h5" fontWeight="fontWeightBold">
                Mode Manuel
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>
                Créez manuellement vos questions et définissez tous les détails de votre exercice
              </Typography>

              <Button variant="contained" color="info" sx={{ mt: 2 }}>
                Choisir ce mode
              </Button>
            </Stack>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
