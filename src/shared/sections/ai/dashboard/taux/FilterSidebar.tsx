"use client";

import { fr } from 'date-fns/locale';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faTimes,
  faRobot,
  faCheck,
  faFilter,
  faSearch,
  faBookOpen,
  faPencilAlt,
  faChalkboard,
  faRotateLeft,
  faCalendarAlt,
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
  Typography,
  IconButton,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

// Mock data imports
import {
  allLevels,
  allSubjects,
  allAssistantTypes,
  getChaptersBySubject,
  getExercisesByChapter,
} from './_mock_learning_content';

import type { FilterOptions, AssistantType, EducationLevel } from './type';

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

// Style pour le fond du select multiple
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Valeurs par défaut des filtres
const defaultFilters: FilterOptions = {
  period: 'last30days',
  levels: ['all'],
  types: ['all'],
  subjects: [],
  chapters: [],
  exercises: [],
  searchTerm: '',
  // Pour la compatibilité avec l'ancien code
  level: 'all',
  type: 'all',
};

interface FilterSidebarProps {
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  onSaveFilters?: (filters: FilterOptions) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onApplyFilters,
  onResetFilters,
  onSaveFilters,
}) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(
    filters || defaultFilters
  );
  
  // États pour gérer les sélections multiples
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    Array.isArray(localFilters.types) ? localFilters.types : []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    Array.isArray(localFilters.levels) ? localFilters.levels : []
  );
  
  // États pour gérer les chapitres et exercices en fonction des matières sélectionnées
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  
  // États pour les dates personnalisées
  const [customDateRange, setCustomDateRange] = useState({
    startDate: localFilters.startDate || null,
    endDate: localFilters.endDate || null,
  });

  // Déterminer si les sections suivantes doivent être affichées
  const showSubjects = localFilters.types?.includes('Apprentissge');
  const showChapters = showSubjects && localFilters.subjects && localFilters.subjects.length > 0;
  const showExercises = showChapters && localFilters.chapters && localFilters.chapters.length > 0;
  // Mise à jour des filtres locaux - Solution corrigée sans dépendances circulaires
  const handleFilterChange = useCallback((name: keyof FilterOptions, value: any) => {
    setLocalFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      if (name === 'levels') {
        // Cast the string[] to EducationLevel[]
        updatedFilters.levels = value as EducationLevel[];
        updatedFilters.level = value.includes('all') ? 'all' : value[0] as EducationLevel;
        setSelectedLevels(value);
      } 
      else if (name === 'types') {
        // Cast the string[] to AssistantType[]
        updatedFilters.types = value as AssistantType[];
        updatedFilters.type = value.includes('all') ? 'all' : value[0] as AssistantType;
        
        // Réinitialiser les filtres associés si "Apprentissge" est retiré
        if (!value.includes('Apprentissge') && prevFilters.types?.includes('Apprentissge')) {
          updatedFilters.subjects = [];
          updatedFilters.chapters = [];
          updatedFilters.exercises = [];
        }
        
        setSelectedTypes(value);
      }
      else if (name === 'startDate' || name === 'endDate') {
        updatedFilters[name] = value;
        setCustomDateRange(prev => ({
          ...prev,
          [name]: value
        }));
      }
      else {
        // Use a type assertion for the specific property
        (updatedFilters as any)[name] = value;
        
        // Réinitialiser les filtres dépendants si nécessaire
        if (name === 'subjects') {
          updatedFilters.chapters = [];
          updatedFilters.exercises = [];
        }
        else if (name === 'chapters') {
          updatedFilters.exercises = [];
        }
      }
      
      return updatedFilters;
    });
  }, []);

  // Mise à jour des filtres locaux lorsque les filtres props changent
  useEffect(() => {
    setLocalFilters(filters);
    setSelectedTypes(Array.isArray(filters.types) ? filters.types : []);
    setSelectedLevels(Array.isArray(filters.levels) ? filters.levels : []);
    setCustomDateRange({
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
    });
  }, [filters]);

  // Effet pour mettre à jour les chapitres disponibles
  useEffect(() => {
    if (localFilters.subjects && localFilters.subjects.length > 0) {
      const chapters: string[] = [];
      
      localFilters.subjects.forEach(subject => {
        const subjectChapters = getChaptersBySubject(subject);
        chapters.push(...subjectChapters);
      });
      
      setAvailableChapters(Array.from(new Set(chapters)));
    } else {
      setAvailableChapters([]);
    }
  }, [localFilters.subjects]);
  
  // Effet séparé pour valider les chapitres sélectionnés
  useEffect(() => {
    if (localFilters.chapters && localFilters.chapters.length > 0 && availableChapters.length > 0) {
      const validChapters = localFilters.chapters.filter(chapter => 
        availableChapters.includes(chapter)
      );
      
      if (validChapters.length !== localFilters.chapters.length) {
        handleFilterChange('chapters', validChapters);
      }
    } else if (localFilters.chapters && localFilters.chapters.length > 0 && availableChapters.length === 0) {
      handleFilterChange('chapters', []);
    }
  }, [availableChapters, localFilters.chapters, handleFilterChange]);

  // Effet pour mettre à jour les exercices disponibles
  useEffect(() => {
    if (localFilters.subjects && localFilters.subjects.length > 0 && 
        localFilters.chapters && localFilters.chapters.length > 0) {
      const exercises: string[] = [];
      
      localFilters.subjects.forEach(subject => {
        localFilters.chapters?.forEach(chapter => {
          const chapterExercises = getExercisesByChapter(subject, chapter);
          if (chapterExercises && chapterExercises.length > 0) {
            exercises.push(...chapterExercises);
          }
        });
      });
      
      setAvailableExercises(Array.from(new Set(exercises)));
    } else {
      setAvailableExercises([]);
    }
  }, [localFilters.subjects, localFilters.chapters]);
  
  // Effet séparé pour valider les exercices sélectionnés
  useEffect(() => {
    if (localFilters.exercises && localFilters.exercises.length > 0 && availableExercises.length > 0) {
      const validExercises = localFilters.exercises.filter(exercise => 
        availableExercises.includes(exercise)
      );
      
      if (validExercises.length !== localFilters.exercises.length) {
        handleFilterChange('exercises', validExercises);
      }
    } else if (localFilters.exercises && localFilters.exercises.length > 0 && availableExercises.length === 0) {
      handleFilterChange('exercises', []);
    }
  }, [availableExercises, localFilters.exercises, handleFilterChange]);

  // Ouverture du drawer
  const handleOpen = () => {
    setOpen(true);
  };

  // Fermeture du drawer
  const handleClose = () => {
    setOpen(false);
  };

  // Gestion du changement de période
  // Gestion du changement de période
  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as FilterOptions['period'];
    handleFilterChange('period', value);
  };

  // Gestion du changement de terme de recherche
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('searchTerm', event.target.value);
  };

  // Application des filtres et fermeture du drawer
  const handleApplyFilters = () => {
    // S'assurer que les propriétés de compatibilité sont mises à jour
    const updatedFilters = {
      ...localFilters,
      level: localFilters.levels?.includes('all') ? 'all' : localFilters.levels?.[0] as EducationLevel,
      type: localFilters.types?.includes('all') ? 'all' : localFilters.types?.[0] as AssistantType
    };
    
    // Utiliser onSaveFilters si disponible, sinon onApplyFilters
    if (onSaveFilters) {
      onSaveFilters(updatedFilters);
    } else {
      onApplyFilters(updatedFilters);
    }
    
    setOpen(false);
  };

  // Réinitialisation des filtres
  const handleResetFilters = () => {
    setLocalFilters(defaultFilters);
    setSelectedTypes(['all']);
    setSelectedLevels(['all']);
    setCustomDateRange({
      startDate: null,
      endDate: null
    });
    onResetFilters();
  };

  // Compter le nombre de filtres actifs
  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (localFilters.period && localFilters.period !== 'last30days') count += 1;
    if (localFilters.searchTerm && localFilters.searchTerm.trim() !== '') count += 1;
    
    if (localFilters.types && !localFilters.types.includes('all') && localFilters.types.length > 0) count += 1;
    if (localFilters.levels && !localFilters.levels.includes('all') && localFilters.levels.length > 0) count += 1;
    
    if (localFilters.subjects && localFilters.subjects.length > 0) count += 1;
    if (localFilters.chapters && localFilters.chapters.length > 0) count += 1;
    if (localFilters.exercises && localFilters.exercises.length > 0) count += 1;
    
    // Filtre de date personnalisé
    if (localFilters.period === 'custom' && (localFilters.startDate || localFilters.endDate)) count += 1;
    
    return count;
  };

  return (
    <>
      {/* Boutons de filtrage et de réinitialisation */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton 
          onClick={handleResetFilters}
          sx={{ 
            mr: 1,
            color: 'primary.main',
          }}
          title="Réinitialiser les filtres"
        >
          <FontAwesomeIcon icon={faRotateLeft} size='sm'/>
        </IconButton>
        <IconButton 
          onClick={handleOpen}
          sx={{ 
            color: 'primary.main',
          }}
          title="Ouvrir les filtres"
        >
          <FontAwesomeIcon icon={faFilter} size='sm'/>
        </IconButton>
      </Box>

      {/* Drawer de filtrage */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '450px' },
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
                onClick={handleResetFilters}
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
              onClick={handleResetFilters}
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
                      onChange={(date) => handleFilterChange('startDate', date)}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Date de fin"
                      value={customDateRange.endDate}
                      onChange={(date) => handleFilterChange('endDate', date)}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            )}
{/* Types d'assistants */}
<SectionTitle variant="subtitle2">
  <FontAwesomeIcon icon={faRobot} style={{ marginRight: '10px' }} />
  Types d&apos;assistants
</SectionTitle>
<FormGroup sx={{ mb: 3 }}>
  <FormControlLabel
    control={
      <Checkbox 
        checked={!selectedTypes.length || localFilters.types?.includes('all')}
        onChange={(e, checked) => {
          if (checked) {
            setSelectedTypes(['all']);
            handleFilterChange('types', ['all']);
          }
        }}
        value="all"
        size="small"
      />
    }
    label="Tous les types"
  />
  {allAssistantTypes.map((type) => (
    <FormControlLabel
      key={type}
      control={
        <Checkbox 
          checked={localFilters.types?.includes(type as AssistantType)}
          onChange={(e, checked) => {
            if (checked) {
              // Si "all" est déjà sélectionné, le retirer
              const newTypes = localFilters.types?.includes('all') 
                ? [type] 
                : [...(localFilters.types || []), type];
              
              setSelectedTypes(newTypes);
              handleFilterChange('types', newTypes);
            } else {
              const newTypes = localFilters.types?.filter(t => t !== type) || [];
              
              // Si aucun type n'est sélectionné, remettre "all"
              if (newTypes.length === 0) {
                setSelectedTypes(['all']);
                handleFilterChange('types', ['all']);
              } else {
                setSelectedTypes(newTypes);
                handleFilterChange('types', newTypes);
              }
            }
          }}
          value={type}
          size="small"
        />
      }
      label={type}
    />
  ))}
</FormGroup>

{/* Niveaux */}
<SectionTitle variant="subtitle2">
  <FontAwesomeIcon icon={faChalkboard} style={{ marginRight: '10px' }} />
  Niveaux
</SectionTitle>
<FormGroup sx={{ mb: 3 }}>
  <FormControlLabel
    control={
      <Checkbox 
        checked={!selectedLevels.length || localFilters.levels?.includes('all')}
        onChange={(e, checked) => {
          if (checked) {
            setSelectedLevels(['all']);
            handleFilterChange('levels', ['all']);
          }
        }}
        value="all"
        size="small"
      />
    }
    label="Tous les niveaux"
  />
  {allLevels.map((level) => (
    <FormControlLabel
      key={level}
      control={
        <Checkbox 
          checked={localFilters.levels?.includes(level as EducationLevel)}
          onChange={(e, checked) => {
            if (checked) {
              // Si "all" est déjà sélectionné, le retirer
              const newLevels = localFilters.levels?.includes('all') 
                ? [level] 
                : [...(localFilters.levels || []), level];
              
              setSelectedLevels(newLevels);
              handleFilterChange('levels', newLevels);
            } else {
              const newLevels = localFilters.levels?.filter(l => l !== level) || [];
              
              // Si aucun niveau n'est sélectionné, remettre "all"
              if (newLevels.length === 0) {
                setSelectedLevels(['all']);
                handleFilterChange('levels', ['all']);
              } else {
                setSelectedLevels(newLevels);
                handleFilterChange('levels', newLevels);
              }
            }
          }}
          value={level}
          size="small"
        />
      }
      label={level.toUpperCase()}
    />
  ))}
</FormGroup>

{/* Matières - Seulement si "Apprentissge" est sélectionné */}
{showSubjects && (
  <>
    <SectionTitle variant="subtitle2">
      <FontAwesomeIcon icon={faBook} style={{ marginRight: '10px' }} />
      Matières
    </SectionTitle>
    <FormGroup sx={{ mb: 3 }}>
      {allSubjects.map((subject) => (
        <FormControlLabel
          key={subject}
          control={
            <Checkbox 
              checked={localFilters.subjects?.includes(subject)}
              onChange={(e, checked) => {
                if (checked) {
                  const newSubjects = [...(localFilters.subjects || []), subject];
                  handleFilterChange('subjects', newSubjects);
                } else {
                  const newSubjects = localFilters.subjects?.filter(s => s !== subject) || [];
                  handleFilterChange('subjects', newSubjects);
                }
              }}
              value={subject}
              size="small"
            />
          }
          label={subject}
        />
      ))}
    </FormGroup>
  </>
)}

{/* Chapitres - Seulement si des matières sont sélectionnées */}
{showChapters && (
  <>
    <SectionTitle variant="subtitle2">
      <FontAwesomeIcon icon={faBookOpen} style={{ marginRight: '10px' }} />
      Chapitres
    </SectionTitle>
    <FormGroup sx={{ mb: 3 }}>
      {availableChapters.map((chapter) => (
        <FormControlLabel
          key={chapter}
          control={
            <Checkbox 
              checked={localFilters.chapters?.includes(chapter)}
              onChange={(e, checked) => {
                if (checked) {
                  const newChapters = [...(localFilters.chapters || []), chapter];
                  handleFilterChange('chapters', newChapters);
                } else {
                  const newChapters = localFilters.chapters?.filter(c => c !== chapter) || [];
                  handleFilterChange('chapters', newChapters);
                }
              }}
              value={chapter}
              size="small"
            />
          }
          label={chapter}
        />
      ))}
    </FormGroup>
  </>
)}

{/* Exercices - Seulement si des chapitres sont sélectionnés */}
{showExercises && (
  <>
    <SectionTitle variant="subtitle2">
      <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: '10px' }} />
      Exercices
    </SectionTitle>
    <FormGroup sx={{ mb: 3 }}>
      {availableExercises.map((exercise) => (
        <FormControlLabel
          key={exercise}
          control={
            <Checkbox 
              checked={localFilters.exercises?.includes(exercise)}
              onChange={(e, checked) => {
                if (checked) {
                  const newExercises = [...(localFilters.exercises || []), exercise];
                  handleFilterChange('exercises', newExercises);
                } else {
                  const newExercises = localFilters.exercises?.filter(ex => ex !== exercise) || [];
                  handleFilterChange('exercises', newExercises);
                }
              }}
              value={exercise}
              size="small"
            />
          }
          label={exercise}
        />
      ))}
    </FormGroup>
  </>
)}
          </Box>
          <Divider sx={{ my: 3 }} />
        </Box>
      </Drawer>
    </>
  );
};

export default FilterSidebar;