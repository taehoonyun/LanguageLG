/// <reference types="cypress" />

describe('Main Page', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '**/util/getCharacterNames', {
      statusCode: 200,
      body: {
        data: ['Character 1', 'Character 2', 'Character 3']
      }
    }).as('getCharacters');

    cy.intercept('POST', '**/chat/sendMessage', {
      statusCode: 200,
      body: {
        result: true,
        data: {
          Response: 'Test response',
          Error: null
        }
      }
    }).as('getAIResponse');

    cy.visit('/');
  });

  it('loads the main page successfully', () => {
    cy.wait('@getCharacters');
    cy.get('input[type="text"]').should('have.length', 3); // cafe, gym, restaurant inputs
    cy.get('button').filter(':contains("Send"), :contains("quit")').should('have.length', 6);
  });

  it('can input text and send message', () => {
    cy.wait('@getCharacters');
    cy.get('#webpack-dev-server-client-overlay').then($el => {
      if ($el.length) {
        cy.wrap($el).invoke('remove');
      }
    });
    cy.get('input[type="text"]').first().type('Hello at cafe', { force: true });
    cy.get('button').filter(':contains("Send")').first().click({ force: true });
    cy.wait('@getAIResponse');
    cy.get('.font-semibold.text-white').last().should('contain', 'Test response');
  });

  it('can quit conversation', () => {
    cy.wait('@getCharacters');
    cy.get('button').filter(':contains("quit")').first().click({ force: true });
    cy.url().should('include', '/');
  });

  it('handles API errors gracefully', () => {
    cy.wait('@getCharacters');
    cy.intercept('POST', '**/chat/sendMessage', {
      statusCode: 500,
      body: {
        result: false,
        data: {
          Response: null,
          Error: 'Failed to call ChatGPT API'
        }
      }
    }).as('getAIError');

    cy.get('#webpack-dev-server-client-overlay').then($el => {
      if ($el.length) {
        cy.wrap($el).invoke('remove');
      }
    });
    cy.get('input[type="text"]').first().type('Test message', { force: true });
    cy.get('button').filter(':contains("Send")').first().click({ force: true });
    cy.wait('@getAIError');
    cy.get('.font-semibold.text-danger').should('contain', 'Failed to call ChatGPT API');
  });
}); 