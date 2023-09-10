import ColaGenerator from "./js/colaGenerator.js";
import VendingMachineFunc from "./js/vendingMachineFunc.js";

const coloaGenerator = new ColaGenerator();
await coloaGenerator.setup();

const vendingMachine = new VendingMachineFunc();
vendingMachine.setup();
