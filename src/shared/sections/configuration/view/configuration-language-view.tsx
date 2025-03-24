'use client';

import type { SelectChangeEvent } from '@mui/material/Select';

import { toast } from 'sonner';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faGlobe,
  faCheck,
  faTrash,
  faSearch,
  faFilter,
  faTimesCircle,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Label } from 'src/shared/components/label';

interface ILanguage {
  id: string;
  code: string;
  name: string;
  active: boolean;
  isDefault: boolean;
}

interface ILanguageSettings {
  multiLanguageEnabled: boolean;
  defaultLanguage: string;
  availableLanguages: ILanguage[];
}

interface IDialogState {
  open: boolean;
  mode: 'add' | 'edit' | 'delete';
  language?: ILanguage;
}

interface IFilterOption {
  column: string;
  operator: string;
  value: string;
}

const FILTER_OPERATORS = {
  text: [
    { value: 'contains', label: 'Contient' },
    { value: 'equals', label: 'Est égal à' },
    { value: 'startsWith', label: 'Commence par' },
    { value: 'endsWith', label: 'Termine par' },
  ],
  boolean: [{ value: 'equals', label: 'Est égal à' }],
};

const FILTER_COLUMNS = [
  { field: 'name', headerName: 'Nom', type: 'text' },
  { field: 'code', headerName: 'Code', type: 'text' },
  { field: 'active', headerName: 'Actif', type: 'boolean' },
  { field: 'isDefault', headerName: 'Par défaut', type: 'boolean' },
];

interface LanguageConfigurationProps {
  onAddLanguage: () => void;
  isAddLanguageDialogOpen: boolean;
  onCloseAddLanguageDialog: () => void;
}

// ----------------------------------------------------------------------

export function LanguageConfiguration({
  isAddLanguageDialogOpen,
  onAddLanguage,
  onCloseAddLanguageDialog,
}: LanguageConfigurationProps) {
  const [currentTab, setCurrentTab] = useState('all');
  const [dialogState, setDialogState] = useState<IDialogState>({
    open: false,
    mode: 'add',
  });
  const [newLanguage, setNewLanguage] = useState({ code: '', name: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Filter state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<IFilterOption[]>([]);
  const [tempFilters, setTempFilters] = useState<IFilterOption[]>([]);
  const [currentFilter, setCurrentFilter] = useState<IFilterOption>({
    column: 'name',
    operator: 'contains',
    value: '',
  });

  // Mock data
  const [settings, setSettings] = useState<ILanguageSettings>({
    multiLanguageEnabled: true,
    defaultLanguage: 'fr',
    availableLanguages: [
      { id: '1', code: 'fr', name: 'Français', active: true, isDefault: true },
      { id: '2', code: 'en', name: 'English', active: true, isDefault: false },
      { id: '3', code: 'es', name: 'Español', active: false, isDefault: false },
      { id: '4', code: 'de', name: 'Deutsch', active: false, isDefault: false },
    ],
  });

  useEffect(() => {
    if (isAddLanguageDialogOpen) {
      setDialogState({ open: true, mode: 'add' });
    }
  }, [isAddLanguageDialogOpen]);

  // Filter languages based on tab, search query, and advanced filters
  const filteredLanguages = useMemo(
    () =>
      settings.availableLanguages.filter((lang) => {
        // Filter by tab
        const matchesTab =
          currentTab === 'all' ||
          (currentTab === 'active' && lang.active) ||
          (currentTab === 'inactive' && !lang.active);

        // Filter by search query
        const matchesSearch =
          searchQuery === '' ||
          lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lang.code.toLowerCase().includes(searchQuery.toLowerCase());

        // Apply active filters
        const matchesFilters = activeFilters.every((filter) => {
          const fieldValue = lang[filter.column as keyof ILanguage];
          const filterValue = filter.value;

          if (typeof fieldValue === 'boolean') {
            return fieldValue === (filterValue === 'true');
          }

          if (typeof fieldValue === 'string') {
            switch (filter.operator) {
              case 'contains':
                return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
              case 'equals':
                return fieldValue.toLowerCase() === filterValue.toLowerCase();
              case 'startsWith':
                return fieldValue.toLowerCase().startsWith(filterValue.toLowerCase());
              case 'endsWith':
                return fieldValue.toLowerCase().endsWith(filterValue.toLowerCase());
              default:
                return true;
            }
          }

          return true;
        });

        return matchesTab && matchesSearch && matchesFilters;
      }),
    [settings.availableLanguages, currentTab, searchQuery, activeFilters]
  );

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleToggleLanguage = useCallback(
    (id: string) => {
      const updatedLanguages = settings.availableLanguages.map((lang) => {
        if (lang.id === id) {
          return { ...lang, active: !lang.active };
        }
        return lang;
      });

      setSettings({
        ...settings,
        availableLanguages: updatedLanguages,
      });

      toast.success('Le statut de la langue a été mis à jour avec succès');
    },
    [settings]
  );

  const handleSetDefaultLanguage = useCallback(
    (id: string) => {
      if (!settings.multiLanguageEnabled) return;

      const updatedLanguages = settings.availableLanguages.map((lang) => {
        if (lang.id === id) {
          return { ...lang, isDefault: true, active: true };
        }
        return { ...lang, isDefault: false };
      });

      const defaultLang = updatedLanguages.find((lang) => lang.id === id);

      setSettings({
        ...settings,
        defaultLanguage: defaultLang?.code || 'fr',
        availableLanguages: updatedLanguages,
      });

      toast.success('Langue par défaut est mise à jour avec succès');
    },
    [settings]
  );

  const handleToggleMultiLanguage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({
        ...settings,
        multiLanguageEnabled: event.target.checked,
      });

      toast.success(`Support multilingue ${event.target.checked ? 'activé' : 'désactivé'}`);
    },
    [settings]
  );

  const handleOpenDialog = (mode: 'add' | 'edit' | 'delete', language?: ILanguage) => {
    if (mode === 'edit' && language) {
      setNewLanguage({ code: language.code, name: language.name });
    } else if (mode === 'add') {
      setNewLanguage({ code: '', name: '' });
    }

    setDialogState({
      open: true,
      mode,
      language,
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ ...dialogState, open: false });
    setNewLanguage({ code: '', name: '' });
    onCloseAddLanguageDialog();
  };

  const handleAddLanguage = () => {
    if (!newLanguage.code || !newLanguage.name) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    // Check if code already exists (for add mode)
    if (
      dialogState.mode === 'add' &&
      settings.availableLanguages.some(
        (lang) => lang.code.toLowerCase() === newLanguage.code.toLowerCase()
      )
    ) {
      toast.error('Le code de langue existe déjà');
      return;
    }

    if (dialogState.mode === 'add') {
      // Fixed the radix parameter issue
      const newId = (
        Math.max(...settings.availableLanguages.map((lang) => parseInt(lang.id, 10))) + 1
      ).toString();

      setSettings({
        ...settings,
        availableLanguages: [
          ...settings.availableLanguages,
          {
            id: newId,
            code: newLanguage.code.toLowerCase(),
            name: newLanguage.name,
            active: false,
            isDefault: false,
          },
        ],
      });

      toast.success('Nouvelle langue ajoutée avec succès');
    } else if (dialogState.mode === 'edit' && dialogState.language) {
      const updatedLanguages = settings.availableLanguages.map((lang) => {
        if (lang.id === dialogState.language?.id) {
          return {
            ...lang,
            code: newLanguage.code.toLowerCase(),
            name: newLanguage.name,
          };
        }
        return lang;
      });

      setSettings({
        ...settings,
        availableLanguages: updatedLanguages,
        // Update default language code if this was the default language
        defaultLanguage: dialogState.language.isDefault
          ? newLanguage.code.toLowerCase()
          : settings.defaultLanguage,
      });

      toast.success('Langue mise à jour avec succès');
    }

    handleCloseDialog();
  };

  const handleDeleteLanguage = () => {
    if (!dialogState.language) return;

    if (dialogState.language.isDefault) {
      toast.error('Impossible de supprimer la langue par défaut');
      handleCloseDialog();
      return;
    }

    const updatedLanguages = settings.availableLanguages.filter(
      (lang) => lang.id !== dialogState.language?.id
    );

    setSettings({
      ...settings,
      availableLanguages: updatedLanguages,
    });

    toast.success('Langue supprimée avec succès');
    handleCloseDialog();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter handlers
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
    setTempFilters([...activeFilters]);
  };

  const handleCloseFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const handleChangeFilterColumn = (event: SelectChangeEvent<string>) => {
    const column = event.target.value;
    const columnType = FILTER_COLUMNS.find((col) => col.field === column)?.type || 'text';
    const defaultOperator = FILTER_OPERATORS[columnType as keyof typeof FILTER_OPERATORS][0].value;

    setCurrentFilter({
      ...currentFilter,
      column,
      operator: defaultOperator,
      value: '',
    });
  };

  const handleChangeFilterOperator = (event: SelectChangeEvent<string>) => {
    setCurrentFilter({
      ...currentFilter,
      operator: event.target.value,
    });
  };

  const handleChangeFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFilter({
      ...currentFilter,
      value: event.target.value,
    });
  };

  const handleAddFilter = () => {
    if (
      !currentFilter.value &&
      currentFilter.column !== 'active' &&
      currentFilter.column !== 'isDefault'
    ) {
      return;
    }

    setTempFilters([...tempFilters, { ...currentFilter }]);
    setCurrentFilter({
      ...currentFilter,
      value: '',
    });
  };

  const handleApplyFilters = () => {
    setActiveFilters([...tempFilters]);
    handleCloseFilterMenu();
  };

  const handleRemoveTempFilter = (index: number) => {
    const newFilters = [...tempFilters];
    newFilters.splice(index, 1);
    setTempFilters(newFilters);
  };

  const handleResetAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setCurrentTab('all');
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...activeFilters];
    newFilters.splice(index, 1);
    setActiveFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  const getFilterValueInput = () => {
    const columnType = FILTER_COLUMNS.find((col) => col.field === currentFilter.column)?.type;

    if (columnType === 'boolean') {
      return (
        <FormControl fullWidth margin="normal">
          <InputLabel>Valeur</InputLabel>
          <Select
            value={currentFilter.value}
            onChange={(e) =>
              setCurrentFilter({ ...currentFilter, value: e.target.value as string })
            }
            label="Valeur"
          >
            <MenuItem value="true">Oui</MenuItem>
            <MenuItem value="false">Non</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        fullWidth
        label="Valeur"
        value={currentFilter.value}
        onChange={handleChangeFilterValue}
        margin="normal"
      />
    );
  };

  const getFilterDisplayValue = (filter: IFilterOption): React.ReactNode => {
    const column = FILTER_COLUMNS.find((col) => col.field === filter.column);
    const operator = FILTER_OPERATORS[column?.type as keyof typeof FILTER_OPERATORS]?.find(
      (op) => op.value === filter.operator
    );

    if (column?.type === 'boolean') {
      return (
        <>
          {column.headerName}{' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>{operator?.label}</span>{' '}
          {filter.value === 'true' ? 'Oui' : 'Non'}
        </>
      );
    }

    return (
      <>
        {column?.headerName}{' '}
        <span style={{ color: 'red', fontWeight: 'bold' }}>{operator?.label}</span> {filter.value}
      </>
    );
  };

  const isFilterMenuOpen = Boolean(filterAnchorEl);

  return (
    <>
      <Card>
        <CardHeader
          title="Configuration des langues"
          action={
            <FormControlLabel
              control={
                <Switch
                  checked={settings.multiLanguageEnabled}
                  onChange={handleToggleMultiLanguage}
                />
              }
              label="Multi-langue"
            />
          }
          sx={{ mb: '20px' }}
        />

        <Box sx={{ px: 3, pb: 2 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Rechercher une langue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon
                        icon={faSearch}
                        style={{ color: theme.palette.primary.main }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <Typography variant="caption">×</Typography>
                      </IconButton>
                    </InputAdornment>
                  ) : (
                    <></>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Filtres">
                <IconButton
                  onClick={handleOpenFilterMenu}
                  sx={{ color: 'primary.main' }}
                  size="medium"
                >
                  <Badge badgeContent={activeFilters.length} color="primary">
                    <FontAwesomeIcon icon={faFilter} style={{ fontSize: '22px' }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Réinitialiser">
                <IconButton onClick={handleResetAllFilters} sx={{ mr: 1, color: 'primary.main' }}>
                  <FontAwesomeIcon icon={faSyncAlt} style={{ fontSize: '22px' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {/* Active filters display */}
          {activeFilters.length > 0 ? (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeFilters.map((filter, index) => (
                <Chip
                  key={index}
                  label={getFilterDisplayValue(filter)}
                  onDelete={() => handleRemoveFilter(index)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
              <Chip
                label="Effacer les filtres"
                onClick={handleClearAllFilters}
                color="error"
                variant="outlined"
                size="small"
                icon={<FontAwesomeIcon icon={faTimesCircle} />}
              />
            </Box>
          ) : (
            <></>
          )}

          <Tabs value={currentTab} onChange={handleTabChange}>
            {[
              { value: 'all', label: 'Tout' },
              { value: 'active', label: 'Actif' },
              { value: 'inactive', label: 'Inactif' },
            ].map((tab) => {
              // Calculate the count for each tab
              let count = 0;
              if (tab.value === 'all') {
                count = filteredLanguages.length;
              } else if (tab.value === 'active') {
                count = filteredLanguages.filter((lang) => lang.active).length;
              } else if (tab.value === 'inactive') {
                count = filteredLanguages.filter((lang) => !lang.active).length;
              }

              // Format the count as a two-digit string
              const formattedCount = String(count).padStart(2, '0');

              return (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'
                      }
                      color={(tab.value === 'active' && 'success') || 'default'}
                    >
                      {formattedCount}
                    </Label>
                  }
                  sx={{ textTransform: 'capitalize' }}
                />
              );
            })}
          </Tabs>
        </Box>

        <CardContent>
          {filteredLanguages.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Aucune langue trouvée pour votre recherche.
            </Alert>
          ) : (
            <Stack spacing={3}>
              {filteredLanguages.map((language) => (
                <Stack
                  key={language.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                    ...(language.isDefault && {
                      border: (t) => `1px solid ${t.palette.primary.main}`,
                    }),
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <FontAwesomeIcon icon={faGlobe} />
                    <Box>
                      <Typography variant="subtitle1">{language.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {language.code.toUpperCase()}
                      </Typography>
                    </Box>
                    {language.isDefault ? (
                      <Label color="primary" variant="filled">
                        Défaut
                      </Label>
                    ) : (
                      <></>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    {!language.isDefault ? (
                      <Tooltip title="Définir par défaut">
                        <IconButton
                          size="small"
                          color="primary"
                          disabled={!settings.multiLanguageEnabled}
                          onClick={() => handleSetDefaultLanguage(language.id)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleOpenDialog('edit', language)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDialog('delete', language)}
                        disabled={language.isDefault}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                    <Switch
                      size="small"
                      checked={language.active}
                      onChange={() => handleToggleLanguage(language.id)}
                      disabled={language.isDefault}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Filter Menu Popover */}
      <Popover
        open={isFilterMenuOpen}
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilterMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: 500,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtres
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Colonne</InputLabel>
                <Select
                  size="small"
                  value={currentFilter.column}
                  onChange={handleChangeFilterColumn}
                  label="Colonne"
                >
                  {FILTER_COLUMNS.map((column) => (
                    <MenuItem key={column.field} value={column.field}>
                      {column.headerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Opérateur</InputLabel>
                <Select
                  size="small"
                  value={currentFilter.operator}
                  onChange={handleChangeFilterOperator}
                  label="Opérateur"
                >
                  {FILTER_OPERATORS[
                    FILTER_COLUMNS.find((col) => col.field === currentFilter.column)
                      ?.type as keyof typeof FILTER_OPERATORS
                  ]?.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      {op.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ flex: 1 }}>
                {currentFilter.column === 'active' || currentFilter.column === 'isDefault' ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>Valeur</InputLabel>
                    <Select
                      value={currentFilter.value}
                      onChange={(e) =>
                        setCurrentFilter({ ...currentFilter, value: e.target.value as string })
                      }
                      label="Valeur"
                    >
                      <MenuItem value="true">Oui</MenuItem>
                      <MenuItem value="false">Non</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label="Valeur"
                    value={currentFilter.value}
                    onChange={handleChangeFilterValue}
                  />
                )}
              </Box>

              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddFilter}
                disabled={
                  !currentFilter.value &&
                  currentFilter.column !== 'active' &&
                  currentFilter.column !== 'isDefault'
                }
                sx={{
                  minWidth: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </Box>

            {/* temp filters in popup */}
            {tempFilters.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tempFilters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={<div>{getFilterDisplayValue(filter)}</div>}
                    onDelete={() => handleRemoveTempFilter(index)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            ) : (
              <></>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseFilterMenu} sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button variant="contained" color="primary" onClick={handleApplyFilters}>
              Appliquer
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Add/Edit/Delete Dialog */}
      <Dialog open={dialogState.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {dialogState.mode === 'delete' ? (
          <>
            <DialogTitle>Supprimer la langue</DialogTitle>
            <DialogContent>
              <Typography sx={{ mt: 2 }}>
                Êtes-vous sûr de vouloir supprimer la langue &quot;{dialogState.language?.name}
                &quot; ({dialogState.language?.code.toUpperCase()})? Cette action est irréversible.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button onClick={handleDeleteLanguage} variant="contained" color="error">
                Supprimer
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>
              {dialogState.mode === 'add' ? 'Ajouter une nouvelle langue' : 'Modifier la langue'}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Nom de la langue"
                  value={newLanguage.name}
                  onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                  placeholder="ex: Français"
                />
                <TextField
                  fullWidth
                  label="Code de la langue"
                  value={newLanguage.code}
                  onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                  placeholder="ex: fr"
                  helperText="Code ISO 639-1 à deux lettres"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button
                onClick={handleAddLanguage}
                variant="contained"
                sx={{
                  color: 'primary.contrastText',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {dialogState.mode === 'add' ? 'Ajouter' : 'Mettre à jour'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
