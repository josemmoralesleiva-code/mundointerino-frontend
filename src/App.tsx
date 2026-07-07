import { useEffect } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import AppRouter from './presentation/router/AppRouter'
import ScrollToTop from './presentation/components/ScrollToTop'
import { useAuth } from './presentation/hooks/useAuth'
import { useAuthStore } from './presentation/store/auth.store'

function AppShell() {
  const navigate = useNavigate()
  const { bootstrap } = useAuth()
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping)
  const storeLogout = useAuthStore((s) => s.logout)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  useEffect(() => {
    const handler = () => {
      storeLogout()
      navigate('/')
    }
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [navigate, storeLogout])

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F5EF]">
        <div className="w-12 h-12 border-4 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin" />
        <p className="mt-4 text-sm text-[#0F172A]/60">Cargando…</p>
      </div>
    )
  }

  return (
    <>
      <ScrollToTop />
      <AppRouter />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
