export type RequirementType = 'Epic' | 'Story' | 'Task' | 'Bug' | 'Outro'
export type RequirementStatus = 'Draft' | 'In Progress' | 'In Review' | 'Approved'
export type TestStatusV2 = 'Not Executed' | 'Passed' | 'Failed' | 'Blocked'

export interface RequirementV2 {
  id: string
  titulo: string
  type: RequirementType
  status: RequirementStatus
  link?: string
  descricao?: string
}

export interface TestCaseV2 {
  id: string
  descricao: string
  suite: string
  tipoTeste?: string
  modo?: 'StepByStep' | 'Gherkin'
  resultadoEsperado: string
  resultadoReal?: string
  status: TestStatusV2
  executed: boolean
  aptoAutomacao?: boolean
  blockedReason?: string
  requirementId?: string
  observacao?: string
  dataCriacao: string
  dataAtualizacao: string
  steps?: string[]
  textColor?: string
  bgColor?: string
}

export interface ProjectV2 {
  id: string
  nome: string
  descricao?: string
  dataCriacao: string
  requerimentos: RequirementV2[]
  casosTeste: TestCaseV2[]
}

export interface QAtlasV2State {
  version: 2
  tema: 'light' | 'dark'
  idioma: 'pt-BR' | 'es-ES' | 'en-US'
  projetoAtivoId: string
  projetos: ProjectV2[]
}

