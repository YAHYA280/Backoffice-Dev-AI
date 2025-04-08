import type { IDateValue } from "src/contexts/types/common";

export enum Statut {
    Succès = "Succès",
    Échec = "Échec",
}
  
export type LogEntry = {
    id: string;
    userName: string;        
    ipaddress: string;  
    logintime: Date;
    statut: Statut;
    device: string;
    browser: string;
};

export type ILogTableFilters = {
    userName: string;
    ipaddress: string;
    logintime: Date | null | IDateValue;
    statut: string[];
    device: string;
    browser: string;
};

export const _logs: LogEntry[] = [
  { 
    id: "1", 
    userName: "Alice Johnson",
    ipaddress: "192.168.1.10", 
    logintime: new Date("2025-04-04T09:00:12Z"), 
    statut: Statut.Succès,
    device: "Desktop",
    browser: "Chrome"
  },
  { 
    id: "2", 
    userName: "Bob Smith",
    ipaddress: "127.168.1.11", 
    logintime: new Date("2025-04-04T09:15:47Z"),
    statut: Statut.Succès,
    device: "Desktop",
    browser: "Firefox"
  },
  { 
    id: "3", 
    userName: "Carol Davis",
    ipaddress: "160.168.1.12", 
    logintime: new Date("2025-02-25T10:05:03Z"), 
    statut: Statut.Succès,
    device: "Mobile",
    browser: "Chrome"
  },
  { 
    id: "4", 
    userName: "David Wilson",
    ipaddress: "192.150.1.13", 
    logintime: new Date("2025-04-04T10:16:55Z"), 
    statut: Statut.Échec,
    device: "Desktop",
    browser: "Edge"
  },
  { 
    id: "5", 
    userName: "Eve Brown",
    ipaddress: "192.168.1.14", 
    logintime: new Date("2025-02-25T11:02:22Z"), 
    statut: Statut.Succès,
    device: "Tablet",
    browser: "Safari"
  },
  { 
    id: "6",
    userName: "Frank Miller",
    ipaddress: "192.168.1.12", 
    logintime: new Date("2025-02-27T11:25:49Z"), 
    statut: Statut.Échec,
    device: "Desktop",
    browser: "Firefox"
  },
  { 
    id: "7", 
    userName: "Grace Lee",
    ipaddress: "192.168.1.15", 
    logintime: new Date("2025-02-25T12:40:05Z"), 
    statut: Statut.Succès,
    device: "Mobile",
    browser: "Safari"
  },
  { 
    id: "8", 
    userName: "Henry Clark",
    ipaddress: "192.168.1.16", 
    logintime: new Date("2025-02-25T12:57:31Z"), 
    statut: Statut.Échec,
    device: "Desktop",
    browser: "Chrome"
  },
  { 
    id: "9", 
    userName: "Irene Walker",
    ipaddress: "192.168.1.17", 
    logintime: new Date("2025-02-25T13:10:59Z"), 
    statut: Statut.Succès,
    device: "Tablet",
    browser: "Firefox"
  },
  { 
    id: "10", 
    userName: "Jack Thompson",
    ipaddress: "192.168.1.18", 
    logintime: new Date("2025-02-26T14:05:42Z"), 
    statut: Statut.Succès,
    device: "Desktop",
    browser: "Edge"
  },
];

//---------------------------------------------------------------------------

export type ActionsCritique = {
  id: string;
  userName: string;
  typeAction: string;      
  dateAction: Date;
  statut: Statut;
  details: string;
};

export type IActionsCritiqueTableFilters = {
  userName: string;
  typeAction: string;
  dateAction: Date | null | IDateValue;
  statut: string[];
  details: string;
};

export const _actionsCritiques: ActionsCritique[] = [
  {
    id: '1',
    userName: 'Alice Johnson',
    typeAction: 'Modification de rôle',
    dateAction: new Date('2025-02-25 09:05:18'),
    statut: Statut.Succès,
    details: 'Changement du rôle de Bob Smith'
  },
  {
    id: '2',
    userName: 'Bob Smith',
    typeAction: 'Accès données sensibles',
    dateAction: new Date('2025-02-25 08:55:22'),
    statut: Statut.Succès,
    details: 'Accès au dossier financier Q4-2024'
  },
  {
    id: '3',
    userName: 'Carol Davis',
    typeAction: 'Suppression de compte',
    dateAction: new Date('2025-02-25 08:30:41'),
    statut: Statut.Succès,
    details: 'Suppression du compte Alice Johnson'
  },
  {
    id: '4',
    userName: 'David Wilson',
    typeAction: 'Modification de paramètres',
    dateAction: new Date('2025-02-25 08:15:33'),
    statut: Statut.Succès,
    details: 'Modification des paramètres de sécurité'
  },
  {
    id: '5',
    userName: 'Eve Brown',
    typeAction: 'Modification de droits',
    dateAction: new Date('2025-02-24 17:22:45'),
    statut: Statut.Succès,
    details: 'Attribution de droits administrateur à David Wilson'
  },
  {
    id: '6',
    userName: 'Frank Miller',
    typeAction: 'Restauration de données',
    dateAction: new Date('2025-02-24 15:10:12'),
    statut: Statut.Échec,
    details: 'Tentative de restauration de la base RH-2024'
  },
  {
    id: '7',
    userName: 'Grace Lee',
    typeAction: 'Accès données sensibles',
    dateAction: new Date('2025-02-24 14:33:29'),
    statut: Statut.Succès,
    details: 'Consultation des salaires département marketing'
  },
  {
    id: '8',
    userName: 'Henry Clark',
    typeAction: 'Exportation de données',
    dateAction: new Date('2025-02-24 11:45:37'),
    statut: Statut.Succès,
    details: 'Export complet de la base clients vers Excel'
  },
  {
    id: '9',
    userName: 'Irene Walker',
    typeAction: 'Modification configuration',
    dateAction: new Date('2025-02-23 16:20:08'),
    statut: Statut.Succès,
    details: 'Mise à jour des paramètres de sécurité réseau'
  },
  {
    id: '10',
    userName: 'Jack Thompson',
    typeAction: 'Création de compte',
    dateAction: new Date('2025-02-23 10:05:51'),
    statut: Statut.Succès,
    details: 'Création du compte pour nouveau.directeur avec privilèges étendus'
  }
];

export enum Criticite {
  Élevé = 'Élevé',
  Modéré = 'Modéré',
  Faible = 'Faible',
}

export type Alerte = {
  id: string;
  titre: string;
  userName: string;
  description: string;
  dateAlerte: Date;
  criticite: Criticite;
};

export type IAlerteTableFilters = {
  titre: string;
  userName: string;
  description: string;
  dateAlerte: Date | null | IDateValue;
  criticite: string[];
};

export const _alertes: Alerte[] = [
  {
    id: '1',
    titre: 'Tentatives de connexion multiples',
    userName: 'Alice Jones',
    description: '3 échecs consécutifs depuis la même adresse IP',
    dateAlerte: new Date('2025-02-25T20:55:55Z'),
    criticite: Criticite.Élevé,
  },
  {
    id: '2',
    titre: 'Accès inhabituel',
    userName: 'Bob Smith',
    description: 'Accès à des données sensibles pour la première fois',
    dateAlerte: new Date('2025-02-25T20:15:15Z'),
    criticite: Criticite.Modéré,
  },
  {
    id: '3',
    titre: 'Connexion depuis nouveau pays',
    userName: 'Carol Davis',
    description: 'Première connexion depuis l’Allemagne',
    dateAlerte: new Date('2025-02-24T19:45:10Z'),
    criticite: Criticite.Faible,
  },
  {
    id: '4',
    titre: 'Modifications suspectes',
    userName: 'David Wilson',
    description: 'Modification des privilèges administratifs détectée',
    dateAlerte: new Date('2025-02-24T18:30:00Z'),
    criticite: Criticite.Élevé,
  },
  {
    id: '5',
    titre: 'Nouvel appareil détecté',
    userName: 'Eve Brown',
    description: 'Connexion depuis un nouvel appareil non reconnu',
    dateAlerte: new Date('2025-02-23T17:20:00Z'),
    criticite: Criticite.Modéré,
  },
  {
    id: '6',
    titre: 'Changement de localisation',
    userName: 'Frank Miller',
    description: 'Connexion depuis une localisation géographique inhabituelle',
    dateAlerte: new Date('2025-02-23T16:15:30Z'),
    criticite: Criticite.Faible,
  },
  {
    id: '7',
    titre: 'Anomalie dans les données',
    userName: 'Grace Lee',
    description: 'Incohérences détectées dans les journaux de sécurité',
    dateAlerte: new Date('2025-02-22T15:10:00Z'),
    criticite: Criticite.Modéré,
  },
  {
    id: '8',
    titre: 'Déconnexion forcée',
    userName: 'Henry Clark',
    description: 'Déconnexion forcée après détection d\'activité suspecte',
    dateAlerte: new Date('2025-02-22T14:05:00Z'),
    criticite: Criticite.Élevé,
  },
  {
    id: '9',
    titre: 'Erreur de système',
    userName: 'Irene Walker',
    description: 'Erreur système lors du processus de connexion',
    dateAlerte: new Date('2025-02-21T13:00:00Z'),
    criticite: Criticite.Faible,
  },
  {
    id: '10',
    titre: 'Accès non autorisé',
    userName: 'Jack Thompson',
    description: 'Tentative d\'accès non autorisée à une ressource critique',
    dateAlerte: new Date('2025-02-21T12:00:00Z'),
    criticite: Criticite.Élevé,
  },
];

//---------------------------------------------------------------------------
export type ActiveSession = {
  sessionId: string;
  userName: string;
  ipaddress: string;
  device: string;
  startedAt: Date;
  lastActivity: Date;
  tokenExpiry: Date;
};

export const _activeSessions: ActiveSession[] = [
  {
    sessionId: "session-1",
    userName: "Alice Johnson",
    ipaddress: "192.168.1.10",
    device: "Desktop",
    startedAt: new Date("2025-04-04T09:00:12Z"),
    lastActivity: new Date("2025-04-04T09:10:00Z"),
    tokenExpiry: new Date("2025-04-04T10:00:00Z"),
  },
  {
    sessionId: "session-2",
    userName: "Bob Smith",
    ipaddress: "127.168.1.11",
    device: "Desktop",
    startedAt: new Date("2025-04-04T09:15:47Z"),
    lastActivity: new Date("2025-04-04T09:20:00Z"),
    tokenExpiry: new Date("2025-04-04T10:15:00Z"),
  },
  {
    sessionId: "session-3",
    userName: "Carol Davis",
    ipaddress: "160.168.1.12",
    device: "Mobile",
    startedAt: new Date("2025-04-04T09:30:00Z"),
    lastActivity: new Date("2025-04-04T09:35:00Z"),
    tokenExpiry: new Date("2025-04-04T10:30:00Z"),
  },
  {
    sessionId: "session-4",
    userName: "David Wilson",
    ipaddress: "192.150.1.13",
    device: "Desktop",
    startedAt: new Date("2025-04-04T10:00:00Z"),
    lastActivity: new Date("2025-04-04T10:05:00Z"),
    tokenExpiry: new Date("2025-04-04T11:00:00Z"),
  },
];
