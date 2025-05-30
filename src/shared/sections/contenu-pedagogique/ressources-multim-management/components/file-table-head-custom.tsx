"use client";

import type { IFileFilters } from "src/contexts/types/file";
import type { UseSetStateReturn } from "src/hooks/use-set-state";

import dayjs from "dayjs";
import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Select,
  Checkbox,
  TableRow,
  MenuItem,
  TableHead,
  TableCell,
  TextField,
  FormControl,
  OutlinedInput,
  TableSortLabel,
  InputAdornment,
} from "@mui/material";

const FILE_TYPE_OPTIONS = [
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

export type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
};

type Props = {
  columns: Column[];
  fileFilters: UseSetStateReturn<IFileFilters>;
  order: "asc" | "desc";
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  numSelected?: number;
  rowCount?: number;
  onSelectAllRows?: (checked: boolean) => void;
};

export function TableFileHeadCustom({
  columns,
  fileFilters,
  order,
  orderBy,
  onSort,
  totalResults,
  numSelected = 0,
  rowCount = 0,
  onSelectAllRows,
}: Props) {
  const [showNameInput, setShowNameInput] = useState(false);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [showStartDateInput, setShowStartDateInput] = useState(false);
  const [showEndDateInput, setShowEndDateInput] = useState(false);

  return (
    <TableHead
      sx={{
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 2,
      }}
    >
      <TableRow
        sx={{
          height: 50,
          "& .MuiTableCell-root": { padding: "5px 10px" },
        }}
      >
        {columns.map((col) => {
          if (col.id === "select") {
            return (
              <TableCell key="select" width={col.width} padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={(event) => onSelectAllRows?.(event.target.checked)}
                />
              </TableCell>
            );
          }
          if (col.id === "actions") {
            return (
              <TableCell
                key={col.id}
                width={col.width}
                sx={{ ...col.sx, textAlign: "center" }}
                sortDirection={orderBy === col.id ? order : false}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: -0.3,
                    pl: 4
                  }}
                >
                  <Box sx={{ display: "inline-flex", alignItems: "center", p: 0 }}>
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => onSort(col.id)}
                      sx={{ lineHeight: 1, p: 0 }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </Box>
                  <Box sx={{ height: "36px" }} />
                </Box>
              </TableCell>
            );
          }
          return (
            <TableCell
              key={col.id}
              width={col.width}
              sx={col.sx}
              sortDirection={orderBy === col.id ? order : false}
              align="left"
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: -0.3 }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", p: 0 }}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => onSort(col.id)}
                    sx={{ lineHeight: 1, p: 0 }}
                  >
                    {col.label}
                  </TableSortLabel>
                </Box>
                {(() => {
                  switch (col.id) {
                    case "name":
                      return showNameInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={fileFilters.state.name}
                          onChange={(e) =>
                            fileFilters.setState({ name: e.target.value })
                          }
                          onBlur={() => {
                            if (!fileFilters.state.name) setShowNameInput(false);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                              </InputAdornment>
                            ),
                            sx: {
                              "& fieldset": { border: "none" },
                              backgroundColor: "background.neutral",
                              borderRadius: 1,
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowNameInput(true)}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "background.neutral",
                            borderRadius: 1,
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case "size":
                      return showSizeInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={fileFilters.state.size}
                          onChange={(e) =>
                            fileFilters.setState({ size: e.target.value })
                          }
                          onBlur={() => {
                            if (!fileFilters.state.size) setShowSizeInput(false);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                              </InputAdornment>
                            ),
                            sx: {
                              "& fieldset": { border: "none" },
                              backgroundColor: "background.neutral",
                              borderRadius: 1,
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowSizeInput(true)}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "background.neutral",
                            borderRadius: 1,
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case "type":
                      return showTypeInput ? (
                        <FormControl fullWidth size="small">
                          <Select
                            autoFocus
                            value={fileFilters.state.type[0] || ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                fileFilters.setState({ type: [e.target.value] });
                              } else {
                                fileFilters.setState({ type: [] });
                              }
                            }}
                            onClose={() => {
                              if (!fileFilters.state.type.length)
                                setShowTypeInput(false);
                            }}
                            input={<OutlinedInput label="Type" />}
                            sx={{
                              "& fieldset": { border: "none" },
                              backgroundColor: "background.neutral",
                              borderRadius: 1,
                            }}
                          >
                            <MenuItem value="">
                              <em>Tous</em>
                            </MenuItem>
                            {FILE_TYPE_OPTIONS.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Box
                          onClick={() => setShowTypeInput(true)}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "background.neutral",
                            borderRadius: 1,
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case "startDate":
                      return showStartDateInput ? (
                        <DatePicker
                          autoFocus
                          value={
                            fileFilters.state.startDate
                              ? dayjs(fileFilters.state.startDate, "DD/MM/YYYY")
                              : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              fileFilters.setState({
                                startDate: newValue.format("DD/MM/YYYY"),
                              });
                            } else {
                              fileFilters.setState({ startDate: "" });
                            }
                          }}
                          onClose={() => {
                            if (!fileFilters.state.startDate)
                              setShowStartDateInput(false);
                          }}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              sx: {
                                "& fieldset": { border: "none" },
                                backgroundColor: "background.neutral",
                                borderRadius: 1,
                              },
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSearch} />
                                  </InputAdornment>
                                ),
                              },
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowStartDateInput(true)}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "background.neutral",
                            borderRadius: 1,
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case "endDate":
                      return showEndDateInput ? (
                        <DatePicker
                          autoFocus
                          value={
                            fileFilters.state.endDate
                              ? dayjs(fileFilters.state.endDate, "DD/MM/YYYY")
                              : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              fileFilters.setState({
                                endDate: newValue.format("DD/MM/YYYY"),
                              });
                            } else {
                              fileFilters.setState({ endDate: "" });
                            }
                          }}
                          onClose={() => {
                            if (!fileFilters.state.endDate)
                              setShowEndDateInput(false);
                          }}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              sx: {
                                "& fieldset": { border: "none" },
                                backgroundColor: "background.neutral",
                                borderRadius: 1,
                              },
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSearch} />
                                  </InputAdornment>
                                ),
                              },
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowEndDateInput(true)}
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "background.neutral",
                            borderRadius: 1,
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    default:
                      return null;
                  }
                })()}
              </Box>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}