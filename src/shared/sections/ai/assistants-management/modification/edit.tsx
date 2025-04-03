import { useRouter } from 'next/router';

import AIAssistantEdit from 'src/shared/sections/ai/assistants-management/modification/ai-assistant-edit';

export default function EditAssistantPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return <p>Chargement...</p>;
  }

  return <AIAssistantEdit assistantId={id} />;
}
