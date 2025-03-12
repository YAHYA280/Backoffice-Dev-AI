import { useState, useCallback } from 'react';

import { MultiFilePreview } from 'src/shared/components/upload';

// ----------------------------------------------------------------------

type Props = {
  attachments: string[];
};

export function KanbanDetailsAttachments({ attachments }: Props) {
  const [files, setFiles] = useState<(File | string)[]>(attachments);

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
    />
  );
}
