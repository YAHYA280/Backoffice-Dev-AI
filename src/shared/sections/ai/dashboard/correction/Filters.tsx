"use client";

import fr from 'date-fns/locale/fr';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faRobot,
  faTimes,
  faCheck,
  faFilter,
  faSearch,
  faBookOpen,
  faPencilAlt,
  faChartLine,
  faRotateLeft,
  faCalendarAlt,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Grid,
  Radio,
  Drawer,
  Button,
  Divider,
  Checkbox,
  TextField,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import {
  correctionTypes 
} from '../../../../_mock/_correction_ai';
// Importation des fonctions helper pour les relations matière-chapitre-exercice
import {
  getChaptersBySubjects,
  getExercisesByChapters
} from '../../../../_mock/_subject_relationships';
import { 
  AI_ASSISTANT_SUBJECTS,
  AI_ASSISTANT_CHAPTERS,
  AI_ASSISTANT_EXERCISES,
  AI_ASSISTANT_TYPE_OPTIONS,
  AI_ASSISTANT_EDUCATION_LEVELS
} from '../../../../_mock/_ai-assistant';

import type { 
  FilterOptions , 
  CustomDateRange
} from '../../../../_mock/_correction_ai';

// Définition du type des props
interface FiltersProps {
  filters: FilterOptions;
  handleFilterChange: (name: keyof FilterOptions, value: any) => void;
  showJapprendsFilters?: boolean;
  onFilterApplied?: () => void;
  onSaveFilters?: (filters: FilterOptions) => void;
  onResetFilters?: () => void;
}

// Styled components
const FilterIcon = styled(FontAwesomeIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
}));

const drawerWidth = 450;

const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  handleFilterChange, 
  showJapprendsFilters = true,
  onFilterApplied,
  onSaveFilters,
  onResetFilters
}) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
    startDate: filters.startDate || null,
    endDate: filters.endDate || null,
  });
  
  // States for all filter types
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(
    Array.isArray(filters.assistants) ? filters.assistants : []
  );
  const [selectedCorrectionTypes, setSelectedCorrectionTypes] = useState<string[]>(
    Array.isArray(filters.correctionTypes) ? filters.correctionTypes : []
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    Array.isArray(filters.type) ? filters.type : []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    Array.isArray(filters.level) ? filters.level : []
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    Array.isArray(filters.subjects) ? filters.subjects : []
  );
  const [selectedChapters, setSelectedChapters] = useState<string[]>(
    Array.isArray(filters.chapters) ? filters.chapters : []
  );
  const [selectedExercises, setSelectedExercises] = useState<string[]>(
    Array.isArray(filters.exercises) ? filters.exercises : []
  );

  // States pour les chapitres et exercices filtrés disponibles
  const [availableChapters, setAvailableChapters] = useState<{ value: string, label: string }[]>([]);
  const [availableExercises, setAvailableExercises] = useState<{ value: string, label: string }[]>([]);

  // Initialize filter states from props
  useEffect(() => {
    setLocalFilters(filters);
    
    if (filters.correctionTypes) {
      setSelectedCorrectionTypes(Array.isArray(filters.correctionTypes) ? filters.correctionTypes : []);
    }
    
    if (filters.assistants) {
      setSelectedAssistants(Array.isArray(filters.assistants) ? filters.assistants : []);
    }
    
    if (filters.type) {
      setSelectedTypes(Array.isArray(filters.type) ? filters.type : []);
    }
    
    if (filters.level) {
      setSelectedLevels(Array.isArray(filters.level) ? filters.level : []);
    }
    
    if (filters.subjects) {
      setSelectedSubjects(Array.isArray(filters.subjects) ? filters.subjects : []);
    }
    
    if (filters.chapters) {
      setSelectedChapters(Array.isArray(filters.chapters) ? filters.chapters : []);
    }
    
    if (filters.exercises) {
      setSelectedExercises(Array.isArray(filters.exercises) ? filters.exercises : []);
    }
    
    setCustomDateRange({
      startDate: filters.startDate || null,
      endDate: filters.endDate || null
    });
  }, [filters]);

  // Mettre à jour les chapitres disponibles lorsque les matières sélectionnées changent
  useEffect(() => {
    if (selectedSubjects.length > 0) {
      // Obtenir tous les chapitres pour les matières sélectionnées
      const chapters = getChaptersBySubjects(selectedSubjects);
      
      // Convertir en format d'option pour l'affichage
      const chapterOptions = chapters.map(chapterValue => {
        const chapterOption = AI_ASSISTANT_CHAPTERS.find(c => c.value === chapterValue);
        return chapterOption || { value: chapterValue, label: chapterValue };
      });
      
      setAvailableChapters(chapterOptions);
      
      // Filtrer les chapitres sélectionnés pour ne garder que ceux qui sont disponibles
      const validSelectedChapters = selectedChapters.filter(chapter => 
        chapters.includes(chapter)
      );
      
      if (validSelectedChapters.length !== selectedChapters.length) {
        setSelectedChapters(validSelectedChapters);
        updateLocalFilters('chapters', validSelectedChapters);
      }
    } else {
      // Si aucune matière n'est sélectionnée, réinitialiser les chapitres disponibles
      setAvailableChapters([]);
      
      if (selectedChapters.length > 0) {
        setSelectedChapters([]);
        updateLocalFilters('chapters', []);
      }
    }
  }, [selectedSubjects , selectedChapters ]);

  // Mettre à jour les exercices disponibles lorsque les chapitres sélectionnés changent
  useEffect(() => {
    if (selectedSubjects.length > 0 && selectedChapters.length > 0) {
      // Obtenir tous les exercices pour les chapitres sélectionnés (dans le contexte des matières sélectionnées)
      const exercises = getExercisesByChapters(selectedSubjects, selectedChapters);
      
      // Convertir en format d'option pour l'affichage
      const exerciseOptions = exercises.map(exerciseValue => {
        const exerciseOption = AI_ASSISTANT_EXERCISES.find(e => e.value === exerciseValue);
        return exerciseOption || { value: exerciseValue, label: exerciseValue };
      });
      
      setAvailableExercises(exerciseOptions);
      
      // Filtrer les exercices sélectionnés pour ne garder que ceux qui sont disponibles
      const validSelectedExercises = selectedExercises.filter(exercise => 
        exercises.includes(exercise)
      );
      
      if (validSelectedExercises.length !== selectedExercises.length) {
        setSelectedExercises(validSelectedExercises);
        updateLocalFilters('exercises', validSelectedExercises);
      }
    } else {
      // Si aucun chapitre n'est sélectionné, réinitialiser les exercices disponibles
      setAvailableExercises([]);
      
      if (selectedExercises.length > 0) {
        setSelectedExercises([]);
        updateLocalFilters('exercises', []);
      }
    }
  }, [selectedSubjects, selectedChapters , selectedExercises]);

  // Mise à jour des filtres locaux
  const updateLocalFilters = (name: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value,
      // Réinitialiser les filtres dépendants si nécessaire
      ...(name === 'subjects' ? { chapters: [], exercises: [] } : {}),
      ...(name === 'chapters' ? { exercises: [] } : {})
    }));
  };

  // Toggle the drawer open/closed
  const handleOpen = () => {
    setOpen(true);
  };

  // Close the drawer
  const handleClose = () => {
    setOpen(false);
    if (onFilterApplied) {
      onFilterApplied();
    }
  };

  // Gérer changement de période
  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as FilterOptions['period'];
    updateLocalFilters('period', value);
  };

  // Gérer changement de type d'assistant (sélection multiple)
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const {value} = event.target;
    
    if (checked) {
      // Si "all" est déjà sélectionné, le retirer
      const newTypes = selectedTypes.includes('all') 
        ? [value] 
        : [...selectedTypes, value];
      
      setSelectedTypes(newTypes);
      updateLocalFilters('type', newTypes);
    } else {
      const newTypes = selectedTypes.filter(type => type !== value);
      
      // Si aucun type n'est sélectionné, remettre "all"
      if (newTypes.length === 0) {
        setSelectedTypes(['all']);
        updateLocalFilters('type', ['all']);
      } else {
        setSelectedTypes(newTypes);
        updateLocalFilters('type', newTypes);
      }
    }
  };

  // Gérer changement de niveau d'éducation (sélection multiple)
  const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const {value} = event.target;
    
    if (checked) {
      // Si "all" est déjà sélectionné, le retirer
      const newLevels = selectedLevels.includes('all') 
        ? [value] 
        : [...selectedLevels, value];
      
      setSelectedLevels(newLevels);
      updateLocalFilters('level', newLevels);
    } else {
      const newLevels = selectedLevels.filter(level => level !== value);
      
      // Si aucun niveau n'est sélectionné, remettre "all"
      if (newLevels.length === 0) {
        setSelectedLevels(['all']);
        updateLocalFilters('level', ['all']);
      } else {
        setSelectedLevels(newLevels);
        updateLocalFilters('level', newLevels);
      }
    }
  };

  // Gestion des matières multiples avec checkboxes
  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const {value} = event.target;
    
    if (checked) {
      const newSubjects = [...selectedSubjects, value];
      setSelectedSubjects(newSubjects);
      updateLocalFilters('subjects', newSubjects);
    } else {
      const newSubjects = selectedSubjects.filter(subject => subject !== value);
      setSelectedSubjects(newSubjects);
      updateLocalFilters('subjects', newSubjects);
    }
  };

  // Gestion des chapitres multiples avec checkboxes
  const handleChapterChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const {value} = event.target;
    
    if (checked) {
      const newChapters = [...selectedChapters, value];
      setSelectedChapters(newChapters);
      updateLocalFilters('chapters', newChapters);
    } else {
      const newChapters = selectedChapters.filter(chapter => chapter !== value);
      setSelectedChapters(newChapters);
      updateLocalFilters('chapters', newChapters);
    }
  };

  // Gestion des exercices multiples avec checkboxes
  const handleExerciseChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const {value} = event.target;
    
    if (checked) {
      const newExercises = [...selectedExercises, value];
      setSelectedExercises(newExercises);
      updateLocalFilters('exercises', newExercises);
    } else {
      const newExercises = selectedExercises.filter(exercise => exercise !== value);
      setSelectedExercises(newExercises);
      updateLocalFilters('exercises', newExercises);
    }
  };

  // Gestion des types de correction multiples avec checkboxes
  const handleCorrectionTypeChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const {value} = event.target;
    
    if (checked) {
      const newCorrectionTypes = [...selectedCorrectionTypes, value];
      setSelectedCorrectionTypes(newCorrectionTypes);
      updateLocalFilters('correctionTypes', newCorrectionTypes);
    } else {
      const newCorrectionTypes = selectedCorrectionTypes.filter(type => type !== value);
      setSelectedCorrectionTypes(newCorrectionTypes);
      updateLocalFilters('correctionTypes', newCorrectionTypes);
    }
  };

  // Gérer changement de terme de recherche
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateLocalFilters('searchTerm', event.target.value);
  };

  // Gérer changement de date de début
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setCustomDateRange({ ...customDateRange, startDate: date });
      updateLocalFilters('startDate', date);
    }
  };

  // Gérer changement de date de fin
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setCustomDateRange({ ...customDateRange, endDate: date });
      updateLocalFilters('endDate', date);
    }
  };

  // Compter le nombre de filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (localFilters.period && localFilters.period !== 'last30days') count += 1;
    if (localFilters.searchTerm && localFilters.searchTerm.trim() !== '') count  += 1 ;
    
    if (localFilters.type && (Array.isArray(localFilters.type) && localFilters.type.length > 0 && !localFilters.type.includes('all'))) count  += 1;
    if (localFilters.level && (Array.isArray(localFilters.level) && localFilters.level.length > 0 && !localFilters.level.includes('all'))) count  += 1 ;
    
    if (localFilters.assistants && localFilters.assistants.length > 0) count += 1 ;
    if (localFilters.correctionTypes && localFilters.correctionTypes.length > 0) count += 1 ;
    if (localFilters.subjects && Array.isArray(localFilters.subjects) && localFilters.subjects.length > 0) count += 1 ;
    if (localFilters.chapters && Array.isArray(localFilters.chapters) && localFilters.chapters.length > 0) count  += 1 ;
    if (localFilters.exercises && Array.isArray(localFilters.exercises) && localFilters.exercises.length > 0) count  += 1 ;
    
    // Filtre de date personnalisé
    if (localFilters.period === 'custom' && (localFilters.startDate || localFilters.endDate)) count  += 1 ;
    
    return count;
  };

  // Réinitialisez tous les filtres
  const clearAllFilters = () => {
    // Utiliser les valeurs par défaut
    const defaultFilters: FilterOptions = {
      period: 'last30days',
      type: ['all'],
      level: ['all'],
      searchTerm: '',
      subjects: [],
      chapters: [],
      exercises: [],
      assistants: [],
      correctionTypes: [],
      startDate: null,
      endDate: null,
    };
    
    setLocalFilters(defaultFilters);
  
    // Réinitialiser les sélections
    setSelectedTypes(['all']);
    setSelectedLevels(['all']);
    setSelectedSubjects([]);
    setSelectedChapters([]);
    setSelectedExercises([]);
    setSelectedAssistants([]);
    setSelectedCorrectionTypes([]);
    
    // Réinitialiser les dates
    setCustomDateRange({ startDate: null, endDate: null });
    
    // Appliquer les filtres réinitialisés au composant parent
    if (onSaveFilters) {
      onSaveFilters(defaultFilters);
    } else {
      // Propager tous les changements au composant parent
      Object.keys(defaultFilters).forEach((key) => {
        handleFilterChange(key as keyof FilterOptions, defaultFilters[key as keyof FilterOptions]);
      });
    }
    
    // Appeler onResetFilters si existant
    if (onResetFilters) {
      onResetFilters();
    }
    
    // Fermer le tiroir de filtres si ouvert
    if (open) {
      handleClose();
    }
  };
  // Appliquer les filtres
  const handleApplyFilters = () => {
    if (onSaveFilters) {
      onSaveFilters(localFilters);
    } else {
      handleFilterChange('period', localFilters.period);
      handleFilterChange('type', localFilters.type);
      handleFilterChange('level', localFilters.level);
      handleFilterChange('searchTerm', localFilters.searchTerm);
      handleFilterChange('subjects', localFilters.subjects);
      handleFilterChange('chapters', localFilters.chapters);
      handleFilterChange('exercises', localFilters.exercises);
      handleFilterChange('assistants', localFilters.assistants);
      handleFilterChange('correctionTypes', localFilters.correctionTypes);
      handleFilterChange('startDate', localFilters.startDate);
      handleFilterChange('endDate', localFilters.endDate);
    }
    
    handleClose();
  };

  // Vérifier si le type japprends est actif
  const showJapprendsContent = () => 
     localFilters.type === 'all' || 
      (Array.isArray(localFilters.type) && (localFilters.type.includes('all') || localFilters.type.includes('japprends')));
  ;

  return (
    <>
      {/* Boutons de filtrage et de réinitialisation */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton 
          onClick={clearAllFilters}
          sx={{ 
            mr: 1,
            color: 'primary.main',
          }}
          title="Réinitialiser les filtres"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </IconButton>
        <IconButton 
          onClick={handleOpen}
          sx={{ 
            color: 'primary.main',
          }}
          title="Ouvrir les filtres"
        >
          <FontAwesomeIcon icon={faFilter} />
          {getActiveFiltersCount() > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: 'error.main',
                color: 'error.contrastText',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
              }}
            >
              {getActiveFiltersCount()}
            </Box>
          )}
        </IconButton>
      </Box>

      {/* Drawer de filtrage */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: drawerWidth },
            padding: 3,
          },
        }}
      >
        <Box sx={{ width: '100%' }}>
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="div" color="primary">
              <FontAwesomeIcon icon={faFilter} style={{ marginRight: '10px' }} />
              Filtres avancés
            </Typography>
            <Box sx={{ display: 'flex' }}>
              <IconButton 
                color="error"
                size="small"
                aria-label="Réinitialiser tous les filtres"
                onClick={clearAllFilters}
                sx={{ mr: 1 }}
              >
                <FontAwesomeIcon icon={faRotateLeft} />
              </IconButton>
              <IconButton 
                onClick={handleClose} 
                size="small"
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {getActiveFiltersCount()} filtre(s) actif(s)
            </Typography>
          </Box>
          {/* Boutons d'action */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={clearAllFilters}
              startIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              Réinitialiser
            </Button>
            <Button 
              variant="contained" 
              onClick={handleApplyFilters}
              startIcon={<FontAwesomeIcon icon={faCheck} />}
              color="primary"
            >
              Appliquer les filtres
            </Button>
          </Box>
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {/* Recherche */}
            <TextField
              fullWidth
              id="search-term"
              label="Rechercher"
              variant="outlined"
              size="small"
              value={localFilters.searchTerm || ''}
              onChange={handleSearchChange}
              sx={{ mb: 3, mt: 2 }} // Ajoutez une marge en haut (mt) pour déplacer vers le bas
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </Box>
                ),
              }}
            />

            {/* Types de correction */}
            <SectionTitle variant="subtitle2">
              <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px' }} />
              Types de correction
            </SectionTitle>
            <FormGroup sx={{ mb: 3 }}>
              {correctionTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox 
                      checked={selectedCorrectionTypes.includes(type)}
                      onChange={handleCorrectionTypeChange}
                      value={type}
                      size="small"
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />

            {/* Période */}
            <SectionTitle variant="subtitle2">
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px' }} />
              Période
            </SectionTitle>
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <RadioGroup
                value={localFilters.period}
                onChange={handlePeriodChange}
                name="period-options"
              >
                <FormControlLabel value="today" control={<Radio size="small" />} label="Aujourd'hui" />
                <FormControlLabel value="yesterday" control={<Radio size="small" />} label="Hier" />
                <FormControlLabel value="last7days" control={<Radio size="small" />} label="7 derniers jours" />
                <FormControlLabel value="last30days" control={<Radio size="small" />} label="30 derniers jours" />
                <FormControlLabel value="custom" control={<Radio size="small" />} label="Période personnalisée" />
              </RadioGroup>
            </FormControl>

            {localFilters.period === 'custom' && (
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Date de début"
                      value={customDateRange.startDate}
                      onChange={handleStartDateChange}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Date de fin"
                      value={customDateRange.endDate}
                      onChange={handleEndDateChange}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            )}
            <Divider sx={{ my: 2 }} />

            {/* Type d'assistant */}
            <SectionTitle variant="subtitle2">
              <FontAwesomeIcon icon={faRobot} style={{ marginRight: '10px' }} />
              Type d&apos;assistant
            </SectionTitle>
            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!selectedTypes.length || selectedTypes.includes('all')}
                    onChange={(e, checked) => {
                      if (checked) {
                        setSelectedTypes(['all']);
                        updateLocalFilters('type', ['all']);
                      }
                    }}
                    value="all"
                    size="small"
                  />
                }
                label="Tous les types"
              />
              {AI_ASSISTANT_TYPE_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox 
                      checked={selectedTypes.includes(option.value)}
                      onChange={handleTypeChange}
                      value={option.value}
                      size="small"
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />

            {/* Niveau */}
            <SectionTitle variant="subtitle2">
              <FontAwesomeIcon icon={faGraduationCap} style={{ marginRight: '10px' }} />
              Niveau
            </SectionTitle>
            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!selectedLevels.length || selectedLevels.includes('all')}
                    onChange={(e, checked) => {
                      if (checked) {
                        setSelectedLevels(['all']);
                        updateLocalFilters('level', ['all']);
                      }
                    }}
                    value="all"
                    size="small"
                  />
                }
                label="Tous les niveaux"
              />
              {AI_ASSISTANT_EDUCATION_LEVELS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox 
                      checked={selectedLevels.includes(option.value)}
                      onChange={handleLevelChange}
                      value={option.value}
                      size="small"
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />

            {/* Afficher les filtres spécifiques à J'apprends si nécessaire */}
            {showJapprendsContent() && showJapprendsFilters && (
              <>
                {/* Matières */}
                <SectionTitle variant="subtitle2">
                  <FontAwesomeIcon icon={faBook} style={{ marginRight: '10px' }} />
                  Matière
                </SectionTitle>
                <FormGroup sx={{ mb: 3 }}>
                  {AI_ASSISTANT_SUBJECTS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox 
                          checked={selectedSubjects.includes(option.value)}
                          onChange={handleSubjectChange}
                          value={option.value}
                          size="small"
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </FormGroup>
                <Divider sx={{ my: 2 }} />

                {/* Chapitres - N'afficher que les chapitres des matières sélectionnées */}
                {selectedSubjects.length > 0 && (
                  <>
                    <SectionTitle variant="subtitle2">
                      <FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '10px' }} />
                      Chapitre
                    </SectionTitle>
                    <FormGroup sx={{ mb: 3 }}>
                      {availableChapters.length > 0 ? (
                        availableChapters.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            control={
                              <Checkbox 
                                checked={selectedChapters.includes(option.value)}
                                onChange={handleChapterChange}
                                value={option.value}
                                size="small"
                              />
                            }
                            label={option.label}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sélectionnez une matière pour voir les chapitres
                        </Typography>
                      )}
                    </FormGroup>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}
{/* Exercices - N'afficher que les exercices des chapitres sélectionnés */}
{selectedSubjects.length > 0 && selectedChapters.length > 0 && (
  <>
    <SectionTitle variant="subtitle2">
      <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: '10px' }} />
      Exercice
    </SectionTitle>
    <FormGroup sx={{ mb: 3 }}>
      {availableExercises.length > 0 ? (
        availableExercises.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox 
                checked={selectedExercises.includes(option.value)}
                onChange={handleExerciseChange}
                value={option.value}
                size="small"
              />
            }
            label={option.label}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          Sélectionnez un chapitre pour voir les exercices
        </Typography>
      )}
    </FormGroup>
  </>
)}
              </>
            )}
          </Box>
          <Divider sx={{ my: 3 }} />
        </Box>
      </Drawer>
    </>
  );
};

export default Filters;