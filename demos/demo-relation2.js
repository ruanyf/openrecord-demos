const Store = require('openrecord/store/sqlite3')

const store = new Store({
  file: './sample.db'
})

class Track extends Store.BaseModel{
  static definition() {
    this.attribute('TrackId', 'integer', { primary: true })
    this.attribute('Name', 'string');
    this.attribute('Composer', 'string');
    this.attribute('Milliseconds', 'integer');
    this.attribute('Bytes', 'integer');
    this.attribute('UnitPrice', 'float');
    this.hasMany('track_playlists', { model: 'PlaylistTrack', from: 'TrackId', to: 'TrackId'});
    this.hasMany('playlists', { model: 'Playlist', through: 'track_playlists' });
  }
}

class Playlist extends Store.BaseModel{
  static definition(){
    this.attribute('PlaylistId', 'integer', { primary: true })
    this.attribute('Name', 'string');
    this.hasMany('playlist_tracks', { model: 'PlaylistTrack', from: 'PlaylistId', to: 'PlaylistId' });
    this.hasMany('tracks', { model : 'Track', through: 'playlist_tracks' });
  }
}

class PlaylistTrack extends Store.BaseModel{
  static definition(){
    this.tableName = 'playlist_track';
    this.attribute('PlaylistId', 'integer');
    this.attribute('TrackId', 'integer');
    this.belongsTo('playlists', { model: 'Playlist', from: 'PlaylistId' });
    this.belongsTo('tracks', { model: 'Track', from: 'TrackId' });
  }
}

store.Model(Track);
store.Model(Playlist);
store.Model(PlaylistTrack);

store.ready(async () => {
  const track = await Track.find(1)
  await track.include('playlists');
  console.log((await track.playlists))
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
