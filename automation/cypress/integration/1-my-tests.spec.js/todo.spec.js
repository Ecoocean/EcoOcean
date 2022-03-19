
describe('login to ecoocean', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('can filter for uncompleted tasks', () => {

    cy.contains('Sign in with email').click();

    cy.get('input[id="ui-sign-in-email-input"]')
        .type('admin@gmail.com').should('have.value', 'admin@gmail.com');

    cy.contains('Next').click();

    cy.get('input[id="ui-sign-in-password-input"]')
        .type('123456').should('have.value', '123456');

    cy.contains('Sign In').click();


    cy.url().should('eq', 'http://localhost:3000/');
  })

})
