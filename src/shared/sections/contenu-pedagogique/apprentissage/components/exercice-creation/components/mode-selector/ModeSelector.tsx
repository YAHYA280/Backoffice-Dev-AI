// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/mode-selector/ModeSelector.tsx

'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Dialog,
  useTheme,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { CREATION_MODES } from '../../constants/creation-constants';
import type { CreationMode } from '../../types';

interface ModeSelectorProps {
  open: boolean;
  onClose: () => void;
  onModeSelect: (mode: CreationMode) => void;
  selectedMode?: CreationMode;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({
  open,
  onClose,
  onModeSelect,
  selectedMode,
}) => {
  const theme = useTheme();
  const [hoveredMode, setHoveredMode] = useState<CreationMode | null>(null);

  const handleModeSelect = (mode: CreationMode) => {
    onModeSelect(mode);
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: theme.customShadows?.z24,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          py: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Choisir le mode de création
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Sélectionnez la méthode qui correspond le mieux à vos besoins
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <m.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {CREATION_MODES.map((mode) => (
              <Grid item xs={12} md={6} key={mode.id}>
                <m.div
                  variants={cardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredMode(mode.id as CreationMode)}
                  onHoverEnd={() => setHoveredMode(null)}
                >
                  <Card
                    onClick={() => handleModeSelect(mode.id as CreationMode)}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      border:
                        selectedMode === mode.id
                          ? `2px solid ${theme.palette.primary.main}`
                          : `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: theme.customShadows?.z16,
                      },
                    }}
                  >
                    {/* Gradient d'arrière-plan animé */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 120,
                        background: mode.gradient,
                        opacity: hoveredMode === mode.id ? 0.9 : 0.7,
                        transition: 'opacity 0.3s ease',
                      }}
                    />

                    {/* Icône principale */}
                    <Box
                      sx={{
                        position: 'relative',
                        p: 3,
                        textAlign: 'center',
                        zIndex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px',
                          color: 'white',
                          fontSize: '2rem',
                          transform: hoveredMode === mode.id ? 'scale(1.1)' : 'scale(1)',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <FontAwesomeIcon icon={mode.icon} />
                      </Box>

                      <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                        {mode.title}
                      </Typography>

                      <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" sx={{ mb: 2 }}>
                        {mode.description}
                      </Typography>

                      {/* Badge temps estimé */}
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: 2,
                          px: 2,
                          py: 0.5,
                          color: 'white',
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ marginRight: 8, fontSize: '0.9rem' }}
                        />
                        <Typography variant="caption" fontWeight="medium">
                          {mode.estimatedTime}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Liste des fonctionnalités */}
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Stack spacing={1.5}>
                        {mode.features.map((feature, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.success.main,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.7rem',
                              }}
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>

                      {/* Bouton de sélection */}
                      <Button
                        fullWidth
                        variant={selectedMode === mode.id ? 'contained' : 'outlined'}
                        sx={{
                          mt: 3,
                          py: 1.5,
                          fontWeight: 'bold',
                          textTransform: 'none',
                          borderRadius: 2,
                          ...(selectedMode !== mode.id && {
                            borderColor: mode.color,
                            color: mode.color,
                            '&:hover': {
                              backgroundColor: mode.color,
                              color: 'white',
                              borderColor: mode.color,
                            },
                          }),
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModeSelect(mode.id as CreationMode);
                        }}
                      >
                        {selectedMode === mode.id ? 'Mode sélectionné' : 'Choisir ce mode'}
                      </Button>
                    </Box>

                    {/* Indicateur de sélection */}
                    {selectedMode === mode.id && (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.success.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: theme.customShadows?.z8,
                            zIndex: 2,
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} style={{ fontSize: '0.9rem' }} />
                        </Box>
                      </m.div>
                    )}
                  </Card>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </m.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ px: 3, py: 1 }}>
          Annuler
        </Button>

        {selectedMode && (
          <Button
            onClick={() => handleModeSelect(selectedMode)}
            variant="contained"
            sx={{ px: 3, py: 1, ml: 2 }}
          >
            Continuer avec {selectedMode === 'manual' ? 'la création manuelle' : "l'IA"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModeSelector;
