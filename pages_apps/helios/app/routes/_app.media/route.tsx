import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'HELIOS | Media' }, { description: 'Helios media management app.' }];
};
export default function MediaView() {
  return <></>;
}
