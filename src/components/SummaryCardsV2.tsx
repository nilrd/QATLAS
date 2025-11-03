import { useStoreV2 } from '../state_v2'
import { t2 } from '../i18n_v2'

export function SummaryCardsV2(){
  const { data } = useStoreV2(s=>({ data: s.data }))
  const p = data.projetos.find(pr=> pr.id===data.projetoAtivoId)!
  const cases = p.casosTeste
  const total = cases.length
  const passed = cases.filter(c=>c.status==='Passed').length
  const failed = cases.filter(c=>c.status==='Failed').length
  const blocked = cases.filter(c=>c.status==='Blocked').length
  const pct = (n:number)=> total>0? Math.round((n/total)*100): 0

  return (
    <div className="row cards">
      <div className="card" onClick={()=> (window as any).__QATLAS_V2_SET_STATUS_FILTER__?.(null)} title={t2(data.idioma,'total')}>
        <div className="title">{t2(data.idioma,'total')}</div>
        <div className="value">{total}</div>
      </div>
      <div className="card passou" onClick={()=> (window as any).__QATLAS_V2_SET_STATUS_FILTER__?.('Passed')} title={t2(data.idioma,'passed')}>
        <div className="title">{t2(data.idioma,'passed')}</div>
        <div className="value" style={{color:'var(--success)'}}>{passed} {total>0? `(${pct(passed)}%)`: ''}</div>
      </div>
      <div className="card falhou" onClick={()=> (window as any).__QATLAS_V2_SET_STATUS_FILTER__?.('Failed')} title={t2(data.idioma,'failed')}>
        <div className="title">{t2(data.idioma,'failed')}</div>
        <div className="value" style={{color:'var(--error)'}}>{failed} {total>0? `(${pct(failed)}%)`: ''}</div>
      </div>
      <div className="card impedido" onClick={()=> (window as any).__QATLAS_V2_SET_STATUS_FILTER__?.('Blocked')} title={t2(data.idioma,'blocked')}>
        <div className="title">{t2(data.idioma,'blocked')}</div>
        <div className="value" style={{color:'var(--warning)'}}>{blocked} {total>0? `(${pct(blocked)}%)`: ''}</div>
      </div>
    </div>
  )
}

