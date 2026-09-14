describe('Login', () => {
    it('Login, all errorcases too...', () => {
        cy.log('all error cases too')
    })

    it('Trial on env vars...', () => {
        cy.env(['userNameDefault']).then(({ userNameDefault }) => cy.log(userNameDefault))

        // CYPRESS_user_name_default=Bjååland npx cypress open
        // will override the one in cypress.env.json (env:),
        // and also one in cypress.config.js, works if in (env:)
        cy.env(['user_name_default']).then(({ user_name_default }) => cy.log(user_name_default))
        // fetched like this, must be in cypress.env.json (env: or expose:)
        cy.log('demoPortalUrl', Cypress.expose('demoPortalUrl'));
        cy.log('usernameDefault expo', Cypress.expose('usernameDefault'));

        cy.env(['demo_portal_url']).then(({ demo_portal_url }) =>
            cy.visit(demo_portal_url).then(() =>
                cy.get('.login_logo').contains('Swag Labs')
            ))
    })
})