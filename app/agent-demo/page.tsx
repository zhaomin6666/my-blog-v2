import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { AgentDemoPageClient } from './AgentDemoPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'AI Agent Demo',
  description:
    'A read-only AI Agent Demo that answers from public Personal Developer OS content with trace and source visibility.',
  path: '/agent-demo',
});

export default function AgentDemoRoute() {
  return <AgentDemoPageClient />;
}
