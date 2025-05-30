"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Material UI imports
import {
  Box,
  List,
  Fade,
  Paper,
  Button,
  Divider,
  ListItem,
  useTheme,
  Typography,
  ListItemText,
  ListItemButton
} from "@mui/material";

// Settings panel components
import AIAssistantFiltering from "./settings/AIAssistantFiltering";
import AIAssistantLanguages from "./settings/AIAssistantLanguages";
import AIAssistantDescription from "./settings/AIAssistantDescription";
import AIAssistantDetailLevel from "./settings/AIAssistantDetailLevel";
import AIAssistantCustomization from "./settings/AIAssistantCustomization";
import AIAssistantTestingValidation from "./settings/AIAssistantTestingValidation";

// Types
type MenuOption = {
  id: string;
  label: string;
  component: React.ReactNode;
};

type AIAssistantSettingsProps = {
  assistantId: string;
};

export default function AIAssistantSettings({ assistantId }: AIAssistantSettingsProps) {
  const router = useRouter();
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState<string>("description");

  // Memoized menu options to prevent recreating on every render
  const menuOptions: MenuOption[] = useMemo(() => [
    {
      id: "description",
      label: "Description",
      component: <AIAssistantDescription assistantId={assistantId} />
    },
    {
      id: "customization",
      label: "Gestion des Réponses IA",
      component: <AIAssistantCustomization />
    },
    {
      id: "detail-level",
      label: "Réglage du Niveau de Détail",
      component: <AIAssistantDetailLevel assistantId={assistantId} />
    },
    {
      id: "languages",
      label: "Gestion des Langues",
      component: <AIAssistantLanguages assistantId={assistantId} />
    },
    {
      id: "filtering",
      label: "Supervision et Filtrage",
      component: <AIAssistantFiltering assistantId={assistantId} />
    },
    {
      id: "testing",
      label: "Test et Validation",
      component: <AIAssistantTestingValidation assistantId={assistantId} />
    }
  ], [assistantId]);

  // Get the currently selected component
  const activeComponent = useMemo(() => {
    const option = menuOptions.find(opt => opt.id === selectedOption);
    return option?.component || (
      <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
        Sélectionnez une option dans le menu pour configurer l&apos;assistant.
      </Typography>
    );
  }, [selectedOption, menuOptions]);

  const handleReturnClick = () => router.back();

  // Sidebar component - extracted for better organization
  const Sidebar = () => (
    <Paper
      elevation={3}
      sx={{
        width: 280,
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        p: 2,
        height: "100%",
        position: "fixed",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleReturnClick}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Retour
      </Button>

      <Typography variant="h6" sx={{ mb: 1 }}>Paramètres de l&apos;Assistant</Typography>
      <Divider sx={{ my: 2 }} />

      <List sx={{ flexGrow: 1 }}>
        {menuOptions.map((menuItem) => (
          <ListItem key={menuItem.id} disablePadding>
            <ListItemButton
              selected={selectedOption === menuItem.id}
              onClick={() => setSelectedOption(menuItem.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                  }
                },
              }}
            >
              <ListItemText primary={menuItem.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  // Main content component - extracted for better organization
  const MainContent = () => {
    const activeMenuOption = menuOptions.find(opt => opt.id === selectedOption);

    return (
      <Box
        sx={{
          flexGrow: 1,
          ml: "280px",
          p: 4,
          height: "100vh",
          overflowY: "auto"
        }}
      >
        <Fade in timeout={450}>
          <div>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textAlign: "center",
                color: theme.palette.primary.main,
                fontWeight: "medium"
              }}
            >
              {activeMenuOption?.label || "Configuration de l'Assistant"}
            </Typography>

            <Divider sx={{ width: "100%", maxWidth: 800, mx: "auto", mb: 4 }} />

            <Box sx={{
              width: "100%",
              maxWidth: 800,
              mx: "auto",
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper
            }}>
              {activeComponent}
            </Box>
          </div>
        </Fade>
      </Box>
    );
  };

  return (
    <Box sx={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      bgcolor: theme.palette.background.default
    }}>
      <Sidebar />
      <MainContent />
    </Box>
  );
}
