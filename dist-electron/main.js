import Jt, { ipcMain as V, app as De, desktopCapturer as uc, screen as cs, BrowserWindow as Od } from "electron";
import Oe from "node:path";
import { fileURLToPath as Dd } from "node:url";
import et from "node:fs";
import { spawn as Zt, exec as st, fork as Nd } from "node:child_process";
import zt from "node:os";
import Pd from "node:https";
import Dt from "fs";
import Fd from "constants";
import hr from "stream";
import sa from "util";
import fc from "assert";
import ae from "path";
import wi from "child_process";
import dc from "events";
import pr from "crypto";
import hc from "tty";
import vi from "os";
import Nt from "url";
import pc from "zlib";
import xd from "http";
var Ne = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, He = {}, en = {}, xe = {};
xe.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
xe.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var wt = Fd, Ud = process.cwd, Zr = null, Ld = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Zr || (Zr = Ud.call(process)), Zr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var us = process.chdir;
  process.chdir = function(e) {
    Zr = null, us.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, us);
}
var kd = Md;
function Md(e) {
  wt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, h, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), Ld === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(h, m, y) {
      var E = Date.now(), A = 0;
      c(h, m, function C(T) {
        if (T && (T.code === "EACCES" || T.code === "EPERM" || T.code === "EBUSY") && Date.now() - E < 6e4) {
          setTimeout(function() {
            e.stat(m, function(N, U) {
              N && N.code === "ENOENT" ? c(h, m, C) : y(T);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        y && y(T);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(h, m, y, E, A, C) {
      var T;
      if (C && typeof C == "function") {
        var N = 0;
        T = function(U, q, J) {
          if (U && U.code === "EAGAIN" && N < 10)
            return N++, c.call(e, h, m, y, E, A, T);
          C.apply(this, arguments);
        };
      }
      return c.call(e, h, m, y, E, A, T);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, h, m, y, E) {
      for (var A = 0; ; )
        try {
          return c.call(e, f, h, m, y, E);
        } catch (C) {
          if (C.code === "EAGAIN" && A < 10) {
            A++;
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
        wt.O_WRONLY | wt.O_SYMLINK,
        h,
        function(y, E) {
          if (y) {
            m && m(y);
            return;
          }
          c.fchmod(E, h, function(A) {
            c.close(E, function(C) {
              m && m(A || C);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, h) {
      var m = c.openSync(f, wt.O_WRONLY | wt.O_SYMLINK, h), y = !0, E;
      try {
        E = c.fchmodSync(m, h), y = !1;
      } finally {
        if (y)
          try {
            c.closeSync(m);
          } catch {
          }
        else
          c.closeSync(m);
      }
      return E;
    };
  }
  function n(c) {
    wt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, h, m, y) {
      c.open(f, wt.O_SYMLINK, function(E, A) {
        if (E) {
          y && y(E);
          return;
        }
        c.futimes(A, h, m, function(C) {
          c.close(A, function(T) {
            y && y(C || T);
          });
        });
      });
    }, c.lutimesSync = function(f, h, m) {
      var y = c.openSync(f, wt.O_SYMLINK), E, A = !0;
      try {
        E = c.futimesSync(y, h, m), A = !1;
      } finally {
        if (A)
          try {
            c.closeSync(y);
          } catch {
          }
        else
          c.closeSync(y);
      }
      return E;
    }) : c.futimes && (c.lutimes = function(f, h, m, y) {
      y && process.nextTick(y);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(f, h, m) {
      return c.call(e, f, h, function(y) {
        p(y) && (y = null), m && m.apply(this, arguments);
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
    return c && function(f, h, m, y) {
      return c.call(e, f, h, m, function(E) {
        p(E) && (E = null), y && y.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, h, m) {
      try {
        return c.call(e, f, h, m);
      } catch (y) {
        if (!p(y)) throw y;
      }
    };
  }
  function s(c) {
    return c && function(f, h, m) {
      typeof h == "function" && (m = h, h = null);
      function y(E, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return h ? c.call(e, f, h, y) : c.call(e, f, y);
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
var fs = hr.Stream, Bd = jd;
function jd(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    fs.call(this);
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
    fs.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Hd = qd, Gd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function qd(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Gd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = Dt, Wd = kd, Vd = Bd, Yd = Hd, xr = sa, we, ai;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (we = Symbol.for("graceful-fs.queue"), ai = Symbol.for("graceful-fs.previous")) : (we = "___graceful-fs.queue", ai = "___graceful-fs.previous");
function zd() {
}
function mc(e, t) {
  Object.defineProperty(e, we, {
    get: function() {
      return t;
    }
  });
}
var Xt = zd;
xr.debuglog ? Xt = xr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Xt = function() {
  var e = xr.format.apply(xr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[we]) {
  var Xd = Ne[we] || [];
  mc(oe, Xd), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || ds(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, ai, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), ds();
    }
    return Object.defineProperty(t, ai, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Xt(oe[we]), fc.equal(oe[we].length, 0);
  });
}
Ne[we] || mc(Ne, oe[we]);
var Ue = la(Yd(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && (Ue = la(oe), oe.__patched = !0);
function la(e) {
  Wd(e), e.gracefulify = la, e.createReadStream = q, e.createWriteStream = J;
  var t = e.readFile;
  e.readFile = n;
  function n(k, w, H) {
    return typeof w == "function" && (H = w, w = null), X(k, w, H);
    function X(ne, O, I, P) {
      return t(ne, O, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? sn([X, [ne, O, I], b, P || Date.now(), Date.now()]) : typeof I == "function" && I.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(k, w, H, X) {
    return typeof H == "function" && (X = H, H = null), ne(k, w, H, X);
    function ne(O, I, P, b, F) {
      return r(O, I, P, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? sn([ne, [O, I, P, b], D, F || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(k, w, H, X) {
    return typeof H == "function" && (X = H, H = null), ne(k, w, H, X);
    function ne(O, I, P, b, F) {
      return o(O, I, P, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? sn([ne, [O, I, P, b], D, F || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(k, w, H, X) {
    return typeof H == "function" && (X = H, H = 0), ne(k, w, H, X);
    function ne(O, I, P, b, F) {
      return s(O, I, P, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? sn([ne, [O, I, P, b], D, F || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var p = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(k, w, H) {
    typeof w == "function" && (H = w, w = null);
    var X = c.test(process.version) ? function(I, P, b, F) {
      return p(I, ne(
        I,
        P,
        b,
        F
      ));
    } : function(I, P, b, F) {
      return p(I, P, ne(
        I,
        P,
        b,
        F
      ));
    };
    return X(k, w, H);
    function ne(O, I, P, b) {
      return function(F, D) {
        F && (F.code === "EMFILE" || F.code === "ENFILE") ? sn([
          X,
          [O, I, P],
          F,
          b || Date.now(),
          Date.now()
        ]) : (D && D.sort && D.sort(), typeof P == "function" && P.call(this, F, D));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = Vd(e);
    C = h.ReadStream, N = h.WriteStream;
  }
  var m = e.ReadStream;
  m && (C.prototype = Object.create(m.prototype), C.prototype.open = T);
  var y = e.WriteStream;
  y && (N.prototype = Object.create(y.prototype), N.prototype.open = U), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return C;
    },
    set: function(k) {
      C = k;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return N;
    },
    set: function(k) {
      N = k;
    },
    enumerable: !0,
    configurable: !0
  });
  var E = C;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return E;
    },
    set: function(k) {
      E = k;
    },
    enumerable: !0,
    configurable: !0
  });
  var A = N;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return A;
    },
    set: function(k) {
      A = k;
    },
    enumerable: !0,
    configurable: !0
  });
  function C(k, w) {
    return this instanceof C ? (m.apply(this, arguments), this) : C.apply(Object.create(C.prototype), arguments);
  }
  function T() {
    var k = this;
    W(k.path, k.flags, k.mode, function(w, H) {
      w ? (k.autoClose && k.destroy(), k.emit("error", w)) : (k.fd = H, k.emit("open", H), k.read());
    });
  }
  function N(k, w) {
    return this instanceof N ? (y.apply(this, arguments), this) : N.apply(Object.create(N.prototype), arguments);
  }
  function U() {
    var k = this;
    W(k.path, k.flags, k.mode, function(w, H) {
      w ? (k.destroy(), k.emit("error", w)) : (k.fd = H, k.emit("open", H));
    });
  }
  function q(k, w) {
    return new e.ReadStream(k, w);
  }
  function J(k, w) {
    return new e.WriteStream(k, w);
  }
  var Q = e.open;
  e.open = W;
  function W(k, w, H, X) {
    return typeof H == "function" && (X = H, H = null), ne(k, w, H, X);
    function ne(O, I, P, b, F) {
      return Q(O, I, P, function(D, B) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? sn([ne, [O, I, P, b], D, F || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function sn(e) {
  Xt("ENQUEUE", e[0].name, e[1]), oe[we].push(e), ca();
}
var Ur;
function ds() {
  for (var e = Date.now(), t = 0; t < oe[we].length; ++t)
    oe[we][t].length > 2 && (oe[we][t][3] = e, oe[we][t][4] = e);
  ca();
}
function ca() {
  if (clearTimeout(Ur), Ur = void 0, oe[we].length !== 0) {
    var e = oe[we].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Xt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Xt("TIMEOUT", t.name, n);
      var a = n.pop();
      typeof a == "function" && a.call(null, r);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), p = Math.min(l * 1.2, 100);
      s >= p ? (Xt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[we].push(e);
    }
    Ur === void 0 && (Ur = setTimeout(ca, 0));
  }
}
(function(e) {
  const t = xe.fromCallback, n = Ue, r = [
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
      n.read(i, o, a, s, l, (h, m, y) => {
        if (h) return f(h);
        c({ bytesRead: m, buffer: y });
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
})(en);
var ua = {}, gc = {};
const Kd = ae;
gc.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Kd.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Ec = en, { checkPath: yc } = gc, wc = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
ua.makeDir = async (e, t) => (yc(e), Ec.mkdir(e, {
  mode: wc(t),
  recursive: !0
}));
ua.makeDirSync = (e, t) => (yc(e), Ec.mkdirSync(e, {
  mode: wc(t),
  recursive: !0
}));
const Jd = xe.fromPromise, { makeDir: Qd, makeDirSync: Qi } = ua, Zi = Jd(Qd);
var ct = {
  mkdirs: Zi,
  mkdirsSync: Qi,
  // alias
  mkdirp: Zi,
  mkdirpSync: Qi,
  ensureDir: Zi,
  ensureDirSync: Qi
};
const Zd = xe.fromPromise, vc = en;
function eh(e) {
  return vc.access(e).then(() => !0).catch(() => !1);
}
var tn = {
  pathExists: Zd(eh),
  pathExistsSync: vc.existsSync
};
const yn = Ue;
function th(e, t, n, r) {
  yn.open(e, "r+", (i, o) => {
    if (i) return r(i);
    yn.futimes(o, t, n, (a) => {
      yn.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function nh(e, t, n) {
  const r = yn.openSync(e, "r+");
  return yn.futimesSync(r, t, n), yn.closeSync(r);
}
var _c = {
  utimesMillis: th,
  utimesMillisSync: nh
};
const _n = en, Ee = ae, rh = sa;
function ih(e, t, n) {
  const r = n.dereference ? (i) => _n.stat(i, { bigint: !0 }) : (i) => _n.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function oh(e, t, n) {
  let r;
  const i = n.dereference ? (a) => _n.statSync(a, { bigint: !0 }) : (a) => _n.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: r };
}
function ah(e, t, n, r, i) {
  rh.callbackify(ih)(e, t, r, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (mr(s, l)) {
        const p = Ee.basename(e), c = Ee.basename(t);
        return n === "move" && p !== c && p.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && fa(e, t) ? i(new Error(_i(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function sh(e, t, n, r) {
  const { srcStat: i, destStat: o } = oh(e, t, r);
  if (o) {
    if (mr(i, o)) {
      const a = Ee.basename(e), s = Ee.basename(t);
      if (n === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && fa(e, t))
    throw new Error(_i(e, t, n));
  return { srcStat: i, destStat: o };
}
function Ac(e, t, n, r, i) {
  const o = Ee.resolve(Ee.dirname(e)), a = Ee.resolve(Ee.dirname(n));
  if (a === o || a === Ee.parse(a).root) return i();
  _n.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : mr(t, l) ? i(new Error(_i(e, n, r))) : Ac(e, t, a, r, i));
}
function Sc(e, t, n, r) {
  const i = Ee.resolve(Ee.dirname(e)), o = Ee.resolve(Ee.dirname(n));
  if (o === i || o === Ee.parse(o).root) return;
  let a;
  try {
    a = _n.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (mr(t, a))
    throw new Error(_i(e, n, r));
  return Sc(e, t, o, r);
}
function mr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function fa(e, t) {
  const n = Ee.resolve(e).split(Ee.sep).filter((i) => i), r = Ee.resolve(t).split(Ee.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function _i(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Cn = {
  checkPaths: ah,
  checkPathsSync: sh,
  checkParentPaths: Ac,
  checkParentPathsSync: Sc,
  isSrcSubdir: fa,
  areIdentical: mr
};
const Be = Ue, Kn = ae, lh = ct.mkdirs, ch = tn.pathExists, uh = _c.utimesMillis, Jn = Cn;
function fh(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Jn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: a, destStat: s } = o;
    Jn.checkParentPaths(e, a, t, "copy", (l) => l ? r(l) : n.filter ? Tc(hs, s, e, t, n, r) : hs(s, e, t, n, r));
  });
}
function hs(e, t, n, r, i) {
  const o = Kn.dirname(n);
  ch(o, (a, s) => {
    if (a) return i(a);
    if (s) return si(e, t, n, r, i);
    lh(o, (l) => l ? i(l) : si(e, t, n, r, i));
  });
}
function Tc(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function dh(e, t, n, r, i) {
  return r.filter ? Tc(si, e, t, n, r, i) : si(e, t, n, r, i);
}
function si(e, t, n, r, i) {
  (r.dereference ? Be.stat : Be.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? wh(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? hh(s, e, t, n, r, i) : s.isSymbolicLink() ? Ah(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function hh(e, t, n, r, i, o) {
  return t ? ph(e, n, r, i, o) : Cc(e, n, r, i, o);
}
function ph(e, t, n, r, i) {
  if (r.overwrite)
    Be.unlink(n, (o) => o ? i(o) : Cc(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Cc(e, t, n, r, i) {
  Be.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? mh(e.mode, t, n, i) : Ai(n, e.mode, i));
}
function mh(e, t, n, r) {
  return gh(e) ? Eh(n, e, (i) => i ? r(i) : ps(e, t, n, r)) : ps(e, t, n, r);
}
function gh(e) {
  return (e & 128) === 0;
}
function Eh(e, t, n) {
  return Ai(e, t | 128, n);
}
function ps(e, t, n, r) {
  yh(t, n, (i) => i ? r(i) : Ai(n, e, r));
}
function Ai(e, t, n) {
  return Be.chmod(e, t, n);
}
function yh(e, t, n) {
  Be.stat(e, (r, i) => r ? n(r) : uh(t, i.atime, i.mtime, n));
}
function wh(e, t, n, r, i, o) {
  return t ? $c(n, r, i, o) : vh(e.mode, n, r, i, o);
}
function vh(e, t, n, r, i) {
  Be.mkdir(n, (o) => {
    if (o) return i(o);
    $c(t, n, r, (a) => a ? i(a) : Ai(n, e, i));
  });
}
function $c(e, t, n, r) {
  Be.readdir(e, (i, o) => i ? r(i) : bc(o, e, t, n, r));
}
function bc(e, t, n, r, i) {
  const o = e.pop();
  return o ? _h(e, o, t, n, r, i) : i();
}
function _h(e, t, n, r, i, o) {
  const a = Kn.join(n, t), s = Kn.join(r, t);
  Jn.checkPaths(a, s, "copy", i, (l, p) => {
    if (l) return o(l);
    const { destStat: c } = p;
    dh(c, a, s, i, (f) => f ? o(f) : bc(e, n, r, i, o));
  });
}
function Ah(e, t, n, r, i) {
  Be.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = Kn.resolve(process.cwd(), a)), e)
      Be.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Be.symlink(a, n, i) : i(s) : (r.dereference && (l = Kn.resolve(process.cwd(), l)), Jn.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Jn.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : Sh(a, n, i)));
    else
      return Be.symlink(a, n, i);
  });
}
function Sh(e, t, n) {
  Be.unlink(t, (r) => r ? n(r) : Be.symlink(e, t, n));
}
var Th = fh;
const $e = Ue, Qn = ae, Ch = ct.mkdirsSync, $h = _c.utimesMillisSync, Zn = Cn;
function bh(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Zn.checkPathsSync(e, t, "copy", n);
  return Zn.checkParentPathsSync(e, r, t, "copy"), Ih(i, e, t, n);
}
function Ih(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Qn.dirname(n);
  return $e.existsSync(i) || Ch(i), Ic(e, t, n, r);
}
function Rh(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return Ic(e, t, n, r);
}
function Ic(e, t, n, r) {
  const o = (r.dereference ? $e.statSync : $e.lstatSync)(t);
  if (o.isDirectory()) return Uh(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Oh(o, e, t, n, r);
  if (o.isSymbolicLink()) return Mh(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Oh(e, t, n, r, i) {
  return t ? Dh(e, n, r, i) : Rc(e, n, r, i);
}
function Dh(e, t, n, r) {
  if (r.overwrite)
    return $e.unlinkSync(n), Rc(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Rc(e, t, n, r) {
  return $e.copyFileSync(t, n), r.preserveTimestamps && Nh(e.mode, t, n), da(n, e.mode);
}
function Nh(e, t, n) {
  return Ph(e) && Fh(n, e), xh(t, n);
}
function Ph(e) {
  return (e & 128) === 0;
}
function Fh(e, t) {
  return da(e, t | 128);
}
function da(e, t) {
  return $e.chmodSync(e, t);
}
function xh(e, t) {
  const n = $e.statSync(e);
  return $h(t, n.atime, n.mtime);
}
function Uh(e, t, n, r, i) {
  return t ? Oc(n, r, i) : Lh(e.mode, n, r, i);
}
function Lh(e, t, n, r) {
  return $e.mkdirSync(n), Oc(t, n, r), da(n, e);
}
function Oc(e, t, n) {
  $e.readdirSync(e).forEach((r) => kh(r, e, t, n));
}
function kh(e, t, n, r) {
  const i = Qn.join(t, e), o = Qn.join(n, e), { destStat: a } = Zn.checkPathsSync(i, o, "copy", r);
  return Rh(a, i, o, r);
}
function Mh(e, t, n, r) {
  let i = $e.readlinkSync(t);
  if (r.dereference && (i = Qn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = $e.readlinkSync(n);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return $e.symlinkSync(i, n);
      throw a;
    }
    if (r.dereference && (o = Qn.resolve(process.cwd(), o)), Zn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if ($e.statSync(n).isDirectory() && Zn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Bh(i, n);
  } else
    return $e.symlinkSync(i, n);
}
function Bh(e, t) {
  return $e.unlinkSync(t), $e.symlinkSync(e, t);
}
var jh = bh;
const Hh = xe.fromCallback;
var ha = {
  copy: Hh(Th),
  copySync: jh
};
const ms = Ue, Dc = ae, ee = fc, er = process.platform === "win32";
function Nc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || ms[n], n = n + "Sync", e[n] = e[n] || ms[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function pa(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee.strictEqual(typeof n, "function", "rimraf: callback function required"), ee(t, "rimraf: invalid options argument provided"), ee.strictEqual(typeof t, "object", "rimraf: options should be object"), Nc(t), gs(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const a = r * 100;
        return setTimeout(() => gs(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function gs(e, t, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && er)
      return Es(e, t, r, n);
    if (i && i.isDirectory())
      return ei(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return er ? Es(e, t, o, n) : ei(e, t, o, n);
        if (o.code === "EISDIR")
          return ei(e, t, o, n);
      }
      return n(o);
    });
  });
}
function Es(e, t, n, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, a) => {
      o ? r(o.code === "ENOENT" ? null : n) : a.isDirectory() ? ei(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function ys(e, t, n) {
  let r;
  ee(e), ee(t);
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
  r.isDirectory() ? ti(e, t, n) : t.unlinkSync(e);
}
function ei(e, t, n, r) {
  ee(e), ee(t), ee(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Gh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function Gh(e, t, n) {
  ee(e), ee(t), ee(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      pa(Dc.join(e, s), t, (l) => {
        if (!a) {
          if (l) return n(a = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function Pc(e, t) {
  let n;
  t = t || {}, Nc(t), ee(e, "rimraf: missing path"), ee.strictEqual(typeof e, "string", "rimraf: path should be a string"), ee(t, "rimraf: missing options"), ee.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && er && ys(e, t, r);
  }
  try {
    n && n.isDirectory() ? ti(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return er ? ys(e, t, r) : ti(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    ti(e, t, r);
  }
}
function ti(e, t, n) {
  ee(e), ee(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      qh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function qh(e, t) {
  if (ee(e), ee(t), t.readdirSync(e).forEach((n) => Pc(Dc.join(e, n), t)), er) {
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
var Wh = pa;
pa.sync = Pc;
const li = Ue, Vh = xe.fromCallback, Fc = Wh;
function Yh(e, t) {
  if (li.rm) return li.rm(e, { recursive: !0, force: !0 }, t);
  Fc(e, t);
}
function zh(e) {
  if (li.rmSync) return li.rmSync(e, { recursive: !0, force: !0 });
  Fc.sync(e);
}
var Si = {
  remove: Vh(Yh),
  removeSync: zh
};
const Xh = xe.fromPromise, xc = en, Uc = ae, Lc = ct, kc = Si, ws = Xh(async function(t) {
  let n;
  try {
    n = await xc.readdir(t);
  } catch {
    return Lc.mkdirs(t);
  }
  return Promise.all(n.map((r) => kc.remove(Uc.join(t, r))));
});
function vs(e) {
  let t;
  try {
    t = xc.readdirSync(e);
  } catch {
    return Lc.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Uc.join(e, n), kc.removeSync(n);
  });
}
var Kh = {
  emptyDirSync: vs,
  emptydirSync: vs,
  emptyDir: ws,
  emptydir: ws
};
const Jh = xe.fromCallback, Mc = ae, At = Ue, Bc = ct;
function Qh(e, t) {
  function n() {
    At.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  At.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = Mc.dirname(e);
    At.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? Bc.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(a);
      s.isDirectory() ? n() : At.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Zh(e) {
  let t;
  try {
    t = At.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = Mc.dirname(e);
  try {
    At.statSync(n).isDirectory() || At.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") Bc.mkdirsSync(n);
    else throw r;
  }
  At.writeFileSync(e, "");
}
var ep = {
  createFile: Jh(Qh),
  createFileSync: Zh
};
const tp = xe.fromCallback, jc = ae, _t = Ue, Hc = ct, np = tn.pathExists, { areIdentical: Gc } = Cn;
function rp(e, t, n) {
  function r(i, o) {
    _t.link(i, o, (a) => {
      if (a) return n(a);
      n(null);
    });
  }
  _t.lstat(t, (i, o) => {
    _t.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), n(a);
      if (o && Gc(s, o)) return n(null);
      const l = jc.dirname(t);
      np(l, (p, c) => {
        if (p) return n(p);
        if (c) return r(e, t);
        Hc.mkdirs(l, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function ip(e, t) {
  let n;
  try {
    n = _t.lstatSync(t);
  } catch {
  }
  try {
    const o = _t.lstatSync(e);
    if (n && Gc(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = jc.dirname(t);
  return _t.existsSync(r) || Hc.mkdirsSync(r), _t.linkSync(e, t);
}
var op = {
  createLink: tp(rp),
  createLinkSync: ip
};
const St = ae, Vn = Ue, ap = tn.pathExists;
function sp(e, t, n) {
  if (St.isAbsolute(e))
    return Vn.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = St.dirname(t), i = St.join(r, e);
    return ap(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : Vn.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: St.relative(r, e)
    })));
  }
}
function lp(e, t) {
  let n;
  if (St.isAbsolute(e)) {
    if (n = Vn.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = St.dirname(t), i = St.join(r, e);
    if (n = Vn.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = Vn.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: St.relative(r, e)
    };
  }
}
var cp = {
  symlinkPaths: sp,
  symlinkPathsSync: lp
};
const qc = Ue;
function up(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  qc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function fp(e, t) {
  let n;
  if (t) return t;
  try {
    n = qc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var dp = {
  symlinkType: up,
  symlinkTypeSync: fp
};
const hp = xe.fromCallback, Wc = ae, Ze = en, Vc = ct, pp = Vc.mkdirs, mp = Vc.mkdirsSync, Yc = cp, gp = Yc.symlinkPaths, Ep = Yc.symlinkPathsSync, zc = dp, yp = zc.symlinkType, wp = zc.symlinkTypeSync, vp = tn.pathExists, { areIdentical: Xc } = Cn;
function _p(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Ze.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ze.stat(e),
      Ze.stat(t)
    ]).then(([a, s]) => {
      if (Xc(a, s)) return r(null);
      _s(e, t, n, r);
    }) : _s(e, t, n, r);
  });
}
function _s(e, t, n, r) {
  gp(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, yp(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = Wc.dirname(t);
      vp(l, (p, c) => {
        if (p) return r(p);
        if (c) return Ze.symlink(e, t, s, r);
        pp(l, (f) => {
          if (f) return r(f);
          Ze.symlink(e, t, s, r);
        });
      });
    });
  });
}
function Ap(e, t, n) {
  let r;
  try {
    r = Ze.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = Ze.statSync(e), l = Ze.statSync(t);
    if (Xc(s, l)) return;
  }
  const i = Ep(e, t);
  e = i.toDst, n = wp(i.toCwd, n);
  const o = Wc.dirname(t);
  return Ze.existsSync(o) || mp(o), Ze.symlinkSync(e, t, n);
}
var Sp = {
  createSymlink: hp(_p),
  createSymlinkSync: Ap
};
const { createFile: As, createFileSync: Ss } = ep, { createLink: Ts, createLinkSync: Cs } = op, { createSymlink: $s, createSymlinkSync: bs } = Sp;
var Tp = {
  // file
  createFile: As,
  createFileSync: Ss,
  ensureFile: As,
  ensureFileSync: Ss,
  // link
  createLink: Ts,
  createLinkSync: Cs,
  ensureLink: Ts,
  ensureLinkSync: Cs,
  // symlink
  createSymlink: $s,
  createSymlinkSync: bs,
  ensureSymlink: $s,
  ensureSymlinkSync: bs
};
function Cp(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function $p(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var ma = { stringify: Cp, stripBom: $p };
let An;
try {
  An = Ue;
} catch {
  An = Dt;
}
const Ti = xe, { stringify: Kc, stripBom: Jc } = ma;
async function bp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || An, r = "throws" in t ? t.throws : !0;
  let i = await Ti.fromCallback(n.readFile)(e, t);
  i = Jc(i);
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
const Ip = Ti.fromPromise(bp);
function Rp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || An, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Jc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Op(e, t, n = {}) {
  const r = n.fs || An, i = Kc(t, n);
  await Ti.fromCallback(r.writeFile)(e, i, n);
}
const Dp = Ti.fromPromise(Op);
function Np(e, t, n = {}) {
  const r = n.fs || An, i = Kc(t, n);
  return r.writeFileSync(e, i, n);
}
var Pp = {
  readFile: Ip,
  readFileSync: Rp,
  writeFile: Dp,
  writeFileSync: Np
};
const Lr = Pp;
var Fp = {
  // jsonfile exports
  readJson: Lr.readFile,
  readJsonSync: Lr.readFileSync,
  writeJson: Lr.writeFile,
  writeJsonSync: Lr.writeFileSync
};
const xp = xe.fromCallback, Yn = Ue, Qc = ae, Zc = ct, Up = tn.pathExists;
function Lp(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = Qc.dirname(e);
  Up(i, (o, a) => {
    if (o) return r(o);
    if (a) return Yn.writeFile(e, t, n, r);
    Zc.mkdirs(i, (s) => {
      if (s) return r(s);
      Yn.writeFile(e, t, n, r);
    });
  });
}
function kp(e, ...t) {
  const n = Qc.dirname(e);
  if (Yn.existsSync(n))
    return Yn.writeFileSync(e, ...t);
  Zc.mkdirsSync(n), Yn.writeFileSync(e, ...t);
}
var ga = {
  outputFile: xp(Lp),
  outputFileSync: kp
};
const { stringify: Mp } = ma, { outputFile: Bp } = ga;
async function jp(e, t, n = {}) {
  const r = Mp(t, n);
  await Bp(e, r, n);
}
var Hp = jp;
const { stringify: Gp } = ma, { outputFileSync: qp } = ga;
function Wp(e, t, n) {
  const r = Gp(t, n);
  qp(e, r, n);
}
var Vp = Wp;
const Yp = xe.fromPromise, Fe = Fp;
Fe.outputJson = Yp(Hp);
Fe.outputJsonSync = Vp;
Fe.outputJSON = Fe.outputJson;
Fe.outputJSONSync = Fe.outputJsonSync;
Fe.writeJSON = Fe.writeJson;
Fe.writeJSONSync = Fe.writeJsonSync;
Fe.readJSON = Fe.readJson;
Fe.readJSONSync = Fe.readJsonSync;
var zp = Fe;
const Xp = Ue, Lo = ae, Kp = ha.copy, eu = Si.remove, Jp = ct.mkdirp, Qp = tn.pathExists, Is = Cn;
function Zp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  Is.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    Is.checkParentPaths(e, s, t, "move", (p) => {
      if (p) return r(p);
      if (em(t)) return Rs(e, t, i, l, r);
      Jp(Lo.dirname(t), (c) => c ? r(c) : Rs(e, t, i, l, r));
    });
  });
}
function em(e) {
  const t = Lo.dirname(e);
  return Lo.parse(t).root === t;
}
function Rs(e, t, n, r, i) {
  if (r) return eo(e, t, n, i);
  if (n)
    return eu(t, (o) => o ? i(o) : eo(e, t, n, i));
  Qp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : eo(e, t, n, i));
}
function eo(e, t, n, r) {
  Xp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : tm(e, t, n, r) : r());
}
function tm(e, t, n, r) {
  Kp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : eu(e, r));
}
var nm = Zp;
const tu = Ue, ko = ae, rm = ha.copySync, nu = Si.removeSync, im = ct.mkdirpSync, Os = Cn;
function om(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = Os.checkPathsSync(e, t, "move", n);
  return Os.checkParentPathsSync(e, i, t, "move"), am(t) || im(ko.dirname(t)), sm(e, t, r, o);
}
function am(e) {
  const t = ko.dirname(e);
  return ko.parse(t).root === t;
}
function sm(e, t, n, r) {
  if (r) return to(e, t, n);
  if (n)
    return nu(t), to(e, t, n);
  if (tu.existsSync(t)) throw new Error("dest already exists.");
  return to(e, t, n);
}
function to(e, t, n) {
  try {
    tu.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return lm(e, t, n);
  }
}
function lm(e, t, n) {
  return rm(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), nu(e);
}
var cm = om;
const um = xe.fromCallback;
var fm = {
  move: um(nm),
  moveSync: cm
}, Pt = {
  // Export promiseified graceful-fs:
  ...en,
  // Export extra methods:
  ...ha,
  ...Kh,
  ...Tp,
  ...zp,
  ...ct,
  ...fm,
  ...ga,
  ...tn,
  ...Si
}, nn = {}, $t = {}, me = {}, bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.CancellationError = bt.CancellationToken = void 0;
const dm = dc;
class hm extends dm.EventEmitter {
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
      return Promise.reject(new Mo());
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
          o(new Mo());
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
bt.CancellationToken = hm;
class Mo extends Error {
  constructor() {
    super("cancelled");
  }
}
bt.CancellationError = Mo;
var $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
$n.newError = pm;
function pm(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Pe = {}, Bo = { exports: {} }, kr = { exports: {} }, no, Ds;
function mm() {
  if (Ds) return no;
  Ds = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  no = function(c, f) {
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
    var y = f >= h * 1.5;
    return Math.round(c / h) + " " + m + (y ? "s" : "");
  }
  return no;
}
var ro, Ns;
function ru() {
  if (Ns) return ro;
  Ns = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = p, r.disable = s, r.enable = o, r.enabled = l, r.humanize = mm(), r.destroy = c, Object.keys(t).forEach((f) => {
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
      let h, m = null, y, E;
      function A(...C) {
        if (!A.enabled)
          return;
        const T = A, N = Number(/* @__PURE__ */ new Date()), U = N - (h || N);
        T.diff = U, T.prev = h, T.curr = N, h = N, C[0] = r.coerce(C[0]), typeof C[0] != "string" && C.unshift("%O");
        let q = 0;
        C[0] = C[0].replace(/%([a-zA-Z%])/g, (Q, W) => {
          if (Q === "%%")
            return "%";
          q++;
          const k = r.formatters[W];
          if (typeof k == "function") {
            const w = C[q];
            Q = k.call(T, w), C.splice(q, 1), q--;
          }
          return Q;
        }), r.formatArgs.call(T, C), (T.log || r.log).apply(T, C);
      }
      return A.namespace = f, A.useColors = r.useColors(), A.color = r.selectColor(f), A.extend = i, A.destroy = r.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (y !== r.namespaces && (y = r.namespaces, E = r.enabled(f)), E),
        set: (C) => {
          m = C;
        }
      }), typeof r.init == "function" && r.init(A), A;
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
      let m = 0, y = 0, E = -1, A = 0;
      for (; m < f.length; )
        if (y < h.length && (h[y] === f[m] || h[y] === "*"))
          h[y] === "*" ? (E = y, A = m, y++) : (m++, y++);
        else if (E !== -1)
          y = E + 1, A++, m = A;
        else
          return !1;
      for (; y < h.length && h[y] === "*"; )
        y++;
      return y === h.length;
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
  return ro = e, ro;
}
var Ps;
function gm() {
  return Ps || (Ps = 1, function(e, t) {
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
    e.exports = ru()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(kr, kr.exports)), kr.exports;
}
var Mr = { exports: {} }, io, Fs;
function Em() {
  return Fs || (Fs = 1, io = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), io;
}
var oo, xs;
function ym() {
  if (xs) return oo;
  xs = 1;
  const e = vi, t = hc, n = Em(), { env: r } = process;
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
  return oo = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, oo;
}
var Us;
function wm() {
  return Us || (Us = 1, function(e, t) {
    const n = hc, r = sa;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = p, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = ym();
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
      const y = m.substring(6).toLowerCase().replace(/_([a-z])/g, (A, C) => C.toUpperCase());
      let E = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(E) ? E = !0 : /^(no|off|false|disabled)$/i.test(E) ? E = !1 : E === "null" ? E = null : E = Number(E), h[y] = E, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: m, useColors: y } = this;
      if (y) {
        const E = this.color, A = "\x1B[3" + (E < 8 ? E : "8;5;" + E), C = `  ${A};1m${m} \x1B[0m`;
        h[0] = C + h[0].split(`
`).join(`
` + C), h.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
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
      for (let y = 0; y < m.length; y++)
        h.inspectOpts[m[y]] = t.inspectOpts[m[y]];
    }
    e.exports = ru()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(Mr, Mr.exports)), Mr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Bo.exports = gm() : Bo.exports = wm();
var vm = Bo.exports, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.ProgressCallbackTransform = void 0;
const _m = hr;
class Am extends _m.Transform {
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
gr.ProgressCallbackTransform = Am;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.DigestTransform = Pe.HttpExecutor = Pe.HttpError = void 0;
Pe.createHttpError = Ho;
Pe.parseJson = Om;
Pe.configureRequestOptionsFromUrl = ou;
Pe.configureRequestUrl = ya;
Pe.safeGetHeader = wn;
Pe.configureRequestOptions = ci;
Pe.safeStringifyJson = ui;
const Sm = pr, Tm = vm, Cm = Dt, $m = hr, jo = Nt, bm = bt, Ls = $n, Im = gr, jt = (0, Tm.default)("electron-builder");
function Ho(e, t = null) {
  return new Ea(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ui(e.headers), t);
}
const Rm = /* @__PURE__ */ new Map([
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
class Ea extends Error {
  constructor(t, n = `HTTP error: ${Rm.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Pe.HttpError = Ea;
function Om(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class hn {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new bm.CancellationToken(), r) {
    ci(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      jt(i);
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
    return jt.enabled && jt(`Request: ${ui(t)}`), n.createPromise((o, a, s) => {
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
    if (jt.enabled && jt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${ui(n)}`), t.statusCode === 404) {
      o(Ho(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const p = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = p >= 300 && p < 400, f = wn(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(hn.prepareRedirectUrlOptions(f, n), r, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (m) => h += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = wn(t, "content-type"), y = m != null && (Array.isArray(m) ? m.find((E) => E.includes("json")) != null : m.includes("json"));
          o(Ho(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${y ? JSON.stringify(JSON.parse(h)) : h}
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
      ya(t, s), ci(s), this.doDownload(s, {
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
      const a = wn(o, "location");
      if (a != null) {
        r < this.maxRedirects ? this.doDownload(hn.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? Nm(n, o) : n.responseHandler(o, n.callback);
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
    const r = ou(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = hn.reconstructOriginalUrl(n), a = iu(t, n);
      hn.isCrossOriginRedirect(o, a) && (jt.enabled && jt(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new jo.URL(`${n}//${r}${i}${o}`);
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
        if (r < n && (i instanceof Ea && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Pe.HttpExecutor = hn;
function iu(e, t) {
  try {
    return new jo.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new jo.URL(e, o);
  }
}
function ou(e, t) {
  const n = ci(t), r = iu(e, t);
  return ya(r, n), n;
}
function ya(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Go extends $m.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Sm.createHash)(n);
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
      throw (0, Ls.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Ls.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Pe.DigestTransform = Go;
function Dm(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function wn(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function Nm(e, t) {
  if (!Dm(wn(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = wn(t, "content-length");
    a != null && n.push(new Im.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new Go(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new Go(e.options.sha2, "sha256", "hex"));
  const i = (0, Cm.createWriteStream)(e.destination);
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
function ci(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function ui(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.MemoLazy = void 0;
class Pm {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && au(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
Ci.MemoLazy = Pm;
function au(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => au(e[a], t[a]));
  }
  return e === t;
}
var Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.githubUrl = Fm;
Er.githubTagPrefix = xm;
Er.getS3LikeProviderBaseUrl = Um;
function Fm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function xm(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function Um(e) {
  const t = e.provider;
  if (t === "s3")
    return Lm(e);
  if (t === "spaces")
    return km(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Lm(e) {
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
  return su(t, e.path);
}
function su(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function km(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return su(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
wa.retry = lu;
const Mm = bt;
async function lu(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Mm.CancellationToken() } = t;
  try {
    return await e();
  } catch (p) {
    if (await Promise.resolve((n = s == null ? void 0 : s(p)) !== null && n !== void 0 ? n : !0) && r > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await lu(e, { ...t, retries: r - 1, attempt: a + 1 });
    throw p;
  }
}
var va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
va.parseDn = Bm;
function Bm(e) {
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
var Sn = {};
Object.defineProperty(Sn, "__esModule", { value: !0 });
Sn.nil = Sn.UUID = void 0;
const cu = pr, uu = $n, jm = "options.name must be either a string or a Buffer", ks = (0, cu.randomBytes)(16);
ks[0] = ks[0] | 1;
const ni = {}, z = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  ni[t] = e, z[e] = t;
}
class Qt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Qt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return Hm(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Gm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (ni[t[14] + t[15]] & 240) >> 4,
        variant: Ms((ni[t[19] + t[20]] & 224) >> 5),
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
        variant: Ms((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, uu.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = ni[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
Sn.UUID = Qt;
Qt.OID = Qt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Ms(e) {
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
var zn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(zn || (zn = {}));
function Hm(e, t, n, r, i = zn.ASCII) {
  const o = (0, cu.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, uu.newError)(jm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case zn.BINARY:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = s;
      break;
    case zn.OBJECT:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = new Qt(s);
      break;
    default:
      l = z[s[0]] + z[s[1]] + z[s[2]] + z[s[3]] + "-" + z[s[4]] + z[s[5]] + "-" + z[s[6] & 15 | n] + z[s[7]] + "-" + z[s[8] & 63 | 128] + z[s[9]] + "-" + z[s[10]] + z[s[11]] + z[s[12]] + z[s[13]] + z[s[14]] + z[s[15]];
      break;
  }
  return l;
}
function Gm(e) {
  return z[e[0]] + z[e[1]] + z[e[2]] + z[e[3]] + "-" + z[e[4]] + z[e[5]] + "-" + z[e[6]] + z[e[7]] + "-" + z[e[8]] + z[e[9]] + "-" + z[e[10]] + z[e[11]] + z[e[12]] + z[e[13]] + z[e[14]] + z[e[15]];
}
Sn.nil = new Qt("00000000-0000-0000-0000-000000000000");
var yr = {}, fu = {};
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
      var S = this;
      o(S), S.q = S.c = "", S.bufferCheckPosition = t.MAX_BUFFER_LENGTH, S.encoding = null, S.opt = u || {}, S.opt.lowercase = S.opt.lowercase || S.opt.lowercasetags, S.looseCase = S.opt.lowercase ? "toLowerCase" : "toUpperCase", S.opt.maxEntityCount = S.opt.maxEntityCount || 512, S.opt.maxEntityDepth = S.opt.maxEntityDepth || 4, S.entityCount = S.entityDepth = 0, S.tags = [], S.closed = S.closedRoot = S.sawRoot = !1, S.tag = S.error = null, S.strict = !!d, S.noscript = !!(d || S.opt.noscript), S.state = w.BEGIN, S.strictEntities = S.opt.strictEntities, S.ENTITIES = S.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), S.attribList = [], S.opt.xmlns && (S.ns = Object.create(A)), S.opt.unquotedAttributeValues === void 0 && (S.opt.unquotedAttributeValues = !d), S.trackPosition = S.opt.position !== !1, S.trackPosition && (S.position = S.line = S.column = 0), X(S, "onready");
    }
    Object.create || (Object.create = function(d) {
      function u() {
      }
      u.prototype = d;
      var S = new u();
      return S;
    }), Object.keys || (Object.keys = function(d) {
      var u = [];
      for (var S in d) d.hasOwnProperty(S) && u.push(S);
      return u;
    });
    function i(d) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), S = 0, v = 0, K = n.length; v < K; v++) {
        var re = d[n[v]].length;
        if (re > u)
          switch (n[v]) {
            case "textNode":
              F(d);
              break;
            case "cdata":
              b(d, "oncdata", d.cdata), d.cdata = "";
              break;
            case "script":
              b(d, "onscript", d.script), d.script = "";
              break;
            default:
              B(d, "Max buffer length exceeded: " + n[v]);
          }
        S = Math.max(S, re);
      }
      var le = t.MAX_BUFFER_LENGTH - S;
      d.bufferCheckPosition = le + d.position;
    }
    function o(d) {
      for (var u = 0, S = n.length; u < S; u++)
        d[n[u]] = "";
    }
    function a(d) {
      F(d), d.cdata !== "" && (b(d, "oncdata", d.cdata), d.cdata = ""), d.script !== "" && (b(d, "onscript", d.script), d.script = "");
    }
    r.prototype = {
      end: function() {
        Y(this);
      },
      write: $r,
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
      var S = this;
      this._parser.onend = function() {
        S.emit("end");
      }, this._parser.onerror = function(v) {
        S.emit("error", v), S._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, l.forEach(function(v) {
        Object.defineProperty(S, "on" + v, {
          get: function() {
            return S._parser["on" + v];
          },
          set: function(K) {
            if (!K)
              return S.removeAllListeners(v), S._parser["on" + v] = K, K;
            S.on(v, K);
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
        var S = c(d, u);
        if (!S)
          return this._decoderBuffer = d, "";
        this._parser.encoding = S, this._decoder = new TextDecoder(S);
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
        var S = this._decoder.decode();
        S && (this._parser.write(S), this.emit("data", S));
      }
      return this._parser.end(), !0;
    }, f.prototype.on = function(d, u) {
      var S = this;
      return !S._parser["on" + d] && l.indexOf(d) !== -1 && (S._parser["on" + d] = function() {
        var v = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        v.splice(0, 0, d), S.emit.apply(S, v);
      }), s.prototype.on.call(S, d, u);
    };
    var h = "[CDATA[", m = "DOCTYPE", y = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", A = { xml: y, xmlns: E }, C = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, N = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, U = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function q(d) {
      return d === " " || d === `
` || d === "\r" || d === "	";
    }
    function J(d) {
      return d === '"' || d === "'";
    }
    function Q(d) {
      return d === ">" || q(d);
    }
    function W(d, u) {
      return d.test(u);
    }
    function k(d, u) {
      return !W(d, u);
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
      var u = t.ENTITIES[d], S = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[d] = S;
    });
    for (var H in t.STATE)
      t.STATE[t.STATE[H]] = H;
    w = t.STATE;
    function X(d, u, S) {
      d[u] && d[u](S);
    }
    function ne(d) {
      var u = d && d.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return u ? u[2] : null;
    }
    function O(d) {
      return d ? d.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function I(d, u) {
      const S = O(d), v = O(u);
      return !S || !v ? !0 : v === "utf16" ? S === "utf16le" || S === "utf16be" : S === v;
    }
    function P(d, u) {
      if (!(!d.strict || !d.encoding || !u || u.name !== "xml")) {
        var S = ne(u.body);
        S && !I(d.encoding, S) && x(
          d,
          "XML declaration encoding " + S + " does not match detected stream encoding " + d.encoding.toUpperCase()
        );
      }
    }
    function b(d, u, S) {
      d.textNode && F(d), X(d, u, S);
    }
    function F(d) {
      d.textNode = D(d.opt, d.textNode), d.textNode && X(d, "ontext", d.textNode), d.textNode = "";
    }
    function D(d, u) {
      return d.trim && (u = u.trim()), d.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function B(d, u) {
      return F(d), d.trackPosition && (u += `
Line: ` + d.line + `
Column: ` + d.column + `
Char: ` + d.c), u = new Error(u), d.error = u, X(d, "onerror", u), d;
    }
    function Y(d) {
      return d.sawRoot && !d.closedRoot && x(d, "Unclosed root tag"), d.state !== w.BEGIN && d.state !== w.BEGIN_WHITESPACE && d.state !== w.TEXT && B(d, "Unexpected end"), F(d), d.c = "", d.closed = !0, X(d, "onend"), r.call(d, d.strict, d.opt), d;
    }
    function x(d, u) {
      if (typeof d != "object" || !(d instanceof r))
        throw new Error("bad call to strictFail");
      d.strict && B(d, u);
    }
    function Z(d) {
      d.strict || (d.tagName = d.tagName[d.looseCase]());
      var u = d.tags[d.tags.length - 1] || d, S = d.tag = { name: d.tagName, attributes: {} };
      d.opt.xmlns && (S.ns = u.ns), d.attribList.length = 0, b(d, "onopentagstart", S);
    }
    function de(d, u) {
      var S = d.indexOf(":"), v = S < 0 ? ["", d] : d.split(":"), K = v[0], re = v[1];
      return u && d === "xmlns" && (K = "xmlns", re = ""), { prefix: K, local: re };
    }
    function j(d) {
      if (d.strict || (d.attribName = d.attribName[d.looseCase]()), d.attribList.indexOf(d.attribName) !== -1 || d.tag.attributes.hasOwnProperty(d.attribName)) {
        d.attribName = d.attribValue = "";
        return;
      }
      if (d.opt.xmlns) {
        var u = de(d.attribName, !0), S = u.prefix, v = u.local;
        if (S === "xmlns")
          if (v === "xml" && d.attribValue !== y)
            x(
              d,
              "xml: prefix must be bound to " + y + `
Actual: ` + d.attribValue
            );
          else if (v === "xmlns" && d.attribValue !== E)
            x(
              d,
              "xmlns: prefix must be bound to " + E + `
Actual: ` + d.attribValue
            );
          else {
            var K = d.tag, re = d.tags[d.tags.length - 1] || d;
            K.ns === re.ns && (K.ns = Object.create(re.ns)), K.ns[v] = d.attribValue;
          }
        d.attribList.push([d.attribName, d.attribValue]);
      } else
        d.tag.attributes[d.attribName] = d.attribValue, b(d, "onattribute", {
          name: d.attribName,
          value: d.attribValue
        });
      d.attribName = d.attribValue = "";
    }
    function _e(d, u) {
      if (d.opt.xmlns) {
        var S = d.tag, v = de(d.tagName);
        S.prefix = v.prefix, S.local = v.local, S.uri = S.ns[v.prefix] || "", S.prefix && !S.uri && (x(
          d,
          "Unbound namespace prefix: " + JSON.stringify(d.tagName)
        ), S.uri = v.prefix);
        var K = d.tags[d.tags.length - 1] || d;
        S.ns && K.ns !== S.ns && Object.keys(S.ns).forEach(function(xt) {
          b(d, "onopennamespace", {
            prefix: xt,
            uri: S.ns[xt]
          });
        });
        for (var re = 0, le = d.attribList.length; re < le; re++) {
          var Ae = d.attribList[re], Se = Ae[0], ze = Ae[1], he = de(Se, !0), Xe = he.prefix, qi = he.local, br = Xe === "" ? "" : S.ns[Xe] || "", Nn = {
            name: Se,
            value: ze,
            prefix: Xe,
            local: qi,
            uri: br
          };
          Xe && Xe !== "xmlns" && !br && (x(
            d,
            "Unbound namespace prefix: " + JSON.stringify(Xe)
          ), Nn.uri = Xe), d.tag.attributes[Se] = Nn, b(d, "onattribute", Nn);
        }
        d.attribList.length = 0;
      }
      d.tag.isSelfClosing = !!u, d.sawRoot = !0, d.tags.push(d.tag), b(d, "onopentag", d.tag), u || (!d.noscript && d.tagName.toLowerCase() === "script" ? d.state = w.SCRIPT : d.state = w.TEXT, d.tag = null, d.tagName = ""), d.attribName = d.attribValue = "", d.attribList.length = 0;
    }
    function On(d) {
      if (!d.tagName) {
        x(d, "Weird empty close tag."), d.textNode += "</>", d.state = w.TEXT;
        return;
      }
      if (d.script) {
        if (d.tagName !== "script") {
          d.script += "</" + d.tagName + ">", d.tagName = "", d.state = w.SCRIPT;
          return;
        }
        b(d, "onscript", d.script), d.script = "";
      }
      var u = d.tags.length, S = d.tagName;
      d.strict || (S = S[d.looseCase]());
      for (var v = S; u--; ) {
        var K = d.tags[u];
        if (K.name !== v)
          x(d, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        x(d, "Unmatched closing tag: " + d.tagName), d.textNode += "</" + d.tagName + ">", d.state = w.TEXT;
        return;
      }
      d.tagName = S;
      for (var re = d.tags.length; re-- > u; ) {
        var le = d.tag = d.tags.pop();
        d.tagName = d.tag.name, b(d, "onclosetag", d.tagName);
        var Ae = {};
        for (var Se in le.ns)
          Ae[Se] = le.ns[Se];
        var ze = d.tags[d.tags.length - 1] || d;
        d.opt.xmlns && le.ns !== ze.ns && Object.keys(le.ns).forEach(function(he) {
          var Xe = le.ns[he];
          b(d, "onclosenamespace", { prefix: he, uri: Xe });
        });
      }
      u === 0 && (d.closedRoot = !0), d.tagName = d.attribValue = d.attribName = "", d.attribList.length = 0, d.state = w.TEXT;
    }
    function Ye(d) {
      var u = d.entity, S = u.toLowerCase(), v, K = "";
      return d.ENTITIES[u] ? d.ENTITIES[u] : d.ENTITIES[S] ? d.ENTITIES[S] : (u = S, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), v = parseInt(u, 16), K = v.toString(16)) : (u = u.slice(1), v = parseInt(u, 10), K = v.toString(10))), u = u.replace(/^0+/, ""), isNaN(v) || K.toLowerCase() !== u || v < 0 || v > 1114111 ? (x(d, "Invalid character entity"), "&" + d.entity + ";") : String.fromCodePoint(v));
    }
    function Dn(d, u) {
      u === "<" ? (d.state = w.OPEN_WAKA, d.startTagPosition = d.position) : q(u) || (x(d, "Non-whitespace before first tag."), d.textNode = u, d.state = w.TEXT);
    }
    function on(d, u) {
      var S = "";
      return u < d.length && (S = d.charAt(u)), S;
    }
    function $r(d) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return B(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (d === null)
        return Y(u);
      typeof d == "object" && (d = d.toString());
      for (var S = 0, v = ""; v = on(d, S++), u.c = v, !!v; )
        switch (u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case w.BEGIN:
            if (u.state = w.BEGIN_WHITESPACE, v === "\uFEFF")
              continue;
            Dn(u, v);
            continue;
          case w.BEGIN_WHITESPACE:
            Dn(u, v);
            continue;
          case w.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var re = S - 1; v && v !== "<" && v !== "&"; )
                v = on(d, S++), v && u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += d.substring(re, S - 1);
            }
            v === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = w.OPEN_WAKA, u.startTagPosition = u.position) : (!q(v) && (!u.sawRoot || u.closedRoot) && x(u, "Text data outside of root node."), v === "&" ? u.state = w.TEXT_ENTITY : u.textNode += v);
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
            else if (!q(v)) if (W(C, v))
              u.state = w.OPEN_TAG, u.tagName = v;
            else if (v === "/")
              u.state = w.CLOSE_TAG, u.tagName = "";
            else if (v === "?")
              u.state = w.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (x(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var K = u.position - u.startTagPosition;
                v = new Array(K).join(" ") + v;
              }
              u.textNode += "<" + v, u.state = w.TEXT;
            }
            continue;
          case w.SGML_DECL:
            if (u.sgmlDecl + v === "--") {
              u.state = w.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = w.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + v, u.sgmlDecl = "") : (u.sgmlDecl + v).toUpperCase() === h ? (b(u, "onopencdata"), u.state = w.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + v).toUpperCase() === m ? (u.state = w.DOCTYPE, (u.doctype || u.sawRoot) && x(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : v === ">" ? (b(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = w.TEXT) : (J(v) && (u.state = w.SGML_DECL_QUOTED), u.sgmlDecl += v);
            continue;
          case w.SGML_DECL_QUOTED:
            v === u.q && (u.state = w.SGML_DECL, u.q = ""), u.sgmlDecl += v;
            continue;
          case w.DOCTYPE:
            v === ">" ? (u.state = w.TEXT, b(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += v, v === "[" ? u.state = w.DOCTYPE_DTD : J(v) && (u.state = w.DOCTYPE_QUOTED, u.q = v));
            continue;
          case w.DOCTYPE_QUOTED:
            u.doctype += v, v === u.q && (u.q = "", u.state = w.DOCTYPE);
            continue;
          case w.DOCTYPE_DTD:
            v === "]" ? (u.doctype += v, u.state = w.DOCTYPE) : v === "<" ? (u.state = w.OPEN_WAKA, u.startTagPosition = u.position) : J(v) ? (u.doctype += v, u.state = w.DOCTYPE_DTD_QUOTED, u.q = v) : u.doctype += v;
            continue;
          case w.DOCTYPE_DTD_QUOTED:
            u.doctype += v, v === u.q && (u.state = w.DOCTYPE_DTD, u.q = "");
            continue;
          case w.COMMENT:
            v === "-" ? u.state = w.COMMENT_ENDING : u.comment += v;
            continue;
          case w.COMMENT_ENDING:
            v === "-" ? (u.state = w.COMMENT_ENDED, u.comment = D(u.opt, u.comment), u.comment && b(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + v, u.state = w.COMMENT);
            continue;
          case w.COMMENT_ENDED:
            v !== ">" ? (x(u, "Malformed comment"), u.comment += "--" + v, u.state = w.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = w.DOCTYPE_DTD : u.state = w.TEXT;
            continue;
          case w.CDATA:
            for (var re = S - 1; v && v !== "]"; )
              v = on(d, S++), v && u.trackPosition && (u.position++, v === `
` ? (u.line++, u.column = 0) : u.column++);
            u.cdata += d.substring(re, S - 1), v === "]" && (u.state = w.CDATA_ENDING);
            continue;
          case w.CDATA_ENDING:
            v === "]" ? u.state = w.CDATA_ENDING_2 : (u.cdata += "]" + v, u.state = w.CDATA);
            continue;
          case w.CDATA_ENDING_2:
            v === ">" ? (u.cdata && b(u, "oncdata", u.cdata), b(u, "onclosecdata"), u.cdata = "", u.state = w.TEXT) : v === "]" ? u.cdata += "]" : (u.cdata += "]]" + v, u.state = w.CDATA);
            continue;
          case w.PROC_INST:
            v === "?" ? u.state = w.PROC_INST_ENDING : q(v) ? u.state = w.PROC_INST_BODY : u.procInstName += v;
            continue;
          case w.PROC_INST_BODY:
            if (!u.procInstBody && q(v))
              continue;
            v === "?" ? u.state = w.PROC_INST_ENDING : u.procInstBody += v;
            continue;
          case w.PROC_INST_ENDING:
            if (v === ">") {
              const ze = {
                name: u.procInstName,
                body: u.procInstBody
              };
              P(u, ze), b(u, "onprocessinginstruction", ze), u.procInstName = u.procInstBody = "", u.state = w.TEXT;
            } else
              u.procInstBody += "?" + v, u.state = w.PROC_INST_BODY;
            continue;
          case w.OPEN_TAG:
            W(T, v) ? u.tagName += v : (Z(u), v === ">" ? _e(u) : v === "/" ? u.state = w.OPEN_TAG_SLASH : (q(v) || x(u, "Invalid character in tag name"), u.state = w.ATTRIB));
            continue;
          case w.OPEN_TAG_SLASH:
            v === ">" ? (_e(u, !0), On(u)) : (x(
              u,
              "Forward-slash in opening tag not followed by >"
            ), u.state = w.ATTRIB);
            continue;
          case w.ATTRIB:
            if (q(v))
              continue;
            v === ">" ? _e(u) : v === "/" ? u.state = w.OPEN_TAG_SLASH : W(C, v) ? (u.attribName = v, u.attribValue = "", u.state = w.ATTRIB_NAME) : x(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_NAME:
            v === "=" ? u.state = w.ATTRIB_VALUE : v === ">" ? (x(u, "Attribute without value"), u.attribValue = u.attribName, j(u), _e(u)) : q(v) ? u.state = w.ATTRIB_NAME_SAW_WHITE : W(T, v) ? u.attribName += v : x(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_NAME_SAW_WHITE:
            if (v === "=")
              u.state = w.ATTRIB_VALUE;
            else {
              if (q(v))
                continue;
              x(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", b(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", v === ">" ? _e(u) : W(C, v) ? (u.attribName = v, u.state = w.ATTRIB_NAME) : (x(u, "Invalid attribute name"), u.state = w.ATTRIB);
            }
            continue;
          case w.ATTRIB_VALUE:
            if (q(v))
              continue;
            J(v) ? (u.q = v, u.state = w.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || B(u, "Unquoted attribute value"), u.state = w.ATTRIB_VALUE_UNQUOTED, u.attribValue = v);
            continue;
          case w.ATTRIB_VALUE_QUOTED:
            if (v !== u.q) {
              v === "&" ? u.state = w.ATTRIB_VALUE_ENTITY_Q : u.attribValue += v;
              continue;
            }
            j(u), u.q = "", u.state = w.ATTRIB_VALUE_CLOSED;
            continue;
          case w.ATTRIB_VALUE_CLOSED:
            q(v) ? u.state = w.ATTRIB : v === ">" ? _e(u) : v === "/" ? u.state = w.OPEN_TAG_SLASH : W(C, v) ? (x(u, "No whitespace between attributes"), u.attribName = v, u.attribValue = "", u.state = w.ATTRIB_NAME) : x(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_VALUE_UNQUOTED:
            if (!Q(v)) {
              v === "&" ? u.state = w.ATTRIB_VALUE_ENTITY_U : u.attribValue += v;
              continue;
            }
            j(u), v === ">" ? _e(u) : u.state = w.ATTRIB;
            continue;
          case w.CLOSE_TAG:
            if (u.tagName)
              v === ">" ? On(u) : W(T, v) ? u.tagName += v : u.script ? (u.script += "</" + u.tagName + v, u.tagName = "", u.state = w.SCRIPT) : (q(v) || x(u, "Invalid tagname in closing tag"), u.state = w.CLOSE_TAG_SAW_WHITE);
            else {
              if (q(v))
                continue;
              k(C, v) ? u.script ? (u.script += "</" + v, u.state = w.SCRIPT) : x(u, "Invalid tagname in closing tag.") : u.tagName = v;
            }
            continue;
          case w.CLOSE_TAG_SAW_WHITE:
            if (q(v))
              continue;
            v === ">" ? On(u) : x(u, "Invalid characters in closing tag");
            continue;
          case w.TEXT_ENTITY:
          case w.ATTRIB_VALUE_ENTITY_Q:
          case w.ATTRIB_VALUE_ENTITY_U:
            var le, Ae;
            switch (u.state) {
              case w.TEXT_ENTITY:
                le = w.TEXT, Ae = "textNode";
                break;
              case w.ATTRIB_VALUE_ENTITY_Q:
                le = w.ATTRIB_VALUE_QUOTED, Ae = "attribValue";
                break;
              case w.ATTRIB_VALUE_ENTITY_U:
                le = w.ATTRIB_VALUE_UNQUOTED, Ae = "attribValue";
                break;
            }
            if (v === ";") {
              var Se = Ye(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Se) ? ((u.entityCount += 1) > u.opt.maxEntityCount && B(
                u,
                "Parsed entity count exceeds max entity count"
              ), (u.entityDepth += 1) > u.opt.maxEntityDepth && B(
                u,
                "Parsed entity depth exceeds max entity depth"
              ), u.entity = "", u.state = le, u.write(Se), u.entityDepth -= 1) : (u[Ae] += Se, u.entity = "", u.state = le);
            } else W(u.entity.length ? U : N, v) ? u.entity += v : (x(u, "Invalid character in entity name"), u[Ae] += "&" + u.entity + v, u.entity = "", u.state = le);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var d = String.fromCharCode, u = Math.floor, S = function() {
        var v = 16384, K = [], re, le, Ae = -1, Se = arguments.length;
        if (!Se)
          return "";
        for (var ze = ""; ++Ae < Se; ) {
          var he = Number(arguments[Ae]);
          if (!isFinite(he) || // `NaN`, `+Infinity`, or `-Infinity`
          he < 0 || // not a valid Unicode code point
          he > 1114111 || // not a valid Unicode code point
          u(he) !== he)
            throw RangeError("Invalid code point: " + he);
          he <= 65535 ? K.push(he) : (he -= 65536, re = (he >> 10) + 55296, le = he % 1024 + 56320, K.push(re, le)), (Ae + 1 === Se || K.length > v) && (ze += d.apply(null, K), K.length = 0);
        }
        return ze;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: S,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = S;
    }();
  })(e);
})(fu);
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.XElement = void 0;
yr.parseXml = Ym;
const qm = fu, Br = $n;
class du {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Br.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Vm(t))
      throw (0, Br.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Br.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Br.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (Bs(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => Bs(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
yr.XElement = du;
const Wm = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Vm(e) {
  return Wm.test(e);
}
function Bs(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Ym(e) {
  let t = null;
  const n = qm.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new du(i.name);
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
  var t = bt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = $n;
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
  var i = Ci;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = gr;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = Er;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var s = wa;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = va;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var p = Sn;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return p.UUID;
  } });
  var c = yr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(me);
var ve = {}, _a = {}, tt = {};
function hu(e) {
  return typeof e > "u" || e === null;
}
function zm(e) {
  return typeof e == "object" && e !== null;
}
function Xm(e) {
  return Array.isArray(e) ? e : hu(e) ? [] : [e];
}
function Km(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Jm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function Qm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
tt.isNothing = hu;
tt.isObject = zm;
tt.toArray = Xm;
tt.repeat = Jm;
tt.isNegativeZero = Qm;
tt.extend = Km;
function pu(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function tr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = pu(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
tr.prototype = Object.create(Error.prototype);
tr.prototype.constructor = tr;
tr.prototype.toString = function(t) {
  return this.name + ": " + pu(this, t);
};
var wr = tr, Gn = tt;
function ao(e, t, n, r, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return r - t > s && (o = " ... ", t = r - s + o.length), n - r > s && (a = " ...", n = r + s - a.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + a,
    pos: r - t + o.length
    // relative position
  };
}
function so(e, t) {
  return Gn.repeat(" ", t - e.length) + e;
}
function Zm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, a = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = r.length - 2);
  a < 0 && (a = r.length - 1);
  var s = "", l, p, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    p = ao(
      e.buffer,
      r[a - l],
      i[a - l],
      e.position - (r[a] - r[a - l]),
      f
    ), s = Gn.repeat(" ", t.indent) + so((e.line - l + 1).toString(), c) + " | " + p.str + `
` + s;
  for (p = ao(e.buffer, r[a], i[a], e.position, f), s += Gn.repeat(" ", t.indent) + so((e.line + 1).toString(), c) + " | " + p.str + `
`, s += Gn.repeat("-", t.indent + c + 3 + p.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    p = ao(
      e.buffer,
      r[a + l],
      i[a + l],
      e.position - (r[a] - r[a + l]),
      f
    ), s += Gn.repeat(" ", t.indent) + so((e.line + l + 1).toString(), c) + " | " + p.str + `
`;
  return s.replace(/\n$/, "");
}
var eg = Zm, js = wr, tg = [
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
], ng = [
  "scalar",
  "sequence",
  "mapping"
];
function rg(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function ig(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (tg.indexOf(n) === -1)
      throw new js('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = rg(t.styleAliases || null), ng.indexOf(this.kind) === -1)
    throw new js('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Le = ig, Ln = wr, lo = Le;
function Hs(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function og() {
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
function qo(e) {
  return this.extend(e);
}
qo.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof lo)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Ln("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof lo))
      throw new Ln("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Ln("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Ln("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof lo))
      throw new Ln("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(qo.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = Hs(i, "implicit"), i.compiledExplicit = Hs(i, "explicit"), i.compiledTypeMap = og(i.compiledImplicit, i.compiledExplicit), i;
};
var mu = qo, ag = Le, gu = new ag("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), sg = Le, Eu = new sg("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), lg = Le, yu = new lg("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), cg = mu, wu = new cg({
  explicit: [
    gu,
    Eu,
    yu
  ]
}), ug = Le;
function fg(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function dg() {
  return null;
}
function hg(e) {
  return e === null;
}
var vu = new ug("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: fg,
  construct: dg,
  predicate: hg,
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
}), pg = Le;
function mg(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function gg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Eg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var _u = new pg("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: mg,
  construct: gg,
  predicate: Eg,
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
}), yg = tt, wg = Le;
function vg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function _g(e) {
  return 48 <= e && e <= 55;
}
function Ag(e) {
  return 48 <= e && e <= 57;
}
function Sg(e) {
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
          if (!vg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!_g(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!Ag(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function Tg(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function Cg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !yg.isNegativeZero(e);
}
var Au = new wg("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Sg,
  construct: Tg,
  predicate: Cg,
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
}), Su = tt, $g = Le, bg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Ig(e) {
  return !(e === null || !bg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Rg(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var Og = /^[-+]?[0-9]+e/;
function Dg(e, t) {
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
  else if (Su.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), Og.test(n) ? n.replace("e", ".e") : n;
}
function Ng(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Su.isNegativeZero(e));
}
var Tu = new $g("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Ig,
  construct: Rg,
  predicate: Ng,
  represent: Dg,
  defaultStyle: "lowercase"
}), Cu = wu.extend({
  implicit: [
    vu,
    _u,
    Au,
    Tu
  ]
}), $u = Cu, Pg = Le, bu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Iu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Fg(e) {
  return e === null ? !1 : bu.exec(e) !== null || Iu.exec(e) !== null;
}
function xg(e) {
  var t, n, r, i, o, a, s, l = 0, p = null, c, f, h;
  if (t = bu.exec(e), t === null && (t = Iu.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), p = (c * 60 + f) * 6e4, t[9] === "-" && (p = -p)), h = new Date(Date.UTC(n, r, i, o, a, s, l)), p && h.setTime(h.getTime() - p), h;
}
function Ug(e) {
  return e.toISOString();
}
var Ru = new Pg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Fg,
  construct: xg,
  instanceOf: Date,
  represent: Ug
}), Lg = Le;
function kg(e) {
  return e === "<<" || e === null;
}
var Ou = new Lg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: kg
}), Mg = Le, Aa = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Bg(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = Aa;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function jg(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = Aa, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Hg(e) {
  var t = "", n = 0, r, i, o = e.length, a = Aa;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function Gg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Du = new Mg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Bg,
  construct: jg,
  predicate: Gg,
  represent: Hg
}), qg = Le, Wg = Object.prototype.hasOwnProperty, Vg = Object.prototype.toString;
function Yg(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, Vg.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Wg.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function zg(e) {
  return e !== null ? e : [];
}
var Nu = new qg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Yg,
  construct: zg
}), Xg = Le, Kg = Object.prototype.toString;
function Jg(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], Kg.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function Qg(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var Pu = new Xg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Jg,
  construct: Qg
}), Zg = Le, e0 = Object.prototype.hasOwnProperty;
function t0(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (e0.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function n0(e) {
  return e !== null ? e : {};
}
var Fu = new Zg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: t0,
  construct: n0
}), Sa = $u.extend({
  implicit: [
    Ru,
    Ou
  ],
  explicit: [
    Du,
    Nu,
    Pu,
    Fu
  ]
}), Wt = tt, xu = wr, r0 = eg, i0 = Sa, It = Object.prototype.hasOwnProperty, fi = 1, Uu = 2, Lu = 3, di = 4, co = 1, o0 = 2, Gs = 3, a0 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, s0 = /[\x85\u2028\u2029]/, l0 = /[,\[\]\{\}]/, ku = /^(?:!|!!|![a-z\-]+!)$/i, Mu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function qs(e) {
  return Object.prototype.toString.call(e);
}
function lt(e) {
  return e === 10 || e === 13;
}
function Kt(e) {
  return e === 9 || e === 32;
}
function je(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function pn(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function c0(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function u0(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function f0(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ws(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function d0(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Bu(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var ju = new Array(256), Hu = new Array(256);
for (var ln = 0; ln < 256; ln++)
  ju[ln] = Ws(ln) ? 1 : 0, Hu[ln] = Ws(ln);
function h0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || i0, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Gu(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = r0(n), new xu(t, n);
}
function M(e, t) {
  throw Gu(e, t);
}
function hi(e, t) {
  e.onWarning && e.onWarning.call(null, Gu(e, t));
}
var Vs = {
  YAML: function(t, n, r) {
    var i, o, a;
    t.version !== null && M(t, "duplication of %YAML directive"), r.length !== 1 && M(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && M(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && M(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && hi(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && M(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], ku.test(i) || M(t, "ill-formed tag handle (first argument) of the TAG directive"), It.call(t.tagMap, i) && M(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Mu.test(o) || M(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      M(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function Ct(e, t, n, r) {
  var i, o, a, s;
  if (t < n) {
    if (s = e.input.slice(t, n), r)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || M(e, "expected valid JSON character");
    else a0.test(s) && M(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function Ys(e, t, n, r) {
  var i, o, a, s;
  for (Wt.isObject(n) || M(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], It.call(t, o) || (Bu(t, o, n[o]), r[o] = !0);
}
function mn(e, t, n, r, i, o, a, s, l) {
  var p, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), p = 0, c = i.length; p < c; p += 1)
      Array.isArray(i[p]) && M(e, "nested arrays are not supported inside keys"), typeof i == "object" && qs(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  if (typeof i == "object" && qs(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (p = 0, c = o.length; p < c; p += 1)
        Ys(e, t, o[p], n);
    else
      Ys(e, t, o, n);
  else
    !e.json && !It.call(n, i) && It.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, M(e, "duplicated mapping key")), Bu(t, i, o), delete n[i];
  return t;
}
function Ta(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : M(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ue(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Kt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (lt(i))
      for (Ta(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && hi(e, "deficient indentation"), r;
}
function $i(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || je(n)));
}
function Ca(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Wt.repeat(`
`, t - 1));
}
function p0(e, t, n) {
  var r, i, o, a, s, l, p, c, f = e.kind, h = e.result, m;
  if (m = e.input.charCodeAt(e.position), je(m) || pn(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), je(i) || n && pn(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), je(i) || n && pn(i))
        break;
    } else if (m === 35) {
      if (r = e.input.charCodeAt(e.position - 1), je(r))
        break;
    } else {
      if (e.position === e.lineStart && $i(e) || n && pn(m))
        break;
      if (lt(m))
        if (l = e.line, p = e.lineStart, c = e.lineIndent, ue(e, !1, -1), e.lineIndent >= t) {
          s = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = p, e.lineIndent = c;
          break;
        }
    }
    s && (Ct(e, o, a, !1), Ca(e, e.line - l), o = a = e.position, s = !1), Kt(m) || (a = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return Ct(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function m0(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (Ct(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else lt(n) ? (Ct(e, r, i, !0), Ca(e, ue(e, !1, t)), r = i = e.position) : e.position === e.lineStart && $i(e) ? M(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  M(e, "unexpected end of the stream within a single quoted scalar");
}
function g0(e, t) {
  var n, r, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return Ct(e, n, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (Ct(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), lt(s))
        ue(e, !1, t);
      else if (s < 256 && ju[s])
        e.result += Hu[s], e.position++;
      else if ((a = u0(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = c0(s)) >= 0 ? o = (o << 4) + a : M(e, "expected hexadecimal character");
        e.result += d0(o), e.position++;
      } else
        M(e, "unknown escape sequence");
      n = r = e.position;
    } else lt(s) ? (Ct(e, n, r, !0), Ca(e, ue(e, !1, t)), n = r = e.position) : e.position === e.lineStart && $i(e) ? M(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  M(e, "unexpected end of the stream within a double quoted scalar");
}
function E0(e, t) {
  var n = !0, r, i, o, a = e.tag, s, l = e.anchor, p, c, f, h, m, y = /* @__PURE__ */ Object.create(null), E, A, C, T;
  if (T = e.input.charCodeAt(e.position), T === 91)
    c = 93, m = !1, s = [];
  else if (T === 123)
    c = 125, m = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), T = e.input.charCodeAt(++e.position); T !== 0; ) {
    if (ue(e, !0, t), T = e.input.charCodeAt(e.position), T === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = s, !0;
    n ? T === 44 && M(e, "expected the node content, but found ','") : M(e, "missed comma between flow collection entries"), A = E = C = null, f = h = !1, T === 63 && (p = e.input.charCodeAt(e.position + 1), je(p) && (f = h = !0, e.position++, ue(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, Tn(e, t, fi, !1, !0), A = e.tag, E = e.result, ue(e, !0, t), T = e.input.charCodeAt(e.position), (h || e.line === r) && T === 58 && (f = !0, T = e.input.charCodeAt(++e.position), ue(e, !0, t), Tn(e, t, fi, !1, !0), C = e.result), m ? mn(e, s, y, A, E, C, r, i, o) : f ? s.push(mn(e, null, y, A, E, C, r, i, o)) : s.push(E), ue(e, !0, t), T = e.input.charCodeAt(e.position), T === 44 ? (n = !0, T = e.input.charCodeAt(++e.position)) : n = !1;
  }
  M(e, "unexpected end of the stream within a flow collection");
}
function y0(e, t) {
  var n, r, i = co, o = !1, a = !1, s = t, l = 0, p = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      co === i ? i = f === 43 ? Gs : o0 : M(e, "repeat of a chomping mode identifier");
    else if ((c = f0(f)) >= 0)
      c === 0 ? M(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? M(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Kt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Kt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!lt(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (Ta(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), lt(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Gs ? e.result += Wt.repeat(`
`, o ? 1 + l : l) : i === co && o && (e.result += `
`);
      break;
    }
    for (r ? Kt(f) ? (p = !0, e.result += Wt.repeat(`
`, o ? 1 + l : l)) : p ? (p = !1, e.result += Wt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Wt.repeat(`
`, l) : e.result += Wt.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, n = e.position; !lt(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    Ct(e, n, e.position, !1);
  }
  return !0;
}
function zs(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, M(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !je(a)))); ) {
    if (s = !0, e.position++, ue(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, Tn(e, t, Lu, !1, !0), o.push(e.result), ue(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      M(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function w0(e, t, n) {
  var r, i, o, a, s, l, p = e.tag, c = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), m = null, y = null, E = null, A = !1, C = !1, T;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), T = e.input.charCodeAt(e.position); T !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, M(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (T === 63 || T === 58) && je(r))
      T === 63 ? (A && (mn(e, f, h, m, y, null, a, s, l), m = y = E = null), C = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : M(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, T = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !Tn(e, n, Uu, !1, !0))
        break;
      if (e.line === o) {
        for (T = e.input.charCodeAt(e.position); Kt(T); )
          T = e.input.charCodeAt(++e.position);
        if (T === 58)
          T = e.input.charCodeAt(++e.position), je(T) || M(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (mn(e, f, h, m, y, null, a, s, l), m = y = E = null), C = !0, A = !1, i = !1, m = e.tag, y = e.result;
        else if (C)
          M(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = p, e.anchor = c, !0;
      } else if (C)
        M(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = p, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (A && (a = e.line, s = e.lineStart, l = e.position), Tn(e, t, di, !0, i) && (A ? y = e.result : E = e.result), A || (mn(e, f, h, m, y, E, a, s, l), m = y = E = null), ue(e, !0, -1), T = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && T !== 0)
      M(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && mn(e, f, h, m, y, null, a, s, l), C && (e.tag = p, e.anchor = c, e.kind = "mapping", e.result = f), C;
}
function v0(e) {
  var t, n = !1, r = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && M(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (n = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (r = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : M(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !je(a); )
      a === 33 && (r ? M(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), ku.test(i) || M(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), l0.test(o) && M(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Mu.test(o) && M(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    M(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : It.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : M(e, 'undeclared tag handle "' + i + '"'), !0;
}
function _0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && M(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !je(n) && !pn(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && M(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function A0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !je(r) && !pn(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && M(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), It.call(e.anchorMap, n) || M(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], ue(e, !0, -1), !0;
}
function Tn(e, t, n, r, i) {
  var o, a, s, l = 1, p = !1, c = !1, f, h, m, y, E, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = di === n || Lu === n, r && ue(e, !0, -1) && (p = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; v0(e) || _0(e); )
      ue(e, !0, -1) ? (p = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = p || i), (l === 1 || di === n) && (fi === n || Uu === n ? E = t : E = t + 1, A = e.position - e.lineStart, l === 1 ? s && (zs(e, A) || w0(e, A, E)) || E0(e, E) ? c = !0 : (a && y0(e, E) || m0(e, E) || g0(e, E) ? c = !0 : A0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && M(e, "alias node should not have any properties")) : p0(e, E, fi === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && zs(e, A))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && M(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (y = e.implicitTypes[f], y.resolve(e.result)) {
        e.result = y.construct(e.result), e.tag = y.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (It.call(e.typeMap[e.kind || "fallback"], e.tag))
      y = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (y = null, m = e.typeMap.multi[e.kind || "fallback"], f = 0, h = m.length; f < h; f += 1)
        if (e.tag.slice(0, m[f].tag.length) === m[f].tag) {
          y = m[f];
          break;
        }
    y || M(e, "unknown tag !<" + e.tag + ">"), e.result !== null && y.kind !== e.kind && M(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + y.kind + '", not "' + e.kind + '"'), y.resolve(e.result, e.tag) ? (e.result = y.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : M(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function S0(e) {
  var t = e.position, n, r, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (ue(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), n = e.position; a !== 0 && !je(a); )
      a = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && M(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Kt(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !lt(a));
        break;
      }
      if (lt(a)) break;
      for (n = e.position; a !== 0 && !je(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    a !== 0 && Ta(e), It.call(Vs, r) ? Vs[r](e, r, i) : hi(e, 'unknown document directive "' + r + '"');
  }
  if (ue(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ue(e, !0, -1)) : o && M(e, "directives end mark is expected"), Tn(e, e.lineIndent - 1, di, !1, !0), ue(e, !0, -1), e.checkLineBreaks && s0.test(e.input.slice(t, e.position)) && hi(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && $i(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ue(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    M(e, "end of the stream or a document separator is expected");
  else
    return;
}
function qu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new h0(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, M(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    S0(n);
  return n.documents;
}
function T0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = qu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function C0(e, t) {
  var n = qu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new xu("expected a single document in the stream, but found more");
  }
}
_a.loadAll = T0;
_a.load = C0;
var Wu = {}, bi = tt, vr = wr, $0 = Sa, Vu = Object.prototype.toString, Yu = Object.prototype.hasOwnProperty, $a = 65279, b0 = 9, nr = 10, I0 = 13, R0 = 32, O0 = 33, D0 = 34, Wo = 35, N0 = 37, P0 = 38, F0 = 39, x0 = 42, zu = 44, U0 = 45, pi = 58, L0 = 61, k0 = 62, M0 = 63, B0 = 64, Xu = 91, Ku = 93, j0 = 96, Ju = 123, H0 = 124, Qu = 125, be = {};
be[0] = "\\0";
be[7] = "\\a";
be[8] = "\\b";
be[9] = "\\t";
be[10] = "\\n";
be[11] = "\\v";
be[12] = "\\f";
be[13] = "\\r";
be[27] = "\\e";
be[34] = '\\"';
be[92] = "\\\\";
be[133] = "\\N";
be[160] = "\\_";
be[8232] = "\\L";
be[8233] = "\\P";
var G0 = [
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
], q0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function W0(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Yu.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function V0(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new vr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + bi.repeat("0", r - t.length) + t;
}
var Y0 = 1, rr = 2;
function z0(e) {
  this.schema = e.schema || $0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = bi.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = W0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? rr : Y0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Xs(e, t) {
  for (var n = bi.repeat(" ", t), r = 0, i = -1, o = "", a, s = e.length; r < s; )
    i = e.indexOf(`
`, r), i === -1 ? (a = e.slice(r), r = s) : (a = e.slice(r, i + 1), r = i + 1), a.length && a !== `
` && (o += n), o += a;
  return o;
}
function Vo(e, t) {
  return `
` + bi.repeat(" ", e.indent * t);
}
function X0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function mi(e) {
  return e === R0 || e === b0;
}
function ir(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== $a || 65536 <= e && e <= 1114111;
}
function Ks(e) {
  return ir(e) && e !== $a && e !== I0 && e !== nr;
}
function Js(e, t, n) {
  var r = Ks(e), i = r && !mi(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== zu && e !== Xu && e !== Ku && e !== Ju && e !== Qu) && e !== Wo && !(t === pi && !i) || Ks(t) && !mi(t) && e === Wo || t === pi && i
  );
}
function K0(e) {
  return ir(e) && e !== $a && !mi(e) && e !== U0 && e !== M0 && e !== pi && e !== zu && e !== Xu && e !== Ku && e !== Ju && e !== Qu && e !== Wo && e !== P0 && e !== x0 && e !== O0 && e !== H0 && e !== L0 && e !== k0 && e !== F0 && e !== D0 && e !== N0 && e !== B0 && e !== j0;
}
function J0(e) {
  return !mi(e) && e !== pi;
}
function qn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Zu(e) {
  var t = /^\n* /;
  return t.test(e);
}
var ef = 1, Yo = 2, tf = 3, nf = 4, dn = 5;
function Q0(e, t, n, r, i, o, a, s) {
  var l, p = 0, c = null, f = !1, h = !1, m = r !== -1, y = -1, E = K0(qn(e, 0)) && J0(qn(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = qn(e, l), !ir(p))
        return dn;
      E = E && Js(p, c, s), c = p;
    }
  else {
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = qn(e, l), p === nr)
        f = !0, m && (h = h || // Foldable line = too long, and not more-indented.
        l - y - 1 > r && e[y + 1] !== " ", y = l);
      else if (!ir(p))
        return dn;
      E = E && Js(p, c, s), c = p;
    }
    h = h || m && l - y - 1 > r && e[y + 1] !== " ";
  }
  return !f && !h ? E && !a && !i(e) ? ef : o === rr ? dn : Yo : n > 9 && Zu(e) ? dn : a ? o === rr ? dn : Yo : h ? nf : tf;
}
function Z0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === rr ? '""' : "''";
    if (!e.noCompatMode && (G0.indexOf(t) !== -1 || q0.test(t)))
      return e.quotingType === rr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(p) {
      return X0(e, p);
    }
    switch (Q0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case ef:
        return t;
      case Yo:
        return "'" + t.replace(/'/g, "''") + "'";
      case tf:
        return "|" + Qs(t, e.indent) + Zs(Xs(t, o));
      case nf:
        return ">" + Qs(t, e.indent) + Zs(Xs(eE(t, a), o));
      case dn:
        return '"' + tE(t) + '"';
      default:
        throw new vr("impossible error: invalid scalar style");
    }
  }();
}
function Qs(e, t) {
  var n = Zu(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Zs(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function eE(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var p = e.indexOf(`
`);
    return p = p !== -1 ? p : e.length, n.lastIndex = p, el(e.slice(0, p), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = n.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", r += s + (!i && !o && l !== "" ? `
` : "") + el(l, t), i = o;
  }
  return r;
}
function el(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, a = 0, s = 0, l = ""; r = n.exec(e); )
    s = r.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function tE(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = qn(e, i), r = be[n], !r && ir(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || V0(n);
  return t;
}
function nE(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (mt(e, t, s, !1, !1) || typeof s > "u" && mt(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function tl(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (mt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && mt(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Vo(e, t)), e.dump && nr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function rE(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, p, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], p = n[l], e.replacer && (p = e.replacer.call(n, l, p)), mt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), mt(e, t, p, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function iE(e, t, n, r) {
  var i = "", o = e.tag, a = Object.keys(n), s, l, p, c, f, h;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new vr("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    h = "", (!r || i !== "") && (h += Vo(e, t)), p = a[s], c = n[p], e.replacer && (c = e.replacer.call(n, p, c)), mt(e, t + 1, p, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && nr === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += Vo(e, t)), mt(e, t + 1, c, !0, f) && (e.dump && nr === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function nl(e, t, n) {
  var r, i, o, a, s, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, Vu.call(s.represent) === "[object Function]")
          r = s.represent(t, l);
        else if (Yu.call(s.represent, l))
          r = s.represent[l](t, l);
        else
          throw new vr("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function mt(e, t, n, r, i, o, a) {
  e.tag = null, e.dump = n, nl(e, n, !1) || nl(e, n, !0);
  var s = Vu.call(e.dump), l = r, p;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, h;
  if (c && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (iE(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (rE(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? tl(e, t - 1, e.dump, i) : tl(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (nE(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && Z0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new vr("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (p = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? p = "!" + p : p.slice(0, 18) === "tag:yaml.org,2002:" ? p = "!!" + p.slice(18) : p = "!<" + p + ">", e.dump = p + " " + e.dump);
  }
  return !0;
}
function oE(e, t) {
  var n = [], r = [], i, o;
  for (zo(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function zo(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        zo(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        zo(e[r[i]], t, n);
}
function aE(e, t) {
  t = t || {};
  var n = new z0(t);
  n.noRefs || oE(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), mt(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Wu.dump = aE;
var rf = _a, sE = Wu;
function ba(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ve.Type = Le;
ve.Schema = mu;
ve.FAILSAFE_SCHEMA = wu;
ve.JSON_SCHEMA = Cu;
ve.CORE_SCHEMA = $u;
ve.DEFAULT_SCHEMA = Sa;
ve.load = rf.load;
ve.loadAll = rf.loadAll;
ve.dump = sE.dump;
ve.YAMLException = wr;
ve.types = {
  binary: Du,
  float: Tu,
  map: yu,
  null: vu,
  pairs: Pu,
  set: Fu,
  timestamp: Ru,
  bool: _u,
  int: Au,
  merge: Ou,
  omap: Nu,
  seq: Eu,
  str: gu
};
ve.safeLoad = ba("safeLoad", "load");
ve.safeLoadAll = ba("safeLoadAll", "loadAll");
ve.safeDump = ba("safeDump", "dump");
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.Lazy = void 0;
class lE {
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
Ii.Lazy = lE;
var Xo = { exports: {} };
const cE = "2.0.0", of = 256, uE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, fE = 16, dE = of - 6, hE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ri = {
  MAX_LENGTH: of,
  MAX_SAFE_COMPONENT_LENGTH: fE,
  MAX_SAFE_BUILD_LENGTH: dE,
  MAX_SAFE_INTEGER: uE,
  RELEASE_TYPES: hE,
  SEMVER_SPEC_VERSION: cE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const pE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Oi = pE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = Ri, o = Oi;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], p = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], y = (A) => {
    for (const [C, T] of m)
      A = A.split(`${C}*`).join(`${C}{0,${T}}`).split(`${C}+`).join(`${C}{1,${T}}`);
    return A;
  }, E = (A, C, T) => {
    const N = y(C), U = f++;
    o(A, U, C), c[A] = U, l[U] = C, p[U] = N, a[U] = new RegExp(C, T ? "g" : void 0), s[U] = new RegExp(N, T ? "g" : void 0);
  };
  E("NUMERICIDENTIFIER", "0|[1-9]\\d*"), E("NUMERICIDENTIFIERLOOSE", "\\d+"), E("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), E("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), E("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), E("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), E("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), E("BUILDIDENTIFIER", `${h}+`), E("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), E("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), E("FULL", `^${l[c.FULLPLAIN]}$`), E("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), E("LOOSE", `^${l[c.LOOSEPLAIN]}$`), E("GTLT", "((?:<|>)?=?)"), E("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), E("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), E("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), E("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), E("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), E("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), E("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), E("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), E("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), E("COERCERTL", l[c.COERCE], !0), E("COERCERTLFULL", l[c.COERCEFULL], !0), E("LONETILDE", "(?:~>?)"), E("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", E("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), E("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), E("LONECARET", "(?:\\^)"), E("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", E("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), E("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), E("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), E("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), E("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", E("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), E("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), E("STAR", "(<|>)?=?\\s*\\*"), E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Xo, Xo.exports);
var _r = Xo.exports;
const mE = Object.freeze({ loose: !0 }), gE = Object.freeze({}), EE = (e) => e ? typeof e != "object" ? mE : e : gE;
var Ia = EE;
const rl = /^[0-9]+$/, af = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = rl.test(e), r = rl.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, yE = (e, t) => af(t, e);
var sf = {
  compareIdentifiers: af,
  rcompareIdentifiers: yE
};
const jr = Oi, { MAX_LENGTH: il, MAX_SAFE_INTEGER: Hr } = Ri, { safeRe: Gr, t: qr } = _r, wE = Ia, { compareIdentifiers: uo } = sf;
let vE = class at {
  constructor(t, n) {
    if (n = wE(n), t instanceof at) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > il)
      throw new TypeError(
        `version is longer than ${il} characters`
      );
    jr("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? Gr[qr.LOOSE] : Gr[qr.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > Hr || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Hr || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Hr || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Hr)
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
    if (jr("SemVer.compare", this.version, this.options, t), !(t instanceof at)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new at(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof at || (t = new at(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof at || (t = new at(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (jr("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return uo(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof at || (t = new at(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (jr("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return uo(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? Gr[qr.PRERELEASELOOSE] : Gr[qr.PRERELEASE]);
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
          r === !1 && (o = [n]), uo(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var ke = vE;
const ol = ke, _E = (e, t, n = !1) => {
  if (e instanceof ol)
    return e;
  try {
    return new ol(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var bn = _E;
const AE = bn, SE = (e, t) => {
  const n = AE(e, t);
  return n ? n.version : null;
};
var TE = SE;
const CE = bn, $E = (e, t) => {
  const n = CE(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var bE = $E;
const al = ke, IE = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new al(
      e instanceof al ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var RE = IE;
const sl = bn, OE = (e, t) => {
  const n = sl(e, null, !0), r = sl(t, null, !0), i = n.compare(r);
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
var DE = OE;
const NE = ke, PE = (e, t) => new NE(e, t).major;
var FE = PE;
const xE = ke, UE = (e, t) => new xE(e, t).minor;
var LE = UE;
const kE = ke, ME = (e, t) => new kE(e, t).patch;
var BE = ME;
const jE = bn, HE = (e, t) => {
  const n = jE(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var GE = HE;
const ll = ke, qE = (e, t, n) => new ll(e, n).compare(new ll(t, n));
var nt = qE;
const WE = nt, VE = (e, t, n) => WE(t, e, n);
var YE = VE;
const zE = nt, XE = (e, t) => zE(e, t, !0);
var KE = XE;
const cl = ke, JE = (e, t, n) => {
  const r = new cl(e, n), i = new cl(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var Ra = JE;
const QE = Ra, ZE = (e, t) => e.sort((n, r) => QE(n, r, t));
var ey = ZE;
const ty = Ra, ny = (e, t) => e.sort((n, r) => ty(r, n, t));
var ry = ny;
const iy = nt, oy = (e, t, n) => iy(e, t, n) > 0;
var Di = oy;
const ay = nt, sy = (e, t, n) => ay(e, t, n) < 0;
var Oa = sy;
const ly = nt, cy = (e, t, n) => ly(e, t, n) === 0;
var lf = cy;
const uy = nt, fy = (e, t, n) => uy(e, t, n) !== 0;
var cf = fy;
const dy = nt, hy = (e, t, n) => dy(e, t, n) >= 0;
var Da = hy;
const py = nt, my = (e, t, n) => py(e, t, n) <= 0;
var Na = my;
const gy = lf, Ey = cf, yy = Di, wy = Da, vy = Oa, _y = Na, Ay = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return gy(e, n, r);
    case "!=":
      return Ey(e, n, r);
    case ">":
      return yy(e, n, r);
    case ">=":
      return wy(e, n, r);
    case "<":
      return vy(e, n, r);
    case "<=":
      return _y(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var uf = Ay;
const Sy = ke, Ty = bn, { safeRe: Wr, t: Vr } = _r, Cy = (e, t) => {
  if (e instanceof Sy)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? Wr[Vr.COERCEFULL] : Wr[Vr.COERCE]);
  else {
    const l = t.includePrerelease ? Wr[Vr.COERCERTLFULL] : Wr[Vr.COERCERTL];
    let p;
    for (; (p = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || p.index + p[0].length !== n.index + n[0].length) && (n = p), l.lastIndex = p.index + p[1].length + p[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", a = t.includePrerelease && n[5] ? `-${n[5]}` : "", s = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return Ty(`${r}.${i}.${o}${a}${s}`, t);
};
var $y = Cy;
class by {
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
var Iy = by, fo, ul;
function rt() {
  if (ul) return fo;
  ul = 1;
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
        if (this.set = this.set.filter((F) => !E(F[0])), this.set.length === 0)
          this.set = [b];
        else if (this.set.length > 1) {
          for (const F of this.set)
            if (F.length === 1 && A(F[0])) {
              this.set = [F];
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
      const b = ((this.options.includePrerelease && m) | (this.options.loose && y)) + ":" + I, F = r.get(b);
      if (F)
        return F;
      const D = this.options.loose, B = D ? l[p.HYPHENRANGELOOSE] : l[p.HYPHENRANGE];
      I = I.replace(B, X(this.options.includePrerelease)), a("hyphen replace", I), I = I.replace(l[p.COMPARATORTRIM], c), a("comparator trim", I), I = I.replace(l[p.TILDETRIM], f), a("tilde trim", I), I = I.replace(l[p.CARETTRIM], h), a("caret trim", I);
      let Y = I.split(" ").map((j) => T(j, this.options)).join(" ").split(/\s+/).map((j) => H(j, this.options));
      D && (Y = Y.filter((j) => (a("loose invalid filter", j, this.options), !!j.match(l[p.COMPARATORLOOSE])))), a("range list", Y);
      const x = /* @__PURE__ */ new Map(), Z = Y.map((j) => new o(j, this.options));
      for (const j of Z) {
        if (E(j))
          return [j];
        x.set(j.value, j);
      }
      x.size > 1 && x.has("") && x.delete("");
      const de = [...x.values()];
      return r.set(b, de), de;
    }
    intersects(I, P) {
      if (!(I instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => C(b, P) && I.set.some((F) => C(F, P) && b.every((D) => F.every((B) => D.intersects(B, P)))));
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
  fo = t;
  const n = Iy, r = new n(), i = Ia, o = Ni(), a = Oi, s = ke, {
    safeRe: l,
    t: p,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = _r, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: y } = Ri, E = (O) => O.value === "<0.0.0-0", A = (O) => O.value === "", C = (O, I) => {
    let P = !0;
    const b = O.slice();
    let F = b.pop();
    for (; P && b.length; )
      P = b.every((D) => F.intersects(D, I)), F = b.pop();
    return P;
  }, T = (O, I) => (O = O.replace(l[p.BUILD], ""), a("comp", O, I), O = J(O, I), a("caret", O), O = U(O, I), a("tildes", O), O = W(O, I), a("xrange", O), O = w(O, I), a("stars", O), O), N = (O) => !O || O.toLowerCase() === "x" || O === "*", U = (O, I) => O.trim().split(/\s+/).map((P) => q(P, I)).join(" "), q = (O, I) => {
    const P = I.loose ? l[p.TILDELOOSE] : l[p.TILDE];
    return O.replace(P, (b, F, D, B, Y) => {
      a("tilde", O, b, F, D, B, Y);
      let x;
      return N(F) ? x = "" : N(D) ? x = `>=${F}.0.0 <${+F + 1}.0.0-0` : N(B) ? x = `>=${F}.${D}.0 <${F}.${+D + 1}.0-0` : Y ? (a("replaceTilde pr", Y), x = `>=${F}.${D}.${B}-${Y} <${F}.${+D + 1}.0-0`) : x = `>=${F}.${D}.${B} <${F}.${+D + 1}.0-0`, a("tilde return", x), x;
    });
  }, J = (O, I) => O.trim().split(/\s+/).map((P) => Q(P, I)).join(" "), Q = (O, I) => {
    a("caret", O, I);
    const P = I.loose ? l[p.CARETLOOSE] : l[p.CARET], b = I.includePrerelease ? "-0" : "";
    return O.replace(P, (F, D, B, Y, x) => {
      a("caret", O, F, D, B, Y, x);
      let Z;
      return N(D) ? Z = "" : N(B) ? Z = `>=${D}.0.0${b} <${+D + 1}.0.0-0` : N(Y) ? D === "0" ? Z = `>=${D}.${B}.0${b} <${D}.${+B + 1}.0-0` : Z = `>=${D}.${B}.0${b} <${+D + 1}.0.0-0` : x ? (a("replaceCaret pr", x), D === "0" ? B === "0" ? Z = `>=${D}.${B}.${Y}-${x} <${D}.${B}.${+Y + 1}-0` : Z = `>=${D}.${B}.${Y}-${x} <${D}.${+B + 1}.0-0` : Z = `>=${D}.${B}.${Y}-${x} <${+D + 1}.0.0-0`) : (a("no pr"), D === "0" ? B === "0" ? Z = `>=${D}.${B}.${Y}${b} <${D}.${B}.${+Y + 1}-0` : Z = `>=${D}.${B}.${Y}${b} <${D}.${+B + 1}.0-0` : Z = `>=${D}.${B}.${Y} <${+D + 1}.0.0-0`), a("caret return", Z), Z;
    });
  }, W = (O, I) => (a("replaceXRanges", O, I), O.split(/\s+/).map((P) => k(P, I)).join(" ")), k = (O, I) => {
    O = O.trim();
    const P = I.loose ? l[p.XRANGELOOSE] : l[p.XRANGE];
    return O.replace(P, (b, F, D, B, Y, x) => {
      a("xRange", O, b, F, D, B, Y, x);
      const Z = N(D), de = Z || N(B), j = de || N(Y), _e = j;
      return F === "=" && _e && (F = ""), x = I.includePrerelease ? "-0" : "", Z ? F === ">" || F === "<" ? b = "<0.0.0-0" : b = "*" : F && _e ? (de && (B = 0), Y = 0, F === ">" ? (F = ">=", de ? (D = +D + 1, B = 0, Y = 0) : (B = +B + 1, Y = 0)) : F === "<=" && (F = "<", de ? D = +D + 1 : B = +B + 1), F === "<" && (x = "-0"), b = `${F + D}.${B}.${Y}${x}`) : de ? b = `>=${D}.0.0${x} <${+D + 1}.0.0-0` : j && (b = `>=${D}.${B}.0${x} <${D}.${+B + 1}.0-0`), a("xRange return", b), b;
    });
  }, w = (O, I) => (a("replaceStars", O, I), O.trim().replace(l[p.STAR], "")), H = (O, I) => (a("replaceGTE0", O, I), O.trim().replace(l[I.includePrerelease ? p.GTE0PRE : p.GTE0], "")), X = (O) => (I, P, b, F, D, B, Y, x, Z, de, j, _e) => (N(b) ? P = "" : N(F) ? P = `>=${b}.0.0${O ? "-0" : ""}` : N(D) ? P = `>=${b}.${F}.0${O ? "-0" : ""}` : B ? P = `>=${P}` : P = `>=${P}${O ? "-0" : ""}`, N(Z) ? x = "" : N(de) ? x = `<${+Z + 1}.0.0-0` : N(j) ? x = `<${Z}.${+de + 1}.0-0` : _e ? x = `<=${Z}.${de}.${j}-${_e}` : O ? x = `<${Z}.${de}.${+j + 1}-0` : x = `<=${x}`, `${P} ${x}`.trim()), ne = (O, I, P) => {
    for (let b = 0; b < O.length; b++)
      if (!O[b].test(I))
        return !1;
    if (I.prerelease.length && !P.includePrerelease) {
      for (let b = 0; b < O.length; b++)
        if (a(O[b].semver), O[b].semver !== o.ANY && O[b].semver.prerelease.length > 0) {
          const F = O[b].semver;
          if (F.major === I.major && F.minor === I.minor && F.patch === I.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return fo;
}
var ho, fl;
function Ni() {
  if (fl) return ho;
  fl = 1;
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
  ho = t;
  const n = Ia, { safeRe: r, t: i } = _r, o = uf, a = Oi, s = ke, l = rt();
  return ho;
}
const Ry = rt(), Oy = (e, t, n) => {
  try {
    t = new Ry(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Pi = Oy;
const Dy = rt(), Ny = (e, t) => new Dy(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var Py = Ny;
const Fy = ke, xy = rt(), Uy = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new xy(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new Fy(r, n));
  }), r;
};
var Ly = Uy;
const ky = ke, My = rt(), By = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new My(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new ky(r, n));
  }), r;
};
var jy = By;
const po = ke, Hy = rt(), dl = Di, Gy = (e, t) => {
  e = new Hy(e, t);
  let n = new po("0.0.0");
  if (e.test(n) || (n = new po("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((a) => {
      const s = new po(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || dl(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!n || dl(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var qy = Gy;
const Wy = rt(), Vy = (e, t) => {
  try {
    return new Wy(e, t).range || "*";
  } catch {
    return null;
  }
};
var Yy = Vy;
const zy = ke, ff = Ni(), { ANY: Xy } = ff, Ky = rt(), Jy = Pi, hl = Di, pl = Oa, Qy = Na, Zy = Da, ew = (e, t, n, r) => {
  e = new zy(e, r), t = new Ky(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = hl, o = Qy, a = pl, s = ">", l = ">=";
      break;
    case "<":
      i = pl, o = Zy, a = hl, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Jy(e, t, r))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const c = t.set[p];
    let f = null, h = null;
    if (c.forEach((m) => {
      m.semver === Xy && (m = new ff(">=0.0.0")), f = f || m, h = h || m, i(m.semver, f.semver, r) ? f = m : a(m.semver, h.semver, r) && (h = m);
    }), f.operator === s || f.operator === l || (!h.operator || h.operator === s) && o(e, h.semver))
      return !1;
    if (h.operator === l && a(e, h.semver))
      return !1;
  }
  return !0;
};
var Pa = ew;
const tw = Pa, nw = (e, t, n) => tw(e, t, ">", n);
var rw = nw;
const iw = Pa, ow = (e, t, n) => iw(e, t, "<", n);
var aw = ow;
const ml = rt(), sw = (e, t, n) => (e = new ml(e, n), t = new ml(t, n), e.intersects(t, n));
var lw = sw;
const cw = Pi, uw = nt;
var fw = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((c, f) => uw(c, f, n));
  for (const c of a)
    cw(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [c, f] of r)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < p.length ? l : t;
};
const gl = rt(), Fa = Ni(), { ANY: mo } = Fa, kn = Pi, xa = nt, dw = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new gl(e, n), t = new gl(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = pw(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, hw = [new Fa(">=0.0.0-0")], El = [new Fa(">=0.0.0")], pw = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === mo) {
    if (t.length === 1 && t[0].semver === mo)
      return !0;
    n.includePrerelease ? e = hw : e = El;
  }
  if (t.length === 1 && t[0].semver === mo) {
    if (n.includePrerelease)
      return !0;
    t = El;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = yl(i, m, n) : m.operator === "<" || m.operator === "<=" ? o = wl(o, m, n) : r.add(m.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = xa(i.semver, o.semver, n), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const m of r) {
    if (i && !kn(m, String(i), n) || o && !kn(m, String(o), n))
      return null;
    for (const y of t)
      if (!kn(m, String(y), n))
        return !1;
    return !0;
  }
  let s, l, p, c, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (c = c || m.operator === ">" || m.operator === ">=", p = p || m.operator === "<" || m.operator === "<=", i) {
      if (h && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === h.major && m.semver.minor === h.minor && m.semver.patch === h.patch && (h = !1), m.operator === ">" || m.operator === ">=") {
        if (s = yl(i, m, n), s === m && s !== i)
          return !1;
      } else if (i.operator === ">=" && !kn(i.semver, String(m), n))
        return !1;
    }
    if (o) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (l = wl(o, m, n), l === m && l !== o)
          return !1;
      } else if (o.operator === "<=" && !kn(o.semver, String(m), n))
        return !1;
    }
    if (!m.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && p && !o && a !== 0 || o && c && !i && a !== 0 || h || f);
}, yl = (e, t, n) => {
  if (!e)
    return t;
  const r = xa(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, wl = (e, t, n) => {
  if (!e)
    return t;
  const r = xa(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var mw = dw;
const go = _r, vl = Ri, gw = ke, _l = sf, Ew = bn, yw = TE, ww = bE, vw = RE, _w = DE, Aw = FE, Sw = LE, Tw = BE, Cw = GE, $w = nt, bw = YE, Iw = KE, Rw = Ra, Ow = ey, Dw = ry, Nw = Di, Pw = Oa, Fw = lf, xw = cf, Uw = Da, Lw = Na, kw = uf, Mw = $y, Bw = Ni(), jw = rt(), Hw = Pi, Gw = Py, qw = Ly, Ww = jy, Vw = qy, Yw = Yy, zw = Pa, Xw = rw, Kw = aw, Jw = lw, Qw = fw, Zw = mw;
var df = {
  parse: Ew,
  valid: yw,
  clean: ww,
  inc: vw,
  diff: _w,
  major: Aw,
  minor: Sw,
  patch: Tw,
  prerelease: Cw,
  compare: $w,
  rcompare: bw,
  compareLoose: Iw,
  compareBuild: Rw,
  sort: Ow,
  rsort: Dw,
  gt: Nw,
  lt: Pw,
  eq: Fw,
  neq: xw,
  gte: Uw,
  lte: Lw,
  cmp: kw,
  coerce: Mw,
  Comparator: Bw,
  Range: jw,
  satisfies: Hw,
  toComparators: Gw,
  maxSatisfying: qw,
  minSatisfying: Ww,
  minVersion: Vw,
  validRange: Yw,
  outside: zw,
  gtr: Xw,
  ltr: Kw,
  intersects: Jw,
  simplifyRange: Qw,
  subset: Zw,
  SemVer: gw,
  re: go.re,
  src: go.src,
  tokens: go.t,
  SEMVER_SPEC_VERSION: vl.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: vl.RELEASE_TYPES,
  compareIdentifiers: _l.compareIdentifiers,
  rcompareIdentifiers: _l.rcompareIdentifiers
}, Ar = {}, gi = { exports: {} };
gi.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", p = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", h = "[object Error]", m = "[object Function]", y = "[object GeneratorFunction]", E = "[object Map]", A = "[object Number]", C = "[object Null]", T = "[object Object]", N = "[object Promise]", U = "[object Proxy]", q = "[object RegExp]", J = "[object Set]", Q = "[object String]", W = "[object Symbol]", k = "[object Undefined]", w = "[object WeakMap]", H = "[object ArrayBuffer]", X = "[object DataView]", ne = "[object Float32Array]", O = "[object Float64Array]", I = "[object Int8Array]", P = "[object Int16Array]", b = "[object Int32Array]", F = "[object Uint8Array]", D = "[object Uint8ClampedArray]", B = "[object Uint16Array]", Y = "[object Uint32Array]", x = /[\\^$.*+?()[\]{}|]/g, Z = /^\[object .+?Constructor\]$/, de = /^(?:0|[1-9]\d*)$/, j = {};
  j[ne] = j[O] = j[I] = j[P] = j[b] = j[F] = j[D] = j[B] = j[Y] = !0, j[s] = j[l] = j[H] = j[c] = j[X] = j[f] = j[h] = j[m] = j[E] = j[A] = j[T] = j[q] = j[J] = j[Q] = j[w] = !1;
  var _e = typeof Ne == "object" && Ne && Ne.Object === Object && Ne, On = typeof self == "object" && self && self.Object === Object && self, Ye = _e || On || Function("return this")(), Dn = t && !t.nodeType && t, on = Dn && !0 && e && !e.nodeType && e, $r = on && on.exports === Dn, d = $r && _e.process, u = function() {
    try {
      return d && d.binding && d.binding("util");
    } catch {
    }
  }(), S = u && u.isTypedArray;
  function v(g, _) {
    for (var $ = -1, L = g == null ? 0 : g.length, te = 0, G = []; ++$ < L; ) {
      var se = g[$];
      _(se, $, g) && (G[te++] = se);
    }
    return G;
  }
  function K(g, _) {
    for (var $ = -1, L = _.length, te = g.length; ++$ < L; )
      g[te + $] = _[$];
    return g;
  }
  function re(g, _) {
    for (var $ = -1, L = g == null ? 0 : g.length; ++$ < L; )
      if (_(g[$], $, g))
        return !0;
    return !1;
  }
  function le(g, _) {
    for (var $ = -1, L = Array(g); ++$ < g; )
      L[$] = _($);
    return L;
  }
  function Ae(g) {
    return function(_) {
      return g(_);
    };
  }
  function Se(g, _) {
    return g.has(_);
  }
  function ze(g, _) {
    return g == null ? void 0 : g[_];
  }
  function he(g) {
    var _ = -1, $ = Array(g.size);
    return g.forEach(function(L, te) {
      $[++_] = [te, L];
    }), $;
  }
  function Xe(g, _) {
    return function($) {
      return g(_($));
    };
  }
  function qi(g) {
    var _ = -1, $ = Array(g.size);
    return g.forEach(function(L) {
      $[++_] = L;
    }), $;
  }
  var br = Array.prototype, Nn = Function.prototype, xt = Object.prototype, Wi = Ye["__core-js_shared__"], Wa = Nn.toString, ot = xt.hasOwnProperty, Va = function() {
    var g = /[^.]+$/.exec(Wi && Wi.keys && Wi.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Ya = xt.toString, Nf = RegExp(
    "^" + Wa.call(ot).replace(x, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), za = $r ? Ye.Buffer : void 0, Ir = Ye.Symbol, Xa = Ye.Uint8Array, Ka = xt.propertyIsEnumerable, Pf = br.splice, Ut = Ir ? Ir.toStringTag : void 0, Ja = Object.getOwnPropertySymbols, Ff = za ? za.isBuffer : void 0, xf = Xe(Object.keys, Object), Vi = an(Ye, "DataView"), Pn = an(Ye, "Map"), Yi = an(Ye, "Promise"), zi = an(Ye, "Set"), Xi = an(Ye, "WeakMap"), Fn = an(Object, "create"), Uf = Mt(Vi), Lf = Mt(Pn), kf = Mt(Yi), Mf = Mt(zi), Bf = Mt(Xi), Qa = Ir ? Ir.prototype : void 0, Ki = Qa ? Qa.valueOf : void 0;
  function Lt(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var L = g[_];
      this.set(L[0], L[1]);
    }
  }
  function jf() {
    this.__data__ = Fn ? Fn(null) : {}, this.size = 0;
  }
  function Hf(g) {
    var _ = this.has(g) && delete this.__data__[g];
    return this.size -= _ ? 1 : 0, _;
  }
  function Gf(g) {
    var _ = this.__data__;
    if (Fn) {
      var $ = _[g];
      return $ === r ? void 0 : $;
    }
    return ot.call(_, g) ? _[g] : void 0;
  }
  function qf(g) {
    var _ = this.__data__;
    return Fn ? _[g] !== void 0 : ot.call(_, g);
  }
  function Wf(g, _) {
    var $ = this.__data__;
    return this.size += this.has(g) ? 0 : 1, $[g] = Fn && _ === void 0 ? r : _, this;
  }
  Lt.prototype.clear = jf, Lt.prototype.delete = Hf, Lt.prototype.get = Gf, Lt.prototype.has = qf, Lt.prototype.set = Wf;
  function ut(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var L = g[_];
      this.set(L[0], L[1]);
    }
  }
  function Vf() {
    this.__data__ = [], this.size = 0;
  }
  function Yf(g) {
    var _ = this.__data__, $ = Or(_, g);
    if ($ < 0)
      return !1;
    var L = _.length - 1;
    return $ == L ? _.pop() : Pf.call(_, $, 1), --this.size, !0;
  }
  function zf(g) {
    var _ = this.__data__, $ = Or(_, g);
    return $ < 0 ? void 0 : _[$][1];
  }
  function Xf(g) {
    return Or(this.__data__, g) > -1;
  }
  function Kf(g, _) {
    var $ = this.__data__, L = Or($, g);
    return L < 0 ? (++this.size, $.push([g, _])) : $[L][1] = _, this;
  }
  ut.prototype.clear = Vf, ut.prototype.delete = Yf, ut.prototype.get = zf, ut.prototype.has = Xf, ut.prototype.set = Kf;
  function kt(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.clear(); ++_ < $; ) {
      var L = g[_];
      this.set(L[0], L[1]);
    }
  }
  function Jf() {
    this.size = 0, this.__data__ = {
      hash: new Lt(),
      map: new (Pn || ut)(),
      string: new Lt()
    };
  }
  function Qf(g) {
    var _ = Dr(this, g).delete(g);
    return this.size -= _ ? 1 : 0, _;
  }
  function Zf(g) {
    return Dr(this, g).get(g);
  }
  function ed(g) {
    return Dr(this, g).has(g);
  }
  function td(g, _) {
    var $ = Dr(this, g), L = $.size;
    return $.set(g, _), this.size += $.size == L ? 0 : 1, this;
  }
  kt.prototype.clear = Jf, kt.prototype.delete = Qf, kt.prototype.get = Zf, kt.prototype.has = ed, kt.prototype.set = td;
  function Rr(g) {
    var _ = -1, $ = g == null ? 0 : g.length;
    for (this.__data__ = new kt(); ++_ < $; )
      this.add(g[_]);
  }
  function nd(g) {
    return this.__data__.set(g, r), this;
  }
  function rd(g) {
    return this.__data__.has(g);
  }
  Rr.prototype.add = Rr.prototype.push = nd, Rr.prototype.has = rd;
  function gt(g) {
    var _ = this.__data__ = new ut(g);
    this.size = _.size;
  }
  function id() {
    this.__data__ = new ut(), this.size = 0;
  }
  function od(g) {
    var _ = this.__data__, $ = _.delete(g);
    return this.size = _.size, $;
  }
  function ad(g) {
    return this.__data__.get(g);
  }
  function sd(g) {
    return this.__data__.has(g);
  }
  function ld(g, _) {
    var $ = this.__data__;
    if ($ instanceof ut) {
      var L = $.__data__;
      if (!Pn || L.length < n - 1)
        return L.push([g, _]), this.size = ++$.size, this;
      $ = this.__data__ = new kt(L);
    }
    return $.set(g, _), this.size = $.size, this;
  }
  gt.prototype.clear = id, gt.prototype.delete = od, gt.prototype.get = ad, gt.prototype.has = sd, gt.prototype.set = ld;
  function cd(g, _) {
    var $ = Nr(g), L = !$ && Td(g), te = !$ && !L && Ji(g), G = !$ && !L && !te && ss(g), se = $ || L || te || G, ge = se ? le(g.length, String) : [], ye = ge.length;
    for (var ie in g)
      ot.call(g, ie) && !(se && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      te && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      G && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      wd(ie, ye))) && ge.push(ie);
    return ge;
  }
  function Or(g, _) {
    for (var $ = g.length; $--; )
      if (rs(g[$][0], _))
        return $;
    return -1;
  }
  function ud(g, _, $) {
    var L = _(g);
    return Nr(g) ? L : K(L, $(g));
  }
  function xn(g) {
    return g == null ? g === void 0 ? k : C : Ut && Ut in Object(g) ? Ed(g) : Sd(g);
  }
  function Za(g) {
    return Un(g) && xn(g) == s;
  }
  function es(g, _, $, L, te) {
    return g === _ ? !0 : g == null || _ == null || !Un(g) && !Un(_) ? g !== g && _ !== _ : fd(g, _, $, L, es, te);
  }
  function fd(g, _, $, L, te, G) {
    var se = Nr(g), ge = Nr(_), ye = se ? l : Et(g), ie = ge ? l : Et(_);
    ye = ye == s ? T : ye, ie = ie == s ? T : ie;
    var Ge = ye == T, Ke = ie == T, Te = ye == ie;
    if (Te && Ji(g)) {
      if (!Ji(_))
        return !1;
      se = !0, Ge = !1;
    }
    if (Te && !Ge)
      return G || (G = new gt()), se || ss(g) ? ts(g, _, $, L, te, G) : md(g, _, ye, $, L, te, G);
    if (!($ & i)) {
      var qe = Ge && ot.call(g, "__wrapped__"), We = Ke && ot.call(_, "__wrapped__");
      if (qe || We) {
        var yt = qe ? g.value() : g, ft = We ? _.value() : _;
        return G || (G = new gt()), te(yt, ft, $, L, G);
      }
    }
    return Te ? (G || (G = new gt()), gd(g, _, $, L, te, G)) : !1;
  }
  function dd(g) {
    if (!as(g) || _d(g))
      return !1;
    var _ = is(g) ? Nf : Z;
    return _.test(Mt(g));
  }
  function hd(g) {
    return Un(g) && os(g.length) && !!j[xn(g)];
  }
  function pd(g) {
    if (!Ad(g))
      return xf(g);
    var _ = [];
    for (var $ in Object(g))
      ot.call(g, $) && $ != "constructor" && _.push($);
    return _;
  }
  function ts(g, _, $, L, te, G) {
    var se = $ & i, ge = g.length, ye = _.length;
    if (ge != ye && !(se && ye > ge))
      return !1;
    var ie = G.get(g);
    if (ie && G.get(_))
      return ie == _;
    var Ge = -1, Ke = !0, Te = $ & o ? new Rr() : void 0;
    for (G.set(g, _), G.set(_, g); ++Ge < ge; ) {
      var qe = g[Ge], We = _[Ge];
      if (L)
        var yt = se ? L(We, qe, Ge, _, g, G) : L(qe, We, Ge, g, _, G);
      if (yt !== void 0) {
        if (yt)
          continue;
        Ke = !1;
        break;
      }
      if (Te) {
        if (!re(_, function(ft, Bt) {
          if (!Se(Te, Bt) && (qe === ft || te(qe, ft, $, L, G)))
            return Te.push(Bt);
        })) {
          Ke = !1;
          break;
        }
      } else if (!(qe === We || te(qe, We, $, L, G))) {
        Ke = !1;
        break;
      }
    }
    return G.delete(g), G.delete(_), Ke;
  }
  function md(g, _, $, L, te, G, se) {
    switch ($) {
      case X:
        if (g.byteLength != _.byteLength || g.byteOffset != _.byteOffset)
          return !1;
        g = g.buffer, _ = _.buffer;
      case H:
        return !(g.byteLength != _.byteLength || !G(new Xa(g), new Xa(_)));
      case c:
      case f:
      case A:
        return rs(+g, +_);
      case h:
        return g.name == _.name && g.message == _.message;
      case q:
      case Q:
        return g == _ + "";
      case E:
        var ge = he;
      case J:
        var ye = L & i;
        if (ge || (ge = qi), g.size != _.size && !ye)
          return !1;
        var ie = se.get(g);
        if (ie)
          return ie == _;
        L |= o, se.set(g, _);
        var Ge = ts(ge(g), ge(_), L, te, G, se);
        return se.delete(g), Ge;
      case W:
        if (Ki)
          return Ki.call(g) == Ki.call(_);
    }
    return !1;
  }
  function gd(g, _, $, L, te, G) {
    var se = $ & i, ge = ns(g), ye = ge.length, ie = ns(_), Ge = ie.length;
    if (ye != Ge && !se)
      return !1;
    for (var Ke = ye; Ke--; ) {
      var Te = ge[Ke];
      if (!(se ? Te in _ : ot.call(_, Te)))
        return !1;
    }
    var qe = G.get(g);
    if (qe && G.get(_))
      return qe == _;
    var We = !0;
    G.set(g, _), G.set(_, g);
    for (var yt = se; ++Ke < ye; ) {
      Te = ge[Ke];
      var ft = g[Te], Bt = _[Te];
      if (L)
        var ls = se ? L(Bt, ft, Te, _, g, G) : L(ft, Bt, Te, g, _, G);
      if (!(ls === void 0 ? ft === Bt || te(ft, Bt, $, L, G) : ls)) {
        We = !1;
        break;
      }
      yt || (yt = Te == "constructor");
    }
    if (We && !yt) {
      var Pr = g.constructor, Fr = _.constructor;
      Pr != Fr && "constructor" in g && "constructor" in _ && !(typeof Pr == "function" && Pr instanceof Pr && typeof Fr == "function" && Fr instanceof Fr) && (We = !1);
    }
    return G.delete(g), G.delete(_), We;
  }
  function ns(g) {
    return ud(g, bd, yd);
  }
  function Dr(g, _) {
    var $ = g.__data__;
    return vd(_) ? $[typeof _ == "string" ? "string" : "hash"] : $.map;
  }
  function an(g, _) {
    var $ = ze(g, _);
    return dd($) ? $ : void 0;
  }
  function Ed(g) {
    var _ = ot.call(g, Ut), $ = g[Ut];
    try {
      g[Ut] = void 0;
      var L = !0;
    } catch {
    }
    var te = Ya.call(g);
    return L && (_ ? g[Ut] = $ : delete g[Ut]), te;
  }
  var yd = Ja ? function(g) {
    return g == null ? [] : (g = Object(g), v(Ja(g), function(_) {
      return Ka.call(g, _);
    }));
  } : Id, Et = xn;
  (Vi && Et(new Vi(new ArrayBuffer(1))) != X || Pn && Et(new Pn()) != E || Yi && Et(Yi.resolve()) != N || zi && Et(new zi()) != J || Xi && Et(new Xi()) != w) && (Et = function(g) {
    var _ = xn(g), $ = _ == T ? g.constructor : void 0, L = $ ? Mt($) : "";
    if (L)
      switch (L) {
        case Uf:
          return X;
        case Lf:
          return E;
        case kf:
          return N;
        case Mf:
          return J;
        case Bf:
          return w;
      }
    return _;
  });
  function wd(g, _) {
    return _ = _ ?? a, !!_ && (typeof g == "number" || de.test(g)) && g > -1 && g % 1 == 0 && g < _;
  }
  function vd(g) {
    var _ = typeof g;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? g !== "__proto__" : g === null;
  }
  function _d(g) {
    return !!Va && Va in g;
  }
  function Ad(g) {
    var _ = g && g.constructor, $ = typeof _ == "function" && _.prototype || xt;
    return g === $;
  }
  function Sd(g) {
    return Ya.call(g);
  }
  function Mt(g) {
    if (g != null) {
      try {
        return Wa.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function rs(g, _) {
    return g === _ || g !== g && _ !== _;
  }
  var Td = Za(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Za : function(g) {
    return Un(g) && ot.call(g, "callee") && !Ka.call(g, "callee");
  }, Nr = Array.isArray;
  function Cd(g) {
    return g != null && os(g.length) && !is(g);
  }
  var Ji = Ff || Rd;
  function $d(g, _) {
    return es(g, _);
  }
  function is(g) {
    if (!as(g))
      return !1;
    var _ = xn(g);
    return _ == m || _ == y || _ == p || _ == U;
  }
  function os(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= a;
  }
  function as(g) {
    var _ = typeof g;
    return g != null && (_ == "object" || _ == "function");
  }
  function Un(g) {
    return g != null && typeof g == "object";
  }
  var ss = S ? Ae(S) : hd;
  function bd(g) {
    return Cd(g) ? cd(g) : pd(g);
  }
  function Id() {
    return [];
  }
  function Rd() {
    return !1;
  }
  e.exports = $d;
})(gi, gi.exports);
var ev = gi.exports;
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.DownloadedUpdateHelper = void 0;
Ar.createTempUpdateFile = ov;
const tv = pr, nv = Dt, Al = ev, Gt = Pt, Xn = ae;
class rv {
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
    return Xn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Al(this.versionInfo, n) && Al(this.fileInfo.info, r.info) && await (0, Gt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, a) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Gt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Gt.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, Gt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Gt.readJson)(r);
    } catch (p) {
      let c = "No cached update info available";
      return p.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${p.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Xn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Gt.pathExists)(s))
      return n.info("Cached update file doesn't exist"), null;
    const l = await iv(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Xn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Ar.DownloadedUpdateHelper = rv;
function iv(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, tv.createHash)(t);
    a.on("error", o).setEncoding(n), (0, nv.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function ov(e, t, n) {
  let r = 0, i = Xn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Gt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${a}`), i = Xn.join(t, `${r++}-${e}`);
    }
  return i;
}
var Fi = {}, Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
Ua.getAppCacheDir = sv;
const Eo = ae, av = vi;
function sv() {
  const e = (0, av.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Eo.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Eo.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Eo.join(e, ".cache"), t;
}
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.ElectronAppAdapter = void 0;
const Sl = ae, lv = Ua;
class cv {
  constructor(t = Jt.app) {
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
    return this.isPackaged ? Sl.join(process.resourcesPath, "app-update.yml") : Sl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, lv.getAppCacheDir)();
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
Fi.ElectronAppAdapter = cv;
var hf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = me;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Jt.session.fromPartition(e.NET_SESSION_NAME, {
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
      const s = Jt.net.request({
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
})(hf);
var Sr = {}, it = {};
Object.defineProperty(it, "__esModule", { value: !0 });
it.newBaseUrl = uv;
it.newUrlFromBase = fv;
it.getChannelFilename = dv;
const pf = Nt;
function uv(e) {
  const t = new pf.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function fv(e, t, n = !1) {
  const r = new pf.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function dv(e) {
  return `${e}.yml`;
}
var fe = {}, hv = "[object Symbol]", mf = /[\\^$.*+?()[\]{}|]/g, pv = RegExp(mf.source), mv = typeof Ne == "object" && Ne && Ne.Object === Object && Ne, gv = typeof self == "object" && self && self.Object === Object && self, Ev = mv || gv || Function("return this")(), yv = Object.prototype, wv = yv.toString, Tl = Ev.Symbol, Cl = Tl ? Tl.prototype : void 0, $l = Cl ? Cl.toString : void 0;
function vv(e) {
  if (typeof e == "string")
    return e;
  if (Av(e))
    return $l ? $l.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function _v(e) {
  return !!e && typeof e == "object";
}
function Av(e) {
  return typeof e == "symbol" || _v(e) && wv.call(e) == hv;
}
function Sv(e) {
  return e == null ? "" : vv(e);
}
function Tv(e) {
  return e = Sv(e), e && pv.test(e) ? e.replace(mf, "\\$&") : e;
}
var gf = Tv;
Object.defineProperty(fe, "__esModule", { value: !0 });
fe.Provider = void 0;
fe.findFile = Rv;
fe.parseUpdateInfo = Ov;
fe.getFileList = Ef;
fe.resolveFiles = Dv;
const Rt = me, Cv = ve, $v = Nt, Ei = it, bv = gf;
class Iv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, Ei.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, Ei.newUrlFromBase)(`${t.pathname.replace(new RegExp(bv(r), "g"), n)}.blockmap`, i ? new $v.URL(i) : t), o];
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
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, Rt.configureRequestUrl)(t, r), r;
  }
}
fe.Provider = Iv;
function Rv(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, Rt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((a) => !n.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function Ov(e, t, n) {
  if (e == null)
    throw (0, Rt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, Cv.load)(e);
  } catch (i) {
    throw (0, Rt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Ef(e) {
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
  throw (0, Rt.newError)(`No files provided: ${(0, Rt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Dv(e, t, n = (r) => r) {
  const i = Ef(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, Rt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Rt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Ei.newUrlFromBase)(n(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, Ei.newUrlFromBase)(n(a.path), t).href
  }), i;
}
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.GenericProvider = void 0;
const bl = me, yo = it, wo = fe;
class Nv extends wo.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, yo.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, yo.getChannelFilename)(this.channel), n = (0, yo.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, wo.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof bl.HttpError && i.statusCode === 404)
          throw (0, bl.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, wo.resolveFiles)(t, this.baseUrl);
  }
}
Sr.GenericProvider = Nv;
var xi = {}, Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.BitbucketProvider = void 0;
const Il = me, vo = it, _o = fe;
class Pv extends _o.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, vo.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Il.CancellationToken(), n = (0, vo.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, vo.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, _o.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Il.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, _o.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
Ui.BitbucketProvider = Pv;
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: !0 });
Ot.GitHubProvider = Ot.BaseGitHubProvider = void 0;
Ot.computeReleaseNotes = wf;
const pt = me, Vt = df, Fv = Nt, gn = it, Ko = fe, Ao = /\/tag\/([^/]+)$/;
class yf extends Ko.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, gn.newBaseUrl)((0, pt.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, gn.newBaseUrl)((0, pt.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
Ot.BaseGitHubProvider = yf;
class xv extends yf {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const a = new pt.CancellationToken(), s = await this.httpRequest((0, gn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, pt.parseXml)(s);
    let p = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Vt.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (A === null)
          c = Ao.exec(p.element("link").attribute("href"))[1];
        else
          for (const C of l.getElements("entry")) {
            const T = Ao.exec(C.element("link").attribute("href"));
            if (T === null)
              continue;
            const N = T[1], U = ((r = Vt.prerelease(N)) === null || r === void 0 ? void 0 : r[0]) || null, q = !A || ["alpha", "beta"].includes(A), J = U !== null && !["alpha", "beta"].includes(String(U));
            if (q && !J && !(A === "beta" && U === "alpha")) {
              c = N;
              break;
            }
            if (U && U === A) {
              c = N;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const A of l.getElements("entry"))
          if (Ao.exec(A.element("link").attribute("href"))[1] === c) {
            p = A;
            break;
          }
      }
    } catch (A) {
      throw (0, pt.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, pt.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", m = "";
    const y = async (A) => {
      h = (0, gn.getChannelFilename)(A), m = (0, gn.newUrlFromBase)(this.getBaseDownloadPath(String(c), h), this.baseUrl);
      const C = this.createRequestOptions(m);
      try {
        return await this.executor.request(C, a);
      } catch (T) {
        throw T instanceof pt.HttpError && T.statusCode === 404 ? (0, pt.newError)(`Cannot find ${h} in the latest release artifacts (${m}): ${T.stack || T.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : T;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = Vt.prerelease(c)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((o = Vt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await y(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        f = await y(this.getDefaultChannelName());
      else
        throw A;
    }
    const E = (0, Ko.parseUpdateInfo)(f, h, m);
    return E.releaseName == null && (E.releaseName = p.elementValueOrEmpty("title")), E.releaseNotes == null && (E.releaseNotes = wf(this.updater.currentVersion, this.updater.fullChangelog, l, p)), {
      tag: c,
      ...E
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, gn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Fv.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, pt.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Ko.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
Ot.GitHubProvider = xv;
function Rl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function wf(e, t, n, r) {
  if (!t)
    return Rl(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Vt.valid(a) && Vt.lt(e, a) && i.push({
      version: a,
      note: Rl(o)
    });
  }
  return i.sort((o, a) => Vt.rcompare(o.version, a.version));
}
var Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.GitLabProvider = void 0;
const Ie = me, So = Nt, Uv = gf, Yr = it, To = fe;
class Lv extends To.Provider {
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
    this.baseApiUrl = (0, Yr.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new Ie.CancellationToken(), n = (0, Yr.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let r;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, m = await this.httpRequest(n, h, t);
      if (!m)
        throw (0, Ie.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      r = JSON.parse(m);
    } catch (h) {
      throw (0, Ie.newError)(`Unable to find latest release on GitLab (${n}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = r.tag_name;
    let o = null, a = "", s = null;
    const l = async (h) => {
      a = (0, Yr.getChannelFilename)(h);
      const m = r.assets.links.find((E) => E.name === a);
      if (!m)
        throw (0, Ie.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new So.URL(m.direct_asset_url);
      const y = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const E = await this.httpRequest(s, y, t);
        if (!E)
          throw (0, Ie.newError)(`Empty response from ${s}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return E;
      } catch (E) {
        throw E instanceof Ie.HttpError && E.statusCode === 404 ? (0, Ie.newError)(`Cannot find ${a} in the latest release artifacts (${s}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
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
      throw (0, Ie.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const p = (0, To.parseUpdateInfo)(o, a, s);
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
        return new So.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const n = new Ie.CancellationToken(), r = [`v${t}`, t];
    for (const i of r) {
      const o = (0, Yr.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, s = await this.httpRequest(o, a, n);
        if (s)
          return JSON.parse(s);
      } catch (a) {
        if (a instanceof Ie.HttpError && a.statusCode === 404)
          continue;
        throw (0, Ie.newError)(`Unable to find release ${i} on GitLab (${o}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, Ie.newError)(`Unable to find release with version ${t} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
      const l = r.replace(new RegExp(Uv(n), "g"), t);
      o = this.findBlockMapInAssets(s, l);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, n, r, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [a, s] = await this.findBlockMapUrlsFromAssets(n, r, o);
      if (!s)
        throw (0, Ie.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, Ie.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, s];
    } else
      return super.getBlockMapFiles(t, n, r, i);
  }
  resolveFiles(t) {
    return (0, To.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, Ie.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new So.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Li.GitLabProvider = Lv;
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.KeygenProvider = void 0;
const Ol = me, Co = it, $o = fe;
class kv extends $o.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Co.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Ol.CancellationToken(), n = (0, Co.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Co.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, $o.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Ol.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, $o.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
ki.KeygenProvider = kv;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.PrivateGitHubProvider = void 0;
const cn = me, Mv = ve, Bv = ae, Dl = Nt, Nl = it, jv = Ot, Hv = fe;
class Gv extends jv.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new cn.CancellationToken(), n = (0, Nl.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, cn.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Dl.URL(i.url);
    let a;
    try {
      a = (0, Mv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof cn.HttpError && s.statusCode === 404 ? (0, cn.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
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
    const i = (0, Nl.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, cn.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Hv.getFileList)(t).map((n) => {
      const r = Bv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, cn.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Dl.URL(i.url),
        info: n
      };
    });
  }
}
Mi.PrivateGitHubProvider = Gv;
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.isUrlProbablySupportMultiRangeRequests = vf;
xi.createClient = Xv;
const zr = me, qv = Ui, Pl = Sr, Wv = Ot, Vv = Li, Yv = ki, zv = Mi;
function vf(e) {
  return !e.includes("s3.amazonaws.com");
}
function Xv(e, t, n) {
  if (typeof e == "string")
    throw (0, zr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Wv.GitHubProvider(i, t, n) : new zv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new qv.BitbucketProvider(e, t, n);
    case "gitlab":
      return new Vv.GitLabProvider(e, t, n);
    case "keygen":
      return new Yv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Pl.GenericProvider({
        provider: "generic",
        url: (0, zr.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Pl.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && vf(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, zr.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, zr.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Bi = {}, Tr = {}, In = {}, rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.OperationKind = void 0;
rn.computeOperations = Kv;
var Yt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Yt || (rn.OperationKind = Yt = {}));
function Kv(e, t, n) {
  const r = xl(e.files), i = xl(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, p = r.get(l);
  if (p == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: m } = Qv(r.get(l), p.offset, n);
  let y = a.offset;
  for (let E = 0; E < c.checksums.length; y += c.sizes[E], E++) {
    const A = c.sizes[E], C = c.checksums[E];
    let T = h.get(C);
    T != null && m.get(C) !== A && (n.warn(`Checksum ("${C}") matches, but size differs (old: ${m.get(C)}, new: ${A})`), T = void 0), T === void 0 ? (f++, o != null && o.kind === Yt.DOWNLOAD && o.end === y ? o.end += A : (o = {
      kind: Yt.DOWNLOAD,
      start: y,
      end: y + A
      // oldBlocks: null,
    }, Fl(o, s, C, E))) : o != null && o.kind === Yt.COPY && o.end === T ? o.end += A : (o = {
      kind: Yt.COPY,
      start: T,
      end: T + A
      // oldBlocks: [checksum]
    }, Fl(o, s, C, E));
  }
  return f > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Jv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Fl(e, t, n, r) {
  if (Jv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Yt[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function Qv(e, t, n) {
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
function xl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(In, "__esModule", { value: !0 });
In.DataSplitter = void 0;
In.copyData = _f;
const Xr = me, Zv = Dt, e_ = hr, t_ = rn, Ul = Buffer.from(`\r
\r
`);
var vt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(vt || (vt = {}));
function _f(e, t, n, r, i) {
  const o = (0, Zv.createReadStream)("", {
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
class n_ extends e_.Writable {
  constructor(t, n, r, i, o, a, s, l) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = l, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = vt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, Xr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === vt.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = vt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === vt.BODY)
          this.readState = vt.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Xr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Xr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = vt.HEADER;
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
        if (a.kind !== t_.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        _f(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Ul, n);
    if (r !== -1)
      return r + Ul.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Xr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
In.DataSplitter = n_;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.executeTasksUsingMultipleRangeRequests = r_;
ji.checkIsRangesSupported = Qo;
const Jo = me, Ll = In, kl = rn;
function r_(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    i_(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function i_(e, t, n, r, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), p = [];
  for (let h = t.start; h < t.end; h++) {
    const m = t.tasks[h];
    m.kind === kl.OperationKind.DOWNLOAD && (o += `${m.start}-${m.end - 1}, `, l.set(a, h), a++, p.push(m.end - m.start), s += m.end - m.start);
  }
  if (a <= 1) {
    const h = (m) => {
      if (m >= t.end) {
        r();
        return;
      }
      const y = t.tasks[m++];
      if (y.kind === kl.OperationKind.COPY)
        (0, Ll.copyData)(y, n, t.oldFileFd, i, () => h(m));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${y.start}-${y.end - 1}`;
        const A = e.httpExecutor.createRequest(E, (C) => {
          C.on("error", i), Qo(C, i) && (C.pipe(n, {
            end: !1
          }), C.once("end", () => h(m)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(A, i), A.end();
      }
    };
    h(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(c, (h) => {
    if (!Qo(h, i))
      return;
    const m = (0, Jo.safeGetHeader)(h, "content-type"), y = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(m);
    if (y == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${m}"`));
      return;
    }
    const E = new Ll.DataSplitter(n, t, l, y[1] || y[2], p, r, s, e.options.onProgress);
    E.on("error", i), h.pipe(E), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Qo(e, t) {
  if (e.statusCode >= 400)
    return t((0, Jo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, Jo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.ProgressDifferentialDownloadCallbackTransform = void 0;
const o_ = hr;
var En;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(En || (En = {}));
class a_ extends o_.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = En.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == En.COPY) {
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
    this.operationType = En.COPY;
  }
  beginRangeDownload() {
    this.operationType = En.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
Hi.ProgressDifferentialDownloadCallbackTransform = a_;
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.DifferentialDownloader = void 0;
const Mn = me, bo = Pt, s_ = Dt, l_ = In, c_ = Nt, Kr = rn, Ml = ji, u_ = Hi;
class f_ {
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
    return (0, Mn.configureRequestUrl)(this.options.newUrl, t), (0, Mn.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Kr.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const p = l.end - l.start;
      l.kind === Kr.OperationKind.DOWNLOAD ? o += p : a += p;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return r.info(`Full: ${Bl(s)}, To download: ${Bl(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, bo.close)(i.descriptor).catch((o) => {
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
    const r = await (0, bo.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, bo.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, s_.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let p;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const C = [];
        let T = 0;
        for (const U of t)
          U.kind === Kr.OperationKind.DOWNLOAD && (C.push(U.end - U.start), T += U.end - U.start);
        const N = {
          expectedByteCounts: C,
          grandTotal: T
        };
        p = new u_.ProgressDifferentialDownloadCallbackTransform(N, this.options.cancellationToken, this.options.onProgress), l.push(p);
      }
      const c = new Mn.DigestTransform(this.blockAwareFileInfo.sha512);
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
        m = (0, Ml.executeTasksUsingMultipleRangeRequests)(this, t, h, r, s), m(0);
        return;
      }
      let y = 0, E = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", m = (C) => {
        var T, N;
        if (C >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const U = t[C++];
        if (U.kind === Kr.OperationKind.COPY) {
          p && p.beginFileCopy(), (0, l_.copyData)(U, h, r, s, () => m(C));
          return;
        }
        const q = `bytes=${U.start}-${U.end - 1}`;
        A.headers.range = q, (N = (T = this.logger) === null || T === void 0 ? void 0 : T.debug) === null || N === void 0 || N.call(T, `download range: ${q}`), p && p.beginRangeDownload();
        const J = this.httpExecutor.createRequest(A, (Q) => {
          Q.on("error", s), Q.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), Q.statusCode >= 400 && s((0, Mn.createHttpError)(Q)), Q.pipe(h, {
            end: !1
          }), Q.once("end", () => {
            p && p.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => m(C), 1e3)) : m(C);
          });
        });
        J.on("redirect", (Q, W, k) => {
          this.logger.info(`Redirect to ${d_(k)}`), E = k, (0, Mn.configureRequestUrl)(new c_.URL(E), A), J.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(J, s), J.end();
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
        (0, Ml.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", n), a.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
Tr.DifferentialDownloader = f_;
function Bl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function d_(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.GenericDifferentialDownloader = void 0;
const h_ = Tr;
class p_ extends h_.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Bi.GenericDifferentialDownloader = p_;
var Ft = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = me;
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
})(Ft);
Object.defineProperty($t, "__esModule", { value: !0 });
$t.NoOpLogger = $t.AppUpdater = void 0;
const Re = me, m_ = pr, g_ = vi, E_ = dc, Je = Pt, y_ = ve, Io = Ii, Qe = ae, qt = df, jl = Ar, w_ = Fi, Hl = hf, v_ = Sr, Ro = xi, Oo = pc, __ = Bi, un = Ft;
class La extends E_.EventEmitter {
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
        throw (0, Re.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Re.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, Hl.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Af();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Io.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new un.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new Io.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Io.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new w_.ElectronAppAdapter(), this.httpExecutor = new Hl.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, qt.parse)(r);
    if (i == null)
      throw (0, Re.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = A_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new v_.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, Ro.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, Ro.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
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
      const r = La.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Jt.Notification(r).show();
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
    const i = await this.stagingUserIdPromise.value, a = Re.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, qt.parse)(t.version);
    if (n == null)
      throw (0, Re.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, qt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, qt.gt)(n, r), a = (0, qt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, g_.release)();
    if (n)
      try {
        if ((0, qt.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, Ro.createClient)(r, this, this.createProviderRuntimeOptions())));
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
    const r = new Re.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Re.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Re.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Re.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof Re.CancellationError))
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
    this.emit(un.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, y_.load)(await (0, Je.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Qe.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, Je.readFile)(t, "utf-8");
      if (Re.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Re.UUID.v5((0, m_.randomBytes)(4096), Re.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, Je.outputFile)(t, n);
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
      const i = Qe.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new jl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(un.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (T) => this.emit(un.DOWNLOAD_PROGRESS, T));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = n.packageInfo;
    function s() {
      const T = decodeURIComponent(t.fileInfo.url.pathname);
      return T.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Qe.basename(T) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), p = l.cacheDirForPendingUpdate;
    await (0, Je.mkdir)(p, { recursive: !0 });
    const c = s();
    let f = Qe.join(p, c);
    const h = a == null ? null : Qe.join(p, `package-${o}${Qe.extname(a.path) || ".7z"}`), m = async (T) => {
      await l.setDownloadedFile(f, h, i, n, c, T), await t.done({
        ...i,
        downloadedFile: f
      });
      const N = Qe.join(p, "current.blockmap");
      return await (0, Je.pathExists)(N) && await (0, Je.copyFile)(N, Qe.join(l.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, y = this._logger, E = await l.validateDownloadedPath(f, i, n, y);
    if (E != null)
      return f = E, await m(!1);
    const A = async () => (await l.clear().catch(() => {
    }), await (0, Je.unlink)(f).catch(() => {
    })), C = await (0, jl.createTempUpdateFile)(`temp-${c}`, p, y);
    try {
      await t.task(C, r, h, A), await (0, Re.retry)(() => (0, Je.rename)(C, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (T) => T instanceof Error && /^EBUSY:/.test(T.message) ? !0 : (y.warn(`Cannot rename temp file to final file: ${T.message || T.stack}`), !1)
      });
    } catch (T) {
      throw await A(), T instanceof Re.CancellationError && (y.info("cancelled"), this.emit("update-cancelled", i)), T;
    }
    return y.info(`New version ${o} has been downloaded to ${f}`), await m(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = n.updateInfoAndProvider.provider, s = await a.getBlockMapFiles(t.url, this.app.version, n.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const l = async (y) => {
        const E = await this.httpExecutor.downloadToBuffer(y, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (E == null || E.length === 0)
          throw new Error(`Blockmap "${y.href}" is empty`);
        try {
          return JSON.parse((0, Oo.gunzipSync)(E).toString());
        } catch (A) {
          throw new Error(`Cannot parse blockmap "${y.href}", error: ${A}`);
        }
      }, p = {
        newUrl: t.url,
        oldFile: Qe.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(un.DOWNLOAD_PROGRESS) > 0 && (p.onProgress = (y) => this.emit(un.DOWNLOAD_PROGRESS, y));
      const c = async (y, E) => {
        const A = Qe.join(E, "current.blockmap");
        await (0, Je.outputFile)(A, (0, Oo.gzipSync)(JSON.stringify(y)));
      }, f = async (y) => {
        const E = Qe.join(y, "current.blockmap");
        try {
          if (await (0, Je.pathExists)(E))
            return JSON.parse((0, Oo.gunzipSync)(await (0, Je.readFile)(E)).toString());
        } catch (A) {
          this._logger.warn(`Cannot parse blockmap "${E}", error: ${A}`);
        }
        return null;
      }, h = await l(s[1]);
      await c(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let m = await f(this.downloadedUpdateHelper.cacheDir);
      return m == null && (m = await l(s[0])), await new __.GenericDifferentialDownloader(t.info, this.httpExecutor, p).download(m, h), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
$t.AppUpdater = La;
function A_(e) {
  const t = (0, qt.prerelease)(e);
  return t != null && t.length > 0;
}
class Af {
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
$t.NoOpLogger = Af;
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.BaseUpdater = void 0;
const Gl = wi, S_ = $t;
class T_ extends S_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Jt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    const i = (0, Gl.spawnSync)(t, n, {
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
        const s = { stdio: i, env: r, detached: !0 }, l = (0, Gl.spawn)(t, n, s);
        l.on("error", (p) => {
          a(p);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
nn.BaseUpdater = T_;
var or = {}, Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const fn = Pt, C_ = Tr, $_ = pc;
class b_ extends C_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Sf(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await I_(this.options.oldFile), i);
  }
}
Cr.FileWithEmbeddedBlockMapDifferentialDownloader = b_;
function Sf(e) {
  return JSON.parse((0, $_.inflateRawSync)(e).toString());
}
async function I_(e) {
  const t = await (0, fn.open)(e, "r");
  try {
    const n = (await (0, fn.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, fn.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, fn.read)(t, i, 0, i.length, n - r.length - i.length), await (0, fn.close)(t), Sf(i);
  } catch (n) {
    throw await (0, fn.close)(t), n;
  }
}
Object.defineProperty(or, "__esModule", { value: !0 });
or.AppImageUpdater = void 0;
const ql = me, Wl = wi, R_ = Pt, O_ = Dt, Bn = ae, D_ = nn, N_ = Cr, P_ = fe, Vl = Ft;
class F_ extends D_.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, P_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, ql.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, a, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, R_.chmod)(i, 493);
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
      return this.listenerCount(Vl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Vl.DOWNLOAD_PROGRESS, s)), await new N_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, ql.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, O_.unlinkSync)(n);
    let r;
    const i = Bn.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Bn.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = Bn.join(Bn.dirname(n), Bn.basename(o)), (0, Wl.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Wl.execFileSync)(r, [], { env: a })), !0;
  }
}
or.AppImageUpdater = F_;
var ar = {}, Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.LinuxUpdater = void 0;
const x_ = nn;
class U_ extends x_.BaseUpdater {
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
Rn.LinuxUpdater = U_;
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.DebUpdater = void 0;
const L_ = fe, Yl = Ft, k_ = Rn;
class ka extends k_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, L_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Yl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Yl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
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
      ka.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
ar.DebUpdater = ka;
var sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.PacmanUpdater = void 0;
const zl = Ft, M_ = fe, B_ = Rn;
class Ma extends B_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, M_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(zl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(zl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      Ma.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
sr.PacmanUpdater = Ma;
var lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.RpmUpdater = void 0;
const Xl = Ft, j_ = fe, H_ = Rn;
class Ba extends H_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, j_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Xl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Xl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(r);
    try {
      Ba.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
lr.RpmUpdater = Ba;
var cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.MacUpdater = void 0;
const Kl = me, Do = Pt, G_ = Dt, Jl = ae, q_ = xd, W_ = $t, V_ = fe, Ql = wi, Zl = pr;
class Y_ extends W_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Jt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, Ql.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Ql.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const l = (0, V_.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Kl.newError)(`ZIP file not provided: ${(0, Kl.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const p = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const m = Jl.join(this.downloadedUpdateHelper.cacheDir, c), y = () => (0, Do.pathExistsSync)(m) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let E = !0;
        y() && (E = await this.differentialDownloadInstaller(l, t, f, p, c)), E && await this.httpExecutor.download(l.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Jl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Do.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, Do.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, q_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (p) => {
      const c = p.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((p, c) => {
      const f = (0, Zl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), m = `/${(0, Zl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (y, E) => {
        const A = y.url;
        if (a.info(`${A} requested`), A === "/") {
          if (!y.headers.authorization || y.headers.authorization.indexOf("Basic ") === -1) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("No authenthication info");
            return;
          }
          const N = y.headers.authorization.split(" ")[1], U = Buffer.from(N, "base64").toString("ascii"), [q, J] = U.split(":");
          if (q !== "autoupdater" || J !== f) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const Q = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          E.writeHead(200, { "Content-Type": "application/json", "Content-Length": Q.length }), E.end(Q);
          return;
        }
        if (!A.startsWith(m)) {
          a.warn(`${A} requested, but not supported`), E.writeHead(404), E.end();
          return;
        }
        a.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let C = !1;
        E.on("finish", () => {
          C || (this.nativeUpdater.removeListener("error", c), p([]));
        });
        const T = (0, G_.createReadStream)(i);
        T.on("error", (N) => {
          try {
            E.end();
          } catch (U) {
            a.warn(`cannot end response: ${U}`);
          }
          C = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${N}`));
        }), E.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), T.pipe(E);
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
cr.MacUpdater = Y_;
var ur = {}, ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
ja.verifySignature = X_;
const ec = me, Tf = wi, z_ = vi, tc = ae;
function Cf(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function X_(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, Tf.execFile)(...Cf(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var p;
      try {
        if (a != null || l) {
          No(n, a, l, i), r(null);
          return;
        }
        const c = K_(s);
        if (c.Status === 0) {
          try {
            const y = tc.normalize(c.Path), E = tc.normalize(t);
            if (n.info(`LiteralPath: ${y}. Update Path: ${E}`), y !== E) {
              No(n, new Error(`LiteralPath of ${y} is different than ${E}`), l, i), r(null);
              return;
            }
          } catch (y) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = y.message) !== null && p !== void 0 ? p : y.stack}`);
          }
          const h = (0, ec.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const y of e) {
            const E = (0, ec.parseDn)(y);
            if (E.size ? m = Array.from(E.keys()).every((C) => E.get(C) === h.get(C)) : y === h.get("CN") && (n.warn(`Signature validated using only CN ${y}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (h, m) => h === "RawData" ? void 0 : m, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (c) {
        No(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function K_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function No(e, t, n, r) {
  if (J_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Tf.execFileSync)(...Cf("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function J_() {
  const e = z_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.NsisUpdater = void 0;
const Jr = me, nc = ae, Q_ = nn, Z_ = Cr, rc = Ft, eA = fe, tA = Pt, nA = ja, ic = Nt;
class rA extends Q_.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, nA.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, eA.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, a, s) => {
        const l = r.packageInfo, p = l != null && a != null;
        if (p && t.disableWebInstaller)
          throw (0, Jr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !p && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (p || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Jr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Jr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (p && await this.differentialDownloadWebPackage(t, l, a, n))
          try {
            await this.httpExecutor.download(new ic.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, tA.unlink)(a);
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
      this.spawnLog(nc.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Jt.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new ic.URL(n.path),
        oldFile: nc.join(this.downloadedUpdateHelper.cacheDir, Jr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(rc.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(rc.DOWNLOAD_PROGRESS, a)), await new Z_.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
ur.NsisUpdater = rA;
(function(e) {
  var t = Ne && Ne.__createBinding || (Object.create ? function(A, C, T, N) {
    N === void 0 && (N = T);
    var U = Object.getOwnPropertyDescriptor(C, T);
    (!U || ("get" in U ? !C.__esModule : U.writable || U.configurable)) && (U = { enumerable: !0, get: function() {
      return C[T];
    } }), Object.defineProperty(A, N, U);
  } : function(A, C, T, N) {
    N === void 0 && (N = T), A[N] = C[T];
  }), n = Ne && Ne.__exportStar || function(A, C) {
    for (var T in A) T !== "default" && !Object.prototype.hasOwnProperty.call(C, T) && t(C, A, T);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = Pt, i = ae;
  var o = nn;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = $t;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = fe;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = or;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var p = ar;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return p.DebUpdater;
  } });
  var c = sr;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = lr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = cr;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var m = ur;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
  } }), n(Ft, e);
  let y;
  function E() {
    if (process.platform === "win32")
      y = new ur.NsisUpdater();
    else if (process.platform === "darwin")
      y = new cr.MacUpdater();
    else {
      y = new or.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(A))
          return y;
        switch ((0, r.readFileSync)(A).toString().trim()) {
          case "deb":
            y = new ar.DebUpdater();
            break;
          case "rpm":
            y = new lr.RpmUpdater();
            break;
          case "pacman":
            y = new sr.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (A) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", A.message);
      }
    }
    return y;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => y || E()
  });
})(He);
const Gi = Oe.dirname(Dd(import.meta.url));
process.env.APP_ROOT = Oe.join(Gi, "..");
const Ha = (e, t) => {
  try {
    et.appendFileSync("c:\\Users\\chiva\\Documents\\devMGM\\dynamic_v2\\crash_log.txt", `[${(/* @__PURE__ */ new Date()).toISOString()}] [${e}] ${t}
`);
  } catch {
  }
};
process.on("uncaughtException", (e) => {
  Ha("UNCAUGHT_EXCEPTION", e.stack || e.message);
});
process.on("unhandledRejection", (e) => {
  Ha("UNHANDLED_REJECTION", String(e));
});
V.on("renderer-error", (e, t) => {
  Ha("RENDERER_ERROR", t);
});
const Ga = (e) => {
  if (De.isPackaged) {
    const r = Oe.join(process.resourcesPath, e);
    if (et.existsSync(r)) return r;
    const i = Oe.join(process.resourcesPath, "electron", e);
    return et.existsSync(i) ? i : r;
  }
  const t = Oe.join(process.cwd(), e);
  if (et.existsSync(t)) return t;
  const n = Oe.join(process.cwd(), "electron", e);
  return et.existsSync(n) ? n : Oe.join(Gi, "..", e);
};
let vn = null, fr = /* @__PURE__ */ new Map(), Po = null;
const $f = () => {
  const e = Ga("calendar-monitor.ps1");
  if (!et.existsSync(e)) {
    console.error(`[MAIN] Calendar Monitor NOT FOUND at: ${e}`);
    return;
  }
  console.log(`[MAIN] Launching Calendar Monitor: ${e}`), Po = Zt("powershell", ["-ExecutionPolicy", "Bypass", "-File", e]), Po.stdout.on("data", (t) => {
    const n = t.toString().split(`
`);
    let r = [];
    for (let i of n)
      if (i = i.trim(), i.startsWith("__EVENT__")) {
        const o = i.replace("__EVENT__", "").split("|||");
        if (o.length >= 6) {
          const [a, s, l, p, c, f] = o;
          r.push({ title: a, start: s, end: l, loc: p, type: c, id: f });
        }
      }
    r.length > 0 && pe(R, "calendar-update", r);
  }), Po.on("exit", () => setTimeout($f, 1e4));
}, bf = () => {
  const e = Ga("notifications-monitor.ps1");
  if (!et.existsSync(e)) {
    console.error(`[MAIN] Notification Monitor NOT FOUND at: ${e}`);
    return;
  }
  console.log(`[MAIN] Launching Notification Monitor: ${e}`), vn = Zt("powershell", ["-ExecutionPolicy", "Bypass", "-File", e]), vn.stdout.on("data", (t) => {
    const n = t.toString().split(`
`);
    for (let r of n)
      if (r = r.trim(), r.startsWith("__NOTIF__")) {
        const i = r.replace("__NOTIF__", "").split("|||");
        if (i.length >= 4) {
          const [o, a, s, l] = i;
          fr.set(l, { title: a, app: o }), pe(R, "notification-sync", {
            id: l,
            app: o,
            text: (a + " " + (s || "")).trim()
          });
        }
      } else if (r.startsWith("__REMOVE__")) {
        const i = r.replace("__REMOVE__", "").trim();
        fr.delete(i), pe(R, "notification-remove", i);
      } else r.startsWith("__DEBUG__") && console.log(`[NOTIF_DEBUG] ${r}`);
  }), vn.on("exit", () => setTimeout(bf, 5e3));
};
V.on("dismiss-notification", (e, t) => {
  const n = fr.get(String(t));
  if (!n) return;
  const r = `
    $ErrorActionPreference = 'SilentlyContinue';
    [void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime];
    $l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current;
    $o = $l.GetNotificationsAsync(1);
    $asInfo = [Windows.Foundation.IAsyncInfo]$o;
    while($asInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(50) };
    $ns = $o.GetResults();
    $t = $ns | Where-Object { 
        ($_.AppInfo.DisplayInfo.DisplayName -match '${n.app}' -or $_.AppInfo.Id -match '${n.app}') -and 
        ($_.Notification.Visual.GetBinding('ToastGeneric').GetTextElements()[0].Text -like '*${n.title.replace(/'/g, "''")}*')
    } | Select-Object -First 1;
    if ($t) { $l.RemoveNotification($t.Id) };
  `;
  Zt("powershell", ["-Command", r]), fr.delete(String(t));
});
V.on("clear-all-notifications", () => {
  Zt("powershell", ["-Command", `
    $ErrorActionPreference = 'SilentlyContinue';
    [void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime];
    $l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current;
    $o = $l.GetNotificationsAsync(1);
    $asInfo = [Windows.Foundation.IAsyncInfo]$o;
    while($asInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(50) };
    $ns = $o.GetResults();
    foreach($n in $ns) {
      $l.RemoveNotification($n.Id);
    }
  `]), fr.clear();
});
He.autoUpdater.autoDownload = !1;
He.autoUpdater.on("checking-for-update", () => {
  console.log("[UPDATER] Checking for update..."), pe(R, "update-checking");
});
He.autoUpdater.on("update-available", (e) => {
  pe(R, "update-available", {
    version: e.version,
    releaseNotes: e.releaseNotes,
    releaseDate: e.releaseDate
  });
});
He.autoUpdater.on("download-progress", (e) => {
  pe(R, "update-progress", e.percent);
});
He.autoUpdater.on("update-downloaded", () => {
  pe(R, "update-ready");
});
He.autoUpdater.on("update-not-available", () => {
  pe(R, "update-not-available");
});
He.autoUpdater.on("error", (e) => {
  console.error("[UPDATER_ERROR] " + e), pe(R, "update-error", e.message || String(e));
});
V.on("check-for-updates", () => {
  console.log("[UPDATER] Manual check requested"), He.autoUpdater.checkForUpdates().then((e) => {
    console.log("[UPDATER] Check result:", e ? "Update " + e.updateInfo.version + " found" : "No update found");
  }).catch((e) => {
    console.error("[UPDATER] Check failed: " + e), pe(R, "update-error", "Error al buscar actualizaciones: " + (e.message || String(e)));
  });
});
V.on("start-update-download", () => {
  console.log("[UPDATER] Starting download..."), He.autoUpdater.downloadUpdate().then(() => {
    console.log("[UPDATER] Download process started");
  }).catch((e) => {
    console.error("[UPDATER] Download failed: " + e), pe(R, "update-error", "Error al descargar: " + (e.message || String(e)));
  });
});
V.on("install-update-now", () => {
  console.log("[UPDATER] Quitting and installing..."), He.autoUpdater.quitAndInstall();
});
V.handle("get-app-version", () => De.getVersion());
V.handle("get-notif-permission-status", async () => new Promise((e) => {
  st('powershell -Command "[void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]; $l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current; $status = $l.GetAccessStatus(); Write-Host $status"', (n, r) => {
    if (n)
      console.error("[NOTIF_IPC] Error checking status:", n), e("Denied");
    else {
      const i = r.trim();
      e(i === "Allowed" ? "Allowed" : "Denied");
    }
  });
}));
function iA() {
  Zt("powershell", ["-Command", "[void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]; [Windows.UI.Notifications.Management.UserNotificationListener]::Current.RequestAccessAsync()"]);
}
const oc = process.env.VITE_DEV_SERVER_URL, oA = Oe.join(process.env.APP_ROOT, "dist");
process.platform === "win32" && De.setAppUserModelId("com.notchly.app");
let R, qa = !1, Wn = !1, ri = 0, If = 440, Rf = 66, ht = "top", Zo = 20, ea = !1, ta = !1, ce = "Teams", Ht = !1, dt = !1, jn = !1, Fo = 0, ac = Date.now(), Hn = null, na = null, ra = null, xo = null, Ve = null, ia = "";
function pe(e, t, ...n) {
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
const oa = () => {
  if (!R || R.isDestroyed()) return;
  const e = ia ? `https://wttr.in/${encodeURIComponent(ia)}?format=j1` : "https://wttr.in?format=j1";
  Pd.get(e, (t) => {
    let n = "";
    t.on("data", (r) => n += r), t.on("end", () => {
      var r, i, o;
      try {
        const a = JSON.parse(n), s = a.current_condition[0], l = (r = a.nearest_area) == null ? void 0 : r[0], p = ((o = (i = l == null ? void 0 : l.areaName) == null ? void 0 : i[0]) == null ? void 0 : o.value) || "Local";
        pe(R, "weather-update", {
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
V.handle("get-system-audio-id", async () => {
  var t;
  return (t = (await uc.getSources({ types: ["screen"] }))[0]) == null ? void 0 : t.id;
});
V.on("app-quit", () => {
  qa = !0, De.quit();
});
V.removeAllListeners("set-weather-location");
V.on("set-weather-location", (e, t) => {
  ia = t || "", oa();
});
V.on("set-is-super-pill", (e, t) => {
});
V.on("set-is-preview", (e, t) => {
});
V.on("update-island-pos", (e, t) => {
  ri = t;
});
V.on("update-island-pos-y", (e, t) => {
});
V.on("set-dock-mode", (e, t) => {
  ht = t;
});
V.on("set-floating-offset", (e, t) => {
  Zo = t;
});
let sc = 0;
V.on("set-is-expanded", (e, t) => {
  Wn = t, t && R && R.setIgnoreMouseEvents(!1), t && Date.now() - sc > 30 * 60 * 1e3 && (sc = Date.now(), console.log("[UPDATER] Auto-check triggered on expansion"), He.autoUpdater.checkForUpdatesAndNotify().catch(() => {
  }));
});
V.on("set-window-dimensions", (e, t) => {
  If = t.w, Rf = t.h;
});
V.on("set-bubbles-state", (e, t) => {
  ea = t.call, ta = t.controls;
});
let ii = !0, Tt = null;
V.on("set-always-on-top", (e, t) => {
  ii = !0, R && (R.setAlwaysOnTop(!0, "screen-saver", 1), R.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
});
V.on("set-ignore-mouse-events", (e, t) => {
  t ? Tt !== !0 && (Tt = !0, R == null || R.setIgnoreMouseEvents(!0, { forward: !0 })) : Tt !== !1 && (Tt = !1, R == null || R.setIgnoreMouseEvents(!1));
});
function aA() {
  const e = cs.getPrimaryDisplay(), { width: t, height: n, x: r, y: i } = e.bounds;
  R = new Od({
    width: t,
    height: n,
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
      preload: Oe.join(Gi, "preload.js"),
      backgroundThrottling: !1,
      autoplayPolicy: "no-user-gesture-required",
      webviewTag: !0
    }
  }), oc ? R.loadURL(oc) : R.loadFile(Oe.join(oA, "index.html")), R.webContents.on("did-finish-load", () => {
    R == null || R.setTitle("NOTCHLY_ALIVE"), R == null || R.show(), R == null || R.setAlwaysOnTop(!0, "screen-saver");
  }), R.showInactive(), R.setIgnoreMouseEvents(!0, { forward: !0 }), R.setAlwaysOnTop(!0, "screen-saver"), R.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), setTimeout(() => {
    R && !R.isDestroyed() && (R.setAlwaysOnTop(!0, "screen-saver", 1), R.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }));
  }, 5e3), setInterval(() => {
    R && !R.isDestroyed() && ii && (R.isVisible() || R.showInactive(), R.setAlwaysOnTop(!0, "screen-saver", 1), R.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), R.setSkipTaskbar(!0));
  }, 1e4), R.on("blur", () => {
    R && !R.isDestroyed() && ii && R.setAlwaysOnTop(!0, "screen-saver", 1);
  }), R.on("focus", () => {
    R && !R.isDestroyed() && ii && R.setAlwaysOnTop(!0, "screen-saver", 1);
  }), R.on("minimize", () => {
    R && !R.isDestroyed() && (R.restore(), R.showInactive());
  }), setTimeout(() => {
    iA(), bf(), $f(), yi(), Df(), dr(), He.autoUpdater.checkForUpdatesAndNotify().catch((l) => console.error("Update check failed: " + l));
  }, 1200);
  const o = r + t / 2;
  Hn && clearInterval(Hn);
  let a = 0, s = 0;
  Hn = setInterval(() => {
    try {
      if (!R || R.isDestroyed()) return;
      const { x: l, y: p } = cs.getCursorScreenPoint(), c = Date.now() < s, f = Wn || c;
      let h = If || 440, m = Rf || 66;
      f && !Wn && (ht === "left" || ht === "right" ? (h = 360, m = 400) : (h = 748, m = 600));
      const y = h / 2, E = m / 2;
      let A = 0, C = 0, T = 0, N = 0;
      const U = f ? 30 : 12;
      if (ht === "left") {
        const W = i + 96 + E;
        A = r - 10, C = r + h + U, T = W - E - U, N = W + E + U;
      } else if (ht === "right") {
        const W = i + 96 + E;
        A = r + t - h - U, C = r + t + 10, T = W - E - U, N = W + E + U;
      } else if (ht === "floating") {
        const W = o + (ri || 0), k = Zo || 20;
        A = W - y - U, C = W + y + U, T = i + k - U, N = i + k + m + U;
      } else {
        const W = o + (ri || 0);
        A = W - y - U, C = W + y + U, T = i - 20, N = i + m + U;
      }
      const q = l >= A && l <= C && p >= T && p <= N;
      a++;
      let J = !1;
      if ((ht === "top" || ht === "floating") && !Wn && (ea || ta)) {
        const k = o + (ri || 0) - y, w = ea && ta ? 140 : 70, H = ht === "floating" ? i + (Zo || 20) - 10 : i - 10, X = H + 90;
        J = l >= k - w - 30 && l < k - 5 && p >= H && p < X;
      }
      q || J ? (ac = Date.now(), Tt !== !1 && (Tt = !1, R.setIgnoreMouseEvents(!1), pe(R, "hover-changed", !0), Wn || (s = Date.now() + 1e3))) : Date.now() - ac > 350 && Tt !== !0 && (Tt = !0, R.setIgnoreMouseEvents(!0, { forward: !0 }), pe(R, "hover-changed", !1));
    } catch {
    }
  }, 32), R.on("close", (l) => {
    qa || l.preventDefault();
  }), R.on("closed", () => {
    Hn && clearInterval(Hn), na && clearInterval(na), ra && clearTimeout(ra), xo && clearInterval(xo), Ve && clearInterval(Ve), R = null;
  }), V.handle("get-auto-launch", () => De.getLoginItemSettings().openAtLogin), V.on("set-auto-launch", (l, p) => {
    try {
      process.platform === "win32" && (De.setLoginItemSettings({
        openAtLogin: p,
        path: De.getPath("exe"),
        args: [
          "--hidden",
          "--start-minimized"
        ]
      }), console.log(`[MAIN] Autostart ${p ? "enabled" : "disabled"} for: ${De.getPath("exe")}`));
    } catch (c) {
      console.error("[AUTOSTART_ERROR] Failed to set login item settings:", c);
    }
  }), oa(), xo = setInterval(oa, 20 * 60 * 1e3), setInterval(() => {
    console.log("[UPDATER] Periodic 4h check"), He.autoUpdater.checkForUpdatesAndNotify().catch(() => {
    });
  }, 4 * 60 * 60 * 1e3);
}
const sA = De.requestSingleInstanceLock();
sA ? (De.on("second-instance", () => {
  R && (R.isMinimized() && R.restore(), R.focus());
}), De.whenReady().then(() => {
  aA();
})) : De.quit();
const Ce = (e) => {
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
    const r = Zt("powershell", ["-Command", t]);
    r.stdout.on("data", (i) => {
    }), r.stderr.on("data", (i) => {
    }), r.on("close", () => n(!0));
  });
};
V.handle("toggle-system-mute", async () => (ce === "Zoom" ? await Ce("%a") : ce === "Meet" ? await Ce("^d") : await Ce("^+m"), !0));
V.handle("toggle-video", async () => (ce === "Zoom" ? await Ce("%v") : ce === "Meet" ? await Ce("^e") : await Ce("^+o"), !0));
V.handle("end-call", async () => (ce === "Zoom" ? (await Ce("%q"), await Ce("{ENTER}")) : ce === "Meet" ? await Ce("^w") : await Ce("^+h"), !0));
let lc = zt.cpus();
na = setInterval(() => {
  try {
    if (!R || R.isDestroyed()) return;
    const e = zt.totalmem(), t = zt.freemem(), n = (e - t) / e * 100, r = zt.cpus();
    let i = 0, o = 0;
    for (let s = 0; s < r.length; s++) {
      const l = lc[s].times, p = r[s].times, c = Object.values(l).reduce((h, m) => h + m, 0), f = Object.values(p).reduce((h, m) => h + m, 0);
      i += f - c, o += p.idle - l.idle;
    }
    const a = i > 0 ? (1 - o / i) * 100 : 0;
    lc = r, pe(R, "system-update", { cpu: a, ram: n, net: 1.5 + Math.random() * 2 });
  } catch {
  }
}, 2e3);
const dr = async () => {
  if (!(!R || R.isDestroyed()))
    try {
      st(`powershell -Command "${`
      $wifi = $false; $bt = $false
      try {
        $w = Get-WmiObject -Class Win32_NetworkAdapter -ErrorAction SilentlyContinue | Where-Object { $_.Name -match 'Wi-Fi|Wireless|WLAN' -and $_.PhysicalAdapter -eq $true } | Select-Object -First 1;
        if ($w -and $w.NetEnabled) { $wifi = $true };
        
        $b = Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue | Where-Object { ($_.InstanceId -match '^USB|^PCI') -and ($_.FriendlyName -notmatch 'Enumerator|LE|Device|Phone|Hands-free') } | Select-Object -First 1;
        if ($b -and $b.Status -eq 'OK') { $bt = $true };
      } catch {};
      Write-Output "$($wifi)|$($bt)";
    `.replace(/\n/g, " ")}"`, (t, n) => {
        var r, i;
        if (!t && n) {
          const o = n.trim().split("|");
          pe(R, "network-status", {
            wifi: ((r = o[0]) == null ? void 0 : r.toLowerCase()) === "true",
            bluetooth: ((i = o[1]) == null ? void 0 : i.toLowerCase()) === "true"
          });
        }
        Ve && clearTimeout(Ve), Ve = setTimeout(dr, 6e3);
      });
    } catch {
      Ve && clearTimeout(Ve), Ve = setTimeout(dr, 6e3);
    }
}, aa = Ga("volume.exe"), Of = () => new Promise((e) => {
  if (!et.existsSync(aa)) return e(-1);
  st(`"${aa}" get`, (t, n) => {
    if (t) return e(-1);
    const r = parseInt(n.trim(), 10);
    e(isNaN(r) ? -1 : r);
  });
});
let Uo = !1, Qr = null;
const lA = async (e) => {
  if (Qr = e, !Uo) {
    for (Uo = !0; Qr !== null; ) {
      const t = Qr;
      Qr = null, await new Promise((n) => {
        st(`"${aa}" set ${Math.round(t)}`, () => n(null));
      });
    }
    Uo = !1;
  }
}, Df = async () => {
  if (!(!R || R.isDestroyed())) {
    try {
      const e = await Of();
      e >= 0 && pe(R, "volume-update", e);
    } catch {
    }
    ra = setTimeout(Df, 2e3);
  }
};
let Me = null, oi = null, cc = /* @__PURE__ */ new Map();
const yi = () => {
  try {
    const e = De.isPackaged ? Oe.join(Gi, "media-reader.js") : Oe.join(process.cwd(), "electron", "media-reader.mjs");
    console.log(`[MAIN] Launching Media Reader: ${e}`), Me = Nd(e, [process.resourcesPath || ""], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
      stdio: ["inherit", "pipe", "pipe", "ipc"]
    });
    const t = (n, r) => {
      const i = n.toString();
      i.includes("failed to get playback info") || i.includes("OperaSoftware") || (r === "ERR" ? console.error(`[MEDIA_READER_ERR] ${i.trim()}`) : console.log(`[MEDIA_READER] ${i.trim()}`));
    };
    Me.stdout && Me.stdout.on("data", (n) => t(n, "LOG")), Me.stderr && Me.stderr.on("data", (n) => t(n, "ERR")), Me && (Me.on("exit", (n) => {
      console.warn(`[MAIN] Media Reader exited with code ${n}. Restarting in 3s...`), setTimeout(yi, 3e3);
    }), Me.on("message", (n) => {
      if ((n == null ? void 0 : n.type) === "MEDIA_UPDATE") {
        const r = n.data;
        if (!r) return;
        const i = r.id && r.id !== "system" ? r.id : r.title + "||" + (r.artist || "");
        r.title && r.title !== "Sin Reproducción" && cc.set(i, { ...r, timestamp: Date.now() });
        let o = Array.from(cc.values()).filter((l) => l.title !== "Sin Reproducción").sort((l, p) => p.timestamp - l.timestamp), a = r;
        const s = o.find((l) => l.isPlaying);
        s ? a = s : o.length > 0 && (a = o[0]), oi = a, pe(R, "media-update", a);
      }
    }));
  } catch (e) {
    console.error("[MAIN] Media Reader Failed:", e), setTimeout(yi, 5e3);
  }
};
try {
  yi();
  let e = "", t = null, n = "", r = 0;
  const i = () => {
    const a = Oe.join(zt.tmpdir(), "notchly-meet.ps1");
    et.writeFileSync(a, `
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
    `, "utf8"), t = Zt("powershell", ["-ExecutionPolicy", "Bypass", "-File", a]), t.stdout.on("data", (l) => {
      const p = l.toString();
      n += p;
      let c;
      for (; (c = n.indexOf(`
`)) !== -1; ) {
        const f = n.slice(0, c).trim();
        if (n = n.slice(c + 1), !f.startsWith("__DEBUG__") && f.startsWith("__MEET__")) {
          const h = f.replace("__MEET__", "").split("|");
          if (h.length >= 6) {
            const [m, y, E, A, C, T, N] = h, U = m.toLowerCase() === "true", q = y.toLowerCase() === "true", J = C.toLowerCase() === "true", Q = (N ?? "").toLowerCase() === "true", W = q && (U || J);
            W ? (Fo = 0, E.toLowerCase().includes("zoom") ? ce = "Zoom" : E.toLowerCase().includes("meet") ? ce = "Meet" : E.toLowerCase().includes("teams") ? ce = "Teams" : ce = E || "Llamada") : Fo++;
            const k = Fo < 6;
            k || (dt = !1, jn = !1), U && T === "High" ? (Ht = !0, dt = !1) : Q || !U && T === "High" ? (Ht = !1, dt = !0) : Ht = !dt;
            const w = jn ? !1 : J;
            if (Date.now() < r) return;
            pe(R, "meeting-update", {
              isActive: k,
              app: W || k ? E || "Llamada Activa" : "",
              device: A || "Sistema",
              micActive: Ht,
              camActive: w
            });
          }
        }
      }
    }), t.stderr.on("data", (l) => {
    }), t.on("exit", () => setTimeout(i, 5e3));
  };
  setTimeout(i, 3e3), V.handle("get-media-source-id", async (a, s) => {
    try {
      const l = await uc.getSources({
        types: ["window"],
        thumbnailSize: { width: 0, height: 0 }
      }), { title: p, artist: c } = s;
      if (!p || p === "Ningún origen de medios") return null;
      const f = p.toLowerCase(), h = (Array.isArray(c) ? c : [c]).map((y) => y.toLowerCase());
      let m = l.find((y) => {
        const E = y.name.toLowerCase();
        return E.includes(f) && h.some((A) => E.includes(A));
      });
      return m || (m = l.find((y) => y.name.toLowerCase().includes(f))), !m && h.some((y) => y.includes("spotify")) && (m = l.find((y) => y.name.toLowerCase().includes("spotify"))), m ? m.id : null;
    } catch {
      return null;
    }
  }), V.handle("get-current-media", async () => oi || (await new Promise((a) => setTimeout(a, 1200)), oi || null));
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
  V.handle("toggle-wifi", async () => {
    const a = Oe.join(zt.tmpdir(), "notchly-radio-cmd.ps1");
    return et.writeFileSync(a, o, "utf8"), st(`powershell -ExecutionPolicy Bypass -File "${a}" "WiFi"`, () => {
      Ve && clearTimeout(Ve), setTimeout(dr, 1500);
    }), !0;
  }), V.handle("toggle-bluetooth", async () => {
    const a = Oe.join(zt.tmpdir(), "notchly-radio-cmd.ps1");
    return et.writeFileSync(a, o, "utf8"), st(`powershell -ExecutionPolicy Bypass -File "${a}" "Bluetooth"`, () => {
      Ve && clearTimeout(Ve), setTimeout(dr, 1500);
    }), !0;
  }), V.on("media-command", (a, s) => {
    Me && !Me.killed && Me.send(s);
  }), V.handle("get-volume", async () => await Of()), V.handle("set-volume", (a, s) => (lA(s), !0)), V.handle("open-app", async (a, s) => {
    const l = s.toLowerCase();
    return l.includes("chrome") ? st("start chrome") : l.includes("spotify") ? st("start spotify") : l.includes("camera") ? st("start microsoft.windows.camera:") : st(`start "" "${s}"`), !0;
  }), V.handle("meeting-command", async (a, s) => {
    r = Date.now() + 8e3, s === "toggleMic" ? (dt = !dt, Ht = !dt, await Ce(ce === "Zoom" ? "%a" : ce === "Meet" ? "^d" : "^+m")) : s === "toggleCam" ? (jn = !jn, await Ce(ce === "Zoom" ? "%v" : ce === "Meet" ? "^e" : "^+o")) : s === "endCall" && (dt = !1, jn = !1, Ht = !1, ce === "Zoom" ? (await Ce("%q"), setTimeout(() => Ce("{ENTER}"), 200)) : ce === "Meet" ? await Ce("^w") : await Ce("^+h"));
  }), De.on("before-quit", () => {
    qa = !0, Me == null || Me.kill(), typeof t < "u" && t && t.kill(), typeof vn < "u" && vn && vn.kill();
  });
} catch (e) {
  console.error("[MAIN] Setup Error:", e);
}
De.on("window-all-closed", (e) => {
  e.preventDefault();
});
export {
  oA as RENDERER_DIST,
  oc as VITE_DEV_SERVER_URL
};
