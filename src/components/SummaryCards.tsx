import { useStore } from '../state'
import { t } from '../i18n'

export function SummaryCards(){
  const { cases, lang } = useStore(s=>({ cases: s.data.cases, lang: s.data.meta.lang }))
  const total = cases.length
  const passed = cases.filter(c=>c.status==='PASSOU').length
  const failed = cases.filter(c=>c.status==='FALHOU').length
  const blocked = cases.filter(c=>c.status==='IMPEDIDO').length

  return (
    <div className="row">
      <div className="card">
        <div className="title">{t(lang,'total')}</div>
        <div className="value">{total}</div>
      </div>
      <div className="card passou">
        <div className="title">{t(lang,'passed')}</div>
        <div className="value" style={{color:'var(--success)'}}>{passed}</div>
      </div>
      <div className="card falhou">
        <div className="title">{t(lang,'failed')}</div>
        <div className="value" style={{color:'var(--error)'}}>{failed}</div>
      </div>
      <div className="card impedido">
        <div className="title">{t(lang,'blocked')}</div>
        <div className="value" style={{color:'var(--warning)'}}>{blocked}</div>
      </div>
    </div>
  )
}


