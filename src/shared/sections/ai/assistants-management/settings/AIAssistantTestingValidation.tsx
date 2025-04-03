"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSave, 
  faTrash, 
  faHistory, 
  faPaperPlane, 
  faChevronDown, 
  faCheckCircle,
  faExclamationCircle, 
  faExclamationTriangle, 
} from "@fortawesome/free-solid-svg-icons";

import {
  Box,
  Grid,
  Chip,
  Alert,
  Paper,
  Radio,
  Table,
  Button,
  Divider,
  Tooltip,
  TableRow,
  TableBody,
  TableHead,
  Accordion,
  TextField,
  FormLabel,
  TableCell,
  RadioGroup,
  IconButton,
  Typography,
  FormControl,
  TableContainer,
  CircularProgress,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

type TestResult = {
  id: string;
  timestamp: string;
  question: string;
  aiResponse: string;
  evaluation: 'pertinent' | 'partiellement' | 'incorrect' | null;
  comments: string;
  responseTime?: number; // en secondes
};

type AIAssistantTestingValidationProps = {
  assistantId: string;
};

export default function AIAssistantTestingValidation({ assistantId }: AIAssistantTestingValidationProps) {
  // États pour le formulaire de test
  const [question, setQuestion] = useState("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [evaluation, setEvaluation] = useState<'pertinent' | 'partiellement' | 'incorrect' | null>(null);
  const [evaluationComments, setEvaluationComments] = useState("");
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  
  // État pour l'historique des tests
  const [testHistory, setTestHistory] = useState<TestResult[]>([
    {
      id: "test-1",
      timestamp: "2025-02-25T10:15:00",
      question: "Quelle est la capitale de la France?",
      aiResponse: "La capitale de la France est Paris. C'est la plus grande ville du pays et elle est connue pour de nombreux monuments comme la Tour Eiffel et l'Arc de Triomphe.",
      evaluation: "pertinent",
      comments: "Réponse correcte et adaptée au niveau primaire",
      responseTime: 1.2
    },
    {
      id: "test-2",
      timestamp: "2025-02-25T10:20:00",
      question: "Pourquoi le ciel est bleu?",
      aiResponse: "Le ciel est bleu à cause de la diffusion de la lumière du soleil par les molécules dans l'air. La lumière bleue est plus diffusée que les autres couleurs.",
      evaluation: "partiellement",
      comments: "Explication correcte mais pourrait être simplifiée pour des élèves de primaire",
      responseTime: 1.8
    }
  ]);
  
  // État pour les alertes et messages
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error' | 'warning' | 'info', message: string} | null>(null);
  
  // Fonction pour soumettre une question de test
  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;
    
    setIsGeneratingResponse(true);
    setCurrentResponse("");
    setShowEvaluationForm(false);
    setEvaluation(null);
    setEvaluationComments("");
    
    try {
      // Simuler un appel API à l'assistant IA
      const startTime = Date.now();
      
      // Simulation d'un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Exemple de réponse générée (à remplacer par l'appel API réel)
      const aiResponse = `Voici ma réponse à votre question: "${question}". 
      
Je suis un assistant IA conçu pour aider les élèves du primaire. Je m'efforce de fournir des explications adaptées à leur niveau de compréhension.`;
      
      const endTime = Date.now();
      const responseTime = ((endTime - startTime) / 1000).toFixed(1);
      
      setCurrentResponse(aiResponse);
      setShowEvaluationForm(true);
      setAlertMessage({
        type: 'success',
        message: `Réponse générée en ${responseTime} secondes`
      });
      
      // Effacer le message après 5 secondes
      setTimeout(() => setAlertMessage(null), 5000);
      
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      setAlertMessage({
        type: 'error',
        message: "Une erreur s'est produite lors de la génération de la réponse"
      });
    } finally {
      setIsGeneratingResponse(false);
    }
  };
  
  // Fonction pour soumettre une évaluation
  const handleSubmitEvaluation = () => {
    if (!evaluation) {
      setAlertMessage({
        type: 'warning',
        message: "Veuillez sélectionner une évaluation avant de soumettre"
      });
      return;
    }
    
    const newTestResult: TestResult = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      question,
      aiResponse: currentResponse,
      evaluation,
      comments: evaluationComments,
      responseTime: 1.5 // À remplacer par le temps réel mesuré
    };
    
    setTestHistory([newTestResult, ...testHistory]);
    
    // Réinitialiser le formulaire
    setQuestion("");
    setCurrentResponse("");
    setShowEvaluationForm(false);
    setEvaluation(null);
    setEvaluationComments("");
    
    setAlertMessage({
      type: 'success',
      message: "Évaluation enregistrée avec succès"
    });
    
    // Effacer le message après 5 secondes
    setTimeout(() => setAlertMessage(null), 5000);
  };
  
  // Fonction pour supprimer un test de l'historique
  const handleDeleteTest = (testId: string) => {
    setTestHistory(testHistory.filter(test => test.id !== testId));
  };
  
  // Fonction pour formatter la date
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
  
  // Fonction pour obtenir l'icône d'évaluation
  const getEvaluationIcon = (evalType: 'pertinent' | 'partiellement' | 'incorrect' | null) => {
    switch(evalType) {
      case 'pertinent':
        return <FontAwesomeIcon icon={faCheckCircle} color="green" />;
      case 'partiellement':
        return <FontAwesomeIcon icon={faExclamationTriangle} color="orange" />;
      case 'incorrect':
        return <FontAwesomeIcon icon={faExclamationCircle} color="red" />;
      default:
        return null;
    }
  };
  
  // Fonction pour obtenir le libellé de l'évaluation
  const getEvaluationLabel = (evalType: 'pertinent' | 'partiellement' | 'incorrect' | null) => {
    switch(evalType) {
      case 'pertinent':
        return "Pertinent";
      case 'partiellement':
        return "Partiellement correct";
      case 'incorrect':
        return "Incorrect";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h5" gutterBottom>
        Test et Validation de l&apos;Assistant IA
      </Typography>
      
      <Typography variant="body1" paragraph>
        Utilisez cet outil pour tester les réponses de l&apos;assistant IA
      </Typography>
      
      {alertMessage && (
        <Alert 
          severity={alertMessage.type} 
          sx={{ mb: 3 }}
          onClose={() => setAlertMessage(null)}
        >
          {alertMessage.message}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Zone de test */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Zone de Test
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              fullWidth
              label="Entrez une question de test"
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Qu'est-ce que la photosynthèse?"
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                endIcon={isGeneratingResponse ? <CircularProgress size={20} color="inherit" /> : <FontAwesomeIcon icon={faPaperPlane} />}
                onClick={handleSubmitQuestion}
                disabled={isGeneratingResponse || !question.trim()}
              >
                {isGeneratingResponse ? "Génération en cours..." : "Tester la question"}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Affichage de la réponse */}
        {(currentResponse || isGeneratingResponse) && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Réponse de l&apos;Assistant IA
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {isGeneratingResponse ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 1, 
                  whiteSpace: 'pre-wrap',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body1">
                    {currentResponse}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
        
        {/* Zone d'évaluation */}
        {showEvaluationForm && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Évaluation de la Réponse
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Qualité de la réponse</FormLabel>
                <RadioGroup
                  row
                  value={evaluation}
                  onChange={(e) => setEvaluation(e.target.value as 'pertinent' | 'partiellement' | 'incorrect')}
                >
                  <FormControlLabel 
                    value="pertinent" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', marginRight: '8px' }} />
                        <Typography>Pertinent</Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="partiellement" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: 'orange', marginRight: '8px' }} />
                        <Typography>Partiellement correct</Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="incorrect" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ color: 'red', marginRight: '8px' }} />
                        <Typography>Incorrect</Typography>
                      </Box>
                    } 
                  />
                </RadioGroup>
              </FormControl>
              
              <TextField
                fullWidth
                label="Commentaires d'évaluation (optionnel)"
                variant="outlined"
                value={evaluationComments}
                onChange={(e) => setEvaluationComments(e.target.value)}
                placeholder="Ex: La réponse est correcte mais trop complexe pour des élèves de CE1"
                multiline
                rows={2}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<FontAwesomeIcon icon={faSave} />}
                  onClick={handleSubmitEvaluation}
                  disabled={!evaluation}
                >
                  Enregistrer l&apos;évaluation
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
        
        {/* Historique des tests */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Historique des Tests
              </Typography>
              <Chip 
                icon={<FontAwesomeIcon icon={faHistory} />} 
                label={`${testHistory.length} tests effectués`} 
                color="primary" 
                variant="outlined"
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {testHistory.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Aucun test n&apos;a encore été effectué.
              </Typography>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date/Heure</TableCell>
                        <TableCell>Question</TableCell>
                        <TableCell>Évaluation</TableCell>
                        <TableCell>Temps</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testHistory.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>{formatDate(test.timestamp)}</TableCell>
                          <TableCell>
                            {test.question.length > 50 
                              ? `${test.question.substring(0, 50)}...` 
                              : test.question}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getEvaluationIcon(test.evaluation)}
                              <Typography sx={{ ml: 1 }}>
                                {getEvaluationLabel(test.evaluation)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{test.responseTime}s</TableCell>
                          <TableCell>
                            <Tooltip title="Supprimer ce test">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteTest(test.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                  Détails des tests
                </Typography>
                
                {testHistory.map((test) => (
                  <Accordion key={test.id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getEvaluationIcon(test.evaluation)}
                        <Typography sx={{ ml: 1, fontWeight: 'bold' }}>
                          {test.question.length > 70 
                            ? `${test.question.substring(0, 70)}...` 
                            : test.question}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Question:</Typography>
                          <Typography variant="body2" paragraph>{test.question}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Réponse de l&apos;IA:</Typography>
                          <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                            {test.aiResponse}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">Évaluation:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {getEvaluationIcon(test.evaluation)}
                            <Typography sx={{ ml: 1 }}>
                              {getEvaluationLabel(test.evaluation)}
                            </Typography>
                          </Box>
                          {test.comments && (
                            <Typography variant="body2">
                              <strong>Commentaires:</strong> {test.comments}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Test effectué le {formatDate(test.timestamp)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Temps de réponse: {test.responseTime}s
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}