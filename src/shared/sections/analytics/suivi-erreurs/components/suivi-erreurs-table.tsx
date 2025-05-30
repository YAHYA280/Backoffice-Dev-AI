import type { CardProps } from '@mui/material/Card';
import type { TableHeadCustomProps } from 'src/shared/components/table';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Stack, Button, Typography, IconButton, TablePagination } from '@mui/material';

import { Label } from 'src/shared/components/label';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { TableHeadCustom } from 'src/shared/components/table';
import ConditionalComponent from 'src/shared/components/conditional-component/ConditionalComponent';

// ----------------------------------------------------------------------

type ExerciseData = {
  id: string;
  exercice: string;
  matiere: string;
  chapitre: string;
  tauxEchec: number;
  evolution: number;
  alerte: 'Élevée' | 'Moyenne' | 'Faible';
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  tableData: ExerciseData[];
};

export function SuiviErreursExercisesTable({
  title = 'Exercices avec taux d\'échec élevé',
  subheader,
  tableData,
  ...other
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const visibleRows = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const headLabel: TableHeadCustomProps['headLabel'] = [
    { id: 'exercice', label: 'Exercice' },
    { id: 'matiere', label: 'Matière' },
    { id: 'chapitre', label: 'Chapitre' },
    { id: 'tauxEchec', label: 'Taux d\'échec' },
    { id: 'evolution', label: 'Évolution' },
    { id: 'alerte', label: 'Alerte' },
  ];

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        sx={{ mb: 2 }}
        action={
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              startIcon={<FileDownloadIcon />}
              sx={{ mr: 1 }}
            >
              Exporter
            </Button>
            <IconButton size="small">
              <FilterListIcon />
            </IconButton>
          </Stack>
        }
      />

      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHeadCustom headLabel={headLabel} />

          <TableBody>
            {visibleRows.map((row) => (
              <RowItem key={row.id} row={row} />
            ))}
            <ConditionalComponent isValid={emptyRows > 0}>
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={headLabel.length} />
              </TableRow>
            </ConditionalComponent>
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

type RowItemProps = {
  row: ExerciseData;
};

function RowItem({ row }: RowItemProps) {
  const getEvolutionColor = (value: number) => {
    if (value > 0) return 'error';
    if (value < 0) return 'success';
    return 'info';
  };

  const getAlertColor = (alerte: string) => {
    switch (alerte) {
      case 'Élevée':
        return 'error';
      case 'Moyenne':
        return 'warning';
      case 'Faible':
        return 'success';
      default:
        return 'info';
    }
  };

  const evolutionSign = row.evolution > 0 ? '+' : '';

  return (
    <TableRow>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
          {row.exercice}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{row.matiere}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{row.chapitre}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {`${row.tauxEchec.toFixed(1)}%`}
        </Typography>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={getEvolutionColor(row.evolution)}
        >
          {`${evolutionSign}${row.evolution.toFixed(1)}%`}
        </Label>
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FiberManualRecordIcon 
            sx={{ 
              fontSize: 12, 
              color: getAlertColor(row.alerte)
            }} 
          />
          <Typography variant="body2">
            {row.alerte}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}