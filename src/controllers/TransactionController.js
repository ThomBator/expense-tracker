class TransactionController {
  model;
  view;
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.bindAddTransaction(this.handleAddTransaction.bind(this));
    this.model.bindTransactionsChange(this.renderView.bind(this));
  }

  //Initialize and refresh the view when transactions change
  renderView() {
    const transactions = this.model.getTransactions(); 
    transactions.forEach((transaction)=> {
      this.view.renderTransaction(transaction); 
    })
  }

  //Connect Form submit events and Transaction renders to data in model
  handleAddTransaction(transactionFormFields) {
    console.log("handling", this);
    this.model.addTransaction(transactionFormFields);
  }

  //Ensure that transaction is deleted from model and view
  handleDeleteTransaction(id) {}

  //Ensure balance, expense total and income total are updated in the view
  updateTotals(transactions) {}
}

export { TransactionController };
