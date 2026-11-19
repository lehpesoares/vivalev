import { useState, useEffect, useMemo } from 'react'
import { getPacientes, type PacienteListItem } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  Search,
  UserPlus,
  Calendar,
  Target,
  ChevronRight,
  RefreshCw,
  X,
  Phone,
  Heart,
} from 'lucide-react'

interface PacientesListPageProps {
  user: any
  onNavigateToNovoPaciente: () => void
  onSelectPaciente: (pacienteId: string) => void
}

export function PacientesListPage({
  user,
  onNavigateToNovoPaciente,
  onSelectPaciente,
}: PacientesListPageProps) {
  const [pacientes, setPacientes] = useState<PacienteListItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadPacientes = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    else setIsRefreshing(true)

    try {
      const data = await getPacientes(user)
      setPacientes(data)
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadPacientes(true)
  }, [user])

  // Filtro de busca por nome em tempo real
  const filteredPacientes = useMemo(() => {
    if (!searchTerm.trim()) return pacientes
    const lower = searchTerm.toLowerCase()
    return pacientes.filter((p) => p.nome.toLowerCase().includes(lower))
  }, [pacientes, searchTerm])

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      {/* Header Superior */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-extrabold text-pink-950 font-serif flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-600" />
            Pacientes
          </h1>
          <p className="text-xs text-pink-600/70">
            Consulte a lista completa dos seus pacientes e acompanhe o histórico nutricional
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadPacientes(false)}
            disabled={isLoading || isRefreshing}
            className="text-pink-700 border-pink-200 hover:bg-pink-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-pink-500' : ''}`}
            />
            Atualizar
          </Button>

          <Button
            variant="barbie"
            size="sm"
            onClick={onNavigateToNovoPaciente}
            className="shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Novo Paciente
          </Button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Barra de Pesquisa por Nome */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-pink-400 pointer-events-none" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar paciente por nome..."
              className="pl-10 pr-10 bg-white border-pink-200 focus-visible:ring-pink-500 rounded-2xl h-12 shadow-xs text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 p-1 text-pink-400 hover:text-pink-600 rounded-full hover:bg-pink-50 cursor-pointer"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-pink-600/80 mt-1.5 ml-1">
              Encontrado{filteredPacientes.length !== 1 ? 's' : ''} {filteredPacientes.length} de {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Estado de Carregamento */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <Card key={n} className="border-pink-100 bg-white p-5 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2.5 flex-1">
                    <div className="h-5 w-48 bg-pink-100/70 rounded-md" />
                    <div className="h-4 w-72 bg-pink-50 rounded-md" />
                  </div>
                  <div className="h-8 w-24 bg-pink-100/50 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : pacientes.length === 0 ? (
          /* Mensagem Obrigatória: Se não houver pacientes cadastrados */
          <div className="rounded-3xl border border-dashed border-pink-300 bg-white/80 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mb-4 shadow-md shadow-pink-200">
              <Heart className="w-8 h-8 fill-white/30" />
            </div>
            <h3 className="text-xl font-bold text-pink-950 font-serif mb-1.5">
              Nenhum paciente cadastrado ainda
            </h3>
            <p className="text-sm text-pink-700/80 mb-6 max-w-sm">
              Comece agora a registrar os seus pacientes para gerenciar consultas, planos alimentares e evolução física.
            </p>
            <Button
              variant="barbie"
              size="lg"
              onClick={onNavigateToNovoPaciente}
              className="rounded-2xl shadow-md shadow-pink-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastrar Primeiro Paciente
            </Button>
          </div>
        ) : filteredPacientes.length === 0 ? (
          /* Busca vazia */
          <div className="rounded-2xl border border-pink-200 bg-white p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <Search className="w-10 h-10 text-pink-300 mb-2" />
            <h4 className="text-base font-bold text-pink-950">
              Nenhum paciente encontrado
            </h4>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Não encontramos nenhum paciente com o nome "{searchTerm}".
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="text-pink-700 border-pink-200"
            >
              Limpar busca
            </Button>
          </div>
        ) : (
          /* Lista de Pacientes */
          <div className="space-y-3">
            {filteredPacientes.map((paciente) => (
              <Card
                key={paciente.id}
                onClick={() => onSelectPaciente(paciente.id)}
                className="border border-pink-100/90 hover:border-pink-300 bg-white hover:bg-pink-50/30 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group rounded-2xl"
              >
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Informações Principais: Nome, Objetivo, Data da Última Consulta */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Avatar com inicial */}
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      {paciente.nome.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 space-y-1">
                      {/* Nome do Paciente */}
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-pink-950 font-serif truncate group-hover:text-pink-600 transition-colors">
                          {paciente.nome}
                        </h3>
                      </div>

                      {/* Objetivo */}
                      <div className="flex items-center gap-1.5 text-xs text-pink-700">
                        <Target className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        <span className="font-semibold text-pink-900/80">Objetivo:</span>
                        <span className="truncate bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md font-medium border border-pink-100">
                          {paciente.objetivo_display}
                        </span>
                      </div>

                      {/* Contato se houver */}
                      {(paciente.whatsapp || paciente.telefone) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 sm:hidden pt-0.5">
                          <Phone className="w-3 h-3 text-pink-400" />
                          <span>{paciente.whatsapp || paciente.telefone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lado Direito: Data da Última Consulta e Ação */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-50">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-1 text-xs text-pink-800 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        <span>Última consulta:</span>
                      </div>
                      <p className="text-xs font-bold text-pink-950 mt-0.5">
                        {paciente.ultima_consulta ? (
                          <span className="text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                            {paciente.ultima_consulta}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic font-normal">
                            Nenhuma consulta realizada
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all shadow-2xs">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
