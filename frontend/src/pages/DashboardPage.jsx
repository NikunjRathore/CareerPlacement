import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-950">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-slate-900/50 px-5 py-6 backdrop-blur-sm sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-400">
                CareerPlacement
              </p>
              <h1 className="mt-2 text-4xl font-bold text-white">Dashboard</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="group relative inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition duration-200 hover:shadow-xl hover:shadow-red-600/40 active:scale-95"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Welcome card */}
            <div className="lg:col-span-2">
              <div className="group rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-xl shadow-slate-900/50 backdrop-blur transition duration-300 hover:border-teal-500/50 hover:shadow-teal-500/10">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-teal-400 to-teal-600 text-2xl font-bold text-white shadow-lg shadow-teal-600/30">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Welcome back</p>
                    <h2 className="mt-2 text-3xl font-bold text-white">{user?.name || 'User'}</h2>
                    <p className="mt-3 text-slate-300">{user?.email || 'No email'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status card */}
            <div className="rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-xl shadow-slate-900/50 backdrop-blur transition duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-300">Active</span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">Account Status</p>
                <p className="mt-3 text-3xl font-bold text-emerald-400">All Set</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Profile Completion', value: '100%', icon: '📋', color: 'from-blue-400 to-blue-600' },
              { label: 'Applications', value: '0', icon: '📬', color: 'from-purple-400 to-purple-600' },
              { label: 'Interviews', value: '0', icon: '🎤', color: 'from-pink-400 to-pink-600' },
              { label: 'Offers', value: '0', icon: '🎉', color: 'from-orange-400 to-orange-600' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-slate-700/50 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-4 shadow-lg shadow-slate-900/30 backdrop-blur transition duration-300 hover:border-slate-600/50 hover:shadow-slate-900/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="text-3xl opacity-70 group-hover:scale-110 transition duration-200">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Info section */}
          <div className="mt-8 rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-8 shadow-xl shadow-slate-900/50 backdrop-blur">
            <h3 className="text-lg font-bold text-white">Getting Started</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Complete Your Profile', desc: 'Add your details to stand out to employers', path: '/profile' },
                { title: 'Browse Positions', desc: 'Explore job openings matching your skills', path: '/jobs' },
                { title: 'Apply to Jobs', desc: 'Submit applications to top companies', path: '/jobs' },
                { title: 'Track Progress', desc: 'Monitor your applications and interviews', path: '/progress' },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item.path && navigate(item.path)}
                  className={`rounded-lg border border-slate-700/30 bg-slate-900/30 p-4 ${item.path ? 'cursor-pointer hover:border-teal-500/50 transition' : ''}`}>
                  <p className="font-semibold text-teal-400">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage
