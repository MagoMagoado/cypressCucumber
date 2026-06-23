const { CommonsPage } = require('./commonsPage');
const { homeElementos } = require('../elements/homeElements');

class HomePage extends CommonsPage {
  constructor() {
    super();
    this.carregarElementos(homeElementos);
    // se elementos estivem em tela com Iframe
      // this.carregarElementosEmIframe(homeElementos);
  }

  // Método próprio de homePage
  deslizarSlider(nome, valorMin, valorMax) {
    const config = this.buscarElemento('SLIDER', nome);
    const seletor = typeof config === 'string' ? config : config.seletor;
    const alvoMin = Number(valorMin);
    const alvoMax = Number(valorMax);

    cy.get(seletor).scrollIntoView();

    const moverHandle = (handleSel, alvo) => {
      cy.get(handleSel).invoke('attr', 'aria-valuenow').then((atualStr) => {
        const atual = Number(atualStr);
        const passos = alvo - atual;
        if (passos === 0) return;
        const tecla = passos > 0 ? '{rightarrow}' : '{leftarrow}';
        cy.get(handleSel).focus();
        for (let i = 0; i < Math.abs(passos); i++) {
          cy.get(handleSel).type(tecla);
        }
      });
    };

    // ordem segura: se o novo mínimo ultrapassa o máximo atual, move o máximo primeiro
    cy.get(`${seletor} .ngx-slider-pointer-max`).invoke('attr', 'aria-valuenow').then((maxAtualStr) => {
      if (alvoMin > Number(maxAtualStr)) {
        moverHandle(`${seletor} .ngx-slider-pointer-max`, alvoMax);
        moverHandle(`${seletor} .ngx-slider-pointer-min`, alvoMin);
      } else {
        moverHandle(`${seletor} .ngx-slider-pointer-min`, alvoMin);
        moverHandle(`${seletor} .ngx-slider-pointer-max`, alvoMax);
      }
    });
  }

  // Método override de commonsPage
  validarCategoriaProduto(nome, categoria) {
    if (categoria === 'B') {
      const config = this.buscarElemento('CAMPO', nome);
      this.toLocator(config).find('.co2-letter.active').should('have.class', 'rating-b');
      cy.log('Produto eco-friendly');
      return;
    }
    super.validarCategoriaProduto(nome, categoria);
  }
}

module.exports = { HomePage };
