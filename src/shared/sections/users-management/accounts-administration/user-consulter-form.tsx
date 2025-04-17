'use client';

import type { PurchasedSubscription } from 'src/contexts/types/abonnement';
import type { ChildUser, IUserItem, ParentUser } from 'src/contexts/types/user';
import type { Upgrade, ISubject, GlobalUpgrade } from 'src/contexts/types/common';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import KeyIcon from '@mui/icons-material/Key';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { _cin, _listUsers, abonnementItems } from 'src/shared/_mock';

import { toast } from 'src/shared/components/snackbar';

import TabPanel from './components/TabPanel';
import SecurityTab from './components/SecurityTab';
import SubscriptionTab from './components/SubscriptionTab';
import PersonalInfoTab from './components/PersonalInfoTab';
import { SubjectsModal } from './components/SubjectsModal';

// Schéma pour la réinitialisation du mot de passe
export const PasswordResetSchema = zod
  .object({
    password: zod
      .string()
      .min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
    confirmPassword: zod.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type PasswordResetSchemaType = zod.infer<typeof PasswordResetSchema>;

// Schémas de validation pour les informations utilisateur
export const UserManagementSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email est requis!' })
    .email({ message: 'Email doit être une adresse valide!' }),
  phoneNumber: zod.string().min(1, { message: 'Numéro de téléphone est requis!' }),
  birthDate: zod.string().min(1, { message: 'La date de naissance est requise.' }),
  address: zod.string().min(1, { message: 'Adresse est requise!' }),
  country: zod.string().min(1, { message: 'Pays est requis!' }),
  company: zod.string().min(1, { message: 'Company is required!' }),
  state: zod.string().min(1, { message: 'Région est requise!' }),
  city: zod.string().min(1, { message: 'Ville est requise!' }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  zipCode: zod.string().min(1, { message: 'Code postal est requis!' }),
  status: zod.string(),
  isVerified: zod.boolean(),
  parentId: zod.string().optional(),
  daily_question_limit: zod.number().optional(),
});

export type UserManagementSchemaType = zod.infer<typeof UserManagementSchema>;

// Données simulées pour les matières disponibles
const AVAILABLE_SUBJECTS: ISubject[] = [
  { id: 'subj1', name: 'Mathématiques', isSelected: false },
  { id: 'subj2', name: 'Français', isSelected: false },
  { id: 'subj3', name: 'Physique-Chimie', isSelected: false },
  { id: 'subj4', name: 'SVT', isSelected: false },
  { id: 'subj5', name: 'Histoire-Géographie', isSelected: false },
  { id: 'subj6', name: 'Anglais', isSelected: false },
  { id: 'subj7', name: 'Informatique', isSelected: false },
  { id: 'subj8', name: 'Français B1', isSelected: false },
];

// Composant principal
type Props = {
  currentUser?: IUserItem;
};

export function UserConsulterForm({ currentUser }: Props) {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  // Gestion des matières
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);
  const [subjectsDialogOpen, setSubjectsDialogOpen] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<ISubject[]>([]);

  const [selectedParentId, setSelectedParentId] = useState<string>('');

  // Initialisation des données de l'utilisateur
  const mockChildren =
    currentUser?.role === 'Parent' ? (currentUser as ParentUser).children || [] : [];
  const [children, setChildren] = useState<ChildUser[]>(mockChildren);
  const [subscription, setSubscription] = useState<PurchasedSubscription>(
    currentUser?.role === 'Parent'
      ? (currentUser as ParentUser).subscription
      : (abonnementItems[0] as PurchasedSubscription)
  );

  // Si l'utilisateur est un enfant, récupérer son parent
  const userParent =
    currentUser?.role === 'Enfant' && currentUser.parentId
      ? (_listUsers.find((user) => user.id === currentUser.parentId) as ParentUser | undefined)
      : null;

  // Convertir les matières de l'enfant en format attendu par le composant
  const childSubjects = useMemo(() => {
    if (currentUser?.role === 'Enfant') {
      const childUser = currentUser as ChildUser;
      if (childUser.subjects) {
        return childUser.subjects.map((subject) => ({
          ...subject,
          isSelected: true,
        }));
      }
    }
    return [];
  }, [currentUser]);

  // Calculer la liste complète des matières disponibles
  const fullSubjectsList = useMemo(() => {
    if (currentUser?.role === 'Enfant') {
      const selectedSubjects = childSubjects;
      const selectedIds = selectedSubjects.map((s) => s.id);
      return [
        ...selectedSubjects,
        ...AVAILABLE_SUBJECTS.filter((s) => !selectedIds.includes(s.id)),
      ];
    }
    return AVAILABLE_SUBJECTS;
  }, [currentUser, childSubjects]);

  // Calcul des totaux pour l'abonnement
  const totalSubjectsSelected = children.reduce(
    (sum, child) => sum + child.subjects.filter((s) => s.isSelected).length,
    0
  );

  const remainingSubjectsToAllocate = subscription.nbr_subjects - totalSubjectsSelected;
  const currentChild = children.find((child) => child.id === currentChildId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const existingCIN = _cin.length > 0 ? _cin[0] : null;
  const defaultValues = useMemo(() => {
    // Start with common properties
    const values = {
      status: currentUser?.status || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      birthDate: currentUser?.birthDate != null ? String(currentUser.birthDate) : '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
      zipCode: currentUser?.zipCode || '',
      role: currentUser?.role || '',
      company: currentUser?.company || '',
      parentId: '',
      daily_question_limit: subscription.daily_question_limit || 5,
      isVerified: currentUser?.isVerified || false,
    };

    // Add child-specific properties if applicable
    if (currentUser?.role === 'Enfant') {
      const childUser = currentUser as ChildUser;
      values.parentId = childUser.parentId || '';
      values.daily_question_limit =
        childUser.daily_question_limit || subscription.daily_question_limit || 5;
    }

    return values;
  }, [currentUser, subscription]);

  const methods = useForm<UserManagementSchemaType>({
    mode: 'onSubmit',
    defaultValues,
  });

  const { watch, reset } = methods;
  const values = watch();

  const handleEdit = () => {
    setIsEditing(true);
    if (currentUser?.role === 'Enfant' && currentUser.parentId) {
      setSelectedParentId(currentUser.parentId);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(defaultValues);
    if (currentUser?.role === 'Enfant' && currentUser.parentId) {
      setSelectedParentId(currentUser.parentId);
    }
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      // Ici, vous devez ajouter le code pour envoyer le nouveau mot de passe au serveur
      console.log('Réinitialisation du mot de passe avec:', newPassword);
      setOpenPasswordDialog(false);
      toast.success('Le mot de passe a été réinitialisé avec succès');
      return await Promise.resolve();
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Erreur lors de la réinitialisation du mot de passe');
      return Promise.reject(error);
    }
  };

  // Ouvrir le modal pour gérer les matières d'un enfant
  const openSubjectsModal = useCallback(
    (childId: string) => {
      const child = children.find((c) => c.id === childId);
      if (!child) return;

      // Initialiser les matières disponibles avec celles déjà sélectionnées par l'enfant
      const modalChildSubjects =
        child.subjects.length > 0
          ? [...child.subjects]
          : fullSubjectsList.map((s) => ({ ...s, isSelected: false }));

      setAvailableSubjects(modalChildSubjects);
      setCurrentChildId(childId);
      setSubjectsDialogOpen(true);
    },
    [children, fullSubjectsList]
  );

  // Pour un enfant spécifique
  const openChildSubjectsModal = useCallback(() => {
    if (currentUser?.role !== 'Enfant') return;

    setAvailableSubjects(fullSubjectsList);
    setSubjectsDialogOpen(true);
  }, [currentUser, fullSubjectsList]);

  // Basculer la sélection d'une matière
  const toggleSubject = useCallback(
    (subjectId: string) => {
      if (!currentChild && currentUser?.role !== 'Enfant') return;

      setAvailableSubjects((currentSubjects) => {
        const subject = currentSubjects.find((s) => s.id === subjectId);
        if (!subject) return currentSubjects;

        // Si la matière est déjà sélectionnée, on peut toujours la désélectionner
        if (subject.isSelected) {
          return currentSubjects.map((s) => (s.id === subjectId ? { ...s, isSelected: false } : s));
        }

        // Si c'est un enfant directement sélectionné
        if (currentUser?.role === 'Enfant') {
          // Vérifier le nombre de matières déjà sélectionnées
          const selectedCount = currentSubjects.filter((s) => s.isSelected).length;

          if (selectedCount >= (currentUser.daily_question_limit || 5)) {
            toast.success(
              `Cet enfant ne peut pas sélectionner plus de ${currentUser.daily_question_limit || 5} matières.`
            );
            return currentSubjects;
          }

          return currentSubjects.map((s) => (s.id === subjectId ? { ...s, isSelected: true } : s));
        }

        // Pour un enfant dans le contexte d'un parent
        if (currentChild) {
          // Calculer combien de matières sont déjà sélectionnées par tous les enfants
          const currentChildSelectedCount = currentSubjects.filter((s) => s.isSelected).length;

          // Calcul du nombre de matières sélectionnées par les autres enfants
          const otherChildrenSelectedCount = children.reduce(
            (sum, child) =>
              child.id !== currentChildId
                ? sum + child.subjects.filter((s) => s.isSelected).length
                : sum,
            0
          );

          // Vérifier si l'ajout de cette matière dépasserait la limite de l'abonnement
          if (
            otherChildrenSelectedCount + currentChildSelectedCount + 1 >
            subscription.nbr_subjects
          ) {
            toast.success(
              `L'abonnement permet un maximum de ${subscription.nbr_subjects} matières au total. Vous ne pouvez pas en ajouter davantage.`
            );
            return currentSubjects;
          }

          return currentSubjects.map((s) => (s.id === subjectId ? { ...s, isSelected: true } : s));
        }

        return currentSubjects;
      });
    },
    [currentChild, currentChildId, children, subscription.nbr_subjects, currentUser]
  );

  // Sauvegarder les matières sélectionnées pour l'enfant actuel
  const saveSubjectsChanges = useCallback(() => {
    if (currentUser?.role === 'Enfant') {
      // Stocker pour l'enfant directement
      console.log(
        "Matières sauvegardées pour l'enfant:",
        availableSubjects.filter((s) => s.isSelected)
      );
      toast.success(`Les matières ont été assignées avec succès.`);
      setSubjectsDialogOpen(false);
      return;
    }

    if (!currentChild) return;

    setChildren((currentChildren) =>
      currentChildren.map((child) => {
        if (child.id === currentChildId) {
          return {
            ...child,
            subjects: availableSubjects,
          };
        }
        return child;
      })
    );

    toast.success(`Les matières de ${currentChild.firstName} ont été assignées avec succès.`);
    setSubjectsDialogOpen(false);
  }, [currentChild, currentChildId, availableSubjects, currentUser]);

  // Appliquer l'upgrade (appelé depuis SubscriptionTab)
  const applyUpgrade = useCallback(
    (upgrade: Upgrade) => {
      if (!upgrade.type) return;

      if ('childId' in upgrade && upgrade.type === 'questions') {
        // Upgrade spécifique à un enfant (questions)
        setChildren((currentChildren) =>
          currentChildren.map((child) => {
            if (child.id === upgrade.childId) {
              return {
                ...child,
                daily_question_limit:
                  (child.daily_question_limit || subscription.daily_question_limit) +
                  upgrade.additional_questions,
              };
            }
            return child;
          })
        );

        const targetChild = children.find((c) => c.id === upgrade.childId);
        toast.success(
          `Mise à niveau réussie pour ${targetChild?.firstName}: ${upgrade.additional_questions} question(s) quotidienne(s) supplémentaire(s)`
        );
      } else if (upgrade.type === 'subjects' && 'additional_subjects' in upgrade) {
        const globalUpgrade = upgrade as GlobalUpgrade;

        setSubscription((prev) => ({
          ...prev,
          nbr_subjects: prev.nbr_subjects + globalUpgrade.additional_subjects,
        }));

        toast.success(
          `Mise à niveau réussie: ${globalUpgrade.additional_subjects} matière(s) supplémentaire(s) (${globalUpgrade.interval})`
        );
      }

      console.log('Upgrade appliqué:', upgrade);
    },
    [children, subscription]
  );

  const avatarSrc = currentUser?.avatarUrl || undefined;

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="user management tabs"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab icon={<PersonIcon />} label="Informations personnelles" />
        {values.role === 'Parent' && <Tab icon={<BookIcon />} label="Abonnement et matières" />}
        {values.role === 'Enfant' && <Tab icon={<BookIcon />} label="Matières" />}
        <Tab icon={<KeyIcon />} label="Sécurité du compte" />
      </Tabs>

      {/* Informations Personnelles */}
      <TabPanel value={tabValue} index={0}>
        <PersonalInfoTab
          currentUser={currentUser}
          methods={methods}
          values={values}
          isEditing={isEditing}
          existingCIN={existingCIN}
          avatarSrc={avatarSrc}
          handleEdit={handleEdit}
          setIsEditing={setIsEditing}
          handleCancel={handleCancel}
          userParent={userParent}
        />
      </TabPanel>

      {/* Tab pour Abonnement et Matières (Parent) */}
      {values.role === 'Parent' && (
        <TabPanel value={tabValue} index={1}>
          <SubscriptionTab
            subscription={subscription}
            children={children}
            totalSubjectsSelected={totalSubjectsSelected}
            remainingSubjectsToAllocate={remainingSubjectsToAllocate}
            openSubjectsModal={openSubjectsModal}
            applyUpgrade={applyUpgrade}
          />
        </TabPanel>
      )}

      {/* Tab pour Matières et Parent (Enfant) */}
      {values.role === 'Enfant' && (
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {/* Section Matières */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <BookIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Matières assignées
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Affichage des matières */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {childSubjects.length > 0 ? (
                    childSubjects.map((subject) => (
                      <Grid item xs={12} sm={6} md={4} key={subject.id}>
                        <Card
                          sx={{
                            p: 2,
                            bgcolor: 'primary.lighter',
                            border: '1px solid',
                            borderColor: 'primary.main',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="subtitle2">{subject.name}</Typography>
                            <CheckCircleIcon color="primary" />
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        Aucune matière n&apos;est actuellement assignée à cet enfant.
                      </Alert>
                    </Grid>
                  )}
                </Grid>

                {/* Limite quotidienne */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Limite quotidienne: {values.daily_question_limit || 5} questions par jour
                </Typography>

                {/* Boutons d'action */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'end' }}>
                  <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={openChildSubjectsModal}
                  >
                    Modifier les matières
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      )}

      {/* Tab pour Sécurité du compte */}
      <TabPanel
        value={tabValue}
        index={values.role === 'Parent' || values.role === 'Enfant' ? 2 : 1}
      >
        <SecurityTab currentUser={currentUser} handleResetPassword={handleResetPassword} />
      </TabPanel>

      {/* Modal pour la gestion des matières */}
      <SubjectsModal
        open={subjectsDialogOpen}
        onClose={() => setSubjectsDialogOpen(false)}
        subjects={availableSubjects}
        onToggleSubject={toggleSubject}
        onSave={saveSubjectsChanges}
      />
    </>
  );
}
