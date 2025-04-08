
'use client';

import type { LogEntry } from 'src/shared/_mock/_logs';

import dayjs from 'dayjs';
import React from 'react';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/shared/components/label';

type Props = {
  row: LogEntry;
  selected: boolean;
  onSelectRow: () => void;
  columns: Array<{ id: string; label: string; width?: number }>;
};

export function SuiviTableRow({
  row,
  selected,
  onSelectRow,
  columns,
}: Props) {
  const [userNameExpanded, setUserNameExpanded] = React.useState(false);
  
  const handleUserNameToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setUserNameExpanded((prev) => !prev);
  };

  const renderCellContent = (colId: string) => {
    switch (colId) {
      case 'select':
        return (
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': 'row checkbox' }}
          />
        );

        case 'userName':
          return (
            <div
              role="button"
              tabIndex={0}
              onClick={handleUserNameToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleUserNameToggle(e as any);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {userNameExpanded || row.userName.length <= 20
                ? row.userName
                : `${row.userName.substring(0, 20)}...`}
            </div>
          ); 
      case 'statut':
        return (
          <Label
            variant="soft"
            sx={{
              ...(row.statut === 'Succès' && { bgcolor: 'rgb(186, 248, 193)', color: '#22bb33' }),
              ...(row.statut === 'Échec' && { bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' }),
              ...(!['Succès', 'Échec'].includes(row.statut) && {
                bgcolor: 'rgba(145, 158, 171, 0.16)',
                color: 'text.secondary',
              }),
            }}
          >
            {row.statut}
          </Label>
        );
      case 'logintime':
        return dayjs(row.logintime).format('DD/MM/YYYY HH:mm:ss');

      case 'ipaddress':
        return row.ipaddress;

      case 'browser':
        return row.browser;

      case 'device':
        return row.device;  

      default:
        return (row as any)[colId];
    }
  };

  return (
    <TableRow hover selected={selected} tabIndex={-1}>
        {columns.map((col) => (
          <TableCell
            key={col.id}
            sx={{
              width: col.width,
              textAlign: col.id === 'actions' ? 'right' : 'left',
            }}
          >
            {renderCellContent(col.id)}
          </TableCell>
        ))}
      </TableRow>
  );
}

export default SuiviTableRow;
