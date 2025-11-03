import { useEffect, useRef } from 'react'
import { useStore } from '../state'
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { t } from '../i18n'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export function Reports({ onClose }: { onClose: ()=>void }){
  const { cases, lang } = useStore(s=>({ cases: s.data.cases, lang: s.data.meta.lang }))
  const donutRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const counts = {
    PASSOU: cases.filter(c=>c.status==='PASSOU').length,
    FALHOU: cases.filter(c=>c.status==='FALHOU').length,
    IMPEDIDO: cases.filter(c=>c.status==='IMPEDIDO').length,
    NAO_EXECUTADO: cases.filter(c=>c.status==='NAO_EXECUTADO').length
  }

  useEffect(()=>{
    const dctx = donutRef.current!.getContext('2d')!
    const bctx = barRef.current!.getContext('2d')!
    const donut = new Chart(dctx, { 
      type:'doughnut', 
      data:{ 
        labels:[t(lang,'passou'),t(lang,'falhou'),t(lang,'impedido'),t(lang,'naoExecutado')], 
        datasets:[{ 
          data:[counts.PASSOU,counts.FALHOU,counts.IMPEDIDO,counts.NAO_EXECUTADO], 
          backgroundColor:['#22c55e','#ef4444','#f59e0b','#6b7280'] 
        }] 
      } 
    })
    const byType = aggregateBy(cases.map(c=> ({ key: `${c.tipoTeste||'—'} / ${c.polaridade||'—'}`, status: c.status })))
    const bar = new Chart(bctx, { 
      type:'bar', 
      data:{ 
        labels: Object.keys(byType), 
        datasets:[
          { 
            label:t(lang,'passou'), 
            backgroundColor:'#22c55e', 
            data: Object.values(byType).map((x:any)=>x.PASSOU||0) 
          }, 
          { 
            label:t(lang,'falhou'), 
            backgroundColor:'#ef4444', 
            data: Object.values(byType).map((x:any)=>x.FALHOU||0) 
          }, 
          { 
            label:t(lang,'impedido'), 
            backgroundColor:'#f59e0b', 
            data: Object.values(byType).map((x:any)=>x.IMPEDIDO||0) 
          }
        ] 
      }, 
      options:{ 
        responsive:true, 
        plugins:{ 
          legend:{ 
            position:'bottom' 
          } 
        } 
      } 
    })
    return ()=>{ donut.destroy(); bar.destroy() }
  }, [cases, lang])

  function aggregateBy(items: { key:string; status:string }[]){
    const map: Record<string, any> = {}
    for(const it of items){
      map[it.key] ||= {}
      map[it.key][it.status] = (map[it.key][it.status]||0)+1
    }
    return map
  }

  async function downloadPDF(){
    const node = containerRef.current!
    const canvas = await html2canvas(node, { backgroundColor: '#ffffff', scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const width = 190
    const height = (canvas.height * width) / canvas.width
    pdf.text('QAtlas — Relatório', 10, 10)
    pdf.addImage(imgData, 'PNG', 10, 18, width, height)
    pdf.save('qatlas-relatorio.pdf')
  }

  const avgTime = () => {
    if(cases.length<2) return '—'
    const sorted = [...cases].sort((a,b)=>a.updatedAt-b.updatedAt)
    let total = 0
    for(let i=1;i<sorted.length;i++){ total += (sorted[i].updatedAt - sorted[i-1].updatedAt) }
    const ms = total / (sorted.length-1)
    return `${Math.round(ms/1000)}s` 
  }

  // Tabela resumo por Tipo de Teste e Polaridade
  const summaryByType = () => {
    const map: Record<string, { total: number; passed: number; failed: number; blocked: number; notExec: number }> = {}
    cases.forEach(c => {
      const key = `${c.tipoTeste || 'Não definido'} / ${c.polaridade || '—'}`
      if(!map[key]){
        map[key] = { total: 0, passed: 0, failed: 0, blocked: 0, notExec: 0 }
      }
      map[key].total++
      if(c.status === 'PASSOU') map[key].passed++
      else if(c.status === 'FALHOU') map[key].failed++
      else if(c.status === 'IMPEDIDO') map[key].blocked++
      else map[key].notExec++
    })
    return Object.entries(map).map(([key, vals]) => ({
      key,
      ...vals,
      passedPct: vals.total > 0 ? Math.round((vals.passed / vals.total) * 100) : 0,
      failedPct: vals.total > 0 ? Math.round((vals.failed / vals.total) * 100) : 0,
      blockedPct: vals.total > 0 ? Math.round((vals.blocked / vals.total) * 100) : 0
    }))
  }

  const summary = summaryByType()

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:1200}}>
        <div className="modal-header">
          <h3 className="modal-title">{t(lang,'reportsTitle')}</h3>
          <button className="modal-close" onClick={onClose} aria-label={t(lang,'close')}>×</button>
        </div>
        <div className="modal-body" ref={containerRef}>
          <div className="row">
            <div className="card" style={{minWidth:260}}>
              <div className="title">{t(lang,'avgUpdateTime')}</div>
              <div className="value">{avgTime()}</div>
            </div>
            <div className="card" style={{minWidth:260}}>
              <div className="title">{t(lang,'totalCases')}</div>
              <div className="value">{cases.length}</div>
            </div>
            <div className="card" style={{minWidth:260}}>
              <div className="title">{t(lang,'successRate')}</div>
              <div className="value" style={{color:'var(--green)'}}>
                {cases.length > 0 ? Math.round((counts.PASSOU / cases.length) * 100) : 0}%
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card"><canvas ref={donutRef} width="300" height="300"/></div>
            <div className="card" style={{flex:2}}><canvas ref={barRef} height="300"/></div>
          </div>
          {summary.length > 0 && (
            <div style={{marginTop:16}}>
              <h3>{t(lang,'summaryByType')}</h3>
              <div style={{overflowX:'auto'}}>
                <table>
                  <thead>
                    <tr>
                      <th>{t(lang,'typePolarity')}</th>
                      <th>{t(lang,'total')}</th>
                      <th>{t(lang,'passedCount')}</th>
                      <th>%</th>
                      <th>{t(lang,'failedCount')}</th>
                      <th>%</th>
                      <th>{t(lang,'blockedCount')}</th>
                      <th>%</th>
                      <th>{t(lang,'notExecutedCount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.map((s, i) => (
                      <tr key={i}>
                        <td><b>{s.key}</b></td>
                        <td>{s.total}</td>
                        <td style={{color:'var(--green)'}}>{s.passed}</td>
                        <td>{s.passedPct}%</td>
                        <td style={{color:'var(--red)'}}>{s.failed}</td>
                        <td>{s.failedPct}%</td>
                        <td style={{color:'var(--amber)'}}>{s.blocked}</td>
                        <td>{s.blockedPct}%</td>
                        <td style={{color:'var(--muted)'}}>{s.notExec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer" style={{justifyContent:'space-between'}}>
          <button className="btn" onClick={downloadPDF}>{t(lang,'downloadPDF')}</button>
          <div>
            <button className="btn" onClick={onClose}>{t(lang,'close')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

