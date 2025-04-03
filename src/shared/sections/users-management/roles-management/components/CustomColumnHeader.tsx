import type { Dayjs } from 'dayjs';
import type { IRoleItem } from 'src/contexts/types/role';

import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface CustomColumnHeaderProps {
  field: keyof IRoleItem;
  headerName: string;
  onSearch: (field: keyof IRoleItem, value: string | Date | null) => void;
  isDatePicker?: boolean;
}

const CustomColumnHeader = ({
  field,
  headerName,
  onSearch,
  isDatePicker = false,
}: CustomColumnHeaderProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  const handleToggleInput = () => {
    if (!isDatePicker) {
      setIsInputVisible((prev) => !prev);
    }
  };

  const handleToggleDateField = () => {
    if (isDatePicker) {
      setIsInputVisible((prev) => !prev);
    }
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setDateValue(newDate);

    if (onSearch) {
      onSearch(field, newDate ? newDate.toDate() : null);
    }
  };

  const handleClearSearch = () => {
    if (isDatePicker) {
      setDateValue(null);
      setIsInputVisible(false);
      onSearch(field, null);
    } else {
      setSearchValue('');
      setIsInputVisible(false);
      onSearch(field, '');
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchValue(event.target.value);
    onSearch(field, newValue); 
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Header Name */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: '40px',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2">{headerName}</Typography>
        </Box>

        {/* Search Icon & Input Field */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            mb: 1,
            mt: -1,
            gap: 1, // Adjust spacing
          }}
        >
          {/* Search Icon for Regular Fields */}
          {!isDatePicker ? (
            <IconButton
              size="small"
              onClick={handleToggleInput}
              sx={{
                color: 'primary.main',
                
              }}
            >
              <FontAwesomeIcon icon={faSearch} size="xs" />
            </IconButton>
          ) : (
            <>
            </>
          )}

          {/* Wrapper Box for Calendar Icon & DateField */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            {/* Calendar Icon for DateField */}
            {isDatePicker ? (
              <IconButton
                size="small"
                onClick={handleToggleDateField}
                ref={calendarButtonRef}
                sx={{
                  color: 'primary.main',
                }}
              >
                <FontAwesomeIcon icon={faSearch} size="xs" />
              </IconButton>
            ): (
              <>
              </>
            )}

            {/* DateField (Only appears when clicking calendar) */}
            { (isDatePicker && isInputVisible) ? (
              <DateField
                value={dateValue}
                onChange={handleDateChange}
                format="DD/MM/YYYY" 
                size="small"
                fullWidth
                sx={{
                  maxWidth: '135px',
                  '& .MuiOutlinedInput-root': {
                    height: '20px',
                    alignItems: 'center',
                    backgroundColor: 'white',
                  },
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: dateValue ? (
                    <IconButton size="small" onClick={handleClearSearch}>
                      <FontAwesomeIcon icon={faTimes} size="xs" />
                    </IconButton>
                  ) : (
                    <></>
                  )
                }}
              />
            ) : (
              <>
              </>
            )}
          </Box>

          {/* Regular Search Input (Only appears when clicking search icon) */}
          {(!isDatePicker && isInputVisible) ? (
            <TextField
              autoFocus
              variant="outlined"
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
              sx={{
                width: '120px',
                '& .MuiOutlinedInput-root': {
                  height: '20px',
                  mt: 0,
                },
              }}
              InputProps={{
                endAdornment: searchValue ? (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </IconButton>
                ) : (
                  <></>
                )
              }}
            />
          ) : (
            <>
            </>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CustomColumnHeader;
