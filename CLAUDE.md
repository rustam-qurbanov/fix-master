# 🪶 Claude: Orchestrator & Architect Blueprint

This document defines the **Claude-specific** role, CLI parameters, and integration details for the **FixMaster** project.

---

## 📥 0. Auto-Loaded Context

Claude Code expands `@path` references into context automatically at session start (max 4 import hops). The lines below are not decorative — removing them stops the corresponding file from loading into every session:

@ORCHESTRATOR.md
@docs/claude_skills.md
@docs/checklist.md

`docs/gemini_skills.md` and `docs/antigravity_sdk_guide.md` are intentionally **not** imported here — they describe the Antigravity/Gemini environment, which Claude Code doesn't run in. Importing them would burn context budget on inapplicable instructions (see `ORCHESTRATOR.md` §3.5 "No Overengineering"). If you want them loaded too, add `@docs/gemini_skills.md` / `@docs/antigravity_sdk_guide.md` above.

---

## 🧭 1. General Principles
Claude operates as an orchestrator within the Claude Code CLI. It inherits all core cognitive loops, decision-making logic, delegation topologies, and architectural rules from:
*   👉 **[ORCHESTRATOR.md](./ORCHESTRATOR.md)** (Single Source of Truth)

---

## 🤖 2. CLI Environment & Safety

*   **Runtime Environment**: Claude runs within the `claude` CLI terminal agent tool.
*   **State & Cache Paths**: Local plan and skill state variables are saved under `~/.claude/` (which is excluded from Git to prevent local username leakage).
*   **Memory Settings**: Respect the memory context limit of the CLI. Condense long logs or search outputs before sharing.

---

## 🔌 3. Claude Code Skills

*   **Skills Directory**: Project-specific slash commands for the Claude CLI are resolved via symlinks in the **`.claude/skills/`** directory. Claude Code only scans **direct children** of this directory — nested subfolders are not discovered.
*   **Superpowers & Skills List**: For a list of all active Claude skills, command definitions, and their usage guidelines, refer to:
    *   👉 **[claude_skills.md](./docs/claude_skills.md)**

---

## 🤝 4. Multi-Agent Delegation (Claude-specific)

*   Use the `Agent` tool to delegate, following the protocol in **[ORCHESTRATOR.md §5](./ORCHESTRATOR.md#-5-multi-agent-delegation-protocol)** — default to single-agent, isolate subagents, give them a complete task description.
*   Use `Explore` for read-only codebase search, specialized agents (e.g. `claude-code-guide`) when the task matches their description, `general-purpose` otherwise.
*   To continue a previously spawned agent rather than re-deriving context, use `SendMessage` with its ID/name.

---

## 📚 5. Reference Documentation

*   [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code) — CLI features, settings, hooks, MCP.
*   [Claude Agent Skills Specification](https://agentskills.io/specification) — official `SKILL.md` format and constraints.
*   [Anthropic — Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents)
*   [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
*   [ORCHESTRATOR.md](./ORCHESTRATOR.md) — Single Source of Truth for delegation and architecture rules.
