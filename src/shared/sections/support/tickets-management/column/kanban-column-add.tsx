import type { BoxProps } from '@mui/material/Box';

import { useState, useCallback } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { inputBaseClasses } from '@mui/material/InputBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { useBoolean } from 'src/hooks/use-boolean';

import { uuidv4 } from 'src/utils/uuidv4';

import { createColumn } from 'src/shared/actions/kanban';

// ----------------------------------------------------------------------

export function KanbanColumnAdd({ sx, ...other }: BoxProps) {
  const [columnName, setColumnName] = useState('');

  const openAddColumn = useBoolean();

  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setColumnName(event.target.value);
  }, []);

  const handleCreateColumn = useCallback(async () => {
    try {
      const columnData = { id: uuidv4(), name: columnName.trim() ? columnName : 'Sans titre' };

      createColumn(columnData);

      setColumnName('');

      openAddColumn.onFalse();
    } catch (error) {
      console.error(error);
    }
  }, [columnName, openAddColumn]);

  const handleKeyUpCreateColumn = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleCreateColumn();
      }
    },
    [handleCreateColumn]
  );

  const handleCancel = useCallback(() => {
    setColumnName('');
    openAddColumn.onFalse();
  }, [openAddColumn]);

  return (
    <>
      <Box sx={{ width: 'var(--column-width)', flex: '0 0 auto', ...sx }} {...other}>
        {openAddColumn.value ? (
          <ClickAwayListener onClickAway={handleCancel}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Sans titre"
              value={columnName}
              onChange={handleChangeName}
              onKeyUp={handleKeyUpCreateColumn}
              helperText="Appuyez sur Entrée pour créer la colonne."
              sx={{ [`& .${inputBaseClasses.input}`]: { typography: 'h6' } }}
            />
          </ClickAwayListener>
        ) : (
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faPlus} style={{ marginRight: '-10px' }} />}
            onClick={openAddColumn.onTrue}
            sx={{
              minHeight: '30px',
              height: '40px',
              width: '40px', 
              padding: '6px',
              fontWeight: 300,
              borderRadius: '8px',
            }}
          />
        )}
      </Box>

      <Box sx={{ width: '1px', flexShrink: 0 }} />
    </>
  );
}
