

describe('reports in ecoocean client', () => {
    const email = 'random@gmail.com';
    const displayName = 'random';
    const password = '123456';
    const isAdmin = false;
    let positionLogSpy;
    const setFakePosition = position => {
        cy.log("**allowGeolocation**").then(() =>
            Cypress.automation("remote:debugger:protocol", {
                command: "Browser.grantPermissions",
                params: {
                    origin: "http://localhost:3000",
                    permissions: ["geolocation"],
                }
            })
        );
        // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setGeolocationOverride
        console.debug(`cypress::setGeolocationOverride with position ${JSON.stringify(position)}`);
        cy.log("**setGeolocationOverride**").then(() =>
            Cypress.automation("remote:debugger:protocol", {
                command: "Emulation.setGeolocationOverride",
                params: {
                    latitude: position.latitude,
                    longitude: position.longitude,
                    accuracy: 50
                }
            })
        );
    };
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

    })

    it('create empty report and verify', () => {
        cy.clickSection('add-report');
        cy.window()
            .then(win => {
                const expectedLogMessage = `new position lat: ${position.latitude}, lng: ${position.longitude}`;
                positionLogSpy = cy.spy(win.console, "log").withArgs(expectedLogMessage);
            })
            .then(() => {
                setFakePosition(position);
            });
        cy.wait(5000);
        cy.get('button')
            .contains('Save').click();
        cy.contains('Pollution Reports', { timeout: 10000 }).should('be.visible');
        cy.contains('Pollution report successfully submitted', { timeout: 10000 }).should('be.visible');
        cy.get('ul[id="report-list"]').should('have.length', 1);
    })
});

