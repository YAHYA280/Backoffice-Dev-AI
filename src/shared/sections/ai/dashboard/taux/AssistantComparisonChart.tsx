import type { SelectChangeEvent } from '@mui/material/Select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState, useEffect , useCallback } from 'react';
import { Bar, Pie, Cell, XAxis, YAxis, BarChart, PieChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import {
  faBook,
  faSyncAlt,
  faBookOpen,
  faPencilAlt,
  faFileExport ,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Card,
  Grid,
  Tabs,
  Button,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  CardContent,
  FormControl,
  useMediaQuery
} from '@mui/material';

import { filterAssistantData, mockAssistantComparison } from '../../../../_mock/_mock_taux_ai';
import { getChaptersBySubject, getExercisesByChapter } from '../../../../_mock/_subject_relationships';
import {
  AI_ASSISTANT_SUBJECTS,
  AI_ASSISTANT_TYPE_OPTIONS,
  AI_ASSISTANT_EDUCATION_LEVELS
} from '../../../../_mock/_ai-assistant';

import type { FilterOptions, AssistantType, EducationLevel, AssistantSatisfactionData } from './type';

// Couleurs pour les graphiques - cohérentes entre tous les onglets
const COLORS = ['#4caf50', '#8bc34a', '#ff9800', '#f44336', '#2196f3'];

// Interface pour les propriétés du TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Composant pour le contenu des onglets
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`satisfaction-tabpanel-${index}`}
      aria-labelledby={`satisfaction-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface AssistantComparisonChartProps {
  data: AssistantSatisfactionData[];
  filters: FilterOptions;
  isLoading: boolean;
  onExportCSV: () => void; // Add this line
}

const AssistantComparisonChart: React.FC<AssistantComparisonChartProps> = ({
  data,
  filters ,
  isLoading,  // Add this
  onExportCSV  // Add this
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State pour gérer les onglets - commencer directement à l'index 0 (par type)
  const [tabValue, setTabValue] = useState(0);

  // States pour les filtres locaux
  const [filteredData, setFilteredData] = useState<AssistantSatisfactionData[]>(data);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [availableChapters, setAvailableChapters] = useState<string[]>([]);
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  // Mettre à jour les filtres locaux quand les filtres globaux changent
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Gestion du changement d'onglet
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mettre à jour les données filtrées quand les filtres changent
  useEffect(() => {
    const newFilters: FilterOptions = {
      ...localFilters,
      types: selectedType ? [selectedType as AssistantType] : ['all' as AssistantType],
      levels: selectedLevel ? [selectedLevel as EducationLevel] : ['all' as EducationLevel],
      subjects: selectedSubject ? [selectedSubject] : [],
      chapters: selectedChapter ? [selectedChapter] : [],
      exercises: selectedExercise ? [selectedExercise] : []
    };
    setFilteredData(filterAssistantData(newFilters));
  }, [selectedType, selectedLevel, selectedSubject, selectedChapter, selectedExercise, localFilters]);

  // Mettre à jour les chapitres disponibles quand la matière sélectionnée change
  useEffect(() => {
    if (selectedSubject) {
      const chapters = getChaptersBySubject(selectedSubject);
      setAvailableChapters(chapters);
      // Réinitialiser le chapitre sélectionné
      setSelectedChapter('');
      setAvailableExercises([]);
    } else {
      setAvailableChapters([]);
      setSelectedChapter('');
      setAvailableExercises([]);
    }
  }, [selectedSubject]);

  // Mettre à jour les exercices disponibles quand le chapitre sélectionné change
  useEffect(() => {
    if (selectedSubject && selectedChapter) {
      const exercises = getExercisesByChapter(selectedSubject, selectedChapter);
      setAvailableExercises(exercises);
    } else {
      setAvailableExercises([]);
    }
  }, [selectedSubject, selectedChapter]);

  // Fonction pour réinitialiser tous les filtres
  const handleResetFilters = () => {
    setSelectedType('');
    setSelectedLevel('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedExercise('');
    // Mise à jour automatique via les useEffect
  };

  // Gestionnaires pour les changements de sélection
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value);
  };

  const handleLevelChange = (event: SelectChangeEvent<string>) => {
    setSelectedLevel(event.target.value);
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    setSelectedSubject(event.target.value);
  };

  const handleChapterChange = (event: SelectChangeEvent<string>) => {
    setSelectedChapter(event.target.value);
  };

  const handleExerciseChange = (event: SelectChangeEvent<string>) => {
    setSelectedExercise(event.target.value);
  };

  // Fonction pour extraire le nom à afficher en fonction des filtres actifs
  const extractChapterName = useCallback((fullName: string) => {
    // If an exercise is selected, display only the exercise name
    if (selectedExercise && fullName.includes(selectedExercise)) {
      return selectedExercise;
    }
  
    // If a chapter is selected, display only the chapter name
    if (selectedChapter && fullName.includes(selectedChapter)) {
      return selectedChapter;
    }
  
    // If a subject is selected but no chapter, try to extract the chapter name
    if (selectedSubject) {
      // Find all chapters available for this subject
      const chapters = availableChapters || [];
  
      // Check if the name contains one of the chapters
      const foundChapter = chapters.find(chapter => fullName.includes(chapter));
      if (foundChapter) {
        return foundChapter;
      }
  
      // If no chapter is found, return the subject name
      return selectedSubject;
    }
  
    // If no specific filter is active, return a short name
    const nameParts = fullName.split(' ');
    if (nameParts.length > 3) {
      return `${nameParts.slice(0, 3).join(' ')}...`;
    }
  
    return fullName;
  }, [selectedExercise, selectedChapter, selectedSubject, availableChapters]);

  // Vérification si des filtres sont actifs
  const hasActiveFilters = selectedType || selectedLevel || selectedSubject || selectedChapter || selectedExercise;

  // Données pour le graphique par type
  const typeDistributionData = useMemo(() => {
    // Regrouper les données par type
    const typeData: Record<string, number[]> = {};

    mockAssistantComparison.forEach(item => {
      if (!typeData[item.type]) {
        typeData[item.type] = [];
      }
      typeData[item.type].push(item.satisfactionRate);
    });

    // Calculer les moyennes par type
    return Object.entries(typeData).map(([type, rates]) => ({
      name: AI_ASSISTANT_TYPE_OPTIONS.find(t => t.value === type)?.label || type,
      value: parseFloat((rates.reduce((sum, val) => sum + val, 0) / rates.length).toFixed(1))
    }));
  }, []);

  // Données pour le graphique par niveau
  const levelDistributionData = useMemo(() => {
    // Filtrer par type si sélectionné
    const filteredByType = selectedType
      ? mockAssistantComparison.filter(item => item.type === selectedType)
      : mockAssistantComparison;

    // Regrouper les données par niveau
    const levelData: Record<string, number[]> = {};

    filteredByType.forEach(item => {
      if (!levelData[item.level]) {
        levelData[item.level] = [];
      }
      levelData[item.level].push(item.satisfactionRate);
    });

    // Calculer les moyennes par niveau
    return Object.entries(levelData)
      .filter(([level]) => level !== 'all')
      .map(([level, rates]) => ({
        name: level.toUpperCase(),
        value: parseFloat((rates.reduce((sum, val) => sum + val, 0) / rates.length).toFixed(1))
      }));
  }, [selectedType]);

  // Données pour le graphique par matière
  const subjectDistributionData = useMemo(() => {
    if (!selectedLevel && !selectedType) return [];

    // Filtrer par niveau et type si sélectionnés
    const filteredItems = mockAssistantComparison.filter(item =>
      (!selectedLevel || item.level === selectedLevel) &&
      (!selectedType || item.type === selectedType)
    );

    // Regrouper par matière (en utilisant le nom qui contient la matière)
    const subjectData: Record<string, number[]> = {};

    AI_ASSISTANT_SUBJECTS.forEach(subject => {
      const subjectName = subject.value;
      const items = filteredItems.filter(item => item.name.includes(subjectName));

      if (items.length > 0) {
        subjectData[subjectName] = items.map(item => item.satisfactionRate);
      }
    });

    // Calculer les moyennes par matière
    return Object.entries(subjectData).map(([subject, rates]) => ({
      name: subject,
      value: parseFloat((rates.reduce((sum, val) => sum + val, 0) / rates.length).toFixed(1))
    }));
  }, [selectedLevel, selectedType]);

  // Données transformées pour l'affichage dans l'onglet 4
  // Dans la partie transformedFilteredData avec les types corrects
const transformedFilteredData = useMemo(() => {
  // Si aucun filtre n'est sélectionné, on retourne un tableau vide
  if (!selectedType && !selectedLevel && !selectedSubject) {
    return [];
  }

  // Si seulement le type et/ou le niveau sont sélectionnés (sans sujet)
  if ((selectedType || selectedLevel) && !selectedSubject) {
    // Grouper par matière comme dans l'onglet 3
    const subjectData: Record<string, AssistantSatisfactionData> = {};
    
    AI_ASSISTANT_SUBJECTS.forEach(subject => {
      const subjectName = subject.value;
      const items = filteredData.filter(item => item.name.includes(subjectName));
      
      if (items.length > 0) {
        // Calculer la moyenne de satisfaction pour cette matière
        const avgSatisfaction = parseFloat(
          (items.reduce((sum, item) => sum + item.satisfactionRate, 0) / items.length).toFixed(1)
        );
        
        // Ajouter à notre structure de données avec le typage correct
        subjectData[subjectName] = {
          name: subject.label || subjectName,
          type: selectedType || 'all',
          level: selectedLevel || 'all',
          satisfactionRate: avgSatisfaction,
          totalUsers: items.reduce((sum, item) => sum + item.totalUsers, 0),
          displayName: subject.label || subjectName  // Ajout du champ displayName
        } as AssistantSatisfactionData & { displayName: string };
      }
    });
    
    // Convertir en tableau pour l'affichage
    return Object.values(subjectData);
  }
  
  // Si des filtres plus spécifiques sont sélectionnés (comportement original)
  return filteredData.map(item => ({
    ...item,
    displayName: extractChapterName(item.name)
  }));
}, [filteredData, selectedType, selectedLevel, selectedSubject, extractChapterName]);

// Modifiez également la fonction extractChapterName pour gérer le cas où 
// selectedSubject est défini mais pas de chapitres disponibles

// Fonction pour exporter les données en CSV
  const handleExportCSV = () => {
    // Déterminer quelles données exporter en fonction de l'onglet actif
    let dataToExport;
    switch (tabValue) {
      case 0:
        dataToExport = typeDistributionData;
        break;
      case 1:
        dataToExport = levelDistributionData;
        break;
      case 2:
        dataToExport = subjectDistributionData;
        break;
      case 3:
        dataToExport = transformedFilteredData;
        break;
      default:
        dataToExport = filteredData;
    }
    onExportCSV();

    // Convertir les données en format CSV
    let csvContent = "data:text/csv;charset=utf-8,";

    // Ajouter la ligne d'en-tête
    const headers = Object.keys(dataToExport[0] || {}).join(",");
    csvContent += `${headers}\r\n`;  // Utilisation de template literal

    // Ajouter les lignes de données
    dataToExport.forEach(item => {
      const row = Object.values(item).join(",");
      csvContent += `${row}\r\n`;  // Utilisation de template literal
    });

    // Créer un lien de téléchargement et déclencher le téléchargement
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export-tab-${tabValue}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardContent>
        {/* Navigation par onglets */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', flex: 1 }}
          >
          <Tab label="Par Type" icon={<FontAwesomeIcon icon={faGraduationCap} />} iconPosition="start" />
          <Tab label="Par Niveau" icon={<FontAwesomeIcon icon={faBook} />} iconPosition="start" />
          <Tab label="Par Matière" icon={<FontAwesomeIcon icon={faBookOpen} />} iconPosition="start" />
          <Tab label="Par Chapitre/Exercice" icon={<FontAwesomeIcon icon={faPencilAlt} />} iconPosition="start" />
          <Button
  variant="text"
  startIcon={<FontAwesomeIcon icon={faFileExport} />}
  color="primary"
  onClick={handleExportCSV}
  size="small"
  style={{ position: 'absolute', right: '10px' }}
/>
        </Tabs>

        {/* Onglet 1: Répartition par type d'assistant */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={typeDistributionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <RechartsTooltip
                      formatter={(value: number) => [`${value}%`, 'Taux de satisfaction']}
                    />
                    <Bar
                      dataKey="value"
                      name="Taux de satisfaction moyen"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    >
                      {typeDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.value >= 80 ? COLORS[0] :
                            entry.value >= 60 ? COLORS[1] :
                            entry.value >= 40 ? COLORS[2] :
                            COLORS[3]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {typeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => [`${value}%`, 'Taux de satisfaction']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Onglet 2: Répartition par niveau */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Type d&apos;assistant</InputLabel>
                <Select
                  value={selectedType}
                  label="Type d'assistant"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="">Tous les types</MenuItem>
                  {AI_ASSISTANT_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                {selectedType && (
                  <Button
                    variant="text"
                    color="secondary"
                    startIcon={<FontAwesomeIcon icon={faSyncAlt} />}
                    onClick={handleResetFilters}
                    size="small"
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={levelDistributionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <RechartsTooltip
                      formatter={(value: number) => [`${value}%`, 'Taux de satisfaction']}
                    />
                    <Bar
                      dataKey="value"
                      name="Taux de satisfaction moyen"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    >
                      {levelDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.value >= 80 ? COLORS[0] :
                            entry.value >= 60 ? COLORS[1] :
                            entry.value >= 40 ? COLORS[2] :
                            COLORS[3]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={levelDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {levelDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => [`${value}%`, 'Taux de satisfaction']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Onglet 3: Répartition par matière */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth size="small">
                <InputLabel>Type d&apos;assistant</InputLabel>
                <Select
                  value={selectedType}
                  label="Type d'assistant"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="">Tous les types</MenuItem>
                  {AI_ASSISTANT_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth size="small">
                <InputLabel>Niveau éducatif</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Niveau éducatif"
                  onChange={handleLevelChange}
                >
                  <MenuItem value="">Tous les niveaux</MenuItem>
                  {AI_ASSISTANT_EDUCATION_LEVELS.map((option) => (
                    <MenuItem key={option.value} value={option.value.toLowerCase()}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                {hasActiveFilters && (
                  <Button
                    variant="text"
                    color="secondary"
                    startIcon={<FontAwesomeIcon icon={faSyncAlt} />}
                    onClick={handleResetFilters}
                    size="small"
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          {subjectDistributionData.length > 0 ? (
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectDistributionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <RechartsTooltip
                    formatter={(value: number) => [`${value}%`, 'Taux de satisfaction']}
                  />
                  <Bar
                    dataKey="value"
                    name="Taux de satisfaction moyen"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  >
                    {subjectDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.value >= 80 ? COLORS[0] :
                          entry.value >= 60 ? COLORS[1] :
                          entry.value >= 40 ? COLORS[2] :
                          COLORS[3]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Sélectionnez un type d&apos;assistant et/ou un niveau pour voir les données par matière
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Onglet 4: Répartition par chapitre/exercice */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type d&apos;assistant</InputLabel>
                <Select
                  value={selectedType}
                  label="Type d'assistant"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="">Tous les types</MenuItem>
                  {AI_ASSISTANT_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Niveau éducatif</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Niveau éducatif"
                  onChange={handleLevelChange}
                >
                  <MenuItem value="">Tous les niveaux</MenuItem>
                  {AI_ASSISTANT_EDUCATION_LEVELS.map((option) => (
                    <MenuItem key={option.value} value={option.value.toLowerCase()}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>Matière</InputLabel>
                <Select
                  value={selectedSubject}
                  label="Matière"
                  onChange={handleSubjectChange}
                >
                  <MenuItem value="">Toutes les matières</MenuItem>
                  {AI_ASSISTANT_SUBJECTS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl
                fullWidth
                size="small"
                disabled={availableChapters.length === 0}
              >
                <InputLabel>Chapitre</InputLabel>
                <Select
                  value={selectedChapter}
                  label="Chapitre"
                  onChange={handleChapterChange}
                >
                  <MenuItem value="">Tous les chapitres</MenuItem>
                  {availableChapters.map((chapter) => (
                    <MenuItem key={chapter} value={chapter}>{chapter}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl
                fullWidth
                size="small"
                disabled={!selectedChapter || availableExercises.length === 0}
              >
                <InputLabel>Exercice</InputLabel>
                <Select
                  value={selectedExercise}
                  label="Exercice"
                  onChange={handleExerciseChange}
                >
                  <MenuItem value="">Tous les exercices</MenuItem>
                  {availableExercises.map((exercise) => (
                    <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                {hasActiveFilters && (
                  <Button
                    variant="text"
                    color="secondary"
                    startIcon={<FontAwesomeIcon icon={faSyncAlt} />}
                    onClick={handleResetFilters}
                    size="small"
                  />
                )}
              </Box>
            </Grid>
          </Grid>

{/* Dans la partie TabPanel pour l'index 3 */}
{transformedFilteredData.length > 0 ? (
  <Box sx={{ height: 400 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={transformedFilteredData}
        margin={{ top: 5, right: 30, left: 20, bottom: !selectedSubject ? 30 : 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="displayName"
          tick={{ fontSize: 11 }}
          textAnchor={!selectedSubject ? "middle" : "end"}
          height={!selectedSubject ? 50 : 100}
          tickMargin={10}
          angle={!selectedSubject ? 0 : 0}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <RechartsTooltip
          formatter={(value: number) => [`${value}%`, 'Taux de satisfaction']}
          labelFormatter={(label) => `${label}`}
        />
        <Bar
          dataKey="satisfactionRate"
          name="Taux de satisfaction"
          fill={theme.palette.primary.main}
          radius={[4, 4, 0, 0]}
        >
          {transformedFilteredData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.satisfactionRate >= 80 ? COLORS[0] :
                entry.satisfactionRate >= 60 ? COLORS[1] :
                entry.satisfactionRate >= 40 ? COLORS[2] :
                COLORS[3]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Box>
) : (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, bgcolor: 'background.paper', borderRadius: 1 }}>
    <Typography variant="subtitle1" color="text.secondary">
      {!hasActiveFilters ?
        "Sélectionnez un type d'assistant et/ou un niveau pour voir les données" :
        "Aucune donnée ne correspond à vos critères. Essayez de modifier vos filtres."
      }
    </Typography>
  </Box>
)}
        </TabPanel>
      </CardContent>
    </Card>
  );
}

export default AssistantComparisonChart;