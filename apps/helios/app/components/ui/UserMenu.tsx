import { Avatar, Dropdown } from 'react-daisyui';
import type { UserProfile } from '~/services/auth.server';

export default function UserMenu({ user }: { user: UserProfile }) {
  const letters = user.profile._json;
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle>
          <Avatar innerClassName="rounded" shape="circle" size="xs" letters={'HU'} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
