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
      handler({
        type: type.value,
        description: description.value,
        amount: amount.value,
      });
    });
  }

  bindDeleteTransaction(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("handle delete transaction");
    });
  }

  setLineItemDate(transactionDate, dateElement) {
    console.log('tDate', transactionDate);
    //New transaction objects have a date object attached, but when the json is parsed from localStorage date was returning as a string
    let dateObj =
      typeof transactionDate === "string"
        ? new Date(transactionDate)
        : transactionDate;
    dateElement.innerText = `${(dateObj.getDate()).toString().padStart(2,'0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${(dateObj
      .getFullYear() % 100)
      .toString()
      .padStart(2, "0")}`;
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
   
  resetFields(type, description, amount) {
    description.value = "";
    amount.value = "";
  }

  deleteTransaction(event) {
    if (!event.target.classList.contains("delete-button")) return;
    const transaction = event.target.closest("li");
    const transactionType = transaction.dataset.transactionType;
    const transactionId = transaction.dataset.transactionId;
    transaction.remove();
  }
}

export { ExpenseTrackerView };
