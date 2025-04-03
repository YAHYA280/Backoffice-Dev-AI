import { CONFIG } from 'src/config-global';

import { PersonalizationAiView } from "src/shared/sections/ai/assistants-management/view";

export const metadata = { title: `Personnalisation IA - ${CONFIG.site.name}` };

// Assurez-vous d'avoir cette exportation par défaut
export default function Page() {
  return <PersonalizationAiView />;
}
