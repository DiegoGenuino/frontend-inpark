describe('Dashboard do Cliente - Existência de elementos básicos', () => {

  beforeEach(() => {
    cy.authCliente();   // já faz o login pela API e coloca o token
    cy.visit('/');      // acessa o dashboard
  });

  it('Exibe cabeçalho com saudação e informações do usuário', () => {
    cy.contains('Olá').should('exist'); // Saudação do Header
    cy.get('.card-user-info').should('exist');
    cy.get('.user-name').should('exist');
    cy.get('.user-role').should('exist');
  });

  it('Exibe seção de Acesso Rápido', () => {
    cy.contains('Acesso rápido').should('exist');

    cy.contains('Meu perfil').should('exist');
    cy.contains('Meus carros').should('exist');
    cy.contains('Minhas reservas').should('exist');
    cy.contains('Minhas avaliações').should('exist');
  });

  it('Exibe seção de Gastos do Mês com gráfico', () => {
    cy.contains('Gastos do Mês').should('exist');

    cy.contains('Este mês').should('exist');
    cy.contains('Média mensal').should('exist');

    // O ChartJS sempre cria um canvas
    cy.get('canvas').should('exist');
  });
});
