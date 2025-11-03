import { useState } from 'react'
import { useStoreV2 } from '../state_v2'
import { t2 } from '../i18n_v2'

export function ProjectsBar(){
  const { data, addProject, selectProject } = useStoreV2(s=>({ data: s.data, addProject: s.addProject, selectProject: s.selectProject }))
  const [name, setName] = useState('')
  const active = data.projetos.find(p=> p.id===data.projetoAtivoId)

  function create(){ if(name.trim()){ addProject(name.trim()); setName('') } }

  return (
    <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
      <strong style={{fontSize:14}}>{t2(data.idioma,'project')}:</strong>
      <select className="btn" value={data.projetoAtivoId} onChange={e=> selectProject(e.target.value)}>
        {data.projetos.map(p=> <option key={p.id} value={p.id}>{p.nome}</option>)}
      </select>
      <input className="btn" placeholder={t2(data.idioma,'newProject')} value={name} onChange={e=> setName(e.target.value)} style={{minWidth:220}} />
      <button className="btn" onClick={create}>+ {t2(data.idioma,'add')}</button>
      {active?.descrição && <span style={{color:'var(--muted)'}} title={t2(data.idioma,'description')}>{active.descrição}</span>}
    </div>
  )
}
