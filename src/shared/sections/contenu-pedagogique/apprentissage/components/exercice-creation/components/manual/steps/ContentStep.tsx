// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/ContentStep.tsx

'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add,
  Delete,
  Description,
  Link,
  VideoLibrary,
  Image,
  PictureAsPdf,
} from '@mui/icons-material';

import type { CreationFormData, ExerciseResource } from '../../../types/exercise-types';

interface ContentStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const RESOURCE_TYPES = [
  { value: 'pdf', label: 'PDF', icon: PictureAsPdf, color: '#d32f2f' },
  { value: 'video', label: 'Vidéo', icon: VideoLibrary, color: '#1976d2' },
  { value: 'image', label: 'Image', icon: Image, color: '#388e3c' },
  { value: 'link', label: 'Lien web', icon: Link, color: '#f57c00' },
] as const;

const ContentStep: React.FC<ContentStepProps> = ({ data, errors, onChange }) => {
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    type: 'pdf' as const,
    name: '',
    url: '',
    description: '',
  });

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
    const resourceType = RESOURCE_TYPES.find((rt) => rt.value === type);
    return resourceType ? resourceType.icon : Description;
  };

  const getResourceColor = (type: string) => {
    const resourceType = RESOURCE_TYPES.find((rt) => rt.value === type);
    return resourceType ? resourceType.color : '#666';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contenu pédagogique
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Rédigez le contenu de votre exercice et ajoutez des ressources
      </Typography>

      <Grid container spacing={3}>
        {/* Content Editor */}
        <Grid item xs={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                📝 Contenu de l'exercice
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={12}
                label="Contenu pédagogique"
                value={data.content || ''}
                onChange={(e) => onChange({ content: e.target.value })}
                error={!!errors.content}
                helperText={
                  errors.content || 'Rédigez ici le contenu pédagogique de votre exercice...'
                }
                placeholder="Rédigez ici le contenu pédagogique de votre exercice..."
              />
            </Box>
          </Card>
        </Grid>

        {/* Resources */}
        <Grid item xs={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.lighter',
                borderBottom: 1,
                borderColor: 'primary.light',
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
                startIcon={<Add />}
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
                  <Description sx={{ fontSize: '3rem', mb: 2, opacity: 0.3 }} />
                  <Typography variant="body1" gutterBottom>
                    Aucune ressource ajoutée
                  </Typography>
                  <Typography variant="body2">
                    Ajoutez des documents, vidéos ou liens pour enrichir votre exercice
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {(data.resources || []).map((resource, index) => {
                    const IconComponent = getResourceIcon(resource.type);
                    return (
                      <ListItem
                        key={resource.id}
                        sx={{
                          borderBottom: index < (data.resources || []).length - 1 ? 1 : 0,
                          borderColor: 'divider',
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveResource(resource.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        }
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
                            <IconComponent />
                          </Box>
                        </ListItemIcon>

                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="medium">
                              {resource.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {RESOURCE_TYPES.find((rt) => rt.value === resource.type)?.label}
                              </Typography>
                              {resource.description && (
                                <Typography variant="body2" color="text.secondary">
                                  {resource.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Resource Dialog */}
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
                          <IconComponent sx={{ color: type.color }} />
                          <Typography>{type.label}</Typography>
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
