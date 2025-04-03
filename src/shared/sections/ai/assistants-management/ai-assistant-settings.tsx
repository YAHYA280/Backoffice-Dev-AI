"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import AIAssistantFiltering from "./settings/AIAssistantFiltering";
import AIAssistantLanguages from "./settings/AIAssistantLanguages";
import AIAssistantDescription from "./settings/AIAssistantDescription";
import AIAssistantDetailLevel from "./settings/AIAssistantDetailLevel";
import AIAssistantCustomization from "./settings/AIAssistantCustomization";
import AIAssistantTestingValidation from "./settings/AIAssistantTestingValidation";

type AIAssistantSettingsProps = {
  assistantId: string;
};

export default function AIAssistantSettings({ assistantId }: AIAssistantSettingsProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("Description");
  
  const menuOptions = [
    "Description",
    "Gestion des Réponses IA",
    "Réglage du Niveau de Détail",
    "Gestion des Langues",
    "Supervision et Filtrage",
    "Test et Validation",
  ];
  
  const handleMenuItemClick = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleReturnClick = () => {
    router.back();
  };
  
  // Fonction pour rendre le contenu basé sur l'option sélectionnée
  const renderContent = () => {
    switch (selectedOption) {
      case "Description":
        return <AIAssistantDescription assistantId={assistantId} />;
      case "Gestion des Réponses IA":
        return <AIAssistantCustomization />;
      case "Réglage du Niveau de Détail":
        return <AIAssistantDetailLevel assistantId={assistantId} />;
      case "Gestion des Langues":
        return <AIAssistantLanguages assistantId={assistantId} />;
      case "Supervision et Filtrage":
        return <AIAssistantFiltering assistantId={assistantId} />;
      case "Test et Validation":
        return <AIAssistantTestingValidation assistantId={assistantId} />; // 🔹 Correction ici
      default:
        return (
          <Typography variant="body1">
            Sélectionnez une option dans le menu pour configurer l&apos;assistant.
          </Typography>
        );
    }
  };
  
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar fixe */}
      <Box 
        sx={{
          width: 280,
          borderRight: "1px solid #e0e0e0",
          bgcolor: "#f5f5f5",
          p: 2,
          height: "100%",
          position: "fixed",
          overflowY: "auto"
        }}
      >
        {/* Bouton de retour */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleReturnClick}
          sx={{ mb: 2 }}
        >
          Retour
        </Button>
        
        <Typography variant="h6">Paramètres de l&apos;Assistant</Typography>
        <Divider sx={{ my: 2 }} />
        
        <List>
          {menuOptions.map((option) => (
            <ListItem key={option} disablePadding>
              <ListItemButton
                selected={selectedOption === option}
                onClick={() => handleMenuItemClick(option)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "#e3f2fd",
                    borderRight: "3px solid #1976d2",
                  },
                }}
              >
                <ListItemText primary={option} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Contenu principal avec marge pour éviter le chevauchement avec le menu fixe */}
      <Box 
        sx={{
          flexGrow: 1,
          ml: "280px", // Correspondant à la largeur du menu
          p: 4,
          height: "100vh",
          overflowY: "auto"
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }} >
          {selectedOption}
        </Typography>
        
        <Divider sx={{ width: "100%", maxWidth: 800, mb: 3 }} />
        
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}