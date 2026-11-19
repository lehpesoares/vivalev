import { useState, useEffect } from 'react'
import { authClient } from '@/lib/auth'
import { syncNutricionista, type PacienteCompleto } from '@/lib/db'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PacientesListPage } from '@/pages/PacientesListPage'
import { NovoPacientePage } from '@/pages/NovoPacientePage'
import { PacientePerfilPage } from '@/pages/PacientePerfilPage'
import { Sidebar, type NavView } from '@/components/Sidebar'
import { Loader2 } from 'lucide-react'

type ViewMode =
  | 'login'
  | 'register'
  | 'dashboard'
  | 'pacientes'
  | 'novo-paciente'
  | 'perfil-paciente'

export function App() {
  const [view, setView] = useState<ViewMode>('login')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [totalPacientes, setTotalPacientes] = useState<number | undefined>(undefined)
  const [isInitializing, setIsInitializing] = useState(true)

  // Better-auth session hook
  const { data: sessionData, isPending } = authClient.useSession()

  useEffect(() => {
    // Sincronizar nutricionista se estiver logado
    if (!isPending) {
      if (sessionData?.user) {
        syncNutricionista({
          id: sessionData.user.id,
          name: sessionData.user.name,
          email: sessionData.user.email,
        })
        if (view === 'login' || view === 'register') {
          setView('dashboard')
        }
      } else {
        if (view !== 'login' && view !== 'register') {
          setView('login')
        }
      }
      setIsInitializing(false)
    }
  }, [sessionData, isPending])

  const handleAuthSuccess = () => {
    setView('dashboard')
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut()
    } catch (e) {
      console.error(e)
    } finally {
      setSelectedPatientId(null)
      setView('login')
    }
  }

  if (isInitializing || isPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pink-50/50 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        <span className="text-sm font-medium text-pink-900">
          Carregando VivaLev...
        </span>
      </div>
    )
  }

  // Rotas não autenticadas
  if (!sessionData?.user && view === 'register') {
    return (
      <RegisterPage
        onNavigateToLogin={() => setView('login')}
        onSuccess={handleAuthSuccess}
      />
    )
  }

  if (!sessionData?.user && view !== 'dashboard' && view !== 'pacientes' && view !== 'novo-paciente' && view !== 'perfil-paciente') {
    return (
      <LoginPage
        onNavigateToRegister={() => setView('register')}
        onSuccess={handleAuthSuccess}
      />
    )
  }

  // Rotas autenticadas com Menu Lateral Fixo Compartilhado
  const currentNavView: NavView =
    view === 'login' || view === 'register' ? 'dashboard' : view

  return (
    <div className="min-h-screen bg-pink-50/40 flex flex-col md:flex-row font-sans text-stone-800">
      {/* Menu Lateral Fixo Mantido na tela de listagem, formulário e dashboard */}
      <Sidebar
        currentView={currentNavView}
        onNavigate={(nav) => {
          setView(nav)
        }}
        user={sessionData?.user}
        onLogout={handleLogout}
        totalPacientes={totalPacientes}
      />

      {/* Conteúdo dinâmico da tela ativa */}
      {view === 'dashboard' && (
        <DashboardPage
          user={sessionData?.user}
          onNavigateToPacientes={() => setView('pacientes')}
          onNavigateToNovoPaciente={() => setView('novo-paciente')}
          onSelectPaciente={(patientId) => {
            setSelectedPatientId(patientId)
            setView('perfil-paciente')
          }}
          onDataLoaded={(count) => setTotalPacientes(count)}
        />
      )}

      {view === 'pacientes' && (
        <PacientesListPage
          user={sessionData?.user}
          onNavigateToNovoPaciente={() => setView('novo-paciente')}
          onSelectPaciente={(patientId) => {
            setSelectedPatientId(patientId)
            setView('perfil-paciente')
          }}
        />
      )}

      {view === 'novo-paciente' && (
        <NovoPacientePage
          user={sessionData?.user}
          onBack={() => setView('pacientes')}
          onSuccess={(paciente: PacienteCompleto) => {
            setSelectedPatientId(paciente.id)
            setView('perfil-paciente')
          }}
        />
      )}

      {view === 'perfil-paciente' && selectedPatientId && (
        <PacientePerfilPage
          pacienteId={selectedPatientId}
          user={sessionData?.user}
          onBack={() => setView('pacientes')}
          onNavigateToNovoPaciente={() => setView('novo-paciente')}
        />
      )}
    </div>
  )
}

export default App
