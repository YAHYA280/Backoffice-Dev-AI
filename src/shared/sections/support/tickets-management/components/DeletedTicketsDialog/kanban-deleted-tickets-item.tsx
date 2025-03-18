import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import {
  Stack,
  Divider,
  Tooltip,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  CircularProgress,
} from '@mui/material';

interface Ticket {
  id: string;
  title: string;
  deletedAt: string;
  priority: string;
}

interface DeletedTicketItemProps {
  ticket: Ticket;
  index: number;
  processingTicketId: string | null;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DeletedTicketItem({
  ticket,
  index,
  processingTicketId,
  onRestore,
  onDelete,
}: DeletedTicketItemProps) {
  return (
    <>
      {index > 0 ? <Divider component="li" /> : <></>}
      <ListItem
        secondaryAction={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Restaurer">
              <span>
                <IconButton
                  edge="end"
                  aria-label="restore"
                  onClick={() => onRestore(ticket.id)}
                  disabled={processingTicketId === ticket.id}
                >
                  {processingTicketId === ticket.id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <FontAwesomeIcon icon={faUndo} size="xs" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Supprimer définitivement">
              <span>
                <IconButton
                  edge="end"
                  aria-label="delete permanently"
                  onClick={() => onDelete(ticket.id)}
                  disabled={processingTicketId === ticket.id}
                  color="error"
                >
                  {processingTicketId === ticket.id ? (
                    <CircularProgress size={20} />
                  ) : (
                    <FontAwesomeIcon icon={faTrashAlt} size="xs" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        }
      >
        <ListItemText
          primary={<Typography variant="subtitle2">{ticket.title}</Typography>}
          secondary={
            <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
              <Typography variant="caption" color="text.secondary">
                Supprimé le:{' '}
                {new Date(ticket.deletedAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor:
                    ticket.priority === 'Élevée'
                      ? 'error.light'
                      : ticket.priority === 'Moyenne'
                        ? 'warning.light'
                        : 'info.light',
                  color:
                    ticket.priority === 'Élevée'
                      ? 'error.dark'
                      : ticket.priority === 'Moyenne'
                        ? 'warning.dark'
                        : 'info.dark',
                }}
              >
                {ticket.priority}
              </Typography>
            </Stack>
          }
        />
      </ListItem>
    </>
  );
}
