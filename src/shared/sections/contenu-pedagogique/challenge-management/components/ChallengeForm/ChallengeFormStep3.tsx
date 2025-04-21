import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPlus,
  faTrash,
  faListOl,
  faGamepad,
  faQuestion,
  faChevronLeft,
  faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons';

import {
  Grid,
  List,
  Chip,
  Paper,
  alpha,
  Stack,
  Button,
  Divider,
  ListItem,
  Typography,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import { QuestionType } from '../../types';
import { QuestionSidebar } from './QuestionSidebar';

import type { StepProps, EditableQuestion } from './types';

const QUESTION_TYPE_OPTIONS = [
  {
    value: QuestionType.QCM,
    label: 'QCM',
    icon: faListOl,
    description: 'Question à choix multiples avec une ou plusieurs réponses correctes',
  },
  {
    value: QuestionType.OUVERTE,
    label: 'Question ouverte',
    icon: faQuestion,
    description: 'Question à réponse libre (texte court ou long)',
  },
  {
    value: QuestionType.MINIJEU,
    label: 'Mini-jeu',
    icon: faPuzzlePiece,
    description: 'Jeu interactif, puzzle, ou activité spéciale',
  },
  {
    value: QuestionType.VISUEL,
    label: 'Jeu visuel',
    icon: faGamepad,
    description: 'Interaction visuelle (glisser-déposer, cliquer, etc.)',
  },
];

export const ChallengeFormStep3: React.FC<StepProps> = ({ form, generateId }) => {
  const { watch, setValue } = form;
  const questions = watch('questions') || [];

  const [questionSidebarOpen, setQuestionSidebarOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<EditableQuestion | null>(null);

  // Sidebar handlers
  const openNewQuestionSidebar = () => {
    const newQuestion: EditableQuestion = {
      id: generateId(),
      type: QuestionType.QCM,
      texte: '',
      ordre: questions.length,
      points: 10,
      duree: 60,
      isRequired: true,
      fichier_image: null,
      fichier_video: null,
      reponses: [
        { texte: '', estCorrecte: false },
        { texte: '', estCorrecte: false },
      ],
    };
    setCurrentQuestion(newQuestion);
    setEditingQuestionIndex(null);
    setQuestionSidebarOpen(true);
  };

  const openEditQuestionSidebar = (index: number) => {
    const questionToEdit = { ...questions[index] };

    const editableQuestion: EditableQuestion = {
      id: questionToEdit.id,
      type: questionToEdit.type,
      texte: questionToEdit.texte,
      ordre: questionToEdit.ordre,
      points: questionToEdit.points || 10,
      duree: questionToEdit.duree || 60,
      isRequired: (questionToEdit as any).isRequired,
      fichier_image: null,
      fichier_video: null,
      reponses: (questionToEdit.reponses || []).map((rep) => ({
        id: rep.id,
        texte: rep.texte,
        estCorrecte: rep.estCorrecte,
      })),
    };

    if (questionToEdit.reponseAttendue) {
      editableQuestion.reponseAttendue = questionToEdit.reponseAttendue;
    }

    if (questionToEdit.elements) {
      editableQuestion.elements = questionToEdit.elements;
    }

    setCurrentQuestion(editableQuestion);
    setEditingQuestionIndex(index);
    setQuestionSidebarOpen(true);
  };

  const handleCloseQuestionSidebar = () => {
    setQuestionSidebarOpen(false);
    setCurrentQuestion(null);
  };

  const handleSaveQuestion = (questionData: EditableQuestion) => {
    if (!questionData) return;

    const questionToSave = {
      id: questionData.id || generateId(),
      type: questionData.type,
      texte: questionData.texte,
      ordre: questionData.ordre || 0,
      points: questionData.points,
      duree: questionData.duree,
      isRequired: questionData.isRequired === undefined ? true : questionData.isRequired,
      reponses: questionData.reponses.map((reponse) => ({
        id: reponse.id || generateId(),
        texte: reponse.texte,
        estCorrecte: reponse.estCorrecte,
      })),
    } as any;

    if (questionData.reponseAttendue) {
      questionToSave.reponseAttendue = questionData.reponseAttendue;
    }

    if (questionData.elements && questionData.elements.length > 0) {
      questionToSave.elements = questionData.elements.map((element) => ({
        id: element.id || generateId(),
        texte: element.texte || '',
        position: element.position || 0,
        cible: element.cible || '',
      }));
    }

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = questionToSave;
      setValue('questions', updatedQuestions);
    } else {
      const updatedQuestions = [...questions, questionToSave];
      setValue('questions', updatedQuestions);
    }

    setQuestionSidebarOpen(false);
    setCurrentQuestion(null);
  };

  const handleMoveQuestionUp = (index: number) => {
    if (index === 0) return;

    const updatedQuestions = [...questions];

    [updatedQuestions[index - 1], updatedQuestions[index]] = [
      updatedQuestions[index],
      updatedQuestions[index - 1],
    ];

    updatedQuestions.forEach((q, idx) => {
      q.ordre = idx;
    });

    setValue('questions', updatedQuestions);
  };

  const handleMoveQuestionDown = (index: number) => {
    if (index === questions.length - 1) return;

    const updatedQuestions = [...questions];

    [updatedQuestions[index + 1], updatedQuestions[index]] = [
      updatedQuestions[index],
      updatedQuestions[index + 1],
    ];

    updatedQuestions.forEach((q, idx) => {
      q.ordre = idx;
    });

    setValue('questions', updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);

    // Update order for remaining questions
    updatedQuestions.forEach((q, idx) => {
      q.ordre = idx;
    });

    setValue('questions', updatedQuestions);
  };

  // Calcul sécurisé du numéro de question
  const getQuestionNumber = () => {
    if (editingQuestionIndex !== null) {
      return editingQuestionIndex + 1;
    }
    return questions.length + 1;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Questions du Challenge
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={openNewQuestionSidebar}
          sx={{ mb: 3 }}
        >
          Ajouter une Question
        </Button>
      </Grid>

      <Grid item xs={12}>
        {questions.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {questions.map((question, index) => (
              <Paper key={question.id || index} elevation={2} sx={{ mb: 2 }}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleMoveQuestionUp(index)}
                        disabled={index === 0}
                        size="medium"
                        sx={{ color: '#1976D2' }} // Blue color
                      >
                        <FontAwesomeIcon icon={faChevronLeft} rotation={90} fontSize="medium" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleMoveQuestionDown(index)}
                        disabled={index === questions.length - 1}
                        size="medium"
                        sx={{ color: '#388E3C' }} // Green color
                      >
                        <FontAwesomeIcon icon={faChevronLeft} rotation={270} fontSize="medium" />
                      </IconButton>
                      <IconButton
                        onClick={() => openEditQuestionSidebar(index)}
                        size="medium"
                        color="info"
                      >
                        <FontAwesomeIcon icon={faEye} fontSize="medium" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveQuestion(index)}
                        size="medium"
                        color="primary"
                      >
                        <FontAwesomeIcon icon={faTrash} fontSize="medium" />
                      </IconButton>
                    </Stack>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemIcon>
                    <Chip
                      icon={
                        <FontAwesomeIcon
                          icon={
                            QUESTION_TYPE_OPTIONS.find((opt) => opt.value === question.type)
                              ?.icon || faQuestion
                          }
                        />
                      }
                      label={
                        QUESTION_TYPE_OPTIONS.find((opt) => opt.value === question.type)?.label ||
                        'Question'
                      }
                      color="primary"
                      variant="outlined"
                      sx={{ width: '150px' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {question.texte}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" color="text.primary">
                          {question.points} points · {question.duree} sec
                        </Typography>
                        {question.type === QuestionType.QCM && question.reponses && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {question.reponses.length} options,{' '}
                            {question.reponses.filter((rep) => rep.estCorrecte).length} correcte(s)
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: (theme) => alpha('#f5f5f5', 0.5),
              border: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography color="text.secondary">
              Aucune question n&apos;a été ajoutée. Cliquez sur &apos;Ajouter une Question&apos;
              pour commencer.
            </Typography>
          </Paper>
        )}
      </Grid>

      {/* Question creation/edit sidebar */}
      <QuestionSidebar
        open={questionSidebarOpen}
        onClose={handleCloseQuestionSidebar}
        onSave={handleSaveQuestion}
        question={currentQuestion}
        isEditing={editingQuestionIndex !== null}
        questionNumber={getQuestionNumber()}
      />
    </Grid>
  );
};

export default ChallengeFormStep3;
