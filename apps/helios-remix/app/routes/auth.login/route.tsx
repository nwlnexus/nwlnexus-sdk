// noinspection HtmlUnknownTarget

import { Form } from 'react-daisyui';

export default function LoginView() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div>
            <div className="inline-flex text-lg font-bold md:text-2xl">
              <span className="lowercase">helios</span>
              <span className="uppercase text-accent">UI</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Form className="space-y-6" action="/auth/auth0" method="POST"></Form>
          </div>
        </div>
      </div>
    </>
  );
}
