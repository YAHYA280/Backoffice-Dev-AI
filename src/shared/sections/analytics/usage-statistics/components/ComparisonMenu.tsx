// /usagestatistics/components/ComparisonMenu.tsx

import type { SelectChangeEvent } from '@mui/material/Select';
import type { DateRange } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import React, { useState } from 'react';
import { format, subDays, subMonths, differenceInDays } from 'date-fns';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// ----------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------
type Props = {
  isComparing: boolean;
  currentDateRange: DateRange; // The "current" chart date range
  onCompareToggle: (compareRange: DateRange | null) => void;
};

// ----------------------------------------------------------------------
// ComparisonMenu component
// ----------------------------------------------------------------------
export default function ComparisonMenu({ isComparing, currentDateRange, onCompareToggle }: Props) {
  // We'll store which comparison type is selected in local state.
  // "" means "no comparison"
  const [compareType, setCompareType] = useState<string>('');

  // When user picks a type from the select, build the "previous" range or disable:
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    setCompareType(selected);

    if (!selected) {
      // If user selects "", turn off comparison
      onCompareToggle(null);
      return;
    }

    // Otherwise, build the new "previous" date range
    const { startDate, endDate } = currentDateRange;
    const daysDiff = differenceInDays(endDate, startDate);

    let prevStartDate = startDate;
    let prevEndDate = endDate;

    switch (selected) {
      case 'previous': // "Période Précédente"
        prevStartDate = subDays(startDate, daysDiff + 1);
        prevEndDate = subDays(startDate, 1);
        break;

      case 'month': // "Mois Précédent"
        prevStartDate = subMonths(startDate, 1);
        prevEndDate = subMonths(endDate, 1);
        break;

      case 'year': // "Année Précédente"
        {
          const s = new Date(startDate);
          s.setFullYear(s.getFullYear() - 1);
          const e = new Date(endDate);
          e.setFullYear(e.getFullYear() - 1);
          prevStartDate = s;
          prevEndDate = e;
        }
        break;

      default:
        // fallback
        prevStartDate = subDays(startDate, daysDiff + 1);
        prevEndDate = subDays(startDate, 1);
        break;
    }

    onCompareToggle({
      startDate: prevStartDate,
      endDate: prevEndDate,
      label: `Comparaison: ${format(prevStartDate, 'dd/MM/yyyy')} - ${format(
        prevEndDate,
        'dd/MM/yyyy'
      )}`,
    });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <FormControl sx={{ minWidth: 180 }} size="small">
        <InputLabel id="compare-select-label">Comparer à</InputLabel>
        <Select
          labelId="compare-select-label"
          id="compare-select"
          label="Comparer à"
          value={compareType}
          onChange={handleChange}
        >
          {/* "" => no comparison */}
          <MenuItem value="">
            <em>(Désactiver)</em>
          </MenuItem>
          <MenuItem value="previous">Période Précédente</MenuItem>
          <MenuItem value="month">Mois Précédent</MenuItem>
          <MenuItem value="year">Année Précédente</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
