import { useState } from 'react'
import { useStore } from '../state'
import { Status, QACase } from '../types'
import { t } from '../i18n'

function StatusChip({ s, lang }: { s: Status; lang: string }){
  const map: any = { PASSOU:'passou', FALHOU:'falhou', IMPEDIDO:'impedido', NAO_EXECUTADO:'nao' }
  const keyMap: Record<Status, string> = { PASSOU:'passou', FALHOU:'falhou', IMPEDIDO:'impedido', NAO_EXECUTADO:'naoExecutado' }
  const label = t(lang as any, keyMap[s])
  return <span className={`chip ${map[s]}`}>{label}</span>
}

function PassosEditor({ case: c, updateCase, lang }: { case: QACase; updateCase: (id: string, patch: Partial<QACase>) => void; lang: string }){
  const [expanded, setExpanded] = useState(false)
  const passos = c.passos || []
  
  function addPasso(){
    updateCase(c.id, { passos: [...passos, ''] })
  }
  
  function removePasso(idx: number){
    updateCase(c.id, { passos: passos.filter((_, i) => i !== idx) })
  }
  
  function updatePasso(idx: number, value: string){
    const newPassos = [...passos]
    newPassos[idx] = value
    updateCase(c.id, { passos: newPassos })
  }
  
  if(!expanded){
    return (
      <div>
        <button type="button" className="btn" style={{fontSize:12}} onClick={()=> setExpanded(true)}>
          {passos.length} {passos.length===1 ? t(lang as any,'stepsCount') : t(lang as any,'stepsCountPlural')} {passos.length>0?'▼':'+'}
        </button>
      </div>
    )
  }
  
  return (
    <div style={{minWidth:250}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
        <strong style={{fontSize:12}}>{t(lang as any,'steps')}:</strong>
        <div>
          <button type="button" className="btn" style={{fontSize:10, padding:'2px 6px'}} onClick={addPasso}>+</button>
          <button type="button" className="btn" style={{fontSize:10, padding:'2px 6px', marginLeft:4}} onClick={()=> setExpanded(false)}>▲</button>
        </div>
      </div>
      {passos.map((p, idx) => (
        <div key={idx} style={{display:'flex', gap:4, marginBottom:4}}>
          <input 
            value={p} 
            onChange={e=> updatePasso(idx, e.target.value)} 
            placeholder={`${t(lang as any,'steps')} ${idx+1}`}
            style={{flex:1, fontSize:12}}
          />
          <button type="button" className="btn" style={{fontSize:10, padding:'2px 6px'}} onClick={()=> removePasso(idx)}>-</button>
        </div>
      ))}
      {passos.length === 0 && (
        <button type="button" className="btn" style={{fontSize:12, width:'100%'}} onClick={addPasso}>+ {t(lang as any,'addStep')}</button>
      )}
    </div>
  )
}

export function CaseTable(){
  const { cases, updateCase, removeCase, setStatus, toggleExecuted, toggleImpedido, addCase, lang } = useStore(s=>({
    cases: (window as any).__QATLAS_FILTERED__ ?? s.data.cases,
    updateCase: s.updateCase,
    removeCase: s.removeCase,
    setStatus: s.setStatus,
    toggleExecuted: s.toggleExecuted,
    toggleImpedido: s.toggleImpedido,
    addCase: s.addCase,
    lang: s.data.meta.lang
  }))

  function handleStatusChange(id: string, status: Status){
    const c = cases.find(x => x.id === id)!
    // Validações
    if(status === 'FALHOU' && !c.resultadoReal.trim()){
      alert(t(lang, 'validationFailedNoResult'))
      return
    }
    if(status === 'IMPEDIDO' && !c.motivo.trim()){
      alert(t(lang, 'validationImpededNoReason'))
      return
    }
    setStatus(id, status)
  }

  function handleModoChange(id: string, modo: 'StepByStep'|'Gherkin'){
    const c = cases.find(x => x.id === id)!
    updateCase(id, { modo })
    // Se mudou para StepByStep e estava apto para automação, desmarcar
    if(modo === 'StepByStep' && c.aptoAutomacao){
      updateCase(id, { aptoAutomacao: false })
    }
  }

  function handleAptoAutomacaoChange(id: string, apto: boolean){
    const c = cases.find(x => x.id === id)!
    if(apto && c.modo !== 'Gherkin'){
      alert(t(lang, 'validationAutomationOnlyGherkin'))
      return
    }
    updateCase(id, { aptoAutomacao: apto })
  }

  // Funções para interatividade da tabela
  const [resizing, setResizing] = useState<{col: number, startX: number, startWidth: number} | null>(null);
  
  function handleColumnResizeStart(e: React.MouseEvent, colIndex: number) {
    const th = e.currentTarget as HTMLTableHeaderCellElement;
    setResizing({
      col: colIndex,
      startX: e.pageX,
      startWidth: th.offsetWidth
    });
  }

  function handleColumnResize(e: React.MouseEvent) {
    if (!resizing) return;
    
    const delta = e.pageX - resizing.startX;
    const newWidth = Math.max(100, resizing.startWidth + delta);
    
    const th = document.querySelector(`th:nth-child(${resizing.col + 1})`) as HTMLTableHeaderCellElement;
    if (th) {
      th.style.width = `${newWidth}px`;
    }
  }

  function handleColumnResizeEnd() {
    setResizing(null);
  }

  return (
    <div>
      <div 
        style={{overflowX:'auto'}} 
        onMouseMove={handleColumnResize}
        onMouseUp={handleColumnResizeEnd}
        onMouseLeave={handleColumnResizeEnd}
      >
        <table className="qa-table">
          <thead>
            <tr>
              <th 
                onMouseDown={(e) => handleColumnResizeStart(e, 0)}
                style={{width: '80px'}}
              >
                {t(lang,'caseNumber')}
              </th>
              <th 
                onMouseDown={(e) => handleColumnResizeStart(e, 1)}
                style={{width: '200px'}}
              >
                {t(lang,'case')}
              </th>
              <th 
                onMouseDown={(e) => handleColumnResizeStart(e, 2)}
                style={{width: '120px'}}
              >{t(lang,'mode')}</th>
              <th>{t(lang,'testType')}</th>
              <th>{t(lang,'polarity')}</th>
              <th>{t(lang,'steps')}</th>
              <th>{t(lang,'expected')}</th>
              <th>{t(lang,'actual')}</th>
              <th>{t(lang,'status')}</th>
              <th>{t(lang,'executed')}</th>
              <th>{t(lang,'impeded')}</th>
              <th>{t(lang,'reason')}</th>
              <th>{t(lang,'automationReady')}</th>
              <th>{t(lang,'responsible')}</th>
              <th>{t(lang,'updatedAt')}</th>
              <th>{t(lang,'actions')}</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c=> (
              <tr key={c.id}>
                <td><b>{c.id}</b></td>
                <td><input value={c.titulo} onChange={e=> updateCase(c.id,{ titulo: e.target.value })} placeholder={t(lang,'placeholderCase')}/></td>
                <td>
                  <select value={c.modo} onChange={e=> handleModoChange(c.id, e.target.value as any)} style={{minWidth:110}}>
                    <option value="StepByStep">{t(lang,'stepByStep')}</option>
                    <option value="Gherkin">{t(lang,'gherkin')}</option>
                  </select>
                </td>
                <td>
                  <input 
                    value={c.tipoTeste} 
                    onChange={e=> updateCase(c.id,{ tipoTeste: e.target.value })} 
                    placeholder={t(lang,'placeholderTestType')}
                    list={`tipo-${c.id}`}
                  />
                  <datalist id={`tipo-${c.id}`}>
                    <option value="Funcional"/>
                    <option value="Regressão"/>
                    <option value="Integração"/>
                    <option value="Performance"/>
                    <option value="Usabilidade"/>
                  </datalist>
                </td>
                <td>
                  <select value={c.polaridade} onChange={e=> updateCase(c.id,{ polaridade: e.target.value as any })}>
                    <option value="">—</option>
                    <option value="Positivo">{t(lang,'positive')}</option>
                    <option value="Negativo">{t(lang,'negative')}</option>
                  </select>
                </td>
                <td><PassosEditor case={c} updateCase={updateCase} lang={lang} /></td>
                <td><input value={c.resultadoEsperado} onChange={e=> updateCase(c.id,{ resultadoEsperado: e.target.value })}/></td>
                <td><input value={c.resultadoReal} onChange={e=> updateCase(c.id,{ resultadoReal: e.target.value })}/></td>
                <td>
                  <select value={c.status} onChange={e=> handleStatusChange(c.id, e.target.value as Status)}>
                    <option value="PASSOU">{t(lang,'passou')}</option>
                    <option value="FALHOU">{t(lang,'falhou')}</option>
                    <option value="IMPEDIDO">{t(lang,'impedido')}</option>
                    <option value="NAO_EXECUTADO">{t(lang,'naoExecutado')}</option>
                  </select>
                  <div style={{marginTop:6}}><StatusChip s={c.status} lang={lang}/></div>
                </td>
                <td><input type="checkbox" checked={c.executado} onChange={()=> toggleExecuted(c.id)} /></td>
                <td>
                  <input 
                    type="checkbox" 
                    checked={c.impedido} 
                    onChange={()=> {
                      if(!c.impedido && !c.motivo.trim()){
                        alert(t(lang,'validationImpededBeforeReason'))
                        return
                      }
                      toggleImpedido(c.id)
                    }} 
                  />
                </td>
                <td><input value={c.motivo} onChange={e=> updateCase(c.id,{ motivo: e.target.value })} placeholder={t(lang,'placeholderReason')}/></td>
                <td>
                  <input 
                    type="checkbox" 
                    checked={c.aptoAutomacao} 
                    disabled={c.modo !== 'Gherkin'}
                    onChange={e=> handleAptoAutomacaoChange(c.id, e.target.checked)}
                    title={c.modo !== 'Gherkin' ? t(lang,'validationAutomationOnlyGherkin') : ''}
                  />
                </td>
                <td><input value={c.responsavel} onChange={e=> updateCase(c.id,{ responsavel: e.target.value })}/></td>
                <td>{new Date(c.updatedAt).toLocaleString()}</td>
                <td>
                  <button 
                    className="btn delete-btn" 
                    onClick={()=> {
                      if(confirm(t(lang,'deleteConfirm'))){
                        removeCase(c.id)
                      }
                    }}
                    title={t(lang,'deleteCase')}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={17}>
                <button className="btn" onClick={addCase}>{t(lang,'newCaseButton')}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="footer">
        <div>{cases.length} {t(lang,'rowsCount')}</div>
        <div>{t(lang,'shortcuts')}</div>
      </div>
    </div>
  )
}


