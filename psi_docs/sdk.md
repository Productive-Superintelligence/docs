# PsiSDK

`psi-sdk` is the thin umbrella package for the PSI ecosystem. It installs the
four independently adoptable component packages and exposes them under one
Python namespace:

```bash
python -m pip install psi-sdk
```

```python
import psi

assert psi.lllm is __import__("lllm")
assert psi.sssn is __import__("sssn")
assert psi.aaax is __import__("aaax")
assert psi.hub is __import__("psihub")
```

The SDK does not replace the component packages. It is an all-in-one station for
projects that want the full PSI workflow in one install. Light adopters can
still install and import `lllm-core`, `sssn`, `aaax`, or `psihub` directly.
PsiCLI is not bundled into the SDK; it remains the top-level command interface
for humans and scripts.

The canonical source for this page lives in the `psisdk` repository; this hosted
copy keeps the central Psi docs navigable at `prosi.io/docs/sdk/`.

## What It Installs

| SDK alias | Package | Role | Main docs |
| --- | --- | --- | --- |
| `psi.sssn` | `sssn` | Connect systems through channels. | [sssn.one](https://sssn.one/) |
| `psi.lllm` | `lllm-core` | Compose typed tactics across runtimes. | [lllm.one](https://lllm.one/) |
| `psi.aaax` | `aaax` | Expose strategies as shells and services. | [aaax.one](https://aaax.one/) |
| `psi.hub` | `psihub` | Describe, validate, publish, and download PSI package metadata. | [PsiHub](hub.md) |

Detailed API documentation remains with each component. The SDK page only
documents the umbrella import, verb aliases, and tiny workflow helpers.

## Same Objects

`psi` re-exports the real modules by identity:

```python
import psi
import lllm
import sssn
import aaax
import psihub

assert psi.lllm is lllm
assert psi.sssn is sssn
assert psi.aaax is aaax
assert psi.hub is psihub
```

This means examples written for the component packages still work. You can use
the all-in-one namespace when it helps readability, and import components
directly when a project only needs one layer.

## Verb Aliases

The SDK also gives the framework trio their PSI verbs:

```python
import psi

connect = psi.connect   # sssn
compose = psi.compose   # lllm
expose = psi.expose     # aaax
share = psi.share       # psihub
```

These aliases are module aliases, not new abstractions.

## Workflow Helpers

The helpers call through to PsiHub and keep local package workflows short:

```python
import psi

psi.init_package("demo", org="local", kind="mixed")
report = psi.validate_package("demo")

if report.ok:
    record = psi.publish("demo", hub_root=".psihub")
    print(record.key)
```

The same publish helper is mirrored on `psi.hub` for the station workflow:

```python
import psi

record = psi.hub.publish("demo", hub_root=".psihub")
```

For lower-level control, use PsiHub directly:

```python
hub = psi.hub.LocalHub(".psihub")
record = hub.publish("demo")
downloaded = hub.download(record.identifier, "packages")
```

## Version Check

```python
import psi

print(psi.versions())
```

The returned dictionary reports the installed SDK, LLLM, SSSN, AAAX, and
PsiHub versions.
