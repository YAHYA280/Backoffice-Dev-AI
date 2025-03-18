import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Box,
  List,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { DeletedTicketItem } from './kanban-deleted-tickets-item';

interface Ticket {
  id: string;
  title: string;
  deletedAt: string;
  priority: string;
}

interface DeletedTicketsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DeletedTicketsDialog({ open, onClose }: DeletedTicketsDialogProps) {
  const [deletedTickets, setDeletedTickets] = useState<Ticket[]>([]);
  const [loadingDeletedTickets, setLoadingDeletedTickets] = useState(false);
  const [processingTicketId, setProcessingTicketId] = useState<string | null>(null);

  // Function to fetch deleted tickets
  const fetchDeletedTickets = useCallback(async () => {
    try {
      setLoadingDeletedTickets(true);
      // Actual API call to fetch deleted tickets
      // Mock data for demonstration
      const mockDeletedTickets = [
        {
          id: 'd1',
          title: 'Problème de connexion',
          deletedAt: '2025-03-15T14:30:00',
          priority: 'Élevée',
        },
        {
          id: 'd2',
          title: 'Erreur de facturation',
          deletedAt: '2025-03-14T10:15:00',
          priority: 'Moyenne',
        },
        {
          id: 'd3',
          title: 'Demande de fonctionnalité',
          deletedAt: '2025-03-12T09:45:00',
          priority: 'Basse',
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setDeletedTickets(mockDeletedTickets);
        setLoadingDeletedTickets(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch deleted tickets:', error);
      setLoadingDeletedTickets(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchDeletedTickets();
    }
  }, [open, fetchDeletedTickets]);

  const handleRestoreTicket = async (ticketId: string) => {
    setProcessingTicketId(ticketId);
    try {
      // Actual API call to restore a ticket
      // simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      setDeletedTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
    } catch (error) {
      console.error(`Failed to restore ticket ${ticketId}:`, error);
    } finally {
      setProcessingTicketId(null);
    }
  };

  const handlePermanentDelete = async (ticketId: string) => {
    setProcessingTicketId(ticketId);
    try {
      // Actual API call to permanently delete a ticket
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Update the UI by removing the deleted ticket from the list
      setDeletedTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
    } catch (error) {
      console.error(`Failed to permanently delete ticket ${ticketId}:`, error);
    } finally {
      setProcessingTicketId(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FontAwesomeIcon icon={faTrash} size='xs'/>
          <Typography variant="h6">Tickets supprimés</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {loadingDeletedTickets ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : deletedTickets.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">Aucun ticket supprimé</Typography>
          </Box>
        ) : (
          <List>
            {deletedTickets.map((ticket, index) => (
              <DeletedTicketItem
                key={ticket.id}
                ticket={ticket}
                index={index}
                processingTicketId={processingTicketId}
                onRestore={handleRestoreTicket}
                onDelete={handlePermanentDelete}
              />
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}