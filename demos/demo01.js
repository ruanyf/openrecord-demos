const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './db/sample.db',
  autoLoad: true,
});

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

