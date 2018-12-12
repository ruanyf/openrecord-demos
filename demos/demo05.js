const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Artist extends Store.BaseModel{
}
store.Model(Artist);

store.ready(async () => {
  const artist = await Artist.find(1)
  console.log(artist.Name)
}).then(() => {
  console.log('执行完成');
  process.exit(0);
});
