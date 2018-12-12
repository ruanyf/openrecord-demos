const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Album extends Store.BaseModel{
  static definition() {
    this.attribute('AlbumId', 'integer', { primary: true })
    this.attribute('Title', 'string');
    this.attribute('ArtistId', 'integer');
    this.belongsTo('artist', { model: 'artist', from: 'ArtistId' })
  }
}

class Artist extends Store.BaseModel{
  static definition(){
    this.attribute('ArtistId', 'integer', { primary: true })
    this.attribute('Name', 'string');
    this.hasOne('album', { model: 'Album', to: 'ArtistId' })
  }
}

store.Model(Album);
store.Model(Artist);

store.ready(async () => {
  const artist = await Artist.find(1)
  await artist.include('album');
  console.log((await artist.album).Title)
  // const album = await Album.where({ AlbumId: 1 }).find(1);
  // await album.include('artist');
  // console.log((await album.artist).Name);
}).then((res) => {
  console.log('执行完成');
  // console.log(res.artist.Name);
  process.exit(0);
}).catch(e => {
  console.log('发生错误', e)
  process.exit(1);
});
