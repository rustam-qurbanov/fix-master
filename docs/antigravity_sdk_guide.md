# 🤖 Google Antigravity SDK Guide

This guide provides technical specifications and code blueprints for configuring and running agents using the Python **Google Antigravity SDK**.

---

## ⚙️ Configuration Parameters (`LocalAgentConfig`)

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`model`** | `str` | Model identifier (defaults to `gemini-3.5-flash`). Do not guess names; verify in official docs. |
| **`system_instructions`** | `str` | Set of system instructions defining the agent's persona. |
| **`skills_paths`** | `list[str]` | Directories containing custom skill folders (each containing a `SKILL.md`). |
| **`mcp_servers`** | `list` | MCP servers to connect (Stdio or SSE). |
| **`hooks`** | `list` | Event listener hooks decorated with `@hooks`. |
| **`capabilities`** | `types.CapabilitiesConfig` | Enables features such as subagents (`enable_subagents=True`). |
| **`app_data_dir`** | `str` | Absolute path to override default database/artifact storage. |

---

## 🛠️ MCP Servers Integration

The SDK supports two transport modes for Model Context Protocol (MCP) servers:
1.  **Stdio Transport**: Launches local processes.
2.  **SSE Transport**: Connects to remote web services.

---

## ⚓ Lifecycle Hooks

Use decorators from `google.antigravity.hooks` to intercept and control the agent's execution flow:
*   `@hooks.on_session_start`
*   `@hooks.pre_turn` (can block or allow turns)
*   `@hooks.pre_tool_call_decide` (validates tool permissions)
*   `@hooks.on_tool_error` (handles errors during tool execution)
*   `@hooks.on_session_end`

---

## 📝 Complete Code Template

```python
from google.antigravity import Agent, LocalAgentConfig, types
from google.antigravity.hooks import hooks

# ==========================================
# 1. Define Lifecycle Hooks
# ==========================================

@hooks.on_session_start
async def on_session_start():
    print("[Orchestrator] Multi-agent session initialized.")

@hooks.pre_tool_call_decide
async def approve_tool_call(data: types.ToolCall) -> types.HookResult:
    print(f"[Orchestrator] Deciding tool permissions for: {data.name}")
    return types.HookResult(allow=True)

@hooks.on_tool_error
async def handle_tool_error(error: Exception):
    print(f"[Orchestrator] Tool execution error occurred: {error}")
    return None  # Propagate error back to the agent

# ==========================================
# 2. Configure MCP Servers
# ==========================================

mcp_servers = [
    # Stdio: Local execution (launches a node/python server)
    types.McpStdioServer(
        command="node",
        args=["/path/to/mcp-server/index.js"]
    ),
    # SSE: Remote web-service connection
    types.McpSseServer(
        url="https://mcp.example.com/sse",
        headers={"Authorization": "Bearer SECRETS"}
    )
]

# ==========================================
# 3. Create Agent Configuration
# ==========================================

config = LocalAgentConfig(
    model="gemini-3.5-flash",  # Recommended model
    system_instructions="You are the lead architect orchestrating sub-tasks.",
    skills_paths=["./.agents/skills/"],  # Load project skills
    mcp_servers=mcp_servers,
    hooks=[
        on_session_start,
        approve_tool_call,
        handle_tool_error
    ],
    capabilities=types.CapabilitiesConfig(
        enable_subagents=True  # Spawning child agents
    )
)

# ==========================================
# 4. Asynchronous Execution
# ==========================================

async def main():
    async with Agent(config=config) as agent:
        response = await agent.chat("Search skills and run QA tests for page.tsx")
        print(await response.text())
```
