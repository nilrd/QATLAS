<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/logo_qatlas_dark.png">
    <source media="(prefers-color-scheme: light)" srcset="./public/logo_qatlas.png">
    <img alt="QAtlas Logo" src="./public/logo_qatlas.png" width="400">
  </picture>
  
  # QAtlas — Seu Atlas Digital de Qualidade
  
  [![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/yourusername/qatlas)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Made with Love](https://img.shields.io/badge/made%20with-❤️-red.svg)](https://github.com/yourusername/qatlas)

  *Dashboard web offline-first para gestão completa de casos de teste*
</div>

## 🌟 Sobre o QAtlas

O nome QAtlas nasceu da junção de duas ideias que definem o espírito do projeto:

- **QA** (Quality Assurance) — a base da disciplina de testes
- **Atlas** — simbolizando um mapa completo, como o titã que sustenta o mundo

QAtlas é seu mapa da qualidade — uma ferramenta onde o QA visualiza e controla todos os caminhos de validação, como um atlas digital de seus testes, resultados e métricas.

### 💡 História

O projeto nasceu da necessidade real identificada pela QA **LARISSA PAULA ROCHA**, que buscava uma alternativa mais eficiente às tradicionais planilhas para organização de casos de teste. A implementação foi realizada pelo QA **Nilson da Silva Brites**, transformando a ideia em uma ferramenta profissional e intuitiva.

## ✨ Funcionalidades Principais

🎯 **Gestão Completa de Testes**
- Tabela interativa com edição inline
- Autosave automático em LocalStorage
- Sistema de undo/redo
- Exportação e importação via CSV

📊 **Dashboards e Métricas**
- Cards de resumo em tempo real
- Gráficos interativos
- Relatórios em PDF
- Métricas de cobertura

🔄 **Automação e BDD**
- Geração automática de arquivos .feature
- Suporte a sintaxe Gherkin
- Validação de cenários
- Export para ferramentas de automação

🎨 **Interface Moderna**
- Tema claro/escuro
- Responsivo
- Multilíngue (PT/ES/EN)
- Atalhos de teclado

## 🚀 Começando

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/yourusername/qatlas.git

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

📱 Acesse `http://localhost:5173` em seu navegador

### Build & Deploy

```bash
# Gerar build de produção
npm run build

# Testar build localmente
npm run preview
```

#### Deploy na Vercel
1. Framework: `Vite`
2. Build Command: `npm run build`
3. Output Directory: `dist`

## 🛠️ Guia Técnico

### Arquitetura

```
src/
├── state.ts         # Gerenciamento de estado (Zustand)
├── i18n.ts          # Internacionalização
├── components/      # Componentes React
│   ├── Header.tsx   # Cabeçalho e ações principais
│   ├── CaseTable.tsx# Tabela de casos de teste
│   └── Cards.tsx    # Cards de métricas
└── pages/
    └── Reports.tsx  # Página de relatórios
```

### Tecnologias Principais

| Categoria | Tecnologias |
|-----------|-------------|
| Frontend | React, TypeScript, Vite |
| Estado | Zustand, LocalStorage |
| UI/UX | CSS Modules, Chart.js |
| Exportação | jsPDF, html2canvas |
| Build | Vite, ESBuild |

### ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `N` | Novo caso de teste |
| `E` | Editar caso atual |
| `I` | Marcar impedido |
| `P` | Marcar como passou |
| `F` | Marcar como falhou |
| `Ctrl+S` | Salvar alterações |
| `Ctrl+B` | Gerar BDD |
| `Ctrl+R` | Gerar relatório |

### 📋 Formato CSV

```csv
id,titulo,modo,tipoTeste,polaridade,passos,resultadoEsperado,resultadoReal,status,executado,impedido,motivo,aptoAutomacao,responsavel,updatedAt
```

#### Regras de Importação
- Mescla automática por `id`
- Resolução de conflitos por `updatedAt`
- Normalização de status e booleanos
- Preview antes da importação

## 📈 Performance

- Otimizado para até 1000 casos de teste
- Virtualização opcional para grandes conjuntos
- Cache eficiente com LocalStorage
- Operações em lote para CSV

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">

### ⭐ Criadores

**Idealização**  
QA LARISSA PAULA ROCHA

**Desenvolvimento**  
QA Nilson da Silva Brites

*Feito com ❤️ pela comunidade QA para a comunidade QA*

</div>

