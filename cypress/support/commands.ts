/// <reference types="cypress" />

Cypress.Commands.add("getData", (attribute) => {
  return cy.get(`[data-test="${attribute}"]`);
});

Cypress.Commands.add("addExpense", (date, category, amount) => {
  cy.getData("newExpenseDate").type(`${date}{enter}`);
  cy.getData("newExpenseCategory").type(category);
  cy.getData("newExpenseAmount").type(amount.toString());
  cy.getData("addExpenseBtn").click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      getData(attribute: string): Chainable<JQuery<HTMLElement>>;
      addExpense(
        date: string,
        category: string,
        amount: number
      ): Chainable<void>;
    }
  }
}

export {};
