const { CommonsPage } = require('../pages/commonsPage');
const { LoginPage } = require('../pages/loginPage');
const { HomePage } = require('../pages/homePage');
const { SaucePage } = require('../pages/saucePages');

/**
 * Controla qual page está ativa no cenário. O step "que estou no documento" chama ativarDocumento(),
 * que instancia a page correspondente e a atribui a activePage — a partir daí todos os steps delegam para ela.
 *
 * Para adicionar uma nova tela: registrá-la no mapa pages e, se tiver steps próprios,
 * expô-la no context abaixo.
 */
class PageContext {
  constructor() {
    this.activePage = new CommonsPage();
    this.pages = new Map([
      ['HOME', () => new HomePage()],
      ['SAUCE', () => new SaucePage()],
    ]);
  }

  ativarDocumento(documento) {
    const pageChamada = this.pages.get(documento);
    if (!pageChamada) throw new Error(`Documento "${documento}" não registrado em PageContext`);
    this.activePage = pageChamada();
  }
}

/**
 * Contexto compartilhado entre todos os arquivos de steps.
 * Resetado antes de cada cenário via resetContext() chamado no Before hook de commonsSteps.
 */
const context = {
  pageContext: new PageContext(),
  loginPage: new LoginPage(),
};

function resetContext() {
  context.pageContext = new PageContext();
  context.loginPage = new LoginPage();
}

module.exports = { PageContext, context, resetContext };
