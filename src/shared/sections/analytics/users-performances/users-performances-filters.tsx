import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IDatePickerControl } from 'src/contexts/types/common';

import { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faTimes, faFilter, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Slider } from '@mui/material';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Scrollbar } from 'src/shared/components/scrollbar';

// ----------------------------------------------------------------------

// Define the interfaces for your performance filters
interface IUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface ISubject {
  id: string;
  name: string;
}

export interface IPerformanceFilters {
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
  users: IUser[];
  subjects: string[];
  performanceLevel: string[];
  engagementLevel: string[];
  completionRateRange: [number, number];
  trendDirection: string[];
  parentEngagement: string[];
  scoreRange: [number, number];
}

type Props = {
  open: boolean;
  canReset: boolean;
  dateError: boolean;
  onOpen: () => void;
  onClose: () => void;
  filters: UseSetStateReturn<IPerformanceFilters>;
  options: {
    performanceLevels: string[];
    users: IUser[];
    subjects: ISubject[];
    engagementLevels: string[];
    trendDirections: string[];
    parentEngagementLevels: string[];
  };
};

export function UsersPerformancesFilters({
  open,
  onOpen,
  onClose,
  filters,
  options,
  canReset,
  dateError,
}: Props) {
  const theme = useTheme();

  const handleFilterEngagementLevel = useCallback(
    (newValue: string) => {
      const checked = filters.state.engagementLevel.includes(newValue)
        ? filters.state.engagementLevel.filter((value) => value !== newValue)
        : [...filters.state.engagementLevel, newValue];

      filters.setState({ engagementLevel: checked });
    },
    [filters]
  );

  const handleFilterCompletionRange = useCallback(
    (newValue: [number, number]) => {
      filters.setState({ completionRateRange: newValue });
    },
    [filters]
  );

  const handleFilterTrendDirection = useCallback(
    (newValue: string) => {
      const checked = filters.state.trendDirection.includes(newValue)
        ? filters.state.trendDirection.filter((value) => value !== newValue)
        : [...filters.state.trendDirection, newValue];

      filters.setState({ trendDirection: checked });
    },
    [filters]
  );

  const handleFilterParentEngagement = useCallback(
    (newValue: string) => {
      const checked = filters.state.parentEngagement.includes(newValue)
        ? filters.state.parentEngagement.filter((value) => value !== newValue)
        : [...filters.state.parentEngagement, newValue];

      filters.setState({ parentEngagement: checked });
    },
    [filters]
  );

  const handleFilterScoreRange = useCallback(
    (newValue: [number, number]) => {
      filters.setState({ scoreRange: newValue });
    },
    [filters]
  );

  const handleFilterPerformanceLevel = useCallback(
    (newValue: string) => {
      const checked = filters.state.performanceLevel.includes(newValue)
        ? filters.state.performanceLevel.filter((value) => value !== newValue)
        : [...filters.state.performanceLevel, newValue];

      filters.setState({ performanceLevel: checked });
    },
    [filters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      filters.setState({ startDate: newValue });
    },
    [filters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  const handleFilterSubjects = useCallback(
    (newValue: string[]) => {
      filters.setState({ subjects: newValue });
    },
    [filters]
  );

  const handleFilterUsers = useCallback(
    (newValue: IUser[]) => {
      filters.setState({ users: newValue });
    },
    [filters]
  );

  const renderHead = (
    <>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filtres
        </Typography>

        <Tooltip title="Réinitialiser">
          <IconButton onClick={filters.onResetState}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <FontAwesomeIcon
                icon={faRedo}
                size="sm"
                style={{ color: theme.palette.primary.main }}
              />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} style={{ color: theme.palette.primary.main }} />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  const renderDateRange = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Période
      </Typography>

      <DatePicker
        label="Date de début"
        value={filters.state.startDate}
        onChange={handleFilterStartDate}
        sx={{ mb: 2.5 }}
      />

      <DatePicker
        label="Date de fin"
        value={filters.state.endDate}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            error: dateError,
            helperText: dateError
              ? 'La date de fin doit être postérieure à la date de début'
              : null,
          },
        }}
      />
    </Box>
  );

  const renderEngagementLevels = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Niveau d&apos;engagement
      </Typography>
      {options.engagementLevels.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.state.engagementLevel.includes(option)}
              onClick={() => handleFilterEngagementLevel(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderCompletionRateRange = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Taux de complétion (%)
      </Typography>
      <Slider
        value={filters.state.completionRateRange}
        onChange={(_, newValue) => handleFilterCompletionRange(newValue as [number, number])}
        valueLabelDisplay="auto"
        step={5}
        marks
        min={0}
        max={100}
      />
    </Box>
  );

  const renderTrendDirection = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tendance
      </Typography>
      {options.trendDirections.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.state.trendDirection.includes(option)}
              onClick={() => handleFilterTrendDirection(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderParentEngagement = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Engagement des parents
      </Typography>
      {options.parentEngagementLevels.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.state.parentEngagement.includes(option)}
              onClick={() => handleFilterParentEngagement(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderScoreRange = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Plage de notes
      </Typography>
      <Slider
        value={filters.state.scoreRange}
        onChange={(_, newValue) => handleFilterScoreRange(newValue as [number, number])}
        valueLabelDisplay="auto"
        step={5}
        marks
        min={0}
        max={100}
      />
    </Box>
  );

  const renderSubjects = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Matières
      </Typography>

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options.subjects.map((subject) => subject.name)}
        value={filters.state.subjects}
        onChange={(event, newValue) => handleFilterSubjects(newValue)}
        renderInput={(params) => <TextField placeholder="Sélectionner des matières" {...params} />}
        renderTags={(selected, getTagProps) =>
          selected.map((subject, index) => (
            <Chip
              {...getTagProps({ index })}
              key={subject}
              size="small"
              variant="soft"
              label={subject}
            />
          ))
        }
      />
    </Box>
  );

  const renderUsers = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Utilisateurs
      </Typography>

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options.users}
        value={filters.state.users}
        onChange={(event, newValue) => handleFilterUsers(newValue)}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField placeholder="Sélectionner des utilisateurs" {...params} />
        )}
        renderOption={(props, user) => (
          <li {...props} key={user.id}>
            {user.name}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((user, index) => (
            <Chip
              {...getTagProps({ index })}
              key={user.id}
              size="small"
              variant="soft"
              label={user.name}
            />
          ))
        }
      />
    </Box>
  );

  const renderPerformanceLevels = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Niveau de performance
      </Typography>
      {options.performanceLevels.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.state.performanceLevel.includes(option)}
              onClick={() => handleFilterPerformanceLevel(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Filtres" arrow>
              <Badge color="error" variant="dot" invisible={!canReset}>
                <FontAwesomeIcon icon={faFilter} />
              </Badge>
            </Tooltip>
          </Box>
        }
        sx={{
          minWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          width: 'auto',
          pr: '12px',
          minHeight: 0,
          color: 'primary.main',
        }}
        onClick={onOpen}
      />

      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Box display="flex" alignItems="center">

            <Tooltip title="Réinitialiser" arrow>
              <FontAwesomeIcon
                icon={faSyncAlt}
                onClick={(e) => {
                  e.stopPropagation();
                  filters.onResetState();
                }}
                style={{ cursor: 'pointer', marginLeft: 4 }}
              />
            </Tooltip>
          </Box>
        }
        sx={{
          minWidth: 0,
          marginRight: 3,
          paddingLeft: 0,
          paddingRight: 0,
          pr: '15px',
          minHeight: 0,
          color: 'primary.main',
        }}
        onClick={onOpen}
      />

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        {renderHead}

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderDateRange}
            {renderSubjects}
            {renderUsers}
            {renderPerformanceLevels}
            {renderEngagementLevels}
            {renderCompletionRateRange}
            {renderTrendDirection}
            {renderParentEngagement}
            {renderScoreRange}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
