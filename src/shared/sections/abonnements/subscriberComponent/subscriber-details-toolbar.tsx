import type { ISubscriberItem } from 'src/contexts/types/subscriber';

import React from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { FontAwesome } from 'src/shared/components/fontawesome';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  subscriber: ISubscriberItem;
  onDelete: (id: string) => void;
  onCloseDetails: () => void;
};

export function SubscriberDetailsToolbar({ subscriber, onDelete, onCloseDetails }: Props) {
  const confirm = useBoolean();

  const handleDelete = () => {
    onDelete(subscriber.id);
    confirm.onFalse();
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(2.5, 1, 2.5, 2.5),
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Tooltip title="Supprimer l'abonné">
            <IconButton onClick={confirm.onTrue}>
              <FontAwesome icon={faTrashAlt} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Êtes-vous sûr de vouloir supprimer l&apos;abonné <strong>{subscriber.name}</strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}
