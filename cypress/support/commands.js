// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('authCliente', () => {
  cy.session('cliente', () => {
    cy.request('POST', 'http://localhost:8080/auth/login', {
      email: 'vinicius@gmail.com',
      senha: 'Senha_123!'
    }).then((response) => {
      const token = response.body.token;
      window.localStorage.setItem('token', token);
    });
  });
});
Cypress.Commands.add('authDono', () => {
  cy.session('dono', () => {
    cy.request('POST', 'http://localhost:8080/auth/login', {
      email: 'carol@gmail.com',
      senha: 'Dono_123!'
    }).then((response) => {
        const token = response.body.token;
        window.localStorage.setItem('token', token);
    });
  });
});
