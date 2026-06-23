# Cypress Cucumber

Projeto de automação de testes E2E usando Cypress + Cucumber (BDD), escrito em JavaScript.

---

## Estrutura de pastas

```
cypress/
  e2e/
    features/       # Arquivos .feature com os cenários em português
  src/
    config/         # Configuração de ambientes e credenciais
    elements/       # Mapeamento de seletores por página
    fixtures/       # Contexto compartilhado entre steps (PageContext)
    pages/          # Classes de página (CommonsPage e filhas)
    steps/          # Definições de steps Cucumber
  support/
    commands.js     # Comandos customizados do Cypress
    e2e.js          # Entry point de configurações globais
```

---

## Como funciona

### Fluxo de execução

1. O cenário no `.feature` descreve os passos em português
2. Cada passo é capturado por um step em `commonsSteps.js` ou em um arquivo de steps específico
3. Os steps delegam para `context.pageContext.activePage`, que executa o comportamento correto
4. O step `"que estou no documento"` troca a page ativa via `ativarDocumento()`

### Context e PageContext (`fixtures/fixtures.js`)

Como o Cypress não possui injeção de dependência, o `fixtures.js` exporta um objeto `context` compartilhado entre todos os arquivos de steps. Antes de cada cenário, o hook `Before` chama `resetContext()` para garantir um estado limpo.

O `PageContext` controla qual page está ativa no cenário. As pages são registradas como fábricas — só são instanciadas quando `ativarDocumento()` é chamado.

```js
// Antes de ativar: activePage = CommonsPage (base)
// Depois do step "que estou no documento 'HOME'": activePage = HomePage
```

### Pages (`src/pages/`)

- **`CommonsPage`** — classe base com todos os métodos de ação e validação genéricos. Usa `cy` globalmente, sem receber o browser por parâmetro.
- Pages filhas estendem `CommonsPage`, carregam seus próprios elementos e podem sobrescrever métodos via `override`.

### Elements (`src/elements/`)

Cada page tem seu arquivo de elementos. Os elementos são organizados por categoria:

```js
BOTAO:   { 'Nome do botão': '#seletor-css' }
CAMPO:   { 'Nome do campo': { seletor: '...', texto: '...', exact: true } }
// também: COMBOBOX, CHECKBOX, VALIDACAO, MENUS_NAVEGACAO, ENDPOINT, SLIDER
```

`commonsElements.js` contém elementos compartilhados por todas as páginas e é carregado automaticamente pelo constructor de `CommonsPage`.

---

## Como adicionar uma nova página

### 1. Criar o arquivo de elementos (se necessário)

Em `src/elements/`, crie `novaPageElements.js` seguindo o padrão de `homeElements.js`.

### 2. Criar a Page

Em `src/pages/`, crie `novaPage.js`:

```js
const { CommonsPage } = require('./commonsPage');
const { novaPageElementos } = require('../elements/novaPageElements');

class NovaPage extends CommonsPage {
  constructor() {
    super();
    this.carregarElementos(novaPageElementos);
  }

  // métodos próprios ou overrides aqui
}

module.exports = { NovaPage };
```

### 3. Registrar no PageContext (`fixtures/fixtures.js`)

```js
// No mapa pages do constructor de PageContext:
['NOVA_PAGE', () => new NovaPage()],
```

### 4. Criar o arquivo de steps (se tiver steps próprios)

Em `src/steps/`, crie `novaPageSteps.js`:

```js
const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { context } = require('../fixtures/fixtures');

When('executo ação específica', () => {
  context.pageContext.activePage.metodoEspecifico();
});
```

### 5. Usar no `.feature`

```gherkin
E que estou no documento "NOVA_PAGE"
Quando executo ação específica
```

---

## Para posteriormente

- Cucumber HTML report
