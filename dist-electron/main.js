import zt, { ipcMain as J, app as Ue, desktopCapturer as Jl, screen as Qa, BrowserWindow as gd } from "electron";
import Oe from "node:path";
import { fileURLToPath as yd } from "node:url";
import pn from "node:fs";
import { spawn as Sn, exec as dt, fork as Ed } from "node:child_process";
import Wt from "node:os";
import wd from "node:https";
import It from "fs";
import vd from "constants";
import ur from "stream";
import Zo from "util";
import Ql from "assert";
import ae from "path";
import pi from "child_process";
import Zl from "events";
import fr from "crypto";
import ec from "tty";
import mi from "os";
import Rt from "url";
import tc from "zlib";
import _d from "http";
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, at = {}, Kt = {}, De = {};
De.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
De.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var yt = vd, Sd = process.cwd, Jr = null, Ad = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Jr || (Jr = Sd.call(process)), Jr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Za = process.chdir;
  process.chdir = function(e) {
    Jr = null, Za.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Za);
}
var Td = Cd;
function Cd(e) {
  yt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), Ad === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(h, m, E) {
      var y = Date.now(), S = 0;
      c(h, m, function C(T) {
        if (T && (T.code === "EACCES" || T.code === "EPERM" || T.code === "EBUSY") && Date.now() - y < 6e4) {
          setTimeout(function() {
            e.stat(m, function(D, k) {
              D && D.code === "ENOENT" ? c(h, m, C) : E(T);
            });
          }, S), S < 100 && (S += 10);
          return;
        }
        E && E(T);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(h, m, E, y, S, C) {
      var T;
      if (C && typeof C == "function") {
        var D = 0;
        T = function(k, G, X) {
          if (k && k.code === "EAGAIN" && D < 10)
            return D++, c.call(e, h, m, E, y, S, T);
          C.apply(this, arguments);
        };
      }
      return c.call(e, h, m, E, y, S, T);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, h, m, E, y) {
      for (var S = 0; ; )
        try {
          return c.call(e, f, h, m, E, y);
        } catch (C) {
          if (C.code === "EAGAIN" && S < 10) {
            S++;
            continue;
          }
          throw C;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, h, m) {
      c.open(
        f,
        yt.O_WRONLY | yt.O_SYMLINK,
        h,
        function(E, y) {
          if (E) {
            m && m(E);
            return;
          }
          c.fchmod(y, h, function(S) {
            c.close(y, function(C) {
              m && m(S || C);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, h) {
      var m = c.openSync(f, yt.O_WRONLY | yt.O_SYMLINK, h), E = !0, y;
      try {
        y = c.fchmodSync(m, h), E = !1;
      } finally {
        if (E)
          try {
            c.closeSync(m);
          } catch {
          }
        else
          c.closeSync(m);
      }
      return y;
    };
  }
  function n(c) {
    yt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, h, m, E) {
      c.open(f, yt.O_SYMLINK, function(y, S) {
        if (y) {
          E && E(y);
          return;
        }
        c.futimes(S, h, m, function(C) {
          c.close(S, function(T) {
            E && E(C || T);
          });
        });
      });
    }, c.lutimesSync = function(f, h, m) {
      var E = c.openSync(f, yt.O_SYMLINK), y, S = !0;
      try {
        y = c.futimesSync(E, h, m), S = !1;
      } finally {
        if (S)
          try {
            c.closeSync(E);
          } catch {
          }
        else
          c.closeSync(E);
      }
      return y;
    }) : c.futimes && (c.lutimes = function(f, h, m, E) {
      E && process.nextTick(E);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(f, h, m) {
      return c.call(e, f, h, function(E) {
        p(E) && (E = null), m && m.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, h) {
      try {
        return c.call(e, f, h);
      } catch (m) {
        if (!p(m)) throw m;
      }
    };
  }
  function o(c) {
    return c && function(f, h, m, E) {
      return c.call(e, f, h, m, function(y) {
        p(y) && (y = null), E && E.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, h, m) {
      try {
        return c.call(e, f, h, m);
      } catch (E) {
        if (!p(E)) throw E;
      }
    };
  }
  function s(c) {
    return c && function(f, h, m) {
      typeof h == "function" && (m = h, h = null);
      function E(y, S) {
        S && (S.uid < 0 && (S.uid += 4294967296), S.gid < 0 && (S.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return h ? c.call(e, f, h, E) : c.call(e, f, E);
    };
  }
  function l(c) {
    return c && function(f, h) {
      var m = h ? c.call(e, f, h) : c.call(e, f);
      return m && (m.uid < 0 && (m.uid += 4294967296), m.gid < 0 && (m.gid += 4294967296)), m;
    };
  }
  function p(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var es = ur.Stream, $d = bd;
function bd(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    es.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var p = a[s];
      this[p] = i[p];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, f) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    es.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var Id = Od, Rd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Od(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Rd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = It, Pd = Td, Nd = $d, Dd = Id, Dr = Zo, Ee, ni;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), ni = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", ni = "___graceful-fs.previous");
function Fd() {
}
function nc(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Vt = Fd;
Dr.debuglog ? Vt = Dr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Vt = function() {
  var e = Dr.format.apply(Dr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[Ee]) {
  var xd = Re[Ee] || [];
  nc(oe, xd), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || ts(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ni, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), ts();
    }
    return Object.defineProperty(t, ni, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Vt(oe[Ee]), Ql.equal(oe[Ee].length, 0);
  });
}
Re[Ee] || nc(Re, oe[Ee]);
var Fe = ea(Dd(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Fe = ea(oe), oe.__patched = !0);
function ea(e) {
  Pd(e), e.gracefulify = ea, e.createReadStream = G, e.createWriteStream = X;
  var t = e.readFile;
  e.readFile = n;
  function n(L, w, H) {
    return typeof w == "function" && (H = w, w = null), z(L, w, H);
    function z(ne, R, I, P) {
      return t(ne, R, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? nn([z, [ne, R, I], b, P || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(L, w, H, z) {
    return typeof H == "function" && (z = H, H = null), ne(L, w, H, z);
    function ne(R, I, P, b, N) {
      return r(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nn([ne, [R, I, P, b], O, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(L, w, H, z) {
    return typeof H == "function" && (z = H, H = null), ne(L, w, H, z);
    function ne(R, I, P, b, N) {
      return o(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nn([ne, [R, I, P, b], O, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(L, w, H, z) {
    return typeof H == "function" && (z = H, H = 0), ne(L, w, H, z);
    function ne(R, I, P, b, N) {
      return s(R, I, P, function(O) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nn([ne, [R, I, P, b], O, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var p = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(L, w, H) {
    typeof w == "function" && (H = w, w = null);
    var z = c.test(process.version) ? function(I, P, b, N) {
      return p(I, ne(
        I,
        P,
        b,
        N
      ));
    } : function(I, P, b, N) {
      return p(I, P, ne(
        I,
        P,
        b,
        N
      ));
    };
    return z(L, w, H);
    function ne(R, I, P, b) {
      return function(N, O) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? nn([
          z,
          [R, I, P],
          N,
          b || Date.now(),
          Date.now()
        ]) : (O && O.sort && O.sort(), typeof P == "function" && P.call(this, N, O));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = Nd(e);
    C = h.ReadStream, D = h.WriteStream;
  }
  var m = e.ReadStream;
  m && (C.prototype = Object.create(m.prototype), C.prototype.open = T);
  var E = e.WriteStream;
  E && (D.prototype = Object.create(E.prototype), D.prototype.open = k), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return C;
    },
    set: function(L) {
      C = L;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return D;
    },
    set: function(L) {
      D = L;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = C;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return y;
    },
    set: function(L) {
      y = L;
    },
    enumerable: !0,
    configurable: !0
  });
  var S = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return S;
    },
    set: function(L) {
      S = L;
    },
    enumerable: !0,
    configurable: !0
  });
  function C(L, w) {
    return this instanceof C ? (m.apply(this, arguments), this) : C.apply(Object.create(C.prototype), arguments);
  }
  function T() {
    var L = this;
    te(L.path, L.flags, L.mode, function(w, H) {
      w ? (L.autoClose && L.destroy(), L.emit("error", w)) : (L.fd = H, L.emit("open", H), L.read());
    });
  }
  function D(L, w) {
    return this instanceof D ? (E.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function k() {
    var L = this;
    te(L.path, L.flags, L.mode, function(w, H) {
      w ? (L.destroy(), L.emit("error", w)) : (L.fd = H, L.emit("open", H));
    });
  }
  function G(L, w) {
    return new e.ReadStream(L, w);
  }
  function X(L, w) {
    return new e.WriteStream(L, w);
  }
  var Z = e.open;
  e.open = te;
  function te(L, w, H, z) {
    return typeof H == "function" && (z = H, H = null), ne(L, w, H, z);
    function ne(R, I, P, b, N) {
      return Z(R, I, P, function(O, M) {
        O && (O.code === "EMFILE" || O.code === "ENFILE") ? nn([ne, [R, I, P, b], O, N || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function nn(e) {
  Vt("ENQUEUE", e[0].name, e[1]), oe[Ee].push(e), ta();
}
var Fr;
function ts() {
  for (var e = Date.now(), t = 0; t < oe[Ee].length; ++t)
    oe[Ee][t].length > 2 && (oe[Ee][t][3] = e, oe[Ee][t][4] = e);
  ta();
}
function ta() {
  if (clearTimeout(Fr), Fr = void 0, oe[Ee].length !== 0) {
    var e = oe[Ee].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Vt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Vt("TIMEOUT", t.name, n);
      var a = n.pop();
      typeof a == "function" && a.call(null, r);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), p = Math.min(l * 1.2, 100);
      s >= p ? (Vt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[Ee].push(e);
    }
    Fr === void 0 && (Fr = setTimeout(ta, 0));
  }
}
(function(e) {
  const t = De.fromCallback, n = Fe, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((a) => n.exists(i, a));
  }, e.read = function(i, o, a, s, l, p) {
    return typeof p == "function" ? n.read(i, o, a, s, l, p) : new Promise((c, f) => {
      n.read(i, o, a, s, l, (h, m, E) => {
        if (h) return f(h);
        c({ bytesRead: m, buffer: E });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.write(i, o, ...a) : new Promise((s, l) => {
      n.write(i, o, ...a, (p, c, f) => {
        if (p) return l(p);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.writev(i, o, ...a) : new Promise((s, l) => {
      n.writev(i, o, ...a, (p, c, f) => {
        if (p) return l(p);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Kt);
var na = {}, rc = {};
const Ld = ae;
rc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Ld.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const ic = Kt, { checkPath: oc } = rc, ac = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
na.makeDir = async (e, t) => (oc(e), ic.mkdir(e, {
  mode: ac(t),
  recursive: !0
}));
na.makeDirSync = (e, t) => (oc(e), ic.mkdirSync(e, {
  mode: ac(t),
  recursive: !0
}));
const Ud = De.fromPromise, { makeDir: kd, makeDirSync: Vi } = na, Yi = Ud(kd);
var st = {
  mkdirs: Yi,
  mkdirsSync: Vi,
  // alias
  mkdirp: Yi,
  mkdirpSync: Vi,
  ensureDir: Yi,
  ensureDirSync: Vi
};
const Md = De.fromPromise, sc = Kt;
function Bd(e) {
  return sc.access(e).then(() => !0).catch(() => !1);
}
var Jt = {
  pathExists: Md(Bd),
  pathExistsSync: sc.existsSync
};
const mn = Fe;
function jd(e, t, n, r) {
  mn.open(e, "r+", (i, o) => {
    if (i) return r(i);
    mn.futimes(o, t, n, (a) => {
      mn.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function Hd(e, t, n) {
  const r = mn.openSync(e, "r+");
  return mn.futimesSync(r, t, n), mn.closeSync(r);
}
var lc = {
  utimesMillis: jd,
  utimesMillisSync: Hd
};
const En = Kt, ge = ae, Gd = Zo;
function qd(e, t, n) {
  const r = n.dereference ? (i) => En.stat(i, { bigint: !0 }) : (i) => En.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Wd(e, t, n) {
  let r;
  const i = n.dereference ? (a) => En.statSync(a, { bigint: !0 }) : (a) => En.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: r };
}
function Vd(e, t, n, r, i) {
  Gd.callbackify(qd)(e, t, r, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (dr(s, l)) {
        const p = ge.basename(e), c = ge.basename(t);
        return n === "move" && p !== c && p.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && ra(e, t) ? i(new Error(gi(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function Yd(e, t, n, r) {
  const { srcStat: i, destStat: o } = Wd(e, t, r);
  if (o) {
    if (dr(i, o)) {
      const a = ge.basename(e), s = ge.basename(t);
      if (n === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && ra(e, t))
    throw new Error(gi(e, t, n));
  return { srcStat: i, destStat: o };
}
function cc(e, t, n, r, i) {
  const o = ge.resolve(ge.dirname(e)), a = ge.resolve(ge.dirname(n));
  if (a === o || a === ge.parse(a).root) return i();
  En.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : dr(t, l) ? i(new Error(gi(e, n, r))) : cc(e, t, a, r, i));
}
function uc(e, t, n, r) {
  const i = ge.resolve(ge.dirname(e)), o = ge.resolve(ge.dirname(n));
  if (o === i || o === ge.parse(o).root) return;
  let a;
  try {
    a = En.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (dr(t, a))
    throw new Error(gi(e, n, r));
  return uc(e, t, o, r);
}
function dr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ra(e, t) {
  const n = ge.resolve(e).split(ge.sep).filter((i) => i), r = ge.resolve(t).split(ge.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function gi(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var An = {
  checkPaths: Vd,
  checkPathsSync: Yd,
  checkParentPaths: cc,
  checkParentPathsSync: uc,
  isSrcSubdir: ra,
  areIdentical: dr
};
const ke = Fe, Yn = ae, zd = st.mkdirs, Xd = Jt.pathExists, Kd = lc.utimesMillis, zn = An;
function Jd(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), zn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: a, destStat: s } = o;
    zn.checkParentPaths(e, a, t, "copy", (l) => l ? r(l) : n.filter ? fc(ns, s, e, t, n, r) : ns(s, e, t, n, r));
  });
}
function ns(e, t, n, r, i) {
  const o = Yn.dirname(n);
  Xd(o, (a, s) => {
    if (a) return i(a);
    if (s) return ri(e, t, n, r, i);
    zd(o, (l) => l ? i(l) : ri(e, t, n, r, i));
  });
}
function fc(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function Qd(e, t, n, r, i) {
  return r.filter ? fc(ri, e, t, n, r, i) : ri(e, t, n, r, i);
}
function ri(e, t, n, r, i) {
  (r.dereference ? ke.stat : ke.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? oh(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? Zd(s, e, t, n, r, i) : s.isSymbolicLink() ? lh(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Zd(e, t, n, r, i, o) {
  return t ? eh(e, n, r, i, o) : dc(e, n, r, i, o);
}
function eh(e, t, n, r, i) {
  if (r.overwrite)
    ke.unlink(n, (o) => o ? i(o) : dc(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function dc(e, t, n, r, i) {
  ke.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? th(e.mode, t, n, i) : yi(n, e.mode, i));
}
function th(e, t, n, r) {
  return nh(e) ? rh(n, e, (i) => i ? r(i) : rs(e, t, n, r)) : rs(e, t, n, r);
}
function nh(e) {
  return (e & 128) === 0;
}
function rh(e, t, n) {
  return yi(e, t | 128, n);
}
function rs(e, t, n, r) {
  ih(t, n, (i) => i ? r(i) : yi(n, e, r));
}
function yi(e, t, n) {
  return ke.chmod(e, t, n);
}
function ih(e, t, n) {
  ke.stat(e, (r, i) => r ? n(r) : Kd(t, i.atime, i.mtime, n));
}
function oh(e, t, n, r, i, o) {
  return t ? hc(n, r, i, o) : ah(e.mode, n, r, i, o);
}
function ah(e, t, n, r, i) {
  ke.mkdir(n, (o) => {
    if (o) return i(o);
    hc(t, n, r, (a) => a ? i(a) : yi(n, e, i));
  });
}
function hc(e, t, n, r) {
  ke.readdir(e, (i, o) => i ? r(i) : pc(o, e, t, n, r));
}
function pc(e, t, n, r, i) {
  const o = e.pop();
  return o ? sh(e, o, t, n, r, i) : i();
}
function sh(e, t, n, r, i, o) {
  const a = Yn.join(n, t), s = Yn.join(r, t);
  zn.checkPaths(a, s, "copy", i, (l, p) => {
    if (l) return o(l);
    const { destStat: c } = p;
    Qd(c, a, s, i, (f) => f ? o(f) : pc(e, n, r, i, o));
  });
}
function lh(e, t, n, r, i) {
  ke.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = Yn.resolve(process.cwd(), a)), e)
      ke.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? ke.symlink(a, n, i) : i(s) : (r.dereference && (l = Yn.resolve(process.cwd(), l)), zn.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && zn.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : ch(a, n, i)));
    else
      return ke.symlink(a, n, i);
  });
}
function ch(e, t, n) {
  ke.unlink(t, (r) => r ? n(r) : ke.symlink(e, t, n));
}
var uh = Jd;
const Ce = Fe, Xn = ae, fh = st.mkdirsSync, dh = lc.utimesMillisSync, Kn = An;
function hh(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Kn.checkPathsSync(e, t, "copy", n);
  return Kn.checkParentPathsSync(e, r, t, "copy"), ph(i, e, t, n);
}
function ph(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Xn.dirname(n);
  return Ce.existsSync(i) || fh(i), mc(e, t, n, r);
}
function mh(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return mc(e, t, n, r);
}
function mc(e, t, n, r) {
  const o = (r.dereference ? Ce.statSync : Ce.lstatSync)(t);
  if (o.isDirectory()) return Sh(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return gh(o, e, t, n, r);
  if (o.isSymbolicLink()) return Ch(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function gh(e, t, n, r, i) {
  return t ? yh(e, n, r, i) : gc(e, n, r, i);
}
function yh(e, t, n, r) {
  if (r.overwrite)
    return Ce.unlinkSync(n), gc(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function gc(e, t, n, r) {
  return Ce.copyFileSync(t, n), r.preserveTimestamps && Eh(e.mode, t, n), ia(n, e.mode);
}
function Eh(e, t, n) {
  return wh(e) && vh(n, e), _h(t, n);
}
function wh(e) {
  return (e & 128) === 0;
}
function vh(e, t) {
  return ia(e, t | 128);
}
function ia(e, t) {
  return Ce.chmodSync(e, t);
}
function _h(e, t) {
  const n = Ce.statSync(e);
  return dh(t, n.atime, n.mtime);
}
function Sh(e, t, n, r, i) {
  return t ? yc(n, r, i) : Ah(e.mode, n, r, i);
}
function Ah(e, t, n, r) {
  return Ce.mkdirSync(n), yc(t, n, r), ia(n, e);
}
function yc(e, t, n) {
  Ce.readdirSync(e).forEach((r) => Th(r, e, t, n));
}
function Th(e, t, n, r) {
  const i = Xn.join(t, e), o = Xn.join(n, e), { destStat: a } = Kn.checkPathsSync(i, o, "copy", r);
  return mh(a, i, o, r);
}
function Ch(e, t, n, r) {
  let i = Ce.readlinkSync(t);
  if (r.dereference && (i = Xn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Ce.readlinkSync(n);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Ce.symlinkSync(i, n);
      throw a;
    }
    if (r.dereference && (o = Xn.resolve(process.cwd(), o)), Kn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Ce.statSync(n).isDirectory() && Kn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return $h(i, n);
  } else
    return Ce.symlinkSync(i, n);
}
function $h(e, t) {
  return Ce.unlinkSync(t), Ce.symlinkSync(e, t);
}
var bh = hh;
const Ih = De.fromCallback;
var oa = {
  copy: Ih(uh),
  copySync: bh
};
const is = Fe, Ec = ae, Q = Ql, Jn = process.platform === "win32";
function wc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || is[n], n = n + "Sync", e[n] = e[n] || is[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function aa(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Q(e, "rimraf: missing path"), Q.strictEqual(typeof e, "string", "rimraf: path should be a string"), Q.strictEqual(typeof n, "function", "rimraf: callback function required"), Q(t, "rimraf: invalid options argument provided"), Q.strictEqual(typeof t, "object", "rimraf: options should be object"), wc(t), os(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const a = r * 100;
        return setTimeout(() => os(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function os(e, t, n) {
  Q(e), Q(t), Q(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Jn)
      return as(e, t, r, n);
    if (i && i.isDirectory())
      return Qr(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Jn ? as(e, t, o, n) : Qr(e, t, o, n);
        if (o.code === "EISDIR")
          return Qr(e, t, o, n);
      }
      return n(o);
    });
  });
}
function as(e, t, n, r) {
  Q(e), Q(t), Q(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, a) => {
      o ? r(o.code === "ENOENT" ? null : n) : a.isDirectory() ? Qr(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function ss(e, t, n) {
  let r;
  Q(e), Q(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  try {
    r = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  r.isDirectory() ? Zr(e, t, n) : t.unlinkSync(e);
}
function Qr(e, t, n, r) {
  Q(e), Q(t), Q(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Rh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function Rh(e, t, n) {
  Q(e), Q(t), Q(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      aa(Ec.join(e, s), t, (l) => {
        if (!a) {
          if (l) return n(a = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function vc(e, t) {
  let n;
  t = t || {}, wc(t), Q(e, "rimraf: missing path"), Q.strictEqual(typeof e, "string", "rimraf: path should be a string"), Q(t, "rimraf: missing options"), Q.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Jn && ss(e, t, r);
  }
  try {
    n && n.isDirectory() ? Zr(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Jn ? ss(e, t, r) : Zr(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Zr(e, t, r);
  }
}
function Zr(e, t, n) {
  Q(e), Q(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      Oh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function Oh(e, t) {
  if (Q(e), Q(t), t.readdirSync(e).forEach((n) => vc(Ec.join(e, n), t)), Jn) {
    const n = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - n < 500);
  } else
    return t.rmdirSync(e, t);
}
var Ph = aa;
aa.sync = vc;
const ii = Fe, Nh = De.fromCallback, _c = Ph;
function Dh(e, t) {
  if (ii.rm) return ii.rm(e, { recursive: !0, force: !0 }, t);
  _c(e, t);
}
function Fh(e) {
  if (ii.rmSync) return ii.rmSync(e, { recursive: !0, force: !0 });
  _c.sync(e);
}
var Ei = {
  remove: Nh(Dh),
  removeSync: Fh
};
const xh = De.fromPromise, Sc = Kt, Ac = ae, Tc = st, Cc = Ei, ls = xh(async function(t) {
  let n;
  try {
    n = await Sc.readdir(t);
  } catch {
    return Tc.mkdirs(t);
  }
  return Promise.all(n.map((r) => Cc.remove(Ac.join(t, r))));
});
function cs(e) {
  let t;
  try {
    t = Sc.readdirSync(e);
  } catch {
    return Tc.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Ac.join(e, n), Cc.removeSync(n);
  });
}
var Lh = {
  emptyDirSync: cs,
  emptydirSync: cs,
  emptyDir: ls,
  emptydir: ls
};
const Uh = De.fromCallback, $c = ae, vt = Fe, bc = st;
function kh(e, t) {
  function n() {
    vt.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  vt.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = $c.dirname(e);
    vt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? bc.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(a);
      s.isDirectory() ? n() : vt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Mh(e) {
  let t;
  try {
    t = vt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = $c.dirname(e);
  try {
    vt.statSync(n).isDirectory() || vt.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") bc.mkdirsSync(n);
    else throw r;
  }
  vt.writeFileSync(e, "");
}
var Bh = {
  createFile: Uh(kh),
  createFileSync: Mh
};
const jh = De.fromCallback, Ic = ae, wt = Fe, Rc = st, Hh = Jt.pathExists, { areIdentical: Oc } = An;
function Gh(e, t, n) {
  function r(i, o) {
    wt.link(i, o, (a) => {
      if (a) return n(a);
      n(null);
    });
  }
  wt.lstat(t, (i, o) => {
    wt.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), n(a);
      if (o && Oc(s, o)) return n(null);
      const l = Ic.dirname(t);
      Hh(l, (p, c) => {
        if (p) return n(p);
        if (c) return r(e, t);
        Rc.mkdirs(l, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function qh(e, t) {
  let n;
  try {
    n = wt.lstatSync(t);
  } catch {
  }
  try {
    const o = wt.lstatSync(e);
    if (n && Oc(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Ic.dirname(t);
  return wt.existsSync(r) || Rc.mkdirsSync(r), wt.linkSync(e, t);
}
var Wh = {
  createLink: jh(Gh),
  createLinkSync: qh
};
const _t = ae, Gn = Fe, Vh = Jt.pathExists;
function Yh(e, t, n) {
  if (_t.isAbsolute(e))
    return Gn.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = _t.dirname(t), i = _t.join(r, e);
    return Vh(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : Gn.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: _t.relative(r, e)
    })));
  }
}
function zh(e, t) {
  let n;
  if (_t.isAbsolute(e)) {
    if (n = Gn.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = _t.dirname(t), i = _t.join(r, e);
    if (n = Gn.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = Gn.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: _t.relative(r, e)
    };
  }
}
var Xh = {
  symlinkPaths: Yh,
  symlinkPathsSync: zh
};
const Pc = Fe;
function Kh(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  Pc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function Jh(e, t) {
  let n;
  if (t) return t;
  try {
    n = Pc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Qh = {
  symlinkType: Kh,
  symlinkTypeSync: Jh
};
const Zh = De.fromCallback, Nc = ae, Ke = Kt, Dc = st, ep = Dc.mkdirs, tp = Dc.mkdirsSync, Fc = Xh, np = Fc.symlinkPaths, rp = Fc.symlinkPathsSync, xc = Qh, ip = xc.symlinkType, op = xc.symlinkTypeSync, ap = Jt.pathExists, { areIdentical: Lc } = An;
function sp(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Ke.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ke.stat(e),
      Ke.stat(t)
    ]).then(([a, s]) => {
      if (Lc(a, s)) return r(null);
      us(e, t, n, r);
    }) : us(e, t, n, r);
  });
}
function us(e, t, n, r) {
  np(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, ip(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = Nc.dirname(t);
      ap(l, (p, c) => {
        if (p) return r(p);
        if (c) return Ke.symlink(e, t, s, r);
        ep(l, (f) => {
          if (f) return r(f);
          Ke.symlink(e, t, s, r);
        });
      });
    });
  });
}
function lp(e, t, n) {
  let r;
  try {
    r = Ke.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = Ke.statSync(e), l = Ke.statSync(t);
    if (Lc(s, l)) return;
  }
  const i = rp(e, t);
  e = i.toDst, n = op(i.toCwd, n);
  const o = Nc.dirname(t);
  return Ke.existsSync(o) || tp(o), Ke.symlinkSync(e, t, n);
}
var cp = {
  createSymlink: Zh(sp),
  createSymlinkSync: lp
};
const { createFile: fs, createFileSync: ds } = Bh, { createLink: hs, createLinkSync: ps } = Wh, { createSymlink: ms, createSymlinkSync: gs } = cp;
var up = {
  // file
  createFile: fs,
  createFileSync: ds,
  ensureFile: fs,
  ensureFileSync: ds,
  // link
  createLink: hs,
  createLinkSync: ps,
  ensureLink: hs,
  ensureLinkSync: ps,
  // symlink
  createSymlink: ms,
  createSymlinkSync: gs,
  ensureSymlink: ms,
  ensureSymlinkSync: gs
};
function fp(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function dp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var sa = { stringify: fp, stripBom: dp };
let wn;
try {
  wn = Fe;
} catch {
  wn = It;
}
const wi = De, { stringify: Uc, stripBom: kc } = sa;
async function hp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || wn, r = "throws" in t ? t.throws : !0;
  let i = await wi.fromCallback(n.readFile)(e, t);
  i = kc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (r)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const pp = wi.fromPromise(hp);
function mp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || wn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = kc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function gp(e, t, n = {}) {
  const r = n.fs || wn, i = Uc(t, n);
  await wi.fromCallback(r.writeFile)(e, i, n);
}
const yp = wi.fromPromise(gp);
function Ep(e, t, n = {}) {
  const r = n.fs || wn, i = Uc(t, n);
  return r.writeFileSync(e, i, n);
}
var wp = {
  readFile: pp,
  readFileSync: mp,
  writeFile: yp,
  writeFileSync: Ep
};
const xr = wp;
var vp = {
  // jsonfile exports
  readJson: xr.readFile,
  readJsonSync: xr.readFileSync,
  writeJson: xr.writeFile,
  writeJsonSync: xr.writeFileSync
};
const _p = De.fromCallback, qn = Fe, Mc = ae, Bc = st, Sp = Jt.pathExists;
function Ap(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = Mc.dirname(e);
  Sp(i, (o, a) => {
    if (o) return r(o);
    if (a) return qn.writeFile(e, t, n, r);
    Bc.mkdirs(i, (s) => {
      if (s) return r(s);
      qn.writeFile(e, t, n, r);
    });
  });
}
function Tp(e, ...t) {
  const n = Mc.dirname(e);
  if (qn.existsSync(n))
    return qn.writeFileSync(e, ...t);
  Bc.mkdirsSync(n), qn.writeFileSync(e, ...t);
}
var la = {
  outputFile: _p(Ap),
  outputFileSync: Tp
};
const { stringify: Cp } = sa, { outputFile: $p } = la;
async function bp(e, t, n = {}) {
  const r = Cp(t, n);
  await $p(e, r, n);
}
var Ip = bp;
const { stringify: Rp } = sa, { outputFileSync: Op } = la;
function Pp(e, t, n) {
  const r = Rp(t, n);
  Op(e, r, n);
}
var Np = Pp;
const Dp = De.fromPromise, Ne = vp;
Ne.outputJson = Dp(Ip);
Ne.outputJsonSync = Np;
Ne.outputJSON = Ne.outputJson;
Ne.outputJSONSync = Ne.outputJsonSync;
Ne.writeJSON = Ne.writeJson;
Ne.writeJSONSync = Ne.writeJsonSync;
Ne.readJSON = Ne.readJson;
Ne.readJSONSync = Ne.readJsonSync;
var Fp = Ne;
const xp = Fe, Oo = ae, Lp = oa.copy, jc = Ei.remove, Up = st.mkdirp, kp = Jt.pathExists, ys = An;
function Mp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  ys.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    ys.checkParentPaths(e, s, t, "move", (p) => {
      if (p) return r(p);
      if (Bp(t)) return Es(e, t, i, l, r);
      Up(Oo.dirname(t), (c) => c ? r(c) : Es(e, t, i, l, r));
    });
  });
}
function Bp(e) {
  const t = Oo.dirname(e);
  return Oo.parse(t).root === t;
}
function Es(e, t, n, r, i) {
  if (r) return zi(e, t, n, i);
  if (n)
    return jc(t, (o) => o ? i(o) : zi(e, t, n, i));
  kp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : zi(e, t, n, i));
}
function zi(e, t, n, r) {
  xp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : jp(e, t, n, r) : r());
}
function jp(e, t, n, r) {
  Lp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : jc(e, r));
}
var Hp = Mp;
const Hc = Fe, Po = ae, Gp = oa.copySync, Gc = Ei.removeSync, qp = st.mkdirpSync, ws = An;
function Wp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ws.checkPathsSync(e, t, "move", n);
  return ws.checkParentPathsSync(e, i, t, "move"), Vp(t) || qp(Po.dirname(t)), Yp(e, t, r, o);
}
function Vp(e) {
  const t = Po.dirname(e);
  return Po.parse(t).root === t;
}
function Yp(e, t, n, r) {
  if (r) return Xi(e, t, n);
  if (n)
    return Gc(t), Xi(e, t, n);
  if (Hc.existsSync(t)) throw new Error("dest already exists.");
  return Xi(e, t, n);
}
function Xi(e, t, n) {
  try {
    Hc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return zp(e, t, n);
  }
}
function zp(e, t, n) {
  return Gp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Gc(e);
}
var Xp = Wp;
const Kp = De.fromCallback;
var Jp = {
  move: Kp(Hp),
  moveSync: Xp
}, Ot = {
  // Export promiseified graceful-fs:
  ...Kt,
  // Export extra methods:
  ...oa,
  ...Lh,
  ...up,
  ...Fp,
  ...st,
  ...Jp,
  ...la,
  ...Jt,
  ...Ei
}, Qt = {}, At = {}, pe = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.CancellationError = Tt.CancellationToken = void 0;
const Qp = Zl;
class Zp extends Qp.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new No());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let a = null;
      if (r = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new No());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (n(), i)).catch((i) => {
      throw n(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
Tt.CancellationToken = Zp;
class No extends Error {
  constructor() {
    super("cancelled");
  }
}
Tt.CancellationError = No;
var Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
Tn.newError = em;
function em(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Pe = {}, Do = { exports: {} }, Lr = { exports: {} }, Ki, vs;
function tm() {
  if (vs) return Ki;
  vs = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Ki = function(c, f) {
    f = f || {};
    var h = typeof c;
    if (h === "string" && c.length > 0)
      return a(c);
    if (h === "number" && isFinite(c))
      return f.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function a(c) {
    if (c = String(c), !(c.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (f) {
        var h = parseFloat(f[1]), m = (f[2] || "ms").toLowerCase();
        switch (m) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function s(c) {
    var f = Math.abs(c);
    return f >= r ? Math.round(c / r) + "d" : f >= n ? Math.round(c / n) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= r ? p(c, f, r, "day") : f >= n ? p(c, f, n, "hour") : f >= t ? p(c, f, t, "minute") : f >= e ? p(c, f, e, "second") : c + " ms";
  }
  function p(c, f, h, m) {
    var E = f >= h * 1.5;
    return Math.round(c / h) + " " + m + (E ? "s" : "");
  }
  return Ki;
}
var Ji, _s;
function qc() {
  if (_s) return Ji;
  _s = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = p, r.disable = s, r.enable = o, r.enabled = l, r.humanize = tm(), r.destroy = c, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let h = 0;
      for (let m = 0; m < f.length; m++)
        h = (h << 5) - h + f.charCodeAt(m), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let h, m = null, E, y;
      function S(...C) {
        if (!S.enabled)
          return;
        const T = S, D = Number(/* @__PURE__ */ new Date()), k = D - (h || D);
        T.diff = k, T.prev = h, T.curr = D, h = D, C[0] = r.coerce(C[0]), typeof C[0] != "string" && C.unshift("%O");
        let G = 0;
        C[0] = C[0].replace(/%([a-zA-Z%])/g, (Z, te) => {
          if (Z === "%%")
            return "%";
          G++;
          const L = r.formatters[te];
          if (typeof L == "function") {
            const w = C[G];
            Z = L.call(T, w), C.splice(G, 1), G--;
          }
          return Z;
        }), r.formatArgs.call(T, C), (T.log || r.log).apply(T, C);
      }
      return S.namespace = f, S.useColors = r.useColors(), S.color = r.selectColor(f), S.extend = i, S.destroy = r.destroy, Object.defineProperty(S, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (E !== r.namespaces && (E = r.namespaces, y = r.enabled(f)), y),
        set: (C) => {
          m = C;
        }
      }), typeof r.init == "function" && r.init(S), S;
    }
    function i(f, h) {
      const m = r(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return m.log = this.log, m;
    }
    function o(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const m of h)
        m[0] === "-" ? r.skips.push(m.slice(1)) : r.names.push(m);
    }
    function a(f, h) {
      let m = 0, E = 0, y = -1, S = 0;
      for (; m < f.length; )
        if (E < h.length && (h[E] === f[m] || h[E] === "*"))
          h[E] === "*" ? (y = E, S = m, E++) : (m++, E++);
        else if (y !== -1)
          E = y + 1, S++, m = S;
        else
          return !1;
      for (; E < h.length && h[E] === "*"; )
        E++;
      return E === h.length;
    }
    function s() {
      const f = [
        ...r.names,
        ...r.skips.map((h) => "-" + h)
      ].join(",");
      return r.enable(""), f;
    }
    function l(f) {
      for (const h of r.skips)
        if (a(f, h))
          return !1;
      for (const h of r.names)
        if (a(f, h))
          return !0;
      return !1;
    }
    function p(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Ji = e, Ji;
}
var Ss;
function nm() {
  return Ss || (Ss = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const p = "color: " + this.color;
      l.splice(1, 0, p, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (c++, h === "%c" && (f = c));
      }), l.splice(f, 0, p);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = qc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Lr, Lr.exports)), Lr.exports;
}
var Ur = { exports: {} }, Qi, As;
function rm() {
  return As || (As = 1, Qi = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Qi;
}
var Zi, Ts;
function im() {
  if (Ts) return Zi;
  Ts = 1;
  const e = mi, t = ec, n = rm(), { env: r } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? i = 1 : r.FORCE_COLOR === "false" ? i = 0 : i = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, p) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !p && i === void 0)
      return 0;
    const c = i || 0;
    if (r.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in r) || r.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const f = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : c;
  }
  function s(l) {
    const p = a(l, l && l.isTTY);
    return o(p);
  }
  return Zi = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Zi;
}
var Cs;
function om() {
  return Cs || (Cs = 1, function(e, t) {
    const n = ec, r = Zo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = p, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = im();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, m) => {
      const E = m.substring(6).toLowerCase().replace(/_([a-z])/g, (S, C) => C.toUpperCase());
      let y = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), h[E] = y, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: m, useColors: E } = this;
      if (E) {
        const y = this.color, S = "\x1B[3" + (y < 8 ? y : "8;5;" + y), C = `  ${S};1m${m} \x1B[0m`;
        h[0] = C + h[0].split(`
`).join(`
` + C), h.push(S + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = a() + m + " " + h[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...h) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function l(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function p() {
      return process.env.DEBUG;
    }
    function c(h) {
      h.inspectOpts = {};
      const m = Object.keys(t.inspectOpts);
      for (let E = 0; E < m.length; E++)
        h.inspectOpts[m[E]] = t.inspectOpts[m[E]];
    }
    e.exports = qc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(Ur, Ur.exports)), Ur.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Do.exports = nm() : Do.exports = om();
var am = Do.exports, hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.ProgressCallbackTransform = void 0;
const sm = ur;
class lm extends sm.Transform {
  constructor(t, n, r) {
    super(), this.total = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
hr.ProgressCallbackTransform = lm;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.DigestTransform = Pe.HttpExecutor = Pe.HttpError = void 0;
Pe.createHttpError = xo;
Pe.parseJson = gm;
Pe.configureRequestOptionsFromUrl = Vc;
Pe.configureRequestUrl = ua;
Pe.safeGetHeader = gn;
Pe.configureRequestOptions = oi;
Pe.safeStringifyJson = ai;
const cm = fr, um = am, fm = It, dm = ur, Fo = Rt, hm = Tt, $s = Tn, pm = hr, kt = (0, um.default)("electron-builder");
function xo(e, t = null) {
  return new ca(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ai(e.headers), t);
}
const mm = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class ca extends Error {
  constructor(t, n = `HTTP error: ${mm.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Pe.HttpError = ca;
function gm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class cn {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new hm.CancellationToken(), r) {
    oi(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      kt(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, n, (a) => a.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    return kt.enabled && kt(`Request: ${ai(t)}`), n.createPromise((o, a, s) => {
      const l = this.createRequest(t, (p) => {
        try {
          this.handleResponse(p, t, n, o, a, i, r);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (p) => {
        this.doApiRequest(p, n, r, i).then(o).catch(a);
      }), r(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, n, r, i, o) {
  }
  addErrorAndTimeoutHandlers(t, n, r = 60 * 1e3) {
    this.addTimeOutHandler(t, n, r), t.on("error", n), t.on("aborted", () => {
      n(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, n, r, i, o, a, s) {
    var l;
    if (kt.enabled && kt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${ai(n)}`), t.statusCode === 404) {
      o(xo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const p = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = p >= 300 && p < 400, f = gn(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(cn.prepareRedirectUrlOptions(f, n), r, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (m) => h += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = gn(t, "content-type"), E = m != null && (Array.isArray(m) ? m.find((y) => y.includes("json")) != null : m.includes("json"));
          o(xo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${E ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (m) {
        o(m);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const a = [], s = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      ua(t, s), oi(s), this.doDownload(s, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, p) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              p(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            p(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, n, r) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        n.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", n.callback);
      const a = gn(o, "location");
      if (a != null) {
        r < this.maxRedirects ? this.doDownload(cn.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? Em(n, o) : n.responseHandler(o, n.callback);
    });
    this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (o) => {
      this.doDownload(o, n, r++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, n, r) {
    t.on("socket", (i) => {
      i.setTimeout(r, () => {
        t.abort(), n(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, n) {
    const r = Vc(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = cn.reconstructOriginalUrl(n), a = Wc(t, n);
      cn.isCrossOriginRedirect(o, a) && (kt.enabled && kt(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new Fo.URL(`${n}//${r}${i}${o}`);
  }
  static isCrossOriginRedirect(t, n) {
    if (t.hostname.toLowerCase() !== n.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && n.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(n.port))
      return !1;
    if (t.protocol !== n.protocol)
      return !0;
    const r = t.port, i = n.port;
    return r !== i;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof ca && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Pe.HttpExecutor = cn;
function Wc(e, t) {
  try {
    return new Fo.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new Fo.URL(e, o);
  }
}
function Vc(e, t) {
  const n = oi(t), r = Wc(e, t);
  return ua(r, n), n;
}
function ua(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Lo extends dm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, cm.createHash)(n);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, n, r) {
    this.digester.update(t), r(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (n) {
        t(n);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, $s.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, $s.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Pe.DigestTransform = Lo;
function ym(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function gn(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function Em(e, t) {
  if (!ym(gn(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = gn(t, "content-length");
    a != null && n.push(new pm.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new Lo(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new Lo(e.options.sha2, "sha256", "hex"));
  const i = (0, fm.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const a of n)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function oi(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function ai(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.MemoLazy = void 0;
class wm {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Yc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
vi.MemoLazy = wm;
function Yc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => Yc(e[a], t[a]));
  }
  return e === t;
}
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.githubUrl = vm;
pr.githubTagPrefix = _m;
pr.getS3LikeProviderBaseUrl = Sm;
function vm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function _m(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function Sm(e) {
  const t = e.provider;
  if (t === "s3")
    return Am(e);
  if (t === "spaces")
    return Tm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Am(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return zc(t, e.path);
}
function zc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Tm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return zc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var fa = {};
Object.defineProperty(fa, "__esModule", { value: !0 });
fa.retry = Xc;
const Cm = Tt;
async function Xc(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Cm.CancellationToken() } = t;
  try {
    return await e();
  } catch (p) {
    if (await Promise.resolve((n = s == null ? void 0 : s(p)) !== null && n !== void 0 ? n : !0) && r > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await Xc(e, { ...t, retries: r - 1, attempt: a + 1 });
    throw p;
  }
}
var da = {};
Object.defineProperty(da, "__esModule", { value: !0 });
da.parseDn = $m;
function $m(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? r += e[a] : (a++, r += String.fromCharCode(l));
        continue;
      }
      if (n === null && s === "=") {
        n = r, r = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (r.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    r += s;
  }
  return o;
}
var vn = {};
Object.defineProperty(vn, "__esModule", { value: !0 });
vn.nil = vn.UUID = void 0;
const Kc = fr, Jc = Tn, bm = "options.name must be either a string or a Buffer", bs = (0, Kc.randomBytes)(16);
bs[0] = bs[0] | 1;
const ei = {}, V = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  ei[t] = e, V[e] = t;
}
class Xt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Xt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return Im(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Rm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ei[t[14] + t[15]] & 240) >> 4,
        variant: Is((ei[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < n + 16)
        return !1;
      let r = 0;
      for (; r < 16 && t[n + r] === 0; r++)
        ;
      return r === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[n + 6] & 240) >> 4,
        variant: Is((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Jc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = ei[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
vn.UUID = Xt;
Xt.OID = Xt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Is(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Wn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Wn || (Wn = {}));
function Im(e, t, n, r, i = Wn.ASCII) {
  const o = (0, Kc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Jc.newError)(bm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Wn.BINARY:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Wn.OBJECT:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = new Xt(s);
      break;
    default:
      l = V[s[0]] + V[s[1]] + V[s[2]] + V[s[3]] + "-" + V[s[4]] + V[s[5]] + "-" + V[s[6] & 15 | n] + V[s[7]] + "-" + V[s[8] & 63 | 128] + V[s[9]] + "-" + V[s[10]] + V[s[11]] + V[s[12]] + V[s[13]] + V[s[14]] + V[s[15]];
      break;
  }
  return l;
}
function Rm(e) {
  return V[e[0]] + V[e[1]] + V[e[2]] + V[e[3]] + "-" + V[e[4]] + V[e[5]] + "-" + V[e[6]] + V[e[7]] + "-" + V[e[8]] + V[e[9]] + "-" + V[e[10]] + V[e[11]] + V[e[12]] + V[e[13]] + V[e[14]] + V[e[15]];
}
vn.nil = new Xt("00000000-0000-0000-0000-000000000000");
var mr = {}, Qc = {};
(function(e) {
  (function(t) {
    t.parser = function(d, u) {
      return new r(d, u);
    }, t.SAXParser = r, t.SAXStream = f, t.createStream = p, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var n = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function r(d, u) {
      if (!(this instanceof r))
        return new r(d, u);
      var A = this;
      o(A), A.q = A.c = "", A.bufferCheckPosition = t.MAX_BUFFER_LENGTH, A.encoding = null, A.opt = u || {}, A.opt.lowercase = A.opt.lowercase || A.opt.lowercasetags, A.looseCase = A.opt.lowercase ? "toLowerCase" : "toUpperCase", A.opt.maxEntityCount = A.opt.maxEntityCount || 512, A.opt.maxEntityDepth = A.opt.maxEntityDepth || 4, A.entityCount = A.entityDepth = 0, A.tags = [], A.closed = A.closedRoot = A.sawRoot = !1, A.tag = A.error = null, A.strict = !!d, A.noscript = !!(d || A.opt.noscript), A.state = w.BEGIN, A.strictEntities = A.opt.strictEntities, A.ENTITIES = A.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), A.attribList = [], A.opt.xmlns && (A.ns = Object.create(S)), A.opt.unquotedAttributeValues === void 0 && (A.opt.unquotedAttributeValues = !d), A.trackPosition = A.opt.position !== !1, A.trackPosition && (A.position = A.line = A.column = 0), z(A, "onready");
    }
    Object.create || (Object.create = function(d) {
      function u() {
      }
      u.prototype = d;
      var A = new u();
      return A;
    }), Object.keys || (Object.keys = function(d) {
      var u = [];
      for (var A in d) d.hasOwnProperty(A) && u.push(A);
      return u;
    });
    function i(d) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), A = 0, v = 0, Y = n.length; v < Y; v++) {
        var re = d[n[v]].length;
        if (re > u)
          switch (n[v]) {
            case "textNode":
              N(d);
              break;
            case "cdata":
              b(d, "oncdata", d.cdata), d.cdata = "";
              break;
            case "script":
              b(d, "onscript", d.script), d.script = "";
              break;
            default:
              M(d, "Max buffer length exceeded: " + n[v]);
          }
        A = Math.max(A, re);
      }
      var le = t.MAX_BUFFER_LENGTH - A;
      d.bufferCheckPosition = le + d.position;
    }
    function o(d) {
      for (var u = 0, A = n.length; u < A; u++)
        d[n[u]] = "";
    }
    function a(d) {
      N(d), d.cdata !== "" && (b(d, "oncdata", d.cdata), d.cdata = ""), d.script !== "" && (b(d, "onscript", d.script), d.script = "");
    }
    r.prototype = {
      end: function() {
        W(this);
      },
      write: Tr,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(d) {
      return d !== "error" && d !== "end";
    });
    function p(d, u) {
      return new f(d, u);
    }
    function c(d, u) {
      if (d.length >= 2) {
        if (d[0] === 255 && d[1] === 254)
          return "utf-16le";
        if (d[0] === 254 && d[1] === 255)
          return "utf-16be";
      }
      return d.length >= 3 && d[0] === 239 && d[1] === 187 && d[2] === 191 ? "utf8" : d.length >= 4 ? d[0] === 60 && d[1] === 0 && d[2] === 63 && d[3] === 0 ? "utf-16le" : d[0] === 0 && d[1] === 60 && d[2] === 0 && d[3] === 63 ? "utf-16be" : "utf8" : u ? "utf8" : null;
    }
    function f(d, u) {
      if (!(this instanceof f))
        return new f(d, u);
      s.apply(this), this._parser = new r(d, u), this.writable = !0, this.readable = !0;
      var A = this;
      this._parser.onend = function() {
        A.emit("end");
      }, this._parser.onerror = function(v) {
        A.emit("error", v), A._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, l.forEach(function(v) {
        Object.defineProperty(A, "on" + v, {
          get: function() {
            return A._parser["on" + v];
          },
          set: function(Y) {
            if (!Y)
              return A.removeAllListeners(v), A._parser["on" + v] = Y, Y;
            A.on(v, Y);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    f.prototype = Object.create(s.prototype, {
      constructor: {
        value: f
      }
    }), f.prototype._decodeBuffer = function(d, u) {
      if (this._decoderBuffer && (d = Buffer.concat([this._decoderBuffer, d]), this._decoderBuffer = null), !this._decoder) {
        var A = c(d, u);
        if (!A)
          return this._decoderBuffer = d, "";
        this._parser.encoding = A, this._decoder = new TextDecoder(A);
      }
      return this._decoder.decode(d, { stream: !u });
    }, f.prototype.write = function(d) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(d))
        d = this._decodeBuffer(d, !1);
      else if (this._decoderBuffer) {
        var u = this._decodeBuffer(Buffer.alloc(0), !0);
        u && (this._parser.write(u), this.emit("data", u));
      }
      return this._parser.write(d.toString()), this.emit("data", d), !0;
    }, f.prototype.end = function(d) {
      if (d && d.length && this.write(d), this._decoderBuffer) {
        var u = this._decodeBuffer(Buffer.alloc(0), !0);
        u && (this._parser.write(u), this.emit("data", u));
      } else if (this._decoder) {
        var A = this._decoder.decode();
        A && (this._parser.write(A), this.emit("data", A));
      }
      return this._parser.end(), !0;
    }, f.prototype.on = function(d, u) {
      var A = this;
      return !A._parser["on" + d] && l.indexOf(d) !== -1 && (A._parser["on" + d] = function() {
        var v = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        v.splice(0, 0, d), A.emit.apply(A, v);
      }), s.prototype.on.call(A, d, u);
    };
    var h = "[CDATA[", m = "DOCTYPE", E = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", S = { xml: E, xmlns: y }, C = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, k = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function G(d) {
      return d === " " || d === `
` || d === "\r" || d === "	";
    }
    function X(d) {
      return d === '"' || d === "'";
    }
    function Z(d) {
      return d === ">" || G(d);
    }
    function te(d, u) {
      return d.test(u);
    }
    function L(d, u) {
      return !te(d, u);
    }
    var w = 0;
    t.STATE = {
      BEGIN: w++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: w++,
      // leading whitespace
      TEXT: w++,
      // general stuff
      TEXT_ENTITY: w++,
      // &amp and such.
      OPEN_WAKA: w++,
      // <
      SGML_DECL: w++,
      // <!BLARG
      SGML_DECL_QUOTED: w++,
      // <!BLARG foo "bar
      DOCTYPE: w++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: w++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: w++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: w++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: w++,
      // <!-
      COMMENT: w++,
      // <!--
      COMMENT_ENDING: w++,
      // <!-- blah -
      COMMENT_ENDED: w++,
      // <!-- blah --
      CDATA: w++,
      // <![CDATA[ something
      CDATA_ENDING: w++,
      // ]
      CDATA_ENDING_2: w++,
      // ]]
      PROC_INST: w++,
      // <?hi
      PROC_INST_BODY: w++,
      // <?hi there
      PROC_INST_ENDING: w++,
      // <?hi "there" ?
      OPEN_TAG: w++,
      // <strong
      OPEN_TAG_SLASH: w++,
      // <strong /
      ATTRIB: w++,
      // <a
      ATTRIB_NAME: w++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: w++,
      // <a foo _
      ATTRIB_VALUE: w++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: w++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: w++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: w++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: w++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: w++,
      // <foo bar=&quot
      CLOSE_TAG: w++,
      // </a
      CLOSE_TAG_SAW_WHITE: w++,
      // </a   >
      SCRIPT: w++,
      // <script> ...
      SCRIPT_ENDING: w++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(d) {
      var u = t.ENTITIES[d], A = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[d] = A;
    });
    for (var H in t.STATE)
      t.STATE[t.STATE[H]] = H;
    w = t.STATE;
    function z(d, u, A) {
      d[u] && d[u](A);
    }
    function ne(d) {
      var u = d && d.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return u ? u[2] : null;
    }
    function R(d) {
      return d ? d.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function I(d, u) {
      const A = R(d), v = R(u);
      return !A || !v ? !0 : v === "utf16" ? A === "utf16le" || A === "utf16be" : A === v;
    }
    function P(d, u) {
      if (!(!d.strict || !d.encoding || !u || u.name !== "xml")) {
        var A = ne(u.body);
        A && !I(d.encoding, A) && F(
          d,
          "XML declaration encoding " + A + " does not match detected stream encoding " + d.encoding.toUpperCase()
        );
      }
    }
    function b(d, u, A) {
      d.textNode && N(d), z(d, u, A);
    }
    function N(d) {
      d.textNode = O(d.opt, d.textNode), d.textNode && z(d, "ontext", d.textNode), d.textNode = "";
    }
    function O(d, u) {
      return d.trim && (u = u.trim()), d.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function M(d, u) {
      return N(d), d.trackPosition && (u += `
Line: ` + d.line + `
Column: ` + d.column + `
Char: ` + d.c), u = new Error(u), d.error = u, z(d, "onerror", u), d;
    }
    function W(d) {
      return d.sawRoot && !d.closedRoot && F(d, "Unclosed root tag"), d.state !== w.BEGIN && d.state !== w.BEGIN_WHITESPACE && d.state !== w.TEXT && M(d, "Unexpected end"), N(d), d.c = "", d.closed = !0, z(d, "onend"), r.call(d, d.strict, d.opt), d;
    }
    function F(d, u) {
      if (typeof d != "object" || !(d instanceof r))
        throw new Error("bad call to strictFail");
      d.strict && M(d, u);
    }
    function K(d) {
      d.strict || (d.tagName = d.tagName[d.looseCase]());
      var u = d.tags[d.tags.length - 1] || d, A = d.tag = { name: d.tagName, attributes: {} };
      d.opt.xmlns && (A.ns = u.ns), d.attribList.length = 0, b(d, "onopentagstart", A);
    }
    function de(d, u) {
      var A = d.indexOf(":"), v = A < 0 ? ["", d] : d.split(":"), Y = v[0], re = v[1];
      return u && d === "xmlns" && (Y = "xmlns", re = ""), { prefix: Y, local: re };
    }
    function B(d) {
      if (d.strict || (d.attribName = d.attribName[d.looseCase]()), d.attribList.indexOf(d.attribName) !== -1 || d.tag.attributes.hasOwnProperty(d.attribName)) {
        d.attribName = d.attribValue = "";
        return;
      }
      if (d.opt.xmlns) {
        var u = de(d.attribName, !0), A = u.prefix, v = u.local;
        if (A === "xmlns")
          if (v === "xml" && d.attribValue !== E)
            F(
              d,
              "xml: prefix must be bound to " + E + `
Actual: ` + d.attribValue
            );
          else if (v === "xmlns" && d.attribValue !== y)
            F(
              d,
              "xmlns: prefix must be bound to " + y + `
Actual: ` + d.attribValue
            );
          else {
            var Y = d.tag, re = d.tags[d.tags.length - 1] || d;
            Y.ns === re.ns && (Y.ns = Object.create(re.ns)), Y.ns[v] = d.attribValue;
          }
        d.attribList.push([d.attribName, d.attribValue]);
      } else
        d.tag.attributes[d.attribName] = d.attribValue, b(d, "onattribute", {
          name: d.attribName,
          value: d.attribValue
        });
      d.attribName = d.attribValue = "";
    }
    function ve(d, u) {
      if (d.opt.xmlns) {
        var A = d.tag, v = de(d.tagName);
        A.prefix = v.prefix, A.local = v.local, A.uri = A.ns[v.prefix] || "", A.prefix && !A.uri && (F(
          d,
          "Unbound namespace prefix: " + JSON.stringify(d.tagName)
        ), A.uri = v.prefix);
        var Y = d.tags[d.tags.length - 1] || d;
        A.ns && Y.ns !== A.ns && Object.keys(A.ns).forEach(function(Nt) {
          b(d, "onopennamespace", {
            prefix: Nt,
            uri: A.ns[Nt]
          });
        });
        for (var re = 0, le = d.attribList.length; re < le; re++) {
          var _e = d.attribList[re], Se = _e[0], We = _e[1], he = de(Se, !0), Ve = he.prefix, ki = he.local, Cr = Ve === "" ? "" : A.ns[Ve] || "", On = {
            name: Se,
            value: We,
            prefix: Ve,
            local: ki,
            uri: Cr
          };
          Ve && Ve !== "xmlns" && !Cr && (F(
            d,
            "Unbound namespace prefix: " + JSON.stringify(Ve)
          ), On.uri = Ve), d.tag.attributes[Se] = On, b(d, "onattribute", On);
        }
        d.attribList.length = 0;
      }
      d.tag.isSelfClosing = !!u, d.sawRoot = !0, d.tags.push(d.tag), b(d, "onopentag", d.tag), u || (!d.noscript && d.tagName.toLowerCase() === "script" ? d.state = w.SCRIPT : d.state = w.TEXT, d.tag = null, d.tagName = ""), d.attribName = d.attribValue = "", d.attribList.length = 0;
    }
    function In(d) {
      if (!d.tagName) {
        F(d, "Weird empty close tag."), d.textNode += "</>", d.state = w.TEXT;
        return;
      }
      if (d.script) {
        if (d.tagName !== "script") {
          d.script += "</" + d.tagName + ">", d.tagName = "", d.state = w.SCRIPT;
          return;
        }
        b(d, "onscript", d.script), d.script = "";
      }
      var u = d.tags.length, A = d.tagName;
      d.strict || (A = A[d.looseCase]());
      for (var v = A; u--; ) {
        var Y = d.tags[u];
        if (Y.name !== v)
          F(d, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        F(d, "Unmatched closing tag: " + d.tagName), d.textNode += "</" + d.tagName + ">", d.state = w.TEXT;
        return;
      }
      d.tagName = A;
      for (var re = d.tags.length; re-- > u; ) {
        var le = d.tag = d.tags.pop();
        d.tagName = d.tag.name, b(d, "onclosetag", d.tagName);
        var _e = {};
        for (var Se in le.ns)
          _e[Se] = le.ns[Se];
        var We = d.tags[d.tags.length - 1] || d;
        d.opt.xmlns && le.ns !== We.ns && Object.keys(le.ns).forEach(function(he) {
          var Ve = le.ns[he];
          b(d, "onclosenamespace", { prefix: he, uri: Ve });
        });
      }
      u === 0 && (d.closedRoot = !0), d.tagName = d.attribValue = d.attribName = "", d.attribList.length = 0, d.state = w.TEXT;
    }
    function qe(d) {
      var u = d.entity, A = u.toLowerCase(), v, Y = "";
      return d.ENTITIES[u] ? d.ENTITIES[u] : d.ENTITIES[A] ? d.ENTITIES[A] : (u = A, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), v = parseInt(u, 16), Y = v.toString(16)) : (u = u.slice(1), v = parseInt(u, 10), Y = v.toString(10))), u = u.replace(/^0+/, ""), isNaN(v) || Y.toLowerCase() !== u || v < 0 || v > 1114111 ? (F(d, "Invalid character entity"), "&" + d.entity + ";") : String.fromCodePoint(v));
    }
    function Rn(d, u) {
      u === "<" ? (d.state = w.OPEN_WAKA, d.startTagPosition = d.position) : G(u) || (F(d, "Non-whitespace before first tag."), d.textNode = u, d.state = w.TEXT);
    }
    function en(d, u) {
      var A = "";
      return u < d.length && (A = d.charAt(u)), A;
    }
    function Tr(d) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return M(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (d === null)
        return W(u);
      typeof d == "object" && (d = d.toString());
      for (var A = 0, v = ""; v = en(d, A++), u.c = v, !!v; )
        switch (u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case w.BEGIN:
            if (u.state = w.BEGIN_WHITESPACE, v === "\uFEFF")
              continue;
            Rn(u, v);
            continue;
          case w.BEGIN_WHITESPACE:
            Rn(u, v);
            continue;
          case w.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var re = A - 1; v && v !== "<" && v !== "&"; )
                v = en(d, A++), v && u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += d.substring(re, A - 1);
            }
            v === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = w.OPEN_WAKA, u.startTagPosition = u.position) : (!G(v) && (!u.sawRoot || u.closedRoot) && F(u, "Text data outside of root node."), v === "&" ? u.state = w.TEXT_ENTITY : u.textNode += v);
            continue;
          case w.SCRIPT:
            v === "<" ? u.state = w.SCRIPT_ENDING : u.script += v;
            continue;
          case w.SCRIPT_ENDING:
            v === "/" ? u.state = w.CLOSE_TAG : (u.script += "<" + v, u.state = w.SCRIPT);
            continue;
          case w.OPEN_WAKA:
            if (v === "!")
              u.state = w.SGML_DECL, u.sgmlDecl = "";
            else if (!G(v)) if (te(C, v))
              u.state = w.OPEN_TAG, u.tagName = v;
            else if (v === "/")
              u.state = w.CLOSE_TAG, u.tagName = "";
            else if (v === "?")
              u.state = w.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (F(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var Y = u.position - u.startTagPosition;
                v = new Array(Y).join(" ") + v;
              }
              u.textNode += "<" + v, u.state = w.TEXT;
            }
            continue;
          case w.SGML_DECL:
            if (u.sgmlDecl + v === "--") {
              u.state = w.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = w.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + v, u.sgmlDecl = "") : (u.sgmlDecl + v).toUpperCase() === h ? (b(u, "onopencdata"), u.state = w.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + v).toUpperCase() === m ? (u.state = w.DOCTYPE, (u.doctype || u.sawRoot) && F(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : v === ">" ? (b(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = w.TEXT) : (X(v) && (u.state = w.SGML_DECL_QUOTED), u.sgmlDecl += v);
            continue;
          case w.SGML_DECL_QUOTED:
            v === u.q && (u.state = w.SGML_DECL, u.q = ""), u.sgmlDecl += v;
            continue;
          case w.DOCTYPE:
            v === ">" ? (u.state = w.TEXT, b(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += v, v === "[" ? u.state = w.DOCTYPE_DTD : X(v) && (u.state = w.DOCTYPE_QUOTED, u.q = v));
            continue;
          case w.DOCTYPE_QUOTED:
            u.doctype += v, v === u.q && (u.q = "", u.state = w.DOCTYPE);
            continue;
          case w.DOCTYPE_DTD:
            v === "]" ? (u.doctype += v, u.state = w.DOCTYPE) : v === "<" ? (u.state = w.OPEN_WAKA, u.startTagPosition = u.position) : X(v) ? (u.doctype += v, u.state = w.DOCTYPE_DTD_QUOTED, u.q = v) : u.doctype += v;
            continue;
          case w.DOCTYPE_DTD_QUOTED:
            u.doctype += v, v === u.q && (u.state = w.DOCTYPE_DTD, u.q = "");
            continue;
          case w.COMMENT:
            v === "-" ? u.state = w.COMMENT_ENDING : u.comment += v;
            continue;
          case w.COMMENT_ENDING:
            v === "-" ? (u.state = w.COMMENT_ENDED, u.comment = O(u.opt, u.comment), u.comment && b(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + v, u.state = w.COMMENT);
            continue;
          case w.COMMENT_ENDED:
            v !== ">" ? (F(u, "Malformed comment"), u.comment += "--" + v, u.state = w.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = w.DOCTYPE_DTD : u.state = w.TEXT;
            continue;
          case w.CDATA:
            for (var re = A - 1; v && v !== "]"; )
              v = en(d, A++), v && u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++);
            u.cdata += d.substring(re, A - 1), v === "]" && (u.state = w.CDATA_ENDING);
            continue;
          case w.CDATA_ENDING:
            v === "]" ? u.state = w.CDATA_ENDING_2 : (u.cdata += "]" + v, u.state = w.CDATA);
            continue;
          case w.CDATA_ENDING_2:
            v === ">" ? (u.cdata && b(u, "oncdata", u.cdata), b(u, "onclosecdata"), u.cdata = "", u.state = w.TEXT) : v === "]" ? u.cdata += "]" : (u.cdata += "]]" + v, u.state = w.CDATA);
            continue;
          case w.PROC_INST:
            v === "?" ? u.state = w.PROC_INST_ENDING : G(v) ? u.state = w.PROC_INST_BODY : u.procInstName += v;
            continue;
          case w.PROC_INST_BODY:
            if (!u.procInstBody && G(v))
              continue;
            v === "?" ? u.state = w.PROC_INST_ENDING : u.procInstBody += v;
            continue;
          case w.PROC_INST_ENDING:
            if (v === ">") {
              const We = {
                name: u.procInstName,
                body: u.procInstBody
              };
              P(u, We), b(u, "onprocessinginstruction", We), u.procInstName = u.procInstBody = "", u.state = w.TEXT;
            } else
              u.procInstBody += "?" + v, u.state = w.PROC_INST_BODY;
            continue;
          case w.OPEN_TAG:
            te(T, v) ? u.tagName += v : (K(u), v === ">" ? ve(u) : v === "/" ? u.state = w.OPEN_TAG_SLASH : (G(v) || F(u, "Invalid character in tag name"), u.state = w.ATTRIB));
            continue;
          case w.OPEN_TAG_SLASH:
            v === ">" ? (ve(u, !0), In(u)) : (F(
              u,
              "Forward-slash in opening tag not followed by >"
            ), u.state = w.ATTRIB);
            continue;
          case w.ATTRIB:
            if (G(v))
              continue;
            v === ">" ? ve(u) : v === "/" ? u.state = w.OPEN_TAG_SLASH : te(C, v) ? (u.attribName = v, u.attribValue = "", u.state = w.ATTRIB_NAME) : F(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_NAME:
            v === "=" ? u.state = w.ATTRIB_VALUE : v === ">" ? (F(u, "Attribute without value"), u.attribValue = u.attribName, B(u), ve(u)) : G(v) ? u.state = w.ATTRIB_NAME_SAW_WHITE : te(T, v) ? u.attribName += v : F(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_NAME_SAW_WHITE:
            if (v === "=")
              u.state = w.ATTRIB_VALUE;
            else {
              if (G(v))
                continue;
              F(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", b(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", v === ">" ? ve(u) : te(C, v) ? (u.attribName = v, u.state = w.ATTRIB_NAME) : (F(u, "Invalid attribute name"), u.state = w.ATTRIB);
            }
            continue;
          case w.ATTRIB_VALUE:
            if (G(v))
              continue;
            X(v) ? (u.q = v, u.state = w.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || M(u, "Unquoted attribute value"), u.state = w.ATTRIB_VALUE_UNQUOTED, u.attribValue = v);
            continue;
          case w.ATTRIB_VALUE_QUOTED:
            if (v !== u.q) {
              v === "&" ? u.state = w.ATTRIB_VALUE_ENTITY_Q : u.attribValue += v;
              continue;
            }
            B(u), u.q = "", u.state = w.ATTRIB_VALUE_CLOSED;
            continue;
          case w.ATTRIB_VALUE_CLOSED:
            G(v) ? u.state = w.ATTRIB : v === ">" ? ve(u) : v === "/" ? u.state = w.OPEN_TAG_SLASH : te(C, v) ? (F(u, "No whitespace between attributes"), u.attribName = v, u.attribValue = "", u.state = w.ATTRIB_NAME) : F(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_VALUE_UNQUOTED:
            if (!Z(v)) {
              v === "&" ? u.state = w.ATTRIB_VALUE_ENTITY_U : u.attribValue += v;
              continue;
            }
            B(u), v === ">" ? ve(u) : u.state = w.ATTRIB;
            continue;
          case w.CLOSE_TAG:
            if (u.tagName)
              v === ">" ? In(u) : te(T, v) ? u.tagName += v : u.script ? (u.script += "</" + u.tagName + v, u.tagName = "", u.state = w.SCRIPT) : (G(v) || F(u, "Invalid tagname in closing tag"), u.state = w.CLOSE_TAG_SAW_WHITE);
            else {
              if (G(v))
                continue;
              L(C, v) ? u.script ? (u.script += "</" + v, u.state = w.SCRIPT) : F(u, "Invalid tagname in closing tag.") : u.tagName = v;
            }
            continue;
          case w.CLOSE_TAG_SAW_WHITE:
            if (G(v))
              continue;
            v === ">" ? In(u) : F(u, "Invalid characters in closing tag");
            continue;
          case w.TEXT_ENTITY:
          case w.ATTRIB_VALUE_ENTITY_Q:
          case w.ATTRIB_VALUE_ENTITY_U:
            var le, _e;
            switch (u.state) {
              case w.TEXT_ENTITY:
                le = w.TEXT, _e = "textNode";
                break;
              case w.ATTRIB_VALUE_ENTITY_Q:
                le = w.ATTRIB_VALUE_QUOTED, _e = "attribValue";
                break;
              case w.ATTRIB_VALUE_ENTITY_U:
                le = w.ATTRIB_VALUE_UNQUOTED, _e = "attribValue";
                break;
            }
            if (v === ";") {
              var Se = qe(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Se) ? ((u.entityCount += 1) > u.opt.maxEntityCount && M(
                u,
                "Parsed entity count exceeds max entity count"
              ), (u.entityDepth += 1) > u.opt.maxEntityDepth && M(
                u,
                "Parsed entity depth exceeds max entity depth"
              ), u.entity = "", u.state = le, u.write(Se), u.entityDepth -= 1) : (u[_e] += Se, u.entity = "", u.state = le);
            } else te(u.entity.length ? k : D, v) ? u.entity += v : (F(u, "Invalid character in entity name"), u[_e] += "&" + u.entity + v, u.entity = "", u.state = le);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var d = String.fromCharCode, u = Math.floor, A = function() {
        var v = 16384, Y = [], re, le, _e = -1, Se = arguments.length;
        if (!Se)
          return "";
        for (var We = ""; ++_e < Se; ) {
          var he = Number(arguments[_e]);
          if (!isFinite(he) || // `NaN`, `+Infinity`, or `-Infinity`
          he < 0 || // not a valid Unicode code point
          he > 1114111 || // not a valid Unicode code point
          u(he) !== he)
            throw RangeError("Invalid code point: " + he);
          he <= 65535 ? Y.push(he) : (he -= 65536, re = (he >> 10) + 55296, le = he % 1024 + 56320, Y.push(re, le)), (_e + 1 === Se || Y.length > v) && (We += d.apply(null, Y), Y.length = 0);
        }
        return We;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: A,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = A;
    }();
  })(e);
})(Qc);
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.XElement = void 0;
mr.parseXml = Dm;
const Om = Qc, kr = Tn;
class Zc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, kr.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Nm(t))
      throw (0, kr.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, kr.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, kr.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (Rs(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => Rs(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
mr.XElement = Zc;
const Pm = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Nm(e) {
  return Pm.test(e);
}
function Rs(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Dm(e) {
  let t = null;
  const n = Om.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new Zc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = r[r.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    r.push(o);
  }, n.onclosetag = () => {
    r.pop();
  }, n.ontext = (i) => {
    r.length > 0 && (r[r.length - 1].value = i);
  }, n.oncdata = (i) => {
    const o = r[r.length - 1];
    o.value = i, o.isCData = !0;
  }, n.onerror = (i) => {
    throw i;
  }, n.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = Tt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = Tn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = Pe;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return r.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return r.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return r.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return r.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return r.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return r.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return r.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return r.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return r.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return r.safeStringifyJson;
  } });
  var i = vi;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = hr;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = pr;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var s = fa;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = da;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var p = vn;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return p.UUID;
  } });
  var c = mr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(pe);
var we = {}, ha = {}, Qe = {};
function eu(e) {
  return typeof e > "u" || e === null;
}
function Fm(e) {
  return typeof e == "object" && e !== null;
}
function xm(e) {
  return Array.isArray(e) ? e : eu(e) ? [] : [e];
}
function Lm(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Um(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function km(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Qe.isNothing = eu;
Qe.isObject = Fm;
Qe.toArray = xm;
Qe.repeat = Um;
Qe.isNegativeZero = km;
Qe.extend = Lm;
function tu(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Qn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = tu(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Qn.prototype = Object.create(Error.prototype);
Qn.prototype.constructor = Qn;
Qn.prototype.toString = function(t) {
  return this.name + ": " + tu(this, t);
};
var gr = Qn, jn = Qe;
function eo(e, t, n, r, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return r - t > s && (o = " ... ", t = r - s + o.length), n - r > s && (a = " ...", n = r + s - a.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + a,
    pos: r - t + o.length
    // relative position
  };
}
function to(e, t) {
  return jn.repeat(" ", t - e.length) + e;
}
function Mm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, a = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = r.length - 2);
  a < 0 && (a = r.length - 1);
  var s = "", l, p, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    p = eo(
      e.buffer,
      r[a - l],
      i[a - l],
      e.position - (r[a] - r[a - l]),
      f
    ), s = jn.repeat(" ", t.indent) + to((e.line - l + 1).toString(), c) + " | " + p.str + `
` + s;
  for (p = eo(e.buffer, r[a], i[a], e.position, f), s += jn.repeat(" ", t.indent) + to((e.line + 1).toString(), c) + " | " + p.str + `
`, s += jn.repeat("-", t.indent + c + 3 + p.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    p = eo(
      e.buffer,
      r[a + l],
      i[a + l],
      e.position - (r[a] - r[a + l]),
      f
    ), s += jn.repeat(" ", t.indent) + to((e.line + l + 1).toString(), c) + " | " + p.str + `
`;
  return s.replace(/\n$/, "");
}
var Bm = Mm, Os = gr, jm = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Hm = [
  "scalar",
  "sequence",
  "mapping"
];
function Gm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function qm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (jm.indexOf(n) === -1)
      throw new Os('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Gm(t.styleAliases || null), Hm.indexOf(this.kind) === -1)
    throw new Os('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var xe = qm, xn = gr, no = xe;
function Ps(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function Wm() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, n;
  function r(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, n = arguments.length; t < n; t += 1)
    arguments[t].forEach(r);
  return e;
}
function Uo(e) {
  return this.extend(e);
}
Uo.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof no)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new xn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof no))
      throw new xn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new xn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new xn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof no))
      throw new xn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Uo.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = Ps(i, "implicit"), i.compiledExplicit = Ps(i, "explicit"), i.compiledTypeMap = Wm(i.compiledImplicit, i.compiledExplicit), i;
};
var nu = Uo, Vm = xe, ru = new Vm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Ym = xe, iu = new Ym("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), zm = xe, ou = new zm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Xm = nu, au = new Xm({
  explicit: [
    ru,
    iu,
    ou
  ]
}), Km = xe;
function Jm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Qm() {
  return null;
}
function Zm(e) {
  return e === null;
}
var su = new Km("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Jm,
  construct: Qm,
  predicate: Zm,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), eg = xe;
function tg(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function ng(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function rg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var lu = new eg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: tg,
  construct: ng,
  predicate: rg,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), ig = Qe, og = xe;
function ag(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function sg(e) {
  return 48 <= e && e <= 55;
}
function lg(e) {
  return 48 <= e && e <= 57;
}
function cg(e) {
  if (e === null) return !1;
  var t = e.length, n = 0, r = !1, i;
  if (!t) return !1;
  if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
    if (n + 1 === t) return !0;
    if (i = e[++n], i === "b") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "x") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!ag(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!sg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!lg(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function ug(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function fg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !ig.isNegativeZero(e);
}
var cu = new og("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: cg,
  construct: ug,
  predicate: fg,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), uu = Qe, dg = xe, hg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function pg(e) {
  return !(e === null || !hg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function mg(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var gg = /^[-+]?[0-9]+e/;
function yg(e, t) {
  var n;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (uu.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), gg.test(n) ? n.replace("e", ".e") : n;
}
function Eg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || uu.isNegativeZero(e));
}
var fu = new dg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: pg,
  construct: mg,
  predicate: Eg,
  represent: yg,
  defaultStyle: "lowercase"
}), du = au.extend({
  implicit: [
    su,
    lu,
    cu,
    fu
  ]
}), hu = du, wg = xe, pu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), mu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function vg(e) {
  return e === null ? !1 : pu.exec(e) !== null || mu.exec(e) !== null;
}
function _g(e) {
  var t, n, r, i, o, a, s, l = 0, p = null, c, f, h;
  if (t = pu.exec(e), t === null && (t = mu.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), p = (c * 60 + f) * 6e4, t[9] === "-" && (p = -p)), h = new Date(Date.UTC(n, r, i, o, a, s, l)), p && h.setTime(h.getTime() - p), h;
}
function Sg(e) {
  return e.toISOString();
}
var gu = new wg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: vg,
  construct: _g,
  instanceOf: Date,
  represent: Sg
}), Ag = xe;
function Tg(e) {
  return e === "<<" || e === null;
}
var yu = new Ag("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Tg
}), Cg = xe, pa = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function $g(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = pa;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function bg(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = pa, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Ig(e) {
  var t = "", n = 0, r, i, o = e.length, a = pa;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function Rg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Eu = new Cg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: $g,
  construct: bg,
  predicate: Rg,
  represent: Ig
}), Og = xe, Pg = Object.prototype.hasOwnProperty, Ng = Object.prototype.toString;
function Dg(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, Ng.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Pg.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Fg(e) {
  return e !== null ? e : [];
}
var wu = new Og("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Dg,
  construct: Fg
}), xg = xe, Lg = Object.prototype.toString;
function Ug(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], Lg.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function kg(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var vu = new xg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Ug,
  construct: kg
}), Mg = xe, Bg = Object.prototype.hasOwnProperty;
function jg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (Bg.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function Hg(e) {
  return e !== null ? e : {};
}
var _u = new Mg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: jg,
  construct: Hg
}), ma = hu.extend({
  implicit: [
    gu,
    yu
  ],
  explicit: [
    Eu,
    wu,
    vu,
    _u
  ]
}), Ht = Qe, Su = gr, Gg = Bm, qg = ma, Ct = Object.prototype.hasOwnProperty, si = 1, Au = 2, Tu = 3, li = 4, ro = 1, Wg = 2, Ns = 3, Vg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Yg = /[\x85\u2028\u2029]/, zg = /[,\[\]\{\}]/, Cu = /^(?:!|!!|![a-z\-]+!)$/i, $u = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ds(e) {
  return Object.prototype.toString.call(e);
}
function ot(e) {
  return e === 10 || e === 13;
}
function Yt(e) {
  return e === 9 || e === 32;
}
function Me(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function un(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Xg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Kg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Jg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Fs(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Qg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function bu(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var Iu = new Array(256), Ru = new Array(256);
for (var rn = 0; rn < 256; rn++)
  Iu[rn] = Fs(rn) ? 1 : 0, Ru[rn] = Fs(rn);
function Zg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || qg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Ou(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = Gg(n), new Su(t, n);
}
function U(e, t) {
  throw Ou(e, t);
}
function ci(e, t) {
  e.onWarning && e.onWarning.call(null, Ou(e, t));
}
var xs = {
  YAML: function(t, n, r) {
    var i, o, a;
    t.version !== null && U(t, "duplication of %YAML directive"), r.length !== 1 && U(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && U(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && U(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && ci(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && U(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], Cu.test(i) || U(t, "ill-formed tag handle (first argument) of the TAG directive"), Ct.call(t.tagMap, i) && U(t, 'there is a previously declared suffix for "' + i + '" tag handle'), $u.test(o) || U(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      U(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function St(e, t, n, r) {
  var i, o, a, s;
  if (t < n) {
    if (s = e.input.slice(t, n), r)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || U(e, "expected valid JSON character");
    else Vg.test(s) && U(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function Ls(e, t, n, r) {
  var i, o, a, s;
  for (Ht.isObject(n) || U(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], Ct.call(t, o) || (bu(t, o, n[o]), r[o] = !0);
}
function fn(e, t, n, r, i, o, a, s, l) {
  var p, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), p = 0, c = i.length; p < c; p += 1)
      Array.isArray(i[p]) && U(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ds(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  if (typeof i == "object" && Ds(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (p = 0, c = o.length; p < c; p += 1)
        Ls(e, t, o[p], n);
    else
      Ls(e, t, o, n);
  else
    !e.json && !Ct.call(n, i) && Ct.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, U(e, "duplicated mapping key")), bu(t, i, o), delete n[i];
  return t;
}
function ga(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : U(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ue(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Yt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (ot(i))
      for (ga(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && ci(e, "deficient indentation"), r;
}
function _i(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Me(n)));
}
function ya(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Ht.repeat(`
`, t - 1));
}
function e0(e, t, n) {
  var r, i, o, a, s, l, p, c, f = e.kind, h = e.result, m;
  if (m = e.input.charCodeAt(e.position), Me(m) || un(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), Me(i) || n && un(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Me(i) || n && un(i))
        break;
    } else if (m === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Me(r))
        break;
    } else {
      if (e.position === e.lineStart && _i(e) || n && un(m))
        break;
      if (ot(m))
        if (l = e.line, p = e.lineStart, c = e.lineIndent, ue(e, !1, -1), e.lineIndent >= t) {
          s = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = p, e.lineIndent = c;
          break;
        }
    }
    s && (St(e, o, a, !1), ya(e, e.line - l), o = a = e.position, s = !1), Yt(m) || (a = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return St(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function t0(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (St(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else ot(n) ? (St(e, r, i, !0), ya(e, ue(e, !1, t)), r = i = e.position) : e.position === e.lineStart && _i(e) ? U(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  U(e, "unexpected end of the stream within a single quoted scalar");
}
function n0(e, t) {
  var n, r, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return St(e, n, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (St(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), ot(s))
        ue(e, !1, t);
      else if (s < 256 && Iu[s])
        e.result += Ru[s], e.position++;
      else if ((a = Kg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = Xg(s)) >= 0 ? o = (o << 4) + a : U(e, "expected hexadecimal character");
        e.result += Qg(o), e.position++;
      } else
        U(e, "unknown escape sequence");
      n = r = e.position;
    } else ot(s) ? (St(e, n, r, !0), ya(e, ue(e, !1, t)), n = r = e.position) : e.position === e.lineStart && _i(e) ? U(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  U(e, "unexpected end of the stream within a double quoted scalar");
}
function r0(e, t) {
  var n = !0, r, i, o, a = e.tag, s, l = e.anchor, p, c, f, h, m, E = /* @__PURE__ */ Object.create(null), y, S, C, T;
  if (T = e.input.charCodeAt(e.position), T === 91)
    c = 93, m = !1, s = [];
  else if (T === 123)
    c = 125, m = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), T = e.input.charCodeAt(++e.position); T !== 0; ) {
    if (ue(e, !0, t), T = e.input.charCodeAt(e.position), T === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = s, !0;
    n ? T === 44 && U(e, "expected the node content, but found ','") : U(e, "missed comma between flow collection entries"), S = y = C = null, f = h = !1, T === 63 && (p = e.input.charCodeAt(e.position + 1), Me(p) && (f = h = !0, e.position++, ue(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, _n(e, t, si, !1, !0), S = e.tag, y = e.result, ue(e, !0, t), T = e.input.charCodeAt(e.position), (h || e.line === r) && T === 58 && (f = !0, T = e.input.charCodeAt(++e.position), ue(e, !0, t), _n(e, t, si, !1, !0), C = e.result), m ? fn(e, s, E, S, y, C, r, i, o) : f ? s.push(fn(e, null, E, S, y, C, r, i, o)) : s.push(y), ue(e, !0, t), T = e.input.charCodeAt(e.position), T === 44 ? (n = !0, T = e.input.charCodeAt(++e.position)) : n = !1;
  }
  U(e, "unexpected end of the stream within a flow collection");
}
function i0(e, t) {
  var n, r, i = ro, o = !1, a = !1, s = t, l = 0, p = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      ro === i ? i = f === 43 ? Ns : Wg : U(e, "repeat of a chomping mode identifier");
    else if ((c = Jg(f)) >= 0)
      c === 0 ? U(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? U(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Yt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Yt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!ot(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (ga(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), ot(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Ns ? e.result += Ht.repeat(`
`, o ? 1 + l : l) : i === ro && o && (e.result += `
`);
      break;
    }
    for (r ? Yt(f) ? (p = !0, e.result += Ht.repeat(`
`, o ? 1 + l : l)) : p ? (p = !1, e.result += Ht.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Ht.repeat(`
`, l) : e.result += Ht.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, n = e.position; !ot(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    St(e, n, e.position, !1);
  }
  return !0;
}
function Us(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Me(a)))); ) {
    if (s = !0, e.position++, ue(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, _n(e, t, Tu, !1, !0), o.push(e.result), ue(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      U(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function o0(e, t, n) {
  var r, i, o, a, s, l, p = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), m = null, E = null, y = null, S = !1, C = !1, T;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), T = e.input.charCodeAt(e.position); T !== 0; ) {
    if (!S && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (T === 63 || T === 58) && Me(r))
      T === 63 ? (S && (fn(e, f, h, m, E, null, a, s, l), m = E = y = null), C = !0, S = !0, i = !0) : S ? (S = !1, i = !0) : U(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, T = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !_n(e, n, Au, !1, !0))
        break;
      if (e.line === o) {
        for (T = e.input.charCodeAt(e.position); Yt(T); )
          T = e.input.charCodeAt(++e.position);
        if (T === 58)
          T = e.input.charCodeAt(++e.position), Me(T) || U(e, "a whitespace character is expected after the key-value separator within a block mapping"), S && (fn(e, f, h, m, E, null, a, s, l), m = E = y = null), C = !0, S = !1, i = !1, m = e.tag, E = e.result;
        else if (C)
          U(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = p, e.anchor = c, !0;
      } else if (C)
        U(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = p, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (S && (a = e.line, s = e.lineStart, l = e.position), _n(e, t, li, !0, i) && (S ? E = e.result : y = e.result), S || (fn(e, f, h, m, E, y, a, s, l), m = E = y = null), ue(e, !0, -1), T = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && T !== 0)
      U(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return S && fn(e, f, h, m, E, null, a, s, l), C && (e.tag = p, e.anchor = c, e.kind = "mapping", e.result = f), C;
}
function a0(e) {
  var t, n = !1, r = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && U(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (n = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (r = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : U(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Me(a); )
      a === 33 && (r ? U(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Cu.test(i) || U(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), zg.test(o) && U(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !$u.test(o) && U(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    U(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : Ct.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : U(e, 'undeclared tag handle "' + i + '"'), !0;
}
function s0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && U(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Me(n) && !un(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function l0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Me(r) && !un(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), Ct.call(e.anchorMap, n) || U(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], ue(e, !0, -1), !0;
}
function _n(e, t, n, r, i) {
  var o, a, s, l = 1, p = !1, c = !1, f, h, m, E, y, S;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = li === n || Tu === n, r && ue(e, !0, -1) && (p = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; a0(e) || s0(e); )
      ue(e, !0, -1) ? (p = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = p || i), (l === 1 || li === n) && (si === n || Au === n ? y = t : y = t + 1, S = e.position - e.lineStart, l === 1 ? s && (Us(e, S) || o0(e, S, y)) || r0(e, y) ? c = !0 : (a && i0(e, y) || t0(e, y) || n0(e, y) ? c = !0 : l0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && U(e, "alias node should not have any properties")) : e0(e, y, si === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Us(e, S))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && U(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (E = e.implicitTypes[f], E.resolve(e.result)) {
        e.result = E.construct(e.result), e.tag = E.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Ct.call(e.typeMap[e.kind || "fallback"], e.tag))
      E = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (E = null, m = e.typeMap.multi[e.kind || "fallback"], f = 0, h = m.length; f < h; f += 1)
        if (e.tag.slice(0, m[f].tag.length) === m[f].tag) {
          E = m[f];
          break;
        }
    E || U(e, "unknown tag !<" + e.tag + ">"), e.result !== null && E.kind !== e.kind && U(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + E.kind + '", not "' + e.kind + '"'), E.resolve(e.result, e.tag) ? (e.result = E.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : U(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function c0(e) {
  var t = e.position, n, r, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (ue(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), n = e.position; a !== 0 && !Me(a); )
      a = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && U(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Yt(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !ot(a));
        break;
      }
      if (ot(a)) break;
      for (n = e.position; a !== 0 && !Me(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    a !== 0 && ga(e), Ct.call(xs, r) ? xs[r](e, r, i) : ci(e, 'unknown document directive "' + r + '"');
  }
  if (ue(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ue(e, !0, -1)) : o && U(e, "directives end mark is expected"), _n(e, e.lineIndent - 1, li, !1, !0), ue(e, !0, -1), e.checkLineBreaks && Yg.test(e.input.slice(t, e.position)) && ci(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && _i(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ue(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    U(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Pu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new Zg(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, U(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    c0(n);
  return n.documents;
}
function u0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = Pu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function f0(e, t) {
  var n = Pu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new Su("expected a single document in the stream, but found more");
  }
}
ha.loadAll = u0;
ha.load = f0;
var Nu = {}, Si = Qe, yr = gr, d0 = ma, Du = Object.prototype.toString, Fu = Object.prototype.hasOwnProperty, Ea = 65279, h0 = 9, Zn = 10, p0 = 13, m0 = 32, g0 = 33, y0 = 34, ko = 35, E0 = 37, w0 = 38, v0 = 39, _0 = 42, xu = 44, S0 = 45, ui = 58, A0 = 61, T0 = 62, C0 = 63, $0 = 64, Lu = 91, Uu = 93, b0 = 96, ku = 123, I0 = 124, Mu = 125, $e = {};
$e[0] = "\\0";
$e[7] = "\\a";
$e[8] = "\\b";
$e[9] = "\\t";
$e[10] = "\\n";
$e[11] = "\\v";
$e[12] = "\\f";
$e[13] = "\\r";
$e[27] = "\\e";
$e[34] = '\\"';
$e[92] = "\\\\";
$e[133] = "\\N";
$e[160] = "\\_";
$e[8232] = "\\L";
$e[8233] = "\\P";
var R0 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], O0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function P0(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Fu.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function N0(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new yr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + Si.repeat("0", r - t.length) + t;
}
var D0 = 1, er = 2;
function F0(e) {
  this.schema = e.schema || d0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Si.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = P0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? er : D0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function ks(e, t) {
  for (var n = Si.repeat(" ", t), r = 0, i = -1, o = "", a, s = e.length; r < s; )
    i = e.indexOf(`
`, r), i === -1 ? (a = e.slice(r), r = s) : (a = e.slice(r, i + 1), r = i + 1), a.length && a !== `
` && (o += n), o += a;
  return o;
}
function Mo(e, t) {
  return `
` + Si.repeat(" ", e.indent * t);
}
function x0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function fi(e) {
  return e === m0 || e === h0;
}
function tr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Ea || 65536 <= e && e <= 1114111;
}
function Ms(e) {
  return tr(e) && e !== Ea && e !== p0 && e !== Zn;
}
function Bs(e, t, n) {
  var r = Ms(e), i = r && !fi(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== xu && e !== Lu && e !== Uu && e !== ku && e !== Mu) && e !== ko && !(t === ui && !i) || Ms(t) && !fi(t) && e === ko || t === ui && i
  );
}
function L0(e) {
  return tr(e) && e !== Ea && !fi(e) && e !== S0 && e !== C0 && e !== ui && e !== xu && e !== Lu && e !== Uu && e !== ku && e !== Mu && e !== ko && e !== w0 && e !== _0 && e !== g0 && e !== I0 && e !== A0 && e !== T0 && e !== v0 && e !== y0 && e !== E0 && e !== $0 && e !== b0;
}
function U0(e) {
  return !fi(e) && e !== ui;
}
function Hn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Bu(e) {
  var t = /^\n* /;
  return t.test(e);
}
var ju = 1, Bo = 2, Hu = 3, Gu = 4, ln = 5;
function k0(e, t, n, r, i, o, a, s) {
  var l, p = 0, c = null, f = !1, h = !1, m = r !== -1, E = -1, y = L0(Hn(e, 0)) && U0(Hn(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = Hn(e, l), !tr(p))
        return ln;
      y = y && Bs(p, c, s), c = p;
    }
  else {
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = Hn(e, l), p === Zn)
        f = !0, m && (h = h || // Foldable line = too long, and not more-indented.
        l - E - 1 > r && e[E + 1] !== " ", E = l);
      else if (!tr(p))
        return ln;
      y = y && Bs(p, c, s), c = p;
    }
    h = h || m && l - E - 1 > r && e[E + 1] !== " ";
  }
  return !f && !h ? y && !a && !i(e) ? ju : o === er ? ln : Bo : n > 9 && Bu(e) ? ln : a ? o === er ? ln : Bo : h ? Gu : Hu;
}
function M0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === er ? '""' : "''";
    if (!e.noCompatMode && (R0.indexOf(t) !== -1 || O0.test(t)))
      return e.quotingType === er ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(p) {
      return x0(e, p);
    }
    switch (k0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case ju:
        return t;
      case Bo:
        return "'" + t.replace(/'/g, "''") + "'";
      case Hu:
        return "|" + js(t, e.indent) + Hs(ks(t, o));
      case Gu:
        return ">" + js(t, e.indent) + Hs(ks(B0(t, a), o));
      case ln:
        return '"' + j0(t) + '"';
      default:
        throw new yr("impossible error: invalid scalar style");
    }
  }();
}
function js(e, t) {
  var n = Bu(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Hs(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function B0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var p = e.indexOf(`
`);
    return p = p !== -1 ? p : e.length, n.lastIndex = p, Gs(e.slice(0, p), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = n.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", r += s + (!i && !o && l !== "" ? `
` : "") + Gs(l, t), i = o;
  }
  return r;
}
function Gs(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, a = 0, s = 0, l = ""; r = n.exec(e); )
    s = r.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function j0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = Hn(e, i), r = $e[n], !r && tr(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || N0(n);
  return t;
}
function H0(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (ht(e, t, s, !1, !1) || typeof s > "u" && ht(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function qs(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (ht(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && ht(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Mo(e, t)), e.dump && Zn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function G0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, p, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], p = n[l], e.replacer && (p = e.replacer.call(n, l, p)), ht(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ht(e, t, p, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function q0(e, t, n, r) {
  var i = "", o = e.tag, a = Object.keys(n), s, l, p, c, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new yr("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!r || i !== "") && (h += Mo(e, t)), p = a[s], c = n[p], e.replacer && (c = e.replacer.call(n, p, c)), ht(e, t + 1, p, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Zn === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += Mo(e, t)), ht(e, t + 1, c, !0, f) && (e.dump && Zn === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function Ws(e, t, n) {
  var r, i, o, a, s, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, Du.call(s.represent) === "[object Function]")
          r = s.represent(t, l);
        else if (Fu.call(s.represent, l))
          r = s.represent[l](t, l);
        else
          throw new yr("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function ht(e, t, n, r, i, o, a) {
  e.tag = null, e.dump = n, Ws(e, n, !1) || Ws(e, n, !0);
  var s = Du.call(e.dump), l = r, p;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (q0(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (G0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? qs(e, t - 1, e.dump, i) : qs(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (H0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && M0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new yr("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (p = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? p = "!" + p : p.slice(0, 18) === "tag:yaml.org,2002:" ? p = "!!" + p.slice(18) : p = "!<" + p + ">", e.dump = p + " " + e.dump);
  }
  return !0;
}
function W0(e, t) {
  var n = [], r = [], i, o;
  for (jo(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function jo(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        jo(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        jo(e[r[i]], t, n);
}
function V0(e, t) {
  t = t || {};
  var n = new F0(t);
  n.noRefs || W0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), ht(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Nu.dump = V0;
var qu = ha, Y0 = Nu;
function wa(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
we.Type = xe;
we.Schema = nu;
we.FAILSAFE_SCHEMA = au;
we.JSON_SCHEMA = du;
we.CORE_SCHEMA = hu;
we.DEFAULT_SCHEMA = ma;
we.load = qu.load;
we.loadAll = qu.loadAll;
we.dump = Y0.dump;
we.YAMLException = gr;
we.types = {
  binary: Eu,
  float: fu,
  map: ou,
  null: su,
  pairs: vu,
  set: _u,
  timestamp: gu,
  bool: lu,
  int: cu,
  merge: yu,
  omap: wu,
  seq: iu,
  str: ru
};
we.safeLoad = wa("safeLoad", "load");
we.safeLoadAll = wa("safeLoadAll", "loadAll");
we.safeDump = wa("safeDump", "dump");
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.Lazy = void 0;
class z0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
Ai.Lazy = z0;
var Ho = { exports: {} };
const X0 = "2.0.0", Wu = 256, K0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, J0 = 16, Q0 = Wu - 6, Z0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ti = {
  MAX_LENGTH: Wu,
  MAX_SAFE_COMPONENT_LENGTH: J0,
  MAX_SAFE_BUILD_LENGTH: Q0,
  MAX_SAFE_INTEGER: K0,
  RELEASE_TYPES: Z0,
  SEMVER_SPEC_VERSION: X0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ey = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ci = ey;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = Ti, o = Ci;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], p = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], E = (S) => {
    for (const [C, T] of m)
      S = S.split(`${C}*`).join(`${C}{0,${T}}`).split(`${C}+`).join(`${C}{1,${T}}`);
    return S;
  }, y = (S, C, T) => {
    const D = E(C), k = f++;
    o(S, k, C), c[S] = k, l[k] = C, p[k] = D, a[k] = new RegExp(C, T ? "g" : void 0), s[k] = new RegExp(D, T ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${h}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ho, Ho.exports);
var Er = Ho.exports;
const ty = Object.freeze({ loose: !0 }), ny = Object.freeze({}), ry = (e) => e ? typeof e != "object" ? ty : e : ny;
var va = ry;
const Vs = /^[0-9]+$/, Vu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = Vs.test(e), r = Vs.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, iy = (e, t) => Vu(t, e);
var Yu = {
  compareIdentifiers: Vu,
  rcompareIdentifiers: iy
};
const Mr = Ci, { MAX_LENGTH: Ys, MAX_SAFE_INTEGER: Br } = Ti, { safeRe: jr, t: Hr } = Er, oy = va, { compareIdentifiers: io } = Yu;
let ay = class rt {
  constructor(t, n) {
    if (n = oy(n), t instanceof rt) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ys)
      throw new TypeError(
        `version is longer than ${Ys} characters`
      );
    Mr("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? jr[Hr.LOOSE] : jr[Hr.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > Br || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Br || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Br || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Br)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Mr("SemVer.compare", this.version, this.options, t), !(t instanceof rt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new rt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof rt || (t = new rt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof rt || (t = new rt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (Mr("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return io(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof rt || (t = new rt(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (Mr("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return io(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? jr[Hr.PRERELEASELOOSE] : jr[Hr.PRERELEASE]);
        if (!i || i[1] !== n)
          throw new Error(`invalid identifier: ${n}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, r);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, r);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(r) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (n === this.prerelease.join(".") && r === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (n) {
          let o = [n, i];
          r === !1 && (o = [n]), io(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Le = ay;
const zs = Le, sy = (e, t, n = !1) => {
  if (e instanceof zs)
    return e;
  try {
    return new zs(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var Cn = sy;
const ly = Cn, cy = (e, t) => {
  const n = ly(e, t);
  return n ? n.version : null;
};
var uy = cy;
const fy = Cn, dy = (e, t) => {
  const n = fy(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var hy = dy;
const Xs = Le, py = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Xs(
      e instanceof Xs ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var my = py;
const Ks = Cn, gy = (e, t) => {
  const n = Ks(e, null, !0), r = Ks(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? n : r, s = o ? r : n, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return n.major !== r.major ? c + "major" : n.minor !== r.minor ? c + "minor" : n.patch !== r.patch ? c + "patch" : "prerelease";
};
var yy = gy;
const Ey = Le, wy = (e, t) => new Ey(e, t).major;
var vy = wy;
const _y = Le, Sy = (e, t) => new _y(e, t).minor;
var Ay = Sy;
const Ty = Le, Cy = (e, t) => new Ty(e, t).patch;
var $y = Cy;
const by = Cn, Iy = (e, t) => {
  const n = by(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var Ry = Iy;
const Js = Le, Oy = (e, t, n) => new Js(e, n).compare(new Js(t, n));
var Ze = Oy;
const Py = Ze, Ny = (e, t, n) => Py(t, e, n);
var Dy = Ny;
const Fy = Ze, xy = (e, t) => Fy(e, t, !0);
var Ly = xy;
const Qs = Le, Uy = (e, t, n) => {
  const r = new Qs(e, n), i = new Qs(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var _a = Uy;
const ky = _a, My = (e, t) => e.sort((n, r) => ky(n, r, t));
var By = My;
const jy = _a, Hy = (e, t) => e.sort((n, r) => jy(r, n, t));
var Gy = Hy;
const qy = Ze, Wy = (e, t, n) => qy(e, t, n) > 0;
var $i = Wy;
const Vy = Ze, Yy = (e, t, n) => Vy(e, t, n) < 0;
var Sa = Yy;
const zy = Ze, Xy = (e, t, n) => zy(e, t, n) === 0;
var zu = Xy;
const Ky = Ze, Jy = (e, t, n) => Ky(e, t, n) !== 0;
var Xu = Jy;
const Qy = Ze, Zy = (e, t, n) => Qy(e, t, n) >= 0;
var Aa = Zy;
const eE = Ze, tE = (e, t, n) => eE(e, t, n) <= 0;
var Ta = tE;
const nE = zu, rE = Xu, iE = $i, oE = Aa, aE = Sa, sE = Ta, lE = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return nE(e, n, r);
    case "!=":
      return rE(e, n, r);
    case ">":
      return iE(e, n, r);
    case ">=":
      return oE(e, n, r);
    case "<":
      return aE(e, n, r);
    case "<=":
      return sE(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Ku = lE;
const cE = Le, uE = Cn, { safeRe: Gr, t: qr } = Er, fE = (e, t) => {
  if (e instanceof cE)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? Gr[qr.COERCEFULL] : Gr[qr.COERCE]);
  else {
    const l = t.includePrerelease ? Gr[qr.COERCERTLFULL] : Gr[qr.COERCERTL];
    let p;
    for (; (p = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || p.index + p[0].length !== n.index + n[0].length) && (n = p), l.lastIndex = p.index + p[1].length + p[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", a = t.includePrerelease && n[5] ? `-${n[5]}` : "", s = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return uE(`${r}.${i}.${o}${a}${s}`, t);
};
var dE = fE;
class hE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const n = this.map.get(t);
    if (n !== void 0)
      return this.map.delete(t), this.map.set(t, n), n;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, n) {
    if (!this.delete(t) && n !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, n);
    }
    return this;
  }
}
var pE = hE, oo, Zs;
function et() {
  if (Zs) return oo;
  Zs = 1;
  const e = /\s+/g;
  class t {
    constructor(I, P) {
      if (P = i(P), I instanceof t)
        return I.loose === !!P.loose && I.includePrerelease === !!P.includePrerelease ? I : new t(I.raw, P);
      if (I instanceof o)
        return this.raw = I.value, this.set = [[I]], this.formatted = void 0, this;
      if (this.options = P, this.loose = !!P.loose, this.includePrerelease = !!P.includePrerelease, this.raw = I.trim().replace(e, " "), this.set = this.raw.split("||").map((b) => this.parseRange(b.trim())).filter((b) => b.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const b = this.set[0];
        if (this.set = this.set.filter((N) => !y(N[0])), this.set.length === 0)
          this.set = [b];
        else if (this.set.length > 1) {
          for (const N of this.set)
            if (N.length === 1 && S(N[0])) {
              this.set = [N];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let I = 0; I < this.set.length; I++) {
          I > 0 && (this.formatted += "||");
          const P = this.set[I];
          for (let b = 0; b < P.length; b++)
            b > 0 && (this.formatted += " "), this.formatted += P[b].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(I) {
      const b = ((this.options.includePrerelease && m) | (this.options.loose && E)) + ":" + I, N = r.get(b);
      if (N)
        return N;
      const O = this.options.loose, M = O ? l[p.HYPHENRANGELOOSE] : l[p.HYPHENRANGE];
      I = I.replace(M, z(this.options.includePrerelease)), a("hyphen replace", I), I = I.replace(l[p.COMPARATORTRIM], c), a("comparator trim", I), I = I.replace(l[p.TILDETRIM], f), a("tilde trim", I), I = I.replace(l[p.CARETTRIM], h), a("caret trim", I);
      let W = I.split(" ").map((B) => T(B, this.options)).join(" ").split(/\s+/).map((B) => H(B, this.options));
      O && (W = W.filter((B) => (a("loose invalid filter", B, this.options), !!B.match(l[p.COMPARATORLOOSE])))), a("range list", W);
      const F = /* @__PURE__ */ new Map(), K = W.map((B) => new o(B, this.options));
      for (const B of K) {
        if (y(B))
          return [B];
        F.set(B.value, B);
      }
      F.size > 1 && F.has("") && F.delete("");
      const de = [...F.values()];
      return r.set(b, de), de;
    }
    intersects(I, P) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => C(b, P) && I.set.some((N) => C(N, P) && b.every((O) => N.every((M) => O.intersects(M, P)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(I) {
      if (!I)
        return !1;
      if (typeof I == "string")
        try {
          I = new s(I, this.options);
        } catch {
          return !1;
        }
      for (let P = 0; P < this.set.length; P++)
        if (ne(this.set[P], I, this.options))
          return !0;
      return !1;
    }
  }
  oo = t;
  const n = pE, r = new n(), i = va, o = bi(), a = Ci, s = Le, {
    safeRe: l,
    t: p,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = Er, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: E } = Ti, y = (R) => R.value === "<0.0.0-0", S = (R) => R.value === "", C = (R, I) => {
    let P = !0;
    const b = R.slice();
    let N = b.pop();
    for (; P && b.length; )
      P = b.every((O) => N.intersects(O, I)), N = b.pop();
    return P;
  }, T = (R, I) => (R = R.replace(l[p.BUILD], ""), a("comp", R, I), R = X(R, I), a("caret", R), R = k(R, I), a("tildes", R), R = te(R, I), a("xrange", R), R = w(R, I), a("stars", R), R), D = (R) => !R || R.toLowerCase() === "x" || R === "*", k = (R, I) => R.trim().split(/\s+/).map((P) => G(P, I)).join(" "), G = (R, I) => {
    const P = I.loose ? l[p.TILDELOOSE] : l[p.TILDE];
    return R.replace(P, (b, N, O, M, W) => {
      a("tilde", R, b, N, O, M, W);
      let F;
      return D(N) ? F = "" : D(O) ? F = `>=${N}.0.0 <${+N + 1}.0.0-0` : D(M) ? F = `>=${N}.${O}.0 <${N}.${+O + 1}.0-0` : W ? (a("replaceTilde pr", W), F = `>=${N}.${O}.${M}-${W} <${N}.${+O + 1}.0-0`) : F = `>=${N}.${O}.${M} <${N}.${+O + 1}.0-0`, a("tilde return", F), F;
    });
  }, X = (R, I) => R.trim().split(/\s+/).map((P) => Z(P, I)).join(" "), Z = (R, I) => {
    a("caret", R, I);
    const P = I.loose ? l[p.CARETLOOSE] : l[p.CARET], b = I.includePrerelease ? "-0" : "";
    return R.replace(P, (N, O, M, W, F) => {
      a("caret", R, N, O, M, W, F);
      let K;
      return D(O) ? K = "" : D(M) ? K = `>=${O}.0.0${b} <${+O + 1}.0.0-0` : D(W) ? O === "0" ? K = `>=${O}.${M}.0${b} <${O}.${+M + 1}.0-0` : K = `>=${O}.${M}.0${b} <${+O + 1}.0.0-0` : F ? (a("replaceCaret pr", F), O === "0" ? M === "0" ? K = `>=${O}.${M}.${W}-${F} <${O}.${M}.${+W + 1}-0` : K = `>=${O}.${M}.${W}-${F} <${O}.${+M + 1}.0-0` : K = `>=${O}.${M}.${W}-${F} <${+O + 1}.0.0-0`) : (a("no pr"), O === "0" ? M === "0" ? K = `>=${O}.${M}.${W}${b} <${O}.${M}.${+W + 1}-0` : K = `>=${O}.${M}.${W}${b} <${O}.${+M + 1}.0-0` : K = `>=${O}.${M}.${W} <${+O + 1}.0.0-0`), a("caret return", K), K;
    });
  }, te = (R, I) => (a("replaceXRanges", R, I), R.split(/\s+/).map((P) => L(P, I)).join(" ")), L = (R, I) => {
    R = R.trim();
    const P = I.loose ? l[p.XRANGELOOSE] : l[p.XRANGE];
    return R.replace(P, (b, N, O, M, W, F) => {
      a("xRange", R, b, N, O, M, W, F);
      const K = D(O), de = K || D(M), B = de || D(W), ve = B;
      return N === "=" && ve && (N = ""), F = I.includePrerelease ? "-0" : "", K ? N === ">" || N === "<" ? b = "<0.0.0-0" : b = "*" : N && ve ? (de && (M = 0), W = 0, N === ">" ? (N = ">=", de ? (O = +O + 1, M = 0, W = 0) : (M = +M + 1, W = 0)) : N === "<=" && (N = "<", de ? O = +O + 1 : M = +M + 1), N === "<" && (F = "-0"), b = `${N + O}.${M}.${W}${F}`) : de ? b = `>=${O}.0.0${F} <${+O + 1}.0.0-0` : B && (b = `>=${O}.${M}.0${F} <${O}.${+M + 1}.0-0`), a("xRange return", b), b;
    });
  }, w = (R, I) => (a("replaceStars", R, I), R.trim().replace(l[p.STAR], "")), H = (R, I) => (a("replaceGTE0", R, I), R.trim().replace(l[I.includePrerelease ? p.GTE0PRE : p.GTE0], "")), z = (R) => (I, P, b, N, O, M, W, F, K, de, B, ve) => (D(b) ? P = "" : D(N) ? P = `>=${b}.0.0${R ? "-0" : ""}` : D(O) ? P = `>=${b}.${N}.0${R ? "-0" : ""}` : M ? P = `>=${P}` : P = `>=${P}${R ? "-0" : ""}`, D(K) ? F = "" : D(de) ? F = `<${+K + 1}.0.0-0` : D(B) ? F = `<${K}.${+de + 1}.0-0` : ve ? F = `<=${K}.${de}.${B}-${ve}` : R ? F = `<${K}.${de}.${+B + 1}-0` : F = `<=${F}`, `${P} ${F}`.trim()), ne = (R, I, P) => {
    for (let b = 0; b < R.length; b++)
      if (!R[b].test(I))
        return !1;
    if (I.prerelease.length && !P.includePrerelease) {
      for (let b = 0; b < R.length; b++)
        if (a(R[b].semver), R[b].semver !== o.ANY && R[b].semver.prerelease.length > 0) {
          const N = R[b].semver;
          if (N.major === I.major && N.minor === I.minor && N.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return oo;
}
var ao, el;
function bi() {
  if (el) return ao;
  el = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = n(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], h = c.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new s(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (a("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = n(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  ao = t;
  const n = va, { safeRe: r, t: i } = Er, o = Ku, a = Ci, s = Le, l = et();
  return ao;
}
const mE = et(), gE = (e, t, n) => {
  try {
    t = new mE(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ii = gE;
const yE = et(), EE = (e, t) => new yE(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var wE = EE;
const vE = Le, _E = et(), SE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new _E(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new vE(r, n));
  }), r;
};
var AE = SE;
const TE = Le, CE = et(), $E = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new CE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new TE(r, n));
  }), r;
};
var bE = $E;
const so = Le, IE = et(), tl = $i, RE = (e, t) => {
  e = new IE(e, t);
  let n = new so("0.0.0");
  if (e.test(n) || (n = new so("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((a) => {
      const s = new so(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || tl(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!n || tl(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var OE = RE;
const PE = et(), NE = (e, t) => {
  try {
    return new PE(e, t).range || "*";
  } catch {
    return null;
  }
};
var DE = NE;
const FE = Le, Ju = bi(), { ANY: xE } = Ju, LE = et(), UE = Ii, nl = $i, rl = Sa, kE = Ta, ME = Aa, BE = (e, t, n, r) => {
  e = new FE(e, r), t = new LE(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = nl, o = kE, a = rl, s = ">", l = ">=";
      break;
    case "<":
      i = rl, o = ME, a = nl, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (UE(e, t, r))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const c = t.set[p];
    let f = null, h = null;
    if (c.forEach((m) => {
      m.semver === xE && (m = new Ju(">=0.0.0")), f = f || m, h = h || m, i(m.semver, f.semver, r) ? f = m : a(m.semver, h.semver, r) && (h = m);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var Ca = BE;
const jE = Ca, HE = (e, t, n) => jE(e, t, ">", n);
var GE = HE;
const qE = Ca, WE = (e, t, n) => qE(e, t, "<", n);
var VE = WE;
const il = et(), YE = (e, t, n) => (e = new il(e, n), t = new il(t, n), e.intersects(t, n));
var zE = YE;
const XE = Ii, KE = Ze;
var JE = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((c, f) => KE(c, f, n));
  for (const c of a)
    XE(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [c, f] of r)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < p.length ? l : t;
};
const ol = et(), $a = bi(), { ANY: lo } = $a, Ln = Ii, ba = Ze, QE = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new ol(e, n), t = new ol(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = ew(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, ZE = [new $a(">=0.0.0-0")], al = [new $a(">=0.0.0")], ew = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === lo) {
    if (t.length === 1 && t[0].semver === lo)
      return !0;
    n.includePrerelease ? e = ZE : e = al;
  }
  if (t.length === 1 && t[0].semver === lo) {
    if (n.includePrerelease)
      return !0;
    t = al;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = sl(i, m, n) : m.operator === "<" || m.operator === "<=" ? o = ll(o, m, n) : r.add(m.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = ba(i.semver, o.semver, n), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const m of r) {
    if (i && !Ln(m, String(i), n) || o && !Ln(m, String(o), n))
      return null;
    for (const E of t)
      if (!Ln(m, String(E), n))
        return !1;
    return !0;
  }
  let s, l, p, c, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (c = c || m.operator === ">" || m.operator === ">=", p = p || m.operator === "<" || m.operator === "<=", i) {
      if (h && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === h.major && m.semver.minor === h.minor && m.semver.patch === h.patch && (h = !1), m.operator === ">" || m.operator === ">=") {
        if (s = sl(i, m, n), s === m && s !== i)
          return !1;
      } else if (i.operator === ">=" && !Ln(i.semver, String(m), n))
        return !1;
    }
    if (o) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (l = ll(o, m, n), l === m && l !== o)
          return !1;
      } else if (o.operator === "<=" && !Ln(o.semver, String(m), n))
        return !1;
    }
    if (!m.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && p && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, sl = (e, t, n) => {
  if (!e)
    return t;
  const r = ba(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ll = (e, t, n) => {
  if (!e)
    return t;
  const r = ba(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var tw = QE;
const co = Er, cl = Ti, nw = Le, ul = Yu, rw = Cn, iw = uy, ow = hy, aw = my, sw = yy, lw = vy, cw = Ay, uw = $y, fw = Ry, dw = Ze, hw = Dy, pw = Ly, mw = _a, gw = By, yw = Gy, Ew = $i, ww = Sa, vw = zu, _w = Xu, Sw = Aa, Aw = Ta, Tw = Ku, Cw = dE, $w = bi(), bw = et(), Iw = Ii, Rw = wE, Ow = AE, Pw = bE, Nw = OE, Dw = DE, Fw = Ca, xw = GE, Lw = VE, Uw = zE, kw = JE, Mw = tw;
var Qu = {
  parse: rw,
  valid: iw,
  clean: ow,
  inc: aw,
  diff: sw,
  major: lw,
  minor: cw,
  patch: uw,
  prerelease: fw,
  compare: dw,
  rcompare: hw,
  compareLoose: pw,
  compareBuild: mw,
  sort: gw,
  rsort: yw,
  gt: Ew,
  lt: ww,
  eq: vw,
  neq: _w,
  gte: Sw,
  lte: Aw,
  cmp: Tw,
  coerce: Cw,
  Comparator: $w,
  Range: bw,
  satisfies: Iw,
  toComparators: Rw,
  maxSatisfying: Ow,
  minSatisfying: Pw,
  minVersion: Nw,
  validRange: Dw,
  outside: Fw,
  gtr: xw,
  ltr: Lw,
  intersects: Uw,
  simplifyRange: kw,
  subset: Mw,
  SemVer: nw,
  re: co.re,
  src: co.src,
  tokens: co.t,
  SEMVER_SPEC_VERSION: cl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: cl.RELEASE_TYPES,
  compareIdentifiers: ul.compareIdentifiers,
  rcompareIdentifiers: ul.rcompareIdentifiers
}, wr = {}, di = { exports: {} };
di.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", p = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", m = "[object Function]", E = "[object GeneratorFunction]", y = "[object Map]", S = "[object Number]", C = "[object Null]", T = "[object Object]", D = "[object Promise]", k = "[object Proxy]", G = "[object RegExp]", X = "[object Set]", Z = "[object String]", te = "[object Symbol]", L = "[object Undefined]", w = "[object WeakMap]", H = "[object ArrayBuffer]", z = "[object DataView]", ne = "[object Float32Array]", R = "[object Float64Array]", I = "[object Int8Array]", P = "[object Int16Array]", b = "[object Int32Array]", N = "[object Uint8Array]", O = "[object Uint8ClampedArray]", M = "[object Uint16Array]", W = "[object Uint32Array]", F = /[\\^$.*+?()[\]{}|]/g, K = /^\[object .+?Constructor\]$/, de = /^(?:0|[1-9]\d*)$/, B = {};
  B[ne] = B[R] = B[I] = B[P] = B[b] = B[N] = B[O] = B[M] = B[W] = !0, B[s] = B[l] = B[H] = B[c] = B[z] = B[f] = B[h] = B[m] = B[y] = B[S] = B[T] = B[G] = B[X] = B[Z] = B[w] = !1;
  var ve = typeof Re == "object" && Re && Re.Object === Object && Re, In = typeof self == "object" && self && self.Object === Object && self, qe = ve || In || Function("return this")(), Rn = t && !t.nodeType && t, en = Rn && !0 && e && !e.nodeType && e, Tr = en && en.exports === Rn, d = Tr && ve.process, u = function() {
    try {
      return d && d.binding && d.binding("util");
    } catch {
    }
  }(), A = u && u.isTypedArray;
  function v(g, _) {
    for (var $ = -1, x = g == null ? 0 : g.length, ee = 0, j = []; ++$ < x; ) {
      var se = g[$];
      _(se, $, g) && (j[ee++] = se);
    }
    return j;
  }
  function Y(g, _) {
    for (var $ = -1, x = _.length, ee = g.length; ++$ < x; )
      g[ee + $] = _[$];
    return g;
  }
  function re(g, _) {
    for (var $ = -1, x = g == null ? 0 : g.length; ++$ < x; )
      if (_(g[$], $, g))
        return !0;
    return !1;
  }
  function le(g, _) {
    for (var $ = -1, x = Array(g); ++$ < g; )
      x[$] = _($);
    return x;
  }
  function _e(g) {
    return function(_) {
      return g(_);
    };
  }
  function Se(g, _) {
    return g.has(_);
  }
  function We(g, _) {
    return g == null ? void 0 : g[_];
  }
  function he(g) {
    var _ = -1, $ = Array(g.size);
    return g.forEach(function(x, ee) {
      $[++_] = [ee, x];
    }), $;
  }
  function Ve(g, _) {
    return function($) {
      return g(_($));
    };
  }
  function ki(g) {
    var _ = -1, $ = Array(g.size);
    return g.forEach(function(x) {
      $[++_] = x;
    }), $;
  }
  var Cr = Array.prototype, On = Function.prototype, Nt = Object.prototype, Mi = qe["__core-js_shared__"], Fa = On.toString, nt = Nt.hasOwnProperty, xa = function() {
    var g = /[^.]+$/.exec(Mi && Mi.keys && Mi.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), La = Nt.toString, Ef = RegExp(
    "^" + Fa.call(nt).replace(F, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ua = Tr ? qe.Buffer : void 0, $r = qe.Symbol, ka = qe.Uint8Array, Ma = Nt.propertyIsEnumerable, wf = Cr.splice, Dt = $r ? $r.toStringTag : void 0, Ba = Object.getOwnPropertySymbols, vf = Ua ? Ua.isBuffer : void 0, _f = Ve(Object.keys, Object), Bi = tn(qe, "DataView"), Pn = tn(qe, "Map"), ji = tn(qe, "Promise"), Hi = tn(qe, "Set"), Gi = tn(qe, "WeakMap"), Nn = tn(Object, "create"), Sf = Lt(Bi), Af = Lt(Pn), Tf = Lt(ji), Cf = Lt(Hi), $f = Lt(Gi), ja = $r ? $r.prototype : void 0, qi = ja ? ja.valueOf : void 0;
  function Ft(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var x = g[_];
      this.set(x[0], x[1]);
    }
  }
  function bf() {
    this.__data__ = Nn ? Nn(null) : {}, this.size = 0;
  }
  function If(g) {
    var _ = this.has(g) && delete this.__data__[g];
    return this.size -= _ ? 1 : 0, _;
  }
  function Rf(g) {
    var _ = this.__data__;
    if (Nn) {
      var $ = _[g];
      return $ === r ? void 0 : $;
    }
    return nt.call(_, g) ? _[g] : void 0;
  }
  function Of(g) {
    var _ = this.__data__;
    return Nn ? _[g] !== void 0 : nt.call(_, g);
  }
  function Pf(g, _) {
    var $ = this.__data__;
    return this.size += this.has(g) ? 0 : 1, $[g] = Nn && _ === void 0 ? r : _, this;
  }
  Ft.prototype.clear = bf, Ft.prototype.delete = If, Ft.prototype.get = Rf, Ft.prototype.has = Of, Ft.prototype.set = Pf;
  function lt(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var x = g[_];
      this.set(x[0], x[1]);
    }
  }
  function Nf() {
    this.__data__ = [], this.size = 0;
  }
  function Df(g) {
    var _ = this.__data__, $ = Ir(_, g);
    if ($ < 0)
      return !1;
    var x = _.length - 1;
    return $ == x ? _.pop() : wf.call(_, $, 1), --this.size, !0;
  }
  function Ff(g) {
    var _ = this.__data__, $ = Ir(_, g);
    return $ < 0 ? void 0 : _[$][1];
  }
  function xf(g) {
    return Ir(this.__data__, g) > -1;
  }
  function Lf(g, _) {
    var $ = this.__data__, x = Ir($, g);
    return x < 0 ? (++this.size, $.push([g, _])) : $[x][1] = _, this;
  }
  lt.prototype.clear = Nf, lt.prototype.delete = Df, lt.prototype.get = Ff, lt.prototype.has = xf, lt.prototype.set = Lf;
  function xt(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var x = g[_];
      this.set(x[0], x[1]);
    }
  }
  function Uf() {
    this.size = 0, this.__data__ = {
      hash: new Ft(),
      map: new (Pn || lt)(),
      string: new Ft()
    };
  }
  function kf(g) {
    var _ = Rr(this, g).delete(g);
    return this.size -= _ ? 1 : 0, _;
  }
  function Mf(g) {
    return Rr(this, g).get(g);
  }
  function Bf(g) {
    return Rr(this, g).has(g);
  }
  function jf(g, _) {
    var $ = Rr(this, g), x = $.size;
    return $.set(g, _), this.size += $.size == x ? 0 : 1, this;
  }
  xt.prototype.clear = Uf, xt.prototype.delete = kf, xt.prototype.get = Mf, xt.prototype.has = Bf, xt.prototype.set = jf;
  function br(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.__data__ = new xt(); ++_ < $; )
      this.add(g[_]);
  }
  function Hf(g) {
    return this.__data__.set(g, r), this;
  }
  function Gf(g) {
    return this.__data__.has(g);
  }
  br.prototype.add = br.prototype.push = Hf, br.prototype.has = Gf;
  function pt(g) {
    var _ = this.__data__ = new lt(g);
    this.size = _.size;
  }
  function qf() {
    this.__data__ = new lt(), this.size = 0;
  }
  function Wf(g) {
    var _ = this.__data__, $ = _.delete(g);
    return this.size = _.size, $;
  }
  function Vf(g) {
    return this.__data__.get(g);
  }
  function Yf(g) {
    return this.__data__.has(g);
  }
  function zf(g, _) {
    var $ = this.__data__;
    if ($ instanceof lt) {
      var x = $.__data__;
      if (!Pn || x.length < n - 1)
        return x.push([g, _]), this.size = ++$.size, this;
      $ = this.__data__ = new xt(x);
    }
    return $.set(g, _), this.size = $.size, this;
  }
  pt.prototype.clear = qf, pt.prototype.delete = Wf, pt.prototype.get = Vf, pt.prototype.has = Yf, pt.prototype.set = zf;
  function Xf(g, _) {
    var $ = Or(g), x = !$ && ud(g), ee = !$ && !x && Wi(g), j = !$ && !x && !ee && Ka(g), se = $ || x || ee || j, me = se ? le(g.length, String) : [], ye = me.length;
    for (var ie in g)
      nt.call(g, ie) && !(se && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ee && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      j && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      od(ie, ye))) && me.push(ie);
    return me;
  }
  function Ir(g, _) {
    for (var $ = g.length; $--; )
      if (Va(g[$][0], _))
        return $;
    return -1;
  }
  function Kf(g, _, $) {
    var x = _(g);
    return Or(g) ? x : Y(x, $(g));
  }
  function Dn(g) {
    return g == null ? g === void 0 ? L : C : Dt && Dt in Object(g) ? rd(g) : cd(g);
  }
  function Ha(g) {
    return Fn(g) && Dn(g) == s;
  }
  function Ga(g, _, $, x, ee) {
    return g === _ ? !0 : g == null || _ == null || !Fn(g) && !Fn(_) ? g !== g && _ !== _ : Jf(g, _, $, x, Ga, ee);
  }
  function Jf(g, _, $, x, ee, j) {
    var se = Or(g), me = Or(_), ye = se ? l : mt(g), ie = me ? l : mt(_);
    ye = ye == s ? T : ye, ie = ie == s ? T : ie;
    var Be = ye == T, Ye = ie == T, Ae = ye == ie;
    if (Ae && Wi(g)) {
      if (!Wi(_))
        return !1;
      se = !0, Be = !1;
    }
    if (Ae && !Be)
      return j || (j = new pt()), se || Ka(g) ? qa(g, _, $, x, ee, j) : td(g, _, ye, $, x, ee, j);
    if (!($ & i)) {
      var je = Be && nt.call(g, "__wrapped__"), He = Ye && nt.call(_, "__wrapped__");
      if (je || He) {
        var gt = je ? g.value() : g, ct = He ? _.value() : _;
        return j || (j = new pt()), ee(gt, ct, $, x, j);
      }
    }
    return Ae ? (j || (j = new pt()), nd(g, _, $, x, ee, j)) : !1;
  }
  function Qf(g) {
    if (!Xa(g) || sd(g))
      return !1;
    var _ = Ya(g) ? Ef : K;
    return _.test(Lt(g));
  }
  function Zf(g) {
    return Fn(g) && za(g.length) && !!B[Dn(g)];
  }
  function ed(g) {
    if (!ld(g))
      return _f(g);
    var _ = [];
    for (var $ in Object(g))
      nt.call(g, $) && $ != "constructor" && _.push($);
    return _;
  }
  function qa(g, _, $, x, ee, j) {
    var se = $ & i, me = g.length, ye = _.length;
    if (me != ye && !(se && ye > me))
      return !1;
    var ie = j.get(g);
    if (ie && j.get(_))
      return ie == _;
    var Be = -1, Ye = !0, Ae = $ & o ? new br() : void 0;
    for (j.set(g, _), j.set(_, g); ++Be < me; ) {
      var je = g[Be], He = _[Be];
      if (x)
        var gt = se ? x(He, je, Be, _, g, j) : x(je, He, Be, g, _, j);
      if (gt !== void 0) {
        if (gt)
          continue;
        Ye = !1;
        break;
      }
      if (Ae) {
        if (!re(_, function(ct, Ut) {
          if (!Se(Ae, Ut) && (je === ct || ee(je, ct, $, x, j)))
            return Ae.push(Ut);
        })) {
          Ye = !1;
          break;
        }
      } else if (!(je === He || ee(je, He, $, x, j))) {
        Ye = !1;
        break;
      }
    }
    return j.delete(g), j.delete(_), Ye;
  }
  function td(g, _, $, x, ee, j, se) {
    switch ($) {
      case z:
        if (g.byteLength != _.byteLength || g.byteOffset != _.byteOffset)
          return !1;
        g = g.buffer, _ = _.buffer;
      case H:
        return !(g.byteLength != _.byteLength || !j(new ka(g), new ka(_)));
      case c:
      case f:
      case S:
        return Va(+g, +_);
      case h:
        return g.name == _.name && g.message == _.message;
      case G:
      case Z:
        return g == _ + "";
      case y:
        var me = he;
      case X:
        var ye = x & i;
        if (me || (me = ki), g.size != _.size && !ye)
          return !1;
        var ie = se.get(g);
        if (ie)
          return ie == _;
        x |= o, se.set(g, _);
        var Be = qa(me(g), me(_), x, ee, j, se);
        return se.delete(g), Be;
      case te:
        if (qi)
          return qi.call(g) == qi.call(_);
    }
    return !1;
  }
  function nd(g, _, $, x, ee, j) {
    var se = $ & i, me = Wa(g), ye = me.length, ie = Wa(_), Be = ie.length;
    if (ye != Be && !se)
      return !1;
    for (var Ye = ye; Ye--; ) {
      var Ae = me[Ye];
      if (!(se ? Ae in _ : nt.call(_, Ae)))
        return !1;
    }
    var je = j.get(g);
    if (je && j.get(_))
      return je == _;
    var He = !0;
    j.set(g, _), j.set(_, g);
    for (var gt = se; ++Ye < ye; ) {
      Ae = me[Ye];
      var ct = g[Ae], Ut = _[Ae];
      if (x)
        var Ja = se ? x(Ut, ct, Ae, _, g, j) : x(ct, Ut, Ae, g, _, j);
      if (!(Ja === void 0 ? ct === Ut || ee(ct, Ut, $, x, j) : Ja)) {
        He = !1;
        break;
      }
      gt || (gt = Ae == "constructor");
    }
    if (He && !gt) {
      var Pr = g.constructor, Nr = _.constructor;
      Pr != Nr && "constructor" in g && "constructor" in _ && !(typeof Pr == "function" && Pr instanceof Pr && typeof Nr == "function" && Nr instanceof Nr) && (He = !1);
    }
    return j.delete(g), j.delete(_), He;
  }
  function Wa(g) {
    return Kf(g, hd, id);
  }
  function Rr(g, _) {
    var $ = g.__data__;
    return ad(_) ? $[typeof _ == "string" ? "string" : "hash"] : $.map;
  }
  function tn(g, _) {
    var $ = We(g, _);
    return Qf($) ? $ : void 0;
  }
  function rd(g) {
    var _ = nt.call(g, Dt), $ = g[Dt];
    try {
      g[Dt] = void 0;
      var x = !0;
    } catch {
    }
    var ee = La.call(g);
    return x && (_ ? g[Dt] = $ : delete g[Dt]), ee;
  }
  var id = Ba ? function(g) {
    return g == null ? [] : (g = Object(g), v(Ba(g), function(_) {
      return Ma.call(g, _);
    }));
  } : pd, mt = Dn;
  (Bi && mt(new Bi(new ArrayBuffer(1))) != z || Pn && mt(new Pn()) != y || ji && mt(ji.resolve()) != D || Hi && mt(new Hi()) != X || Gi && mt(new Gi()) != w) && (mt = function(g) {
    var _ = Dn(g), $ = _ == T ? g.constructor : void 0, x = $ ? Lt($) : "";
    if (x)
      switch (x) {
        case Sf:
          return z;
        case Af:
          return y;
        case Tf:
          return D;
        case Cf:
          return X;
        case $f:
          return w;
      }
    return _;
  });
  function od(g, _) {
    return _ = _ ?? a, !!_ && (typeof g == "number" || de.test(g)) && g > -1 && g % 1 == 0 && g < _;
  }
  function ad(g) {
    var _ = typeof g;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? g !== "__proto__" : g === null;
  }
  function sd(g) {
    return !!xa && xa in g;
  }
  function ld(g) {
    var _ = g && g.constructor, $ = typeof _ == "function" && _.prototype || Nt;
    return g === $;
  }
  function cd(g) {
    return La.call(g);
  }
  function Lt(g) {
    if (g != null) {
      try {
        return Fa.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Va(g, _) {
    return g === _ || g !== g && _ !== _;
  }
  var ud = Ha(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Ha : function(g) {
    return Fn(g) && nt.call(g, "callee") && !Ma.call(g, "callee");
  }, Or = Array.isArray;
  function fd(g) {
    return g != null && za(g.length) && !Ya(g);
  }
  var Wi = vf || md;
  function dd(g, _) {
    return Ga(g, _);
  }
  function Ya(g) {
    if (!Xa(g))
      return !1;
    var _ = Dn(g);
    return _ == m || _ == E || _ == p || _ == k;
  }
  function za(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= a;
  }
  function Xa(g) {
    var _ = typeof g;
    return g != null && (_ == "object" || _ == "function");
  }
  function Fn(g) {
    return g != null && typeof g == "object";
  }
  var Ka = A ? _e(A) : Zf;
  function hd(g) {
    return fd(g) ? Xf(g) : ed(g);
  }
  function pd() {
    return [];
  }
  function md() {
    return !1;
  }
  e.exports = dd;
})(di, di.exports);
var Bw = di.exports;
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.DownloadedUpdateHelper = void 0;
wr.createTempUpdateFile = Ww;
const jw = fr, Hw = It, fl = Bw, Bt = Ot, Vn = ae;
class Gw {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Vn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return fl(this.versionInfo, n) && fl(this.fileInfo.info, r.info) && await (0, Bt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, a) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Bt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Bt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, n) {
    const r = this.getUpdateInfoFile();
    if (!await (0, Bt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Bt.readJson)(r);
    } catch (p) {
      let c = "No cached update info available";
      return p.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${p.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Vn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Bt.pathExists)(s))
      return n.info("Cached update file doesn't exist"), null;
    const l = await qw(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Vn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
wr.DownloadedUpdateHelper = Gw;
function qw(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, jw.createHash)(t);
    a.on("error", o).setEncoding(n), (0, Hw.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function Ww(e, t, n) {
  let r = 0, i = Vn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Bt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${a}`), i = Vn.join(t, `${r++}-${e}`);
    }
  return i;
}
var Ri = {}, Ia = {};
Object.defineProperty(Ia, "__esModule", { value: !0 });
Ia.getAppCacheDir = Yw;
const uo = ae, Vw = mi;
function Yw() {
  const e = (0, Vw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || uo.join(e, "AppData", "Local") : process.platform === "darwin" ? t = uo.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || uo.join(e, ".cache"), t;
}
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.ElectronAppAdapter = void 0;
const dl = ae, zw = Ia;
class Xw {
  constructor(t = zt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? dl.join(process.resourcesPath, "app-update.yml") : dl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, zw.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (n, r) => t(r));
  }
}
Ri.ElectronAppAdapter = Xw;
var Zu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = pe;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return zt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, p, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (h) => {
            h == null ? l(a) : p(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const s = zt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, p) {
      o.on("redirect", (c, f, h) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : p(t.HttpExecutor.prepareRedirectUrlOptions(h, a));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(Zu);
var vr = {}, tt = {};
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.newBaseUrl = Kw;
tt.newUrlFromBase = Jw;
tt.getChannelFilename = Qw;
const ef = Rt;
function Kw(e) {
  const t = new ef.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Jw(e, t, n = !1) {
  const r = new ef.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function Qw(e) {
  return `${e}.yml`;
}
var fe = {}, Zw = "[object Symbol]", tf = /[\\^$.*+?()[\]{}|]/g, ev = RegExp(tf.source), tv = typeof Re == "object" && Re && Re.Object === Object && Re, nv = typeof self == "object" && self && self.Object === Object && self, rv = tv || nv || Function("return this")(), iv = Object.prototype, ov = iv.toString, hl = rv.Symbol, pl = hl ? hl.prototype : void 0, ml = pl ? pl.toString : void 0;
function av(e) {
  if (typeof e == "string")
    return e;
  if (lv(e))
    return ml ? ml.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function sv(e) {
  return !!e && typeof e == "object";
}
function lv(e) {
  return typeof e == "symbol" || sv(e) && ov.call(e) == Zw;
}
function cv(e) {
  return e == null ? "" : av(e);
}
function uv(e) {
  return e = cv(e), e && ev.test(e) ? e.replace(tf, "\\$&") : e;
}
var nf = uv;
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.Provider = void 0;
fe.findFile = mv;
fe.parseUpdateInfo = gv;
fe.getFileList = rf;
fe.resolveFiles = yv;
const $t = pe, fv = we, dv = Rt, hi = tt, hv = nf;
class pv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, hi.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, hi.newUrlFromBase)(`${t.pathname.replace(new RegExp(hv(r), "g"), n)}.blockmap`, i ? new dv.URL(i) : t), o];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, n, r) {
    return this.executor.request(this.createRequestOptions(t, n), r);
  }
  createRequestOptions(t, n) {
    const r = {};
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, $t.configureRequestUrl)(t, r), r;
  }
}
fe.Provider = pv;
function mv(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, $t.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((a) => !n.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function gv(e, t, n) {
  if (e == null)
    throw (0, $t.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, fv.load)(e);
  } catch (i) {
    throw (0, $t.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function rf(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, $t.newError)(`No files provided: ${(0, $t.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function yv(e, t, n = (r) => r) {
  const i = rf(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, $t.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, $t.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, hi.newUrlFromBase)(n(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, hi.newUrlFromBase)(n(a.path), t).href
  }), i;
}
Object.defineProperty(vr, "__esModule", { value: !0 });
vr.GenericProvider = void 0;
const gl = pe, fo = tt, ho = fe;
class Ev extends ho.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, fo.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, fo.getChannelFilename)(this.channel), n = (0, fo.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, ho.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof gl.HttpError && i.statusCode === 404)
          throw (0, gl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, ho.resolveFiles)(t, this.baseUrl);
  }
}
vr.GenericProvider = Ev;
var Oi = {}, Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.BitbucketProvider = void 0;
const yl = pe, po = tt, mo = fe;
class wv extends mo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, po.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new yl.CancellationToken(), n = (0, po.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, po.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, mo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, yl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, mo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
Pi.BitbucketProvider = wv;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.GitHubProvider = bt.BaseGitHubProvider = void 0;
bt.computeReleaseNotes = af;
const ft = pe, Gt = Qu, vv = Rt, dn = tt, Go = fe, go = /\/tag\/([^/]+)$/;
class of extends Go.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, dn.newBaseUrl)((0, ft.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, dn.newBaseUrl)((0, ft.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
bt.BaseGitHubProvider = of;
class _v extends of {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const a = new ft.CancellationToken(), s = await this.httpRequest((0, dn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, ft.parseXml)(s);
    let p = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const S = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Gt.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (S === null)
          c = go.exec(p.element("link").attribute("href"))[1];
        else
          for (const C of l.getElements("entry")) {
            const T = go.exec(C.element("link").attribute("href"));
            if (T === null)
              continue;
            const D = T[1], k = ((r = Gt.prerelease(D)) === null || r === void 0 ? void 0 : r[0]) || null, G = !S || ["alpha", "beta"].includes(S), X = k !== null && !["alpha", "beta"].includes(String(k));
            if (G && !X && !(S === "beta" && k === "alpha")) {
              c = D;
              break;
            }
            if (k && k === S) {
              c = D;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const S of l.getElements("entry"))
          if (go.exec(S.element("link").attribute("href"))[1] === c) {
            p = S;
            break;
          }
      }
    } catch (S) {
      throw (0, ft.newError)(`Cannot parse releases feed: ${S.stack || S.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, ft.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", m = "";
    const E = async (S) => {
      h = (0, dn.getChannelFilename)(S), m = (0, dn.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const C = this.createRequestOptions(m);
      try {
        return await this.executor.request(C, a);
      } catch (T) {
        throw T instanceof ft.HttpError && T.statusCode === 404 ? (0, ft.newError)(`Cannot find ${h} in the latest release artifacts (${m}): ${T.stack || T.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : T;
      }
    };
    try {
      let S = this.channel;
      this.updater.allowPrerelease && (!((i = Gt.prerelease(c)) === null || i === void 0) && i[0]) && (S = this.getCustomChannelName(String((o = Gt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await E(S);
    } catch (S) {
      if (this.updater.allowPrerelease)
        f = await E(this.getDefaultChannelName());
      else
        throw S;
    }
    const y = (0, Go.parseUpdateInfo)(f, h, m);
    return y.releaseName == null && (y.releaseName = p.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = af(this.updater.currentVersion, this.updater.fullChangelog, l, p)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, dn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new vv.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, ft.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Go.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
bt.GitHubProvider = _v;
function El(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function af(e, t, n, r) {
  if (!t)
    return El(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Gt.valid(a) && Gt.lt(e, a) && i.push({
      version: a,
      note: El(o)
    });
  }
  return i.sort((o, a) => Gt.rcompare(o.version, a.version));
}
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.GitLabProvider = void 0;
const be = pe, yo = Rt, Sv = nf, Wr = tt, Eo = fe;
class Av extends Eo.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, n, r) {
    super({
      ...r,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = n, this.cachedLatestVersion = null;
    const o = t.host || "gitlab.com";
    this.baseApiUrl = (0, Wr.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new be.CancellationToken(), n = (0, Wr.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let r;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, m = await this.httpRequest(n, h, t);
      if (!m)
        throw (0, be.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      r = JSON.parse(m);
    } catch (h) {
      throw (0, be.newError)(`Unable to find latest release on GitLab (${n}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = r.tag_name;
    let o = null, a = "", s = null;
    const l = async (h) => {
      a = (0, Wr.getChannelFilename)(h);
      const m = r.assets.links.find((y) => y.name === a);
      if (!m)
        throw (0, be.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new yo.URL(m.direct_asset_url);
      const E = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const y = await this.httpRequest(s, E, t);
        if (!y)
          throw (0, be.newError)(`Empty response from ${s}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return y;
      } catch (y) {
        throw y instanceof be.HttpError && y.statusCode === 404 ? (0, be.newError)(`Cannot find ${a} in the latest release artifacts (${s}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
    };
    try {
      o = await l(this.channel);
    } catch (h) {
      if (this.channel !== this.getDefaultChannelName())
        o = await l(this.getDefaultChannelName());
      else
        throw h;
    }
    if (!o)
      throw (0, be.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const p = (0, Eo.parseUpdateInfo)(o, a, s);
    p.releaseName == null && (p.releaseName = r.name), p.releaseNotes == null && (p.releaseNotes = r.description || null);
    const c = /* @__PURE__ */ new Map();
    for (const h of r.assets.links)
      c.set(this.normalizeFilename(h.name), h.direct_asset_url);
    const f = {
      tag: i,
      assets: c,
      ...p
    };
    return this.cachedLatestVersion = f, f;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const n = /* @__PURE__ */ new Map();
    for (const r of t.links)
      n.set(this.normalizeFilename(r.name), r.direct_asset_url);
    return n;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, n) {
    const r = [`${n}.blockmap`, `${this.normalizeFilename(n)}.blockmap`];
    for (const i of r) {
      const o = t.get(i);
      if (o)
        return new yo.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const n = new be.CancellationToken(), r = [`v${t}`, t];
    for (const i of r) {
      const o = (0, Wr.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, s = await this.httpRequest(o, a, n);
        if (s)
          return JSON.parse(s);
      } catch (a) {
        if (a instanceof be.HttpError && a.statusCode === 404)
          continue;
        throw (0, be.newError)(`Unable to find release ${i} on GitLab (${o}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, be.newError)(`Unable to find release with version ${t} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const n = {};
    return t != null && (t.startsWith("Bearer") ? n.authorization = t : n["PRIVATE-TOKEN"] = t), n;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const n = await this.fetchReleaseInfoByVersion(t);
    return n && n.assets ? this.convertAssetsToMap(n.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, n, r) {
    let i = null, o = null;
    const a = await this.getVersionInfoForBlockMap(n);
    a && (i = this.findBlockMapInAssets(a, r));
    const s = await this.getVersionInfoForBlockMap(t);
    if (s) {
      const l = r.replace(new RegExp(Sv(n), "g"), t);
      o = this.findBlockMapInAssets(s, l);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, n, r, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [a, s] = await this.findBlockMapUrlsFromAssets(n, r, o);
      if (!s)
        throw (0, be.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, be.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, s];
    } else
      return super.getBlockMapFiles(t, n, r, i);
  }
  resolveFiles(t) {
    return (0, Eo.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, be.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new yo.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Ni.GitLabProvider = Av;
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.KeygenProvider = void 0;
const wl = pe, wo = tt, vo = fe;
class Tv extends vo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, wo.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new wl.CancellationToken(), n = (0, wo.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, wo.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, vo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, wl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, vo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
Di.KeygenProvider = Tv;
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.PrivateGitHubProvider = void 0;
const on = pe, Cv = we, $v = ae, vl = Rt, _l = tt, bv = bt, Iv = fe;
class Rv extends bv.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new on.CancellationToken(), n = (0, _l.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, on.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new vl.URL(i.url);
    let a;
    try {
      a = (0, Cv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof on.HttpError && s.statusCode === 404 ? (0, on.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = r.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const n = this.updater.allowPrerelease;
    let r = this.basePath;
    n || (r = `${r}/latest`);
    const i = (0, _l.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, on.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Iv.getFileList)(t).map((n) => {
      const r = $v.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, on.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new vl.URL(i.url),
        info: n
      };
    });
  }
}
Fi.PrivateGitHubProvider = Rv;
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.isUrlProbablySupportMultiRangeRequests = sf;
Oi.createClient = xv;
const Vr = pe, Ov = Pi, Sl = vr, Pv = bt, Nv = Ni, Dv = Di, Fv = Fi;
function sf(e) {
  return !e.includes("s3.amazonaws.com");
}
function xv(e, t, n) {
  if (typeof e == "string")
    throw (0, Vr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Pv.GitHubProvider(i, t, n) : new Fv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new Ov.BitbucketProvider(e, t, n);
    case "gitlab":
      return new Nv.GitLabProvider(e, t, n);
    case "keygen":
      return new Dv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Sl.GenericProvider({
        provider: "generic",
        url: (0, Vr.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Sl.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && sf(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Vr.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Vr.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var xi = {}, _r = {}, $n = {}, Zt = {};
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.OperationKind = void 0;
Zt.computeOperations = Lv;
var qt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(qt || (Zt.OperationKind = qt = {}));
function Lv(e, t, n) {
  const r = Tl(e.files), i = Tl(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, p = r.get(l);
  if (p == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: m } = kv(r.get(l), p.offset, n);
  let E = a.offset;
  for (let y = 0; y < c.checksums.length; E += c.sizes[y], y++) {
    const S = c.sizes[y], C = c.checksums[y];
    let T = h.get(C);
    T != null && m.get(C) !== S && (n.warn(`Checksum ("${C}") matches, but size differs (old: ${m.get(C)}, new: ${S})`), T = void 0), T === void 0 ? (f++, o != null && o.kind === qt.DOWNLOAD && o.end === E ? o.end += S : (o = {
      kind: qt.DOWNLOAD,
      start: E,
      end: E + S
      // oldBlocks: null,
    }, Al(o, s, C, y))) : o != null && o.kind === qt.COPY && o.end === T ? o.end += S : (o = {
      kind: qt.COPY,
      start: T,
      end: T + S
      // oldBlocks: [checksum]
    }, Al(o, s, C, y));
  }
  return f > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Uv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Al(e, t, n, r) {
  if (Uv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${qt[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function kv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], p = i.get(s);
    if (p === void 0)
      r.set(s, o), i.set(s, l);
    else if (n.debug != null) {
      const c = p === l ? "(same size)" : `(size: ${p}, this size: ${l})`;
      n.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function Tl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty($n, "__esModule", { value: !0 });
$n.DataSplitter = void 0;
$n.copyData = lf;
const Yr = pe, Mv = It, Bv = ur, jv = Zt, Cl = Buffer.from(`\r
\r
`);
var Et;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Et || (Et = {}));
function lf(e, t, n, r, i) {
  const o = (0, Mv.createReadStream)("", {
    fd: n,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", r), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class Hv extends Bv.Writable {
  constructor(t, n, r, i, o, a, s, l) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = l, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = Et.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, n, r) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      r();
    }).catch(r);
  }
  async handleData(t) {
    let n = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Yr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === Et.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = Et.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Et.BODY)
          this.readState = Et.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Yr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Yr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = Et.HEADER;
            return;
          }
        }
        const r = this.partIndexToLength[this.partIndex], i = n + r, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, n, o), this.remainingPartDataCount = r - (o - n), this.remainingPartDataCount > 0)
          return;
        if (n = i + this.boundaryLength, n >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, n) {
    return new Promise((r, i) => {
      const o = () => {
        if (t === n) {
          r();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== jv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        lf(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Cl, n);
    if (r !== -1)
      return r + Cl.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Yr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n, this.transferred += r - n, this.delta += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
$n.DataSplitter = Hv;
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.executeTasksUsingMultipleRangeRequests = Gv;
Li.checkIsRangesSupported = Wo;
const qo = pe, $l = $n, bl = Zt;
function Gv(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    qv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function qv(e, t, n, r, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), p = [];
  for (let h = t.start; h < t.end; h++) {
    const m = t.tasks[h];
    m.kind === bl.OperationKind.DOWNLOAD && (o += `${m.start}-${m.end - 1}, `, l.set(a, h), a++, p.push(m.end - m.start), s += m.end - m.start);
  }
  if (a <= 1) {
    const h = (m) => {
      if (m >= t.end) {
        r();
        return;
      }
      const E = t.tasks[m++];
      if (E.kind === bl.OperationKind.COPY)
        (0, $l.copyData)(E, n, t.oldFileFd, i, () => h(m));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${E.start}-${E.end - 1}`;
        const S = e.httpExecutor.createRequest(y, (C) => {
          C.on("error", i), Wo(C, i) && (C.pipe(n, {
            end: !1
          }), C.once("end", () => h(m)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(S, i), S.end();
      }
    };
    h(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(c, (h) => {
    if (!Wo(h, i))
      return;
    const m = (0, qo.safeGetHeader)(h, "content-type"), E = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(m);
    if (E == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${m}"`));
      return;
    }
    const y = new $l.DataSplitter(n, t, l, E[1] || E[2], p, r, s, e.options.onProgress);
    y.on("error", i), h.pipe(y), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Wo(e, t) {
  if (e.statusCode >= 400)
    return t((0, qo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, qo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.ProgressDifferentialDownloadCallbackTransform = void 0;
const Wv = ur;
var hn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(hn || (hn = {}));
class Vv extends Wv.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = hn.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == hn.COPY) {
      r(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  beginFileCopy() {
    this.operationType = hn.COPY;
  }
  beginRangeDownload() {
    this.operationType = hn.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Ui.ProgressDifferentialDownloadCallbackTransform = Vv;
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.DifferentialDownloader = void 0;
const Un = pe, _o = Ot, Yv = It, zv = $n, Xv = Rt, zr = Zt, Il = Li, Kv = Ui;
class Jv {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, n, r) {
    this.blockAwareFileInfo = t, this.httpExecutor = n, this.options = r, this.fileMetadataBuffer = null, this.logger = r.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, Un.configureRequestUrl)(this.options.newUrl, t), (0, Un.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, zr.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const p = l.end - l.start;
      l.kind === zr.OperationKind.DOWNLOAD ? o += p : a += p;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return r.info(`Full: ${Rl(s)}, To download: ${Rl(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, _o.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, _o.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, _o.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Yv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let p;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const C = [];
        let T = 0;
        for (const k of t)
          k.kind === zr.OperationKind.DOWNLOAD && (C.push(k.end - k.start), T += k.end - k.start);
        const D = {
          expectedByteCounts: C,
          grandTotal: T
        };
        p = new Kv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(p);
      }
      const c = new Un.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            c.validate();
          } catch (C) {
            s(C);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const C of l)
        C.on("error", s), f == null ? f = C : f = f.pipe(C);
      const h = l[0];
      let m;
      if (this.options.isUseMultipleRangeRequest) {
        m = (0, Il.executeTasksUsingMultipleRangeRequests)(this, t, h, r, s), m(0);
        return;
      }
      let E = 0, y = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const S = this.createRequestOptions();
      S.redirect = "manual", m = (C) => {
        var T, D;
        if (C >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const k = t[C++];
        if (k.kind === zr.OperationKind.COPY) {
          p && p.beginFileCopy(), (0, zv.copyData)(k, h, r, s, () => m(C));
          return;
        }
        const G = `bytes=${k.start}-${k.end - 1}`;
        S.headers.range = G, (D = (T = this.logger) === null || T === void 0 ? void 0 : T.debug) === null || D === void 0 || D.call(T, `download range: ${G}`), p && p.beginRangeDownload();
        const X = this.httpExecutor.createRequest(S, (Z) => {
          Z.on("error", s), Z.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), Z.statusCode >= 400 && s((0, Un.createHttpError)(Z)), Z.pipe(h, {
            end: !1
          }), Z.once("end", () => {
            p && p.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => m(C), 1e3)) : m(C);
          });
        });
        X.on("redirect", (Z, te, L) => {
          this.logger.info(`Redirect to ${Qv(L)}`), y = L, (0, Un.configureRequestUrl)(new Xv.URL(y), S), X.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(X, s), X.end();
      }, m(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(r, o), o += a.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, Il.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", n), a.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
_r.DifferentialDownloader = Jv;
function Rl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Qv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.GenericDifferentialDownloader = void 0;
const Zv = _r;
class e_ extends Zv.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
xi.GenericDifferentialDownloader = e_;
var Pt = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = pe;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class n {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      r(this.emitter, "login", o);
    }
    progress(o) {
      r(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      r(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      r(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = n;
  function r(i, o, a) {
    i.on(o, a);
  }
})(Pt);
Object.defineProperty(At, "__esModule", { value: !0 });
At.NoOpLogger = At.AppUpdater = void 0;
const Ie = pe, t_ = fr, n_ = mi, r_ = Zl, ze = Ot, i_ = we, So = Ai, Xe = ae, jt = Qu, Ol = wr, o_ = Ri, Pl = Zu, a_ = vr, Ao = Oi, To = tc, s_ = xi, an = Pt;
class Ra extends r_.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Ie.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ie.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, Pl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new cf();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new So.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, n) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new an.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new So.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new So.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new o_.ElectronAppAdapter(), this.httpExecutor = new Pl.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, jt.parse)(r);
    if (i == null)
      throw (0, Ie.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = l_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const n = this.createProviderRuntimeOptions();
    let r;
    typeof t == "string" ? r = new a_.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, Ao.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, Ao.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const n = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((r) => (n(), r)).catch((r) => {
      throw n(), this.emit("error", r, `Cannot check for updates: ${(r.stack || r).toString()}`), r;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((n) => n != null && n.downloadPromise ? (n.downloadPromise.then(() => {
      const r = Ra.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new zt.Notification(r).show();
    }), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
  }
  static formatDownloadNotification(t, n, r) {
    return r == null && (r = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), r = {
      title: r.title.replace("{appName}", n).replace("{version}", t),
      body: r.body.replace("{appName}", n).replace("{version}", t)
    }, r;
  }
  async isStagingMatch(t) {
    const n = t.stagingPercentage;
    let r = n;
    if (r == null)
      return !0;
    if (r = parseInt(r, 10), isNaN(r))
      return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
    r = r / 100;
    const i = await this.stagingUserIdPromise.value, a = Ie.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, jt.parse)(t.version);
    if (n == null)
      throw (0, Ie.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, jt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, jt.gt)(n, r), a = (0, jt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, n_.release)();
    if (n)
      try {
        if ((0, jt.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, Ao.createClient)(r, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, n = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": n })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), n = t.info;
    if (!await this.isUpdateAvailable(n))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
        isUpdateAvailable: !1,
        versionInfo: n,
        updateInfo: n
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(n);
    const r = new Ie.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ie.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ie.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ie.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof Ie.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: n,
      requestHeaders: this.computeRequestHeaders(n.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw r(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(an.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, i_.load)(await (0, ze.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const n = t.fileExtraDownloadHeaders;
    if (n != null) {
      const r = this.requestHeaders;
      return r == null ? n : {
        ...n,
        ...r
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Xe.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, ze.readFile)(t, "utf-8");
      if (Ie.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Ie.UUID.v5((0, t_.randomBytes)(4096), Ie.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, ze.outputFile)(t, n);
    } catch (r) {
      this._logger.warn(`Couldn't write out staging user ID: ${r}`);
    }
    return n;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const n of Object.keys(t)) {
      const r = n.toLowerCase();
      if (r === "authorization" || r === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const n = (await this.configOnDisk.value).updaterCacheDirName, r = this._logger;
      n == null && r.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Xe.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new Ol.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const n = t.fileInfo, r = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: n.info.sha2,
      sha512: n.info.sha512
    };
    this.listenerCount(an.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (T) => this.emit(an.DOWNLOAD_PROGRESS, T));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = n.packageInfo;
    function s() {
      const T = decodeURIComponent(t.fileInfo.url.pathname);
      return T.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Xe.basename(T) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), p = l.cacheDirForPendingUpdate;
    await (0, ze.mkdir)(p, { recursive: !0 });
    const c = s();
    let f = Xe.join(p, c);
    const h = a == null ? null : Xe.join(p, `package-${o}${Xe.extname(a.path) || ".7z"}`), m = async (T) => {
      await l.setDownloadedFile(f, h, i, n, c, T), await t.done({
        ...i,
        downloadedFile: f
      });
      const D = Xe.join(p, "current.blockmap");
      return await (0, ze.pathExists)(D) && await (0, ze.copyFile)(D, Xe.join(l.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, E = this._logger, y = await l.validateDownloadedPath(f, i, n, E);
    if (y != null)
      return f = y, await m(!1);
    const S = async () => (await l.clear().catch(() => {
    }), await (0, ze.unlink)(f).catch(() => {
    })), C = await (0, Ol.createTempUpdateFile)(`temp-${c}`, p, E);
    try {
      await t.task(C, r, h, S), await (0, Ie.retry)(() => (0, ze.rename)(C, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (T) => T instanceof Error && /^EBUSY:/.test(T.message) ? !0 : (E.warn(`Cannot rename temp file to final file: ${T.message || T.stack}`), !1)
      });
    } catch (T) {
      throw await S(), T instanceof Ie.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), T;
    }
    return E.info(`New version ${o} has been downloaded to ${f}`), await m(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = n.updateInfoAndProvider.provider, s = await a.getBlockMapFiles(t.url, this.app.version, n.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const l = async (E) => {
        const y = await this.httpExecutor.downloadToBuffer(E, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (y == null || y.length === 0)
          throw new Error(`Blockmap "${E.href}" is empty`);
        try {
          return JSON.parse((0, To.gunzipSync)(y).toString());
        } catch (S) {
          throw new Error(`Cannot parse blockmap "${E.href}", error: ${S}`);
        }
      }, p = {
        newUrl: t.url,
        oldFile: Xe.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(an.DOWNLOAD_PROGRESS) > 0 && (p.onProgress = (E) => this.emit(an.DOWNLOAD_PROGRESS, E));
      const c = async (E, y) => {
        const S = Xe.join(y, "current.blockmap");
        await (0, ze.outputFile)(S, (0, To.gzipSync)(JSON.stringify(E)));
      }, f = async (E) => {
        const y = Xe.join(E, "current.blockmap");
        try {
          if (await (0, ze.pathExists)(y))
            return JSON.parse((0, To.gunzipSync)(await (0, ze.readFile)(y)).toString());
        } catch (S) {
          this._logger.warn(`Cannot parse blockmap "${y}", error: ${S}`);
        }
        return null;
      }, h = await l(s[1]);
      await c(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let m = await f(this.downloadedUpdateHelper.cacheDir);
      return m == null && (m = await l(s[0])), await new s_.GenericDifferentialDownloader(t.info, this.httpExecutor, p).download(m, h), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
At.AppUpdater = Ra;
function l_(e) {
  const t = (0, jt.prerelease)(e);
  return t != null && t.length > 0;
}
class cf {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
At.NoOpLogger = cf;
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.BaseUpdater = void 0;
const Nl = pi, c_ = At;
class u_ extends c_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      zt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (n) => (this.dispatchUpdateDownloaded(n), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, n = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const r = this.downloadedUpdateHelper, i = this.installerPath, o = r == null ? null : r.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${n}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: n,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, n = [], r = {}) {
    this._logger.info(`Executing: ${t} with args: ${n}`);
    const i = (0, Nl.spawnSync)(t, n, {
      env: { ...process.env, ...r },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (a != null && a !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, n = [], r = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${n}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: r, detached: !0 }, l = (0, Nl.spawn)(t, n, s);
        l.on("error", (p) => {
          a(p);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
Qt.BaseUpdater = u_;
var nr = {}, Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const sn = Ot, f_ = _r, d_ = tc;
class h_ extends f_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = uf(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await p_(this.options.oldFile), i);
  }
}
Sr.FileWithEmbeddedBlockMapDifferentialDownloader = h_;
function uf(e) {
  return JSON.parse((0, d_.inflateRawSync)(e).toString());
}
async function p_(e) {
  const t = await (0, sn.open)(e, "r");
  try {
    const n = (await (0, sn.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, sn.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, sn.read)(t, i, 0, i.length, n - r.length - i.length), await (0, sn.close)(t), uf(i);
  } catch (n) {
    throw await (0, sn.close)(t), n;
  }
}
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.AppImageUpdater = void 0;
const Dl = pe, Fl = pi, m_ = Ot, g_ = It, kn = ae, y_ = Qt, E_ = Sr, w_ = fe, xl = Pt;
class v_ extends y_.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, w_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Dl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, a, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, m_.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, n, r, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: n,
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(xl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(xl.DOWNLOAD_PROGRESS, s)), await new E_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, Dl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, g_.unlinkSync)(n);
    let r;
    const i = kn.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    kn.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = kn.join(kn.dirname(n), kn.basename(o)), (0, Fl.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Fl.execFileSync)(r, [], { env: a })), !0;
  }
}
nr.AppImageUpdater = v_;
var rr = {}, bn = {};
Object.defineProperty(bn, "__esModule", { value: !0 });
bn.LinuxUpdater = void 0;
const __ = Qt;
class S_ extends __.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: n } = this.app, r = `"${n} would like to update"`, i = this.sudoWithArgs(r);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let o = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (o = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${o}/bin/bash`, "-c", `'${t.join(" ")}'${o}`]);
  }
  sudoWithArgs(t) {
    const n = this.determineSudoCommand(), r = [n];
    return /kdesudo/i.test(n) ? (r.push("--comment", t), r.push("-c")) : /gksudo/i.test(n) ? r.push("--message", t) : /pkexec/i.test(n) && r.push("--disable-internal-agent"), r;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const n of t)
      if (this.hasCommand(n))
        return n;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var n;
    const r = (n = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || n === void 0 ? void 0 : n.trim();
    if (r)
      return r;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
bn.LinuxUpdater = S_;
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.DebUpdater = void 0;
const A_ = fe, Ll = Pt, T_ = bn;
class Oa extends T_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, A_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Ll.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ll.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const r = ["dpkg", "apt"], i = this.detectPackageManager(r);
    try {
      Oa.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    var o;
    if (t === "dpkg")
      try {
        r(["dpkg", "-i", n]);
      } catch (a) {
        i.warn((o = a.message) !== null && o !== void 0 ? o : a), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), r(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), r([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        n
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
rr.DebUpdater = Oa;
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.PacmanUpdater = void 0;
const Ul = Pt, C_ = fe, $_ = bn;
class Pa extends $_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, C_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Ul.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ul.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      Pa.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (r) {
      return this.dispatchError(r), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r) {
    var i;
    try {
      n(["pacman", "-U", "--noconfirm", t]);
    } catch (o) {
      r.warn((i = o.message) !== null && i !== void 0 ? i : o), r.warn("pacman installation failed, attempting to update package database and retry");
      try {
        n(["pacman", "-Sy", "--noconfirm"]), n(["pacman", "-U", "--noconfirm", t]);
      } catch (a) {
        throw r.error("Retry after pacman -Sy failed"), a;
      }
    }
  }
}
ir.PacmanUpdater = Pa;
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.RpmUpdater = void 0;
const kl = Pt, b_ = fe, I_ = bn;
class Na extends I_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, b_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(kl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(kl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(r);
    try {
      Na.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    if (t === "zypper")
      return r(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", n]);
    if (t === "dnf")
      return r(["dnf", "install", "--nogpgcheck", "-y", n]);
    if (t === "yum")
      return r(["yum", "install", "--nogpgcheck", "-y", n]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), r(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", n]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
or.RpmUpdater = Na;
var ar = {};
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.MacUpdater = void 0;
const Ml = pe, Co = Ot, R_ = It, Bl = ae, O_ = _d, P_ = At, N_ = fe, jl = pi, Hl = fr;
class D_ extends P_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = zt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
      this._logger.warn(r), this.emit("error", r);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let n = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const r = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, jl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, jl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${h}`), a = a || h;
    } catch (f) {
      r.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    a && n.some(s) ? n = n.filter((f) => a === s(f)) : n = n.filter((f) => !s(f));
    const l = (0, N_.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Ml.newError)(`ZIP file not provided: ${(0, Ml.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const p = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const m = Bl.join(this.downloadedUpdateHelper.cacheDir, c), E = () => (0, Co.pathExistsSync)(m) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        E() && (y = await this.differentialDownloadInstaller(l, t, f, p, c)), y && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Bl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Co.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, Co.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, O_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (p) => {
      const c = p.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((p, c) => {
      const f = (0, Hl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), m = `/${(0, Hl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, y) => {
        const S = E.url;
        if (a.info(`${S} requested`), S === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const D = E.headers.authorization.split(" ")[1], k = Buffer.from(D, "base64").toString("ascii"), [G, X] = k.split(":");
          if (G !== "autoupdater" || X !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const Z = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": Z.length }), y.end(Z);
          return;
        }
        if (!S.startsWith(m)) {
          a.warn(`${S} requested, but not supported`), y.writeHead(404), y.end();
          return;
        }
        a.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let C = !1;
        y.on("finish", () => {
          C || (this.nativeUpdater.removeListener("error", c), p([]));
        });
        const T = (0, R_.createReadStream)(i);
        T.on("error", (D) => {
          try {
            y.end();
          } catch (k) {
            a.warn(`cannot end response: ${k}`);
          }
          C = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${D}`));
        }), y.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), T.pipe(y);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : p([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
ar.MacUpdater = D_;
var sr = {}, Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
Da.verifySignature = x_;
const Gl = pe, ff = pi, F_ = mi, ql = ae;
function df(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function x_(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, ff.execFile)(...df(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var p;
      try {
        if (a != null || l) {
          $o(n, a, l, i), r(null);
          return;
        }
        const c = L_(s);
        if (c.Status === 0) {
          try {
            const E = ql.normalize(c.Path), y = ql.normalize(t);
            if (n.info(`LiteralPath: ${E}. Update Path: ${y}`), E !== y) {
              $o(n, new Error(`LiteralPath of ${E} is different than ${y}`), l, i), r(null);
              return;
            }
          } catch (E) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = E.message) !== null && p !== void 0 ? p : E.stack}`);
          }
          const h = (0, Gl.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const E of e) {
            const y = (0, Gl.parseDn)(E);
            if (y.size ? m = Array.from(y.keys()).every((C) => y.get(C) === h.get(C)) : E === h.get("CN") && (n.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, m) => h === "RawData" ? void 0 : m, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (c) {
        $o(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function L_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function $o(e, t, n, r) {
  if (U_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, ff.execFileSync)(...df("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function U_() {
  const e = F_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.NsisUpdater = void 0;
const Xr = pe, Wl = ae, k_ = Qt, M_ = Sr, Vl = Pt, B_ = fe, j_ = Ot, H_ = Da, Yl = Rt;
class G_ extends k_.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, H_.verifySignature)(r, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, B_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, a, s) => {
        const l = r.packageInfo, p = l != null && a != null;
        if (p && t.disableWebInstaller)
          throw (0, Xr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !p && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (p || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Xr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Xr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (p && await this.differentialDownloadWebPackage(t, l, a, n))
          try {
            await this.httpExecutor.download(new Yl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, j_.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let n;
    try {
      if (n = (await this.configOnDisk.value).publisherName, n == null)
        return null;
    } catch (r) {
      if (r.code === "ENOENT")
        return null;
      throw r;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(n) ? n : [n], t);
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["--updated"];
    t.isSilent && r.push("/S"), t.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && r.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(Wl.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? zt.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Yl.URL(n.path),
        oldFile: Wl.join(this.downloadedUpdateHelper.cacheDir, Xr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Vl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Vl.DOWNLOAD_PROGRESS, a)), await new M_.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
sr.NsisUpdater = G_;
(function(e) {
  var t = Re && Re.__createBinding || (Object.create ? function(S, C, T, D) {
    D === void 0 && (D = T);
    var k = Object.getOwnPropertyDescriptor(C, T);
    (!k || ("get" in k ? !C.__esModule : k.writable || k.configurable)) && (k = { enumerable: !0, get: function() {
      return C[T];
    } }), Object.defineProperty(S, D, k);
  } : function(S, C, T, D) {
    D === void 0 && (D = T), S[D] = C[T];
  }), n = Re && Re.__exportStar || function(S, C) {
    for (var T in S) T !== "default" && !Object.prototype.hasOwnProperty.call(C, T) && t(C, S, T);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = Ot, i = ae;
  var o = Qt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = At;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = fe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = nr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var p = rr;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return p.DebUpdater;
  } });
  var c = ir;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = or;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = ar;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var m = sr;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
  } }), n(Pt, e);
  let E;
  function y() {
    if (process.platform === "win32")
      E = new sr.NsisUpdater();
    else if (process.platform === "darwin")
      E = new ar.MacUpdater();
    else {
      E = new nr.AppImageUpdater();
      try {
        const S = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(S))
          return E;
        switch ((0, r.readFileSync)(S).toString().trim()) {
          case "deb":
            E = new rr.DebUpdater();
            break;
          case "rpm":
            E = new or.RpmUpdater();
            break;
          case "pacman":
            E = new ir.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (S) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", S.message);
      }
    }
    return E;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => E || y()
  });
})(at);
const Ar = Oe.dirname(yd(import.meta.url));
process.env.APP_ROOT = Oe.join(Ar, "..");
let yn = null, lr = /* @__PURE__ */ new Map();
const Vo = () => {
  const t = [
    Oe.join(Ar, "notifications-monitor.ps1"),
    Oe.join(process.cwd(), "electron", "notifications-monitor.ps1")
  ].find((n) => pn.existsSync(n));
  t && (console.log(`[MAIN] Launching Notification Monitor: ${t}`), yn = Sn("powershell", ["-ExecutionPolicy", "Bypass", "-File", t]), yn.stdout.on("data", (n) => {
    const r = n.toString().split(`
`);
    for (let i of r)
      if (i = i.trim(), i.startsWith("__NOTIF__")) {
        const o = i.replace("__NOTIF__", "").split("|||");
        if (o.length >= 4) {
          const [a, s, l, p] = o;
          lr.set(p, { title: s, app: a }), Je(q, "notification-sync", {
            id: p,
            app: a,
            text: (s + " " + (l || "")).trim()
          });
        }
      } else if (i.startsWith("__REMOVE__")) {
        const o = i.replace("__REMOVE__", "").trim();
        lr.delete(o), Je(q, "notification-remove", o);
      } else i.startsWith("__DEBUG__") && console.log(`[NOTIF_DEBUG] ${i}`);
  }), yn.on("exit", () => setTimeout(Vo, 5e3)));
};
J.on("dismiss-notification", (e, t) => {
  const n = lr.get(String(t));
  if (!n) return;
  const r = `
    $ErrorActionPreference = 'SilentlyContinue'
    [void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]
    $l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
    $o = $l.GetNotificationsAsync(1)
    $asInfo = [Windows.Foundation.IAsyncInfo]$o
    while($asInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(50) }
    $ns = $o.GetResults()
    $t = $ns | Where-Object { 
        ($_.AppInfo.DisplayInfo.DisplayName -match '${n.app}' -or $_.AppInfo.Id -match '${n.app}') -and 
        ($_.Notification.Visual.GetBinding('ToastGeneric').GetTextElements()[0].Text -like '*${n.title.replace(/'/g, "''")}*')
    } | Select-Object -First 1
    if ($t) { $l.RemoveNotification($t.Id) }
  `;
  Sn("powershell", ["-Command", r]), lr.delete(String(t));
});
J.on("clear-all-notifications", () => {
  Sn("powershell", ["-Command", `
    $ErrorActionPreference = 'SilentlyContinue'
    [void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]
    $l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
    $o = $l.GetNotificationsAsync(1)
    $asInfo = [Windows.Foundation.IAsyncInfo]$o
    while($asInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(50) }
    $ns = $o.GetResults()
    foreach($n in $ns) {
      $l.RemoveNotification($n.Id)
    }
  `]), lr.clear();
});
at.autoUpdater.autoDownload = !1;
at.autoUpdater.on("update-available", (e) => {
  Je(q, "update-available", {
    version: e.version,
    releaseNotes: e.releaseNotes,
    releaseDate: e.releaseDate
  });
});
at.autoUpdater.on("download-progress", (e) => {
  Je(q, "update-progress", e.percent);
});
at.autoUpdater.on("update-downloaded", () => {
  Je(q, "update-ready");
});
at.autoUpdater.on("error", (e) => {
  console.error("[UPDATER_ERROR] " + e);
});
J.on("check-for-updates", () => {
  at.autoUpdater.checkForUpdates().catch((e) => console.error("Check failed: " + e));
});
J.on("start-update-download", () => {
  at.autoUpdater.downloadUpdate();
});
J.on("install-update-now", () => {
  at.autoUpdater.quitAndInstall();
});
function q_() {
  Sn("powershell", ["-Command", "[void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]; [Windows.UI.Notifications.Management.UserNotificationListener]::Current.RequestAccessAsync()"]);
}
const zl = process.env.VITE_DEV_SERVER_URL, W_ = Oe.join(process.env.APP_ROOT, "dist");
process.platform === "win32" && Ue.setAppUserModelId("com.notchly.app");
let q, hf = 0, pf = 440, mf = 66, ce = "Teams", Mt = !1, ut = !1, Mn = !1, bo = 0, Bn = null, Yo = null, zo = null, Io = null, Ge = null, Xo = "";
function Je(e, t, ...n) {
  if (!(!e || e.isDestroyed()))
    try {
      const r = e.webContents;
      if (!r || r.isDestroyed() || r.isCrashed()) return;
      const i = r.mainFrame;
      if (i && typeof i.isDestroyed == "function" && i.isDestroyed()) return;
      r.send(t, ...n);
    } catch {
    }
}
const Ko = () => {
  if (!q || q.isDestroyed()) return;
  const e = Xo ? `https://wttr.in/${encodeURIComponent(Xo)}?format=j1` : "https://wttr.in?format=j1";
  wd.get(e, (t) => {
    let n = "";
    t.on("data", (r) => n += r), t.on("end", () => {
      var r, i, o;
      try {
        const a = JSON.parse(n), s = a.current_condition[0], l = (r = a.nearest_area) == null ? void 0 : r[0], p = ((o = (i = l == null ? void 0 : l.areaName) == null ? void 0 : i[0]) == null ? void 0 : o.value) || "Local";
        Je(q, "weather-update", {
          temp: s.temp_C,
          condition: s.weatherDesc[0].value,
          city: p
        });
      } catch {
      }
    });
  }).on("error", () => {
  });
};
J.handle("get-system-audio-id", async () => {
  var t;
  return (t = (await Jl.getSources({ types: ["screen"] }))[0]) == null ? void 0 : t.id;
});
J.removeAllListeners("set-weather-location");
J.on("set-weather-location", (e, t) => {
  Xo = t || "", Ko();
});
J.on("set-is-expanded", (e, t) => {
});
J.on("set-is-super-pill", (e, t) => {
});
J.on("set-is-preview", (e, t) => {
});
J.on("update-island-pos", (e, t) => {
  hf = t;
});
J.on("set-window-dimensions", (e, t) => {
  pf = t.w, mf = t.h;
});
function V_() {
  const e = Qa.getPrimaryDisplay(), { width: t, height: n, x: r, y: i } = e.bounds;
  q = new gd({
    width: t,
    height: 800,
    x: r,
    y: i,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    hasShadow: !1,
    resizable: !1,
    movable: !1,
    // Window itself doesn't move, island moves inside
    webPreferences: {
      preload: Oe.join(Ar, "preload.js"),
      backgroundThrottling: !1,
      autoplayPolicy: "no-user-gesture-required",
      webviewTag: !0
    }
  }), zl ? q.loadURL(zl) : q.loadFile(Oe.join(W_, "index.html")), q.showInactive(), q.setIgnoreMouseEvents(!1), q.setAlwaysOnTop(!0, "screen-saver"), setTimeout(() => {
    typeof Vo == "function" && Vo(), q_(), yf(), cr(), at.autoUpdater.checkForUpdatesAndNotify().catch((a) => console.error("Update check failed: " + a));
  }, 1e3);
  const o = r + t / 2;
  Bn && clearInterval(Bn), Bn = setInterval(() => {
    try {
      if (!q || q.isDestroyed()) return;
      const { x: a, y: s } = Qa.getCursorScreenPoint(), l = o + (hf || 0), p = (pf || 440) / 2, c = mf || 66, f = Math.abs(a - l) < p + 15 && s >= i - 5 && s < i + c + 15, h = l - p, m = a >= h - 320 && a < h - 5 && s >= i - 5 && s < i + 70, E = f || m;
      q.setIgnoreMouseEvents(!E, { forward: !0 });
    } catch {
    }
  }, 30), q.on("closed", () => {
    Bn && clearInterval(Bn), Yo && clearInterval(Yo), zo && clearTimeout(zo), Io && clearInterval(Io), Ge && clearInterval(Ge), q = null;
  }), J.handle("get-auto-launch", () => Ue.getLoginItemSettings().openAtLogin), J.on("set-auto-launch", (a, s) => {
    try {
      process.platform === "win32" && (Ue.setLoginItemSettings({
        openAtLogin: s,
        path: Ue.getPath("exe"),
        args: [
          "--hidden",
          "--start-minimized"
        ]
      }), console.log(`[MAIN] Autostart ${s ? "enabled" : "disabled"} for: ${Ue.getPath("exe")}`));
    } catch (l) {
      console.error("[AUTOSTART_ERROR] Failed to set login item settings:", l);
    }
  }), Ko(), Io = setInterval(Ko, 20 * 60 * 1e3);
}
const Y_ = Ue.requestSingleInstanceLock();
Y_ ? (Ue.on("second-instance", () => {
  q && (q.isMinimized() && q.restore(), q.focus());
}), Ue.whenReady().then(() => {
  V_();
})) : Ue.quit();
const Te = (e) => {
  const t = `
    $ErrorActionPreference = 'SilentlyContinue';
    Add-Type -AssemblyName System.Windows.Forms;
    $sig = '[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);';
    if (-not ([System.Management.Automation.PSTypeName]'Win32API.Win32').Type) {
        Add-Type -MemberDefinition $sig -Name "Win32" -Namespace "Win32API";
    }
    
    $search = if ('${ce}' -eq 'Zoom') { 'Zoom Meeting|Zoom' } elseif ('${ce}' -eq 'Meet') { 'Meet - |Google Meet' } else { 'Reunión|Llamada|Meeting|Teams' }
    # Strict filter: Must have MainWindowHandle, match title, but NOT be a shell or electron process.
    $p = Get-Process | Where-Object { 
        $_.MainWindowHandle -ne [IntPtr]::Zero -and 
        $_.MainWindowTitle -match $search -and 
        $_.ProcessName -notmatch 'powershell|node|electron|conhost' -and
        ($_.ProcessName -match 'Teams|ms-teams|Zoom|chrome|msedge|firefox' -or $_.MainWindowTitle -match 'Zoom Meeting|Google Meet|Reunión de ')
    } | Sort-Object { $_.MainWindowTitle -match 'Reunión|Llamada|Meeting|Zoom Meeting|Meet - ' } -Descending | Select-Object -First 1;

    if (-not $p -and '${ce}' -eq 'Teams') {
        $p = Get-Process -Name 'ms-teams', 'Teams' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero -and $_.ProcessName -notmatch 'powershell|node' } | Sort-Object { $_.MainWindowTitle.Length } -Descending | Select-Object -First 1
    }
    if ($p) {
        Write-Output "__DEBUG__TargetProcess: $($p.ProcessName) | Title: $($p.MainWindowTitle)"
        $res = [Win32API.Win32]::SetForegroundWindow($p.MainWindowHandle);
        Write-Output "__DEBUG__FocusResult: $res"
        Start-Sleep -m 400;
        [System.Windows.Forms.SendKeys]::SendWait('${e}');
        Write-Output "__DEBUG__KeysSent: ${e}"
    } else {
        Write-Output "__DEBUG__Error: No Meeting Window found for $search (Current app: ${ce})"
    }
  `;
  return new Promise((n) => {
    const r = Sn("powershell", ["-Command", t]);
    r.stdout.on("data", (i) => {
    }), r.stderr.on("data", (i) => {
    }), r.on("close", () => n(!0));
  });
};
J.handle("toggle-system-mute", async () => (ce === "Zoom" ? await Te("%a") : ce === "Meet" ? await Te("^d") : await Te("^+m"), !0));
J.handle("toggle-video", async () => (ce === "Zoom" ? await Te("%v") : ce === "Meet" ? await Te("^e") : await Te("^+o"), !0));
J.handle("end-call", async () => (ce === "Zoom" ? (await Te("%q"), await Te("{ENTER}")) : ce === "Meet" ? await Te("^w") : await Te("^+h"), !0));
let Xl = Wt.cpus();
Yo = setInterval(() => {
  try {
    if (!q || q.isDestroyed()) return;
    const e = Wt.totalmem(), t = Wt.freemem(), n = (e - t) / e * 100, r = Wt.cpus();
    let i = 0, o = 0;
    for (let s = 0; s < r.length; s++) {
      const l = Xl[s].times, p = r[s].times, c = Object.values(l).reduce((h, m) => h + m, 0), f = Object.values(p).reduce((h, m) => h + m, 0);
      i += f - c, o += p.idle - l.idle;
    }
    const a = i > 0 ? (1 - o / i) * 100 : 0;
    Xl = r, Je(q, "system-update", { cpu: a, ram: n, net: 1.5 + Math.random() * 2 });
  } catch {
  }
}, 2e3);
const cr = async () => {
  if (!(!q || q.isDestroyed()))
    try {
      dt(`powershell -Command "${`
      $wifi = $false; $bt = $false
      try {
        $w = Get-WmiObject -Class Win32_NetworkAdapter -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'Wi-Fi|Wireless|WLAN' -and $_.PhysicalAdapter -eq $true } | Select-Object -First 1
        if ($w -and $w.NetEnabled) { $wifi = $true }
        
        $b = Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue | Where-Object { ($_.InstanceId -match '^USB|^PCI') -and ($_.FriendlyName -notmatch 'Enumerator|LE|Device|Phone|Hands-free') } | Select-Object -First 1
        if ($b -and $b.Status -eq 'OK') { $bt = $true }
      } catch {}
      Write-Output "$($wifi)|$($bt)"
    `.replace(/\n/g, " ")}"`, (t, n) => {
        var r, i;
        if (!t && n) {
          const o = n.trim().split("|");
          Je(q, "network-status", {
            wifi: ((r = o[0]) == null ? void 0 : r.toLowerCase()) === "true",
            bluetooth: ((i = o[1]) == null ? void 0 : i.toLowerCase()) === "true"
          });
        }
        Ge && clearTimeout(Ge), Ge = setTimeout(cr, 4e3);
      });
    } catch {
      Ge && clearTimeout(Ge), Ge = setTimeout(cr, 4e3);
    }
}, z_ = (e) => {
  if (Ue.isPackaged)
    return Oe.join(process.resourcesPath, e);
  const t = Oe.join(process.cwd(), e);
  return pn.existsSync(t) ? t : Oe.join(Ar, "..", e);
}, Jo = z_("volume.exe"), gf = () => new Promise((e) => {
  if (!pn.existsSync(Jo)) return e(-1);
  dt(`"${Jo}" get`, (t, n) => {
    if (t) return e(-1);
    const r = parseInt(n.trim(), 10);
    e(isNaN(r) ? -1 : r);
  });
});
let Ro = !1, Kr = null;
const X_ = async (e) => {
  if (Kr = e, !Ro) {
    for (Ro = !0; Kr !== null; ) {
      const t = Kr;
      Kr = null, await new Promise((n) => {
        dt(`"${Jo}" set ${Math.round(t)}`, () => n(null));
      });
    }
    Ro = !1;
  }
}, yf = async () => {
  if (!(!q || q.isDestroyed())) {
    try {
      const e = await gf();
      e >= 0 && Je(q, "volume-update", e);
    } catch {
    }
    zo = setTimeout(yf, 1500);
  }
};
let it = null, ti = null, Kl = /* @__PURE__ */ new Map();
const Qo = () => {
  try {
    const e = Ue.isPackaged ? Oe.join(Ar, "media-reader.js") : Oe.join(process.cwd(), "electron", "media-reader.mjs");
    console.log(`[MAIN] Launching Media Reader: ${e}`), it = Ed(e, [process.resourcesPath || ""], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
      stdio: ["inherit", "inherit", "inherit", "ipc"]
    }), it && (it.on("exit", (t) => {
      console.warn(`[MAIN] Media Reader exited with code ${t}. Restarting in 3s...`), setTimeout(Qo, 3e3);
    }), it.on("message", (t) => {
      if ((t == null ? void 0 : t.type) === "MEDIA_UPDATE") {
        const n = t.data;
        if (!n) return;
        const r = n.id && n.id !== "system" ? n.id : n.title + "||" + (n.artist || "");
        n.title && n.title !== "Sin Reproducción" && Kl.set(r, { ...n, timestamp: Date.now() });
        let i = Array.from(Kl.values()).filter((s) => s.title !== "Sin Reproducción").sort((s, l) => l.timestamp - s.timestamp), o = n;
        const a = i.find((s) => s.isPlaying);
        a ? o = a : i.length > 0 && (o = i[0]), ti = o, Je(q, "media-update", o);
      }
    }));
  } catch (e) {
    console.error("[MAIN] Media Reader Failed:", e), setTimeout(Qo, 5e3);
  }
};
try {
  Qo();
  let e = "", t = null, n = "", r = 0;
  const i = () => {
    const a = Oe.join(Wt.tmpdir(), "notchly-meet.ps1");
    pn.writeFileSync(a, `
      $ErrorActionPreference = 'Continue'
      Write-Output "__DEBUG__PS_Script_Internal_Start"
      $code = @'
      using System;
      using System.Runtime.InteropServices;
      [Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioSessionEnumerator { int GetCount(out int c); int GetSession(int n, out IAudioSessionControl s); }
      [Guid("F4B1A599-7266-4319-A8CA-E70ACB1118D7"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioSessionControl { int GetState(out int s); int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string d); int GetIconPath([MarshalAs(UnmanagedType.LPWStr)] out string i); }
      [Guid("77AA9910-1EE6-440D-B95F-456477E6E273"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioSessionManager2 { int GetSessionEnumerator(out IAudioSessionEnumerator e); }
      [Guid("D6660639-8874-4034-AD23-37284F510F4F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IMMDevice { int Activate(ref Guid id, int cls, IntPtr p, out IAudioSessionManager2 m); }
      [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IMMDeviceEnumerator { int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint); int EnumAudioEndpoints(int dataFlow, int stateMask, out IMMDeviceCollection devices); }
      [Guid("0BD7A1AD-7E6D-4359-8CA7-3C5644E2096F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IMMDeviceCollection { int GetCount(out int count); int Item(int index, out IMMDevice device); }
      [Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
      interface IAudioMeterInformation { int GetPeakValue(out float peak); }
      [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDevEnum { }
      public class MicCheck {
          public static int GetStatus() {
              try {
                  var enumerator = (IMMDeviceEnumerator)new MMDevEnum();
                  IMMDeviceCollection devices;
                  if (enumerator.EnumAudioEndpoints(1, 1, out devices) != 0) return 0;
                  int deviceCount; devices.GetCount(out deviceCount);
                  var iid = new Guid("77AA9910-1EE6-440D-B95F-456477E6E273");
                  bool sessionFound = false;
                  for (int j = 0; j < deviceCount; j++) {
                      IMMDevice device; 
                      if (devices.Item(j, out device) != 0) continue;
                      IAudioSessionManager2 manager;
                      if (device.Activate(ref iid, 23, IntPtr.Zero, out manager) != 0) continue;
                      IAudioSessionEnumerator sessionEnum;
                      if (manager.GetSessionEnumerator(out sessionEnum) != 0) continue;
                      int count; sessionEnum.GetCount(out count);
                      for (int i = 0; i < count; i++) {
                          IAudioSessionControl session;
                          if (sessionEnum.GetSession(i, out session) == 0) {
                              int state; session.GetState(out state);
                              if (state == 1) {
                                  sessionFound = true;
                                  IAudioMeterInformation meter = (IAudioMeterInformation)session;
                                  float peak = 0;
                                  if (meter.GetPeakValue(out peak) == 0 && peak > 0.0001f) return 2; // DEFINITELY ACTIVE (SOUND)
                              }
                          }
                      }
                  }
                  return sessionFound ? 1 : 0; // 1 = POTENTIALLY ACTIVE (SESSION)
              } catch {}
              return 0;
          }
      }
'@
      try {
        Add-Type -TypeDefinition $code -ErrorAction Stop
      } catch {
        Write-Output "__DEBUG__AddType_Failed: $($_.Exception.Message)"
      }
      Write-Output "__DEBUG__PS_Script_Started"
      while($true) {
        try {
          # 1. C# Hybrid Check
          $micStatus = [MicCheck]::GetStatus()
          
          # 2. Registry Scan (Baseline)
          $regMic = $false
          $parents = "HKCU:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/microphone", 
                     "HKLM:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/microphone"
          foreach ($p in $parents) {
            if (Test-Path $p) {
              $active = Get-ChildItem -Path $p -Recurse -Depth 3 -ErrorAction SilentlyContinue | 
                        Get-ItemProperty -ErrorAction SilentlyContinue | 
                        Where-Object { $_.LastUsedTimeStop -eq 0 -and $_.LastUsedTimeStart -gt 0 }
              if ($active) { $regMic = $true; break }
            }
          }
          
          # 3. Camera Scan
          $camInUse = $false
          $camParents = "HKCU:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/webcam", 
                        "HKLM:/Software/Microsoft/Windows/CurrentVersion/CapabilityAccessManager/ConsentStore/webcam"
          foreach ($p in $camParents) {
            if (Test-Path $p) {
              $active = Get-ChildItem -Path $p -Recurse -Depth 3 -ErrorAction SilentlyContinue | 
                        Get-ItemProperty -ErrorAction SilentlyContinue | 
                        Where-Object { $_.LastUsedTimeStop -eq 0 -and $_.LastUsedTimeStart -gt 0 }
              if ($active) { $camInUse = $true; break }
            }
          }
          
          # 4. Window Detection (Ultra-Strict keywords to avoid Chat/Home windows)
          $keywords = 'Reunión|Llamada|Meeting|Call|Meet|Reun|curso|Zoom Meeting'
          $allP = Get-Process | Where-Object { 
            $_.MainWindowTitle -ne '' -and 
            ($_.MainWindowTitle -match $keywords) -and 
            ($_.ProcessName -match 'Teams|Zoom|ms-teams|Meet|Webex|chrome|msedge|firefox') 
          }
          $found = $null
          $isMeeting = $false
          $titleMuted = $false
          if ($allP) {
            foreach($p in $allP) {
              $t = $p.MainWindowTitle
              # Filter out chat/home windows explicitly
              if ($t -match $keywords -and $t -notmatch '^Teams$|^Microsoft Teams$|^Zoom$|^Zoom Cloud Meetings$|^Chat ') {
                 $found = $p; $isMeeting = $true
                 # Detect mute state by title suffix
                 if ($t -match ' (Silenciado)| (Muted)| (Desactivado)| (Mic Off)| (Silenciar)| (Mute)') { $titleMuted = $true }
                 break
              }
            }
            if (-not $found) { 
              # Final attempt: grab anything that matched process but be less confident
              $found = $allP | Select-Object -First 1 
            }
          }
          
          # Hybrid Logic: Confidence-based states
          $micFinal = $false
          $conf = "Low"
          if ($micStatus -eq 2) { 
            $micFinal = $true; $conf = "High" # Sound Peak
          } elseif ($isMeeting -and $titleMuted) {
            $micFinal = $false; $conf = "High" # Title Match
          } elseif ($micStatus -eq 1 -or $regMic) {
            $micFinal = $true; $conf = "Low" # Active Session
          } else {
            $micFinal = $false; $conf = "High" # Definitely inactive
          }
          
          # Diagnostic output
          Write-Output "__DEBUG__Stats | Status:$micStatus | Reg:$regMic | TitleMute:$titleMuted | Final:$micFinal | Conf:$conf | Title:$($found.MainWindowTitle)"
          
          $bt = Get-PnpDevice -Class 'AudioEndpoint' -Status 'OK' -ErrorAction SilentlyContinue | 
                Where-Object { $_.FriendlyName -match 'Bluetooth|Headset|Auricular|Hand-free|Llamada' } | 
                Select-Object -First 1
          
          $appName = if($found){ 
            if($found.MainWindowTitle -match 'Teams' -or $found.ProcessName -match 'Teams'){ 'Teams' } 
            elseif($found.MainWindowTitle -match 'Zoom' -or $found.ProcessName -match 'Zoom'){ 'Zoom' } 
            elseif($found.MainWindowTitle -match 'Meet|Google'){ 'Meet' } 
            else { $found.ProcessName } 
          } else { '' }
          
          Write-Output "__MEET__$([string]$micFinal)|$([string]$isMeeting)|$($appName)|$($bt.FriendlyName)|$([string]$camInUse)|$conf|$([string]$titleMuted)"
        } catch {
          Write-Output "__DEBUG__Loop_Error: $($_.Exception.Message)"
        }
        Start-Sleep -m 500
      }
    `, "utf8"), t = Sn("powershell", ["-ExecutionPolicy", "Bypass", "-File", a]), t.stdout.on("data", (l) => {
      const p = l.toString();
      n += p;
      let c;
      for (; (c = n.indexOf(`
`)) !== -1; ) {
        const f = n.slice(0, c).trim();
        if (n = n.slice(c + 1), !f.startsWith("__DEBUG__") && f.startsWith("__MEET__")) {
          const h = f.replace("__MEET__", "").split("|");
          if (h.length >= 6) {
            const [m, E, y, S, C, T, D] = h, k = m.toLowerCase() === "true", G = E.toLowerCase() === "true", X = C.toLowerCase() === "true", Z = (D ?? "").toLowerCase() === "true", te = G && (k || X);
            te ? (bo = 0, y.toLowerCase().includes("zoom") ? ce = "Zoom" : y.toLowerCase().includes("meet") ? ce = "Meet" : y.toLowerCase().includes("teams") ? ce = "Teams" : ce = y || "Llamada") : bo++;
            const L = bo < 6;
            L || (ut = !1, Mn = !1), k && T === "High" ? (Mt = !0, ut = !1) : Z || !k && T === "High" ? (Mt = !1, ut = !0) : Mt = !ut;
            const w = Mn ? !1 : X;
            if (Date.now() < r) return;
            Je(q, "meeting-update", {
              isActive: L,
              app: te || L ? y || "Llamada Activa" : "",
              device: S || "Sistema",
              micActive: Mt,
              camActive: w
            });
          }
        }
      }
    }), t.stderr.on("data", (l) => {
    }), t.on("exit", () => setTimeout(i, 5e3));
  };
  setTimeout(i, 3e3), J.handle("get-media-source-id", async (a, s) => {
    try {
      const l = await Jl.getSources({
        types: ["window"],
        thumbnailSize: { width: 0, height: 0 }
      }), { title: p, artist: c } = s;
      if (!p || p === "Ningún origen de medios") return null;
      const f = p.toLowerCase(), h = (Array.isArray(c) ? c : [c]).map((E) => E.toLowerCase());
      let m = l.find((E) => {
        const y = E.name.toLowerCase();
        return y.includes(f) && h.some((S) => y.includes(S));
      });
      return m || (m = l.find((E) => E.name.toLowerCase().includes(f))), !m && h.some((E) => E.includes("spotify")) && (m = l.find((E) => E.name.toLowerCase().includes("spotify"))), m ? m.id : null;
    } catch {
      return null;
    }
  }), J.handle("get-current-media", async () => ti || (await new Promise((a) => setTimeout(a, 1200)), ti || null));
  const o = `
function Invoke-WinRT($obj, $methodName) {
    if (-not $obj) { return $null }
    try { return $obj.$methodName() } catch {
        try { return $obj.GetType().InvokeMember($methodName, [System.Reflection.BindingFlags]::InvokeMethod, $null, $obj, $null) } catch { return $null }
    }
}
function Set-RadioState($RadioKind) {
    try {
        [void][Windows.Devices.Radios.Radio, Windows.Devices.Radios, ContentType=WindowsRuntime]
        $op = [Windows.Devices.Radios.Radio]::GetRadiosAsync()
        while($op.Status -eq 'Started') { Start-Sleep -m 20 }
        $rads = Invoke-WinRT $op "GetResults"
        $enumKind = if($RadioKind -eq "WiFi") { [Windows.Devices.Radios.RadioKind]::WiFi } else { [Windows.Devices.Radios.RadioKind]::Bluetooth }
        if ($rads) {
            $r = $rads | Where-Object { $_.Kind -eq $enumKind }
            if ($r) {
                $st = if($r.State -eq 'On') { 'Off' } else { 'On' }
                $task = $r.SetStateAsync($st)
                while($task.Status -eq 'Started') { Start-Sleep -m 20 }
            }
        }
    } catch {}
}
Set-RadioState -RadioKind $args[0]
`;
  J.handle("toggle-wifi", async () => {
    const a = Oe.join(Wt.tmpdir(), "notchly-radio-cmd.ps1");
    return pn.writeFileSync(a, o, "utf8"), dt(`powershell -ExecutionPolicy Bypass -File "${a}" "WiFi"`, () => {
      Ge && clearTimeout(Ge), setTimeout(cr, 1500);
    }), !0;
  }), J.handle("toggle-bluetooth", async () => {
    const a = Oe.join(Wt.tmpdir(), "notchly-radio-cmd.ps1");
    return pn.writeFileSync(a, o, "utf8"), dt(`powershell -ExecutionPolicy Bypass -File "${a}" "Bluetooth"`, () => {
      Ge && clearTimeout(Ge), setTimeout(cr, 1500);
    }), !0;
  }), J.on("media-command", (a, s) => {
    it && !it.killed && it.send(s);
  }), J.handle("get-volume", async () => await gf()), J.handle("set-volume", (a, s) => (X_(s), !0)), J.handle("open-app", async (a, s) => {
    const l = s.toLowerCase();
    return l.includes("chrome") ? dt("start chrome") : l.includes("spotify") ? dt("start spotify") : l.includes("camera") ? dt("start microsoft.windows.camera:") : dt(`start "" "${s}"`), !0;
  }), J.handle("meeting-command", async (a, s) => {
    r = Date.now() + 8e3, s === "toggleMic" ? (ut = !ut, Mt = !ut, await Te(ce === "Zoom" ? "%a" : ce === "Meet" ? "^d" : "^+m")) : s === "toggleCam" ? (Mn = !Mn, await Te(ce === "Zoom" ? "%v" : ce === "Meet" ? "^e" : "^+o")) : s === "endCall" && (ut = !1, Mn = !1, Mt = !1, ce === "Zoom" ? (await Te("%q"), setTimeout(() => Te("{ENTER}"), 200)) : ce === "Meet" ? await Te("^w") : await Te("^+h"));
  }), Ue.on("before-quit", () => {
    it == null || it.kill(), typeof t < "u" && t && t.kill(), typeof yn < "u" && yn && yn.kill();
  });
} catch (e) {
  console.error("[MAIN] Setup Error:", e);
}
Ue.on("window-all-closed", () => {
  q = null, process.platform !== "darwin" && Ue.quit();
});
export {
  W_ as RENDERER_DIST,
  zl as VITE_DEV_SERVER_URL
};
