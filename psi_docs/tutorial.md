# Tutorial

This is the shortest local package lifecycle: install the shared tools, validate a package, prepare credentials, and launch the package service.

## 1. Install The Local Tools

Install the command line, package hub, and framework packages together for local PSI work.

```bash
python -m pip install prosi-psi-cli psihub lllm-core sssn aaax
```

## 2. Validate A Package

Use PsiHub from Python when package metadata checks belong inside scripts or apps.

```python
from psihub import validate_package

report = validate_package("packages/analyst-tactics")
assert report.ok
```

## 3. Prepare Credentials

Use PsiCLI before launching packages that declare provider keys.

```bash
psi init packages/analyst-tactics
psi inspect packages/analyst-tactics --json
```

## 4. Launch Locally

Launch the package's primary resource as a local FastAPI service.

```bash
psi launch packages/analyst-tactics --port 8000
```

Next, open the package's framework docs when the package exposes an LLLM tactic, SSSN channel, or AAAX shell.
