

describe('reports in ecoocean client', () => {
    const email = 'random@gmail.com';
    const displayName = 'random';
    const password = '123456';
    const isAdmin = false;
    let positionLogSpy;
    const position = {
        latitude: 32.970595,
        longitude: 35.077334
    }
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
        cy.loginExistUser('random@gmail.com', '123456');
        cy.validateHomeScreenClient();
        cy.get('div[class="sidebar-pane active"]', { timeout: 10000 }).should('be.visible');
        cy.window()
            .then(win => {
                const expectedLogMessage = `new position lat: ${position.latitude}, lng: ${position.longitude}`;
                positionLogSpy = cy.spy(win.console, "log").withArgs(expectedLogMessage);
            })
            .then(() => {
                cy.setFakeLoaction(position);
            });

    })

    it('create empty report and verify', () => {
        cy.clickSection('add-report');

        cy.get('button')
            .contains('Save').click({ timeout: 10000 });
        cy.contains('Pollution Reports', { timeout: 10000 }).should('be.visible');
        cy.contains('Pollution report successfully submitted', { timeout: 10000 }).should('be.visible');
        cy.get('ul[id="report-list"]').first().first().should('have.length', 1);
    });

    it('remove a report and verify', () => {
        cy.clickSection('add-report');
        cy.get('button')
            .contains('Save').click({ timeout: 10000 });
        cy.contains('Pollution Reports', { timeout: 10000 }).should('be.visible');
        cy.contains('Pollution report successfully submitted', { timeout: 10000 }).should('be.visible');
        cy.get('ul[id="report-list"]').first().first().should('have.length', 1);
        cy.get('button[id="delete-report-0"]').click({ timeout: 10000 });
        cy.contains('Pollution report successfully deleted', { timeout: 10000 }).should('be.visible');
        cy.get('button[id="delete-report-0"]', { timeout: 10000 }).should('not.exist');
        cy.get('ul[id="report-list"]').first().children().children().should('not.exist');
    })

    it('click on report in the report list should open report modal', () => {
        cy.clickSection('add-report');
        cy.get('button')
            .contains('Save').click({ timeout: 10000 });
        cy.contains('Pollution Reports', { timeout: 10000 }).should('be.visible');
        cy.contains('Pollution report successfully submitted', { timeout: 10000 }).should('be.visible');
        cy.get('ul[id="report-list"]').first().first().should('have.length', 1);
        cy.get('div[id="report-item-clickable-0"]').click({ timeout: 10000 });
        cy.contains('Pollution report', { timeout: 10000 }).should('be.visible');
    })
});

