const { Given, When, Then, Before } = require('@badeball/cypress-cucumber-preprocessor');
const { context, resetContext } = require('../fixtures/fixtures');

Before(() => {
  resetContext();
});

// ──────────────────────────────────────────────────────────────
// Contexto / Setup
// ──────────────────────────────────────────────────────────────

Given('que estou no documento {string}', (documento) => {
  context.pageContext.ativarDocumento(documento);
});

// ──────────────────────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────────────────────

Given('que acesso o sistema {string}', (tipoAcesso) => {
  context.loginPage.acessoSistema(tipoAcesso);
});

When('que efetuo o login utilizando o usuário {string}', (usuario) => {
  context.loginPage.efetuarLogin(usuario);
});

// ──────────────────────────────────────────────────────────────
// Navegação
// ──────────────────────────────────────────────────────────────

When('recarrego a página', () => {
  context.pageContext.activePage.recarregarPagina();
});

When('acesso o menu {string}', (caminho) => {
  context.pageContext.activePage.acessarMenuNavegacao(caminho);
});

// ──────────────────────────────────────────────────────────────
// Ações
// ──────────────────────────────────────────────────────────────

When('clico no botão {string}', (nome) => {
  context.pageContext.activePage.clicarBotao(nome);
});

When('preencho os campos', (dataTable) => {
  context.pageContext.activePage.preencherCampos(dataTable.hashes());
});

When('preencho o campo {string} com {string}', (nome, valor) => {
  context.pageContext.activePage.preencherCampo(nome, valor);
});

When('preencho o combobox {string} com {string}', (nome, opcao) => {
  context.pageContext.activePage.selecionarCombobox(nome, opcao);
});

When('{string} o checkbox {string}', (acao, nome) => {
  context.pageContext.activePage.marcarCheckbox(acao, nome);
});

// ──────────────────────────────────────────────────────────────
// Validações
// ──────────────────────────────────────────────────────────────

Then('{string} {string} com a mensagem {string}', (estado, tipo, mensagem) => {
  // estado: VISUALIZO ou NAO VISUALIZO
  context.pageContext.activePage.validarMensagem(estado, tipo, mensagem);
});

Then('valido se {string} está {string}', (nome, estado) => {
  // estado: HABILITADO ou DESABILITADO
  context.pageContext.activePage.validarEstado(nome, estado);
});

Then('valido se {string} está {string} na tela', (nome, estado) => {
  // estado: VISIVEL ou NAO VISIVEL
  context.pageContext.activePage.validarVisibilidade(nome, estado);
});

Then('valido se checkbox {string} está {string}', (nome, estado) => {
  // estado: MARCADO ou DESMARCADO
  context.pageContext.activePage.validarCheckboxEstado(nome, estado);
});

Then('valido que combobox {string} possui opções', (nome, dataTable) => {
  context.pageContext.activePage.validarOpcoesCombobox(nome, dataTable.hashes());
});

Then('valido os campos por label', (dataTable) => {
  context.pageContext.activePage.validarCamposPorLabel(dataTable.hashes());
});

Then('o campo {string} deve conter o valor {string}', (nome, valorEsperado) => {
  context.pageContext.activePage.validarValorCampo(nome, valorEsperado);
});

// STEP ESPECÍFICO PARA HomePage. Teste para verificar se acessa corretamente método
Then('valido que {string} co2 tem categoria {string}', (nome, categoria) => {
  context.pageContext.activePage.validarCategoriaProduto(nome, categoria);
});

// ──────────────────────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────────────────────

When('pause', () => {
  context.pageContext.activePage.pause();
});
