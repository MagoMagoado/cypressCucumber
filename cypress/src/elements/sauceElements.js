const sauceElementos = {

  BOTAO: {
    'Produto Sauce Labs Fleece Jacket': { seletor: '[data-test="inventory-item-name"]', texto: 'Sauce Labs Fleece Jacket' },
  },

  CAMPO: {
    'Produto Nome': '[data-test="inventory-item-name"]',
    'Produto Preço': '[data-test="inventory-item-price"]',
  },

  COMBOBOX: {
    'Filtro: Sort': '.product_sort_container',
  },

  VALIDACAO: {
    'TÍTULO':    { seletor: '.app_logo', exact: false },
  },


};

module.exports = { sauceElementos };