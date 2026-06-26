// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Desregistra Service Workers ativos antes de cada teste para evitar timeout no cy.visit().
// Ref: https://github.com/cypress-io/cypress/issues/27501
beforeEach(() => {
  cy.intercept('https://events.backtrace.io/**', { statusCode: 200, body: {} });

  if (!window.navigator || !navigator.serviceWorker) {
    console.log('[SW] navigator.serviceWorker não disponível, pulando...');
    return null;
  }
  const cypressPromise = new Cypress.Promise((resolve) => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      console.log(`[SW] ${registrations.length} service worker(s) encontrado(s)`);
      if (!registrations.length) return resolve();
      Promise.all(registrations.map(r => {
        console.log(`[SW] Desregistrando: ${r.scope}`);
        return r.unregister();
      })).then(() => {
        console.log('[SW] Todos desregistrados com sucesso');
        resolve();
      });
    });
  });
  cy.wrap('Unregister service workers').then(() => cypressPromise);
});