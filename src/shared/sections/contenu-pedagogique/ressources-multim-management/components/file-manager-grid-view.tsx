import type { IFile } from 'src/contexts/types/file';
import type { TableProps } from 'src/shared/components/table';

import { useRef } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { FileManagerPanel } from './file-manager-panel';
import { FileManagerFileItem } from './file-manager-file-item';
import { FileManagerFolderItem } from './file-manager-folder-item';

type Props = {
  table: TableProps;
  dataFiltered: IFile[];
  onOpenConfirm: () => void;
  onDeleteItem: (id: string) => void;
  onDoubleClick?: (id: string) => void; // Add this prop
};

export function FileManagerGridView({ 
  table, 
  dataFiltered, 
  onDeleteItem, 
  onOpenConfirm,
  onDoubleClick, // Add this parameter
}: Props) {
  const { selected, onSelectRow: onSelectItem } = table;
  const files = useBoolean();
  const folders = useBoolean();
  const containerRef = useRef(null);

  // dataFiltered should already contain only items within the current folder
  const foldersData = dataFiltered.filter((item) => item.type === 'dossier');
  const filesData = dataFiltered.filter((item) => item.type !== 'dossier');
  const startIdx = table.page * table.rowsPerPage;
  const endIdx = startIdx + table.rowsPerPage;
  const filesInPage = filesData.slice(startIdx, endIdx);

  return (
    <Box ref={containerRef}>
        <FileManagerPanel
          sx={{ m: 2 }}
          title="Dossiers"
          subtitle={`${foldersData.length} dossiers`}
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
                onDoubleClick={() => onDoubleClick?.(folder.id)} // Add double-click handler
                sx={{ maxWidth: 'auto', }}
              />
            ))}
          </Box>
        </Collapse>
        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
        <FileManagerPanel
          sx={{ m: 2 }}
          title="Fichiers"
          subtitle={`${filesData.length} fichiers`}
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
                  parentId: null,
                  size: 0,
                  type: '',
                  url: '',
                  tags: [],
                  totalFiles: undefined,
                  isFavorited: false,
                  createdAt: null,
                  modifiedAt: null
                }}              
              />
            ))}
          </Box>
        </Collapse>
      </Box>
  );
}