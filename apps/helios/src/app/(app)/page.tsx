import { Hero, WindowMockup } from 'react-daisyui';

export default function LandingView() {
  return (
    <main className="flex min-h-screen justify-center p-24">
      <div className="flex min-h-[550vh] max-w-[100vw] flex-col items-center justify-start xl:flex-row xl:items-start xl:justify-between">
        <div className="shrink xl:w-1/2">
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-2 py-10 text-center xl:justify-start xl:pl-10 xl:pr-0 xl:text-left">
            <div>
              <h1 className="font-title text-center text-[clamp(2rem,6vw,4.2rem)] font-black leading-[1.1] xl:text-left">
                The system administration application.
              </h1>
            </div>
          </div>
        </div>
        <div className="invisible sticky bottom-4 flex w-[calc(100%-2rem)] shrink duration-700 xl:visible xl:-right-32 xl:bottom-auto xl:top-16 xl:w-auto xl:!transform-none xl:overflow-hidden xl:overflow-y-clip xl:bg-transparent xl:pb-16 xl:pt-16">
          <WindowMockup
            border
            borderColor="accent"
            frameColor="base-100"
            backgroundColor="base-300"
            className="h-1/2 w-full bg-base-200/90 backdrop-blur"
          >
            <div className="flex w-auto justify-center px-4 py-16">Hello!</div>
          </WindowMockup>
        </div>
      </div>
    </main>
  );
}
