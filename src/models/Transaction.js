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

export { Transaction };
