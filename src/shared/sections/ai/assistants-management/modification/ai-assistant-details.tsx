// personalization-ai/ai-assistant-details.tsx
import type { IAIAssistantItem } from 'src/types/ai-assistant';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash , faXmark , faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/shared/theme/styles';

import { Label } from 'src/shared/components/label';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';

  
// ----------------------------------------------------------------------

type Props = {
  item: IAIAssistantItem;
  open: boolean;
  onClose: VoidFunction;
  onDelete: VoidFunction;
  onEdit: VoidFunction;
};

export function AIAssistantDetails({ item, open, onClose, onDelete, onEdit }: Props) {
  const theme = useTheme();
  const confirm = useBoolean();
  const [currentTab, setCurrentTab] = useState('details');

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const { name, educationLevel, type, subject, chapter, exercise, status } = item;

  const renderContent = (
    <Stack
      spacing={3}
      sx={{
        p: (themeParam) => themeParam.spacing(2, 2.5),
        bgcolor: (themeParam) => varAlpha(themeParam.vars.palette.grey['500Channel'], 0.08),
        borderLeft: `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="subtitle2"> Détails </Typography>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Nom
            </Box>
            {name}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Type
            </Box>
            {type}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Niveau
            </Box>
            {educationLevel}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Matière
            </Box>
            {subject}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Chapitre
            </Box>
            {chapter}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Exercice
            </Box>
            {exercise}
          </Stack>

          <Stack direction="row" sx={{ typography: 'caption' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Statut
            </Box>
            <Label
              variant="soft"
              color={(status === 'active' && 'success') || 'error'}
              sx={{ textTransform: 'capitalize' }}
            >
              {status === 'active' ? 'Actif' : 'Inactif'}
            </Label>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
      >
        <DialogTitle sx={{ p: (themeParam) => themeParam.spacing(3, 3, 2, 3) }}>
          Détails de l&apos;assistant IA
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 3,
              boxShadow: (themeParam) => `inset 0 -2px 0 0 ${varAlpha(themeParam.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            <Tab value="details" label="Détails" />
            <Tab value="activity" label="Activité" />
          </Tabs>

          <Scrollbar sx={{ maxHeight: 400 }}>
            {currentTab === 'details' && renderContent}
            {currentTab === 'activity' && (
              <Stack sx={{ p: 3, typography: 'body2' }}>
                Historique des activités non disponible pour le moment.
              </Stack>
            )}
          </Scrollbar>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faXmark} />}
            onClick={onClose}
          >
            Fermer
          </Button>
          

          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button
              color="error"
              variant="soft"
              startIcon={<FontAwesomeIcon icon={faTrash} />}
              onClick={confirm.onTrue}
              sx={{ mr: 1 }}
            >
              Supprimer
            </Button>

            <Button
              variant="soft"
              color="info"
              startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
              onClick={onEdit}
            >
              Modifier
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer cet assistant IA ?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}