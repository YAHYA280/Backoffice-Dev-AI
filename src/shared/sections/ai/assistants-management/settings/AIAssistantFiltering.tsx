"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faSync,
  faSave,
  faTrash,
  faHistory,
  faPlusCircle,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Chip,
  Grid,
  List,
  Alert,
  Paper,
  Table,
  Switch,
  Button,
  Select,
  Dialog,
  Divider,
  MenuItem,
  ListItem,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  DialogTitle,
  ListItemText,
  DialogActions,
  DialogContent,
  TableContainer,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";

import { AIAssistantHistoryService } from "../AIAssistantHistoryService";

type SupervisionRule = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isSystemRule: boolean;
  parameters?: {
    [key: string]: any;
  };
  lastModified?: string;
  lastModifiedBy?: string;
  lastModificationComment?: string;
};

type AIAssistantFilteringProps = {
  assistantId: string;
};

export default function AIAssistantFiltering({ assistantId }: AIAssistantFilteringProps) {
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updatingKnowledgeBase, setUpdatingKnowledgeBase] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rules, setRules] = useState<SupervisionRule[]>([
    {
        id: "rule-1",
        name: "Vérification de la complexité",
        description: "Analyse le niveau de difficulté des réponses pour s'assurer qu'il correspond au niveau scolaire",
        enabled: true,
        isSystemRule: true
    },
    {
        id: "rule-2",
        name: "Détection des réponses directes",
        description: "Empêche l'IA de donner des réponses directes aux exercices",
        enabled: true,
        isSystemRule: true
    },
    {
        id: "rule-3",
        name: "Contrôle du niveau de langue",
        description: "Vérifie que le vocabulaire utilisé est adapté au niveau des élèves",
        enabled: true,
        isSystemRule: true
    },
    {
        id: "rule-4",
        name: "Limitation des réponses",
        description: "Limite la longueur des réponses à 500 caractères maximum",
        enabled: true,
        isSystemRule: true
    },
    {
      id: "custom-1",
      name: "Vocabulaire simplifié",
      description: "Adapte le niveau de langage pour les élèves de primaire",
      enabled: true,
      isSystemRule: false,
      parameters: {
        complexityLevel: 2
      },
      lastModified: "2025-02-15T14:30:00",
      lastModifiedBy: "Marie Dubois",
      lastModificationComment: "Adaptation pour les CP-CE1"
    }
  ]);

  // Fetch modification history from service
  const modificationHistory = AIAssistantHistoryService.getHistory();

  // Dialog states
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SupervisionRule | null>(null);
  const [newRuleComment, setNewRuleComment] = useState("");
  const [ruleFormData, setRuleFormData] = useState({
    name: "",
    description: "",
    enabled: true,
    parameters: {}
  });

  // Terms blocking
  const [newBlockedTermStudent, setNewBlockedTermStudent] = useState("");
  const [blockedTermsStudent, setBlockedTermsStudent] = useState<string[]>([
    "gros mot", "insulte", "violence", "inapproprié"
  ]);
  const [newBlockedTerm, setNewBlockedTerm] = useState("");
  const [blockedTerms, setBlockedTerms] = useState<string[]>([
    "torturer", "tuer", "fume", "relations sexuelle "
  ]);

  // States for date filtering
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filtered history based on selected dates
  const filteredHistory = modificationHistory.filter((entry) => {
    const entryDate = new Date(entry.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || entryDate >= start) && (!end || entryDate <= end);
  });

  // Chargement des données initiales
  useEffect(() => {
    const fetchFilteringSettings = async () => {
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres de filtrage :", error);
        setLoading(false);
      }
    };

    fetchFilteringSettings();
  }, [assistantId]);

  // Gestion des événements
  const handleRuleToggle = (ruleId: string) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === ruleId
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  // Fonctions pour gérer les termes bloqués pour l'assistant
  const handleAddBlockedTerm = () => {
    const trimmedTerm = newBlockedTerm.trim();
    if (trimmedTerm && !blockedTerms.includes(trimmedTerm)) {
      setBlockedTerms(prevTerms => [...prevTerms, trimmedTerm]);
      setNewBlockedTerm(""); // Réinitialiser le champ
    }
  };

  const handleRemoveBlockedTerm = (term: string) => {
    setBlockedTerms(prevTerms => prevTerms.filter(t => t !== term));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddBlockedTerm();
    }
  };

  // Fonctions pour gérer les termes bloqués pour les élèves
  const handleAddBlockedTermStudent = () => {
    const trimmedTerm = newBlockedTermStudent.trim();
    if (trimmedTerm && !blockedTermsStudent.includes(trimmedTerm)) {
      setBlockedTermsStudent(prevTerms => [...prevTerms, trimmedTerm]);
      setNewBlockedTermStudent(""); // Réinitialiser le champ
    }
  };

  const handleRemoveBlockedTermStudent = (term: string) => {
    setBlockedTermsStudent(prevTerms => prevTerms.filter(t => t !== term));
  };

  const handleKeyPressStudent = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddBlockedTermStudent();
    }
  };

  const handleOpenRuleDialog = (rule?: SupervisionRule) => {
    if (rule) {
      setEditingRule(rule);
      setRuleFormData({
        name: rule.name,
        description: rule.description,
        enabled: rule.enabled,
        parameters: rule.parameters || {}
      });
    } else {
      setEditingRule(null);
      setRuleFormData({
        name: "",
        description: "",
        enabled: true,
        parameters: {}
      });
    }
    setNewRuleComment("");
    setRuleDialogOpen(true);
  };

  const handleCloseRuleDialog = () => {
    setRuleDialogOpen(false);
  };

  const handleOpenHistoryDialog = () => {
    setHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setHistoryDialogOpen(false);
  };

  const handleRuleFormChange = (field: string, value: any) => {
    setRuleFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveRule = () => {
    const now = new Date().toISOString();
    const user = "Utilisateur Actuel"; // Dans une vraie application, récupérer de l'authentification

    if (editingRule) {
      // Édition d'une règle existante
      const updatedRule: SupervisionRule = {
        ...editingRule,
        name: ruleFormData.name,
        description: ruleFormData.description,
        enabled: ruleFormData.enabled,
        parameters: ruleFormData.parameters,
        lastModified: now,
        lastModifiedBy: user,
        lastModificationComment: newRuleComment
      };

      setRules(prev =>
        prev.map(rule => rule.id === editingRule.id ? updatedRule : rule)
      );

      // Ajouter à l'historique
      AIAssistantHistoryService.addEntry({
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleString(),
        user,
        section: "Réglementation de l'Assistant IA",
        action: "modify",
        comment: `Modification de la règle "${updatedRule.name}": ${newRuleComment}`
      });

    } else {
      // Ajout d'une nouvelle règle
      const newRule: SupervisionRule = {
        id: `custom-${Date.now()}`,
        name: ruleFormData.name,
        description: ruleFormData.description,
        enabled: ruleFormData.enabled,
        parameters: ruleFormData.parameters,
        isSystemRule: false,
        lastModified: now,
        lastModifiedBy: user,
        lastModificationComment: newRuleComment
      };

      setRules(prev => [...prev, newRule]);

      // Ajouter à l'historique
      AIAssistantHistoryService.addEntry({
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleString(),
        user,
        section: "Réglementation de l'Assistant IA",
        action: "add",
        comment: `Ajout de la règle "${newRule.name}": ${newRuleComment}`
      });
    }

    setRuleDialogOpen(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    const ruleToDelete = rules.find(r => r.id === ruleId);

    if (ruleToDelete) {
      // Add to history service
      AIAssistantHistoryService.addEntry({
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleString(),
        user: "Utilisateur Actuel",
        section: "Réglementation de l'Assistant IA",
        action: "delete",
        comment: `Suppression de la règle "${ruleToDelete.name}"`
      });

      // Remove the rule
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add entry to history service
      AIAssistantHistoryService.addEntry({
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleString(),
        user: "Utilisateur Actuel",
        section: "Réglementation de l'Assistant IA",
        action: "modify",
        comment: "Mise à jour des paramètres de l'assistant IA"
      });

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres de filtrage:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateKnowledgeBase = async () => {
    setUpdatingKnowledgeBase(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add entry to history service
      AIAssistantHistoryService.addEntry({
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleString(),
        user: "Utilisateur Actuel",
        section: "Base de connaissances",
        action: "modify",
        comment: "Mise à jour de la base de connaissances de l'IA"
      });

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la base de connaissances:", error);
    } finally {
      setUpdatingKnowledgeBase(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    setBlockedTerms(["gros mot", "insulte", "violence", "inapproprié"]);

    // Reset rules - Réglementation de l'Assistant IA
    setRules([
      // Règles système
      {
          id: "rule-1",
          name: "Vérification de la complexité",
          description: "Analyse le niveau de difficulté des réponses pour s'assurer qu'il correspond au niveau scolaire",
          enabled: true,
          isSystemRule: true
      },
      {
          id: "rule-2",
          name: "Détection des réponses directes",
          description: "Empêche l'IA de donner des réponses directes aux exercices",
          enabled: true,
          isSystemRule: true
      },
      {
          id: "rule-3",
          name: "Contrôle du niveau de langue",
          description: "Vérifie que le vocabulaire utilisé est adapté au niveau des élèves",
          enabled: true,
          isSystemRule: true
      },
      {
          id: "rule-4",
          name: "Limitation des réponses",
          description: "Limite la longueur des réponses à 500 caractères maximum",
          enabled: true,
          isSystemRule: true
      },
      // Règle personnalisée par défaut
      {
        id: "custom-1",
        name: "Vocabulaire simplifié",
        description: "Adapte le niveau de langage pour les élèves de primaire",
        enabled: true,
        isSystemRule: false,
        parameters: {
          complexityLevel: 2
        },
        lastModified: new Date().toISOString(),
        lastModifiedBy: "Système",
        lastModificationComment: "Réinitialisation aux valeurs par défaut"
      }
    ]);

    // Add reset entry to history service
    AIAssistantHistoryService.addEntry({
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: "Utilisateur Actuel",
      section: "Réglementation de l'Assistant IA",
      action: "modify",
      comment: "Réinitialisation aux valeurs par défaut"
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 5 }}>
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Les paramètres de supervision et filtrage ont été enregistrés avec succès dans la base de connaissances IA.
        </Alert>
      )}

      <Typography variant="body1" paragraph>
        Configurez les règles et paramètres de supervision pour protéger les élèves du primaire lors de leurs interactions avec l&apos;assistant IA.
      </Typography>

      <Grid container spacing={3}>
        {/* Section 1: Règles de supervision unifiées */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Réglementation de l&apos;Assistant IA
              </Typography>
              <Box>
                <Button
                  startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                  onClick={() => handleOpenRuleDialog()}
                  variant="contained"
                  size="small"
                >
                  Ajouter une règle
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Typography variant="body2" paragraph>
              Ensemble des règles que l&apos;administrateur peut activer pour contrôler les réponses des assistants IA qui aident les élèves de primaire.
            </Typography>

            <List>
              {/* Règle 1: Vérification de la complexité */}
              <ListItem
                key="rule-1"
                secondaryAction={
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={rules.find(r => r.id === "rule-1")?.enabled || false}
                          onChange={() => handleRuleToggle("rule-1")}
                        />
                      }
                      label=""
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenRuleDialog(rules.find(r => r.id === "rule-1"))}
                      color="primary"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule("rule-1")}
                      color="error"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Box>
                }
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      Vérification de la complexité
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div">
                      Analyse le niveau de difficulté des réponses pour s&apos;assurer qu&apos;il correspond au niveau scolaire
                    </Typography>
                  }
                />
              </ListItem>

              {/* Règle 2: Détection des réponses directes */}
              <ListItem
                key="rule-2"
                secondaryAction={
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={rules.find(r => r.id === "rule-2")?.enabled || false}
                          onChange={() => handleRuleToggle("rule-2")}
                        />
                      }
                      label=""
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenRuleDialog(rules.find(r => r.id === "rule-2"))}
                      color="primary"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule("rule-2")}
                      color="error"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Box>
                }
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      Détection des réponses directes
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div">
                      Empêche l&apos;IA de donner des réponses directes aux exercices
                    </Typography>
                  }
                />
              </ListItem>

              {/* Règle 3: Contrôle du niveau de langue */}
              <ListItem
                key="rule-3"
                secondaryAction={
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={rules.find(r => r.id === "rule-3")?.enabled || false}
                          onChange={() => handleRuleToggle("rule-3")}
                        />
                      }
                      label=""
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenRuleDialog(rules.find(r => r.id === "rule-3"))}
                      color="primary"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule("rule-3")}
                      color="error"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Box>
                }
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      Contrôle du niveau de langue
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div">
                      Vérifie que le vocabulaire utilisé est adapté au niveau des élèves
                    </Typography>
                  }
                />
              </ListItem>

              {/* Règle 4: Limitation des réponses */}
              <ListItem
                key="rule-4"
                secondaryAction={
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={rules.find(r => r.id === "rule-4")?.enabled || false}
                          onChange={() => handleRuleToggle("rule-4")}
                        />
                      }
                      label=""
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenRuleDialog(rules.find(r => r.id === "rule-4"))}
                      color="primary"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule("rule-4")}
                      color="error"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Box>
                }
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      Limitation des réponses
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" component="div">
                      Limite la longueur des réponses à 500 caractères maximum
                    </Typography>
                  }
                />
              </ListItem>

              {/* Règles personnalisées */}
              {rules.filter(rule => !["rule-1", "rule-2", "rule-3", "rule-4"].includes(rule.id)).map((rule) => (
                <ListItem
                  key={rule.id}
                  secondaryAction={
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={rule.enabled}
                            onChange={() => handleRuleToggle(rule.id)}
                          />
                        }
                        label=""
                      />
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenRuleDialog(rule)}
                        color="primary"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteRule(rule.id)}
                        color="error"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="div">
                        {rule.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="div">
                          {rule.description}
                        </Typography>
                        {rule.lastModified && (
                          <Typography variant="caption" color="text.secondary" component="div">
                            Dernière modification: {formatDate(rule.lastModified)} par {rule.lastModifiedBy || "Inconnu"}
                            {rule.lastModificationComment && ` - "${rule.lastModificationComment}"`}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Section 2: Termes bloqués pour l'assistant */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Termes Spécifiques à Bloquer (Assistant)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={newBlockedTerm}
                  onChange={(e) => setNewBlockedTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ajouter un terme à bloquer"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={handleAddBlockedTerm}
                          disabled={!newBlockedTerm.trim()}
                        >
                          <FontAwesomeIcon icon={faPlusCircle} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Termes bloqués:
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {blockedTerms.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    onDelete={() => handleRemoveBlockedTerm(term)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Section 2: Termes bloqués pour les élèves */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Termes Spécifiques à Bloquer (Élève)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={newBlockedTermStudent}
                  onChange={(e) => setNewBlockedTermStudent(e.target.value)}
                  onKeyPress={handleKeyPressStudent}
                  placeholder="Ajouter un terme à bloquer pour les élèves"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={handleAddBlockedTermStudent}
                          disabled={!newBlockedTermStudent.trim()}
                        >
                          <FontAwesomeIcon icon={faPlusCircle} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Termes bloqués:
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {blockedTermsStudent.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    onDelete={() => handleRemoveBlockedTermStudent(term)}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Boutons d'action */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={saving || updatingKnowledgeBase}
            >
              Réinitialiser par défaut
            </Button>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateKnowledgeBase}
                disabled={saving || updatingKnowledgeBase}
                startIcon={updatingKnowledgeBase ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faSync} />}
                sx={{ mr: 2 }}
              >
                {updatingKnowledgeBase ? "Mise à jour..." : "Mise à jour de la base de connaissances de l'IA"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving || updatingKnowledgeBase}
                startIcon={saving ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faSave} />}
              >
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Historique des modifications */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Historique des modifications
              </Typography>
              <Button
                startIcon={<FontAwesomeIcon icon={faHistory} />}
                onClick={handleOpenHistoryDialog}
                variant="outlined"
                size="small"
              >
                Voir tout l&apos;historique
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {filteredHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Aucune modification n&apos;a été enregistrée.
              </Typography>
            ) : (
              <List>
                {filteredHistory.slice(0, 5).map((entry) => (
                  <ListItem key={entry.id}>
                    <ListItemText
                      primary={`${entry.section} - ${entry.action}`}
                      secondary={`${entry.date} - ${entry.user}: ${entry.comment}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for viewing modification history */}
      <Dialog
        open={historyDialogOpen}
        onClose={handleCloseHistoryDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Historique des modifications
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Commentaire</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>{entry.section}</TableCell>
                      <TableCell>
                        {entry.action === 'add' && 'Ajout'}
                        {entry.action === 'modify' && 'Modification'}
                        {entry.action === 'delete' && 'Suppression'}
                      </TableCell>
                      <TableCell>{entry.comment}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                Lignes par page:
              </Typography>
              <Select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                size="small"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {filteredHistory.length > 0 ?
                  `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredHistory.length)} sur ${filteredHistory.length}` :
                  "0-0 sur 0"}
              </Typography>
              <IconButton
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </IconButton>
              <IconButton
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(filteredHistory.length / rowsPerPage) - 1}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </IconButton>
            </Box>
          </Box>

          {/* Filtres de dates déplacés en bas */}
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Date de début"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(0); // Réinitialiser la page lors du filtrage
                }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Date de fin"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(0); // Réinitialiser la page lors du filtrage
                }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setPage(0);
                }}
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding/editing a rule */}
      <Dialog
        open={ruleDialogOpen}
        onClose={handleCloseRuleDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRule ? "Modifier la règle" : "Ajouter une nouvelle règle"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Nom de la règle"
                fullWidth
                required
                value={ruleFormData.name}
                onChange={(e) => handleRuleFormChange("name", e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={ruleFormData.description}
                onChange={(e) => handleRuleFormChange("description", e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={ruleFormData.enabled}
                    onChange={(e) => handleRuleFormChange("enabled", e.target.checked)}
                  />
                }
                label="Règle active"
              />
            </Grid>
            {/* Commentaire de modification */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Commentaire de modification"
                fullWidth
                multiline
                rows={2}
                value={newRuleComment}
                onChange={(e) => setNewRuleComment(e.target.value)}
                helperText="Ajoutez un commentaire pour expliquer cette modification (visible dans l'historique)"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRuleDialog} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleSaveRule}
            color="primary"
            variant="contained"
            disabled={!ruleFormData.name.trim()}
          >
            {editingRule ? "Enregistrer les modifications" : "Ajouter la règle"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}