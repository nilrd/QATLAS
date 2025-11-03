# 🧭 QAtlas v2.0 — Dashboard QA Completo

> “Um mapa completo da qualidade — simples, didático e poderoso.”

- Versão: 2.0
- Autores: Time de Estudantes de QA
- Implementação: HTML, CSS, JavaScript (LocalStorage)
- Linguagens: Português (PT-BR), Español (ES-ES), English (EN-US)
- Temas: Black (Dark) & White (Light)
- Status: Documento técnico oficial de implementação e layout

---

## 1️⃣ Visão Geral

O QAtlas v2 é um dashboard visual e interativo para gerenciamento de projetos, requerimentos e casos de teste — com suporte a exportações profissionais (PDF, XML, XLSX e .feature). Voltado a estudantes e profissionais de QA, substitui planilhas e ferramentas complexas em ambientes de estudo, portfólio e squads ágeis.

---

## 2️⃣ Estrutura de Entidades

### 🧱 Projeto

| Campo         | Tipo   | Obrigatório | Descrição               |
| ------------- | ------ | ----------- | ----------------------- |
| id            | string | ✅           | Identificador único     |
| nome          | string | ✅           | Nome do projeto         |
| descrição     | string | ❌           | Detalhes adicionais     |
| dataCriação   | date   | ✅           | Data de criação         |
| requerimentos | array  | ❌           | Lista de requisitos     |
| casosTeste    | array  | ❌           | Lista de casos de teste |

### 📄 Requerimento

| Campo     | Tipo   | Obrigatório | Descrição                                  |
| --------- | ------ | ----------- | ------------------------------------------ |
| id        | string | ✅           | Identificador único                        |
| título    | string | ✅           | Nome do requisito                          |
| type      | enum   | ✅           | Epic / Story / Task / Bug / Outro          |
| status    | enum   | ✅           | Draft / In Progress / In Review / Approved |
| link      | string | ❌           | Deve iniciar com http/https                |
| descrição | string | ❌           | Texto livre                                |

### 🧪 Caso de Teste

| Campo             | Tipo    | Obrigatório | Descrição                                |
| ----------------- | ------- | ----------- | ---------------------------------------- |
| id                | string  | ✅           | Ex.: CT001                               |
| descrição         | string  | ✅           | Resumo do teste                          |
| suite             | string  | ✅           | Agrupamento (Login, Cadastro, etc.)      |
| resultadoEsperado | string  | ✅           | Resultado esperado                       |
| resultadoReal     | string  | ❌           | Resultado observado                      |
| status            | enum    | ✅           | Not Executed / Passed / Failed / Blocked |
| executed          | boolean | ✅           | Indica execução                          |
| blockedReason     | string  | ⚠️          | Obrigatório se status = Blocked          |
| requirementId     | string  | ❌           | Requerimento vinculado                   |
| dataCriação       | date    | ✅           | Data de criação                          |
| dataAtualização   | date    | ✅           | Última modificação                       |

Observação: para compatibilidade, v2 pode manter `steps?: string[]` para edição estilo “planilha/Gherkin”.

---

## 3️⃣ Layout e Experiência do Usuário (UX/UI)

- Temas Black/White persistentes.
- Header com logo, tema, idioma e ações principais: [+ Projeto] [+ Caso] [Exportar] [Relatórios].
- Cards de status reativos (clicáveis para filtrar).
- Filtros horizontais compactos.
- Tabela principal estilo planilha: redimensionável, autosize por duplo clique, sticky, edição inline.
- Foco com realce suave.

---

## 4️⃣ Modais e Alertas

- Backdrop translúcido com blur; container com bordas suaves e botões do tema.
- Título com ícone contextual (⚠️, ✅, 📁).
- Validações via modais elegantes.

---

## 5️⃣ Exportações

- PDF (jsPDF/pdfmake): cabeçalho, resumo, tabela.
- XML (hierarquia por requisito).
- XLSX (SheetJS): abas Casos, Requerimentos, Resumo; cores por status.
- BDD (.feature) a partir dos casos (estrutura Gherkin).

---

## 6️⃣ Regras de Negócio (RN)

| Código | Regra                                                |
| ------ | ---------------------------------------------------- |
| RN-01  | Blocked → `blockedReason` obrigatório                |
| RN-02  | `executed=false` → não pode marcar Passed/Failed     |
| RN-03  | Links precisam ser válidos                           |
| RN-04  | Cada projeto tem nome único                          |
| RN-05  | Auto-save a cada edição                              |
| RN-06  | Cards e contadores atualizam automaticamente         |
| RN-07  | Exportações só após validação de campos obrigatórios |
| RN-08  | IDs de casos (CTxxx) renumeram após exclusão         |

---

## 7️⃣ Requisitos Não Funcionais (RNF)

- Responsivo a partir de 320px.
- PT/EN/ES com bandeiras.
- Exportações < 3s.
- Dark/Light persistentes.
- Acessibilidade AA e navegação por teclado.
- Offline-first em LocalStorage.

---

## 8️⃣ Fluxo do Usuário

1. Criar Projeto → 2. Adicionar Requerimentos → 3. Vincular/Criar Casos → 4. Executar/Status → 5. Métricas → 6. Exportar → 7. Tema/Idioma → 8. Tudo salvo automaticamente.

---

## 9️⃣ Critérios de Aceite

- Tabela redimensionável com autosize.
- Cards reativos.
- Validações em modais elegantes.
- Exportações PDF/XML/XLSX/BDD.
- Layout responsivo e acessível.
- Idiomas e tema persistentes.
- Operação offline completa.

---

## 🔤 Atalhos

N, P, F, I, E, Ctrl+S, Ctrl+R, Ctrl+B, Ctrl+L, Ctrl+,

---

## 🔒 Segurança

- Dados locais no navegador; aviso ao limpar cache; sem envio a servidores.

---

## 📌 Observações de Implementação

- Adotar STORAGE_KEY v2 com migração do v1.
- Renumeração dos IDs CTxxx ao excluir para manter sequência contínua.
- Prever atributos visuais por célula/linha (cores de texto/fundo) para comportamento tipo planilha.
