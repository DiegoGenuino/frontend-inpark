describe('Navegação - Rotas do Dono (refatorado com base no dashboard)', () => {
  beforeEach(() => {
    // usa o comando custom para autenticar via API como DONO
    cy.authDono();
    // começa no dashboard
    cy.visit('/dono'); 
    
    // garante que o dashboard carregou, usando seletores do JSX fornecido
    // Verifica o container principal e o título do Header
    cy.get('.dashboard-dono-container').should('exist');
    cy.contains('Dashboard do Proprietário').should('exist');
  });
});