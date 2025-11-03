import { useStore } from '../state'
import { t } from '../i18n'

export function SummaryCards(){
  const { cases, lang } = useStore(s=>({ cases: s.data.cases, lang: s.data.meta.lang }))
  const total = cases.length
  const passed = cases.filter(c=>c.status==='PASSOU').length
  const failed = cases.filter(c=>c.status==='FALHOU').length
  const blocked = cases.filter(c=>c.status==='IMPEDIDO').length
  const pct = (n:number)=> total>0? Math.round((n/total)*100): 0

  return (
    <div className="row cards">
      <div className="card" onClick={()=> (window as any).__QATLAS_SET_STATUS_FILTER__?.(null)} title={t(lang,'total')}>
        <div className="title">{t(lang,'total')} 📊</div>
        <div className="value">{total}</div>
      </div>
      <div className="card passou" onClick={()=> (window as any).__QATLAS_SET_STATUS_FILTER__?.('PASSOU')} title={t(lang,'passed')}>
        <div className="title">{t(lang,'passed')} ✅</div>
        <div className="value" style={{color:'var(--success)'}}>{passed} {total>0? `(${pct(passed)}%)`: ''}</div>
      </div>
      <div className="card falhou" onClick={()=> (window as any).__QATLAS_SET_STATUS_FILTER__?.('FALHOU')} title={t(lang,'failed')}>
        <div className="title">{t(lang,'failed')} ❌</div>
        <div className="value" style={{color:'var(--error)'}}>{failed} {total>0? `(${pct(failed)}%)`: ''}</div>
      </div>
      <div className="card impedido" onClick={()=> (window as any).__QATLAS_SET_STATUS_FILTER__?.('IMPEDIDO')} title={t(lang,'blocked')}>
        <div className="title">{t(lang,'blocked')} ⚠️</div>
        <div className="value" style={{color:'var(--warning)'}}>{blocked} {total>0? `(${pct(blocked)}%)`: ''}</div>
      </div>
    </div>
  )
}


