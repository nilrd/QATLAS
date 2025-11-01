export type Status = 'PASSOU' | 'FALHOU' | 'IMPEDIDO' | 'NAO_EXECUTADO'

export interface QACase {
  id: string
  titulo: string
  modo: 'StepByStep' | 'Gherkin'
  tipoTeste: string
  polaridade: 'Positivo' | 'Negativo' | ''
  passos: string[]
  resultadoEsperado: string
  resultadoReal: string
  status: Status
  executado: boolean
  impedido: boolean
  motivo: string
  aptoAutomacao: boolean
  responsavel: string
  updatedAt: number
}

export interface QAtlasState {
  meta: { version: number; theme: 'light'|'dark'; lang: 'pt-BR'|'es-ES'|'en-US'; updatedAt: string }
  cases: QACase[]
}

