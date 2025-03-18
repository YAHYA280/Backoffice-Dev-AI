import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';

import { varAlpha } from 'src/shared/theme/styles';

// ----------------------------------------------------------------------

type Props = {
  priority: string;
  onChangePriority: (newValue: string) => void;
};

export function KanbanDetailsPriority({ priority, onChangePriority }: Props) {
  return (
    <Stack direction="row" flexWrap="wrap" spacing={1}>
      {['low', 'medium', 'hight'].map((option) => (
        <ButtonBase
          key={option}
          onClick={() => onChangePriority(option)}
          sx={{
            py: 0.5,
            pl: 0.75,
            pr: 1.25,
            fontSize: 12,
            borderRadius: 1,
            lineHeight: '20px',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightBold',
            boxShadow: (theme) =>
              `inset 0 0 0 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
            ...(option === priority && {
              boxShadow: (theme) => `inset 0 0 0 2px ${theme.vars.palette.text.primary}`,
            }),
          }}
        >
          <FontAwesomeIcon
            icon={
              (option === 'low' && faArrowDown) ||
              (option === 'medium' && faArrowRight) ||
              faArrowUp
            }
            style={{
              marginRight: '0.5rem',
              color: option === 'low' 
                ? 'var(--mui-palette-info-main)' 
                : option === 'medium' 
                ? 'var(--mui-palette-warning-main)' 
                : 'var(--mui-palette-error-main)'
            }}
          />

          {option}
        </ButtonBase>
      ))}
    </Stack>
  );
}
