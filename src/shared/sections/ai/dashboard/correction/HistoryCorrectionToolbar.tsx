import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faSyncAlt,
  faColumns,
  faFileExport
} from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Button,
  Select,
  Tooltip,
  Popover,
  MenuItem,
  MenuList,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  OutlinedInput
} from '@mui/material';

// Interface pour les filtres avancés
export interface IAdvancedFilter {
  column: string;
  operator?: string;
  value?: string;
  startDate?: string;
  endDate?: string;
}

// Interface pour définir les colonnes visibles
export interface CorrectionTableColumns {
  date: boolean;
  assistantType: boolean;
  level: boolean;
  subject: boolean;
  chapter: boolean;
  exercise: boolean;
  correctionType: boolean;
  impact: boolean;
}

// Props du composant
interface HistoryCorrectionToolbarProps {
  onReset: () => void;
  onExport: () => void;
  onAdvancedFilterChange?: (filter: IAdvancedFilter | null) => void;
  filterPopoverState: {
    open: boolean;
    anchorEl: any;
    onOpen: (event: React.MouseEvent<HTMLElement>) => void;
    onClose: () => void;
  };
  columnsPopoverState: {
    open: boolean;
    anchorEl: any;
    onOpen: (event: React.MouseEvent<HTMLElement>) => void;
    onClose: () => void;
  };
  visibleColumns: CorrectionTableColumns;
  onUpdateAllColumns: (newColumns: CorrectionTableColumns) => void;
  hasActiveFilters?: boolean;
}

// Constantes pour les noms de colonnes
const COLUMN_LABELS: Record<keyof CorrectionTableColumns, string> = {
  date: 'Date',
  assistantType: "Type d'assistant",
  level: 'Niveau',
  subject: 'Matière',
  chapter: 'Chapitre',
  exercise: 'Exercice',
  correctionType: 'Type de correction',
  impact: 'Impact',
};

// Colonnes par défaut (toutes visibles)
const initialTableColumns: CorrectionTableColumns = {
  date: true,
  assistantType: true,
  level: true,
  subject: true,
  chapter: true,
  exercise: true,
  correctionType: true,
  impact: true,
};

// État initial pour le popover de colonnes (toutes décochées)
const initialCheckedColumns: CorrectionTableColumns = {
  date: false,
  assistantType: false,
  level: false,
  subject: false,
  chapter: false,
  exercise: false,
  correctionType: false,
  impact: false,
};

// Constantes pour les opérateurs de filtrage
const FILTER_OPERATORS = [
  { value: 'contains', label: 'Contient' },
  { value: 'equals', label: 'Est égal à' },
  { value: 'startsWith', label: 'Commence par' },
  { value: 'endsWith', label: 'Termine par' }
];

const HistoryCorrectionToolbar: React.FC<HistoryCorrectionToolbarProps> = ({
  onReset,
  onExport,
  onAdvancedFilterChange,
  filterPopoverState,
  columnsPopoverState,
  visibleColumns,
  onUpdateAllColumns,
  hasActiveFilters = false
}) => {
  const theme = useTheme();

  // États pour le filtre avancé
  const [filterColumn, setFilterColumn] = useState('');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // État pour la sélection des colonnes
  const [tempColumnState, setTempColumnState] = useState<CorrectionTableColumns>({ ...initialCheckedColumns });
  const [popoverPreviouslyOpened, setPopoverPreviouslyOpened] = useState(false);

  // Initialiser l'état du popover des colonnes
  useEffect(() => {
    if (columnsPopoverState.open) {
      if (!popoverPreviouslyOpened) {
        // Première ouverture - toutes les colonnes sont décochées
        setTempColumnState({ ...initialCheckedColumns });
        setPopoverPreviouslyOpened(true);
      }
    }
  }, [columnsPopoverState.open, popoverPreviouslyOpened]);

  // Fonction pour basculer l'état d'une colonne
  const handleToggleColumn = (column: keyof CorrectionTableColumns, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setTempColumnState(prevState => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };

  // Fonction pour sauvegarder les changements de colonnes
  const saveColumnChanges = () => {
    // Créer un nouvel objet avec toutes les colonnes invisibles par défaut
    const newVisibleColumns = Object.keys(initialTableColumns).reduce((acc, key) => {
      acc[key as keyof CorrectionTableColumns] = false;
      return acc;
    }, {} as CorrectionTableColumns);

    // Rendre visible seulement les colonnes cochées
    Object.keys(tempColumnState).forEach(key => {
      const column = key as keyof CorrectionTableColumns;
      if (tempColumnState[column]) {
        newVisibleColumns[column] = true;
      }
    });

    // Appliquer les changements
    onUpdateAllColumns(newVisibleColumns);
    columnsPopoverState.onClose();
  };

  // Fonction pour annuler les changements de colonnes
  const cancelColumnChanges = () => {
    columnsPopoverState.onClose();
  };

  // Fonction pour réinitialiser toutes les colonnes
  const resetColumns = () => {
    onUpdateAllColumns({ ...initialTableColumns });
    columnsPopoverState.onClose();
  };

  // Fonction pour appliquer le filtre avancé
  const applyAdvancedFilter = () => {
    if (filterColumn) {
      const advancedFilter: IAdvancedFilter = {
        column: filterColumn,
        ...(filterColumn === 'date'
          ? { startDate, endDate }
          : { operator: filterOperator, value: filterValue })
      };

      if (onAdvancedFilterChange) {
        onAdvancedFilterChange(advancedFilter);
      }

      filterPopoverState.onClose();
    }
  };

  // Fonction pour réinitialiser tous les filtres
  const handleResetAll = () => {
    // Réinitialiser les filtres
    setFilterColumn('');
    setFilterOperator('contains');
    setFilterValue('');
    setStartDate('');
    setEndDate('');

    if (onAdvancedFilterChange) {
      onAdvancedFilterChange(null);
    }

    // Réinitialiser les colonnes
    onUpdateAllColumns({ ...initialTableColumns });

    // Également réinitialiser l'état temporaire des colonnes
    setTempColumnState({ ...initialCheckedColumns });
    setPopoverPreviouslyOpened(false);

    // Appeler la fonction de réinitialisation externe
    onReset();

    // Fermer les popovers si ouverts
    if (filterPopoverState.open) {
      filterPopoverState.onClose();
    }
    if (columnsPopoverState.open) {
      columnsPopoverState.onClose();
    }
  };

  return (
    <>
      {/* Barre d'outils */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Bouton pour sélectionner les colonnes */}
          <Tooltip title="Sélectionner les colonnes">
            <IconButton
              aria-label="colonnes"
              onClick={columnsPopoverState.onOpen}
              sx={{
                p: 1,
                transition: theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
              size="small"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 'medium',
                  }}
                >
                  colonnes
                </Typography>
                <FontAwesomeIcon icon={faColumns} color={theme.palette.primary.main} />
              </Box>
            </IconButton>
          </Tooltip>

          {/* Bouton pour les filtres avancés */}
          <Tooltip title="Filtres avancés">
            <IconButton
              aria-label="filtre"
              onClick={filterPopoverState.onOpen}
              sx={{
                p: 1,
                transition: theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': { transform: 'translateY(-2px)' },
              }}
              size="small"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 'medium',
                  }}
                >
                  filtres
                </Typography>
                <FontAwesomeIcon icon={faFilter} color={theme.palette.primary.main} />
              </Box>
            </IconButton>
          </Tooltip>

          {/* Bouton pour réinitialiser */}
          <Tooltip title="Réinitialiser les filtres">
            <IconButton
              color="primary"
              aria-label="effacer les filtres"
              onClick={handleResetAll}
              sx={{
                p: 1,
                transition: theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': { transform: 'translateY(-2px)' },
              }}
              size="small"
            >
              <FontAwesomeIcon icon={faSyncAlt} />
            </IconButton>
          </Tooltip>

          {/* Bouton pour exporter */}
          <Tooltip title="Exporter les données">
            <IconButton
              color="primary"
              aria-label="exporter"
              onClick={onExport}
              sx={{
                p: 1,
                transition: theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': { transform: 'translateY(-2px)' },
              }}
              size="small"
            >
              <FontAwesomeIcon icon={faFileExport} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Popover pour la sélection des colonnes */}
      <Popover
        anchorEl={columnsPopoverState.anchorEl}
        open={columnsPopoverState.open}
        onClose={cancelColumnChanges}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 1, width: '250px' }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 1 }}>
          Sélectionner les colonnes
        </Typography>
        <MenuList>
          {Object.keys(COLUMN_LABELS).map((column) => {
            const columnKey = column as keyof CorrectionTableColumns;
            return (
              <MenuItem
                key={column}
                dense
                disableRipple
                disableTouchRipple
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  height: '40px'
                }}
              >
                <Box
                  onClick={() => handleToggleColumn(columnKey)}
                  sx={{
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Typography variant="body2">
                    {COLUMN_LABELS[columnKey]}
                  </Typography>
                </Box>
                <Checkbox
                  checked={tempColumnState[columnKey]}
                  size="small"
                  sx={{ p: 0 }}
                  onChange={() => handleToggleColumn(columnKey)}
                  onClick={(e) => e.stopPropagation()}
                />
              </MenuItem>
            );
          })}
        </MenuList>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={cancelColumnChanges}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={saveColumnChanges}
          >
            Enregistrer
          </Button>
        </Box>
      </Popover>

      {/* Popover pour le filtre avancé */}
      <Popover
        anchorEl={filterPopoverState.anchorEl}
        open={filterPopoverState.open}
        onClose={filterPopoverState.onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 2, width: '700px', maxWidth: '95vw' }
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Filtrage avancé des corrections
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: '30%' }}>
              <InputLabel>Colonne</InputLabel>
              <Select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                input={<OutlinedInput label="Colonne" />}
              >
                {Object.keys(COLUMN_LABELS).map((column) => (
                  <MenuItem key={column} value={column}>
                    {COLUMN_LABELS[column as keyof CorrectionTableColumns]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {filterColumn === 'date' ? (
              <>
                <TextField
                  size="small"
                  label="Date début"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ minWidth: '30%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  size="small"
                  label="Date fin"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ minWidth: '30%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </>
            ) : (
              <>
                <FormControl size="small" sx={{ minWidth: '30%' }}>
                  <InputLabel>Opérateur</InputLabel>
                  <Select
                    value={filterOperator}
                    onChange={(e) => setFilterOperator(e.target.value)}
                    input={<OutlinedInput label="Opérateur" />}
                  >
                    {FILTER_OPERATORS.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Valeur"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  sx={{ minWidth: '30%' }}
                />
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              size="small"
              onClick={filterPopoverState.onClose}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={applyAdvancedFilter}
              disabled={!filterColumn || (filterColumn === 'date' ? (!startDate && !endDate) : !filterValue)}
            >
              Appliquer
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default HistoryCorrectionToolbar;