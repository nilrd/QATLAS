import { create } from 'zustand'
import type { QAtlasV2State, ProjectV2, TestCaseV2, TestStatusV2, RequirementV2 } from './types_v2'

const STORAGE_KEY_V2 = 'qatlas:v2'
const STORAGE_KEY_V1 = 'qatlas:v1'

function pad3(n: number){ return String(n).padStart(3,'0') }
function makeCaseId(i: number){ return `CT${pad3(i)}` }

function renumberCases(cases: TestCaseV2[]): TestCaseV2[]{
  const sorted = [...cases].sort((a,b)=> a.id.localeCompare(b.id, undefined, { numeric:true }))
  return sorted.map((c, idx) => ({ ...c, id: makeCaseId(idx+1) }))
}

function blankProject(): ProjectV2{
  const now = new Date().toISOString()
  return { id: 'PRJ-1', nome: 'Meu Projeto', dataCriacao: now, requerimentos: [], casosTeste: [] }
}

function blankState(): QAtlasV2State{
  const proj = blankProject()
  return { version: 2, tema: 'light', idioma: 'pt-BR', projetoAtivoId: proj.id, projetos: [proj] }
}

// Normalize any older/corrupted keys to the canonical ones
function normRequirement(r: any): RequirementV2{
  return {
    id: r.id,
    titulo: r.titulo ?? r['t��tulo'] ?? r['título'] ?? '',
    type: r.type,
    status: r.status,
    link: r.link,
    descricao: r.descricao ?? r['descri��ǜo'] ?? r['descrição']
  }
}

function normCase(c: any): TestCaseV2{
  return {
    id: c.id,
    descricao: c.descricao ?? c['descri��ǜo'] ?? c['descrição'] ?? '',
    suite: c.suite ?? '',
    tipoTeste: c.tipoTeste,
    resultadoEsperado: c.resultadoEsperado ?? '',
    resultadoReal: c.resultadoReal,
    status: c.status,
    executed: !!c.executed,
    aptoAutomacao: !!c.aptoAutomacao,
    blockedReason: c.blockedReason || c.motivo,
    requirementId: c.requirementId,
    observacao: c.observacao,
    dataCriacao: c.dataCriacao ?? c['dataCria��ǜo'] ?? c['dataCriação'] ?? new Date().toISOString(),
    dataAtualizacao: c.dataAtualizacao ?? c['dataAtualiza��ǜo'] ?? c['dataAtualização'] ?? new Date().toISOString(),
    steps: Array.isArray(c.steps)? c.steps : Array.isArray(c.passos)? c.passos : [],
    textColor: c.textColor,
    bgColor: c.bgColor,
  }
}

function normalizeV2(raw: any): QAtlasV2State | null{
  if(!raw || typeof raw !== 'object') return null
  try{
    const projetos: ProjectV2[] = (raw.projetos || []).map((p: any)=> ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao ?? p['descri��ǜo'],
      dataCriacao: p.dataCriacao ?? p['dataCria��ǜo'] ?? p['dataCriação'] ?? new Date().toISOString(),
      requerimentos: (p.requerimentos || []).map(normRequirement),
      casosTeste: (p.casosTeste || []).map(normCase),
    }))
    return {
      version: 2,
      tema: raw.tema ?? 'light',
      idioma: raw.idioma ?? 'pt-BR',
      projetoAtivoId: raw.projetoAtivoId ?? (projetos[0]?.id || 'PRJ-1'),
      projetos
    }
  }catch{
    return null
  }
}

function loadV2(): QAtlasV2State | null{
  try{
    const raw = localStorage.getItem(STORAGE_KEY_V2)
    if(!raw) return null
    const parsed = JSON.parse(raw)
    return normalizeV2(parsed)
  }catch{ return null }
}

// v1 types for migration
type V1Case = {
  id: string
  titulo: string
  modo: 'StepByStep' | 'Gherkin'
  tipoTeste: string
  polaridade: string
  passos: string[]
  resultadoEsperado: string
  resultadoReal: string
  status: 'PASSOU' | 'FALHOU' | 'IMPEDIDO' | 'NAO_EXECUTADO'
  executado: boolean
  impedido: boolean
  motivo: string
  aptoAutomacao: boolean
  responsavel: string
  updatedAt: number
}

type V1State = { meta: { theme: 'light'|'dark'; lang: 'pt-BR'|'es-ES'|'en-US' }, cases: V1Case[] }

function migrateV1toV2(): QAtlasV2State | null{
  try{
    const raw = localStorage.getItem(STORAGE_KEY_V1)
    if(!raw) return null
    const v1 = JSON.parse(raw) as V1State
    const now = new Date().toISOString()
    const mapStatus = (s: V1Case['status']): TestStatusV2 => s==='PASSOU'? 'Passed' : s==='FALHOU'? 'Failed' : s==='IMPEDIDO'? 'Blocked' : 'Not Executed'
    const cases: TestCaseV2[] = v1.cases.map((c)=> ({
      id: c.id,
      descricao: c.titulo || '',
      suite: c.tipoTeste || '',
      tipoTeste: c.tipoTeste || '',
      resultadoEsperado: c.resultadoEsperado || '',
      resultadoReal: c.resultadoReal || '',
      status: mapStatus(c.status),
      executed: !!c.executado,
      aptoAutomacao: !!c.aptoAutomacao,
      blockedReason: c.motivo || undefined,
      requirementId: undefined,
      observacao: '',
      dataCriacao: new Date(c.updatedAt || Date.now()).toISOString(),
      dataAtualizacao: new Date(c.updatedAt || Date.now()).toISOString(),
      steps: Array.isArray(c.passos)? c.passos : [],
      textColor: undefined,
      bgColor: undefined,
    }))
    const proj: ProjectV2 = { id: 'PRJ-1', nome: 'Meu Projeto', dataCriacao: now, requerimentos: [], casosTeste: renumberCases(cases) }
    return { version: 2, tema: v1.meta?.theme || 'light', idioma: v1.meta?.lang || 'pt-BR', projetoAtivoId: 'PRJ-1', projetos: [proj] }
  }catch{ return null }
}

function saveV2(state: QAtlasV2State){ localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state)) }

type StoreV2 = {
  data: QAtlasV2State
  addProject: (nome: string) => void
  selectProject: (id: string) => void
  addRequirement: (req: Omit<RequirementV2,'id'>) => void
  updateRequirement: (id: string, patch: Partial<RequirementV2>) => void
  removeRequirement: (id: string) => void
  addTestCase: (partial?: Partial<TestCaseV2>) => void
  duplicateTestCase: (id: string) => void
  updateTestCase: (id: string, patch: Partial<TestCaseV2>) => void
  removeTestCase: (id: string) => void
  setCaseStatus: (id: string, status: TestStatusV2) => void
  setTheme: (t: 'light'|'dark') => void
  setLang: (l: 'pt-BR'|'es-ES'|'en-US') => void
}

export const useStoreV2 = create<StoreV2>((set,get)=>{
  const initial = loadV2() ?? migrateV1toV2() ?? blankState()
  function commit(updater: (s: QAtlasV2State)=>QAtlasV2State){
    const next = updater(get().data)
    saveV2(next)
    set({ data: next })
  }
  function activeProject(s: QAtlasV2State): ProjectV2{
    return s.projetos.find(p=>p.id===s.projetoAtivoId) || s.projetos[0]
  }
  return {
    data: initial,
    addProject(nome){
      commit(s=>{
        const id = `PRJ-${s.projetos.length+1}`
        const p: ProjectV2 = { id, nome, dataCriacao: new Date().toISOString(), requerimentos: [], casosTeste: [] }
        return { ...s, projetos: [...s.projetos, p], projetoAtivoId: id }
      })
    },
    selectProject(id){ commit(s=> ({ ...s, projetoAtivoId: id })) },
    addRequirement(req){
      commit(s=>{
        const p = activeProject(s)
        const id = `RQ${String(p.requerimentos.length+1).padStart(3,'0')}`
        const updated: ProjectV2 = { ...p, requerimentos: [...p.requerimentos, { id, ...req }] }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    updateRequirement(id, patch){
      commit(s=>{
        const p = activeProject(s)
        const reqs = p.requerimentos.map(r=> r.id===id? { ...r, ...patch }: r)
        const updated: ProjectV2 = { ...p, requerimentos: reqs }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    removeRequirement(id){
      commit(s=>{
        const p = activeProject(s)
        const reqs = p.requerimentos.filter(r=> r.id!==id)
        const cases = p.casosTeste.map(c=> c.requirementId===id? { ...c, requirementId: undefined }: c)
        const updated: ProjectV2 = { ...p, requerimentos: reqs, casosTeste: cases }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    addTestCase(partial){
      commit(s=>{
        const p = activeProject(s)
        const idx = p.casosTeste.length + 1
        const now = new Date().toISOString()
        const tc: TestCaseV2 = {
          id: makeCaseId(idx),
          descricao: '',
          suite: '',
          tipoTeste: '',
          resultadoEsperado: '',
          resultadoReal: '',
          status: 'Not Executed',
          executed: false,
          aptoAutomacao: false,
          blockedReason: undefined,
          requirementId: undefined,
          observacao: '',
          dataCriacao: now,
          dataAtualizacao: now,
          steps: [],
          textColor: undefined,
          bgColor: undefined,
          ...partial
        }
        const updated: ProjectV2 = { ...p, casosTeste: [...p.casosTeste, tc] }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    duplicateTestCase(id){
      commit(s=>{
        const p = activeProject(s)
        const src = p.casosTeste.find(c=> c.id===id)
        if(!src) return s
        const copy: TestCaseV2 = { ...src, id: makeCaseId(p.casosTeste.length+1), dataCriacao: new Date().toISOString(), dataAtualizacao: new Date().toISOString() }
        const updated: ProjectV2 = { ...p, casosTeste: [...p.casosTeste, copy] }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    updateTestCase(id, patch){
      commit(s=>{
        const p = activeProject(s)
        const cases = p.casosTeste.map(c=> c.id===id? { ...c, ...patch, dataAtualizacao: new Date().toISOString() }: c)
        const updated: ProjectV2 = { ...p, casosTeste: cases }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    removeTestCase(id){
      commit(s=>{
        const p = activeProject(s)
        const remaining = p.casosTeste.filter(c=> c.id!==id)
        const renum = renumberCases(remaining)
        const updated: ProjectV2 = { ...p, casosTeste: renum }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    setCaseStatus(id, status){
      commit(s=>{
        const p = activeProject(s)
        const cases = p.casosTeste.map(c=>{
          if(c.id!==id) return c
          if(status==='Blocked' && !c.blockedReason){
            return c
          }
          return { ...c, status, executed: status!=='Not Executed', dataAtualizacao: new Date().toISOString() }
        })
        const updated: ProjectV2 = { ...p, casosTeste: cases }
        return { ...s, projetos: s.projetos.map(x=> x.id===p.id? updated: x) }
      })
    },
    setTheme(t){ commit(s=> ({ ...s, tema: t })) },
    setLang(l){ commit(s=> ({ ...s, idioma: l })) },
  }
})
