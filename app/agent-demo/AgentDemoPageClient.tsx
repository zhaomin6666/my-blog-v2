'use client';

import { AgentDemoPage } from '@/components/agent-demo';
import { ProjectLayout } from '@/components/projects';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

export function AgentDemoPageClient() {
  const { stylePreset, lang } = useSettings();

  return (
    <ProjectLayout backHref="/projects/ai-agent-demo" backLabel={t('agentDemo.backToProject', lang)}>
      <AgentDemoPage stylePreset={stylePreset} lang={lang} />
    </ProjectLayout>
  );
}
