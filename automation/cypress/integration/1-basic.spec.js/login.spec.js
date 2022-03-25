
describe('login to ecoocean - positive scenario', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.exec('node ./cypress/support/cleanupFirebase.js').then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.exec('node ./cypress/support/addUserFirebase.js', {env: {
      email: 'admin@gmail.com', displayName: 'admin', password: '123456'
      }}).then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.visit('http://localhost:3000', { timeout: 120000 });
  })

  it('login as admin to ecoocean', () => {
    cy.percySnapshot('login screen');
    cy.loginExistUser('admin@gmail.com', '123456');
    cy.validateHomeScreen();
    cy.get('div[class="sidebar-pane active"]', { timeout: 10000 }).should('be.visible');
    cy.percySnapshot('home page - side panel open');
    cy.get('div[class="sidebar-close"]').click({multiple: true, force: true});
    cy.get('div[class="sidebar-pane active"]').should('not.exist');
    cy.percySnapshot('home page - side panel closed');
  })

  it('logout from ecoocean', () => {
    cy.loginExistUser('admin@gmail.com', '123456');
    cy.validateHomeScreen();
    cy.logout();
    cy.validateLoginScreen();
  })
});

describe('login to ecoocean - negative scenario', () => {
  beforeEach(() =>{
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.exec('node ./cypress/support/cleanupFirebase.js').then((result) => {
      expect(result.code).to.eq(0)
    })
    cy.visit('http://localhost:3000', { timeout: 120000 });
  });

  it('assert failed login of a new user', () => {

    cy.loginNewUser('automation@gmail.com', 'automation', '123456');
    cy.validateLoginScreen();
    cy.contains('User is not authorized — Please ask an admin to get access', { timeout: 10000 }).should('be.visible');
    cy.contains('Try with a different account', { timeout: 10000 }).should('be.visible');
    cy.percySnapshot('login page - unauthorized user');
  });
})

