import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export type SuiviErreursFiltersProps = {
  onFilterChange?: (filters: {
    period: string;
    subject: string;
    chapter: string;
  }) => void;
};

export function SuiviErreursFilters({ onFilterChange }: SuiviErreursFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('trimestre1');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');

  const handlePeriodChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedPeriod(newValue);
    if (onFilterChange) {
      onFilterChange({
        period: newValue,
        subject: selectedSubject,
        chapter: selectedChapter,
      });
    }
  };

  const handleSubjectChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedSubject(newValue);
    if (onFilterChange) {
      onFilterChange({
        period: selectedPeriod,
        subject: newValue,
        chapter: selectedChapter,
      });
    }
  };

  const handleChapterChange = (event: any) => {
    const newValue = event.target.value;
    setSelectedChapter(newValue);
    if (onFilterChange) {
      onFilterChange({
        period: selectedPeriod,
        subject: selectedSubject,
        chapter: newValue,
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth size="small">
          <InputLabel id="period-select-label">Trimestre</InputLabel>
          <Select
            labelId="period-select-label"
            value={selectedPeriod}
            label="Trimestre"
            onChange={handlePeriodChange}
          >
            <MenuItem value="trimestre1">Trimestre 1</MenuItem>
            <MenuItem value="trimestre2">Trimestre 2</MenuItem>
            <MenuItem value="trimestre3">Trimestre 3</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth size="small">
          <InputLabel id="subject-select-label">Matières</InputLabel>
          <Select
            labelId="subject-select-label"
            value={selectedSubject}
            label="Matières"
            onChange={handleSubjectChange}
          >
            <MenuItem value="all">Toutes les matières</MenuItem>
            <MenuItem value="math">Mathématiques</MenuItem>
            <MenuItem value="french">Français</MenuItem>
            <MenuItem value="science">Sciences</MenuItem>
            <MenuItem value="history">Histoire-Géographie</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth size="small">
          <InputLabel id="chapter-select-label">Chapitres</InputLabel>
          <Select
            labelId="chapter-select-label"
            value={selectedChapter}
            label="Chapitres"
            onChange={handleChapterChange}
          >
            <MenuItem value="all">Tous les chapitres</MenuItem>
            <MenuItem value="chapter1">Chapitre 1</MenuItem>
            <MenuItem value="chapter2">Chapitre 2</MenuItem>
            <MenuItem value="chapter3">Chapitre 3</MenuItem>
            <MenuItem value="chapter4">Chapitre 4</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}