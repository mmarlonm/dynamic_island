import { createRequire as t } from "module";
import i from "path";
import { fileURLToPath as s } from "url";
const l = i.dirname(s(import.meta.url)), r = t(import.meta.url), c = i.resolve(l, "../node_modules/node-nowplaying-win32-x64-msvc/n-nowplaying.win32-x64-msvc.node");
console.log("[CHILD] Media reader process starting...");
let o;
try {
  try {
    o = r("node-nowplaying").NowPlaying;
  } catch {
    const a = r(c);
    o = a.NowPlaying || a;
  }
  if (!o)
    throw new Error("Could not find NowPlaying module");
  const n = new o((e) => {
    process.send && process.send({
      type: "MEDIA_UPDATE",
      data: {
        title: e.trackName || "Sin Reproducción",
        artist: e.artist || [],
        album: e.album || "",
        isPlaying: e.isPlaying || !1,
        thumbnail: e.thumbnail || "",
        id: e.id || "system",
        progress: 0
      }
    });
  });
  n.subscribe().catch((e) => {
    console.warn("[CHILD] SUBSCRIBE_ERROR", e);
  }), process.on("message", async (e) => {
    try {
      e === "playPause" && await n.playPause(), e === "next" && await n.nextTrack(), e === "prev" && await n.previousTrack();
    } catch (a) {
      console.error("[CHILD] Media Command Error:", a);
    }
  });
} catch (n) {
  console.error("[CHILD] FATAL_MEDIA_ERROR:", n);
}
setInterval(() => {
}, 1e3);
