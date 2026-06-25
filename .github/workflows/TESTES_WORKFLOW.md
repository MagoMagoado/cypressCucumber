# Workflow: Testes E2E Cypress

Arquivo de configuração: `.github/workflows/testes.yml`

## Gatilhos

- **Push para `master`** — executa automaticamente a cada novo push na branch master
- **`workflow_dispatch`** — pode ser disparado manualmente pelo botão "Run workflow" na aba Actions do GitHub

## Job: `testes`

Roda em uma máquina virtual `ubuntu-latest`.

| Passo | O que faz |
|---|---|
| **Checkout** | Baixa o código do repositório na máquina do GitHub Actions |
| **Setup Node.js** | Instala o Node.js versão 20 com cache do npm (acelera builds futuras) |
| **Instalar dependências** | Roda `npm ci` — instala exatamente o que está no `package-lock.json` (mais rigoroso que `npm install`) |
| **Instalar Cypress** | Baixa o binário do Cypress separadamente (necessário porque o `npm ci` só instala o pacote JS) |
| **Executar testes** | Roda `npm test` — chama o Cypress com Cucumber |
| **Upload relatório** | Faz upload da pasta `test-results/` como artefato chamado `cypress-report`, guardado por 15 dias |
| **Upload screenshots** | Faz upload da pasta `cypress/screenshots`, guardado por 15 dias |
| **Upload videos** | Faz upload da pasta `cypress/videos`, guardado por 15 dias |

## Artefatos

Todos os artefatos usam `if: always()` — são salvos mesmo que os testes falhem — e `if-no-files-found: ignore` — não gera erro se a pasta estiver vazia (ex: nenhum teste falhou e o Cypress não gerou screenshots).

Ficam disponíveis na aba **Actions** do repositório no GitHub para download após cada execução.

| Artefato | Conteúdo |
|---|---|
| `cypress-report` | Relatório HTML/JSON dos testes |
| `cypress-screenshots` | Prints capturados automaticamente em falhas |
| `cypress-videos` | Gravações das execuções dos testes |
