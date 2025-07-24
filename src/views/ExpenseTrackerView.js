class ExpenseTrackerView {
  constructor() {
    this.balance = document.getElementById("balance");
    this.form = document.getElementById("transaction-form");
    console.log("form", this.form);
    this.expensesContainer = document.getElementById("expenses-container");
    this.incomeContainer = document.getElementById("income-container");
  }

  bindAddTransaction(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("handle transaction");
      const type = this.form.querySelector("#transaction-type");
      const description = this.form.querySelector("#description");
      const amount = this.form.querySelector("#amount");
      handler({ type: type.value, description: description.value, amount: amount.value });
    });
  }

  bindDeleteTransaction(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("handle delete transaction");
    });
  }

  #resetFields(type, description, amount) {
    description.value = "";
    amount.value = "";
  }

  #deleteTransaction(event) {
    if (!event.target.classList.contains("delete-button")) return;
    const transaction = event.target.closest("li");
    const transactionType = transaction.dataset.transactionType;
    const transactionId = transaction.dataset.transactionId;
    transaction.remove();
  }
}

export { ExpenseTrackerView };
