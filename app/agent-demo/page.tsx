import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';
import { AgentDemoPageClient } from './AgentDemoPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await siteConfigService.getSiteConfig();

  return buildMetadata({
    title: 'AI Agent Demo',
    description:
      'A read-only AI Agent Demo that answers from public site content with trace and source visibility.',
    path: '/agent-demo',
  }, siteConfig);
}

export default function AgentDemoRoute() {
  return <AgentDemoPageClient />;
}
