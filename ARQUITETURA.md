# Arquitetura do projeto — como as peças se conectam

Este projeto usa Cypress + Cucumber (BDD) com JavaScript. A estrutura foi pensada para separar responsabilidades de forma clara: quem conhece os seletores, quem sabe interagir com a página, e quem descreve o comportamento do teste. Abaixo está a explicação de cada camada e como elas se comunicam.

---

## 1. Elements — o dicionário de seletores

**Arquivos:** `cypress/src/elements/commonsElements.js`, `cypress/src/elements/homeElements.js`

Cada arquivo de elementos é um mapa que associa um nome legível a um seletor CSS (ou a um objeto com opções mais detalhadas). Eles são organizados por categoria:

```js
BOTAO: {
  'Login': { seletor: '[data-test="login-submit"]' }
},
CAMPO: {
  'Email': '#email'
}
```

A regra fundamental é: **nenhuma page escreve seletor CSS diretamente no código**. Toda interação passa pelo nome mapeado aqui. Isso centraliza a manutenção — se um seletor mudar, basta atualizar em um único lugar.

- `commonsElements.js` contém os elementos compartilhados por todas as telas (botões de login, campos comuns, menus de navegação).
- Cada tela específica tem seu próprio arquivo (ex: `homeElements.js`) com os elementos exclusivos daquela página.

Diferente do projeto Playwright, não existe um `elementRegistry.js` separado porque JavaScript não tem sistema de tipos — o formato dos objetos é simplesmente uma convenção seguida por todos os arquivos de elementos.

---

## 2. CommonsPage — o motor central

**Arquivo:** `cypress/src/pages/commonsPage.js`

É a classe base que todas as pages herdam. Ela carrega os `commonsElements` no construtor e mantém um mapa interno (`elementMap`) com todos os elementos disponíveis para aquela instância.

Como o Cypress disponibiliza o objeto `cy` globalmente, a `CommonsPage` **não recebe o browser por parâmetro** — ela simplesmente usa `cy` diretamente nos métodos. Isso elimina a necessidade de injeção de dependência presente no Playwright.

Responsabilidades principais:

- `carregarElementos(elementos)` — adiciona um conjunto de elementos ao mapa interno. Cada page filha chama esse método no seu constructor para incluir os elementos específicos da sua tela.
- `buscarElemento(categoria, nome)` — busca no mapa pelo nome e categoria, lançando erro se não encontrar.
- `toLocator(config)` — converte o `ElementConfig` (string simples ou objeto com opções) em um comando Cypress (`cy.get` ou `cy.contains`), aplicando filtros de texto e índice quando necessário.
- Métodos de ação genéricos: `clicarBotao`, `preencherCampo`, `selecionarCombobox`, `marcarCheckbox`, `acessarMenuNavegacao`, entre outros.
- Métodos de validação genéricos: `validarMensagem`, `validarEstado`, `validarValorCampo`, `validarOpcoesCombobox`, entre outros.

Qualquer comportamento que se repete em mais de uma tela vive aqui.

---

## 3. Pages filhas — comportamentos específicos de cada tela

**Arquivos:** `cypress/src/pages/loginPage.js`, `cypress/src/pages/homePage.js`

Cada page filha herda `CommonsPage` e no constructor carrega os elementos específicos da sua tela:

```js
constructor() {
  super();                                // carrega commonsElements
  this.carregarElementos(homeElementos); // adiciona os elementos específicos desta tela
}
```

A page filha pode:
- Adicionar métodos próprios que só fazem sentido naquela tela (ex: `deslizarSlider` na `HomePage`).
- Sobrescrever um método da `CommonsPage` quando a tela tem um comportamento diferente do padrão (ex: `validarCategoriaProduto` na `HomePage`).

Se um método não for sobrescrito, o comportamento genérico da `CommonsPage` é usado automaticamente.

---

## 4. Fixtures — contexto compartilhado entre steps

**Arquivo:** `cypress/src/fixtures/fixtures.js`

No Cypress não existe injeção de dependência como no Playwright. A solução é um **objeto `context` exportado como módulo**, compartilhado entre todos os arquivos de steps. Como o Node.js faz cache de módulos, todos os arquivos que importam `fixtures.js` enxergam o mesmo objeto.

Antes de cada cenário, o hook `Before` em `commonsSteps.js` chama `resetContext()`, que reinicializa as instâncias para garantir um estado limpo:

```js
function resetContext() {
  context.pageContext = new PageContext();
  context.loginPage = new LoginPage();
}
```

O `PageContext` resolve um problema específico: os steps genéricos precisam funcionar para qualquer tela, sem saber com antecedência qual está ativa. Em vez de instanciar todas as pages de uma vez, o `PageContext` mantém uma referência à page ativa (`activePage`) e a troca quando o step `que estou no documento {string}` é chamado:

```
que estou no documento "HOME"  →  pageContext.ativarDocumento('HOME')
                               →  activePage = new HomePage()
```

A partir daí, todos os steps genéricos delegam para `pageContext.activePage`, que já é a page correta para aquele cenário.

---

## 5. Steps — a ponte entre o Gherkin e as pages

**Arquivos:** `cypress/src/steps/commonsSteps.js`, `cypress/src/steps/homeSteps.js`

Os steps traduzem as frases do Gherkin em chamadas de método. Eles **não contêm lógica de negócio nem de interface** — apenas recebem os parâmetros do texto e delegam para a page correspondente:

```js
When('clico no botão {string}', (nome) => {
  context.pageContext.activePage.clicarBotao(nome);
});
```

- `commonsSteps.js` contém todos os steps reutilizáveis entre telas (login, navegação, ações e validações genéricas). É também onde o hook `Before` faz o reset do contexto.
- Steps específicos de uma tela ficam no arquivo de steps correspondente (ex: `homeSteps.js`).

O `Given`, `When` e `Then` são importados diretamente do `@badeball/cypress-cucumber-preprocessor` — diferente do Playwright, onde eram importados do `fixtures.ts` para permitir a injeção de dependência. No Cypress, essa camada intermediária não é necessária.
