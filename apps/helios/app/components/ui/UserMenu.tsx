// noinspection HtmlUnknownTarget

import { Form } from '@remix-run/react';
import { Avatar, Button, Dropdown } from 'react-daisyui';
import type { UserProfile } from '~/services/auth.server';

export default function UserMenu({ user }: { user: UserProfile }) {
  const letters =
    typeof user.profile.displayName == 'undefined'
      ? 'HU'
      : user.profile.displayName.split(' ')[0].substring(0, 1) + user.profile.displayName.split(' ')[1].substring(0, 1);

  return (
    <>
      <Dropdown hover={true} end={true} className="ml-4 mr-2">
        <Dropdown.Toggle button={false}>
          <Avatar
            innerClassName="rounded"
            shape="circle"
            size="xs"
            letters={letters}
            border={true}
            borderColor="accent"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-52">
          <Dropdown.Item>
            <Form action="/auth/logout" method="POST">
              <Button type="submit" fullWidth={true} color="neutral" variant="outline">
                Logout
              </Button>
            </Form>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
