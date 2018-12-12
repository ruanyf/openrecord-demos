const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './sample.db',
  autoLoad: true,
})

store.ready(async () => {
  const artist = await store.Model('Artist').find(276);
  artist.Name = '杜甫';
  await artist.save();
  console.log(artist.ArtistId);
}).then(() => {
  console.log('执行完成');
  process.exit(0);
});
