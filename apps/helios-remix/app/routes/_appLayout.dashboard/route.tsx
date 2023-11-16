import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'HELIOS | Dashbord' }, { description: 'Helios node management app.' }];
};

export default function DashboardView() {
  return <></>;
}
