"use client";

import { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMeh,
  faSave,
  faUndo,
  faBook,
  faRedo,
  faGlobe,
  faCheck,
  faSmile,
  faBrain,
  faSpinner,
  faLanguage,
  faComments,
  faThumbsUp,
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

import { GlobalStyles } from '@mui/material';
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

// Types
type LanguageOption = {
  code: string;
  name: string;
  enabled: boolean;
  flag?: string; // Emoji du drapeau pour visualisation
};

type CommunicationStyle = "amical" | "neutre" | "académique";

type AIAssistantLanguagesProps = {
  assistantId: string;
};

export default function AIAssistantLanguages({ assistantId }: AIAssistantLanguagesProps) {
  // États avec des valeurs par défaut
  const [mainLanguage, setMainLanguage] = useState<string>("fr");
  const [secondaryLanguage, setSecondaryLanguage] = useState<string>("");
  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);
  const [communicationStyle, setCommunicationStyle] = useState<CommunicationStyle>("neutre");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Liste enrichie des langues disponibles avec drapeaux
  const languagesList = useMemo<LanguageOption[]>(() => [
    { code: "fr", name: "Français", enabled: true, flag: "🇫🇷" },
    { code: "en", name: "Anglais", enabled: true, flag: "🇬🇧" },
    { code: "es", name: "Espagnol", enabled: false, flag: "🇪🇸" },
    { code: "de", name: "Allemand", enabled: false, flag: "🇩🇪" },
    { code: "ar", name: "Arabe", enabled: false, flag: "🇸🇦" },
    { code: "it", name: "Italien", enabled: false, flag: "🇮🇹" },
    { code: "pt", name: "Portugais", enabled: false, flag: "🇵🇹" },
    { code: "ru", name: "Russe", enabled: false, flag: "🇷🇺" },
    { code: "zh", name: "Chinois", enabled: false, flag: "🇨🇳" },
    { code: "ja", name: "Japonais", enabled: false, flag: "🇯🇵" },
  ], []);

  // Observer les changements pour activer le bouton de sauvegarde
  useEffect(() => {
    if (!loading) setHasChanges(true);
  }, [mainLanguage, secondaryLanguage, communicationStyle, availableLanguages , loading]);

  // Chargement initial des données avec effet de transition élégant
  useEffect(() => {
    const fetchLanguageSettings = async () => {
      try {
        // Simulation d'un appel API avec délai naturel
        await new Promise(resolve => setTimeout(resolve, 800));

        // Données fictives pour la démo
        setAvailableLanguages(languagesList);
        setMainLanguage("fr");
        setSecondaryLanguage("en");
        setCommunicationStyle("amical");


        setLoading(false);
        setHasChanges(false);
      } catch (error) {
        console.error("🔴 Erreur lors du chargement des paramètres linguistiques:", error);
        setLoading(false);
      }
    };

    fetchLanguageSettings();
  }, [assistantId, languagesList]);

  // Gestionnaires d'événements optimisés
  const handleMainLanguageChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;

    // Si la nouvelle langue principale est la même que la secondaire, échanger
    if (newValue === secondaryLanguage) {
      setSecondaryLanguage(mainLanguage);
    }

    setMainLanguage(newValue);
  };

  const handleSecondaryLanguageChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setSecondaryLanguage(newValue);
  };

  const handleCommunicationStyleChange = (event: SelectChangeEvent<string>) => {
    setCommunicationStyle(event.target.value as CommunicationStyle);
  };

  const handleLanguageToggle = (languageCode: string) => {
    setAvailableLanguages(prevLanguages =>
      prevLanguages.map(lang => {
        if (lang.code === languageCode) {
          // Vérifier si on essaie de désactiver une langue utilisée
          if (lang.enabled && (lang.code === mainLanguage || lang.code === secondaryLanguage)) {
            return lang; // Ne pas changer l'état
          }
          return { ...lang, enabled: !lang.enabled };
        }
        return lang;
      })
    );
  };

  const handleSaveCustomization = () => {
    AIAssistantHistoryService.addEntry({
      id: `lang-config-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: "Admin",
      section: "Configuration Linguistique",
      action: "modify",
      comment: `Mise à jour: Langue principale (${mainLanguage}), secondaire (${secondaryLanguage}), style (${communicationStyle})`,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulation API avec progress bar naturelle
      await new Promise(resolve => setTimeout(resolve, 1500));

      handleSaveCustomization();

      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("🔴 Erreur lors de la sauvegarde:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Animation subtile avant réinitialisation
    setSaving(true);
    setTimeout(() => {
      setMainLanguage("fr");
      setSecondaryLanguage("en");
      setCommunicationStyle("neutre");
      setAvailableLanguages(languagesList.map(lang => ({
        ...lang,
        enabled: ["fr", "en"].includes(lang.code)
      })));
      setSaving(false);
      setHasChanges(false);
    }, 300);
  };

  // Exemples de réponses selon le style avec variations créatives
  const getResponseExample = () => {
    const examples = {
      amical: {
        text: "Salut ! Super travail sur ton exercice de mathématiques ! 🌟 Tu as bien compris comment additionner les fractions. Continue comme ça, tu es sur la bonne voie ! 💪",
        color: "#4caf50",
        bg: "#e8f5e9",
        icon: <FontAwesomeIcon icon={faThumbsUp} />
      },
      neutre: {
        text: "Bonjour, ton travail sur l'exercice de mathématiques est correct. Tu as correctement effectué l'addition des fractions en trouvant le dénominateur commun.",
        color: "#1976d2",
        bg: "#e3f2fd",
        icon: <FontAwesomeIcon icon={faCheckCircle} />
      },
      académique: {
        text: "Votre résolution de l'exercice d'addition de fractions est précise. Vous avez correctement appliqué la méthode de recherche du plus petit dénominateur commun, ce qui témoigne d'une bonne maîtrise des concepts mathématiques fondamentaux.",
        color: "#5d4037",
        bg: "#efebe9",
        icon: <FontAwesomeIcon icon={faBook} />
      }
    };


    return examples[communicationStyle];
  };

  // Interface de chargement animée
  if (loading) {
    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh"
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
          Chargement des paramètres linguistiques...
        </Typography>
      </Box>
    );
  }

  const responseExample = getResponseExample();

  return (
    <Box sx={{ animation: "fadeIn 0.5s ease-in-out" }}>
      {saveSuccess && (
        <Alert
          icon={<FontAwesomeIcon icon={faCheck} />}
          severity="success"
          sx={{
            mb: 3,
            animation: "slideDown 0.3s ease-in-out",
            display: "flex",
            alignItems: "center"
          }}
        >
          <Typography variant="body1">
            Les paramètres linguistiques ont été enregistrés avec succès !
          </Typography>
        </Alert>
      )}

      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <FontAwesomeIcon
          icon={faLanguage}
          style={{ fontSize: "2rem", marginRight: "12px", color: "#1976d2" }}
        />
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Configuration Linguistique de l&apos;Assistant IA
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Personnalisez les langues et le style de communication de votre assistant IA pour une expérience d&apos;apprentissage optimale.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Section 1: Configuration des langues avec design amélioré */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 6 }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FontAwesomeIcon
                icon={faGlobe}
                style={{ fontSize: "1.5rem", marginRight: "10px", color: "#1976d2" }}
              />
              <Typography variant="h6" fontWeight={500}>
                Configuration des Langues
              </Typography>
            </Box>
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
                    startAdornment={
                      <Box sx={{ mr: 1, ml: -0.5 }}>
                        {availableLanguages.find(lang => lang.code === mainLanguage)?.flag}
                      </Box>
                    }
                  >
                    {availableLanguages
                      .filter(lang => lang.enabled)
                      .map(lang => (
                        <MenuItem key={lang.code} value={lang.code}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ mr: 1 }}>{lang.flag}</Box>
                            {lang.name}
                          </Box>
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
                    startAdornment={
                      secondaryLanguage ? (
                        <Box sx={{ mr: 1, ml: -0.5 }}>
                          {availableLanguages.find(lang => lang.code === secondaryLanguage)?.flag}
                        </Box>
                      ) : null
                    }
                  >
                    <MenuItem value="">
                      <em>Aucune</em>
                    </MenuItem>
                    {availableLanguages
                      .filter(lang => lang.enabled && lang.code !== mainLanguage)
                      .map(lang => (
                        <MenuItem key={lang.code} value={lang.code}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ mr: 1 }}>{lang.flag}</Box>
                            {lang.name}
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
              <FontAwesomeIcon
                icon={faLanguage}
                style={{ fontSize: "1.2rem", marginRight: "8px", color: "#555" }}
              />
              <Typography variant="subtitle1" fontWeight={500}>
                Langues Disponibles
              </Typography>
            </Box>

            <FormGroup>
              <Grid container spacing={2}>
                {availableLanguages.map(lang => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={lang.code}>
                    <Paper
                      sx={{
                        p: 1,
                        border: lang.enabled ? `1px solid #bbdefb` : `1px solid #e0e0e0`,
                        borderRadius: 1,
                        bgcolor: lang.enabled ? 'rgba(33, 150, 243, 0.04)' : 'inherit',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={lang.enabled}
                            onChange={() => handleLanguageToggle(lang.code)}
                            disabled={lang.code === mainLanguage || lang.code === secondaryLanguage}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ mr: 1, fontSize: "1.2rem" }}>{lang.flag}</Box>
                            {lang.name}
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </Paper>
        </Grid>

        {/* Section 2: Personnalisation du ton avec design enrichi */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: 6 }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FontAwesomeIcon
                icon={faComments}
                style={{ fontSize: "1.5rem", marginRight: "10px", color: "#1976d2" }}
              />
              <Typography variant="h6" fontWeight={500}>
                Personnalisation du Ton
              </Typography>
            </Box>
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
                <MenuItem value="amical">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faSmile} style={{ marginRight: "8px", fontSize: "1.2rem" }} />
                    Amical
                  </Box>
                </MenuItem>
                <MenuItem value="neutre">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faMeh} style={{ marginRight: "8px", fontSize: "1.2rem" }} />
                    Neutre
                  </Box>
                </MenuItem>
                <MenuItem value="académique">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faBrain} style={{ marginRight: "8px", fontSize: "1.2rem" }} />
                    Académique
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Aperçu du Style de Réponse:
            </Typography>

            <Card
              variant="outlined"
              sx={{
                mb: 3,
                bgcolor: responseExample.bg,
                borderColor: responseExample.color,
                borderRadius: 2,
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      mr: 2,
                      fontSize: "2rem",
                      display: "flex",
                      alignItems: "flex-start"
                    }}
                  >
                    {responseExample.icon}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: responseExample.color,
                      fontWeight: communicationStyle === "amical" ? 400 : communicationStyle === "académique" ? 500 : 400,
                      fontStyle: communicationStyle === "académique" ? "normal" : "inherit"
                    }}
                  >
                    {responseExample.text}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Boutons d'action avec design amélioré */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              pb: 2
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={saving || !hasChanges}
              startIcon={<FontAwesomeIcon icon={faUndo} />}
              sx={{
                borderRadius: 2,
                px: 3,
                transition: "all 0.2s ease",
                opacity: !hasChanges ? 0.7 : 1
              }}
            >
              Réinitialiser
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              startIcon={saving ?
                <FontAwesomeIcon icon={faSpinner} spin /> :
                <FontAwesomeIcon icon={faSave} />
              }
              sx={{
                borderRadius: 2,
                px: 3,
                boxShadow: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)"
                },
                opacity: !hasChanges ? 0.7 : 1
              }}
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              startIcon={<FontAwesomeIcon icon={faRedo} />}
              disabled={saving}
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
              }}
            >
              Réinitialiser par défaut
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* CSS Global pour les animations */}
      <GlobalStyles styles={`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`} />
    </Box>
  );
}

