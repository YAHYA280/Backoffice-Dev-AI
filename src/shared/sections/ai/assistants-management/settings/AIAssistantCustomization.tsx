import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState, useEffect, useReducer, useCallback } from "react";
import { m, motion, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import {
  faRedo,
  faUndo,
  faSave,
  faFont,
  faTrash,
  faImage,
  faHistory,
  faPlusCircle,
  faMicrophone
} from "@fortawesome/free-solid-svg-icons";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { AIAssistantHistoryService } from "../AIAssistantHistoryService";
import { AIAssistantCustomizationService } from "./AIAssistantCustomizationService";

// Define types for better readability and type safety
export type ResponseType = "text" | "audio" | "image";
export type InputType = "text" | "audio" | "image";
export type AudioFormat = "mp3" | "wav" | "aac";
export type ImageFormat = "jpg" | "png" | "svg" | "pdf";
export type DeletionType = "motivation" | "aide";

export interface DeletionHistoryItem {
  phrase: string;
  date: string;
  type: DeletionType;
}

export interface IAIAssistantCustomizationSettings {
  responseType: ResponseType[];
  inputType: InputType;
  welcomeMessage: string;
  motivationalPhrases: string[];
  helpPhrases: string[];
  audioFormat: AudioFormat[]; // Ici on utilise un array d'AudioFormat
  voiceTranscription: boolean;
  imageSupport: boolean;
  imageFormat: ImageFormat[];
  deletionHistory: DeletionHistoryItem[];
}

// Define action types for reducer
type ActionType =
  | { type: 'SET_FIELD', field: keyof IAIAssistantCustomizationSettings, value: any }
  | { type: 'TOGGLE_RESPONSE_TYPE', responseType: ResponseType }
  | { type: 'TOGGLE_IMAGE_FORMAT', format: ImageFormat }
  | { type: 'TOGGLE_AUDIO_FORMAT', format: AudioFormat }
  | { type: 'ADD_PHRASE', phrase: string }
  | { type: 'DELETE_PHRASE', index: number }
  | { type: 'RESTORE_PHRASE', index: number }
  | { type: 'DELETE_HISTORY_ITEM', index: number }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'RESET_SETTINGS' };

// Reducer function for state management
const settingsReducer = (state: IAIAssistantCustomizationSettings, action: ActionType): IAIAssistantCustomizationSettings => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'TOGGLE_RESPONSE_TYPE': {
      const currentTypes = [...state.responseType];
      const typeIndex = currentTypes.indexOf(action.responseType);

      if (typeIndex >= 0) {
        currentTypes.splice(typeIndex, 1);
      } else {
        currentTypes.push(action.responseType);
      }

      return { ...state, responseType: currentTypes };
    }

    case 'TOGGLE_IMAGE_FORMAT': {
      const currentFormats = [...state.imageFormat];
      const formatIndex = currentFormats.indexOf(action.format);

      if (formatIndex >= 0) {
        currentFormats.splice(formatIndex, 1);
      } else {
        currentFormats.push(action.format);
      }

      return { ...state, imageFormat: currentFormats };
    }
    
    case 'TOGGLE_AUDIO_FORMAT': {
      const currentFormats = [...state.audioFormat];
      const formatIndex = currentFormats.indexOf(action.format);
    
      if (formatIndex >= 0) {
        currentFormats.splice(formatIndex, 1);
      } else {
        currentFormats.push(action.format);
      }
    
      return { ...state, audioFormat: currentFormats };
    }
    
    case 'ADD_PHRASE':
      return {
        ...state,
        motivationalPhrases: [...state.motivationalPhrases, action.phrase.trim()]
      };

    case 'DELETE_PHRASE': {
      const phraseToDelete = state.motivationalPhrases[action.index];
      const newDeletionHistoryItem = {
        phrase: phraseToDelete,
        date: new Date().toLocaleString(),
        type: "motivation" as DeletionType
      };

      return {
        ...state,
        motivationalPhrases: state.motivationalPhrases.filter((_, i) => i !== action.index),
        deletionHistory: [...state.deletionHistory, newDeletionHistoryItem]
      };
    }

    case 'RESTORE_PHRASE': {
      const itemToRestore = state.deletionHistory[action.index];

      if (itemToRestore.type === "motivation") {
        return {
          ...state,
          motivationalPhrases: [...state.motivationalPhrases, itemToRestore.phrase],
          deletionHistory: state.deletionHistory.filter((_, i) => i !== action.index)
        };
      }
      return state;
    }

    case 'DELETE_HISTORY_ITEM':
      return {
        ...state,
        deletionHistory: state.deletionHistory.filter((_, i) => i !== action.index)
      };

    case 'CLEAR_HISTORY':
      return {
        ...state,
        deletionHistory: []
      };

    case 'RESET_SETTINGS':
      return {
        responseType: ["text"],
        inputType: "text",
        welcomeMessage: "Bonjour ! Comment puis-je vous aider ?",
        motivationalPhrases: ["Excellent travail !", "Continue comme ça !", "Tu progresses bien !"],
        helpPhrases: ["Je vais t'expliquer la règle...", "Voici comment conjuguer ce verbe..."],
        audioFormat: ["mp3"], // Modifié pour être un array
        voiceTranscription: false,
        imageSupport: false,
        imageFormat: [],
        deletionHistory: [],
      };

    default:
      return state;
  }
};

// Custom hook for animation control
const useAnimationControl = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]); // Added 'delay' as a dependency
  
  return isVisible;
};

// Custom hook for form validation
const useFormValidation = (settings: IAIAssistantCustomizationSettings) => 
  useMemo(() => {
    const errors: Record<string, string> = {};

    if (!settings.welcomeMessage.trim()) {
      errors.welcomeMessage = "Le message d'accueil est requis";
    }

    if (settings.responseType.length === 0) {
      errors.responseType = "Au moins un type de réponse doit être sélectionné";
    }

    if (settings.imageSupport && settings.imageFormat.length === 0) {
      errors.imageFormat = "Sélectionnez au moins un format d'image";
    }
    
    if (settings.audioFormat.length === 0) {
      errors.audioFormat = "Sélectionnez au moins un format audio";
    }

    return {
      hasErrors: Object.keys(errors).length > 0,
      errors
    };
  }, [settings]);

export default function AIAssistantCustomization() {
  // Use reducer for complex state management
  const [settings, dispatch] = useReducer<React.Reducer<IAIAssistantCustomizationSettings, ActionType>>(
    settingsReducer,
    AIAssistantCustomizationService.getCustomizationSettings() as IAIAssistantCustomizationSettings
  );
  const [newPhrase, setNewPhrase] = useState("");
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [saveMessageSeverity, setSaveMessageSeverity] = useState<"success" | "error">("success");
  const [saveMessageText, setSaveMessageText] = useState("");

  // Animation controls
  const headerAnimationVisible = useAnimationControl(100);
  const formAnimationVisible = useAnimationControl(300);
  const buttonAnimationVisible = useAnimationControl(500);

  // Form validation
  const { hasErrors, errors } = useFormValidation(settings);

  const theme = useTheme();

  // Handle form field changes
  const handleChange = useCallback((field: keyof IAIAssistantCustomizationSettings, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const handleToggleResponseType = useCallback((type: ResponseType) => {
    dispatch({ type: 'TOGGLE_RESPONSE_TYPE', responseType: type });
  }, []);

  const handleToggleImageFormat = useCallback((format: ImageFormat) => {
    dispatch({ type: 'TOGGLE_IMAGE_FORMAT', format });
  }, []);

  const handleToggleAudioFormat = useCallback((format: AudioFormat) => {
    dispatch({ type: 'TOGGLE_AUDIO_FORMAT', format });
  }, []);

  const handleAddPhrase = useCallback(() => {
    if (newPhrase.trim() !== "") {
      dispatch({ type: 'ADD_PHRASE', phrase: newPhrase });
      setNewPhrase("");
    }
  }, [newPhrase]);

  const handleDeletePhrase = useCallback((index: number) => {
    dispatch({ type: 'DELETE_PHRASE', index });
  }, []);

  const handleRestorePhrase = useCallback((index: number) => {
    dispatch({ type: 'RESTORE_PHRASE', index });
  }, []);

  const handleDeleteHistoryItem = useCallback((index: number) => {
    dispatch({ type: 'DELETE_HISTORY_ITEM', index });
  }, []);

  const handleClearAllHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const handleSaveCustomization = useCallback(() => {
    if (hasErrors) {
      setSaveMessageSeverity("error");
      setSaveMessageText("Veuillez corriger les erreurs avant d'enregistrer");
      setShowSaveMessage(true);
      return;
    }

    try {
      AIAssistantHistoryService.addEntry({
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleString(),
        user: "Admin",
        section: "Gestion des Réponses IA",
        action: "modify",
        comment: "Mise à jour des réponses autorisées et des phrases de motivation",
      });

      AIAssistantCustomizationService.saveCustomizationSettings(settings);

      setSaveMessageSeverity("success");
      setSaveMessageText("Paramètres enregistrés avec succès !");
      setShowSaveMessage(true);
    } catch (error) {
      setSaveMessageSeverity("error");
      setSaveMessageText("Erreur lors de l'enregistrement des paramètres");
      setShowSaveMessage(true);
    }
  }, [settings, hasErrors]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_SETTINGS' });

    AIAssistantCustomizationService.saveCustomizationSettings({
      responseType: ["text"],
      inputType: "text",
      welcomeMessage: "Bonjour ! Comment puis-je vous aider ?",
      motivationalPhrases: ["Excellent travail !", "Continue comme ça !", "Tu progresses bien !"],
      helpPhrases: ["Je vais t'expliquer la règle...", "Voici comment conjuguer ce verbe..."],
      audioFormat: ["mp3"], // Modifié pour être un array au lieu d'une string
      voiceTranscription: false,
      imageSupport: false,
      imageFormat: [],
      deletionHistory: [],
    });

    AIAssistantHistoryService.addEntry({
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: "Admin",
      section: "Gestion des Réponses IA",
      action: "modify",
      comment: "Réinitialisation des paramètres de personnalisation",
    });

    setSaveMessageSeverity("success");
    setSaveMessageText("Paramètres réinitialisés avec succès !");
    setShowSaveMessage(true);
  }, []);

  const handleCloseSnackbar = () => {
    setShowSaveMessage(false);
  };

  const SectionHeader = ({ title, icon }: { title: string, icon: any }) => (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 3, 
          mb: 2, 
          display: 'flex', 
          alignItems: 'center',
          color: theme.palette.primary.main,
          borderBottom: `2px solid ${theme.palette.primary.light}`,
          paddingBottom: 1
        }}
      >
        <FontAwesomeIcon icon={icon} style={{ marginRight: '10px' }} />
        {title}
      </Typography>
    </motion.div>
  );

  // Response type options with icons
  const responseTypeOptions = [
    { value: "text" as ResponseType, label: "Texte", icon: faFont },
    { value: "audio" as ResponseType, label: "Audio", icon: faMicrophone },
    { value: "image" as ResponseType, label: "Image", icon: faImage },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 3 }}>
        <m.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h4" gutterBottom sx={{
            textAlign: 'center',
            mb: 4,
            color: theme.palette.primary.main,
            fontWeight: 'bold'
          }}>
            Personnalisation de l&apos;Assistant IA
          </Typography>
        </m.div>

        <AnimatePresence>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: formAnimationVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <SectionHeader title="Types de réponse" icon={faFont} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {responseTypeOptions.map((option) => (
                  <Tooltip key={option.value} title={option.label}>
                    <Button
                      variant={settings.responseType.includes(option.value) ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleToggleResponseType(option.value)}
                      startIcon={<FontAwesomeIcon icon={option.icon} />}
                      sx={{ borderRadius: 4, px: 2 }}
                    >
                      {option.label}
                    </Button>
                  </Tooltip>
                ))}
              </Box>

              {errors.responseType && (
                <Alert severity="error" sx={{ mt: 1 }}>{errors.responseType}</Alert>
              )}

              <SectionHeader title="Messages et Phrases" icon={faFont} />

              <TextField
                label="Message d'accueil"
                fullWidth
                value={settings.welcomeMessage}
                onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                error={!!errors.welcomeMessage}
                helperText={errors.welcomeMessage}
                sx={{ mt: 2 }}
              />

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>
                Phrases de motivation
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Ajouter une phrase"
                  fullWidth
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPhrase()}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddPhrase}
                  startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                  disabled={!newPhrase.trim()}
                  sx={{ borderRadius: 2 }}
                >
                  Ajouter
                </Button>
              </Box>

              <List sx={{ bgcolor: theme.palette.background.paper, borderRadius: 1 }}>
                <AnimatePresence>
                  {Array.isArray(settings.motivationalPhrases) &&
                    settings.motivationalPhrases.map((phrase, index) => (
                      <m.div
                        key={`${phrase}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ListItem
                          sx={{
                            borderLeft: `4px solid ${theme.palette.primary.light}`,
                            mb: 1,
                            borderRadius: 1,
                            bgcolor: theme.palette.background.paper,
                            boxShadow: 1,
                          }}
                          secondaryAction={
                            <IconButton
                              onClick={() => handleDeletePhrase(index)}
                              color="primary"
                              size="small"
                              sx={{ '&:hover': { color: theme.palette.error.main } }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                          }
                        >
                          <Typography>{phrase}</Typography>
                        </ListItem>
                      </m.div>
                    ))}
                </AnimatePresence>
              </List>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <SectionHeader title="Paramètres Audio" icon={faMicrophone} />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>Formats Audio</Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {["mp3", "wav", "aac"].map((format) => (
                  <Button
                    key={format}
                    variant={settings.audioFormat.includes(format as AudioFormat) ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleToggleAudioFormat(format as AudioFormat)}
                    sx={{ borderRadius: 4, minWidth: '80px' }}
                  >
                    {format.toUpperCase()}
                  </Button>
                ))}
              </Box>

              {errors.audioFormat && (
                <Alert severity="error" sx={{ mt: 1 }}>{errors.audioFormat}</Alert>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography sx={{ mr: 2 }}>Transcription Vocale</Typography>
                <Switch
                  checked={!!settings.voiceTranscription}
                  onChange={(e) => handleChange("voiceTranscription", e.target.checked)}
                  color="primary"
                />
              </Box>

              <SectionHeader title="Paramètres Image" icon={faImage} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ mr: 2 }}>Support d&apos;Images</Typography>
                <Switch
                  checked={!!settings.imageSupport}
                  onChange={(e) => handleChange("imageSupport", e.target.checked)}
                  color="primary"
                />
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>Formats d&apos;Image</Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {["jpg", "png", "svg", "pdf"].map((format) => (
                  <Button
                    key={format}
                    variant={settings.imageFormat.includes(format as ImageFormat) ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleToggleImageFormat(format as ImageFormat)}
                    disabled={!settings.imageSupport}
                    sx={{ borderRadius: 4, minWidth: '80px' }}
                  >
                    {format.toUpperCase()}
                  </Button>
                ))}
              </Box>

              {settings.imageSupport && errors.imageFormat && (
                <Alert severity="error" sx={{ mt: 1 }}>{errors.imageFormat}</Alert>
              )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SectionHeader title="Historique des Suppressions" icon={faHistory} />
                {settings.deletionHistory.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={handleClearAllHistory}
                    startIcon={<FontAwesomeIcon icon={faTrash} />}
                    sx={{ borderRadius: 2 }}
                  >
                    Vider l&aposhistorique
                  </Button>
                )}
              </Box>

              {settings.deletionHistory.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', py: 2 }}>
                  Aucun élément dans l&aposhistorique des suppressions
                </Typography>
              ) : (
                <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                  <AnimatePresence>
                    {Array.isArray(settings.deletionHistory) &&
                      settings.deletionHistory.map((item, index) => (
                        <m.div
                          key={`${item.phrase}-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ListItem
                            sx={{
                              borderLeft: `4px solid ${item.type === "motivation" ? theme.palette.info.light : theme.palette.warning.light}`,
                              mb: 1,
                              borderRadius: 1,
                              bgcolor: theme.palette.background.paper,
                              boxShadow: 1,
                            }}
                            secondaryAction={
                              <Box>
                                {item.type === "motivation" && (
                                  <Tooltip title="Restaurer cette phrase">
                                    <IconButton
                                      onClick={() => handleRestorePhrase(index)}
                                      size="small"
                                      sx={{ mr: 1, color: theme.palette.info.main }}
                                    >
                                      <FontAwesomeIcon icon={faUndo} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Supprimer définitivement">
                                  <IconButton
                                    onClick={() => handleDeleteHistoryItem(index)}
                                    size="small"
                                    sx={{ color: theme.palette.error.main }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            }
                          >
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item.phrase}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                Supprimé le {item.date} • Type: {item.type === "motivation" ? "Phrase de motivation" : "Aide"}
                              </Typography>
                            </Box>
                          </ListItem>
                        </m.div>
                      ))}
                  </AnimatePresence>
                </List>
              )}
            </Paper>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: buttonAnimationVisible ? 1 : 0, y: buttonAnimationVisible ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveCustomization}
                  startIcon={<FontAwesomeIcon icon={faSave} />}
                  size="large"
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Enregistrer les modifications
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<FontAwesomeIcon icon={faRedo} />}
                  onClick={handleReset}
                  size="large"
                  sx={{ borderRadius: 2 }}
                >
                  Réinitialiser
                </Button>
              </Box>
            </m.div>
          </m.div>
        </AnimatePresence>

        <Snackbar
          open={showSaveMessage}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={saveMessageSeverity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {saveMessageText}
          </Alert>
        </Snackbar>
      </Box>
    </LazyMotion>
  );
}
