## Install

```bash
$ npm install --save openrecord
```

Since our demo database is sqlite, you also need install sqlite3.

```bash
$ npm i openrecord sqlite3
```

## Database

Demo database is copied from http://www.sqlitetutorial.net/sqlite-sample-database/ .

Get its schema image (PDF)[here](http://www.sqlitetutorial.net/wp-content/uploads/2018/03/sqlite-sample-database-diagram-color.pdf).

![](./db/schema.jpg)

## Demo01: Connect database

First, you set up the OpenRecord to tell it which type of DB you want to connect.

```javascript
const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './db/sample.db',
  autoLoad: true,
});
```

Second, open connection, do some operations and close it.

```javascript
async function openDB() {
  await store.connect();
  await store.ready();
  console.log('connected');
}

async function operateDB() {
  // ...
  console.log('executed');
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
```

Run the script.

```bash
$ node demos/demo01.js
connected
executed
closed
```

## Demo02: Create models

Now you should tell OpenRecord your model.

We create a model of Customer.

```javascript
class Customer extends Store.BaseModel {
}

store.Model(Customer);
```

Then write a query.

```javascript
async function operateDB() {
  const customer = await Customer.find(1);
  console.log(customer.FirstName, customer.LastName);
}
```

Run the script.

```bash
$ node demos/demo02.js
connected
Luís Gonçalves
closed
```

## Demo03: define models

You could define your model, e.g. specify given field's value to be not null and create new instance method.

```javascript
class Customer extends Store.BaseModel {
  static definition(){
    this.validatesPresenceOf('FirstName', 'LastName');
  }

  getFullName(){
    return this.FirstName + ' ' + this.LastName;
  }
}

// ...

async function operateDB() {
  const customer = await Customer.find(1);
  console.log(customer.getFullName());
}
```

Run the script.

```bash
$ node demos/demo03.js
connected
Luís Gonçalves
closed
```

## Demo04: get a single record

You could use `find(id)` or `get(id)` to get a single record. If OpenRecord cann't find data for the given id, `find(id)` will return `null`，and `get(id)` will throw an Error.

```javascript
// demo02
const customer = await Customer.find(1);
```

To get a single record by non primary key use `where()` together with `first()`.

```javascript
// demo04
async function operateDB() {
  const customer = await Customer.where({Company: 'Apple Inc.'}).first();
  console.log(customer.getFullName());
}
```

Run the script.

```bash
$ node demos/demo04.js
connected
Tim Goyer
closed
```

## Demo05: get multiple records

`find()` and `get()` methods also accept an array of ids, which could return an array of records.

```javascript
async function operateDB() {
  const customers = await Customer.find([1, 2, 3]);
  customers.forEach(c => console.log(c.getFullName()));
}
```

Run the script.

```bash
$ node demos/demo05.js
connected
Luís Gonçalves
Leonie Köhler
François Tremblay
closed
```

## Demo06: `limit()` and `offset()`

If you want to get all records, you simply do the following.

```javascript
const customers = await Customer;
```

But in most cases you want to limit your result.

- `limit(limit[, offset])`: limit your result from offset.
- `offset(offset)`: return all records from offset.

For example, you want to limit the result to 5 records from 10th record.

```javascript
async function operateDB() {
  const customers = await Customer.limit(5, 10);
  customers.forEach(c => console.log(c.getFullName()));
}
```

Run the script.

```bash
$ node demos/demo06.js
connected
Alexandre Rocha
Roberto Almeida
Fernanda Ramos
Mark Philips
Jennifer Peterson
closed
```

## Demo07: conditions

If you want to filter the records, use `where()` method.

```javascript
User.where({login: ['phil', 'michl']}) // login IN ('phil', 'michl')
User.where({login: null}) // login IS NULL
User.where({active: true}) // active IS true
User.where({login_not: null}) // login IS NOT NULL
User.where({login_like: 'phi'}) // login LIKE '%phi%'
User.where({login_not_like: 'phi'}) // login NOT LIKE '%phi%'
User.where({login_like: ['phi', 'mic']}) // (login LIKE '%phi%' OR login LIKE '%mic%')
User.where({failed_logins_gt: 0}) // failed_logins > 0
User.where({failed_logins_gte: 0}) // failed_logins >= 0
User.where({failed_logins_lt: 10}) // failed_logins < 10
User.where({failed_logins_lte: 10}) // failed_logins <= 10
User.where({failed_logins_between: [5, 8]}) // failed_logins between 5 and 8
```

For example, you want to filter the users whose email use `gmail.com`.

```javascript
async function operateDB() {
  const customers = await Customer.where({Email_like: 'gmail.com'});
  customers.forEach(c => console.log(c.getFullName()));
}
```

Run the script.

```bash
$ node demos/demo07.js
connected
François Tremblay
Helena Holý
Heather Leacock
Frank Ralston
Julia Barnett
Martha Silk
Dominique Lefebvre
Phil Hughes
closed
```
