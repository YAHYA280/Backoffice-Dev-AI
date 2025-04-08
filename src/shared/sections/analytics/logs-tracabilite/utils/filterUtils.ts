import type { Alerte, LogEntry, ActionsCritique, ILogTableFilters, IAlerteTableFilters, IActionsCritiqueTableFilters } from 'src/shared/_mock/_logs';

import dayjs from 'dayjs';

export function compareValue(value: any, filterValue: string, operator: string): boolean {
  if (operator === 'avant' || operator === 'apres' || operator === 'egal') {
    const dateValue = dayjs(value);
    const filterDate = dayjs(filterValue, 'DD/MM/YYYY', true);
    if (!dateValue.isValid() || !filterDate.isValid()) return false;
    if (operator === 'avant') return dateValue.isSameOrBefore(filterDate, 'day');
    if (operator === 'apres') return dateValue.isSameOrAfter(filterDate, 'day');
    if (operator === 'egal') return dateValue.isSame(filterDate, 'day');
  }
  if (operator === 'inferieur' || operator === 'superieur') {
    const numValue = Number(value);
    const numFilter = Number(filterValue);
    if (Number.isNaN(numValue) || Number.isNaN(numFilter)) return false;
    return operator === 'inferieur' ? numValue <= numFilter : numValue >= numFilter;
  }
  const valueStr = value.toString().toLowerCase();
  const filterStr = filterValue.toLowerCase();
  switch (operator) {
    case 'contains':
      return valueStr.includes(filterStr);
    case 'equals':
      return valueStr === filterStr;
    case 'starts-with':
      return valueStr.startsWith(filterStr);
    case 'ends-with':
      return valueStr.endsWith(filterStr);
    case 'is-empty':
      return valueStr === '';
    case 'is-not-empty':
      return valueStr !== '';
    case 'is':
      return valueStr === filterStr;
    case 'is-not':
      return valueStr !== filterStr;
    default:
      return false;
  }
}

type ApplyFilterProps = {
  inputData: LogEntry[];
  filters: ILogTableFilters;
  comparator: (a: any, b: any) => number;
};

export function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  let data = [...inputData];
  data.sort(comparator);
  if (filters.userName) {
    data = data.filter((log) => log.userName.toLowerCase().includes(filters.userName.toLowerCase()));
  }
  if (filters.device) {
    data = data.filter((log) => log.device.toLowerCase().includes(filters.device.toLowerCase()));
  }
  if (filters.browser) {
    data = data.filter((log) => log.browser.toLowerCase().includes(filters.browser.toLowerCase()));
  }
  if (filters.ipaddress) {
    data = data.filter((log) => log.ipaddress.toLowerCase().includes(filters.ipaddress.toLowerCase()));
  }
  if (filters.statut.length) {
    data = data.filter((log) => filters.statut.includes(log.statut));
  }
  if (filters.logintime) {
    const filterDate = dayjs(filters.logintime, 'DD/MM/YYYY', true);
    data = data.filter((log) => {
      const loginDate = dayjs(log.logintime);
      return loginDate.isValid() && filterDate.isValid() && loginDate.isSameOrAfter(filterDate, 'day');
    });
  }
  return data;
}

type ApplyActionFilterProps = {
  inputData: ActionsCritique[];
  actionFilters: IActionsCritiqueTableFilters;
  comparator: (a: any, b: any) => number;
};

export function applyActionFilter({ inputData, comparator, actionFilters }: ApplyActionFilterProps) {
  let data = [...inputData];
  data.sort(comparator);
  if (actionFilters.userName) {
    data = data.filter((action) => action.userName.toLowerCase().includes(actionFilters.userName.toLowerCase()));
  }
  if (actionFilters.typeAction) {
    data = data.filter((action) => action.typeAction.toLowerCase().includes(actionFilters.typeAction.toLowerCase()));
  }
  if (actionFilters.statut.length) {
    data = data.filter((action) => actionFilters.statut.includes(action.statut));
  }
  if (actionFilters.details) {
    data = data.filter((action) => action.details.toLowerCase().includes(actionFilters.details.toLowerCase()));
  }
  if (actionFilters.dateAction) {
    const filterDate = dayjs(actionFilters.dateAction, 'DD/MM/YYYY', true);
    data = data.filter((action) => {
      const actionDate = dayjs(action.dateAction);
      return actionDate.isValid() && filterDate.isValid() && actionDate.isSameOrAfter(filterDate, 'day');
    });
  }
  return data;
}

type ApplyAlerteFilterProps = {
  inputData: Alerte[];
  filtersAlertes: IAlerteTableFilters;
  comparator: (a: any, b: any) => number;
};

export function applyAlerteFilter({ inputData, comparator, filtersAlertes }: ApplyAlerteFilterProps) {
  let data = [...inputData];
  data.sort(comparator);
  if (filtersAlertes.userName) {
    data = data.filter((alerte) => alerte.userName.toLowerCase().includes(filtersAlertes.userName.toLowerCase()));
  }
  if (filtersAlertes.description) {
    data = data.filter((alerte) => alerte.description.toLowerCase().includes(filtersAlertes.description.toLowerCase()));
  }
  if (filtersAlertes.titre) {
    data = data.filter((alerte) => alerte.titre.toLowerCase().includes(filtersAlertes.titre.toLowerCase()));
  }
  if (filtersAlertes.criticite.length) {
    data = data.filter((alerte) => filtersAlertes.criticite.includes(alerte.criticite));
  }
  if (filtersAlertes.dateAlerte) {
    const filterDate = dayjs(filtersAlertes.dateAlerte, 'DD/MM/YYYY', true);
    data = data.filter((alerte) => {
      const alerteDate = dayjs(alerte.dateAlerte);
      return alerteDate.isValid() && filterDate.isValid() && alerteDate.isSameOrAfter(filterDate, 'day');
    });
  }
  return data;
}
