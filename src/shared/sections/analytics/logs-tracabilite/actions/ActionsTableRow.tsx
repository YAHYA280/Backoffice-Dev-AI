'use client';

import type { ActionsCritique } from 'src/shared/_mock/_logs';

import React from 'react';
import dayjs from 'dayjs';

import { TableRow, Checkbox, TableCell } from '@mui/material';

import { Label } from 'src/shared/components/label';

type Props = {
  row: ActionsCritique;
  selected: boolean;
  onSelectRow: () => void;
  columns: Array<{ id: string; label: string; width?: number }>;
};

export function ActionsTableRow({ row, selected, onSelectRow, columns }: Props) {
  const [detailsExpanded, setDetailsExpanded] = React.useState(false);
  const [typeActionExpanded, setTypeActionExpanded] = React.useState(false);
  const [userNameExpanded, setUserNameExpanded] = React.useState(false);


  const handleDetailsToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDetailsExpanded((prev) => !prev);
  };

  const handleTypeActionToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setTypeActionExpanded((prev) => !prev);
  };

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
            inputProps={{ 'aria-label': 'row checkbox' }}
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
      case 'typeAction':
          return (
            <div
              role="button"
              tabIndex={0}
              onClick={handleTypeActionToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTypeActionToggle(e as any);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {typeActionExpanded || row.typeAction.length <= 30
                ? row.typeAction
                : `${row.typeAction.substring(0, 30)}...`}
            </div>
          );    
        case 'details':
          return (
            <div
              role="button"
              tabIndex={0}
              onClick={handleDetailsToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDetailsToggle(e as any);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {detailsExpanded || row.details.length <= 50
                ? row.details
                : `${row.details.substring(0, 50)}...`}
            </div>
          );        
      case 'dateAction':
        return dayjs(row.dateAction).format('DD/MM/YYYY HH:mm:ss');

      default:
        return (row as any)[colId];
    }
  };

  return (
    <TableRow hover selected={selected} tabIndex={-1}>
      {columns.map((col) => (
        <TableCell key={col.id} sx={{ width: col.width }}>
          {renderCellContent(col.id)}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default ActionsTableRow;