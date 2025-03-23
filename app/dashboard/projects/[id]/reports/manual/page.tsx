import { Metadata } from 'next';
import Manual from './manual';

export const metadata: Metadata = {
  title: 'Manual report | Wicked Green Web',
};

export default async function ManualReportPage({ params }: { params: Promise<{ id: string }> }) {
  return <Manual params={params} />;
}
