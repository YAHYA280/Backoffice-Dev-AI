"use client";

import type { MouseEvent } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { IFile, IFileFilters, IFolderManager } from "src/contexts/types/file";

import dayjs from "dayjs";
import { useState, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTable,
  faTimes,
  faFilter,
  faFileExport,
  faArrowsRotate,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { tablePaginationClasses } from "@mui/material/TablePagination";
import {
  Box,
  Tab,
  Card,
  Tabs,
  Menu,
  Button,
  Tooltip,
  Divider,
  MenuItem,
  Checkbox,
  TextField,
  IconButton,
  FormControl,
  ListItemText,
  InputAdornment,
} from "@mui/material";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";
import { useSetState } from "src/hooks/use-set-state";

import { fIsAfter } from "src/utils/format-time";

import { _allFiles } from "src/shared/_mock";
import { DashboardContent } from "src/shared/layouts/dashboard";

import { toast } from "src/shared/components/snackbar";
import { ConfirmDialog } from "src/shared/components/custom-dialog";
import { fileFormat } from "src/shared/components/file-thumbnail/utils";
import { CustomBreadcrumbs } from "src/shared/components/custom-breadcrumbs";
import {
  useTable,
  TableNoData,
  getComparator,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/shared/components/table";

import { FileManagerGridView } from "../components/file-manager-grid-view";
import { FileManagerTableRow } from "../components/file-manager-table-row";
import { TableFileHeadCustom } from "../components/file-table-head-custom";
import { FileManagerNewFolderDialog } from "../components/file-manager-new-folder-dialog";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const FILE_TYPE_OPTIONS = [
  "txt",
  "zip",
  "audio",
  "image",
  "video",
  "word",
  "excel",
  "powerpoint",
  "pdf",
];

function compareValue(fileValue: any, filterValue: string, operator: string): boolean {
  if (operator === "avant" || operator === "apres" || operator === "egal") {
    const dateValue = dayjs(fileValue);
    const filterDate = dayjs(filterValue, "DD/MM/YYYY", true);
    if (!dateValue.isValid() || !filterDate.isValid()) {
      return false;
    }
    if (operator === "avant") {
      return dateValue.isSameOrBefore(filterDate, "day");
    }
    if (operator === "apres") {
      return dateValue.isSameOrAfter(filterDate, "day");
    }
    if (operator === "egal") {
      return dateValue.isSame(filterDate, "day");
    }
  }
  if (operator === "inferieur" || operator === "superieur" || operator === "equalsNumber") {
    const fileSizeMB = Number(fileValue) / 1048576;
    const filterSizeMB = Number(filterValue);
    if (Number.isNaN(fileSizeMB) || Number.isNaN(filterSizeMB)) {
      return false;
    }
    const roundedFileSize = Math.round(fileSizeMB * 100) / 100;
    const roundedFilterSize = Math.round(filterSizeMB * 100) / 100;
    if (operator === "inferieur") {
      return roundedFileSize <= roundedFilterSize;
    }
    if (operator === "superieur") {
      return roundedFileSize >= roundedFilterSize;
    }
    if (operator === "equalsNumber") {
      return roundedFileSize === roundedFilterSize;
    }
  }
  if (operator === "is") {
    const formatted = fileFormat(fileValue);
    return formatted.toLowerCase() === filterValue.toLowerCase();
  }
  if (operator === "is-not") {
    const formatted = fileFormat(fileValue);
    return formatted.toLowerCase() !== filterValue.toLowerCase();
  }
  const fileStr = fileValue.toString().toLowerCase();
  const filterStr = filterValue.toString().toLowerCase();
  switch (operator) {
    case "contains":
      return fileStr.includes(filterStr);
    case "equals":
      return fileStr === filterStr;
    case "starts-with":
      return fileStr.startsWith(filterStr);
    case "ends-with":
      return fileStr.endsWith(filterStr);
    case "is-empty":
      return fileStr === "";
    case "is-not-empty":
      return fileStr !== "";
    default:
      return false;
  }
}

const COLUMN_OPTIONS = [
  { value: "name", label: "Nom" },
  { value: "size", label: "Taille" },
  { value: "type", label: "Type" },
  { value: "createdAt", label: "Date de création" },
  { value: "modifiedAt", label: "Dernière modification" },
];

const OPERATOR_OPTIONS_TYPE = [
  { value: "is", label: "est" },
  { value: "is-not", label: "n'est pas" },
];

const FILE_COLUMNS = [
  { id: "select", label: "", width: 50 },
  { id: "name", label: "Nom", width: 300 },
  { id: "size", label: "Taille", width: 120 },
  { id: "type", label: "Type", width: 120 },
  { id: "startDate", label: "Date de création", width: 160 },
  { id: "endDate", label: "Dernière modification", width: 180 },
  { id: "actions", label: "Actions", width: 80 },
];

const OPERATOR_OPTIONS_DATE = [
  { value: "avant", label: "avant" },
  { value: "egal", label: "égal à" },
  { value: "apres", label: "après" },
];

const OPERATOR_OPTIONS_NUMBER = [
  { value: "inferieur", label: "inférieur à" },
  { value: "equalsNumber", label: "égal à" },
  { value: "superieur", label: "supérieur à" },
];

const OPERATOR_OPTIONS_COMMON = [
  { value: "contains", label: "contient" },
  { value: "equals", label: "égal à" },
  { value: "starts-with", label: "commence par" },
  { value: "ends-with", label: "se termine par" },
  { value: "is-empty", label: "est vide" },
  { value: "is-not-empty", label: "n'est pas vide" },
  { value: "is-any-of", label: "est l'un de" },
];

const DEFAULT_TABLE_COLUMNS = [
  { id: "name", label: "Nom" },
  { id: "size", label: "Taille" },
  { id: "type", label: "Type" },
  { id: "createdAt", label: "Date de création" },
  { id: "modifiedAt", label: "Dernière modification" },
  { id: "actions", label: "Actions", width: 88 },
];

const defaultFolder: IFolderManager = {
  id: "default-folder-id",
  name: "Default Folder",
  size: 0,
  type: "",
  url: "",
  tags: [],
  isFavorited: false,
  shared: null,
  createdAt: null,
  modifiedAt: null,
};

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IFile[];
  filters: IFileFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  let data = [...inputData];

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  data = stabilizedThis.map((el) => el[0]);

  if (filters.name) {
    data = data.filter((file) =>
      file.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }
  if (filters.size) {
    const sizeInMB = Number(filters.size);
    const sizeInBytes = sizeInMB * 1048576;
    data = data.filter((file) => Number(file.size) >= sizeInBytes);
  }
  if (filters.type.length) {
    data = data.filter((file) =>
      filters.type.includes(fileFormat(file.type))
    );
  }
  data = data.filter((file) => {
    const fileCreated = dayjs(file.createdAt);
    const fileLogged = dayjs(file.modifiedAt);
    const filterCreated = filters.startDate ? dayjs(filters.startDate, "DD/MM/YYYY", true) : null;
    const filterLastModified = filters.endDate ? dayjs(filters.endDate, "DD/MM/YYYY", true) : null;
    if (filterCreated && !filterLastModified) {
      if (!fileCreated.isValid() || !filterCreated.isValid()) return false;
      return fileCreated.isSameOrAfter(filterCreated, "day");
    }
    if (!filterCreated && filterLastModified) {
      if (!fileLogged.isValid() || !filterLastModified.isValid()) return false;
      return fileLogged.isSameOrBefore(filterLastModified, "day");
    }
    if (filterCreated && filterLastModified) {
      if (
        !fileCreated.isValid() ||
        !fileLogged.isValid() ||
        !filterCreated.isValid() ||
        !filterLastModified.isValid()
      )
        return false;
      return (
        fileCreated.isSameOrAfter(filterCreated, "day") &&
        fileLogged.isSameOrBefore(filterLastModified, "day")
      );
    }
    return true;
  });
  return data;
}

export function FileManagerView() {
  const table = useTable({ defaultRowsPerPage: 10 });
  const [tableData, setTableData] = useState<IFile[]>(_allFiles);
  const confirm = useBoolean();
  const upload = useBoolean();
  const [view, setView] = useState("list");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_TABLE_COLUMNS.map((col) => col.id)
  );
  const [anchorElColumns, setAnchorElColumns] = useState<null | HTMLElement>(null);
  const [columnSearch, setColumnSearch] = useState("");
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [filterColumn, setFilterColumn] = useState("name");
  const [filterOperator, setFilterOperator] = useState("contains");
  const [filterValue, setFilterValue] = useState("");
  const [customFilter, setCustomFilter] = useState({
    column: "name",
    operator: "contains",
    value: "",
  });
  const filters = useSetState<IFileFilters>({
    name: "",
    size: "",
    type: [],
    startDate: null,
    endDate: null,
  });
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const handleOpenColumnsMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElColumns(event.currentTarget);
  };
  const handleCloseColumnsMenu = () => {
    setAnchorElColumns(null);
  };
  const handleToggleColumn = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setVisibleColumns(DEFAULT_TABLE_COLUMNS.map((col) => col.id));
    } else {
      setVisibleColumns(["name"]);
    }
  };
  const filteredColumns = DEFAULT_TABLE_COLUMNS.filter((col) =>
    col.label.toLowerCase().includes(columnSearch.toLowerCase())
  );
  const handleOpenFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilter(event.currentTarget);
  };
  const handleCloseFilterMenu = () => {
    setAnchorElFilter(null);
  };
  const handleChangeFilterColumn = (event: SelectChangeEvent) => {
    const newCol = event.target.value as string;
    setFilterColumn(newCol);
    switch (newCol) {
      case "type":
        setFilterOperator("is");
        break;
      case "size":
        setFilterOperator("inferieur");
        break;
      case "createdAt":
      case "modifiedAt":
        setFilterOperator("avant");
        break;
      default:
        setFilterOperator("contains");
        break;
    }
    setFilterValue("");
  };
  const handleChangeFilterOperator = (event: SelectChangeEvent) => {
    setFilterOperator(event.target.value as string);
  };
  const handleApplyFilter = () => {
    setCustomFilter({ column: filterColumn, operator: filterOperator, value: filterValue });
    handleCloseFilterMenu();
  };
  const handleRefresh = () => {
    setFilterColumn("name");
    setFilterOperator("contains");
    setFilterValue("");
    setCustomFilter({ column: "name", operator: "contains", value: "" });
    filters.setState({ name: "", type: [], startDate: null, endDate: null, size: "" });
    setVisibleColumns(DEFAULT_TABLE_COLUMNS.map((col) => col.id));
  };
  let dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });
  if (customFilter.value) {
    dataFiltered = dataFiltered.filter((file) => {
      const fileValue = (file as any)[customFilter.column];
      if (fileValue === undefined || fileValue === null) return false;
      return compareValue(fileValue, customFilter.value, customFilter.operator);
    });
  }
  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );
  const notFound = dataFiltered.length === 0;
  const handleChangeView = useCallback(
    (event: React.SyntheticEvent, newView: string) => {
      if (newView) {
        setView(newView);
      }
    },
    []
  );
  const handleDeleteItem = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success("Suppression réussie !");
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );
  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    toast.success("Suppression réussie !");
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);
  const computedTableHead = [
    ...DEFAULT_TABLE_COLUMNS.filter(
      (col) => col.id !== "actions" && visibleColumns.includes(col.id)
    ),
    DEFAULT_TABLE_COLUMNS.find((col) => col.id === "actions")!,
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <CustomBreadcrumbs
            heading="Gestion des ressources"
            links={[
              { name: "Tableau de bord", href: paths.dashboard.root },
              { name: "Contenu pédagogique", href: paths.dashboard.contenu_pedagogique.ressourcesMultimedia },
              { name: "Ressources multimédias" },
            ]}
            sx={{ flex: 1 }}
          />
          <Button
            onClick={upload.onTrue}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} style={{ width: 20 }} />}
          >
            Ajouter une ressource
          </Button>
        </Box>
      </Box>

      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

      <Menu
        anchorEl={anchorElColumns}
        open={Boolean(anchorElColumns)}
        onClose={handleCloseColumnsMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { p: 1.5, width: 300 } } }}
      >
        <Box sx={{ mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Recherche"
            value={columnSearch}
            onChange={(e) => setColumnSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: 14 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <AnimatePresence>
          {filteredColumns.map((col) => {
            const isNameColumn = col.id === "name";
            const isChecked = visibleColumns.includes(col.id);
            return (
              <m.div
                key={col.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <MenuItem
                  disabled={isNameColumn}
                  onClick={() => {
                    if (!isNameColumn) handleToggleColumn(col.id);
                  }}
                  sx={{ px: 1, py: 0.5 }}
                >
                  <Checkbox checked={isChecked} disabled={isNameColumn} sx={{ mr: 1 }} />
                  <ListItemText primary={col.label} />
                </MenuItem>
              </m.div>
            );
          })}
        </AnimatePresence>
        <Divider sx={{ my: 1 }} />
        <MenuItem>
          <Checkbox
            checked={visibleColumns.length === DEFAULT_TABLE_COLUMNS.length}
            onChange={(e) => handleToggleAll(e.target.checked)}
            sx={{ mr: 1 }}
          />
          <ListItemText primary="Afficher/Masquer tout" />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={anchorElFilter}
        open={Boolean(anchorElFilter)}
        onClose={handleCloseFilterMenu}
        slotProps={{ paper: { sx: { p: 2, width: 600, borderRadius: 2 } } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
          <Box component="span" sx={{ fontWeight: 600 }}>
            Filtres
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <IconButton onClick={handleCloseFilterMenu} size="small" sx={{ ml: "auto" }}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 2 }}>
          <FormControl fullWidth size="small">
            <TextField
              select
              label="Colonne"
              value={filterColumn}
              onChange={(event) => handleChangeFilterColumn(event as SelectChangeEvent)}
              SelectProps={{ native: false }}
            >
              {COLUMN_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            <TextField
              select
              label="Opérateur"
              value={filterOperator}
              onChange={(event) => handleChangeFilterOperator(event as SelectChangeEvent)}
              SelectProps={{ native: false }}
            >
              {(filterColumn === "type"
                ? OPERATOR_OPTIONS_TYPE
                : filterColumn === "createdAt" || filterColumn === "modifiedAt"
                ? OPERATOR_OPTIONS_DATE
                : filterColumn === "size"
                ? OPERATOR_OPTIONS_NUMBER
                : OPERATOR_OPTIONS_COMMON
              ).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            {filterColumn === "type" ? (
              <TextField
                select
                label="Valeur"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                SelectProps={{ native: false }}
              >
                <MenuItem value="">Tous</MenuItem>
                {FILE_TYPE_OPTIONS.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            ) : filterColumn === "createdAt" || filterColumn === "modifiedAt" ? (
              <DatePicker
                label="Valeur"
                value={filterValue ? dayjs(filterValue, "DD/MM/YYYY") : null}
                onChange={(newValue) => {
                  if (newValue) {
                    setFilterValue(newValue.format("DD/MM/YYYY"));
                  } else {
                    setFilterValue("");
                  }
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: "JJ/MM/AAAA",
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: 1 } },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faFilter} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            ) : (
              <TextField
                fullWidth
                label="Valeur"
                size="small"
                placeholder={filterColumn.includes("At") ? "JJ/MM/AAAA" : ""}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faFilter} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
          <Button variant="contained" size="small" onClick={handleApplyFilter}>
            Appliquer
          </Button>
        </Box>
      </Menu>

      <Card>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            width: "100%",
            mt: 2,
          }}
        >
          <Tabs value={view} onChange={handleChangeView} sx={{ px: 2.5, maxWidth: "65%" }}>
            <Tab label="Liste" value="list" />
            <Tab label="Grid" value="grid" />
          </Tabs>
          <Box sx={{ gap: 2, flexShrink: 0 }}>
            {view === "list" ? (
              <Button
                size="small"
                variant="outlined"
                endIcon={<FontAwesomeIcon icon={faTable} />}
                onClick={handleOpenColumnsMenu}
                color="primary"
              >
                Colonnes
              </Button>
            ):(
              <>
              </>
            )}
            <Tooltip
              title="Filtres"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: 14,
                    borderRadius: 1,
                    boxShadow: 3,
                    padding: "6px 12px",
                  },
                },
                arrow: { sx: { color: "primary.main" } },
              }}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={handleOpenFilterMenu}
                sx={{
                  width: 50,
                  height: 50,
                  minWidth: 0,
                  padding: 0,
                  borderRadius: "50%",
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Rafraîchir"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: 14,
                    borderRadius: 1,
                    boxShadow: 3,
                    padding: "6px 12px",
                  },
                },
                arrow: { sx: { color: "primary.main" } },
              }}
            >
              <IconButton
                size="small"
                onClick={handleRefresh}
                color="primary"
                sx={{
                  width: 50,
                  height: 50,
                  padding: 0,
                  borderRadius: "50%",
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Exporter"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: 14,
                    borderRadius: 1,
                    boxShadow: 3,
                    padding: "6px 12px",
                  },
                },
                arrow: { sx: { color: "primary.main" } },
              }}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={() => {}}
                sx={{
                  width: 50,
                  height: 50,
                  minWidth: 0,
                  padding: 0,
                  borderRadius: "50%",
                }}
              >
                <FontAwesomeIcon icon={faFileExport} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 450, position: "relative" }}>
          {view === "list" ? (
            <Table size="medium" sx={{ width: "100%", minWidth: { xs: "auto", sm: 720 } }}>
              <TableFileHeadCustom
                columns={FILE_COLUMNS}
                fileFilters={filters}
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                totalResults={dataFiltered.length}
                numSelected={table.selected.length}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, dataFiltered.map((row) => row.id))
                }
              />
              {table.selected.length > 0 ? (
                <TableSelectedAction
                  numSelected={table.selected.length}
                  rowCount={dataFiltered.length}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, dataFiltered.map((row) => row.id))
                  }
                  action={
                    <Tooltip title="Supprimer">
                      <IconButton color="primary" onClick={handleDeleteItems}>
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}
                />
              ):(
                <>
                </>
              )}
              <TableBody>
                {notFound ? (
                  <TableNoData notFound />
                ) : (
                  dataFiltered
                    .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                    .map((row) => (
                      <FileManagerTableRow
                        key={row.id}
                        row={row}
                        folder={defaultFolder}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteItem(row.id)}
                        columns={computedTableHead}
                      />
                    ))
                )}
              </TableBody>
            </Table>
          ) : (
            <FileManagerGridView
              table={table}
              dataFiltered={dataFiltered}
              onDeleteItem={handleDeleteItem}
              onOpenConfirm={confirm.onTrue}
            />
          )}
        </TableContainer>

        {dataFiltered.length > table.rowsPerPage ? (
          <TablePaginationCustom
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            count={dataFiltered.length}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            sx={{
              [`& .${tablePaginationClasses.toolbar}`]: { borderTopColor: "transparent" },
            }}
          />
        ):(
          <>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> éléments ?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </DashboardContent>
  );
}