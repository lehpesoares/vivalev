import { useState } from 'react'
import {
  createPaciente,
  calculateAge,
  calculateIMC,
  formatTimeInput,
  formatPhone,
  type NovoPacienteInput,
  type PacienteCompleto,
} from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  User,
  Activity,
  Coffee,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Save,
  Loader2,
  Calendar,
  AlertCircle,
  Sparkles,
  Scale,
} from 'lucide-react'

interface NovoPacientePageProps {
  user: any
  onBack: () => void
  onSuccess: (paciente: PacienteCompleto) => void
}

type TabType = 'pessoal' | 'clinico' | 'habitos'

export function NovoPacientePage({ user, onBack, onSuccess }: NovoPacientePageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pessoal')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState(false)

  // Aba 1 — Pessoal
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [sexo, setSexo] = useState<string>('Feminino')
  const [telefone, setTelefone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')

  // Aba 2 — Clínico
  const [pesoAtual, setPesoAtual] = useState<string>('')
  const [altura, setAltura] = useState<string>('')
  const [objetivos, setObjetivos] = useState<string[]>([])
  const [objetivoTexto, setObjetivoTexto] = useState('')
  const [nivelAtividade, setNivelAtividade] = useState<string>('Sedentário')
  const [patologias, setPatologias] = useState<string[]>([])
  const [novaPatologia, setNovaPatologia] = useState('')
  const [restricoes, setRestricoes] = useState<string[]>([])
  const [novaRestricao, setNovaRestricao] = useState('')
  const [alergias, setAlergias] = useState<string[]>([])
  const [novaAlergia, setNovaAlergia] = useState('')
  const [medicamentos, setMedicamentos] = useState('')
  const [suplementos, setSuplementos] = useState('')

  // Aba 3 — Hábitos
  const [refeicoesPorDia, setRefeicoesPorDia] = useState<string>('3')
  const [horarioAcorda, setHorarioAcorda] = useState('')
  const [horarioDorme, setHorarioDorme] = useState('')
  const [litrosAgua, setLitrosAgua] = useState<string>('2')
  const [praticaAtividade, setPraticaAtividade] = useState<boolean>(false)
  const [atividadeDescricao, setAtividadeDescricao] = useState('')
  const [observacoes, setObservacoes] = useState('')

  // Opções pré-definidas
  const objetivosDisponiveis = [
    'Emagrecer',
    'Ganhar massa',
    'Controlar diabetes',
    'Saúde geral',
    'Performance esportiva',
    'Reeducação alimentar',
  ]

  const niveisAtividadeDisponiveis = [
    'Sedentário',
    'Levemente ativo',
    'Moderadamente ativo',
    'Muito ativo',
    'Extremamente ativo',
  ]

  const patologiasDisponiveis = [
    'Diabetes',
    'Hipertensão',
    'Hipotireoidismo',
    'Hipertireoidismo',
    'Síndrome do ovário policístico',
    'Doença celíaca',
    'Colesterol alto',
  ]

  const restricoesDisponiveis = [
    'Lactose',
    'Glúten',
    'Açúcar',
    'Carne vermelha',
    'Frutos do mar',
  ]

  const alergiasDisponiveis = [
    'Amendoim',
    'Leite',
    'Ovo',
    'Soja',
    'Trigo',
    'Frutos do mar',
  ]

  // Cálculos Automáticos
  const idadeCalculada = calculateAge(dataNascimento)

  const numPeso = pesoAtual ? parseFloat(pesoAtual.replace(',', '.')) : null
  const numAltura = altura ? parseFloat(altura.replace(',', '.')) : null
  const imcInfo = calculateIMC(numPeso, numAltura)

  // Manipuladores de Formatação
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value))
  }

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatPhone(e.target.value))
  }

  const handleHorarioAcordaBlur = () => {
    if (horarioAcorda) {
      setHorarioAcorda(formatTimeInput(horarioAcorda))
    }
  }

  const handleHorarioDormeBlur = () => {
    if (horarioDorme) {
      setHorarioDorme(formatTimeInput(horarioDorme))
    }
  }

  // Multi-seleção de Objetivos
  const toggleObjetivo = (item: string) => {
    if (objetivos.includes(item)) {
      setObjetivos(objetivos.filter((o) => o !== item))
    } else {
      setObjetivos([...objetivos, item])
    }
  }

  // Multi-seleção com opção "Nenhum" e adição livre
  const togglePatologia = (item: string) => {
    if (item === 'Nenhum') {
      if (patologias.includes('Nenhum')) {
        setPatologias([])
      } else {
        setPatologias(['Nenhum'])
      }
    } else {
      const semNenhum = patologias.filter((p) => p !== 'Nenhum')
      if (semNenhum.includes(item)) {
        setPatologias(semNenhum.filter((p) => p !== item))
      } else {
        setPatologias([...semNenhum, item])
      }
    }
  }

  const addCustomPatologia = () => {
    const val = novaPatologia.trim()
    if (!val) return
    const semNenhum = patologias.filter((p) => p !== 'Nenhum')
    if (!semNenhum.includes(val)) {
      setPatologias([...semNenhum, val])
    }
    setNovaPatologia('')
  }

  const toggleRestricao = (item: string) => {
    if (item === 'Nenhum') {
      if (restricoes.includes('Nenhum')) {
        setRestricoes([])
      } else {
        setRestricoes(['Nenhum'])
      }
    } else {
      const semNenhum = restricoes.filter((r) => r !== 'Nenhum')
      if (semNenhum.includes(item)) {
        setRestricoes(semNenhum.filter((r) => r !== item))
      } else {
        setRestricoes([...semNenhum, item])
      }
    }
  }

  const addCustomRestricao = () => {
    const val = novaRestricao.trim()
    if (!val) return
    const semNenhum = restricoes.filter((r) => r !== 'Nenhum')
    if (!semNenhum.includes(val)) {
      setRestricoes([...semNenhum, val])
    }
    setNovaRestricao('')
  }

  const toggleAlergia = (item: string) => {
    if (item === 'Nenhum') {
      if (alergias.includes('Nenhum')) {
        setAlergias([])
      } else {
        setAlergias(['Nenhum'])
      }
    } else {
      const semNenhum = alergias.filter((a) => a !== 'Nenhum')
      if (semNenhum.includes(item)) {
        setAlergias(semNenhum.filter((a) => a !== item))
      } else {
        setAlergias([...semNenhum, item])
      }
    }
  }

  const addCustomAlergia = () => {
    const val = novaAlergia.trim()
    if (!val) return
    const semNenhum = alergias.filter((a) => a !== 'Nenhum')
    if (!semNenhum.includes(val)) {
      setAlergias([...semNenhum, val])
    }
    setNovaAlergia('')
  }

  // Envio do formulário
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)

    // O único campo obrigatório é o nome completo
    if (!nome.trim()) {
      setActiveTab('pessoal')
      setErrorMessage('O Nome completo é obrigatório.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: NovoPacienteInput = {
        nome: nome.trim(),
        data_nascimento: dataNascimento || null,
        sexo: sexo || null,
        telefone: telefone || null,
        whatsapp: whatsapp || null,
        email: email.trim() || null,
        peso_inicial: numPeso,
        altura: numAltura,
        objetivos,
        objetivo_texto: objetivoTexto.trim() || null,
        nivel_atividade: nivelAtividade,
        patologias,
        restricoes_alimentares: restricoes,
        alergias,
        medicamentos: medicamentos.trim() || null,
        suplementos: suplementos.trim() || null,
        refeicoes_por_dia: refeicoesPorDia ? parseInt(refeicoesPorDia, 10) : null,
        horario_acorda: horarioAcorda ? formatTimeInput(horarioAcorda) : null,
        horario_dorme: horarioDorme ? formatTimeInput(horarioDorme) : null,
        litros_agua: litrosAgua ? parseFloat(litrosAgua.replace(',', '.')) : null,
        atividade_fisica: praticaAtividade,
        atividade_fisica_descricao: praticaAtividade ? atividadeDescricao.trim() : null,
        observacoes: observacoes.trim() || null,
      }

      const novoPaciente = await createPaciente(payload, user)
      setSuccessToast(true)

      // Aguardar brevemente para feedback visual e redirecionar para o perfil do paciente
      setTimeout(() => {
        onSuccess(novoPaciente)
      }, 1200)
    } catch (err: any) {
      console.error('Erro ao salvar paciente:', err)
      setErrorMessage(err.message || 'Erro ao cadastrar paciente. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      {/* Toast de Sucesso */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-1.5 bg-white/20 rounded-full">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Paciente cadastrado com sucesso!</p>
            <p className="text-xs text-emerald-100">Redirecionando para o perfil...</p>
          </div>
        </div>
      )}

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
            <h1 className="text-xl font-extrabold text-pink-950 font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Cadastro de Paciente
            </h1>
            <p className="text-xs text-pink-600/70">
              Preencha os dados do paciente organizados em abas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-stone-600 hover:text-pink-700"
          >
            Cancelar
          </Button>
          <Button
            variant="barbie"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                Salvar Paciente
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Conteúdo do Formulário */}
      <div className="p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto">
        {/* Banner de Erro Geral se houver */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Atenção</p>
              <p className="text-rose-700 text-xs mt-0.5">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 
          =======================================================
          BARRA DE ABAS: Pessoal, Clínico, Hábitos
          =======================================================
        */}
        <div className="flex p-1.5 bg-pink-100/60 rounded-2xl border border-pink-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('pessoal')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'pessoal'
                ? 'bg-white text-pink-900 shadow-sm border border-pink-100'
                : 'text-pink-700/80 hover:text-pink-950 hover:bg-white/40'
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === 'pessoal' ? 'text-pink-600' : 'text-pink-400'}`} />
            <span>1. Pessoal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clinico')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'clinico'
                ? 'bg-white text-pink-900 shadow-sm border border-pink-100'
                : 'text-pink-700/80 hover:text-pink-950 hover:bg-white/40'
            }`}
          >
            <Activity className={`w-4 h-4 ${activeTab === 'clinico' ? 'text-pink-600' : 'text-pink-400'}`} />
            <span>2. Clínico</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('habitos')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'habitos'
                ? 'bg-white text-pink-900 shadow-sm border border-pink-100'
                : 'text-pink-700/80 hover:text-pink-950 hover:bg-white/40'
            }`}
          >
            <Coffee className={`w-4 h-4 ${activeTab === 'habitos' ? 'text-pink-600' : 'text-pink-400'}`} />
            <span>3. Hábitos</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 
            =======================================================
            ABA 1 — PESSOAL
            - Nome completo (texto, obrigatório)
            - Data de nascimento (seletor de data — sistema calcula a idade automaticamente)
            - Sexo (seleção única: Feminino, Masculino, Outro)
            - Telefone (número formatado)
            - WhatsApp (número formatado)
            - Email (texto, formato email)
            =======================================================
          */}
          {activeTab === 'pessoal' && (
            <Card className="border border-pink-100/90 bg-white shadow-sm rounded-3xl">
              <CardHeader className="border-b border-pink-50 pb-5">
                <CardTitle className="text-lg text-pink-950 font-serif flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-500" />
                  Dados Pessoais
                </CardTitle>
                <CardDescription>
                  Informações de identificação e contato do paciente. O único campo obrigatório é o nome completo.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Nome Completo (Obrigatório) */}
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-pink-950 font-bold flex items-center justify-between">
                    <span>
                      Nome completo <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-xs font-normal text-rose-500">Único campo obrigatório</span>
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    required
                    placeholder="Ex: Maria Luísa da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="h-12 text-base rounded-xl border-pink-200"
                  />
                </div>

                {/* Linha: Data de Nascimento + Idade Calculada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento" className="text-pink-950 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        Data de nascimento
                      </span>
                      {idadeCalculada !== null && (
                        <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                          {idadeCalculada} {idadeCalculada === 1 ? 'ano' : 'anos'}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="h-12 rounded-xl border-pink-200"
                    />
                    {idadeCalculada !== null && (
                      <p className="text-[11px] text-pink-600/80">
                        Idade calculada automaticamente pelo sistema: <strong>{idadeCalculada} anos</strong>.
                      </p>
                    )}
                  </div>

                  {/* Sexo (Feminino, Masculino, Outro) */}
                  <div className="space-y-2">
                    <Label className="text-pink-950 font-semibold">Sexo</Label>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {['Feminino', 'Masculino', 'Outro'].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSexo(item)}
                          className={`h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer border flex items-center justify-center ${
                            sexo === item
                              ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                              : 'bg-pink-50/40 text-stone-700 border-pink-100 hover:bg-pink-100/60'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Linha: Contatos (Telefone, WhatsApp, Email) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Telefone */}
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-pink-950 font-semibold">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 3456-7890"
                      value={telefone}
                      onChange={handleTelefoneChange}
                      className="h-12 rounded-xl border-pink-200"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp" className="text-pink-950 font-semibold">
                        WhatsApp
                      </Label>
                      {telefone && !whatsapp && (
                        <button
                          type="button"
                          onClick={() => setWhatsapp(telefone)}
                          className="text-[11px] text-pink-600 hover:underline cursor-pointer"
                        >
                          Copiar do telefone
                        </button>
                      )}
                    </div>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={whatsapp}
                      onChange={handleWhatsappChange}
                      className="h-12 rounded-xl border-pink-200"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-pink-950 font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="paciente@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-pink-200"
                    />
                  </div>
                </div>

                {/* Botão de Avançar para próxima aba */}
                <div className="pt-4 border-t border-pink-50 flex justify-end">
                  <Button
                    type="button"
                    variant="barbie"
                    onClick={() => setActiveTab('clinico')}
                    className="rounded-xl px-6"
                  >
                    Próximo: Dados Clínicos
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 
            =======================================================
            ABA 2 — CLÍNICO
            - Peso atual em kg (número — sistema exibe "kg" automaticamente)
            - Altura em cm (número — sistema exibe "cm" automaticamente)
            - IMC (calculado automaticamente pelo sistema a partir do peso e altura, somente leitura)
            - Objetivo (múltipla escolha) + campo de texto livre adicional
            - Nível de atividade física (seleção única)
            - Patologias ou condições de saúde (múltipla escolha) + opção "Nenhum" + campo para adicionar livremente
            - Restrições alimentares (múltipla escolha) + opção "Nenhum" + campo para adicionar livremente
            - Alergias alimentares (múltipla escolha) + opção "Nenhum" + campo para adicionar livremente
            - Medicamentos contínuos (texto livre)
            - Suplementos em uso (texto livre)
            =======================================================
          */}
          {activeTab === 'clinico' && (
            <Card className="border border-pink-100/90 bg-white shadow-sm rounded-3xl">
              <CardHeader className="border-b border-pink-50 pb-5">
                <CardTitle className="text-lg text-pink-950 font-serif flex items-center gap-2">
                  <Activity className="w-5 h-5 text-pink-500" />
                  Avaliação Clínica & Objetivos
                </CardTitle>
                <CardDescription>
                  Medidas corporais, histórico médico, restrições e objetivos nutricionais.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-7">
                {/* Peso, Altura e IMC Automático */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/70 to-rose-50/40 border border-pink-100 space-y-4">
                  <div className="flex items-center gap-2 text-pink-900 font-bold text-sm">
                    <Scale className="w-4 h-4 text-pink-500" />
                    <span>Antropometria Inicial & IMC</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Peso atual */}
                    <div className="space-y-1.5">
                      <Label htmlFor="pesoAtual" className="text-xs font-semibold text-pink-950">
                        Peso atual (kg)
                      </Label>
                      <div className="relative">
                        <Input
                          id="pesoAtual"
                          type="number"
                          step="0.1"
                          min="1"
                          max="500"
                          placeholder="Ex: 68.5"
                          value={pesoAtual}
                          onChange={(e) => setPesoAtual(e.target.value)}
                          className="h-11 pr-10 rounded-xl bg-white border-pink-200"
                        />
                        <span className="absolute right-3.5 top-3 text-xs font-bold text-pink-400 pointer-events-none">
                          kg
                        </span>
                      </div>
                    </div>

                    {/* Altura */}
                    <div className="space-y-1.5">
                      <Label htmlFor="altura" className="text-xs font-semibold text-pink-950">
                        Altura (cm)
                      </Label>
                      <div className="relative">
                        <Input
                          id="altura"
                          type="number"
                          step="1"
                          min="30"
                          max="250"
                          placeholder="Ex: 168"
                          value={altura}
                          onChange={(e) => setAltura(e.target.value)}
                          className="h-11 pr-10 rounded-xl bg-white border-pink-200"
                        />
                        <span className="absolute right-3.5 top-3 text-xs font-bold text-pink-400 pointer-events-none">
                          cm
                        </span>
                      </div>
                    </div>

                    {/* IMC (Calculado automaticamente, somente leitura) */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-pink-950">
                        IMC (Calculado automaticamente)
                      </Label>
                      <div className="h-11 rounded-xl bg-white border border-pink-200/80 px-3.5 flex items-center justify-between">
                        <span className="font-extrabold text-pink-950 text-sm">
                          {imcInfo.imc ? `${imcInfo.imc} kg/m²` : '--'}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${imcInfo.corBadge}`}>
                          {imcInfo.imc ? imcInfo.classificacao : 'Aguardando peso/altura'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objetivo (Múltipla escolha + campo livre) */}
                <div className="space-y-3">
                  <Label className="text-pink-950 font-bold block">
                    Objetivo Principal (Múltipla escolha)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {objetivosDisponiveis.map((item) => {
                      const isSelected = objetivos.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleObjetivo(item)}
                          className={`p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-left flex items-center justify-between ${
                            isSelected
                              ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                              : 'bg-white text-stone-700 border-pink-100 hover:border-pink-300 hover:bg-pink-50/50'
                          }`}
                        >
                          <span>{item}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      )
                    })}
                  </div>

                  <div className="pt-1">
                    <Input
                      type="text"
                      placeholder="Detalhes ou objetivo livre adicional (Ex: Preparação para maratona, melhora do sono...)"
                      value={objetivoTexto}
                      onChange={(e) => setObjetivoTexto(e.target.value)}
                      className="rounded-xl border-pink-200 text-xs"
                    />
                  </div>
                </div>

                {/* Nível de Atividade Física (Seleção Única) */}
                <div className="space-y-2.5">
                  <Label className="text-pink-950 font-bold block">
                    Nível de Atividade Física (Seleção única)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {niveisAtividadeDisponiveis.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setNivelAtividade(item)}
                        className={`p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center ${
                          nivelAtividade === item
                            ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                            : 'bg-white text-stone-700 border-pink-100 hover:border-pink-300 hover:bg-pink-50/50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patologias ou Condições de Saúde */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-pink-950 font-bold">
                      Patologias ou Condições de Saúde
                    </Label>
                    <span className="text-[11px] text-pink-600">Selecione ou adicione livremente</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Opção Nenhum */}
                    <button
                      type="button"
                      onClick={() => togglePatologia('Nenhum')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        patologias.includes('Nenhum')
                          ? 'bg-stone-800 text-white border-stone-900 shadow-sm'
                          : 'bg-white text-stone-600 border-pink-100 hover:bg-pink-50'
                      }`}
                    >
                      Nenhum
                    </button>

                    {patologiasDisponiveis.map((item) => {
                      const isSelected = patologias.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => togglePatologia(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                              : 'bg-white text-stone-700 border-pink-100 hover:bg-pink-50'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    })}

                    {/* Chips adicionados livremente */}
                    {patologias
                      .filter((p) => p !== 'Nenhum' && !patologiasDisponiveis.includes(p))
                      .map((custom) => (
                        <span
                          key={custom}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-600 text-white flex items-center gap-1.5 shadow-sm"
                        >
                          {custom}
                          <button
                            type="button"
                            onClick={() => togglePatologia(custom)}
                            className="hover:text-rose-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>

                  {/* Input para adicionar patologia livre */}
                  <div className="flex items-center gap-2 max-w-md pt-1">
                    <Input
                      type="text"
                      placeholder="Adicionar outra patologia..."
                      value={novaPatologia}
                      onChange={(e) => setNovaPatologia(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomPatologia()
                        }
                      }}
                      className="h-9 text-xs rounded-xl border-pink-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomPatologia}
                      className="rounded-xl border-pink-200 text-pink-700 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {/* Restrições Alimentares */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-pink-950 font-bold">
                      Restrições Alimentares
                    </Label>
                    <span className="text-[11px] text-pink-600">Selecione ou adicione livremente</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRestricao('Nenhum')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        restricoes.includes('Nenhum')
                          ? 'bg-stone-800 text-white border-stone-900 shadow-sm'
                          : 'bg-white text-stone-600 border-pink-100 hover:bg-pink-50'
                      }`}
                    >
                      Nenhum
                    </button>

                    {restricoesDisponiveis.map((item) => {
                      const isSelected = restricoes.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleRestricao(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                              : 'bg-white text-stone-700 border-pink-100 hover:bg-pink-50'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    })}

                    {restricoes
                      .filter((r) => r !== 'Nenhum' && !restricoesDisponiveis.includes(r))
                      .map((custom) => (
                        <span
                          key={custom}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-600 text-white flex items-center gap-1.5 shadow-sm"
                        >
                          {custom}
                          <button
                            type="button"
                            onClick={() => toggleRestricao(custom)}
                            className="hover:text-rose-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center gap-2 max-w-md pt-1">
                    <Input
                      type="text"
                      placeholder="Adicionar outra restrição alimentar..."
                      value={novaRestricao}
                      onChange={(e) => setNovaRestricao(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomRestricao()
                        }
                      }}
                      className="h-9 text-xs rounded-xl border-pink-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomRestricao}
                      className="rounded-xl border-pink-200 text-pink-700 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {/* Alergias Alimentares */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-pink-950 font-bold">
                      Alergias Alimentares
                    </Label>
                    <span className="text-[11px] text-pink-600">Selecione ou adicione livremente</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAlergia('Nenhum')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        alergias.includes('Nenhum')
                          ? 'bg-stone-800 text-white border-stone-900 shadow-sm'
                          : 'bg-white text-stone-600 border-pink-100 hover:bg-pink-50'
                      }`}
                    >
                      Nenhum
                    </button>

                    {alergiasDisponiveis.map((item) => {
                      const isSelected = alergias.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAlergia(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-pink-500 text-white border-pink-600 shadow-sm'
                              : 'bg-white text-stone-700 border-pink-100 hover:bg-pink-50'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    })}

                    {alergias
                      .filter((a) => a !== 'Nenhum' && !alergiasDisponiveis.includes(a))
                      .map((custom) => (
                        <span
                          key={custom}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-600 text-white flex items-center gap-1.5 shadow-sm"
                        >
                          {custom}
                          <button
                            type="button"
                            onClick={() => toggleAlergia(custom)}
                            className="hover:text-rose-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center gap-2 max-w-md pt-1">
                    <Input
                      type="text"
                      placeholder="Adicionar outra alergia alimentar..."
                      value={novaAlergia}
                      onChange={(e) => setNovaAlergia(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomAlergia()
                        }
                      }}
                      className="h-9 text-xs rounded-xl border-pink-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomAlergia}
                      className="rounded-xl border-pink-200 text-pink-700 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {/* Medicamentos e Suplementos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="medicamentos" className="text-pink-950 font-semibold">
                      Medicamentos contínuos
                    </Label>
                    <textarea
                      id="medicamentos"
                      rows={3}
                      placeholder="Ex: Levotiroxina 50mcg em jejum, Losartana 50mg..."
                      value={medicamentos}
                      onChange={(e) => setMedicamentos(e.target.value)}
                      className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suplementos" className="text-pink-950 font-semibold">
                      Suplementos em uso
                    </Label>
                    <textarea
                      id="suplementos"
                      rows={3}
                      placeholder="Ex: Whey protein pós-treino, Creatina 5g, Vitamina D..."
                      value={suplementos}
                      onChange={(e) => setSuplementos(e.target.value)}
                      className="w-full rounded-xl border border-pink-200 bg-white p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Botões de Navegação */}
                <div className="pt-4 border-t border-pink-50 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('pessoal')}
                    className="rounded-xl border-pink-200 text-pink-700"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    Voltar para Pessoal
                  </Button>
                  <Button
                    type="button"
                    variant="barbie"
                    onClick={() => setActiveTab('habitos')}
                    className="rounded-xl px-6"
                  >
                    Próximo: Hábitos
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 
            =======================================================
            ABA 3 — HÁBITOS
            - Quantas refeições faz por dia (número)
            - Horário que acorda (número — sistema converte automaticamente para formato de hora, ex: 6 → "06:00", 630 → "06:30")
            - Horário que dorme (número — sistema converte automaticamente para formato de hora, ex: 23 → "23:00", 2230 → "22:30")
            - Quantidade de água por dia (número — sistema exibe "litros" automaticamente)
            - Pratica atividade física (sim/não — se sim, abre campo de texto: qual atividade e frequência semanal)
            - Observações gerais (texto livre)
            =======================================================
          */}
          {activeTab === 'habitos' && (
            <Card className="border border-pink-100/90 bg-white shadow-sm rounded-3xl">
              <CardHeader className="border-b border-pink-50 pb-5">
                <CardTitle className="text-lg text-pink-950 font-serif flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-pink-500" />
                  Rotina & Hábitos Diários
                </CardTitle>
                <CardDescription>
                  Padrões de sono, hidratação, prática de exercícios físicos e anotações gerais.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Linha: Refeições por dia e Litros de Água */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Quantas refeições faz por dia */}
                  <div className="space-y-2">
                    <Label htmlFor="refeicoesPorDia" className="text-pink-950 font-semibold">
                      Quantas refeições faz por dia
                    </Label>
                    <Input
                      id="refeicoesPorDia"
                      type="number"
                      min="1"
                      max="12"
                      placeholder="Ex: 4"
                      value={refeicoesPorDia}
                      onChange={(e) => setRefeicoesPorDia(e.target.value)}
                      className="h-12 rounded-xl border-pink-200"
                    />
                  </div>

                  {/* Quantidade de água por dia */}
                  <div className="space-y-2">
                    <Label htmlFor="litrosAgua" className="text-pink-950 font-semibold">
                      Quantidade de água por dia
                    </Label>
                    <div className="relative">
                      <Input
                        id="litrosAgua"
                        type="number"
                        step="0.5"
                        min="0"
                        max="15"
                        placeholder="Ex: 2.5"
                        value={litrosAgua}
                        onChange={(e) => setLitrosAgua(e.target.value)}
                        className="h-12 pr-14 rounded-xl border-pink-200"
                      />
                      <span className="absolute right-3.5 top-3.5 text-xs font-bold text-pink-400 pointer-events-none">
                        litros
                      </span>
                    </div>
                  </div>
                </div>

                {/* Linha: Horário que acorda e Horário que dorme (com conversão automática) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Horário que acorda */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="horarioAcorda" className="text-pink-950 font-semibold">
                        Horário que acorda
                      </Label>
                      <span className="text-[11px] text-pink-500">Ex: 6 → 06:00, 630 → 06:30</span>
                    </div>
                    <Input
                      id="horarioAcorda"
                      type="text"
                      placeholder="Ex: 6 ou 630"
                      value={horarioAcorda}
                      onChange={(e) => setHorarioAcorda(e.target.value)}
                      onBlur={handleHorarioAcordaBlur}
                      className="h-12 rounded-xl border-pink-200"
                    />
                    <p className="text-[11px] text-stone-500">
                      Digite o número; o sistema converterá automaticamente ao mudar de campo.
                    </p>
                  </div>

                  {/* Horário que dorme */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="horarioDorme" className="text-pink-950 font-semibold">
                        Horário que dorme
                      </Label>
                      <span className="text-[11px] text-pink-500">Ex: 23 → 23:00, 2230 → 22:30</span>
                    </div>
                    <Input
                      id="horarioDorme"
                      type="text"
                      placeholder="Ex: 23 ou 2230"
                      value={horarioDorme}
                      onChange={(e) => setHorarioDorme(e.target.value)}
                      onBlur={handleHorarioDormeBlur}
                      className="h-12 rounded-xl border-pink-200"
                    />
                    <p className="text-[11px] text-stone-500">
                      Digite o número; o sistema converterá automaticamente ao mudar de campo.
                    </p>
                  </div>
                </div>

                {/* Pratica Atividade Física (Sim/Não) */}
                <div className="p-5 rounded-2xl bg-pink-50/40 border border-pink-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-pink-950 font-bold block text-sm">
                        Pratica atividade física?
                      </Label>
                      <p className="text-xs text-stone-500">
                        Informe se o paciente realiza exercícios regulares atualmente
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPraticaAtividade(true)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          praticaAtividade
                            ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                            : 'bg-white text-stone-700 border-pink-100 hover:bg-pink-50'
                        }`}
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPraticaAtividade(false)
                          setAtividadeDescricao('')
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          !praticaAtividade
                            ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                            : 'bg-white text-stone-700 border-pink-100 hover:bg-pink-50'
                        }`}
                      >
                        Não
                      </button>
                    </div>
                  </div>

                  {/* Se Sim, abre campo de texto: qual atividade e frequência semanal */}
                  {praticaAtividade && (
                    <div className="pt-2 space-y-1.5 animate-in fade-in duration-200">
                      <Label htmlFor="atividadeDescricao" className="text-xs font-semibold text-pink-950">
                        Qual atividade e frequência semanal?
                      </Label>
                      <Input
                        id="atividadeDescricao"
                        type="text"
                        placeholder="Ex: Musculação 4x na semana, Corrida aos sábados..."
                        value={atividadeDescricao}
                        onChange={(e) => setAtividadeDescricao(e.target.value)}
                        className="h-11 rounded-xl bg-white border-pink-200 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Observações Gerais */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-pink-950 font-semibold">
                    Observações gerais
                  </Label>
                  <textarea
                    id="observacoes"
                    rows={4}
                    placeholder="Histórico adicional, rotina de trabalho, preferências alimentares específicas, metas de longo prazo..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    className="w-full rounded-2xl border border-pink-200 bg-white p-3.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
                  />
                </div>

                {/* Botões de Ação na Aba 3 */}
                <div className="pt-4 border-t border-pink-50 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('clinico')}
                    className="rounded-xl border-pink-200 text-pink-700"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    Voltar para Clínico
                  </Button>

                  <Button
                    type="button"
                    variant="barbie"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    className="rounded-xl px-8 shadow-md shadow-pink-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Concluir e Salvar Paciente
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}
