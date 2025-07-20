//Transaction Class
class Transaction {
  type;
  description;
  amount;
  id;
  date = new Date();

  constructor(type, description, amount, id) {
    this.type = type;
    this.description = description;
    this.amount = amount;
    this.id = id;
  }
}

//Key document elements for app
const balance = document.getElementById("balance");
const form = document.getElementById("transaction-form");
const expensesContainer = document.getElementById("expenses-container");
const incomeContainer = document.getElementById("income-container");

//App class to control logic and interact with DOM
class App {
  #transactions;
  #ids;
  #balance;
  constructor() {
    console.log(form);
    form.addEventListener("submit", (e) => this.#addTransaction(e));
    document.addEventListener("click", (e) => this.#deleteTransaction(e));
    this.#getIds();
    this.#getTransactions();
  }

  #addTransaction(e) {
    e.preventDefault();
    //obtain the values from within the form elements
    const type = form.querySelector("#transaction-type");
    const description = form.querySelector("#description");
    const amount = form.querySelector("#amount");
    const id = this.#generateId();
    console.log(type, description, amount, id);
    //create a new Transaction
    const newTransaction = new Transaction(
      type.value,
      description.value,
      amount.value,
      id
    );
    this.#transactions.push(newTransaction);
    //Reset form values
    this.#resetFields(type, description, amount);
    //Update transactions in local storage
    localStorage.setItem("transactions", JSON.stringify(this.#transactions));
    //Render new transaction in document
    this.#renderTransaction(newTransaction);
  }

  #resetFields(type, description, amount) {
    type.value = "expense";
    description.value = "";
    amount.value = "";
  }

  #renderTransaction(transaction) {
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
    amount.innerText = transaction.amount;
    //The logic for setting dates was a bit messy so I created a helper function
    this.#setLineItemDate(transaction.date, date);
    if (transaction.type === "expense") {
      const list = document.querySelector("#expenses-list");
      list.appendChild(lineItem);
      this.#setCategoryTotal("expense");
    } else if (transaction.type === "income") {
      const list = document.querySelector("#income-list");
      list.appendChild(lineItem);
      this.#setCategoryTotal("income");
    }
    this.#setBalance();
  }

  #setLineItemDate(transactionDate, dateElement) {
    //New transaction objects have a date object attached, but when the json is parsed from localStorage date was returning as a string
    let dateObj = typeof transactionDate === "string" ? new Date(transactionDate) : transactionDate;
    //although unlikely for this toy app, I have made sure that years starting with 0 will be adjusted to 2 digits
    dateElement.innerText = `${dateObj.getDay()}/${dateObj.getMonth()}/${dateObj
      .getFullYear()
      .toString()
      .padStart(2, "0")}`;
  }

  #deleteTransaction(event) {
    if (!event.target.classList.contains("delete-button")) return;
    const transaction = event.target.closest("li");
    const transactionType = transaction.dataset.transactionType;
    const transactionId = transaction.dataset.transactionId;
    transaction.remove();
    this.#transactions = this.#transactions.filter((transaction) => {
      return transaction.id !== Number(transactionId);
    });
    localStorage.setItem("transactions", JSON.stringify(this.#transactions));
    this.#setBalance();
    this.#setCategoryTotal(transactionType);
  }

  //Check localStorage for existing ids
  #getIds() {
    const idsJSON = localStorage.getItem("ids");
    if (!idsJSON) {
      this.#ids = [];
      return;
    }
    this.#ids = JSON.parse(idsJSON);
  }
  //Check local storage for existing transactions
  #getTransactions() {
    const transactionsJSON = localStorage.getItem("transactions");
    if (!transactionsJSON) {
      this.#transactions = [];
      return;
    }
    this.#transactions = JSON.parse(transactionsJSON);
    this.#transactions.forEach((transaction) => {
      this.#renderTransaction(transaction);
    });
    this.#setBalance();
    this.#setCategoryTotal("expense");
    this.#setCategoryTotal("income");
  }

  #setBalance() {
    this.#balance = this.#transactions.reduce((accumulater, transaction) => {
      if (transaction.type === "expense")
        return accumulater - Number(transaction.amount);
      if (transaction.type === "income")
        return accumulater + Number(transaction.amount);
    }, 0);

    console.log(this.#balance);
    balance.innerText = `Balance: \$${this.#balance.toLocaleString("en")}`;
  }

  //Sets/updates totals for Expense and Income transaction lists 
  #setCategoryTotal(category) {
    const categoryTotal = this.#transactions.reduce(
      (accumulater, transaction) => {
        if (transaction.type !== category) return accumulater + 0;
        return (accumulater += Number(transaction.amount));
      },
      0
    );
    if (category === "expense") {
      const totalElement = document.getElementById("expenses-total");
      totalElement.innerText = `Total \$${categoryTotal.toLocaleString("en")}`;
    }
    else if (category === "income") {
      const totalElement = document.getElementById("income-total");
      totalElement.innerText = `Total \$${categoryTotal.toLocaleString("en")}`;
    }
  }

  //Create a random id
  #generateId() {
    let newId = Math.floor(Math.random() * (9_999_999 - 1_000_000) + 1_000_000);

    //Ensure the id is unique by checking the ids array
    //In a real app this would be enforced ad the db level with a more robust system
    if (this.#ids.includes(newId)) {
      newId = this.#generateId();
      return newId;
    }
    this.#ids.push(newId);
    localStorage.setItem("ids", JSON.stringify(this.#ids));
    return newId;
  }
}

const app = new App();
