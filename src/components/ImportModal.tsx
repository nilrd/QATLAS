import Papa from 'papaparse'
import { useState } from 'react'
import { useStore } from '../state'
import { t } from '../i18n'

export function ImportModal({ onClose }: { onClose: ()=>void }){
  const { importCSV, lang } = useStore(s=>({ importCSV: s.importCSV, lang: s.data.meta.lang }))
  const [rows, setRows] = useState<any[]|null>(null)
  const [mode, setMode] = useState<'merge'|'overwrite'>('merge')

  function handleFile(file: File){
    Papa.parse(file, { header: true, skipEmptyLines: true, complete: (res)=>{
      const mapped = (res.data as any[]).map(r=> ({
        id: r.id,
        titulo: r.titulo,
        modo: r.modo === 'Gherkin' || r.modo === 'StepByStep' ? r.modo : 'StepByStep',
        tipoTeste: r.tipoTeste || '',
        polaridade: (r.polaridade==='Positivo'||r.polaridade==='Negativo')? r.polaridade : '',
        passos: (r.passos||'').split('|').map((s:string)=>s.trim()).filter(Boolean),
        resultadoEsperado: r.resultadoEsperado||'',
        resultadoReal: r.resultadoReal||'',
        status: ['PASSOU','FALHOU','IMPEDIDO','NAO_EXECUTADO'].includes(r.status)? r.status : 'NAO_EXECUTADO',
        executado: ['true','1','sim','yes'].includes(String(r.executado).toLowerCase()),
        impedido: ['true','1','sim','yes'].includes(String(r.impedido).toLowerCase()),
        motivo: r.motivo||'', evidencia: r.evidencia||'',
        aptoAutomacao: ['true','1','sim','yes'].includes(String(r.aptoAutomacao).toLowerCase()),
        responsavel: r.responsavel||'', updatedAt: Number(r.updatedAt)||Date.now()
      }))
      setRows(mapped)
    } })
  }

  function confirm(){ if(rows){ importCSV(rows, mode); onClose() } }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{t(lang,'importTitle')}</h3>
          <button className="modal-close" onClick={onClose} aria-label={t(lang,'close')}>×</button>
        </div>
        <div className="modal-body">
          <input type="file" accept=".csv" onChange={e=> e.target.files && handleFile(e.target.files[0])} />
          <div style={{marginTop:8}}>
            <label><input type="radio" checked={mode==='merge'} onChange={()=> setMode('merge')} /> {t(lang,'merge')}</label>
            <label style={{marginLeft:12}}><input type="radio" checked={mode==='overwrite'} onChange={()=> setMode('overwrite')} /> {t(lang,'overwrite')}</label>
          </div>
          {rows && (
            <div style={{maxHeight:240, overflow:'auto', marginTop:8}}>
              <table>
                <thead><tr><th>{t(lang,'id')}</th><th>{t(lang,'title')}</th><th>{t(lang,'status')}</th><th>{t(lang,'executed')}</th><th>{t(lang,'updated')}</th></tr></thead>
                <tbody>
                  {rows.slice(0,20).map(r=> (
                    <tr key={r.id}><td>{r.id}</td><td>{r.titulo}</td><td>{r.status}</td><td>{String(r.executado)}</td><td>{new Date(r.updatedAt).toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>{t(lang,'cancel')}</button>
          <button className="btn primary" onClick={confirm} disabled={!rows}>{t(lang,'confirm')}</button>
        </div>
      </div>
    </div>
  )
}

