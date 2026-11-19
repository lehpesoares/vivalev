import { useState, useEffect } from 'react'
import { getDashboardData, type PacienteSemRetorno } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  UserCheck,
  CalendarCheck,
  Heart,
  ArrowRight,
  UserPlus,
  ChevronRight,
} from 'lucide-react'

interface DashboardPageProps {
  user: any
  onNavigateToPacientes: () => void
  onNavigateToNovoPaciente?: () => void
  onSelectPaciente: (pacienteId: string) => void
  onDataLoaded?: (totalPacientes: number) => void
}

export function DashboardPage({
  user,
  onNavigateToPacientes,
  onNavigateToNovoPaciente,
  onSelectPaciente,
  onDataLoaded,
}: DashboardPageProps) {
  const [totalPacientes, setTotalPacientes] = useState<number>(0)
  const [consultasSemana, setConsultasSemana] = useState<number>(0)
  const [pacientesSemRetorno, setPacientesSemRetorno] = useState<PacienteSemRetorno[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // Carregar dados reais do Neon
  const loadData = async (showLoadingState = true) => {
    if (showLoadingState) setIsLoading(true)
    else setIsRefreshing(true)

    try {
      const data = await getDashboardData({
        id: user?.id,
        email: user?.email,
      })

      setTotalPacientes(data.totalPacientes)
      setConsultasSemana(data.consultasSemana)
      setPacientesSemRetorno(data.pacientesSemRetorno)
      if (onDataLoaded) {
        onDataLoaded(data.totalPacientes)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData(true)
  }, [user])

  const displayName = user?.name || user?.email?.split('@')[0] || 'Nutricionista'

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      {/* Cabeçalho Superior */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-extrabold text-pink-950 font-serif flex items-center gap-2">
            Olá, {displayName} <Sparkles className="w-4 h-4 text-pink-500 inline animate-pulse" />
          </h1>
          <p className="text-xs text-pink-600/70">
            Acompanhe os atendimentos e a evolução dos seus pacientes no VivaLev
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToNovoPaciente && (
            <Button
              variant="barbie"
              size="sm"
              onClick={onNavigateToNovoPaciente}
              className="hidden sm:inline-flex"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Novo Paciente
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(false)}
            disabled={isLoading || isRefreshing}
            className="text-pink-700 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-pink-500' : ''}`}
            />
            Atualizar
          </Button>
        </div>
      </header>

      {/* Conteúdo do Dashboard */}
      <div className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Banner Barbie de Boas-Vindas */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-500 via-pink-600 to-rose-400 p-6 md:p-8 text-white shadow-xl shadow-pink-200/60 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Heart className="w-3.5 h-3.5 fill-white/40" /> Painel de Nutrição VivaLev
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-serif">
              Visão Geral da Clínica
            </h2>
            <p className="text-pink-100 text-sm md:text-base leading-relaxed">
              Dados sincronizados em tempo real com o Neon. Monitore pacientes ativos, consultas programadas para a semana e alertas de retorno.
            </p>
          </div>

          <div className="absolute right-4 -bottom-6 opacity-15 pointer-events-none hidden sm:block">
            <Heart className="w-56 h-56 text-white" />
          </div>
        </div>

        {/* 
          =======================================================
          CARDS DE INFORMAÇÃO
          - Card 1: Total de pacientes ativos
          - Card 2: Consultas da semana
          - Card 3: Pacientes sem retorno
          =======================================================
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CARD 1 — Total de pacientes ativos */}
          <Card
            onClick={onNavigateToPacientes}
            className="border border-pink-100 hover:border-pink-300 transition-all shadow-sm hover:shadow-md bg-white cursor-pointer group"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold text-pink-900 tracking-wide uppercase">
                  Total de Pacientes
                </CardTitle>
                <p className="text-xs text-pink-400 mt-0.5">Cadastrados e ativos</p>
              </div>
              <div className="p-3 rounded-2xl bg-pink-100 text-pink-600 shadow-2xs group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {isLoading ? (
                <div className="h-9 w-16 bg-pink-100/60 animate-pulse rounded-lg" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-pink-950 font-serif">
                    {totalPacientes}
                  </span>
                  <span className="text-xs font-semibold text-pink-500">
                    paciente{totalPacientes !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between text-xs text-stone-500">
                <span className="text-pink-600 font-semibold group-hover:underline flex items-center gap-1">
                  Ver todos os pacientes <ChevronRight className="w-3.5 h-3.5 inline" />
                </span>
                <span className="font-semibold text-pink-600">Neon DB</span>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2 — Consultas da semana */}
          <Card className="border border-pink-100 hover:border-pink-300 transition-all shadow-sm hover:shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold text-pink-900 tracking-wide uppercase">
                  Consultas da Semana
                </CardTitle>
                <p className="text-xs text-pink-400 mt-0.5">Semana atual</p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 shadow-2xs">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {isLoading ? (
                <div className="h-9 w-16 bg-pink-100/60 animate-pulse rounded-lg" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-pink-950 font-serif">
                    {consultasSemana}
                  </span>
                  <span className="text-xs font-semibold text-pink-500">
                    consulta{consultasSemana !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between text-xs text-stone-500">
                <span>Segunda a Domingo</span>
                <span className="font-semibold text-pink-600">Semana vigente</span>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3 — Pacientes sem retorno */}
          <Card className="border border-pink-100 hover:border-pink-300 transition-all shadow-sm hover:shadow-md bg-white md:col-span-2 lg:col-span-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-bold text-pink-900 tracking-wide uppercase">
                  Pacientes sem Retorno
                </CardTitle>
                <p className="text-xs text-pink-400 mt-0.5">Sem consulta há &gt; 30 dias</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-pink-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col justify-between">
              {isLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-7 bg-pink-100/60 animate-pulse rounded-md" />
                  <div className="h-7 bg-pink-100/40 animate-pulse rounded-md" />
                </div>
              ) : pacientesSemRetorno.length === 0 ? (
                <div className="py-6 px-4 rounded-xl bg-pink-50/50 border border-dashed border-pink-200 text-center flex flex-col items-center justify-center gap-1.5 my-auto">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <p className="text-sm font-semibold text-pink-800">
                    Nenhum paciente sem retorno no momento
                  </p>
                  <p className="text-xs text-pink-500/80">
                    Todos os retornos estão em dia!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {pacientesSemRetorno.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectPaciente(p.id)}
                      className="w-full text-left p-2.5 rounded-xl border border-pink-100 bg-pink-50/40 hover:bg-pink-100/70 hover:border-pink-300 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-bold text-pink-950 truncate group-hover:text-pink-700">
                          {p.nome}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-pink-600/80 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-pink-400" /> Última: {p.ultima_consulta}
                          </span>
                          <span className="font-bold text-rose-500">
                            ({p.dias_sem_consulta} dias atrás)
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between text-xs text-stone-500">
                <span>Alerta de fidelização</span>
                <span className="font-semibold text-pink-600">
                  {pacientesSemRetorno.length} pendente{pacientesSemRetorno.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Destaque de Atalhos Rápidos */}
        <div className="rounded-3xl border border-pink-200/70 bg-white p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-pink-950 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pink-600" /> Próximas ações
            </h3>
            <p className="text-xs text-stone-500">
              Acesse a lista completa de pacientes ou cadastre um novo paciente para iniciar atendimentos.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {onNavigateToNovoPaciente && (
              <Button
                variant="outline"
                onClick={onNavigateToNovoPaciente}
                className="w-full md:w-auto rounded-xl border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Cadastrar Paciente
              </Button>
            )}
            <Button
              variant="barbie"
              onClick={onNavigateToPacientes}
              className="w-full md:w-auto rounded-xl shadow-sm"
            >
              <Users className="w-4 h-4 mr-1.5" />
              Gerenciar Pacientes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
