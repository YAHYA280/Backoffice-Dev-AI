import type { StackProps } from '@mui/material/Stack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faArrowRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type Props = StackProps & {
  title: string;
  link?: string;
  subtitle?: string;
  collapse?: boolean;
  onOpen?: () => void;
  onCollapse?: () => void;
};

export function FileManagerPanel({
  sx,
  link,
  title,
  onOpen,
  subtitle,
  collapse,
  onCollapse,
  ...other
}: Props) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 3, ...sx }} {...other}>
      <Stack flexGrow={1}>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <Typography variant="h6"> {title} </Typography>

        </Stack>

        <Box sx={{ typography: 'body2', color: 'text.disabled', mt: 0.5 }}>{subtitle}</Box>
      </Stack>

      {link ? (
        <Button
          href={link}
          component={RouterLink}
          size="small"
          color="inherit"
          endIcon={<FontAwesomeIcon icon={faArrowRight} width={18} style={{ marginLeft: -0.5 }} />}
        >
          View all
        </Button>
      ): (
        <>
        </>
      )}

      {onCollapse ? (
        <IconButton onClick={onCollapse}>
          <FontAwesomeIcon icon={collapse ? faChevronDown : faChevronUp} />
        </IconButton>
      ) : (
        <>
        </>
      )}
    </Stack>
  );
}
