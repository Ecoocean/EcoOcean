
describe('login to ecoocean client - positive scenario', () => {
  const email = 'random@gmail.com';
  const displayName = 'random';
  const password = '123456';
  const isAdmin = false;
  beforeEach(() => {
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.exec('node ./cypress/support/cleanup.js').then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.exec('node ./cypress/support/addUserFirebase.js', {env: {
        email , displayName , password, isAdmin
      }}).then((result) => {
      expect(result.code).to.eq(0)
    });
    cy.visit('http://localhost:3000');
  })

  it('login to ecoocean', () => {
    cy.percySnapshot('login screen - client');
    cy.loginExistUser('random@gmail.com', '123456');
    cy.validateHomeScreenClient();
    cy.get('div[class="sidebar-pane active"]', { timeout: 10000 }).should('be.visible');
    cy.waitForNetworkIdle(5000);
    cy.percySnapshot('home page client - side panel open');
    cy.get('div[class="sidebar-close"]').click({multiple: true, force: true});
    cy.get('div[class="sidebar-pane active"]').should('not.exist');
    cy.percySnapshot('home page client - side panel closed');
  })

  it('logout from ecoocean', () => {
    cy.loginExistUser(email, password);
    cy.validateHomeScreenClient();
    cy.logoutClient();
    cy.validateLoginScreen();
  })
});

describe('login to ecoocean client - negative scenario', () => {
  beforeEach(() =>{
    cy.clearLocalStorage();
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.exec('node ./cypress/support/cleanup.js').then((result) => {
      expect(result.code).to.eq(0)
    })
    cy.visit('http://localhost:3000');
  });

  it('assert failed login of a new user', () => {
    cy.loginNewUser('automation@gmail.com', 'automation', '123456');
    cy.validateLoginScreen();
    cy.contains('User is not authorized — Please ask an admin to get access', { timeout: 10000 }).should('be.visible');
    cy.contains('Try with a different account', { timeout: 10000 }).should('be.visible');
    cy.percySnapshot('login page client - unauthorized user');
  });
})

