
describe('login to ecoocean', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('http://localhost:3000');
  })

  it('login as admin to ecoocean', () => {
    cy.percySnapshot('login screen');
    cy.login('admin@gmail.com', '123456');
    cy.wait(5000);
    cy.get('div[class="sidebar-pane active"]', { timeout: 10000 }).should('be.visible');
    cy.percySnapshot('home page - side panel open');
    cy.get('div[class="sidebar-close"]').click({multiple: true, force: true});
    cy.get('div[class="sidebar-pane active"]').should('not.exist');
    cy.wait(5000);
    cy.percySnapshot('home page - side panel closed');
  })

  it('logout from ecoocean', () => {
    cy.login('admin@gmail.com', '123456');
    cy.logout();
  })

})
