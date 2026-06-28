# Workflow: Testes E2E Cypress

Arquivo de configuração: `.github/workflows/testes.yml`

## Gatilhos

- **Push para `main`** — executa automaticamente a cada novo push na branch main
- **`workflow_dispatch`** — pode ser disparado manualmente pelo botão "Run workflow" na aba Actions do GitHub

## Job: `testes`

Roda em uma máquina virtual `ubuntu-latest`.

| Passo | O que faz |
|---|---|
| **Checkout** | Baixa o código do repositório na máquina do GitHub Actions |
| **Setup Node.js** | Instala o Node.js versão 20 com cache do npm (acelera builds futuras) |
| **Executar testes + instalação** | Usa a `cypress-io/github-action@v6` — faz `npm ci`, instala o binário do Cypress e roda os testes com a flag `--env tags=not @local` (exclui testes marcados com `@local`) |
| **Upload screenshots** | Faz upload da pasta `cypress/screenshots` em caso de falha, guardado por 15 dias |

## Artefatos

O upload de screenshots usa `if: failure()` — só é salvo quando algum teste falha — e `if-no-files-found: ignore` — não gera erro se a pasta estiver vazia.

Ficam disponíveis na aba **Actions** do repositório no GitHub para download após cada execução.

| Artefato | Conteúdo |
|---|---|
| `cypress-screenshots` | Prints capturados automaticamente em falhas |

## Summary no GitHub Actions

A `cypress-io/github-action` gera automaticamente uma seção **Cypress Run Summary** na aba **Summary** de cada execução, exibindo o total de testes passados, falhos e pulados.
