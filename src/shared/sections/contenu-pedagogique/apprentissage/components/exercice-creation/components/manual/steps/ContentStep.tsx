// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/ContentStep.tsx

'use client';

import React, { useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileText,
  faPlus,
  faTrash,
  faLink,
  faVideo,
  faImage,
  faFilePdf,
  faFileAudio,
  faUpload,
  faEye,
  faEdit,
  faSave,
  faLightbulb,
  faCheckCircle,
  faExclamationTriangle,
  faMagic,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  List,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  alpha,
  useTheme,
  Tooltip,
  Divider,
  Alert,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
} from '@mui/material';

import type { CreationFormData, ExerciseResource } from '../../../types/exercise-types';

interface ContentStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const RESOURCE_TYPES = [
  {
    value: 'pdf',
    label: 'Document PDF',
    icon: faFilePdf,
    color: '#d32f2f',
    bgColor: '#ffebee',
    description: 'Cours, fiches, documents de référence',
  },
  {
    value: 'video',
    label: 'Vidéo',
    icon: faVideo,
    color: '#1976d2',
    bgColor: '#e3f2fd',
    description: 'Tutoriels, explications, démonstrations',
  },
  {
    value: 'audio',
    label: 'Audio',
    icon: faFileAudio,
    color: '#7b1fa2',
    bgColor: '#f3e5f5',
    description: 'Podcasts, enregistrements, musique',
  },
  {
    value: 'image',
    label: 'Image',
    icon: faImage,
    color: '#388e3c',
    bgColor: '#e8f5e8',
    description: 'Diagrammes, schémas, illustrations',
  },
  {
    value: 'link',
    label: 'Lien web',
    icon: faLink,
    color: '#f57c00',
    bgColor: '#fff3e0',
    description: 'Sites web, articles, ressources en ligne',
  },
] as const;

const CONTENT_TEMPLATES = [
  {
    id: 'basic',
    name: 'Structure de base',
    description: 'Template simple avec objectifs et instructions',
    content: `<h2>📚 Objectifs d'apprentissage</h2>
<p>À la fin de cet exercice, vous serez capable de :</p>
<ul>
  <li>Objectif 1</li>
  <li>Objectif 2</li>
  <li>Objectif 3</li>
</ul>

<h2>📖 Contenu pédagogique</h2>
<p>Votre contenu pédagogique ici...</p>

<h2>📝 Instructions</h2>
<p>1. Lisez attentivement le contenu</p>
<p>2. Répondez aux questions</p>
<p>3. Vérifiez vos réponses</p>`,
  },
  {
    id: 'detailed',
    name: 'Structure détaillée',
    description: 'Template complet avec prérequis et évaluation',
    content: `<h2>🎯 Prérequis</h2>
<p>Avant de commencer cet exercice, assurez-vous de maîtriser :</p>
<ul>
  <li>Prérequis 1</li>
  <li>Prérequis 2</li>
</ul>

<h2>📚 Objectifs d'apprentissage</h2>
<p>À la fin de cet exercice, vous serez capable de :</p>
<ul>
  <li>Objectif spécifique 1</li>
  <li>Objectif spécifique 2</li>
  <li>Objectif spécifique 3</li>
</ul>

<h2>📖 Contenu théorique</h2>
<p>Votre contenu théorique détaillé...</p>

<h2>💡 Exemples pratiques</h2>
<p>Exemples concrets et cas d'usage...</p>

<h2>📝 Instructions pour l'exercice</h2>
<p>1. Étudiez attentivement le contenu théorique</p>
<p>2. Analysez les exemples pratiques</p>
<p>3. Répondez aux questions dans l'ordre</p>
<p>4. Utilisez les indices si nécessaire</p>

<h2>📊 Critères d'évaluation</h2>
<p>Votre travail sera évalué sur :</p>
<ul>
  <li>Exactitude des réponses</li>
  <li>Justification des choix</li>
  <li>Qualité de l'expression</li>
</ul>`,
  },
];

const ContentStep: React.FC<ContentStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [resourceForm, setResourceForm] = useState({
    type: 'pdf' as const,
    name: '',
    url: '',
    description: '',
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate content completion
  const getContentCompletion = () => {
    const contentLength = data.content?.length || 0;
    const hasResources = (data.resources?.length || 0) > 0;

    let completion = 0;
    if (contentLength > 50) completion += 60;
    if (contentLength > 200) completion += 20;
    if (hasResources) completion += 20;

    return Math.min(completion, 100);
  };

  const contentCompletion = getContentCompletion();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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

  const handleAddResource = () => {
    if (resourceForm.name && resourceForm.url) {
      const newResource: ExerciseResource = {
        id: `resource_${Date.now()}`,
        type: resourceForm.type,
        name: resourceForm.name,
        url: resourceForm.url,
        description: resourceForm.description || undefined,
      };

      onChange({
        resources: [...(data.resources || []), newResource],
      });

      setResourceForm({
        type: 'pdf',
        name: '',
        url: '',
        description: '',
      });
      setOpenResourceDialog(false);
    }
  };

  const handleRemoveResource = (resourceId: string) => {
    onChange({
      resources: (data.resources || []).filter((r) => r.id !== resourceId),
    });
  };

  const handleTemplateSelect = (template: (typeof CONTENT_TEMPLATES)[0]) => {
    onChange({ content: template.content });
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getResourceIcon = (type: string) => {
    const resourceType = RESOURCE_TYPES.find((rt) => rt.value === type);
    return resourceType ? resourceType.icon : faFileText;
  };

  const getResourceColor = (type: string) => {
    const resourceType = RESOURCE_TYPES.find((rt) => rt.value === type);
    return resourceType ? resourceType.color : '#666';
  };

  const getResourceBgColor = (type: string) => {
    const resourceType = RESOURCE_TYPES.find((rt) => rt.value === type);
    return resourceType ? resourceType.bgColor : '#f5f5f5';
  };

  const renderContentEditor = () => (
    <Card
      variant="outlined"
      sx={{
        overflow: 'hidden',
        border: errors.content ? 2 : 1,
        borderColor: errors.content ? 'error.main' : 'divider',
        borderRadius: 3,
      }}
    >
      {/* Editor Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              width: 32,
              height: 32,
            }}
          >
            <FontAwesomeIcon icon={faFileText} />
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold">
            📝 Contenu pédagogique
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={isPreviewMode}
                onChange={(e) => setIsPreviewMode(e.target.checked)}
                size="small"
              />
            }
            label="Aperçu"
            sx={{ mr: 1 }}
          />

          <Tooltip title="Insérer un template">
            <IconButton
              size="small"
              onClick={() => setActiveTab(1)}
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: 'secondary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.secondary.main, 0.2),
                },
              }}
            >
              <FontAwesomeIcon icon={faMagic} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ px: 2, py: 1, bgcolor: alpha(theme.palette.grey[500], 0.03) }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Progression du contenu
          </Typography>
          <Typography variant="caption" fontWeight="bold" color="primary.main">
            {contentCompletion}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={contentCompletion}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
            },
          }}
        />
      </Box>

      {/* Content Area */}
      <Box sx={{ position: 'relative' }}>
        {isPreviewMode ? (
          <Box
            sx={{
              p: 3,
              minHeight: 400,
              '& h1, & h2, & h3': {
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 2,
              },
              '& h2': {
                fontSize: '1.25rem',
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 1,
                mb: 2,
              },
              '& p': {
                mb: 1.5,
                lineHeight: 1.6,
              },
              '& ul, & ol': {
                pl: 3,
                mb: 2,
              },
              '& li': {
                mb: 0.5,
              },
            }}
            dangerouslySetInnerHTML={{ __html: data.content || '<p>Aucun contenu à afficher</p>' }}
          />
        ) : (
          <TextField
            fullWidth
            multiline
            rows={15}
            value={data.content || ''}
            onChange={(e) => onChange({ content: e.target.value })}
            error={!!errors.content}
            placeholder="Rédigez ici le contenu pédagogique de votre exercice..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                p: 3,
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: 'none' },
              },
              '& .MuiInputBase-input': {
                fontSize: '1rem',
                lineHeight: 1.6,
                fontFamily: 'inherit',
              },
            }}
          />
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.grey[500], 0.03),
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {data.content?.length || 0} caractères
          {errors.content && (
            <Typography component="span" color="error.main" sx={{ ml: 1 }}>
              • {errors.content}
            </Typography>
          )}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Chip
            icon={<FontAwesomeIcon icon={faLightbulb} />}
            label="Utilisez des titres et listes pour structurer"
            size="small"
            variant="outlined"
            color="primary"
          />
        </Stack>
      </Box>
    </Card>
  );

  const renderTemplateSelector = () => (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        🎨 Templates de contenu
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Gagnez du temps avec nos structures pré-conçues
      </Typography>

      <Grid container spacing={2}>
        {CONTENT_TEMPLATES.map((template) => (
          <Grid item xs={12} md={6} key={template.id}>
            <Card
              sx={{
                p: 3,
                cursor: 'pointer',
                border: 2,
                borderColor: 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.customShadows?.z12,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
              onClick={() => handleTemplateSelect(template)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    width: 40,
                    height: 40,
                  }}
                >
                  <FontAwesomeIcon icon={faRocket} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {template.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {template.description}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                sx={{ borderRadius: 2 }}
              >
                Utiliser ce template
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          💡 <strong>Astuce :</strong> Les templates peuvent être modifiés après insertion. Ils
          servent de base pour structurer votre contenu.
        </Typography>
      </Alert>
    </Card>
  );

  const renderResourcesSection = () => (
    <Card sx={{ overflow: 'hidden', borderRadius: 3 }}>
      <Box
        sx={{
          p: 3,
          bgcolor: alpha(theme.palette.info.main, 0.05),
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.info.main,
              color: 'white',
              width: 32,
              height: 32,
            }}
          >
            <FontAwesomeIcon icon={faLink} />
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold">
            📎 Ressources pédagogiques ({(data.resources || []).length})
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setOpenResourceDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          Ajouter une ressource
        </Button>
      </Box>

      <Box sx={{ minHeight: 200 }}>
        {(data.resources || []).length === 0 ? (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: 'info.main',
              }}
            >
              <FontAwesomeIcon icon={faUpload} size="lg" />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Aucune ressource ajoutée
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Enrichissez votre exercice avec des documents, vidéos ou liens
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => setOpenResourceDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Ajouter ma première ressource
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            <AnimatePresence>
              {(data.resources || []).map((resource, index) => {
                const IconComponent = getResourceIcon(resource.type);
                const resourceConfig = RESOURCE_TYPES.find((rt) => rt.value === resource.type);

                return (
                  <m.div
                    key={resource.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      sx={{
                        borderBottom: index < (data.resources || []).length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        py: 2,
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: getResourceBgColor(resource.type),
                            color: getResourceColor(resource.type),
                          }}
                        >
                          <FontAwesomeIcon icon={IconComponent} />
                        </Avatar>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="medium">
                            {resource.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                              <Chip
                                label={resourceConfig?.label || resource.type}
                                size="small"
                                sx={{
                                  bgcolor: getResourceBgColor(resource.type),
                                  color: getResourceColor(resource.type),
                                  fontSize: '0.75rem',
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {resource.url}
                              </Typography>
                            </Stack>
                            {resource.description && (
                              <Typography variant="body2" color="text.secondary">
                                {resource.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />

                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Voir la ressource">
                          <IconButton
                            size="small"
                            href={resource.url}
                            target="_blank"
                            sx={{
                              color: theme.palette.info.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                              },
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveResource(resource.id)}
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItem>
                  </m.div>
                );
              })}
            </AnimatePresence>
          </List>
        )}
      </Box>
    </Card>
  );

  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: theme.palette.info.main,
                fontSize: '2rem',
              }}
            >
              <FontAwesomeIcon icon={faFileText} />
            </Avatar>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Contenu pédagogique
            </Typography>

            <Typography variant="h6" color="text.secondary">
              Rédigez le contenu de votre exercice et ajoutez des ressources
            </Typography>
          </Box>
        </m.div>

        {/* Tabs */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 2,
                  mx: 0.5,
                },
                '& .Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Tab
                icon={<FontAwesomeIcon icon={faEdit} />}
                label="Éditeur de contenu"
                iconPosition="start"
              />
              <Tab
                icon={<FontAwesomeIcon icon={faMagic} />}
                label="Templates"
                iconPosition="start"
              />
              <Tab
                icon={<FontAwesomeIcon icon={faLink} />}
                label="Ressources"
                iconPosition="start"
              />
            </Tabs>
          </Box>
        </m.div>

        {/* Tab Content */}
        {activeTab === 0 && <m.div variants={itemVariants}>{renderContentEditor()}</m.div>}

        {activeTab === 1 && <m.div variants={itemVariants}>{renderTemplateSelector()}</m.div>}

        {activeTab === 2 && <m.div variants={itemVariants}>{renderResourcesSection()}</m.div>}

        {/* Resource Dialog */}
        <Dialog
          open={openResourceDialog}
          onClose={() => setOpenResourceDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
              color: 'white',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Ajouter une ressource
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type de ressource</InputLabel>
                  <Select
                    value={resourceForm.type}
                    label="Type de ressource"
                    onChange={(e) =>
                      setResourceForm((prev) => ({
                        ...prev,
                        type: e.target.value as any,
                      }))
                    }
                  >
                    {RESOURCE_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: type.bgColor,
                                color: type.color,
                              }}
                            >
                              <FontAwesomeIcon icon={IconComponent} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {type.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {type.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom de la ressource"
                  value={resourceForm.name}
                  onChange={(e) =>
                    setResourceForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Ex: Cours sur les verbes du premier groupe"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL ou chemin"
                  value={resourceForm.url}
                  onChange={(e) =>
                    setResourceForm((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  placeholder="https://... ou /documents/..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description (optionnelle)"
                  value={resourceForm.description}
                  onChange={(e) =>
                    setResourceForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Décrivez brièvement cette ressource..."
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setOpenResourceDialog(false)}
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddResource}
              variant="contained"
              disabled={!resourceForm.name || !resourceForm.url}
              sx={{ borderRadius: 2 }}
            >
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            // Handle file upload logic here
            console.log('File selected:', e.target.files?.[0]);
          }}
        />
      </Box>
    </m.div>
  );
};

export default ContentStep;
