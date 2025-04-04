// /usagestatistics/components/DateFilterBar.tsx

import { useState } from 'react';
import fr from 'date-fns/locale/fr';
import { format, subDays, subMonths } from 'date-fns';
import { faFilter, faCalendar } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { FontAwesome } from 'src/shared/components/fontawesome';

type DateRange = {
  startDate: Date;
  endDate: Date;
  label?: string;
};

type Props = {
  onDateRangeChange: (range: DateRange) => void;
};

export default function DateFilterBar({ onDateRangeChange }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const predefinedRanges = [
    {
      label: '7 derniers jours',
      range: {
        startDate: subDays(new Date(), 7),
        endDate: new Date(),
        label: '7 derniers jours',
      },
    },
    {
      label: '30 derniers jours',
      range: {
        startDate: subDays(new Date(), 30),
        endDate: new Date(),
        label: '30 derniers jours',
      },
    },
    {
      label: '3 derniers mois',
      range: {
        startDate: subMonths(new Date(), 3),
        endDate: new Date(),
        label: '3 derniers mois',
      },
    },
    {
      label: '6 derniers mois',
      range: {
        startDate: subMonths(new Date(), 6),
        endDate: new Date(),
        label: '6 derniers mois',
      },
    },
  ];

  const handlePredefinedRangeClick = (range: DateRange) => {
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    onDateRangeChange(range);
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      onDateRangeChange({
        startDate,
        endDate,
        label: 'Personnalisé',
      });
      setIsPickerOpen(false);
    }
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd/MM/yyyy', { locale: fr })} - ${format(endDate, 'dd/MM/yyyy', {
        locale: fr,
      })}`;
    }
    return 'Sélectionner une période';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Paper
        elevation={3}
        sx={{
          p: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <IconButton sx={{ p: '10px' }}>
          <FontAwesome icon={faCalendar} width={24} />
        </IconButton>

        <Box
          sx={{
            ml: 1,
            flex: 1,
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
          onClick={() => setIsPickerOpen(!isPickerOpen)}
        >
          <Typography variant="body1">{formatDateRange()}</Typography>
        </Box>

        <Button
          color="primary"
          startIcon={<FontAwesome icon={faFilter} />}
          onClick={() => setIsPickerOpen(!isPickerOpen)}
        >
          Filtrer
        </Button>

        {isPickerOpen && (
          <Paper
            elevation={5}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              p: 2,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {predefinedRanges.map((item) => (
                <Button
                  key={item.label}
                  variant="outlined"
                  size="small"
                  onClick={() => handlePredefinedRangeClick(item.range)}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="dd/MM/yyyy"
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={startDate || undefined}
                format="dd/MM/yyyy"
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setIsPickerOpen(false)}
                sx={{ mr: 1 }}
              >
                Annuler
              </Button>
              <Button variant="contained" color="primary" onClick={handleApplyDateRange}>
                Appliquer
              </Button>
            </Box>
          </Paper>
        )}
      </Paper>
    </LocalizationProvider>
  );
}
