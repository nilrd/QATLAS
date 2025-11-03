import { create } from 'zustand'
import { QACase, QAtlasState, Status } from './types'

const STORAGE_KEY = 'qatlas:v1'

type Store = {
  data: QAtlasState
  history: QAtlasState[]
  future: QAtlasState[]
  addCase: () => void
  duplicateCase: (id: string) => void
  updateCase: (id: string, patch: Partial<QACase>) => void
  removeCase: (id: string) => void
  setStatus: (id: string, status: Status) => void
  toggleExecuted: (id: string) => void
  toggleImpedido: (id: string) => void
  toggleImpedidoUI: (id: string) => void
  removeAll: () => void
  exportCSV: () => string
  importCSV: (rows: any[], mode: 'merge'|'overwrite') => void
  generateBDD: () => string
  setTheme: (t: 'light'|'dark') => void
  setLang: (l: 'pt-BR'|'es-ES'|'en-US') => void
  undo: () => void
  redo: () => void
}

function now(){ return Date.now() }

function nextId(cases: QACase[]): string {
  const n = cases
    .map(c => Number(c.id.replace(/\D/g,'')))
    .filter(x => !Number.isNaN(x))
    .sort((a,b)=>b-a)[0] || 0
  return `CT${String(n+1).padStart(3,'0')}`
}

function save(state: QAtlasState){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function load(): QAtlasState | null {
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as QAtlasState : null
  }catch{ return null }
}

function blank(): QAtlasState{
  return {
    meta: { version: 1, theme: 'light', lang: 'pt-BR', updatedAt: new Date().toISOString() },
    cases: []
  }
}

function toCSV(state: QAtlasState): string{
  const header = ['id','titulo','modo','tipoTeste','polaridade','passos','resultadoEsperado','resultadoReal','status','executado','impedido','motivo','aptoAutomacao','responsavel','updatedAt']
  const rows = state.cases.map(c => [
    c.id,c.titulo,c.modo,c.tipoTeste,c.polaridade,(c.passos||[]).join(' | '),c.resultadoEsperado,c.resultadoReal,c.status,
    String(c.executado),String(c.impedido),c.motivo,String(c.aptoAutomacao),c.responsavel,String(c.updatedAt)
  ])
  return [header.join(','), ...rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(','))].join('\n')
}

function toBDD(state: QAtlasState): string {
  const aptos = state.cases.filter(c => c.aptoAutomacao && c.modo === 'Gherkin')
  if(aptos.length === 0) return ''
  
  let content = '# Gerado automaticamente pelo QAtlas v1.2\n\n'
  
  aptos.forEach((c, idx) => {
    if(idx > 0) content += '\n'
    content += `Feature: ${c.titulo || `Caso ${c.id}`}\n`
    if(c.tipoTeste) content += `  # Tipo: ${c.tipoTeste}\n`
    if(c.polaridade) content += `  # Polaridade: ${c.polaridade}\n`
    content += `  Scenario: ${c.resultadoEsperado || 'Descrição do cenário'}\n`
    
    const passos = c.passos || []
    if(passos.length > 0){
      passos.forEach((p, i) => {
        if(p.trim()){
          // Tenta identificar Given/When/Then baseado no conteúdo ou posição
          let prefix = 'Given'
          const lower = p.toLowerCase()
          if(lower.includes('então') || lower.includes('then') || lower.includes('resultado') || i === passos.length - 1){
            prefix = 'Then'
          } else if(lower.includes('quando') || lower.includes('when') || lower.includes('quando') || i > 0){
            prefix = 'When'
          }
          content += `    ${prefix} ${p}\n`
        }
      })
    } else {
      if(c.resultadoEsperado){
        content += `    Given pré-condição\n`
        content += `    When ação realizada\n`
        content += `    Then ${c.resultadoEsperado}\n`
      }
    }
  })
  
  return content
}

export const useStore = create<Store>((set,get)=>{
  const initial = load() ?? blank()
  function commit(updater: (s: QAtlasState)=>QAtlasState){
    const prev = get().data
    const next = updater(prev)
    const snapshot = JSON.parse(JSON.stringify(prev)) as QAtlasState
    const future: QAtlasState[] = []
    save(next)
    set({ data: next, history: [...get().history, snapshot], future })
  }
  return {
    data: initial,
    history: [],
    future: [],
    addCase(){
      commit(s=>{
        const id = nextId(s.cases)
        const c: QACase = {
          id, titulo: '', modo: 'StepByStep', tipoTeste: '', polaridade: '', passos: [],
          resultadoEsperado: '', resultadoReal: '', status: 'NAO_EXECUTADO', executado:false, impedido:false, motivo:'',
          aptoAutomacao:false, responsavel:'', updatedAt: now()
        }
        return { ...s, meta:{...s.meta, updatedAt:new Date().toISOString()}, cases:[...s.cases, c] }
      })
    },
    duplicateCase(id){
      commit(s=>{
        const src = s.cases.find(c=>c.id===id)
        if(!src) return s
        const newId = nextId(s.cases)
        const copy: QACase = { ...src, id: newId, updatedAt: now() }
        return { ...s, meta:{...s.meta, updatedAt:new Date().toISOString()}, cases:[...s.cases, copy] }
      })
    },
    removeCase(id){
      commit(s=>({ ...s, meta:{...s.meta, updatedAt:new Date().toISOString()}, cases: s.cases.filter(c=> c.id !== id) }))
    },
    updateCase(id,patch){
      commit(s=>({ ...s, meta:{...s.meta, updatedAt:new Date().toISOString()}, cases: s.cases.map(c=> c.id===id? { ...c, ...patch, updatedAt: now() }: c)}))
    },
    setStatus(id,status){
      commit(s=>({ ...s, cases: s.cases.map(c=>{
        if(c.id!==id) return c
        const executado = status==='NAO_EXECUTADO'? false : true
        const impedido = status==='IMPEDIDO'
        return { ...c, status, executado, impedido, updatedAt: now() }
      }), meta:{...s.meta, updatedAt:new Date().toISOString()} }))
    },
    toggleExecuted(id){
      commit(s=>({ ...s, cases: s.cases.map(c=>{
        if(c.id!==id) return c
        const executado = !c.executado
        const status: Status = executado && c.status==='NAO_EXECUTADO' ? 'PASSOU' : (!executado ? 'NAO_EXECUTADO' : c.status)
        return { ...c, executado, status, updatedAt: now() }
      }), meta:{...s.meta, updatedAt:new Date().toISOString()} }))
    },
    // Alterna impedido sem exigir motivo (para fluxo de UI que solicita depois)
    toggleImpedidoUI(id){
      commit(s=>({
        ...s,
        cases: s.cases.map(c=>{
          if(c.id!==id) return c
          const newImpedido = !c.impedido
          const newStatus: Status = newImpedido ? 'IMPEDIDO' : (c.executado ? c.status : 'NAO_EXECUTADO')
          return { ...c, impedido: newImpedido, status: newStatus, updatedAt: now() }
        }),
        meta:{...s.meta, updatedAt:new Date().toISOString()}
      }))
    },
    toggleImpedido(id){
      commit(s=>{
        const c = s.cases.find(x => x.id === id)!
        const newImpedido = !c.impedido
        if(newImpedido && !c.motivo.trim()){
          // Não permitir marcar como impedido sem motivo - validação será feita na UI também
          return s
        }
        return { ...s, cases: s.cases.map(c=> c.id===id? { ...c, impedido: newImpedido, status: newImpedido? 'IMPEDIDO': (c.executado? c.status : 'NAO_EXECUTADO'), updatedAt: now() }: c), meta:{...s.meta, updatedAt:new Date().toISOString()} }
      })
    },
    removeAll(){
      commit(_=>blank())
    },
    exportCSV(){ return toCSV(get().data) },
    generateBDD(){ return toBDD(get().data) },
    importCSV(rows, mode){
      commit(s=>{
        if(mode==='overwrite'){
          return { ...s, cases: rows }
        }
        const byId = new Map(s.cases.map(c=>[c.id,c]))
        for(const r of rows){
          const old = byId.get(r.id)
          if(!old || Number(r.updatedAt) > old.updatedAt){ byId.set(r.id, r) }
        }
        return { ...s, cases: Array.from(byId.values()), meta:{...s.meta, updatedAt:new Date().toISOString()} }
      })
    },
    setTheme(t){ commit(s=>({ ...s, meta:{...s.meta, theme:t, updatedAt:new Date().toISOString()} })) },
    setLang(l){ commit(s=>({ ...s, meta:{...s.meta, lang:l, updatedAt:new Date().toISOString()} })) },
    undo(){
      const hist = get().history.slice()
      if(!hist.length) return
      const prev = hist.pop()!
      const current = get().data
      save(prev)
      set({ data: prev, history: hist, future: [current, ...get().future] })
    },
    redo(){
      const fut = get().future.slice()
      if(!fut.length) return
      const next = fut.shift()!
      const current = get().data
      save(next)
      set({ data: next, history: [...get().history, current], future: fut })
    }
  }
})
