import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch , faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Table,
  Paper,
  Select,
  TableRow,
  MenuItem,
  TableHead,
  TableBody,
  TableCell,
  TextField,
  Typography,
  IconButton,
  TableContainer,
  LinearProgress,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import { usePopover } from 'src/shared/components/custom-popover';

import HistoryCorrectionToolbar from './HistoryCorrectionToolbar';
import { assistantTypeMapping } from '../../../../_mock/_correction_ai';

import type { IAdvancedFilter, CorrectionTableColumns } from './HistoryCorrectionToolbar';


// Interface pour les métadonnées des corrections
interface CorrectionMeta {
  subject?: string;
  chapter?: string;
  exercise?: string;
  level?: string;
}

// Interface pour les propriétés du composant
interface HistoryCorrectionProps {
  data: Array<{
    date: string;
    assistant: string;
    type: string;
    impact: number;
    meta: CorrectionMeta;
  }>;
  itemsPerPage?: number;
}

// Colonnes par défaut (toutes visibles)
const initialVisibleColumns: CorrectionTableColumns = {
  date: true,
  assistantType: true,
  level: true,
  subject: true,
  chapter: true,
  exercise: true,
  correctionType: true,
  impact: true,
};

const HistoryCorrection: React.FC<HistoryCorrectionProps> = ({
  data,
  itemsPerPage = 10
}) => {
  // États pour la pagination et les filtres
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [filteredData, setFilteredData] = useState(data);

  // États pour les filtres simples
  const [searchFilters, setSearchFilters] = useState({
    date: '',
    assistantType: '',
    level: '',
    subject: '',
    chapter: '',
    exercise: '',
    correctionType: '',
    impact: '',
  });

  // État pour le filtre avancé
  const [advancedFilter, setAdvancedFilter] = useState<IAdvancedFilter | null>(null);

  // État pour indiquer si des filtres sont actifs
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // État pour les colonnes visibles
  const [visibleColumns, setVisibleColumns] = useState<CorrectionTableColumns>(initialVisibleColumns);

  // Définir les états pour les popover
  const filterPopover = usePopover();
  const columnsPopover = usePopover();

  // Style de cellule pour les en-têtes - mise à jour pour garantir qu'ils restent fixes
  const headerCellStyle = {
    backgroundColor: 'background.paper',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10, // Augmenté pour s'assurer que les en-têtes sont au-dessus des autres éléments
    padding: '8px',
  };

  // Style pour la seconde ligne d'en-tête (filtres)
  const filterRowCellStyle = {
    backgroundColor: 'background.paper',
    position: 'sticky' as const,
    top: '40px', // La hauteur de la première ligne d'en-tête (ajustez selon vos besoins)
    zIndex: 9, // Un peu moins que la première ligne, mais toujours au-dessus du contenu
    padding: '8px',
  };

  // Définir des largeurs fixes pour chaque colonne
  const columnWidths = {
    date: '120px',
    assistantType: '150px',
    level: '120px',
    subject: '130px',
    chapter: '180px',
    exercise: '180px',
    correctionType: '150px',
    impact: '150px',
  };

  // Réinitialiser la page quand les données changent
  useEffect(() => {
    setPage(0);
  }, [data.length]);

  // Vérifier s'il y a des filtres actifs
  useEffect(() => {
    const hasFilters = Object.values(searchFilters).some(value => value !== '') || advancedFilter !== null;
    setHasActiveFilters(hasFilters);
  }, [searchFilters, advancedFilter]);

  // Filtrer les données en fonction des critères de recherche
  useEffect(() => {
    let filtered = [...data];

    // Appliquer les filtres simples
    if (searchFilters.date) {
      filtered = filtered.filter(item =>
        item.date.toLowerCase().includes(searchFilters.date.toLowerCase())
      );
    }

    if (searchFilters.assistantType) {
      filtered = filtered.filter(item =>
        getAssistantType(item.assistant).toLowerCase().includes(searchFilters.assistantType.toLowerCase())
      );
    }

    if (searchFilters.level) {
      filtered = filtered.filter(item =>
        (item.meta.level || '').toLowerCase().includes(searchFilters.level.toLowerCase())
      );
    }

    if (searchFilters.subject) {
      filtered = filtered.filter(item =>
        (item.meta.subject || '').toLowerCase().includes(searchFilters.subject.toLowerCase())
      );
    }

    if (searchFilters.chapter) {
      filtered = filtered.filter(item =>
        (item.meta.chapter || '').toLowerCase().includes(searchFilters.chapter.toLowerCase())
      );
    }

    if (searchFilters.exercise) {
      filtered = filtered.filter(item =>
        (item.meta.exercise || '').toLowerCase().includes(searchFilters.exercise.toLowerCase())
      );
    }

    if (searchFilters.correctionType) {
      filtered = filtered.filter(item =>
        item.type.toLowerCase().includes(searchFilters.correctionType.toLowerCase())
      );
    }

    if (searchFilters.impact) {
      const impactValue = parseInt(searchFilters.impact, 10);
      filtered = filtered.filter(item => item.impact === impactValue);
    }

    // Appliquer le filtre avancé si présent
    if (advancedFilter) {
      const { column, operator, value, startDate, endDate } = advancedFilter;

      filtered = filtered.filter(item => {
        let itemValue = '';
        let compareValue = value || '';

        // Récupérer la valeur de la colonne appropriée
        switch (column) {
          case 'date':
            itemValue = item.date;
            break;
          case 'assistantType':
            itemValue = getAssistantType(item.assistant);
            break;
          case 'level':
            itemValue = item.meta.level || '';
            break;
          case 'subject':
            itemValue = item.meta.subject || '';
            break;
          case 'chapter':
            itemValue = item.meta.chapter || '';
            break;
          case 'exercise':
            itemValue = item.meta.exercise || '';
            break;
          case 'correctionType':
            itemValue = item.type;
            break;
          case 'impact':
            itemValue = item.impact.toString();
            break;
          default:
            return true;
        }

        // Filtrer selon l'opérateur
        if (column === 'date' && startDate && endDate) {
          const itemDate = new Date(itemValue);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59); // Inclure toute la journée de fin

          return itemDate >= start && itemDate <= end;
        } if (column === 'impact' && operator) {
          const impactNum = parseInt(itemValue, 10);
          const compareNum = parseInt(compareValue, 10);

          switch (operator) {
            case 'equals':
              return impactNum === compareNum;
            case 'greaterThan':
              return impactNum > compareNum;
            case 'lessThan':
              return impactNum < compareNum;
            default:
              return true;
          }
        } else if (operator) {
          itemValue = itemValue.toLowerCase();
          compareValue = compareValue.toLowerCase();

          switch (operator) {
            case 'equals':
              return itemValue === compareValue;
            case 'notequals':
              return itemValue !== compareValue;
            case 'contains':
              return itemValue.includes(compareValue);
            case 'startsWith':
              return itemValue.startsWith(compareValue);
            case 'endsWith':
              return itemValue.endsWith(compareValue);
            default:
              return true;
          }
        }

        return true;
      });
    }

    setFilteredData(filtered);
    setPage(0); // Réinitialiser la page lorsque les filtres changent
  }, [searchFilters, data, advancedFilter]);

  // Gérer le changement de page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre d'éléments par page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fonction pour obtenir le type d'assistant à partir de son nom
  const getAssistantType = (assistantName: string): string => {
    const type = assistantTypeMapping[assistantName] || 'unknown';
    if (type === 'japprends') return "J'apprends";
    if (type === 'accueil') return "Accueil";
    if (type === 'recherche') return "Recherche";
    return "Inconnu";
  };

  // Fonction réutilisable pour créer un InputAdornment de recherche
  const createSearchAdornment = (column: string, value: string) => (
    <InputAdornment position="start">
      <FontAwesomeIcon icon={faSearch} size="sm" />
      {value && (
        <IconButton size="small" onClick={() => clearColumnFilter(column)} sx={{ ml: 1 }}>
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </IconButton>
      )}
    </InputAdornment>
  );

  // Gérer les changements de filtres
  const handleSearchChange = (column: string, value: string) => {
    if (column === 'subject') {
      setSearchFilters(prev => ({
        ...prev,
        [column]: value,
        chapter: '',
        exercise: ''
      }));
    }
    else if (column === 'chapter') {
      setSearchFilters(prev => ({
        ...prev,
        [column]: value,
        exercise: ''
      }));
    }
    else {
      setSearchFilters(prev => ({
        ...prev,
        [column]: value
      }));
    }
  };

  // Effacer un filtre spécifique
  const clearColumnFilter = (column: string) => {
    if (column === 'subject') {
      setSearchFilters(prev => ({
        ...prev,
        subject: '',
        chapter: '',
        exercise: ''
      }));
    } else if (column === 'chapter') {
      setSearchFilters(prev => ({
        ...prev,
        chapter: '',
        exercise: ''
      }));
    } else {
      setSearchFilters(prev => ({
        ...prev,
        [column]: ''
      }));
    }
  };

  // Réinitialiser tous les filtres
  const handleResetAllFilters = () => {
    setSearchFilters({
      date: '',
      assistantType: '',
      level: '',
      subject: '',
      chapter: '',
      exercise: '',
      correctionType: '',
      impact: '',
    });
    setAdvancedFilter(null);
    // Réinitialiser les colonnes visibles
    setVisibleColumns(initialVisibleColumns);
  };

  // Exporter les données en CSV
  const handleExportData = () => {
    // Convertir les données filtrées en CSV
    const headers = Object.entries(visibleColumns)
      .filter(([_, isVisible]) => isVisible)
      .map(([column]) => {
        switch (column) {
          case 'date': return 'Date';
          case 'assistantType': return "Type d'assistant";
          case 'level': return 'Niveau';
          case 'subject': return 'Matière';
          case 'chapter': return 'Chapitre';
          case 'exercise': return 'Exercice';
          case 'correctionType': return 'Type de correction';
          case 'impact': return 'Impact';
          default: return '';
        }
      })
      .join(',');

    const csvRows = filteredData.map(row => {
      const rowValues = [];

      if (visibleColumns.date) rowValues.push(row.date);
      if (visibleColumns.assistantType) rowValues.push(getAssistantType(row.assistant));
      if (visibleColumns.level) rowValues.push(row.meta.level || '-');
      if (visibleColumns.subject) rowValues.push(row.meta.subject || '-');
      if (visibleColumns.chapter) rowValues.push(row.meta.chapter || '-');
      if (visibleColumns.exercise) rowValues.push(row.meta.exercise || '-');
      if (visibleColumns.correctionType) rowValues.push(row.type);
      if (visibleColumns.impact) rowValues.push(`+${row.impact}%`);

      return rowValues.join(',');
    });

    const csvContent = [headers, ...csvRows].join('\n');

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `corrections_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Interface pour FilterTextField props
  interface FilterTextFieldProps {
    column: string;
    value: string;
  }

  // Composant réutilisable pour les filtres TextField
  const FilterTextField: React.FC<FilterTextFieldProps> = ({ column, value }) => (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={(e) => handleSearchChange(column, e.target.value)}
      placeholder=""
      InputProps={{
        startAdornment: createSearchAdornment(column, value),
        sx: {
          '& fieldset': { border: 'none' },
          height: '32px'
        }
      }}
    />
  );

  // Interface pour FilterSelect props
  interface FilterSelectProps {
    column: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
  }
// Composant FilterDateField modifié sans icône de calendrier par défaut
const FilterDateField: React.FC<FilterTextFieldProps> = ({ column, value }) => {
  // État local pour contrôler l'affichage du DatePicker
  const [openDatePicker, setOpenDatePicker] = useState(false);
  // État pour contrôler la visibilité de l'icône du calendrier
  const [showCalendarIcon, setShowCalendarIcon] = useState(false);

  // Référence pour le champ de texte
  const inputRef = React.useRef(null);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}
      onMouseEnter={() => setShowCalendarIcon(true)}
      onMouseLeave={() => setShowCalendarIcon(false)}
      onClick={(e) => {
        // Si l'utilisateur clique dans la zone mais pas sur le calendrier ou l'icône de suppression
        if (e.currentTarget === e.target) {
          setOpenDatePicker(true);
        }
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={value}
        placeholder=""
        ref={inputRef}
        onChange={(e) => handleSearchChange(column, e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faSearch} size="sm" />
              {/* L'icône du calendrier n'est visible que lorsque la souris est sur le champ */}
              {showCalendarIcon && (
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDatePicker(true);
                  }}
                  sx={{ ml: 0.5 }}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                </IconButton>
              )}
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearColumnFilter(column);
                }}
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            '& fieldset': { border: 'none' },
            height: '25px'
          }
        }}
      />
      {openDatePicker && (
        <DatePicker
          open={openDatePicker}
          onClose={() => setOpenDatePicker(false)}
          value={value ? new Date(value) : null}
          onChange={(newDate) => {
            const formattedDate = newDate ?
              new Intl.DateTimeFormat('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).format(newDate) : '';

            handleSearchChange(column, formattedDate);
            setOpenDatePicker(false);
          }}
          slotProps={{
            textField: { sx: { display: 'none' } }, // Cache le champ de saisie du DatePicker
            popper: {
              sx: { zIndex: 9999 },
            }
          }}
        />
      )}
    </Box>
  );
};
  // Composant réutilisable pour les filtres Select
  const FilterSelect: React.FC<FilterSelectProps> = ({ column, value, options, placeholder = '' }) => (
    <Select
      fullWidth
      size="small"
      value={value}
      onChange={(e) => handleSearchChange(column, e.target.value as string)}
      displayEmpty
      renderValue={(selected) => selected || placeholder}
       sx={{
        '& fieldset': { border: 'none' },
        '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
        height: '32px'
      }}
      startAdornment={createSearchAdornment(column, value)}
    >
      <MenuItem value="">Tous</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );

  // Calculer les données à afficher en fonction de la pagination
  const displayedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      {/* Toolbar avec les options de filtrage et export */}
      <HistoryCorrectionToolbar
        onReset={handleResetAllFilters}
        onExport={handleExportData}
        onAdvancedFilterChange={setAdvancedFilter}
        filterPopoverState={filterPopover}
        columnsPopoverState={columnsPopover}
        visibleColumns={visibleColumns}
        onUpdateAllColumns={setVisibleColumns}
        hasActiveFilters={hasActiveFilters}
      />

      <TableContainer
        component={Paper}
        sx={{
          mb: 1,
          maxHeight: 600,
          overflow: 'auto',
          boxShadow: 'none',
          '& .MuiTableHead-root': {
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'background.paper'
          }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {visibleColumns.date && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.date }}>Date</TableCell>
              )}
              {visibleColumns.assistantType && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.assistantType }}>Type d&apos;assistant</TableCell>
              )}
              {visibleColumns.level && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.level }}>Niveau</TableCell>
              )}
              {visibleColumns.subject && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.subject }}>Matière</TableCell>
              )}
              {visibleColumns.chapter && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.chapter }}>Chapitre</TableCell>
              )}
              {visibleColumns.exercise && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.exercise }}>Exercice</TableCell>
              )}
              {visibleColumns.correctionType && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.correctionType }}>Type de correction</TableCell>
              )}
              {visibleColumns.impact && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.impact }}>Impact</TableCell>
              )}
            </TableRow>

            {/* Ligne pour les filtres */}
            <TableRow>
            {visibleColumns.date && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.date }}>
                  <FilterDateField column="date" value={searchFilters.date} />
                </TableCell>
              )}
              {visibleColumns.assistantType && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.assistantType }}>
                  <FilterTextField column="assistantType" value={searchFilters.assistantType} />
                </TableCell>
              )}
              {visibleColumns.level && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.level }}>
                  <FilterTextField column="level" value={searchFilters.level} />
                </TableCell>
              )}
              {visibleColumns.subject && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.subject }}>
                  <FilterTextField column="subject" value={searchFilters.subject} />
                </TableCell>
              )}
              {visibleColumns.chapter && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.chapter }}>
                  <FilterTextField column="chapter" value={searchFilters.chapter} />
                </TableCell>
              )}
              {visibleColumns.exercise && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.exercise }}>
                  <FilterTextField column="exercise" value={searchFilters.exercise} />
                </TableCell>
              )}
              {visibleColumns.correctionType && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.correctionType }}>
                  <FilterTextField column="correctionType" value={searchFilters.correctionType} />
                </TableCell>
              )}
              {visibleColumns.impact && (
                <TableCell sx={{ ...filterRowCellStyle, width: columnWidths.impact }}>
                  <FilterTextField column="impact" value={searchFilters.impact} />
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <TableRow key={index}>
                  {visibleColumns.date && <TableCell>{row.date}</TableCell>}
                  {visibleColumns.assistantType && <TableCell>{getAssistantType(row.assistant)}</TableCell>}
                  {visibleColumns.level && <TableCell>{row.meta.level || '-'}</TableCell>}
                  {visibleColumns.subject && <TableCell>{row.meta.subject || '-'}</TableCell>}
                  {visibleColumns.chapter && <TableCell>{row.meta.chapter || '-'}</TableCell>}
                  {visibleColumns.exercise && <TableCell>{row.meta.exercise || '-'}</TableCell>}
                  {visibleColumns.correctionType && <TableCell>{row.type}</TableCell>}
                  {visibleColumns.impact && (
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color="success.main"
                          sx={{ fontWeight: 600 }}
                        >
                          +{row.impact}%
                        </Typography>
                        <Box sx={{ width: '100px', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={row.impact}
                            color="success"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Aucune correction trouvée pour les critères de filtre sélectionnés.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Contrôles de pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
      />
    </>
  );
};

export default HistoryCorrection;