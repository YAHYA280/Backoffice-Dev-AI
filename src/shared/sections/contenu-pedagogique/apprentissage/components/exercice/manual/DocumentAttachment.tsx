'use client';

import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudUploadAlt,
  faFile,
  faTimes,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faTrash,
  faDownload,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Tooltip,
  useTheme,
  IconButton,
  Typography,
  LinearProgress,
  DialogTitle,
  DialogContent,
  alpha,
} from '@mui/material';

import { Upload } from 'src/shared/components/upload';
import { varFade } from 'src/shared/components/animate';

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  uploadProgress?: number;
  status: 'uploading' | 'success' | 'error';
}

interface DocumentAttachmentProps {
  attachments: AttachmentFile[];
  onAdd: (files: File[]) => void;
  onRemove: (attachmentId: string) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  title?: string;
  description?: string;
}

export const DocumentAttachment = ({
  attachments,
  onAdd,
  onRemove,
  maxFiles = 10,
  maxSize = 10, // 10MB default
  acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/*',
    'video/*',
    'audio/*',
  ],
  title = 'Documents de support',
  description = 'Ajoutez des documents pour enrichir votre exercice',
}: DocumentAttachmentProps) => {
  const theme = useTheme();
  const [previewFile, setPreviewFile] = useState<AttachmentFile | null>(null);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return faFilePdf;
    if (type.includes('word') || type.includes('document')) return faFileWord;
    if (type.includes('excel') || type.includes('sheet')) return faFileExcel;
    if (type.includes('image')) return faFileImage;
    if (type.includes('video')) return faFileVideo;
    if (type.includes('audio')) return faFileAudio;
    return faFile;
  };

  const getFileColor = (type: string) => {
    if (type.includes('pdf')) return '#D32F2F';
    if (type.includes('word') || type.includes('document')) return '#2196F3';
    if (type.includes('excel') || type.includes('sheet')) return '#4CAF50';
    if (type.includes('image')) return '#FF9800';
    if (type.includes('video')) return '#9C27B0';
    if (type.includes('audio')) return '#00BCD4';
    return '#757575';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => file.size <= maxSize * 1024 * 1024);
    if (validFiles.length < acceptedFiles.length) {
      console.error('Some files exceed the maximum size limit');
    }

    if (attachments.length + validFiles.length <= maxFiles) {
      onAdd(validFiles);
    } else {
      console.error(`Maximum ${maxFiles} files allowed`);
    }
  };

  const canPreview = (type: string) => type.includes('image') || type.includes('pdf');

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      {attachments.length < maxFiles && (
        <Upload
          multiple
          accept={acceptedTypes.join(',')}
          onDrop={handleDrop}
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: alpha(theme.palette.primary.main, 0.3),
            bgcolor: alpha(theme.palette.primary.lighter, 0.08),
            transition: theme.transitions.create(['border-color', 'background-color']),
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.lighter, 0.16),
            },
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Box
              component={m.div}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                size="3x"
                style={{ color: theme.palette.primary.main }}
              />
            </Box>
            <Typography variant="subtitle1" textAlign="center">
              Glissez-déposez vos fichiers ici ou cliquez pour parcourir
            </Typography>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Formats acceptés: PDF, Word, Excel, Images, Vidéos, Audio
              <br />
              Taille max: {maxSize}MB par fichier • Max {maxFiles} fichiers
            </Typography>
          </Stack>
        </Upload>
      )}

      {attachments.length > 0 && (
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">
              Fichiers attachés ({attachments.length}/{maxFiles})
            </Typography>
            <Chip
              label={formatFileSize(attachments.reduce((sum, file) => sum + file.size, 0))}
              size="small"
              variant="outlined"
            />
          </Box>

          <AnimatePresence>
            {attachments.map((attachment) => (
              <Card
                key={attachment.id}
                component={m.div}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                sx={{
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {attachment.status === 'uploading' && (
                  <LinearProgress
                    variant="determinate"
                    value={attachment.uploadProgress || 0}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                    }}
                  />
                )}

                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(getFileColor(attachment.type), 0.1),
                      color: getFileColor(attachment.type),
                    }}
                  >
                    <FontAwesomeIcon icon={getFileIcon(attachment.type)} size="lg" />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {attachment.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(attachment.size)}
                      </Typography>
                      {attachment.status === 'success' && (
                        <Chip
                          label="Téléchargé"
                          size="small"
                          color="success"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                      {attachment.status === 'error' && (
                        <Chip
                          label="Erreur"
                          size="small"
                          color="error"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={0.5}>
                    {canPreview(attachment.type) && attachment.url && (
                      <Tooltip title="Aperçu">
                        <IconButton
                          size="small"
                          onClick={() => setPreviewFile(attachment)}
                          sx={{
                            color: 'info.main',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.info.main, 0.08),
                            },
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </IconButton>
                      </Tooltip>
                    )}

                    {attachment.url && (
                      <Tooltip title="Télécharger">
                        <IconButton
                          size="small"
                          component="a"
                          href={attachment.url}
                          download={attachment.name}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                            },
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={() => onRemove(attachment.id)}
                        disabled={attachment.status === 'uploading'}
                        sx={{
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                          },
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </AnimatePresence>
        </Stack>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onClose={() => setPreviewFile(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{previewFile?.name}</Typography>
            <IconButton onClick={() => setPreviewFile(null)}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {previewFile?.type.includes('image') && previewFile.url && (
            <Box
              component="img"
              src={previewFile.url}
              alt={previewFile.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}
          {previewFile?.type.includes('pdf') && previewFile.url && (
            <Box
              component="iframe"
              src={previewFile.url}
              sx={{
                width: '100%',
                height: '70vh',
                border: 'none',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
