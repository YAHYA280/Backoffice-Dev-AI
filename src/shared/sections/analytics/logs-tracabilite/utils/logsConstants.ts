export const DEFAULT_LOGS_COLUMNS = [
    { id: 'userName', label: "Nom", width: 150 },
    { id: 'ipaddress', label: 'Adresse IP', width: 120 },
    { id: 'logintime', label: 'Date Et Heure', width: 170 },
    { id: 'device', label: 'Appareil', width: 130 },
    { id: 'browser', label: 'Navigateur', width: 130 },
    { id: 'statut', label: 'Statut', width: 130 },
  ];
  
  export const DEFAULT_ACTION_COLUMNS = [
    { id: 'userName', label: "Nom", width: 130 },
    { id: 'typeAction', label: "Type d'action", width: 170 },
    { id: 'dateAction', label: "Date d'action", width: 150 },
    { id: 'details', label: 'Détails', width: 280 },
    { id: 'statut', label: 'Statut', width: 60 },
  ];
  
  export const DEFAULT_ALERTES_COLUMNS = [
    { id: 'userName', label: 'Nom', width: 150 },
    { id: 'titre', label: 'Titre', width: 200 },
    { id: 'description', label: 'Description', width: 250 },
    { id: 'dateAlerte', label: 'Date Alerte', width: 170 },
    { id: 'criticite', label: 'Criticité', width: 100 },
    { id: 'actions', label: 'Actions', width: 60 },
  ];
  
  export const FILTER_LOGS_OPTIONS = [
    { value: 'userName', label: 'Nom' },
    { value: 'ipaddress', label: 'Adresse ip' },
    { value: 'logintime', label: 'Date login' },
    { value: 'device', label: 'Appareil' },
    { value: 'browser', label: 'Navigateur' },
    { value: 'statut', label: 'Statut' },
  ];
  
  export const FILTER_ACTION_OPTIONS = [
    { value: 'userName', label: "Nom" },
    { value: 'typeAction', label: "Type d'action" },
    { value: 'dateAction', label: "Date d'action" },
    { value: 'statut', label: "Statut" },
    { value: 'details', label: "Détails" },
  ];
  
  export const OPERATOR_TEXT_OPTIONS = [
    { value: 'contains', label: 'contient' },
    { value: 'equals', label: 'égal à' },
    { value: 'starts-with', label: 'commence par' },
    { value: 'ends-with', label: 'se termine par' },
    { value: 'is-empty', label: 'est vide' },
    { value: 'is-not-empty', label: "n'est pas vide" },
  ];
  
  export const OPERATOR_DATE_OPTIONS = [
    { value: 'avant', label: 'avant' },
    { value: 'egal', label: 'égal à' },
    { value: 'apres', label: 'après' },
  ];
  
  export const OPERATOR_TYPE_OPTIONS = [
    { value: 'is', label: 'est' },
    { value: 'is-not', label: "n'est pas" },
  ];
  