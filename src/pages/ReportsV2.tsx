import { useEffect, useRef, useState, useMemo } from 'react'
import { useStoreV2 } from '../state_v2'
import { t2 } from '../i18n_v2'
// Use registro automático do Chart.js para evitar erros de controller não registrado
import Chart from 'chart.js/auto'
import { Tooltip, Legend } from 'chart.js'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

Chart.register(Tooltip, Legend)

export function ReportsV2({ onClose }: { onClose: ()=>void }){
  const { data } = useStoreV2(s=> ({ data: s.data }))
  const p = data.projetos.find(pr=> pr.id===data.projetoAtivoId)!
  const cases = p.casosTeste
  const donutRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLCanvasElement>(null)
  const lineRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [charts, setCharts] = useState<{ donut?: Chart, bar?: Chart, line?: Chart }>({})

  const counts = useMemo(()=>({
    total: cases.length,
    executed: cases.filter(c=> c.executed || c.status!=='Not Executed').length,
    passed: cases.filter(c=> c.status==='Passed').length,
    failed: cases.filter(c=> c.status==='Failed').length,
    blocked: cases.filter(c=> c.status==='Blocked').length,
  }), [cases])

  useEffect(()=>{
    const dctx = donutRef.current!.getContext('2d')!
    const bctx = barRef.current!.getContext('2d')!
    const lctx = lineRef.current!.getContext('2d')!
    const donut = new Chart(dctx, {
      type:'doughnut',
      data:{
        labels:['Passed','Failed','Blocked','Not Executed'],
        datasets:[{ data:[counts.passed,counts.failed,counts.blocked, counts.total-counts.executed], backgroundColor:['#22c55e','#ef4444','#f59e0b','#6b7280'] }]
      },
      options:{ plugins:{ legend:{ position:'bottom' } } }
    })
    const bySuite: Record<string, { p:number; f:number; b:number }> = {}
    for(const c of cases){ const k=c.suite||'—'; bySuite[k] ??= {p:0,f:0,b:0}; if(c.status==='Passed') bySuite[k].p++; else if(c.status==='Failed') bySuite[k].f++; else if(c.status==='Blocked') bySuite[k].b++ }
    const suites = Object.keys(bySuite)
    const bar = new Chart(bctx, {
      type:'bar',
      data:{ labels: suites, datasets:[
        { label:'Passed', backgroundColor:'#22c55e', data: suites.map(s=> bySuite[s].p) },
        { label:'Failed', backgroundColor:'#ef4444', data: suites.map(s=> bySuite[s].f) },
        { label:'Blocked', backgroundColor:'#f59e0b', data: suites.map(s=> bySuite[s].b) },
      ]},
      options:{ responsive:true, plugins:{ legend:{ position:'bottom' } }, scales:{ x:{ stacked:true }, y:{ stacked:true, beginAtZero:true } } }
    })
    const byDay: Record<string, number> = {}
    for(const c of cases){ const d = (c.dataAtualizacao||c.dataCriacao).slice(0,10); byDay[d] = (byDay[d]||0)+1 }
    const days = Object.keys(byDay).sort()
    const line = new Chart(lctx, { type:'line', data:{ labels: days, datasets:[{ label:'Updates', data: days.map(d=> byDay[d]), borderColor:'#3b82f6' }] }, options:{ plugins:{ legend:{ position:'bottom' } } } })
    setCharts({ donut, bar, line })
    return ()=>{ donut.destroy(); bar.destroy(); line.destroy() }
  }, [cases, counts])

  useEffect(()=>{
    function onKey(ev: KeyboardEvent){ if(ev.key.toLowerCase()==='r'){ charts.donut?.update(); charts.bar?.update(); charts.line?.update() } }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [charts])

  async function exportPDF(){
    const node = containerRef.current!
    const canvas = await html2canvas(node, { backgroundColor: '#ffffff', scale: 2 })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p','mm','a4')
    const pageW = 190
    const h = (canvas.height * pageW) / canvas.width
    pdf.setFontSize(14)
    pdf.text(`QATLAS - ${t2(data.idioma,'reportsTitle')}`, 10, 10)
    pdf.setFontSize(11)
    pdf.text(`${t2(data.idioma,'project')}: ${p.nome}`, 10, 16)
    pdf.addImage(img, 'PNG', 10, 22, pageW, h)
    pdf.text(`${new Date().toLocaleString()}`, 10, 290)
    pdf.save(`${p.nome.replace(/\s+/g,'_')}-report.pdf`)
  }

  function exportXLS(){
    // Multi-aba via HTML compatível com Excel (sem SheetJS)
    const esc = (s:string)=> String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    const casosRows = cases.map(c=> `<tr><td>${esc(c.id)}</td><td>${esc(c.suite||'')}</td><td>${esc((c as any).descricao||'')}</td><td>${esc(c.status)}</td><td>${esc(c.resultadoEsperado)}</td><td>${esc(c.resultadoReal||'')}</td></tr>`).join('')
    const casos = `<table><tr><th>ID</th><th>Suite</th><th>${t2(data.idioma,'description')}</th><th>Status</th><th>${t2(data.idioma,'expected')}</th><th>${t2(data.idioma,'actual')}</th></tr>${casosRows}</table>`
    const resumo = `<table><tr><th>${t2(data.idioma,'total')}</th><th>${t2(data.idioma,'executedEN')}</th><th>${t2(data.idioma,'passed')}</th><th>${t2(data.idioma,'failed')}</th><th>${t2(data.idioma,'blocked')}</th></tr><tr><td>${counts.total}</td><td>${counts.executed}</td><td>${counts.passed}</td><td>${counts.failed}</td><td>${counts.blocked}</td></tr></table>`
    const reqRows = p.requerimentos.map(r=> `<tr><td>${esc(r.id)}</td><td>${esc((r as any).titulo||'')}</td><td>${esc(r.type)}</td><td>${esc(r.status)}</td><td>${esc(r.link||'')}</td></tr>`).join('')
    const reqs = `<table><tr><th>ID</th><th>${t2(data.idioma,'title')}</th><th>${t2(data.idioma,'type')}</th><th>${t2(data.idioma,'status')}</th><th>${t2(data.idioma,'link')}</th></tr>${reqRows}</table>`
    const chartsImg = charts.donut?.toBase64Image() || ''
    const charts = chartsImg? `<img src="${chartsImg}"/>` : ''
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
<x:ExcelWorksheet><x:Name>Casos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
<x:ExcelWorksheet><x:Name>Resumo</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
<x:ExcelWorksheet><x:Name>Requisitos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
<x:ExcelWorksheet><x:Name>Gráficos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head><body>
<div style="mso-element:workbook;">
  <div style="mso-element:worksheet;" name="Casos">${casos}</div>
  <div style="mso-element:worksheet;" name="Resumo">${resumo}</div>
  <div style="mso-element:worksheet;" name="Requisitos">${reqs}</div>
  <div style="mso-element:worksheet;" name="Gráficos">${charts}</div>
</div>
</body></html>`
    const blob = new Blob([html], { type:'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${p.nome.replace(/\s+/g,'_')}_report.xls`; a.click(); URL.revokeObjectURL(url)
  }

  const disableExports = counts.executed===0

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:1200}}>
        <div className="modal-header">
          <h3 className="modal-title">{t2(data.idioma,'reportsTitle')} — {p.nome}</h3>
          <button className="modal-close" onClick={onClose} aria-label={t2(data.idioma,'close')}>x</button>
        </div>
        <div className="modal-body" ref={containerRef}>
          <div className="row" style={{marginBottom:12}}>
            <div className="card" style={{minWidth:220}}>
              <div className="title">{t2(data.idioma,'total')}</div>
              <div className="value">{counts.total}</div>
            </div>
            <div className="card" style={{minWidth:220}}>
              <div className="title">{t2(data.idioma,'executedEN')}</div>
              <div className="value">{counts.executed}</div>
            </div>
            <div className="card" style={{minWidth:220}}>
              <div className="title">{t2(data.idioma,'passed')}</div>
              <div className="value" style={{color:'var(--success)'}}>{counts.passed}</div>
            </div>
            <div className="card" style={{minWidth:220}}>
              <div className="title">{t2(data.idioma,'failed')}</div>
              <div className="value" style={{color:'var(--error)'}}>{counts.failed}</div>
            </div>
            <div className="card" style={{minWidth:220}}>
              <div className="title">{t2(data.idioma,'blocked')}</div>
              <div className="value" style={{color:'var(--warning)'}}>{counts.blocked}</div>
            </div>
          </div>
          <div className="row">
            <div className="card" style={{minWidth:320}}>
              <div className="title">{t2(data.idioma,'chartsTab')} — Pie</div>
              <canvas ref={donutRef} width="300" height="300"/>
            </div>
            <div className="card" style={{flex:2}}>
              <div className="title">{t2(data.idioma,'statusBySuite')}</div>
              <canvas ref={barRef} height="300"/>
            </div>
          </div>
          <div className="row">
            <div className="card" style={{flex:1}}>
              <div className="title">{t2(data.idioma,'timeline')}</div>
              <canvas ref={lineRef} height="220"/>
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{justifyContent:'space-between'}}>
          <button className="btn" onClick={()=> { charts.donut?.update(); charts.bar?.update(); charts.line?.update() }}>{t2(data.idioma,'refresh')}</button>
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={exportPDF} disabled={disableExports}>{t2(data.idioma,'exportPDF')}</button>
            <button className="btn" onClick={exportXLS} disabled={disableExports}>{t2(data.idioma,'exportXLSX')}</button>
            <button className="btn" onClick={onClose}>{t2(data.idioma,'close')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
