import { useEffect, useState } from 'react'
import { useStore } from './state'
import { Header } from './components/Header'
import { SummaryCards } from './components/SummaryCards'
import { CaseTable } from './components/CaseTable'
import { ImportModal } from './components/ImportModal'
import { Reports } from './pages/Reports'
import { Filters } from './components/Filters'

export function App(){
  const { theme, addCase, setStatus, undo, redo } = useStore(s=>({
    theme: s.data.meta.theme,
    addCase: s.addCase,
    setStatus: s.setStatus,
    undo: s.undo,
    redo: s.redo
  }))
  const [showImport, setShowImport] = useState(false)
  const [showReports, setShowReports] = useState(false)

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

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
      <SummaryCards />
      <div className="filters-above-table">
        <Filters />
      </div>
      <div className="table-section">
        <CaseTable />
      </div>
      {showImport && <ImportModal onClose={()=> setShowImport(false)} />}
      {showReports && <Reports onClose={()=> setShowReports(false)} />}
    </div>
  )
}
