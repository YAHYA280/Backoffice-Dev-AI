// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/ContentStep.tsx

'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faFilePdf,
  faFileVideo,
  faFileImage,
  faLink,
  faFileAudio,
  faUpload,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  List,
  Stack,
  Button,
  Dialog,
  Select,
  useTheme,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  ListItem,
  FormControl,
  DialogTitle,
  ListItemText,
  ListItemIcon,
  DialogContent,
  DialogActions,
  ListItemButton,
} from '@mui/material';

import { Editor } from 'src/shared/components/editor';
import type { CreationFormData, ExerciseResource } from '../../../types';

interface ContentStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const ContentStep: React.FC<ContentStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    type: 'pdf' as const,
    name: '',
    url: '',
    description: '',
  });

  const resourceTypes = [
    { value: 'pdf', label: 'PDF', icon: faFilePdf, color: '#d32f2f' },
    { value: 'video', label: 'Vidéo', icon: faFileVideo, color: '#1976d2' },
    { value: 'audio', label: 'Audio', icon: faFileAudio, color: '#7b1fa2' },
    { value: 'image', label: 'Image', icon: faFileImage, color: '#388e3c' },
    { value: 'link', label: 'Lien web', icon: faLink, color: '#f57c00' },
  ];

  const handleContentChange = (newContent: string) => {
    onChange({ content: newContent });
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

  const getResourceIcon = (type: string) => {
    const resourceType = resourceTypes.find((rt) => rt.value === type);
    return resourceType ? resourceType.icon : faLink;
  };

  const getResourceColor = (type: string) => {
    const resourceType = resourceTypes.find((rt) => rt.value === type);
    return resourceType ? resourceType.color : theme.palette.grey[600];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box sx={{ p: 4 }}>
      <m.div variants={containerVariants} initial="hidden" animate="visible">
        {/* En-tête */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Contenu pédagogique
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Rédigez le contenu de votre exercice et ajoutez des ressources
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Éditeur de contenu */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                sx={{
                  overflow: 'hidden',
                  border: errors.content
                    ? `2px solid ${theme.palette.error.main}`
                    : `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.grey[50],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    📝 Contenu de l'exercice
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => setPreviewMode(!previewMode)}
                    sx={{ minWidth: 120 }}
                  >
                    {previewMode ? 'Éditer' : 'Aperçu'}
                  </Button>
                </Box>

                <Box sx={{ minHeight: 400 }}>
                  {previewMode ? (
                    <Box
                      sx={{ p: 3 }}
                      dangerouslySetInnerHTML={{
                        __html: data.content || '<p>Aucun contenu à afficher</p>',
                      }}
                    />
                  ) : (
                    <Editor
                      value={data.content || ''}
                      onChange={handleContentChange}
                      placeholder="Rédigez ici le contenu pédagogique de votre exercice..."
                      error={!!errors.content}
                      helperText={errors.content}
                      fullItem
                      sx={{ border: 'none' }}
                    />
                  )}
                </Box>

                {errors.content && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.error.lighter,
                      borderTop: `1px solid ${theme.palette.error.light}`,
                    }}
                  >
                    <Typography variant="body2" color="error.main">
                      {errors.content}
                    </Typography>
                  </Box>
                )}
              </Card>
            </m.div>
          </Grid>

          {/* Ressources pédagogiques */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.primary.lighter,
                    borderBottom: `1px solid ${theme.palette.primary.light}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    📎 Ressources pédagogiques ({(data.resources || []).length})
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={() => setOpenResourceDialog(true)}
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
                      <FontAwesomeIcon
                        icon={faUpload}
                        style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}
                      />
                      <Typography variant="body1" gutterBottom>
                        Aucune ressource ajoutée
                      </Typography>
                      <Typography variant="body2">
                        Ajoutez des documents, vidéos ou liens pour enrichir votre exercice
                      </Typography>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {(data.resources || []).map((resource, index) => (
                        <ListItem
                          key={resource.id}
                          component={m.div}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          sx={{
                            borderBottom:
                              index < (data.resources || []).length - 1
                                ? `1px solid ${theme.palette.divider}`
                                : 'none',
                          }}
                        >
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: `${getResourceColor(resource.type)}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getResourceColor(resource.type),
                              }}
                            >
                              <FontAwesomeIcon icon={getResourceIcon(resource.type)} />
                            </Box>
                          </ListItemIcon>

                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" fontWeight="medium">
                                {resource.name}
                              </Typography>
                            }
                            secondary={
                              <Stack spacing={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                  {resourceTypes.find((rt) => rt.value === resource.type)?.label}
                                </Typography>
                                {resource.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {resource.description}
                                  </Typography>
                                )}
                              </Stack>
                            }
                          />

                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveResource(resource.id)}
                            sx={{ minWidth: 40, p: 1 }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Card>
            </m.div>
          </Grid>
        </Grid>
      </m.div>

      {/* Dialog d'ajout de ressource */}
      <Dialog
        open={openResourceDialog}
        onClose={() => setOpenResourceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Ajouter une ressource
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
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
                {resourceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <FontAwesomeIcon icon={type.icon} style={{ color: type.color }} />
                      <Typography>{type.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenResourceDialog(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleAddResource}
            variant="contained"
            disabled={!resourceForm.name || !resourceForm.url}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentStep;
