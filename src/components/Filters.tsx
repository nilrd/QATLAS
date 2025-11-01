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

  return (
    <div className="filters-panel">
      <div className="filter-group">
        <label className="filter-label">{t(lang,'status')}</label>
        <select className="btn" value={status} onChange={e=> setStatus(e.target.value)}>
          <option value="">{t(lang,'allStatus')}</option>
          <option value="PASSOU">{t(lang,'passou')}</option>
          <option value="FALHOU">{t(lang,'falhou')}</option>
          <option value="IMPEDIDO">{t(lang,'impedido')}</option>
          <option value="NAO_EXECUTADO">{t(lang,'naoExecutado')}</option>
        </select>
      </div>

      {tiposUnicos.length > 0 && (
        <div className="filter-group">
          <label className="filter-label">{t(lang,'testType')}</label>
          <select className="btn" value={tipoTeste} onChange={e=> setTipoTeste(e.target.value)}>
            <option value="">{t(lang,'allTypes')}</option>
            {tiposUnicos.map(tipo=> <option key={tipo} value={tipo}>{tipo}</option>)}
          </select>
        </div>
      )}

      <div className="filter-group">
        <label className="filter-label">{t(lang,'responsible')}</label>
        <input 
          className="btn" 
          placeholder={t(lang,'responsible')} 
          value={owner} 
          onChange={e=> setOwner(e.target.value)} 
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">{t(lang,'searchText')}</label>
        <input 
          className="btn" 
          placeholder={t(lang,'searchInTable')} 
          value={text} 
          onChange={e=> setText(e.target.value)} 
        />
      </div>

      <button 
        className="btn" 
        onClick={()=> { setStatus(''); setTipoTeste(''); setOwner(''); setText('') }}
        style={{width: '100%'}}
      >
        {t(lang,'clearFilters')}
      </button>
    </div>
  )
}


