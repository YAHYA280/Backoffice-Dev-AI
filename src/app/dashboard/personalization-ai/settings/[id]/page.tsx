"use client";

// Directive to indicate a client component
import { useParams } from 'next/navigation';

import AIAssistantSettings from 'src/shared/sections/ai/assistants-management/ai-assistant-settings';

export default function AssistantSettingsPage() {
  const params = useParams();
  const assistantId = params.id as string;
  
  return <AIAssistantSettings assistantId={assistantId} />;
}