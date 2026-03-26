import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Path to the native binding: resolved dynamically relative to the script
const nativePath = path.resolve(__dirname, '../node_modules/node-nowplaying-win32-x64-msvc/n-nowplaying.win32-x64-msvc.node');

console.log('[CHILD] Media reader process starting...');
// console.log(`[CHILD] Attempting absolute resolution for: ${nativePath}`);

let NowPlayingModule;
try {
  try {
    const npPkg = require('node-nowplaying');
    NowPlayingModule = npPkg.NowPlaying;
  } catch (e) {
    // console.log('[CHILD] Standard resolution failed, seeking absolute native binding...');
    const nativeBinding = require(nativePath);
    NowPlayingModule = nativeBinding.NowPlaying || nativeBinding;
  }

  if (!NowPlayingModule) {
    throw new Error('Could not find NowPlaying module');
  }

  const np = new NowPlayingModule((msg) => {
    if (process.send) {
      process.send({
        type: 'MEDIA_UPDATE',
        data: {
          title: msg.trackName || 'Sin Reproducción',
          artist: msg.artist || [],
          album: msg.album || '',
          isPlaying: msg.isPlaying || false,
          thumbnail: msg.thumbnail || '',
          id: msg.id || 'system',
          progress: 0
        }
      });
    }
  });

  np.subscribe().catch(err => {
    console.warn('[CHILD] SUBSCRIBE_ERROR', err);
  });

  process.on('message', async (cmd) => {
    try {
      // console.log('[CHILD] Received command:', cmd);
      if (cmd === 'playPause') await np.playPause();
      if (cmd === 'next') await np.nextTrack();
      if (cmd === 'prev') await np.previousTrack();
    } catch (e) {
      console.error('[CHILD] Media Command Error:', e);
    }
  });

} catch (e) {
  console.error('[CHILD] FATAL_MEDIA_ERROR:', e);
}

// Global Keep-alive
setInterval(() => { }, 1000);
