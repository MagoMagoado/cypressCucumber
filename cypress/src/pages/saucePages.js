const { CommonsPage } = require('./commonsPage');
const { sauceElementos } = require('../elements/sauceElements');

class SaucePage extends CommonsPage {
  constructor() {
    super();
    this.carregarElementos(sauceElementos);
  }
}

module.exports = { HomePage };
