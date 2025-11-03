import React, { useMemo, useState } from 'react'
import { useStoreV2 } from '../state_v2'
import type { TestCaseV2, TestStatusV2 } from '../types_v2'
import { t2 } from '../i18n_v2'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table'

function StatusChipV2({ s }: { s: TestStatusV2 }){
  const map: Record<TestStatusV2, { cls: string; label: string }> = {
    'Passed': { cls:'passou', label:'Passed' },
    'Failed': { cls:'falhou', label:'Failed' },
    'Blocked': { cls:'impedido', label:'Blocked' },
    'Not Executed': { cls:'nao', label:'Not Executed' }
  }
  const it = map[s]
  return <span className={`chip ${it.cls}`}>{it.label}</span>
}

export function CasesTableV2(){
  const { data, addTestCase, updateTestCase, removeTestCase, setCaseStatus } = useStoreV2(s=>({
    data: s.data,
    addTestCase: s.addTestCase,
    updateTestCase: s.updateTestCase,
    removeTestCase: s.removeTestCase,
    setCaseStatus: s.setCaseStatus,
  }))
  const p = data.projetos.find(pr=> pr.id===data.projetoAtivoId)!
  const cases = ((window as any).__QATLAS_V2_FILTERED__ as TestCaseV2[] | undefined) ?? p.casosTeste

  const [reasonFor, setReasonFor] = useState<string|null>(null)
  const [reasonText, setReasonText] = useState('')
  const [pendingStatus, setPendingStatus] = useState<{id:string, prev: TestStatusV2}|null>(null)
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [stepsFor, setStepsFor] = useState<string|null>(null)
  const [stepsText, setStepsText] = useState('')

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>){
    if(reasonFor){ if(e.key==='Escape'){ e.preventDefault(); if(pendingStatus){ updateTestCase(pendingStatus.id, { status: pendingStatus.prev }); setPendingStatus(null) } setReasonFor(null); setReasonText('') }; return }
    if(!selectedId){ if(e.key.toLowerCase()==='n'){ e.preventDefault(); addTestCase(); return } return }
    const id = selectedId
    if(e.ctrlKey && (e.key.toLowerCase()==='d')){ e.preventDefault(); (useStoreV2.getState() as any).duplicateTestCase?.(id); return }
    if(e.key.toLowerCase()==='n'){ e.preventDefault(); addTestCase(); return }
    if(e.key.toLowerCase()==='e'){ e.preventDefault(); const row = document.querySelector(`tr[data-id="${id}"]`) as HTMLTableRowElement|null; const first = row?.querySelector('input,select,textarea') as HTMLElement|null; first?.focus(); return }
    if(e.key.toLowerCase()==='p'){ e.preventDefault(); const tc = cases.find(c=>c.id===id)!; if(!tc.executed) updateTestCase(id,{ executed:true }); setCaseStatus(id,'Passed'); return }
    if(e.key.toLowerCase()==='f'){ e.preventDefault(); const tc = cases.find(c=>c.id===id)!; if(!tc.executed) updateTestCase(id,{ executed:true }); setCaseStatus(id,'Failed'); return }
    if(e.key.toLowerCase()==='i'){ e.preventDefault(); const tc = cases.find(c=>c.id===id)!; if(!tc.blockedReason){ setPendingStatus({ id, prev: tc.status }); setReasonFor(id); setReasonText(''); updateTestCase(id, { status:'Blocked' }); } else { setCaseStatus(id,'Blocked') } return }
  }

  // Table columns (TanStack)
  const columns = useMemo<ColumnDef<TestCaseV2>[]>(()=>[
    { id:'id', header: t2(data.idioma,'caseId'), size: 100, cell: info=> <b>{info.row.original.id}</b> },
    { id:'descricao', header: t2(data.idioma,'descriptionCol'), size: 280, cell: ({ row })=> (
      <input
        data-col={0}
        value={(row.original as any).descricao ?? (row.original as any)['descri��ǜo'] ?? ''}
        placeholder={t2(data.idioma,'descriptionCol')}
        onChange={e=> updateTestCase(row.original.id, { descricao: (e.target as any).value })}
      />
    )},
    { id:'suite', header: t2(data.idioma,'suite'), size: 180, cell: ({ row })=> (
      <input
        data-col={1}
        value={row.original.suite}
        placeholder={t2(data.idioma,'suitePlaceholder')}
        onChange={e=> updateTestCase(row.original.id, { suite: (e.target as any).value })}
      />
    )},
    { id:'testType', header: t2(data.idioma,'testType'), size: 160, cell: ({ row })=> (
      <input
        data-col={2}
        value={row.original.tipoTeste || ''}
        placeholder={t2(data.idioma,'testType')}
        onChange={e=> updateTestCase(row.original.id, { tipoTeste: (e.target as any).value })}
      />
    )},
    { id:'req', header: t2(data.idioma,'requirement'), size: 220, cell: ({ row })=> (
      <select
        data-col={3}
        value={row.original.requirementId || ''}
        onChange={e=> updateTestCase(row.original.id, { requirementId: (e.target as any).value || undefined })}
      >
        <option value="">—</option>
        {p.requerimentos.length===0 && <option value="" disabled>{t2(data.idioma,'noRequirements')}</option>}
        {p.requerimentos.map(r=> (
          <option key={r.id} value={r.id}>{r.id} — {(r as any).titulo ?? (r as any)['t��tulo'] ?? ''}</option>
        ))}
      </select>
    )},
    { id:'expected', header: t2(data.idioma,'expected'), size: 220, cell: ({ row })=> (
      <input data-col={3} value={row.original.resultadoEsperado} placeholder={t2(data.idioma,'expected')}
        onChange={e=> updateTestCase(row.original.id, { resultadoEsperado: (e.target as any).value })} />
    )},
    { id:'actual', header: t2(data.idioma,'actual'), size: 220, cell: ({ row })=> (
      <input data-col={4} value={row.original.resultadoReal || ''} placeholder={t2(data.idioma,'actual')}
        onChange={e=> updateTestCase(row.original.id, { resultadoReal: (e.target as any).value })} />
    )},
    { id:'steps', header: t2(data.idioma,'steps'), size: 160, cell: ({ row })=> (
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <span>{(row.original.steps?.length||0)}</span>
        <button className="btn" onClick={()=> { setStepsFor(row.original.id); setStepsText((row.original.steps||[]).join('\n')) }}>{t2(data.idioma,'openSteps')}</button>
      </div>
    )},
    { id:'status', header: t2(data.idioma,'status'), size: 180, cell: ({ row })=> (
      <div>
        <select
          data-col={5}
          value={row.original.status}
          onChange={e=> onStatusChange(row.original, (e.target as any).value as TestStatusV2)}
        >
          <option>Not Executed</option>
          <option>Passed</option>
          <option>Failed</option>
          <option>Blocked</option>
        </select>
        <div style={{marginTop:6}}><StatusChipV2 s={row.original.status} /></div>
        {row.original.status==='Blocked' && (row.original.blockedReason||'').trim() && (
          <div className="reason-badge" style={{marginTop:6, display:'inline-flex', alignItems:'center', gap:6}}>
            <span style={{maxWidth:280, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{row.original.blockedReason}</span>
            <button className="chip-close" title={t2(data.idioma,'clear')} onClick={()=> updateTestCase(row.original.id,{ blockedReason: undefined, status: 'Not Executed' })}>x</button>
          </div>
        )}
      </div>
    )},
    { id:'automation', header: t2(data.idioma,'automationReady'), size: 160, cell: ({ row })=> (
      <input type="checkbox" checked={!!row.original.aptoAutomacao} onChange={e=> updateTestCase(row.original.id, { aptoAutomacao: (e.target as any).checked })} />
    )},
    { id:'note', header: t2(data.idioma,'note'), size: 220, cell: ({ row })=> (
      <input value={row.original.observacao || ''} placeholder={t2(data.idioma,'note')} onChange={e=> updateTestCase(row.original.id, { observacao: (e.target as any).value })} />
    )},
    { id:'updated', header: t2(data.idioma,'updated'), size: 200, cell: ({ row })=> (
      <>{new Date(((row.original as any).dataAtualizacao ?? (row.original as any)['dataAtualiza��ǜo'] ?? (row.original as any)['dataAtualização']) as any).toLocaleString()}</>
    )},
    { id:'actions', header: t2(data.idioma,'actionsEN'), size: 120, cell: ({ row })=> (
      <div style={{display:'flex', gap:6}}>
        <button className="btn" title={t2(data.idioma,'openSteps')} onClick={()=> { setStepsFor(row.original.id); setStepsText((row.original.steps||[]).join('\n')) }}>{t2(data.idioma,'openSteps')}</button>
        <button className="btn delete-btn" title={t2(data.idioma,'delete')} onClick={()=> removeTestCase(row.original.id)}>x</button>
      </div>
    )},
  ], [data.idioma, p.requerimentos])

  function onStatusChange(tc: TestCaseV2, status: TestStatusV2){
    if((status==='Passed' || status==='Failed') && !tc.executed){ return }
    if(status==='Blocked' && !tc.blockedReason){ setPendingStatus({ id: tc.id, prev: tc.status }); setReasonFor(tc.id); setReasonText(''); updateTestCase(tc.id, { status }); return }
    setCaseStatus(tc.id, status)
  }

  const table = useReactTable({
    data: cases,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    defaultColumn: { size: 180 },
    state: {},
  })

  return (
    <div className="table-card" tabIndex={0} onKeyDown={onKeyDown}>
      <div className="table-wrap">
        <table className="qa-table">
          <thead>
            {table.getHeaderGroups().map(hg=> (
              <tr key={hg.id}>
                {hg.headers.map((header, idx)=> (
                  <th key={header.id} className={idx===0? 'sticky-left': (header.id==='actions'? 'sticky-right':'')} style={{ width: header.getSize() }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="col-resizer" onMouseDown={header.getResizeHandler?.()} onTouchStart={header.getResizeHandler?.()} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} data-id={row.original.id} onClick={()=> setSelectedId(row.original.id)}>
                {row.getVisibleCells().map((cell, idx)=> (
                  <td key={cell.id} className={idx===0? 'sticky-left': (cell.column.id==='actions'? 'sticky-right':'')} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={table.getAllLeafColumns().length}>
                <button className="btn" onClick={()=> addTestCase()}>+ {t2(data.idioma,'newTestCase')}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {reasonFor && (
        <div className="modal-backdrop" onClick={()=> { if(pendingStatus){ updateTestCase(pendingStatus.id, { status: pendingStatus.prev }); setPendingStatus(null) } setReasonFor(null); setReasonText('') }}>
          <div className="modal" onClick={e=> e.stopPropagation()} style={{maxWidth:520}}>
            <div className="modal-header">
              <h3 className="modal-title">{t2(data.idioma,'blockedReason')}</h3>
              <button className="modal-close" onClick={()=> { if(pendingStatus){ updateTestCase(pendingStatus.id, { status: pendingStatus.prev }); setPendingStatus(null) } setReasonFor(null); setReasonText('') }} aria-label={t2(data.idioma,'close')}>x</button>
            </div>
            <div className="modal-body">
              <input className="btn" placeholder={t2(data.idioma,'whyBlocked')} value={reasonText} onChange={e=> setReasonText((e.target as any).value)} autoFocus />
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={()=> { if(pendingStatus){ updateTestCase(pendingStatus.id, { status: pendingStatus.prev }); setPendingStatus(null) } setReasonFor(null); setReasonText('') }}>{t2(data.idioma,'cancel')}</button>
              <button className="btn primary" disabled={!reasonText.trim()} onClick={()=> { if(reasonFor && reasonText.trim()){ updateTestCase(reasonFor, { blockedReason: reasonText.trim() }); setReasonFor(null); setReasonText(''); setPendingStatus(null) } }}>{t2(data.idioma,'confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {stepsFor && (
        <div className="modal-backdrop" onClick={()=> { setStepsFor(null); setStepsText('') }}>
          <div className="modal" onClick={e=> e.stopPropagation()} style={{maxWidth:720}}>
            <div className="modal-header">
              <h3 className="modal-title">{t2(data.idioma,'steps')}</h3>
              <button className="modal-close" onClick={()=> { setStepsFor(null); setStepsText('') }} aria-label={t2(data.idioma,'close')}>x</button>
            </div>
            <div className="modal-body" style={{display:'grid', gap:8}}>
              <div style={{display:'flex', gap:8}}>
                <button className="btn" onClick={()=> setStepsText(s=> s + (s.endsWith('\n')||s===''? '':'\n') + 'Given ')}>Given</button>
                <button className="btn" onClick={()=> setStepsText(s=> s + (s.endsWith('\n')||s===''? '':'\n') + 'When ')}>When</button>
                <button className="btn" onClick={()=> setStepsText(s=> s + (s.endsWith('\n')||s===''? '':'\n') + 'Then ')}>Then</button>
                <button className="btn" onClick={()=> setStepsText(s=> s + (s.endsWith('\n')||s===''? '':'\n') + 'And ')}>And</button>
              </div>
              <textarea className="btn" rows={10} style={{width:'100%'}} value={stepsText} onChange={e=> setStepsText((e.target as any).value)} placeholder={t2(data.idioma,'steps')} />
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={()=> { setStepsFor(null); setStepsText('') }}>{t2(data.idioma,'cancel')}</button>
              <button className="btn primary" onClick={()=> { if(stepsFor!==null){ const arr = stepsText.split(/\r?\n/).map(s=> s.trim()).filter(Boolean); updateTestCase(stepsFor, { steps: arr }); setStepsFor(null); setStepsText('') } }}>{t2(data.idioma,'save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

