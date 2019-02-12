const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './db/sample.db',
  autoLoad: true,
});

class Customer extends Store.BaseModel {
  static definition(){
    this.attribute('CustomerId', 'integer', { primary: true });
    this.attribute('FirstName', 'string');
    this.attribute('LastName', 'string');
    this.validatesPresenceOf('FirstName', 'LastName');
    this.hasMany('invoices', {model: 'Invoice', from: 'CustomerId', to: 'CustomerId'});
  }

  getFullName(){
    return this.FirstName + ' ' + this.LastName;
  }
}

class Invoice extends Store.BaseModel {
  static definition(){
    this.attribute('InvoiceId', 'integer', { primary: true });
    this.attribute('CustomerId', 'integer');
    this.belongsTo('customer', {model: 'Customer', from: 'CustomerId', to: 'CustomerId'});
  }
}

store.Model(Customer);
store.Model(Invoice);

async function openDB() {
  await store.connect();
  await store.ready();
  console.log('connected');
}

async function operateDB() {
  const customer = await Customer.find(1).include('invoices');
  const invoices = await customer.invoices;
  invoices.forEach(i => console.log(i.InvoiceId));
}

async function closeDB() {
  await store.close();
  console.log('closed');
}

async function main() {
  await openDB();
  await operateDB();
  await closeDB();
}

main();

