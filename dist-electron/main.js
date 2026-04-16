import zt, { ipcMain as X, app as Re, desktopCapturer as Zl, screen as es, BrowserWindow as wd } from "electron";
import Pe from "node:path";
import { fileURLToPath as vd } from "node:url";
import pn from "node:fs";
import { spawn as Sn, exec as dt, fork as _d } from "node:child_process";
import Wt from "node:os";
import Sd from "node:https";
import It from "fs";
import Ad from "constants";
import ur from "stream";
import ta from "util";
import ec from "assert";
import ae from "path";
import pi from "child_process";
import tc from "events";
import fr from "crypto";
import nc from "tty";
import mi from "os";
import Rt from "url";
import rc from "zlib";
import Td from "http";
var Oe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Qe = {}, Kt = {}, Fe = {};
Fe.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Fe.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var yt = Ad, Cd = process.cwd, Jr = null, $d = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Jr || (Jr = Cd.call(process)), Jr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var ts = process.chdir;
  process.chdir = function(e) {
    Jr = null, ts.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, ts);
}
var bd = Id;
function Id(e) {
  yt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), $d === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
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
        T = function(k, G, K) {
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
var ns = ur.Stream, Rd = Od;
function Od(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    ns.call(this);
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
    ns.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Pd = Dd, Nd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Dd(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Nd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = It, Fd = bd, xd = Rd, Ld = Pd, Dr = ta, Ee, ni;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ee = Symbol.for("graceful-fs.queue"), ni = Symbol.for("graceful-fs.previous")) : (Ee = "___graceful-fs.queue", ni = "___graceful-fs.previous");
function Ud() {
}
function ic(e, t) {
  Object.defineProperty(e, Ee, {
    get: function() {
      return t;
    }
  });
}
var Vt = Ud;
Dr.debuglog ? Vt = Dr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Vt = function() {
  var e = Dr.format.apply(Dr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[Ee]) {
  var kd = Oe[Ee] || [];
  ic(oe, kd), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || rs(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ni, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), rs();
    }
    return Object.defineProperty(t, ni, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Vt(oe[Ee]), ec.equal(oe[Ee].length, 0);
  });
}
Oe[Ee] || ic(Oe, oe[Ee]);
var xe = na(Ld(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (xe = na(oe), oe.__patched = !0);
function na(e) {
  Fd(e), e.gracefulify = na, e.createReadStream = G, e.createWriteStream = K;
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
    var h = xd(e);
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
  function K(L, w) {
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
  Vt("ENQUEUE", e[0].name, e[1]), oe[Ee].push(e), ra();
}
var Fr;
function rs() {
  for (var e = Date.now(), t = 0; t < oe[Ee].length; ++t)
    oe[Ee][t].length > 2 && (oe[Ee][t][3] = e, oe[Ee][t][4] = e);
  ra();
}
function ra() {
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
    Fr === void 0 && (Fr = setTimeout(ra, 0));
  }
}
(function(e) {
  const t = Fe.fromCallback, n = xe, r = [
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
var ia = {}, oc = {};
const Md = ae;
oc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Md.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const ac = Kt, { checkPath: sc } = oc, lc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
ia.makeDir = async (e, t) => (sc(e), ac.mkdir(e, {
  mode: lc(t),
  recursive: !0
}));
ia.makeDirSync = (e, t) => (sc(e), ac.mkdirSync(e, {
  mode: lc(t),
  recursive: !0
}));
const Bd = Fe.fromPromise, { makeDir: jd, makeDirSync: Vi } = ia, Yi = Bd(jd);
var st = {
  mkdirs: Yi,
  mkdirsSync: Vi,
  // alias
  mkdirp: Yi,
  mkdirpSync: Vi,
  ensureDir: Yi,
  ensureDirSync: Vi
};
const Hd = Fe.fromPromise, cc = Kt;
function Gd(e) {
  return cc.access(e).then(() => !0).catch(() => !1);
}
var Jt = {
  pathExists: Hd(Gd),
  pathExistsSync: cc.existsSync
};
const mn = xe;
function qd(e, t, n, r) {
  mn.open(e, "r+", (i, o) => {
    if (i) return r(i);
    mn.futimes(o, t, n, (a) => {
      mn.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function Wd(e, t, n) {
  const r = mn.openSync(e, "r+");
  return mn.futimesSync(r, t, n), mn.closeSync(r);
}
var uc = {
  utimesMillis: qd,
  utimesMillisSync: Wd
};
const En = Kt, ge = ae, Vd = ta;
function Yd(e, t, n) {
  const r = n.dereference ? (i) => En.stat(i, { bigint: !0 }) : (i) => En.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function zd(e, t, n) {
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
function Xd(e, t, n, r, i) {
  Vd.callbackify(Yd)(e, t, r, (o, a) => {
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
    return s.isDirectory() && oa(e, t) ? i(new Error(gi(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function Kd(e, t, n, r) {
  const { srcStat: i, destStat: o } = zd(e, t, r);
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
  if (i.isDirectory() && oa(e, t))
    throw new Error(gi(e, t, n));
  return { srcStat: i, destStat: o };
}
function fc(e, t, n, r, i) {
  const o = ge.resolve(ge.dirname(e)), a = ge.resolve(ge.dirname(n));
  if (a === o || a === ge.parse(a).root) return i();
  En.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : dr(t, l) ? i(new Error(gi(e, n, r))) : fc(e, t, a, r, i));
}
function dc(e, t, n, r) {
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
  return dc(e, t, o, r);
}
function dr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function oa(e, t) {
  const n = ge.resolve(e).split(ge.sep).filter((i) => i), r = ge.resolve(t).split(ge.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function gi(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var An = {
  checkPaths: Xd,
  checkPathsSync: Kd,
  checkParentPaths: fc,
  checkParentPathsSync: dc,
  isSrcSubdir: oa,
  areIdentical: dr
};
const ke = xe, Yn = ae, Jd = st.mkdirs, Qd = Jt.pathExists, Zd = uc.utimesMillis, zn = An;
function eh(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), zn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: a, destStat: s } = o;
    zn.checkParentPaths(e, a, t, "copy", (l) => l ? r(l) : n.filter ? hc(is, s, e, t, n, r) : is(s, e, t, n, r));
  });
}
function is(e, t, n, r, i) {
  const o = Yn.dirname(n);
  Qd(o, (a, s) => {
    if (a) return i(a);
    if (s) return ri(e, t, n, r, i);
    Jd(o, (l) => l ? i(l) : ri(e, t, n, r, i));
  });
}
function hc(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function th(e, t, n, r, i) {
  return r.filter ? hc(ri, e, t, n, r, i) : ri(e, t, n, r, i);
}
function ri(e, t, n, r, i) {
  (r.dereference ? ke.stat : ke.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? lh(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? nh(s, e, t, n, r, i) : s.isSymbolicLink() ? fh(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function nh(e, t, n, r, i, o) {
  return t ? rh(e, n, r, i, o) : pc(e, n, r, i, o);
}
function rh(e, t, n, r, i) {
  if (r.overwrite)
    ke.unlink(n, (o) => o ? i(o) : pc(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function pc(e, t, n, r, i) {
  ke.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? ih(e.mode, t, n, i) : yi(n, e.mode, i));
}
function ih(e, t, n, r) {
  return oh(e) ? ah(n, e, (i) => i ? r(i) : os(e, t, n, r)) : os(e, t, n, r);
}
function oh(e) {
  return (e & 128) === 0;
}
function ah(e, t, n) {
  return yi(e, t | 128, n);
}
function os(e, t, n, r) {
  sh(t, n, (i) => i ? r(i) : yi(n, e, r));
}
function yi(e, t, n) {
  return ke.chmod(e, t, n);
}
function sh(e, t, n) {
  ke.stat(e, (r, i) => r ? n(r) : Zd(t, i.atime, i.mtime, n));
}
function lh(e, t, n, r, i, o) {
  return t ? mc(n, r, i, o) : ch(e.mode, n, r, i, o);
}
function ch(e, t, n, r, i) {
  ke.mkdir(n, (o) => {
    if (o) return i(o);
    mc(t, n, r, (a) => a ? i(a) : yi(n, e, i));
  });
}
function mc(e, t, n, r) {
  ke.readdir(e, (i, o) => i ? r(i) : gc(o, e, t, n, r));
}
function gc(e, t, n, r, i) {
  const o = e.pop();
  return o ? uh(e, o, t, n, r, i) : i();
}
function uh(e, t, n, r, i, o) {
  const a = Yn.join(n, t), s = Yn.join(r, t);
  zn.checkPaths(a, s, "copy", i, (l, p) => {
    if (l) return o(l);
    const { destStat: c } = p;
    th(c, a, s, i, (f) => f ? o(f) : gc(e, n, r, i, o));
  });
}
function fh(e, t, n, r, i) {
  ke.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = Yn.resolve(process.cwd(), a)), e)
      ke.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? ke.symlink(a, n, i) : i(s) : (r.dereference && (l = Yn.resolve(process.cwd(), l)), zn.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && zn.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : dh(a, n, i)));
    else
      return ke.symlink(a, n, i);
  });
}
function dh(e, t, n) {
  ke.unlink(t, (r) => r ? n(r) : ke.symlink(e, t, n));
}
var hh = eh;
const Ce = xe, Xn = ae, ph = st.mkdirsSync, mh = uc.utimesMillisSync, Kn = An;
function gh(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Kn.checkPathsSync(e, t, "copy", n);
  return Kn.checkParentPathsSync(e, r, t, "copy"), yh(i, e, t, n);
}
function yh(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Xn.dirname(n);
  return Ce.existsSync(i) || ph(i), yc(e, t, n, r);
}
function Eh(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return yc(e, t, n, r);
}
function yc(e, t, n, r) {
  const o = (r.dereference ? Ce.statSync : Ce.lstatSync)(t);
  if (o.isDirectory()) return Ch(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return wh(o, e, t, n, r);
  if (o.isSymbolicLink()) return Ih(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function wh(e, t, n, r, i) {
  return t ? vh(e, n, r, i) : Ec(e, n, r, i);
}
function vh(e, t, n, r) {
  if (r.overwrite)
    return Ce.unlinkSync(n), Ec(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Ec(e, t, n, r) {
  return Ce.copyFileSync(t, n), r.preserveTimestamps && _h(e.mode, t, n), aa(n, e.mode);
}
function _h(e, t, n) {
  return Sh(e) && Ah(n, e), Th(t, n);
}
function Sh(e) {
  return (e & 128) === 0;
}
function Ah(e, t) {
  return aa(e, t | 128);
}
function aa(e, t) {
  return Ce.chmodSync(e, t);
}
function Th(e, t) {
  const n = Ce.statSync(e);
  return mh(t, n.atime, n.mtime);
}
function Ch(e, t, n, r, i) {
  return t ? wc(n, r, i) : $h(e.mode, n, r, i);
}
function $h(e, t, n, r) {
  return Ce.mkdirSync(n), wc(t, n, r), aa(n, e);
}
function wc(e, t, n) {
  Ce.readdirSync(e).forEach((r) => bh(r, e, t, n));
}
function bh(e, t, n, r) {
  const i = Xn.join(t, e), o = Xn.join(n, e), { destStat: a } = Kn.checkPathsSync(i, o, "copy", r);
  return Eh(a, i, o, r);
}
function Ih(e, t, n, r) {
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
    return Rh(i, n);
  } else
    return Ce.symlinkSync(i, n);
}
function Rh(e, t) {
  return Ce.unlinkSync(t), Ce.symlinkSync(e, t);
}
var Oh = gh;
const Ph = Fe.fromCallback;
var sa = {
  copy: Ph(hh),
  copySync: Oh
};
const as = xe, vc = ae, Q = ec, Jn = process.platform === "win32";
function _c(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || as[n], n = n + "Sync", e[n] = e[n] || as[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function la(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Q(e, "rimraf: missing path"), Q.strictEqual(typeof e, "string", "rimraf: path should be a string"), Q.strictEqual(typeof n, "function", "rimraf: callback function required"), Q(t, "rimraf: invalid options argument provided"), Q.strictEqual(typeof t, "object", "rimraf: options should be object"), _c(t), ss(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const a = r * 100;
        return setTimeout(() => ss(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function ss(e, t, n) {
  Q(e), Q(t), Q(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Jn)
      return ls(e, t, r, n);
    if (i && i.isDirectory())
      return Qr(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Jn ? ls(e, t, o, n) : Qr(e, t, o, n);
        if (o.code === "EISDIR")
          return Qr(e, t, o, n);
      }
      return n(o);
    });
  });
}
function ls(e, t, n, r) {
  Q(e), Q(t), Q(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, a) => {
      o ? r(o.code === "ENOENT" ? null : n) : a.isDirectory() ? Qr(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function cs(e, t, n) {
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
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Nh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function Nh(e, t, n) {
  Q(e), Q(t), Q(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      la(vc.join(e, s), t, (l) => {
        if (!a) {
          if (l) return n(a = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function Sc(e, t) {
  let n;
  t = t || {}, _c(t), Q(e, "rimraf: missing path"), Q.strictEqual(typeof e, "string", "rimraf: path should be a string"), Q(t, "rimraf: missing options"), Q.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Jn && cs(e, t, r);
  }
  try {
    n && n.isDirectory() ? Zr(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Jn ? cs(e, t, r) : Zr(e, t, r);
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
      Dh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function Dh(e, t) {
  if (Q(e), Q(t), t.readdirSync(e).forEach((n) => Sc(vc.join(e, n), t)), Jn) {
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
var Fh = la;
la.sync = Sc;
const ii = xe, xh = Fe.fromCallback, Ac = Fh;
function Lh(e, t) {
  if (ii.rm) return ii.rm(e, { recursive: !0, force: !0 }, t);
  Ac(e, t);
}
function Uh(e) {
  if (ii.rmSync) return ii.rmSync(e, { recursive: !0, force: !0 });
  Ac.sync(e);
}
var Ei = {
  remove: xh(Lh),
  removeSync: Uh
};
const kh = Fe.fromPromise, Tc = Kt, Cc = ae, $c = st, bc = Ei, us = kh(async function(t) {
  let n;
  try {
    n = await Tc.readdir(t);
  } catch {
    return $c.mkdirs(t);
  }
  return Promise.all(n.map((r) => bc.remove(Cc.join(t, r))));
});
function fs(e) {
  let t;
  try {
    t = Tc.readdirSync(e);
  } catch {
    return $c.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Cc.join(e, n), bc.removeSync(n);
  });
}
var Mh = {
  emptyDirSync: fs,
  emptydirSync: fs,
  emptyDir: us,
  emptydir: us
};
const Bh = Fe.fromCallback, Ic = ae, vt = xe, Rc = st;
function jh(e, t) {
  function n() {
    vt.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  vt.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = Ic.dirname(e);
    vt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? Rc.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(a);
      s.isDirectory() ? n() : vt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Hh(e) {
  let t;
  try {
    t = vt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = Ic.dirname(e);
  try {
    vt.statSync(n).isDirectory() || vt.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") Rc.mkdirsSync(n);
    else throw r;
  }
  vt.writeFileSync(e, "");
}
var Gh = {
  createFile: Bh(jh),
  createFileSync: Hh
};
const qh = Fe.fromCallback, Oc = ae, wt = xe, Pc = st, Wh = Jt.pathExists, { areIdentical: Nc } = An;
function Vh(e, t, n) {
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
      if (o && Nc(s, o)) return n(null);
      const l = Oc.dirname(t);
      Wh(l, (p, c) => {
        if (p) return n(p);
        if (c) return r(e, t);
        Pc.mkdirs(l, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function Yh(e, t) {
  let n;
  try {
    n = wt.lstatSync(t);
  } catch {
  }
  try {
    const o = wt.lstatSync(e);
    if (n && Nc(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Oc.dirname(t);
  return wt.existsSync(r) || Pc.mkdirsSync(r), wt.linkSync(e, t);
}
var zh = {
  createLink: qh(Vh),
  createLinkSync: Yh
};
const _t = ae, Gn = xe, Xh = Jt.pathExists;
function Kh(e, t, n) {
  if (_t.isAbsolute(e))
    return Gn.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = _t.dirname(t), i = _t.join(r, e);
    return Xh(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : Gn.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: _t.relative(r, e)
    })));
  }
}
function Jh(e, t) {
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
var Qh = {
  symlinkPaths: Kh,
  symlinkPathsSync: Jh
};
const Dc = xe;
function Zh(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  Dc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function ep(e, t) {
  let n;
  if (t) return t;
  try {
    n = Dc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var tp = {
  symlinkType: Zh,
  symlinkTypeSync: ep
};
const np = Fe.fromCallback, Fc = ae, Je = Kt, xc = st, rp = xc.mkdirs, ip = xc.mkdirsSync, Lc = Qh, op = Lc.symlinkPaths, ap = Lc.symlinkPathsSync, Uc = tp, sp = Uc.symlinkType, lp = Uc.symlinkTypeSync, cp = Jt.pathExists, { areIdentical: kc } = An;
function up(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Je.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Je.stat(e),
      Je.stat(t)
    ]).then(([a, s]) => {
      if (kc(a, s)) return r(null);
      ds(e, t, n, r);
    }) : ds(e, t, n, r);
  });
}
function ds(e, t, n, r) {
  op(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, sp(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = Fc.dirname(t);
      cp(l, (p, c) => {
        if (p) return r(p);
        if (c) return Je.symlink(e, t, s, r);
        rp(l, (f) => {
          if (f) return r(f);
          Je.symlink(e, t, s, r);
        });
      });
    });
  });
}
function fp(e, t, n) {
  let r;
  try {
    r = Je.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = Je.statSync(e), l = Je.statSync(t);
    if (kc(s, l)) return;
  }
  const i = ap(e, t);
  e = i.toDst, n = lp(i.toCwd, n);
  const o = Fc.dirname(t);
  return Je.existsSync(o) || ip(o), Je.symlinkSync(e, t, n);
}
var dp = {
  createSymlink: np(up),
  createSymlinkSync: fp
};
const { createFile: hs, createFileSync: ps } = Gh, { createLink: ms, createLinkSync: gs } = zh, { createSymlink: ys, createSymlinkSync: Es } = dp;
var hp = {
  // file
  createFile: hs,
  createFileSync: ps,
  ensureFile: hs,
  ensureFileSync: ps,
  // link
  createLink: ms,
  createLinkSync: gs,
  ensureLink: ms,
  ensureLinkSync: gs,
  // symlink
  createSymlink: ys,
  createSymlinkSync: Es,
  ensureSymlink: ys,
  ensureSymlinkSync: Es
};
function pp(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function mp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var ca = { stringify: pp, stripBom: mp };
let wn;
try {
  wn = xe;
} catch {
  wn = It;
}
const wi = Fe, { stringify: Mc, stripBom: Bc } = ca;
async function gp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || wn, r = "throws" in t ? t.throws : !0;
  let i = await wi.fromCallback(n.readFile)(e, t);
  i = Bc(i);
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
const yp = wi.fromPromise(gp);
function Ep(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || wn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Bc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function wp(e, t, n = {}) {
  const r = n.fs || wn, i = Mc(t, n);
  await wi.fromCallback(r.writeFile)(e, i, n);
}
const vp = wi.fromPromise(wp);
function _p(e, t, n = {}) {
  const r = n.fs || wn, i = Mc(t, n);
  return r.writeFileSync(e, i, n);
}
var Sp = {
  readFile: yp,
  readFileSync: Ep,
  writeFile: vp,
  writeFileSync: _p
};
const xr = Sp;
var Ap = {
  // jsonfile exports
  readJson: xr.readFile,
  readJsonSync: xr.readFileSync,
  writeJson: xr.writeFile,
  writeJsonSync: xr.writeFileSync
};
const Tp = Fe.fromCallback, qn = xe, jc = ae, Hc = st, Cp = Jt.pathExists;
function $p(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = jc.dirname(e);
  Cp(i, (o, a) => {
    if (o) return r(o);
    if (a) return qn.writeFile(e, t, n, r);
    Hc.mkdirs(i, (s) => {
      if (s) return r(s);
      qn.writeFile(e, t, n, r);
    });
  });
}
function bp(e, ...t) {
  const n = jc.dirname(e);
  if (qn.existsSync(n))
    return qn.writeFileSync(e, ...t);
  Hc.mkdirsSync(n), qn.writeFileSync(e, ...t);
}
var ua = {
  outputFile: Tp($p),
  outputFileSync: bp
};
const { stringify: Ip } = ca, { outputFile: Rp } = ua;
async function Op(e, t, n = {}) {
  const r = Ip(t, n);
  await Rp(e, r, n);
}
var Pp = Op;
const { stringify: Np } = ca, { outputFileSync: Dp } = ua;
function Fp(e, t, n) {
  const r = Np(t, n);
  Dp(e, r, n);
}
var xp = Fp;
const Lp = Fe.fromPromise, De = Ap;
De.outputJson = Lp(Pp);
De.outputJsonSync = xp;
De.outputJSON = De.outputJson;
De.outputJSONSync = De.outputJsonSync;
De.writeJSON = De.writeJson;
De.writeJSONSync = De.writeJsonSync;
De.readJSON = De.readJson;
De.readJSONSync = De.readJsonSync;
var Up = De;
const kp = xe, Oo = ae, Mp = sa.copy, Gc = Ei.remove, Bp = st.mkdirp, jp = Jt.pathExists, ws = An;
function Hp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  ws.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    ws.checkParentPaths(e, s, t, "move", (p) => {
      if (p) return r(p);
      if (Gp(t)) return vs(e, t, i, l, r);
      Bp(Oo.dirname(t), (c) => c ? r(c) : vs(e, t, i, l, r));
    });
  });
}
function Gp(e) {
  const t = Oo.dirname(e);
  return Oo.parse(t).root === t;
}
function vs(e, t, n, r, i) {
  if (r) return zi(e, t, n, i);
  if (n)
    return Gc(t, (o) => o ? i(o) : zi(e, t, n, i));
  jp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : zi(e, t, n, i));
}
function zi(e, t, n, r) {
  kp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : qp(e, t, n, r) : r());
}
function qp(e, t, n, r) {
  Mp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : Gc(e, r));
}
var Wp = Hp;
const qc = xe, Po = ae, Vp = sa.copySync, Wc = Ei.removeSync, Yp = st.mkdirpSync, _s = An;
function zp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = _s.checkPathsSync(e, t, "move", n);
  return _s.checkParentPathsSync(e, i, t, "move"), Xp(t) || Yp(Po.dirname(t)), Kp(e, t, r, o);
}
function Xp(e) {
  const t = Po.dirname(e);
  return Po.parse(t).root === t;
}
function Kp(e, t, n, r) {
  if (r) return Xi(e, t, n);
  if (n)
    return Wc(t), Xi(e, t, n);
  if (qc.existsSync(t)) throw new Error("dest already exists.");
  return Xi(e, t, n);
}
function Xi(e, t, n) {
  try {
    qc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return Jp(e, t, n);
  }
}
function Jp(e, t, n) {
  return Vp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Wc(e);
}
var Qp = zp;
const Zp = Fe.fromCallback;
var em = {
  move: Zp(Wp),
  moveSync: Qp
}, Ot = {
  // Export promiseified graceful-fs:
  ...Kt,
  // Export extra methods:
  ...sa,
  ...Mh,
  ...hp,
  ...Up,
  ...st,
  ...em,
  ...ua,
  ...Jt,
  ...Ei
}, Qt = {}, At = {}, pe = {}, Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.CancellationError = Tt.CancellationToken = void 0;
const tm = tc;
class nm extends tm.EventEmitter {
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
Tt.CancellationToken = nm;
class No extends Error {
  constructor() {
    super("cancelled");
  }
}
Tt.CancellationError = No;
var Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
Tn.newError = rm;
function rm(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Ne = {}, Do = { exports: {} }, Lr = { exports: {} }, Ki, Ss;
function im() {
  if (Ss) return Ki;
  Ss = 1;
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
var Ji, As;
function Vc() {
  if (As) return Ji;
  As = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = p, r.disable = s, r.enable = o, r.enabled = l, r.humanize = im(), r.destroy = c, Object.keys(t).forEach((f) => {
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
var Ts;
function om() {
  return Ts || (Ts = 1, function(e, t) {
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
    e.exports = Vc()(t);
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
var Ur = { exports: {} }, Qi, Cs;
function am() {
  return Cs || (Cs = 1, Qi = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Qi;
}
var Zi, $s;
function sm() {
  if ($s) return Zi;
  $s = 1;
  const e = mi, t = nc, n = am(), { env: r } = process;
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
var bs;
function lm() {
  return bs || (bs = 1, function(e, t) {
    const n = nc, r = ta;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = p, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = sm();
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
    e.exports = Vc()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(Ur, Ur.exports)), Ur.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Do.exports = om() : Do.exports = lm();
var cm = Do.exports, hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.ProgressCallbackTransform = void 0;
const um = ur;
class fm extends um.Transform {
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
hr.ProgressCallbackTransform = fm;
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.DigestTransform = Ne.HttpExecutor = Ne.HttpError = void 0;
Ne.createHttpError = xo;
Ne.parseJson = wm;
Ne.configureRequestOptionsFromUrl = zc;
Ne.configureRequestUrl = da;
Ne.safeGetHeader = gn;
Ne.configureRequestOptions = oi;
Ne.safeStringifyJson = ai;
const dm = fr, hm = cm, pm = It, mm = ur, Fo = Rt, gm = Tt, Is = Tn, ym = hr, kt = (0, hm.default)("electron-builder");
function xo(e, t = null) {
  return new fa(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ai(e.headers), t);
}
const Em = /* @__PURE__ */ new Map([
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
class fa extends Error {
  constructor(t, n = `HTTP error: ${Em.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ne.HttpError = fa;
function wm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class cn {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new gm.CancellationToken(), r) {
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
      da(t, s), oi(s), this.doDownload(s, {
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
      n.responseHandler == null ? _m(n, o) : n.responseHandler(o, n.callback);
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
    const r = zc(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = cn.reconstructOriginalUrl(n), a = Yc(t, n);
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
        if (r < n && (i instanceof fa && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ne.HttpExecutor = cn;
function Yc(e, t) {
  try {
    return new Fo.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new Fo.URL(e, o);
  }
}
function zc(e, t) {
  const n = oi(t), r = Yc(e, t);
  return da(r, n), n;
}
function da(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Lo extends mm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, dm.createHash)(n);
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
      throw (0, Is.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Is.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ne.DigestTransform = Lo;
function vm(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function gn(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function _m(e, t) {
  if (!vm(gn(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = gn(t, "content-length");
    a != null && n.push(new ym.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new Lo(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new Lo(e.options.sha2, "sha256", "hex"));
  const i = (0, pm.createWriteStream)(e.destination);
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
class Sm {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Xc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
vi.MemoLazy = Sm;
function Xc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => Xc(e[a], t[a]));
  }
  return e === t;
}
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.githubUrl = Am;
pr.githubTagPrefix = Tm;
pr.getS3LikeProviderBaseUrl = Cm;
function Am(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Tm(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function Cm(e) {
  const t = e.provider;
  if (t === "s3")
    return $m(e);
  if (t === "spaces")
    return bm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function $m(e) {
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
  return Kc(t, e.path);
}
function Kc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function bm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Kc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var ha = {};
Object.defineProperty(ha, "__esModule", { value: !0 });
ha.retry = Jc;
const Im = Tt;
async function Jc(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Im.CancellationToken() } = t;
  try {
    return await e();
  } catch (p) {
    if (await Promise.resolve((n = s == null ? void 0 : s(p)) !== null && n !== void 0 ? n : !0) && r > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await Jc(e, { ...t, retries: r - 1, attempt: a + 1 });
    throw p;
  }
}
var pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.parseDn = Rm;
function Rm(e) {
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
const Qc = fr, Zc = Tn, Om = "options.name must be either a string or a Buffer", Rs = (0, Qc.randomBytes)(16);
Rs[0] = Rs[0] | 1;
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
    return Pm(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Nm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ei[t[14] + t[15]] & 240) >> 4,
        variant: Os((ei[t[19] + t[20]] & 224) >> 5),
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
        variant: Os((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Zc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
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
function Os(e) {
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
function Pm(e, t, n, r, i = Wn.ASCII) {
  const o = (0, Qc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Zc.newError)(Om, "ERR_INVALID_UUID_NAME");
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
function Nm(e) {
  return V[e[0]] + V[e[1]] + V[e[2]] + V[e[3]] + "-" + V[e[4]] + V[e[5]] + "-" + V[e[6]] + V[e[7]] + "-" + V[e[8]] + V[e[9]] + "-" + V[e[10]] + V[e[11]] + V[e[12]] + V[e[13]] + V[e[14]] + V[e[15]];
}
vn.nil = new Xt("00000000-0000-0000-0000-000000000000");
var mr = {}, eu = {};
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
    function K(d) {
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
    function J(d) {
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
          var _e = d.attribList[re], Se = _e[0], Ve = _e[1], he = de(Se, !0), Ye = he.prefix, ki = he.local, Cr = Ye === "" ? "" : A.ns[Ye] || "", On = {
            name: Se,
            value: Ve,
            prefix: Ye,
            local: ki,
            uri: Cr
          };
          Ye && Ye !== "xmlns" && !Cr && (F(
            d,
            "Unbound namespace prefix: " + JSON.stringify(Ye)
          ), On.uri = Ye), d.tag.attributes[Se] = On, b(d, "onattribute", On);
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
        var Ve = d.tags[d.tags.length - 1] || d;
        d.opt.xmlns && le.ns !== Ve.ns && Object.keys(le.ns).forEach(function(he) {
          var Ye = le.ns[he];
          b(d, "onclosenamespace", { prefix: he, uri: Ye });
        });
      }
      u === 0 && (d.closedRoot = !0), d.tagName = d.attribValue = d.attribName = "", d.attribList.length = 0, d.state = w.TEXT;
    }
    function We(d) {
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
            ), u.doctype = "", u.sgmlDecl = "") : v === ">" ? (b(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = w.TEXT) : (K(v) && (u.state = w.SGML_DECL_QUOTED), u.sgmlDecl += v);
            continue;
          case w.SGML_DECL_QUOTED:
            v === u.q && (u.state = w.SGML_DECL, u.q = ""), u.sgmlDecl += v;
            continue;
          case w.DOCTYPE:
            v === ">" ? (u.state = w.TEXT, b(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += v, v === "[" ? u.state = w.DOCTYPE_DTD : K(v) && (u.state = w.DOCTYPE_QUOTED, u.q = v));
            continue;
          case w.DOCTYPE_QUOTED:
            u.doctype += v, v === u.q && (u.q = "", u.state = w.DOCTYPE);
            continue;
          case w.DOCTYPE_DTD:
            v === "]" ? (u.doctype += v, u.state = w.DOCTYPE) : v === "<" ? (u.state = w.OPEN_WAKA, u.startTagPosition = u.position) : K(v) ? (u.doctype += v, u.state = w.DOCTYPE_DTD_QUOTED, u.q = v) : u.doctype += v;
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
              const Ve = {
                name: u.procInstName,
                body: u.procInstBody
              };
              P(u, Ve), b(u, "onprocessinginstruction", Ve), u.procInstName = u.procInstBody = "", u.state = w.TEXT;
            } else
              u.procInstBody += "?" + v, u.state = w.PROC_INST_BODY;
            continue;
          case w.OPEN_TAG:
            te(T, v) ? u.tagName += v : (J(u), v === ">" ? ve(u) : v === "/" ? u.state = w.OPEN_TAG_SLASH : (G(v) || F(u, "Invalid character in tag name"), u.state = w.ATTRIB));
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
            K(v) ? (u.q = v, u.state = w.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || M(u, "Unquoted attribute value"), u.state = w.ATTRIB_VALUE_UNQUOTED, u.attribValue = v);
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
              var Se = We(u);
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
        for (var Ve = ""; ++_e < Se; ) {
          var he = Number(arguments[_e]);
          if (!isFinite(he) || // `NaN`, `+Infinity`, or `-Infinity`
          he < 0 || // not a valid Unicode code point
          he > 1114111 || // not a valid Unicode code point
          u(he) !== he)
            throw RangeError("Invalid code point: " + he);
          he <= 65535 ? Y.push(he) : (he -= 65536, re = (he >> 10) + 55296, le = he % 1024 + 56320, Y.push(re, le)), (_e + 1 === Se || Y.length > v) && (Ve += d.apply(null, Y), Y.length = 0);
        }
        return Ve;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: A,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = A;
    }();
  })(e);
})(eu);
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.XElement = void 0;
mr.parseXml = Lm;
const Dm = eu, kr = Tn;
class tu {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, kr.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!xm(t))
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
      if (Ps(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => Ps(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
mr.XElement = tu;
const Fm = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function xm(e) {
  return Fm.test(e);
}
function Ps(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Lm(e) {
  let t = null;
  const n = Dm.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new tu(i.name);
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
  var r = Ne;
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
  var s = ha;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = pa;
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
var we = {}, ma = {}, Ze = {};
function nu(e) {
  return typeof e > "u" || e === null;
}
function Um(e) {
  return typeof e == "object" && e !== null;
}
function km(e) {
  return Array.isArray(e) ? e : nu(e) ? [] : [e];
}
function Mm(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Bm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function jm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ze.isNothing = nu;
Ze.isObject = Um;
Ze.toArray = km;
Ze.repeat = Bm;
Ze.isNegativeZero = jm;
Ze.extend = Mm;
function ru(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Qn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = ru(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Qn.prototype = Object.create(Error.prototype);
Qn.prototype.constructor = Qn;
Qn.prototype.toString = function(t) {
  return this.name + ": " + ru(this, t);
};
var gr = Qn, jn = Ze;
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
function Hm(e, t) {
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
var Gm = Hm, Ns = gr, qm = [
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
], Wm = [
  "scalar",
  "sequence",
  "mapping"
];
function Vm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function Ym(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (qm.indexOf(n) === -1)
      throw new Ns('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Vm(t.styleAliases || null), Wm.indexOf(this.kind) === -1)
    throw new Ns('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Le = Ym, xn = gr, no = Le;
function Ds(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function zm() {
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
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = Ds(i, "implicit"), i.compiledExplicit = Ds(i, "explicit"), i.compiledTypeMap = zm(i.compiledImplicit, i.compiledExplicit), i;
};
var iu = Uo, Xm = Le, ou = new Xm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Km = Le, au = new Km("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Jm = Le, su = new Jm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Qm = iu, lu = new Qm({
  explicit: [
    ou,
    au,
    su
  ]
}), Zm = Le;
function eg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function tg() {
  return null;
}
function ng(e) {
  return e === null;
}
var cu = new Zm("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: eg,
  construct: tg,
  predicate: ng,
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
}), rg = Le;
function ig(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function og(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function ag(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var uu = new rg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: ig,
  construct: og,
  predicate: ag,
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
}), sg = Ze, lg = Le;
function cg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ug(e) {
  return 48 <= e && e <= 55;
}
function fg(e) {
  return 48 <= e && e <= 57;
}
function dg(e) {
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
          if (!cg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!ug(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!fg(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function hg(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function pg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !sg.isNegativeZero(e);
}
var fu = new lg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: dg,
  construct: hg,
  predicate: pg,
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
}), du = Ze, mg = Le, gg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function yg(e) {
  return !(e === null || !gg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Eg(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var wg = /^[-+]?[0-9]+e/;
function vg(e, t) {
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
  else if (du.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), wg.test(n) ? n.replace("e", ".e") : n;
}
function _g(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || du.isNegativeZero(e));
}
var hu = new mg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: yg,
  construct: Eg,
  predicate: _g,
  represent: vg,
  defaultStyle: "lowercase"
}), pu = lu.extend({
  implicit: [
    cu,
    uu,
    fu,
    hu
  ]
}), mu = pu, Sg = Le, gu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), yu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Ag(e) {
  return e === null ? !1 : gu.exec(e) !== null || yu.exec(e) !== null;
}
function Tg(e) {
  var t, n, r, i, o, a, s, l = 0, p = null, c, f, h;
  if (t = gu.exec(e), t === null && (t = yu.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), p = (c * 60 + f) * 6e4, t[9] === "-" && (p = -p)), h = new Date(Date.UTC(n, r, i, o, a, s, l)), p && h.setTime(h.getTime() - p), h;
}
function Cg(e) {
  return e.toISOString();
}
var Eu = new Sg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Ag,
  construct: Tg,
  instanceOf: Date,
  represent: Cg
}), $g = Le;
function bg(e) {
  return e === "<<" || e === null;
}
var wu = new $g("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: bg
}), Ig = Le, ga = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Rg(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = ga;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function Og(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = ga, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Pg(e) {
  var t = "", n = 0, r, i, o = e.length, a = ga;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function Ng(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var vu = new Ig("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Rg,
  construct: Og,
  predicate: Ng,
  represent: Pg
}), Dg = Le, Fg = Object.prototype.hasOwnProperty, xg = Object.prototype.toString;
function Lg(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, xg.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Fg.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Ug(e) {
  return e !== null ? e : [];
}
var _u = new Dg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Lg,
  construct: Ug
}), kg = Le, Mg = Object.prototype.toString;
function Bg(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], Mg.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function jg(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var Su = new kg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Bg,
  construct: jg
}), Hg = Le, Gg = Object.prototype.hasOwnProperty;
function qg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (Gg.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function Wg(e) {
  return e !== null ? e : {};
}
var Au = new Hg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: qg,
  construct: Wg
}), ya = mu.extend({
  implicit: [
    Eu,
    wu
  ],
  explicit: [
    vu,
    _u,
    Su,
    Au
  ]
}), Ht = Ze, Tu = gr, Vg = Gm, Yg = ya, Ct = Object.prototype.hasOwnProperty, si = 1, Cu = 2, $u = 3, li = 4, ro = 1, zg = 2, Fs = 3, Xg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Kg = /[\x85\u2028\u2029]/, Jg = /[,\[\]\{\}]/, bu = /^(?:!|!!|![a-z\-]+!)$/i, Iu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function xs(e) {
  return Object.prototype.toString.call(e);
}
function at(e) {
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
function Qg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Zg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function e0(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ls(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function t0(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Ru(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var Ou = new Array(256), Pu = new Array(256);
for (var rn = 0; rn < 256; rn++)
  Ou[rn] = Ls(rn) ? 1 : 0, Pu[rn] = Ls(rn);
function n0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Yg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Nu(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = Vg(n), new Tu(t, n);
}
function U(e, t) {
  throw Nu(e, t);
}
function ci(e, t) {
  e.onWarning && e.onWarning.call(null, Nu(e, t));
}
var Us = {
  YAML: function(t, n, r) {
    var i, o, a;
    t.version !== null && U(t, "duplication of %YAML directive"), r.length !== 1 && U(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && U(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && U(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && ci(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && U(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], bu.test(i) || U(t, "ill-formed tag handle (first argument) of the TAG directive"), Ct.call(t.tagMap, i) && U(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Iu.test(o) || U(t, "ill-formed tag prefix (second argument) of the TAG directive");
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
    else Xg.test(s) && U(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function ks(e, t, n, r) {
  var i, o, a, s;
  for (Ht.isObject(n) || U(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], Ct.call(t, o) || (Ru(t, o, n[o]), r[o] = !0);
}
function fn(e, t, n, r, i, o, a, s, l) {
  var p, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), p = 0, c = i.length; p < c; p += 1)
      Array.isArray(i[p]) && U(e, "nested arrays are not supported inside keys"), typeof i == "object" && xs(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  if (typeof i == "object" && xs(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (p = 0, c = o.length; p < c; p += 1)
        ks(e, t, o[p], n);
    else
      ks(e, t, o, n);
  else
    !e.json && !Ct.call(n, i) && Ct.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, U(e, "duplicated mapping key")), Ru(t, i, o), delete n[i];
  return t;
}
function Ea(e) {
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
    if (at(i))
      for (Ea(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
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
function wa(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Ht.repeat(`
`, t - 1));
}
function r0(e, t, n) {
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
      if (at(m))
        if (l = e.line, p = e.lineStart, c = e.lineIndent, ue(e, !1, -1), e.lineIndent >= t) {
          s = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = p, e.lineIndent = c;
          break;
        }
    }
    s && (St(e, o, a, !1), wa(e, e.line - l), o = a = e.position, s = !1), Yt(m) || (a = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return St(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function i0(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (St(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else at(n) ? (St(e, r, i, !0), wa(e, ue(e, !1, t)), r = i = e.position) : e.position === e.lineStart && _i(e) ? U(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  U(e, "unexpected end of the stream within a single quoted scalar");
}
function o0(e, t) {
  var n, r, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return St(e, n, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (St(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), at(s))
        ue(e, !1, t);
      else if (s < 256 && Ou[s])
        e.result += Pu[s], e.position++;
      else if ((a = Zg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = Qg(s)) >= 0 ? o = (o << 4) + a : U(e, "expected hexadecimal character");
        e.result += t0(o), e.position++;
      } else
        U(e, "unknown escape sequence");
      n = r = e.position;
    } else at(s) ? (St(e, n, r, !0), wa(e, ue(e, !1, t)), n = r = e.position) : e.position === e.lineStart && _i(e) ? U(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  U(e, "unexpected end of the stream within a double quoted scalar");
}
function a0(e, t) {
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
function s0(e, t) {
  var n, r, i = ro, o = !1, a = !1, s = t, l = 0, p = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      ro === i ? i = f === 43 ? Fs : zg : U(e, "repeat of a chomping mode identifier");
    else if ((c = e0(f)) >= 0)
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
      while (!at(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (Ea(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), at(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Fs ? e.result += Ht.repeat(`
`, o ? 1 + l : l) : i === ro && o && (e.result += `
`);
      break;
    }
    for (r ? Yt(f) ? (p = !0, e.result += Ht.repeat(`
`, o ? 1 + l : l)) : p ? (p = !1, e.result += Ht.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Ht.repeat(`
`, l) : e.result += Ht.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, n = e.position; !at(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    St(e, n, e.position, !1);
  }
  return !0;
}
function Ms(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Me(a)))); ) {
    if (s = !0, e.position++, ue(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, _n(e, t, $u, !1, !0), o.push(e.result), ue(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      U(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function l0(e, t, n) {
  var r, i, o, a, s, l, p = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), m = null, E = null, y = null, S = !1, C = !1, T;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), T = e.input.charCodeAt(e.position); T !== 0; ) {
    if (!S && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (T === 63 || T === 58) && Me(r))
      T === 63 ? (S && (fn(e, f, h, m, E, null, a, s, l), m = E = y = null), C = !0, S = !0, i = !0) : S ? (S = !1, i = !0) : U(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, T = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !_n(e, n, Cu, !1, !0))
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
function c0(e) {
  var t, n = !1, r = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && U(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (n = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (r = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : U(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Me(a); )
      a === 33 && (r ? U(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), bu.test(i) || U(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), Jg.test(o) && U(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Iu.test(o) && U(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    U(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : Ct.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : U(e, 'undeclared tag handle "' + i + '"'), !0;
}
function u0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && U(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Me(n) && !un(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function f0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Me(r) && !un(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), Ct.call(e.anchorMap, n) || U(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], ue(e, !0, -1), !0;
}
function _n(e, t, n, r, i) {
  var o, a, s, l = 1, p = !1, c = !1, f, h, m, E, y, S;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = li === n || $u === n, r && ue(e, !0, -1) && (p = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; c0(e) || u0(e); )
      ue(e, !0, -1) ? (p = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = p || i), (l === 1 || li === n) && (si === n || Cu === n ? y = t : y = t + 1, S = e.position - e.lineStart, l === 1 ? s && (Ms(e, S) || l0(e, S, y)) || a0(e, y) ? c = !0 : (a && s0(e, y) || i0(e, y) || o0(e, y) ? c = !0 : f0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && U(e, "alias node should not have any properties")) : r0(e, y, si === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Ms(e, S))), e.tag === null)
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
function d0(e) {
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
        while (a !== 0 && !at(a));
        break;
      }
      if (at(a)) break;
      for (n = e.position; a !== 0 && !Me(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    a !== 0 && Ea(e), Ct.call(Us, r) ? Us[r](e, r, i) : ci(e, 'unknown document directive "' + r + '"');
  }
  if (ue(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ue(e, !0, -1)) : o && U(e, "directives end mark is expected"), _n(e, e.lineIndent - 1, li, !1, !0), ue(e, !0, -1), e.checkLineBreaks && Kg.test(e.input.slice(t, e.position)) && ci(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && _i(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ue(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    U(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Du(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new n0(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, U(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    d0(n);
  return n.documents;
}
function h0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = Du(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function p0(e, t) {
  var n = Du(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new Tu("expected a single document in the stream, but found more");
  }
}
ma.loadAll = h0;
ma.load = p0;
var Fu = {}, Si = Ze, yr = gr, m0 = ya, xu = Object.prototype.toString, Lu = Object.prototype.hasOwnProperty, va = 65279, g0 = 9, Zn = 10, y0 = 13, E0 = 32, w0 = 33, v0 = 34, ko = 35, _0 = 37, S0 = 38, A0 = 39, T0 = 42, Uu = 44, C0 = 45, ui = 58, $0 = 61, b0 = 62, I0 = 63, R0 = 64, ku = 91, Mu = 93, O0 = 96, Bu = 123, P0 = 124, ju = 125, $e = {};
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
var N0 = [
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
], D0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function F0(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Lu.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function x0(e) {
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
var L0 = 1, er = 2;
function U0(e) {
  this.schema = e.schema || m0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Si.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = F0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? er : L0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Bs(e, t) {
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
function k0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function fi(e) {
  return e === E0 || e === g0;
}
function tr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== va || 65536 <= e && e <= 1114111;
}
function js(e) {
  return tr(e) && e !== va && e !== y0 && e !== Zn;
}
function Hs(e, t, n) {
  var r = js(e), i = r && !fi(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Uu && e !== ku && e !== Mu && e !== Bu && e !== ju) && e !== ko && !(t === ui && !i) || js(t) && !fi(t) && e === ko || t === ui && i
  );
}
function M0(e) {
  return tr(e) && e !== va && !fi(e) && e !== C0 && e !== I0 && e !== ui && e !== Uu && e !== ku && e !== Mu && e !== Bu && e !== ju && e !== ko && e !== S0 && e !== T0 && e !== w0 && e !== P0 && e !== $0 && e !== b0 && e !== A0 && e !== v0 && e !== _0 && e !== R0 && e !== O0;
}
function B0(e) {
  return !fi(e) && e !== ui;
}
function Hn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Hu(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Gu = 1, Bo = 2, qu = 3, Wu = 4, ln = 5;
function j0(e, t, n, r, i, o, a, s) {
  var l, p = 0, c = null, f = !1, h = !1, m = r !== -1, E = -1, y = M0(Hn(e, 0)) && B0(Hn(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = Hn(e, l), !tr(p))
        return ln;
      y = y && Hs(p, c, s), c = p;
    }
  else {
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = Hn(e, l), p === Zn)
        f = !0, m && (h = h || // Foldable line = too long, and not more-indented.
        l - E - 1 > r && e[E + 1] !== " ", E = l);
      else if (!tr(p))
        return ln;
      y = y && Hs(p, c, s), c = p;
    }
    h = h || m && l - E - 1 > r && e[E + 1] !== " ";
  }
  return !f && !h ? y && !a && !i(e) ? Gu : o === er ? ln : Bo : n > 9 && Hu(e) ? ln : a ? o === er ? ln : Bo : h ? Wu : qu;
}
function H0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === er ? '""' : "''";
    if (!e.noCompatMode && (N0.indexOf(t) !== -1 || D0.test(t)))
      return e.quotingType === er ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(p) {
      return k0(e, p);
    }
    switch (j0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case Gu:
        return t;
      case Bo:
        return "'" + t.replace(/'/g, "''") + "'";
      case qu:
        return "|" + Gs(t, e.indent) + qs(Bs(t, o));
      case Wu:
        return ">" + Gs(t, e.indent) + qs(Bs(G0(t, a), o));
      case ln:
        return '"' + q0(t) + '"';
      default:
        throw new yr("impossible error: invalid scalar style");
    }
  }();
}
function Gs(e, t) {
  var n = Hu(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function qs(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function G0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var p = e.indexOf(`
`);
    return p = p !== -1 ? p : e.length, n.lastIndex = p, Ws(e.slice(0, p), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = n.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", r += s + (!i && !o && l !== "" ? `
` : "") + Ws(l, t), i = o;
  }
  return r;
}
function Ws(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, a = 0, s = 0, l = ""; r = n.exec(e); )
    s = r.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function q0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = Hn(e, i), r = $e[n], !r && tr(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || x0(n);
  return t;
}
function W0(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (ht(e, t, s, !1, !1) || typeof s > "u" && ht(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Vs(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (ht(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && ht(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Mo(e, t)), e.dump && Zn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function V0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, p, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], p = n[l], e.replacer && (p = e.replacer.call(n, l, p)), ht(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ht(e, t, p, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function Y0(e, t, n, r) {
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
function Ys(e, t, n) {
  var r, i, o, a, s, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, xu.call(s.represent) === "[object Function]")
          r = s.represent(t, l);
        else if (Lu.call(s.represent, l))
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
  e.tag = null, e.dump = n, Ys(e, n, !1) || Ys(e, n, !0);
  var s = xu.call(e.dump), l = r, p;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (Y0(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (V0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Vs(e, t - 1, e.dump, i) : Vs(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (W0(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && H0(e, e.dump, t, o, l);
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
function z0(e, t) {
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
function X0(e, t) {
  t = t || {};
  var n = new U0(t);
  n.noRefs || z0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), ht(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Fu.dump = X0;
var Vu = ma, K0 = Fu;
function _a(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
we.Type = Le;
we.Schema = iu;
we.FAILSAFE_SCHEMA = lu;
we.JSON_SCHEMA = pu;
we.CORE_SCHEMA = mu;
we.DEFAULT_SCHEMA = ya;
we.load = Vu.load;
we.loadAll = Vu.loadAll;
we.dump = K0.dump;
we.YAMLException = gr;
we.types = {
  binary: vu,
  float: hu,
  map: su,
  null: cu,
  pairs: Su,
  set: Au,
  timestamp: Eu,
  bool: uu,
  int: fu,
  merge: wu,
  omap: _u,
  seq: au,
  str: ou
};
we.safeLoad = _a("safeLoad", "load");
we.safeLoadAll = _a("safeLoadAll", "loadAll");
we.safeDump = _a("safeDump", "dump");
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.Lazy = void 0;
class J0 {
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
Ai.Lazy = J0;
var Ho = { exports: {} };
const Q0 = "2.0.0", Yu = 256, Z0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, ey = 16, ty = Yu - 6, ny = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ti = {
  MAX_LENGTH: Yu,
  MAX_SAFE_COMPONENT_LENGTH: ey,
  MAX_SAFE_BUILD_LENGTH: ty,
  MAX_SAFE_INTEGER: Z0,
  RELEASE_TYPES: ny,
  SEMVER_SPEC_VERSION: Q0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const ry = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ci = ry;
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
const iy = Object.freeze({ loose: !0 }), oy = Object.freeze({}), ay = (e) => e ? typeof e != "object" ? iy : e : oy;
var Sa = ay;
const zs = /^[0-9]+$/, zu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = zs.test(e), r = zs.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, sy = (e, t) => zu(t, e);
var Xu = {
  compareIdentifiers: zu,
  rcompareIdentifiers: sy
};
const Mr = Ci, { MAX_LENGTH: Xs, MAX_SAFE_INTEGER: Br } = Ti, { safeRe: jr, t: Hr } = Er, ly = Sa, { compareIdentifiers: io } = Xu;
let cy = class it {
  constructor(t, n) {
    if (n = ly(n), t instanceof it) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Xs)
      throw new TypeError(
        `version is longer than ${Xs} characters`
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
    if (Mr("SemVer.compare", this.version, this.options, t), !(t instanceof it)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new it(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof it || (t = new it(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof it || (t = new it(t, this.options)), this.prerelease.length && !t.prerelease.length)
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
    t instanceof it || (t = new it(t, this.options));
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
var Ue = cy;
const Ks = Ue, uy = (e, t, n = !1) => {
  if (e instanceof Ks)
    return e;
  try {
    return new Ks(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var Cn = uy;
const fy = Cn, dy = (e, t) => {
  const n = fy(e, t);
  return n ? n.version : null;
};
var hy = dy;
const py = Cn, my = (e, t) => {
  const n = py(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var gy = my;
const Js = Ue, yy = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Js(
      e instanceof Js ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var Ey = yy;
const Qs = Cn, wy = (e, t) => {
  const n = Qs(e, null, !0), r = Qs(t, null, !0), i = n.compare(r);
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
var vy = wy;
const _y = Ue, Sy = (e, t) => new _y(e, t).major;
var Ay = Sy;
const Ty = Ue, Cy = (e, t) => new Ty(e, t).minor;
var $y = Cy;
const by = Ue, Iy = (e, t) => new by(e, t).patch;
var Ry = Iy;
const Oy = Cn, Py = (e, t) => {
  const n = Oy(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var Ny = Py;
const Zs = Ue, Dy = (e, t, n) => new Zs(e, n).compare(new Zs(t, n));
var et = Dy;
const Fy = et, xy = (e, t, n) => Fy(t, e, n);
var Ly = xy;
const Uy = et, ky = (e, t) => Uy(e, t, !0);
var My = ky;
const el = Ue, By = (e, t, n) => {
  const r = new el(e, n), i = new el(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var Aa = By;
const jy = Aa, Hy = (e, t) => e.sort((n, r) => jy(n, r, t));
var Gy = Hy;
const qy = Aa, Wy = (e, t) => e.sort((n, r) => qy(r, n, t));
var Vy = Wy;
const Yy = et, zy = (e, t, n) => Yy(e, t, n) > 0;
var $i = zy;
const Xy = et, Ky = (e, t, n) => Xy(e, t, n) < 0;
var Ta = Ky;
const Jy = et, Qy = (e, t, n) => Jy(e, t, n) === 0;
var Ku = Qy;
const Zy = et, eE = (e, t, n) => Zy(e, t, n) !== 0;
var Ju = eE;
const tE = et, nE = (e, t, n) => tE(e, t, n) >= 0;
var Ca = nE;
const rE = et, iE = (e, t, n) => rE(e, t, n) <= 0;
var $a = iE;
const oE = Ku, aE = Ju, sE = $i, lE = Ca, cE = Ta, uE = $a, fE = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return oE(e, n, r);
    case "!=":
      return aE(e, n, r);
    case ">":
      return sE(e, n, r);
    case ">=":
      return lE(e, n, r);
    case "<":
      return cE(e, n, r);
    case "<=":
      return uE(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Qu = fE;
const dE = Ue, hE = Cn, { safeRe: Gr, t: qr } = Er, pE = (e, t) => {
  if (e instanceof dE)
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
  return hE(`${r}.${i}.${o}${a}${s}`, t);
};
var mE = pE;
class gE {
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
var yE = gE, oo, tl;
function tt() {
  if (tl) return oo;
  tl = 1;
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
      const F = /* @__PURE__ */ new Map(), J = W.map((B) => new o(B, this.options));
      for (const B of J) {
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
  const n = yE, r = new n(), i = Sa, o = bi(), a = Ci, s = Ue, {
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
  }, T = (R, I) => (R = R.replace(l[p.BUILD], ""), a("comp", R, I), R = K(R, I), a("caret", R), R = k(R, I), a("tildes", R), R = te(R, I), a("xrange", R), R = w(R, I), a("stars", R), R), D = (R) => !R || R.toLowerCase() === "x" || R === "*", k = (R, I) => R.trim().split(/\s+/).map((P) => G(P, I)).join(" "), G = (R, I) => {
    const P = I.loose ? l[p.TILDELOOSE] : l[p.TILDE];
    return R.replace(P, (b, N, O, M, W) => {
      a("tilde", R, b, N, O, M, W);
      let F;
      return D(N) ? F = "" : D(O) ? F = `>=${N}.0.0 <${+N + 1}.0.0-0` : D(M) ? F = `>=${N}.${O}.0 <${N}.${+O + 1}.0-0` : W ? (a("replaceTilde pr", W), F = `>=${N}.${O}.${M}-${W} <${N}.${+O + 1}.0-0`) : F = `>=${N}.${O}.${M} <${N}.${+O + 1}.0-0`, a("tilde return", F), F;
    });
  }, K = (R, I) => R.trim().split(/\s+/).map((P) => Z(P, I)).join(" "), Z = (R, I) => {
    a("caret", R, I);
    const P = I.loose ? l[p.CARETLOOSE] : l[p.CARET], b = I.includePrerelease ? "-0" : "";
    return R.replace(P, (N, O, M, W, F) => {
      a("caret", R, N, O, M, W, F);
      let J;
      return D(O) ? J = "" : D(M) ? J = `>=${O}.0.0${b} <${+O + 1}.0.0-0` : D(W) ? O === "0" ? J = `>=${O}.${M}.0${b} <${O}.${+M + 1}.0-0` : J = `>=${O}.${M}.0${b} <${+O + 1}.0.0-0` : F ? (a("replaceCaret pr", F), O === "0" ? M === "0" ? J = `>=${O}.${M}.${W}-${F} <${O}.${M}.${+W + 1}-0` : J = `>=${O}.${M}.${W}-${F} <${O}.${+M + 1}.0-0` : J = `>=${O}.${M}.${W}-${F} <${+O + 1}.0.0-0`) : (a("no pr"), O === "0" ? M === "0" ? J = `>=${O}.${M}.${W}${b} <${O}.${M}.${+W + 1}-0` : J = `>=${O}.${M}.${W}${b} <${O}.${+M + 1}.0-0` : J = `>=${O}.${M}.${W} <${+O + 1}.0.0-0`), a("caret return", J), J;
    });
  }, te = (R, I) => (a("replaceXRanges", R, I), R.split(/\s+/).map((P) => L(P, I)).join(" ")), L = (R, I) => {
    R = R.trim();
    const P = I.loose ? l[p.XRANGELOOSE] : l[p.XRANGE];
    return R.replace(P, (b, N, O, M, W, F) => {
      a("xRange", R, b, N, O, M, W, F);
      const J = D(O), de = J || D(M), B = de || D(W), ve = B;
      return N === "=" && ve && (N = ""), F = I.includePrerelease ? "-0" : "", J ? N === ">" || N === "<" ? b = "<0.0.0-0" : b = "*" : N && ve ? (de && (M = 0), W = 0, N === ">" ? (N = ">=", de ? (O = +O + 1, M = 0, W = 0) : (M = +M + 1, W = 0)) : N === "<=" && (N = "<", de ? O = +O + 1 : M = +M + 1), N === "<" && (F = "-0"), b = `${N + O}.${M}.${W}${F}`) : de ? b = `>=${O}.0.0${F} <${+O + 1}.0.0-0` : B && (b = `>=${O}.${M}.0${F} <${O}.${+M + 1}.0-0`), a("xRange return", b), b;
    });
  }, w = (R, I) => (a("replaceStars", R, I), R.trim().replace(l[p.STAR], "")), H = (R, I) => (a("replaceGTE0", R, I), R.trim().replace(l[I.includePrerelease ? p.GTE0PRE : p.GTE0], "")), z = (R) => (I, P, b, N, O, M, W, F, J, de, B, ve) => (D(b) ? P = "" : D(N) ? P = `>=${b}.0.0${R ? "-0" : ""}` : D(O) ? P = `>=${b}.${N}.0${R ? "-0" : ""}` : M ? P = `>=${P}` : P = `>=${P}${R ? "-0" : ""}`, D(J) ? F = "" : D(de) ? F = `<${+J + 1}.0.0-0` : D(B) ? F = `<${J}.${+de + 1}.0-0` : ve ? F = `<=${J}.${de}.${B}-${ve}` : R ? F = `<${J}.${de}.${+B + 1}-0` : F = `<=${F}`, `${P} ${F}`.trim()), ne = (R, I, P) => {
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
var ao, nl;
function bi() {
  if (nl) return ao;
  nl = 1;
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
  const n = Sa, { safeRe: r, t: i } = Er, o = Qu, a = Ci, s = Ue, l = tt();
  return ao;
}
const EE = tt(), wE = (e, t, n) => {
  try {
    t = new EE(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ii = wE;
const vE = tt(), _E = (e, t) => new vE(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var SE = _E;
const AE = Ue, TE = tt(), CE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new TE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new AE(r, n));
  }), r;
};
var $E = CE;
const bE = Ue, IE = tt(), RE = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new IE(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new bE(r, n));
  }), r;
};
var OE = RE;
const so = Ue, PE = tt(), rl = $i, NE = (e, t) => {
  e = new PE(e, t);
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
          (!o || rl(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!n || rl(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var DE = NE;
const FE = tt(), xE = (e, t) => {
  try {
    return new FE(e, t).range || "*";
  } catch {
    return null;
  }
};
var LE = xE;
const UE = Ue, Zu = bi(), { ANY: kE } = Zu, ME = tt(), BE = Ii, il = $i, ol = Ta, jE = $a, HE = Ca, GE = (e, t, n, r) => {
  e = new UE(e, r), t = new ME(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = il, o = jE, a = ol, s = ">", l = ">=";
      break;
    case "<":
      i = ol, o = HE, a = il, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (BE(e, t, r))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const c = t.set[p];
    let f = null, h = null;
    if (c.forEach((m) => {
      m.semver === kE && (m = new Zu(">=0.0.0")), f = f || m, h = h || m, i(m.semver, f.semver, r) ? f = m : a(m.semver, h.semver, r) && (h = m);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var ba = GE;
const qE = ba, WE = (e, t, n) => qE(e, t, ">", n);
var VE = WE;
const YE = ba, zE = (e, t, n) => YE(e, t, "<", n);
var XE = zE;
const al = tt(), KE = (e, t, n) => (e = new al(e, n), t = new al(t, n), e.intersects(t, n));
var JE = KE;
const QE = Ii, ZE = et;
var ew = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((c, f) => ZE(c, f, n));
  for (const c of a)
    QE(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [c, f] of r)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < p.length ? l : t;
};
const sl = tt(), Ia = bi(), { ANY: lo } = Ia, Ln = Ii, Ra = et, tw = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new sl(e, n), t = new sl(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = rw(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, nw = [new Ia(">=0.0.0-0")], ll = [new Ia(">=0.0.0")], rw = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === lo) {
    if (t.length === 1 && t[0].semver === lo)
      return !0;
    n.includePrerelease ? e = nw : e = ll;
  }
  if (t.length === 1 && t[0].semver === lo) {
    if (n.includePrerelease)
      return !0;
    t = ll;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = cl(i, m, n) : m.operator === "<" || m.operator === "<=" ? o = ul(o, m, n) : r.add(m.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = Ra(i.semver, o.semver, n), a > 0)
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
        if (s = cl(i, m, n), s === m && s !== i)
          return !1;
      } else if (i.operator === ">=" && !Ln(i.semver, String(m), n))
        return !1;
    }
    if (o) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (l = ul(o, m, n), l === m && l !== o)
          return !1;
      } else if (o.operator === "<=" && !Ln(o.semver, String(m), n))
        return !1;
    }
    if (!m.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && p && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, cl = (e, t, n) => {
  if (!e)
    return t;
  const r = Ra(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, ul = (e, t, n) => {
  if (!e)
    return t;
  const r = Ra(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var iw = tw;
const co = Er, fl = Ti, ow = Ue, dl = Xu, aw = Cn, sw = hy, lw = gy, cw = Ey, uw = vy, fw = Ay, dw = $y, hw = Ry, pw = Ny, mw = et, gw = Ly, yw = My, Ew = Aa, ww = Gy, vw = Vy, _w = $i, Sw = Ta, Aw = Ku, Tw = Ju, Cw = Ca, $w = $a, bw = Qu, Iw = mE, Rw = bi(), Ow = tt(), Pw = Ii, Nw = SE, Dw = $E, Fw = OE, xw = DE, Lw = LE, Uw = ba, kw = VE, Mw = XE, Bw = JE, jw = ew, Hw = iw;
var ef = {
  parse: aw,
  valid: sw,
  clean: lw,
  inc: cw,
  diff: uw,
  major: fw,
  minor: dw,
  patch: hw,
  prerelease: pw,
  compare: mw,
  rcompare: gw,
  compareLoose: yw,
  compareBuild: Ew,
  sort: ww,
  rsort: vw,
  gt: _w,
  lt: Sw,
  eq: Aw,
  neq: Tw,
  gte: Cw,
  lte: $w,
  cmp: bw,
  coerce: Iw,
  Comparator: Rw,
  Range: Ow,
  satisfies: Pw,
  toComparators: Nw,
  maxSatisfying: Dw,
  minSatisfying: Fw,
  minVersion: xw,
  validRange: Lw,
  outside: Uw,
  gtr: kw,
  ltr: Mw,
  intersects: Bw,
  simplifyRange: jw,
  subset: Hw,
  SemVer: ow,
  re: co.re,
  src: co.src,
  tokens: co.t,
  SEMVER_SPEC_VERSION: fl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: fl.RELEASE_TYPES,
  compareIdentifiers: dl.compareIdentifiers,
  rcompareIdentifiers: dl.rcompareIdentifiers
}, wr = {}, di = { exports: {} };
di.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", p = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", m = "[object Function]", E = "[object GeneratorFunction]", y = "[object Map]", S = "[object Number]", C = "[object Null]", T = "[object Object]", D = "[object Promise]", k = "[object Proxy]", G = "[object RegExp]", K = "[object Set]", Z = "[object String]", te = "[object Symbol]", L = "[object Undefined]", w = "[object WeakMap]", H = "[object ArrayBuffer]", z = "[object DataView]", ne = "[object Float32Array]", R = "[object Float64Array]", I = "[object Int8Array]", P = "[object Int16Array]", b = "[object Int32Array]", N = "[object Uint8Array]", O = "[object Uint8ClampedArray]", M = "[object Uint16Array]", W = "[object Uint32Array]", F = /[\\^$.*+?()[\]{}|]/g, J = /^\[object .+?Constructor\]$/, de = /^(?:0|[1-9]\d*)$/, B = {};
  B[ne] = B[R] = B[I] = B[P] = B[b] = B[N] = B[O] = B[M] = B[W] = !0, B[s] = B[l] = B[H] = B[c] = B[z] = B[f] = B[h] = B[m] = B[y] = B[S] = B[T] = B[G] = B[K] = B[Z] = B[w] = !1;
  var ve = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, In = typeof self == "object" && self && self.Object === Object && self, We = ve || In || Function("return this")(), Rn = t && !t.nodeType && t, en = Rn && !0 && e && !e.nodeType && e, Tr = en && en.exports === Rn, d = Tr && ve.process, u = function() {
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
  function Ve(g, _) {
    return g == null ? void 0 : g[_];
  }
  function he(g) {
    var _ = -1, $ = Array(g.size);
    return g.forEach(function(x, ee) {
      $[++_] = [ee, x];
    }), $;
  }
  function Ye(g, _) {
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
  var Cr = Array.prototype, On = Function.prototype, Nt = Object.prototype, Mi = We["__core-js_shared__"], La = On.toString, rt = Nt.hasOwnProperty, Ua = function() {
    var g = /[^.]+$/.exec(Mi && Mi.keys && Mi.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), ka = Nt.toString, _f = RegExp(
    "^" + La.call(rt).replace(F, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ma = Tr ? We.Buffer : void 0, $r = We.Symbol, Ba = We.Uint8Array, ja = Nt.propertyIsEnumerable, Sf = Cr.splice, Dt = $r ? $r.toStringTag : void 0, Ha = Object.getOwnPropertySymbols, Af = Ma ? Ma.isBuffer : void 0, Tf = Ye(Object.keys, Object), Bi = tn(We, "DataView"), Pn = tn(We, "Map"), ji = tn(We, "Promise"), Hi = tn(We, "Set"), Gi = tn(We, "WeakMap"), Nn = tn(Object, "create"), Cf = Lt(Bi), $f = Lt(Pn), bf = Lt(ji), If = Lt(Hi), Rf = Lt(Gi), Ga = $r ? $r.prototype : void 0, qi = Ga ? Ga.valueOf : void 0;
  function Ft(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var x = g[_];
      this.set(x[0], x[1]);
    }
  }
  function Of() {
    this.__data__ = Nn ? Nn(null) : {}, this.size = 0;
  }
  function Pf(g) {
    var _ = this.has(g) && delete this.__data__[g];
    return this.size -= _ ? 1 : 0, _;
  }
  function Nf(g) {
    var _ = this.__data__;
    if (Nn) {
      var $ = _[g];
      return $ === r ? void 0 : $;
    }
    return rt.call(_, g) ? _[g] : void 0;
  }
  function Df(g) {
    var _ = this.__data__;
    return Nn ? _[g] !== void 0 : rt.call(_, g);
  }
  function Ff(g, _) {
    var $ = this.__data__;
    return this.size += this.has(g) ? 0 : 1, $[g] = Nn && _ === void 0 ? r : _, this;
  }
  Ft.prototype.clear = Of, Ft.prototype.delete = Pf, Ft.prototype.get = Nf, Ft.prototype.has = Df, Ft.prototype.set = Ff;
  function lt(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var x = g[_];
      this.set(x[0], x[1]);
    }
  }
  function xf() {
    this.__data__ = [], this.size = 0;
  }
  function Lf(g) {
    var _ = this.__data__, $ = Ir(_, g);
    if ($ < 0)
      return !1;
    var x = _.length - 1;
    return $ == x ? _.pop() : Sf.call(_, $, 1), --this.size, !0;
  }
  function Uf(g) {
    var _ = this.__data__, $ = Ir(_, g);
    return $ < 0 ? void 0 : _[$][1];
  }
  function kf(g) {
    return Ir(this.__data__, g) > -1;
  }
  function Mf(g, _) {
    var $ = this.__data__, x = Ir($, g);
    return x < 0 ? (++this.size, $.push([g, _])) : $[x][1] = _, this;
  }
  lt.prototype.clear = xf, lt.prototype.delete = Lf, lt.prototype.get = Uf, lt.prototype.has = kf, lt.prototype.set = Mf;
  function xt(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var x = g[_];
      this.set(x[0], x[1]);
    }
  }
  function Bf() {
    this.size = 0, this.__data__ = {
      hash: new Ft(),
      map: new (Pn || lt)(),
      string: new Ft()
    };
  }
  function jf(g) {
    var _ = Rr(this, g).delete(g);
    return this.size -= _ ? 1 : 0, _;
  }
  function Hf(g) {
    return Rr(this, g).get(g);
  }
  function Gf(g) {
    return Rr(this, g).has(g);
  }
  function qf(g, _) {
    var $ = Rr(this, g), x = $.size;
    return $.set(g, _), this.size += $.size == x ? 0 : 1, this;
  }
  xt.prototype.clear = Bf, xt.prototype.delete = jf, xt.prototype.get = Hf, xt.prototype.has = Gf, xt.prototype.set = qf;
  function br(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.__data__ = new xt(); ++_ < $; )
      this.add(g[_]);
  }
  function Wf(g) {
    return this.__data__.set(g, r), this;
  }
  function Vf(g) {
    return this.__data__.has(g);
  }
  br.prototype.add = br.prototype.push = Wf, br.prototype.has = Vf;
  function pt(g) {
    var _ = this.__data__ = new lt(g);
    this.size = _.size;
  }
  function Yf() {
    this.__data__ = new lt(), this.size = 0;
  }
  function zf(g) {
    var _ = this.__data__, $ = _.delete(g);
    return this.size = _.size, $;
  }
  function Xf(g) {
    return this.__data__.get(g);
  }
  function Kf(g) {
    return this.__data__.has(g);
  }
  function Jf(g, _) {
    var $ = this.__data__;
    if ($ instanceof lt) {
      var x = $.__data__;
      if (!Pn || x.length < n - 1)
        return x.push([g, _]), this.size = ++$.size, this;
      $ = this.__data__ = new xt(x);
    }
    return $.set(g, _), this.size = $.size, this;
  }
  pt.prototype.clear = Yf, pt.prototype.delete = zf, pt.prototype.get = Xf, pt.prototype.has = Kf, pt.prototype.set = Jf;
  function Qf(g, _) {
    var $ = Or(g), x = !$ && hd(g), ee = !$ && !x && Wi(g), j = !$ && !x && !ee && Qa(g), se = $ || x || ee || j, me = se ? le(g.length, String) : [], ye = me.length;
    for (var ie in g)
      rt.call(g, ie) && !(se && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ee && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      j && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      ld(ie, ye))) && me.push(ie);
    return me;
  }
  function Ir(g, _) {
    for (var $ = g.length; $--; )
      if (za(g[$][0], _))
        return $;
    return -1;
  }
  function Zf(g, _, $) {
    var x = _(g);
    return Or(g) ? x : Y(x, $(g));
  }
  function Dn(g) {
    return g == null ? g === void 0 ? L : C : Dt && Dt in Object(g) ? ad(g) : dd(g);
  }
  function qa(g) {
    return Fn(g) && Dn(g) == s;
  }
  function Wa(g, _, $, x, ee) {
    return g === _ ? !0 : g == null || _ == null || !Fn(g) && !Fn(_) ? g !== g && _ !== _ : ed(g, _, $, x, Wa, ee);
  }
  function ed(g, _, $, x, ee, j) {
    var se = Or(g), me = Or(_), ye = se ? l : mt(g), ie = me ? l : mt(_);
    ye = ye == s ? T : ye, ie = ie == s ? T : ie;
    var Be = ye == T, ze = ie == T, Ae = ye == ie;
    if (Ae && Wi(g)) {
      if (!Wi(_))
        return !1;
      se = !0, Be = !1;
    }
    if (Ae && !Be)
      return j || (j = new pt()), se || Qa(g) ? Va(g, _, $, x, ee, j) : id(g, _, ye, $, x, ee, j);
    if (!($ & i)) {
      var He = Be && rt.call(g, "__wrapped__"), Ge = ze && rt.call(_, "__wrapped__");
      if (He || Ge) {
        var gt = He ? g.value() : g, ct = Ge ? _.value() : _;
        return j || (j = new pt()), ee(gt, ct, $, x, j);
      }
    }
    return Ae ? (j || (j = new pt()), od(g, _, $, x, ee, j)) : !1;
  }
  function td(g) {
    if (!Ja(g) || ud(g))
      return !1;
    var _ = Xa(g) ? _f : J;
    return _.test(Lt(g));
  }
  function nd(g) {
    return Fn(g) && Ka(g.length) && !!B[Dn(g)];
  }
  function rd(g) {
    if (!fd(g))
      return Tf(g);
    var _ = [];
    for (var $ in Object(g))
      rt.call(g, $) && $ != "constructor" && _.push($);
    return _;
  }
  function Va(g, _, $, x, ee, j) {
    var se = $ & i, me = g.length, ye = _.length;
    if (me != ye && !(se && ye > me))
      return !1;
    var ie = j.get(g);
    if (ie && j.get(_))
      return ie == _;
    var Be = -1, ze = !0, Ae = $ & o ? new br() : void 0;
    for (j.set(g, _), j.set(_, g); ++Be < me; ) {
      var He = g[Be], Ge = _[Be];
      if (x)
        var gt = se ? x(Ge, He, Be, _, g, j) : x(He, Ge, Be, g, _, j);
      if (gt !== void 0) {
        if (gt)
          continue;
        ze = !1;
        break;
      }
      if (Ae) {
        if (!re(_, function(ct, Ut) {
          if (!Se(Ae, Ut) && (He === ct || ee(He, ct, $, x, j)))
            return Ae.push(Ut);
        })) {
          ze = !1;
          break;
        }
      } else if (!(He === Ge || ee(He, Ge, $, x, j))) {
        ze = !1;
        break;
      }
    }
    return j.delete(g), j.delete(_), ze;
  }
  function id(g, _, $, x, ee, j, se) {
    switch ($) {
      case z:
        if (g.byteLength != _.byteLength || g.byteOffset != _.byteOffset)
          return !1;
        g = g.buffer, _ = _.buffer;
      case H:
        return !(g.byteLength != _.byteLength || !j(new Ba(g), new Ba(_)));
      case c:
      case f:
      case S:
        return za(+g, +_);
      case h:
        return g.name == _.name && g.message == _.message;
      case G:
      case Z:
        return g == _ + "";
      case y:
        var me = he;
      case K:
        var ye = x & i;
        if (me || (me = ki), g.size != _.size && !ye)
          return !1;
        var ie = se.get(g);
        if (ie)
          return ie == _;
        x |= o, se.set(g, _);
        var Be = Va(me(g), me(_), x, ee, j, se);
        return se.delete(g), Be;
      case te:
        if (qi)
          return qi.call(g) == qi.call(_);
    }
    return !1;
  }
  function od(g, _, $, x, ee, j) {
    var se = $ & i, me = Ya(g), ye = me.length, ie = Ya(_), Be = ie.length;
    if (ye != Be && !se)
      return !1;
    for (var ze = ye; ze--; ) {
      var Ae = me[ze];
      if (!(se ? Ae in _ : rt.call(_, Ae)))
        return !1;
    }
    var He = j.get(g);
    if (He && j.get(_))
      return He == _;
    var Ge = !0;
    j.set(g, _), j.set(_, g);
    for (var gt = se; ++ze < ye; ) {
      Ae = me[ze];
      var ct = g[Ae], Ut = _[Ae];
      if (x)
        var Za = se ? x(Ut, ct, Ae, _, g, j) : x(ct, Ut, Ae, g, _, j);
      if (!(Za === void 0 ? ct === Ut || ee(ct, Ut, $, x, j) : Za)) {
        Ge = !1;
        break;
      }
      gt || (gt = Ae == "constructor");
    }
    if (Ge && !gt) {
      var Pr = g.constructor, Nr = _.constructor;
      Pr != Nr && "constructor" in g && "constructor" in _ && !(typeof Pr == "function" && Pr instanceof Pr && typeof Nr == "function" && Nr instanceof Nr) && (Ge = !1);
    }
    return j.delete(g), j.delete(_), Ge;
  }
  function Ya(g) {
    return Zf(g, gd, sd);
  }
  function Rr(g, _) {
    var $ = g.__data__;
    return cd(_) ? $[typeof _ == "string" ? "string" : "hash"] : $.map;
  }
  function tn(g, _) {
    var $ = Ve(g, _);
    return td($) ? $ : void 0;
  }
  function ad(g) {
    var _ = rt.call(g, Dt), $ = g[Dt];
    try {
      g[Dt] = void 0;
      var x = !0;
    } catch {
    }
    var ee = ka.call(g);
    return x && (_ ? g[Dt] = $ : delete g[Dt]), ee;
  }
  var sd = Ha ? function(g) {
    return g == null ? [] : (g = Object(g), v(Ha(g), function(_) {
      return ja.call(g, _);
    }));
  } : yd, mt = Dn;
  (Bi && mt(new Bi(new ArrayBuffer(1))) != z || Pn && mt(new Pn()) != y || ji && mt(ji.resolve()) != D || Hi && mt(new Hi()) != K || Gi && mt(new Gi()) != w) && (mt = function(g) {
    var _ = Dn(g), $ = _ == T ? g.constructor : void 0, x = $ ? Lt($) : "";
    if (x)
      switch (x) {
        case Cf:
          return z;
        case $f:
          return y;
        case bf:
          return D;
        case If:
          return K;
        case Rf:
          return w;
      }
    return _;
  });
  function ld(g, _) {
    return _ = _ ?? a, !!_ && (typeof g == "number" || de.test(g)) && g > -1 && g % 1 == 0 && g < _;
  }
  function cd(g) {
    var _ = typeof g;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? g !== "__proto__" : g === null;
  }
  function ud(g) {
    return !!Ua && Ua in g;
  }
  function fd(g) {
    var _ = g && g.constructor, $ = typeof _ == "function" && _.prototype || Nt;
    return g === $;
  }
  function dd(g) {
    return ka.call(g);
  }
  function Lt(g) {
    if (g != null) {
      try {
        return La.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function za(g, _) {
    return g === _ || g !== g && _ !== _;
  }
  var hd = qa(/* @__PURE__ */ function() {
    return arguments;
  }()) ? qa : function(g) {
    return Fn(g) && rt.call(g, "callee") && !ja.call(g, "callee");
  }, Or = Array.isArray;
  function pd(g) {
    return g != null && Ka(g.length) && !Xa(g);
  }
  var Wi = Af || Ed;
  function md(g, _) {
    return Wa(g, _);
  }
  function Xa(g) {
    if (!Ja(g))
      return !1;
    var _ = Dn(g);
    return _ == m || _ == E || _ == p || _ == k;
  }
  function Ka(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= a;
  }
  function Ja(g) {
    var _ = typeof g;
    return g != null && (_ == "object" || _ == "function");
  }
  function Fn(g) {
    return g != null && typeof g == "object";
  }
  var Qa = A ? _e(A) : nd;
  function gd(g) {
    return pd(g) ? Qf(g) : rd(g);
  }
  function yd() {
    return [];
  }
  function Ed() {
    return !1;
  }
  e.exports = md;
})(di, di.exports);
var Gw = di.exports;
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.DownloadedUpdateHelper = void 0;
wr.createTempUpdateFile = zw;
const qw = fr, Ww = It, hl = Gw, Bt = Ot, Vn = ae;
class Vw {
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
      return hl(this.versionInfo, n) && hl(this.fileInfo.info, r.info) && await (0, Bt.pathExists)(t) ? t : null;
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
    const l = await Yw(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Vn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
wr.DownloadedUpdateHelper = Vw;
function Yw(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, qw.createHash)(t);
    a.on("error", o).setEncoding(n), (0, Ww.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function zw(e, t, n) {
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
var Ri = {}, Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
Oa.getAppCacheDir = Kw;
const uo = ae, Xw = mi;
function Kw() {
  const e = (0, Xw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || uo.join(e, "AppData", "Local") : process.platform === "darwin" ? t = uo.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || uo.join(e, ".cache"), t;
}
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.ElectronAppAdapter = void 0;
const pl = ae, Jw = Oa;
class Qw {
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
    return this.isPackaged ? pl.join(process.resourcesPath, "app-update.yml") : pl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Jw.getAppCacheDir)();
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
Ri.ElectronAppAdapter = Qw;
var tf = {};
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
})(tf);
var vr = {}, nt = {};
Object.defineProperty(nt, "__esModule", { value: !0 });
nt.newBaseUrl = Zw;
nt.newUrlFromBase = ev;
nt.getChannelFilename = tv;
const nf = Rt;
function Zw(e) {
  const t = new nf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function ev(e, t, n = !1) {
  const r = new nf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function tv(e) {
  return `${e}.yml`;
}
var fe = {}, nv = "[object Symbol]", rf = /[\\^$.*+?()[\]{}|]/g, rv = RegExp(rf.source), iv = typeof Oe == "object" && Oe && Oe.Object === Object && Oe, ov = typeof self == "object" && self && self.Object === Object && self, av = iv || ov || Function("return this")(), sv = Object.prototype, lv = sv.toString, ml = av.Symbol, gl = ml ? ml.prototype : void 0, yl = gl ? gl.toString : void 0;
function cv(e) {
  if (typeof e == "string")
    return e;
  if (fv(e))
    return yl ? yl.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function uv(e) {
  return !!e && typeof e == "object";
}
function fv(e) {
  return typeof e == "symbol" || uv(e) && lv.call(e) == nv;
}
function dv(e) {
  return e == null ? "" : cv(e);
}
function hv(e) {
  return e = dv(e), e && rv.test(e) ? e.replace(rf, "\\$&") : e;
}
var of = hv;
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.Provider = void 0;
fe.findFile = Ev;
fe.parseUpdateInfo = wv;
fe.getFileList = af;
fe.resolveFiles = vv;
const $t = pe, pv = we, mv = Rt, hi = nt, gv = of;
class yv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, hi.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, hi.newUrlFromBase)(`${t.pathname.replace(new RegExp(gv(r), "g"), n)}.blockmap`, i ? new mv.URL(i) : t), o];
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
fe.Provider = yv;
function Ev(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, $t.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((a) => !n.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function wv(e, t, n) {
  if (e == null)
    throw (0, $t.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, pv.load)(e);
  } catch (i) {
    throw (0, $t.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function af(e) {
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
function vv(e, t, n = (r) => r) {
  const i = af(e).map((s) => {
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
const El = pe, fo = nt, ho = fe;
class _v extends ho.Provider {
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
        if (i instanceof El.HttpError && i.statusCode === 404)
          throw (0, El.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
vr.GenericProvider = _v;
var Oi = {}, Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.BitbucketProvider = void 0;
const wl = pe, po = nt, mo = fe;
class Sv extends mo.Provider {
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
    const t = new wl.CancellationToken(), n = (0, po.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, po.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, mo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, wl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
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
Pi.BitbucketProvider = Sv;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.GitHubProvider = bt.BaseGitHubProvider = void 0;
bt.computeReleaseNotes = lf;
const ft = pe, Gt = ef, Av = Rt, dn = nt, Go = fe, go = /\/tag\/([^/]+)$/;
class sf extends Go.Provider {
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
bt.BaseGitHubProvider = sf;
class Tv extends sf {
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
            const D = T[1], k = ((r = Gt.prerelease(D)) === null || r === void 0 ? void 0 : r[0]) || null, G = !S || ["alpha", "beta"].includes(S), K = k !== null && !["alpha", "beta"].includes(String(k));
            if (G && !K && !(S === "beta" && k === "alpha")) {
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
    return y.releaseName == null && (y.releaseName = p.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = lf(this.updater.currentVersion, this.updater.fullChangelog, l, p)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, dn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Av.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
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
bt.GitHubProvider = Tv;
function vl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function lf(e, t, n, r) {
  if (!t)
    return vl(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Gt.valid(a) && Gt.lt(e, a) && i.push({
      version: a,
      note: vl(o)
    });
  }
  return i.sort((o, a) => Gt.rcompare(o.version, a.version));
}
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.GitLabProvider = void 0;
const be = pe, yo = Rt, Cv = of, Wr = nt, Eo = fe;
class $v extends Eo.Provider {
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
      const l = r.replace(new RegExp(Cv(n), "g"), t);
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
Ni.GitLabProvider = $v;
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.KeygenProvider = void 0;
const _l = pe, wo = nt, vo = fe;
class bv extends vo.Provider {
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
    const t = new _l.CancellationToken(), n = (0, wo.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, wo.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, vo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, _l.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
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
Di.KeygenProvider = bv;
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.PrivateGitHubProvider = void 0;
const on = pe, Iv = we, Rv = ae, Sl = Rt, Al = nt, Ov = bt, Pv = fe;
class Nv extends Ov.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new on.CancellationToken(), n = (0, Al.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, on.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Sl.URL(i.url);
    let a;
    try {
      a = (0, Iv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, Al.newUrlFromBase)(r, this.baseUrl);
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
    return (0, Pv.getFileList)(t).map((n) => {
      const r = Rv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, on.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Sl.URL(i.url),
        info: n
      };
    });
  }
}
Fi.PrivateGitHubProvider = Nv;
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.isUrlProbablySupportMultiRangeRequests = cf;
Oi.createClient = kv;
const Vr = pe, Dv = Pi, Tl = vr, Fv = bt, xv = Ni, Lv = Di, Uv = Fi;
function cf(e) {
  return !e.includes("s3.amazonaws.com");
}
function kv(e, t, n) {
  if (typeof e == "string")
    throw (0, Vr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Fv.GitHubProvider(i, t, n) : new Uv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new Dv.BitbucketProvider(e, t, n);
    case "gitlab":
      return new xv.GitLabProvider(e, t, n);
    case "keygen":
      return new Lv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Tl.GenericProvider({
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
      return new Tl.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && cf(i.url)
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
Zt.computeOperations = Mv;
var qt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(qt || (Zt.OperationKind = qt = {}));
function Mv(e, t, n) {
  const r = $l(e.files), i = $l(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, p = r.get(l);
  if (p == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: m } = jv(r.get(l), p.offset, n);
  let E = a.offset;
  for (let y = 0; y < c.checksums.length; E += c.sizes[y], y++) {
    const S = c.sizes[y], C = c.checksums[y];
    let T = h.get(C);
    T != null && m.get(C) !== S && (n.warn(`Checksum ("${C}") matches, but size differs (old: ${m.get(C)}, new: ${S})`), T = void 0), T === void 0 ? (f++, o != null && o.kind === qt.DOWNLOAD && o.end === E ? o.end += S : (o = {
      kind: qt.DOWNLOAD,
      start: E,
      end: E + S
      // oldBlocks: null,
    }, Cl(o, s, C, y))) : o != null && o.kind === qt.COPY && o.end === T ? o.end += S : (o = {
      kind: qt.COPY,
      start: T,
      end: T + S
      // oldBlocks: [checksum]
    }, Cl(o, s, C, y));
  }
  return f > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Bv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Cl(e, t, n, r) {
  if (Bv && t.length !== 0) {
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
function jv(e, t, n) {
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
function $l(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty($n, "__esModule", { value: !0 });
$n.DataSplitter = void 0;
$n.copyData = uf;
const Yr = pe, Hv = It, Gv = ur, qv = Zt, bl = Buffer.from(`\r
\r
`);
var Et;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Et || (Et = {}));
function uf(e, t, n, r, i) {
  const o = (0, Hv.createReadStream)("", {
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
class Wv extends Gv.Writable {
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
        if (a.kind !== qv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        uf(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(bl, n);
    if (r !== -1)
      return r + bl.length;
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
$n.DataSplitter = Wv;
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.executeTasksUsingMultipleRangeRequests = Vv;
Li.checkIsRangesSupported = Wo;
const qo = pe, Il = $n, Rl = Zt;
function Vv(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    Yv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function Yv(e, t, n, r, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), p = [];
  for (let h = t.start; h < t.end; h++) {
    const m = t.tasks[h];
    m.kind === Rl.OperationKind.DOWNLOAD && (o += `${m.start}-${m.end - 1}, `, l.set(a, h), a++, p.push(m.end - m.start), s += m.end - m.start);
  }
  if (a <= 1) {
    const h = (m) => {
      if (m >= t.end) {
        r();
        return;
      }
      const E = t.tasks[m++];
      if (E.kind === Rl.OperationKind.COPY)
        (0, Il.copyData)(E, n, t.oldFileFd, i, () => h(m));
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
    const y = new Il.DataSplitter(n, t, l, E[1] || E[2], p, r, s, e.options.onProgress);
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
const zv = ur;
var hn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(hn || (hn = {}));
class Xv extends zv.Transform {
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
Ui.ProgressDifferentialDownloadCallbackTransform = Xv;
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.DifferentialDownloader = void 0;
const Un = pe, _o = Ot, Kv = It, Jv = $n, Qv = Rt, zr = Zt, Ol = Li, Zv = Ui;
class e_ {
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
    return r.info(`Full: ${Pl(s)}, To download: ${Pl(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
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
    const o = (0, Kv.createWriteStream)(this.options.newFile, { fd: i });
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
        p = new Zv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(p);
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
        m = (0, Ol.executeTasksUsingMultipleRangeRequests)(this, t, h, r, s), m(0);
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
          p && p.beginFileCopy(), (0, Jv.copyData)(k, h, r, s, () => m(C));
          return;
        }
        const G = `bytes=${k.start}-${k.end - 1}`;
        S.headers.range = G, (D = (T = this.logger) === null || T === void 0 ? void 0 : T.debug) === null || D === void 0 || D.call(T, `download range: ${G}`), p && p.beginRangeDownload();
        const K = this.httpExecutor.createRequest(S, (Z) => {
          Z.on("error", s), Z.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), Z.statusCode >= 400 && s((0, Un.createHttpError)(Z)), Z.pipe(h, {
            end: !1
          }), Z.once("end", () => {
            p && p.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => m(C), 1e3)) : m(C);
          });
        });
        K.on("redirect", (Z, te, L) => {
          this.logger.info(`Redirect to ${t_(L)}`), y = L, (0, Un.configureRequestUrl)(new Qv.URL(y), S), K.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(K, s), K.end();
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
        (0, Ol.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", n), a.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
_r.DifferentialDownloader = e_;
function Pl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function t_(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.GenericDifferentialDownloader = void 0;
const n_ = _r;
class r_ extends n_.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
xi.GenericDifferentialDownloader = r_;
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
const Ie = pe, i_ = fr, o_ = mi, a_ = tc, Xe = Ot, s_ = we, So = Ai, Ke = ae, jt = ef, Nl = wr, l_ = Ri, Dl = tf, c_ = vr, Ao = Oi, To = rc, u_ = xi, an = Pt;
class Pa extends a_.EventEmitter {
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
    return (0, Dl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new ff();
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
    }), n == null ? (this.app = new l_.ElectronAppAdapter(), this.httpExecutor = new Dl.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, jt.parse)(r);
    if (i == null)
      throw (0, Ie.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = f_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new c_.GenericProvider({ provider: "generic", url: t }, this, {
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
      const r = Pa.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
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
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, o_.release)();
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
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, s_.load)(await (0, Xe.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Ke.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, Xe.readFile)(t, "utf-8");
      if (Ie.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Ie.UUID.v5((0, i_.randomBytes)(4096), Ie.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, Xe.outputFile)(t, n);
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
      const i = Ke.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new Nl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
      return T.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Ke.basename(T) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), p = l.cacheDirForPendingUpdate;
    await (0, Xe.mkdir)(p, { recursive: !0 });
    const c = s();
    let f = Ke.join(p, c);
    const h = a == null ? null : Ke.join(p, `package-${o}${Ke.extname(a.path) || ".7z"}`), m = async (T) => {
      await l.setDownloadedFile(f, h, i, n, c, T), await t.done({
        ...i,
        downloadedFile: f
      });
      const D = Ke.join(p, "current.blockmap");
      return await (0, Xe.pathExists)(D) && await (0, Xe.copyFile)(D, Ke.join(l.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, E = this._logger, y = await l.validateDownloadedPath(f, i, n, E);
    if (y != null)
      return f = y, await m(!1);
    const S = async () => (await l.clear().catch(() => {
    }), await (0, Xe.unlink)(f).catch(() => {
    })), C = await (0, Nl.createTempUpdateFile)(`temp-${c}`, p, E);
    try {
      await t.task(C, r, h, S), await (0, Ie.retry)(() => (0, Xe.rename)(C, f), {
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
        oldFile: Ke.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(an.DOWNLOAD_PROGRESS) > 0 && (p.onProgress = (E) => this.emit(an.DOWNLOAD_PROGRESS, E));
      const c = async (E, y) => {
        const S = Ke.join(y, "current.blockmap");
        await (0, Xe.outputFile)(S, (0, To.gzipSync)(JSON.stringify(E)));
      }, f = async (E) => {
        const y = Ke.join(E, "current.blockmap");
        try {
          if (await (0, Xe.pathExists)(y))
            return JSON.parse((0, To.gunzipSync)(await (0, Xe.readFile)(y)).toString());
        } catch (S) {
          this._logger.warn(`Cannot parse blockmap "${y}", error: ${S}`);
        }
        return null;
      }, h = await l(s[1]);
      await c(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let m = await f(this.downloadedUpdateHelper.cacheDir);
      return m == null && (m = await l(s[0])), await new u_.GenericDifferentialDownloader(t.info, this.httpExecutor, p).download(m, h), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
At.AppUpdater = Pa;
function f_(e) {
  const t = (0, jt.prerelease)(e);
  return t != null && t.length > 0;
}
class ff {
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
At.NoOpLogger = ff;
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.BaseUpdater = void 0;
const Fl = pi, d_ = At;
class h_ extends d_.AppUpdater {
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
    const i = (0, Fl.spawnSync)(t, n, {
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
        const s = { stdio: i, env: r, detached: !0 }, l = (0, Fl.spawn)(t, n, s);
        l.on("error", (p) => {
          a(p);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
Qt.BaseUpdater = h_;
var nr = {}, Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const sn = Ot, p_ = _r, m_ = rc;
class g_ extends p_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = df(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await y_(this.options.oldFile), i);
  }
}
Sr.FileWithEmbeddedBlockMapDifferentialDownloader = g_;
function df(e) {
  return JSON.parse((0, m_.inflateRawSync)(e).toString());
}
async function y_(e) {
  const t = await (0, sn.open)(e, "r");
  try {
    const n = (await (0, sn.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, sn.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, sn.read)(t, i, 0, i.length, n - r.length - i.length), await (0, sn.close)(t), df(i);
  } catch (n) {
    throw await (0, sn.close)(t), n;
  }
}
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.AppImageUpdater = void 0;
const xl = pe, Ll = pi, E_ = Ot, w_ = It, kn = ae, v_ = Qt, __ = Sr, S_ = fe, Ul = Pt;
class A_ extends v_.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, S_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, xl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, a, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, E_.chmod)(i, 493);
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
      return this.listenerCount(Ul.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Ul.DOWNLOAD_PROGRESS, s)), await new __.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, xl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, w_.unlinkSync)(n);
    let r;
    const i = kn.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    kn.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = kn.join(kn.dirname(n), kn.basename(o)), (0, Ll.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Ll.execFileSync)(r, [], { env: a })), !0;
  }
}
nr.AppImageUpdater = A_;
var rr = {}, bn = {};
Object.defineProperty(bn, "__esModule", { value: !0 });
bn.LinuxUpdater = void 0;
const T_ = Qt;
class C_ extends T_.BaseUpdater {
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
bn.LinuxUpdater = C_;
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.DebUpdater = void 0;
const $_ = fe, kl = Pt, b_ = bn;
class Na extends b_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, $_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
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
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const r = ["dpkg", "apt"], i = this.detectPackageManager(r);
    try {
      Na.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
rr.DebUpdater = Na;
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.PacmanUpdater = void 0;
const Ml = Pt, I_ = fe, R_ = bn;
class Da extends R_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, I_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Ml.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ml.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      Da.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
ir.PacmanUpdater = Da;
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.RpmUpdater = void 0;
const Bl = Pt, O_ = fe, P_ = bn;
class Fa extends P_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, O_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Bl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Bl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(r);
    try {
      Fa.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
or.RpmUpdater = Fa;
var ar = {};
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.MacUpdater = void 0;
const jl = pe, Co = Ot, N_ = It, Hl = ae, D_ = Td, F_ = At, x_ = fe, Gl = pi, ql = fr;
class L_ extends F_.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, Gl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Gl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const l = (0, x_.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, jl.newError)(`ZIP file not provided: ${(0, jl.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const p = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const m = Hl.join(this.downloadedUpdateHelper.cacheDir, c), E = () => (0, Co.pathExistsSync)(m) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        E() && (y = await this.differentialDownloadInstaller(l, t, f, p, c)), y && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Hl.join(this.downloadedUpdateHelper.cacheDir, c);
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
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, D_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (p) => {
      const c = p.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((p, c) => {
      const f = (0, ql.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), m = `/${(0, ql.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, y) => {
        const S = E.url;
        if (a.info(`${S} requested`), S === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const D = E.headers.authorization.split(" ")[1], k = Buffer.from(D, "base64").toString("ascii"), [G, K] = k.split(":");
          if (G !== "autoupdater" || K !== f) {
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
        const T = (0, N_.createReadStream)(i);
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
ar.MacUpdater = L_;
var sr = {}, xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
xa.verifySignature = k_;
const Wl = pe, hf = pi, U_ = mi, Vl = ae;
function pf(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function k_(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, hf.execFile)(...pf(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var p;
      try {
        if (a != null || l) {
          $o(n, a, l, i), r(null);
          return;
        }
        const c = M_(s);
        if (c.Status === 0) {
          try {
            const E = Vl.normalize(c.Path), y = Vl.normalize(t);
            if (n.info(`LiteralPath: ${E}. Update Path: ${y}`), E !== y) {
              $o(n, new Error(`LiteralPath of ${E} is different than ${y}`), l, i), r(null);
              return;
            }
          } catch (E) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = E.message) !== null && p !== void 0 ? p : E.stack}`);
          }
          const h = (0, Wl.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const E of e) {
            const y = (0, Wl.parseDn)(E);
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
function M_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function $o(e, t, n, r) {
  if (B_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, hf.execFileSync)(...pf("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function B_() {
  const e = U_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.NsisUpdater = void 0;
const Xr = pe, Yl = ae, j_ = Qt, H_ = Sr, zl = Pt, G_ = fe, q_ = Ot, W_ = xa, Xl = Rt;
class V_ extends j_.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, W_.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, G_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
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
            await this.httpExecutor.download(new Xl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, q_.unlink)(a);
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
      this.spawnLog(Yl.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((a) => this.dispatchError(a));
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
        newUrl: new Xl.URL(n.path),
        oldFile: Yl.join(this.downloadedUpdateHelper.cacheDir, Xr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(zl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(zl.DOWNLOAD_PROGRESS, a)), await new H_.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
sr.NsisUpdater = V_;
(function(e) {
  var t = Oe && Oe.__createBinding || (Object.create ? function(S, C, T, D) {
    D === void 0 && (D = T);
    var k = Object.getOwnPropertyDescriptor(C, T);
    (!k || ("get" in k ? !C.__esModule : k.writable || k.configurable)) && (k = { enumerable: !0, get: function() {
      return C[T];
    } }), Object.defineProperty(S, D, k);
  } : function(S, C, T, D) {
    D === void 0 && (D = T), S[D] = C[T];
  }), n = Oe && Oe.__exportStar || function(S, C) {
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
})(Qe);
const Ar = Pe.dirname(vd(import.meta.url));
process.env.APP_ROOT = Pe.join(Ar, "..");
let yn = null, lr = /* @__PURE__ */ new Map();
const Vo = () => {
  const t = [
    Pe.join(Ar, "notifications-monitor.ps1"),
    Pe.join(process.cwd(), "electron", "notifications-monitor.ps1")
  ].find((n) => pn.existsSync(n));
  t && (console.log(`[MAIN] Launching Notification Monitor: ${t}`), yn = Sn("powershell", ["-ExecutionPolicy", "Bypass", "-File", t]), yn.stdout.on("data", (n) => {
    const r = n.toString().split(`
`);
    for (let i of r)
      if (i = i.trim(), i.startsWith("__NOTIF__")) {
        const o = i.replace("__NOTIF__", "").split("|||");
        if (o.length >= 4) {
          const [a, s, l, p] = o;
          lr.set(p, { title: s, app: a }), je(q, "notification-sync", {
            id: p,
            app: a,
            text: (s + " " + (l || "")).trim()
          });
        }
      } else if (i.startsWith("__REMOVE__")) {
        const o = i.replace("__REMOVE__", "").trim();
        lr.delete(o), je(q, "notification-remove", o);
      } else i.startsWith("__DEBUG__") && console.log(`[NOTIF_DEBUG] ${i}`);
  }), yn.on("exit", () => setTimeout(Vo, 5e3)));
};
X.on("dismiss-notification", (e, t) => {
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
X.on("clear-all-notifications", () => {
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
Qe.autoUpdater.autoDownload = !1;
Qe.autoUpdater.on("update-available", (e) => {
  je(q, "update-available", {
    version: e.version,
    releaseNotes: e.releaseNotes,
    releaseDate: e.releaseDate
  });
});
Qe.autoUpdater.on("download-progress", (e) => {
  je(q, "update-progress", e.percent);
});
Qe.autoUpdater.on("update-downloaded", () => {
  je(q, "update-ready");
});
Qe.autoUpdater.on("update-not-available", () => {
  je(q, "update-not-available");
});
Qe.autoUpdater.on("error", (e) => {
  console.error("[UPDATER_ERROR] " + e), je(q, "update-error", e.message);
});
X.on("check-for-updates", () => {
  Qe.autoUpdater.checkForUpdates().catch((e) => console.error("Check failed: " + e));
});
X.on("start-update-download", () => {
  Qe.autoUpdater.downloadUpdate();
});
X.on("install-update-now", () => {
  Qe.autoUpdater.quitAndInstall();
});
X.handle("get-app-version", () => Re.getVersion());
function Y_() {
  Sn("powershell", ["-Command", "[void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]; [Windows.UI.Notifications.Management.UserNotificationListener]::Current.RequestAccessAsync()"]);
}
const Kl = process.env.VITE_DEV_SERVER_URL, z_ = Pe.join(process.env.APP_ROOT, "dist");
process.platform === "win32" && Re.setAppUserModelId("com.notchly.app");
let q, mf = !1, gf = 0, yf = 440, Ef = 66, Yo = !1, zo = !1, ce = "Teams", Mt = !1, ut = !1, Mn = !1, bo = 0, Bn = null, Xo = null, Ko = null, Io = null, qe = null, Jo = "";
function je(e, t, ...n) {
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
const Qo = () => {
  if (!q || q.isDestroyed()) return;
  const e = Jo ? `https://wttr.in/${encodeURIComponent(Jo)}?format=j1` : "https://wttr.in?format=j1";
  Sd.get(e, (t) => {
    let n = "";
    t.on("data", (r) => n += r), t.on("end", () => {
      var r, i, o;
      try {
        const a = JSON.parse(n), s = a.current_condition[0], l = (r = a.nearest_area) == null ? void 0 : r[0], p = ((o = (i = l == null ? void 0 : l.areaName) == null ? void 0 : i[0]) == null ? void 0 : o.value) || "Local";
        je(q, "weather-update", {
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
X.handle("get-system-audio-id", async () => {
  var t;
  return (t = (await Zl.getSources({ types: ["screen"] }))[0]) == null ? void 0 : t.id;
});
X.removeAllListeners("set-weather-location");
X.on("set-weather-location", (e, t) => {
  Jo = t || "", Qo();
});
X.on("set-is-expanded", (e, t) => {
  mf = t;
});
X.on("set-is-super-pill", (e, t) => {
});
X.on("set-is-preview", (e, t) => {
});
X.on("update-island-pos", (e, t) => {
  gf = t;
});
X.on("set-window-dimensions", (e, t) => {
  yf = t.w, Ef = t.h;
});
X.on("set-bubbles-state", (e, t) => {
  Yo = t.call, zo = t.controls;
});
function X_() {
  const e = es.getPrimaryDisplay(), { width: t, height: n, x: r, y: i } = e.bounds;
  q = new wd({
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
      preload: Pe.join(Ar, "preload.js"),
      backgroundThrottling: !1,
      autoplayPolicy: "no-user-gesture-required",
      webviewTag: !0
    }
  }), Kl ? q.loadURL(Kl) : q.loadFile(Pe.join(z_, "index.html")), q.showInactive(), q.setIgnoreMouseEvents(!1), q.setAlwaysOnTop(!0, "screen-saver"), setTimeout(() => {
    typeof Vo == "function" && Vo(), Y_(), vf(), cr(), Qe.autoUpdater.checkForUpdatesAndNotify().catch((a) => console.error("Update check failed: " + a));
  }, 1e3);
  const o = r + t / 2;
  Bn && clearInterval(Bn), Bn = setInterval(() => {
    try {
      if (!q || q.isDestroyed()) return;
      const { x: a, y: s } = es.getCursorScreenPoint(), l = o + (gf || 0), p = (yf || 440) / 2, c = Ef || 66, f = Math.abs(a - l) < p + 10 && s >= i - 5 && s < i + c + 10;
      let h = !1;
      if (!mf && (Yo || zo)) {
        const E = l - p;
        h = a >= E - (Yo && zo ? 140 : 70) - 20 && a < E - 5 && s >= i - 5 && s < i + 70;
      }
      const m = f || h;
      q.setIgnoreMouseEvents(!m, { forward: !0 });
    } catch {
    }
  }, 30), q.on("closed", () => {
    Bn && clearInterval(Bn), Xo && clearInterval(Xo), Ko && clearTimeout(Ko), Io && clearInterval(Io), qe && clearInterval(qe), q = null;
  }), X.handle("get-auto-launch", () => Re.getLoginItemSettings().openAtLogin), X.on("set-auto-launch", (a, s) => {
    try {
      process.platform === "win32" && (Re.setLoginItemSettings({
        openAtLogin: s,
        path: Re.getPath("exe"),
        args: [
          "--hidden",
          "--start-minimized"
        ]
      }), console.log(`[MAIN] Autostart ${s ? "enabled" : "disabled"} for: ${Re.getPath("exe")}`));
    } catch (l) {
      console.error("[AUTOSTART_ERROR] Failed to set login item settings:", l);
    }
  }), Qo(), Io = setInterval(Qo, 20 * 60 * 1e3);
}
const K_ = Re.requestSingleInstanceLock();
K_ ? (Re.on("second-instance", () => {
  q && (q.isMinimized() && q.restore(), q.focus());
}), Re.whenReady().then(() => {
  X_();
})) : Re.quit();
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
X.handle("toggle-system-mute", async () => (ce === "Zoom" ? await Te("%a") : ce === "Meet" ? await Te("^d") : await Te("^+m"), !0));
X.handle("toggle-video", async () => (ce === "Zoom" ? await Te("%v") : ce === "Meet" ? await Te("^e") : await Te("^+o"), !0));
X.handle("end-call", async () => (ce === "Zoom" ? (await Te("%q"), await Te("{ENTER}")) : ce === "Meet" ? await Te("^w") : await Te("^+h"), !0));
let Jl = Wt.cpus();
Xo = setInterval(() => {
  try {
    if (!q || q.isDestroyed()) return;
    const e = Wt.totalmem(), t = Wt.freemem(), n = (e - t) / e * 100, r = Wt.cpus();
    let i = 0, o = 0;
    for (let s = 0; s < r.length; s++) {
      const l = Jl[s].times, p = r[s].times, c = Object.values(l).reduce((h, m) => h + m, 0), f = Object.values(p).reduce((h, m) => h + m, 0);
      i += f - c, o += p.idle - l.idle;
    }
    const a = i > 0 ? (1 - o / i) * 100 : 0;
    Jl = r, je(q, "system-update", { cpu: a, ram: n, net: 1.5 + Math.random() * 2 });
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
          je(q, "network-status", {
            wifi: ((r = o[0]) == null ? void 0 : r.toLowerCase()) === "true",
            bluetooth: ((i = o[1]) == null ? void 0 : i.toLowerCase()) === "true"
          });
        }
        qe && clearTimeout(qe), qe = setTimeout(cr, 4e3);
      });
    } catch {
      qe && clearTimeout(qe), qe = setTimeout(cr, 4e3);
    }
}, J_ = (e) => {
  if (Re.isPackaged)
    return Pe.join(process.resourcesPath, e);
  const t = Pe.join(process.cwd(), e);
  return pn.existsSync(t) ? t : Pe.join(Ar, "..", e);
}, Zo = J_("volume.exe"), wf = () => new Promise((e) => {
  if (!pn.existsSync(Zo)) return e(-1);
  dt(`"${Zo}" get`, (t, n) => {
    if (t) return e(-1);
    const r = parseInt(n.trim(), 10);
    e(isNaN(r) ? -1 : r);
  });
});
let Ro = !1, Kr = null;
const Q_ = async (e) => {
  if (Kr = e, !Ro) {
    for (Ro = !0; Kr !== null; ) {
      const t = Kr;
      Kr = null, await new Promise((n) => {
        dt(`"${Zo}" set ${Math.round(t)}`, () => n(null));
      });
    }
    Ro = !1;
  }
}, vf = async () => {
  if (!(!q || q.isDestroyed())) {
    try {
      const e = await wf();
      e >= 0 && je(q, "volume-update", e);
    } catch {
    }
    Ko = setTimeout(vf, 1500);
  }
};
let ot = null, ti = null, Ql = /* @__PURE__ */ new Map();
const ea = () => {
  try {
    const e = Re.isPackaged ? Pe.join(Ar, "media-reader.js") : Pe.join(process.cwd(), "electron", "media-reader.mjs");
    console.log(`[MAIN] Launching Media Reader: ${e}`), ot = _d(e, [process.resourcesPath || ""], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
      stdio: ["inherit", "inherit", "inherit", "ipc"]
    }), ot && (ot.on("exit", (t) => {
      console.warn(`[MAIN] Media Reader exited with code ${t}. Restarting in 3s...`), setTimeout(ea, 3e3);
    }), ot.on("message", (t) => {
      if ((t == null ? void 0 : t.type) === "MEDIA_UPDATE") {
        const n = t.data;
        if (!n) return;
        const r = n.id && n.id !== "system" ? n.id : n.title + "||" + (n.artist || "");
        n.title && n.title !== "Sin Reproducción" && Ql.set(r, { ...n, timestamp: Date.now() });
        let i = Array.from(Ql.values()).filter((s) => s.title !== "Sin Reproducción").sort((s, l) => l.timestamp - s.timestamp), o = n;
        const a = i.find((s) => s.isPlaying);
        a ? o = a : i.length > 0 && (o = i[0]), ti = o, je(q, "media-update", o);
      }
    }));
  } catch (e) {
    console.error("[MAIN] Media Reader Failed:", e), setTimeout(ea, 5e3);
  }
};
try {
  ea();
  let e = "", t = null, n = "", r = 0;
  const i = () => {
    const a = Pe.join(Wt.tmpdir(), "notchly-meet.ps1");
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
            const [m, E, y, S, C, T, D] = h, k = m.toLowerCase() === "true", G = E.toLowerCase() === "true", K = C.toLowerCase() === "true", Z = (D ?? "").toLowerCase() === "true", te = G && (k || K);
            te ? (bo = 0, y.toLowerCase().includes("zoom") ? ce = "Zoom" : y.toLowerCase().includes("meet") ? ce = "Meet" : y.toLowerCase().includes("teams") ? ce = "Teams" : ce = y || "Llamada") : bo++;
            const L = bo < 6;
            L || (ut = !1, Mn = !1), k && T === "High" ? (Mt = !0, ut = !1) : Z || !k && T === "High" ? (Mt = !1, ut = !0) : Mt = !ut;
            const w = Mn ? !1 : K;
            if (Date.now() < r) return;
            je(q, "meeting-update", {
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
  setTimeout(i, 3e3), X.handle("get-media-source-id", async (a, s) => {
    try {
      const l = await Zl.getSources({
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
  }), X.handle("get-current-media", async () => ti || (await new Promise((a) => setTimeout(a, 1200)), ti || null));
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
  X.handle("toggle-wifi", async () => {
    const a = Pe.join(Wt.tmpdir(), "notchly-radio-cmd.ps1");
    return pn.writeFileSync(a, o, "utf8"), dt(`powershell -ExecutionPolicy Bypass -File "${a}" "WiFi"`, () => {
      qe && clearTimeout(qe), setTimeout(cr, 1500);
    }), !0;
  }), X.handle("toggle-bluetooth", async () => {
    const a = Pe.join(Wt.tmpdir(), "notchly-radio-cmd.ps1");
    return pn.writeFileSync(a, o, "utf8"), dt(`powershell -ExecutionPolicy Bypass -File "${a}" "Bluetooth"`, () => {
      qe && clearTimeout(qe), setTimeout(cr, 1500);
    }), !0;
  }), X.on("media-command", (a, s) => {
    ot && !ot.killed && ot.send(s);
  }), X.handle("get-volume", async () => await wf()), X.handle("set-volume", (a, s) => (Q_(s), !0)), X.handle("open-app", async (a, s) => {
    const l = s.toLowerCase();
    return l.includes("chrome") ? dt("start chrome") : l.includes("spotify") ? dt("start spotify") : l.includes("camera") ? dt("start microsoft.windows.camera:") : dt(`start "" "${s}"`), !0;
  }), X.handle("meeting-command", async (a, s) => {
    r = Date.now() + 8e3, s === "toggleMic" ? (ut = !ut, Mt = !ut, await Te(ce === "Zoom" ? "%a" : ce === "Meet" ? "^d" : "^+m")) : s === "toggleCam" ? (Mn = !Mn, await Te(ce === "Zoom" ? "%v" : ce === "Meet" ? "^e" : "^+o")) : s === "endCall" && (ut = !1, Mn = !1, Mt = !1, ce === "Zoom" ? (await Te("%q"), setTimeout(() => Te("{ENTER}"), 200)) : ce === "Meet" ? await Te("^w") : await Te("^+h"));
  }), Re.on("before-quit", () => {
    ot == null || ot.kill(), typeof t < "u" && t && t.kill(), typeof yn < "u" && yn && yn.kill();
  });
} catch (e) {
  console.error("[MAIN] Setup Error:", e);
}
Re.on("window-all-closed", () => {
  q = null, process.platform !== "darwin" && Re.quit();
});
export {
  z_ as RENDERER_DIST,
  Kl as VITE_DEV_SERVER_URL
};
