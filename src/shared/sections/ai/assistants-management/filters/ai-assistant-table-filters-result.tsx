import type { Theme } from '@mui/material/styles'; // Import the Theme type
import type { IAIAssistantTableFiltersResultProps } from 'src/types/ai-assistant';

import { useMemo } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

 
//----------------------------------------------------------------------

export function AIAssistantTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  onResetPage,
  results,
  options,
  sx,
}: IAIAssistantTableFiltersResultProps) {
  // Vérification si le type "J'apprends" est sélectionné
  const isJapprendsSelected = useMemo(() => filters.type.includes('japprends'), [filters.type]);

  const handleRemoveType = (value: string) => {
    const newValue = filters.type.filter((item) => item !== value);
    onFilters('type', newValue);
    onResetPage(); // Reset page when filter changes
  };

  const handleRemoveFilter = (name: string) => {
    onFilters(name, '');
    onResetPage(); // Reset page when filter changes
  };

  // Calcul des filtres actifs et à afficher
  const activeFilters = useMemo(() => {
    // Filtres toujours visibles
    const baseFilters: { name: string, label: string, value: string | string[], valueLabel?: string }[] = [];

    // Ajouter les types sélectionnés
    if (filters.type.length) {
      filters.type.forEach((typeValue) => {
        const typeOption = options.types.find((option) => option.value === typeValue);
        if (typeOption) {
          baseFilters.push({
            name: 'type',
            label: 'Type',
            value: typeValue,
            valueLabel: typeOption.label,
          });
        }
      });
    }

    // Ajouter le niveau d'éducation s'il est défini
    if (filters.educationLevel) {
      const levelOption = options.educationLevels.find((option) => option.value === filters.educationLevel);
      baseFilters.push({
        name: 'educationLevel',
        label: "Niveau d'éducation",
        value: filters.educationLevel,
        valueLabel: levelOption?.label,
      });
    }

    // Ajouter le statut s'il est défini
    if (filters.status) {
      const statusOption = options.statuses.find((option) => option.value === filters.status);
      baseFilters.push({
        name: 'status',
        label: 'Statut',
        value: filters.status,
        valueLabel: statusOption?.label,
      });
    }

    // Ajouter le nom s'il est défini
    if (filters.name) {
      baseFilters.push({
        name: 'name',
        label: 'Nom',
        value: filters.name,
      });
    }

    // Ajouter les filtres spécifiques à "J'apprends" seulement si ce type est sélectionné
    if (isJapprendsSelected) {
      // Ajouter la matière si elle est définie
      if (filters.subject) {
        const subjectOption = options.subjects.find((option) => option.value === filters.subject);
        baseFilters.push({
          name: 'subject',
          label: 'Matière',
          value: filters.subject,
          valueLabel: subjectOption?.label,
        });
      }

      // Ajouter le chapitre s'il est défini
      if (filters.chapter) {
        baseFilters.push({
          name: 'chapter',
          label: 'Chapitre',
          value: filters.chapter,
        });
      }

      // Ajouter l'exercice s'il est défini
      if (filters.exercise) {
        baseFilters.push({
          name: 'exercise',
          label: 'Exercice',
          value: filters.exercise,
        });
      }
    }

    return baseFilters;
  }, [filters, options, isJapprendsSelected]);

  // Ne rien afficher s'il n'y a pas de filtres actifs
  if (!activeFilters.length) {
    return null;
  }

  // Style personnalisé pour le texte des puces
  const chipLabelStyle = {
    '& .MuiChip-label': {
      color: (theme : Theme) => theme.palette.text.primary, // Même couleur que les en-têtes de tableau
      fontWeight: 'normal',
    },
    '& .MuiChip-deleteIcon': {
      color: (theme: Theme) => theme.palette.text.secondary, // Couleur de l'icône de suppression
      '&:hover': {
        color: (theme : Theme) => theme.palette.error.main, // Couleur au survol
      },
    },
  };

  return (
    <Stack spacing={1.5} sx={{ mb: 3, ...sx }}>
      <Stack direction="row" alignItems="center" sx={{ typography: 'body2' }}>
        <Box component="span" sx={{ typography: 'subtitle2' }}>
          {results}
        </Box>

        <Box component="span" sx={{ ml: 0.25 }}>
          résultats trouvés
        </Box>

        {activeFilters.length > 0 && (
          <>
            <Box component="span" sx={{ ml: 0.25 }}>
              avec
            </Box>

            <Box component="span" sx={{ ml: 0.5, typography: 'subtitle2' }}>
              {activeFilters.length} filtres
            </Box>
          </>
        )}
      </Stack>

      <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
        {activeFilters.map((filter) => {
          const getChipLabel = () => {
            if (filter.name === 'type') {
              return filter.valueLabel;
            }

            if (filter.valueLabel) {
              // Création d'un contenu personnalisé pour le label de la puce
              return (
                <Typography component="span" variant="body2">
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme) => theme.palette.text.primary,
                      fontWeight: 'bold'
                    }}
                  >
                    {filter.label}:
                  </Typography>{' '}
                  {filter.valueLabel}
                </Typography>
              );
            }

            return (
              <Typography component="span" variant="body2">
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    fontWeight: 'bold'
                  }}
                >
                  {filter.label}:
                </Typography>{' '}
                {filter.value}
              </Typography>
            );
          };

          return (
            <Chip
              key={`${filter.name}-${filter.value}`}
              label={getChipLabel()}
              size="small"
              variant="soft"
              color="primary"
              sx={{
                ...chipLabelStyle,
                backgroundColor: (theme) => theme.palette.background.neutral,
              }}
              onDelete={
                filter.name === 'type'
                  ? () => handleRemoveType(filter.value as string)
                  : () => handleRemoveFilter(filter.name)
              }
            />
          );
        })}

        <Button
          color="error"
          onClick={() => {
            onResetFilters();
            onResetPage(); // Reset page when filters are reset
          }}
          startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
        >
          Effacer
        </Button>
      </Stack>
    </Stack>
  );
}