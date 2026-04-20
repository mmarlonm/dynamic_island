import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const require$1 = createRequire(import.meta.url);
const devPath = path.resolve(__dirname$1, "../node_modules/node-nowplaying-win32-x64-msvc/n-nowplaying.win32-x64-msvc.node");
const resourcesPath = process.argv[2] || "";
const prodPath = path.join(resourcesPath, "app.asar.unpacked", "node_modules", "node-nowplaying-win32-x64-msvc", "n-nowplaying.win32-x64-msvc.node");
let NowPlayingModule;
try {
  try {
    const npPkg = require$1("node-nowplaying");
    NowPlayingModule = npPkg.NowPlaying;
  } catch (e) {
    try {
      const binding = require$1(devPath);
      NowPlayingModule = binding.NowPlaying || binding;
    } catch (e2) {
      const binding = require$1(prodPath);
      NowPlayingModule = binding.NowPlaying || binding;
    }
  }
  if (!NowPlayingModule) {
    throw new Error("Could not find NowPlaying module");
  }
  const np = new NowPlayingModule((msg) => {
    if (process.send && process.connected) {
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
  }, {
    logLevelDirective: "error"
  });
  np.subscribe().catch((err) => {
  });
  const exec = require$1("child_process").exec;
  const sendMediaKey = (key) => {
    const code = key === "next" ? 176 : key === "prev" ? 177 : 179;
    exec(`powershell -Command "$s=New-Object -ComObject Shell.Application;$s.SendKeys([char]${code})"`);
  };
  if (np && typeof np === "object") {
    console.log("[MEDIA_READER] Native methods discovered:", Object.keys(np).filter((k) => typeof np[k] === "function"));
  }
  process.on("message", async (cmd) => {
    try {
      if (!np) {
        sendMediaKey(cmd);
        return;
      }
      let success = false;
      if (cmd === "playPause") {
        try {
          if (typeof np.playPause === "function") {
            await np.playPause();
            success = true;
          } else if (typeof np.togglePause === "function") {
            await np.togglePause();
            success = true;
          }
        } catch (e) {
        }
      } else if (cmd === "next") {
        try {
          if (typeof np.nextTrack === "function") {
            await np.nextTrack();
            success = true;
          } else if (typeof np.skipNext === "function") {
            await np.skipNext();
            success = true;
          } else if (typeof np.next === "function") {
            await np.next();
            success = true;
          }
        } catch (e) {
        }
      } else if (cmd === "prev") {
        try {
          if (typeof np.previousTrack === "function") {
            await np.previousTrack();
            success = true;
          } else if (typeof np.skipPrevious === "function") {
            await np.skipPrevious();
            success = true;
          } else if (typeof np.previous === "function") {
            await np.previous();
            success = true;
          }
        } catch (e) {
        }
      }
      if (!success) {
        sendMediaKey(cmd);
      }
    } catch (e) {
      sendMediaKey(cmd);
    }
  });
} catch (e) {
}
setInterval(() => {
}, 1e3);
