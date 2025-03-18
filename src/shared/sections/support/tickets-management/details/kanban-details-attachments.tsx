import { useState, useCallback } from 'react';

import { UploadBox } from '../utils/upload-box';
import { MultiFilePreview } from '../utils/preview-multi-file';

// ----------------------------------------------------------------------

type Props = {
  attachments: string[];
};

export function KanbanDetailsAttachments({ attachments }: Props) {
  const [files, setFiles] = useState<(File | string)[]>(attachments);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = files.filter((file) => file !== inputFile);
      setFiles(filtered);
    },
    [files]
  );

  return (
    <MultiFilePreview
      thumbnail
      files={files}
      onRemove={(file) => handleRemoveFile(file)}
      slotProps={{ thumbnail: { sx: { width: 64, height: 64 } } }}
      lastNode={<UploadBox onDrop={handleDrop} />}
    />
  );
}
