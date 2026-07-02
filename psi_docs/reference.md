# Reference

The PSI tools share package refs and service-shaped resources, but each project owns a narrow public boundary.

## Psi Surfaces

| Surface | Owns | Use For |
| --- | --- | --- |
| [PsiCLI](cli.md) | Local command line | `psi init`, `psi inspect`, and `psi launch` for users and scripts. |
| [PsiHub](hub.md) | Python package hub | Metadata, validation, local publish/download, cards, config templates, and local hub APIs. |
| [LLLM](https://lllm.one/) | Low-Level Language Models | Tactic protocol, service adapters, runtimes, remote clients, and PsiHub metadata helpers. |
| [SSSN](https://sssn.one/) | Simple System of Systems Network | Channel, event, artifact, snapshot, store, server, client, and resolver APIs. |
| [AAAX](https://aaax.one/) | Advanced Autonomous Agent Executor | Strategy composition, mounted resources, package serving, shell endpoints, and handoff surfaces. |

## Naming

The docs switch and side drawer use short labels: `Psi`, `LLLM`, `SSSN`, and `AAAX`. The full names are kept in page content, READMEs, and explanatory text where they can be read without making the navigation too wide.
