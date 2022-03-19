
describe('login to ecoocean', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('http://localhost:3000');
  })

  it('login as admin to ecoocean', () => {
    cy.percySnapshot('login screen');
    cy.login('admin@gmail.com', '123456');
    cy.percySnapshot('home page');
  })

  it('logout from ecoocean', () => {
    cy.login('admin@gmail.com', '123456');
    cy.logout();
  })

})
