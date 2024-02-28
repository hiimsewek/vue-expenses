/// <reference types = 'cypress' />

beforeEach(() => {
  cy.viewport(1280, 1024);
  cy.visit("/");
});

it("Displays headline", () => {
  cy.get("h1").contains("Expenses");
});

describe("Add expense form", () => {
  it("displays form", () => {
    cy.getData("newExpenseForm").should("be.visible");
  });

  it("displays header", () => {
    cy.getData("newExpenseForm").should("contain", "Add New Expense");
  });

  it("has button disabled when form is empty", () => {
    cy.getData("addExpenseBtn").should("be.disabled");
  });

  it("adds new expense", () => {
    cy.getData("emptyExpensesMessage").should("be.visible");
    cy.getData("expensesTableContainer").should("not.exist");
    cy.addExpense("02/26/2024", "Food", 20);
    cy.getData("emptyExpensesMessage").should("not.exist");
    cy.getData("expensesTableContainer").should("be.visible");
  });
});

describe("Add expense form on small devices", () => {
  beforeEach(() => {
    cy.viewport(430, 932);
  });

  it("shows form expand button", () => {
    cy.getData("expandFormBtn");
    cy.getData("newExpenseForm").should("not.exist");
  });

  it("displays header", () => {
    cy.getData("expandFormBtn").click();
    cy.getData("newExpenseForm").should("contain", "Add New Expense");
  });

  it("shows new expense form after clicking the icon", () => {
    cy.getData("expandFormBtn").click();
    cy.getData("newExpenseForm").should("be.visible");
  });

  it("has button disabled when form is empty", () => {
    cy.getData("expandFormBtn").click();
    cy.getData("addExpenseBtn").should("be.disabled");
  });

  it("adds new expense", () => {
    cy.getData("expandFormBtn").click();
    cy.getData("emptyExpensesMessage").should("be.visible");
    cy.getData("expensesTableContainer").should("not.exist");
    cy.addExpense("02/26/2024", "Food", 20);
    cy.getData("emptyExpensesMessage").should("not.exist");
    cy.getData("expensesTableContainer").should("be.visible");
  });
});

describe("Expenses table", () => {
  beforeEach(() => {
    cy.addExpense("02/26/2024", "Food", 20);
  });

  it("displays category with case insensitivity", () => {
    cy.addExpense("02/26/2024", "fOoD", 20);
    cy.getData("expensesTableContainer").should("not.contain", "fOoD");
    cy.getData("expensesTableContainer").should("contain", "Food");
  });

  it("correctly displays total expenses", () => {
    cy.getData("expensesTotal").should("contain", "20");
    cy.addExpense("02/26/2024", "Food", 30);
    cy.getData("expensesTotal").should("contain", "50");
  });

  it("displays generate button", () => {
    cy.getData("generateSummaryBtn").should("be.visible");
  });

  it("opens modal to edit expense", () => {
    cy.getData("toggleEditExpense").click();
    cy.getData("editExpenseForm").should("be.visible");
  });

  it("deletes expense", () => {
    cy.getData("expensesTableContainer").should("be.visible");
    cy.getData("deleteExpense").click();
    cy.getData("expensesTableContainer").should("not.exist");
    cy.getData("emptyExpensesMessage").should("be.visible");
  });

  it("shows filter button only when there are at least 2 expenses", () => {
    cy.getData("showFiltersBtn").should("not.exist");
    cy.addExpense("02/26/2024", "Fuel", 100);
    cy.getData("showFiltersBtn").should("be.visible");
  });
  it("opens filter sidebar", () => {
    cy.addExpense("02/26/2024", "Fuel", 100);
    cy.getData("filtersSidebar").should("not.exist");
    cy.getData("showFiltersBtn").click();
    cy.getData("filtersSidebar").should("be.visible");
  });
});

describe("Edit expense", () => {
  beforeEach(() => {
    cy.addExpense("02/26/2024", "Fuel", 100);
    cy.getData("toggleEditExpense").click();
  });

  it("opens modal with prefilled values", () => {
    cy.getData("editExpenseDate")
      .invoke("val")
      .then((val) => val === "02/26/2024");
    cy.getData("editExpenseCategory").should("have.value", "Fuel");
    cy.getData("editExpenseDate")
      .invoke("val")
      .then((val) => val === "100");
  });

  it("displays header", () => {
    cy.getData("editExpenseForm").should("contain", "Edit Expense");
  });

  it("has edit button disabled after modal is opened", () => {
    cy.getData("editExpenseBtn").should("be.disabled");
  });

  it("has button disabled if any of the fields is empty", () => {
    cy.getData("editExpenseCategory").clear();
    cy.getData("editExpenseBtn").should("be.disabled");
  });

  it("has button disabled if none of the fields has changed", () => {
    cy.getData("editExpenseCategory").clear();
    cy.getData("editExpenseCategory").type("Food");
    cy.getData("editExpenseBtn").should("be.enabled");

    cy.getData("editExpenseCategory").clear();
    cy.getData("editExpenseCategory").type("Fuel");
    cy.getData("editExpenseBtn").should("be.disabled");
  });

  it.only("edits expense", () => {
    cy.getData("editExpenseDate").clear();
    cy.getData("editExpenseDate").type("02/27/2024{enter}");

    cy.getData("editExpenseCategory").clear();
    cy.getData("editExpenseCategory").type("Food");

    cy.getData("editExpenseAmount").clear();
    cy.getData("editExpenseAmount").type("120");

    cy.getData("editExpenseBtn").click();
    cy.getData("expensesTable").find("tbody > tr").should("have.length", 1);

    cy.getData("expensesTable").should("not.contain", "02/26/2024");
    cy.getData("expensesTable").should("contain", "02/27/2024");

    cy.getData("expensesTable").should("not.contain", "Fuel");
    cy.getData("expensesTable").should("contain", "Food");

    cy.getData("expensesTable").should("not.contain", "100");
    cy.getData("expensesTable").should("contain", "120");
  });
});

describe("Expense filters", () => {
  beforeEach(() => {
    cy.addExpense("01/26/2024", "Fuel", 100);
    cy.addExpense("02/26/2024", "Fuel", 100);
    cy.addExpense("01/26/2024", "Food", 40);
    cy.addExpense("01/26/2024", "Food", 30);
    cy.getData("showFiltersBtn").click();
  });

  it("displays header", () => {
    cy.getData("filtersSidebar").should("contain", "Expense Filters");
  });

  it("correctly applies categories filters", () => {
    cy.getData("ms-categories").click();
    cy.contains("li", "Food").click();
    cy.getData("expensesTable").should("not.contain", "Fuel");
    cy.getData("expensesTable").should("contain", "Food");
  });

  it("correctly applies date filters", () => {
    cy.getData("ms-months").click();
    cy.contains("li", "02/2024").click();
    cy.getData("expensesTable")
      .find("tbody > tr > td")
      .first()
      .invoke("text")
      .should("not.match", /^01\/\d{2}\/2024$/);
    cy.getData("expensesTable")
      .find("tbody > tr > td")
      .first()
      .invoke("text")
      .should("match", /^02\/\d{2}\/2024$/);
  });

  it("correctly applies amount filters", () => {
    cy.getData("expensesTable").should("contain", "30");
    cy.get(".p-slider-handle").first().trigger("mousedown", { force: true });
    cy.get(".p-slider-handle")
      .first()
      .trigger("mousemove", "right", { force: true });
    cy.get(".p-slider-handle").first().trigger("mouseup", { force: true });
    cy.getData("expensesTable").should("not.contain", "30");
  });

  it("displays amount range correctly", () => {
    cy.getData("amountRangeText").should("contain", "30 - 100");

    cy.get(".p-slider-handle").first().trigger("mousedown", { force: true });
    cy.get(".p-slider-handle")
      .first()
      .trigger("mousemove", "right", { force: true });
    cy.get(".p-slider-handle").first().trigger("mouseup", { force: true });

    cy.get(".p-slider-handle").eq(1).trigger("mousedown", { force: true });
    cy.get(".p-slider-handle")
      .first()
      .trigger("mousemove", "left", { force: true });
    cy.get(".p-slider-handle").eq(1).trigger("mouseup", { force: true });

    cy.getData("amountRangeText")
      .invoke("text")
      .then((val) => {
        const range = val.split(" - ");
        const minVal = range[0];
        const maxVal = range[1];

        cy.get(".p-slider-handle")
          .first()
          .should("have.attr", "aria-valuenow", maxVal);
        cy.get(".p-slider-handle")
          .eq(1)
          .should("have.attr", "aria-valuenow", minVal);

        cy.getData("amountRangeText").should(
          "contain",
          `${minVal} - ${maxVal}`
        );
      });
  });

  it("displays correct message when no data were found", () => {
    cy.getData("ms-categories").click();
    cy.contains("li", "Food").click();
    cy.getData("ms-categories").click();
    cy.getData("ms-months").click();
    cy.contains("li", "02/2024").click();

    cy.getData("emptyExpensesMessage").should(
      "contain",
      "No expenses match the criteria"
    );
  });

  it("resets filters", () => {
    cy.getData("ms-categories").click();
    cy.contains("li", "Food").click();
    cy.getData("expensesTable").should("not.contain", "Fuel");
    cy.getData("expensesTable").should("contain", "Food");

    cy.getData("resetFiltersBtn").click();
    cy.getData("expensesTable").should("contain", "Fuel");
    cy.getData("expensesTable").should("contain", "Food");
  });

  it("shows reset filters button only if any of the filters is applied", () => {
    cy.getData("resetFiltersBtn").should("not.exist");
    cy.getData("ms-categories").click();
    cy.contains("li", "Food").click();
    cy.getData("resetFiltersBtn").should("be.visible");
  });

  it("closes filters sidebar after clicking overlay", () => {
    cy.getData("filtersSidebar").should("be.visible");
    cy.get(".p-sidebar-mask").click();
    cy.getData("filtersSidebar").should("not.exist");
  });

  it("closes filters sidebar after clicking overlay", () => {
    cy.getData("filtersSidebar").should("be.visible");
    cy.get(".p-sidebar-close").click();
    cy.getData("filtersSidebar").should("not.exist");
  });
});

describe("Expenses summary", () => {
  beforeEach(() => {
    cy.addExpense("01/26/2024", "Fuel", 100);
    cy.addExpense("02/26/2024", "Fuel", 100);
    cy.addExpense("01/26/2024", "Food", 20);
    cy.addExpense("01/26/2024", "Food", 30);
    cy.getData("generateSummaryBtn").click();
  });

  it("displays header", () => {
    cy.getData("summaryTableContainer").should("contain", "Expenses Summary");
  });
  it("correctly displays montly total", () => {
    cy.getData("summaryMonthlyTotal").first().should("contain", "150");
    cy.getData("summaryMonthlyTotal").eq(1).should("contain", "100");
  });

  it("correctly displays total amount for each category", () => {
    cy.getData("summaryCategoryTotal").first().should("contain", "50");
    cy.getData("summaryCategoryTotal").eq(1).should("contain", "100");

    cy.getData("summaryCategoryTotal").eq(2).should("contain", "100");
  });

  it("correctly displays summary total", () => {
    cy.getData("summaryTotal").should("contain", "250");
  });

  it("displays categories alphabetically", () => {
    cy.getData("summaryTable")
      .find("tbody > tr")
      .find('[data-test="summaryCategoryField"]')
      .first()
      .should("contain", "Food");

    cy.getData("summaryTable")
      .find("tbody > tr")
      .find('[data-test="summaryCategoryField"]')
      .eq(1)
      .should("contain", "Fuel");
  });

  it("correctly applies rowspan for date field", () => {
    cy.getData("summaryDateField")
      .first()
      .invoke("attr", "rowspan")
      .should("eq", "65");
    cy.getData("summaryDateField")
      .eq(1)
      .invoke("attr", "rowspan")
      .should("eq", "31");
  });

  it("displays export button", () => {
    cy.getData("exportSummaryBtn").should("be.visible");
  });
});
