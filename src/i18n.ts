export type Lang = 'pt-BR'|'es-ES'|'en-US'

const dict: Record<Lang, Record<string,string>> = {
  'pt-BR': {
    dashboard: 'Dashboard de QA — Casos de Teste',
    total: 'Total de Testes', passed: 'Passaram', failed: 'Falharam', blocked: 'Impedidos',
    newCase: '+ Novo Caso de Teste', importCSV: 'Importar CSV', exportCSV:'Exportar CSV',
    generateBDD:'Gerar BDD', reports:'Relatórios', clearAll:'Limpar Tudo', theme:'Tema', language:'Idioma',
    case:'Caso de Teste', expected:'Resultado Esperado', actual:'Resultado Real', status:'Status', executed:'Executado?', impeded:'Impedido?', reason:'Motivo', evidence:'Evidência/Link', responsible:'Responsável', updatedAt:'Última Atualização',
    notExecuted:'Não Executado', yes:'Sim', no:'Não', preview:'Pré-visualização', merge:'Mesclar', overwrite:'Sobrescrever', cancel:'Cancelar', confirm:'Confirmar',
    caseNumber:'Nº CT', mode:'Modo', testType:'Tipo de Teste', polarity:'Polaridade', steps:'Passos', automationReady:'Apto Automação',
    stepByStep:'Step by Step', gherkin:'Gherkin (BDD)', positive:'Positivo', negative:'Negativo',
    passou:'Passou', falhou:'Falhou', impedido:'Impedido', naoExecutado:'Não Executado',
    placeholderCase:'Ex.: Login com credenciais válidas', placeholderTestType:'Ex.: Funcional', placeholderReason:'Obrigatório se impedido', placeholderEvidence:'Link/arquivo (obrigatório se falhou)',
    addStep:'Adicionar Passo', stepsCount:'passo', stepsCountPlural:'passos',
    validationFailedNoResult:'Ao marcar como Falhou, é obrigatório preencher Resultado Real e Evidência.', validationImpededNoReason:'Informe o motivo do impedimento.', validationAutomationOnlyGherkin:'Apto para Automação só pode ser marcado se o Modo for Gherkin.', validationImpededBeforeReason:'Informe o motivo antes de marcar como impedido.',
    allStatus:'Todos os Status', allTypes:'Todos os Tipos', clearFilters:'Limpar Filtros', searchText:'Buscar texto',
    importTitle:'Importar CSV', selectFile:'Selecionar arquivo CSV', id:'ID', title:'Título', updated:'Atualizado',
    reportsTitle:'Relatórios', avgUpdateTime:'Tempo médio entre atualizações', totalCases:'Total de Casos', successRate:'Taxa de Sucesso', summaryByType:'Resumo por Tipo de Teste / Polaridade', typePolarity:'Tipo / Polaridade', passedCount:'Passaram', failedCount:'Falharam', blockedCount:'Impedidos', notExecutedCount:'Não Executados', downloadPDF:'Baixar Relatório (.PDF)', close:'Fechar',
    noAutomationCases:'Nenhum caso apto para automação encontrado. Marque casos como "Apto Automação" e Modo = Gherkin.', clearAllConfirm:'Tem certeza que deseja limpar todos os casos? Um backup CSV será feito automaticamente antes de apagar.', backupDone:'Backup realizado. Confirmar limpeza de todos os dados?', automationTooltip:'Gerar BDD', automationTooltipDisabled:'Nenhum caso apto para automação',
    rowsCount:'linhas', shortcuts:'Atalhos: N/E/I/P/F/Ctrl+S/Ctrl+B/Ctrl+R', newCaseButton:'+ Novo Caso de Teste',
    langPT:'Português (Brasil)', langES:'Español (España)', langEN:'English (United States)',
    deleteCase:'Excluir Caso', deleteConfirm:'Tem certeza que deseja excluir este caso de teste?', actions:'Ações'
  },
  'es-ES': {
    dashboard: 'Panel de QA — Casos de Prueba',
    total: 'Total de Pruebas', passed: 'Pasaron', failed: 'Fallaron', blocked: 'Impedidos',
    newCase: '+ Nuevo Caso', importCSV:'Importar CSV', exportCSV:'Exportar CSV',
    generateBDD:'Generar BDD', reports:'Reportes', clearAll:'Limpiar Todo', theme:'Tema', language:'Idioma',
    case:'Caso de Prueba', expected:'Resultado Esperado', actual:'Resultado Real', status:'Estado', executed:'¿Ejecutado?', impeded:'¿Impedido?', reason:'Motivo', evidence:'Evidencia/Link', responsible:'Responsable', updatedAt:'Última Actualización',
    notExecuted:'No Ejecutado', yes:'Sí', no:'No', preview:'Vista previa', merge:'Mezclar', overwrite:'Sobrescribir', cancel:'Cancelar', confirm:'Confirmar',
    caseNumber:'Nº CT', mode:'Modo', testType:'Tipo de Prueba', polarity:'Polaridad', steps:'Pasos', automationReady:'Apto Automatización',
    stepByStep:'Step by Step', gherkin:'Gherkin (BDD)', positive:'Positivo', negative:'Negativo',
    passou:'Pasaron', falhou:'Fallaron', impedido:'Impedidos', naoExecutado:'No Ejecutado',
    placeholderCase:'Ej.: Login con credenciales válidas', placeholderTestType:'Ej.: Funcional', placeholderReason:'Obligatorio si impedido', placeholderEvidence:'Link/archivo (obligatorio si falló)',
    addStep:'Agregar Paso', stepsCount:'paso', stepsCountPlural:'pasos',
    validationFailedNoResult:'Al marcar como Falló, es obligatorio completar Resultado Real y Evidencia.', validationImpededNoReason:'Informe el motivo del impedimento.', validationAutomationOnlyGherkin:'Apto para Automatización solo puede marcarse si el Modo es Gherkin.', validationImpededBeforeReason:'Informe el motivo antes de marcar como impedido.',
    allStatus:'Todos los Estados', allTypes:'Todos los Tipos', clearFilters:'Limpiar Filtros', searchText:'Buscar texto',
    importTitle:'Importar CSV', selectFile:'Seleccionar archivo CSV', id:'ID', title:'Título', updated:'Actualizado',
    reportsTitle:'Reportes', avgUpdateTime:'Tiempo promedio entre actualizaciones', totalCases:'Total de Casos', successRate:'Tasa de Éxito', summaryByType:'Resumen por Tipo de Prueba / Polaridad', typePolarity:'Tipo / Polaridad', passedCount:'Pasaron', failedCount:'Fallaron', blockedCount:'Impedidos', notExecutedCount:'No Ejecutados', downloadPDF:'Descargar Reporte (.PDF)', close:'Cerrar',
    noAutomationCases:'No se encontraron casos aptos para automatización. Marque casos como "Apto Automatización" y Modo = Gherkin.', clearAllConfirm:'¿Está seguro que desea limpiar todos los casos? Se hará una copia de seguridad CSV automáticamente antes de eliminar.', backupDone:'Respaldo realizado. ¿Confirmar limpieza de todos los datos?', automationTooltip:'Generar BDD', automationTooltipDisabled:'Ningún caso apto para automatización',
    rowsCount:'líneas', shortcuts:'Atajos: N/E/I/P/F/Ctrl+S/Ctrl+B/Ctrl+R', newCaseButton:'+ Nuevo Caso de Prueba',
    langPT:'Portugués (Brasil)', langES:'Español (España)', langEN:'English (United States)',
    deleteCase:'Eliminar Caso', deleteConfirm:'¿Está seguro que desea eliminar este caso de prueba?', actions:'Acciones'
  },
  'en-US': {
    dashboard: 'QA Dashboard — Test Cases',
    total: 'Total Tests', passed: 'Passed', failed: 'Failed', blocked: 'Blocked',
    newCase: '+ New Test Case', importCSV:'Import CSV', exportCSV:'Export CSV',
    generateBDD:'Generate BDD', reports:'Reports', clearAll:'Clear All', theme:'Theme', language:'Language',
    case:'Test Case', expected:'Expected Result', actual:'Actual Result', status:'Status', executed:'Executed?', impeded:'Blocked?', reason:'Reason', evidence:'Evidence/Link', responsible:'Owner', updatedAt:'Last Update',
    notExecuted:'Not Executed', yes:'Yes', no:'No', preview:'Preview', merge:'Merge', overwrite:'Overwrite', cancel:'Cancel', confirm:'Confirm',
    caseNumber:'Case #', mode:'Mode', testType:'Test Type', polarity:'Polarity', steps:'Steps', automationReady:'Automation Ready',
    stepByStep:'Step by Step', gherkin:'Gherkin (BDD)', positive:'Positive', negative:'Negative',
    passou:'Passed', falhou:'Failed', impedido:'Blocked', naoExecutado:'Not Executed',
    placeholderCase:'Ex.: Login with valid credentials', placeholderTestType:'Ex.: Functional', placeholderReason:'Required if blocked', placeholderEvidence:'Link/file (required if failed)',
    addStep:'Add Step', stepsCount:'step', stepsCountPlural:'steps',
    validationFailedNoResult:'When marking as Failed, it is mandatory to fill Result Real and Evidence.', validationImpededNoReason:'Inform the reason for the impediment.', validationAutomationOnlyGherkin:'Automation Ready can only be marked if Mode is Gherkin.', validationImpededBeforeReason:'Inform the reason before marking as blocked.',
    allStatus:'All Status', allTypes:'All Types', clearFilters:'Clear Filters', searchText:'Search text',
    importTitle:'Import CSV', selectFile:'Select CSV file', id:'ID', title:'Title', updated:'Updated',
    reportsTitle:'Reports', avgUpdateTime:'Average time between updates', totalCases:'Total Cases', successRate:'Success Rate', summaryByType:'Summary by Test Type / Polarity', typePolarity:'Type / Polarity', passedCount:'Passed', failedCount:'Failed', blockedCount:'Blocked', notExecutedCount:'Not Executed', downloadPDF:'Download Report (.PDF)', close:'Close',
    noAutomationCases:'No automation-ready cases found. Mark cases as "Automation Ready" and Mode = Gherkin.', clearAllConfirm:'Are you sure you want to clear all cases? A CSV backup will be made automatically before deleting.', backupDone:'Backup done. Confirm deletion of all data?', automationTooltip:'Generate BDD', automationTooltipDisabled:'No automation-ready cases',
    rowsCount:'rows', shortcuts:'Shortcuts: N/E/I/P/F/Ctrl+S/Ctrl+B/Ctrl+R', newCaseButton:'+ New Test Case',
    langPT:'Português (Brasil)', langES:'Español (España)', langEN:'English (United States)',
    deleteCase:'Delete Case', deleteConfirm:'Are you sure you want to delete this test case?', actions:'Actions'
  }
}

export function t(lang: Lang, key: string){
  return dict[lang][key] ?? key
}

