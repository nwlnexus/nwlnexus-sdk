// noinspection HtmlUnknownTarget

import { Form } from '@remix-run/react';
import { Button } from 'react-daisyui';

export default function LoginView() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="inline-flex text-lg font-bold md:text-2xl">
              <span className="lowercase">helios</span>
              <span className="uppercase text-accent">UI</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight">Sign in to your account</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="border border-opacity-50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Form className="space-y-6" action="/auth/auth0" method="POST">
              <Button
                type="submit"
                fullWidth={true}
                startIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Auth0"
                    role="img"
                    viewBox="0 0 512 512"
                    width="24"
                    height="24"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <rect width="512" height="512" rx="15%"></rect>
                      <path
                        d="M358.1 378.8L319.6 260L420.5 186.9H295.7l-38.6-118.7l-.01-.03h124.8l38.6 118.7v-.003l0.03-.02c22.4 68.8-.7 147 -62.4 192zm-201.9 0l-.036 .03L257.13 452.2L358.09 378.84L257.17 305.51ZM93.85 186.85c-23.57 72.57 3.79 149.46 62.36 192l0.01-.036L194.77 260.17L93.89 186.87H218.6L257.15 68.2L257.2 68.2H132.4Z"
                        fill="#eb5424"
                      ></path>
                    </g>
                  </svg>
                }
              >
                Sign with Auth0
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
