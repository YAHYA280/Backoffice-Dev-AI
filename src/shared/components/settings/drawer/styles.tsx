import type { Theme, SxProps } from '@mui/material/styles';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { varAlpha, stylesMode } from 'src/shared/theme/styles';

import {FontAwesome} from '../../fontawesome';


// ----------------------------------------------------------------------

type Props = {
  title: string;
  tooltip?: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

export function Block({ title, tooltip, children, sx }: Props) {
  return (
    <Box
      sx={{
        px: 2,
        pb: 2,
        pt: 4,
        borderRadius: 2,
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        ...sx,
      }}
    >
      <Box
        component="span"
        sx={{
          px: 1.25,
          top: -12,
          fontSize: 13,
          borderRadius: 22,
          lineHeight: '22px',
          position: 'absolute',
          alignItems: 'center',
          color: 'common.white',
          display: 'inline-flex',
          bgcolor: 'text.primary',
          fontWeight: 'fontWeightSemiBold',
          [stylesMode.dark]: { color: 'grey.800' },
        }}
      >
        {title}

        {tooltip && (
          <Tooltip title={tooltip} placement="right">
              <FontAwesome
              icon={faInfoCircle}
              style={{ marginLeft: '0.5em', marginRight: '-0.5em', opacity: 0.48, cursor: 'pointer' }}
            />
          </Tooltip>
        )}
      </Box>

      {children}
    </Box>
  );
}

