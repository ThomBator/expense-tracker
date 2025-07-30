class Controller {
  model;
  view;
  constructor(model, view) {
    this.model = model;
    this.view = view;
    //Bind event listeners from view for use in controller
    this.view.bindAddTransaction(this.handleAddTransaction.bind(this));
    this.view.bindDeleteTransaction(this.handleDeleteTransaction.bind(this));

    //Render existing transactions data when app loads
    this.renderView(this.model.getTransactions());
  }

  //Initialize and refresh the view when transactions change
  renderView() {
    //Clearing existing transaction elements in view on each render as an easy way to prevent duplicates. In a true production app this would be inefficient of course.
    this.view.clearTransactions();
    const transactions = this.model.getTransactions();
    transactions.forEach((transaction) => {
      this.view.renderTransaction(transaction);
    });
    const balance = this.model.getBalance();
    this.view.setBalance(balance);
    const totals = this.model.getCategoryTotals();
    this.view.setCategoryTotals(totals);
  }

  //Connect Form submit events and Transaction renders to data in model
  handleAddTransaction(transactionFormFields) {
    console.log("handling", this);
    const transactions = this.model.addTransaction(transactionFormFields);
    this.renderView(transactions);
  }

  //Ensure that transaction is deleted from model and view
  handleDeleteTransaction(id) {
    this.model.deleteTransaction(id);
    this.renderView();
  }
}

export { Controller };
