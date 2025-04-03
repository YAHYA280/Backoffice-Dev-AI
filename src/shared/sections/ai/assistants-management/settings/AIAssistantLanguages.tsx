"use client";

import type {
  LanguageOption,
  CommunicationStyle,
  AIAssistantLanguagesProps
} from "src/types/ai-assistant";

import { useMemo ,useState, useEffect } from "react";

import { 
  Box,
  Card,
  Grid,
  Alert,
  Paper,
  Select,
  Button,
  Switch,
  Divider,
  MenuItem,
  FormGroup,
  InputLabel,
  Typography,
  CardContent,
  FormControl,
  CircularProgress,
  FormControlLabel,
  type SelectChangeEvent,
} from "@mui/material";

import { AIAssistantHistoryService } from "../AIAssistantHistoryService";

export default function AIAssistantLanguages({ assistantId }: AIAssistantLanguagesProps) {
  // États
  const [mainLanguage, setMainLanguage] = useState<string>("fr");
  const [secondaryLanguage, setSecondaryLanguage] = useState<string>("");
  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);
  const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle>("neutre");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Liste des langues disponibles dans le système
  const languagesList = useMemo<LanguageOption[]>(() => [
    { code: "fr", name: "Français", enabled: true },
    { code: "en", name: "Anglais", enabled: true },
    { code: "es", name: "Espagnol", enabled: false },
    { code: "de", name: "Allemand", enabled: false },
    { code: "ar", name: "Arabe", enabled: false },
  ], []);

  // Chargement initial des données
  useEffect(() => {
    const fetchLanguageSettings = async () => {
      try {
        // Simulation d'un appel API
        // Remplacer par un vrai appel API dans un environnement de production
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Pour la démo, nous utilisons les données codées en dur
        setAvailableLanguages(languagesList);
        setMainLanguage("fr");
        setSecondaryLanguage("en");
        setCommunicationStyle("amical");
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres de langue:", error);
        setLoading(false);
      }
    };

    fetchLanguageSettings();
  }, [assistantId, languagesList]);


  // Gestionnaires d'événements
  const handleMainLanguageChange = (event: SelectChangeEvent<string>) => {
    setMainLanguage(event.target.value);
  };

  const handleSecondaryLanguageChange = (event: SelectChangeEvent<string>) => {
    setSecondaryLanguage(event.target.value);
  };

  const handleCommunicationStyleChange = (event: SelectChangeEvent<string>) => {
    setCommunicationStyle(event.target.value as CommunicationStyle);
  };

  const handleLanguageToggle = (languageCode: string) => {
    setAvailableLanguages(prevLanguages => 
      prevLanguages.map(lang => 
        lang.code === languageCode ? { ...lang, enabled: !lang.enabled } : lang
      )
    );
  };

  const handleSaveCustomization = () => {
    AIAssistantHistoryService.addEntry({
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: "Admin", // Modifier si nécessaire
      section: "Gestion des Réponses IA",
      action: "modify",
      comment: "Mise à jour des réponses autorisées et des phrases de motivation",
    });
    
    // Enregistrer les paramètres
    // AIAssistantCustomizationService.saveCustomizationSettings(settings);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulation d'un appel API pour sauvegarder les paramètres
      // Remplacer par un vrai appel API dans un environnement de production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ajouter l'entrée d'historique
      handleSaveCustomization();
      
      // Afficher le message de succès
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres de langue:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Réinitialiser aux valeurs par défaut
    setMainLanguage("fr");
    setSecondaryLanguage("en");
    setCommunicationStyle("neutre");
    setAvailableLanguages(languagesList.map(lang => ({
      ...lang,
      enabled: ["fr", "en"].includes(lang.code)
    })));
  };

  // Exemples de réponses selon le style de communication
  const getResponseExample = () => {
    const examples = {
      amical: "Salut ! Super travail sur ton exercice de mathématiques ! 🌟 Tu as bien compris comment additionner les fractions. Continue comme ça, tu es sur la bonne voie !",
      neutre: "Bonjour, ton travail sur l'exercice de mathématiques est correct. Tu as correctement effectué l'addition des fractions en trouvant le dénominateur commun.",
      académique: "Votre résolution de l'exercice d'addition de fractions est précise. Vous avez correctement appliqué la méthode de recherche du plus petit dénominateur commun, ce qui témoigne d'une bonne maîtrise des concepts mathématiques fondamentaux."
    };
    
    return examples[communicationStyle];
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Les paramètres de langue ont été enregistrés avec succès.
        </Alert>
      )}

      <Typography variant="body1" paragraph>
        Configurez les langues dans lesquelles votre assistant IA communiquera avec les élèves .
      </Typography>

      <Grid container spacing={3}>
        {/* Section 1: Configuration des langues */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configuration des Langues
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="main-language-label">Langue Principale</InputLabel>
                  <Select
                    labelId="main-language-label"
                    id="main-language"
                    value={mainLanguage}
                    label="Langue Principale"
                    onChange={handleMainLanguageChange}
                  >
                    {availableLanguages
                      .filter(lang => lang.enabled)
                      .map(lang => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="secondary-language-label">Langue Secondaire</InputLabel>
                  <Select
                    labelId="secondary-language-label"
                    id="secondary-language"
                    value={secondaryLanguage}
                    label="Langue Secondaire"
                    onChange={handleSecondaryLanguageChange}
                  >
                    <MenuItem value="">
                      <em>Aucune</em>
                    </MenuItem>
                    {availableLanguages
                      .filter(lang => lang.enabled && lang.code !== mainLanguage)
                      .map(lang => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Langues Disponibles
            </Typography>
            
            <FormGroup>
              <Grid container spacing={2}>
                {availableLanguages.map(lang => (
                  <Grid item xs={12} sm={6} md={4} key={lang.code}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={lang.enabled}
                          onChange={() => handleLanguageToggle(lang.code)}
                          disabled={lang.code === mainLanguage || lang.code === secondaryLanguage}
                        />
                      }
                      label={lang.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </Paper>
        </Grid>

        {/* Section 2: Personnalisation du ton */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personnalisation du Ton
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="communication-style-label">Style de Communication</InputLabel>
              <Select
                labelId="communication-style-label"
                id="communication-style"
                value={communicationStyle}
                label="Style de Communication"
                onChange={handleCommunicationStyleChange}
              >
                <MenuItem value="amical">Amical</MenuItem>
                <MenuItem value="neutre">Neutre</MenuItem>
                <MenuItem value="académique">Académique</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" gutterBottom>
              Exemple de Réponse:
            </Typography>
            <Card variant="outlined" sx={{ mb: 3, bgcolor: "#f9f9f9" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {getResponseExample()}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Boutons d'action */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={saving}
            >
              Réinitialiser par défaut
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}