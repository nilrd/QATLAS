# Documento de Uso e Fluxo do Usuário — QAtlas

## Visão Geral
O **QAtlas** é um dashboard interativo de casos de teste, criado para simplificar o acompanhamento das execuções durante o ciclo de testes. É leve, roda direto no navegador, funciona offline e salva tudo automaticamente. A proposta é que qualquer QA consiga abrir o dashboard e começar a registrar resultados em segundos.

---

## Estrutura da Tela

1. **Header (Topo)**  
   Contém o título “QAtlas — Casos de Teste” e os principais botões de ação:
   - **+ Novo Caso de Teste:** adiciona uma nova linha na tabela.
   - **Importar CSV:** permite carregar dados anteriores.
   - **Exportar CSV:** exporta todos os casos com seus resultados.
   - **Limpar Tudo:** apaga todos os dados salvos localmente (com confirmação e backup).
   - **Alternar Tema:** troca entre modo claro e escuro.

2. **Cards de Resumo (Painel Global)**  
   Mostram os totais em tempo real:
   - **Total de Testes**  
   - **Passaram (verde)**  
   - **Falharam (vermelho)**  
   - **Impedidos (âmbar)**  
   - **Não Executados (cinza)**  
   Cada card exibe número absoluto e percentual, atualizados a cada modificação.

3. **Tabela de Casos de Teste (Área Central)**  
   Onde o usuário manipula todos os casos. Cada linha contém:
   - Nº CT (ex: CT001) — gerado automaticamente.
   - Caso de Teste — nome descritivo.
   - Resultado Esperado.
   - Resultado Real — preenchido após execução.
   - Status — campo selecionável (Passou, Falhou, Impedido, Não Executado).
   - Executado? — checkbox que sincroniza com o Status.
   - Impedido? — checkbox que, ao ser marcado, solicita o motivo.
   - Motivo do Impedimento — campo de texto obrigatório se impedido.
   - Evidência/Link — link para screenshot, log ou vídeo.
   - Responsável — nome do QA que executou.
   - Última Atualização — data e hora automáticas.

4. **Rodapé (Footer)**  
   Exibe a contagem total de casos visíveis e dicas rápidas de atalhos (ex: `N` para novo caso, `Ctrl+S` para salvar/exportar).

---

## Fluxo do Usuário

### 1. Adicionando um novo caso
- O QA clica em **+ Novo Caso de Teste**.  
- Um novo item (CT00X) é criado com status **Não Executado**.  
- O foco é automaticamente posicionado no campo **Caso de Teste** para digitação imediata.

### 2. Executando o teste
- O QA marca a caixa **Executado?**.  
- O sistema solicita a definição de **Status**: Passou, Falhou ou Impedido.

### 3. Registrando o resultado
- Se **Passou**: o QA pode, opcionalmente, preencher o campo **Resultado Real**.  
- Se **Falhou**: o QA precisa preencher **Resultado Real** e **Evidência/Link**.  
- Se **Impedido**: o QA deve preencher **Motivo do Impedimento**.  
- O dashboard atualiza automaticamente os contadores de resumo no topo.

### 4. Salvamento automático
- Todas as alterações são salvas automaticamente no **LocalStorage**.  
- Mesmo se o navegador for fechado, os dados permanecem disponíveis na próxima abertura.

### 5. Exportando resultados
- Ao clicar em **Exportar CSV**, o sistema gera um arquivo `.csv` com todos os dados.  
- Esse arquivo pode ser anexado em ferramentas como Jira, Qase ou compartilhado via e-mail.

### 6. Importando resultados
- O QA pode clicar em **Importar CSV** e selecionar um arquivo exportado anteriormente.  
- O sistema exibe uma prévia e pergunta se deve **mesclar** (atualizar existentes) ou **sobrescrever** (recomeçar com os novos dados).

### 7. Limpando dados
- Ao clicar em **Limpar Tudo**, um modal de confirmação aparece.  
- O QAtlas automaticamente gera um backup `.csv` antes de apagar os dados.

---

## Validações e Mensagens
- **Falhou** sem Resultado Real → mensagem: “Descreva o resultado observado.”
- **Falhou** sem Evidência → “Inclua um link ou anexo da evidência.”
- **Impedido** sem motivo → “Informe o motivo do impedimento.”
- **Limpar Tudo** → “Será feito backup antes da exclusão. Deseja continuar?”

---

## Atalhos de Teclado
- `N` → Novo caso de teste.  
- `E` → Alternar Executado.  
- `I` → Alternar Impedido.  
- `P` → Marcar como Passou.  
- `F` → Marcar como Falhou.  
- `Ctrl + S` → Exportar CSV.

---

## Experiência do Usuário (UX)
- Interface limpa, centrada na tabela.  
- Cada célula pode ser editada diretamente (inline).  
- Alterações refletem imediatamente nos cartões de resumo.  
- Tema escuro/claro persistente.  
- Operação fluida em desktops e tablets.

---

## Resumo do Ciclo de Uso
1. O QA abre o QAtlas (dados carregam automaticamente).  
2. Cria novos casos conforme necessário.  
3. Executa, marca status e preenche os campos.  
4. Verifica o painel de métricas.  
5. Exporta o resultado no fim do ciclo de testes.  
6. Pode reimportar o arquivo em um novo sprint.

---

## Próximos Passos
- Adicionar **modo colaborativo** via import/export incremental.  
- Criar **gráficos de desempenho** por ciclo.  
- Implementar **histórico de versões** para cada caso.

---

**Conclusão:**  
O QAtlas proporciona um fluxo ágil, sem burocracia, e mantém a visibilidade completa dos testes de forma simples e visual. É o tipo de ferramenta que todo QA gostaria de abrir no meio de uma sprint apertada e sentir que o controle da qualidade está na ponta dos dedos.

