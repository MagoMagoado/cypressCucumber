const { commonsElementos } = require('../elements/commonsElements');

class CommonsPage {
  elementMap = {};
  framedSelectors = new Set();

  constructor() {
    this.carregarElementos(commonsElementos);
  }

  carregarElementosEmIframe(elementos) {
    this.carregarElementos(elementos);
    for (const categoria of Object.values(elementos)) {
      for (const config of Object.values(categoria)) {
        const seletor = typeof config === 'string' ? config : config.seletor;
        this.framedSelectors.add(seletor);
      }
    }
  }

  carregarElementos(elementos) {
    for (const categoria in elementos) {
      this.elementMap[categoria] = {
        ...this.elementMap[categoria],
        ...elementos[categoria],
      };
    }
  }

  buscarElemento(categoria, nome) {
    // se começa com '.', '#' ou '[' já é um seletor CSS, não precisa buscar no mapa
    if (/^[.#\[]/.test(nome)) return nome;
    const elemento = this.elementMap[categoria]?.[nome];
    if (elemento !== undefined) return elemento;
    throw new Error(`Elemento "${nome}" não encontrado na categoria "${categoria}"`);
  }

  buscarElementoEmQualquerCategoria(nome) {
    if (/^[.#\[]/.test(nome)) return nome;
    for (const categoria of Object.keys(this.elementMap)) {
      const elemento = this.elementMap[categoria]?.[nome];
      if (elemento !== undefined) return elemento;
    }
    throw new Error(`Elemento "${nome}" não encontrado em nenhuma categoria`);
  }

  toLocator(config) {
    if (typeof config === 'object' && config.waitBefore) {
      this.aguardarCarregamentoPagina(config.waitBefore);
    }

    let elemento;
    if (typeof config === 'string') {
      elemento = cy.get(config);
    } else {
      const { seletor, index, texto, exact } = config;
      const pattern = exact ? new RegExp(`^\\s*${texto}\\s*$`) : texto;
      elemento = texto ? cy.contains(seletor, pattern) : cy.get(seletor);
      if (index !== undefined) elemento = elemento.eq(index);
    }

    if (typeof config === 'object' && config.waitAfter) {
      this.aguardarCarregamentoPagina(config.waitAfter);
    }

    return elemento;
  }

  // ──────────────────────────────────────────────────────────────
  // Esperas
  // ──────────────────────────────────────────────────────────────

  aguardarCarregamentoPagina(tipo = 'networkidle') {
    switch (tipo) {
      case 'login':
        cy.url({ timeout: 15000 }).should('not.include', '/login');
        break;
      case 'loader':
        cy.get('.loader', { timeout: 15000 }).should('not.exist');
        break;
      default:
        // Cypress gerencia waits de navegação e rede automaticamente
        break;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Navegação
  // ──────────────────────────────────────────────────────────────

  navegarPara(url) {
    cy.visit(url);
  }

  recarregarPagina() {
    cy.reload();
  }

  // Navega pelo menu usando "Item > Submenu". Passa por subníveis intermediários com hover antes de clicar no último.
  acessarMenuNavegacao(caminho) {
    const itens = caminho.split(' > ');

    const menuConfig = this.buscarElemento('MENUS_NAVEGACAO', 'Menu Principal');
    const menuSeletor = typeof menuConfig === 'string' ? menuConfig : menuConfig.seletor;
    cy.contains(menuSeletor, itens[0]).first().click();

    if (itens.length > 1) {
      const submenuConfig = this.buscarElemento('MENUS_NAVEGACAO', 'Submenu');
      const submenuSeletor = typeof submenuConfig === 'string' ? submenuConfig : submenuConfig.seletor;
      for (let i = 1; i < itens.length; i++) {
        const el = cy.contains(submenuSeletor, itens[i]).first();
        if (i < itens.length - 1) {
          el.trigger('mouseover');
        } else {
          el.click();
        }
      }
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Ações
  // ──────────────────────────────────────────────────────────────

  clicarBotao(nome) {
    const config = this.buscarElemento('BOTAO', nome);
    this.toLocator(config).should('be.visible').click();
  }

  preencherCampos(linhas) {
    for (const { NOME, TIPO, VALOR } of linhas) {
      switch (TIPO) {
        case 'CAMPO':
          this.preencherCampo(NOME, VALOR);
          break;
        case 'COMBOBOX':
          this.selecionarCombobox(NOME, VALOR);
          break;
      }
    }
  }

  preencherCampo(nome, valor) {
    const config = this.buscarElemento('CAMPO', nome);
    this.toLocator(config).should('be.visible').clear().type(valor);
  }

  selecionarCombobox(nome, opcao) {
    const config = this.buscarElemento('COMBOBOX', nome);
    this.toLocator(config).should('be.visible').select(opcao);
  }

  marcarCheckbox(marcar, nome) {
    const config = this.buscarElemento('CHECKBOX', nome);
    const checkbox = this.toLocator(config).find('input[type="checkbox"]');
    checkbox.should('exist');
    if (marcar === 'MARCO') {
      checkbox.check();
    } else {
      checkbox.uncheck();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Validações
  // ──────────────────────────────────────────────────────────────

  validarMensagem(estado, tipo, mensagem) {
    const config = this.buscarElementoEmQualquerCategoria(tipo);
    const seletor = typeof config === 'string' ? config : config.seletor;
    if (estado === 'VISUALIZO') {
      cy.contains(seletor, mensagem).should('be.visible');
    } else {
      cy.get('body').should('not.contain.text', mensagem);
    }
  }

  validarVisibilidade(estado, nome, container) {
    const config = this.buscarElementoEmQualquerCategoria(nome);
    const seletor = typeof config === 'string' ? config : config.seletor;

    let base;
    if (!container || container === 'TELA') {
      base = cy.get(seletor);
    } else {
      const containerConfig = this.buscarElementoEmQualquerCategoria(container);
      const containerSeletor = typeof containerConfig === 'string' ? containerConfig : containerConfig.seletor;
      base = cy.get(containerSeletor).find(seletor);
    }

    if (estado === 'VISIVEL') {
      base.should('be.visible');
    } else {
      base.should('not.exist');
    }
  }

  validarEstado(nome, estado) {
    const config = this.buscarElementoEmQualquerCategoria(nome);
    const locator = this.toLocator(config);
    if (estado === 'HABILITADO') {
      locator.should('be.enabled');
    } else {
      locator.should('be.disabled');
    }
  }

  validarCheckboxEstado(nome, estado) {
    const config = this.buscarElemento('CHECKBOX', nome);
    const checkbox = this.toLocator(config).find('input[type="checkbox"]');
    if (estado === 'MARCADO') {
      checkbox.should('be.checked');
    } else {
      checkbox.should('not.be.checked');
    }
  }

  validarOpcoesCombobox(nome, linhas) {
    const config = this.buscarElemento('COMBOBOX', nome);
    const seletor = typeof config === 'string' ? config : config.seletor;
    for (const { OPCAO } of linhas) {
      cy.contains(`${seletor} option`, OPCAO.trim()).should('exist');
    }
  }

  validarValorCampo(nome, valorEsperado) {
    const config = this.buscarElemento('CAMPO', nome);
    this.toLocator(config).scrollIntoView().invoke('text').should('equal', valorEsperado);
  }

  // elementos que repetem o mesmo seletor com textos distintos (ex: lista de produtos).
  validarCamposPorLabel(linhas) {
    for (const { NOME, TIPO, VALOR } of linhas) {
      const config = this.buscarElemento(TIPO.toUpperCase(), NOME);
      const seletor = typeof config === 'string' ? config : config.seletor;
      cy.contains(seletor, VALOR.trim()).scrollIntoView().should('be.visible');
    }
  }

  // MÉTODO ESPECÍFICO PARA HomePage COM OVERRIDE
  validarCategoriaProduto(nome, categoria) {
    const config = this.buscarElemento('CAMPO', nome);
    this.toLocator(config).find('.co2-letter.active').invoke('text').should('equal', categoria);
  }

  // ──────────────────────────────────────────────────────────────
  // Utilitários
  // ──────────────────────────────────────────────────────────────

  pause() {
    cy.pause();
  }

  tirarScreenshot(nomeArquivo, fullPage = false) {
    cy.screenshot(nomeArquivo, { capture: fullPage ? 'fullPage' : 'viewport' });
  }
}

module.exports = { CommonsPage };
