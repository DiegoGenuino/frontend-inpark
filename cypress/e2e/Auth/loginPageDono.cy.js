describe('Login Dono e captura de token', () => {

  it('Realiza login e salva token JWT', () => {

    cy.intercept('POST', '**/auth/login').as('login'); // ajuste a rota se necessário

    cy.visit('http://localhost:5173/login');

    cy.get('#email').type('carol@gmail.com');
    cy.get('#senha').type('Dono_123!');
    cy.contains('button', 'Entrar').click();

    cy.wait('@login').then((intercept) => {
      const token = intercept.response.body.token;

      // SALVA O TOKEN GLOBALMENTE
      window.localStorage.setItem('token', token);

      // isto permite que outros testes usem
      Cypress.env('jwt', token);
    });
  });
});
