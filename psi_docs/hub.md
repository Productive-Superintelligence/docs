# PsiHub

`psihub` is the Python package for PSI package metadata, validation, local hub storage, cards, config templates, and optional local hub APIs.

It is not the user-facing command line. `psi` owns local launch and credential setup; PsiHub keeps package metadata inspectable and portable for Python code, apps, scripts, AAAX, and agents.

## Install

```bash
python -m pip install psihub
```

## Create Package Metadata

Initialize a regular package folder with `psi.toml`.

```python
from psihub import init_package

init_package("demo-package", org="demo", name="echo", kind="tactic")
```

## Validate

Check refs, resources, package-file paths, card metadata, and API key declarations.

```python
from psihub import validate_package

report = validate_package("demo-package")
if not report.ok:
    for issue in report.issues:
        print(issue.level, issue.code, issue.message)
```

## Publish And Resolve

Use `LocalHub` as an embeddable local package registry.

```python
from psihub import LocalHub

hub = LocalHub(".psihub")
record = hub.publish("demo-package")
latest = hub.get("demo/echo")
downloaded = hub.download("demo/echo", "./downloaded")
```

## Render Cards

Cards expose package resources and launch hints without printing secret values.

```python
package_card = hub.card("demo/echo")
agent_card = hub.agent_card("demo/echo")
config = hub.config_template("demo/echo")
```

## Embed The API

Expose the same local hub to apps or development tools when needed.

```python
from psihub import LocalHub, create_app

app = create_app(hub=LocalHub(".psihub"))
```
