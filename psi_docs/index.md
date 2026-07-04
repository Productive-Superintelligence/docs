# Psi Documentation

Psi is a fractal connective grammar. It connects systems, composes them, and exposes the composite in the same shape it consumed, so the whole becomes a part and the loop recurs.

<div class="psi-tiles" markdown>

<a class="psi-tile" href="https://sssn.one/" markdown>
<strong>SSSN</strong>
Connect with `Channel`: how systems reach one another.
</a>

<a class="psi-tile" href="https://lllm.one/" markdown>
<strong>LLLM</strong>
Compose with `Tactic`: typed units of work that combine.
</a>

<a class="psi-tile" href="https://aaax.one/" markdown>
<strong>AAAX</strong>
Expose with `Strategy`: orchestration as a Pydantic/FastAPI surface another system can connect to.
</a>

<a class="psi-tile" href="hub/" markdown>
<strong>PsiHub</strong>
Describe, validate, discover, and download package metadata.
</a>

<a class="psi-tile" href="cli/" markdown>
<strong>PsiCLI</strong>
Prepare credentials, inspect packages, and launch resources locally.
</a>

<a class="psi-tile" href="sdk/" markdown>
<strong>Psi SDK</strong>
Install the full PSI station while keeping component docs and APIs separate.
</a>

</div>

## Connect, Compose, Expose

The essence is: connect, compose, expose, then again. What gets exposed has the shape of what was connected, so composition can repeat at any level.

SSSN, LLLM, and AAAX are independent frameworks, not a required pipeline. Use any one alone, pair them in whatever way fits the system, or stack all three when you want the recursive loop.

```mermaid
flowchart LR
  S["SSSN: Channel"] --> L["LLLM: Tactic"]
  L --> A["AAAX: Strategy"]
  A --> S
  P["PsiHub + PsiCLI"] -. "package grammar" .- S
  P -. "describe, validate, discover, launch" .- A
```

## Psi SDK

`psi-sdk` is the thin umbrella package for projects that want SSSN, LLLM, AAAX, and PsiHub in one install. It re-exports the real component modules as `psi.sssn`, `psi.lllm`, `psi.aaax`, and `psi.hub`, then adds a few local workflow helpers. Detailed docs for channels, tactics, strategies, and package metadata stay with the component docs.

Use [SDK](sdk.md) for the umbrella import and one-install workflow.

## One Shape

The docs are arranged as four switchable sets: `Psi`, `LLLM`, `SSSN`, and `AAAX`. The framework docs share the same public shape: one center abstraction, one thin implementation layer, and one service-ready surface.

The connective layer owns only the seam: no owned execution, no privileged coordinator. Thinness is what keeps the exposed composite self-similar to the connected part.

## Where To Go

- Use [SSSN](https://sssn.one/) when systems need to meet through channels, events, artifacts, snapshots, stores, or HTTP backends.
- Use [LLLM](https://lllm.one/) when typed tactics need to compose work across runtimes.
- Use [AAAX](https://aaax.one/) when composed package resources need to be exposed as CLI, FastAPI, agentic context, or a service surface another system can connect to.
- Use [PsiCLI](cli.md) when a human or local script needs to initialize credentials, inspect a package, or launch a package resource.
- Use [SDK](sdk.md) when a Python project wants the whole PSI ecology from one install.
- Use [PsiHub](hub.md) when Python code needs package metadata, validation, local publish/download, cards, config templates, or local hub APIs.
- Use [Tutorial](tutorial.md) for the shortest package lifecycle.
- Use [Reference](reference.md) for the surface map across Psi, LLLM, SSSN, and AAAX.
