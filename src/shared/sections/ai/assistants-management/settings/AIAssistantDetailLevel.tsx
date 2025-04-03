import type { AIAssistantDetailLevelProps } from 'src/types/ai-assistant';

import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import { AIAssistantHistoryService } from "../AIAssistantHistoryService";
import { AIAssistantDetailLevelService } from "./AIAssistantDetailLevelService";

import type { IAIAssistantDetailLevel } from "./AIAssistantDetailLevelService";

export default function AIAssistantDetailLevel({ assistantId }: AIAssistantDetailLevelProps) {
  const [detailLevel, setDetailLevel] = useState<IAIAssistantDetailLevel>({ level: 3 });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Si un assistantId est fourni, récupérer les paramètres spécifiques à cet assistant
    if (assistantId) {
      setDetailLevel(AIAssistantDetailLevelService.getDetailLevelById(assistantId));
    } else {
      setDetailLevel(AIAssistantDetailLevelService.getDetailLevel());
    }
  }, [assistantId]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setDetailLevel({ level: newValue as number });
    setIsSaved(false);
  };

  const handleSaveWithHistory = () => {
    AIAssistantHistoryService.addEntry({
      id: `hist-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: "Admin", // Modifier si nécessaire
      section: "Niveau de Détail",
      action: "modify",
      comment: `Modification du niveau de détail à ${detailLevel.level}`,
    });
    // Enregistrer les paramètres
    if (assistantId) {
      AIAssistantDetailLevelService.saveDetailLevelById(assistantId, detailLevel);
    } else {
      AIAssistantDetailLevelService.saveDetailLevel(detailLevel);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Récupérer les descriptions et exemples
  const LEVEL_DESCRIPTIONS = AIAssistantDetailLevelService.getLevelDescriptions();
  const EXAMPLES = AIAssistantDetailLevelService.getLevelExamples();

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        {/* Curseur de Niveau */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Niveau Actuel : {detailLevel.level}
        </Typography>
        
        <Slider
          value={detailLevel.level}
          min={1}
          max={5}
          step={1}
          marks
          onChange={handleChange}
          sx={{ mt: 2, mb: 3 }}
          valueLabelDisplay="auto"
        />

        {/* Description du niveau sélectionné */}
        <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
          {LEVEL_DESCRIPTIONS[detailLevel.level - 1]}
        </Typography>
      </Paper>

      {/* Exemple dynamique basé sur le niveau sélectionné */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: "background.default" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Exemple d&apos;Indice
        </Typography>
        
        <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1, border: '1px solid #e0e0e0' }}>
          <Typography variant="body2">
            {EXAMPLES[detailLevel.level - 1]}
          </Typography>
        </Box>
      </Paper>

      {/* Boutons Enregistrement */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          variant="contained"
          color="primary"
          onClick={handleSaveWithHistory}
          sx={{ minWidth: 200 }}
        >
          Enregistrer les modifications
        </Button>
        
        {isSaved && (
          <Typography variant="body2" color="success.main">
            Modifications enregistrées avec succès
          </Typography>
        )}
      </Box>
    </Box>
  );
}