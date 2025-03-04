'use client';

import { useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, Divider } from '@mui/material';
import { fa0 } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Importation des composants de chaque module
import NiveauList from '../niveaux/NiveauList';
import NiveauDetails from '../niveaux/NiveauDetails';
import MatiereList from '../matieres/MatiereList';
import MatiereDetails from '../matieres/MatiereDetails';
import ChapitreList from '../chapitres/ChapitreList';
import ChapitreDetails from '../chapitres/ChapitreDetails';
import ExerciceList from '../exercices/ExerciceList';
import ExerciceDetails from '../exercices/ExerciceDetails';

// On définit ici les types de nos entités (vous pouvez aussi les définir dans un fichier d'interfaces séparé)
export interface Niveau {
  id: number;
  nom: string;
  description: string;
  observation?: string;
  dateCreation: string;
}

export interface Matiere {
  id: number;
  niveauId: number;
  nom: string;
  description: string;
  couleur?: string;
  icone?: string;
  dateCreation: string;
}

export interface Chapitre {
  id: number;
  matiereId: number;
  nom: string;
  description: string;
  difficulte: string;
  ordre: number;
  conditionsAcces?: string;
  dateCreation: string;
}

export interface Exercice {
  id: number;
  chapitreId: number;
  titre: string;
  description: string;
  ressources?: string;
  configuration?: string;
  planification?: string;
  dateCreation: string;
}

// Enumération des étapes de la navigation
type Step =
  | 'liste_niveaux'
  | 'detail_niveau'
  | 'liste_matieres'
  | 'detail_matiere'
  | 'liste_chapitres'
  | 'detail_chapitre'
  | 'liste_exercices'
  | 'detail_exercice';

export default function ApprentissageView() {
  // Gestion de l'étape actuelle de la navigation
  const [currentStep, setCurrentStep] = useState<Step>('liste_niveaux');

  // États pour stocker l'élément sélectionné dans chaque module
  const [selectedNiveau, setSelectedNiveau] = useState<Niveau | null>(null);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [selectedChapitre, setSelectedChapitre] = useState<Chapitre | null>(null);
  const [selectedExercice, setSelectedExercice] = useState<Exercice | null>(null);

  // Fonction pour revenir en arrière (selon le fil d’Ariane)
  const goBack = () => {
    if (currentStep === 'detail_niveau') setCurrentStep('liste_niveaux');
    else if (currentStep === 'liste_matieres') setCurrentStep('detail_niveau');
    else if (currentStep === 'detail_matiere') setCurrentStep('liste_matieres');
    else if (currentStep === 'liste_chapitres') setCurrentStep('detail_matiere');
    else if (currentStep === 'detail_chapitre') setCurrentStep('liste_chapitres');
    else if (currentStep === 'liste_exercices') setCurrentStep('detail_chapitre');
    else if (currentStep === 'detail_exercice') setCurrentStep('liste_exercices');
  };

  // Rendu d'un fil d'Ariane simple basé sur currentStep et les éléments sélectionnés
  const renderBreadcrumbs = () => {
    return (
      <Breadcrumbs aria-label="breadcrumb" separator={<FontAwesomeIcon icon={fa0} />}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => setCurrentStep('liste_niveaux')}
          sx={{ cursor: 'pointer' }}
        >
          Niveaux
        </Link>
        {selectedNiveau && (
          <Link
            underline="hover"
            color="inherit"
            onClick={() => setCurrentStep('liste_matieres')}
            sx={{ cursor: 'pointer' }}
          >
            {selectedNiveau.nom}
          </Link>
        )}
        {selectedMatiere && (
          <Link
            underline="hover"
            color="inherit"
            onClick={() => setCurrentStep('liste_chapitres')}
            sx={{ cursor: 'pointer' }}
          >
            {selectedMatiere.nom}
          </Link>
        )}
        {selectedChapitre && <Typography color="text.primary">{selectedChapitre.nom}</Typography>}
      </Breadcrumbs>
    );
  };

  // Rendu du contenu en fonction de l'étape
  const renderContent = () => {
    switch (currentStep) {
      case 'liste_niveaux':
        return (
          <NiveauList
            onSelect={(niveau) => {
              setSelectedNiveau(niveau);
              setCurrentStep('detail_niveau');
            }}
            onAdd={() => {
              // Ouvrir le dialogue pour ajouter un Niveau (à gérer dans le composant NiveauList ou via un state global)
            }}
          />
        );
      case 'detail_niveau':
        return (
          <NiveauDetails
            niveau={selectedNiveau!}
            onEdit={() => {}}
            onDelete={() => {}}
            onManageMatieres={() => setCurrentStep('liste_matieres')}
            onBack={goBack}
          />
        );
      case 'liste_matieres':
        return (
          <MatiereList
            niveau={selectedNiveau!}
            onSelect={(matiere) => {
              setSelectedMatiere(matiere);
              setCurrentStep('detail_matiere');
            }}
            onAdd={() => {}}
            onBack={goBack}
          />
        );
      case 'detail_matiere':
        return (
          <MatiereDetails
            matiere={selectedMatiere!}
            onEdit={() => {}}
            onDelete={() => {}}
            onManageChapitres={() => setCurrentStep('liste_chapitres')}
            onBack={goBack}
          />
        );
      case 'liste_chapitres':
        return (
          <ChapitreList
            matiere={selectedMatiere!}
            onSelect={(chapitre) => {
              setSelectedChapitre(chapitre);
              setCurrentStep('detail_chapitre');
            }}
            onAdd={() => {}}
            onBack={goBack}
          />
        );
      case 'detail_chapitre':
        return (
          <ChapitreDetails
            chapitre={selectedChapitre!}
            onEdit={() => {}}
            onDelete={() => {}}
            onManageExercices={() => setCurrentStep('liste_exercices')}
            onBack={goBack}
          />
        );
      case 'liste_exercices':
        return (
          <ExerciceList
            chapitre={selectedChapitre!}
            onSelect={(exercice) => {
              setSelectedExercice(exercice);
              setCurrentStep('detail_exercice');
            }}
            onAdd={() => {}}
            onBack={goBack}
          />
        );
      case 'detail_exercice':
        return (
          <ExerciceDetails
            exercice={selectedExercice!}
            onEdit={() => {}}
            onDelete={() => {}}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Gestion de Contenu Pédagogique
      </Typography>
      <Divider sx={{ my: 2 }} />
      {renderBreadcrumbs()}
      <Box sx={{ mt: 2 }}>{renderContent()}</Box>
    </Box>
  );
}
