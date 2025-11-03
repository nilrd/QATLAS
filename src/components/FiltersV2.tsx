import { useMemo, useState } from 'react'
import { useStoreV2 } from '../state_v2'
import { t2 } from '../i18n_v2'

export function FiltersV2(){
  const { data } = useStoreV2(s=>({ data: s.data }))
  const p = data.projetos.find(pr=> pr.id===data.projetoAtivoId)!
  const [status, setStatus] = useState<string>('')
  const [suite, setSuite] = useState<string>('')
  const [req, setReq] = useState<string>('')
  const [text, setText] = useState<string>('')

  const filtered = useMemo(()=>{
    return p.casosTeste
      .filter(c=> status? c.status===status as any : true)
      .filter(c=> suite? (c.suite||'').toLowerCase().includes(suite.toLowerCase()) : true)
      .filter(c=> req? c.requirementId===req : true)
      .filter(c=> text? [c.id, ((c as any).descricao ?? (c as any)['descri��ǜo'] ?? ''), c.resultadoEsperado, (c.resultadoReal||'')].join(' ').toLowerCase().includes(text.toLowerCase()) : true)
  }, [p.casosTeste, status, suite, req, text])

  ;(window as any).__QATLAS_V2_FILTERED__ = filtered
  ;(window as any).__QATLAS_V2_SET_STATUS_FILTER__ = (value: string | null) => {
    setStatus(value || '')
    try{ document.querySelector('.qa-table')?.scrollIntoView({ behavior:'smooth', block:'start' }) }catch{}
  }

  return (
    <div className="filters-bar">
      <input className="btn search-input" placeholder={t2(data.idioma,'searchCases')} value={text} onChange={e=> setText(e.target.value)} />
      <select className="btn" value={status} onChange={e=> setStatus(e.target.value)} title={t2(data.idioma,'status')}>
        <option value="">{t2(data.idioma,'allStatus')}</option>
        <option>Not Executed</option>
        <option>Passed</option>
        <option>Failed</option>
        <option>Blocked</option>
      </select>
      <input className="btn" placeholder={t2(data.idioma,'suite')} value={suite} onChange={e=> setSuite(e.target.value)} />
      <select className="btn" value={req} onChange={e=> setReq(e.target.value)} title={t2(data.idioma,'requirement')}>
        <option value="">{t2(data.idioma,'allRequirements')}</option>
        {p.requerimentos.map(r=> <option key={r.id} value={r.id}>{r.id} — {(r as any).titulo ?? (r as any)['t��tulo']}</option>)}
      </select>
      <button className="btn" onClick={()=> { setStatus(''); setSuite(''); setReq(''); setText('') }}>↺ {t2(data.idioma,'clearFiltersEN')}</button>
    </div>
  )
}

