import jsPDF from 'jspdf'
import { useState } from 'react'
import { useStoreV2 } from '../state_v2'
import { t2 } from '../i18n_v2'

export function ExportBarV2(){
  const { data } = useStoreV2(s=>({ data: s.data }))
  const p = data.projetos.find(pr=> pr.id===data.projetoAtivoId)!
  const [open, setOpen] = useState(false)

  function exportPDF(){
    const doc = new jsPDF('p','mm','a4')
    let y = 10
    doc.setFontSize(14)
    doc.text(`${t2(data.idioma,'project')}: ${p.nome}`, 10, y); y+=6
    doc.setFontSize(11)
    const counts = {
      total: p.casosTeste.length,
      passed: p.casosTeste.filter(c=>c.status==='Passed').length,
      failed: p.casosTeste.filter(c=>c.status==='Failed').length,
      blocked: p.casosTeste.filter(c=>c.status==='Blocked').length,
      not: p.casosTeste.filter(c=>c.status==='Not Executed').length,
    }
    doc.text(`Summary — Total ${counts.total} | Passed ${counts.passed} | Failed ${counts.failed} | Blocked ${counts.blocked} | Not Executed ${counts.not}`, 10, y); y+=8
    doc.text('Test Cases:', 10, y); y+=6
    doc.setFontSize(9)
    p.casosTeste.forEach(c=>{
      const line = `${c.id} | ${c.suite} | ${((c as any).descricao ?? (c as any)['descri��ǜo'] ?? '')} | ${c.status}`
      doc.text(line.length>110? line.slice(0,110)+'…' : line, 10, y)
      y+=5
      if(y>280){ doc.addPage(); y=10 }
    })
    doc.save(`${p.nome.replace(/\s+/g,'_')}_Casos_${new Date().toISOString().slice(0,10)}.pdf`)
  }

  function exportXML(){
    const esc = (s:string)=> s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<project name="${esc(p.nome)}">\n`
    for(const r of p.requerimentos){
      xml += `  <requirement id="${esc(r.id)}" type="${esc(r.type)}" status="${esc(r.status)}">\n`
      for(const c of p.casosTeste.filter(tc=> tc.requirementId===r.id)){
        xml += `    <testcase id="${esc(c.id)}" suite="${esc(c.suite)}" status="${esc(c.status)}">\n`
        xml += `      <description>${esc(((c as any).descricao ?? (c as any)['descri��ǜo'] ?? ''))}</description>\n`
        xml += `      <expected>${esc(c.resultadoEsperado)}</expected>\n`
        if(c.resultadoReal) xml += `      <actual>${esc(c.resultadoReal)}</actual>\n`
        xml += `    </testcase>\n`
      }
      xml += `  </requirement>\n`
    }
    xml += `</project>`
    const blob = new Blob([xml], { type:'application/xml;charset=utf-8' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${p.nome.replace(/\s+/g,'_')}.xml`; a.click(); URL.revokeObjectURL(url)
  }

  function exportXLS(){
    // HTML-based Excel export (compatível com Excel)
    const rows = p.casosTeste.map(c=> [''+c.id, (((c as any).descricao ?? (c as any)['descri��ǜo'] ?? '')), c.suite, c.resultadoEsperado, c.resultadoReal||'', c.status, c.executed? 'Yes':'No', c.blockedReason||''])
    const header = ['ID','Description','Suite','Expected','Actual','Status','Executed','Blocked Reason']
    const table = [header, ...rows].map(r=> `<tr>${r.map(v=> `<td>${String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</td>`).join('')}</tr>`).join('')
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table>${table}</table></body></html>`
    const blob = new Blob([html], { type:'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${p.nome.replace(/\s+/g,'_')}_Casos_${new Date().toISOString().slice(0,10)}.xls`; a.click(); URL.revokeObjectURL(url)
  }

  function exportBDD(){
    const aptos = p.casosTeste.filter(c=> !!c.aptoAutomacao)
    if(aptos.length===0){ return }
    let content = ''
    for(const c of aptos){
      content += `Feature: ${c.suite || 'Suite'}\n`
      content += `  Scenario: ${((((c as any).descricao ?? (c as any)['descri��ǜo']) || 'Scenario'))}\n`
      const steps = (c.steps && c.steps.length)? c.steps : [
        'Given precondition',
        'When action',
        `Then ${c.resultadoEsperado || 'expected'}`
      ]
      for(const s of steps){ content += `    ${s}\n` }
      content += `\n`
    }
    const blob = new Blob([content], { type:'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${p.nome.replace(/\s+/g,'_')}.feature`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div style={{marginBottom:12}}>
      <button className="btn" onClick={()=> setOpen(true)}>{t2(data.idioma,'export')}</button>
      {open && (
        <div className="modal-backdrop" onClick={()=> setOpen(false)}>
          <div className="modal" onClick={e=> e.stopPropagation()} style={{maxWidth:420}}>
            <div className="modal-header">
              <h3 className="modal-title">{t2(data.idioma,'export')}</h3>
              <button className="modal-close" onClick={()=> setOpen(false)} aria-label={t2(data.idioma,'close')}>x</button>
            </div>
            <div className="modal-body" style={{display:'grid', gap:8}}>
              <button className="btn" onClick={()=> { exportPDF(); setOpen(false) }}>{t2(data.idioma,'exportPDF')}</button>
              <button className="btn" onClick={()=> { exportXML(); setOpen(false) }}>{t2(data.idioma,'exportXML')}</button>
              <button className="btn" onClick={()=> { exportXLS(); setOpen(false) }}>{t2(data.idioma,'exportXLSX')}</button>
              <button className="btn" onClick={()=> { exportBDD(); setOpen(false) }} disabled={p.casosTeste.filter(c=> !!c.aptoAutomacao).length===0}>
                {t2(data.idioma,'exportBDD')}
              </button>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={()=> setOpen(false)}>{t2(data.idioma,'close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

