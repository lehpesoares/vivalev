import { useState, useEffect } from 'react'
import {
  getPacienteById,
  calculateAge,
  calculateIMC,
  type PacienteCompleto,
} from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChevronLeft,
  User,
  Activity,
  Coffee,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  Target,
  AlertTriangle,
  Heart,
  Pill,
  Clock,
  Sparkles,
  UserPlus,
  RefreshCw,
  Loader2,
} from 'lucide-react'

interface PacientePerfilPageProps {
  pacienteId: string
  user: any
  onBack: () => void
  onNavigateToNovoPaciente: () => void
}

export function PacientePerfilPage({
  pacienteId,
  user,
  onBack,
  onNavigateToNovoPaciente,
}: PacientePerfilPageProps) {
  const [paciente, setPaciente] = useState<PacienteCompleto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadPaciente = async () => {
    setIsLoading(true)
    try {
      const data = await getPacienteById(pacienteId, user)
      setPaciente(data)
    } catch (error) {
      console.error('Erro ao carregar perfil do paciente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (pacienteId) {
      loadPaciente()
    }
  }, [pacienteId, user])

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        <p className="text-sm font-semibold text-pink-900">
          Carregando perfil do paciente...
        </p>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] gap-4">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-pink-950 font-serif">
          Paciente não encontrado
        </h2>
        <p className="text-xs text-stone-500 max-w-sm">
          Não foi possível localizar o paciente solicitado ou você não tem permissão para visualizá-lo.
        </p>
        <Button variant="outline" onClick={onBack} className="rounded-xl border-pink-200 text-pink-700">
          <ChevronLeft className="w-4 h-4 mr-1.5" />
          Voltar para a Lista de Pacientes
        </Button>
      </div>
    )
  }

  const idade = calculateAge(paciente.data_nascimento)
  const imcInfo = calculateIMC(paciente.peso_inicial, paciente.altura)

  // Link direto para WhatsApp
  const whatsappDigits = paciente.whatsapp ? paciente.whatsapp.replace(/\D/g, '') : ''
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/55${whatsappDigits}`
    : null

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      {/* Header Superior */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="rounded-xl border-pink-200 text-pink-700 hover:bg-pink-50"
            title="Voltar para a lista de pacientes"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-pink-950 font-serif">
                {paciente.nome}
              </h1>
              {idade !== null && (
                <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                  {idade} anos
                </span>
              )}
            </div>
            <p className="text-xs text-pink-600/70">
              Perfil e prontuário nutricional do paciente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPaciente}
            className="text-pink-700 border-pink-200 hover:bg-pink-50"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
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

      {/* Conteúdo do Perfil */}
      <div className="p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto">
        {/* Banner do Perfil do Paciente */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-500 via-pink-600 to-rose-400 p-6 md:p-8 text-white shadow-lg shadow-pink-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-extrabold text-2xl shadow-inner border border-white/30">
              {paciente.nome.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-pink-200" /> Paciente VivaLev
              </div>
              <h2 className="text-2xl font-extrabold font-serif">{paciente.nome}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-pink-100">
                {paciente.sexo && <span>Sexo: {paciente.sexo}</span>}
                {idade !== null && <span>• {idade} anos</span>}
                {paciente.ultima_consulta && (
                  <span>• Última consulta: {paciente.ultima_consulta}</span>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex items-center gap-3 z-10 w-full md:w-auto">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors w-full md:w-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Conversar no WhatsApp
              </a>
            )}
          </div>

          <div className="absolute right-2 -bottom-8 opacity-10 pointer-events-none hidden sm:block">
            <Heart className="w-48 h-48 text-white" />
          </div>
        </div>

        {/* Grade com os dados organizados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 
            =======================================================
            CARD 1 — DADOS PESSOAIS
            =======================================================
          */}
          <Card className="border-pink-100 bg-white shadow-xs rounded-3xl">
            <CardHeader className="border-b border-pink-50 pb-4">
              <CardTitle className="text-base text-pink-950 font-serif flex items-center gap-2">
                <User className="w-4 h-4 text-pink-500" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Data de Nascimento / Idade */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">Data de Nascimento / Idade</p>
                  <p className="text-sm font-bold text-pink-950">
                    {paciente.data_nascimento || 'Não informada'}
                    {idade !== null && (
                      <span className="text-xs text-pink-600 font-normal ml-1">
                        ({idade} anos)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Sexo */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">Sexo</p>
                  <p className="text-sm font-bold text-pink-950">
                    {paciente.sexo || 'Não informado'}
                  </p>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">Telefone</p>
                  <p className="text-sm font-bold text-pink-950">
                    {paciente.telefone || 'Não informado'}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-medium">WhatsApp</p>
                  <p className="text-sm font-bold text-pink-950">
                    {paciente.whatsapp || 'Não informado'}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs text-stone-400 font-medium">Email</p>
                  <p className="text-sm font-bold text-pink-950 truncate">
                    {paciente.email || 'Não informado'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 
            =======================================================
            CARD 2 — CLÍNICO & ANTROPOMETRIA
            =======================================================
          */}
          <Card className="border-pink-100 bg-white shadow-xs rounded-3xl lg:col-span-2">
            <CardHeader className="border-b border-pink-50 pb-4">
              <CardTitle className="text-base text-pink-950 font-serif flex items-center gap-2">
                <Activity className="w-4 h-4 text-pink-500" />
                Avaliação Clínica & Medidas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Antropometria: Peso, Altura, IMC */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/80">
                  <p className="text-xs font-semibold text-pink-700">Peso Inicial</p>
                  <p className="text-2xl font-extrabold text-pink-950 font-serif mt-1">
                    {paciente.peso_inicial ? `${paciente.peso_inicial} kg` : '--'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/80">
                  <p className="text-xs font-semibold text-pink-700">Altura</p>
                  <p className="text-2xl font-extrabold text-pink-950 font-serif mt-1">
                    {paciente.altura ? `${paciente.altura} cm` : '--'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100/80">
                  <p className="text-xs font-semibold text-pink-700">IMC</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-pink-950 font-serif">
                      {imcInfo.imc || '--'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 inline-block ${imcInfo.corBadge}`}>
                    {imcInfo.classificacao}
                  </span>
                </div>
              </div>

              {/* Objetivos */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-pink-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-pink-500" />
                  Objetivos Nutricionais
                </p>
                <div className="flex flex-wrap gap-2">
                  {paciente.objetivos && paciente.objetivos.length > 0 ? (
                    paciente.objetivos.map((obj) => (
                      <span
                        key={obj}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200"
                      >
                        {obj}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400 italic">Não informado</span>
                  )}
                </div>
                {paciente.objetivo_texto && (
                  <p className="text-xs text-stone-600 bg-pink-50/40 p-2.5 rounded-xl border border-pink-100/60 mt-1">
                    "{paciente.objetivo_texto}"
                  </p>
                )}
              </div>

              {/* Patologias, Restrições e Alergias */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-pink-50">
                {/* Patologias */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-pink-950">Patologias</p>
                  <div className="flex flex-wrap gap-1.5">
                    {paciente.patologias && paciente.patologias.length > 0 ? (
                      paciente.patologias.map((p) => (
                        <span
                          key={p}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-400 italic">Nenhuma</span>
                    )}
                  </div>
                </div>

                {/* Restrições */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-pink-950">Restrições</p>
                  <div className="flex flex-wrap gap-1.5">
                    {paciente.restricoes_alimentares && paciente.restricoes_alimentares.length > 0 ? (
                      paciente.restricoes_alimentares.map((r) => (
                        <span
                          key={r}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100"
                        >
                          {r}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-400 italic">Nenhuma</span>
                    )}
                  </div>
                </div>

                {/* Alergias */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-pink-950">Alergias</p>
                  <div className="flex flex-wrap gap-1.5">
                    {paciente.alergias && paciente.alergias.length > 0 ? (
                      paciente.alergias.map((a) => (
                        <span
                          key={a}
                          className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100"
                        >
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-400 italic">Nenhuma</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Medicamentos e Suplementos */}
              {(paciente.medicamentos || paciente.suplementos) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-pink-50">
                  {paciente.medicamentos && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-pink-500" />
                        Medicamentos contínuos
                      </p>
                      <p className="text-xs text-stone-700 bg-pink-50/40 p-2.5 rounded-xl border border-pink-100">
                        {paciente.medicamentos}
                      </p>
                    </div>
                  )}

                  {paciente.suplementos && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                        Suplementos em uso
                      </p>
                      <p className="text-xs text-stone-700 bg-pink-50/40 p-2.5 rounded-xl border border-pink-100">
                        {paciente.suplementos}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 
            =======================================================
            CARD 3 — HÁBITOS & ROTINA
            =======================================================
          */}
          <Card className="border-pink-100 bg-white shadow-xs rounded-3xl lg:col-span-3">
            <CardHeader className="border-b border-pink-50 pb-4">
              <CardTitle className="text-base text-pink-950 font-serif flex items-center gap-2">
                <Coffee className="w-4 h-4 text-pink-500" />
                Rotina & Hábitos de Vida
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Refeições/dia */}
                <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100/70">
                  <p className="text-xs text-stone-500">Refeições ao dia</p>
                  <p className="text-lg font-bold text-pink-950 mt-0.5">
                    {paciente.refeicoes_por_dia ? `${paciente.refeicoes_por_dia} refeições` : 'Não informado'}
                  </p>
                </div>

                {/* Água */}
                <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100/70">
                  <p className="text-xs text-stone-500">Água por dia</p>
                  <p className="text-lg font-bold text-pink-950 mt-0.5">
                    {paciente.litros_agua ? `${paciente.litros_agua} litros` : 'Não informado'}
                  </p>
                </div>

                {/* Sono (Acorda / Dorme) */}
                <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100/70">
                  <p className="text-xs text-stone-500">Horários de Sono</p>
                  <p className="text-sm font-bold text-pink-950 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-500" />
                    {paciente.horario_acorda || '--'} às {paciente.horario_dorme || '--'}
                  </p>
                </div>

                {/* Atividade Física */}
                <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100/70">
                  <p className="text-xs text-stone-500">Atividade Física</p>
                  <p className="text-sm font-bold text-pink-950 mt-0.5">
                    {paciente.atividade_fisica ? (
                      <span className="text-emerald-700 font-bold">Sim</span>
                    ) : (
                      <span className="text-stone-500">Não pratica</span>
                    )}
                    {paciente.atividade_fisica_descricao && (
                      <span className="text-xs block text-stone-600 font-normal mt-0.5">
                        {paciente.atividade_fisica_descricao}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Observações Gerais */}
              {paciente.observacoes && (
                <div className="mt-4 pt-4 border-t border-pink-50 space-y-1">
                  <p className="text-xs font-bold text-pink-950">Observações gerais:</p>
                  <p className="text-xs text-stone-700 bg-pink-50/30 p-3 rounded-xl border border-pink-100/60 leading-relaxed whitespace-pre-wrap">
                    {paciente.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
