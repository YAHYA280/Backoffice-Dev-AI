// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/mode-selector/ModeSelector.tsx

'use client';

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCheck,
  faRobot,
  faHandPaper,
  faLightbulb,
  faClock,
  faUserGraduate,
  faWandMagicSparkles,
  faPenToSquare,
  faCog,
} from '@fortawesome/free-solid-svg-icons';

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
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useMediaQuery,
} from '@mui/material';

import type { CreationMode } from '../../types/exercise-types';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [hoveredMode, setHoveredMode] = useState<CreationMode | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const modes = [
    {
      id: 'manual' as CreationMode,
      title: 'Création manuelle',
      description: 'Contrôle total sur chaque aspect de votre exercice',
      icon: faHandPaper,
      primaryColor: theme.palette.primary.main,
      secondaryColor: theme.palette.primary.light,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      lightGradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
      features: [
        { icon: faPenToSquare, text: 'Éditeur riche et intuitif', highlight: true },
        { icon: faCog, text: 'Configuration avancée des questions' },
        { icon: faUserGraduate, text: 'Contrôle pédagogique complet' },
        { icon: faLightbulb, text: 'Ressources personnalisées' },
      ],
      estimatedTime: '15-30 min',
      difficulty: 'Contrôle expert',
      pros: ['Flexibilité maximale', 'Adaptation parfaite', 'Créativité libre'],
      bestFor: 'Enseignants expérimentés qui veulent un contrôle précis',
    },
    {
      id: 'ai' as CreationMode,
      title: 'Génération IA',
      description: "Laissez l'intelligence artificielle créer un exercice adapté",
      icon: faRobot,
      primaryColor: theme.palette.secondary.main,
      secondaryColor: theme.palette.secondary.light,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
      lightGradient: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
      features: [
        { icon: faWandMagicSparkles, text: 'Génération automatique intelligente', highlight: true },
        { icon: faClock, text: 'Création ultra-rapide' },
        { icon: faUserGraduate, text: 'Adapté au niveau pédagogique' },
        { icon: faLightbulb, text: "Suggestions d'amélioration" },
      ],
      estimatedTime: '3-5 min',
      difficulty: 'Assisté',
      pros: ['Gain de temps énorme', 'Qualité garantie', 'Inspiration IA'],
      bestFor: 'Création rapide avec assistance intelligente',
    },
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleModeSelect = (mode: CreationMode) => {
    onModeSelect(mode);
  };

  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            component: m.div,
            variants: dialogVariants,
            initial: 'hidden',
            animate: 'visible',
            exit: 'exit',
            sx: {
              borderRadius: isMobile ? 0 : 4,
              overflow: 'hidden',
              boxShadow: theme.customShadows?.z24,
              maxHeight: isMobile ? '100vh' : '90vh',
              bgcolor: 'background.paper',
            },
          }}
        >
          {/* Enhanced Header */}
          <DialogTitle
            sx={{
              textAlign: 'center',
              py: { xs: 3, md: 4 },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: `radial-gradient(circle at 20% 20%, ${theme.palette.primary.light} 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, ${theme.palette.secondary.light} 0%, transparent 50%)`,
              }}
            />

            <m.div variants={itemVariants} style={{ position: 'relative', zIndex: 1 }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, md: 16 },
                  top: { xs: 8, md: 16 },
                  color: 'white',
                  bgcolor: alpha('#fff', 0.1),
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.2),
                    transform: 'rotate(90deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  🚀 Créons votre exercice
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.95,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  Choisissez la méthode qui vous convient le mieux
                </Typography>
              </Box>

              <Chip
                label="Étape 1 sur 4"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </m.div>
          </DialogTitle>

          <DialogContent sx={{ p: { xs: 2, md: 4 }, bgcolor: 'grey.50' }}>
            <m.div variants={itemVariants}>
              <Grid container spacing={{ xs: 2, md: 4 }}>
                {modes.map((mode, index) => (
                  <Grid item xs={12} md={6} key={mode.id}>
                    <m.div
                      variants={cardVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onHoverStart={() => setHoveredMode(mode.id)}
                      onHoverEnd={() => setHoveredMode(null)}
                    >
                      <Card
                        onClick={() => handleModeSelect(mode.id)}
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          border:
                            selectedMode === mode.id
                              ? `3px solid ${mode.primaryColor}`
                              : `2px solid ${alpha(theme.palette.divider, 0.5)}`,
                          borderRadius: 3,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow:
                            hoveredMode === mode.id || selectedMode === mode.id
                              ? theme.customShadows?.z20
                              : theme.customShadows?.z8,
                          transform: selectedMode === mode.id ? 'translateY(-4px)' : 'none',
                          background:
                            selectedMode === mode.id ? mode.lightGradient : 'background.paper',
                        }}
                      >
                        {/* Selection Indicator */}
                        <AnimatePresence>
                          {selectedMode === mode.id && (
                            <m.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                zIndex: 10,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: theme.palette.success.main,
                                  color: 'white',
                                  boxShadow: theme.customShadows?.z8,
                                }}
                              >
                                <FontAwesomeIcon icon={faCheck} style={{ fontSize: '1rem' }} />
                              </Avatar>
                            </m.div>
                          )}
                        </AnimatePresence>

                        {/* Header Section */}
                        <Box
                          sx={{
                            position: 'relative',
                            background: mode.gradient,
                            color: 'white',
                            p: 3,
                            textAlign: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Background Pattern */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -50,
                              right: -50,
                              width: 120,
                              height: 120,
                              borderRadius: '50%',
                              background: alpha('#fff', 0.1),
                              transform: hoveredMode === mode.id ? 'scale(1.2)' : 'scale(1)',
                              transition: 'transform 0.3s ease',
                            }}
                          />

                          <Avatar
                            sx={{
                              width: { xs: 64, md: 80 },
                              height: { xs: 64, md: 80 },
                              bgcolor: alpha('#fff', 0.2),
                              color: 'white',
                              margin: '0 auto 16px',
                              fontSize: { xs: '1.5rem', md: '2rem' },
                              backdropFilter: 'blur(10px)',
                              border: `2px solid ${alpha('#fff', 0.3)}`,
                              transform:
                                hoveredMode === mode.id ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                          >
                            <FontAwesomeIcon icon={mode.icon} />
                          </Avatar>

                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                          >
                            {mode.title}
                          </Typography>

                          <Typography
                            variant="body1"
                            sx={{
                              opacity: 0.95,
                              mb: 2,
                              fontSize: { xs: '0.875rem', md: '1rem' },
                            }}
                          >
                            {mode.description}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Chip
                              icon={<FontAwesomeIcon icon={faClock} />}
                              label={mode.estimatedTime}
                              size="small"
                              sx={{
                                bgcolor: alpha('#fff', 0.2),
                                color: 'white',
                                fontWeight: 'medium',
                                backdropFilter: 'blur(10px)',
                              }}
                            />
                            <Chip
                              label={mode.difficulty}
                              size="small"
                              sx={{
                                bgcolor: alpha('#fff', 0.2),
                                color: 'white',
                                fontWeight: 'medium',
                                backdropFilter: 'blur(10px)',
                              }}
                            />
                          </Stack>
                        </Box>

                        {/* Features Section */}
                        <Box sx={{ p: 3 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            gutterBottom
                            color="text.primary"
                            sx={{ mb: 2 }}
                          >
                            ✨ Fonctionnalités principales
                          </Typography>

                          <List dense disablePadding>
                            {mode.features.map((feature, featureIndex) => (
                              <ListItem key={featureIndex} disablePadding sx={{ mb: 1 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Avatar
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      bgcolor: feature.highlight
                                        ? mode.primaryColor
                                        : alpha(mode.primaryColor, 0.1),
                                      color: feature.highlight ? 'white' : mode.primaryColor,
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    <FontAwesomeIcon icon={feature.icon} />
                                  </Avatar>
                                </ListItemIcon>
                                <ListItemText
                                  primary={feature.text}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    fontWeight: feature.highlight ? 'bold' : 'normal',
                                    color: feature.highlight ? mode.primaryColor : 'text.secondary',
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>

                          {/* Pros Section */}
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              bgcolor: alpha(mode.primaryColor, 0.05),
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              gutterBottom
                              sx={{ display: 'block', fontWeight: 'bold' }}
                            >
                              💡 {mode.bestFor}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {mode.pros.map((pro, proIndex) => (
                                <Chip
                                  key={proIndex}
                                  label={pro}
                                  size="small"
                                  sx={{
                                    fontSize: '0.7rem',
                                    height: 24,
                                    bgcolor: alpha(mode.primaryColor, 0.1),
                                    color: mode.primaryColor,
                                    fontWeight: 'medium',
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>

                          {/* Action Button */}
                          <Button
                            fullWidth
                            variant={selectedMode === mode.id ? 'contained' : 'outlined'}
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModeSelect(mode.id);
                            }}
                            sx={{
                              mt: 3,
                              py: 1.5,
                              fontWeight: 'bold',
                              textTransform: 'none',
                              borderRadius: 2,
                              fontSize: '1rem',
                              ...(selectedMode === mode.id
                                ? {
                                    bgcolor: mode.primaryColor,
                                    color: 'white',
                                    '&:hover': {
                                      bgcolor: mode.secondaryColor,
                                    },
                                  }
                                : {
                                    borderColor: mode.primaryColor,
                                    color: mode.primaryColor,
                                    '&:hover': {
                                      bgcolor: alpha(mode.primaryColor, 0.1),
                                      borderColor: mode.primaryColor,
                                      transform: 'translateY(-2px)',
                                    },
                                  }),
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {selectedMode === mode.id
                              ? '✅ Mode sélectionné'
                              : `🚀 Choisir ${mode.title.toLowerCase()}`}
                          </Button>
                        </Box>
                      </Card>
                    </m.div>
                  </Grid>
                ))}
              </Grid>
            </m.div>
          </DialogContent>

          <DialogActions sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper' }}>
            <m.div variants={itemVariants} style={{ width: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="inherit"
                  sx={{
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Annuler
                </Button>

                <AnimatePresence>
                  {selectedMode && (
                    <m.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        onClick={() => handleModeSelect(selectedMode)}
                        variant="contained"
                        size="large"
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontWeight: 'bold',
                          textTransform: 'none',
                          borderRadius: 2,
                          // eslint-disable-next-line @typescript-eslint/no-shadow
                          background: modes.find((m) => m.id === selectedMode)?.gradient,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.customShadows?.z16,
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Continuer avec {selectedMode === 'manual' ? 'la création manuelle' : "l'IA"}{' '}
                        →
                      </Button>
                    </m.div>
                  )}
                </AnimatePresence>
              </Stack>
            </m.div>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ModeSelector;
