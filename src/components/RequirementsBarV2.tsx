import { useMemo, useState } from 'react'
import { useStoreV2 } from '../state_v2'
import type { RequirementStatus, RequirementType } from '../types_v2'
import { t2 } from '../i18n_v2'

export function RequirementsBarV2(){
  const { data, addRequirement, updateRequirement, removeRequirement } = useStoreV2(s=>({
    data: s.data,
    addRequirement: s.addRequirement,
    updateRequirement: s.updateRequirement,
    removeRequirement: s.removeRequirement,
  }))
  const p = data.projetos.find(pr=> pr.id===data.projetoAtivoId)!
  const [title, setTitle] = useState('')
  const [type, setType] = useState<RequirementType>('Story')
  const [status, setStatus] = useState<RequirementStatus>('Draft')
  const [link, setLink] = useState('')
  const [desc, setDesc] = useState('')

  const linkValid = useMemo(()=> !link || /^https?:\/\//i.test(link), [link])
  function add(){
    if(title.trim() && linkValid){
      addRequirement({ titulo: title.trim(), type, status, link: link||undefined, descricao: desc||undefined })
      setTitle(''); setLink(''); setDesc('')
    }
  }

  return (
    <div className="card" style={{marginBottom:12}}>
      <div className="row" style={{alignItems:'center'}}>
        <strong>{t2(data.idioma,'requirements')}</strong>
        <input className="btn" placeholder={t2(data.idioma,'title')} value={title} onChange={e=> setTitle(e.target.value)} style={{minWidth:200}}/>
        {(()=>{
          const types: RequirementType[] = ['Epic','Story','Task','Bug','Outro']
          const typeLabels: Record<RequirementType,string> = {
            Epic: t2(data.idioma,'reqTypeEpic'),
            Story: t2(data.idioma,'reqTypeStory'),
            Task: t2(data.idioma,'reqTypeTask'),
            Bug: t2(data.idioma,'reqTypeBug'),
            Outro: t2(data.idioma,'reqTypeOther'),
          }
          return (
            <select className="btn" value={type} onChange={e=> setType(e.target.value as RequirementType)}>
              {types.map(v=> <option key={v} value={v}>{typeLabels[v]}</option>)}
            </select>
          )
        })()}
        {(()=>{
          const statuses: RequirementStatus[] = ['Draft','In Progress','In Review','Approved']
          const statusLabels: Record<RequirementStatus,string> = {
            'Draft': t2(data.idioma,'reqStatusDraft'),
            'In Progress': t2(data.idioma,'reqStatusInProgress'),
            'In Review': t2(data.idioma,'reqStatusInReview'),
            'Approved': t2(data.idioma,'reqStatusApproved'),
          }
          return (
            <select className="btn" value={status} onChange={e=> setStatus(e.target.value as RequirementStatus)}>
              {statuses.map(sv=> <option key={sv} value={sv}>{statusLabels[sv]}</option>)}
            </select>
          )
        })()}
        <input className="btn" placeholder={`${t2(data.idioma,'link')} (http/https)`} value={link} onChange={e=> setLink(e.target.value)} style={{minWidth:220, borderColor: linkValid? undefined: 'var(--error)'}}/>
        <input className="btn" placeholder={`${t2(data.idioma,'description')} (${t2(data.idioma,'optional')||'optional'})`} value={desc} onChange={e=> setDesc(e.target.value)} style={{minWidth:220}}/>
        <button className="btn" onClick={add} disabled={!title.trim() || !linkValid}>+ {t2(data.idioma,'add')}</button>
      </div>
      {p.requerimentos.length>0 && (
        <div style={{overflowX:'auto', marginTop:8}}>
          <table className="qa-table">
            <thead><tr><th>ID</th><th>{t2(data.idioma,'title')}</th><th>{t2(data.idioma,'type')}</th><th>{t2(data.idioma,'status')}</th><th>{t2(data.idioma,'link')}</th><th>{t2(data.idioma,'description')}</th><th>{t2(data.idioma,'actionsEN')}</th></tr></thead>
            <tbody>
              {p.requerimentos.map(r=> (
                <tr key={r.id}>
                  <td><b>{r.id}</b></td>
                  <td><input className="btn" value={r.titulo} onChange={e=> updateRequirement(r.id, { titulo: e.target.value })}/></td>
                  <td>
                    {(()=>{
                      const types: RequirementType[] = ['Epic','Story','Task','Bug','Outro']
                      const typeLabels: Record<RequirementType,string> = {
                        Epic: t2(data.idioma,'reqTypeEpic'),
                        Story: t2(data.idioma,'reqTypeStory'),
                        Task: t2(data.idioma,'reqTypeTask'),
                        Bug: t2(data.idioma,'reqTypeBug'),
                        Outro: t2(data.idioma,'reqTypeOther'),
                      }
                      return (
                        <select className="btn" value={r.type} onChange={e=> updateRequirement(r.id, { type: e.target.value as RequirementType })}>
                          {types.map(v=> <option key={v} value={v}>{typeLabels[v]}</option>)}
                        </select>
                      )
                    })()}
                  </td>
                  <td>
                    {(()=>{
                      const statuses: RequirementStatus[] = ['Draft','In Progress','In Review','Approved']
                      const statusLabels: Record<RequirementStatus,string> = {
                        'Draft': t2(data.idioma,'reqStatusDraft'),
                        'In Progress': t2(data.idioma,'reqStatusInProgress'),
                        'In Review': t2(data.idioma,'reqStatusInReview'),
                        'Approved': t2(data.idioma,'reqStatusApproved'),
                      }
                      return (
                        <select className="btn" value={r.status} onChange={e=> updateRequirement(r.id, { status: e.target.value as RequirementStatus })}>
                          {statuses.map(sv=> <option key={sv} value={sv}>{statusLabels[sv]}</option>)}
                        </select>
                      )
                    })()}
                  </td>
                  <td><input className="btn" value={r.link||''} onChange={e=> updateRequirement(r.id, { link: e.target.value })} placeholder="http(s)://"/></td>
                  <td><input className="btn" value={r.descricao||''} onChange={e=> updateRequirement(r.id, { descricao: e.target.value })} placeholder={t2(data.idioma,'description')}/></td>
                  <td>
                    <button className="btn delete-btn" onClick={()=> removeRequirement(r.id)} title={t2(data.idioma,'delete')}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

