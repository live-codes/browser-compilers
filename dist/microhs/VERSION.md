# Vendored MicroHs browser bundle

Source: MicroHs `web-mhs/` at commit `455782164e75998b140d869c1b7cdde0c8a21508`
(https://github.com/augustuss/MicroHs), also mirrored at https://microhs.org/web-mhs/.

Both files are **byte-identical to upstream — no local patches.**

| File | Bytes | sha256 |
| --- | --- | --- |
| `mhs-embed.wasm` | 1,875,521 | `89131E819C615F96A964A78958A6BB5C3A9D42B6C95CDF306F143231C0270919` |
| `mhs-embed.js` | 95,273 | `B8E57DCAD9D060F7B4A80654008C08EF1ED4FEF9CB5C95BC6201FEECC2319770` |

Upstream build command (run in `web-mhs/`, needs a built `mhs` on `PATH` and `MHSDIR` set):

```
mhs -temscripten_web -z -i -i../mhs -i../src MicroHs.Main -omhs-embed.js --embed-packages base:canvhs
```

## Do not patch `noExitRuntime`

An earlier revision changed `var noExitRuntime=true;` to `false` in an attempt to expose
exit codes. **This breaks the REPL.** With `noExitRuntime` false, emscripten's
`maybeExit()` really exits after the first JS trampoline, so the REPL terminates right
after printing its banner:

```js
var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter>0;
var maybeExit = () => { if(!keepRuntimeAlive()){ try{_exit(EXITSTATUS)}catch(e){handleException(e)} } };
```

The build also only overrides it from a truthy `Module.noExitRuntime`, so it cannot be
re-enabled at runtime. Keep the file pristine; completion is detected via the REPL's
sentinel prompt instead of an exit code.

See `../../FINDINGS.md` for the full behaviour notes, including the fact that this
bundle is REPL-only (`-r`/`-e` are inert because `compiledWithMhs` is false).
