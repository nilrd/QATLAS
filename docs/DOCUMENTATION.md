# QAtlas - Documentação Oficial v1.2

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/logo_qatlas_dark.png">
    <source media="(prefers-color-scheme: light)" srcset="/logo_qatlas.png">
    <img alt="QAtlas Logo" src="/logo_qatlas.png" width="400">
  </picture>

  [![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/yourusername/qatlas)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Made with Love](https://img.shields.io/badge/made%20with-❤️-red.svg)](https://github.com/yourusername/qatlas)
</div>

## Índice
1. [Sobre o QAtlas](#sobre-o-qatlas)
2. [Instalação](#instalação)
3. [Funcionalidades](#funcionalidades)
4. [Guia do Usuário](#guia-do-usuário)
5. [Arquitetura Técnica](#arquitetura-técnica)
6. [API e Integrações](#api-e-integrações)
7. [Contribuindo](#contribuindo)
8. [Roadmap](#roadmap)
9. [Suporte](#suporte)

## Sobre o QAtlas

### História e Propósito
O QAtlas nasceu da necessidade real identificada pela QA **LARISSA PAULA ROCHA**, que buscava uma alternativa mais eficiente às tradicionais planilhas para organização de casos de teste. A implementação foi realizada pelo QA **Nilson da Silva Brites**, transformando a ideia em uma ferramenta profissional e intuitiva.

### Significado do Nome
O nome QAtlas combina dois conceitos fundamentais:
- **QA** (Quality Assurance) — a base da disciplina de testes
- **Atlas** — simbolizando um mapa completo, como o titã que sustenta o mundo

Esta combinação representa a ferramenta como um mapa completo da qualidade, onde o QA visualiza e controla todos os caminhos de validação.

### Objetivos Principais
- Registro rápido e eficiente de casos de teste
- Visualização em tempo real de métricas
- Operação 100% offline com sincronização via CSV
- Interface intuitiva e responsiva
- Suporte a múltiplos idiomas e temas

## Instalação

### Requisitos do Sistema
- Node.js 18+
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- 512MB RAM mínimo
- 100MB espaço em disco

### Passo a Passo
\`\`\`bash
# Clone o repositório
git clone https://github.com/yourusername/qatlas.git

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
\`\`\`

### Build para Produção
\`\`\`bash
npm run build
npm run preview
\`\`\`

## Funcionalidades

### 🎯 Gestão de Casos de Teste
- **Tabela Interativa**
  - Edição inline
  - Ordenação e filtros
  - Virtualização para grande volume
  - Autosave em tempo real

- **Sistema de Status**
  - Passou ✅
  - Falhou ❌
  - Impedido ⚠️
  - Não Executado ⏸️

- **Campos Principais**
  - ID único (CTxxx)
  - Título
  - Resultado Esperado
  - Resultado Real
  - Evidências
  - Responsável
  - Data de Atualização

### 📊 Métricas e Relatórios
- **Cards de Resumo**
  - Total de casos
  - Distribuição por status
  - Percentual de cobertura
  - Tempo médio de execução

- **Relatórios em PDF**
  - Gráficos interativos
  - Tabelas sumarizadas
  - Exportação personalizada
  - Histórico de execução

### 🔄 Integração e Exportação
- **Formato CSV**
  - Importação com preview
  - Exportação completa
  - Merge inteligente
  - Backup automático

- **Geração BDD**
  - Arquivos .feature
  - Sintaxe Gherkin
  - Mapeamento automático
  - Validação de estrutura

### 🎨 Interface e Usabilidade
- **Temas**
  - Claro/Escuro
  - Persistência de preferência
  - Contraste WCAG AA
  - Adaptação automática

- **Idiomas**
  - Português 🇧🇷
  - Espanhol 🇪🇸
  - Inglês 🇺🇸
  - Detecção automática

- **Atalhos de Teclado**
  | Atalho | Ação |
  |--------|------|
  | N | Novo caso |
  | E | Editar |
  | I | Impedido |
  | P | Passou |
  | F | Falhou |
  | Ctrl+S | Salvar |
  | Ctrl+B | Gerar BDD |
  | Ctrl+R | Relatório |

## Guia do Usuário

### Primeiros Passos
1. **Criando um Caso de Teste**
   - Clique em "+ Novo" ou pressione N
   - Preencha o título
   - Defina o tipo e modo
   - Adicione passos se necessário

2. **Executando um Teste**
   - Selecione o caso
   - Preencha resultado real
   - Defina o status
   - Adicione evidências se necessário

3. **Gerando Relatórios**
   - Acesse a aba Relatórios
   - Selecione o período
   - Escolha o formato
   - Exporte ou visualize

### Boas Práticas
- Mantenha títulos concisos e descritivos
- Atualize status regularmente
- Use evidências para falhas
- Faça backup via CSV periodicamente

## Arquitetura Técnica

### Stack Tecnológico
\`\`\`
Frontend:
  - React 18+
  - TypeScript 5
  - Vite 4
  - Zustand (Estado)
  - Chart.js (Gráficos)

Persistência:
  - LocalStorage
  - IndexedDB (planejado)

Build/Deploy:
  - ESBuild
  - Vercel/Netlify
\`\`\`

### Estrutura de Diretórios
\`\`\`
src/
├── state.ts         # Gerenciamento de estado
├── i18n.ts          # Internacionalização
├── components/      # Componentes React
│   ├── Header.tsx
│   ├── CaseTable.tsx
│   └── Cards.tsx
├── pages/
│   └── Reports.tsx
└── types/
    └── index.ts
\`\`\`

### Modelo de Dados
\`\`\`typescript
interface QACase {
  id: string;
  titulo: string;
  modo: 'StepByStep' | 'Gherkin';
  tipoTeste: string;
  polaridade: 'Positivo' | 'Negativo' | '';
  passos: string[];
  resultadoEsperado: string;
  resultadoReal: string;
  status: Status;
  executado: boolean;
  impedido: boolean;
  motivo: string;
  aptoAutomacao: boolean;
  responsavel: string;
  updatedAt: number;
}
\`\`\`

## API e Integrações

### LocalStorage
- Chave: \`qatlas:v1\`
- Formato: JSON
- Compressão: Não
- Tamanho máximo: ~5MB

### Formato CSV
\`\`\`csv
id,titulo,modo,tipoTeste,polaridade,passos,resultadoEsperado,resultadoReal,status,executado,impedido,motivo,aptoAutomacao,responsavel,updatedAt
\`\`\`

### Formato BDD (.feature)
\`\`\`gherkin
Feature: [Título do Caso]
  Scenario: [Descrição]
    Given [Pré-condição]
    When [Ação]
    Then [Resultado Esperado]
\`\`\`

## Contribuindo

### Setup de Desenvolvimento
1. Fork o repositório
2. Clone localmente
3. Instale dependências
4. Crie branch de feature
5. Desenvolva e teste
6. Push e PR

### Padrões
- Commits semânticos
- TypeScript strict
- ESLint config
- Prettier format

### Code Review
- PR template
- Checklists
- Testes necessários
- Documentation

## Roadmap

### Versão 1.3 (Próxima)
- [ ] Upload de evidências
- [ ] Filtros avançados
- [ ] Templates de casos
- [ ] Dark mode aprimorado

### Versão 1.4
- [ ] Gráficos avançados
- [ ] Export para Jira
- [ ] Múltiplos projetos
- [ ] Sync via arquivo

### Futuro
- Mobile app
- Colaboração real-time
- AI suggestions
- Cloud sync opcional

## Suporte

### Canais
- GitHub Issues
- Discord Community
- Email Support

### FAQ
1. **Como recuperar dados?**
   - Exporte CSV regularmente
   - Use backup automático
   - LocalStorage persist

2. **Limite de casos?**
   - 1000 recomendado
   - Virtualização ativa
   - Split em projetos

3. **Browsers suportados?**
   - Chrome 90+
   - Firefox 85+
   - Edge 90+
   - Safari 14+

---

<div align="center">

### ⭐ Criadores

**Idealização**  
QA LARISSA PAULA ROCHA

**Desenvolvimento**  
QA Nilson da Silva Brites

*Feito com ❤️ pela comunidade QA para a comunidade QA*

</div>
