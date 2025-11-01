# Documento de Requisitos e Regras de Negócio — QAtlas v1.2

**Projeto:** QAtlas  
**Autores:** Larissa (ideia original), Nilson (implementação inicial)  
**Data:** 31/10/2025  
**Versão:** 1.2  
**Status:** Documento para implementação

---

## 1. Visão Geral
O **QAtlas** é um dashboard web **offline-first**, responsivo e multilíngue, criado para registro, execução e automação de **casos de teste**. O sistema permite alternar entre modo **manual (Step by Step)** e **automático (Gherkin/BDD)**, com exportação direta de arquivos `.feature`.

A interface é leve (“slim”), com suporte a **tema claro e escuro** e **tradução automática** (Português, Espanhol, Inglês), utilizando bandeiras 🇧🇷 🇪🇸 🇺🇸 para seleção.

---

## 2. Objetivos do Sistema
- Facilitar o registro e acompanhamento de execuções de testes manuais.  
- Reduzir tempo de documentação e transcrição para automação (geração automática de `.feature`).  
- Manter funcionamento local (sem servidor) com persistência via `LocalStorage`.  
- Oferecer visual limpo, intuitivo e multilíngue.  

---

## 3. Layout e UX
### 3.1 Estrutura Principal
**Header (topo fixo):**  
- Logo do QAtlas (modo adaptativo Light/Dark).  
- Botões principais:  
  `+ Novo Caso` | `Importar CSV` | `Exportar CSV` | `Gerar BDD` | `Limpar Tudo` | `🌙/☀️ Tema` | `🌐 Idioma`

**Painel de Resumo (cards coloridos):**  
- Total de Testes  
- Passaram (verde)  
- Falharam (vermelho)  
- Impedidos (âmbar)  
- Não Executados (cinza)

**Tabela Principal (editável inline):**  
Colunas:  
`N° CT | Caso | Resultado Esperado | Resultado Real | Modo | Passos | Evidência | Status | Executado | Impedido | Motivo | Apto Automação | Responsável | Última Atualização`

**Footer:**  
- Dicas de atalho  
- Contador de linhas  
- Créditos (“Criado por QA Larissa & Nilson”)

---

## 4. Requisitos Funcionais (RF)
### RF-01 — Criação e Edição
O usuário pode adicionar, editar e remover casos de teste com ID incremental (CT001...).

### RF-02 — Status de Execução
Cada caso possui um status obrigatório: Passou ✅ | Falhou ❌ | Impedido ⚠ | Não Executado ⏸

### RF-03 — Modo de Escrita
Campo de seleção: **Step by Step** (manual) ou **Gherkin (BDD)**. Define a estrutura de preenchimento dos passos.

### RF-04 — Passos e Evidências
- O usuário pode adicionar **n passos** (botões + / –).  
- Campo “Evidência” aceita link, imagem ou arquivo.  
- Evidências obrigatórias se o status = Falhou.

### RF-05 — Apto para Automação
Campo booleano (Sim/Não). Se “Sim”, o caso é incluído na geração automática de `.feature`.

### RF-06 — Geração de Arquivos BDD
Botão **“Gerar BDD (.feature)”** exporta todos os casos com “Apto para Automação = Sim” no formato Gherkin:
```gherkin
Feature: [Título do caso]
  Scenario: [Descrição]
    Given [Pré-condição]
    When [Ação]
    Then [Resultado Esperado]
```
Arquivo `.feature` gerado com comentário:  
`# Gerado automaticamente pelo QAtlas v1.2`

### RF-07 — Salvamento Automático
Todas as alterações são salvas em tempo real no `LocalStorage`.

### RF-08 — Exportar e Importar CSV
Exporta todos os campos e importa com preview e opção de sobrescrever ou mesclar.

### RF-09 — Tema Claro/Escuro
- Toggle (☀️ / 🌙) no topo.  
- Preferência salva em `LocalStorage`.  
- Mantém contraste acessível (WCAG AA).

### RF-10 — Multi-Idioma
- Botão 🌐 com bandeiras 🇧🇷 🇪🇸 🇺🇸.  
- Tradução imediata da interface.  
- Idioma salvo em `LocalStorage`.  

### RF-11 — Responsividade
Layout ajustável entre desktop, tablet e mobile. Tabela slim e rolagem horizontal.

### RF-12 — Atalhos de Teclado
`N` = Novo caso  |  `E` = Executado  |  `P` = Passou  |  `F` = Falhou  |  `I` = Impedido  |  `Ctrl + S` = Exportar CSV  |  `Ctrl + B` = Gerar BDD

---

## 5. Regras de Negócio (RN)
- **RN-01:** `Status` e `Executado?` coerentes.  
- **RN-02:** `Falhou` exige Evidência e Resultado Real.  
- **RN-03:** `Impedido` exige Motivo.  
- **RN-04:** `Apto Automação` só pode ser “Sim” se Modo = Gherkin.  
- **RN-05:** `N° CT` único e imutável.  
- **RN-06:** Tema, idioma e preferências persistem localmente.  
- **RN-07:** O sistema funciona 100% offline.

---

## 6. Requisitos Não Funcionais (RNF)
- **RNF-01 Performance:** 1.000 casos renderizados em < 200ms.  
- **RNF-02 Usabilidade:** ações em até 2 cliques.  
- **RNF-03 Acessibilidade:** navegação por teclado e contraste AA.  
- **RNF-04 Segurança:** dados locais; exportação manual.  
- **RNF-05 Portabilidade:** compatível com Chrome, Firefox, Edge e Safari.

---

## 7. Fluxo do Usuário (Completo)
1. Abre o QAtlas → carrega dados locais.  
2. Escolhe idioma (PT/ES/EN).  
3. Cria novo caso.  
4. Preenche título, resultado esperado e modo (Step by Step / Gherkin).  
5. Adiciona passos, evidências e marca “Apto Automação” se aplicável.  
6. Executa teste e define status.  
7. Sistema salva automaticamente.  
8. Se houver casos aptos → botão “Gerar BDD” ativo.  
9. Clica → gera e baixa `.feature`.  
10. Pode exportar CSV, alternar idioma ou tema.  
11. Fecha navegador → dados permanecem salvos.

---

## 8. Critérios de Aceite
- Tema claro/escuro persistente.  
- Alternância de idioma altera todos os textos.  
- Campos editáveis inline.  
- Geração `.feature` inclui apenas casos aptos.  
- CSV exportado reimportável.  
- Layout adaptável até 1024px.  
- Funciona 100% offline.

---

## 9. Modelo de Dados (JSON)
```json
{
  "id": "CT001",
  "titulo": "Login com credenciais válidas",
  "modo": "Gherkin",
  "passos": ["Abrir tela de login", "Preencher usuário e senha", "Clicar em Entrar"],
  "resultadoEsperado": "Usuário acessa o sistema",
  "resultadoReal": "",
  "status": "PASSOU",
  "executado": true,
  "impedido": false,
  "motivo": "",
  "evidencia": "https://link.com/img.png",
  "aptoAutomacao": true,
  "responsavel": "Nilson",
  "idioma": "pt-BR",
  "tema": "dark"
}
```

---

## 10. Roadmap Técnico
| Versão | Feature | Descrição | Prioridade |
|:-------|:---------|:-----------|:------------|
| v1.0 | CRUD + LocalStorage | MVP funcional | Alta |
| v1.1 | Import/Export CSV | Integração de dados | Alta |
| v1.2 | Geração BDD + Multi-Idioma + Tema | Versão completa | Alta |
| v1.3 | Upload de arquivos + Filtros avançados | Refinamento | Média |
| v1.4 | Estatísticas visuais + Relatórios | Evolução | Baixa |

---

## 11. Considerações Finais
O QAtlas deve ser **intuitivo, leve e expansível**. A proposta é unir QA manual e automação, tornando o dashboard uma ponte entre execução e código. O sistema poderá ser usado em squads ágeis, hackathons e ensino, com **interface bilíngue, design moderno e responsivo**, reforçando a marca QAtlas como ferramenta de referência para profissionais de QA.

