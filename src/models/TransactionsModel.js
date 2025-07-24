import { Transaction } from "./Transaction.js";

class TransactionsModel {
  #transactions;
  #ids;
  #balance;
  constructor() {
    this.#getIds();
    this.transactions = JSON.parse(localStorage.getItem('transactions')) || []; 
  }

  bindTransactionsChange(callback) {
    this.onTransactionsChange = callback;
  }

  addTransaction({type, description, amount}) {

    const newId = this.#generateId(); 

    const newTransaction = new Transaction(
      type,
      description,
      amount,
      newId
    );
    this.#transactions.push(newTransaction);

    this.#commit();
  }

  deleteTransaction(event) {
    if (!event.target.classList.contains("delete-button")) return;
    const transaction = event.target.closest("li");
    const transactionType = transaction.dataset.transactionType;
    const transactionId = transaction.dataset.transactionId;
    transaction.remove();
    this.#transactions = this.#transactions.filter((transaction) => {
      return transaction.id !== Number(transactionId);
    });
    this.#commit();
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
  #commit() {
    this.onTransactionsChange(this.#transactions);

    const transactionsJSON = localStorage.setItem("transactions");
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

export { TransactionsModel };
