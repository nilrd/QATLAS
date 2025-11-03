import { useEffect, useState } from 'react'
import { useStore } from './state'
import { Header } from './components/Header'
import { SummaryCards } from './components/SummaryCards'
import { CaseTable } from './components/CaseTable'
import { ImportModal } from './components/ImportModal'
import { Reports } from './pages/Reports'
import { Filters } from './components/Filters'
import { ProjectsBar } from './components/ProjectsBar'
import { RequirementsBarV2 } from './components/RequirementsBarV2'
import { CasesTableV2 } from './components/CasesTableV2'
import { SummaryCardsV2 } from './components/SummaryCardsV2'
import { FiltersV2 } from './components/FiltersV2'
import { useStoreV2 } from './state_v2'

export function App(){
  const { theme, addCase, setStatus, undo, redo, langV1 } = useStore(s=>({
    theme: s.data.meta.theme,
    addCase: s.addCase,
    setStatus: s.setStatus,
    undo: s.undo,
    redo: s.redo,
    langV1: s.data.meta.lang
  }))
  const [showImport, setShowImport] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const [useV2, setUseV2] = useState(()=> {
    try{ return localStorage.getItem('qatlas:useV2') === '1' }catch{ return false }
  })
  // v2 store (for syncing theme/lang)
  const setThemeV2 = useStoreV2(s=> s.setTheme)
  const setLangV2 = useStoreV2(s=> s.setLang)

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    // keep v2 theme in sync with v1
    try{ setThemeV2(theme as any) }catch{}
  }, [theme])

  useEffect(()=>{
    try{ localStorage.setItem('qatlas:useV2', useV2? '1':'0') }catch{}
  }, [useV2])

  // keep v2 language in sync with v1
  useEffect(()=>{
    try{ setLangV2(langV1 as any) }catch{}
  }, [langV1, setLangV2])

  useEffect(()=>{
    function onKey(e: KeyboardEvent){
      // Ignorar se estiver digitando em um input/textarea/select
      const target = e.target as HTMLElement
      if(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'){
        if(e.ctrlKey && (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'r')){
          // Permitir Ctrl+S, Ctrl+B, Ctrl+R mesmo em inputs
        } else {
          return
        }
      }
      
      if(e.ctrlKey && e.key.toLowerCase()==='s'){ 
        e.preventDefault()
        const btn = document.querySelector('.actions .btn:nth-child(3)') as HTMLButtonElement
        btn?.click()
      }
      if(e.ctrlKey && e.key.toLowerCase()==='b'){ 
        e.preventDefault()
        const btn = document.querySelector('.actions .btn:nth-child(4)') as HTMLButtonElement
        btn?.click()
      }
      if(e.ctrlKey && e.key.toLowerCase()==='r'){ 
        e.preventDefault()
        setShowReports(true)
      }
      if(e.key.toLowerCase()==='n' && !e.ctrlKey && !e.altKey && !e.shiftKey){ 
        e.preventDefault()
        addCase()
      }
      if(e.ctrlKey && e.key.toLowerCase()==='z'){ 
        e.preventDefault()
        undo()
      }
      if(e.ctrlKey && e.key.toLowerCase()==='y'){ 
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [addCase, setStatus, undo, redo, setShowReports])

  return (
    <div className="container">
      <Header onShowReports={()=> setShowReports(true)} onShowImport={()=> setShowImport(true)} />
      <div style={{marginBottom:12, display:'flex', justifyContent:'flex-end'}}>
        <button className="btn" onClick={()=> setUseV2(v=>!v)}>{useV2? 'Usando v2 (preview) — Alternar v1' : 'Alternar para v2 (preview)'}</button>
      </div>
      {useV2 ? (
        <div>
          <ProjectsBar />
          <RequirementsBarV2 />
          <SummaryCardsV2 />
          <div className="filters-above-table">
            <FiltersV2 />
          </div>
          <div className="table-section">
            <CasesTableV2 />
          </div>
        </div>
      ) : (
        <div>
          <SummaryCards />
          <div className="filters-above-table">
            <Filters />
          </div>
          <div className="table-section">
            <CaseTable />
          </div>
        </div>
      )}
      {showImport && <ImportModal onClose={()=> setShowImport(false)} />}
      {showReports && <Reports onClose={()=> setShowReports(false)} />}
    </div>
  )
}
