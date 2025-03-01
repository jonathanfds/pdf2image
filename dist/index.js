'use strict';
var e = require('gm'),
  t = require('path'),
  s = require('fs'),
  i = require('stream');
const r = {
  quality: 0,
  format: 'png',
  width: 768,
  height: 512,
  density: 72,
  preserveAspectRatio: !1,
  savePath: './',
  saveFilename: 'untitled',
  compression: 'jpeg',
};
function n(e, t, s, i) {
  return new (s || (s = Promise))(function (r, n) {
    function a(e) {
      try {
        h(i.next(e));
      } catch (e) {
        n(e);
      }
    }
    function o(e) {
      try {
        h(i.throw(e));
      } catch (e) {
        n(e);
      }
    }
    function h(e) {
      var t;
      e.done
        ? r(e.value)
        : ((t = e.value),
          t instanceof s
            ? t
            : new s(function (e) {
                e(t);
              })).then(a, o);
    }
    h((i = i.apply(e, t || [])).next());
  });
}
'function' == typeof SuppressedError && SuppressedError;
class a {
  constructor() {
    (this.quality = 0),
      (this.format = 'png'),
      (this.width = 768),
      (this.height = 512),
      (this.preserveAspectRatio = !1),
      (this.density = 72),
      (this.savePath = './'),
      (this.saveFilename = 'untitled'),
      (this.compression = 'jpeg'),
      (this.gm = e.subClass({ imageMagick: !1 }));
  }
  generateValidFilename(e) {
    let s = t.join(this.savePath, this.saveFilename);
    return (
      this.savePath.startsWith('./') && (s = `./${s}`),
      'number' == typeof e && (s = `${s}.${e + 1}`),
      `${s}.${this.format}`
    );
  }
  gmBaseCommand(e, t) {
    return this.gm(e, t)
      .density(this.density, this.density)
      .resize(this.width, this.height, this.preserveAspectRatio ? '^' : '!')
      .quality(this.quality)
      .compress(this.compression);
  }
  toBase64(e, t) {
    return n(this, void 0, void 0, function* () {
      const { buffer: s, size: i, page: r } = yield this.toBuffer(e, t);
      return { base64: s.toString('base64'), size: i, page: r };
    });
  }
  toBuffer(e, t) {
    const s = `${e.path}[${t}]`;
    return new Promise((i, r) => {
      this.gmBaseCommand(e, s).stream(this.format, (e, s) => {
        const n = [];
        if (e) return r(e);
        s.on('data', (e) => {
          n.push(e);
        }).on('end', () => i({ buffer: Buffer.concat(n), size: `${this.width}x${this.height}`, page: t + 1 }));
      });
    });
  }
  writeImage(e, i) {
    const r = this.generateValidFilename(i),
      n = `${e.path}[${i}]`;
    return new Promise((a, o) => {
      this.gmBaseCommand(e, n).write(r, (e) =>
        e
          ? o(e)
          : a({
              name: t.basename(r),
              size: `${this.width}x${this.height}`,
              fileSize: s.statSync(r).size / 1e3,
              path: r,
              page: i + 1,
            }),
      );
    });
  }
  identify(e, t) {
    const s = this.gm(e);
    return new Promise((e, i) => {
      t
        ? s.identify(t, (t, s) => (t ? i(t) : e(s.replace(/^[\w\W]*?1/, '1'))))
        : s.identify((t, s) => (t ? i(t) : e(s)));
    });
  }
  setQuality(e) {
    return (this.quality = e), this;
  }
  setFormat(e) {
    return (this.format = e), this;
  }
  setSize(e, t) {
    return (this.width = e), (this.height = this.preserveAspectRatio || t ? t : e), this;
  }
  setPreserveAspectRatio(e) {
    return (this.preserveAspectRatio = e), this;
  }
  setDensity(e) {
    return (this.density = e), this;
  }
  setSavePath(e) {
    return (this.savePath = e), this;
  }
  setSaveFilename(e) {
    return (this.saveFilename = e), this;
  }
  setCompression(e) {
    return (this.compression = e), this;
  }
  setGMClass(t) {
    return (this.gm = e.subClass(t)), this;
  }
  getOptions() {
    return {
      quality: this.quality,
      format: this.format,
      width: this.width,
      height: this.height,
      preserveAspectRatio: this.preserveAspectRatio,
      density: this.density,
      savePath: this.savePath,
      saveFilename: this.saveFilename,
      compression: this.compression,
    };
  }
}
function o(e) {
  return new i.Readable({
    read() {
      this.push(e), this.push(null);
    },
  });
}
function h(e, t) {
  if ('buffer' === e) return o(t);
  if ('path' === e) return s.createReadStream(t);
  if ('base64' === e) return (i = t), o(Buffer.from(i, 'base64'));
  var i;
  throw new Error('Cannot recognize specified source');
}
function u(e, t, i = r) {
  const u = new a();
  i = Object.assign(Object.assign({}, r), i);
  const f = (e, t, s) => {
      if (t < 1) throw new Error('Page number should be more than or equal 1');
      const i = ((e) => {
        var t;
        if (e && 'object' != typeof e) throw new Error(`Invalid convertOptions type: ${e}`);
        return null !== (t = null == e ? void 0 : e.responseType) && void 0 !== t ? t : 'image';
      })(s);
      switch (i) {
        case 'base64':
          return u.toBase64(e, t - 1);
        case 'image':
          return u.writeImage(e, t - 1);
        case 'buffer':
          return u.toBuffer(e, t - 1);
        default:
          throw new Error(`Invalid responseType: ${i}`);
      }
    },
    c = (e, t, s) => Promise.all(t.map((t) => f(e, t, s))),
    p = (s = 1, i) => {
      const r = h(e, t);
      return f(r, s, i);
    };
  return (
    (p.bulk = (i, r) =>
      n(this, void 0, void 0, function* () {
        const a = yield (function (e, t) {
            return n(this, void 0, void 0, function* () {
              if ('buffer' === e) return t;
              if ('path' === e) return yield s.promises.readFile(t);
              if ('base64' === e) return Buffer.from(t, 'base64');
              throw new Error('Cannot recognize specified source');
            });
          })(e, t),
          h =
            -1 === i
              ? yield (function (e, t) {
                  return n(this, void 0, void 0, function* () {
                    return (yield e.identify(t, '%p ')).split(' ').map((e) => parseInt(e, 10));
                  });
                })(u, o(a))
              : Array.isArray(i)
                ? i
                : [i],
          f = [];
        for (let e = 0; e < h.length; e += 10) f.push(...(yield c(o(a), h.slice(e, e + 10), r)));
        return f;
      })),
    (p.setOptions = () =>
      (function (e, t) {
        return void e
          .setQuality(t.quality)
          .setFormat(t.format)
          .setPreserveAspectRatio(t.preserveAspectRatio)
          .setSize(t.width, t.height)
          .setDensity(t.density)
          .setSavePath(t.savePath)
          .setSaveFilename(t.saveFilename)
          .setCompression(t.compression);
      })(u, i)),
    (p.setGMClass = (e) => {
      u.setGMClass(e);
    }),
    p.setOptions(),
    p
  );
}
(exports.fromBase64 = function (e, t = r) {
  return u('base64', e, t);
}),
  (exports.fromBuffer = function (e, t = r) {
    return u('buffer', e, t);
  }),
  (exports.fromPath = function (e, t = r) {
    return u('path', e, t);
  });
