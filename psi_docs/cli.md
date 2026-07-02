# PsiCLI

`psi` is the local command line for preparing credentials, inspecting PSI packages, and launching package resources as services.

Packages declare what they need. PsiCLI checks those requirements before import, then reads secrets from the process environment, OS keyring, or a local env file.

## Install

Install the CLI with the PSI packages it can launch:

```bash
python -m pip install prosi-psi-cli psihub lllm-core sssn aaax
```

Install optional keyring support when you want OS-backed secret storage:

```bash
python -m pip install "prosi-psi-cli[secure]"
```

## Declare Required Keys

A package names required provider credentials in `psi.toml`; values stay local.

```toml
[requirements.api_keys]
OPENAI_API_KEY = "OpenAI-compatible model access."
ANTHROPIC_API_KEY = "Claude model access."
TOGETHER_API_KEY = "Together model access."
```

## Initialize

Set up the keys required by a package before launching it.

```bash
psi init packages/analyst-tactics
psi init packages/analyst-tactics --credentials keyring
psi init packages/analyst-tactics --credentials env --env-file .env.local
```

## Inspect

Inspect reports routes and credential readiness without printing secret values.

```bash
psi inspect packages/analyst-tactics
psi inspect packages/analyst-tactics --json
```

## Launch

`psi launch` checks required keys before importing package code.

```bash
psi launch packages/analyst-tactics --port 8000
psi launch packages/society-sentinel --resource services.sentinel_api --port 8130
```

Use PsiCLI as the local human shell. Use [PsiHub](hub.md) when package metadata needs to be validated or embedded in Python code.
