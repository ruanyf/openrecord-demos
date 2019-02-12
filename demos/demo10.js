const Store = require('openrecord/store/sqlite3');

const store = new Store({
  type: 'sqlite3',
  file: './db/sample.db',
  autoLoad: true,
});

class Track extends Store.BaseModel{
  static definition() {
    this.attribute('TrackId', 'integer', { primary: true })
    this.hasMany('track_playlists', { model: 'PlaylistTrack', from: 'TrackId', to: 'TrackId'});
    this.hasMany('playlists', { model: 'Playlist', through: 'track_playlists' });
  }
}

class Playlist extends Store.BaseModel{
  static definition(){
    this.attribute('PlaylistId', 'integer', { primary: true })
    this.hasMany('playlist_tracks', { model: 'PlaylistTrack', from: 'PlaylistId', to: 'PlaylistId' });
    this.hasMany('tracks', { model : 'Track', through: 'playlist_tracks' });
  }
}

class PlaylistTrack extends Store.BaseModel{
  static definition(){
    this.tableName = 'playlist_track';
    this.attribute('PlaylistId', 'integer');
    this.attribute('TrackId', 'integer');
    this.belongsTo('playlists', { model: 'Playlist', from: 'PlaylistId', to: 'PlaylistId'});
    this.belongsTo('tracks', { model: 'Track', from: 'TrackId', to: 'TrackId'});
  }
}

store.Model(Track);
store.Model(Playlist);
store.Model(PlaylistTrack);

async function openDB() {
  await store.connect();
  await store.ready();
  console.log('connected');
}

async function operateDB() {
  const track = await Track.find(1).include('playlists');
  const playlists = await track.playlists;
  playlists.forEach(l => console.log(l.PlaylistId));
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

