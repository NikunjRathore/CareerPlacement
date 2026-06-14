function AuthLayout({ children, mode, onModeChange }) {
  const isLogin = mode === 'login'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ccfbf1_0,#f8fafc_34%,#eef2ff_100%)] text-slate-950">
      <div className="absolute left-8 top-10 h-32 w-32 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="absolute bottom-10 right-8 h-44 w-44 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 p-4 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <section className="hidden overflow-hidden rounded-l-2xl bg-slate-950 px-10 py-12 text-white shadow-2xl shadow-slate-300/40 lg:flex lg:flex-col lg:justify-between">
          <div className="relative">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-teal-300/20" />
            <div className="absolute right-10 top-28 h-20 w-20 rounded-full bg-teal-400/10 blur-xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
              CareerPlacement
            </p>
            <h1 className="mt-8 max-w-md text-5xl font-semibold leading-tight text-white">
              Start your placement journey with a simple account.
            </h1>
          </div>
          <div className="grid gap-4 text-sm text-slate-300">
            <p className="max-w-sm">
              Save your profile, track applications, and keep placement work in one place.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-16 rounded-full bg-teal-400" />
              <div className="h-2 w-8 rounded-full bg-indigo-300" />
              <div className="h-2 w-12 rounded-full bg-white/30" />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-2xl bg-white/55 px-5 py-10 shadow-2xl shadow-slate-300/30 backdrop-blur sm:px-8 lg:rounded-l-none">
          <div className="w-full max-w-md animate-[fadeUp_0.45s_ease-out]">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                  CareerPlacement
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {isLogin ? 'Login to continue your progress.' : 'Register and start building your profile.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onModeChange(isLogin ? 'register' : 'login')}
                className="rounded-md border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-500 hover:text-teal-700 hover:shadow-md"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthLayout
