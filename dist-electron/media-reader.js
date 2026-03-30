import { createRequire as s } from "module";
import t from "path";
import { fileURLToPath as c } from "url";
const l = t.dirname(c(import.meta.url)), i = s(import.meta.url), p = t.resolve(l, "../node_modules/node-nowplaying-win32-x64-msvc/n-nowplaying.win32-x64-msvc.node"), d = process.argv[2] || "", y = t.join(d, "app.asar.unpacked", "node_modules", "node-nowplaying-win32-x64-msvc", "n-nowplaying.win32-x64-msvc.node");
let a;
try {
  try {
    a = i("node-nowplaying").NowPlaying;
  } catch {
    try {
      const o = i(p);
      a = o.NowPlaying || o;
    } catch {
      const r = i(y);
      a = r.NowPlaying || r;
    }
  }
  if (!a)
    throw new Error("Could not find NowPlaying module");
  const e = new a((n) => {
    process.send && process.send({
      type: "MEDIA_UPDATE",
      data: {
        title: n.trackName || "Sin Reproducción",
        artist: n.artist || [],
        album: n.album || "",
        isPlaying: n.isPlaying || !1,
        thumbnail: n.thumbnail || "",
        id: n.id || "system",
        progress: 0
      }
    });
  });
  e.subscribe().catch((n) => {
  }), process.on("message", async (n) => {
    try {
      n === "playPause" && await e.playPause(), n === "next" && await e.nextTrack(), n === "prev" && await e.previousTrack();
    } catch {
    }
  });
} catch {
}
setInterval(() => {
}, 1e3);
