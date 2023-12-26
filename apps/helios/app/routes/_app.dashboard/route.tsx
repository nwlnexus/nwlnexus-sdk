import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'HELIOS | Dashboard' }, { description: 'Helios management app.' }];
};
export default function DashboardView() {
  return <></>;
}
