const { CommonsPage } = require('./commonsPage');
const { getAmbiente } = require('../config/config');
const loginInfo = require('../config/loginInfo.json');

function getUser(userId) {
  const user = loginInfo[userId];
  if (!user) throw new Error(`Usuário "${userId}" não encontrado em loginInfo.json`);
  return user;
}

class LoginPage extends CommonsPage {
  constructor() {
    super();
  }

  acessoSistema(tipoLogin) {
    const { baseUrl } = getAmbiente(tipoLogin);
    cy.visit(baseUrl);
  }

  efetuarLogin(usuarioId) {
    const user = getUser(usuarioId);
    this.preencherCampo('Email', user.username);
    this.preencherCampo('Password', user.password);
    this.clicarBotao('Login');
    this.aguardarCarregamentoPagina('login');
  }
}

module.exports = { LoginPage };
