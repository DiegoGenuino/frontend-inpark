// cypress/e2e/cliente-navigation.cy.js

describe('Navegação - Rotas do Cliente (apenas navegação entre abas)', () => {
  beforeEach(() => {
    // usa o comando custom que você já tem para autenticar via API
    cy.authCliente();
    // começa no dashboard
    cy.visit('/');
    // garante que o dashboard carregou (verificação simples retirada do seu dashboard.cy.js)
    cy.contains('Olá').should('exist');
  });

  it('Navega para Estacionamentos via sidebar e mostra a página de estacionamentos', () => {
    // clica no link do sidebar (usa texto visível)
    cy.contains(/^Estacionamentos$/).click();

    // garante que a rota está correta
    cy.location('pathname').should('eq', '/estacionamentos');

    // checa um container específico da página que você enviou
    cy.get('.estacionamentos-page').should('exist');

    // e que o header da página está visível (título da página)
    cy.contains('Estacionamentos').should('exist');
  });

  it('Navega para Minhas Reservas e alterna entre as abas internas (Ativas / Histórico)', () => {
    cy.contains(/^Minhas reservas$/i).click();

    cy.location('pathname').should('eq', '/minhas-reservas');

    cy.get('.minhas-reservas-page').should('exist');

    // As abas internas: "Ativas/Pendentes" e "Histórico"
    // Clica na aba "Histórico" e verifica que ela ficou ativa
    cy.get('.abas-filtros').within(() => {
    cy.contains('button', /^Histórico/).click();
    cy.get('.aba-btn.active').should('contain.text', 'Histórico');
  });

// volta para Ativas/Pendentes
cy.get('.abas-filtros').within(() => {
  cy.contains('button', /^Ativas\/Pendentes/).click();
  cy.get('.aba-btn.active').should('contain.text', 'Ativas/Pendentes');
});


    // volta para "Ativas/Pendentes" e verifica
    cy.get('.abas-filtros').within(() => {
      cy.contains(/Ativas\/Pendentes/).click();
      cy.get('.aba-btn.active').should('contain.text', 'Ativas/Pendentes');
    });

    // verificação extra: existe o contador (você os usa no JSX)
    cy.get('.abas-filtros').should('exist');
  });

  it('Navega para Minhas Avaliações e valida conteúdo esperado', () => {
    cy.contains(/^Minhas avaliações$/i).click();

    cy.location('pathname').should('eq', '/minhas-avaliacoes');

    cy.get('.minhas-avaliacoes-page').should('exist');

    // a página mostra "Minhas Avaliações" e, caso não haja avaliações, botão para buscar
    cy.contains('Minhas Avaliações').should('exist');

    // se estiver no estado sem avaliações, o botão para buscar estacionamentos existe
    cy.get('.minhas-avaliacoes-page').then(($page) => {
  // Se existe grid, então NÃO deve mostrar o botão
    if ($page.find('.avaliacoes-grid').length > 0) {
      cy.get('button.btn-search').should('not.exist');
    } 
  // Se não existe grid, deve mostrar no-avaliacoes + botão
    else {
      cy.get('button.btn-search').should('exist');
    }
});

  });

  it('Fluxo rápido: Estacionamentos -> Minhas Reservas -> Minhas Avaliações -> Dashboard', () => {
    cy.contains(/^Estacionamentos$/).click();
    cy.location('pathname').should('eq', '/estacionamentos');

    cy.contains(/^Minhas reservas$/i).click();
    cy.location('pathname').should('eq', '/minhas-reservas');

    cy.contains(/^Minhas avaliações$/i).click();
    cy.location('pathname').should('eq', '/minhas-avaliacoes');

    // volta ao dashboard (rota raiz)
    // tenta clicar por link visível de Dashboard; se não tiver, usa visit('/').
    // prefiro usar visit para garantir idempotência do teste
    cy.visit('/');
    cy.location('pathname').should('eq', '/');
    cy.contains('Olá').should('exist');
  });

  it('Navega para Meus Carros e valida tanto o estado "vazio" quanto o estado "com carros"', () => {
  cy.contains(/^Meus carros$/i).click();
  cy.location('pathname').should('eq', '/meus-carros');

  // container e botão de adicionar sempre existem
  cy.get('.meus-carros-container').should('exist');
  cy.get('.btn-add-carro').should('exist').and('contain.text', 'Adicionar Novo Carro');

  // pega a grid de carros e decide qual caminho seguir
  cy.get('.carros-grid').then($grid => {
    // Caso 1: existe o bloco .no-carros -> página vazia
    if ($grid.find('.no-carros').length > 0) {
      cy.wrap($grid).within(() => {
        cy.contains('Nenhum veículo cadastrado').should('exist');
        cy.contains('Adicione seus veículos para facilitar').should('exist');
      });
    } 
    // Caso 2: não existe .no-carros -> há pelo menos 1 carro listado
    else {
      // validações para estado com carros
      // 1) não deve exibir a mensagem de vazio
      cy.wrap($grid).should('not.contain', 'Nenhum veículo cadastrado');

      // 2) deve ter pelo menos um filho (um CarCard)
      // usamos jQuery aqui para contar elementos filhos do container
      const childCount = $grid.children().length;
      expect(childCount).to.be.gte(1);

      // 3) garantia básica: deve existir pelo menos um botão (editar/excluir/set principal)
      cy.wrap($grid).find('button').its('length').should('be.gte', 1);

      // 4) (opcional) se seus CarCard exibirem placa/modelo, você pode checar algo assim:
      // cy.wrap($grid).find('.car-card').first().should('contain.text', 'Placa').or('contain.text', 'Modelo');
    }
  });
});


  it('Navega para Meu Perfil via dashboard e valida conteúdo principal', () => {
    cy.contains(/^Meu perfil$/i).click();

    cy.location('pathname').should('eq', '/meu-perfil');

    cy.get('.meu-perfil-container').should('exist');

    cy.contains('Meu Perfil').should('exist');
    cy.contains('Clique nos campos para editar suas informações').should('exist');

    // Avatar sempre existe (URL dinâmica)
    cy.get('.avatar-image').should('exist');

    // Campos editáveis principais
    cy.contains('Nome Completo').should('exist');
    cy.contains('E-mail').should('exist');
    cy.contains('Data de Nascimento').should('exist');

    // Os valores podem variar, mas a estrutura existe
    cy.get('.info-item').should('have.length.at.least', 3);
  });

});
