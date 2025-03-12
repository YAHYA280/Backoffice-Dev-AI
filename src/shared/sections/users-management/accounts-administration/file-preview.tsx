'use client';

import { useState , useEffect } from 'react';

import { Box, Typography } from '@mui/material';

type FilePreviewProps = {
  file: File;
  label?: string;
};

export function FilePreview({ file, label }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState('');

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (file.type.includes('image')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  return (
    <Box sx={{ mt: 2 }}>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label} :
        </Typography>
      )}
      {file.type.includes('image') && previewUrl && (
        <img
          src={previewUrl}
          alt={file.name}
          style={{ maxWidth: 200, display: 'block', marginBottom: 8 }}
        />
      )}
      {!file.type.includes('image') && (
        <Typography variant="body2" color="text.secondary">
          Fichier uploadé : {file.name}
        </Typography>
      )}
    </Box>
  );
}
