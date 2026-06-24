# 🌌 Gemini: Orchestrator & Architect Blueprint

This document defines the **Gemini-specific** role, model configuration, and integration parameters for the **FixMaster** project.

---

## 📥 0. Auto-Loaded Context

Gemini CLI/Antigravity expands `@path` references into context automatically at session start. The lines below are not decorative — removing them stops the corresponding file from loading into every session:

@ORCHESTRATOR.md
@docs/gemini_skills.md
@docs/antigravity_sdk_guide.md
@docs/checklist.md

`docs/claude_skills.md` is intentionally **not** imported here — it describes Claude Code's own CLI skills directory (`.claude/skills/`), which Gemini/Antigravity doesn't use. If you want it loaded too, add `@docs/claude_skills.md` above.

---

## 🧭 1. General Principles
Gemini operates as the primary orchestrator within the Antigravity IDE. It inherits all core cognitive loops, decision-making logic, delegation topologies, and architectural rules from:
*   👉 **[ORCHESTRATOR.md](./ORCHESTRATOR.md)** (Single Source of Truth)

---

## 🤖 2. Model Configuration & Safety

*   **Default Model**: The recommended and default model is **`gemini-3.5-flash`**.
*   **Model Selection Rule**: Do not explicitly override or hardcode the model identifier in files unless explicitly requested by the user. Refer to the [Google AI Studio model docs](https://ai.google.dev/gemini-api/docs/models/gemini) for a list of valid names.
*   **API Key Setup**: Ensure `GEMINI_API_KEY` is loaded securely via environment variables (from `.env` which is excluded by `.gitignore`).

---

## 🔌 3. Antigravity IDE Environment

*   **Skills Directory**: Custom project-level slash commands in the Antigravity chat are resolved from the **`.agents/skills/`** directory in the workspace root.
*   **Plugin Cheat-Sheet**: For a list of all active user plugins, commands, and their intended usage scenarios, refer to:
    *   👉 **[gemini_skills.md](./docs/gemini_skills.md)**

---

## 💻 4. Python SDK Programming

*   When writing Python code to instantiate, customize, or deploy agents using the Google Antigravity SDK:
    *   Do not write code snippets directly in this file. Refer to:
        *   👉 **[antigravity_sdk_guide.md](./docs/antigravity_sdk_guide.md)**

---

## 🤝 5. Multi-Agent Delegation (Gemini-specific)

*   Follow the delegation protocol in **[ORCHESTRATOR.md §5](./ORCHESTRATOR.md#-5-multi-agent-delegation-protocol)** — default to single-agent, isolate subagents with a complete task description, pick the cheapest workflow pattern that fits.
*   In the Antigravity IDE, project skills (`.agents/skills/`) are activated autonomously by progressive disclosure — the agent reads skill metadata first, then loads the full `SKILL.md` only if relevant. Don't manually re-invoke a skill that's already active for the task.

---

## 📚 6. Reference Documentation

*   [Google Antigravity Documentation — Skills](https://antigravity.google/docs/skills) — `.agents/skills/` structure, discovery, and activation.
*   [Gemini API Documentation — Models](https://ai.google.dev/gemini-api/docs/models) — current model IDs; verify before hardcoding any model string here.
*   [Anthropic — Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents) — workflow patterns this project's delegation protocol is based on.
*   [ORCHESTRATOR.md](./ORCHESTRATOR.md) — Single Source of Truth for delegation and architecture rules.
