import type { CardProps } from '@mui/material/Card';
import type { TableHeadCustomProps } from 'src/shared/components/table';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import { Stack , Select, MenuItem , InputLabel, Typography, FormControl, LinearProgress, TablePagination } from '@mui/material';

import { Label } from 'src/shared/components/label';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { TableHeadCustom } from 'src/shared/components/table';
import ConditionalComponent from 'src/shared/components/conditional-component/ConditionalComponent';

// ----------------------------------------------------------------------

type PerformanceData = {
  id: string;
  matiere: string;
  noteAvg: number;
  completionRate: number;
  engagement: number;
  trend: {
    value: number;
    isPositive: boolean;
  };
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  headLabel: TableHeadCustomProps['headLabel'];
  tableData: PerformanceData[];
};

export function UsersPerformancesModulesTable({
  title,
  subheader,
  tableData,
  headLabel,
  ...other
}: Props) {
  const [period, setPeriod] = useState('semaine');
  const [level, setLevel] = useState('tous');
  const [comparison, setComparison] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const periodOptions = [
    { value: 'jour', label: 'Jour' },
    { value: 'semaine', label: 'Semaine' },
    { value: 'mois', label: 'Mois' },
    { value: 'trimestre', label: 'Trimestre' },
  ];

  const levelOptions = [
    { value: 'tous', label: 'Tous niveaux' },
    { value: 'cp', label: 'CP' },
    { value: 'ce1', label: 'CE1' },
    { value: 'ce2', label: 'CE2' },
    { value: 'cm1', label: 'CM1' },
    { value: 'cm2', label: 'CM2' },
    { value: '6eme', label: '6ème' },
    { value: '5eme', label: '5ème' },
    { value: '4eme', label: '4ème' },
    { value: '3eme', label: '3ème' },
    { value: '2nde', label: '2nde' },
    { value: '1ere', label: '1ère' },
    { value: 'terminale', label: 'Terminale' },
  ];

  const comparisonOptions = [
    { value: 'previous_period', label: 'Période précédente' },
    { value: 'previous_year', label: 'Année précédente' },
    { value: 'current_month', label: 'Mois en cours' },
  ];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const visibleRows = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ mb: 2 }}
        action={
          <Stack direction="row" spacing={2} sx={{ mr: 2, mt:2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="period-select-label">Période</InputLabel>
              <Select
                labelId="period-select-label"
                value={period}
                label="Période"
                onChange={(e) => setPeriod(e.target.value)}
              >
                {periodOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="level-select-label">Niveau</InputLabel>
              <Select
                labelId="level-select-label"
                value={level}
                label="Niveau"
                onChange={(e) => setLevel(e.target.value)}
              >
                {levelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="compare-select-label">Comparer à</InputLabel>
              <Select
                labelId="compare-select-label"
                value={comparison}
                label="Comparer à"
                onChange={(e) => setComparison(e.target.value)}
              >
                {comparisonOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        }
      />

      <Scrollbar sx={{ minHeight: 422 }}>
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
  row: PerformanceData;
};

function RowItem({ row }: RowItemProps) {
  const renderProgress = (value: number) => (
    <Box sx={{ width: '60%', mr: 1.5, position: 'relative' }}>
      <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: -19 }}>
        {`${value}%`}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        color={value >= 80 ? "success" : value >= 70 ? "info" : value >= 60 ? "warning" : "error"}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ fontWeight: 'bold' }}>{row.matiere}</Box>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.noteAvg >= 85 && 'success') ||
            (row.noteAvg >= 75 && 'info') ||
            (row.noteAvg >= 65 && 'warning') ||
            'error'
          }
        >
          {`${row.noteAvg}/100`}
        </Label>
      </TableCell>

      <TableCell sx={{ width: '20%', paddingTop: 4 }}>
        {renderProgress(row.completionRate)}
      </TableCell>

      <TableCell sx={{ width: '20%', paddingTop: 4  }}>
        {renderProgress(row.engagement)}
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={row.trend.isPositive ? 'success' : 'error'}
        >
          {row.trend.isPositive ? `+${row.trend.value}%` : `-${row.trend.value}%`}
        </Label>
      </TableCell>
    </TableRow>
  );
}
