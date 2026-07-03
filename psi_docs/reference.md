# Reference

The PSI tools share one package grammar and one service-shaped surface. Each project owns a narrow public boundary so the shape can repeat cleanly. SSSN, LLLM, and AAAX can be used independently, paired in any direction, or stacked into the full connect -> compose -> expose loop.

## Design Philosophy

| Layer | Role | Center | Boundary |
| --- | --- | --- | --- |
| [SSSN](https://sssn.one/) | Connect | `Channel` | How systems reach one another through channels, events, artifacts, snapshots, stores, and HTTP access. |
| [LLLM](https://lllm.one/) | Compose | `Tactic` | Typed units of work that compose across Python, Pydantic AI, native LLLM, remote, and future runtimes. |
| [AAAX](https://aaax.one/) | Expose | `Strategy` | Mounted resources described with Pydantic models and exposed through CLI, FastAPI, agentic context, or any service surface another system can connect to. |
| [PsiHub](hub.md) | Platform | Package metadata | Describe, validate, discover, download, render cards, and produce config templates. |
| [PsiCLI](cli.md) | Interface | Local command line | Prepare credentials, inspect packages, and launch package resources. |

The loop is `connect -> compose -> expose -> connect`. What is exposed keeps the shape of what was connected, so the whole becomes a part and can be connected again.

## Psi Surfaces

| Surface | Owns | Use For |
| --- | --- | --- |
| [SSSN](https://sssn.one/) | Simple System of Systems Network | Channel, event, artifact, snapshot, store, server, client, and resolver APIs. |
| [LLLM](https://lllm.one/) | Low-Level Language Models | Tactic protocol, service adapters, runtimes, remote clients, and PsiHub metadata helpers. |
| [AAAX](https://aaax.one/) | Advanced Autonomous Agent Executor | Strategy composition, mounted resources, Pydantic envelopes, FastAPI apps, package serving, shell endpoints, and handoff surfaces. |
| [PsiHub](hub.md) | Python package hub | Metadata, validation, local publish/download, cards, config templates, and local hub APIs. |
| [PsiCLI](cli.md) | Local command line | `psi init`, `psi inspect`, and `psi launch` for users and scripts. |

## Naming

The docs switch and side drawer use short labels: `Psi`, `LLLM`, `SSSN`, and `AAAX`. The full names are kept in page content, READMEs, and explanatory text where they can be read without making the navigation too wide.
