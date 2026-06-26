const ambienteInfo = require('./ambienteInfo.json');

const ENVIRONMENT = 'QA';
const COMPANY_NAC_ID = 'base3';
const COMPANY_INT_ID = 'base2';

const config = {
  environment: ENVIRONMENT,
  companyNac:  COMPANY_NAC_ID,
  companyInt:  COMPANY_INT_ID,
};

/** Estrutura de ambienteInfo.json: (ambiente qa/hlg) > (companyId > { baseUrl }) */
function getAmbiente(tipoAcesso) {
  const isBaseQA = tipoAcesso.toUpperCase() === 'QA';
  const companyId = isBaseQA ? config.companyNac : config.companyInt;
  const ambiente  = ambienteInfo[config.environment][companyId];
  return { baseUrl: ambiente.baseUrl, companyId };
}

module.exports = { config, getAmbiente };
