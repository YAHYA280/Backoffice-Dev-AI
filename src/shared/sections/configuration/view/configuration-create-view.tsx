'use client';

import type { Dayjs } from 'dayjs';
import type { ICGUCard } from 'src/contexts/types/configuration';

import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, alpha, Stack, Paper, Avatar, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { LocalizationProvider } from 'src/shared/locales';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { toast } from 'src/shared/components/snackbar';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
// ----------------------------------------------------------------------
interface ConfigurationCreateViewProps {
  addCGU?: (newCGU: ICGUCard) => void;
}

export function ConfigurationCreateView({ addCGU }: ConfigurationCreateViewProps) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('');
  const [publishDate, setPublishDate] = useState<Dayjs | null>(dayjs());
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
  const [active, setActive] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState<File | string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add this function for handling file upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAuthorAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submit
  const handleSubmit = () => {
    if (title && description && content && version && publishDate && authorName) {
      const newCGU: ICGUCard = {
        id: String(Math.floor(Math.random() * 1000000)),
        title,
        description,
        content,
        version,
        publishDate: publishDate ? publishDate.toISOString() : null,
        expirationDate: expirationDate ? expirationDate.toISOString() : null,
        active,
        author: {
          name: authorName,
          avatarUrl: authorAvatar || undefined,
        },
        lastModifiedAt: new Date().toISOString(),
      };

      const promise = new Promise((resolve) => setTimeout(resolve, 1000));

      toast.promise(promise, {
        loading: 'Chargement...',
        success: 'Ajout du texte légal avec succès!',
        error: "Échec de l'ajout du texte légal!",
      });

      if (addCGU) {
        addCGU(newCGU);
      }

      // Navigate back to the list view
      router.push(paths.dashboard.configuration.root);
    }
  };

  const handleCancel = () => {
    router.push(paths.dashboard.configuration.root);
  };

  const isFormValid = title && description && content && version && publishDate && authorName;

  return (
    <DashboardContent>
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Ajouter un texte légal"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Configuration', href: paths.dashboard.configuration.root },
            { name: 'Textes légaux', href: paths.dashboard.configuration.root },
            { name: 'Ajouter un texte légal' },
          ]}
          sx={{ mb: 3 }}
        />

        <Paper
          elevation={0}
          sx={{
            py: '20px',
            px: '20px',
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: (theme) => `0 0 24px 0 ${alpha(theme.palette.primary.dark, 0.08)}`,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          <Typography sx={{ mb: 2, color: 'text.secondary', fontWeight: 500, textAlign: 'center' }}>
            Veuillez renseigner les détails du texte légal que vous souhaitez ajouter.
          </Typography>

          {/* Form Container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Inner Form Container with limited width */}
            <Box sx={{ width: '100%', maxWidth: '600px' }}>
              {/* Title */}
              <TextField
                autoFocus
                fullWidth
                type="text"
                margin="dense"
                variant="outlined"
                label="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={textFieldStyle}
                size="small"
              />

              {/* Version */}
              <TextField
                fullWidth
                type="text"
                margin="dense"
                variant="outlined"
                label="Version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                sx={textFieldStyle}
                size="small"
              />

              {/* Description */}
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                label="Description"
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={textFieldStyle}
                size="small"
              />

              {/* Content */}
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                label="Contenu"
                multiline
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={textFieldStyle}
                size="small"
              />

              {/* Author Name */}
              <TextField
                fullWidth
                type="text"
                margin="dense"
                variant="outlined"
                label="Nom de l'auteur"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                sx={textFieldStyle}
                size="small"
              />

              {/* Author Avatar (File Upload) */}
              <Box
                sx={{
                  mt: 1,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  src={avatarPreview || ''}
                  alt={authorName}
                  sx={{
                    width: 48,
                    height: 48,
                    boxShadow: (theme) => `0 2px 8px 0 ${alpha(theme.palette.common.black, 0.08)}`,
                  }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Avatar de l&apos;auteur (optionnel)
                  </Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: (theme) => alpha(theme.palette.divider, 0.5),
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                    size="small"
                  >
                    Télécharger une image
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarUpload}
                    />
                  </Button>
                </Box>
              </Box>

              {/* Date Pickers */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 1,
                  mb: 1,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <LocalizationProvider>
                  <DatePicker
                    label="Date de publication"
                    value={publishDate}
                    onChange={(newValue) => setPublishDate(newValue)}
                    format="DD/MM/YYYY"
                    sx={{
                      width: '100%',
                      ...textFieldStyle,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'dense',
                        size: 'small',
                      },
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider>
                  <DatePicker
                    label="Date d'expiration (optionnel)"
                    value={expirationDate}
                    onChange={(newValue) => setExpirationDate(newValue)}
                    format="DD/MM/YYYY"
                    sx={{
                      width: '100%',
                      ...textFieldStyle,
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'dense',
                        size: 'small',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              {/* Active Status */}
              <Box sx={{ mt: 1, mb: 2, ml: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label="Publié"
                />
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="right" sx={{ mt: 2 }}>
                <Button
                  onClick={handleCancel}
                  variant="outlined"
                  color="inherit"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    borderColor: (theme) => alpha(theme.palette.divider, 0.5),
                    '&:hover': {
                      borderColor: 'divider',
                      bgcolor: (theme) => alpha(theme.palette.divider, 0.08),
                    },
                  }}
                  size="small"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={!isFormValid}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'primary.contrastText',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                  size="small"
                >
                  Enregistrer
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>
    </DashboardContent>
  );
}

// Reusable text field style
const textFieldStyle = {
  mt: 1,
  mb: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: 'primary.main',
      fontWeight: 600,
    },
  },
};
