import { Controller } from "./src/controllers/Controller.js";
import { Transactions } from "./src/models/Transactions.js";
import { ExpenseTrackerView } from "./src/views/ExpenseTrackerView.js";

const app = new Controller(
  new Transactions(),
  new ExpenseTrackerView()
);
