import type { UploadProps } from 'src/shared/components/upload';

import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

import { varAlpha } from 'src/shared/theme/styles';

import { UploadPlaceholder } from 'src/shared/components/upload/components/placeholder';
import { DeleteButton, RejectionFiles, SingleFilePreview } from 'src/shared/components/upload';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { MultiFilePreview } from './preview-multi-file';

// ----------------------------------------------------------------------

export function Upload({
  sx,
  value,
  error,
  disabled,
  onDelete,
  onUpload,
  onRemove,
  thumbnail,
  helperText,
  onRemoveAll,
  multiple = false,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const isArray = Array.isArray(value) && multiple;

  const hasFile = !isArray && !!value;

  const hasFiles = isArray && !!value.length;

  const hasError = isDragReject || !!error;

  const renderMultiPreview = hasFiles ? (
    <>
      <MultiFilePreview files={value} thumbnail={thumbnail} onRemove={onRemove} sx={{ my: 3 }} />

      <ConditionalComponent isValid={!!(onRemoveAll || onUpload)}>
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <ConditionalComponent isValid={!!onRemove}>
            <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
              Supprimer tout
            </Button>
          </ConditionalComponent>

          <ConditionalComponent isValid={!!onUpload}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={onUpload}
              startIcon={<FontAwesomeIcon icon={faCloudUploadAlt} />}
            >
              Uploader
            </Button>
          </ConditionalComponent>
        </Stack>
      </ConditionalComponent>
    </>
  ) : (
    <> </>
  );

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          border: (theme) => `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
          '&:hover': { opacity: 0.72 },
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: (theme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
          }),
          ...(hasFile && { padding: '28% 0' }),
        }}
      >
        <input {...getInputProps()} />

        {/* Single file */}
        {hasFile ? <SingleFilePreview file={value as File} /> : <UploadPlaceholder />}
      </Box>

      {/* Single file */}
      <ConditionalComponent isValid={hasFile}>
        <DeleteButton onClick={onDelete} />
      </ConditionalComponent>

      <ConditionalComponent isValid={!!helperText}>
        <FormHelperText error={!!error} sx={{ px: 2 }}>
          {helperText}
        </FormHelperText>
      </ConditionalComponent>

      <RejectionFiles files={fileRejections} />

      {/* Multi files */}
      {renderMultiPreview}
    </Box>
  );
}
