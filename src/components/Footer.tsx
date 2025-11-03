export function Footer(){
  return (
    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12, textAlign: 'center' }}>
      <div>
        QAtlas v2.3 — Idealizado e Desenvolvido por{' '}
        <a href="https://www.linkedin.com/in/larissa-rocha-10673027b/" target="_blank" rel="noreferrer" style={{ color: 'var(--fg)', textDecoration: 'none' }}>Larissa</a>
        {' '}e{' '}
        <a href="https://www.linkedin.com/in/nilsondasilvabrites/" target="_blank" rel="noreferrer" style={{ color: 'var(--fg)', textDecoration: 'none' }}>Nilson</a>
        {' '}para facilitar a vida do QA
      </div>
      <div>
        Made with ❤️ | Open Source |{' '}
        <a href="https://github.com/nilrd/QATLAS" target="_blank" rel="noreferrer" style={{ color: 'var(--fg)', textDecoration: 'none' }}>GitHub/ATLAS</a>
      </div>
    </div>
  )
}

