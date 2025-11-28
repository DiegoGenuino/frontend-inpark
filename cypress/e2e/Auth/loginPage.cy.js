describe('Página de Login - Teste básico', () => {

  it('Preenche email, senha e clica em Entrar', () => {
    // 1. Acessa a página de login
    cy.visit('http://localhost:5173/login')

    // 2. Seleciona o input de email e digita o texto
    cy.get('input#email')
      .should('be.visible')
      .type('vinicius@gmail.com')

    // 3. Seleciona o input de senha e digita o texto
    cy.get('input#senha')
      .should('be.visible')
      .type('Senha_123!')

    // 4. Pressiona o botão Entrar
    cy.contains('button', 'Entrar')
      .should('be.visible')
      .click()
  })

})
