const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './sample.db',
  autoLoad: true,
})

store.ready(async () => {
  console.log('连接完成');
  // const customer = await store.Model('album').find(1)
  // console.log(customer);
}).then(() => {
  console.log('执行完成');
  process.exit(0);
});
