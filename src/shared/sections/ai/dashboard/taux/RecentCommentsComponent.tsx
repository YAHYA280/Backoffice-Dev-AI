"use client";

import React, { useState, useEffect , useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Chip,
  Table,
  Paper,
  Select,
  TableRow,
  MenuItem,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  TableContainer,
  InputAdornment,
  TablePagination
} from '@mui/material';

import { usePopover } from 'src/shared/components/custom-popover';

import FeedbackCommentsToolbar from './FeedbackCommentsToolbar';
import {
  AI_ASSISTANT_SUBJECTS,
  AI_ASSISTANT_CHAPTERS,
  AI_ASSISTANT_EXERCISES,
  AI_ASSISTANT_TYPE_OPTIONS,
  AI_ASSISTANT_EDUCATION_LEVELS
} from '../../../../_mock/_ai-assistant';

import type { FeedbackComment } from './type';
import type { FeedbackTableColumns } from './FeedbackCommentsToolbar';

interface RecentCommentsComponentProps {
  feedbacks: FeedbackComment[];
}

// Define option interface for dropdown options
interface OptionType {
  value: string;
  label: string;
}

// Interface pour les filtres avancés
interface IAdvancedFilter {
  column: string;
  operator?: string;
  value?: string;
  startDate?: string;
  endDate?: string;
}

const RecentCommentsComponent: React.FC<RecentCommentsComponentProps> = ({ feedbacks }) => {
  // État pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // État pour les filtres de recherche
  const [searchFilters, setSearchFilters] = useState({
    date: '',
    assistant: '',
    rating: '',
    comment: '',
    status: '',
    educationLevel: '',
    subject: '',
    chapter: '',
    exercise: ''
  });

  // État pour les filtres avancés
  const [advancedFilter, setAdvancedFilter] = useState<IAdvancedFilter | null>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // État pour les colonnes visibles
  const [visibleColumns, setVisibleColumns] = useState<FeedbackTableColumns>({
    date: true,
    assistant: true,
    educationLevel: true,
    subject: true,
    chapter: true,
    exercise: true,
    rating: true,
    comment: true,
    status: true
  });

  // État pour les popover
  const filterPopover = usePopover();
  const columnsPopover = usePopover();

  // États pour les options filtrées
  const [filteredChapters, setFilteredChapters] = useState(AI_ASSISTANT_CHAPTERS);
  const [filteredExercises, setFilteredExercises] = useState(AI_ASSISTANT_EXERCISES);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackComment[]>(feedbacks);

  // Définir des largeurs fixes pour chaque colonne
  const columnWidths = {
    date: '120px',
    assistant: '150px',
    educationLevel: '130px',
    subject: '130px',
    chapter: '180px',
    exercise: '180px',
    rating: '150px',
    comment: '200px',
    status: '100px',
  };

  // Style de cellule pour les en-têtes - modifié pour assurer sticky
  const headerCellStyle = {
    backgroundColor: 'background.paper',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    padding: '8px',
  };

  // Style pour les cellules de filtres - modifié pour être également sticky
  const filterCellStyle = {
    backgroundColor: 'background.paper',
    position: 'sticky',
    top: '35px', // Hauteur de la première ligne d'en-tête
    zIndex: 9,
    padding: '8px',
  };

  // Gérer le changement de page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gérer le changement du nombre d'éléments par page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Gérer les filtres avancés
  const handleAdvancedFilterChange = (filter: IAdvancedFilter | null) => {
    setAdvancedFilter(filter);
  };

  // Réinitialiser tous les filtres
  const handleResetAllFilters = () => {
    setSearchFilters({
      date: '',
      assistant: '',
      rating: '',
      comment: '',
      status: '',
      educationLevel: '',
      subject: '',
      chapter: '',
      exercise: ''
    });
    setAdvancedFilter(null);
    // Réinitialiser les colonnes visibles
    setVisibleColumns({
        date: true,
        assistant: true,
        educationLevel: true,
        subject: true,
        chapter: true,
        exercise: true,
        rating: true,
        comment: true,
        status: true
    });
  };

  // Exporter les données en CSV
  const handleExportData = () => {
    console.log('Exporter les données en CSV');
    // Implémentation de l'export
  };

  // Interface for FilterSelect props
  interface FilterSelectProps {
    column: string;
    value: string;
    options: OptionType[];
    placeholder?: string;
    valueFormatter?: (val: string) => string;
  }

  // Créer un composant réutilisable pour les filtres Select
  const FilterSelect: React.FC<FilterSelectProps> = ({
    column,
    value,
    options,
    placeholder = '',
    valueFormatter = (val: string) => val
  }) => (
    <Select
      fullWidth
      size="small"
      value={value}
      onChange={(e) => handleSearchChange(column, e.target.value as string)}
      displayEmpty
      renderValue={(selected) => selected ? valueFormatter(selected) : placeholder}
      sx={{
        '& fieldset': { border: 'none' },
        '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
        '& .MuiSelect-icon': { display: 'none' }, // Masquer la flèche
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

  // Interface for FilterTextField props
  interface FilterTextFieldProps {
    column: string;
    value: string;
  }

  // Créer un composant réutilisable pour les filtres TextField
  const FilterTextField: React.FC<FilterTextFieldProps> = ({ column, value }) => (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={(e) => handleSearchChange(column, e.target.value)}
      placeholder=""
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={faSearch} size="sm" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => clearColumnFilter(column)}>
              <FontAwesomeIcon icon={faTimes} size="sm" />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          '& fieldset': { border: 'none' },
          height: '32px'
        }
      }}
    />
  );

  // Créer un composant personnalisé pour le filtre de date
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
                    sx={{ ml: 1 }}
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
              height: '32px'
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
                placement: 'bottom-start'
              }
            }}
          />
        )}
      </Box>
    );
  };
  // Define the type for the subject-chapter mapping
  type SubjectChapterMap = Record<string, string[]>;

  // Associer les chapitres aux matières
  const getChaptersBySubject = useCallback((subject: string) => {
    if (!subject) return AI_ASSISTANT_CHAPTERS;

    const subjectChapterMap: SubjectChapterMap = {
      'Mathématiques': ['Additions et Soustractions', 'Multiplications et Divisions',
                       'Géométrie de Base', 'Problèmes Simples'],
      'Français': ['Lecture et Compréhension', 'Écriture et Orthographe',
                  'Grammaire de Base', 'Vocabulaire'],
      'Histoire': ['Préhistoire et Antiquité', 'Moyen Âge',
                  'Renaissance', 'Révolution Française'],
      'Géographie': ['Mon Village et Ma Région', 'La France',
                    'LEurope', 'Le Monde'],
      'Anglais': ['Salutations et Présentations', 'Nombres et Couleurs',
                 'Animaux et Aliments', 'Phrases Simples']
    };

    return AI_ASSISTANT_CHAPTERS.filter(chapter =>
      subjectChapterMap[subject]?.includes(chapter.value)
    );
  }, []); 

  // Mettre à jour les exercices filtrés lorsque le chapitre change
  useEffect(() => {
    setFilteredExercises(getExercisesByChapter(searchFilters.chapter));
  }, [searchFilters.subject, searchFilters.chapter, getChaptersBySubject]);  // Associer les exercices aux chapitres
  const getExercisesByChapter = (chapter: string) => {
    if (!chapter) return AI_ASSISTANT_EXERCISES;

    const chapterPrefixMap: Record<string, string[]> = {
      'Additions et Soustractions': ['exercice-addition-', 'exercice-soustraction-'],
      'Multiplications et Divisions': ['exercice-multiplication-', 'exercice-division-'],
      'Géométrie de Base': ['exercice-formes-', 'exercice-mesures-'],
      'Problèmes Simples': ['exercice-probleme-'],
      'Lecture et Compréhension': ['exercice-lecture-', 'exercice-comprehension-'],
      'Écriture et Orthographe': ['exercice-ecriture-', 'exercice-orthographe-'],
      'Grammaire de Base': ['exercice-grammaire-', 'exercice-conjugaison-'],
      'Vocabulaire': ['exercice-vocabulaire-'],
      'Préhistoire et Antiquité': ['exercice-prehistoire-', 'exercice-antiquite-'],
      'Moyen Âge': ['exercice-moyen-age-'],
      'Renaissance': ['exercice-renaissance-'],
      'Révolution Française': ['exercice-revolution-'],
      'Mon Village et Ma Région': ['exercice-village-', 'exercice-region-'],
      'La France': ['exercice-france-'],
      'LEurope': ['exercice-europe-'],
      'Le Monde': ['exercice-monde-'],
      'Salutations et Présentations': ['exercice-salutations-', 'exercice-presentations-'],
      'Nombres et Couleurs': ['exercice-nombres-', 'exercice-couleurs-'],
      'Animaux et Aliments': ['exercice-animaux-', 'exercice-aliments-'],
      'Phrases Simples': ['exercice-phrases-']
    };

    if (!chapterPrefixMap[chapter]) return AI_ASSISTANT_EXERCISES;

    return AI_ASSISTANT_EXERCISES.filter(exercise =>
      chapterPrefixMap[chapter].some(prefix => exercise.value.startsWith(prefix))
    );
  };

  // Mettre à jour les chapitres filtrés lorsque la matière change
  useEffect(() => {
    setFilteredChapters(getChaptersBySubject(searchFilters.subject));
  }, [searchFilters.subject, getChaptersBySubject]);

  // Vérifier s'il y a des filtres actifs
  useEffect(() => {
    const hasFilters = Object.values(searchFilters).some(value => value !== '') || advancedFilter !== null;
    setHasActiveFilters(hasFilters);
  }, [searchFilters, advancedFilter]);

  // Filtrer les feedbacks en fonction des critères de recherche
  useEffect(() => {
    let filtered = [...feedbacks];

    // Appliquer les filtres de colonne
    if (searchFilters.date) {
      filtered = filtered.filter(feedback =>
        feedback.date.toLowerCase().includes(searchFilters.date.toLowerCase())
      );
    }

    if (searchFilters.assistant) {
      filtered = filtered.filter(feedback =>
        feedback.assistant.toLowerCase().includes(searchFilters.assistant.toLowerCase())
      );
    }

    if (searchFilters.rating) {
      const ratingValue = parseInt(searchFilters.rating, 10);
      filtered = filtered.filter(feedback => feedback.rating === ratingValue);
    }

    if (searchFilters.comment) {
      filtered = filtered.filter(feedback =>
        feedback.comment.toLowerCase().includes(searchFilters.comment.toLowerCase())
      );
    }

    if (searchFilters.status) {
      const isHighRating = searchFilters.status === 'traité';
      filtered = filtered.filter(feedback =>
        isHighRating ? feedback.rating >= 4 : feedback.rating < 4
      );
    }

    if (searchFilters.educationLevel) {
      filtered = filtered.filter(feedback =>
        feedback.educationLevel === searchFilters.educationLevel
      );
    }

    if (searchFilters.subject) {
      filtered = filtered.filter(feedback =>
        feedback.subject === searchFilters.subject
      );
    }

    if (searchFilters.chapter) {
      filtered = filtered.filter(feedback =>
        feedback.chapter === searchFilters.chapter
      );
    }

    if (searchFilters.exercise) {
      filtered = filtered.filter(feedback =>
        feedback.exercise === searchFilters.exercise
      );
    }

    // Appliquer le filtre avancé si présent
    if (advancedFilter) {
      const { column, operator, value, startDate, endDate } = advancedFilter;

      filtered = filtered.filter(feedback => {
        let itemValue = '';
        let compareValue = value || '';

        // Récupérer la valeur de la colonne appropriée
        switch (column) {
          case 'date':
            itemValue = feedback.date;
            break;
          case 'assistant':
            itemValue = feedback.assistant;
            break;
          case 'educationLevel':
            itemValue = feedback.educationLevel || '';
            break;
          case 'subject':
            itemValue = feedback.subject || '';
            break;
          case 'chapter':
            itemValue = feedback.chapter || '';
            break;
          case 'exercise':
            itemValue = feedback.exercise || '';
            break;
          case 'rating':
            itemValue = feedback.rating.toString();
            break;
          case 'comment':
            itemValue = feedback.comment;
            break;
          case 'status':
            itemValue = feedback.rating >= 4 ? 'traité' : 'à traiter';
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
        }if (column === 'rating' && operator) {
          const ratingNum = parseInt(itemValue, 10);
          const compareNum = parseInt(compareValue, 10);

          switch (operator) {
            case 'equals':
              return ratingNum === compareNum;
            case 'greaterThan':
              return ratingNum > compareNum;
            case 'lessThan':
              return ratingNum < compareNum;
            default:
              return true;
          }
        } if (operator) {
          itemValue = itemValue.toLowerCase();
          compareValue = compareValue.toLowerCase();

          switch (operator) {
            case 'equals':
              return itemValue === compareValue;
            case 'notequals':
              return itemValue !== compareValue;
            case 'contains':
              return itemValue.includes(compareValue);
            case 'startswith':
              return itemValue.startsWith(compareValue);
            case 'endswith':
              return itemValue.endsWith(compareValue);
            default:
              return true;
          }
        }

        return true;
      });
    }

    setFilteredFeedbacks(filtered);
    setPage(0); // Réinitialiser la page lorsque les filtres changent
  }, [searchFilters, feedbacks, advancedFilter]);

  // Gérer les mises à jour des colonnes visibles
  const handleUpdateAllColumns = (newColumns: FeedbackTableColumns) => {
    setVisibleColumns(newColumns);
  };

  // Calculer les éléments à afficher pour la page actuelle
  const displayedFeedbacks = filteredFeedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      {/* Toolbar avec les filtres et sélection de colonnes */}
      <FeedbackCommentsToolbar
        onReset={handleResetAllFilters}
        onExport={handleExportData}
        onAdvancedFilterChange={handleAdvancedFilterChange}
        filterPopoverState={filterPopover}
        columnsPopoverState={columnsPopover}
        visibleColumns={visibleColumns}
        onUpdateAllColumns={handleUpdateAllColumns}
        hasActiveFilters={hasActiveFilters}
      />

      <TableContainer
        component={Paper}
        sx={{
          mb: 1,
          maxHeight: 450,
          overflow: 'auto',
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {visibleColumns.date && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.date }}>Date</TableCell>
              )}
              {visibleColumns.assistant && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.assistant }}>Assistant</TableCell>
              )}
              {visibleColumns.educationLevel && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.educationLevel }}>Niveau scolaire</TableCell>
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
              {visibleColumns.rating && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.rating }}>Niveau de satisfaction</TableCell>
              )}
              {visibleColumns.comment && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.comment }}>Commentaire</TableCell>
              )}
              {visibleColumns.status && (
                <TableCell sx={{ ...headerCellStyle, width: columnWidths.status }}>Statut</TableCell>
              )}
            </TableRow>

            {/* Ligne pour les filtres */}
            <TableRow>
              {visibleColumns.date && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.date }}>
                  <FilterDateField column="date" value={searchFilters.date} />
                </TableCell>
              )}
              {visibleColumns.assistant && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.assistant }}>
                  <FilterSelect
                    column="assistant"
                    value={searchFilters.assistant}
                    options={AI_ASSISTANT_TYPE_OPTIONS}
                  />
                </TableCell>
              )}
              {visibleColumns.educationLevel && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.educationLevel }}>
                  <FilterSelect
                    column="educationLevel"
                    value={searchFilters.educationLevel}
                    options={AI_ASSISTANT_EDUCATION_LEVELS}
                  />
                </TableCell>
              )}
              {visibleColumns.subject && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.subject }}>
                  <FilterSelect
                    column="subject"
                    value={searchFilters.subject}
                    options={AI_ASSISTANT_SUBJECTS}
                  />
                </TableCell>
              )}
              {visibleColumns.chapter && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.chapter }}>
                  <FilterSelect
                    column="chapter"
                    value={searchFilters.chapter}
                    options={filteredChapters}
                  />
                </TableCell>
              )}
              {visibleColumns.exercise && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.exercise }}>
                  <FilterSelect
                    column="exercise"
                    value={searchFilters.exercise}
                    options={filteredExercises}
                  />
                </TableCell>
              )}
              {visibleColumns.rating && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.rating }}>
                  <FilterSelect
                    column="rating"
                    value={searchFilters.rating}
                    options={[
                      { value: '1', label: '1 étoile' },
                      { value: '2', label: '2 étoiles' },
                      { value: '3', label: '3 étoiles' },
                      { value: '4', label: '4 étoiles' },
                      { value: '5', label: '5 étoiles' }
                    ]}
                    valueFormatter={(val) => `${val} étoiles`}
                  />
                </TableCell>
              )}
              {visibleColumns.comment && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.comment }}>
                  <FilterTextField column="comment" value={searchFilters.comment} />
                </TableCell>
              )}
              {visibleColumns.status && (
                <TableCell sx={{ ...filterCellStyle, width: columnWidths.status }}>
                  <FilterSelect
                    column="status"
                    value={searchFilters.status}
                    options={[
                      { value: 'traité', label: 'Traité' },
                      { value: 'à traiter', label: 'À traiter' }
                    ]}
                  />
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedFeedbacks.length > 0 ? (
              displayedFeedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  {visibleColumns.date && (
                    <TableCell sx={{ width: columnWidths.date }}>{feedback.date}</TableCell>
                  )}
                  {visibleColumns.assistant && (
                    <TableCell sx={{ width: columnWidths.assistant }}>{feedback.assistant}</TableCell>
                  )}
                  {visibleColumns.educationLevel && (
                    <TableCell sx={{ width: columnWidths.educationLevel }}>{feedback.educationLevel || '-'}</TableCell>
                  )}
                  {visibleColumns.subject && (
                    <TableCell sx={{ width: columnWidths.subject }}>{feedback.subject || '-'}</TableCell>
                  )}
                  {visibleColumns.chapter && (
                    <TableCell sx={{ width: columnWidths.chapter }}>{feedback.chapter || '-'}</TableCell>
                  )}
                  {visibleColumns.exercise && (
                    <TableCell sx={{ width: columnWidths.exercise }}>
                      {feedback.exercise ?
                        AI_ASSISTANT_EXERCISES.find(ex => ex.value === feedback.exercise)?.label || feedback.exercise
                        : '-'}
                    </TableCell>
                  )}
                  {visibleColumns.rating && (
                    <TableCell sx={{ width: columnWidths.rating }}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} style={{ color: index < feedback.rating ? '#ffc107' : '#e0e0e0' }}>★</span>
                      ))}
                    </TableCell>
                  )}
                  {visibleColumns.comment && (
                    <TableCell sx={{ width: columnWidths.comment }}>{feedback.comment}</TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell sx={{ width: columnWidths.status }}>
                      <Chip
                        label={feedback.rating >= 4 ? "Traité" : "À traiter"}
                        color={feedback.rating >= 4 ? "success" : "warning"}
                        size="small"
                        variant={feedback.rating >= 4 ? "filled" : "outlined"}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={Object.values(visibleColumns).filter(Boolean).length} align="center">
                  Aucun résultat trouvé
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
        count={filteredFeedbacks.length}
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

export default RecentCommentsComponent;