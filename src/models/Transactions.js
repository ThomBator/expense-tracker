import { Transaction } from "./Transaction.js";

class Transactions {
  #transactions;
  #ids;
  #balance;
  #expenseTotal;
  #incomeTotal;

  constructor() {
    this.#getIds();
    this.#transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    this.#setBalance();
    this.#setCategoryTotals();
  }

  //Update transactions and totals on add, delete and app startup
  #commit() {
    localStorage.setItem("transactions", JSON.stringify(this.#transactions));
    this.#setBalance();
    this.#setCategoryTotals();
  }

  addTransaction({ type, description, amount }) {
    const newId = this.#generateId();

    const newTransaction = new Transaction(type, description, amount, newId);

    console.log("new transaction", newTransaction);
    this.#transactions.push(newTransaction);

    this.#commit();

    return this.#transactions;

    
  }

  //remove view logic
  deleteTransaction(id) {

    this.#transactions = this.#transactions.filter((transaction) => {
      return transaction.id !== Number(id);
    });
    this.#commit();
  }

  getTransactions() {
    return this.#transactions;
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

  getBalance() {
    return this.#balance;
  }

  getCategoryTotals() {
    return { expenses: this.#expenseTotal, income: this.#incomeTotal };
  }

  #setBalance() {
    this.#balance = this.#transactions.reduce((accumulater, transaction) => {
      if (transaction.type === "expense")
        return accumulater - Number(transaction.amount);
      if (transaction.type === "income")
        return accumulater + Number(transaction.amount);
    }, 0);
  }

  #setCategoryTotals() {
    this.#expenseTotal = 0;
    this.#incomeTotal = 0;

    this.#transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        this.#expenseTotal += Number(transaction.amount);
      } else {
        this.#incomeTotal += Number(transaction.amount);
      }
    });
  }
}

export { Transactions };
