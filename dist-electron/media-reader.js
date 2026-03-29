import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const require$1 = createRequire(import.meta.url);
const nativePath = path.resolve(__dirname$1, "../node_modules/node-nowplaying-win32-x64-msvc/n-nowplaying.win32-x64-msvc.node");
let NowPlayingModule;
try {
  try {
    const npPkg = require$1("node-nowplaying");
    NowPlayingModule = npPkg.NowPlaying;
  } catch (e) {
    const nativeBinding = require$1(nativePath);
    NowPlayingModule = nativeBinding.NowPlaying || nativeBinding;
  }
  if (!NowPlayingModule) {
    throw new Error("Could not find NowPlaying module");
  }
  const np = new NowPlayingModule((msg) => {
    if (process.send) {
      process.send({
        type: "MEDIA_UPDATE",
        data: {
          title: msg.trackName || "Sin Reproducción",
          artist: msg.artist || [],
          album: msg.album || "",
          isPlaying: msg.isPlaying || false,
          thumbnail: msg.thumbnail || "",
          id: msg.id || "system",
          progress: 0
        }
      });
    }
  });
  np.subscribe().catch((err) => {
  });
  process.on("message", async (cmd) => {
    try {
      if (cmd === "playPause") await np.playPause();
      if (cmd === "next") await np.nextTrack();
      if (cmd === "prev") await np.previousTrack();
    } catch (e) {
    }
  });
} catch (e) {
}
setInterval(() => {
}, 1e3);
