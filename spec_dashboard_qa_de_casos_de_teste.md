# QAtlas

**QAtlas** — Dashboard de Casos de Teste leve, offline‑first, com resumo em tempo real e exportação CSV.

Projeto idealizado por Larissa, QA, com implementação inicial por Nilson.

> Alternativas: **QAtlas**, **TestPulse**, **CaseTrackr**.

---

## Visão Geral

Uma aplicação web simples (single‑page) para registrar, acompanhar e exportar resultados de execução de casos de teste. Funciona 100% no navegador (LocalStorage) e não exige backend. Foco em velocidade, clareza visual e baixa fricção para squads.

---

## Objetivos

- Registrar rapidamente resultados (Passou/Falhou/Impedido) e observações.
- Mostrar métricas sumarizadas no topo (totais, % por status, executados/pendentes).
- Operar offline, com autosave local e opção de exportar/importar CSV.
- Reduzir ambiguidade: nomear campos, validar entradas e padronizar estados.

### KPIs de Produto

- Tempo médio para lançar um resultado: **≤ 5s** após abrir o caso.
- Cobertura de execução (executados / total): **≥ 90%** em ciclos.
- % de casos com evidência/anexo quando **Falhou**: **≥ 80%**.

---

## Personas

1. **QA Analyst** (principal): lança execução, marca status, escreve evidência.
2. **QA Lead/PO**: acompanha resumo e exporta CSV para reporte.
3. **Dev**: consulta campos de impedimento/observações para desbloqueio rápido.

---

## Requisitos Funcionais (RF)

**RF‑01** Tabela principal com colunas: Nº CT, Título, Pré‑Condição, Passos (resumo), Resultado Esperado, Resultado Real, Status, Executado?, Impedido?, Motivo do Impedimento, Severidade, Responsável, Evidência/Link, Última Atualização.

**RF‑02** Campo **Status** com opções e cores:

- **Passou** (verde)
- **Falhou** (vermelho)
- **Impedido** (âmbar)
- **Não Executado** (cinza — default)

**RF‑03** Check **Executado?** (bool) sincronizado com **Status**:

- Marcar **Executado** força `Status ∈ {Passou, Falhou, Impedido}`.
- Desmarcar **Executado** redefine para **Não Executado**.

**RF‑04** Check **Impedido?** abre **Motivo do Impedimento** (texto obrigatório) e ajusta **Status** para **Impedido**.

**RF‑05** **Resultado Real** (texto curto) e **Evidência/Link** (URL/file) são obrigatórios quando **Falhou**.

**RF‑06** Cards de resumo no topo:

- Total de Testes, Passaram, Falharam, Impedidos, Não Executados.
- Mostrar também **%** e um pequeno gráfico de barras/pizza.

**RF‑07** **Autosave** em LocalStorage a cada interação e ao sair da página.

**RF‑08** **Exportar CSV** de todos os campos; **Importar CSV** mescla por **Nº CT** (chave primária lógica), com pré‑visualização e opção de sobrescrever/mesclar.

**RF‑09** **Novo Caso de Teste**: botão que insere linha com ID incremental (ex.: CT001… CTnnn) e foco no campo Título.

**RF‑10** **Limpar Tudo**: exige confirmação dupla; permite backup automático antes de limpar.

**RF‑11** **Filtros e Busca**: por Status, Responsável, Severidade, texto livre.

**RF‑12** **Ordenação** por Nº CT, Status, Severidade, Última Atualização.

**RF‑13** **Tema claro/escuro** persistente.

**RF‑14** **Atalhos de teclado**:

- `N` novo caso, `E` alterna Executado, `I` alterna Impedido, `P` marca Passou, `F` Falhou, `Ctrl+S` exporta CSV.

**RF‑15** **Undo/Redo** local (histórico curto de 20 ações).

**RF‑16** **Validações** (ver RNF e Regras de Negócio) com mensagens amigáveis.

---

## Regras de Negócio (RB)

- **RB‑01** `Status` e `Executado?` são coerentes (ver RF‑03).
- **RB‑02** **Impedido?** implica **Motivo** obrigatório e `Status=Impedido`.
- **RB‑03** **Falhou** exige **Resultado Real** e **Evidência/Link**.
- **RB‑04** **Passou** pode ter **Resultado Real** opcional; recomenda nota curta.
- **RB‑05** **Severidade** (Baixa/Média/Alta/Crítica) só é relevante para Falhou/Impedido; pode ficar oculta para Passou/Não Executado.
- **RB‑06** **Nº CT** é único e imutável após criado (chave de mescla no CSV).

---

## Requisitos Não Funcionais (RNF)

- **RNF‑01 Performance:** renderizar 1k linhas em ≤ 200ms com virtualização de lista.
- **RNF‑02 Offline‑first:** tudo funciona sem internet; usa LocalStorage.
- **RNF‑03 Acessibilidade:** navegação por teclado, contraste AA, rótulos ARIA.
- **RNF‑04 Usabilidade:** zero clique supérfluo; foco automático; toques móveis.
- **RNF‑05 Segurança:** dados ficam locais; ao exportar, arquivo CSV somente local.

---

## Modelo de Dados (LocalStorage)

Chave: `qatlas:v1`

```json
{
  "meta": { "version": 1, "theme": "light", "updatedAt": "2025-10-31T08:00:00Z" },
  "cases": [
    {
      "id": "CT001",
      "titulo": "Login com credenciais válidas",
      "preCondicao": "Usuário cadastrado",
      "passos": "Abrir login > preencher > enviar",
      "resultadoEsperado": "Acessa o sistema",
      "resultadoReal": "",
      "status": "NAO_EXECUTADO",
      "executado": false,
      "impedido": false,
      "motivoImpedido": "",
      "severidade": null,
      "responsavel": "Nilson",
      "evidencia": "",
      "updatedAt": 0
    }
  ]
}
```

---

## Esquema de CSV (Export/Import)

Colunas (ordem fixa):
`id,titulo,preCondicao,passos,resultadoEsperado,resultadoReal,status,executado,impedido,motivoImpedido,severidade,responsavel,evidencia,updatedAt`

Exemplo:

```
CT001,Login com credenciais válidas,Usuário cadastrado,"Abrir login > preencher > enviar",Acessa o sistema,,NAO_EXECUTADO,false,false,,,
```

Regras de Importação:

- Normalizar `status` para {PASSOU,FALHOU,IMPEDIDO,NAO\_EXECUTADO}.
- `executado`/`impedido`: aceitar {true/false, 1/0, sim/não}.
- Mesclar pelo `id`. Se houver conflito e `updatedAt` do CSV for mais novo, sobrescrever.

---

## Fluxos Principais (User Stories)

- **US‑01** Como QA, quero marcar um caso como **Executado** e **Passou** em até 2 cliques para acelerar a execução.
- **US‑02** Como QA, ao marcar **Impedido**, quero escrever rapidamente o motivo para o dev agir.
- **US‑03** Como PO, quero ver no topo o total e % por status para decidir se encerro o ciclo.
- **US‑04** Como QA Lead, quero exportar CSV com um clique para anexar no Jira/Qase.

---

## Esboço de UI (Wireframe de Conteúdo)

- **Header:** título + botões (Novo Caso, Importar CSV, Exportar CSV, Limpar Tudo, Tema).
- **Cards de Resumo:** Total | Passaram | Falharam | Impedidos | Não Executados, cada um com número e porcentagem.
- **Tabela:** colunas descritas no RF‑01; linhas editáveis inline; células com validação.
- **Footer:** contagem de linhas e dicas de atalho.

### Paleta e Códigos (sugestão)

- Verde sucesso `#22c55e`, Vermelho erro `#ef4444`, Âmbar aviso `#f59e0b`, Cinza `#6b7280`.

---

## Validações & Mensagens

- Ao marcar **Falhou** sem **Resultado Real** → "Descreva o resultado observado."
- Ao marcar **Falhou** sem **Evidência** → "Inclua um link ou anexo da evidência."
- Ao marcar **Impedido** sem **Motivo** → "Informe o motivo do impedimento."
- Ao **Limpar Tudo** → modal: "Faremos um backup CSV automático antes de apagar. Confirmar?"

---

## Testes do Próprio Dashboard (Smoke)

1. Criar caso → ID incremental correto.
2. Marcar Executado + Passou → resumo atualiza e salva no LocalStorage.
3. Marcar Impedido → motivo obrigatório.
4. Marcar Falhou → exige Resultado Real + Evidência; Severidade visível.
5. Exportar → abre download com CSV válido.
6. Importar → pré‑visualização e mescla por ID.
7. Atalhos funcionam (N/E/I/P/F/Ctrl+S).
8. Tema persiste após recarregar.

---

## Roadmap

- **v1.0 (MVP):** Tabela editável, cards de resumo, autosave, export CSV, tema claro/escuro.
- **v1.1:** Import CSV com mescla + filtros/ordenação.
- **v1.2:** Evidência como upload local (File System Access API).
- **v1.3:** Template de casos (bulk create) + tags/suites.
- **v1.4:** Relatórios gráficos (barras/pizza) e impressão limpa (A4).

---

## Stack Sugerida

- **Vanilla**: HTML + CSS (Tailwind opcional) + JS com lit‑html ou htmx.
- **Ou React**: Vite + React + Zustand (estado) + TanStack Table para virtualização.
- Sem backend no MVP; pronto para migrar p/ `IndexedDB` no futuro.

---

## Melhorias Propostas

- **Checklist dinâmico de passos** por caso (colapso/expandir).
- **Campos customizáveis** por projeto (ativar/desativar colunas).
- **Regras condicionais** (ex.: se Severidade=Crítica e Falhou → destacar linha).
- **Export JSON** além de CSV.
- **Vários projetos** (multi‑dataset) no mesmo navegador.
- **Sincronização opcional** via arquivo .qatlas para backup manual.

---

## Critérios de Aceite (MVP)

- Salvar/recuperar estado completo após refresh sem perda de dados.
- Operar sem internet.
- Executar 50 interações seguidas sem travar.
- CSV exportado reimporta sem dif.

---

## Licença e Versão

- MIT (sugestão) – foco em adoção pela comunidade QA.
- Versão inicial proposta: **1.0.0**.

