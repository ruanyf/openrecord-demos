const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './sample.db',
  autoLoad: true,
})

store.ready(async () => {
  const artist = await store.Model('Artist').find(281);
  await artist.destroy();
}).then(() => {
  console.log('执行完成');
  process.exit(0);
});
