export const svgbobWasm = async (wasmUrl) => {
  var svgbob_wasm_bg_default =
    wasmUrl || 'https://cdn.jsdelivr.net/npm/svgbob-wasm/svgbob_wasm_bg.wasm';

  var imports = {};
  async function loadWasm(module3, imports2) {
    if (typeof module3 === 'string') {
      const moduleRequest = await fetch(module3);
      if (typeof WebAssembly.instantiateStreaming === 'function') {
        try {
          return await WebAssembly.instantiateStreaming(moduleRequest, imports2);
        } catch (e) {
          if (moduleRequest.headers.get('Content-Type') != 'application/wasm') {
            console.warn(e);
          } else {
            throw e;
          }
        }
      }
      module3 = await moduleRequest.arrayBuffer();
    }
    return await WebAssembly.instantiate(module3, imports2);
  }
  var { instance, module: module2 } = await loadWasm(svgbob_wasm_bg_default, imports);
  var memory = instance.exports.memory;
  var convert_string = instance.exports.convert_string;
  var __wbindgen_export_0 = instance.exports.__wbindgen_export_0;
  var __wbindgen_malloc = instance.exports.__wbindgen_malloc;
  var __wbindgen_realloc = instance.exports.__wbindgen_realloc;
  var __wbindgen_free = instance.exports.__wbindgen_free;

  var WASM_VECTOR_LEN = 0;
  var cachegetUint8Memory0 = null;
  function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== memory.buffer) {
      cachegetUint8Memory0 = new Uint8Array(memory.buffer);
    }
    return cachegetUint8Memory0;
  }
  var lTextEncoder =
    typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;
  var cachedTextEncoder = new lTextEncoder('utf-8');
  var encodeString =
    typeof cachedTextEncoder.encodeInto === 'function'
      ? function (arg, view) {
          return cachedTextEncoder.encodeInto(arg, view);
        }
      : function (arg, view) {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return {
            read: arg.length,
            written: buf.length,
          };
        };
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === void 0) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr2 = malloc(buf.length);
      getUint8Memory0()
        .subarray(ptr2, ptr2 + buf.length)
        .set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr2;
    }
    let len = arg.length;
    let ptr = malloc(len);
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 127) break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, (len = offset + arg.length * 3));
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);
      offset += ret.written;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  var cachegetInt32Memory0 = null;
  function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== memory.buffer) {
      cachegetInt32Memory0 = new Int32Array(memory.buffer);
    }
    return cachegetInt32Memory0;
  }
  var lTextDecoder =
    typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;
  var cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });
  cachedTextDecoder.decode();
  function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }
  function convert_string2(data) {
    try {
      const retptr = __wbindgen_export_0.value - 16;
      __wbindgen_export_0.value = retptr;
      var ptr0 = passStringToWasm0(data, __wbindgen_malloc, __wbindgen_realloc);
      var len0 = WASM_VECTOR_LEN;
      convert_string(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      __wbindgen_export_0.value += 16;
      __wbindgen_free(r0, r1);
    }
  }
  return {
    convert_string: convert_string2,
  };
};
