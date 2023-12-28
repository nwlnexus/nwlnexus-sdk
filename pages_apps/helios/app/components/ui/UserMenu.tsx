// noinspection HtmlUnknownTarget

import type { UserProfile } from '@services/auth.server';

import { Avatar, Dropdown } from 'react-daisyui';

export default function UserMenu({ user }: { user: UserProfile }) {
  const letters =
    typeof user.displayName == 'undefined' || user.displayName == ''
      ? 'HU'
      : user.displayName.split(' ')[0].substring(0, 1) + user.displayName.split(' ')[1].substring(0, 1);

  return (
    <>
      <Dropdown hover={true} end={true} className='ml-4 mr-2'>
        <Dropdown.Toggle button={false}>
          <Avatar
            innerClassName='rounded'
            shape='circle'
            size='xs'
            letters={letters}
            border={true}
            borderColor='accent'
          />
        </Dropdown.Toggle>
        <Dropdown.Menu className='mt-4 w-52'></Dropdown.Menu>
      </Dropdown>
    </>
  );
}
