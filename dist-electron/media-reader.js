import { createRequire as l } from "module";
import r from "path";
import { fileURLToPath as p } from "url";
const u = r.dirname(p(import.meta.url)), a = l(import.meta.url), f = r.resolve(u, "../node_modules/node-nowplaying-win32-x64-msvc/n-nowplaying.win32-x64-msvc.node"), y = process.argv[2] || "", d = r.join(y, "app.asar.unpacked", "node_modules", "node-nowplaying-win32-x64-msvc", "n-nowplaying.win32-x64-msvc.node");
let i;
try {
  try {
    i = a("node-nowplaying").NowPlaying;
  } catch {
    try {
      const o = a(f);
      i = o.NowPlaying || o;
    } catch {
      const n = a(d);
      i = n.NowPlaying || n;
    }
  }
  if (!i)
    throw new Error("Could not find NowPlaying module");
  const e = new i((t) => {
    process.send && process.connected && process.send({
      type: "MEDIA_UPDATE",
      data: {
        title: t.trackName || "Sin Reproducción",
        artist: t.artist || [],
        album: t.album || "",
        isPlaying: t.isPlaying || !1,
        thumbnail: t.thumbnail || "",
        id: t.id || "system",
        progress: 0
      }
    });
  }, {
    logLevelDirective: "error"
  });
  e.subscribe().catch((t) => {
  });
  const c = a("child_process").exec, s = (t) => {
    c(`powershell -Command "$s=New-Object -ComObject Shell.Application;$s.SendKeys([char]${t === "next" ? 176 : t === "prev" ? 177 : 179})"`);
  };
  e && typeof e == "object" && console.log("[MEDIA_READER] Native methods discovered:", Object.keys(e).filter((t) => typeof e[t] == "function")), process.on("message", async (t) => {
    try {
      if (!e) {
        s(t);
        return;
      }
      let o = !1;
      if (t === "playPause")
        try {
          typeof e.playPause == "function" ? (await e.playPause(), o = !0) : typeof e.togglePause == "function" && (await e.togglePause(), o = !0);
        } catch {
        }
      else if (t === "next")
        try {
          typeof e.nextTrack == "function" ? (await e.nextTrack(), o = !0) : typeof e.skipNext == "function" ? (await e.skipNext(), o = !0) : typeof e.next == "function" && (await e.next(), o = !0);
        } catch {
        }
      else if (t === "prev")
        try {
          typeof e.previousTrack == "function" ? (await e.previousTrack(), o = !0) : typeof e.skipPrevious == "function" ? (await e.skipPrevious(), o = !0) : typeof e.previous == "function" && (await e.previous(), o = !0);
        } catch {
        }
      o || s(t);
    } catch {
      s(t);
    }
  });
} catch {
}
setInterval(() => {
}, 1e3);
