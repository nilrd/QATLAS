# Documento Único — Especificação Principal do QAtlas v1.2

**Projeto:** QAtlas  
**Autores:** Larissa (ideia), Nilson (implementação)  
**Data:** 31/10/2025  
**Versão:** 1.2  
**Status:** Documento principal para criação e implementação

---

## 1. Visão Geral
O **QAtlas** é um dashboard web **offline‑first**, responsivo e multilíngue, para registro, execução, automação e relatórios de **casos de teste**. Opera 100% no navegador (LocalStorage), com opção de exportar/importar CSV e gerar arquivos `.feature` (BDD/Gherkin). Interface leve com **tema claro/escuro** e **tradução PT/ES/EN**.

### KPIs
- Tempo para lançar resultado: ≤ 5s após abrir o caso.  
- Cobertura de execução: ≥ 90% por ciclo.  
- Falhas com evidência: ≥ 80%.

### Personas
- QA Analyst (principal)  
- QA Lead/PO  
- Dev

---

## 2. Layout e UX (conforme imagem de referência)
O layout base traz cards de resumo no topo e uma tabela editável inline:
- Cards: **Total**, **Passaram**, **Falharam**, **Impedidos** (cores e números grandes).  
- Tabela: colunas visíveis como na imagem — `N° CT | Caso de Teste | Resultado Esperado | Resultado Real | Status | Executado? | ...`, com chips coloridos para status e checkboxes.

Elementos adicionais do produto:
- Header: `+ Novo Caso | Importar CSV | Exportar CSV | Gerar BDD | Relatórios | Limpar Tudo | Tema | Idioma`  
- Footer: contador de linhas + dicas de atalho.

---

## 3. Requisitos Funcionais (RF)
### RF‑01 — Criação e Edição
CRUD inline com ID incremental imutável (CT001…). Foco automático em Título ao criar.

### RF‑02 — Status de Execução
Status obrigatório: Passou ✅ | Falhou ❌ | Impedido ⚠ | Não Executado ⏸. Check "Executado?" sincroniza com Status.

### RF‑03 — Modo de Escrita
Step by Step (manual) ou Gherkin (BDD) definindo estrutura dos passos.

### RF‑04 — Tipo de Teste e Polaridade
`tipoTeste` (Funcional, Regressão, etc.) e `polaridade` (Positivo/Negativo) — usados em métricas e relatórios.

### RF‑05 — Passos e Evidências
Passos dinâmicos (+/−). Evidência aceita link/arquivo; obrigatória em Falhou.

### RF‑06 — Apto para Automação
Booleano. Inclui o caso na geração `.feature` somente se Modo = Gherkin.

### RF‑07 — Geração de Arquivos BDD
Exporta `.feature` para casos aptos:
```gherkin
Feature: [Título do caso]
  Scenario: [Descrição]
    Given [Pré-condição]
    When [Ação]
    Then [Resultado Esperado]
```
Arquivo com cabeçalho: `# Gerado automaticamente pelo QAtlas v1.2`.

### RF‑08 — Relatórios (Status Report)
Painel com:  
- Gráficos pizza/barras por status.  
- Tabela resumo por `tipoTeste` e `polaridade` (qtd e %).  
- Tempo médio de execução (usa `updatedAt`).  
- Botão “Baixar Relatório (.PDF)”.  
Atalho: `Ctrl+R`.

### RF‑09 — Salvamento Automático
Autosave em LocalStorage a cada interação e ao sair.

### RF‑10 — Importar/Exportar CSV
Exporta todos os campos. Importa com pré‑visualização e opção de **mesclar** (por `id`, respeitando `updatedAt`) ou **sobrescrever**.

### RF‑11 — Filtros, Busca e Ordenação
Filtros por Status, Responsável, Tipo de Teste e texto livre. Ordenação por Nº CT, Status e Última Atualização.

### RF‑12 — Undo/Redo
Histórico local de 20 ações.

### RF‑13 — Tema e Idioma
Tema claro/escuro e idioma persistentes.

### RF‑14 — Atalhos de Teclado
`N` novo | `E` executado | `P` passou | `F` falhou | `I` impedido | `Ctrl+S` CSV | `Ctrl+B` BDD | `Ctrl+R` relatórios

---

## 4. Regras de Negócio (RN)
- RN‑01: `Status` e `Executado?` coerentes.  
- RN‑02: `Falhou` exige `resultadoReal` e `evidencia`.  
- RN‑03: `Impedido` exige `motivo` e força `status = IMPEDIDO`.  
- RN‑04: `Apto Automação = true` somente se `modo = Gherkin`.  
- RN‑05: `id` (N° CT) é único e imutável.  
- RN‑06: Preferências (tema/idioma) persistem localmente.  
- RN‑07: Relatórios refletem fielmente os dados atuais.  
- RN‑08: Campos `tipoTeste` e `polaridade` aparecem nos relatórios.

---

## 5. Requisitos Não Funcionais (RNF)
- RNF‑01 Performance: 1.000 linhas renderizadas em ≤ 200ms (virtualização).  
- RNF‑02 Usabilidade: ações críticas em ≤ 2 cliques.  
- RNF‑03 Acessibilidade: teclado e contraste AA.  
- RNF‑04 Segurança: dados locais; exportação manual.  
- RNF‑05 Portabilidade: Chrome, Firefox, Edge, Safari.  
- RNF‑06 Relatórios: geração de PDF em ≤ 5s, consistência visual entre navegadores.

---

## 6. Modelo de Dados e Persistência
### 6.1 LocalStorage
Chave: `qatlas:v1`
```json
{
  "meta": { "version": 1, "theme": "light", "lang": "pt-BR", "updatedAt": "2025-10-31T08:00:00Z" },
  "cases": [
    {
      "id": "CT001",
      "titulo": "Login com credenciais válidas",
      "modo": "Gherkin",
      "tipoTeste": "Funcional",
      "polaridade": "Positivo",
      "passos": ["Abrir tela de login", "Preencher usuário e senha", "Clicar em Entrar"],
      "resultadoEsperado": "Usuário acessa o sistema",
      "resultadoReal": "",
      "status": "NAO_EXECUTADO",
      "executado": false,
      "impedido": false,
      "motivo": "",
      "evidencia": "",
      "aptoAutomacao": false,
      "responsavel": "",
      "updatedAt": 0
    }
  ]
}
```

### 6.2 Esquema de CSV (ordem fixa)
`id,titulo,modo,tipoTeste,polaridade,passos,resultadoEsperado,resultadoReal,status,executado,impedido,motivo,evidencia,aptoAutomacao,responsavel,updatedAt`

Regras de Importação:  
- Normalizar `status` para {PASSOU,FALHOU,IMPEDIDO,NAO_EXECUTADO}.  
- `executado`/`impedido` aceitar {true/false, 1/0, sim/não}.  
- Mesclar por `id`; se `updatedAt` do CSV for mais novo, sobrescrever.

---

## 7. Fluxo do Usuário
1) Abre QAtlas (carrega LocalStorage).  
2) `+ Novo Caso` cria CTnnn e foca em Título.  
3) Preenche campos principais; define Modo, Tipo e Polaridade.  
4) Marca Executado e define Status (validando regras).  
5) Autosave atualiza cards e `updatedAt`.  
6) Exporta CSV ou gera BDD.  
7) Acessa Relatórios e baixa PDF se necessário.  
8) Importa CSV (mescla/sobrescreve) quando aplicável.

---

## 8. Atalhos
`N`, `E`, `P`, `F`, `I`, `Ctrl+S`, `Ctrl+B`, `Ctrl+R`.

---

## 9. Critérios de Aceite
- Tema e idioma persistem.  
- Edição inline funcional.  
- `.feature` inclui apenas casos aptos.  
- CSV exportado reimporta sem dif.  
- Relatórios exibem gráficos e estatísticas (incluindo Tipo/Polaridade) e baixam PDF.  
- Opera 100% offline e mantém performance/AA.

---

## 10. Plano de Implementação (Fluxo de Criação do Projeto)
### Stack sugerida
- Vite + React + Zustand (estado) + TanStack Table (virtualização) + Tailwind opcional.  
- Alternativa Vanilla: HTML/CSS + lit‑html/htmx.

### Passos
1. Criar projeto com Vite (React).  
2. Implementar camada de persistência (`qatlas:v1`) e seed vazio.  
3. Construir Tabela editável inline com virtualização e autosave.  
4. Cards de resumo com agregações por status.  
5. Export CSV; depois Import CSV com normalização e mescla por `id`/`updatedAt`.  
6. Tema/Idioma persistentes.  
7. Atalhos de teclado.  
8. Undo/Redo (20 ações).  
9. Geração `.feature` (apto + Gherkin).  
10. Relatórios (gráficos, tabela por Tipo/Polaridade, PDF).  
11. Testes de smoke e acessibilidade.

### Roadmap
- v1.0: CRUD + autosave + cards + export CSV + tema.  
- v1.1: Import CSV + filtros/ordenação.  
- v1.2: BDD + multi‑idioma + Relatórios (este documento).  
- v1.3+: Upload de evidências, gráficos avançados, templates, histórico.

---

## 11. Mensagens e Validações
- Falhou sem Resultado Real → “Descreva o resultado observado.”  
- Falhou sem Evidência → “Inclua um link ou anexo da evidência.”  
- Impedido sem Motivo → “Informe o motivo do impedimento.”  
- Limpar Tudo → “Backup CSV automático antes de apagar. Confirmar?”

---

## 12. Considerações Finais
Documento unificado para guiar design, desenvolvimento e validação do QAtlas. O layout da imagem foi incorporado nos cards e na tabela base, garantindo aderência visual e operacional ao que será entregue.