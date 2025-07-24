class TransactionController {
  #model;
  #view;
  constructor(model, view) {
    this.#model = model;
    console.log(this.#model);
    this.#view = view;
    this.#view.bindAddTransaction(this.handleAddTransaction);
  }

  //Initialize the view with any existing transactions
  #initializeView() {}

  //Connect Form submit events and Transaction renders to data in model
  handleAddTransaction(transactionFormFields) {
    const transactionObject = this.#model.addTransaction(transactionFormFields); 
  }

  //Ensure that transaction is deleted from model and view
  #handleDeleteTransaction(id) {}

  //Ensure balance, expense total and income total are updated in the view
  #updateTotals(transactions) {}
}

export { TransactionController };
