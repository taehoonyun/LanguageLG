import '@testing-library/cypress/add-commands';

// Custom command to login
Cypress.Commands.add('login', () => {
  cy.visit('/login');
  cy.get('input[name="username"]').type('testuser');
  cy.get('input[name="password"]').type('testpass');
  cy.get('button[type="submit"]').click();
});

// Custom command to check if element is visible and contains text
Cypress.Commands.add('shouldBeVisibleWithText', (selector: string, text: string) => {
  cy.get(selector).should('be.visible').and('contain', text);
});

// Custom command to wait for API response
Cypress.Commands.add('waitForApiResponse', (alias: string) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
  });
});

// Add custom types for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      shouldBeVisibleWithText(selector: string, text: string): Chainable<void>;
      waitForApiResponse(alias: string): Chainable<void>;
    }
  }
} 