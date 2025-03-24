import type { Dayjs } from 'dayjs';
import type { IPermission } from 'src/shared/_mock/_permission';

import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

import { DateField } from '@mui/x-date-pickers/DateField';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  FormControl,
} from '@mui/material';

import { LocalizationProvider } from 'src/shared/locales';

// Add the IRoleItem interface
interface IRoleItem {
  id: string;
  name: string;
  description: string;
  permissionLevel: string[];
  createdAt: Date;
}

interface CustomColumnHeaderProps {
  field: keyof IPermission;
  headerName: string;
  onSearch: (field: keyof IPermission, value: string | Date | null) => void;
  isDatePicker?: boolean;
  isRoleSelect?: boolean;
  roleData?: IRoleItem[];
}

const CustomColumnHeader = ({
  field,
  headerName,
  onSearch,
  isDatePicker = false,
  isRoleSelect = false,
  roleData = [],
}: CustomColumnHeaderProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  const handleToggleInput = () => {
    if (!isDatePicker && !isRoleSelect) {
      setIsInputVisible((prev) => !prev);
    }
  };

  const handleToggleDateField = () => {
    if (isDatePicker) {
      setIsInputVisible((prev) => !prev);
    }
  };

  const handleToggleRoleSelect = () => {
    if (isRoleSelect) {
      setIsInputVisible((prev) => !prev);
    }
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setDateValue(newDate);

    if (onSearch) {
      onSearch(field, newDate ? newDate.toDate() : null);
    }
  };

  const handleRoleChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedRole(newValue);
    onSearch(field, newValue);
  };

  const handleClearSearch = () => {
    if (isDatePicker) {
      setDateValue(null);
      setIsInputVisible(false);
      onSearch(field, null);
    } else if (isRoleSelect) {
      setSelectedRole('');
      setIsInputVisible(false);
      onSearch(field, '');
    } else {
      setSearchValue('');
      setIsInputVisible(false);
      onSearch(field, '');
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchValue(newValue);
    onSearch(field, newValue);
  };

  return (
    <LocalizationProvider>
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
            gap: 1,
          }}
        >
          {/* Search Icon for Regular Fields and Role Select */}
          {!isDatePicker ? (
            <IconButton
              size="small"
              onClick={isRoleSelect ? handleToggleRoleSelect : handleToggleInput}
              sx={{
                color: 'primary.main',
              }}
            >
              <FontAwesomeIcon icon={faSearch} size="xs" />
            </IconButton>
          ) : (
            <></>
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
            ) : (
              <></>
            )}

            {/* DateField (Only appears when clicking calendar) */}
            {isDatePicker && isInputVisible ? (
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
                  endAdornment: dateValue && (
                    <IconButton size="small" onClick={handleClearSearch}>
                      <FontAwesomeIcon icon={faTimes} size="xs" />
                    </IconButton>
                  ),
                }}
              />
            ) : (
              <></>
            )}
          </Box>

          {/* Regular Search Input (Only appears when clicking search icon) */}
          {!isDatePicker && !isRoleSelect && isInputVisible ? (
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
                ),
              }}
            />
          ) : (
            <></>
          )}

          {/* Role Select Dropdown (Only appears when clicking search icon for roles) */}
          {isRoleSelect && isInputVisible ? (
            <FormControl
              size="small"
              sx={{
                width: '120px',
                '& .MuiOutlinedInput-root': {
                  height: '25px',
                },
              }}
            >
              <Select
                value={selectedRole}
                onChange={handleRoleChange}
                displayEmpty
                autoFocus
                endAdornment={
                  selectedRole ? (
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      sx={{ position: 'absolute', right: '24px' }}
                    >
                      <FontAwesomeIcon icon={faTimes} size="xs" />
                    </IconButton>
                  ) : (
                    <></>
                  )
                }
              >
                {roleData.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CustomColumnHeader;
