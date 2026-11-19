import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronRight,
  UserPlus,
} from 'lucide-react'

export type NavView = 'dashboard' | 'pacientes' | 'novo-paciente' | 'perfil-paciente'

interface SidebarProps {
  currentView: NavView
  onNavigate: (view: 'dashboard' | 'pacientes' | 'novo-paciente') => void
  user: any
  onLogout: () => void
  totalPacientes?: number
}

export function Sidebar({
  currentView,
  onNavigate,
  user,
  onLogout,
  totalPacientes,
}: SidebarProps) {
  const displayName = user?.name || user?.email?.split('@')[0] || 'Nutricionista'

  return (
    <aside className="w-full md:w-64 bg-white border-r border-pink-100 flex flex-col shrink-0 md:h-screen md:sticky md:top-0 z-20 shadow-xs">
      {/* Topo com Logo */}
      <div className="p-6 border-b border-pink-100/80 flex items-center justify-between">
        <Logo size="md" theme="barbie" />
      </div>

      {/* Itens do Menu */}
      <div className="p-4 flex-1 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-pink-400">
          Navegação Principal
        </div>

        {/* Opção Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            currentView === 'dashboard'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-stone-600 hover:text-pink-600 hover:bg-pink-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard
              className={`w-4 h-4 ${
                currentView === 'dashboard' ? 'text-white' : 'text-pink-500'
              }`}
            />
            <span>Dashboard</span>
          </div>
          {currentView === 'dashboard' && <ChevronRight className="w-4 h-4 opacity-75" />}
        </button>

        {/* Opção Pacientes */}
        <button
          onClick={() => onNavigate('pacientes')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            currentView === 'pacientes' || currentView === 'perfil-paciente'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-stone-600 hover:text-pink-600 hover:bg-pink-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users
              className={`w-4 h-4 ${
                currentView === 'pacientes' || currentView === 'perfil-paciente'
                  ? 'text-white'
                  : 'text-pink-500'
              }`}
            />
            <span>Pacientes</span>
          </div>
          {totalPacientes !== undefined && totalPacientes > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                currentView === 'pacientes' || currentView === 'perfil-paciente'
                  ? 'bg-white/20 text-white'
                  : 'bg-pink-100 text-pink-700'
              }`}
            >
              {totalPacientes}
            </span>
          )}
        </button>

        {/* Opção Rápida Novo Paciente */}
        <button
          onClick={() => onNavigate('novo-paciente')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            currentView === 'novo-paciente'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200'
              : 'text-stone-600 hover:text-pink-600 hover:bg-pink-50/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <UserPlus
              className={`w-4 h-4 ${
                currentView === 'novo-paciente' ? 'text-white' : 'text-pink-500'
              }`}
            />
            <span>Novo Paciente</span>
          </div>
          {currentView === 'novo-paciente' && <ChevronRight className="w-4 h-4 opacity-75" />}
        </button>
      </div>

      {/* Rodapé da Sidebar com Perfil e Logout */}
      <div className="p-4 border-t border-pink-100 bg-pink-50/30">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-pink-100/80 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-pink-950 truncate">{displayName}</p>
              <p className="text-[11px] text-pink-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            title="Sair do sistema"
            className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}

