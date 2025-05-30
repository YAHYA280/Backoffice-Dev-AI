import type { IPaymentMethod } from 'src/contexts/types/payment';

import React, { useState } from 'react';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { usePopover } from 'src/shared/components/custom-popover';

type Props = {
  row: IPaymentMethod;
};

export default function PaymentMethodTableRow({ row }: Props) {
  const { type, title, active, description } = row;
  const popover = usePopover();
  const [isChecked, setIsChecked] = useState(active);

  const router = useRouter();

  const handleViewRow = () => {
    router.push(paths.dashboard.paiements.method(type));
  };

  const handleToggle = async () => {
    // await changePaymentMethodStatus(row.type);
    setIsChecked(!isChecked);
  };

  return (
    <TableRow hover sx={{ width: '100%' }}>
      <TableCell align="center" sx={{ width: '300px' }}>
        <Typography variant="body2">{title}</Typography>
      </TableCell>

      <TableCell align="center" sx={{ width: '300px' }}>
        <Switch
          checked={isChecked}
          onChange={handleToggle}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </TableCell>

      <TableCell align="center" sx={{ width: '520px' }}>
        {description}
      </TableCell>

      <TableCell align="center" sx={{ width: '300px' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={handleViewRow}>
          <FontAwesomeIcon icon={faCog} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
