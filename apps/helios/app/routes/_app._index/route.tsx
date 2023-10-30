import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'OLYMPUS Dev' }, { name: 'description', content: 'Welcome to OLYMPUS Dev!' }];
};

export default function Index() {
  return <></>;
}
