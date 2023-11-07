import { Hero, WindowMockup } from 'react-daisyui';

export default function LandingView() {
  return (
    <main className="flex min-h-screen justify-center p-24">
      <Hero className="h-1/2">
        <Hero.Content>
          <WindowMockup
            border
            borderColor="accent"
            frameColor="base-100"
            backgroundColor="base-300"
            className="h-1/2 w-[400px]"
          >
            <div className="flex w-auto justify-center px-4 py-16">Hello!</div>
          </WindowMockup>
        </Hero.Content>
      </Hero>
    </main>
  );
}
