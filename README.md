This repo is an ORM tutorial for nodejs. It uses [OpenRecord](https://github.com/PhilWaldmann/openrecord) as a lightweight ORM library which is like ActiveRecord for Ruby.

## How to use

First, clone the repo

```bash
$ git clone https://github.com/ruanyf/openrecord-demos.git 
```

Then install the dependencies.

```bash
$ cd openrecord-demos
$ npm install
```

## Database

Our demo sqlite database is copied from http://www.sqlitetutorial.net/sqlite-sample-database/ .

![](./db/schema.jpg)

Get its schema image (PDF)[here](http://www.sqlitetutorial.net/wp-content/uploads/2018/03/sqlite-sample-database-diagram-color.pdf).

## Index

- [Demo01: connect database](#demo01-connect-database)
- [Demo02: create models](#demo02-create-models)
- [Demo03: define models](#demo03-define-models)
- [Demo04: get a single record](#demo04-get-a-single-record)
- [Demo05: get multiple records](#demo05-get-multiple-records)
- [Demo06: `limit()` and `offset()`](#demo06-limit-and-offset)
- [Demo07: conditions](#demo07-conditions)
- [Demo08: one-to-many relation](#demo08-one-to-many-relation)
- [Demo09: many-to-one relation](#demo09-many-to-one-relation)
- [Demo10：many-to-many relation](#demo10-many-to-many-relation)
- [Demo11: setter and getter](#demo11-setter-and-getter)
- [Demo12: create a record](#demo12-create-a-record)
- [Demo13: update a record](#demo13-update-a-record)
- [Demo14: remove a record](#demo14-remove-a-record)

## Demo01: connect database

First, setup OpenRecord. Tell it which DB to connect.

```javascript
const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './db/sample.db',
  autoLoad: true,
});
```

Second, open the database, do some operations and close it.

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

## Demo02: create models

Create a model (M in MVC) which corresponds to a table in database.

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

Give some details about your model, e.g. specify given field's value to be not null, specify field types and create new instance method.

```javascript
class Customer extends Store.BaseModel {
  static definition(){
    this.attribute('CustomerId', 'integer', { primary: true });
    this.attribute('FirstName', 'string');
    this.attribute('LastName', 'string');
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

Use `find(id)` or `get(id)` method to get a single record. If OpenRecord cann't find data for the given id, `find(id)` will return `null`，and `get(id)` will throw an Error.

```javascript
// demo02
const customer = await Customer.find(1);
```

Get a single record by non primary key use `where()` together with `first()`.

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

If you want to get all records, simply do the following.

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

To filter the records, use `where()` method.

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

For example, filter the users whose email uses `gmail.com`.

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

## Demo08: one-to-many relation

To join tables in database, you should tell OpenRecord the relations between tables.

There are three kinds of relation.

- one-to-one
- one-to-many
- many-to-many

Relations should be described in Model. For example, the relation between customer and invoice is one-to-many: one customer has many invoices.

```javascript
class Customer extends Store.BaseModel {
  static definition(){
    this.hasMany('invoices', {model: 'Invoice', from: 'CustomerId', to: 'CustomerId'});
  }
}

class Invoice extends Store.BaseModel {
  static definition(){
    this.belongsTo('customer', {model: 'Customer', from: 'CustomerId', to: 'CustomerId'});
  }
}

store.Model(Customer);
store.Model(Invoice);
```

As you see, `.hasMany(name, options)` method in `Customer` model means a customer has many invoice, and `.belongsTo(name, options)` method in `Invoice` model means the `CustomerId` field in `Invoice` corresponds to `CustomerID` field in `Customer`.

By the way, in case of one-to-one relation, you should use `.hasOne(name, options)` method instead of `.hasMany()`, and `.belongsTo()` method keeps unchanged.

The following is copied from OpenRecord's document.

> The `name` of the relation is a string and could be anything you like.
>
> The options parameter is optional, if it can autodetect your target model. Otherwise you need to privide an object with the following config options:
>
> - model: The target model name as a string
> - from: The name of the field of the current model
> - to: The name of the field of the target model

Now, query the record.

```javascript
// demo08.js
const invoice = await Invoice.find(1).include('customer');
const customer = await invoice.customer;
console.log(customer.getFullName());
```

Run the script.

```bash
$ node demos/demo08.js
connected
Leonie Köhler
closed
```

## Demo09: many-to-one relation

Many-to-one relation is the opposite of one-to-many relation. You don't have to change the model, and editing the query is enough.

```javascript
// demo09.js
const customer = await Customer.find(1).include('invoices');
const invoices = await customer.invoices;
invoices.forEach(i => console.log(i.InvoiceId));
```

Run the script.

```bash
$ node demos/demo09.js
connected
98
121
143
195
316
327
382
closed
```

## Demo10: many-to-many relation

The relation between `Track` and `Playlist` is many-to-many: a track belongs to many playlists and a playlist has many tracks.

So they needs an intermediate table `PlaylistTrack`: the relation between `Track` and `PlaylistTrack` is one-to-many, same as the relation between `Playlist` and `PlaylistTrack`.

We describe the relation in Model.

```javascript
class Track extends Store.BaseModel{
  static definition() {
    this.hasMany('track_playlists', { model: 'PlaylistTrack', from: 'TrackId', to: 'TrackId'});
    this.hasMany('playlists', { model: 'Playlist', through: 'track_playlists' });
  }
}

class Playlist extends Store.BaseModel{
  static definition(){
    this.hasMany('playlist_tracks', { model: 'PlaylistTrack', from: 'PlaylistId', to: 'PlaylistId' });
    this.hasMany('tracks', { model : 'Track', through: 'playlist_tracks' });
  }
}

class PlaylistTrack extends Store.BaseModel{
  static definition(){
    this.tableName = 'playlist_track';
    this.belongsTo('playlists', { model: 'Playlist', from: 'PlaylistId', to: 'PlaylistId'});
    this.belongsTo('tracks', { model: 'Track', from: 'TrackId', to: 'TrackId'});
  }
}

store.Model(Track);
store.Model(Playlist);
store.Model(PlaylistTrack);
```

Now, query the track.

```javascript
// demo10.js
const track = await Track.find(1).include('playlists');
const playlists = await track.playlists;
playlists.forEach(l => console.log(l.PlaylistId));
```

Run the script.

```bash
$ node demos/demo10.js
connected
1
8
17
closed
```

## Demo11: setter and getter

Instead of defining an attribute, you could also define a setter or a getter.

```javascript
// demo11
this.setter('mobile', function (num) {
  this.mobileNum = '#00#' + num;
});

this.getter('mobile', function () {
  return this.mobileNum;
});
```

Run the script.

```bash
$ node demos/demo11.js
connected
#00#1234567
closed
```

## Demo12: create a record

To create a new record you could use `create()` method.

```javascript
// demo12
const customer = await Customer.create({
  Email: 'president@whitehouse.gov',
  FirstName: 'Donald',
  LastName: 'Trump',
  Address: 'Whitehouse, Washington'
});
console.log(customer.CustomerId);
```

Run the script.

```bash
$ node demos/demo12.js
connected
60
closed
```

## Demo13: update a record

`update()` method set the record and also save it.

```javascript
// demo13
const customer = await Customer.find(60);
await customer.update({
  Address: 'Whitehouse'
});
console.log(customer.Address);
```

Run the script.

```bash
$ node demos/demo13.js
connected
Whitehouse
closed
```

## Demo14: remove a record

`destroy()` method is used to remove a record from your datastore.

```javascript
// demo14
const customer = await Customer.find(60);
await customer.destroy();
console.log('destroyed');
```

Run the script.

```bash
$ node demos/demo14.js
connected
destroyed
closed
```

