import type { IAIAssistantCustomizationSettings } from "src/types/ai-assistant";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRedo,
  faUndo, 
  faTrash, 
} from "@fortawesome/free-solid-svg-icons";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";

import { AIAssistantHistoryService } from "../AIAssistantHistoryService";
import { AIAssistantCustomizationService } from "./AIAssistantCustomizationService";

export default function AIAssistantCustomization() {
  const [settings, setSettings] = useState<IAIAssistantCustomizationSettings>(
    AIAssistantCustomizationService.getCustomizationSettings()
  );
  // État pour gérer l'affichage du message de confirmation
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useEffect(() => {
    // Ne pas sauvegarder automatiquement à chaque changement d'état
    // pour éviter les appels fréquents à localStorage
  }, [settings]);

  const handleChange = useCallback((field: keyof IAIAssistantCustomizationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Updated to handle multiple response types
  const handleResponseTypeChange = useCallback((type: "text" | "audio" | "image") => 
    setSettings((prev) => {
      const currentTypes = Array.isArray(prev.responseType) ? prev.responseType : [];
      
      // If type is already selected, remove it
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          responseType: currentTypes.filter(t => t !== type)
        };
      }
      
      // Otherwise add it
      return {
        ...prev,
        responseType: [...currentTypes, type]
      };
    }), 
  []);

  const handleImageFormatChange = useCallback((format: "jpg" | "png"  | "svg") => {
    setSettings((prev) => {
      const currentFormats = Array.isArray(prev.imageFormat) ? prev.imageFormat : [];
      
      // Si le format est déjà sélectionné, on le retire
      if (currentFormats.includes(format)) {
        return {
          ...prev,
          imageFormat: currentFormats.filter(f => f !== format)
        };
      }
      
      // Sinon, on l'ajoute
      return {
        ...prev,
        imageFormat: [...currentFormats, format]
      };
    });
  }, []);

  const handleAudioFormatChange = useCallback((format: "mp3" | "wav" | "aac") => {
    setSettings((prev) => ({ ...prev, audioFormat: format }));
  }, []);
  
  const [newPhrase, setNewPhrase] = useState(""); // État pour stocker la phrase en cours d'écriture

  const handleAddPhrase = () => {
    if (newPhrase.trim() !== "") {
      setSettings((prev) => ({
        ...prev,
        motivationalPhrases: [...prev.motivationalPhrases, newPhrase.trim()], // Ajout de la phrase
      }));
      setNewPhrase(""); // Réinitialisation du champ de texte
    }
  };

  const handleDeletePhrase = (index: number) => {
    const phraseToDelete = settings.motivationalPhrases[index];
    
    // Ajouter à l'historique des suppressions
    const newDeletionHistoryItem = {
      phrase: phraseToDelete,
      date: new Date().toLocaleString(),
      type: "motivation" as const
    };
    
    setSettings((prev) => ({
      ...prev,
      motivationalPhrases: prev.motivationalPhrases.filter((_, i) => i !== index),
      deletionHistory: [...prev.deletionHistory, newDeletionHistoryItem]
    }));
  };
  
  const handleRestorePhrase = (index: number) => {
    const itemToRestore = settings.deletionHistory[index];
    
    if (itemToRestore.type === "motivation") {
      setSettings((prev) => ({
        ...prev,
        motivationalPhrases: [...prev.motivationalPhrases, itemToRestore.phrase],
        deletionHistory: prev.deletionHistory.filter((_, i) => i !== index)
      }));
    }
  };

  // Nouvelle fonction pour supprimer définitivement un élément de l'historique
  const handleDeleteHistoryItem = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      deletionHistory: prev.deletionHistory.filter((_, i) => i !== index)
    }));
  };

  // Fonction pour vider complètement l'historique
  const handleClearAllHistory = () => {
    setSettings((prev) => ({
      ...prev,
      deletionHistory: []
    }));
  };

  const handleSaveCustomization = () => {
    // Ajouter à l'historique des modifications
    AIAssistantHistoryService.addEntry({
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: "Admin", // Modifier si nécessaire
      section: "Gestion des Réponses IA",
      action: "modify",
      comment: "Mise à jour des réponses autorisées et des phrases de motivation",
    });
    
    // Enregistrer les paramètres
    AIAssistantCustomizationService.saveCustomizationSettings(settings);
    
    // Afficher le message de confirmation
    setShowSaveMessage(true);
  };

  // Fonction pour fermer le message de confirmation
  const handleCloseSnackbar = () => {
    setShowSaveMessage(false);
  };

  const handleReset = () => {
    const defaultSettings: IAIAssistantCustomizationSettings = {
      responseType: ["text"], // Changed to array with default "text"
      inputType: "text",
      welcomeMessage: "Bonjour ! Comment puis-je vous aider ?",
      motivationalPhrases: ["Excellent travail !", "Continue comme ça !", "Tu progresses bien !"],
      helpPhrases: ["Je vais t'expliquer la règle...", "Voici comment conjuguer ce verbe..."],
      audioFormat: "mp3",
      voiceTranscription: false,
      imageSupport: false,
      imageFormat: [],
      deletionHistory: [],
    };
    
    setSettings(defaultSettings);
    
    // Enregistrer les paramètres par défaut
    AIAssistantCustomizationService.saveCustomizationSettings(defaultSettings);
    
    // Ajouter à l'historique des modifications
    AIAssistantHistoryService.addEntry({
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: "Admin",
      section: "Gestion des Réponses IA",
      action: "modify",
      comment: "Réinitialisation des paramètres de personnalisation",
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Types de Contenu */}
      <Typography variant="h6">Types de réponse</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={Array.isArray(settings.responseType) && settings.responseType.includes("text")}
            onChange={() => handleResponseTypeChange("text")}
          />
        }
        label="Texte"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={Array.isArray(settings.responseType) && settings.responseType.includes("audio")}
            onChange={() => handleResponseTypeChange("audio")}
          />
        }
        label="Audio"
      />
      <Divider sx={{ my: 2 }} />

       {/* Messages et Phrases */}
       <Typography variant="h6">Messages et Phrases</Typography>
      <TextField
        label="Message d'accueil"
        fullWidth
        value={settings.welcomeMessage}
        onChange={(e) => handleChange("welcomeMessage", e.target.value)}
        sx={{ mt: 2 }}
      />

      {/* Phrases de motivation */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Phrases de motivation
      </Typography>

      {/* Ajout d'une nouvelle phrase */}
      <TextField
        label="Ajouter une phrase"
        fullWidth
        value={newPhrase}
        onChange={(e) => setNewPhrase(e.target.value)}
        sx={{ mt: 2 }}
      />
 
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPhrase}
        sx={{ mt: 1 }}
      >
        Ajouter
      </Button>
 
      <List>
        {Array.isArray(settings.motivationalPhrases) &&
          settings.motivationalPhrases.map((phrase, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  onClick={() => handleDeletePhrase(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              }
            >
              {phrase}
            </ListItem>
          ))}
      </List>
       
      {/* Paramètres Audio */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Paramètres Audio</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.audioFormat === "mp3"}
            onChange={() => handleAudioFormatChange("mp3")}
          />
        }
        label="MP3"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.audioFormat === "wav"}
            onChange={() => handleAudioFormatChange("wav")}
          />
        }
        label="WAV"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.audioFormat === "aac"}
            onChange={() => handleAudioFormatChange("aac")}
          />
        }
        label="AAC"
      />

      <Typography sx={{ mt: 2 }}>Transcription Vocale</Typography>
      <Switch checked={!!settings.voiceTranscription} onChange={(e) => handleChange("voiceTranscription", e.target.checked)} />

      {/* Nouveaux Paramètres Image */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Paramètres Image</Typography>
      <Typography sx={{ mt: 2 }}>Support d&apos;Images</Typography>
      <Switch 
        checked={!!settings.imageSupport} 
        onChange={(e) => handleChange("imageSupport", e.target.checked)} 
      />
      
      <Typography sx={{ mt: 2 }}>Formats d&apos;Image</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={Array.isArray(settings.imageFormat) && settings.imageFormat.includes("jpg")}
            onChange={() => handleImageFormatChange("jpg")}
            disabled={!settings.imageSupport}
          />
        }
        label="JPG"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={Array.isArray(settings.imageFormat) && settings.imageFormat.includes("png")}
            onChange={() => handleImageFormatChange("png")}
            disabled={!settings.imageSupport}
          />
        }
        label="PNG"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={Array.isArray(settings.imageFormat) && settings.imageFormat.includes("svg")}
            onChange={() => handleImageFormatChange("svg")}
            disabled={!settings.imageSupport}
          />
        }
        label="SVG"
      />

      {/* Historique des Suppressions */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Historique des Suppressions</Typography>
        {settings.deletionHistory.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={handleClearAllHistory}
          >
            Vider l&apos;historique
          </Button>
        )}
      </Box>
      <List>
        {Array.isArray(settings.deletionHistory) &&
          settings.deletionHistory.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <Box>
                  {item.type === "motivation" && (
                    <IconButton
                      onClick={() => handleRestorePhrase(index)}
                      title="Restaurer cette phrase"
                    >
                      <FontAwesomeIcon icon={faUndo} />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => handleDeleteHistoryItem(index)}
                    title="Supprimer définitivement"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Box>
              }
            >
              {item.phrase} - Supprimé le {item.date} - Type: {item.type === "motivation" ? "Phrase de motivation" : "Aide"}
            </ListItem>
          ))}
      </List>

      {/* Boutons d'action */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSaveCustomization}
        >
          Enregistrer les modifications
        </Button>

        <Button 
          variant="contained" 
          color="warning" 
          startIcon={<FontAwesomeIcon icon={faRedo} />} 
          onClick={handleReset}
        >
          Réinitialiser les paramètres
        </Button>
      </Box>

      {/* Message de confirmation après enregistrement */}
      <Snackbar 
        open={showSaveMessage} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Paramètres enregistrés avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
}