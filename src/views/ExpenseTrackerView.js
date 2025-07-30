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
      console.log("handle submit");
      const type = this.form.querySelector("#transaction-type");
      const description = this.form.querySelector("#description");
      const amount = this.form.querySelector("#amount");
      handler({
        type: type.value,
        description: description.value,
        amount: amount.value,
      });
      this.resetFields(description, amount);
    });
  }

  bindDeleteTransaction(handler) {
    document.addEventListener("click", (e) => {
      console.log("clicked", e.target);
      if (!e.target.classList.contains("delete-button")) return;
      const transaction = e.target.closest(".transaction-line-item");
      console.log(transaction);
      const transactionId = transaction.dataset.transactionId;
      console.log(transactionId);
      handler(transactionId);
    });
  }

  setBalance(balanceAmount) {
    if (balanceAmount < 0) {
      const posBalance = balanceAmount * -1;
      balance.innerText = `Balance: -\$${posBalance.toLocaleString("en")}`;
    } else {
      balance.innerText = `Balance: \$${balanceAmount.toLocaleString("en")}`;
    }
  }

  setCategoryTotals(totals) {
    const { expenses, income } = totals;
    const expensesTotalElement = document.getElementById("expenses-total");
    const incomeTotalElement = document.getElementById("income-total");

    expensesTotalElement.innerText = `Total: \$${expenses.toLocaleString(
      "en"
    )}`;
    incomeTotalElement.innerText = `Total: \$${income.toLocaleString("en")}`;
  }

  setLineItemDate(transactionDate, dateElement) {
    //New transaction objects have a date object attached, but when the json is parsed from localStorage date was returning as a string
    let dateObj =
      typeof transactionDate === "string"
        ? new Date(transactionDate)
        : transactionDate;
    dateElement.innerText = `${dateObj
      .getDate()
      .toString()
      .padStart(2, "0")}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${(dateObj.getFullYear() % 100)
      .toString()
      .padStart(2, "0")}`;
  }

  clearTransactions() {
    const elements = document.getElementsByClassName("transaction-line-item");
    while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  renderTransaction(transaction) {
    const lineItem = document
      .querySelector("#transaction-card-template")
      .content.cloneNode(true);
    //Capture the li element from the template
    const li = lineItem.querySelector(".transaction-line-item");
    //Update data attributes
    li.dataset.transactionId = transaction.id;
    li.dataset.transactionType = transaction.type;
    //Capture fields from template
    const description = lineItem.querySelector(".transaction-description");
    const amount = lineItem.querySelector(".transaction-amount");
    const date = lineItem.querySelector(".transaction-date");
    //Update fields
    description.innerText = transaction.description;
    amount.innerText = `\$${transaction.amount}`;
    //The logic for setting dates was a bit messy so I created a helper function
    this.setLineItemDate(transaction.date, date);
    if (transaction.type === "expense") {
      const list = document.querySelector("#expenses-list");
      list.appendChild(lineItem);
    } else if (transaction.type === "income") {
      const list = document.querySelector("#income-list");
      list.appendChild(lineItem);
    }
  }

  resetFields(description, amount) {
    description.value = "";
    amount.value = "";
  }
}

export { ExpenseTrackerView };
