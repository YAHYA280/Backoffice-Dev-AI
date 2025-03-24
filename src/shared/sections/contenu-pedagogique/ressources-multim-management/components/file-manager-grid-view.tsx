import type { IFile } from 'src/contexts/types/file';
import type { TableProps } from 'src/shared/components/table';

import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { FileManagerPanel } from './file-manager-panel';
import { FileManagerFileItem } from './file-manager-file-item';
import { FileManagerFolderItem } from './file-manager-folder-item';
import { FileManagerNewFolderDialog } from './file-manager-new-folder-dialog';

type Props = {
  table: TableProps;
  dataFiltered: IFile[];
  onOpenConfirm: () => void;
  onDeleteItem: (id: string) => void;
};

export function FileManagerGridView({ table, dataFiltered, onDeleteItem, onOpenConfirm }: Props) {
  const { selected, onSelectRow: onSelectItem } = table;
  const files = useBoolean();
  const upload = useBoolean();
  const folders = useBoolean();
  const newFolder = useBoolean();
  const containerRef = useRef(null);
  const [folderName, setFolderName] = useState('');

  const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  }, []);

  const foldersData = dataFiltered.filter((item) => item.type === 'dossier');
  const filesData = dataFiltered.filter((item) => item.type !== 'dossier');
  const startIdx = table.page * table.rowsPerPage;
  const endIdx = startIdx + table.rowsPerPage;
  const filesInPage = filesData.slice(startIdx, endIdx);

  return (
    <>
      <Box ref={containerRef}>
        <FileManagerPanel
          sx={{ m: 2 }}
          title="Dossiers"
          subtitle={`${foldersData.length} dossiers`}
          onOpen={newFolder.onTrue}
          collapse={folders.value}
          onCollapse={folders.onToggle}
        />
        <Collapse in={!folders.value} unmountOnExit>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
          >
            {foldersData.map((folder) => (
              <FileManagerFolderItem
                key={folder.id}
                folder={folder}
                selected={selected.includes(folder.id)}
                onSelect={() => onSelectItem(folder.id)}
                onDelete={() => onDeleteItem(folder.id)}
                sx={{ maxWidth: 'auto' }}
              />
            ))}
          </Box>
        </Collapse>
        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
        <FileManagerPanel
          sx={{ m: 2 }}
          title="Fichiers"
          subtitle={`${filesData.length} fichiers`}
          onOpen={upload.onTrue}
          collapse={files.value}
          onCollapse={files.onToggle}
        />
        <Collapse in={!files.value} unmountOnExit>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {filesInPage.map((file) => (
              <FileManagerFileItem
                key={file.id}
                file={file}
                selected={selected.includes(file.id)}
                onSelect={() => onSelectItem(file.id)}
                onDelete={() => onDeleteItem(file.id)}
                sx={{ maxWidth: 'auto' }}
                folder={{
                  id: '',
                  name: '',
                  size: 0,
                  type: '',
                  url: '',
                  tags: [],
                  totalFiles: undefined,
                  isFavorited: false,
                  shared: null,
                  createdAt: null,
                  modifiedAt: null,
                }}
              />
            ))}
          </Box>
        </Collapse>
      </Box>
      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />
      <FileManagerNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        onCreate={() => {
          newFolder.onFalse();
          setFolderName('');
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      />
    </>
  );
}