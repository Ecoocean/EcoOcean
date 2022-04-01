
describe('login to ecoocean admin - positive scenario', () => {
  const adminUser = {
    email: 'admin@gmail.com',
    displayName: 'admin',
    password:'123456',
    isAdmin: true
  }

  beforeEach(() => {
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.exec('node ./cypress/support/cleanup.js').then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.exec('node ./cypress/support/addUserFirebase.js', {env:  {...adminUser} }).then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.visit('http://localhost:3001');
  })

  it('login as admin to ecoocean', () => {
    cy.percySnapshot('login screen - admin');
    cy.loginExistUser(adminUser.email, adminUser.password);
    cy.validateHomeScreenAdmin();
    cy.percySnapshot('home page admin');
  })

  it('logout from ecoocean admin', () => {
    cy.loginExistUser(adminUser.email, adminUser.password);
    cy.validateHomeScreenAdmin();
    cy.logoutAdmin();
    cy.validateLoginScreen();
  })
});

describe('login to ecoocean - negative scenario', () => {
  const normalUser = {
    email: 'normal@gmail.com',
    displayName: 'admin',
    password:'123456',
    isAdmin: false
  }
  beforeEach(() =>{
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.exec('node ./cypress/support/cleanup.js').then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.exec('node ./cypress/support/addUserFirebase.js', {env:  {...normalUser} }).then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.visit('http://localhost:3001');
  });

  it('assert failed login of a new user', () => {
    cy.loginNewUser('automation@gmail.com', 'automation', '123456');
    cy.validateLoginScreen();
    cy.contains('User is not authorized — Please ask an admin to get access', { timeout: 10000 }).should('be.visible');
    cy.contains('Try with a different account', { timeout: 10000 }).should('be.visible');
    cy.percySnapshot('login page admin - unauthorized user');
  });

  it('assert failed login of a normal user', () => {
    cy.loginExistUser(normalUser.email, normalUser.password);
    cy.validateLoginScreen();
    cy.contains('User is not authorized — Please ask an admin to get access', { timeout: 10000 }).should('be.visible');
    cy.contains('Try with a different account', { timeout: 10000 }).should('be.visible');
  });
})

