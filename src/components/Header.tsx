import { useStore } from '../state'
import { t } from '../i18n'

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
      // Fazer backup automático
      const csv = exportCSV()
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qatlas-backup-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      
      // Confirmar novamente
      if(confirm(t(data.meta.lang,'backupDone'))){
        removeAll()
      }
    }
  }

  const aptosCount = data.cases.filter(c => c.aptoAutomacao && c.modo === 'Gherkin').length

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
        <button className="btn" onClick={downloadCSV}>{t(data.meta.lang,'exportCSV')}</button>
        <button 
          className="btn" 
          onClick={downloadBDD}
          disabled={aptosCount === 0}
          title={aptosCount === 0 ? t(data.meta.lang,'automationTooltipDisabled') : `${t(data.meta.lang,'automationTooltip')} (${aptosCount} caso${aptosCount!==1?'s':''} apto${aptosCount!==1?'s':''})`}
        >
          {t(data.meta.lang,'generateBDD')} {aptosCount > 0 && `(${aptosCount})`}
        </button>
        <button className="btn" onClick={onShowReports}>{t(data.meta.lang,'reports')}</button>
        <button className="btn" onClick={handleClearAll}>{t(data.meta.lang,'clearAll')}</button>
        <button className="btn" onClick={()=> setTheme(data.meta.theme==='light'?'dark':'light')}>{data.meta.theme==='light'?'🌙':'☀️'} {t(data.meta.lang,'theme')}</button>
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
    </div>
  )
}


