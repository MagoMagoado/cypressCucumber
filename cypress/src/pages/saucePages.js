const { CommonsPage } = require('./commonsPage');
const { sauceElementos } = require('../elements/sauceElements');

class SaucePage extends CommonsPage {
  constructor() {
    super();
    this.carregarElementos(sauceElementos);
  }

  clicarBotao(nome) {
    const config = this.buscarElemento('BOTAO', nome);
    if (config.produtoNome) {
      cy.contains('.inventory_item_name', config.produtoNome)
        .closest('.inventory_item_description')
        .find(config.seletor)
        .should('be.visible')
        .click();
      return;
    }
    super.clicarBotao(nome);
  }
}

module.exports = { SaucePage };
