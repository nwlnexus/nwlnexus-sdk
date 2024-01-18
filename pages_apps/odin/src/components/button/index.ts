import { tv } from 'tailwind-variants';

export { default as Button } from './button.svelte';

export const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded font-semibold transition disabled:opacity-50 disabled:pointer-events-none active:translate-y-0.5',
  variants: {
    variant: {
      default: 'bg-magnum-700 text-white hover:bg-magnum-700/75 ',
      ghost:
        'hover:bg-magnum-600/25 data-[active=true]:border-magnum-600 data-[active=true]:bg-magnum-600/25 hover:text-white border-transparent border',
      link: 'underline-offset-4 hover:underline text-primary',
      outline: 'border border-magnum-600/60 hover:bg-magnum-600/20 hover:text-white',
      faded: 'bg-magnum-900/50 text-white hover:bg-magnum-900'
    },
    size: {
      default: 'px-5 h-11 py-3 rounded-md',
      sm: 'h-9 px-3'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});
