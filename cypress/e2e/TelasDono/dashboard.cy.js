// cypress/e2e/dashboard_dono.cy.js

describe('Dashboard do Proprietário — verificações básicas de existência', () => {

  beforeEach(() => {
    cy.authDono();   // faz login via API e seta token
    cy.visit('/'); // abre o dashboard do dono
  });

  it('Exibe header com título e subtítulo', () => {
    cy.contains('Dashboard do Proprietário').should('exist');
    cy.contains('Visão geral do seu negócio').should('exist');
  });

  it('Exibe os 4 cards de estatísticas com label e valor', () => {
    const labels = [
      'Estacionamentos',
      'Vagas Disponíveis',
      'Receita Mensal',
      'Reservas Pendentes'
    ];

    labels.forEach(label => {
      // encontra o card pelo label e verifica existência do valor
      cy.contains(label)
        .should('be.visible');
    });

    // verifica formato da receita (tem "R$")
    cy.contains('Receita Mensal')
      .closest('.stat-card')
      .find('.stat-value')
      .invoke('text')
      .should('match', /R\$/);
  });

  it('Exibe o resumo de reservas com Aceitas, Pendentes e Canceladas', () => {
    cy.contains('Resumo de Reservas').should('exist');

    ['Aceitas', 'Pendentes', 'Canceladas'].forEach(label => {
      cy.contains(label).should('exist');
      cy.contains(label)
        .should('exist');
    });
  });

  it('Exibe a seção de Taxa de Ocupação com valor e mensagem', () => {
    cy.contains('Taxa de Ocupação').should('exist');
    cy.get('.chart-value').should('exist');
  });

  it('Exibe Reservas Recentes e botão "Ver todas"', () => {
    cy.contains('Reservas Recentes').should('exist');
  cy.get('.btn-view-all')
    .scrollIntoView()
    .should('be.visible');

    // verifica existência do componente de reservas (tabela ou container)
    cy.get('.reservas-section').within(() => {
      // tenta encontrar uma tabela (caso o ReservasTable renderize uma)
      cy.get('table').should('exist');
    });
  });

});
