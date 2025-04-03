import { useState, useEffect, useCallback } from "react";
// Import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Box,
  Table,
  Stack,
  Button,
  Dialog,
  Popover,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  InputAdornment,
} from "@mui/material";

import { AIAssistantHistoryService } from "../AIAssistantHistoryService";

type AIAssistantHistoryDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AIAssistantHistoryDialog({ open, onClose }: AIAssistantHistoryDialogProps) {
  const [modificationHistory, setModificationHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);

  // Date filtering state
  const [dateFilterAnchorEl, setDateFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateFilterActive, setDateFilterActive] = useState(false);

  const dateFilterOpen = Boolean(dateFilterAnchorEl);

  // Function to format date in DD/MM/YYYY format
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to parse ISO date string to Date object
  const parseISODate = (dateString: string): Date => new Date(dateString);

  useEffect(() => {
    // Update history when dialog opens
    if (open) {
      const history = AIAssistantHistoryService.getHistory();
      setModificationHistory(history);
      setFilteredHistory(history);
    }
  }, [open]);

  // Wrap applyFilters in useCallback to prevent it from changing on every render
  const applyFilters = useCallback((history: any[], query: string, start: Date | null, end: Date | null) => {
    let filtered = [...history];

    // Apply text search filter
    if (query.trim() !== "") {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.section.toLowerCase().includes(lowercaseQuery) ||
        entry.user.toLowerCase().includes(lowercaseQuery) ||
        entry.comment.toLowerCase().includes(lowercaseQuery) ||
        entry.action.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply date filter
    if (start || end) {
      filtered = filtered.filter(entry => {
        const entryDate = parseISODate(entry.date);

        if (start && end) {
          // Set end date to end of day for inclusive filtering
          const endOfDay = new Date(end);
          endOfDay.setHours(23, 59, 59, 999);
          return entryDate >= start && entryDate <= endOfDay;
        }

        if (start) {
          return entryDate >= start;
        }

        if (end) {
          // Set end date to end of day for inclusive filtering
          const endOfDay = new Date(end);
          endOfDay.setHours(23, 59, 59, 999);
          return entryDate <= endOfDay;
        }

        return true;
      });
    }

    setFilteredHistory(filtered);
  }, []);

  useEffect(() => {
    // Apply both text search and date filtering
    applyFilters(modificationHistory, searchQuery, startDate, endDate);
  }, [searchQuery, modificationHistory, startDate, endDate, applyFilters]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateFilterActive(false);
  };

  const handleOpenDateFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDateFilterAnchorEl(event.currentTarget);
  };

  const handleCloseDateFilter = () => {
    setDateFilterAnchorEl(null);
  };

  const handleApplyDateFilter = () => {
    setDateFilterActive(Boolean(startDate || endDate));
    handleCloseDateFilter();
  };

  const formatAction = (action: string) => {
    switch(action) {
      case 'add': return 'Ajout';
      case 'modify': return 'Modification';
      case 'delete': return 'Suppression';
      default: return action;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Historique des modifications</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Rechercher dans l'historique..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faSearch} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Tooltip title="Filtrer par date">
              <IconButton
                onClick={handleOpenDateFilter}
                color={dateFilterActive ? "primary" : "default"}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
              </IconButton>
            </Tooltip>

            {dateFilterActive && (
              <Tooltip title="Effacer le filtre de date">
                <IconButton size="small" onClick={clearDateFilter}>
                  <FontAwesomeIcon icon={faTimes} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {dateFilterActive && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>
                Filtre par date :
                {startDate && !endDate && ` À partir du ${formatDate(startDate)}`}
                {!startDate && endDate && ` Jusqu'au ${formatDate(endDate)}`}
                {startDate && endDate && ` Du ${formatDate(startDate)} au ${formatDate(endDate)}`}
              </span>
            </Box>
          )}
        </Box>

        <Popover
          open={dateFilterOpen}
          anchorEl={dateFilterAnchorEl}
          onClose={handleCloseDateFilter}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 2, width: 300 }}>
              <Stack spacing={2}>
                <DatePicker
                  label="Date de début"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <DatePicker
                  label="Date de fin"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button onClick={clearDateFilter} size="small">
                    Réinitialiser
                  </Button>
                  <Button onClick={handleApplyDateFilter} variant="contained" size="small">
                    Appliquer
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </LocalizationProvider>
        </Popover>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Commentaire</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {searchQuery || dateFilterActive ? "Aucun résultat trouvé" : "Aucune modification enregistrée"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.user}</TableCell>
                    <TableCell>{entry.section}</TableCell>
                    <TableCell>{formatAction(entry.action)}</TableCell>
                    <TableCell>{entry.comment}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}