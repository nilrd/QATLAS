import jsPDF from 'jspdf'
import { useState } from 'react'
import { useStore } from '../state'
import { t } from '../i18n'
import { useStoreV2 } from '../state_v2'
import { t2 } from '../i18n_v2'

export function Header({ onShowReports, onShowImport }: { onShowReports: ()=>void; onShowImport: ()=>void }){
  const { data, addCase, exportCSV, generateBDD, removeAll, setTheme, setLang } = useStore(s=>({
    data: s.data,
    addCase: s.addCase,
    exportCSV: s.exportCSV,
    generateBDD: s.generateBDD,
    removeAll: s.removeAll,
    setTheme: s.setTheme,
    setLang: s.setLang
  }))
  const v2 = useStoreV2(s=> ({ data: s.data }))
  const [openExport, setOpenExport] = useState(false)

  function downloadCSV(){
    const csv = exportCSV()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qatlas.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadBDD(){
    const bdd = generateBDD()
    if(!bdd){
      alert(t(data.meta.lang,'noAutomationCases'))
      return
    }
    const blob = new Blob([bdd], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qatlas.feature'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClearAll(){
    if(confirm(t(data.meta.lang,'clearAllConfirm'))){
      const csv = exportCSV()
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qatlas-backup-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      
      if(confirm(t(data.meta.lang,'backupDone'))){
        removeAll()
      }
    }
  }

  const aptosCount = data.cases.filter(c => c.aptoAutomacao && c.modo === 'Gherkin').length
  const usingV2 = (()=>{ try{ return localStorage.getItem('qatlas:useV2') === '1' }catch{ return false } })()

  // v2 export helpers (only used when usingV2)
  function exportV2_PDF(){
    const proj = v2.data.projetos.find(pr=> pr.id===v2.data.projetoAtivoId)
    if(!proj) return
    const doc = new jsPDF('p','mm','a4')
    let y = 10
    doc.setFontSize(14)
    doc.text(`${t2(v2.data.idioma,'project')}: ${proj.nome}`, 10, y); y+=6
    doc.setFontSize(11)
    const counts = {
      total: proj.casosTeste.length,
      passed: proj.casosTeste.filter(c=>c.status==='Passed').length,
      failed: proj.casosTeste.filter(c=>c.status==='Failed').length,
      blocked: proj.casosTeste.filter(c=>c.status==='Blocked').length,
      not: proj.casosTeste.filter(c=>c.status==='Not Executed').length,
    }
    doc.text(`Summary — Total ${counts.total} | Passed ${counts.passed} | Failed ${counts.failed} | Blocked ${counts.blocked} | Not Executed ${counts.not}`, 10, y); y+=8
    doc.text('Test Cases:', 10, y); y+=6
    doc.setFontSize(9)
    proj.casosTeste.forEach(c=>{
      const line = `${c.id} | ${c.suite} | ${((c as any).descricao ?? (c as any)['descri��ǜo'] ?? '')} | ${c.status}`
      doc.text(line.length>110? line.slice(0,110)+'…' : line, 10, y)
      y+=5
      if(y>280){ doc.addPage(); y=10 }
    })
    doc.save(`${proj.nome.replace(/\s+/g,'_')}_Casos_${new Date().toISOString().slice(0,10)}.pdf`)
  }

  function exportV2_XML(){
    const proj = v2.data.projetos.find(pr=> pr.id===v2.data.projetoAtivoId)
    if(!proj) return
    const esc = (s:string)=> String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<project name="${esc(proj.nome)}">\n`
    for(const r of proj.requerimentos){
      xml += `  <requirement id="${esc(r.id)}" type="${esc(r.type)}" status="${esc(r.status)}">\n`
      for(const c of proj.casosTeste.filter(tc=> tc.requirementId===r.id)){
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
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${proj.nome.replace(/\s+/g,'_')}.xml`; a.click(); URL.revokeObjectURL(url)
  }

  function exportV2_XLS(){
    const proj = v2.data.projetos.find(pr=> pr.id===v2.data.projetoAtivoId)
    if(!proj) return
    const rows = proj.casosTeste.map(c=> [''+c.id, (((c as any).descricao ?? (c as any)['descri��ǜo'] ?? '')), c.suite, c.resultadoEsperado, c.resultadoReal||'', c.status, c.executed? 'Yes':'No', c.blockedReason||''])
    const header = ['ID','Description','Suite','Expected','Actual','Status','Executed','Blocked Reason']
    const table = [header, ...rows].map(r=> `<tr>${r.map(v=> `<td>${String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;')}</td>`).join('')}</tr>`).join('')
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table>${table}</table></body></html>`
    const blob = new Blob([html], { type:'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${proj.nome.replace(/\s+/g,'_')}_Casos_${new Date().toISOString().slice(0,10)}.xls`; a.click(); URL.revokeObjectURL(url)
  }

  function exportV2_BDD(){
    const proj = v2.data.projetos.find(pr=> pr.id===v2.data.projetoAtivoId)
    if(!proj) return
    const aptos = proj.casosTeste.filter(c=> !!c.aptoAutomacao)
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
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${proj.nome.replace(/\s+/g,'_')}.feature`; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="header">
      <div className="header-logo">
        <img 
          src={data.meta.theme === 'dark' ? '/logo_qatlas_dark.png' : '/logo_qatlas.png'} 
          alt="QAtlas" 
          className="logo" 
        />
      </div>
      <div className="actions">
        <button className="btn primary" onClick={addCase}>{t(data.meta.lang,'newCase')}</button>
        <button className="btn" onClick={onShowImport}>{t(data.meta.lang,'importCSV')}</button>
        <button className="btn" onClick={()=> setOpenExport(true)}>{usingV2 ? t2(v2.data.idioma,'export') : t(data.meta.lang,'exportCSV')}</button>
        <button className="btn" onClick={onShowReports}>{t(data.meta.lang,'reports')}</button>
        <button className="btn" onClick={handleClearAll}>{t(data.meta.lang,'clearAll')}</button>
        <button className="btn" onClick={()=> setTheme(data.meta.theme==='light'?'dark':'light')}>{data.meta.theme==='light'?'☀️':'🌙'} {t(data.meta.lang,'theme')}</button>
        <div className="lang-selector" style={{display:'flex',gap:4}}>
          <button 
            className={`btn lang-btn ${data.meta.lang==='pt-BR'?'active':''}`} 
            onClick={()=> setLang('pt-BR')}
            title={t(data.meta.lang,'langPT')}
            style={{padding:4,minWidth:40,height:40,background:'transparent',border:'none'}}
          >
            <img src="/pt_br.png" alt="PT-BR" className="flag-icon" />
          </button>
          <button 
            className={`btn lang-btn ${data.meta.lang==='es-ES'?'active':''}`} 
            onClick={()=> setLang('es-ES')}
            title={t(data.meta.lang,'langES')}
            style={{padding:4,minWidth:40,height:40,background:'transparent',border:'none'}}
          >
            <img src="/es.png" alt="ES-ES" className="flag-icon" />
          </button>
          <button 
            className={`btn lang-btn ${data.meta.lang==='en-US'?'active':''}`} 
            onClick={()=> setLang('en-US')}
            title={t(data.meta.lang,'langEN')}
            style={{padding:4,minWidth:40,height:40,background:'transparent',border:'none'}}
          >
            <img src="/en.png" alt="EN-US" className="flag-icon" />
          </button>
        </div>
      </div>
      {openExport && (
        <div className="modal-backdrop" onClick={()=> setOpenExport(false)}>
          <div className="modal" onClick={e=> e.stopPropagation()} style={{maxWidth:420}}>
            <div className="modal-header">
              <h3 className="modal-title">{usingV2 ? t2(v2.data.idioma,'export') : t(data.meta.lang,'exportCSV')}</h3>
              <button className="modal-close" onClick={()=> setOpenExport(false)} aria-label={usingV2 ? t2(v2.data.idioma,'close') : t(data.meta.lang,'close')}>x</button>
            </div>
            <div className="modal-body" style={{display:'grid', gap:8}}>
              {usingV2 ? (
                <>
                  <button className="btn" onClick={()=> { exportV2_PDF(); setOpenExport(false) }}>{t2(v2.data.idioma,'exportPDF')}</button>
                  <button className="btn" onClick={()=> { exportV2_XML(); setOpenExport(false) }}>{t2(v2.data.idioma,'exportXML')}</button>
                  <button className="btn" onClick={()=> { exportV2_XLS(); setOpenExport(false) }}>{t2(v2.data.idioma,'exportXLSX')}</button>
                  <button className="btn" onClick={()=> { exportV2_BDD(); setOpenExport(false) }} disabled={(v2.data.projetos.find(pr=> pr.id===v2.data.projetoAtivoId)?.casosTeste.filter(c=> !!c.aptoAutomacao).length||0)===0}>
                    {t2(v2.data.idioma,'exportBDD')}
                  </button>
                </>
              ) : (
                <>
                  <button className="btn" onClick={()=> { downloadCSV(); setOpenExport(false) }}>{t(data.meta.lang,'exportCSV')}</button>
                  <button className="btn" onClick={()=> { downloadBDD(); setOpenExport(false) }} disabled={aptosCount===0}>
                    {t(data.meta.lang,'generateBDD')}
                  </button>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={()=> setOpenExport(false)}>{usingV2 ? t2(v2.data.idioma,'close') : t(data.meta.lang,'close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
