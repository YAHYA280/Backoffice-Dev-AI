import type { IAIAssistantItem, AIAssistantFilteringProps } from 'src/types/ai-assistant';

import { useMemo, useState, useEffect } from 'react';
// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faCopy,
  faClock,
  faRobot,
  faBookOpen,
  faClipboard,
  faGraduationCap,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

// Material UI imports
import {
  Box,
  Chip,
  Fade,
  Alert,
  Paper,
  alpha,
  Divider,
  Tooltip,
  Skeleton,
  useTheme,
  Typography
} from '@mui/material';

import DefaultValue from 'src/shared/components/DefaultValue';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';
/**
 * LabelValuePair component with styling and Font Awesome icons
 */
type LabelValuePairProps = {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
  fullWidth?: boolean;
  icon?: any; // Font Awesome icon
  copyable?: boolean;
};

function LabelValuePair({
  label,
  value,
  multiline = false,
  fullWidth = false,
  icon = null,
  copyable = false
}: LabelValuePairProps) {
  const theme = useTheme();

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value)
        .then(() => {})
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        '&:hover': copyable && value ? {
          '& .copy-icon': {
            opacity: 1,
          }
        } : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, gap: 1 }}>
        {/* Utilisation de FontAwesomeIcon pour l'icône */}
          <ConditionalComponent isValid={Boolean(icon) }>
            <Box sx={{ color: theme.palette.primary.main, width: 20, textAlign: 'center' }}>
              <FontAwesomeIcon icon={icon} size="sm" />
            </Box>
          </ConditionalComponent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            letterSpacing: 0.2,
            textTransform: 'uppercase',
            fontSize: '0.75rem'
          }}
        >
          {label}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          pl: icon ? 4 : 0,
        }}
      >
        {/* Utilisation de DefaultValue au lieu du Typography directement */}
        {multiline ? (
          <DefaultValue
            value={value}
            defaultText="-"
            variant="subtle"
            showIcon={false}
            sx={{
              fontWeight: 'normal',
              lineHeight: 1.8,
              overflow: 'auto',
              textOverflow: 'clip',
              whiteSpace: 'pre-wrap',
              maxHeight: '200px',
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.light, 0.05),
              borderLeft: `4px solid ${theme.palette.primary.light}`,
            }}
          />
        ) : (
          <DefaultValue
            value={value}
            defaultText="-"
            variant="dash"
            showIcon={false}
            sx={{
              fontWeight: 'medium',
              lineHeight: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          />
        )}

        <ConditionalComponent  isValid={Boolean(copyable && value) }>
          <Tooltip title="Copier">
            <Box
              className="copy-icon"
              onClick={handleCopy}
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                opacity: 0,
                cursor: 'pointer',
                color: theme.palette.primary.main,
                transition: 'opacity 0.2s ease',
              }}
            >
              <FontAwesomeIcon icon={faCopy} size="sm" />
            </Box>
          </Tooltip>
        </ConditionalComponent>
      </Box>
    </Box>
  );
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: string }) {
  const theme = useTheme();
  const isActive = status === 'active';

  return (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      size="small"
      sx={{
        bgcolor: isActive ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
        color: isActive ? theme.palette.success.dark : theme.palette.error.dark,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 24,
        '& .MuiChip-label': {
          px: 2,
        },
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: 8,
          height: 8,
          mr: 1,
          borderRadius: '50%',
          bgcolor: isActive ? theme.palette.success.main : theme.palette.error.main,
          animation: isActive ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0.7)}`,
            },
            '70%': {
              boxShadow: `0 0 0 6px ${alpha(theme.palette.success.main, 0)}`,
            },
            '100%': {
              boxShadow: `0 0 0 0 ${alpha(theme.palette.success.main, 0)}`,
            },
          },
        }
      }}
    />
  );
}

/**
 * Main component for displaying AI Assistant details
 */
export default function AIAssistantDescription({ assistantId }: AIAssistantFilteringProps) {
  const theme = useTheme();
  const [assistant, setAssistant] = useState<IAIAssistantItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assistantId) {
      setError("Aucun assistant sélectionné.");
      setLoading(false);
      return () => {}; // Return an empty cleanup function
    }

    // Simulate network request
    const timer = setTimeout(() => {
      try {
        setLoading(true);
        const storedAssistants = JSON.parse(localStorage.getItem('assistants') || '[]');
        const data = storedAssistants.find((item: IAIAssistantItem) => item.id === assistantId);
        if (!data) {
          throw new Error("L'assistant sélectionné n'existe pas.");
        }
        setAssistant(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [assistantId]);

  // Format date for display
  const formattedDate = useMemo(() => {
    if (!assistant?.lastUpdated) return '';

    const date = typeof assistant.lastUpdated === 'string'
      ? new Date(assistant.lastUpdated)
      : assistant.lastUpdated;

    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }, [assistant?.lastUpdated]);

  if (loading) {
    return (
      <Fade in={loading} timeout={300}>
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 1, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" width="40%" height={40} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="rounded" width={60} height={24} />
            </Box>
          </Box>
          <Divider />
          <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              {[1, 2, 3].map(i => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" />
                </Box>
              ))}
            </Box>
            <Box>
              {[1, 2, 3].map(i => (
                <Box key={i} sx={{ mb: 3 }}>
                  <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" />
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={100} />
          </Box>
        </Box>
      </Fade>
    );
  }

  if (error) {
    return (
      <Fade in timeout={300}>
        <Alert
          severity="error"
          sx={{
            boxShadow: 2,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {error}
        </Alert>
      </Fade>
    );
  }

  if (!assistant) {
    return (
      <Fade in>
        <Alert
          severity="warning"
          sx={{
            boxShadow: 2,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          Aucune donnée disponible pour cet assistant.
        </Alert>
      </Fade>
    );
  }

  return (
    <Fade in>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <Box sx={{ pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {assistant.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StatusBadge status={assistant.status} />
          </Box>
        </Box>

        <Divider sx={{
          '&::before, &::after': {
            borderColor: alpha(theme.palette.primary.main, 0.2),
          }
        }} />

        {/* Information section with Font Awesome icons */}
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            {/* Utilisation standard avec LabelValuePair */}
            <LabelValuePair
              label="Type d'assistant"
              value={assistant.type}
              icon={faRobot}
            />
            
            {/* Pour le sujet, utilisation directe de DefaultValue avec validation personnalisée */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, gap: 1 }}>
                <Box sx={{ color: theme.palette.primary.main, width: 20, textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faBook} size="sm" />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 500,
                    letterSpacing: 0.2,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem'
                  }}
                >
                  Matière
                </Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <DefaultValue 
                  value={assistant.subject}
                  defaultText="Aucune matière spécifiée"
                  variant="alert"
                  showIcon
                  validator={(val) => typeof val === 'string' && val.length > 0}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            <LabelValuePair
              label="Niveau scolaire"
              value={assistant.educationLevel}
              icon={faGraduationCap}
            />
          </Box>
          <Box>
            <LabelValuePair
              label="Chapitre"
              value={assistant.chapter}
              icon={faBookOpen}
            />
            <LabelValuePair
              label="Exercice"
              value={assistant.exercise}
              icon={faClipboard}
            />
            <LabelValuePair
              label="Dernière modification"
              value={formattedDate}
              icon={faClock}
            />
          </Box>
        </Box>

        {/* Description section with enhanced styling */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <LabelValuePair
            label="Description"
            value={assistant.description}
            multiline
            fullWidth
            icon={faClipboardList}
            copyable
          />
        </Box>
      </Paper>
    </Fade>
  );
}