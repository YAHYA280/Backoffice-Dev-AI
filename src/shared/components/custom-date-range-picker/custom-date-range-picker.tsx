import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import { useResponsive } from 'src/hooks/use-responsive';

import type { UseDateRangePickerReturn } from './types';

// ----------------------------------------------------------------------

export function CustomDateRangePicker({
  open,
  error,
  endDate,
  onClose,
  startDate,
  onChangeEndDate,
  variant = 'input',
  onChangeStartDate,
  title = 'Select date range',
}: UseDateRangePickerReturn) {
  const mdUp = useResponsive('up', 'md');

  const isCalendarView = variant === 'calendar';

  return (
    <Dialog
      fullWidth
      maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { ...(isCalendarView && { maxWidth: 720 }) } }}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent sx={{ ...(isCalendarView && mdUp && { overflow: 'unset' }) }}>
        <Stack
          justifyContent="center"
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && mdUp ? 'row' : 'column'}
          sx={{ pt: 1 }}
        >
          {isCalendarView ? (
            <>
              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <DateCalendar value={startDate} onChange={onChangeStartDate} />
              </Paper>

              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <DateCalendar value={endDate} onChange={onChangeEndDate} />
              </Paper>
            </>
          ) : (
            <>

              {startDate ? (
                <DateCalendar value={startDate} onChange={onChangeStartDate} />
              ) : (
                <> </>
              )}

              {endDate ? (
                <DateCalendar value={endDate} onChange={onChangeEndDate} />
              ) : (
                <> </>
              )}
            </>
          )}
        </Stack>

        {error && (
          <FormHelperText error sx={{ px: 2 }}>
            End date must be later than start date
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Annuler
        </Button>

        <Button disabled={error} variant="contained" onClick={onClose}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
