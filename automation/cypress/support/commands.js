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


const mapSelector = '#map';

Cypress.Commands.add('loginExistUser', (email, password) => {
    cy.contains('Sign in with email').click();
    cy.get('input[id="ui-sign-in-email-input"]')
        .type(email).should('have.value', email);
    cy.contains('Next').click();
    cy.get('input[id="ui-sign-in-password-input"]')
        .type(password).should('have.value', password);
    cy.contains('Sign In').click();
});

Cypress.Commands.add('loginNewUser', (email, name, password) => {
    cy.contains('Sign in with email').click();
    cy.get('input[id="ui-sign-in-email-input"]')
        .type(email).should('have.value', email);
    cy.contains('Next').click();
    cy.get('input[id="ui-sign-in-name-input"]')
        .type(name).should('have.value', name);
    cy.get('input[id="ui-sign-in-new-password-input"]')
        .type(password).should('have.value', password);
    cy.contains('Save').click();
});

Cypress.Commands.add('validateHomeScreenClient', () => {
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('img[id="bgu-home-logo"]', { timeout: 10000 }).should('be.visible');
    cy.get('img[id="ecoocean-home-logo"]', { timeout: 10000 }).should('be.visible');
    cy.waitForNetworkIdle(5000);
});

Cypress.Commands.add('validateHomeScreenAdmin', () => {
    cy.url().should('eq', 'http://localhost:3001/');
    cy.contains('Admin EcoOcean', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('validateLoginScreen', () => {
    cy.url().should('include', '/login');
    cy.get('img[class="LoginLogo"]', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('logoutClient', () => {
    cy.get('button[id="settings"]').click();
    cy.get('button')
        .contains('Logout')
        .parent().click();
})

Cypress.Commands.add('logoutAdmin', () => {
    cy.get('div[class="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-yykqe9-MuiAvatar-root"]').click();
    cy.contains('Logout').click();

})
