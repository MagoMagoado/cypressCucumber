const ambienteInfo = require('./ambienteInfo.json');

const base1 = 'base1';
const base2 = 'base2';

/** Estrutura de ambienteInfo.json: (ambiente qa/hlg) > (companyId > { baseUrl }) */
function getAmbiente(tipoAcesso) {
  let companyId = null;

  if (tipoAcesso === "QA" || tipoAcesso === "saucedemo") {
    companyId = base1;
  } else {
    companyId = base2;
  }
  const ambiente  = ambienteInfo[tipoAcesso][companyId];
  return { baseUrl: ambiente.baseUrl, companyId };
}

module.exports = { getAmbiente };
