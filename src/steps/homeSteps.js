const { When } = require('@badeball/cypress-cucumber-preprocessor');
const { context } = require('../fixtures/fixtures');

When('que deslizo o slider {string} para mínimo {string} e máximo {string}', (nome, valorMin, valorMax) => {
  context.pageContext.activePage.deslizarSlider(nome, valorMin, valorMax);
});
