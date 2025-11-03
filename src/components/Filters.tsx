import { useMemo, useState } from 'react'
import { useStore } from '../state'
import { t } from '../i18n'

export function Filters(){
  const { cases, updateCase, lang } = useStore(s=>({ cases: s.data.cases, updateCase: s.updateCase, lang: s.data.meta.lang }))
  const [status, setStatus] = useState<string>('')
  const [tipoTeste, setTipoTeste] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [text, setText] = useState<string>('')

  const tiposUnicos = useMemo(()=>{
    const tipos = new Set(cases.map(c=>c.tipoTeste).filter(Boolean))
    return Array.from(tipos).sort()
  }, [cases])

  const filtered = useMemo(()=>{
    return cases
      .filter(c=> status? c.status===status as any : true)
      .filter(c=> tipoTeste? c.tipoTeste===tipoTeste : true)
      .filter(c=> owner? (c.responsavel||'').toLowerCase().includes(owner.toLowerCase()) : true)
      .filter(c=> text? [c.id,c.titulo,c.resultadoEsperado,c.resultadoReal].join(' ').toLowerCase().includes(text.toLowerCase()) : true)
  }, [cases, status, tipoTeste, owner, text])

  // Expor resultado via window para CaseTable simples consumir (evita refactor maior)
  ;(window as any).__QATLAS_FILTERED__ = filtered

  // Permitir que cards/resumo disparem filtros diretamente
  ;(window as any).__QATLAS_SET_STATUS_FILTER__ = (value: string | null) => {
    setStatus(value || '')
    // foco visual pode mover o scroll para a tabela se desejado
    try { document.querySelector('.qa-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch {}
  }

  return (
    <div className="filters-bar">
      <input 
        className="btn search-input" 
        placeholder={t(lang,'searchText')} 
        value={text} 
        onChange={e=> setText(e.target.value)} 
      />

      <select className="btn" value={status} onChange={e=> setStatus(e.target.value)} title={t(lang,'status')}>
        <option value="">{t(lang,'allStatus')}</option>
        <option value="PASSOU">{t(lang,'passou')}</option>
        <option value="FALHOU">{t(lang,'falhou')}</option>
        <option value="IMPEDIDO">{t(lang,'impedido')}</option>
        <option value="NAO_EXECUTADO">{t(lang,'naoExecutado')}</option>
      </select>

      {tiposUnicos.length > 0 && (
        <select className="btn" value={tipoTeste} onChange={e=> setTipoTeste(e.target.value)} title={t(lang,'testType')}>
          <option value="">{t(lang,'allTypes')}</option>
          {tiposUnicos.map(tipo=> <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
      )}

      <input 
        className="btn" 
        placeholder={t(lang,'responsible')} 
        value={owner} 
        onChange={e=> setOwner(e.target.value)} 
        title={t(lang,'responsible')}
      />

      {(status || tipoTeste || owner || text) && (
        <div className="chips-row" aria-label="Filtros ativos">
          {status && (
            <span className="chip" title={t(lang,'status')}>
              {t(lang,
                status==='PASSOU'?'passou':status==='FALHOU'?'falhou':status==='IMPEDIDO'?'impedido':'naoExecutado'
              )}
              <button className="chip-close" onClick={()=> setStatus('')} aria-label="Remover filtro de status">×</button>
            </span>
          )}
          {tipoTeste && (
            <span className="chip" title={t(lang,'testType')}>
              {tipoTeste}
              <button className="chip-close" onClick={()=> setTipoTeste('')} aria-label="Remover filtro de tipo">×</button>
            </span>
          )}
          {owner && (
            <span className="chip" title={t(lang,'responsible')}>
              {owner}
              <button className="chip-close" onClick={()=> setOwner('')} aria-label="Remover filtro de responsável">×</button>
            </span>
          )}
          {text && (
            <span className="chip" title={t(lang,'searchText')}>
              {text}
              <button className="chip-close" onClick={()=> setText('')} aria-label="Remover filtro de busca">×</button>
            </span>
          )}
        </div>
      )}

      <button className="btn" onClick={()=> { setStatus(''); setTipoTeste(''); setOwner(''); setText('') }} title={t(lang,'clearFilters')}>
        ⟳ {t(lang,'clearFilters')}
      </button>
    </div>
  )
}
