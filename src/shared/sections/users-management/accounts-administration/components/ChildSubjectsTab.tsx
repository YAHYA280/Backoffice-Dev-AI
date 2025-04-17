import type { IUserItem } from 'src/contexts/types/user';
import type { ISubject } from 'src/contexts/types/common';

import React from 'react';

import PersonIcon from '@mui/icons-material/Person';
import { Box, Card, Grid, Alert, Button, Typography } from '@mui/material';

import { Label } from 'src/shared/components/label';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

interface ChildSubjectsTabProps {
  userParent: IUserItem | null;
  childSubjects: ISubject[];
  values: any;
  openChildSubjectsModal: () => void;
}

const ChildSubjectsTab: React.FC<ChildSubjectsTabProps> = ({
  userParent,
  childSubjects,
  values,
  openChildSubjectsModal,
}) => (
  <Grid container spacing={3}>
    <Grid xs={12} md={6}>
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Matières assignées</Typography>
          <Button variant="outlined" size="small" onClick={openChildSubjectsModal}>
            Gérer les matières
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <ConditionalComponent isValid={childSubjects.length > 0}>
            {childSubjects.map((subject) => (
              <Label key={subject.id} color="primary">
                {subject.name}
              </Label>
            ))}
          </ConditionalComponent>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          Vous pouvez utiliser jusqu&apos;à {values.daily_question_limit || 5} questions par jour.
        </Alert>
      </Card>
    </Grid>

    <Grid xs={12} md={6}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Information parent
        </Typography>

        <ConditionalComponent isValid={!!userParent}>
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <PersonIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="subtitle1">
                  {userParent?.firstName} {userParent?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userParent?.email}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ my: 2, border: '1px solid', borderColor: 'divider' }} />

            <Alert severity="info">
              Votre compte est lié à ce parent qui supervise votre apprentissage.
            </Alert>
          </Box>
        </ConditionalComponent>
      </Card>
    </Grid>
  </Grid>
);

export default ChildSubjectsTab;
