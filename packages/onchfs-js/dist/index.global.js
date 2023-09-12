"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // ../../../../../node_modules/.pnpm/js-sha3@0.9.1/node_modules/js-sha3/src/sha3.js
  var require_sha3 = __commonJS({
    "../../../../../node_modules/.pnpm/js-sha3@0.9.1/node_modules/js-sha3/src/sha3.js"(exports, module) {
      "use strict";
      (function() {
        "use strict";
        var INPUT_ERROR = "input is invalid type";
        var FINALIZE_ERROR = "finalize already called";
        var WINDOW = typeof window === "object";
        var root = WINDOW ? window : {};
        if (root.JS_SHA3_NO_WINDOW) {
          WINDOW = false;
        }
        var WEB_WORKER = !WINDOW && typeof self === "object";
        var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
        if (NODE_JS) {
          root = globalThis;
        } else if (WEB_WORKER) {
          root = self;
        }
        var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === "object" && module.exports;
        var AMD = typeof define === "function" && define.amd;
        var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
        var HEX_CHARS = "0123456789abcdef".split("");
        var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
        var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
        var KECCAK_PADDING = [1, 256, 65536, 16777216];
        var PADDING = [6, 1536, 393216, 100663296];
        var SHIFT = [0, 8, 16, 24];
        var RC = [
          1,
          0,
          32898,
          0,
          32906,
          2147483648,
          2147516416,
          2147483648,
          32907,
          0,
          2147483649,
          0,
          2147516545,
          2147483648,
          32777,
          2147483648,
          138,
          0,
          136,
          0,
          2147516425,
          0,
          2147483658,
          0,
          2147516555,
          0,
          139,
          2147483648,
          32905,
          2147483648,
          32771,
          2147483648,
          32770,
          2147483648,
          128,
          2147483648,
          32778,
          0,
          2147483658,
          2147483648,
          2147516545,
          2147483648,
          32896,
          2147483648,
          2147483649,
          0,
          2147516424,
          2147483648
        ];
        var BITS = [224, 256, 384, 512];
        var SHAKE_BITS = [128, 256];
        var OUTPUT_TYPES = ["hex", "buffer", "arrayBuffer", "array", "digest"];
        var CSHAKE_BYTEPAD = {
          "128": 168,
          "256": 136
        };
        if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
          Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
          };
        }
        if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
          ArrayBuffer.isView = function(obj) {
            return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
          };
        }
        var formatMessage = function(message) {
          var notString, type = typeof message;
          if (type !== "string") {
            if (type === "object") {
              if (message === null) {
                throw new Error(INPUT_ERROR);
              } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              } else if (!Array.isArray(message)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                  throw new Error(INPUT_ERROR);
                }
              }
            } else {
              throw new Error(INPUT_ERROR);
            }
            notString = true;
          }
          return [message, notString];
        };
        var empty = function(message) {
          return formatMessage(message)[0].length === 0;
        };
        var createOutputMethod = function(bits2, padding, outputType) {
          return function(message) {
            return new Keccak(bits2, padding, bits2).update(message)[outputType]();
          };
        };
        var createShakeOutputMethod = function(bits2, padding, outputType) {
          return function(message, outputBits) {
            return new Keccak(bits2, padding, outputBits).update(message)[outputType]();
          };
        };
        var createCshakeOutputMethod = function(bits2, padding, outputType) {
          return function(message, outputBits, n, s) {
            return methods["cshake" + bits2].update(message, outputBits, n, s)[outputType]();
          };
        };
        var createKmacOutputMethod = function(bits2, padding, outputType) {
          return function(key, message, outputBits, s) {
            return methods["kmac" + bits2].update(key, message, outputBits, s)[outputType]();
          };
        };
        var createOutputMethods = function(method, createMethod2, bits2, padding) {
          for (var i2 = 0; i2 < OUTPUT_TYPES.length; ++i2) {
            var type = OUTPUT_TYPES[i2];
            method[type] = createMethod2(bits2, padding, type);
          }
          return method;
        };
        var createMethod = function(bits2, padding) {
          var method = createOutputMethod(bits2, padding, "hex");
          method.create = function() {
            return new Keccak(bits2, padding, bits2);
          };
          method.update = function(message) {
            return method.create().update(message);
          };
          return createOutputMethods(method, createOutputMethod, bits2, padding);
        };
        var createShakeMethod = function(bits2, padding) {
          var method = createShakeOutputMethod(bits2, padding, "hex");
          method.create = function(outputBits) {
            return new Keccak(bits2, padding, outputBits);
          };
          method.update = function(message, outputBits) {
            return method.create(outputBits).update(message);
          };
          return createOutputMethods(method, createShakeOutputMethod, bits2, padding);
        };
        var createCshakeMethod = function(bits2, padding) {
          var w = CSHAKE_BYTEPAD[bits2];
          var method = createCshakeOutputMethod(bits2, padding, "hex");
          method.create = function(outputBits, n, s) {
            if (empty(n) && empty(s)) {
              return methods["shake" + bits2].create(outputBits);
            } else {
              return new Keccak(bits2, padding, outputBits).bytepad([n, s], w);
            }
          };
          method.update = function(message, outputBits, n, s) {
            return method.create(outputBits, n, s).update(message);
          };
          return createOutputMethods(method, createCshakeOutputMethod, bits2, padding);
        };
        var createKmacMethod = function(bits2, padding) {
          var w = CSHAKE_BYTEPAD[bits2];
          var method = createKmacOutputMethod(bits2, padding, "hex");
          method.create = function(key, outputBits, s) {
            return new Kmac(bits2, padding, outputBits).bytepad(["KMAC", s], w).bytepad([key], w);
          };
          method.update = function(key, message, outputBits, s) {
            return method.create(key, outputBits, s).update(message);
          };
          return createOutputMethods(method, createKmacOutputMethod, bits2, padding);
        };
        var algorithms = [
          { name: "keccak", padding: KECCAK_PADDING, bits: BITS, createMethod },
          { name: "sha3", padding: PADDING, bits: BITS, createMethod },
          { name: "shake", padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
          { name: "cshake", padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
          { name: "kmac", padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
        ];
        var methods = {}, methodNames = [];
        for (var i = 0; i < algorithms.length; ++i) {
          var algorithm = algorithms[i];
          var bits = algorithm.bits;
          for (var j = 0; j < bits.length; ++j) {
            var methodName = algorithm.name + "_" + bits[j];
            methodNames.push(methodName);
            methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
            if (algorithm.name !== "sha3") {
              var newMethodName = algorithm.name + bits[j];
              methodNames.push(newMethodName);
              methods[newMethodName] = methods[methodName];
            }
          }
        }
        function Keccak(bits2, padding, outputBits) {
          this.blocks = [];
          this.s = [];
          this.padding = padding;
          this.outputBits = outputBits;
          this.reset = true;
          this.finalized = false;
          this.block = 0;
          this.start = 0;
          this.blockCount = 1600 - (bits2 << 1) >> 5;
          this.byteCount = this.blockCount << 2;
          this.outputBlocks = outputBits >> 5;
          this.extraBytes = (outputBits & 31) >> 3;
          for (var i2 = 0; i2 < 50; ++i2) {
            this.s[i2] = 0;
          }
        }
        Keccak.prototype.update = function(message) {
          if (this.finalized) {
            throw new Error(FINALIZE_ERROR);
          }
          var result = formatMessage(message);
          message = result[0];
          var notString = result[1];
          var blocks = this.blocks, byteCount = this.byteCount, length = message.length, blockCount = this.blockCount, index = 0, s = this.s, i2, code;
          while (index < length) {
            if (this.reset) {
              this.reset = false;
              blocks[0] = this.block;
              for (i2 = 1; i2 < blockCount + 1; ++i2) {
                blocks[i2] = 0;
              }
            }
            if (notString) {
              for (i2 = this.start; index < length && i2 < byteCount; ++index) {
                blocks[i2 >> 2] |= message[index] << SHIFT[i2++ & 3];
              }
            } else {
              for (i2 = this.start; index < length && i2 < byteCount; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  blocks[i2 >> 2] |= code << SHIFT[i2++ & 3];
                } else if (code < 2048) {
                  blocks[i2 >> 2] |= (192 | code >> 6) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks[i2 >> 2] |= (224 | code >> 12) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  blocks[i2 >> 2] |= (240 | code >> 18) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code >> 12 & 63) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code >> 6 & 63) << SHIFT[i2++ & 3];
                  blocks[i2 >> 2] |= (128 | code & 63) << SHIFT[i2++ & 3];
                }
              }
            }
            this.lastByteIndex = i2;
            if (i2 >= byteCount) {
              this.start = i2 - byteCount;
              this.block = blocks[blockCount];
              for (i2 = 0; i2 < blockCount; ++i2) {
                s[i2] ^= blocks[i2];
              }
              f(s);
              this.reset = true;
            } else {
              this.start = i2;
            }
          }
          return this;
        };
        Keccak.prototype.encode = function(x, right) {
          var o = x & 255, n = 1;
          var bytes = [o];
          x = x >> 8;
          o = x & 255;
          while (o > 0) {
            bytes.unshift(o);
            x = x >> 8;
            o = x & 255;
            ++n;
          }
          if (right) {
            bytes.push(n);
          } else {
            bytes.unshift(n);
          }
          this.update(bytes);
          return bytes.length;
        };
        Keccak.prototype.encodeString = function(str) {
          var result = formatMessage(str);
          str = result[0];
          var notString = result[1];
          var bytes = 0, length = str.length;
          if (notString) {
            bytes = length;
          } else {
            for (var i2 = 0; i2 < str.length; ++i2) {
              var code = str.charCodeAt(i2);
              if (code < 128) {
                bytes += 1;
              } else if (code < 2048) {
                bytes += 2;
              } else if (code < 55296 || code >= 57344) {
                bytes += 3;
              } else {
                code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++i2) & 1023);
                bytes += 4;
              }
            }
          }
          bytes += this.encode(bytes * 8);
          this.update(str);
          return bytes;
        };
        Keccak.prototype.bytepad = function(strs, w) {
          var bytes = this.encode(w);
          for (var i2 = 0; i2 < strs.length; ++i2) {
            bytes += this.encodeString(strs[i2]);
          }
          var paddingBytes = (w - bytes % w) % w;
          var zeros = [];
          zeros.length = paddingBytes;
          this.update(zeros);
          return this;
        };
        Keccak.prototype.finalize = function() {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          var blocks = this.blocks, i2 = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
          blocks[i2 >> 2] |= this.padding[i2 & 3];
          if (this.lastByteIndex === this.byteCount) {
            blocks[0] = blocks[blockCount];
            for (i2 = 1; i2 < blockCount + 1; ++i2) {
              blocks[i2] = 0;
            }
          }
          blocks[blockCount - 1] |= 2147483648;
          for (i2 = 0; i2 < blockCount; ++i2) {
            s[i2] ^= blocks[i2];
          }
          f(s);
        };
        Keccak.prototype.toString = Keccak.prototype.hex = function() {
          this.finalize();
          var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
          var hex = "", block;
          while (j2 < outputBlocks) {
            for (i2 = 0; i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
              block = s[i2];
              hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15] + HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15] + HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15] + HEX_CHARS[block >> 28 & 15] + HEX_CHARS[block >> 24 & 15];
            }
            if (j2 % blockCount === 0) {
              f(s);
              i2 = 0;
            }
          }
          if (extraBytes) {
            block = s[i2];
            hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15];
            if (extraBytes > 1) {
              hex += HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15];
            }
            if (extraBytes > 2) {
              hex += HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15];
            }
          }
          return hex;
        };
        Keccak.prototype.arrayBuffer = function() {
          this.finalize();
          var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
          var bytes = this.outputBits >> 3;
          var buffer;
          if (extraBytes) {
            buffer = new ArrayBuffer(outputBlocks + 1 << 2);
          } else {
            buffer = new ArrayBuffer(bytes);
          }
          var array = new Uint32Array(buffer);
          while (j2 < outputBlocks) {
            for (i2 = 0; i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
              array[j2] = s[i2];
            }
            if (j2 % blockCount === 0) {
              f(s);
            }
          }
          if (extraBytes) {
            array[i2] = s[i2];
            buffer = buffer.slice(0, bytes);
          }
          return buffer;
        };
        Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;
        Keccak.prototype.digest = Keccak.prototype.array = function() {
          this.finalize();
          var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i2 = 0, j2 = 0;
          var array = [], offset, block;
          while (j2 < outputBlocks) {
            for (i2 = 0; i2 < blockCount && j2 < outputBlocks; ++i2, ++j2) {
              offset = j2 << 2;
              block = s[i2];
              array[offset] = block & 255;
              array[offset + 1] = block >> 8 & 255;
              array[offset + 2] = block >> 16 & 255;
              array[offset + 3] = block >> 24 & 255;
            }
            if (j2 % blockCount === 0) {
              f(s);
            }
          }
          if (extraBytes) {
            offset = j2 << 2;
            block = s[i2];
            array[offset] = block & 255;
            if (extraBytes > 1) {
              array[offset + 1] = block >> 8 & 255;
            }
            if (extraBytes > 2) {
              array[offset + 2] = block >> 16 & 255;
            }
          }
          return array;
        };
        function Kmac(bits2, padding, outputBits) {
          Keccak.call(this, bits2, padding, outputBits);
        }
        Kmac.prototype = new Keccak();
        Kmac.prototype.finalize = function() {
          this.encode(this.outputBits, true);
          return Keccak.prototype.finalize.call(this);
        };
        var f = function(s) {
          var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
          for (n = 0; n < 48; n += 2) {
            c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
            c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
            c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
            c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
            c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
            c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
            c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
            c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
            c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
            c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
            h = c8 ^ (c2 << 1 | c3 >>> 31);
            l = c9 ^ (c3 << 1 | c2 >>> 31);
            s[0] ^= h;
            s[1] ^= l;
            s[10] ^= h;
            s[11] ^= l;
            s[20] ^= h;
            s[21] ^= l;
            s[30] ^= h;
            s[31] ^= l;
            s[40] ^= h;
            s[41] ^= l;
            h = c0 ^ (c4 << 1 | c5 >>> 31);
            l = c1 ^ (c5 << 1 | c4 >>> 31);
            s[2] ^= h;
            s[3] ^= l;
            s[12] ^= h;
            s[13] ^= l;
            s[22] ^= h;
            s[23] ^= l;
            s[32] ^= h;
            s[33] ^= l;
            s[42] ^= h;
            s[43] ^= l;
            h = c2 ^ (c6 << 1 | c7 >>> 31);
            l = c3 ^ (c7 << 1 | c6 >>> 31);
            s[4] ^= h;
            s[5] ^= l;
            s[14] ^= h;
            s[15] ^= l;
            s[24] ^= h;
            s[25] ^= l;
            s[34] ^= h;
            s[35] ^= l;
            s[44] ^= h;
            s[45] ^= l;
            h = c4 ^ (c8 << 1 | c9 >>> 31);
            l = c5 ^ (c9 << 1 | c8 >>> 31);
            s[6] ^= h;
            s[7] ^= l;
            s[16] ^= h;
            s[17] ^= l;
            s[26] ^= h;
            s[27] ^= l;
            s[36] ^= h;
            s[37] ^= l;
            s[46] ^= h;
            s[47] ^= l;
            h = c6 ^ (c0 << 1 | c1 >>> 31);
            l = c7 ^ (c1 << 1 | c0 >>> 31);
            s[8] ^= h;
            s[9] ^= l;
            s[18] ^= h;
            s[19] ^= l;
            s[28] ^= h;
            s[29] ^= l;
            s[38] ^= h;
            s[39] ^= l;
            s[48] ^= h;
            s[49] ^= l;
            b0 = s[0];
            b1 = s[1];
            b32 = s[11] << 4 | s[10] >>> 28;
            b33 = s[10] << 4 | s[11] >>> 28;
            b14 = s[20] << 3 | s[21] >>> 29;
            b15 = s[21] << 3 | s[20] >>> 29;
            b46 = s[31] << 9 | s[30] >>> 23;
            b47 = s[30] << 9 | s[31] >>> 23;
            b28 = s[40] << 18 | s[41] >>> 14;
            b29 = s[41] << 18 | s[40] >>> 14;
            b20 = s[2] << 1 | s[3] >>> 31;
            b21 = s[3] << 1 | s[2] >>> 31;
            b2 = s[13] << 12 | s[12] >>> 20;
            b3 = s[12] << 12 | s[13] >>> 20;
            b34 = s[22] << 10 | s[23] >>> 22;
            b35 = s[23] << 10 | s[22] >>> 22;
            b16 = s[33] << 13 | s[32] >>> 19;
            b17 = s[32] << 13 | s[33] >>> 19;
            b48 = s[42] << 2 | s[43] >>> 30;
            b49 = s[43] << 2 | s[42] >>> 30;
            b40 = s[5] << 30 | s[4] >>> 2;
            b41 = s[4] << 30 | s[5] >>> 2;
            b22 = s[14] << 6 | s[15] >>> 26;
            b23 = s[15] << 6 | s[14] >>> 26;
            b4 = s[25] << 11 | s[24] >>> 21;
            b5 = s[24] << 11 | s[25] >>> 21;
            b36 = s[34] << 15 | s[35] >>> 17;
            b37 = s[35] << 15 | s[34] >>> 17;
            b18 = s[45] << 29 | s[44] >>> 3;
            b19 = s[44] << 29 | s[45] >>> 3;
            b10 = s[6] << 28 | s[7] >>> 4;
            b11 = s[7] << 28 | s[6] >>> 4;
            b42 = s[17] << 23 | s[16] >>> 9;
            b43 = s[16] << 23 | s[17] >>> 9;
            b24 = s[26] << 25 | s[27] >>> 7;
            b25 = s[27] << 25 | s[26] >>> 7;
            b6 = s[36] << 21 | s[37] >>> 11;
            b7 = s[37] << 21 | s[36] >>> 11;
            b38 = s[47] << 24 | s[46] >>> 8;
            b39 = s[46] << 24 | s[47] >>> 8;
            b30 = s[8] << 27 | s[9] >>> 5;
            b31 = s[9] << 27 | s[8] >>> 5;
            b12 = s[18] << 20 | s[19] >>> 12;
            b13 = s[19] << 20 | s[18] >>> 12;
            b44 = s[29] << 7 | s[28] >>> 25;
            b45 = s[28] << 7 | s[29] >>> 25;
            b26 = s[38] << 8 | s[39] >>> 24;
            b27 = s[39] << 8 | s[38] >>> 24;
            b8 = s[48] << 14 | s[49] >>> 18;
            b9 = s[49] << 14 | s[48] >>> 18;
            s[0] = b0 ^ ~b2 & b4;
            s[1] = b1 ^ ~b3 & b5;
            s[10] = b10 ^ ~b12 & b14;
            s[11] = b11 ^ ~b13 & b15;
            s[20] = b20 ^ ~b22 & b24;
            s[21] = b21 ^ ~b23 & b25;
            s[30] = b30 ^ ~b32 & b34;
            s[31] = b31 ^ ~b33 & b35;
            s[40] = b40 ^ ~b42 & b44;
            s[41] = b41 ^ ~b43 & b45;
            s[2] = b2 ^ ~b4 & b6;
            s[3] = b3 ^ ~b5 & b7;
            s[12] = b12 ^ ~b14 & b16;
            s[13] = b13 ^ ~b15 & b17;
            s[22] = b22 ^ ~b24 & b26;
            s[23] = b23 ^ ~b25 & b27;
            s[32] = b32 ^ ~b34 & b36;
            s[33] = b33 ^ ~b35 & b37;
            s[42] = b42 ^ ~b44 & b46;
            s[43] = b43 ^ ~b45 & b47;
            s[4] = b4 ^ ~b6 & b8;
            s[5] = b5 ^ ~b7 & b9;
            s[14] = b14 ^ ~b16 & b18;
            s[15] = b15 ^ ~b17 & b19;
            s[24] = b24 ^ ~b26 & b28;
            s[25] = b25 ^ ~b27 & b29;
            s[34] = b34 ^ ~b36 & b38;
            s[35] = b35 ^ ~b37 & b39;
            s[44] = b44 ^ ~b46 & b48;
            s[45] = b45 ^ ~b47 & b49;
            s[6] = b6 ^ ~b8 & b0;
            s[7] = b7 ^ ~b9 & b1;
            s[16] = b16 ^ ~b18 & b10;
            s[17] = b17 ^ ~b19 & b11;
            s[26] = b26 ^ ~b28 & b20;
            s[27] = b27 ^ ~b29 & b21;
            s[36] = b36 ^ ~b38 & b30;
            s[37] = b37 ^ ~b39 & b31;
            s[46] = b46 ^ ~b48 & b40;
            s[47] = b47 ^ ~b49 & b41;
            s[8] = b8 ^ ~b0 & b2;
            s[9] = b9 ^ ~b1 & b3;
            s[18] = b18 ^ ~b10 & b12;
            s[19] = b19 ^ ~b11 & b13;
            s[28] = b28 ^ ~b20 & b22;
            s[29] = b29 ^ ~b21 & b23;
            s[38] = b38 ^ ~b30 & b32;
            s[39] = b39 ^ ~b31 & b33;
            s[48] = b48 ^ ~b40 & b42;
            s[49] = b49 ^ ~b41 & b43;
            s[0] ^= RC[n];
            s[1] ^= RC[n + 1];
          }
        };
        if (COMMON_JS) {
          module.exports = methods;
        } else {
          for (i = 0; i < methodNames.length; ++i) {
            root[methodNames[i]] = methods[methodNames[i]];
          }
          if (AMD) {
            define(function() {
              return methods;
            });
          }
        }
      })();
    }
  });

  // ../../../../../node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/db.json
  var require_db = __commonJS({
    "../../../../../node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/db.json"(exports, module) {
      module.exports = {
        "application/1d-interleaved-parityfec": {
          source: "iana"
        },
        "application/3gpdash-qoe-report+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/3gpp-ims+xml": {
          source: "iana",
          compressible: true
        },
        "application/3gpphal+json": {
          source: "iana",
          compressible: true
        },
        "application/3gpphalforms+json": {
          source: "iana",
          compressible: true
        },
        "application/a2l": {
          source: "iana"
        },
        "application/ace+cbor": {
          source: "iana"
        },
        "application/activemessage": {
          source: "iana"
        },
        "application/activity+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-costmap+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-costmapfilter+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-directory+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-endpointcost+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-endpointcostparams+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-endpointprop+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-endpointpropparams+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-error+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-networkmap+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-networkmapfilter+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-updatestreamcontrol+json": {
          source: "iana",
          compressible: true
        },
        "application/alto-updatestreamparams+json": {
          source: "iana",
          compressible: true
        },
        "application/aml": {
          source: "iana"
        },
        "application/andrew-inset": {
          source: "iana",
          extensions: ["ez"]
        },
        "application/applefile": {
          source: "iana"
        },
        "application/applixware": {
          source: "apache",
          extensions: ["aw"]
        },
        "application/at+jwt": {
          source: "iana"
        },
        "application/atf": {
          source: "iana"
        },
        "application/atfx": {
          source: "iana"
        },
        "application/atom+xml": {
          source: "iana",
          compressible: true,
          extensions: ["atom"]
        },
        "application/atomcat+xml": {
          source: "iana",
          compressible: true,
          extensions: ["atomcat"]
        },
        "application/atomdeleted+xml": {
          source: "iana",
          compressible: true,
          extensions: ["atomdeleted"]
        },
        "application/atomicmail": {
          source: "iana"
        },
        "application/atomsvc+xml": {
          source: "iana",
          compressible: true,
          extensions: ["atomsvc"]
        },
        "application/atsc-dwd+xml": {
          source: "iana",
          compressible: true,
          extensions: ["dwd"]
        },
        "application/atsc-dynamic-event-message": {
          source: "iana"
        },
        "application/atsc-held+xml": {
          source: "iana",
          compressible: true,
          extensions: ["held"]
        },
        "application/atsc-rdt+json": {
          source: "iana",
          compressible: true
        },
        "application/atsc-rsat+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rsat"]
        },
        "application/atxml": {
          source: "iana"
        },
        "application/auth-policy+xml": {
          source: "iana",
          compressible: true
        },
        "application/bacnet-xdd+zip": {
          source: "iana",
          compressible: false
        },
        "application/batch-smtp": {
          source: "iana"
        },
        "application/bdoc": {
          compressible: false,
          extensions: ["bdoc"]
        },
        "application/beep+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/calendar+json": {
          source: "iana",
          compressible: true
        },
        "application/calendar+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xcs"]
        },
        "application/call-completion": {
          source: "iana"
        },
        "application/cals-1840": {
          source: "iana"
        },
        "application/captive+json": {
          source: "iana",
          compressible: true
        },
        "application/cbor": {
          source: "iana"
        },
        "application/cbor-seq": {
          source: "iana"
        },
        "application/cccex": {
          source: "iana"
        },
        "application/ccmp+xml": {
          source: "iana",
          compressible: true
        },
        "application/ccxml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["ccxml"]
        },
        "application/cdfx+xml": {
          source: "iana",
          compressible: true,
          extensions: ["cdfx"]
        },
        "application/cdmi-capability": {
          source: "iana",
          extensions: ["cdmia"]
        },
        "application/cdmi-container": {
          source: "iana",
          extensions: ["cdmic"]
        },
        "application/cdmi-domain": {
          source: "iana",
          extensions: ["cdmid"]
        },
        "application/cdmi-object": {
          source: "iana",
          extensions: ["cdmio"]
        },
        "application/cdmi-queue": {
          source: "iana",
          extensions: ["cdmiq"]
        },
        "application/cdni": {
          source: "iana"
        },
        "application/cea": {
          source: "iana"
        },
        "application/cea-2018+xml": {
          source: "iana",
          compressible: true
        },
        "application/cellml+xml": {
          source: "iana",
          compressible: true
        },
        "application/cfw": {
          source: "iana"
        },
        "application/city+json": {
          source: "iana",
          compressible: true
        },
        "application/clr": {
          source: "iana"
        },
        "application/clue+xml": {
          source: "iana",
          compressible: true
        },
        "application/clue_info+xml": {
          source: "iana",
          compressible: true
        },
        "application/cms": {
          source: "iana"
        },
        "application/cnrp+xml": {
          source: "iana",
          compressible: true
        },
        "application/coap-group+json": {
          source: "iana",
          compressible: true
        },
        "application/coap-payload": {
          source: "iana"
        },
        "application/commonground": {
          source: "iana"
        },
        "application/conference-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/cose": {
          source: "iana"
        },
        "application/cose-key": {
          source: "iana"
        },
        "application/cose-key-set": {
          source: "iana"
        },
        "application/cpl+xml": {
          source: "iana",
          compressible: true,
          extensions: ["cpl"]
        },
        "application/csrattrs": {
          source: "iana"
        },
        "application/csta+xml": {
          source: "iana",
          compressible: true
        },
        "application/cstadata+xml": {
          source: "iana",
          compressible: true
        },
        "application/csvm+json": {
          source: "iana",
          compressible: true
        },
        "application/cu-seeme": {
          source: "apache",
          extensions: ["cu"]
        },
        "application/cwt": {
          source: "iana"
        },
        "application/cybercash": {
          source: "iana"
        },
        "application/dart": {
          compressible: true
        },
        "application/dash+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mpd"]
        },
        "application/dash-patch+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mpp"]
        },
        "application/dashdelta": {
          source: "iana"
        },
        "application/davmount+xml": {
          source: "iana",
          compressible: true,
          extensions: ["davmount"]
        },
        "application/dca-rft": {
          source: "iana"
        },
        "application/dcd": {
          source: "iana"
        },
        "application/dec-dx": {
          source: "iana"
        },
        "application/dialog-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/dicom": {
          source: "iana"
        },
        "application/dicom+json": {
          source: "iana",
          compressible: true
        },
        "application/dicom+xml": {
          source: "iana",
          compressible: true
        },
        "application/dii": {
          source: "iana"
        },
        "application/dit": {
          source: "iana"
        },
        "application/dns": {
          source: "iana"
        },
        "application/dns+json": {
          source: "iana",
          compressible: true
        },
        "application/dns-message": {
          source: "iana"
        },
        "application/docbook+xml": {
          source: "apache",
          compressible: true,
          extensions: ["dbk"]
        },
        "application/dots+cbor": {
          source: "iana"
        },
        "application/dskpp+xml": {
          source: "iana",
          compressible: true
        },
        "application/dssc+der": {
          source: "iana",
          extensions: ["dssc"]
        },
        "application/dssc+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xdssc"]
        },
        "application/dvcs": {
          source: "iana"
        },
        "application/ecmascript": {
          source: "iana",
          compressible: true,
          extensions: ["es", "ecma"]
        },
        "application/edi-consent": {
          source: "iana"
        },
        "application/edi-x12": {
          source: "iana",
          compressible: false
        },
        "application/edifact": {
          source: "iana",
          compressible: false
        },
        "application/efi": {
          source: "iana"
        },
        "application/elm+json": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/elm+xml": {
          source: "iana",
          compressible: true
        },
        "application/emergencycalldata.cap+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/emergencycalldata.comment+xml": {
          source: "iana",
          compressible: true
        },
        "application/emergencycalldata.control+xml": {
          source: "iana",
          compressible: true
        },
        "application/emergencycalldata.deviceinfo+xml": {
          source: "iana",
          compressible: true
        },
        "application/emergencycalldata.ecall.msd": {
          source: "iana"
        },
        "application/emergencycalldata.providerinfo+xml": {
          source: "iana",
          compressible: true
        },
        "application/emergencycalldata.serviceinfo+xml": {
          source: "iana",
          compressible: true
        },
        "application/emergencycalldata.subscriberinfo+xml": {
          source: "iana",
          compressible: true
        },
        "application/emergencycalldata.veds+xml": {
          source: "iana",
          compressible: true
        },
        "application/emma+xml": {
          source: "iana",
          compressible: true,
          extensions: ["emma"]
        },
        "application/emotionml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["emotionml"]
        },
        "application/encaprtp": {
          source: "iana"
        },
        "application/epp+xml": {
          source: "iana",
          compressible: true
        },
        "application/epub+zip": {
          source: "iana",
          compressible: false,
          extensions: ["epub"]
        },
        "application/eshop": {
          source: "iana"
        },
        "application/exi": {
          source: "iana",
          extensions: ["exi"]
        },
        "application/expect-ct-report+json": {
          source: "iana",
          compressible: true
        },
        "application/express": {
          source: "iana",
          extensions: ["exp"]
        },
        "application/fastinfoset": {
          source: "iana"
        },
        "application/fastsoap": {
          source: "iana"
        },
        "application/fdt+xml": {
          source: "iana",
          compressible: true,
          extensions: ["fdt"]
        },
        "application/fhir+json": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/fhir+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/fido.trusted-apps+json": {
          compressible: true
        },
        "application/fits": {
          source: "iana"
        },
        "application/flexfec": {
          source: "iana"
        },
        "application/font-sfnt": {
          source: "iana"
        },
        "application/font-tdpfr": {
          source: "iana",
          extensions: ["pfr"]
        },
        "application/font-woff": {
          source: "iana",
          compressible: false
        },
        "application/framework-attributes+xml": {
          source: "iana",
          compressible: true
        },
        "application/geo+json": {
          source: "iana",
          compressible: true,
          extensions: ["geojson"]
        },
        "application/geo+json-seq": {
          source: "iana"
        },
        "application/geopackage+sqlite3": {
          source: "iana"
        },
        "application/geoxacml+xml": {
          source: "iana",
          compressible: true
        },
        "application/gltf-buffer": {
          source: "iana"
        },
        "application/gml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["gml"]
        },
        "application/gpx+xml": {
          source: "apache",
          compressible: true,
          extensions: ["gpx"]
        },
        "application/gxf": {
          source: "apache",
          extensions: ["gxf"]
        },
        "application/gzip": {
          source: "iana",
          compressible: false,
          extensions: ["gz"]
        },
        "application/h224": {
          source: "iana"
        },
        "application/held+xml": {
          source: "iana",
          compressible: true
        },
        "application/hjson": {
          extensions: ["hjson"]
        },
        "application/http": {
          source: "iana"
        },
        "application/hyperstudio": {
          source: "iana",
          extensions: ["stk"]
        },
        "application/ibe-key-request+xml": {
          source: "iana",
          compressible: true
        },
        "application/ibe-pkg-reply+xml": {
          source: "iana",
          compressible: true
        },
        "application/ibe-pp-data": {
          source: "iana"
        },
        "application/iges": {
          source: "iana"
        },
        "application/im-iscomposing+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/index": {
          source: "iana"
        },
        "application/index.cmd": {
          source: "iana"
        },
        "application/index.obj": {
          source: "iana"
        },
        "application/index.response": {
          source: "iana"
        },
        "application/index.vnd": {
          source: "iana"
        },
        "application/inkml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["ink", "inkml"]
        },
        "application/iotp": {
          source: "iana"
        },
        "application/ipfix": {
          source: "iana",
          extensions: ["ipfix"]
        },
        "application/ipp": {
          source: "iana"
        },
        "application/isup": {
          source: "iana"
        },
        "application/its+xml": {
          source: "iana",
          compressible: true,
          extensions: ["its"]
        },
        "application/java-archive": {
          source: "apache",
          compressible: false,
          extensions: ["jar", "war", "ear"]
        },
        "application/java-serialized-object": {
          source: "apache",
          compressible: false,
          extensions: ["ser"]
        },
        "application/java-vm": {
          source: "apache",
          compressible: false,
          extensions: ["class"]
        },
        "application/javascript": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["js", "mjs"]
        },
        "application/jf2feed+json": {
          source: "iana",
          compressible: true
        },
        "application/jose": {
          source: "iana"
        },
        "application/jose+json": {
          source: "iana",
          compressible: true
        },
        "application/jrd+json": {
          source: "iana",
          compressible: true
        },
        "application/jscalendar+json": {
          source: "iana",
          compressible: true
        },
        "application/json": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["json", "map"]
        },
        "application/json-patch+json": {
          source: "iana",
          compressible: true
        },
        "application/json-seq": {
          source: "iana"
        },
        "application/json5": {
          extensions: ["json5"]
        },
        "application/jsonml+json": {
          source: "apache",
          compressible: true,
          extensions: ["jsonml"]
        },
        "application/jwk+json": {
          source: "iana",
          compressible: true
        },
        "application/jwk-set+json": {
          source: "iana",
          compressible: true
        },
        "application/jwt": {
          source: "iana"
        },
        "application/kpml-request+xml": {
          source: "iana",
          compressible: true
        },
        "application/kpml-response+xml": {
          source: "iana",
          compressible: true
        },
        "application/ld+json": {
          source: "iana",
          compressible: true,
          extensions: ["jsonld"]
        },
        "application/lgr+xml": {
          source: "iana",
          compressible: true,
          extensions: ["lgr"]
        },
        "application/link-format": {
          source: "iana"
        },
        "application/load-control+xml": {
          source: "iana",
          compressible: true
        },
        "application/lost+xml": {
          source: "iana",
          compressible: true,
          extensions: ["lostxml"]
        },
        "application/lostsync+xml": {
          source: "iana",
          compressible: true
        },
        "application/lpf+zip": {
          source: "iana",
          compressible: false
        },
        "application/lxf": {
          source: "iana"
        },
        "application/mac-binhex40": {
          source: "iana",
          extensions: ["hqx"]
        },
        "application/mac-compactpro": {
          source: "apache",
          extensions: ["cpt"]
        },
        "application/macwriteii": {
          source: "iana"
        },
        "application/mads+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mads"]
        },
        "application/manifest+json": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["webmanifest"]
        },
        "application/marc": {
          source: "iana",
          extensions: ["mrc"]
        },
        "application/marcxml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mrcx"]
        },
        "application/mathematica": {
          source: "iana",
          extensions: ["ma", "nb", "mb"]
        },
        "application/mathml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mathml"]
        },
        "application/mathml-content+xml": {
          source: "iana",
          compressible: true
        },
        "application/mathml-presentation+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-associated-procedure-description+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-deregister+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-envelope+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-msk+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-msk-response+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-protection-description+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-reception-report+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-register+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-register-response+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-schedule+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbms-user-service-description+xml": {
          source: "iana",
          compressible: true
        },
        "application/mbox": {
          source: "iana",
          extensions: ["mbox"]
        },
        "application/media-policy-dataset+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mpf"]
        },
        "application/media_control+xml": {
          source: "iana",
          compressible: true
        },
        "application/mediaservercontrol+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mscml"]
        },
        "application/merge-patch+json": {
          source: "iana",
          compressible: true
        },
        "application/metalink+xml": {
          source: "apache",
          compressible: true,
          extensions: ["metalink"]
        },
        "application/metalink4+xml": {
          source: "iana",
          compressible: true,
          extensions: ["meta4"]
        },
        "application/mets+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mets"]
        },
        "application/mf4": {
          source: "iana"
        },
        "application/mikey": {
          source: "iana"
        },
        "application/mipc": {
          source: "iana"
        },
        "application/missing-blocks+cbor-seq": {
          source: "iana"
        },
        "application/mmt-aei+xml": {
          source: "iana",
          compressible: true,
          extensions: ["maei"]
        },
        "application/mmt-usd+xml": {
          source: "iana",
          compressible: true,
          extensions: ["musd"]
        },
        "application/mods+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mods"]
        },
        "application/moss-keys": {
          source: "iana"
        },
        "application/moss-signature": {
          source: "iana"
        },
        "application/mosskey-data": {
          source: "iana"
        },
        "application/mosskey-request": {
          source: "iana"
        },
        "application/mp21": {
          source: "iana",
          extensions: ["m21", "mp21"]
        },
        "application/mp4": {
          source: "iana",
          extensions: ["mp4s", "m4p"]
        },
        "application/mpeg4-generic": {
          source: "iana"
        },
        "application/mpeg4-iod": {
          source: "iana"
        },
        "application/mpeg4-iod-xmt": {
          source: "iana"
        },
        "application/mrb-consumer+xml": {
          source: "iana",
          compressible: true
        },
        "application/mrb-publish+xml": {
          source: "iana",
          compressible: true
        },
        "application/msc-ivr+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/msc-mixer+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/msword": {
          source: "iana",
          compressible: false,
          extensions: ["doc", "dot"]
        },
        "application/mud+json": {
          source: "iana",
          compressible: true
        },
        "application/multipart-core": {
          source: "iana"
        },
        "application/mxf": {
          source: "iana",
          extensions: ["mxf"]
        },
        "application/n-quads": {
          source: "iana",
          extensions: ["nq"]
        },
        "application/n-triples": {
          source: "iana",
          extensions: ["nt"]
        },
        "application/nasdata": {
          source: "iana"
        },
        "application/news-checkgroups": {
          source: "iana",
          charset: "US-ASCII"
        },
        "application/news-groupinfo": {
          source: "iana",
          charset: "US-ASCII"
        },
        "application/news-transmission": {
          source: "iana"
        },
        "application/nlsml+xml": {
          source: "iana",
          compressible: true
        },
        "application/node": {
          source: "iana",
          extensions: ["cjs"]
        },
        "application/nss": {
          source: "iana"
        },
        "application/oauth-authz-req+jwt": {
          source: "iana"
        },
        "application/oblivious-dns-message": {
          source: "iana"
        },
        "application/ocsp-request": {
          source: "iana"
        },
        "application/ocsp-response": {
          source: "iana"
        },
        "application/octet-stream": {
          source: "iana",
          compressible: false,
          extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
        },
        "application/oda": {
          source: "iana",
          extensions: ["oda"]
        },
        "application/odm+xml": {
          source: "iana",
          compressible: true
        },
        "application/odx": {
          source: "iana"
        },
        "application/oebps-package+xml": {
          source: "iana",
          compressible: true,
          extensions: ["opf"]
        },
        "application/ogg": {
          source: "iana",
          compressible: false,
          extensions: ["ogx"]
        },
        "application/omdoc+xml": {
          source: "apache",
          compressible: true,
          extensions: ["omdoc"]
        },
        "application/onenote": {
          source: "apache",
          extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
        },
        "application/opc-nodeset+xml": {
          source: "iana",
          compressible: true
        },
        "application/oscore": {
          source: "iana"
        },
        "application/oxps": {
          source: "iana",
          extensions: ["oxps"]
        },
        "application/p21": {
          source: "iana"
        },
        "application/p21+zip": {
          source: "iana",
          compressible: false
        },
        "application/p2p-overlay+xml": {
          source: "iana",
          compressible: true,
          extensions: ["relo"]
        },
        "application/parityfec": {
          source: "iana"
        },
        "application/passport": {
          source: "iana"
        },
        "application/patch-ops-error+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xer"]
        },
        "application/pdf": {
          source: "iana",
          compressible: false,
          extensions: ["pdf"]
        },
        "application/pdx": {
          source: "iana"
        },
        "application/pem-certificate-chain": {
          source: "iana"
        },
        "application/pgp-encrypted": {
          source: "iana",
          compressible: false,
          extensions: ["pgp"]
        },
        "application/pgp-keys": {
          source: "iana",
          extensions: ["asc"]
        },
        "application/pgp-signature": {
          source: "iana",
          extensions: ["asc", "sig"]
        },
        "application/pics-rules": {
          source: "apache",
          extensions: ["prf"]
        },
        "application/pidf+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/pidf-diff+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/pkcs10": {
          source: "iana",
          extensions: ["p10"]
        },
        "application/pkcs12": {
          source: "iana"
        },
        "application/pkcs7-mime": {
          source: "iana",
          extensions: ["p7m", "p7c"]
        },
        "application/pkcs7-signature": {
          source: "iana",
          extensions: ["p7s"]
        },
        "application/pkcs8": {
          source: "iana",
          extensions: ["p8"]
        },
        "application/pkcs8-encrypted": {
          source: "iana"
        },
        "application/pkix-attr-cert": {
          source: "iana",
          extensions: ["ac"]
        },
        "application/pkix-cert": {
          source: "iana",
          extensions: ["cer"]
        },
        "application/pkix-crl": {
          source: "iana",
          extensions: ["crl"]
        },
        "application/pkix-pkipath": {
          source: "iana",
          extensions: ["pkipath"]
        },
        "application/pkixcmp": {
          source: "iana",
          extensions: ["pki"]
        },
        "application/pls+xml": {
          source: "iana",
          compressible: true,
          extensions: ["pls"]
        },
        "application/poc-settings+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/postscript": {
          source: "iana",
          compressible: true,
          extensions: ["ai", "eps", "ps"]
        },
        "application/ppsp-tracker+json": {
          source: "iana",
          compressible: true
        },
        "application/problem+json": {
          source: "iana",
          compressible: true
        },
        "application/problem+xml": {
          source: "iana",
          compressible: true
        },
        "application/provenance+xml": {
          source: "iana",
          compressible: true,
          extensions: ["provx"]
        },
        "application/prs.alvestrand.titrax-sheet": {
          source: "iana"
        },
        "application/prs.cww": {
          source: "iana",
          extensions: ["cww"]
        },
        "application/prs.cyn": {
          source: "iana",
          charset: "7-BIT"
        },
        "application/prs.hpub+zip": {
          source: "iana",
          compressible: false
        },
        "application/prs.nprend": {
          source: "iana"
        },
        "application/prs.plucker": {
          source: "iana"
        },
        "application/prs.rdf-xml-crypt": {
          source: "iana"
        },
        "application/prs.xsf+xml": {
          source: "iana",
          compressible: true
        },
        "application/pskc+xml": {
          source: "iana",
          compressible: true,
          extensions: ["pskcxml"]
        },
        "application/pvd+json": {
          source: "iana",
          compressible: true
        },
        "application/qsig": {
          source: "iana"
        },
        "application/raml+yaml": {
          compressible: true,
          extensions: ["raml"]
        },
        "application/raptorfec": {
          source: "iana"
        },
        "application/rdap+json": {
          source: "iana",
          compressible: true
        },
        "application/rdf+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rdf", "owl"]
        },
        "application/reginfo+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rif"]
        },
        "application/relax-ng-compact-syntax": {
          source: "iana",
          extensions: ["rnc"]
        },
        "application/remote-printing": {
          source: "iana"
        },
        "application/reputon+json": {
          source: "iana",
          compressible: true
        },
        "application/resource-lists+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rl"]
        },
        "application/resource-lists-diff+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rld"]
        },
        "application/rfc+xml": {
          source: "iana",
          compressible: true
        },
        "application/riscos": {
          source: "iana"
        },
        "application/rlmi+xml": {
          source: "iana",
          compressible: true
        },
        "application/rls-services+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rs"]
        },
        "application/route-apd+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rapd"]
        },
        "application/route-s-tsid+xml": {
          source: "iana",
          compressible: true,
          extensions: ["sls"]
        },
        "application/route-usd+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rusd"]
        },
        "application/rpki-ghostbusters": {
          source: "iana",
          extensions: ["gbr"]
        },
        "application/rpki-manifest": {
          source: "iana",
          extensions: ["mft"]
        },
        "application/rpki-publication": {
          source: "iana"
        },
        "application/rpki-roa": {
          source: "iana",
          extensions: ["roa"]
        },
        "application/rpki-updown": {
          source: "iana"
        },
        "application/rsd+xml": {
          source: "apache",
          compressible: true,
          extensions: ["rsd"]
        },
        "application/rss+xml": {
          source: "apache",
          compressible: true,
          extensions: ["rss"]
        },
        "application/rtf": {
          source: "iana",
          compressible: true,
          extensions: ["rtf"]
        },
        "application/rtploopback": {
          source: "iana"
        },
        "application/rtx": {
          source: "iana"
        },
        "application/samlassertion+xml": {
          source: "iana",
          compressible: true
        },
        "application/samlmetadata+xml": {
          source: "iana",
          compressible: true
        },
        "application/sarif+json": {
          source: "iana",
          compressible: true
        },
        "application/sarif-external-properties+json": {
          source: "iana",
          compressible: true
        },
        "application/sbe": {
          source: "iana"
        },
        "application/sbml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["sbml"]
        },
        "application/scaip+xml": {
          source: "iana",
          compressible: true
        },
        "application/scim+json": {
          source: "iana",
          compressible: true
        },
        "application/scvp-cv-request": {
          source: "iana",
          extensions: ["scq"]
        },
        "application/scvp-cv-response": {
          source: "iana",
          extensions: ["scs"]
        },
        "application/scvp-vp-request": {
          source: "iana",
          extensions: ["spq"]
        },
        "application/scvp-vp-response": {
          source: "iana",
          extensions: ["spp"]
        },
        "application/sdp": {
          source: "iana",
          extensions: ["sdp"]
        },
        "application/secevent+jwt": {
          source: "iana"
        },
        "application/senml+cbor": {
          source: "iana"
        },
        "application/senml+json": {
          source: "iana",
          compressible: true
        },
        "application/senml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["senmlx"]
        },
        "application/senml-etch+cbor": {
          source: "iana"
        },
        "application/senml-etch+json": {
          source: "iana",
          compressible: true
        },
        "application/senml-exi": {
          source: "iana"
        },
        "application/sensml+cbor": {
          source: "iana"
        },
        "application/sensml+json": {
          source: "iana",
          compressible: true
        },
        "application/sensml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["sensmlx"]
        },
        "application/sensml-exi": {
          source: "iana"
        },
        "application/sep+xml": {
          source: "iana",
          compressible: true
        },
        "application/sep-exi": {
          source: "iana"
        },
        "application/session-info": {
          source: "iana"
        },
        "application/set-payment": {
          source: "iana"
        },
        "application/set-payment-initiation": {
          source: "iana",
          extensions: ["setpay"]
        },
        "application/set-registration": {
          source: "iana"
        },
        "application/set-registration-initiation": {
          source: "iana",
          extensions: ["setreg"]
        },
        "application/sgml": {
          source: "iana"
        },
        "application/sgml-open-catalog": {
          source: "iana"
        },
        "application/shf+xml": {
          source: "iana",
          compressible: true,
          extensions: ["shf"]
        },
        "application/sieve": {
          source: "iana",
          extensions: ["siv", "sieve"]
        },
        "application/simple-filter+xml": {
          source: "iana",
          compressible: true
        },
        "application/simple-message-summary": {
          source: "iana"
        },
        "application/simplesymbolcontainer": {
          source: "iana"
        },
        "application/sipc": {
          source: "iana"
        },
        "application/slate": {
          source: "iana"
        },
        "application/smil": {
          source: "iana"
        },
        "application/smil+xml": {
          source: "iana",
          compressible: true,
          extensions: ["smi", "smil"]
        },
        "application/smpte336m": {
          source: "iana"
        },
        "application/soap+fastinfoset": {
          source: "iana"
        },
        "application/soap+xml": {
          source: "iana",
          compressible: true
        },
        "application/sparql-query": {
          source: "iana",
          extensions: ["rq"]
        },
        "application/sparql-results+xml": {
          source: "iana",
          compressible: true,
          extensions: ["srx"]
        },
        "application/spdx+json": {
          source: "iana",
          compressible: true
        },
        "application/spirits-event+xml": {
          source: "iana",
          compressible: true
        },
        "application/sql": {
          source: "iana"
        },
        "application/srgs": {
          source: "iana",
          extensions: ["gram"]
        },
        "application/srgs+xml": {
          source: "iana",
          compressible: true,
          extensions: ["grxml"]
        },
        "application/sru+xml": {
          source: "iana",
          compressible: true,
          extensions: ["sru"]
        },
        "application/ssdl+xml": {
          source: "apache",
          compressible: true,
          extensions: ["ssdl"]
        },
        "application/ssml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["ssml"]
        },
        "application/stix+json": {
          source: "iana",
          compressible: true
        },
        "application/swid+xml": {
          source: "iana",
          compressible: true,
          extensions: ["swidtag"]
        },
        "application/tamp-apex-update": {
          source: "iana"
        },
        "application/tamp-apex-update-confirm": {
          source: "iana"
        },
        "application/tamp-community-update": {
          source: "iana"
        },
        "application/tamp-community-update-confirm": {
          source: "iana"
        },
        "application/tamp-error": {
          source: "iana"
        },
        "application/tamp-sequence-adjust": {
          source: "iana"
        },
        "application/tamp-sequence-adjust-confirm": {
          source: "iana"
        },
        "application/tamp-status-query": {
          source: "iana"
        },
        "application/tamp-status-response": {
          source: "iana"
        },
        "application/tamp-update": {
          source: "iana"
        },
        "application/tamp-update-confirm": {
          source: "iana"
        },
        "application/tar": {
          compressible: true
        },
        "application/taxii+json": {
          source: "iana",
          compressible: true
        },
        "application/td+json": {
          source: "iana",
          compressible: true
        },
        "application/tei+xml": {
          source: "iana",
          compressible: true,
          extensions: ["tei", "teicorpus"]
        },
        "application/tetra_isi": {
          source: "iana"
        },
        "application/thraud+xml": {
          source: "iana",
          compressible: true,
          extensions: ["tfi"]
        },
        "application/timestamp-query": {
          source: "iana"
        },
        "application/timestamp-reply": {
          source: "iana"
        },
        "application/timestamped-data": {
          source: "iana",
          extensions: ["tsd"]
        },
        "application/tlsrpt+gzip": {
          source: "iana"
        },
        "application/tlsrpt+json": {
          source: "iana",
          compressible: true
        },
        "application/tnauthlist": {
          source: "iana"
        },
        "application/token-introspection+jwt": {
          source: "iana"
        },
        "application/toml": {
          compressible: true,
          extensions: ["toml"]
        },
        "application/trickle-ice-sdpfrag": {
          source: "iana"
        },
        "application/trig": {
          source: "iana",
          extensions: ["trig"]
        },
        "application/ttml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["ttml"]
        },
        "application/tve-trigger": {
          source: "iana"
        },
        "application/tzif": {
          source: "iana"
        },
        "application/tzif-leap": {
          source: "iana"
        },
        "application/ubjson": {
          compressible: false,
          extensions: ["ubj"]
        },
        "application/ulpfec": {
          source: "iana"
        },
        "application/urc-grpsheet+xml": {
          source: "iana",
          compressible: true
        },
        "application/urc-ressheet+xml": {
          source: "iana",
          compressible: true,
          extensions: ["rsheet"]
        },
        "application/urc-targetdesc+xml": {
          source: "iana",
          compressible: true,
          extensions: ["td"]
        },
        "application/urc-uisocketdesc+xml": {
          source: "iana",
          compressible: true
        },
        "application/vcard+json": {
          source: "iana",
          compressible: true
        },
        "application/vcard+xml": {
          source: "iana",
          compressible: true
        },
        "application/vemmi": {
          source: "iana"
        },
        "application/vividence.scriptfile": {
          source: "apache"
        },
        "application/vnd.1000minds.decision-model+xml": {
          source: "iana",
          compressible: true,
          extensions: ["1km"]
        },
        "application/vnd.3gpp-prose+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp-prose-pc3ch+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp-v2x-local-service-information": {
          source: "iana"
        },
        "application/vnd.3gpp.5gnas": {
          source: "iana"
        },
        "application/vnd.3gpp.access-transfer-events+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.bsf+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.gmop+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.gtpc": {
          source: "iana"
        },
        "application/vnd.3gpp.interworking-data": {
          source: "iana"
        },
        "application/vnd.3gpp.lpp": {
          source: "iana"
        },
        "application/vnd.3gpp.mc-signalling-ear": {
          source: "iana"
        },
        "application/vnd.3gpp.mcdata-affiliation-command+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcdata-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcdata-payload": {
          source: "iana"
        },
        "application/vnd.3gpp.mcdata-service-config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcdata-signalling": {
          source: "iana"
        },
        "application/vnd.3gpp.mcdata-ue-config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcdata-user-profile+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-affiliation-command+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-floor-request+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-location-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-service-config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-signed+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-ue-config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-ue-init-config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcptt-user-profile+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-location-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-service-config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-transmission-request+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-ue-config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mcvideo-user-profile+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.mid-call+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.ngap": {
          source: "iana"
        },
        "application/vnd.3gpp.pfcp": {
          source: "iana"
        },
        "application/vnd.3gpp.pic-bw-large": {
          source: "iana",
          extensions: ["plb"]
        },
        "application/vnd.3gpp.pic-bw-small": {
          source: "iana",
          extensions: ["psb"]
        },
        "application/vnd.3gpp.pic-bw-var": {
          source: "iana",
          extensions: ["pvb"]
        },
        "application/vnd.3gpp.s1ap": {
          source: "iana"
        },
        "application/vnd.3gpp.sms": {
          source: "iana"
        },
        "application/vnd.3gpp.sms+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.srvcc-ext+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.srvcc-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.state-and-event-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp.ussd+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp2.bcmcsinfo+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.3gpp2.sms": {
          source: "iana"
        },
        "application/vnd.3gpp2.tcap": {
          source: "iana",
          extensions: ["tcap"]
        },
        "application/vnd.3lightssoftware.imagescal": {
          source: "iana"
        },
        "application/vnd.3m.post-it-notes": {
          source: "iana",
          extensions: ["pwn"]
        },
        "application/vnd.accpac.simply.aso": {
          source: "iana",
          extensions: ["aso"]
        },
        "application/vnd.accpac.simply.imp": {
          source: "iana",
          extensions: ["imp"]
        },
        "application/vnd.acucobol": {
          source: "iana",
          extensions: ["acu"]
        },
        "application/vnd.acucorp": {
          source: "iana",
          extensions: ["atc", "acutc"]
        },
        "application/vnd.adobe.air-application-installer-package+zip": {
          source: "apache",
          compressible: false,
          extensions: ["air"]
        },
        "application/vnd.adobe.flash.movie": {
          source: "iana"
        },
        "application/vnd.adobe.formscentral.fcdt": {
          source: "iana",
          extensions: ["fcdt"]
        },
        "application/vnd.adobe.fxp": {
          source: "iana",
          extensions: ["fxp", "fxpl"]
        },
        "application/vnd.adobe.partial-upload": {
          source: "iana"
        },
        "application/vnd.adobe.xdp+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xdp"]
        },
        "application/vnd.adobe.xfdf": {
          source: "iana",
          extensions: ["xfdf"]
        },
        "application/vnd.aether.imp": {
          source: "iana"
        },
        "application/vnd.afpc.afplinedata": {
          source: "iana"
        },
        "application/vnd.afpc.afplinedata-pagedef": {
          source: "iana"
        },
        "application/vnd.afpc.cmoca-cmresource": {
          source: "iana"
        },
        "application/vnd.afpc.foca-charset": {
          source: "iana"
        },
        "application/vnd.afpc.foca-codedfont": {
          source: "iana"
        },
        "application/vnd.afpc.foca-codepage": {
          source: "iana"
        },
        "application/vnd.afpc.modca": {
          source: "iana"
        },
        "application/vnd.afpc.modca-cmtable": {
          source: "iana"
        },
        "application/vnd.afpc.modca-formdef": {
          source: "iana"
        },
        "application/vnd.afpc.modca-mediummap": {
          source: "iana"
        },
        "application/vnd.afpc.modca-objectcontainer": {
          source: "iana"
        },
        "application/vnd.afpc.modca-overlay": {
          source: "iana"
        },
        "application/vnd.afpc.modca-pagesegment": {
          source: "iana"
        },
        "application/vnd.age": {
          source: "iana",
          extensions: ["age"]
        },
        "application/vnd.ah-barcode": {
          source: "iana"
        },
        "application/vnd.ahead.space": {
          source: "iana",
          extensions: ["ahead"]
        },
        "application/vnd.airzip.filesecure.azf": {
          source: "iana",
          extensions: ["azf"]
        },
        "application/vnd.airzip.filesecure.azs": {
          source: "iana",
          extensions: ["azs"]
        },
        "application/vnd.amadeus+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.amazon.ebook": {
          source: "apache",
          extensions: ["azw"]
        },
        "application/vnd.amazon.mobi8-ebook": {
          source: "iana"
        },
        "application/vnd.americandynamics.acc": {
          source: "iana",
          extensions: ["acc"]
        },
        "application/vnd.amiga.ami": {
          source: "iana",
          extensions: ["ami"]
        },
        "application/vnd.amundsen.maze+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.android.ota": {
          source: "iana"
        },
        "application/vnd.android.package-archive": {
          source: "apache",
          compressible: false,
          extensions: ["apk"]
        },
        "application/vnd.anki": {
          source: "iana"
        },
        "application/vnd.anser-web-certificate-issue-initiation": {
          source: "iana",
          extensions: ["cii"]
        },
        "application/vnd.anser-web-funds-transfer-initiation": {
          source: "apache",
          extensions: ["fti"]
        },
        "application/vnd.antix.game-component": {
          source: "iana",
          extensions: ["atx"]
        },
        "application/vnd.apache.arrow.file": {
          source: "iana"
        },
        "application/vnd.apache.arrow.stream": {
          source: "iana"
        },
        "application/vnd.apache.thrift.binary": {
          source: "iana"
        },
        "application/vnd.apache.thrift.compact": {
          source: "iana"
        },
        "application/vnd.apache.thrift.json": {
          source: "iana"
        },
        "application/vnd.api+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.aplextor.warrp+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.apothekende.reservation+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.apple.installer+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mpkg"]
        },
        "application/vnd.apple.keynote": {
          source: "iana",
          extensions: ["key"]
        },
        "application/vnd.apple.mpegurl": {
          source: "iana",
          extensions: ["m3u8"]
        },
        "application/vnd.apple.numbers": {
          source: "iana",
          extensions: ["numbers"]
        },
        "application/vnd.apple.pages": {
          source: "iana",
          extensions: ["pages"]
        },
        "application/vnd.apple.pkpass": {
          compressible: false,
          extensions: ["pkpass"]
        },
        "application/vnd.arastra.swi": {
          source: "iana"
        },
        "application/vnd.aristanetworks.swi": {
          source: "iana",
          extensions: ["swi"]
        },
        "application/vnd.artisan+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.artsquare": {
          source: "iana"
        },
        "application/vnd.astraea-software.iota": {
          source: "iana",
          extensions: ["iota"]
        },
        "application/vnd.audiograph": {
          source: "iana",
          extensions: ["aep"]
        },
        "application/vnd.autopackage": {
          source: "iana"
        },
        "application/vnd.avalon+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.avistar+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.balsamiq.bmml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["bmml"]
        },
        "application/vnd.balsamiq.bmpr": {
          source: "iana"
        },
        "application/vnd.banana-accounting": {
          source: "iana"
        },
        "application/vnd.bbf.usp.error": {
          source: "iana"
        },
        "application/vnd.bbf.usp.msg": {
          source: "iana"
        },
        "application/vnd.bbf.usp.msg+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.bekitzur-stech+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.bint.med-content": {
          source: "iana"
        },
        "application/vnd.biopax.rdf+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.blink-idb-value-wrapper": {
          source: "iana"
        },
        "application/vnd.blueice.multipass": {
          source: "iana",
          extensions: ["mpm"]
        },
        "application/vnd.bluetooth.ep.oob": {
          source: "iana"
        },
        "application/vnd.bluetooth.le.oob": {
          source: "iana"
        },
        "application/vnd.bmi": {
          source: "iana",
          extensions: ["bmi"]
        },
        "application/vnd.bpf": {
          source: "iana"
        },
        "application/vnd.bpf3": {
          source: "iana"
        },
        "application/vnd.businessobjects": {
          source: "iana",
          extensions: ["rep"]
        },
        "application/vnd.byu.uapi+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.cab-jscript": {
          source: "iana"
        },
        "application/vnd.canon-cpdl": {
          source: "iana"
        },
        "application/vnd.canon-lips": {
          source: "iana"
        },
        "application/vnd.capasystems-pg+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.cendio.thinlinc.clientconf": {
          source: "iana"
        },
        "application/vnd.century-systems.tcp_stream": {
          source: "iana"
        },
        "application/vnd.chemdraw+xml": {
          source: "iana",
          compressible: true,
          extensions: ["cdxml"]
        },
        "application/vnd.chess-pgn": {
          source: "iana"
        },
        "application/vnd.chipnuts.karaoke-mmd": {
          source: "iana",
          extensions: ["mmd"]
        },
        "application/vnd.ciedi": {
          source: "iana"
        },
        "application/vnd.cinderella": {
          source: "iana",
          extensions: ["cdy"]
        },
        "application/vnd.cirpack.isdn-ext": {
          source: "iana"
        },
        "application/vnd.citationstyles.style+xml": {
          source: "iana",
          compressible: true,
          extensions: ["csl"]
        },
        "application/vnd.claymore": {
          source: "iana",
          extensions: ["cla"]
        },
        "application/vnd.cloanto.rp9": {
          source: "iana",
          extensions: ["rp9"]
        },
        "application/vnd.clonk.c4group": {
          source: "iana",
          extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
        },
        "application/vnd.cluetrust.cartomobile-config": {
          source: "iana",
          extensions: ["c11amc"]
        },
        "application/vnd.cluetrust.cartomobile-config-pkg": {
          source: "iana",
          extensions: ["c11amz"]
        },
        "application/vnd.coffeescript": {
          source: "iana"
        },
        "application/vnd.collabio.xodocuments.document": {
          source: "iana"
        },
        "application/vnd.collabio.xodocuments.document-template": {
          source: "iana"
        },
        "application/vnd.collabio.xodocuments.presentation": {
          source: "iana"
        },
        "application/vnd.collabio.xodocuments.presentation-template": {
          source: "iana"
        },
        "application/vnd.collabio.xodocuments.spreadsheet": {
          source: "iana"
        },
        "application/vnd.collabio.xodocuments.spreadsheet-template": {
          source: "iana"
        },
        "application/vnd.collection+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.collection.doc+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.collection.next+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.comicbook+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.comicbook-rar": {
          source: "iana"
        },
        "application/vnd.commerce-battelle": {
          source: "iana"
        },
        "application/vnd.commonspace": {
          source: "iana",
          extensions: ["csp"]
        },
        "application/vnd.contact.cmsg": {
          source: "iana",
          extensions: ["cdbcmsg"]
        },
        "application/vnd.coreos.ignition+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.cosmocaller": {
          source: "iana",
          extensions: ["cmc"]
        },
        "application/vnd.crick.clicker": {
          source: "iana",
          extensions: ["clkx"]
        },
        "application/vnd.crick.clicker.keyboard": {
          source: "iana",
          extensions: ["clkk"]
        },
        "application/vnd.crick.clicker.palette": {
          source: "iana",
          extensions: ["clkp"]
        },
        "application/vnd.crick.clicker.template": {
          source: "iana",
          extensions: ["clkt"]
        },
        "application/vnd.crick.clicker.wordbank": {
          source: "iana",
          extensions: ["clkw"]
        },
        "application/vnd.criticaltools.wbs+xml": {
          source: "iana",
          compressible: true,
          extensions: ["wbs"]
        },
        "application/vnd.cryptii.pipe+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.crypto-shade-file": {
          source: "iana"
        },
        "application/vnd.cryptomator.encrypted": {
          source: "iana"
        },
        "application/vnd.cryptomator.vault": {
          source: "iana"
        },
        "application/vnd.ctc-posml": {
          source: "iana",
          extensions: ["pml"]
        },
        "application/vnd.ctct.ws+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.cups-pdf": {
          source: "iana"
        },
        "application/vnd.cups-postscript": {
          source: "iana"
        },
        "application/vnd.cups-ppd": {
          source: "iana",
          extensions: ["ppd"]
        },
        "application/vnd.cups-raster": {
          source: "iana"
        },
        "application/vnd.cups-raw": {
          source: "iana"
        },
        "application/vnd.curl": {
          source: "iana"
        },
        "application/vnd.curl.car": {
          source: "apache",
          extensions: ["car"]
        },
        "application/vnd.curl.pcurl": {
          source: "apache",
          extensions: ["pcurl"]
        },
        "application/vnd.cyan.dean.root+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.cybank": {
          source: "iana"
        },
        "application/vnd.cyclonedx+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.cyclonedx+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.d2l.coursepackage1p0+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.d3m-dataset": {
          source: "iana"
        },
        "application/vnd.d3m-problem": {
          source: "iana"
        },
        "application/vnd.dart": {
          source: "iana",
          compressible: true,
          extensions: ["dart"]
        },
        "application/vnd.data-vision.rdz": {
          source: "iana",
          extensions: ["rdz"]
        },
        "application/vnd.datapackage+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dataresource+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dbf": {
          source: "iana",
          extensions: ["dbf"]
        },
        "application/vnd.debian.binary-package": {
          source: "iana"
        },
        "application/vnd.dece.data": {
          source: "iana",
          extensions: ["uvf", "uvvf", "uvd", "uvvd"]
        },
        "application/vnd.dece.ttml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["uvt", "uvvt"]
        },
        "application/vnd.dece.unspecified": {
          source: "iana",
          extensions: ["uvx", "uvvx"]
        },
        "application/vnd.dece.zip": {
          source: "iana",
          extensions: ["uvz", "uvvz"]
        },
        "application/vnd.denovo.fcselayout-link": {
          source: "iana",
          extensions: ["fe_launch"]
        },
        "application/vnd.desmume.movie": {
          source: "iana"
        },
        "application/vnd.dir-bi.plate-dl-nosuffix": {
          source: "iana"
        },
        "application/vnd.dm.delegation+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dna": {
          source: "iana",
          extensions: ["dna"]
        },
        "application/vnd.document+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dolby.mlp": {
          source: "apache",
          extensions: ["mlp"]
        },
        "application/vnd.dolby.mobile.1": {
          source: "iana"
        },
        "application/vnd.dolby.mobile.2": {
          source: "iana"
        },
        "application/vnd.doremir.scorecloud-binary-document": {
          source: "iana"
        },
        "application/vnd.dpgraph": {
          source: "iana",
          extensions: ["dpg"]
        },
        "application/vnd.dreamfactory": {
          source: "iana",
          extensions: ["dfac"]
        },
        "application/vnd.drive+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ds-keypoint": {
          source: "apache",
          extensions: ["kpxx"]
        },
        "application/vnd.dtg.local": {
          source: "iana"
        },
        "application/vnd.dtg.local.flash": {
          source: "iana"
        },
        "application/vnd.dtg.local.html": {
          source: "iana"
        },
        "application/vnd.dvb.ait": {
          source: "iana",
          extensions: ["ait"]
        },
        "application/vnd.dvb.dvbisl+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.dvbj": {
          source: "iana"
        },
        "application/vnd.dvb.esgcontainer": {
          source: "iana"
        },
        "application/vnd.dvb.ipdcdftnotifaccess": {
          source: "iana"
        },
        "application/vnd.dvb.ipdcesgaccess": {
          source: "iana"
        },
        "application/vnd.dvb.ipdcesgaccess2": {
          source: "iana"
        },
        "application/vnd.dvb.ipdcesgpdd": {
          source: "iana"
        },
        "application/vnd.dvb.ipdcroaming": {
          source: "iana"
        },
        "application/vnd.dvb.iptv.alfec-base": {
          source: "iana"
        },
        "application/vnd.dvb.iptv.alfec-enhancement": {
          source: "iana"
        },
        "application/vnd.dvb.notif-aggregate-root+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.notif-container+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.notif-generic+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.notif-ia-msglist+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.notif-ia-registration-request+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.notif-ia-registration-response+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.notif-init+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.dvb.pfr": {
          source: "iana"
        },
        "application/vnd.dvb.service": {
          source: "iana",
          extensions: ["svc"]
        },
        "application/vnd.dxr": {
          source: "iana"
        },
        "application/vnd.dynageo": {
          source: "iana",
          extensions: ["geo"]
        },
        "application/vnd.dzr": {
          source: "iana"
        },
        "application/vnd.easykaraoke.cdgdownload": {
          source: "iana"
        },
        "application/vnd.ecdis-update": {
          source: "iana"
        },
        "application/vnd.ecip.rlp": {
          source: "iana"
        },
        "application/vnd.eclipse.ditto+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ecowin.chart": {
          source: "iana",
          extensions: ["mag"]
        },
        "application/vnd.ecowin.filerequest": {
          source: "iana"
        },
        "application/vnd.ecowin.fileupdate": {
          source: "iana"
        },
        "application/vnd.ecowin.series": {
          source: "iana"
        },
        "application/vnd.ecowin.seriesrequest": {
          source: "iana"
        },
        "application/vnd.ecowin.seriesupdate": {
          source: "iana"
        },
        "application/vnd.efi.img": {
          source: "iana"
        },
        "application/vnd.efi.iso": {
          source: "iana"
        },
        "application/vnd.emclient.accessrequest+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.enliven": {
          source: "iana",
          extensions: ["nml"]
        },
        "application/vnd.enphase.envoy": {
          source: "iana"
        },
        "application/vnd.eprints.data+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.epson.esf": {
          source: "iana",
          extensions: ["esf"]
        },
        "application/vnd.epson.msf": {
          source: "iana",
          extensions: ["msf"]
        },
        "application/vnd.epson.quickanime": {
          source: "iana",
          extensions: ["qam"]
        },
        "application/vnd.epson.salt": {
          source: "iana",
          extensions: ["slt"]
        },
        "application/vnd.epson.ssf": {
          source: "iana",
          extensions: ["ssf"]
        },
        "application/vnd.ericsson.quickcall": {
          source: "iana"
        },
        "application/vnd.espass-espass+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.eszigno3+xml": {
          source: "iana",
          compressible: true,
          extensions: ["es3", "et3"]
        },
        "application/vnd.etsi.aoc+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.asic-e+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.etsi.asic-s+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.etsi.cug+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvcommand+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvdiscovery+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvprofile+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvsad-bc+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvsad-cod+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvsad-npvr+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvservice+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvsync+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.iptvueprofile+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.mcid+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.mheg5": {
          source: "iana"
        },
        "application/vnd.etsi.overload-control-policy-dataset+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.pstn+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.sci+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.simservs+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.timestamp-token": {
          source: "iana"
        },
        "application/vnd.etsi.tsl+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.etsi.tsl.der": {
          source: "iana"
        },
        "application/vnd.eu.kasparian.car+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.eudora.data": {
          source: "iana"
        },
        "application/vnd.evolv.ecig.profile": {
          source: "iana"
        },
        "application/vnd.evolv.ecig.settings": {
          source: "iana"
        },
        "application/vnd.evolv.ecig.theme": {
          source: "iana"
        },
        "application/vnd.exstream-empower+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.exstream-package": {
          source: "iana"
        },
        "application/vnd.ezpix-album": {
          source: "iana",
          extensions: ["ez2"]
        },
        "application/vnd.ezpix-package": {
          source: "iana",
          extensions: ["ez3"]
        },
        "application/vnd.f-secure.mobile": {
          source: "iana"
        },
        "application/vnd.familysearch.gedcom+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.fastcopy-disk-image": {
          source: "iana"
        },
        "application/vnd.fdf": {
          source: "iana",
          extensions: ["fdf"]
        },
        "application/vnd.fdsn.mseed": {
          source: "iana",
          extensions: ["mseed"]
        },
        "application/vnd.fdsn.seed": {
          source: "iana",
          extensions: ["seed", "dataless"]
        },
        "application/vnd.ffsns": {
          source: "iana"
        },
        "application/vnd.ficlab.flb+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.filmit.zfc": {
          source: "iana"
        },
        "application/vnd.fints": {
          source: "iana"
        },
        "application/vnd.firemonkeys.cloudcell": {
          source: "iana"
        },
        "application/vnd.flographit": {
          source: "iana",
          extensions: ["gph"]
        },
        "application/vnd.fluxtime.clip": {
          source: "iana",
          extensions: ["ftc"]
        },
        "application/vnd.font-fontforge-sfd": {
          source: "iana"
        },
        "application/vnd.framemaker": {
          source: "iana",
          extensions: ["fm", "frame", "maker", "book"]
        },
        "application/vnd.frogans.fnc": {
          source: "iana",
          extensions: ["fnc"]
        },
        "application/vnd.frogans.ltf": {
          source: "iana",
          extensions: ["ltf"]
        },
        "application/vnd.fsc.weblaunch": {
          source: "iana",
          extensions: ["fsc"]
        },
        "application/vnd.fujifilm.fb.docuworks": {
          source: "iana"
        },
        "application/vnd.fujifilm.fb.docuworks.binder": {
          source: "iana"
        },
        "application/vnd.fujifilm.fb.docuworks.container": {
          source: "iana"
        },
        "application/vnd.fujifilm.fb.jfi+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.fujitsu.oasys": {
          source: "iana",
          extensions: ["oas"]
        },
        "application/vnd.fujitsu.oasys2": {
          source: "iana",
          extensions: ["oa2"]
        },
        "application/vnd.fujitsu.oasys3": {
          source: "iana",
          extensions: ["oa3"]
        },
        "application/vnd.fujitsu.oasysgp": {
          source: "iana",
          extensions: ["fg5"]
        },
        "application/vnd.fujitsu.oasysprs": {
          source: "iana",
          extensions: ["bh2"]
        },
        "application/vnd.fujixerox.art-ex": {
          source: "iana"
        },
        "application/vnd.fujixerox.art4": {
          source: "iana"
        },
        "application/vnd.fujixerox.ddd": {
          source: "iana",
          extensions: ["ddd"]
        },
        "application/vnd.fujixerox.docuworks": {
          source: "iana",
          extensions: ["xdw"]
        },
        "application/vnd.fujixerox.docuworks.binder": {
          source: "iana",
          extensions: ["xbd"]
        },
        "application/vnd.fujixerox.docuworks.container": {
          source: "iana"
        },
        "application/vnd.fujixerox.hbpl": {
          source: "iana"
        },
        "application/vnd.fut-misnet": {
          source: "iana"
        },
        "application/vnd.futoin+cbor": {
          source: "iana"
        },
        "application/vnd.futoin+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.fuzzysheet": {
          source: "iana",
          extensions: ["fzs"]
        },
        "application/vnd.genomatix.tuxedo": {
          source: "iana",
          extensions: ["txd"]
        },
        "application/vnd.gentics.grd+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.geo+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.geocube+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.geogebra.file": {
          source: "iana",
          extensions: ["ggb"]
        },
        "application/vnd.geogebra.slides": {
          source: "iana"
        },
        "application/vnd.geogebra.tool": {
          source: "iana",
          extensions: ["ggt"]
        },
        "application/vnd.geometry-explorer": {
          source: "iana",
          extensions: ["gex", "gre"]
        },
        "application/vnd.geonext": {
          source: "iana",
          extensions: ["gxt"]
        },
        "application/vnd.geoplan": {
          source: "iana",
          extensions: ["g2w"]
        },
        "application/vnd.geospace": {
          source: "iana",
          extensions: ["g3w"]
        },
        "application/vnd.gerber": {
          source: "iana"
        },
        "application/vnd.globalplatform.card-content-mgt": {
          source: "iana"
        },
        "application/vnd.globalplatform.card-content-mgt-response": {
          source: "iana"
        },
        "application/vnd.gmx": {
          source: "iana",
          extensions: ["gmx"]
        },
        "application/vnd.google-apps.document": {
          compressible: false,
          extensions: ["gdoc"]
        },
        "application/vnd.google-apps.presentation": {
          compressible: false,
          extensions: ["gslides"]
        },
        "application/vnd.google-apps.spreadsheet": {
          compressible: false,
          extensions: ["gsheet"]
        },
        "application/vnd.google-earth.kml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["kml"]
        },
        "application/vnd.google-earth.kmz": {
          source: "iana",
          compressible: false,
          extensions: ["kmz"]
        },
        "application/vnd.gov.sk.e-form+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.gov.sk.e-form+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.gov.sk.xmldatacontainer+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.grafeq": {
          source: "iana",
          extensions: ["gqf", "gqs"]
        },
        "application/vnd.gridmp": {
          source: "iana"
        },
        "application/vnd.groove-account": {
          source: "iana",
          extensions: ["gac"]
        },
        "application/vnd.groove-help": {
          source: "iana",
          extensions: ["ghf"]
        },
        "application/vnd.groove-identity-message": {
          source: "iana",
          extensions: ["gim"]
        },
        "application/vnd.groove-injector": {
          source: "iana",
          extensions: ["grv"]
        },
        "application/vnd.groove-tool-message": {
          source: "iana",
          extensions: ["gtm"]
        },
        "application/vnd.groove-tool-template": {
          source: "iana",
          extensions: ["tpl"]
        },
        "application/vnd.groove-vcard": {
          source: "iana",
          extensions: ["vcg"]
        },
        "application/vnd.hal+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.hal+xml": {
          source: "iana",
          compressible: true,
          extensions: ["hal"]
        },
        "application/vnd.handheld-entertainment+xml": {
          source: "iana",
          compressible: true,
          extensions: ["zmm"]
        },
        "application/vnd.hbci": {
          source: "iana",
          extensions: ["hbci"]
        },
        "application/vnd.hc+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.hcl-bireports": {
          source: "iana"
        },
        "application/vnd.hdt": {
          source: "iana"
        },
        "application/vnd.heroku+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.hhe.lesson-player": {
          source: "iana",
          extensions: ["les"]
        },
        "application/vnd.hl7cda+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/vnd.hl7v2+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/vnd.hp-hpgl": {
          source: "iana",
          extensions: ["hpgl"]
        },
        "application/vnd.hp-hpid": {
          source: "iana",
          extensions: ["hpid"]
        },
        "application/vnd.hp-hps": {
          source: "iana",
          extensions: ["hps"]
        },
        "application/vnd.hp-jlyt": {
          source: "iana",
          extensions: ["jlt"]
        },
        "application/vnd.hp-pcl": {
          source: "iana",
          extensions: ["pcl"]
        },
        "application/vnd.hp-pclxl": {
          source: "iana",
          extensions: ["pclxl"]
        },
        "application/vnd.httphone": {
          source: "iana"
        },
        "application/vnd.hydrostatix.sof-data": {
          source: "iana",
          extensions: ["sfd-hdstx"]
        },
        "application/vnd.hyper+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.hyper-item+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.hyperdrive+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.hzn-3d-crossword": {
          source: "iana"
        },
        "application/vnd.ibm.afplinedata": {
          source: "iana"
        },
        "application/vnd.ibm.electronic-media": {
          source: "iana"
        },
        "application/vnd.ibm.minipay": {
          source: "iana",
          extensions: ["mpy"]
        },
        "application/vnd.ibm.modcap": {
          source: "iana",
          extensions: ["afp", "listafp", "list3820"]
        },
        "application/vnd.ibm.rights-management": {
          source: "iana",
          extensions: ["irm"]
        },
        "application/vnd.ibm.secure-container": {
          source: "iana",
          extensions: ["sc"]
        },
        "application/vnd.iccprofile": {
          source: "iana",
          extensions: ["icc", "icm"]
        },
        "application/vnd.ieee.1905": {
          source: "iana"
        },
        "application/vnd.igloader": {
          source: "iana",
          extensions: ["igl"]
        },
        "application/vnd.imagemeter.folder+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.imagemeter.image+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.immervision-ivp": {
          source: "iana",
          extensions: ["ivp"]
        },
        "application/vnd.immervision-ivu": {
          source: "iana",
          extensions: ["ivu"]
        },
        "application/vnd.ims.imsccv1p1": {
          source: "iana"
        },
        "application/vnd.ims.imsccv1p2": {
          source: "iana"
        },
        "application/vnd.ims.imsccv1p3": {
          source: "iana"
        },
        "application/vnd.ims.lis.v2.result+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ims.lti.v2.toolproxy+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ims.lti.v2.toolproxy.id+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ims.lti.v2.toolsettings+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ims.lti.v2.toolsettings.simple+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.informedcontrol.rms+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.informix-visionary": {
          source: "iana"
        },
        "application/vnd.infotech.project": {
          source: "iana"
        },
        "application/vnd.infotech.project+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.innopath.wamp.notification": {
          source: "iana"
        },
        "application/vnd.insors.igm": {
          source: "iana",
          extensions: ["igm"]
        },
        "application/vnd.intercon.formnet": {
          source: "iana",
          extensions: ["xpw", "xpx"]
        },
        "application/vnd.intergeo": {
          source: "iana",
          extensions: ["i2g"]
        },
        "application/vnd.intertrust.digibox": {
          source: "iana"
        },
        "application/vnd.intertrust.nncp": {
          source: "iana"
        },
        "application/vnd.intu.qbo": {
          source: "iana",
          extensions: ["qbo"]
        },
        "application/vnd.intu.qfx": {
          source: "iana",
          extensions: ["qfx"]
        },
        "application/vnd.iptc.g2.catalogitem+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.iptc.g2.conceptitem+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.iptc.g2.knowledgeitem+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.iptc.g2.newsitem+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.iptc.g2.newsmessage+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.iptc.g2.packageitem+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.iptc.g2.planningitem+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ipunplugged.rcprofile": {
          source: "iana",
          extensions: ["rcprofile"]
        },
        "application/vnd.irepository.package+xml": {
          source: "iana",
          compressible: true,
          extensions: ["irp"]
        },
        "application/vnd.is-xpr": {
          source: "iana",
          extensions: ["xpr"]
        },
        "application/vnd.isac.fcs": {
          source: "iana",
          extensions: ["fcs"]
        },
        "application/vnd.iso11783-10+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.jam": {
          source: "iana",
          extensions: ["jam"]
        },
        "application/vnd.japannet-directory-service": {
          source: "iana"
        },
        "application/vnd.japannet-jpnstore-wakeup": {
          source: "iana"
        },
        "application/vnd.japannet-payment-wakeup": {
          source: "iana"
        },
        "application/vnd.japannet-registration": {
          source: "iana"
        },
        "application/vnd.japannet-registration-wakeup": {
          source: "iana"
        },
        "application/vnd.japannet-setstore-wakeup": {
          source: "iana"
        },
        "application/vnd.japannet-verification": {
          source: "iana"
        },
        "application/vnd.japannet-verification-wakeup": {
          source: "iana"
        },
        "application/vnd.jcp.javame.midlet-rms": {
          source: "iana",
          extensions: ["rms"]
        },
        "application/vnd.jisp": {
          source: "iana",
          extensions: ["jisp"]
        },
        "application/vnd.joost.joda-archive": {
          source: "iana",
          extensions: ["joda"]
        },
        "application/vnd.jsk.isdn-ngn": {
          source: "iana"
        },
        "application/vnd.kahootz": {
          source: "iana",
          extensions: ["ktz", "ktr"]
        },
        "application/vnd.kde.karbon": {
          source: "iana",
          extensions: ["karbon"]
        },
        "application/vnd.kde.kchart": {
          source: "iana",
          extensions: ["chrt"]
        },
        "application/vnd.kde.kformula": {
          source: "iana",
          extensions: ["kfo"]
        },
        "application/vnd.kde.kivio": {
          source: "iana",
          extensions: ["flw"]
        },
        "application/vnd.kde.kontour": {
          source: "iana",
          extensions: ["kon"]
        },
        "application/vnd.kde.kpresenter": {
          source: "iana",
          extensions: ["kpr", "kpt"]
        },
        "application/vnd.kde.kspread": {
          source: "iana",
          extensions: ["ksp"]
        },
        "application/vnd.kde.kword": {
          source: "iana",
          extensions: ["kwd", "kwt"]
        },
        "application/vnd.kenameaapp": {
          source: "iana",
          extensions: ["htke"]
        },
        "application/vnd.kidspiration": {
          source: "iana",
          extensions: ["kia"]
        },
        "application/vnd.kinar": {
          source: "iana",
          extensions: ["kne", "knp"]
        },
        "application/vnd.koan": {
          source: "iana",
          extensions: ["skp", "skd", "skt", "skm"]
        },
        "application/vnd.kodak-descriptor": {
          source: "iana",
          extensions: ["sse"]
        },
        "application/vnd.las": {
          source: "iana"
        },
        "application/vnd.las.las+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.las.las+xml": {
          source: "iana",
          compressible: true,
          extensions: ["lasxml"]
        },
        "application/vnd.laszip": {
          source: "iana"
        },
        "application/vnd.leap+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.liberty-request+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.llamagraphics.life-balance.desktop": {
          source: "iana",
          extensions: ["lbd"]
        },
        "application/vnd.llamagraphics.life-balance.exchange+xml": {
          source: "iana",
          compressible: true,
          extensions: ["lbe"]
        },
        "application/vnd.logipipe.circuit+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.loom": {
          source: "iana"
        },
        "application/vnd.lotus-1-2-3": {
          source: "iana",
          extensions: ["123"]
        },
        "application/vnd.lotus-approach": {
          source: "iana",
          extensions: ["apr"]
        },
        "application/vnd.lotus-freelance": {
          source: "iana",
          extensions: ["pre"]
        },
        "application/vnd.lotus-notes": {
          source: "iana",
          extensions: ["nsf"]
        },
        "application/vnd.lotus-organizer": {
          source: "iana",
          extensions: ["org"]
        },
        "application/vnd.lotus-screencam": {
          source: "iana",
          extensions: ["scm"]
        },
        "application/vnd.lotus-wordpro": {
          source: "iana",
          extensions: ["lwp"]
        },
        "application/vnd.macports.portpkg": {
          source: "iana",
          extensions: ["portpkg"]
        },
        "application/vnd.mapbox-vector-tile": {
          source: "iana",
          extensions: ["mvt"]
        },
        "application/vnd.marlin.drm.actiontoken+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.marlin.drm.conftoken+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.marlin.drm.license+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.marlin.drm.mdcf": {
          source: "iana"
        },
        "application/vnd.mason+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.maxar.archive.3tz+zip": {
          source: "iana",
          compressible: false
        },
        "application/vnd.maxmind.maxmind-db": {
          source: "iana"
        },
        "application/vnd.mcd": {
          source: "iana",
          extensions: ["mcd"]
        },
        "application/vnd.medcalcdata": {
          source: "iana",
          extensions: ["mc1"]
        },
        "application/vnd.mediastation.cdkey": {
          source: "iana",
          extensions: ["cdkey"]
        },
        "application/vnd.meridian-slingshot": {
          source: "iana"
        },
        "application/vnd.mfer": {
          source: "iana",
          extensions: ["mwf"]
        },
        "application/vnd.mfmp": {
          source: "iana",
          extensions: ["mfm"]
        },
        "application/vnd.micro+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.micrografx.flo": {
          source: "iana",
          extensions: ["flo"]
        },
        "application/vnd.micrografx.igx": {
          source: "iana",
          extensions: ["igx"]
        },
        "application/vnd.microsoft.portable-executable": {
          source: "iana"
        },
        "application/vnd.microsoft.windows.thumbnail-cache": {
          source: "iana"
        },
        "application/vnd.miele+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.mif": {
          source: "iana",
          extensions: ["mif"]
        },
        "application/vnd.minisoft-hp3000-save": {
          source: "iana"
        },
        "application/vnd.mitsubishi.misty-guard.trustweb": {
          source: "iana"
        },
        "application/vnd.mobius.daf": {
          source: "iana",
          extensions: ["daf"]
        },
        "application/vnd.mobius.dis": {
          source: "iana",
          extensions: ["dis"]
        },
        "application/vnd.mobius.mbk": {
          source: "iana",
          extensions: ["mbk"]
        },
        "application/vnd.mobius.mqy": {
          source: "iana",
          extensions: ["mqy"]
        },
        "application/vnd.mobius.msl": {
          source: "iana",
          extensions: ["msl"]
        },
        "application/vnd.mobius.plc": {
          source: "iana",
          extensions: ["plc"]
        },
        "application/vnd.mobius.txf": {
          source: "iana",
          extensions: ["txf"]
        },
        "application/vnd.mophun.application": {
          source: "iana",
          extensions: ["mpn"]
        },
        "application/vnd.mophun.certificate": {
          source: "iana",
          extensions: ["mpc"]
        },
        "application/vnd.motorola.flexsuite": {
          source: "iana"
        },
        "application/vnd.motorola.flexsuite.adsi": {
          source: "iana"
        },
        "application/vnd.motorola.flexsuite.fis": {
          source: "iana"
        },
        "application/vnd.motorola.flexsuite.gotap": {
          source: "iana"
        },
        "application/vnd.motorola.flexsuite.kmr": {
          source: "iana"
        },
        "application/vnd.motorola.flexsuite.ttc": {
          source: "iana"
        },
        "application/vnd.motorola.flexsuite.wem": {
          source: "iana"
        },
        "application/vnd.motorola.iprm": {
          source: "iana"
        },
        "application/vnd.mozilla.xul+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xul"]
        },
        "application/vnd.ms-3mfdocument": {
          source: "iana"
        },
        "application/vnd.ms-artgalry": {
          source: "iana",
          extensions: ["cil"]
        },
        "application/vnd.ms-asf": {
          source: "iana"
        },
        "application/vnd.ms-cab-compressed": {
          source: "iana",
          extensions: ["cab"]
        },
        "application/vnd.ms-color.iccprofile": {
          source: "apache"
        },
        "application/vnd.ms-excel": {
          source: "iana",
          compressible: false,
          extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
        },
        "application/vnd.ms-excel.addin.macroenabled.12": {
          source: "iana",
          extensions: ["xlam"]
        },
        "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
          source: "iana",
          extensions: ["xlsb"]
        },
        "application/vnd.ms-excel.sheet.macroenabled.12": {
          source: "iana",
          extensions: ["xlsm"]
        },
        "application/vnd.ms-excel.template.macroenabled.12": {
          source: "iana",
          extensions: ["xltm"]
        },
        "application/vnd.ms-fontobject": {
          source: "iana",
          compressible: true,
          extensions: ["eot"]
        },
        "application/vnd.ms-htmlhelp": {
          source: "iana",
          extensions: ["chm"]
        },
        "application/vnd.ms-ims": {
          source: "iana",
          extensions: ["ims"]
        },
        "application/vnd.ms-lrm": {
          source: "iana",
          extensions: ["lrm"]
        },
        "application/vnd.ms-office.activex+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ms-officetheme": {
          source: "iana",
          extensions: ["thmx"]
        },
        "application/vnd.ms-opentype": {
          source: "apache",
          compressible: true
        },
        "application/vnd.ms-outlook": {
          compressible: false,
          extensions: ["msg"]
        },
        "application/vnd.ms-package.obfuscated-opentype": {
          source: "apache"
        },
        "application/vnd.ms-pki.seccat": {
          source: "apache",
          extensions: ["cat"]
        },
        "application/vnd.ms-pki.stl": {
          source: "apache",
          extensions: ["stl"]
        },
        "application/vnd.ms-playready.initiator+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ms-powerpoint": {
          source: "iana",
          compressible: false,
          extensions: ["ppt", "pps", "pot"]
        },
        "application/vnd.ms-powerpoint.addin.macroenabled.12": {
          source: "iana",
          extensions: ["ppam"]
        },
        "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
          source: "iana",
          extensions: ["pptm"]
        },
        "application/vnd.ms-powerpoint.slide.macroenabled.12": {
          source: "iana",
          extensions: ["sldm"]
        },
        "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
          source: "iana",
          extensions: ["ppsm"]
        },
        "application/vnd.ms-powerpoint.template.macroenabled.12": {
          source: "iana",
          extensions: ["potm"]
        },
        "application/vnd.ms-printdevicecapabilities+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ms-printing.printticket+xml": {
          source: "apache",
          compressible: true
        },
        "application/vnd.ms-printschematicket+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ms-project": {
          source: "iana",
          extensions: ["mpp", "mpt"]
        },
        "application/vnd.ms-tnef": {
          source: "iana"
        },
        "application/vnd.ms-windows.devicepairing": {
          source: "iana"
        },
        "application/vnd.ms-windows.nwprinting.oob": {
          source: "iana"
        },
        "application/vnd.ms-windows.printerpairing": {
          source: "iana"
        },
        "application/vnd.ms-windows.wsd.oob": {
          source: "iana"
        },
        "application/vnd.ms-wmdrm.lic-chlg-req": {
          source: "iana"
        },
        "application/vnd.ms-wmdrm.lic-resp": {
          source: "iana"
        },
        "application/vnd.ms-wmdrm.meter-chlg-req": {
          source: "iana"
        },
        "application/vnd.ms-wmdrm.meter-resp": {
          source: "iana"
        },
        "application/vnd.ms-word.document.macroenabled.12": {
          source: "iana",
          extensions: ["docm"]
        },
        "application/vnd.ms-word.template.macroenabled.12": {
          source: "iana",
          extensions: ["dotm"]
        },
        "application/vnd.ms-works": {
          source: "iana",
          extensions: ["wps", "wks", "wcm", "wdb"]
        },
        "application/vnd.ms-wpl": {
          source: "iana",
          extensions: ["wpl"]
        },
        "application/vnd.ms-xpsdocument": {
          source: "iana",
          compressible: false,
          extensions: ["xps"]
        },
        "application/vnd.msa-disk-image": {
          source: "iana"
        },
        "application/vnd.mseq": {
          source: "iana",
          extensions: ["mseq"]
        },
        "application/vnd.msign": {
          source: "iana"
        },
        "application/vnd.multiad.creator": {
          source: "iana"
        },
        "application/vnd.multiad.creator.cif": {
          source: "iana"
        },
        "application/vnd.music-niff": {
          source: "iana"
        },
        "application/vnd.musician": {
          source: "iana",
          extensions: ["mus"]
        },
        "application/vnd.muvee.style": {
          source: "iana",
          extensions: ["msty"]
        },
        "application/vnd.mynfc": {
          source: "iana",
          extensions: ["taglet"]
        },
        "application/vnd.nacamar.ybrid+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.ncd.control": {
          source: "iana"
        },
        "application/vnd.ncd.reference": {
          source: "iana"
        },
        "application/vnd.nearst.inv+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.nebumind.line": {
          source: "iana"
        },
        "application/vnd.nervana": {
          source: "iana"
        },
        "application/vnd.netfpx": {
          source: "iana"
        },
        "application/vnd.neurolanguage.nlu": {
          source: "iana",
          extensions: ["nlu"]
        },
        "application/vnd.nimn": {
          source: "iana"
        },
        "application/vnd.nintendo.nitro.rom": {
          source: "iana"
        },
        "application/vnd.nintendo.snes.rom": {
          source: "iana"
        },
        "application/vnd.nitf": {
          source: "iana",
          extensions: ["ntf", "nitf"]
        },
        "application/vnd.noblenet-directory": {
          source: "iana",
          extensions: ["nnd"]
        },
        "application/vnd.noblenet-sealer": {
          source: "iana",
          extensions: ["nns"]
        },
        "application/vnd.noblenet-web": {
          source: "iana",
          extensions: ["nnw"]
        },
        "application/vnd.nokia.catalogs": {
          source: "iana"
        },
        "application/vnd.nokia.conml+wbxml": {
          source: "iana"
        },
        "application/vnd.nokia.conml+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.nokia.iptv.config+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.nokia.isds-radio-presets": {
          source: "iana"
        },
        "application/vnd.nokia.landmark+wbxml": {
          source: "iana"
        },
        "application/vnd.nokia.landmark+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.nokia.landmarkcollection+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.nokia.n-gage.ac+xml": {
          source: "iana",
          compressible: true,
          extensions: ["ac"]
        },
        "application/vnd.nokia.n-gage.data": {
          source: "iana",
          extensions: ["ngdat"]
        },
        "application/vnd.nokia.n-gage.symbian.install": {
          source: "iana",
          extensions: ["n-gage"]
        },
        "application/vnd.nokia.ncd": {
          source: "iana"
        },
        "application/vnd.nokia.pcd+wbxml": {
          source: "iana"
        },
        "application/vnd.nokia.pcd+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.nokia.radio-preset": {
          source: "iana",
          extensions: ["rpst"]
        },
        "application/vnd.nokia.radio-presets": {
          source: "iana",
          extensions: ["rpss"]
        },
        "application/vnd.novadigm.edm": {
          source: "iana",
          extensions: ["edm"]
        },
        "application/vnd.novadigm.edx": {
          source: "iana",
          extensions: ["edx"]
        },
        "application/vnd.novadigm.ext": {
          source: "iana",
          extensions: ["ext"]
        },
        "application/vnd.ntt-local.content-share": {
          source: "iana"
        },
        "application/vnd.ntt-local.file-transfer": {
          source: "iana"
        },
        "application/vnd.ntt-local.ogw_remote-access": {
          source: "iana"
        },
        "application/vnd.ntt-local.sip-ta_remote": {
          source: "iana"
        },
        "application/vnd.ntt-local.sip-ta_tcp_stream": {
          source: "iana"
        },
        "application/vnd.oasis.opendocument.chart": {
          source: "iana",
          extensions: ["odc"]
        },
        "application/vnd.oasis.opendocument.chart-template": {
          source: "iana",
          extensions: ["otc"]
        },
        "application/vnd.oasis.opendocument.database": {
          source: "iana",
          extensions: ["odb"]
        },
        "application/vnd.oasis.opendocument.formula": {
          source: "iana",
          extensions: ["odf"]
        },
        "application/vnd.oasis.opendocument.formula-template": {
          source: "iana",
          extensions: ["odft"]
        },
        "application/vnd.oasis.opendocument.graphics": {
          source: "iana",
          compressible: false,
          extensions: ["odg"]
        },
        "application/vnd.oasis.opendocument.graphics-template": {
          source: "iana",
          extensions: ["otg"]
        },
        "application/vnd.oasis.opendocument.image": {
          source: "iana",
          extensions: ["odi"]
        },
        "application/vnd.oasis.opendocument.image-template": {
          source: "iana",
          extensions: ["oti"]
        },
        "application/vnd.oasis.opendocument.presentation": {
          source: "iana",
          compressible: false,
          extensions: ["odp"]
        },
        "application/vnd.oasis.opendocument.presentation-template": {
          source: "iana",
          extensions: ["otp"]
        },
        "application/vnd.oasis.opendocument.spreadsheet": {
          source: "iana",
          compressible: false,
          extensions: ["ods"]
        },
        "application/vnd.oasis.opendocument.spreadsheet-template": {
          source: "iana",
          extensions: ["ots"]
        },
        "application/vnd.oasis.opendocument.text": {
          source: "iana",
          compressible: false,
          extensions: ["odt"]
        },
        "application/vnd.oasis.opendocument.text-master": {
          source: "iana",
          extensions: ["odm"]
        },
        "application/vnd.oasis.opendocument.text-template": {
          source: "iana",
          extensions: ["ott"]
        },
        "application/vnd.oasis.opendocument.text-web": {
          source: "iana",
          extensions: ["oth"]
        },
        "application/vnd.obn": {
          source: "iana"
        },
        "application/vnd.ocf+cbor": {
          source: "iana"
        },
        "application/vnd.oci.image.manifest.v1+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oftn.l10n+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.contentaccessdownload+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.contentaccessstreaming+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.cspg-hexbinary": {
          source: "iana"
        },
        "application/vnd.oipf.dae.svg+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.dae.xhtml+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.mippvcontrolmessage+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.pae.gem": {
          source: "iana"
        },
        "application/vnd.oipf.spdiscovery+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.spdlist+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.ueprofile+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oipf.userprofile+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.olpc-sugar": {
          source: "iana",
          extensions: ["xo"]
        },
        "application/vnd.oma-scws-config": {
          source: "iana"
        },
        "application/vnd.oma-scws-http-request": {
          source: "iana"
        },
        "application/vnd.oma-scws-http-response": {
          source: "iana"
        },
        "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.bcast.drm-trigger+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.bcast.imd+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.bcast.ltkm": {
          source: "iana"
        },
        "application/vnd.oma.bcast.notification+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.bcast.provisioningtrigger": {
          source: "iana"
        },
        "application/vnd.oma.bcast.sgboot": {
          source: "iana"
        },
        "application/vnd.oma.bcast.sgdd+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.bcast.sgdu": {
          source: "iana"
        },
        "application/vnd.oma.bcast.simple-symbol-container": {
          source: "iana"
        },
        "application/vnd.oma.bcast.smartcard-trigger+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.bcast.sprov+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.bcast.stkm": {
          source: "iana"
        },
        "application/vnd.oma.cab-address-book+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.cab-feature-handler+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.cab-pcc+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.cab-subs-invite+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.cab-user-prefs+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.dcd": {
          source: "iana"
        },
        "application/vnd.oma.dcdc": {
          source: "iana"
        },
        "application/vnd.oma.dd2+xml": {
          source: "iana",
          compressible: true,
          extensions: ["dd2"]
        },
        "application/vnd.oma.drm.risd+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.group-usage-list+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.lwm2m+cbor": {
          source: "iana"
        },
        "application/vnd.oma.lwm2m+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.lwm2m+tlv": {
          source: "iana"
        },
        "application/vnd.oma.pal+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.poc.detailed-progress-report+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.poc.final-report+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.poc.groups+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.poc.invocation-descriptor+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.poc.optimized-progress-report+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.push": {
          source: "iana"
        },
        "application/vnd.oma.scidm.messages+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oma.xcap-directory+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.omads-email+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/vnd.omads-file+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/vnd.omads-folder+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/vnd.omaloc-supl-init": {
          source: "iana"
        },
        "application/vnd.onepager": {
          source: "iana"
        },
        "application/vnd.onepagertamp": {
          source: "iana"
        },
        "application/vnd.onepagertamx": {
          source: "iana"
        },
        "application/vnd.onepagertat": {
          source: "iana"
        },
        "application/vnd.onepagertatp": {
          source: "iana"
        },
        "application/vnd.onepagertatx": {
          source: "iana"
        },
        "application/vnd.openblox.game+xml": {
          source: "iana",
          compressible: true,
          extensions: ["obgx"]
        },
        "application/vnd.openblox.game-binary": {
          source: "iana"
        },
        "application/vnd.openeye.oeb": {
          source: "iana"
        },
        "application/vnd.openofficeorg.extension": {
          source: "apache",
          extensions: ["oxt"]
        },
        "application/vnd.openstreetmap.data+xml": {
          source: "iana",
          compressible: true,
          extensions: ["osm"]
        },
        "application/vnd.opentimestamps.ots": {
          source: "iana"
        },
        "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.drawing+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
          source: "iana",
          compressible: false,
          extensions: ["pptx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slide": {
          source: "iana",
          extensions: ["sldx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
          source: "iana",
          extensions: ["ppsx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.template": {
          source: "iana",
          extensions: ["potx"]
        },
        "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
          source: "iana",
          compressible: false,
          extensions: ["xlsx"]
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
          source: "iana",
          extensions: ["xltx"]
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.theme+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.vmldrawing": {
          source: "iana"
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
          source: "iana",
          compressible: false,
          extensions: ["docx"]
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
          source: "iana",
          extensions: ["dotx"]
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-package.core-properties+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.openxmlformats-package.relationships+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oracle.resource+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.orange.indata": {
          source: "iana"
        },
        "application/vnd.osa.netdeploy": {
          source: "iana"
        },
        "application/vnd.osgeo.mapguide.package": {
          source: "iana",
          extensions: ["mgp"]
        },
        "application/vnd.osgi.bundle": {
          source: "iana"
        },
        "application/vnd.osgi.dp": {
          source: "iana",
          extensions: ["dp"]
        },
        "application/vnd.osgi.subsystem": {
          source: "iana",
          extensions: ["esa"]
        },
        "application/vnd.otps.ct-kip+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.oxli.countgraph": {
          source: "iana"
        },
        "application/vnd.pagerduty+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.palm": {
          source: "iana",
          extensions: ["pdb", "pqa", "oprc"]
        },
        "application/vnd.panoply": {
          source: "iana"
        },
        "application/vnd.paos.xml": {
          source: "iana"
        },
        "application/vnd.patentdive": {
          source: "iana"
        },
        "application/vnd.patientecommsdoc": {
          source: "iana"
        },
        "application/vnd.pawaafile": {
          source: "iana",
          extensions: ["paw"]
        },
        "application/vnd.pcos": {
          source: "iana"
        },
        "application/vnd.pg.format": {
          source: "iana",
          extensions: ["str"]
        },
        "application/vnd.pg.osasli": {
          source: "iana",
          extensions: ["ei6"]
        },
        "application/vnd.piaccess.application-licence": {
          source: "iana"
        },
        "application/vnd.picsel": {
          source: "iana",
          extensions: ["efif"]
        },
        "application/vnd.pmi.widget": {
          source: "iana",
          extensions: ["wg"]
        },
        "application/vnd.poc.group-advertisement+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.pocketlearn": {
          source: "iana",
          extensions: ["plf"]
        },
        "application/vnd.powerbuilder6": {
          source: "iana",
          extensions: ["pbd"]
        },
        "application/vnd.powerbuilder6-s": {
          source: "iana"
        },
        "application/vnd.powerbuilder7": {
          source: "iana"
        },
        "application/vnd.powerbuilder7-s": {
          source: "iana"
        },
        "application/vnd.powerbuilder75": {
          source: "iana"
        },
        "application/vnd.powerbuilder75-s": {
          source: "iana"
        },
        "application/vnd.preminet": {
          source: "iana"
        },
        "application/vnd.previewsystems.box": {
          source: "iana",
          extensions: ["box"]
        },
        "application/vnd.proteus.magazine": {
          source: "iana",
          extensions: ["mgz"]
        },
        "application/vnd.psfs": {
          source: "iana"
        },
        "application/vnd.publishare-delta-tree": {
          source: "iana",
          extensions: ["qps"]
        },
        "application/vnd.pvi.ptid1": {
          source: "iana",
          extensions: ["ptid"]
        },
        "application/vnd.pwg-multiplexed": {
          source: "iana"
        },
        "application/vnd.pwg-xhtml-print+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.qualcomm.brew-app-res": {
          source: "iana"
        },
        "application/vnd.quarantainenet": {
          source: "iana"
        },
        "application/vnd.quark.quarkxpress": {
          source: "iana",
          extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
        },
        "application/vnd.quobject-quoxdocument": {
          source: "iana"
        },
        "application/vnd.radisys.moml+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-audit+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-audit-conf+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-audit-conn+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-audit-dialog+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-audit-stream+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-conf+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-dialog+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-dialog-base+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-dialog-fax-detect+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-dialog-group+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-dialog-speech+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.radisys.msml-dialog-transform+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.rainstor.data": {
          source: "iana"
        },
        "application/vnd.rapid": {
          source: "iana"
        },
        "application/vnd.rar": {
          source: "iana",
          extensions: ["rar"]
        },
        "application/vnd.realvnc.bed": {
          source: "iana",
          extensions: ["bed"]
        },
        "application/vnd.recordare.musicxml": {
          source: "iana",
          extensions: ["mxl"]
        },
        "application/vnd.recordare.musicxml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["musicxml"]
        },
        "application/vnd.renlearn.rlprint": {
          source: "iana"
        },
        "application/vnd.resilient.logic": {
          source: "iana"
        },
        "application/vnd.restful+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.rig.cryptonote": {
          source: "iana",
          extensions: ["cryptonote"]
        },
        "application/vnd.rim.cod": {
          source: "apache",
          extensions: ["cod"]
        },
        "application/vnd.rn-realmedia": {
          source: "apache",
          extensions: ["rm"]
        },
        "application/vnd.rn-realmedia-vbr": {
          source: "apache",
          extensions: ["rmvb"]
        },
        "application/vnd.route66.link66+xml": {
          source: "iana",
          compressible: true,
          extensions: ["link66"]
        },
        "application/vnd.rs-274x": {
          source: "iana"
        },
        "application/vnd.ruckus.download": {
          source: "iana"
        },
        "application/vnd.s3sms": {
          source: "iana"
        },
        "application/vnd.sailingtracker.track": {
          source: "iana",
          extensions: ["st"]
        },
        "application/vnd.sar": {
          source: "iana"
        },
        "application/vnd.sbm.cid": {
          source: "iana"
        },
        "application/vnd.sbm.mid2": {
          source: "iana"
        },
        "application/vnd.scribus": {
          source: "iana"
        },
        "application/vnd.sealed.3df": {
          source: "iana"
        },
        "application/vnd.sealed.csf": {
          source: "iana"
        },
        "application/vnd.sealed.doc": {
          source: "iana"
        },
        "application/vnd.sealed.eml": {
          source: "iana"
        },
        "application/vnd.sealed.mht": {
          source: "iana"
        },
        "application/vnd.sealed.net": {
          source: "iana"
        },
        "application/vnd.sealed.ppt": {
          source: "iana"
        },
        "application/vnd.sealed.tiff": {
          source: "iana"
        },
        "application/vnd.sealed.xls": {
          source: "iana"
        },
        "application/vnd.sealedmedia.softseal.html": {
          source: "iana"
        },
        "application/vnd.sealedmedia.softseal.pdf": {
          source: "iana"
        },
        "application/vnd.seemail": {
          source: "iana",
          extensions: ["see"]
        },
        "application/vnd.seis+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.sema": {
          source: "iana",
          extensions: ["sema"]
        },
        "application/vnd.semd": {
          source: "iana",
          extensions: ["semd"]
        },
        "application/vnd.semf": {
          source: "iana",
          extensions: ["semf"]
        },
        "application/vnd.shade-save-file": {
          source: "iana"
        },
        "application/vnd.shana.informed.formdata": {
          source: "iana",
          extensions: ["ifm"]
        },
        "application/vnd.shana.informed.formtemplate": {
          source: "iana",
          extensions: ["itp"]
        },
        "application/vnd.shana.informed.interchange": {
          source: "iana",
          extensions: ["iif"]
        },
        "application/vnd.shana.informed.package": {
          source: "iana",
          extensions: ["ipk"]
        },
        "application/vnd.shootproof+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.shopkick+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.shp": {
          source: "iana"
        },
        "application/vnd.shx": {
          source: "iana"
        },
        "application/vnd.sigrok.session": {
          source: "iana"
        },
        "application/vnd.simtech-mindmapper": {
          source: "iana",
          extensions: ["twd", "twds"]
        },
        "application/vnd.siren+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.smaf": {
          source: "iana",
          extensions: ["mmf"]
        },
        "application/vnd.smart.notebook": {
          source: "iana"
        },
        "application/vnd.smart.teacher": {
          source: "iana",
          extensions: ["teacher"]
        },
        "application/vnd.snesdev-page-table": {
          source: "iana"
        },
        "application/vnd.software602.filler.form+xml": {
          source: "iana",
          compressible: true,
          extensions: ["fo"]
        },
        "application/vnd.software602.filler.form-xml-zip": {
          source: "iana"
        },
        "application/vnd.solent.sdkm+xml": {
          source: "iana",
          compressible: true,
          extensions: ["sdkm", "sdkd"]
        },
        "application/vnd.spotfire.dxp": {
          source: "iana",
          extensions: ["dxp"]
        },
        "application/vnd.spotfire.sfs": {
          source: "iana",
          extensions: ["sfs"]
        },
        "application/vnd.sqlite3": {
          source: "iana"
        },
        "application/vnd.sss-cod": {
          source: "iana"
        },
        "application/vnd.sss-dtf": {
          source: "iana"
        },
        "application/vnd.sss-ntf": {
          source: "iana"
        },
        "application/vnd.stardivision.calc": {
          source: "apache",
          extensions: ["sdc"]
        },
        "application/vnd.stardivision.draw": {
          source: "apache",
          extensions: ["sda"]
        },
        "application/vnd.stardivision.impress": {
          source: "apache",
          extensions: ["sdd"]
        },
        "application/vnd.stardivision.math": {
          source: "apache",
          extensions: ["smf"]
        },
        "application/vnd.stardivision.writer": {
          source: "apache",
          extensions: ["sdw", "vor"]
        },
        "application/vnd.stardivision.writer-global": {
          source: "apache",
          extensions: ["sgl"]
        },
        "application/vnd.stepmania.package": {
          source: "iana",
          extensions: ["smzip"]
        },
        "application/vnd.stepmania.stepchart": {
          source: "iana",
          extensions: ["sm"]
        },
        "application/vnd.street-stream": {
          source: "iana"
        },
        "application/vnd.sun.wadl+xml": {
          source: "iana",
          compressible: true,
          extensions: ["wadl"]
        },
        "application/vnd.sun.xml.calc": {
          source: "apache",
          extensions: ["sxc"]
        },
        "application/vnd.sun.xml.calc.template": {
          source: "apache",
          extensions: ["stc"]
        },
        "application/vnd.sun.xml.draw": {
          source: "apache",
          extensions: ["sxd"]
        },
        "application/vnd.sun.xml.draw.template": {
          source: "apache",
          extensions: ["std"]
        },
        "application/vnd.sun.xml.impress": {
          source: "apache",
          extensions: ["sxi"]
        },
        "application/vnd.sun.xml.impress.template": {
          source: "apache",
          extensions: ["sti"]
        },
        "application/vnd.sun.xml.math": {
          source: "apache",
          extensions: ["sxm"]
        },
        "application/vnd.sun.xml.writer": {
          source: "apache",
          extensions: ["sxw"]
        },
        "application/vnd.sun.xml.writer.global": {
          source: "apache",
          extensions: ["sxg"]
        },
        "application/vnd.sun.xml.writer.template": {
          source: "apache",
          extensions: ["stw"]
        },
        "application/vnd.sus-calendar": {
          source: "iana",
          extensions: ["sus", "susp"]
        },
        "application/vnd.svd": {
          source: "iana",
          extensions: ["svd"]
        },
        "application/vnd.swiftview-ics": {
          source: "iana"
        },
        "application/vnd.sycle+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.syft+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.symbian.install": {
          source: "apache",
          extensions: ["sis", "sisx"]
        },
        "application/vnd.syncml+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["xsm"]
        },
        "application/vnd.syncml.dm+wbxml": {
          source: "iana",
          charset: "UTF-8",
          extensions: ["bdm"]
        },
        "application/vnd.syncml.dm+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["xdm"]
        },
        "application/vnd.syncml.dm.notification": {
          source: "iana"
        },
        "application/vnd.syncml.dmddf+wbxml": {
          source: "iana"
        },
        "application/vnd.syncml.dmddf+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["ddf"]
        },
        "application/vnd.syncml.dmtnds+wbxml": {
          source: "iana"
        },
        "application/vnd.syncml.dmtnds+xml": {
          source: "iana",
          charset: "UTF-8",
          compressible: true
        },
        "application/vnd.syncml.ds.notification": {
          source: "iana"
        },
        "application/vnd.tableschema+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.tao.intent-module-archive": {
          source: "iana",
          extensions: ["tao"]
        },
        "application/vnd.tcpdump.pcap": {
          source: "iana",
          extensions: ["pcap", "cap", "dmp"]
        },
        "application/vnd.think-cell.ppttc+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.tmd.mediaflex.api+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.tml": {
          source: "iana"
        },
        "application/vnd.tmobile-livetv": {
          source: "iana",
          extensions: ["tmo"]
        },
        "application/vnd.tri.onesource": {
          source: "iana"
        },
        "application/vnd.trid.tpt": {
          source: "iana",
          extensions: ["tpt"]
        },
        "application/vnd.triscape.mxs": {
          source: "iana",
          extensions: ["mxs"]
        },
        "application/vnd.trueapp": {
          source: "iana",
          extensions: ["tra"]
        },
        "application/vnd.truedoc": {
          source: "iana"
        },
        "application/vnd.ubisoft.webplayer": {
          source: "iana"
        },
        "application/vnd.ufdl": {
          source: "iana",
          extensions: ["ufd", "ufdl"]
        },
        "application/vnd.uiq.theme": {
          source: "iana",
          extensions: ["utz"]
        },
        "application/vnd.umajin": {
          source: "iana",
          extensions: ["umj"]
        },
        "application/vnd.unity": {
          source: "iana",
          extensions: ["unityweb"]
        },
        "application/vnd.uoml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["uoml"]
        },
        "application/vnd.uplanet.alert": {
          source: "iana"
        },
        "application/vnd.uplanet.alert-wbxml": {
          source: "iana"
        },
        "application/vnd.uplanet.bearer-choice": {
          source: "iana"
        },
        "application/vnd.uplanet.bearer-choice-wbxml": {
          source: "iana"
        },
        "application/vnd.uplanet.cacheop": {
          source: "iana"
        },
        "application/vnd.uplanet.cacheop-wbxml": {
          source: "iana"
        },
        "application/vnd.uplanet.channel": {
          source: "iana"
        },
        "application/vnd.uplanet.channel-wbxml": {
          source: "iana"
        },
        "application/vnd.uplanet.list": {
          source: "iana"
        },
        "application/vnd.uplanet.list-wbxml": {
          source: "iana"
        },
        "application/vnd.uplanet.listcmd": {
          source: "iana"
        },
        "application/vnd.uplanet.listcmd-wbxml": {
          source: "iana"
        },
        "application/vnd.uplanet.signal": {
          source: "iana"
        },
        "application/vnd.uri-map": {
          source: "iana"
        },
        "application/vnd.valve.source.material": {
          source: "iana"
        },
        "application/vnd.vcx": {
          source: "iana",
          extensions: ["vcx"]
        },
        "application/vnd.vd-study": {
          source: "iana"
        },
        "application/vnd.vectorworks": {
          source: "iana"
        },
        "application/vnd.vel+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.verimatrix.vcas": {
          source: "iana"
        },
        "application/vnd.veritone.aion+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.veryant.thin": {
          source: "iana"
        },
        "application/vnd.ves.encrypted": {
          source: "iana"
        },
        "application/vnd.vidsoft.vidconference": {
          source: "iana"
        },
        "application/vnd.visio": {
          source: "iana",
          extensions: ["vsd", "vst", "vss", "vsw"]
        },
        "application/vnd.visionary": {
          source: "iana",
          extensions: ["vis"]
        },
        "application/vnd.vividence.scriptfile": {
          source: "iana"
        },
        "application/vnd.vsf": {
          source: "iana",
          extensions: ["vsf"]
        },
        "application/vnd.wap.sic": {
          source: "iana"
        },
        "application/vnd.wap.slc": {
          source: "iana"
        },
        "application/vnd.wap.wbxml": {
          source: "iana",
          charset: "UTF-8",
          extensions: ["wbxml"]
        },
        "application/vnd.wap.wmlc": {
          source: "iana",
          extensions: ["wmlc"]
        },
        "application/vnd.wap.wmlscriptc": {
          source: "iana",
          extensions: ["wmlsc"]
        },
        "application/vnd.webturbo": {
          source: "iana",
          extensions: ["wtb"]
        },
        "application/vnd.wfa.dpp": {
          source: "iana"
        },
        "application/vnd.wfa.p2p": {
          source: "iana"
        },
        "application/vnd.wfa.wsc": {
          source: "iana"
        },
        "application/vnd.windows.devicepairing": {
          source: "iana"
        },
        "application/vnd.wmc": {
          source: "iana"
        },
        "application/vnd.wmf.bootstrap": {
          source: "iana"
        },
        "application/vnd.wolfram.mathematica": {
          source: "iana"
        },
        "application/vnd.wolfram.mathematica.package": {
          source: "iana"
        },
        "application/vnd.wolfram.player": {
          source: "iana",
          extensions: ["nbp"]
        },
        "application/vnd.wordperfect": {
          source: "iana",
          extensions: ["wpd"]
        },
        "application/vnd.wqd": {
          source: "iana",
          extensions: ["wqd"]
        },
        "application/vnd.wrq-hp3000-labelled": {
          source: "iana"
        },
        "application/vnd.wt.stf": {
          source: "iana",
          extensions: ["stf"]
        },
        "application/vnd.wv.csp+wbxml": {
          source: "iana"
        },
        "application/vnd.wv.csp+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.wv.ssp+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.xacml+json": {
          source: "iana",
          compressible: true
        },
        "application/vnd.xara": {
          source: "iana",
          extensions: ["xar"]
        },
        "application/vnd.xfdl": {
          source: "iana",
          extensions: ["xfdl"]
        },
        "application/vnd.xfdl.webform": {
          source: "iana"
        },
        "application/vnd.xmi+xml": {
          source: "iana",
          compressible: true
        },
        "application/vnd.xmpie.cpkg": {
          source: "iana"
        },
        "application/vnd.xmpie.dpkg": {
          source: "iana"
        },
        "application/vnd.xmpie.plan": {
          source: "iana"
        },
        "application/vnd.xmpie.ppkg": {
          source: "iana"
        },
        "application/vnd.xmpie.xlim": {
          source: "iana"
        },
        "application/vnd.yamaha.hv-dic": {
          source: "iana",
          extensions: ["hvd"]
        },
        "application/vnd.yamaha.hv-script": {
          source: "iana",
          extensions: ["hvs"]
        },
        "application/vnd.yamaha.hv-voice": {
          source: "iana",
          extensions: ["hvp"]
        },
        "application/vnd.yamaha.openscoreformat": {
          source: "iana",
          extensions: ["osf"]
        },
        "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
          source: "iana",
          compressible: true,
          extensions: ["osfpvg"]
        },
        "application/vnd.yamaha.remote-setup": {
          source: "iana"
        },
        "application/vnd.yamaha.smaf-audio": {
          source: "iana",
          extensions: ["saf"]
        },
        "application/vnd.yamaha.smaf-phrase": {
          source: "iana",
          extensions: ["spf"]
        },
        "application/vnd.yamaha.through-ngn": {
          source: "iana"
        },
        "application/vnd.yamaha.tunnel-udpencap": {
          source: "iana"
        },
        "application/vnd.yaoweme": {
          source: "iana"
        },
        "application/vnd.yellowriver-custom-menu": {
          source: "iana",
          extensions: ["cmp"]
        },
        "application/vnd.youtube.yt": {
          source: "iana"
        },
        "application/vnd.zul": {
          source: "iana",
          extensions: ["zir", "zirz"]
        },
        "application/vnd.zzazz.deck+xml": {
          source: "iana",
          compressible: true,
          extensions: ["zaz"]
        },
        "application/voicexml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["vxml"]
        },
        "application/voucher-cms+json": {
          source: "iana",
          compressible: true
        },
        "application/vq-rtcpxr": {
          source: "iana"
        },
        "application/wasm": {
          source: "iana",
          compressible: true,
          extensions: ["wasm"]
        },
        "application/watcherinfo+xml": {
          source: "iana",
          compressible: true,
          extensions: ["wif"]
        },
        "application/webpush-options+json": {
          source: "iana",
          compressible: true
        },
        "application/whoispp-query": {
          source: "iana"
        },
        "application/whoispp-response": {
          source: "iana"
        },
        "application/widget": {
          source: "iana",
          extensions: ["wgt"]
        },
        "application/winhlp": {
          source: "apache",
          extensions: ["hlp"]
        },
        "application/wita": {
          source: "iana"
        },
        "application/wordperfect5.1": {
          source: "iana"
        },
        "application/wsdl+xml": {
          source: "iana",
          compressible: true,
          extensions: ["wsdl"]
        },
        "application/wspolicy+xml": {
          source: "iana",
          compressible: true,
          extensions: ["wspolicy"]
        },
        "application/x-7z-compressed": {
          source: "apache",
          compressible: false,
          extensions: ["7z"]
        },
        "application/x-abiword": {
          source: "apache",
          extensions: ["abw"]
        },
        "application/x-ace-compressed": {
          source: "apache",
          extensions: ["ace"]
        },
        "application/x-amf": {
          source: "apache"
        },
        "application/x-apple-diskimage": {
          source: "apache",
          extensions: ["dmg"]
        },
        "application/x-arj": {
          compressible: false,
          extensions: ["arj"]
        },
        "application/x-authorware-bin": {
          source: "apache",
          extensions: ["aab", "x32", "u32", "vox"]
        },
        "application/x-authorware-map": {
          source: "apache",
          extensions: ["aam"]
        },
        "application/x-authorware-seg": {
          source: "apache",
          extensions: ["aas"]
        },
        "application/x-bcpio": {
          source: "apache",
          extensions: ["bcpio"]
        },
        "application/x-bdoc": {
          compressible: false,
          extensions: ["bdoc"]
        },
        "application/x-bittorrent": {
          source: "apache",
          extensions: ["torrent"]
        },
        "application/x-blorb": {
          source: "apache",
          extensions: ["blb", "blorb"]
        },
        "application/x-bzip": {
          source: "apache",
          compressible: false,
          extensions: ["bz"]
        },
        "application/x-bzip2": {
          source: "apache",
          compressible: false,
          extensions: ["bz2", "boz"]
        },
        "application/x-cbr": {
          source: "apache",
          extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
        },
        "application/x-cdlink": {
          source: "apache",
          extensions: ["vcd"]
        },
        "application/x-cfs-compressed": {
          source: "apache",
          extensions: ["cfs"]
        },
        "application/x-chat": {
          source: "apache",
          extensions: ["chat"]
        },
        "application/x-chess-pgn": {
          source: "apache",
          extensions: ["pgn"]
        },
        "application/x-chrome-extension": {
          extensions: ["crx"]
        },
        "application/x-cocoa": {
          source: "nginx",
          extensions: ["cco"]
        },
        "application/x-compress": {
          source: "apache"
        },
        "application/x-conference": {
          source: "apache",
          extensions: ["nsc"]
        },
        "application/x-cpio": {
          source: "apache",
          extensions: ["cpio"]
        },
        "application/x-csh": {
          source: "apache",
          extensions: ["csh"]
        },
        "application/x-deb": {
          compressible: false
        },
        "application/x-debian-package": {
          source: "apache",
          extensions: ["deb", "udeb"]
        },
        "application/x-dgc-compressed": {
          source: "apache",
          extensions: ["dgc"]
        },
        "application/x-director": {
          source: "apache",
          extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
        },
        "application/x-doom": {
          source: "apache",
          extensions: ["wad"]
        },
        "application/x-dtbncx+xml": {
          source: "apache",
          compressible: true,
          extensions: ["ncx"]
        },
        "application/x-dtbook+xml": {
          source: "apache",
          compressible: true,
          extensions: ["dtb"]
        },
        "application/x-dtbresource+xml": {
          source: "apache",
          compressible: true,
          extensions: ["res"]
        },
        "application/x-dvi": {
          source: "apache",
          compressible: false,
          extensions: ["dvi"]
        },
        "application/x-envoy": {
          source: "apache",
          extensions: ["evy"]
        },
        "application/x-eva": {
          source: "apache",
          extensions: ["eva"]
        },
        "application/x-font-bdf": {
          source: "apache",
          extensions: ["bdf"]
        },
        "application/x-font-dos": {
          source: "apache"
        },
        "application/x-font-framemaker": {
          source: "apache"
        },
        "application/x-font-ghostscript": {
          source: "apache",
          extensions: ["gsf"]
        },
        "application/x-font-libgrx": {
          source: "apache"
        },
        "application/x-font-linux-psf": {
          source: "apache",
          extensions: ["psf"]
        },
        "application/x-font-pcf": {
          source: "apache",
          extensions: ["pcf"]
        },
        "application/x-font-snf": {
          source: "apache",
          extensions: ["snf"]
        },
        "application/x-font-speedo": {
          source: "apache"
        },
        "application/x-font-sunos-news": {
          source: "apache"
        },
        "application/x-font-type1": {
          source: "apache",
          extensions: ["pfa", "pfb", "pfm", "afm"]
        },
        "application/x-font-vfont": {
          source: "apache"
        },
        "application/x-freearc": {
          source: "apache",
          extensions: ["arc"]
        },
        "application/x-futuresplash": {
          source: "apache",
          extensions: ["spl"]
        },
        "application/x-gca-compressed": {
          source: "apache",
          extensions: ["gca"]
        },
        "application/x-glulx": {
          source: "apache",
          extensions: ["ulx"]
        },
        "application/x-gnumeric": {
          source: "apache",
          extensions: ["gnumeric"]
        },
        "application/x-gramps-xml": {
          source: "apache",
          extensions: ["gramps"]
        },
        "application/x-gtar": {
          source: "apache",
          extensions: ["gtar"]
        },
        "application/x-gzip": {
          source: "apache"
        },
        "application/x-hdf": {
          source: "apache",
          extensions: ["hdf"]
        },
        "application/x-httpd-php": {
          compressible: true,
          extensions: ["php"]
        },
        "application/x-install-instructions": {
          source: "apache",
          extensions: ["install"]
        },
        "application/x-iso9660-image": {
          source: "apache",
          extensions: ["iso"]
        },
        "application/x-iwork-keynote-sffkey": {
          extensions: ["key"]
        },
        "application/x-iwork-numbers-sffnumbers": {
          extensions: ["numbers"]
        },
        "application/x-iwork-pages-sffpages": {
          extensions: ["pages"]
        },
        "application/x-java-archive-diff": {
          source: "nginx",
          extensions: ["jardiff"]
        },
        "application/x-java-jnlp-file": {
          source: "apache",
          compressible: false,
          extensions: ["jnlp"]
        },
        "application/x-javascript": {
          compressible: true
        },
        "application/x-keepass2": {
          extensions: ["kdbx"]
        },
        "application/x-latex": {
          source: "apache",
          compressible: false,
          extensions: ["latex"]
        },
        "application/x-lua-bytecode": {
          extensions: ["luac"]
        },
        "application/x-lzh-compressed": {
          source: "apache",
          extensions: ["lzh", "lha"]
        },
        "application/x-makeself": {
          source: "nginx",
          extensions: ["run"]
        },
        "application/x-mie": {
          source: "apache",
          extensions: ["mie"]
        },
        "application/x-mobipocket-ebook": {
          source: "apache",
          extensions: ["prc", "mobi"]
        },
        "application/x-mpegurl": {
          compressible: false
        },
        "application/x-ms-application": {
          source: "apache",
          extensions: ["application"]
        },
        "application/x-ms-shortcut": {
          source: "apache",
          extensions: ["lnk"]
        },
        "application/x-ms-wmd": {
          source: "apache",
          extensions: ["wmd"]
        },
        "application/x-ms-wmz": {
          source: "apache",
          extensions: ["wmz"]
        },
        "application/x-ms-xbap": {
          source: "apache",
          extensions: ["xbap"]
        },
        "application/x-msaccess": {
          source: "apache",
          extensions: ["mdb"]
        },
        "application/x-msbinder": {
          source: "apache",
          extensions: ["obd"]
        },
        "application/x-mscardfile": {
          source: "apache",
          extensions: ["crd"]
        },
        "application/x-msclip": {
          source: "apache",
          extensions: ["clp"]
        },
        "application/x-msdos-program": {
          extensions: ["exe"]
        },
        "application/x-msdownload": {
          source: "apache",
          extensions: ["exe", "dll", "com", "bat", "msi"]
        },
        "application/x-msmediaview": {
          source: "apache",
          extensions: ["mvb", "m13", "m14"]
        },
        "application/x-msmetafile": {
          source: "apache",
          extensions: ["wmf", "wmz", "emf", "emz"]
        },
        "application/x-msmoney": {
          source: "apache",
          extensions: ["mny"]
        },
        "application/x-mspublisher": {
          source: "apache",
          extensions: ["pub"]
        },
        "application/x-msschedule": {
          source: "apache",
          extensions: ["scd"]
        },
        "application/x-msterminal": {
          source: "apache",
          extensions: ["trm"]
        },
        "application/x-mswrite": {
          source: "apache",
          extensions: ["wri"]
        },
        "application/x-netcdf": {
          source: "apache",
          extensions: ["nc", "cdf"]
        },
        "application/x-ns-proxy-autoconfig": {
          compressible: true,
          extensions: ["pac"]
        },
        "application/x-nzb": {
          source: "apache",
          extensions: ["nzb"]
        },
        "application/x-perl": {
          source: "nginx",
          extensions: ["pl", "pm"]
        },
        "application/x-pilot": {
          source: "nginx",
          extensions: ["prc", "pdb"]
        },
        "application/x-pkcs12": {
          source: "apache",
          compressible: false,
          extensions: ["p12", "pfx"]
        },
        "application/x-pkcs7-certificates": {
          source: "apache",
          extensions: ["p7b", "spc"]
        },
        "application/x-pkcs7-certreqresp": {
          source: "apache",
          extensions: ["p7r"]
        },
        "application/x-pki-message": {
          source: "iana"
        },
        "application/x-rar-compressed": {
          source: "apache",
          compressible: false,
          extensions: ["rar"]
        },
        "application/x-redhat-package-manager": {
          source: "nginx",
          extensions: ["rpm"]
        },
        "application/x-research-info-systems": {
          source: "apache",
          extensions: ["ris"]
        },
        "application/x-sea": {
          source: "nginx",
          extensions: ["sea"]
        },
        "application/x-sh": {
          source: "apache",
          compressible: true,
          extensions: ["sh"]
        },
        "application/x-shar": {
          source: "apache",
          extensions: ["shar"]
        },
        "application/x-shockwave-flash": {
          source: "apache",
          compressible: false,
          extensions: ["swf"]
        },
        "application/x-silverlight-app": {
          source: "apache",
          extensions: ["xap"]
        },
        "application/x-sql": {
          source: "apache",
          extensions: ["sql"]
        },
        "application/x-stuffit": {
          source: "apache",
          compressible: false,
          extensions: ["sit"]
        },
        "application/x-stuffitx": {
          source: "apache",
          extensions: ["sitx"]
        },
        "application/x-subrip": {
          source: "apache",
          extensions: ["srt"]
        },
        "application/x-sv4cpio": {
          source: "apache",
          extensions: ["sv4cpio"]
        },
        "application/x-sv4crc": {
          source: "apache",
          extensions: ["sv4crc"]
        },
        "application/x-t3vm-image": {
          source: "apache",
          extensions: ["t3"]
        },
        "application/x-tads": {
          source: "apache",
          extensions: ["gam"]
        },
        "application/x-tar": {
          source: "apache",
          compressible: true,
          extensions: ["tar"]
        },
        "application/x-tcl": {
          source: "apache",
          extensions: ["tcl", "tk"]
        },
        "application/x-tex": {
          source: "apache",
          extensions: ["tex"]
        },
        "application/x-tex-tfm": {
          source: "apache",
          extensions: ["tfm"]
        },
        "application/x-texinfo": {
          source: "apache",
          extensions: ["texinfo", "texi"]
        },
        "application/x-tgif": {
          source: "apache",
          extensions: ["obj"]
        },
        "application/x-ustar": {
          source: "apache",
          extensions: ["ustar"]
        },
        "application/x-virtualbox-hdd": {
          compressible: true,
          extensions: ["hdd"]
        },
        "application/x-virtualbox-ova": {
          compressible: true,
          extensions: ["ova"]
        },
        "application/x-virtualbox-ovf": {
          compressible: true,
          extensions: ["ovf"]
        },
        "application/x-virtualbox-vbox": {
          compressible: true,
          extensions: ["vbox"]
        },
        "application/x-virtualbox-vbox-extpack": {
          compressible: false,
          extensions: ["vbox-extpack"]
        },
        "application/x-virtualbox-vdi": {
          compressible: true,
          extensions: ["vdi"]
        },
        "application/x-virtualbox-vhd": {
          compressible: true,
          extensions: ["vhd"]
        },
        "application/x-virtualbox-vmdk": {
          compressible: true,
          extensions: ["vmdk"]
        },
        "application/x-wais-source": {
          source: "apache",
          extensions: ["src"]
        },
        "application/x-web-app-manifest+json": {
          compressible: true,
          extensions: ["webapp"]
        },
        "application/x-www-form-urlencoded": {
          source: "iana",
          compressible: true
        },
        "application/x-x509-ca-cert": {
          source: "iana",
          extensions: ["der", "crt", "pem"]
        },
        "application/x-x509-ca-ra-cert": {
          source: "iana"
        },
        "application/x-x509-next-ca-cert": {
          source: "iana"
        },
        "application/x-xfig": {
          source: "apache",
          extensions: ["fig"]
        },
        "application/x-xliff+xml": {
          source: "apache",
          compressible: true,
          extensions: ["xlf"]
        },
        "application/x-xpinstall": {
          source: "apache",
          compressible: false,
          extensions: ["xpi"]
        },
        "application/x-xz": {
          source: "apache",
          extensions: ["xz"]
        },
        "application/x-zmachine": {
          source: "apache",
          extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
        },
        "application/x400-bp": {
          source: "iana"
        },
        "application/xacml+xml": {
          source: "iana",
          compressible: true
        },
        "application/xaml+xml": {
          source: "apache",
          compressible: true,
          extensions: ["xaml"]
        },
        "application/xcap-att+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xav"]
        },
        "application/xcap-caps+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xca"]
        },
        "application/xcap-diff+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xdf"]
        },
        "application/xcap-el+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xel"]
        },
        "application/xcap-error+xml": {
          source: "iana",
          compressible: true
        },
        "application/xcap-ns+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xns"]
        },
        "application/xcon-conference-info+xml": {
          source: "iana",
          compressible: true
        },
        "application/xcon-conference-info-diff+xml": {
          source: "iana",
          compressible: true
        },
        "application/xenc+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xenc"]
        },
        "application/xhtml+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xhtml", "xht"]
        },
        "application/xhtml-voice+xml": {
          source: "apache",
          compressible: true
        },
        "application/xliff+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xlf"]
        },
        "application/xml": {
          source: "iana",
          compressible: true,
          extensions: ["xml", "xsl", "xsd", "rng"]
        },
        "application/xml-dtd": {
          source: "iana",
          compressible: true,
          extensions: ["dtd"]
        },
        "application/xml-external-parsed-entity": {
          source: "iana"
        },
        "application/xml-patch+xml": {
          source: "iana",
          compressible: true
        },
        "application/xmpp+xml": {
          source: "iana",
          compressible: true
        },
        "application/xop+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xop"]
        },
        "application/xproc+xml": {
          source: "apache",
          compressible: true,
          extensions: ["xpl"]
        },
        "application/xslt+xml": {
          source: "iana",
          compressible: true,
          extensions: ["xsl", "xslt"]
        },
        "application/xspf+xml": {
          source: "apache",
          compressible: true,
          extensions: ["xspf"]
        },
        "application/xv+xml": {
          source: "iana",
          compressible: true,
          extensions: ["mxml", "xhvml", "xvml", "xvm"]
        },
        "application/yang": {
          source: "iana",
          extensions: ["yang"]
        },
        "application/yang-data+json": {
          source: "iana",
          compressible: true
        },
        "application/yang-data+xml": {
          source: "iana",
          compressible: true
        },
        "application/yang-patch+json": {
          source: "iana",
          compressible: true
        },
        "application/yang-patch+xml": {
          source: "iana",
          compressible: true
        },
        "application/yin+xml": {
          source: "iana",
          compressible: true,
          extensions: ["yin"]
        },
        "application/zip": {
          source: "iana",
          compressible: false,
          extensions: ["zip"]
        },
        "application/zlib": {
          source: "iana"
        },
        "application/zstd": {
          source: "iana"
        },
        "audio/1d-interleaved-parityfec": {
          source: "iana"
        },
        "audio/32kadpcm": {
          source: "iana"
        },
        "audio/3gpp": {
          source: "iana",
          compressible: false,
          extensions: ["3gpp"]
        },
        "audio/3gpp2": {
          source: "iana"
        },
        "audio/aac": {
          source: "iana"
        },
        "audio/ac3": {
          source: "iana"
        },
        "audio/adpcm": {
          source: "apache",
          extensions: ["adp"]
        },
        "audio/amr": {
          source: "iana",
          extensions: ["amr"]
        },
        "audio/amr-wb": {
          source: "iana"
        },
        "audio/amr-wb+": {
          source: "iana"
        },
        "audio/aptx": {
          source: "iana"
        },
        "audio/asc": {
          source: "iana"
        },
        "audio/atrac-advanced-lossless": {
          source: "iana"
        },
        "audio/atrac-x": {
          source: "iana"
        },
        "audio/atrac3": {
          source: "iana"
        },
        "audio/basic": {
          source: "iana",
          compressible: false,
          extensions: ["au", "snd"]
        },
        "audio/bv16": {
          source: "iana"
        },
        "audio/bv32": {
          source: "iana"
        },
        "audio/clearmode": {
          source: "iana"
        },
        "audio/cn": {
          source: "iana"
        },
        "audio/dat12": {
          source: "iana"
        },
        "audio/dls": {
          source: "iana"
        },
        "audio/dsr-es201108": {
          source: "iana"
        },
        "audio/dsr-es202050": {
          source: "iana"
        },
        "audio/dsr-es202211": {
          source: "iana"
        },
        "audio/dsr-es202212": {
          source: "iana"
        },
        "audio/dv": {
          source: "iana"
        },
        "audio/dvi4": {
          source: "iana"
        },
        "audio/eac3": {
          source: "iana"
        },
        "audio/encaprtp": {
          source: "iana"
        },
        "audio/evrc": {
          source: "iana"
        },
        "audio/evrc-qcp": {
          source: "iana"
        },
        "audio/evrc0": {
          source: "iana"
        },
        "audio/evrc1": {
          source: "iana"
        },
        "audio/evrcb": {
          source: "iana"
        },
        "audio/evrcb0": {
          source: "iana"
        },
        "audio/evrcb1": {
          source: "iana"
        },
        "audio/evrcnw": {
          source: "iana"
        },
        "audio/evrcnw0": {
          source: "iana"
        },
        "audio/evrcnw1": {
          source: "iana"
        },
        "audio/evrcwb": {
          source: "iana"
        },
        "audio/evrcwb0": {
          source: "iana"
        },
        "audio/evrcwb1": {
          source: "iana"
        },
        "audio/evs": {
          source: "iana"
        },
        "audio/flexfec": {
          source: "iana"
        },
        "audio/fwdred": {
          source: "iana"
        },
        "audio/g711-0": {
          source: "iana"
        },
        "audio/g719": {
          source: "iana"
        },
        "audio/g722": {
          source: "iana"
        },
        "audio/g7221": {
          source: "iana"
        },
        "audio/g723": {
          source: "iana"
        },
        "audio/g726-16": {
          source: "iana"
        },
        "audio/g726-24": {
          source: "iana"
        },
        "audio/g726-32": {
          source: "iana"
        },
        "audio/g726-40": {
          source: "iana"
        },
        "audio/g728": {
          source: "iana"
        },
        "audio/g729": {
          source: "iana"
        },
        "audio/g7291": {
          source: "iana"
        },
        "audio/g729d": {
          source: "iana"
        },
        "audio/g729e": {
          source: "iana"
        },
        "audio/gsm": {
          source: "iana"
        },
        "audio/gsm-efr": {
          source: "iana"
        },
        "audio/gsm-hr-08": {
          source: "iana"
        },
        "audio/ilbc": {
          source: "iana"
        },
        "audio/ip-mr_v2.5": {
          source: "iana"
        },
        "audio/isac": {
          source: "apache"
        },
        "audio/l16": {
          source: "iana"
        },
        "audio/l20": {
          source: "iana"
        },
        "audio/l24": {
          source: "iana",
          compressible: false
        },
        "audio/l8": {
          source: "iana"
        },
        "audio/lpc": {
          source: "iana"
        },
        "audio/melp": {
          source: "iana"
        },
        "audio/melp1200": {
          source: "iana"
        },
        "audio/melp2400": {
          source: "iana"
        },
        "audio/melp600": {
          source: "iana"
        },
        "audio/mhas": {
          source: "iana"
        },
        "audio/midi": {
          source: "apache",
          extensions: ["mid", "midi", "kar", "rmi"]
        },
        "audio/mobile-xmf": {
          source: "iana",
          extensions: ["mxmf"]
        },
        "audio/mp3": {
          compressible: false,
          extensions: ["mp3"]
        },
        "audio/mp4": {
          source: "iana",
          compressible: false,
          extensions: ["m4a", "mp4a"]
        },
        "audio/mp4a-latm": {
          source: "iana"
        },
        "audio/mpa": {
          source: "iana"
        },
        "audio/mpa-robust": {
          source: "iana"
        },
        "audio/mpeg": {
          source: "iana",
          compressible: false,
          extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
        },
        "audio/mpeg4-generic": {
          source: "iana"
        },
        "audio/musepack": {
          source: "apache"
        },
        "audio/ogg": {
          source: "iana",
          compressible: false,
          extensions: ["oga", "ogg", "spx", "opus"]
        },
        "audio/opus": {
          source: "iana"
        },
        "audio/parityfec": {
          source: "iana"
        },
        "audio/pcma": {
          source: "iana"
        },
        "audio/pcma-wb": {
          source: "iana"
        },
        "audio/pcmu": {
          source: "iana"
        },
        "audio/pcmu-wb": {
          source: "iana"
        },
        "audio/prs.sid": {
          source: "iana"
        },
        "audio/qcelp": {
          source: "iana"
        },
        "audio/raptorfec": {
          source: "iana"
        },
        "audio/red": {
          source: "iana"
        },
        "audio/rtp-enc-aescm128": {
          source: "iana"
        },
        "audio/rtp-midi": {
          source: "iana"
        },
        "audio/rtploopback": {
          source: "iana"
        },
        "audio/rtx": {
          source: "iana"
        },
        "audio/s3m": {
          source: "apache",
          extensions: ["s3m"]
        },
        "audio/scip": {
          source: "iana"
        },
        "audio/silk": {
          source: "apache",
          extensions: ["sil"]
        },
        "audio/smv": {
          source: "iana"
        },
        "audio/smv-qcp": {
          source: "iana"
        },
        "audio/smv0": {
          source: "iana"
        },
        "audio/sofa": {
          source: "iana"
        },
        "audio/sp-midi": {
          source: "iana"
        },
        "audio/speex": {
          source: "iana"
        },
        "audio/t140c": {
          source: "iana"
        },
        "audio/t38": {
          source: "iana"
        },
        "audio/telephone-event": {
          source: "iana"
        },
        "audio/tetra_acelp": {
          source: "iana"
        },
        "audio/tetra_acelp_bb": {
          source: "iana"
        },
        "audio/tone": {
          source: "iana"
        },
        "audio/tsvcis": {
          source: "iana"
        },
        "audio/uemclip": {
          source: "iana"
        },
        "audio/ulpfec": {
          source: "iana"
        },
        "audio/usac": {
          source: "iana"
        },
        "audio/vdvi": {
          source: "iana"
        },
        "audio/vmr-wb": {
          source: "iana"
        },
        "audio/vnd.3gpp.iufp": {
          source: "iana"
        },
        "audio/vnd.4sb": {
          source: "iana"
        },
        "audio/vnd.audiokoz": {
          source: "iana"
        },
        "audio/vnd.celp": {
          source: "iana"
        },
        "audio/vnd.cisco.nse": {
          source: "iana"
        },
        "audio/vnd.cmles.radio-events": {
          source: "iana"
        },
        "audio/vnd.cns.anp1": {
          source: "iana"
        },
        "audio/vnd.cns.inf1": {
          source: "iana"
        },
        "audio/vnd.dece.audio": {
          source: "iana",
          extensions: ["uva", "uvva"]
        },
        "audio/vnd.digital-winds": {
          source: "iana",
          extensions: ["eol"]
        },
        "audio/vnd.dlna.adts": {
          source: "iana"
        },
        "audio/vnd.dolby.heaac.1": {
          source: "iana"
        },
        "audio/vnd.dolby.heaac.2": {
          source: "iana"
        },
        "audio/vnd.dolby.mlp": {
          source: "iana"
        },
        "audio/vnd.dolby.mps": {
          source: "iana"
        },
        "audio/vnd.dolby.pl2": {
          source: "iana"
        },
        "audio/vnd.dolby.pl2x": {
          source: "iana"
        },
        "audio/vnd.dolby.pl2z": {
          source: "iana"
        },
        "audio/vnd.dolby.pulse.1": {
          source: "iana"
        },
        "audio/vnd.dra": {
          source: "iana",
          extensions: ["dra"]
        },
        "audio/vnd.dts": {
          source: "iana",
          extensions: ["dts"]
        },
        "audio/vnd.dts.hd": {
          source: "iana",
          extensions: ["dtshd"]
        },
        "audio/vnd.dts.uhd": {
          source: "iana"
        },
        "audio/vnd.dvb.file": {
          source: "iana"
        },
        "audio/vnd.everad.plj": {
          source: "iana"
        },
        "audio/vnd.hns.audio": {
          source: "iana"
        },
        "audio/vnd.lucent.voice": {
          source: "iana",
          extensions: ["lvp"]
        },
        "audio/vnd.ms-playready.media.pya": {
          source: "iana",
          extensions: ["pya"]
        },
        "audio/vnd.nokia.mobile-xmf": {
          source: "iana"
        },
        "audio/vnd.nortel.vbk": {
          source: "iana"
        },
        "audio/vnd.nuera.ecelp4800": {
          source: "iana",
          extensions: ["ecelp4800"]
        },
        "audio/vnd.nuera.ecelp7470": {
          source: "iana",
          extensions: ["ecelp7470"]
        },
        "audio/vnd.nuera.ecelp9600": {
          source: "iana",
          extensions: ["ecelp9600"]
        },
        "audio/vnd.octel.sbc": {
          source: "iana"
        },
        "audio/vnd.presonus.multitrack": {
          source: "iana"
        },
        "audio/vnd.qcelp": {
          source: "iana"
        },
        "audio/vnd.rhetorex.32kadpcm": {
          source: "iana"
        },
        "audio/vnd.rip": {
          source: "iana",
          extensions: ["rip"]
        },
        "audio/vnd.rn-realaudio": {
          compressible: false
        },
        "audio/vnd.sealedmedia.softseal.mpeg": {
          source: "iana"
        },
        "audio/vnd.vmx.cvsd": {
          source: "iana"
        },
        "audio/vnd.wave": {
          compressible: false
        },
        "audio/vorbis": {
          source: "iana",
          compressible: false
        },
        "audio/vorbis-config": {
          source: "iana"
        },
        "audio/wav": {
          compressible: false,
          extensions: ["wav"]
        },
        "audio/wave": {
          compressible: false,
          extensions: ["wav"]
        },
        "audio/webm": {
          source: "apache",
          compressible: false,
          extensions: ["weba"]
        },
        "audio/x-aac": {
          source: "apache",
          compressible: false,
          extensions: ["aac"]
        },
        "audio/x-aiff": {
          source: "apache",
          extensions: ["aif", "aiff", "aifc"]
        },
        "audio/x-caf": {
          source: "apache",
          compressible: false,
          extensions: ["caf"]
        },
        "audio/x-flac": {
          source: "apache",
          extensions: ["flac"]
        },
        "audio/x-m4a": {
          source: "nginx",
          extensions: ["m4a"]
        },
        "audio/x-matroska": {
          source: "apache",
          extensions: ["mka"]
        },
        "audio/x-mpegurl": {
          source: "apache",
          extensions: ["m3u"]
        },
        "audio/x-ms-wax": {
          source: "apache",
          extensions: ["wax"]
        },
        "audio/x-ms-wma": {
          source: "apache",
          extensions: ["wma"]
        },
        "audio/x-pn-realaudio": {
          source: "apache",
          extensions: ["ram", "ra"]
        },
        "audio/x-pn-realaudio-plugin": {
          source: "apache",
          extensions: ["rmp"]
        },
        "audio/x-realaudio": {
          source: "nginx",
          extensions: ["ra"]
        },
        "audio/x-tta": {
          source: "apache"
        },
        "audio/x-wav": {
          source: "apache",
          extensions: ["wav"]
        },
        "audio/xm": {
          source: "apache",
          extensions: ["xm"]
        },
        "chemical/x-cdx": {
          source: "apache",
          extensions: ["cdx"]
        },
        "chemical/x-cif": {
          source: "apache",
          extensions: ["cif"]
        },
        "chemical/x-cmdf": {
          source: "apache",
          extensions: ["cmdf"]
        },
        "chemical/x-cml": {
          source: "apache",
          extensions: ["cml"]
        },
        "chemical/x-csml": {
          source: "apache",
          extensions: ["csml"]
        },
        "chemical/x-pdb": {
          source: "apache"
        },
        "chemical/x-xyz": {
          source: "apache",
          extensions: ["xyz"]
        },
        "font/collection": {
          source: "iana",
          extensions: ["ttc"]
        },
        "font/otf": {
          source: "iana",
          compressible: true,
          extensions: ["otf"]
        },
        "font/sfnt": {
          source: "iana"
        },
        "font/ttf": {
          source: "iana",
          compressible: true,
          extensions: ["ttf"]
        },
        "font/woff": {
          source: "iana",
          extensions: ["woff"]
        },
        "font/woff2": {
          source: "iana",
          extensions: ["woff2"]
        },
        "image/aces": {
          source: "iana",
          extensions: ["exr"]
        },
        "image/apng": {
          compressible: false,
          extensions: ["apng"]
        },
        "image/avci": {
          source: "iana",
          extensions: ["avci"]
        },
        "image/avcs": {
          source: "iana",
          extensions: ["avcs"]
        },
        "image/avif": {
          source: "iana",
          compressible: false,
          extensions: ["avif"]
        },
        "image/bmp": {
          source: "iana",
          compressible: true,
          extensions: ["bmp"]
        },
        "image/cgm": {
          source: "iana",
          extensions: ["cgm"]
        },
        "image/dicom-rle": {
          source: "iana",
          extensions: ["drle"]
        },
        "image/emf": {
          source: "iana",
          extensions: ["emf"]
        },
        "image/fits": {
          source: "iana",
          extensions: ["fits"]
        },
        "image/g3fax": {
          source: "iana",
          extensions: ["g3"]
        },
        "image/gif": {
          source: "iana",
          compressible: false,
          extensions: ["gif"]
        },
        "image/heic": {
          source: "iana",
          extensions: ["heic"]
        },
        "image/heic-sequence": {
          source: "iana",
          extensions: ["heics"]
        },
        "image/heif": {
          source: "iana",
          extensions: ["heif"]
        },
        "image/heif-sequence": {
          source: "iana",
          extensions: ["heifs"]
        },
        "image/hej2k": {
          source: "iana",
          extensions: ["hej2"]
        },
        "image/hsj2": {
          source: "iana",
          extensions: ["hsj2"]
        },
        "image/ief": {
          source: "iana",
          extensions: ["ief"]
        },
        "image/jls": {
          source: "iana",
          extensions: ["jls"]
        },
        "image/jp2": {
          source: "iana",
          compressible: false,
          extensions: ["jp2", "jpg2"]
        },
        "image/jpeg": {
          source: "iana",
          compressible: false,
          extensions: ["jpeg", "jpg", "jpe"]
        },
        "image/jph": {
          source: "iana",
          extensions: ["jph"]
        },
        "image/jphc": {
          source: "iana",
          extensions: ["jhc"]
        },
        "image/jpm": {
          source: "iana",
          compressible: false,
          extensions: ["jpm"]
        },
        "image/jpx": {
          source: "iana",
          compressible: false,
          extensions: ["jpx", "jpf"]
        },
        "image/jxr": {
          source: "iana",
          extensions: ["jxr"]
        },
        "image/jxra": {
          source: "iana",
          extensions: ["jxra"]
        },
        "image/jxrs": {
          source: "iana",
          extensions: ["jxrs"]
        },
        "image/jxs": {
          source: "iana",
          extensions: ["jxs"]
        },
        "image/jxsc": {
          source: "iana",
          extensions: ["jxsc"]
        },
        "image/jxsi": {
          source: "iana",
          extensions: ["jxsi"]
        },
        "image/jxss": {
          source: "iana",
          extensions: ["jxss"]
        },
        "image/ktx": {
          source: "iana",
          extensions: ["ktx"]
        },
        "image/ktx2": {
          source: "iana",
          extensions: ["ktx2"]
        },
        "image/naplps": {
          source: "iana"
        },
        "image/pjpeg": {
          compressible: false
        },
        "image/png": {
          source: "iana",
          compressible: false,
          extensions: ["png"]
        },
        "image/prs.btif": {
          source: "iana",
          extensions: ["btif"]
        },
        "image/prs.pti": {
          source: "iana",
          extensions: ["pti"]
        },
        "image/pwg-raster": {
          source: "iana"
        },
        "image/sgi": {
          source: "apache",
          extensions: ["sgi"]
        },
        "image/svg+xml": {
          source: "iana",
          compressible: true,
          extensions: ["svg", "svgz"]
        },
        "image/t38": {
          source: "iana",
          extensions: ["t38"]
        },
        "image/tiff": {
          source: "iana",
          compressible: false,
          extensions: ["tif", "tiff"]
        },
        "image/tiff-fx": {
          source: "iana",
          extensions: ["tfx"]
        },
        "image/vnd.adobe.photoshop": {
          source: "iana",
          compressible: true,
          extensions: ["psd"]
        },
        "image/vnd.airzip.accelerator.azv": {
          source: "iana",
          extensions: ["azv"]
        },
        "image/vnd.cns.inf2": {
          source: "iana"
        },
        "image/vnd.dece.graphic": {
          source: "iana",
          extensions: ["uvi", "uvvi", "uvg", "uvvg"]
        },
        "image/vnd.djvu": {
          source: "iana",
          extensions: ["djvu", "djv"]
        },
        "image/vnd.dvb.subtitle": {
          source: "iana",
          extensions: ["sub"]
        },
        "image/vnd.dwg": {
          source: "iana",
          extensions: ["dwg"]
        },
        "image/vnd.dxf": {
          source: "iana",
          extensions: ["dxf"]
        },
        "image/vnd.fastbidsheet": {
          source: "iana",
          extensions: ["fbs"]
        },
        "image/vnd.fpx": {
          source: "iana",
          extensions: ["fpx"]
        },
        "image/vnd.fst": {
          source: "iana",
          extensions: ["fst"]
        },
        "image/vnd.fujixerox.edmics-mmr": {
          source: "iana",
          extensions: ["mmr"]
        },
        "image/vnd.fujixerox.edmics-rlc": {
          source: "iana",
          extensions: ["rlc"]
        },
        "image/vnd.globalgraphics.pgb": {
          source: "iana"
        },
        "image/vnd.microsoft.icon": {
          source: "iana",
          compressible: true,
          extensions: ["ico"]
        },
        "image/vnd.mix": {
          source: "iana"
        },
        "image/vnd.mozilla.apng": {
          source: "iana"
        },
        "image/vnd.ms-dds": {
          compressible: true,
          extensions: ["dds"]
        },
        "image/vnd.ms-modi": {
          source: "iana",
          extensions: ["mdi"]
        },
        "image/vnd.ms-photo": {
          source: "apache",
          extensions: ["wdp"]
        },
        "image/vnd.net-fpx": {
          source: "iana",
          extensions: ["npx"]
        },
        "image/vnd.pco.b16": {
          source: "iana",
          extensions: ["b16"]
        },
        "image/vnd.radiance": {
          source: "iana"
        },
        "image/vnd.sealed.png": {
          source: "iana"
        },
        "image/vnd.sealedmedia.softseal.gif": {
          source: "iana"
        },
        "image/vnd.sealedmedia.softseal.jpg": {
          source: "iana"
        },
        "image/vnd.svf": {
          source: "iana"
        },
        "image/vnd.tencent.tap": {
          source: "iana",
          extensions: ["tap"]
        },
        "image/vnd.valve.source.texture": {
          source: "iana",
          extensions: ["vtf"]
        },
        "image/vnd.wap.wbmp": {
          source: "iana",
          extensions: ["wbmp"]
        },
        "image/vnd.xiff": {
          source: "iana",
          extensions: ["xif"]
        },
        "image/vnd.zbrush.pcx": {
          source: "iana",
          extensions: ["pcx"]
        },
        "image/webp": {
          source: "apache",
          extensions: ["webp"]
        },
        "image/wmf": {
          source: "iana",
          extensions: ["wmf"]
        },
        "image/x-3ds": {
          source: "apache",
          extensions: ["3ds"]
        },
        "image/x-cmu-raster": {
          source: "apache",
          extensions: ["ras"]
        },
        "image/x-cmx": {
          source: "apache",
          extensions: ["cmx"]
        },
        "image/x-freehand": {
          source: "apache",
          extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
        },
        "image/x-icon": {
          source: "apache",
          compressible: true,
          extensions: ["ico"]
        },
        "image/x-jng": {
          source: "nginx",
          extensions: ["jng"]
        },
        "image/x-mrsid-image": {
          source: "apache",
          extensions: ["sid"]
        },
        "image/x-ms-bmp": {
          source: "nginx",
          compressible: true,
          extensions: ["bmp"]
        },
        "image/x-pcx": {
          source: "apache",
          extensions: ["pcx"]
        },
        "image/x-pict": {
          source: "apache",
          extensions: ["pic", "pct"]
        },
        "image/x-portable-anymap": {
          source: "apache",
          extensions: ["pnm"]
        },
        "image/x-portable-bitmap": {
          source: "apache",
          extensions: ["pbm"]
        },
        "image/x-portable-graymap": {
          source: "apache",
          extensions: ["pgm"]
        },
        "image/x-portable-pixmap": {
          source: "apache",
          extensions: ["ppm"]
        },
        "image/x-rgb": {
          source: "apache",
          extensions: ["rgb"]
        },
        "image/x-tga": {
          source: "apache",
          extensions: ["tga"]
        },
        "image/x-xbitmap": {
          source: "apache",
          extensions: ["xbm"]
        },
        "image/x-xcf": {
          compressible: false
        },
        "image/x-xpixmap": {
          source: "apache",
          extensions: ["xpm"]
        },
        "image/x-xwindowdump": {
          source: "apache",
          extensions: ["xwd"]
        },
        "message/cpim": {
          source: "iana"
        },
        "message/delivery-status": {
          source: "iana"
        },
        "message/disposition-notification": {
          source: "iana",
          extensions: [
            "disposition-notification"
          ]
        },
        "message/external-body": {
          source: "iana"
        },
        "message/feedback-report": {
          source: "iana"
        },
        "message/global": {
          source: "iana",
          extensions: ["u8msg"]
        },
        "message/global-delivery-status": {
          source: "iana",
          extensions: ["u8dsn"]
        },
        "message/global-disposition-notification": {
          source: "iana",
          extensions: ["u8mdn"]
        },
        "message/global-headers": {
          source: "iana",
          extensions: ["u8hdr"]
        },
        "message/http": {
          source: "iana",
          compressible: false
        },
        "message/imdn+xml": {
          source: "iana",
          compressible: true
        },
        "message/news": {
          source: "iana"
        },
        "message/partial": {
          source: "iana",
          compressible: false
        },
        "message/rfc822": {
          source: "iana",
          compressible: true,
          extensions: ["eml", "mime"]
        },
        "message/s-http": {
          source: "iana"
        },
        "message/sip": {
          source: "iana"
        },
        "message/sipfrag": {
          source: "iana"
        },
        "message/tracking-status": {
          source: "iana"
        },
        "message/vnd.si.simp": {
          source: "iana"
        },
        "message/vnd.wfa.wsc": {
          source: "iana",
          extensions: ["wsc"]
        },
        "model/3mf": {
          source: "iana",
          extensions: ["3mf"]
        },
        "model/e57": {
          source: "iana"
        },
        "model/gltf+json": {
          source: "iana",
          compressible: true,
          extensions: ["gltf"]
        },
        "model/gltf-binary": {
          source: "iana",
          compressible: true,
          extensions: ["glb"]
        },
        "model/iges": {
          source: "iana",
          compressible: false,
          extensions: ["igs", "iges"]
        },
        "model/mesh": {
          source: "iana",
          compressible: false,
          extensions: ["msh", "mesh", "silo"]
        },
        "model/mtl": {
          source: "iana",
          extensions: ["mtl"]
        },
        "model/obj": {
          source: "iana",
          extensions: ["obj"]
        },
        "model/step": {
          source: "iana"
        },
        "model/step+xml": {
          source: "iana",
          compressible: true,
          extensions: ["stpx"]
        },
        "model/step+zip": {
          source: "iana",
          compressible: false,
          extensions: ["stpz"]
        },
        "model/step-xml+zip": {
          source: "iana",
          compressible: false,
          extensions: ["stpxz"]
        },
        "model/stl": {
          source: "iana",
          extensions: ["stl"]
        },
        "model/vnd.collada+xml": {
          source: "iana",
          compressible: true,
          extensions: ["dae"]
        },
        "model/vnd.dwf": {
          source: "iana",
          extensions: ["dwf"]
        },
        "model/vnd.flatland.3dml": {
          source: "iana"
        },
        "model/vnd.gdl": {
          source: "iana",
          extensions: ["gdl"]
        },
        "model/vnd.gs-gdl": {
          source: "apache"
        },
        "model/vnd.gs.gdl": {
          source: "iana"
        },
        "model/vnd.gtw": {
          source: "iana",
          extensions: ["gtw"]
        },
        "model/vnd.moml+xml": {
          source: "iana",
          compressible: true
        },
        "model/vnd.mts": {
          source: "iana",
          extensions: ["mts"]
        },
        "model/vnd.opengex": {
          source: "iana",
          extensions: ["ogex"]
        },
        "model/vnd.parasolid.transmit.binary": {
          source: "iana",
          extensions: ["x_b"]
        },
        "model/vnd.parasolid.transmit.text": {
          source: "iana",
          extensions: ["x_t"]
        },
        "model/vnd.pytha.pyox": {
          source: "iana"
        },
        "model/vnd.rosette.annotated-data-model": {
          source: "iana"
        },
        "model/vnd.sap.vds": {
          source: "iana",
          extensions: ["vds"]
        },
        "model/vnd.usdz+zip": {
          source: "iana",
          compressible: false,
          extensions: ["usdz"]
        },
        "model/vnd.valve.source.compiled-map": {
          source: "iana",
          extensions: ["bsp"]
        },
        "model/vnd.vtu": {
          source: "iana",
          extensions: ["vtu"]
        },
        "model/vrml": {
          source: "iana",
          compressible: false,
          extensions: ["wrl", "vrml"]
        },
        "model/x3d+binary": {
          source: "apache",
          compressible: false,
          extensions: ["x3db", "x3dbz"]
        },
        "model/x3d+fastinfoset": {
          source: "iana",
          extensions: ["x3db"]
        },
        "model/x3d+vrml": {
          source: "apache",
          compressible: false,
          extensions: ["x3dv", "x3dvz"]
        },
        "model/x3d+xml": {
          source: "iana",
          compressible: true,
          extensions: ["x3d", "x3dz"]
        },
        "model/x3d-vrml": {
          source: "iana",
          extensions: ["x3dv"]
        },
        "multipart/alternative": {
          source: "iana",
          compressible: false
        },
        "multipart/appledouble": {
          source: "iana"
        },
        "multipart/byteranges": {
          source: "iana"
        },
        "multipart/digest": {
          source: "iana"
        },
        "multipart/encrypted": {
          source: "iana",
          compressible: false
        },
        "multipart/form-data": {
          source: "iana",
          compressible: false
        },
        "multipart/header-set": {
          source: "iana"
        },
        "multipart/mixed": {
          source: "iana"
        },
        "multipart/multilingual": {
          source: "iana"
        },
        "multipart/parallel": {
          source: "iana"
        },
        "multipart/related": {
          source: "iana",
          compressible: false
        },
        "multipart/report": {
          source: "iana"
        },
        "multipart/signed": {
          source: "iana",
          compressible: false
        },
        "multipart/vnd.bint.med-plus": {
          source: "iana"
        },
        "multipart/voice-message": {
          source: "iana"
        },
        "multipart/x-mixed-replace": {
          source: "iana"
        },
        "text/1d-interleaved-parityfec": {
          source: "iana"
        },
        "text/cache-manifest": {
          source: "iana",
          compressible: true,
          extensions: ["appcache", "manifest"]
        },
        "text/calendar": {
          source: "iana",
          extensions: ["ics", "ifb"]
        },
        "text/calender": {
          compressible: true
        },
        "text/cmd": {
          compressible: true
        },
        "text/coffeescript": {
          extensions: ["coffee", "litcoffee"]
        },
        "text/cql": {
          source: "iana"
        },
        "text/cql-expression": {
          source: "iana"
        },
        "text/cql-identifier": {
          source: "iana"
        },
        "text/css": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["css"]
        },
        "text/csv": {
          source: "iana",
          compressible: true,
          extensions: ["csv"]
        },
        "text/csv-schema": {
          source: "iana"
        },
        "text/directory": {
          source: "iana"
        },
        "text/dns": {
          source: "iana"
        },
        "text/ecmascript": {
          source: "iana"
        },
        "text/encaprtp": {
          source: "iana"
        },
        "text/enriched": {
          source: "iana"
        },
        "text/fhirpath": {
          source: "iana"
        },
        "text/flexfec": {
          source: "iana"
        },
        "text/fwdred": {
          source: "iana"
        },
        "text/gff3": {
          source: "iana"
        },
        "text/grammar-ref-list": {
          source: "iana"
        },
        "text/html": {
          source: "iana",
          compressible: true,
          extensions: ["html", "htm", "shtml"]
        },
        "text/jade": {
          extensions: ["jade"]
        },
        "text/javascript": {
          source: "iana",
          compressible: true
        },
        "text/jcr-cnd": {
          source: "iana"
        },
        "text/jsx": {
          compressible: true,
          extensions: ["jsx"]
        },
        "text/less": {
          compressible: true,
          extensions: ["less"]
        },
        "text/markdown": {
          source: "iana",
          compressible: true,
          extensions: ["markdown", "md"]
        },
        "text/mathml": {
          source: "nginx",
          extensions: ["mml"]
        },
        "text/mdx": {
          compressible: true,
          extensions: ["mdx"]
        },
        "text/mizar": {
          source: "iana"
        },
        "text/n3": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["n3"]
        },
        "text/parameters": {
          source: "iana",
          charset: "UTF-8"
        },
        "text/parityfec": {
          source: "iana"
        },
        "text/plain": {
          source: "iana",
          compressible: true,
          extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
        },
        "text/provenance-notation": {
          source: "iana",
          charset: "UTF-8"
        },
        "text/prs.fallenstein.rst": {
          source: "iana"
        },
        "text/prs.lines.tag": {
          source: "iana",
          extensions: ["dsc"]
        },
        "text/prs.prop.logic": {
          source: "iana"
        },
        "text/raptorfec": {
          source: "iana"
        },
        "text/red": {
          source: "iana"
        },
        "text/rfc822-headers": {
          source: "iana"
        },
        "text/richtext": {
          source: "iana",
          compressible: true,
          extensions: ["rtx"]
        },
        "text/rtf": {
          source: "iana",
          compressible: true,
          extensions: ["rtf"]
        },
        "text/rtp-enc-aescm128": {
          source: "iana"
        },
        "text/rtploopback": {
          source: "iana"
        },
        "text/rtx": {
          source: "iana"
        },
        "text/sgml": {
          source: "iana",
          extensions: ["sgml", "sgm"]
        },
        "text/shaclc": {
          source: "iana"
        },
        "text/shex": {
          source: "iana",
          extensions: ["shex"]
        },
        "text/slim": {
          extensions: ["slim", "slm"]
        },
        "text/spdx": {
          source: "iana",
          extensions: ["spdx"]
        },
        "text/strings": {
          source: "iana"
        },
        "text/stylus": {
          extensions: ["stylus", "styl"]
        },
        "text/t140": {
          source: "iana"
        },
        "text/tab-separated-values": {
          source: "iana",
          compressible: true,
          extensions: ["tsv"]
        },
        "text/troff": {
          source: "iana",
          extensions: ["t", "tr", "roff", "man", "me", "ms"]
        },
        "text/turtle": {
          source: "iana",
          charset: "UTF-8",
          extensions: ["ttl"]
        },
        "text/ulpfec": {
          source: "iana"
        },
        "text/uri-list": {
          source: "iana",
          compressible: true,
          extensions: ["uri", "uris", "urls"]
        },
        "text/vcard": {
          source: "iana",
          compressible: true,
          extensions: ["vcard"]
        },
        "text/vnd.a": {
          source: "iana"
        },
        "text/vnd.abc": {
          source: "iana"
        },
        "text/vnd.ascii-art": {
          source: "iana"
        },
        "text/vnd.curl": {
          source: "iana",
          extensions: ["curl"]
        },
        "text/vnd.curl.dcurl": {
          source: "apache",
          extensions: ["dcurl"]
        },
        "text/vnd.curl.mcurl": {
          source: "apache",
          extensions: ["mcurl"]
        },
        "text/vnd.curl.scurl": {
          source: "apache",
          extensions: ["scurl"]
        },
        "text/vnd.debian.copyright": {
          source: "iana",
          charset: "UTF-8"
        },
        "text/vnd.dmclientscript": {
          source: "iana"
        },
        "text/vnd.dvb.subtitle": {
          source: "iana",
          extensions: ["sub"]
        },
        "text/vnd.esmertec.theme-descriptor": {
          source: "iana",
          charset: "UTF-8"
        },
        "text/vnd.familysearch.gedcom": {
          source: "iana",
          extensions: ["ged"]
        },
        "text/vnd.ficlab.flt": {
          source: "iana"
        },
        "text/vnd.fly": {
          source: "iana",
          extensions: ["fly"]
        },
        "text/vnd.fmi.flexstor": {
          source: "iana",
          extensions: ["flx"]
        },
        "text/vnd.gml": {
          source: "iana"
        },
        "text/vnd.graphviz": {
          source: "iana",
          extensions: ["gv"]
        },
        "text/vnd.hans": {
          source: "iana"
        },
        "text/vnd.hgl": {
          source: "iana"
        },
        "text/vnd.in3d.3dml": {
          source: "iana",
          extensions: ["3dml"]
        },
        "text/vnd.in3d.spot": {
          source: "iana",
          extensions: ["spot"]
        },
        "text/vnd.iptc.newsml": {
          source: "iana"
        },
        "text/vnd.iptc.nitf": {
          source: "iana"
        },
        "text/vnd.latex-z": {
          source: "iana"
        },
        "text/vnd.motorola.reflex": {
          source: "iana"
        },
        "text/vnd.ms-mediapackage": {
          source: "iana"
        },
        "text/vnd.net2phone.commcenter.command": {
          source: "iana"
        },
        "text/vnd.radisys.msml-basic-layout": {
          source: "iana"
        },
        "text/vnd.senx.warpscript": {
          source: "iana"
        },
        "text/vnd.si.uricatalogue": {
          source: "iana"
        },
        "text/vnd.sosi": {
          source: "iana"
        },
        "text/vnd.sun.j2me.app-descriptor": {
          source: "iana",
          charset: "UTF-8",
          extensions: ["jad"]
        },
        "text/vnd.trolltech.linguist": {
          source: "iana",
          charset: "UTF-8"
        },
        "text/vnd.wap.si": {
          source: "iana"
        },
        "text/vnd.wap.sl": {
          source: "iana"
        },
        "text/vnd.wap.wml": {
          source: "iana",
          extensions: ["wml"]
        },
        "text/vnd.wap.wmlscript": {
          source: "iana",
          extensions: ["wmls"]
        },
        "text/vtt": {
          source: "iana",
          charset: "UTF-8",
          compressible: true,
          extensions: ["vtt"]
        },
        "text/x-asm": {
          source: "apache",
          extensions: ["s", "asm"]
        },
        "text/x-c": {
          source: "apache",
          extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
        },
        "text/x-component": {
          source: "nginx",
          extensions: ["htc"]
        },
        "text/x-fortran": {
          source: "apache",
          extensions: ["f", "for", "f77", "f90"]
        },
        "text/x-gwt-rpc": {
          compressible: true
        },
        "text/x-handlebars-template": {
          extensions: ["hbs"]
        },
        "text/x-java-source": {
          source: "apache",
          extensions: ["java"]
        },
        "text/x-jquery-tmpl": {
          compressible: true
        },
        "text/x-lua": {
          extensions: ["lua"]
        },
        "text/x-markdown": {
          compressible: true,
          extensions: ["mkd"]
        },
        "text/x-nfo": {
          source: "apache",
          extensions: ["nfo"]
        },
        "text/x-opml": {
          source: "apache",
          extensions: ["opml"]
        },
        "text/x-org": {
          compressible: true,
          extensions: ["org"]
        },
        "text/x-pascal": {
          source: "apache",
          extensions: ["p", "pas"]
        },
        "text/x-processing": {
          compressible: true,
          extensions: ["pde"]
        },
        "text/x-sass": {
          extensions: ["sass"]
        },
        "text/x-scss": {
          extensions: ["scss"]
        },
        "text/x-setext": {
          source: "apache",
          extensions: ["etx"]
        },
        "text/x-sfv": {
          source: "apache",
          extensions: ["sfv"]
        },
        "text/x-suse-ymp": {
          compressible: true,
          extensions: ["ymp"]
        },
        "text/x-uuencode": {
          source: "apache",
          extensions: ["uu"]
        },
        "text/x-vcalendar": {
          source: "apache",
          extensions: ["vcs"]
        },
        "text/x-vcard": {
          source: "apache",
          extensions: ["vcf"]
        },
        "text/xml": {
          source: "iana",
          compressible: true,
          extensions: ["xml"]
        },
        "text/xml-external-parsed-entity": {
          source: "iana"
        },
        "text/yaml": {
          compressible: true,
          extensions: ["yaml", "yml"]
        },
        "video/1d-interleaved-parityfec": {
          source: "iana"
        },
        "video/3gpp": {
          source: "iana",
          extensions: ["3gp", "3gpp"]
        },
        "video/3gpp-tt": {
          source: "iana"
        },
        "video/3gpp2": {
          source: "iana",
          extensions: ["3g2"]
        },
        "video/av1": {
          source: "iana"
        },
        "video/bmpeg": {
          source: "iana"
        },
        "video/bt656": {
          source: "iana"
        },
        "video/celb": {
          source: "iana"
        },
        "video/dv": {
          source: "iana"
        },
        "video/encaprtp": {
          source: "iana"
        },
        "video/ffv1": {
          source: "iana"
        },
        "video/flexfec": {
          source: "iana"
        },
        "video/h261": {
          source: "iana",
          extensions: ["h261"]
        },
        "video/h263": {
          source: "iana",
          extensions: ["h263"]
        },
        "video/h263-1998": {
          source: "iana"
        },
        "video/h263-2000": {
          source: "iana"
        },
        "video/h264": {
          source: "iana",
          extensions: ["h264"]
        },
        "video/h264-rcdo": {
          source: "iana"
        },
        "video/h264-svc": {
          source: "iana"
        },
        "video/h265": {
          source: "iana"
        },
        "video/iso.segment": {
          source: "iana",
          extensions: ["m4s"]
        },
        "video/jpeg": {
          source: "iana",
          extensions: ["jpgv"]
        },
        "video/jpeg2000": {
          source: "iana"
        },
        "video/jpm": {
          source: "apache",
          extensions: ["jpm", "jpgm"]
        },
        "video/jxsv": {
          source: "iana"
        },
        "video/mj2": {
          source: "iana",
          extensions: ["mj2", "mjp2"]
        },
        "video/mp1s": {
          source: "iana"
        },
        "video/mp2p": {
          source: "iana"
        },
        "video/mp2t": {
          source: "iana",
          extensions: ["ts"]
        },
        "video/mp4": {
          source: "iana",
          compressible: false,
          extensions: ["mp4", "mp4v", "mpg4"]
        },
        "video/mp4v-es": {
          source: "iana"
        },
        "video/mpeg": {
          source: "iana",
          compressible: false,
          extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
        },
        "video/mpeg4-generic": {
          source: "iana"
        },
        "video/mpv": {
          source: "iana"
        },
        "video/nv": {
          source: "iana"
        },
        "video/ogg": {
          source: "iana",
          compressible: false,
          extensions: ["ogv"]
        },
        "video/parityfec": {
          source: "iana"
        },
        "video/pointer": {
          source: "iana"
        },
        "video/quicktime": {
          source: "iana",
          compressible: false,
          extensions: ["qt", "mov"]
        },
        "video/raptorfec": {
          source: "iana"
        },
        "video/raw": {
          source: "iana"
        },
        "video/rtp-enc-aescm128": {
          source: "iana"
        },
        "video/rtploopback": {
          source: "iana"
        },
        "video/rtx": {
          source: "iana"
        },
        "video/scip": {
          source: "iana"
        },
        "video/smpte291": {
          source: "iana"
        },
        "video/smpte292m": {
          source: "iana"
        },
        "video/ulpfec": {
          source: "iana"
        },
        "video/vc1": {
          source: "iana"
        },
        "video/vc2": {
          source: "iana"
        },
        "video/vnd.cctv": {
          source: "iana"
        },
        "video/vnd.dece.hd": {
          source: "iana",
          extensions: ["uvh", "uvvh"]
        },
        "video/vnd.dece.mobile": {
          source: "iana",
          extensions: ["uvm", "uvvm"]
        },
        "video/vnd.dece.mp4": {
          source: "iana"
        },
        "video/vnd.dece.pd": {
          source: "iana",
          extensions: ["uvp", "uvvp"]
        },
        "video/vnd.dece.sd": {
          source: "iana",
          extensions: ["uvs", "uvvs"]
        },
        "video/vnd.dece.video": {
          source: "iana",
          extensions: ["uvv", "uvvv"]
        },
        "video/vnd.directv.mpeg": {
          source: "iana"
        },
        "video/vnd.directv.mpeg-tts": {
          source: "iana"
        },
        "video/vnd.dlna.mpeg-tts": {
          source: "iana"
        },
        "video/vnd.dvb.file": {
          source: "iana",
          extensions: ["dvb"]
        },
        "video/vnd.fvt": {
          source: "iana",
          extensions: ["fvt"]
        },
        "video/vnd.hns.video": {
          source: "iana"
        },
        "video/vnd.iptvforum.1dparityfec-1010": {
          source: "iana"
        },
        "video/vnd.iptvforum.1dparityfec-2005": {
          source: "iana"
        },
        "video/vnd.iptvforum.2dparityfec-1010": {
          source: "iana"
        },
        "video/vnd.iptvforum.2dparityfec-2005": {
          source: "iana"
        },
        "video/vnd.iptvforum.ttsavc": {
          source: "iana"
        },
        "video/vnd.iptvforum.ttsmpeg2": {
          source: "iana"
        },
        "video/vnd.motorola.video": {
          source: "iana"
        },
        "video/vnd.motorola.videop": {
          source: "iana"
        },
        "video/vnd.mpegurl": {
          source: "iana",
          extensions: ["mxu", "m4u"]
        },
        "video/vnd.ms-playready.media.pyv": {
          source: "iana",
          extensions: ["pyv"]
        },
        "video/vnd.nokia.interleaved-multimedia": {
          source: "iana"
        },
        "video/vnd.nokia.mp4vr": {
          source: "iana"
        },
        "video/vnd.nokia.videovoip": {
          source: "iana"
        },
        "video/vnd.objectvideo": {
          source: "iana"
        },
        "video/vnd.radgamettools.bink": {
          source: "iana"
        },
        "video/vnd.radgamettools.smacker": {
          source: "iana"
        },
        "video/vnd.sealed.mpeg1": {
          source: "iana"
        },
        "video/vnd.sealed.mpeg4": {
          source: "iana"
        },
        "video/vnd.sealed.swf": {
          source: "iana"
        },
        "video/vnd.sealedmedia.softseal.mov": {
          source: "iana"
        },
        "video/vnd.uvvu.mp4": {
          source: "iana",
          extensions: ["uvu", "uvvu"]
        },
        "video/vnd.vivo": {
          source: "iana",
          extensions: ["viv"]
        },
        "video/vnd.youtube.yt": {
          source: "iana"
        },
        "video/vp8": {
          source: "iana"
        },
        "video/vp9": {
          source: "iana"
        },
        "video/webm": {
          source: "apache",
          compressible: false,
          extensions: ["webm"]
        },
        "video/x-f4v": {
          source: "apache",
          extensions: ["f4v"]
        },
        "video/x-fli": {
          source: "apache",
          extensions: ["fli"]
        },
        "video/x-flv": {
          source: "apache",
          compressible: false,
          extensions: ["flv"]
        },
        "video/x-m4v": {
          source: "apache",
          extensions: ["m4v"]
        },
        "video/x-matroska": {
          source: "apache",
          compressible: false,
          extensions: ["mkv", "mk3d", "mks"]
        },
        "video/x-mng": {
          source: "apache",
          extensions: ["mng"]
        },
        "video/x-ms-asf": {
          source: "apache",
          extensions: ["asf", "asx"]
        },
        "video/x-ms-vob": {
          source: "apache",
          extensions: ["vob"]
        },
        "video/x-ms-wm": {
          source: "apache",
          extensions: ["wm"]
        },
        "video/x-ms-wmv": {
          source: "apache",
          compressible: false,
          extensions: ["wmv"]
        },
        "video/x-ms-wmx": {
          source: "apache",
          extensions: ["wmx"]
        },
        "video/x-ms-wvx": {
          source: "apache",
          extensions: ["wvx"]
        },
        "video/x-msvideo": {
          source: "apache",
          extensions: ["avi"]
        },
        "video/x-sgi-movie": {
          source: "apache",
          extensions: ["movie"]
        },
        "video/x-smv": {
          source: "apache",
          extensions: ["smv"]
        },
        "x-conference/x-cooltalk": {
          source: "apache",
          extensions: ["ice"]
        },
        "x-shader/x-fragment": {
          compressible: true
        },
        "x-shader/x-vertex": {
          compressible: true
        }
      };
    }
  });

  // ../../../../../node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/index.js
  var require_mime_db = __commonJS({
    "../../../../../node_modules/.pnpm/mime-db@1.52.0/node_modules/mime-db/index.js"(exports, module) {
      "use strict";
      module.exports = require_db();
    }
  });

  // node-modules-polyfills:path
  var path_exports = {};
  __export(path_exports, {
    basename: () => basename,
    default: () => path_default,
    delimiter: () => delimiter,
    dirname: () => dirname,
    extname: () => extname,
    isAbsolute: () => isAbsolute,
    join: () => join,
    normalize: () => normalize,
    relative: () => relative,
    resolve: () => resolve,
    sep: () => sep
  });
  function normalizeArray(parts, allowAboveRoot) {
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    if (allowAboveRoot) {
      for (; up--; up) {
        parts.unshift("..");
      }
    }
    return parts;
  }
  function resolve() {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = i >= 0 ? arguments[i] : "/";
      if (typeof path !== "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        continue;
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = path.charAt(0) === "/";
    }
    resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(p) {
      return !!p;
    }), !resolvedAbsolute).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  }
  function normalize(path) {
    var isPathAbsolute = isAbsolute(path), trailingSlash = substr(path, -1) === "/";
    path = normalizeArray(filter(path.split("/"), function(p) {
      return !!p;
    }), !isPathAbsolute).join("/");
    if (!path && !isPathAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isPathAbsolute ? "/" : "") + path;
  }
  function isAbsolute(path) {
    return path.charAt(0) === "/";
  }
  function join() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return normalize(filter(paths, function(p, index) {
      if (typeof p !== "string") {
        throw new TypeError("Arguments to path.join must be strings");
      }
      return p;
    }).join("/"));
  }
  function relative(from, to) {
    from = resolve(from).substr(1);
    to = resolve(to).substr(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== "")
          break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "")
          break;
      }
      if (start > end)
        return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
  function dirname(path) {
    var result = splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
      return ".";
    }
    if (dir) {
      dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
  }
  function basename(path, ext) {
    var f = splitPath(path)[2];
    if (ext && f.substr(-1 * ext.length) === ext) {
      f = f.substr(0, f.length - ext.length);
    }
    return f;
  }
  function extname(path) {
    return splitPath(path)[3];
  }
  function filter(xs, f) {
    if (xs.filter)
      return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      if (f(xs[i], i, xs))
        res.push(xs[i]);
    }
    return res;
  }
  var splitPathRe, splitPath, sep, delimiter, path_default, substr;
  var init_path = __esm({
    "node-modules-polyfills:path"() {
      "use strict";
      splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      splitPath = function(filename) {
        return splitPathRe.exec(filename).slice(1);
      };
      sep = "/";
      delimiter = ":";
      path_default = {
        extname,
        basename,
        dirname,
        sep,
        delimiter,
        relative,
        join,
        isAbsolute,
        normalize,
        resolve
      };
      substr = "ab".substr(-1) === "b" ? function(str, start, len) {
        return str.substr(start, len);
      } : function(str, start, len) {
        if (start < 0)
          start = str.length + start;
        return str.substr(start, len);
      };
    }
  });

  // node-modules-polyfills-commonjs:path
  var require_path = __commonJS({
    "node-modules-polyfills-commonjs:path"(exports, module) {
      "use strict";
      var polyfill = (init_path(), __toCommonJS(path_exports));
      if (polyfill && polyfill.default) {
        module.exports = polyfill.default;
        for (let k in polyfill) {
          module.exports[k] = polyfill[k];
        }
      } else if (polyfill) {
        module.exports = polyfill;
      }
    }
  });

  // ../../../../../node_modules/.pnpm/mime-types@2.1.35/node_modules/mime-types/index.js
  var require_mime_types = __commonJS({
    "../../../../../node_modules/.pnpm/mime-types@2.1.35/node_modules/mime-types/index.js"(exports) {
      "use strict";
      var db = require_mime_db();
      var extname2 = require_path().extname;
      var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
      var TEXT_TYPE_REGEXP = /^text\//i;
      exports.charset = charset;
      exports.charsets = { lookup: charset };
      exports.contentType = contentType;
      exports.extension = extension;
      exports.extensions = /* @__PURE__ */ Object.create(null);
      exports.lookup = lookup;
      exports.types = /* @__PURE__ */ Object.create(null);
      populateMaps(exports.extensions, exports.types);
      function charset(type) {
        if (!type || typeof type !== "string") {
          return false;
        }
        var match = EXTRACT_TYPE_REGEXP.exec(type);
        var mime = match && db[match[1].toLowerCase()];
        if (mime && mime.charset) {
          return mime.charset;
        }
        if (match && TEXT_TYPE_REGEXP.test(match[1])) {
          return "UTF-8";
        }
        return false;
      }
      function contentType(str) {
        if (!str || typeof str !== "string") {
          return false;
        }
        var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
        if (!mime) {
          return false;
        }
        if (mime.indexOf("charset") === -1) {
          var charset2 = exports.charset(mime);
          if (charset2)
            mime += "; charset=" + charset2.toLowerCase();
        }
        return mime;
      }
      function extension(type) {
        if (!type || typeof type !== "string") {
          return false;
        }
        var match = EXTRACT_TYPE_REGEXP.exec(type);
        var exts = match && exports.extensions[match[1].toLowerCase()];
        if (!exts || !exts.length) {
          return false;
        }
        return exts[0];
      }
      function lookup(path) {
        if (!path || typeof path !== "string") {
          return false;
        }
        var extension2 = extname2("x." + path).toLowerCase().substr(1);
        if (!extension2) {
          return false;
        }
        return exports.types[extension2] || false;
      }
      function populateMaps(extensions, types) {
        var preference = ["nginx", "apache", void 0, "iana"];
        Object.keys(db).forEach(function forEachMimeType(type) {
          var mime = db[type];
          var exts = mime.extensions;
          if (!exts || !exts.length) {
            return;
          }
          extensions[type] = exts;
          for (var i = 0; i < exts.length; i++) {
            var extension2 = exts[i];
            if (types[extension2]) {
              var from = preference.indexOf(db[types[extension2]].source);
              var to = preference.indexOf(mime.source);
              if (types[extension2] !== "application/octet-stream" && (from > to || from === to && types[extension2].substr(0, 12) === "application/")) {
                continue;
              }
            }
            types[extension2] = type;
          }
        });
      }
    }
  });

  // src/config.ts
  var INODE_BYTE_IDENTIFIER = {
    FILE: new Uint8Array([1]),
    DIRECTORY: new Uint8Array([0])
  };
  var DEFAULT_CHUNK_SIZE = 16384;

  // src/utils/keccak.ts
  var import_js_sha3 = __toESM(require_sha3());
  function keccak(bytes) {
    return new Uint8Array(import_js_sha3.keccak256.digest(bytes));
  }

  // src/utils/string.ts
  function hexStringToBytes(hex) {
    const reg = new RegExp("^(?:[a-fA-F0-9]{2})*$");
    if (!reg.exec(hex)) {
      throw new Error(
        `Cannot decode an hexadecimal string because its pattern is invalid
Expected: ${reg.toString()}
Got ${hex.slice(
          0,
          80
        )}${hex.length > 80 ? "..." : ""}`
      );
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length / 2; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }

  // src/utils/uint8.ts
  function BytesCopiedFrom(source, offset = 0, length) {
    length = typeof length === "undefined" ? source.byteLength - offset : length;
    const out = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      out[i] = source[i + offset];
    }
    return out;
  }
  function concatUint8Arrays(...arrays) {
    const L = arrays.reduce((acc, arr) => arr.length + acc, 0);
    const out = new Uint8Array(L);
    let offset = 0;
    for (const arr of arrays) {
      out.set(arr, offset);
      offset += arr.length;
    }
    return out;
  }
  function compareUint8Arrays(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] < b[i])
        return -1;
      if (a[i] > b[i])
        return 1;
    }
    return 1;
  }
  function areUint8ArrayEqual(a, b) {
    if (a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i])
        return false;
    }
    return true;
  }

  // src/files/chunks.ts
  function chunkBytes(content, chunkSize = DEFAULT_CHUNK_SIZE) {
    if (chunkSize == 0) {
      throw new Error(`invalid chunk size, must be positive integer`);
    }
    const L = content.length;
    const nb = Math.ceil(L / chunkSize);
    const chunks = [];
    let chunk;
    for (let i = 0; i < nb; i++) {
      chunk = BytesCopiedFrom(
        content,
        i * chunkSize,
        Math.min(chunkSize, L - i * chunkSize)
      );
      chunks.push({
        bytes: chunk,
        hash: keccak(chunk)
      });
    }
    return chunks;
  }

  // src/files/inscriptions.ts
  function generateInscriptions(root) {
    const inscriptions = [];
    const traverse = (node) => {
      if (node.type === "directory") {
        inscriptions.push({
          type: "directory",
          files: Object.fromEntries(
            Object.keys(node.files).map((name) => [name, node.files[name].cid])
          )
        });
        for (const name in node.files) {
          traverse(node.files[name]);
        }
      } else if (node.type === "file") {
        inscriptions.push({
          type: "file",
          chunks: node.chunks.map((chk) => chk.hash),
          metadata: node.metadata
        });
        for (const chunk of node.chunks) {
          inscriptions.push({
            type: "chunk",
            content: chunk.bytes
          });
        }
      }
    };
    traverse(root);
    return inscriptions.reverse();
  }
  function inscriptionStorageBytes(ins) {
    switch (ins.type) {
      case "chunk":
        return ins.content.byteLength + 32;
      case "directory":
        return Object.keys(ins.files).map((name) => name.length + 32).reduce((a, b) => a + b, 0) + 32;
      case "file":
        return 32 + // 32 bytes for pointer
        32 * ins.chunks.length + // 32 bytes per chunk
        ins.metadata.map((buf) => buf.byteLength).reduce((a, b) => a + b, 0);
    }
  }
  function inscriptionsStorageBytes(inscriptions) {
    return inscriptions.reduce(
      (acc, ins) => inscriptionStorageBytes(ins) + acc,
      0
    );
  }

  // ../../../../../node_modules/.pnpm/pako@2.1.0/node_modules/pako/dist/pako.esm.mjs
  var Z_FIXED$1 = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN$1 = 2;
  function zero$1(buf) {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH$1 = 3;
  var MAX_MATCH$1 = 258;
  var LENGTH_CODES$1 = 29;
  var LITERALS$1 = 256;
  var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
  var D_CODES$1 = 30;
  var BL_CODES$1 = 19;
  var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
  var MAX_BITS$1 = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = (
    /* extra bits for each length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
  );
  var extra_dbits = (
    /* extra bits for each distance code */
    new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
  );
  var extra_blbits = (
    /* extra bits for each bit length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
  );
  var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array((L_CODES$1 + 2) * 2);
  zero$1(static_ltree);
  var static_dtree = new Array(D_CODES$1 * 2);
  zero$1(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero$1(_dist_code);
  var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
  zero$1(_length_code);
  var base_length = new Array(LENGTH_CODES$1);
  zero$1(base_length);
  var base_dist = new Array(D_CODES$1);
  zero$1(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  var d_code = (dist) => {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };
  var put_short = (s, w) => {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  };
  var send_bits = (s, value, length) => {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  };
  var send_code = (s, c, tree) => {
    send_bits(
      s,
      tree[c * 2],
      tree[c * 2 + 1]
      /*.Len*/
    );
  };
  var bi_reverse = (code, len) => {
    let res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  };
  var bi_flush = (s) => {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  };
  var gen_bitlen = (s, desc) => {
    const tree = desc.dyn_tree;
    const max_code = desc.max_code;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const extra = desc.stat_desc.extra_bits;
    const base = desc.stat_desc.extra_base;
    const max_length = desc.stat_desc.max_length;
    let h;
    let n, m;
    let bits;
    let xbits;
    let f;
    let overflow = 0;
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  };
  var gen_codes = (tree, max_code, bl_count) => {
    const next_code = new Array(MAX_BITS$1 + 1);
    let code = 0;
    let bits;
    let n;
    for (bits = 1; bits <= MAX_BITS$1; bits++) {
      code = code + bl_count[bits - 1] << 1;
      next_code[bits] = code;
    }
    for (n = 0; n <= max_code; n++) {
      let len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  };
  var tr_static_init = () => {
    let n;
    let bits;
    let length;
    let code;
    let dist;
    const bl_count = new Array(MAX_BITS$1 + 1);
    length = 0;
    for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    dist >>= 7;
    for (; code < D_CODES$1; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
    for (n = 0; n < D_CODES$1; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
  };
  var init_block = (s) => {
    let n;
    for (n = 0; n < L_CODES$1; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0; n < D_CODES$1; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0; n < BL_CODES$1; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
  };
  var bi_windup = (s) => {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  };
  var smaller = (tree, n, m, depth) => {
    const _n2 = n * 2;
    const _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  };
  var pqdownheap = (s, tree, k) => {
    const v = s.heap[k];
    let j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  };
  var compress_block = (s, ltree, dtree) => {
    let dist;
    let lc;
    let sx = 0;
    let code;
    let extra;
    if (s.sym_next !== 0) {
      do {
        dist = s.pending_buf[s.sym_buf + sx++] & 255;
        dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
        lc = s.pending_buf[s.sym_buf + sx++];
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code = _length_code[lc];
          send_code(s, code + LITERALS$1 + 1, ltree);
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);
          }
          dist--;
          code = d_code(dist);
          send_code(s, code, dtree);
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);
          }
        }
      } while (sx < s.sym_next);
    }
    send_code(s, END_BLOCK, ltree);
  };
  var build_tree = (s, desc) => {
    const tree = desc.dyn_tree;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems = desc.stat_desc.elems;
    let n, m;
    let max_code = -1;
    let node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE$1;
    for (n = 0; n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1; n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[
        1
        /*SMALLEST*/
      ] = s.heap[s.heap_len--];
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
      m = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[
        1
        /*SMALLEST*/
      ] = node++;
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[
      1
      /*SMALLEST*/
    ];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  };
  var scan_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var send_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  var build_bl_tree = (s) => {
    let max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  };
  var send_all_trees = (s, lcodes, dcodes, blcodes) => {
    let rank2;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank2 = 0; rank2 < blcodes; rank2++) {
      send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  };
  var detect_data_type = (s) => {
    let block_mask = 4093624447;
    let n;
    for (n = 0; n <= 31; n++, block_mask >>>= 1) {
      if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS$1; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  };
  var static_init_done = false;
  var _tr_init$1 = (s) => {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  };
  var _tr_stored_block$1 = (s, buf, stored_len, last) => {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    bi_windup(s);
    put_short(s, stored_len);
    put_short(s, ~stored_len);
    if (stored_len) {
      s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    }
    s.pending += stored_len;
  };
  var _tr_align$1 = (s) => {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  };
  var _tr_flush_block$1 = (s, buf, stored_len, last) => {
    let opt_lenb, static_lenb;
    let max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN$1) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block$1(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  };
  var _tr_tally$1 = (s, dist, lc) => {
    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.sym_next === s.sym_end;
  };
  var _tr_init_1 = _tr_init$1;
  var _tr_stored_block_1 = _tr_stored_block$1;
  var _tr_flush_block_1 = _tr_flush_block$1;
  var _tr_tally_1 = _tr_tally$1;
  var _tr_align_1 = _tr_align$1;
  var trees = {
    _tr_init: _tr_init_1,
    _tr_stored_block: _tr_stored_block_1,
    _tr_flush_block: _tr_flush_block_1,
    _tr_tally: _tr_tally_1,
    _tr_align: _tr_align_1
  };
  var adler32 = (adler, buf, len, pos) => {
    let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2e3 ? 2e3 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  };
  var adler32_1 = adler32;
  var makeTable = () => {
    let c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  };
  var crcTable = new Uint32Array(makeTable());
  var crc32 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;
    crc ^= -1;
    for (let i = pos; i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  };
  var crc32_1 = crc32;
  var messages = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  };
  var constants$2 = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };
  var { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$2,
    Z_PARTIAL_FLUSH,
    Z_FULL_FLUSH: Z_FULL_FLUSH$1,
    Z_FINISH: Z_FINISH$3,
    Z_BLOCK: Z_BLOCK$1,
    Z_OK: Z_OK$3,
    Z_STREAM_END: Z_STREAM_END$3,
    Z_STREAM_ERROR: Z_STREAM_ERROR$2,
    Z_DATA_ERROR: Z_DATA_ERROR$2,
    Z_BUF_ERROR: Z_BUF_ERROR$1,
    Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
    Z_FILTERED,
    Z_HUFFMAN_ONLY,
    Z_RLE,
    Z_FIXED,
    Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
    Z_UNKNOWN,
    Z_DEFLATED: Z_DEFLATED$2
  } = constants$2;
  var MAX_MEM_LEVEL = 9;
  var MAX_WBITS$1 = 15;
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var GZIP_STATE = 57;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  var err = (strm, errorCode) => {
    strm.msg = messages[errorCode];
    return errorCode;
  };
  var rank = (f) => {
    return f * 2 - (f > 4 ? 9 : 0);
  };
  var zero = (buf) => {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  };
  var slide_hash = (s) => {
    let n, m;
    let p;
    let wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
      m = s.head[--p];
      s.head[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
    n = wsize;
    p = n;
    do {
      m = s.prev[--p];
      s.prev[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
  };
  var HASH_ZLIB = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
  var HASH = HASH_ZLIB;
  var flush_pending = (strm) => {
    const s = strm.state;
    let len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  };
  var flush_block_only = (s, last) => {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  };
  var put_byte = (s, b) => {
    s.pending_buf[s.pending++] = b;
  };
  var putShortMSB = (s, b) => {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  };
  var read_buf = (strm, buf, start, size) => {
    let len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32_1(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32_1(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  };
  var longest_match = (s, cur_match) => {
    let chain_length = s.max_chain_length;
    let scan = s.strstart;
    let match;
    let len;
    let best_len = s.prev_length;
    let nice_match = s.nice_match;
    const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    const _win = s.window;
    const wmask = s.w_mask;
    const prev = s.prev;
    const strend = s.strstart + MAX_MATCH;
    let scan_end1 = _win[scan + best_len - 1];
    let scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  };
  var fill_window = (s) => {
    const _w_size = s.w_size;
    let n, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
        slide_hash(s);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
        while (s.insert) {
          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  };
  var deflate_stored = (s, flush) => {
    let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
    let len, left, have, last = 0;
    let used = s.strm.avail_in;
    do {
      len = 65535;
      have = s.bi_valid + 42 >> 3;
      if (s.strm.avail_out < have) {
        break;
      }
      have = s.strm.avail_out - have;
      left = s.strstart - s.block_start;
      if (len > left + s.strm.avail_in) {
        len = left + s.strm.avail_in;
      }
      if (len > have) {
        len = have;
      }
      if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
        break;
      }
      last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
      _tr_stored_block(s, 0, 0, last);
      s.pending_buf[s.pending - 4] = len;
      s.pending_buf[s.pending - 3] = len >> 8;
      s.pending_buf[s.pending - 2] = ~len;
      s.pending_buf[s.pending - 1] = ~len >> 8;
      flush_pending(s.strm);
      if (left) {
        if (left > len) {
          left = len;
        }
        s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
        s.strm.next_out += left;
        s.strm.avail_out -= left;
        s.strm.total_out += left;
        s.block_start += left;
        len -= left;
      }
      if (len) {
        read_buf(s.strm, s.strm.output, s.strm.next_out, len);
        s.strm.next_out += len;
        s.strm.avail_out -= len;
        s.strm.total_out += len;
      }
    } while (last === 0);
    used -= s.strm.avail_in;
    if (used) {
      if (used >= s.w_size) {
        s.matches = 2;
        s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
        s.strstart = s.w_size;
        s.insert = s.strstart;
      } else {
        if (s.window_size - s.strstart <= used) {
          s.strstart -= s.w_size;
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) {
            s.matches++;
          }
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
        }
        s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
        s.strstart += used;
        s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
      }
      s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    if (last) {
      return BS_FINISH_DONE;
    }
    if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
      return BS_BLOCK_DONE;
    }
    have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
      s.block_start -= s.w_size;
      s.strstart -= s.w_size;
      s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
      if (s.matches < 2) {
        s.matches++;
      }
      have += s.w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
    }
    if (have > s.strm.avail_in) {
      have = s.strm.avail_in;
    }
    if (have) {
      read_buf(s.strm, s.window, s.strstart, have);
      s.strstart += have;
      s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    have = s.bi_valid + 42 >> 3;
    have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
      len = left > have ? have : left;
      last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
      _tr_stored_block(s, s.block_start, len, last);
      s.block_start += len;
      flush_pending(s.strm);
    }
    return last ? BS_FINISH_STARTED : BS_NEED_MORE;
  };
  var deflate_fast = (s, flush) => {
    let hash_head;
    let bflush;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
        }
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_slow = (s, flush) => {
    let hash_head;
    let bflush;
    let max_insert;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_rle = (s, flush) => {
    let bflush;
    let prev;
    let scan, strend;
    const _win = s.window;
    for (; ; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {
          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  var deflate_huff = (s, flush) => {
    let bflush;
    for (; ; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  var configuration_table = [
    /*      good lazy nice chain */
    new Config(0, 0, 0, 0, deflate_stored),
    /* 0 store only */
    new Config(4, 4, 8, 4, deflate_fast),
    /* 1 max speed, no lazy matches */
    new Config(4, 5, 16, 8, deflate_fast),
    /* 2 */
    new Config(4, 6, 32, 32, deflate_fast),
    /* 3 */
    new Config(4, 4, 16, 16, deflate_slow),
    /* 4 lazy matches */
    new Config(8, 16, 32, 32, deflate_slow),
    /* 5 */
    new Config(8, 16, 128, 128, deflate_slow),
    /* 6 */
    new Config(8, 32, 128, 256, deflate_slow),
    /* 7 */
    new Config(32, 128, 258, 1024, deflate_slow),
    /* 8 */
    new Config(32, 258, 258, 4096, deflate_slow)
    /* 9 max compression */
  ];
  var lm_init = (s) => {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  };
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED$2;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
    this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
    this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new Uint16Array(MAX_BITS + 1);
    this.heap = new Uint16Array(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new Uint16Array(2 * L_CODES + 1);
    zero(this.depth);
    this.sym_buf = 0;
    this.lit_bufsize = 0;
    this.sym_next = 0;
    this.sym_end = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  var deflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const s = strm.state;
    if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
    s.status !== GZIP_STATE && //#endif
    s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
      return 1;
    }
    return 0;
  };
  var deflateResetKeep = (strm) => {
    if (deflateStateCheck(strm)) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = //#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE : (
      //#endif
      s.wrap ? INIT_STATE : BUSY_STATE
    );
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = -2;
    _tr_init(s);
    return Z_OK$3;
  };
  var deflateReset = (strm) => {
    const ret = deflateResetKeep(strm);
    if (ret === Z_OK$3) {
      lm_init(strm.state);
    }
    return ret;
  };
  var deflateSetHeader = (strm, head) => {
    if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
      return Z_STREAM_ERROR$2;
    }
    strm.state.gzhead = head;
    return Z_OK$3;
  };
  var deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
    if (!strm) {
      return Z_STREAM_ERROR$2;
    }
    let wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION$1) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    const s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = INIT_STATE;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);
    s.sym_buf = s.lit_bufsize;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  };
  var deflateInit = (strm, level) => {
    return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
  };
  var deflate$2 = (strm, flush) => {
    if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
    }
    const old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === INIT_STATE && s.wrap === 0) {
      s.status = BUSY_STATE;
    }
    if (s.status === INIT_STATE) {
      let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
      let level_flags = -1;
      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= level_flags << 6;
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - header % 31;
      putShortMSB(s, header);
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      strm.adler = 1;
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (s.status === GZIP_STATE) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      } else {
        put_byte(
          s,
          (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 255);
        put_byte(s, s.gzhead.time >> 8 & 255);
        put_byte(s, s.gzhead.time >> 16 & 255);
        put_byte(s, s.gzhead.time >> 24 & 255);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 255);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 255);
          put_byte(s, s.gzhead.extra.length >> 8 & 255);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        let beg = s.pending;
        let left = (s.gzhead.extra.length & 65535) - s.gzindex;
        while (s.pending + left > s.pending_buf_size) {
          let copy = s.pending_buf_size - s.pending;
          s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
          s.pending = s.pending_buf_size;
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex += copy;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
          left -= copy;
        }
        let gzhead_extra = new Uint8Array(s.gzhead.extra);
        s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
        s.pending += left;
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = NAME_STATE;
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = COMMENT_STATE;
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
      }
      s.status = HCRC_STATE;
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        }
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        strm.adler = 0;
      }
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
      let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK$3;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align(s);
        } else if (flush !== Z_BLOCK$1) {
          _tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH$1) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
    }
    if (flush !== Z_FINISH$3) {
      return Z_OK$3;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END$3;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
  };
  var deflateEnd = (strm) => {
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const status = strm.state.status;
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
  };
  var deflateSetDictionary = (strm, dictionary) => {
    let dictLength = dictionary.length;
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    const wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR$2;
    }
    if (wrap === 1) {
      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      let tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    const avail = strm.avail_in;
    const next = strm.next_in;
    const input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      let str = s.strstart;
      let n = s.lookahead - (MIN_MATCH - 1);
      do {
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK$3;
  };
  var deflateInit_1 = deflateInit;
  var deflateInit2_1 = deflateInit2;
  var deflateReset_1 = deflateReset;
  var deflateResetKeep_1 = deflateResetKeep;
  var deflateSetHeader_1 = deflateSetHeader;
  var deflate_2$1 = deflate$2;
  var deflateEnd_1 = deflateEnd;
  var deflateSetDictionary_1 = deflateSetDictionary;
  var deflateInfo = "pako deflate (from Nodeca project)";
  var deflate_1$2 = {
    deflateInit: deflateInit_1,
    deflateInit2: deflateInit2_1,
    deflateReset: deflateReset_1,
    deflateResetKeep: deflateResetKeep_1,
    deflateSetHeader: deflateSetHeader_1,
    deflate: deflate_2$1,
    deflateEnd: deflateEnd_1,
    deflateSetDictionary: deflateSetDictionary_1,
    deflateInfo
  };
  var _has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  var assign = function(obj) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };
  var flattenChunks = (chunks) => {
    let len = 0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    const result = new Uint8Array(len);
    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  };
  var common = {
    assign,
    flattenChunks
  };
  var STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  var _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  _utf8len[254] = _utf8len[254] = 1;
  var string2buf = (str) => {
    if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new Uint8Array(buf_len);
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  };
  var buf2binstring = (buf, len) => {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }
    let result = "";
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };
  var buf2string = (buf, max) => {
    const len = max || buf.length;
    if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }
    let i, out;
    const utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len; ) {
      let c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      let c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  };
  var utf8border = (buf, max) => {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
  var strings = {
    string2buf,
    buf2string,
    utf8border
  };
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  var zstream = ZStream;
  var toString$1 = Object.prototype.toString;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$1,
    Z_SYNC_FLUSH,
    Z_FULL_FLUSH,
    Z_FINISH: Z_FINISH$2,
    Z_OK: Z_OK$2,
    Z_STREAM_END: Z_STREAM_END$2,
    Z_DEFAULT_COMPRESSION,
    Z_DEFAULT_STRATEGY,
    Z_DEFLATED: Z_DEFLATED$1
  } = constants$2;
  function Deflate$1(options) {
    this.options = common.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY
    }, options || {});
    let opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = deflate_1$2.deflateInit2(
      this.strm,
      opt.level,
      opt.method,
      opt.windowBits,
      opt.memLevel,
      opt.strategy
    );
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    if (opt.header) {
      deflate_1$2.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      let dict;
      if (typeof opt.dictionary === "string") {
        dict = strings.string2buf(opt.dictionary);
      } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = deflate_1$2.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK$2) {
        throw new Error(messages[status]);
      }
      this._dict_set = true;
    }
  }
  Deflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;
    if (this.ended) {
      return false;
    }
    if (flush_mode === ~~flush_mode)
      _flush_mode = flush_mode;
    else
      _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
    if (typeof data === "string") {
      strm.input = strings.string2buf(data);
    } else if (toString$1.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      status = deflate_1$2.deflate(strm, _flush_mode);
      if (status === Z_STREAM_END$2) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = deflate_1$2.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK$2;
      }
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      if (strm.avail_in === 0)
        break;
    }
    return true;
  };
  Deflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Deflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK$2) {
      this.result = common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function deflate$1(input, options) {
    const deflator = new Deflate$1(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || messages[deflator.err];
    }
    return deflator.result;
  }
  function deflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return deflate$1(input, options);
  }
  function gzip$1(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate$1(input, options);
  }
  var Deflate_1$1 = Deflate$1;
  var deflate_2 = deflate$1;
  var deflateRaw_1$1 = deflateRaw$1;
  var gzip_1$1 = gzip$1;
  var constants$1 = constants$2;
  var deflate_1$1 = {
    Deflate: Deflate_1$1,
    deflate: deflate_2,
    deflateRaw: deflateRaw_1$1,
    gzip: gzip_1$1,
    constants: constants$1
  };
  var BAD$1 = 16209;
  var TYPE$1 = 16191;
  var inffast = function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input, output;
    const state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (; ; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD$1;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD$1;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                      while (len > 2) {
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output[_out++] = from_source[from++];
                        if (len > 1) {
                          output[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output[_out++] = output[from++];
                        if (len > 1) {
                          output[_out++] = output[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state.mode = BAD$1;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state.mode = TYPE$1;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state.mode = BAD$1;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  };
  var MAXBITS = 15;
  var ENOUGH_LENS$1 = 852;
  var ENOUGH_DISTS$1 = 592;
  var CODES$1 = 0;
  var LENS$1 = 1;
  var DISTS$1 = 2;
  var lbase = new Uint16Array([
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ]);
  var lext = new Uint8Array([
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ]);
  var dbase = new Uint16Array([
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ]);
  var dext = new Uint8Array([
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ]);
  var inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
    const bits = opts.bits;
    let len = 0;
    let sym = 0;
    let min = 0, max = 0;
    let root = 0;
    let curr = 0;
    let drop = 0;
    let left = 0;
    let used = 0;
    let huff = 0;
    let incr;
    let fill;
    let low;
    let mask;
    let next;
    let base = null;
    let match;
    const count = new Uint16Array(MAXBITS + 1);
    const offs = new Uint16Array(MAXBITS + 1);
    let extra = null;
    let here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES$1 || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES$1) {
      base = extra = work;
      match = 20;
    } else if (type === LENS$1) {
      base = lbase;
      extra = lext;
      match = 257;
    } else {
      base = dbase;
      extra = dext;
      match = 0;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
      return 1;
    }
    for (; ; ) {
      here_bits = len - drop;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base[work[sym] - match];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  };
  var inftrees = inflate_table;
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var {
    Z_FINISH: Z_FINISH$1,
    Z_BLOCK,
    Z_TREES,
    Z_OK: Z_OK$1,
    Z_STREAM_END: Z_STREAM_END$1,
    Z_NEED_DICT: Z_NEED_DICT$1,
    Z_STREAM_ERROR: Z_STREAM_ERROR$1,
    Z_DATA_ERROR: Z_DATA_ERROR$1,
    Z_MEM_ERROR: Z_MEM_ERROR$1,
    Z_BUF_ERROR,
    Z_DEFLATED
  } = constants$2;
  var HEAD = 16180;
  var FLAGS = 16181;
  var TIME = 16182;
  var OS = 16183;
  var EXLEN = 16184;
  var EXTRA = 16185;
  var NAME = 16186;
  var COMMENT = 16187;
  var HCRC = 16188;
  var DICTID = 16189;
  var DICT = 16190;
  var TYPE = 16191;
  var TYPEDO = 16192;
  var STORED = 16193;
  var COPY_ = 16194;
  var COPY = 16195;
  var TABLE = 16196;
  var LENLENS = 16197;
  var CODELENS = 16198;
  var LEN_ = 16199;
  var LEN = 16200;
  var LENEXT = 16201;
  var DIST = 16202;
  var DISTEXT = 16203;
  var MATCH = 16204;
  var LIT = 16205;
  var CHECK = 16206;
  var LENGTH = 16207;
  var DONE = 16208;
  var BAD = 16209;
  var MEM = 16210;
  var SYNC = 16211;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var MAX_WBITS = 15;
  var DEF_WBITS = MAX_WBITS;
  var zswap32 = (q) => {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  };
  function InflateState() {
    this.strm = null;
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Uint16Array(320);
    this.work = new Uint16Array(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  var inflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const state = strm.state;
    if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
      return 1;
    }
    return 0;
  };
  var inflateResetKeep = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return Z_OK$1;
  };
  var inflateReset = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  };
  var inflateReset2 = (strm, windowBits) => {
    let wrap;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };
  var inflateInit2 = (strm, windowBits) => {
    if (!strm) {
      return Z_STREAM_ERROR$1;
    }
    const state = new InflateState();
    strm.state = state;
    state.strm = strm;
    state.window = null;
    state.mode = HEAD;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null;
    }
    return ret;
  };
  var inflateInit = (strm) => {
    return inflateInit2(strm, DEF_WBITS);
  };
  var virgin = true;
  var lenfix;
  var distfix;
  var fixedtables = (state) => {
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);
      let sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };
  var updatewindow = (strm, src, end, copy) => {
    let dist;
    const state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new Uint8Array(state.wsize);
    }
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  };
  var inflate$2 = (strm, flush) => {
    let state;
    let input, output;
    let next;
    let put;
    let have, left;
    let hold;
    let bits;
    let _in, _out;
    let copy;
    let from;
    let from_source;
    let here = 0;
    let here_bits, here_op, here_val;
    let last_bits, last_op, last_val;
    let len;
    let ret;
    const hbuf = new Uint8Array(4);
    let opts;
    let n;
    const order = (
      /* permutation of code lengths */
      new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
    );
    if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK$1;
    inf_leave:
      for (; ; ) {
        switch (state.mode) {
          case HEAD:
            if (state.wrap === 0) {
              state.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 2 && hold === 35615) {
              if (state.wbits === 0) {
                state.wbits = 15;
              }
              state.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state.mode = FLAGS;
              break;
            }
            if (state.head) {
              state.head.done = false;
            }
            if (!(state.wrap & 1) || /* check if zlib header allowed */
            (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state.mode = BAD;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state.wbits === 0) {
              state.wbits = len;
            }
            if (len > 15 || len > state.wbits) {
              strm.msg = "invalid window size";
              state.mode = BAD;
              break;
            }
            state.dmax = 1 << state.wbits;
            state.flags = 0;
            strm.adler = state.check = 1;
            state.mode = hold & 512 ? DICTID : TYPE;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.flags = hold;
            if ((state.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            if (state.flags & 57344) {
              strm.msg = "unknown header flags set";
              state.mode = BAD;
              break;
            }
            if (state.head) {
              state.head.text = hold >> 8 & 1;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = TIME;
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.time = hold;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state.check = crc32_1(state.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = OS;
          case OS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.xflags = hold & 255;
              state.head.os = hold >> 8;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = EXLEN;
          case EXLEN:
            if (state.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length = hold;
              if (state.head) {
                state.head.extra_len = hold;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_1(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state.head) {
              state.head.extra = null;
            }
            state.mode = EXTRA;
          case EXTRA:
            if (state.flags & 1024) {
              copy = state.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state.head) {
                  len = state.head.extra_len - state.length;
                  if (!state.head.extra) {
                    state.head.extra = new Uint8Array(state.head.extra_len);
                  }
                  state.head.extra.set(
                    input.subarray(
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      next + copy
                    ),
                    /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                    len
                  );
                }
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_1(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state.length -= copy;
              }
              if (state.length) {
                break inf_leave;
              }
            }
            state.length = 0;
            state.mode = NAME;
          case NAME:
            if (state.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.name = null;
            }
            state.length = 0;
            state.mode = COMMENT;
          case COMMENT:
            if (state.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.comment = null;
            }
            state.mode = HCRC;
          case HCRC:
            if (state.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.check & 65535)) {
                strm.msg = "header crc mismatch";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state.head) {
              state.head.hcrc = state.flags >> 9 & 1;
              state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = TYPE;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state.mode = DICT;
          case DICT:
            if (state.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              return Z_NEED_DICT$1;
            }
            strm.adler = state.check = 1;
            state.mode = TYPE;
          case TYPE:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          case TYPEDO:
            if (state.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state.mode = STORED;
                break;
              case 1:
                fixedtables(state);
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state.mode = BAD;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state.mode = BAD;
              break;
            }
            state.length = hold & 65535;
            hold = 0;
            bits = 0;
            state.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case COPY_:
            state.mode = COPY;
          case COPY:
            copy = state.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              output.set(input.subarray(next, next + copy), put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state.length -= copy;
              break;
            }
            state.mode = TYPE;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state.nlen > 286 || state.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = LENLENS;
          case LENLENS:
            while (state.have < state.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.lens[order[state.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state.have < 19) {
              state.lens[order[state.have++]] = 0;
            }
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = { bits: state.lenbits };
            ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = CODELENS;
          case CODELENS:
            while (state.have < state.nlen + state.ndist) {
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state.lens[state.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  len = state.lens[state.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state.have + copy > state.nlen + state.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                while (copy--) {
                  state.lens[state.have++] = len;
                }
              }
            }
            if (state.mode === BAD) {
              break;
            }
            if (state.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state.mode = BAD;
              break;
            }
            state.lenbits = 9;
            opts = { bits: state.lenbits };
            ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state.mode = BAD;
              break;
            }
            state.distbits = 6;
            state.distcode = state.distdyn;
            opts = { bits: state.distbits };
            ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            state.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state.mode = BAD;
              break;
            }
            state.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          case LEN_:
            state.mode = LEN;
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              inffast(strm, _out);
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              if (state.mode === TYPE) {
                state.back = -1;
              }
              break;
            }
            state.back = 0;
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
              state.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state.back = -1;
              state.mode = TYPE;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break;
            }
            state.extra = here_op & 15;
            state.mode = LENEXT;
          case LENEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            state.was = state.length;
            state.mode = DIST;
          case DIST:
            for (; ; ) {
              here = state.distcode[hold & (1 << state.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state.mode = BAD;
              break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = DISTEXT;
          case DISTEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.offset += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            if (state.offset > state.dmax) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD;
              break;
            }
            state.mode = MATCH;
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state.offset > copy) {
              copy = state.offset - copy;
              if (copy > state.whave) {
                if (state.sane) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD;
                  break;
                }
              }
              if (copy > state.wnext) {
                copy -= state.wnext;
                from = state.wsize - copy;
              } else {
                from = state.wnext - copy;
              }
              if (copy > state.length) {
                copy = state.length;
              }
              from_source = state.window;
            } else {
              from_source = output;
              from = put - state.offset;
              copy = state.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state.length -= copy;
            do {
              output[put++] = from_source[from++];
            } while (--copy);
            if (state.length === 0) {
              state.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output[put++] = state.length;
            left--;
            state.mode = LEN;
            break;
          case CHECK:
            if (state.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state.total += _out;
              if (state.wrap & 4 && _out) {
                strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
              }
              _out = left;
              if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
                strm.msg = "incorrect data check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = LENGTH;
          case LENGTH:
            if (state.wrap && state.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = DONE;
          case DONE:
            ret = Z_STREAM_END$1;
            break inf_leave;
          case BAD:
            ret = Z_DATA_ERROR$1;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR$1;
          case SYNC:
          default:
            return Z_STREAM_ERROR$1;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out))
        ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap & 4 && _out) {
      strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  };
  var inflateEnd = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    let state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  };
  var inflateGetHeader = (strm, head) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR$1;
    }
    state.head = head;
    head.done = false;
    return Z_OK$1;
  };
  var inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;
    let state;
    let dictid;
    let ret;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    return Z_OK$1;
  };
  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2$1 = inflate$2;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = "pako inflate (from Nodeca project)";
  var inflate_1$2 = {
    inflateReset: inflateReset_1,
    inflateReset2: inflateReset2_1,
    inflateResetKeep: inflateResetKeep_1,
    inflateInit: inflateInit_1,
    inflateInit2: inflateInit2_1,
    inflate: inflate_2$1,
    inflateEnd: inflateEnd_1,
    inflateGetHeader: inflateGetHeader_1,
    inflateSetDictionary: inflateSetDictionary_1,
    inflateInfo
  };
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  var gzheader = GZheader;
  var toString = Object.prototype.toString;
  var {
    Z_NO_FLUSH,
    Z_FINISH,
    Z_OK,
    Z_STREAM_END,
    Z_NEED_DICT,
    Z_STREAM_ERROR,
    Z_DATA_ERROR,
    Z_MEM_ERROR
  } = constants$2;
  function Inflate$1(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ""
    }, options || {});
    const opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = inflate_1$2.inflateInit2(
      this.strm,
      opt.windowBits
    );
    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }
    this.header = new gzheader();
    inflate_1$2.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages[status]);
        }
      }
    }
  }
  Inflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;
    if (this.ended)
      return false;
    if (flush_mode === ~~flush_mode)
      _flush_mode = flush_mode;
    else
      _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = inflate_1$2.inflate(strm, _flush_mode);
      if (status === Z_NEED_DICT && dictionary) {
        status = inflate_1$2.inflateSetDictionary(strm, dictionary);
        if (status === Z_OK) {
          status = inflate_1$2.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          status = Z_NEED_DICT;
        }
      }
      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
        inflate_1$2.inflateReset(strm);
        status = inflate_1$2.inflate(strm, _flush_mode);
      }
      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }
      last_avail_out = strm.avail_out;
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {
          if (this.options.to === "string") {
            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail)
              strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
            this.onData(utf8str);
          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }
      if (status === Z_OK && last_avail_out === 0)
        continue;
      if (status === Z_STREAM_END) {
        status = inflate_1$2.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }
      if (strm.avail_in === 0)
        break;
    }
    return true;
  };
  Inflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Inflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate$1(input, options) {
    const inflator = new Inflate$1(options);
    inflator.push(input);
    if (inflator.err)
      throw inflator.msg || messages[inflator.err];
    return inflator.result;
  }
  function inflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return inflate$1(input, options);
  }
  var Inflate_1$1 = Inflate$1;
  var inflate_2 = inflate$1;
  var inflateRaw_1$1 = inflateRaw$1;
  var ungzip$1 = inflate$1;
  var constants = constants$2;
  var inflate_1$1 = {
    Inflate: Inflate_1$1,
    inflate: inflate_2,
    inflateRaw: inflateRaw_1$1,
    ungzip: ungzip$1,
    constants
  };
  var { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
  var { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;
  var gzip_1 = gzip;

  // src/files/metadata.ts
  var fileMetadataBytecodes = {
    "Content-Type": new Uint8Array([0, 1]),
    "Content-Encoding": new Uint8Array([0, 2])
  };
  var FORBIDDEN_METADATA_CHARS = [
    0
    // NUL character
  ];
  function validateMetadataValue(value) {
    for (let i = 0; i < value.length; i++) {
      if (FORBIDDEN_METADATA_CHARS.includes(value.charCodeAt(i))) {
        throw new Error(
          `contains invalid character (code: ${value.charCodeAt(
            i
          )}) at position ${i}`
        );
      }
    }
  }
  function encodeFileMetadata(metadata) {
    const out = [];
    let value;
    for (const entry in metadata) {
      if (fileMetadataBytecodes[entry]) {
        value = metadata[entry];
        try {
          validateMetadataValue(value);
        } catch (err2) {
          throw new Error(
            `Error when validating the metadata field "${entry}": ${err2.message}`
          );
        }
        out.push(
          concatUint8Arrays(
            fileMetadataBytecodes[entry],
            new TextEncoder().encode(value)
          )
        );
      }
    }
    out.sort(compareUint8Arrays);
    return out;
  }
  function decodeMetadataEntry(entry) {
    const bytecodeEntry = BytesCopiedFrom(entry, 0, 2);
    for (const [header, bytecode] of Object.entries(fileMetadataBytecodes)) {
      if (areUint8ArrayEqual(bytecodeEntry, bytecode)) {
        return [header, new TextDecoder().decode(BytesCopiedFrom(entry, 2))];
      }
    }
    return null;
  }
  function decodeFileMetadata(raw) {
    const metadata = {};
    for (const line of raw) {
      const entry = decodeMetadataEntry(line);
      if (entry) {
        metadata[entry[0]] = entry[1];
      }
    }
    return metadata;
  }

  // src/files/file.ts
  var import_mime_types = __toESM(require_mime_types());
  async function prepareFile(name, content, chunkSize = DEFAULT_CHUNK_SIZE) {
    let metadata = {};
    let insertionBytes = content;
    let mime = (0, import_mime_types.lookup)(name);
    if (!mime) {
    } else {
      metadata["Content-Type"] = mime;
    }
    const compressed = gzip_1(content);
    if (compressed.byteLength < insertionBytes.byteLength) {
      insertionBytes = compressed;
      metadata["Content-Encoding"] = "gzip";
    }
    const chunks = chunkBytes(insertionBytes, chunkSize);
    const metadataEncoded = encodeFileMetadata(metadata);
    const contentHash = keccak(insertionBytes);
    const metadataHash = keccak(concatUint8Arrays(...metadataEncoded));
    const cid = keccak(
      concatUint8Arrays(INODE_BYTE_IDENTIFIER.FILE, contentHash, metadataHash)
    );
    return {
      type: "file",
      cid,
      chunks,
      metadata: metadataEncoded
    };
  }

  // src/files/directory.ts
  function encodeFilename(name) {
    return encodeURIComponent(name);
  }
  function computeDirectoryInode(dir) {
    const acc = [];
    const filenames = Object.keys(dir.files).sort();
    const dirFiles = {};
    for (const filename of filenames) {
      const inode = dir.files[filename].inode;
      dirFiles[filename] = inode;
      acc.unshift(keccak(filename));
      acc.unshift(inode.cid);
    }
    acc.unshift(INODE_BYTE_IDENTIFIER.DIRECTORY);
    return {
      type: "directory",
      cid: keccak(concatUint8Arrays(...acc)),
      files: dirFiles
    };
  }
  function buildDirectoryGraph(files) {
    let graph = {
      type: "directory",
      files: {},
      parent: null
    };
    const leaves = [];
    for (const file of files) {
      let active = graph, part = "";
      const formattedPath = file.path.startsWith("./") ? file.path.slice(2) : file.path;
      const parts = formattedPath.split("/").map((part2) => encodeFilename(part2));
      for (let i = 0; i < parts.length; i++) {
        part = parts[i];
        if (part.length === 0) {
          throw new Error(
            `The file ${file.path} contains an invalid part, there must be at least 1 character for each part.`
          );
        }
        if (i === parts.length - 1) {
          if (active.files.hasOwnProperty(part)) {
            throw new Error(
              `The file at path ${file.path} is colliding with another path in the directory. There mush be a single path pointing to a file.`
            );
          }
          const nLeave = {
            type: "file",
            content: file.content,
            name: part,
            parent: active
          };
          active.files[part] = nLeave;
          leaves.push(nLeave);
        } else {
          if (active.files.hasOwnProperty(part)) {
            active = active.files[part];
          } else {
            const nDir = {
              type: "directory",
              files: {},
              parent: active
            };
            active.files[part] = nDir;
            active = nDir;
          }
        }
      }
    }
    return [graph, leaves];
  }
  async function prepareDirectory(files, chunkSize = DEFAULT_CHUNK_SIZE) {
    const [graph, leaves] = buildDirectoryGraph(files);
    const parsed = [];
    let parsing = leaves;
    while (parsing.length > 0) {
      const nextParse = [];
      for (const node of parsing) {
        if (parsed.includes(node))
          continue;
        if (node.type === "file") {
          node.inode = await prepareFile(node.name, node.content, chunkSize);
        } else if (node.type === "directory") {
          node.inode = computeDirectoryInode(node);
        }
        parsed.push(node);
        if (node.parent) {
          const children = Object.values(node.parent.files);
          if (!children.find((child) => !child.inode)) {
            nextParse.push(node.parent);
          }
        }
      }
      parsing = nextParse;
    }
    return graph.inode;
  }

  // src/resolve/uri.ts
  var blockchainNames = ["tezos", "ethereum"];
  var defaultContractsMap = {
    "tezos:mainnet": "KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC",
    "tezos:ghostnet": "KT1XZ2FyRNtzYCBoy18Rp7R9oejvFSPqkBoy",
    "ethereum:1": "b0e58801d1b4d69179b7bc23fe54a37cee999b09",
    "ethereum:5": "fcfdfa971803e1cc201f80d8e74de71fddea6551"
  };
  var LOW_ALPHA = "a-z";
  var HI_ALPHA = "A-Z";
  var ALPHA = LOW_ALPHA + HI_ALPHA;
  var DIGIT = "0-9";
  var SAFE = "$\\-_.+";
  var EXTRA2 = "!*'(),~";
  var HEX_CHARSET = "A-Fa-f0-9";
  var LOW_RESERVED = ";:@&=";
  var RESERVED = LOW_RESERVED + "\\/?#";
  var UNRESERVED = ALPHA + DIGIT + SAFE + EXTRA2;
  var PCT_ENCODED = `%[${HEX_CHARSET}]{2}`;
  var UCHAR = `(?:(?:[${UNRESERVED}])|(?:${PCT_ENCODED}))`;
  var XCHAR = `(?:(?:[${UNRESERVED}${RESERVED}])|(?:${PCT_ENCODED}))`;
  var URI_CHARSET = XCHAR;
  var B58_CHARSET = "1-9A-HJ-NP-Za-km-z";
  var AUTHORITY_CHARSET = `${HEX_CHARSET}${B58_CHARSET}.a-z:`;
  var SEG_CHARSET = `(?:(?:${UCHAR})|[${LOW_RESERVED}])`;
  var QUERY_CHARSET = `(?:${SEG_CHARSET}|\\/|\\?)`;
  function parseURI(uri2, context) {
    try {
      const schemaSpecificPart = parseSchema(uri2);
      const schemaSegments = parseSchemaSpecificPart(schemaSpecificPart);
      const authority = parseAuthority(schemaSegments.authority, context);
      return {
        ...schemaSegments,
        cid: schemaSegments.cid.toLowerCase(),
        authority
      };
    } catch (err2) {
      throw new Error(
        `Error when parsing the URI "${uri2}" as a onchfs URI: ${err2.message}`
      );
    }
  }
  function parseSchema(uri2) {
    const regex = new RegExp(`^(onchfs)://(${URI_CHARSET}{64,})$`);
    const results = regex.exec(uri2);
    if (!results) {
      throw new Error(
        `general onchfs URI format is invalid / Pattern didn't match: ${regex.toString()}`
      );
    }
    return results[2];
  }
  function parseSchemaSpecificPart(uriPart) {
    const authorityReg = `([${AUTHORITY_CHARSET}]*)\\/`;
    const cidReg = `[${HEX_CHARSET}]{64}`;
    const pathReg = `${SEG_CHARSET}*(?:\\/${SEG_CHARSET}*)*`;
    const queryReg = `\\?(${QUERY_CHARSET}*)`;
    const fragReg = `#(${QUERY_CHARSET}*)`;
    const regex = new RegExp(
      `^(?:${authorityReg})?(${cidReg})(?:\\/(${pathReg}))?(?:${queryReg})?(?:${fragReg})?$`
    );
    const res = regex.exec(uriPart);
    if (!res) {
      throw new Error(
        `the URI schema specific component seems to be invalid. "${uriPart}" should respect the following pattern: ${regex.toString()}`
      );
    }
    const [_, authority, cid, path, query, fragment] = res;
    return {
      authority,
      cid,
      path,
      query,
      fragment
    };
  }
  var blockchainAuthorityParsers = {
    tezos: () => new RegExp(
      `^(?:(KT(?:1|2|3|4)[${B58_CHARSET}]{33})\\.)?(tezos|tez|xtz)(?::(ghostnet|mainnet))?$`
    ),
    ethereum: () => new RegExp(`^(?:([${HEX_CHARSET}]{40})\\.)?(ethereum|eth)(?::([0-9]+))?$`)
  };
  var blockchainNameVariants = {
    tezos: ["tezos", "tez", "xtz"],
    ethereum: ["ethereum", "eth"]
  };
  var blockchainDefaultNetwork = {
    tezos: "mainnet",
    ethereum: "1"
  };
  function parseAuthority(authority, context) {
    let tmp = { ...context };
    if (authority) {
      let regex, res;
      for (const name of blockchainNames) {
        regex = blockchainAuthorityParsers[name]();
        res = regex.exec(authority);
        if (!res)
          continue;
        const [contract, blockchainName, blockchainId] = res.splice(1, 3);
        contract && (tmp.contract = contract);
        blockchainName && (tmp.blockchainName = blockchainName);
        blockchainId && (tmp.blockchainId = blockchainId);
        break;
      }
    }
    if (!tmp.blockchainName) {
      throw new Error(
        "the blockchain could not be inferred when parsing the URI, if the URI doesn't have an authority segment (onchfs://<authority>/<cid>/<path>...), a context should be provided based on where the URI was observed. The blockchain needs to be resolved either through the URI or using the context."
      );
    }
    for (const [name, values] of Object.entries(blockchainNameVariants)) {
      if (values.includes(tmp.blockchainName)) {
        tmp.blockchainName = name;
        break;
      }
    }
    if (!tmp.blockchainId) {
      tmp.blockchainId = blockchainDefaultNetwork[tmp.blockchainName];
    }
    if (!tmp.blockchainId) {
      throw new Error(
        `The blockchain identifier could not be inferred from the blockchain name when parsing the authority segment of the URI. This can happen when a blockchain not supported by the onchfs package was provided in the context of the URI resolution, yet a blockchain ID wasn't provided in the context nor could it be found in the URI.`
      );
    }
    if (!tmp.contract) {
      tmp.contract = defaultContractsMap[`${tmp.blockchainName}:${tmp.blockchainId}`];
    }
    if (!tmp.contract) {
      throw new Error(
        `A File Object contract could not be associated with the onchfs URI. This can happen when an unsupported blockchain was provided as a context to the URI resolver, yet no contract was provided in the context, nor could it be parsed from the URI. The URI must resolve to a Smart Contract.`
      );
    }
    return tmp;
  }

  // src/resolve/errors.ts
  var OnchfsProxyResolutionError = class extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
      this.name = "OnchfsProxyResolutionError";
    }
  };

  // src/resolve/proxy.ts
  var ResolutionErrors = {
    [400 /* BAD_REQUEST */]: "Bad Request",
    [406 /* NOT_ACCEPTABLE */]: "Resource Cannot be Served",
    [404 /* NOT_FOUND */]: "Not Found",
    [500 /* INTERNAL_SERVER_ERROR */]: "Internal Server Error"
  };
  function createProxyResolver(resolver2) {
    return async (uri2) => {
      try {
        if (uri2.startsWith("/")) {
          uri2 = uri2.slice(1);
        }
        let components;
        try {
          if (uri2.startsWith("onchfs://")) {
            uri2 = parseSchema(uri2);
          }
          components = parseSchemaSpecificPart(uri2);
        } catch (err2) {
          throw new OnchfsProxyResolutionError(
            `The onchfs URI is invalid: ${err2.message}`,
            400 /* BAD_REQUEST */
          );
        }
        let { cid, path, authority } = components;
        let paths = path?.split("/") || [];
        paths = paths.filter((pt) => pt.length > 0);
        let parsedAuthority;
        if (authority) {
          parsedAuthority = parseAuthority(authority);
        }
        let inode;
        let mainInode;
        try {
          inode = mainInode = await resolver2.getInodeAtPath(
            cid,
            paths,
            parsedAuthority
          );
          if (!inode) {
            throw new OnchfsProxyResolutionError(
              `Could not find any inode at (${cid}, ${path})`,
              404 /* NOT_FOUND */
            );
          }
        } catch (err2) {
          if (err2 instanceof OnchfsProxyResolutionError) {
            throw err2;
          } else {
            throw new OnchfsProxyResolutionError(
              err2.message,
              500 /* INTERNAL_SERVER_ERROR */
            );
          }
        }
        if (inode.files) {
          if (inode.files["index.html"]) {
            try {
              inode = await resolver2.getInodeAtPath(
                inode.cid,
                ["index.html"],
                parsedAuthority
              );
            } catch (err2) {
              throw new OnchfsProxyResolutionError(
                `An error occurred when resolving the index.html file inside the target directory at /${inode.cid}${err2.message ? `: ${err2.message}` : ""}`,
                500 /* INTERNAL_SERVER_ERROR */
              );
            }
          } else {
            throw new OnchfsProxyResolutionError(
              `the inode at (${cid}, ${path}) is a directory which doesn't contain any index.html file, as such it cannot be served.`,
              406 /* NOT_ACCEPTABLE */
            );
          }
        }
        if (inode.files || !inode) {
          throw new OnchfsProxyResolutionError(
            `could not find a file inode at (${cid}, ${path})`,
            404 /* NOT_FOUND */
          );
        }
        let content;
        try {
          const contentInput = await resolver2.readFile(
            inode.cid,
            inode.chunkPointers,
            parsedAuthority
          );
          content = typeof contentInput === "string" ? hexStringToBytes(contentInput) : contentInput;
        } catch (err2) {
          throw new OnchfsProxyResolutionError(
            `An error occurred when reading the content of the file of cid ${inode.cid}${err2.message ? `: ${err2.message}` : ""}`,
            500 /* INTERNAL_SERVER_ERROR */
          );
        }
        let headers;
        const rawMetadataInput = inode.metadata;
        try {
          const rawMetadata = rawMetadataInput.map(
            (met) => typeof met === "string" ? hexStringToBytes(met) : met
          );
          headers = decodeFileMetadata(rawMetadata);
        } catch (err2) {
          throw new OnchfsProxyResolutionError(
            `An error occurred when parsing the metadata of the file of cid ${inode.cid}, raw metadata bytes (${rawMetadataInput})${err2.message ? `: ${err2.message}` : ""}`,
            500 /* INTERNAL_SERVER_ERROR */
          );
        }
        let status = 200 /* OK */;
        const wholeReqPath = components.cid + (components.path ? `/${components.path}` : "");
        if (mainInode.files && !wholeReqPath.endsWith("/") && // in case a CID is followed by a "/" and an empty path, the "/" will
        // disappear during parsing due to the URI specification, however an
        // empty string path will appear, which is the only case where it
        // appears; as such we can test it to cover this edge-case.
        !(components.path === "")) {
          const redirect = "/" + components.cid + (components.path ? `/${components.path}` : "") + "/" + (components.query ? `?${components.query}` : "");
          headers = {
            // preserve the existing headers; we will still be serving the content
            ...headers,
            Location: redirect
          };
          status = 308 /* PERMANENT */;
        }
        return {
          content,
          headers,
          status
        };
      } catch (err2) {
        let status, error;
        if (err2 instanceof OnchfsProxyResolutionError) {
          status = err2.status;
          error = {
            code: err2.status,
            name: ResolutionErrors[err2.status],
            message: err2.message
          };
        } else {
          status = 500 /* INTERNAL_SERVER_ERROR */;
          error = {
            code: 500 /* INTERNAL_SERVER_ERROR */,
            name: ResolutionErrors[500 /* INTERNAL_SERVER_ERROR */]
          };
        }
        return {
          status,
          // we produce a basic html error page for proxy implementations which
          // just want to forward the response
          content: new TextEncoder().encode(
            `<h1>${status} ${error.name}</h1>${error.message ? `<p>${err2.message}</p>` : ""}`
          ),
          // same with headers
          headers: {
            "Content-Type": "text/html; charset=utf-8"
          },
          error
        };
      }
    };
  }

  // src/files/index.ts
  var files_exports = {};
  __export(files_exports, {
    default: () => files_default,
    prepareFile: () => prepareFile
  });
  var files_default = {
    prepareFile,
    prepareDirectory,
    generateInscriptions,
    utils: {
      chunkBytes,
      directory: {
        encodeFilename,
        computeInode: computeDirectoryInode,
        computeGraph: buildDirectoryGraph
      },
      inscriptions: {
        computeStorageBytes: inscriptionsStorageBytes
      },
      metadata: {
        bytecodes: fileMetadataBytecodes,
        validateValue: validateMetadataValue,
        encode: encodeFileMetadata,
        decode: decodeFileMetadata
      }
    }
  };

  // src/index.ts
  var utils = {
    keccak,
    chunkBytes,
    encodeFilename,
    computeDirectoryInode,
    buildDirectoryGraph,
    validateMetadataValue,
    encodeFileMetadata,
    hexStringToBytes
  };
  var config = {
    INODE_BYTE_IDENTIFIER,
    DEFAULT_CHUNK_SIZE,
    FORBIDDEN_METADATA_CHARS,
    fileMetadataBytecodes,
    inscriptionsStorageBytes
  };
  var uri = {
    parse: parseURI,
    utils: {
      parseSchema,
      parseSchemaSpecificPart,
      parseAuthority
    }
  };
  var resolver = {
    create: createProxyResolver
  };
  var Onchfs = {
    prepareFile,
    prepareDirectory,
    generateInscriptions,
    utils,
    config,
    uri,
    resolver,
    files: files_exports
  };
  var src_default = Onchfs;
  if (typeof window !== "undefined") {
    ;
    window.Onchfs = Onchfs;
  }
})();
/*! Bundled license information:

js-sha3/src/sha3.js:
  (**
   * [js-sha3]{@link https://github.com/emn178/js-sha3}
   *
   * @version 0.9.1
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2015-2023
   * @license MIT
   *)

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

pako/dist/pako.esm.mjs:
  (*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)
*/
//# sourceMappingURL=index.global.js.map