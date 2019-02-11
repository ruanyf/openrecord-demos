const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Album extends Store.BaseModel{
  static definition() {
    this.attribute('AlbumId', 'integer', { primary: true })
    this.attribute('Title', 'string');
    this.attribute('ArtistId', 'integer');
    this.belongsTo('artist', { model: 'Artist', from: 'ArtistId' })
  }
}

class Artist extends Store.BaseModel{
  static definition(){
    this.attribute('ArtistId', 'integer', { primary: true })
    this.attribute('Name', 'string');
    this.hasMany('albums', { model: 'Album', to: 'ArtistId' })
  }
}

store.Model(Album);
store.Model(Artist);

store.ready(async () => {
  const artist = await Artist.find(1).include('albums');
  // await artist.include('albums');
  console.log(artist.albums[0].Title)
  // console.log((await artist.albums)[0].Title)
  // const album = await Album.find(1);
  // const result = await album.include('artist');
  // console.log(result);
}).then((res) => {
  console.log('执行完成');
  // console.log(res);
  process.exit(0);
}).catch(e => {
  console.log('发生错误', e)
  process.exit(1);
});
