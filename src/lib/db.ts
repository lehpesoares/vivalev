import { neon } from '@neondatabase/serverless'

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL || ''

if (!databaseUrl) {
  console.warn('VITE_NEON_DATABASE_URL não configurada no ambiente.')
}

export const sql = neon(databaseUrl)

/**
 * Interface do Nutricionista
 */
export interface Nutricionista {
  id: string
  nome: string
  email: string
  created_at: string
}

/**
 * Interface do Paciente Completo
 */
export interface PacienteCompleto {
  id: string
  nutricionista_id: string
  nome: string
  data_nascimento?: string | null
  sexo?: string | null
  telefone?: string | null
  whatsapp?: string | null
  email?: string | null
  peso_inicial?: number | null
  altura?: number | null
  objetivos?: string[]
  objetivo_texto?: string | null
  nivel_atividade?: string | null
  patologias?: string[]
  restricoes_alimentares?: string[]
  alergias?: string[]
  medicamentos?: string | null
  suplementos?: string | null
  refeicoes_por_dia?: number | null
  horario_acorda?: string | null
  horario_dorme?: string | null
  litros_agua?: number | null
  atividade_fisica?: boolean | null
  atividade_fisica_descricao?: string | null
  observacoes?: string | null
  created_at: string
  ultima_consulta?: string | null
}

export type Paciente = PacienteCompleto

/**
 * Interface de Item de Paciente para Listagem
 */
export interface PacienteListItem {
  id: string
  nutricionista_id: string
  nome: string
  objetivos?: string[]
  objetivo_texto?: string | null
  objetivo_display: string
  ultima_consulta?: string | null
  telefone?: string | null
  whatsapp?: string | null
  email?: string | null
  created_at: string
}

/**
 * DTO para cadastro de novo paciente
 */
export interface NovoPacienteInput {
  nome: string
  data_nascimento?: string | null
  sexo?: string | null
  telefone?: string | null
  whatsapp?: string | null
  email?: string | null
  peso_inicial?: number | null
  altura?: number | null
  objetivos?: string[]
  objetivo_texto?: string | null
  nivel_atividade?: string | null
  patologias?: string[]
  restricoes_alimentares?: string[]
  alergias?: string[]
  medicamentos?: string | null
  suplementos?: string | null
  refeicoes_por_dia?: number | null
  horario_acorda?: string | null
  horario_dorme?: string | null
  litros_agua?: number | null
  atividade_fisica?: boolean | null
  atividade_fisica_descricao?: string | null
  observacoes?: string | null
}

/**
 * Interface da Consulta
 */
export interface Consulta {
  id: string
  paciente_id: string
  data_consulta: string
  peso?: number
  cintura?: number
  quadril?: number
  percentual_gordura?: number
  observacoes?: string
  proximo_retorno?: string
  created_at: string
}

/**
 * Paciente sem retorno (mais de 30 dias desde a última consulta e sem próximo retorno)
 */
export interface PacienteSemRetorno {
  id: string
  nome: string
  ultima_consulta: string
  dias_sem_consulta: number
}

/**
 * Funções utilitárias de cálculo e máscara
 */

/**
 * Calcula a idade a partir da data de nascimento (formato YYYY-MM-DD)
 */
export function calculateAge(birthDateString?: string | null): number | null {
  if (!birthDateString) return null
  const parts = birthDateString.split('-')
  if (parts.length < 3) return null
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)
  const birth = new Date(year, month, day)
  if (isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age >= 0 ? age : null
}

/**
 * Calcula o IMC a partir do peso (kg) e altura (cm)
 */
export function calculateIMC(peso?: number | null, altura?: number | null): {
  imc: number | null
  classificacao: string
  corBadge: string
} {
  if (!peso || !altura || peso <= 0 || altura <= 0) {
    return {
      imc: null,
      classificacao: 'Informe peso e altura para calcular o IMC',
      corBadge: 'bg-stone-100 text-stone-500 border-stone-200',
    }
  }

  const alturaMetros = altura / 100
  const imcRaw = peso / (alturaMetros * alturaMetros)
  const imc = Math.round(imcRaw * 10) / 10

  if (imc < 18.5) {
    return {
      imc,
      classificacao: 'Abaixo do peso',
      corBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    }
  } else if (imc < 25) {
    return {
      imc,
      classificacao: 'Peso ideal / Eutrofia',
      corBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    }
  } else if (imc < 30) {
    return {
      imc,
      classificacao: 'Sobrepeso',
      corBadge: 'bg-amber-100 text-amber-800 border-amber-300',
    }
  } else if (imc < 35) {
    return {
      imc,
      classificacao: 'Obesidade Grau I',
      corBadge: 'bg-rose-100 text-rose-800 border-rose-300',
    }
  } else if (imc < 40) {
    return {
      imc,
      classificacao: 'Obesidade Grau II',
      corBadge: 'bg-rose-200 text-rose-900 border-rose-400',
    }
  } else {
    return {
      imc,
      classificacao: 'Obesidade Grau III (Mórbida)',
      corBadge: 'bg-rose-300 text-rose-950 border-rose-500',
    }
  }
}

/**
 * Converte entradas de horário automáticas:
 * ex: 6 -> "06:00", 630 -> "06:30", 23 -> "23:00", 2230 -> "22:30"
 */
export function formatTimeInput(input: string): string {
  if (!input) return ''
  const trimmed = input.trim()
  if (!trimmed) return ''

  // Se já estiver no formato HH:MM
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [h, m] = trimmed.split(':')
    const hh = h.padStart(2, '0')
    return `${hh}:${m}`
  }

  // Apenas dígitos
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) return trimmed

  if (digits.length === 1 || digits.length === 2) {
    const num = parseInt(digits, 10)
    if (num >= 0 && num <= 23) {
      return `${digits.padStart(2, '0')}:00`
    }
  } else if (digits.length === 3) {
    // Ex: "630" -> 06:30
    const h = digits.slice(0, 1)
    const m = digits.slice(1)
    const hNum = parseInt(h, 10)
    const mNum = parseInt(m, 10)
    if (hNum <= 23 && mNum < 60) {
      return `0${h}:${m}`
    }
  } else if (digits.length === 4) {
    // Ex: "2230" -> 22:30
    const h = digits.slice(0, 2)
    const m = digits.slice(2, 4)
    const hNum = parseInt(h, 10)
    const mNum = parseInt(m, 10)
    if (hNum <= 23 && mNum < 60) {
      return `${h}:${m}`
    }
  }

  return trimmed
}

/**
 * Formata telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Garante que o nutricionista autenticado pelo Neon Auth
 * esteja devidamente registrado na tabela public.nutricionistas
 */
export async function syncNutricionista(user: { id?: string; name?: string | null; email: string }) {
  try {
    if (user.id) {
      await sql`
        INSERT INTO public.nutricionistas (id, nome, email, created_at)
        VALUES (${user.id}, ${user.name || 'Nutricionista'}, ${user.email}, now())
        ON CONFLICT (email) DO UPDATE
        SET nome = EXCLUDED.nome
      `
    } else {
      await sql`
        INSERT INTO public.nutricionistas (nome, email, created_at)
        VALUES (${user.name || 'Nutricionista'}, ${user.email}, now())
        ON CONFLICT (email) DO UPDATE
        SET nome = EXCLUDED.nome
      `
    }
  } catch (error) {
    console.error('Erro ao sincronizar nutricionista:', error)
  }
}

/**
 * Identifica o ID da nutricionista na tabela public.nutricionistas
 */
export async function getNutricionistaId(user: { id?: string; email?: string }): Promise<string | null> {
  if (!user) return null
  try {
    if (user.id) {
      const res = await sql`
        SELECT id FROM public.nutricionistas WHERE id = ${user.id} OR email = ${user.email} LIMIT 1
      `
      if (res && res.length > 0) return res[0].id
    }
    if (user.email) {
      const res = await sql`
        SELECT id FROM public.nutricionistas WHERE email = ${user.email} LIMIT 1
      `
      if (res && res.length > 0) return res[0].id
    }
  } catch (err) {
    console.error('Erro ao buscar ID da nutricionista:', err)
  }
  return null
}

/**
 * Obtém os dados do dashboard em tempo real para a nutricionista logada
 */
export async function getDashboardData(user: { id?: string; email?: string }) {
  try {
    const nutricionistaId = await getNutricionistaId(user)

    if (!nutricionistaId) {
      return {
        totalPacientes: 0,
        consultasSemana: 0,
        pacientesSemRetorno: [],
      }
    }

    // 1. Card 1: Total de pacientes ativos cadastrados pela nutricionista logada
    const totalPacientesRes = await sql`
      SELECT COUNT(*)::int AS total
      FROM public.pacientes
      WHERE nutricionista_id = ${nutricionistaId}
    `
    const totalPacientes = totalPacientesRes[0]?.total ?? 0

    // 2. Card 2: Consultas registradas na semana atual (segunda a domingo da semana corrente)
    const consultasSemanaRes = await sql`
      SELECT COUNT(*)::int AS total
      FROM public.consultas c
      INNER JOIN public.pacientes p ON c.paciente_id = p.id
      WHERE p.nutricionista_id = ${nutricionistaId}
        AND c.data_consulta >= date_trunc('week', CURRENT_DATE)
        AND c.data_consulta <= (date_trunc('week', CURRENT_DATE) + interval '6 days')
    `
    const consultasSemana = consultasSemanaRes[0]?.total ?? 0

    // 3. Card 3: Pacientes sem retorno
    const pacientesSemRetornoRes = await sql`
      WITH ultimas_consultas AS (
        SELECT 
          c.paciente_id,
          MAX(c.data_consulta) AS ultima_consulta,
          MAX(c.proximo_retorno) AS ultimo_proximo_retorno
        FROM public.consultas c
        INNER JOIN public.pacientes p ON c.paciente_id = p.id
        WHERE p.nutricionista_id = ${nutricionistaId}
        GROUP BY c.paciente_id
      )
      SELECT 
        p.id,
        p.nome,
        to_char(uc.ultima_consulta, 'DD/MM/YYYY') AS ultima_consulta,
        (CURRENT_DATE - uc.ultima_consulta)::int AS dias_sem_consulta
      FROM ultimas_consultas uc
      INNER JOIN public.pacientes p ON uc.paciente_id = p.id
      WHERE uc.ultima_consulta < (CURRENT_DATE - interval '30 days')
        AND (uc.ultimo_proximo_retorno IS NULL OR uc.ultimo_proximo_retorno <= CURRENT_DATE)
      ORDER BY uc.ultima_consulta ASC
    `

    const pacientesSemRetorno: PacienteSemRetorno[] = (pacientesSemRetornoRes || []).map((row: any) => ({
      id: row.id,
      nome: row.nome,
      ultima_consulta: row.ultima_consulta,
      dias_sem_consulta: row.dias_sem_consulta,
    }))

    return {
      totalPacientes,
      consultasSemana,
      pacientesSemRetorno,
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return {
      totalPacientes: 0,
      consultasSemana: 0,
      pacientesSemRetorno: [],
    }
  }
}

/**
 * Obtém todos os pacientes cadastrados pela nutricionista logada para a listagem
 */
export async function getPacientes(user: { id?: string; email?: string }): Promise<PacienteListItem[]> {
  try {
    const nutricionistaId = await getNutricionistaId(user)
    if (!nutricionistaId) return []

    const res = await sql`
      SELECT 
        p.id,
        p.nutricionista_id,
        p.nome,
        p.objetivos,
        p.objetivo_texto,
        p.telefone,
        p.whatsapp,
        p.email,
        p.created_at,
        to_char(MAX(c.data_consulta), 'DD/MM/YYYY') AS ultima_consulta
      FROM public.pacientes p
      LEFT JOIN public.consultas c ON c.paciente_id = p.id
      WHERE p.nutricionista_id = ${nutricionistaId}
      GROUP BY p.id
      ORDER BY p.nome ASC
    `

    return (res || []).map((row: any) => {
      const objetivosList: string[] = Array.isArray(row.objetivos) ? row.objetivos : []
      let objetivoDisplay = ''
      if (objetivosList.length > 0) {
        objetivoDisplay = objetivosList.join(', ')
        if (row.objetivo_texto) {
          objetivoDisplay += ` (${row.objetivo_texto})`
        }
      } else if (row.objetivo_texto) {
        objetivoDisplay = row.objetivo_texto
      } else {
        objetivoDisplay = 'Não informado'
      }

      return {
        id: row.id,
        nutricionista_id: row.nutricionista_id,
        nome: row.nome,
        objetivos: objetivosList,
        objetivo_texto: row.objetivo_texto,
        objetivo_display: objetivoDisplay,
        ultima_consulta: row.ultima_consulta || null,
        telefone: row.telefone,
        whatsapp: row.whatsapp,
        email: row.email,
        created_at: row.created_at,
      }
    })
  } catch (error) {
    console.error('Erro ao listar pacientes:', error)
    return []
  }
}

/**
 * Obtém os dados completos de um paciente pelo ID
 */
export async function getPacienteById(
  pacienteId: string,
  user: { id?: string; email?: string }
): Promise<PacienteCompleto | null> {
  try {
    const nutricionistaId = await getNutricionistaId(user)
    if (!nutricionistaId || !pacienteId) return null

    const res = await sql`
      SELECT 
        p.*,
        to_char(MAX(c.data_consulta), 'DD/MM/YYYY') AS ultima_consulta
      FROM public.pacientes p
      LEFT JOIN public.consultas c ON c.paciente_id = p.id
      WHERE p.id = ${pacienteId} AND p.nutricionista_id = ${nutricionistaId}
      GROUP BY p.id
      LIMIT 1
    `

    if (!res || res.length === 0) return null

    const row = res[0]
    return {
      id: row.id,
      nutricionista_id: row.nutricionista_id,
      nome: row.nome,
      data_nascimento: row.data_nascimento,
      sexo: row.sexo,
      telefone: row.telefone,
      whatsapp: row.whatsapp,
      email: row.email,
      peso_inicial: row.peso_inicial != null ? Number(row.peso_inicial) : null,
      altura: row.altura != null ? Number(row.altura) : null,
      objetivos: Array.isArray(row.objetivos) ? row.objetivos : [],
      objetivo_texto: row.objetivo_texto,
      nivel_atividade: row.nivel_atividade,
      patologias: Array.isArray(row.patologias) ? row.patologias : [],
      restricoes_alimentares: Array.isArray(row.restricoes_alimentares) ? row.restricoes_alimentares : [],
      alergias: Array.isArray(row.alergias) ? row.alergias : [],
      medicamentos: row.medicamentos,
      suplementos: row.suplementos,
      refeicoes_por_dia: row.refeicoes_por_dia != null ? Number(row.refeicoes_por_dia) : null,
      horario_acorda: row.horario_acorda,
      horario_dorme: row.horario_dorme,
      litros_agua: row.litros_agua != null ? Number(row.litros_agua) : null,
      atividade_fisica: row.atividade_fisica,
      atividade_fisica_descricao: row.atividade_fisica_descricao,
      observacoes: row.observacoes,
      created_at: row.created_at,
      ultima_consulta: row.ultima_consulta || null,
    }
  } catch (error) {
    console.error('Erro ao buscar paciente:', error)
    return null
  }
}

/**
 * Cadastra um novo paciente vinculado à nutricionista logada
 */
export async function createPaciente(
  data: NovoPacienteInput,
  user: { id?: string; email?: string }
): Promise<PacienteCompleto> {
  const nutricionistaId = await getNutricionistaId(user)
  if (!nutricionistaId) {
    throw new Error('Nutricionista não autenticada no banco de dados.')
  }

  if (!data.nome || !data.nome.trim()) {
    throw new Error('O campo Nome completo é obrigatório.')
  }

  const objetivosArr = data.objetivos && data.objetivos.length > 0 ? data.objetivos : []
  const patologiasArr = data.patologias && data.patologias.length > 0 ? data.patologias : []
  const restricoesArr = data.restricoes_alimentares && data.restricoes_alimentares.length > 0 ? data.restricoes_alimentares : []
  const alergiasArr = data.alergias && data.alergias.length > 0 ? data.alergias : []

  const res = await sql`
    INSERT INTO public.pacientes (
      nutricionista_id,
      nome,
      data_nascimento,
      sexo,
      telefone,
      whatsapp,
      email,
      peso_inicial,
      altura,
      objetivos,
      objetivo_texto,
      nivel_atividade,
      patologias,
      restricoes_alimentares,
      alergias,
      medicamentos,
      suplementos,
      refeicoes_por_dia,
      horario_acorda,
      horario_dorme,
      litros_agua,
      atividade_fisica,
      atividade_fisica_descricao,
      observacoes
    ) VALUES (
      ${nutricionistaId},
      ${data.nome.trim()},
      ${data.data_nascimento || null},
      ${data.sexo || null},
      ${data.telefone || null},
      ${data.whatsapp || null},
      ${data.email || null},
      ${data.peso_inicial != null && !isNaN(Number(data.peso_inicial)) ? Number(data.peso_inicial) : null},
      ${data.altura != null && !isNaN(Number(data.altura)) ? Number(data.altura) : null},
      ${objetivosArr},
      ${data.objetivo_texto || null},
      ${data.nivel_atividade || null},
      ${patologiasArr},
      ${restricoesArr},
      ${alergiasArr},
      ${data.medicamentos || null},
      ${data.suplementos || null},
      ${data.refeicoes_por_dia != null && !isNaN(Number(data.refeicoes_por_dia)) ? Number(data.refeicoes_por_dia) : null},
      ${data.horario_acorda || null},
      ${data.horario_dorme || null},
      ${data.litros_agua != null && !isNaN(Number(data.litros_agua)) ? Number(data.litros_agua) : null},
      ${data.atividade_fisica ?? null},
      ${data.atividade_fisica_descricao || null},
      ${data.observacoes || null}
    )
    RETURNING *;
  `

  if (!res || res.length === 0) {
    throw new Error('Erro ao salvar paciente no banco de dados.')
  }

  const row = res[0]
  return {
    id: row.id,
    nutricionista_id: row.nutricionista_id,
    nome: row.nome,
    data_nascimento: row.data_nascimento,
    sexo: row.sexo,
    telefone: row.telefone,
    whatsapp: row.whatsapp,
    email: row.email,
    peso_inicial: row.peso_inicial != null ? Number(row.peso_inicial) : null,
    altura: row.altura != null ? Number(row.altura) : null,
    objetivos: Array.isArray(row.objetivos) ? row.objetivos : [],
    objetivo_texto: row.objetivo_texto,
    nivel_atividade: row.nivel_atividade,
    patologias: Array.isArray(row.patologias) ? row.patologias : [],
    restricoes_alimentares: Array.isArray(row.restricoes_alimentares) ? row.restricoes_alimentares : [],
    alergias: Array.isArray(row.alergias) ? row.alergias : [],
    medicamentos: row.medicamentos,
    suplementos: row.suplementos,
    refeicoes_por_dia: row.refeicoes_por_dia != null ? Number(row.refeicoes_por_dia) : null,
    horario_acorda: row.horario_acorda,
    horario_dorme: row.horario_dorme,
    litros_agua: row.litros_agua != null ? Number(row.litros_agua) : null,
    atividade_fisica: row.atividade_fisica,
    atividade_fisica_descricao: row.atividade_fisica_descricao,
    observacoes: row.observacoes,
    created_at: row.created_at,
    ultima_consulta: null,
  }
}
