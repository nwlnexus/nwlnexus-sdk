import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'HELIOS | Nodes' }, { description: 'Helios node management app.' }];
};
export default function NodesView() {
  return <></>;
}
