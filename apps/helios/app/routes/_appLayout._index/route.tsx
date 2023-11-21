import { Checkbox, Radio, Tabs, Toggle, WindowMockup } from 'react-daisyui';
import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'OLYMPUS | Helios' }, { description: 'Helios system management application.' }];
};

export default function LandingView() {
  return (
    <main>
      <div className="flex min-h-[550vh] max-w-[100vw] flex-col items-center justify-start xl:flex-row xl:items-start xl:justify-between">
        <div className="shrink xl:w-1/2">
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-2 py-10 text-center xl:justify-start xl:pl-10 xl:pr-0 xl:text-left">
            <div>
              <h1 className="font-title text-center text-[clamp(2rem,6vw,4.2rem)] font-black leading-[1.1] xl:text-left [:root[dir=rtl]_&]:leading-[1.35]">
                <span className="brightness-150 contrast-150 [&::selection]:bg-blue-700/20 [&::selection]:text-base-content">
                  The
                </span>
                <br />
                <span className="inline-grid">
                  <span
                    className="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-2xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                    aria-hidden={true}
                  >
                    system administration
                  </span>
                  <span className="relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [&::selection]:text-base-content [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                    system administration
                  </span>
                </span>
                <br />
                <span className="brightness-150 contrast-150 [&::selection]:bg-blue-700/20 [&::selection]:text-base-content">
                  application.
                </span>
              </h1>
            </div>
          </div>
        </div>
        <div className="invisible sticky bottom-4 flex w-[calc(100%-2rem)] shrink duration-700 xl:visible xl:-right-32 xl:bottom-auto xl:top-16 xl:w-auto xl:!transform-none xl:overflow-x-hidden xl:overflow-y-clip xl:bg-transparent xl:pb-16 xl:pt-16">
          <WindowMockup className="mx-auto origin-top overflow-visible bg-base-200/90 pb-4 backdrop-blur will-change-auto [transform:rotateX(20deg)rotateZ(-20deg)skewY(8deg)scale(1)] max-[1280px]:![transform:translate3d(0,0,0)] xl:-right-20 xl:-mr-10 xl:h-[32rem] xl:w-[50rem] xl:rounded-r-none xl:bg-base-200 xl:pr-4 xl:shadow-[-0.05rem_0.1rem_0rem_#00000014] xl:backdrop-blur-0">
            <div className="grid">
              <div className="invisible z-[1] col-start-1 row-start-1 grid overflow-y-hidden overflow-x-scroll [scrollbar-width:none] xl:visible xl:overflow-x-visible xl:overflow-y-visible [&::-webkit-scrollbar]:hidden">
                <div className="col-start-1 row-start-1 mx-6 flex items-end gap-6 xl:mx-0 xl:items-start xl:gap-0">
                  <div className="flex gap-6 xl:w-60 xl:flex-col xl:gap-0">
                    <div
                      className="relative z-[1] w-80 will-change-auto motion-reduce:!transform-none max-[1280px]:![transform:translate3d(0,0,0)] xl:-left-6 xl:w-auto xl:[filter:drop-shadow(-1rem_3rem_1rem_#00000012)]"
                      style={{ transform: 'translate(0px,0px)' }}
                    >
                      <Tabs size="xs" variant="lifted" value={0}>
                        <Tabs.Tab value={0} className="text-xs">
                          Features
                        </Tabs.Tab>
                        <Tabs.Tab value={1} className="text-xs">
                          Links
                        </Tabs.Tab>
                        <Tabs.Tab value={2} className="text-xs">
                          Message
                        </Tabs.Tab>
                      </Tabs>
                      <div className="h-60 shrink-0 rounded-b-box rounded-tr-box bg-base-100">
                        <div className="flex flex-col items-stretch p-6">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text text-xs">Faster development</span>
                              <Toggle name="toggle" color="primary" size="sm" defaultChecked={true} />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text text-xs">Cleaner HTML</span>
                              <Toggle name="toggle" color="secondary" size="sm" defaultChecked={true} />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text text-xs">Customizable</span>
                              <Toggle name="toggle" color="accent" size="sm" defaultChecked={true} />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text text-xs">Themeable</span>
                              <Toggle name="toggle" color="success" size="sm" defaultChecked={true} />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text text-xs">Pure CSS</span>
                              <Toggle name="toggle" size="sm" defaultChecked={true} />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-60 flex-col justify-end gap-4 xl:w-auto xl:justify-normal xl:p-6">
                      <div
                        className="alert border border-base-300 will-change-auto motion-reduce:!transform-none motion-reduce:!shadow-none max-[1280px]:![transform:translate3d(0,0,0)]"
                        style={{ boxShadow: '0rem 0rem 0rem #00000012', transform: 'translate(0px,0px)' }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5 shrink-0"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75zm4.196 5.954a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-xs">
                          Pure CSS. <br />
                          No JS dependency
                        </span>
                      </div>
                      <div
                        className="alert border border-base-300 will-change-auto motion-reduce:!transform-none motion-reduce:!shadow-none max-[1280px]:![transform:translate3d(0,0,0)]"
                        style={{ boxShadow: '0rem 0rem 0rem #00000012', transform: 'translate(0px,0px)' }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5 shrink-0"
                        >
                          <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z"></path>
                        </svg>
                        <span className="text-xs">Works on all frameworks</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-6 pr-4 xl:flex-col xl:pr-0">
                    <div
                      className="card bg-base-100 shadow-sm will-change-auto motion-reduce:!transform-none motion-reduce:!shadow-sm max-[1280px]:![transform:translate3d(0,0,0)]"
                      style={{
                        ['--tw-shadow' as string]: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0rem 0rem 0rem #00000012',
                        transform: 'translate(0px,0px)'
                      }}
                    >
                      <div className="card-body">
                        <h2 className="card-title mb-4 text-sm">Design system</h2>
                        <div className="grid grid-cols-4 items-end gap-4">
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Checkbox size="xs" tabIndex={-1} />
                            <span className="text-[.6rem] text-base-content/60">checkbox-xs</span>
                          </label>
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Checkbox size="sm" />
                            <span className="text-[.6rem] text-base-content/60">checkbox-sm</span>
                          </label>
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Checkbox size="md" />
                            <span className="text-[.6rem] text-base-content/60">checkbox-md</span>
                          </label>
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Checkbox size="lg" />
                            <span className="text-[.6rem] text-base-content/60">checkbox-lg</span>
                          </label>
                        </div>
                        <div className="grid grid-cols-4 items-end gap-4">
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Radio size="xs" tabIndex={-1} />
                            <span className="text-[.6rem] text-base-content/60">radio-xs</span>
                          </label>
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Radio size="sm" tabIndex={-1} />
                            <span className="text-[.6rem] text-base-content/60">radio-sm</span>
                          </label>
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Radio size="md" tabIndex={-1} />
                            <span className="text-[.6rem] text-base-content/60">radio-md</span>
                          </label>
                          <label className="flex cursor-pointer flex-col items-center gap-1">
                            <Radio size="lg" tabIndex={-1} />
                            <span className="text-[.6rem] text-base-content/60">radio-lg</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div
                      className="card bg-base-100 shadow-sm will-change-auto motion-reduce:!transform-none motion-reduce:!shadow-sm max-[1280px]:![transform:translate3d(0,0,0)]"
                      style={{
                        ['--tw-shadow' as string]: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0rem 0rem 0rem #00000012',
                        transform: 'translate(0px,0px)'
                      }}
                    >
                      <div className="card-body">
                        <h2 className="card-title mb-4 text-sm">Semantic colors</h2>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-primary"></div>
                            <div className="text-[.6rem] text-base-content/60">primary</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-secondary"></div>
                            <div className="text-[.6rem] text-base-content/60">secondary</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-accent"></div>
                            <div className="text-[.6rem] text-base-content/60">accent</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-neutral"></div>
                            <div className="text-[.6rem] text-base-content/60">neutral</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-info"></div>
                            <div className="text-[.6rem] text-base-content/60">info</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-success"></div>
                            <div className="text-[.6rem] text-base-content/60">success</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-warning"></div>
                            <div className="text-[.6rem] text-base-content/60">warning</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="aspect-square w-10 rounded-btn bg-error"></div>
                            <div className="text-[.6rem] text-base-content/60">error</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WindowMockup>
        </div>
      </div>
    </main>
  );
}
