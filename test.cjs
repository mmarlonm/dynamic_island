const { NowPlaying } = require('node-nowplaying');

try {
  const np = new NowPlaying((msg) => {
    console.log('MEDIA_UPDATE:', JSON.stringify({
      title: msg.trackName,
      artist: msg.artist,
      album: msg.album,
      isPlaying: msg.isPlaying
    }));
  });
  
  np.subscribe().then(() => {
    console.log('READY');
  }).catch(err => {
    console.error('SUBSCRIBE_ERROR', err);
  });
  
} catch(e) {
  console.error('INIT_ERROR', e);
}

setTimeout(() => {
  console.log('DONE');
  process.exit(0);
}, 4000);
