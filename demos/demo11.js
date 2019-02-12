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

    this.setter('mobile', function (num) {
      this.mobileNum = '#00#' + num;
    });

    this.getter('mobile', function () {
      return this.mobileNum;
    });
  }

  getFullName(){
    return this.FirstName + ' ' + this.LastName;
  }
}

store.Model(Customer);

async function openDB() {
  await store.connect();
  await store.ready();
  console.log('connected');
}

async function operateDB() {
  const customer = await Customer.find(1);
  customer.mobile = 1234567;
  console.log(customer.mobile);
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

