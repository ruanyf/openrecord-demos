const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './sample.db',
  autoLoad: true,
})

store.ready(async () => {
  const employee = await store.Model('Employee').find(1)
  console.log(employee.FirstName);
}).then(() => {
  console.log('执行完成');
  process.exit(0);
});
