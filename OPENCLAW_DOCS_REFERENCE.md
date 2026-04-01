# OpenClaw Documentation Reference

> Collected snippets and examples from [docs.openclaw.ai](https://docs.openclaw.ai)

---

### Install LiteLLM Proxy and Start Proxy
Source: https://docs.openclaw.ai/providers/litellm
Installs the LiteLLM proxy with necessary dependencies and starts the LiteLLM proxy service, making it ready to accept connections.
```bash
pip install 'litellm[proxy]'
litellm --model claude-opus-4-6
```
--------------------------------
### OpenClaw: Anthropic Token Setup Example
Source: https://docs.openclaw.ai/concepts/models
Example demonstrating the setup process for Anthropic's token authentication, followed by checking the model status using the OpenClaw CLI. This illustrates a common workflow for integrating specific provider authentication.
```bash
claude setup-token
openclaw models status
```
--------------------------------
### Start and Install Node Host
Source: https://docs.openclaw.ai/nodes
Commands to initiate a node host in the foreground or install it as a persistent service. This allows the gateway to route system commands to remote machines.
```bash
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"
openclaw node install --host <gateway-host> --port 18789 --display-name "Build Node"
openclaw node restart
```
--------------------------------
### Run Interactive Onboarding
Source: https://docs.openclaw.ai/cli/setup
Triggers the interactive setup wizard to guide the user through the configuration process.
```bash
openclaw setup --wizard
```
--------------------------------
### Install OpenClaw on VM
Source: https://docs.openclaw.ai/install/azure
Downloads and executes the OpenClaw installation script from a URL. It installs Node LTS and dependencies if they are not present, then installs OpenClaw and starts the onboarding wizard. The script is removed after execution.
```bash
curl -fsSL https://openclaw.ai/install.sh -o /tmp/install.sh
bash /tmp/install.sh
rm -f /tmp/install.sh
```
--------------------------------
### Install Binaries in Dockerfile
Source: https://docs.openclaw.ai/install/docker-vm-runtime
This Dockerfile example demonstrates how to install necessary binaries like gog, goplans, and wacli at image build time. It ensures these tools are available within the container and persist across restarts. The process involves downloading, extracting, and placing binaries in /usr/local/bin.
```dockerfile
FROM node:24-bookworm
RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*
# Example binary 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog
# Example binary 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/goplaces
# Example binary 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/wacli
# Add more binaries below using the same pattern
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts
RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build
ENV NODE_ENV=production
CMD ["node","dist/index.js"]
```
--------------------------------
### Setup OpenClaw Podman Environment
Source: https://docs.openclaw.ai/install/podman
Executes the setup script to create a dedicated user, build the container image, and install launch scripts. Use the --quadlet flag for production-style systemd service management.
```bash
./scripts/podman/setup.sh
./scripts/podman/setup.sh --quadlet
```
--------------------------------
### Manual LiteLLM Proxy Setup
Source: https://docs.openclaw.ai/providers/litellm
Steps to manually set up and start the LiteLLM proxy server.
```APIDOC
## Manual LiteLLM Proxy Setup
### Description
Manually set up and start the LiteLLM proxy server for integration with OpenClaw.
### Method
CLI Commands
### Endpoint
N/A
### Parameters
None
### Request Example
```bash
pip install 'litellm[proxy]'
litellm --model claude-opus-4-6
```
### Response
N/A
```
--------------------------------
### Install Dependencies and Start Gateway Watch
Source: https://docs.openclaw.ai/start/setup
Installs project dependencies using pnpm and starts the Gateway in watch mode. This is the primary command for the bleeding-edge workflow, enabling hot-reloading.
```bash
pnpm install
pnpm gateway:watch
```
--------------------------------
### Implement Channel Setup Wizard in TypeScript
Source: https://docs.openclaw.ai/plugins/sdk-setup
Provides an example of a `ChannelSetupWizard` object, defining how interactive setup for a channel plugin works. It includes status resolution, credential input, and inspection logic.
```typescript
import type { ChannelSetupWizard } from "openclaw/plugin-sdk/channel-setup";
const setupWizard: ChannelSetupWizard = {
  channel: "my-channel",
  status: {
    configuredLabel: "Connected",
    unconfiguredLabel: "Not configured",
    resolveConfigured: ({ cfg }) => Boolean((cfg.channels as any)?.["my-channel"]?.token),
  },
  credentials: [
    {
      inputKey: "token",
      providerHint: "my-channel",
      credentialLabel: "Bot token",
      preferredEnvVar: "MY_CHANNEL_BOT_TOKEN",
      envPrompt: "Use MY_CHANNEL_BOT_TOKEN from environment?",
      keepPrompt: "Keep current token?",
      inputPrompt: "Enter your bot token:",
      inspect: ({ cfg, accountId }) => {
        const token = (cfg.channels as any)?.["my-channel"]?.token;
        return {
          accountConfigured: Boolean(token),
          hasConfiguredValue: Boolean(token),
        };
      },
    },
  ],
};
```
--------------------------------
### Onboard OpenClaw with Setup Token Authentication
Source: https://docs.openclaw.ai/providers/anthropic
This command initiates the OpenClaw onboarding process, specifically choosing the setup token method for authentication. It guides the user through setting up a new agent or service with Anthropic.
```bash
openclaw onboard --auth-choice setup-token
```
--------------------------------
### OpenClaw Configuration Example with Groq (JSON5)
Source: https://docs.openclaw.ai/providers/groq
An example configuration file for OpenClaw that includes setting the Groq API key and specifying a default model. This demonstrates how to integrate Groq credentials and model preferences into the OpenClaw setup.
```json5
{
  env: { GROQ_API_KEY: "gsk_..." },
  agents: {
    defaults: {
      model: { primary: "groq/llama-3.3-70b-versatile" },
    },
  },
}
```
--------------------------------
### Migrate Single Agent to Multi-Agent Configuration (JSON)
Source: https://docs.openclaw.ai/tools/multi-agent-sandbox-tools
Demonstrates the transformation from a single-agent configuration to a multi-agent setup with distinct profiles. The 'Before' example shows a basic single-agent setup, while the 'After' example illustrates a multi-agent structure where the 'main' agent is configured with sandbox mode turned off.
```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "sandbox": {
        "mode": "non-main"
      }
    }
  },
  "tools": {
    "sandbox": {
      "tools": {
        "allow": ["read", "write", "apply_patch", "exec"],
        "deny": []
      }
    }
  }
}
```
```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "default": true,
        "workspace": "~/.openclaw/workspace",
        "sandbox": { "mode": "off" }
      }
    ]
  }
}
```
--------------------------------
### Install Homebrew on Linux
Source: https://docs.openclaw.ai/help/faq
This command provides a quick setup for installing Homebrew (Linuxbrew) on a Linux system. Homebrew is a package manager that simplifies software installation.
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
--------------------------------
### Onboard and Install OpenClaw Service
Source: https://docs.openclaw.ai/
Executes the OpenClaw onboarding process, which includes setting up the service as a daemon. This command guides users through initial configuration and service installation.
```bash
openclaw onboard --install-daemon
```
--------------------------------
### Setup Entry Point
Source: https://docs.openclaw.ai/plugins/sdk-setup
Defines the `setup-entry.ts` file, a lightweight alternative to `index.ts` for OpenClaw setup surfaces. It avoids loading heavy runtime code during setup flows.
```APIDOC
## Setup entry
The `setup-entry.ts` file is a lightweight alternative to `index.ts` that
OpenClaw loads when it only needs setup surfaces (onboarding, config repair,
disabled channel inspection).
```typescript
// setup-entry.ts
import { defineSetupPluginEntry } from "openclaw/plugin-sdk/core";
import { myChannelPlugin } from "./src/channel.js";
export default defineSetupPluginEntry(myChannelPlugin);
```
This avoids loading heavy runtime code (crypto libraries, CLI registrations,
background services) during setup flows.
**When OpenClaw uses `setupEntry` instead of the full entry:**
* The channel is disabled but needs setup/onboarding surfaces
* The channel is enabled but unconfigured
* Deferred loading is enabled (`deferConfiguredChannelFullLoadUntilAfterListen`)
**What `setupEntry` must register:**
* The channel plugin object (via `defineSetupPluginEntry`)
* Any HTTP routes required before gateway listen
* Any gateway methods needed during startup
**What `setupEntry` should NOT include:**
* CLI registrations
* Background services
* Heavy runtime imports (crypto, SDKs)
* Gateway methods only needed after startup
```
--------------------------------
### OpenClaw Matrix Channel Interactive Setup
Source: https://docs.openclaw.ai/channels/matrix
Commands to initiate the interactive setup for adding and configuring Matrix channels within OpenClaw. These commands guide the user through the necessary configuration steps.
```bash
openclaw channels add
```
```bash
openclaw configure --section channels
```
--------------------------------
### Standard Installation and Onboarding
Source: https://docs.openclaw.ai/help/faq
Performs a standard installation of the OpenClaw software and initiates the onboarding wizard to configure the daemon and UI assets.
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
```
--------------------------------
### Install OpenClaw Gateway (Bash)
Source: https://docs.openclaw.ai/install/oracle
Downloads and executes the OpenClaw installation script. It then sources the bashrc file to make OpenClaw commands available in the current session. Users are prompted to defer gateway setup.
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
source ~/.bashrc
```
--------------------------------
### Install and Run OpenClaw
Source: https://docs.openclaw.ai/install/raspberry-pi
Downloads the installation script, runs the onboarding wizard, and verifies the service status.
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
openclaw status
sudo systemctl status openclaw
journalctl -u openclaw -f
```
--------------------------------
### Comprehensive CLI Backend Configuration Example
Source: https://docs.openclaw.ai/gateway/cli-backends
Provides a detailed example of configuring a custom CLI backend ('my-cli') with various options, including command arguments, output parsing, model aliasing, session handling, and system prompt arguments.
```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "claude-cli": {
          command: "/opt/homebrew/bin/claude",
        },
        "my-cli": {
          command: "my-cli",
          args: ["--json"],
          output: "json",
          input: "arg",
          modelArg: "--model",
          modelAliases: {
            "claude-opus-4-6": "opus",
            "claude-opus-4-6": "opus",
            "claude-sonnet-4-6": "sonnet",
          },
          sessionArg: "--session",
          sessionMode: "existing",
          sessionIdFields: ["session_id", "conversation_id"],
          systemPromptArg: "--system",
          systemPromptWhen: "first",
          imageArg: "--image",
          imageMode: "repeat",
          serialize: true,
        },
      },
    },
  },
}
```
--------------------------------
### Install Node.js on Ubuntu/Debian
Source: https://docs.openclaw.ai/install/node
Installs Node.js version 24.x on Ubuntu and Debian-based systems using NodeSource repositories. This involves fetching a setup script and then installing the nodejs package.
```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```
--------------------------------
### Basic Openclaw Onboarding
Source: https://docs.openclaw.ai/cli/onboard
Demonstrates the basic 'openclaw onboard' command and its common flow options like 'quickstart' and 'manual'. It also shows how to specify a remote gateway URL.
```bash
openclaw onboard
openclaw onboard --flow quickstart
openclaw onboard --flow manual
openclaw onboard --mode remote --remote-url wss://gateway-host:18789
```
--------------------------------
### Install Plugin
Source: https://docs.openclaw.ai/plugins/sdk-setup
Install a plugin from a specified source or the default registry.
```APIDOC
## POST /plugins/install
### Description
Installs a plugin package. Defaults to ClawHub, with fallback to npm. Supports explicit source selection.
### Method
CLI Command
### Endpoint
openclaw plugins install [source:]<package-name>
### Parameters
#### Path Parameters
- **package-name** (string) - Required - The name of the plugin package to install.
#### Query Parameters
- **source** (string) - Optional - Specify 'clawhub:' or 'npm:' to force a specific registry.
### Request Example
openclaw plugins install @myorg/openclaw-my-plugin
### Response
#### Success Response (200)
- **status** (string) - Confirmation of successful installation.
```
--------------------------------
### OpenClaw Matrix Channel Setup
Source: https://docs.openclaw.ai/channels/matrix
Configuration examples for setting up the Matrix channel in OpenClaw. Supports token-based and password-based authentication, with options for DM policies and E2EE.
```json
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_xxx",
      dm: { policy: "pairing" },
    },
  },
}
```
```json
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      userId: "@bot:example.org",
      password: "replace-me",
      deviceName: "OpenClaw Gateway",
    },
  },
}
```
--------------------------------
### Install OpenClaw WhatsApp Plugin
Source: https://docs.openclaw.ai/channels/whatsapp
Command to manually install the OpenClaw WhatsApp plugin from npm. This is an alternative to the on-demand installation prompted during onboarding or channel setup.
```bash
openclaw plugins install @openclaw/whatsapp
```
--------------------------------
### Execute Provider Login Examples
Source: https://docs.openclaw.ai/cli/models
Practical examples for authenticating with specific providers like Anthropic or OpenAI, including setting default models and using CLI-based login methods.
```bash
openclaw models auth login --provider anthropic --method cli --set-default
openclaw models auth login --provider openai-codex --set-default
```
--------------------------------
### Initialize Development Profile
Source: https://docs.openclaw.ai/gateway
Quick setup commands to initialize a development environment with isolated state and configuration.
```bash
openclaw --dev setup
openclaw --dev gateway --allow-unconfigured
openclaw --dev status
```
--------------------------------
### Install OpenClaw using Script (macOS/Linux/WSL2)
Source: https://docs.openclaw.ai/install
Installs OpenClaw using a curl command to download and execute an installation script. This method detects the OS, installs Node.js if needed, and sets up OpenClaw. The `--no-onboard` flag can be used to skip the onboarding process.
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```
```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```
--------------------------------
### Install Docker and Verify
Source: https://docs.openclaw.ai/install/gcp
Installs Docker on the remote VM, adds the current user to the docker group for permission management, and verifies the installation.
```bash
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
exit
gcloud compute ssh openclaw-gateway --zone=us-central1-a
docker --version
docker compose version
```
--------------------------------
### Search and Install Plugins
Source: https://docs.openclaw.ai/plugins/sdk-setup
Commands to search for available plugins using a query string and install them by their package name.
```bash
openclaw plugins search <query>
openclaw plugins install <package-name>
```
--------------------------------
### Setup Wizards for Channel Plugins
Source: https://docs.openclaw.ai/plugins/sdk-setup
Details how channel plugins can provide interactive setup wizards for `openclaw onboard` using the `ChannelSetupWizard` object.
```APIDOC
## Setup wizards
Channel plugins can provide interactive setup wizards for `openclaw onboard`.
The wizard is a `ChannelSetupWizard` object on the `ChannelPlugin`:
```typescript
import type { ChannelSetupWizard } from "openclaw/plugin-sdk/channel-setup";
const setupWizard: ChannelSetupWizard = {
  channel: "my-channel",
  status: {
    configuredLabel: "Connected",
    unconfiguredLabel: "Not configured",
    resolveConfigured: ({ cfg }) => Boolean((cfg.channels as any)?.["my-channel"]?.token),
  },
  credentials: [
    {
      inputKey: "token",
      providerHint: "my-channel",
      credentialLabel: "Bot token",
      preferredEnvVar: "MY_CHANNEL_BOT_TOKEN",
      envPrompt: "Use MY_CHANNEL_BOT_TOKEN from environment?",
      keepPrompt: "Keep current token?",
      inputPrompt: "Enter your bot token:",
      inspect: ({ cfg, accountId }) => {
        const token = (cfg.channels as any)?.["my-channel"]?.token;
        return {
          accountConfigured: Boolean(token),
          hasConfiguredValue: Boolean(token),
        };
      },
    },
  ],
};
```
The `ChannelSetupWizard` type supports `credentials`, `textInputs`,
`dmPolicy`, `allowFrom`, `groupAccess`, `prepare`, `finalize`, and more.
See bundled plugins (e.g. `extensions/discord/src/channel.setup.ts`) for
full examples.
For DM allowlist prompts that only need the standard
`note -> prompt -> parse -> merge -> patch` flow, prefer the shared setup
helpers from `openclaw/plugin-sdk/setup`: `createPromptParsedAllowFromForAccount(...)`,
`createTopLevelChannelParsedAllowFromPrompt(...)`, and
`createNestedChannelParsedAllowFromPrompt(...)`.
For channel setup status blocks that only vary by labels, scores, and optional
extra lines, prefer `createStandardChannelSetupStatus(...)` from
`openclaw/plugin-sdk/setup` instead of hand-rolling the same `status` object in
each plugin.
For optional setup surfaces that should only appear in certain contexts, use
`createOptionalChannelSetupSurface` from `openclaw/plugin-sdk/channel-setup`:
```typescript
import { createOptionalChannelSetupSurface } from "openclaw/plugin-sdk/channel-setup";
const setupSurface = createOptionalChannelSetupSurface({
  channel: "my-channel",
  label: "My Channel",
  npmSpec: "@myorg/openclaw-my-channel",
  docsPath: "/channels/my-channel",
});
// Returns { setupAdapter, setupWizard }
```
```
--------------------------------
### Verify Gateway installation and start service
Source: https://docs.openclaw.ai/platforms/mac/bundled-gateway
Checks the installed version of the OpenClaw CLI and starts the Gateway service on a specific port and bind address. The environment variables are used to skip optional features during the smoke test.
```bash
openclaw --version
OPENCLAW_SKIP_CHANNELS=1 \
OPENCLAW_SKIP_CANVAS_HOST=1 \
openclaw gateway --port 18999 --bind loopback
```
--------------------------------
### Build and Develop Control UI
Source: https://docs.openclaw.ai/web/control-ui
Commands to build the static UI files for production or start a development server for local testing. The build process automatically installs dependencies on the first run.
```bash
pnpm ui:build
```
```bash
OPENCLAW_CONTROL_UI_BASE_PATH=/openclaw/ pnpm ui:build
```
```bash
pnpm ui:dev
```
--------------------------------
### Tool Execution Examples
Source: https://docs.openclaw.ai/tools/exec
Examples demonstrating different ways to execute tools, including foreground commands, background processes with polling, and sending keys.
```APIDOC
## Foreground Command Execution
### Description
Executes a command in the foreground.
### Method
POST
### Endpoint
/execute
### Request Body
- **tool** (string) - Required - The tool to use, e.g., "exec".
- **command** (string) - Required - The command to execute.
### Request Example
```json
{
  "tool": "exec",
  "command": "ls -la"
}
```
## Background Process with Polling
### Description
Starts a background process and polls for its completion.
### Method
POST
### Endpoint
/execute
### Request Body
- **tool** (string) - Required - The tool to use, e.g., "exec".
- **command** (string) - Required - The command to execute.
- **yieldMs** (integer) - Optional - The polling interval in milliseconds.
- **action** (string) - Required - The action to perform, e.g., "poll".
- **sessionId** (string) - Required - The session ID of the process to poll.
### Request Example
```json
{
  "tool": "exec",
  "command": "npm run build",
  "yieldMs": 1000
}
```
```json
{
  "tool": "process",
  "action": "poll",
  "sessionId": "<id>"
}
```
## Sending Keys to a Process (tmux-style)
### Description
Sends key presses to a running process, mimicking tmux keybindings.
### Method
POST
### Endpoint
/execute
### Request Body
- **tool** (string) - Required - The tool to use, e.g., "process".
- **action** (string) - Required - The action to perform, "send-keys".
- **sessionId** (string) - Required - The session ID of the process.
- **keys** (array of strings) - Required - An array of keys to send.
### Request Example
```json
{
  "tool": "process",
  "action": "send-keys",
  "sessionId": "<id>",
  "keys": ["Enter"]
}
```
```json
{
  "tool": "process",
  "action": "send-keys",
  "sessionId": "<id>",
  "keys": ["C-c"]
}
```
```json
{
  "tool": "process",
  "action": "send-keys",
  "sessionId": "<id>",
  "keys": ["Up", "Up", "Enter"]
}
```
## Submitting Input to a Process (send CR only)
### Description
Submits input to a process by sending only a carriage return (CR).
### Method
POST
### Endpoint
/execute
### Request Body
- **tool** (string) - Required - The tool to use, "process".
- **action** (string) - Required - The action to perform, "submit".
- **sessionId** (string) - Required - The session ID of the process.
### Request Example
```json
{
  "tool": "process",
  "action": "submit",
  "sessionId": "<id>"
}
```
## Pasting Text into a Process
### Description
Pastes text into a running process. Supports multi-line text.
### Method
POST
### Endpoint
/execute
### Request Body
- **tool** (string) - Required - The tool to use, "process".
- **action** (string) - Required - The action to perform, "paste".
- **sessionId** (string) - Required - The session ID of the process.
- **text** (string) - Required - The text to paste.
### Request Example
```json
{
  "tool": "process",
  "action": "paste",
  "sessionId": "<id>",
  "text": "line1\nline2\n"
}
```
```
--------------------------------
### Manual Docker Flow for OpenClaw Gateway
Source: https://docs.openclaw.ai/install/docker
Executes the OpenClaw gateway setup steps manually without using the setup script. This involves building the Docker image, running onboarding and configuration commands, and starting the gateway service.
```bash
docker build -t openclaw:local -f Dockerfile .
docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js onboard --mode local --no-install-daemon
docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set gateway.mode local
docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set gateway.bind lan
docker compose run --rm --no-deps --entrypoint node openclaw-gateway \
  dist/index.js config set gateway.controlUi.allowedOrigins \
  '["http://localhost:18789","http://127.0.0.1:18789"]' --strict-json
docker compose up -d openclaw-gateway
```
--------------------------------
### OpenClaw Teams Plugin Setup
Source: https://docs.openclaw.ai/channels/msteams
Steps to install the Microsoft Teams plugin for OpenClaw and configure bot registration.
```APIDOC
## Setup (minimal text-only)
1. **Install the Microsoft Teams plugin**
   * From npm: `openclaw plugins install @openclaw/msteams`
   * From a local checkout: `openclaw plugins install ./extensions/msteams`
2. **Bot registration**
   * Create an Azure Bot and note:
     * App ID
     * Client secret (App password)
     * Tenant ID (single-tenant)
```
--------------------------------
### Hello-Ok Response Example
Source: https://docs.openclaw.ai/concepts/typebox
Example of the `hello-ok` response frame sent by the Gateway after a successful `connect` request.
```APIDOC
## WebSocket Response (hello-ok)
### Description
Response from the Gateway confirming a successful connection handshake.
### Method
WebSocket Frame (Response)
### Endpoint
WebSocket Connection
### Response
#### Success Response (hello-ok)
- **type** (string) - Description: Must be "res".
- **id** (string) - Description: The ID of the original `connect` request.
- **ok** (boolean) - Description: True if the connection was successful.
- **payload** (object) - Description: The `hello-ok` payload.
  - **type** (string) - Description: Must be "hello-ok".
  - **protocol** (integer) - Description: The negotiated protocol version.
  - **server** (object) - Description: Server information.
    - **version** (string) - Description: Server version.
    - **connId** (string) - Description: Unique connection identifier.
  - **features** (object) - Description: Supported features.
    - **methods** (array of strings) - Description: List of supported methods.
    - **events** (array of strings) - Description: List of supported events.
  - **snapshot** (object) - Description: Initial state snapshots.
  - **policy** (object) - Description: Connection policy details.
    - **maxPayload** (integer) - Description: Maximum allowed payload size in bytes.
    - **maxBufferedBytes** (integer) - Description: Maximum buffered bytes.
    - **tickIntervalMs** (integer) - Description: Interval for `tick` events in milliseconds.
#### Response Example
```json
{
  "type": "res",
  "id": "c1",
  "ok": true,
  "payload": {
    "type": "hello-ok",
    "protocol": 2,
    "server": { "version": "dev", "connId": "ws-1" },
    "features": { "methods": ["health"], "events": ["tick"] },
    "snapshot": {
      "presence": [],
      "health": {},
      "stateVersion": { "presence": 0, "health": 0 },
      "uptimeMs": 0
    },
    "policy": { "maxPayload": 1048576, "maxBufferedBytes": 1048576, "tickIntervalMs": 30000 }
  }
}
```
```
--------------------------------
### Manage Gateway Service Lifecycle
Source: https://docs.openclaw.ai/cli/gateway
Standard service management commands to install, start, stop, restart, and uninstall the gateway service.
```bash
openclaw gateway install
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway uninstall
```
--------------------------------
### Running the Gateway
Source: https://docs.openclaw.ai/channels/msteams
Information on how the Teams channel automatically starts once the plugin is installed and configured.
```APIDOC
## Run the gateway
   * The Teams channel starts automatically when the plugin is installed and `msteams` config exists with credentials.
```
--------------------------------
### Install and Configure Tailscale (Bash)
Source: https://docs.openclaw.ai/install/oracle
Downloads and installs Tailscale using the official script, then configures it to connect to the Tailscale network with SSH enabled and sets the hostname. Subsequent connections can be made via Tailscale.
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh --hostname=openclaw
```
--------------------------------
### Install OpenClaw Gateway on Ubuntu
Source: https://docs.openclaw.ai/install/digitalocean
Updates the system, installs Node.js 24, and downloads the OpenClaw installation script to set up the environment.
```bash
ssh root@YOUR_DROPLET_IP
apt update && apt upgrade -y
# Install Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs
# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw --version
```
--------------------------------
### CLI Setup for OpenCode Go
Source: https://docs.openclaw.ai/providers/opencode-go
This snippet shows how to onboard and set up OpenCode Go using the command-line interface. It provides both interactive and non-interactive methods for configuring the OpenCode API key.
```bash
openclaw onboard --auth-choice opencode-go
# or non-interactive
openclaw onboard --opencode-go-api-key "$OPENCODE_API_KEY"
```
--------------------------------
### Install OpenClaw Plugins
Source: https://docs.openclaw.ai/cli/plugins
Demonstrates various ways to install OpenClaw plugins, including from ClawHub, npm, local paths, and marketplaces. It covers options for pinning versions and specifying sources.
```bash
openclaw plugins install <package>                      # ClawHub first, then npm
openclaw plugins install clawhub:<package>              # ClawHub only
openclaw plugins install <package> --pin                # pin version
openclaw plugins install <path>                         # local path
openclaw plugins install <plugin>@<marketplace>         # marketplace
openclaw plugins install <plugin> --marketplace <name>  # marketplace (explicit)
```
```bash
openclaw plugins install clawhub:openclaw-codex-app-server
openclaw plugins install clawhub:openclaw-codex-app-server@1.2.3
```
```bash
openclaw plugins install openclaw-codex-app-server
```
```bash
openclaw plugins marketplace list <marketplace-name>
openclaw plugins install <plugin-name>@<marketplace-name>
```
```bash
openclaw plugins install <plugin-name> --marketplace <marketplace-name>
openclaw plugins install <plugin-name> --marketplace <owner/repo>
openclaw plugins install <plugin-name> --marketplace ./my-marketplace
```
```bash
openclaw plugins install -l ./my-plugin
```
--------------------------------
### OpenClaw Plugin Configuration (`package.json`)
Source: https://docs.openclaw.ai/plugins/architecture
Defines the main entry points for an OpenClaw plugin, specifying extensions and an optional setup entry. Dependencies must be installed locally within the plugin directory.
```json
{
  "name": "my-pack",
  "openclaw": {
    "extensions": ["./src/safety.ts", "./src/tools.ts"],
    "setupEntry": "./src/setup-entry.ts"
  }
}
```
--------------------------------
### Bootstrap OpenClaw Setup
Source: https://docs.openclaw.ai/start/setup
Initializes the OpenClaw environment. This command should be run once to set up the necessary configurations and workspace.
```bash
openclaw setup
```
--------------------------------
### Manage Gateway Service Lifecycle
Source: https://docs.openclaw.ai/gateway
Commands to install, start, and manage the OpenClaw gateway service on different operating systems.
```bash
# macOS (launchd)
openclaw gateway install
openclaw gateway status
openclaw gateway restart
openclaw gateway stop
# Linux (systemd user)
openclaw gateway install
systemctl --user enable --now openclaw-gateway[-<profile>].service
openclaw gateway status
# Linux (system service)
sudo systemctl daemon-reload
sudo systemctl enable --now openclaw-gateway[-<profile>].service
```
--------------------------------
### Installing OpenClaw via Script
Source: https://docs.openclaw.ai/install/exe-dev
Executes the official OpenClaw installation script to set up the environment on the VM.
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```
--------------------------------
### Multi-account Example
Source: https://docs.openclaw.ai/channels/matrix
Configuration example for setting up and managing multiple Matrix accounts within OpenClaw, including default account selection and account-specific settings.
```APIDOC
## Multi-account example
```json5
{
  "channels": {
    "matrix": {
      "enabled": true,
      "defaultAccount": "assistant",
      "dm": {"policy": "pairing"},
      "accounts": {
        "assistant": {
          "homeserver": "https://matrix.example.org",
          "accessToken": "syt_assistant_xxx",
          "encryption": true,
        },
        "alerts": {
          "homeserver": "https://matrix.example.org",
          "accessToken": "syt_alerts_xxx",
          "dm": {
            "policy": "allowlist",
            "allowFrom": ["@ops:example.org"],
          },
        },
      },
    },
  },
}
```
Top-level `channels.matrix` values act as defaults for named accounts unless an account overrides them.
Set `defaultAccount` when you want OpenClaw to prefer one named Matrix account for implicit routing, probing, and CLI operations.
If you configure multiple named accounts, set `defaultAccount` or pass `--account <id>` for CLI commands that rely on implicit account selection.
Pass `--account <id>` to `openclaw matrix verify ...` and `openclaw matrix devices ...` when you want to override that implicit selection for one command.
```
--------------------------------
### Setup xAI API Key with OpenClaw
Source: https://docs.openclaw.ai/providers/xai
This command-line snippet shows how to onboard the xAI provider by setting up your API key. It's a prerequisite for using Grok models.
```bash
openclaw onboard --auth-choice xai-api-key
```
--------------------------------
### Install and Configure Ollama
Source: https://docs.openclaw.ai/concepts/model-providers
Instructions for installing Ollama and pulling a model, followed by a configuration snippet to set Ollama as the default model provider. No API key is required for local Ollama servers.
```bash
# Install Ollama, then pull a model:
ollama pull llama3.3
```
```json
{
  "agents": {
    "defaults": { "model": { "primary": "ollama/llama3.3" } },
  },
}
```
--------------------------------
### Manual Development Install (Clone and Build)
Source: https://docs.openclaw.ai/help/faq
Clones the OpenClaw repository from GitHub, installs dependencies using pnpm, and builds the project. This method provides a local repository for development and modification.
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
```
--------------------------------
### Define Setup Plugin Entry Point (TypeScript)
Source: https://docs.openclaw.ai/plugins/sdk-entrypoints
Use `defineSetupPluginEntry` for lightweight `setup-entry.ts` files. This function returns just the plugin object without runtime or CLI wiring, suitable for disabled, unconfigured, or deferred loading scenarios. Dependencies include the 'openclaw/plugin-sdk/core' module.
```typescript
import { defineSetupPluginEntry } from "openclaw/plugin-sdk/core";
export default defineSetupPluginEntry(myChannelPlugin);
```
--------------------------------
### Install OpenClaw using Script (Windows PowerShell)
Source: https://docs.openclaw.ai/install
Installs OpenClaw on Windows using PowerShell to download and execute an installation script. This method handles OS detection and Node.js installation. The `-NoOnboard` parameter can be used to bypass the onboarding flow.
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```
--------------------------------
### Create Optional Channel Setup Surface in TypeScript
Source: https://docs.openclaw.ai/plugins/sdk-setup
Demonstrates using `createOptionalChannelSetupSurface` to define setup surfaces that appear conditionally. This function helps in creating reusable setup adapters and wizards.
```typescript
import { createOptionalChannelSetupSurface } from "openclaw/plugin-sdk/channel-setup";
const setupSurface = createOptionalChannelSetupSurface({
  channel: "my-channel",
  label: "My Channel",
  npmSpec: "@myorg/openclaw-my-channel",
  docsPath: "/channels/my-channel",
});
// Returns { setupAdapter, setupWizard }
```
--------------------------------
### Non-interactive Volcengine Setup
Source: https://docs.openclaw.ai/providers/volcengine
Executes the onboarding process in non-interactive mode, suitable for automated environments or CI/CD pipelines.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice volcengine-api-key \
  --volcengine-api-key "$VOLCANO_ENGINE_API_KEY"
```
--------------------------------
### Install Synology Chat Plugin
Source: https://docs.openclaw.ai/channels/synology-chat
Install the Synology Chat plugin from a local directory using the OpenClaw CLI.
```bash
openclaw plugins install ./extensions/synology-chat
```
--------------------------------
### Interactive Configuration Commands
Source: https://docs.openclaw.ai/gateway/configuration
CLI commands to launch the interactive onboarding or configuration wizards. These tools simplify the setup process for new users.
```bash
openclaw onboard       # full onboarding flow
openclaw configure     # config wizard
```
--------------------------------
### Configure Exec Tool via JSON
Source: https://docs.openclaw.ai/tools/exec
Example configuration for the Exec tool, demonstrating how to prepend custom directories to the system PATH for command execution.
```json5
{
  tools: {
    exec: {
      pathPrepend: ["~/bin", "/opt/oss/bin"],
    },
  },
}
```
--------------------------------
### Install Docker and Git on Ubuntu/Debian
Source: https://docs.openclaw.ai/install/hetzner
Installs necessary packages including Git, curl, and Docker on the Ubuntu or Debian VPS. It updates package lists and then installs Docker using the official convenience script.
```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```
--------------------------------
### Channel-Specific Configuration Example (JSON5)
Source: https://docs.openclaw.ai/plugins/sdk-setup
Shows how to define configuration for specific channels, including sensitive information like bot tokens and access control lists. This is separate from general plugin configuration.
```json5
{
  channels: {
    "my-channel": {
      token: "bot-token",
      allowFrom: ["user1", "user2"],
    },
  },
}
```
--------------------------------
### Configure ACP Runtime Defaults and Bindings
Source: https://docs.openclaw.ai/tools/acp-agents
Example configuration for defining agent-specific ACP runtime settings and channel-based bindings. This setup ensures that specific agents are routed to correct workspaces and backends based on the communication channel.
```json5
{
  agents: {
    list: [
      {
        id: "codex",
        runtime: {
          type: "acp",
          acp: {
            agent: "codex",
            backend: "acpx",
            mode: "persistent",
            cwd: "/workspace/openclaw",
          },
        },
      },
      {
        id: "claude",
        runtime: {
          type: "acp",
          acp: { agent: "claude", backend: "acpx", mode: "persistent" },
        },
      },
    ],
  },
  bindings: [
    {
      type: "acp",
      agentId: "codex",
      match: {
        channel: "discord",
        accountId: "default",
        peer: { kind: "channel", id: "222222222222222222" },
      },
      acp: { label: "codex-main" },
    },
    {
      type: "acp",
      agentId: "claude",
      match: {
        channel: "telegram",
        accountId: "default",
        peer: { kind: "group", id: "-1001234567890:topic:42" },
      },
      acp: { cwd: "/workspace/repo-b" },
    },
    {
      type: "route",
      agentId: "main",
      match: { channel: "discord", accountId: "default" },
    },
    {
      type: "route",
      agentId: "main",
      match: { channel: "telegram", accountId: "default" },
    },
  ],
  channels: {
    discord: {
      guilds: {
        "111111111111111111": {
          channels: {
            "222222222222222222": { requireMention: false },
          },
        },
      },
    },
    telegram: {
      groups: {
        "-1001234567890": {
          topics: { "42": { requireMention: false } },
        },
      },
    },
  },
}
```
--------------------------------
### Install OpenClaw from Source
Source: https://docs.openclaw.ai/install
Installs OpenClaw by cloning the repository, installing dependencies, building the project, and linking it globally. This method is suitable for developers or users who need to work with the latest code from the main branch.
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm ui:build && pnpm build
pnpm link --global
openclaw onboard --install-daemon
```
--------------------------------
### Store Wizard Setup Metadata
Source: https://docs.openclaw.ai/gateway/configuration-reference
Records metadata from CLI-guided setup flows, including the last run timestamp, version, commit hash, command, and mode.
```json5
{
  wizard: {
    lastRunAt: "2026-01-01T00:00:00.000Z",
    lastRunVersion: "2026.1.4",
    lastRunCommit: "abc1234",
    lastRunCommand: "configure",
    lastRunMode: "local",
  },
}
```
--------------------------------
### Install OpenClaw CLI
Source: https://docs.openclaw.ai/install/installer
The primary method to install the OpenClaw CLI is by piping the installation script to bash. Various flags can be appended to customize the installation, such as skipping onboarding, choosing the installation method, or performing a dry run.
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-onboard
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --install-method git
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --version main
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --dry-run
```
--------------------------------
### Package.json Plugin Configuration
Source: https://docs.openclaw.ai/tools/capability-cookbook
Defines how a plugin is structured within a `package.json` file. It specifies extension entry points, optional setup entries, and deferral of full load until after listening. Dependencies should be installed locally within the plugin directory.
```json
{
  "name": "my-pack",
  "openclaw": {
    "extensions": ["./src/safety.ts", "./src/tools.ts"],
    "setupEntry": "./src/setup-entry.ts"
  }
}
```
```json
{
  "name": "@scope/my-channel",
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "startup": {
      "deferConfiguredChannelFullLoadUntilAfterListen": true
    }
  }
}
```
--------------------------------
### Setup Gmail Pub/Sub Integration using OpenClaw Wizard
Source: https://docs.openclaw.ai/automation/gmail-pubsub
This bash command initiates the OpenClaw wizard to set up the Gmail Pub/Sub integration. It automates dependency installation (on macOS), configures the necessary hooks, and sets up the push endpoint, typically using Tailscale Funnel.
```bash
openclaw webhooks gmail setup \
  --account openclaw@gmail.com
```
--------------------------------
### Install OpenClaw with Verbose Output
Source: https://docs.openclaw.ai/help/faq
Installs OpenClaw using the curl script with the --verbose flag enabled to provide detailed output for debugging installation issues. Supports beta and git install methods.
```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --verbose
```
```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --beta --verbose
```
```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git --verbose
```
--------------------------------
### Install Google Chrome on Linux for OpenClaw
Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting
Installs the official Google Chrome browser, which bypasses snap's AppArmor confinement issues. This is the recommended solution for OpenClaw browser control on Linux. It involves downloading the .deb package, installing it, and fixing any potential dependency errors.
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install -y  # if there are dependency errors
```
--------------------------------
### Verify OpenClaw Version and Gateway Status
Source: https://docs.openclaw.ai/gateway/troubleshooting
Use these commands to perform a diagnostic check on the OpenClaw installation and verify the current status of the gateway service during migration or setup.
```bash
openclaw --version
openclaw doctor
openclaw gateway status
```
--------------------------------
### Openclaw DNS Setup
Source: https://docs.openclaw.ai/cli/dns
Instructions for setting up Openclaw DNS, including an option to apply the configuration.
```APIDOC
## Openclaw DNS Setup
### Description
This section describes how to set up and apply the Openclaw DNS configuration.
### Method
CLI Command
### Endpoint
N/A
### Parameters
#### Command Line Arguments
- **`setup`** (command) - Required - Initiates the DNS setup process.
- **`--apply`** (flag) - Optional - Applies the configuration after setup.
### Request Example
```bash
openclaw dns setup
openclaw dns setup --apply
```
### Response
#### Success Response (200)
- **`message`** (string) - Confirmation of setup or application.
#### Response Example
```json
{
  "message": "Openclaw DNS setup complete."
}
```
```
--------------------------------
### Install Context Engine Plugin
Source: https://docs.openclaw.ai/concepts/context-engine
Commands to install a context engine plugin from a remote repository or a local development directory.
```bash
openclaw plugins install @martian-engineering/lossless-claw
openclaw plugins install -l ./my-context-engine
```
--------------------------------
### MiniMax OAuth (Coding Plan) Setup
Source: https://docs.openclaw.ai/providers/minimax
Instructions for setting up MiniMax using the Coding Plan via OAuth for a quick and API key-free integration.
```APIDOC
## MiniMax OAuth (Coding Plan) Setup
### Description
This method is recommended for a quick setup with the MiniMax Coding Plan using OAuth, eliminating the need for an API key.
### Method
CLI commands
### Endpoint
N/A (OAuth flow)
### Parameters
N/A
### Request Example
```bash
openclaw plugins enable minimax  # skip if already loaded.
openclaw gateway restart  # restart if gateway is already running
openclaw onboard --auth-choice minimax-portal
```
### Response
Upon running `openclaw onboard`, you will be prompted to select an endpoint:
* **Global** - International users (`api.minimax.io`)
* **CN** - Users in China (`api.minimaxi.com`)
### Notes
Refer to the [MiniMax plugin README](https://github.com/openclaw/openclaw/tree/main/extensions/minimax) for detailed information.
```
--------------------------------
### Install Node.js 24
Source: https://docs.openclaw.ai/install/raspberry-pi
Configures the NodeSource repository and installs Node.js version 24.
```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```
--------------------------------
### Tailscale Gateway CLI Configuration
Source: https://docs.openclaw.ai/gateway/tailscale
Command-line examples for configuring the OpenClaw Gateway with Tailscale Serve or Funnel modes. These commands simplify the setup process compared to manual JSON configuration.
```bash
openclaw gateway --tailscale serve
openclaw gateway --tailscale funnel --auth password
```
--------------------------------
### Connect Request Example
Source: https://docs.openclaw.ai/concepts/typebox
Example of the initial `connect` request frame sent by a client to establish a WebSocket connection.
```APIDOC
## POST /connect (WebSocket)
### Description
Initiates a WebSocket connection with the Gateway. This is the first message a client must send.
### Method
WebSocket Frame (Request)
### Endpoint
WebSocket Connection
### Request Body
- **type** (string) - Required - Must be "req".
- **id** (string) - Required - Unique identifier for the request.
- **method** (string) - Required - Must be "connect".
- **params** (object) - Required - Connection parameters.
  - **minProtocol** (integer) - Required - Minimum supported protocol version.
  - **maxProtocol** (integer) - Required - Maximum supported protocol version.
  - **client** (object) - Required - Client information.
    - **id** (string) - Required - Client identifier (e.g., "openclaw-macos").
    - **displayName** (string) - Required - Human-readable name for the client.
    - **version** (string) - Required - Client version.
    - **platform** (string) - Optional - Client platform information.
    - **mode** (string) - Optional - Client mode (e.g., "ui").
    - **instanceId** (string) - Optional - Unique instance identifier for the client.
### Request Example
```json
{
  "type": "req",
  "id": "c1",
  "method": "connect",
  "params": {
    "minProtocol": 2,
    "maxProtocol": 2,
    "client": {
      "id": "openclaw-macos",
      "displayName": "macos",
      "version": "1.0.0",
      "platform": "macos 15.1",
      "mode": "ui",
      "instanceId": "A1B2"
    }
  }
}
```
```
--------------------------------
### Install OpenClaw using PowerShell
Source: https://docs.openclaw.ai/start/getting-started
Installs OpenClaw using a PowerShell command. This command downloads and executes the installation script for Windows systems.
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```
--------------------------------
### Manage Gateway Service
Source: https://docs.openclaw.ai/cli
Commands to manage the Gateway service, including installation, uninstallation, starting, stopping, and restarting. It also covers checking the status of the Gateway RPC with various probing options.
```bash
gateway install
gateway uninstall
gateway start
gateway stop
gateway restart
gateway status
gateway status --no-probe
gateway status --deep
gateway status --require-rpc
gateway status --json
```
--------------------------------
### CLI Setup for OpenRouter
Source: https://docs.openclaw.ai/providers/openrouter
Command to onboard and set up the OpenRouter API key using the Openclaw CLI.
```APIDOC
## CLI setup
### Description
Use this command to set up your OpenRouter API key via the Openclaw CLI.
### Method
`openclaw onboard`
### Parameters
#### Path Parameters
None
#### Query Parameters
None
#### Request Body
None
### Request Example
```bash
openclaw onboard --auth-choice apiKey --token-provider openrouter --token "$OPENROUTER_API_KEY"
```
### Response
#### Success Response (200)
Indicates successful onboarding and configuration.
#### Response Example
None
```
--------------------------------
### Systemd Service for Auto-Starting Snap Chromium
Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting
Defines a systemd user service to automatically start the Chromium browser for OpenClaw's attach-only mode on system login. This ensures the browser is available without manual intervention. Enable and start the service using `systemctl --user` commands.
```ini
# ~/.config/systemd/user/openclaw-browser.service
[Unit]
Description=OpenClaw Browser (Chrome CDP)
After=network.target
[Service]
ExecStart=/snap/bin/chromium --headless --no-sandbox --disable-gpu --remote-debugging-port=18800 --user-data-dir=%h/.openclaw/browser/openclaw/user-data about:blank
Restart=on-failure
RestartSec=5
[Install]
WantedBy=default.target
```
--------------------------------
### Simple OpenProse Program Example
Source: https://docs.openclaw.ai/prose
An example of a simple `.prose` file demonstrating multi-agent research and synthesis with parallel execution. It defines agents, parallel tasks, and a final session to merge results.
```prose
# Research + synthesis with two agents running in parallel.
input topic: "What should we research?"
agent researcher:
  model: sonnet
  prompt: "You research thoroughly and cite sources."
agent writer:
  model: opus
  prompt: "You write a concise summary."
parallel:
  findings = session: researcher
    prompt: "Research {topic}."
  draft = session: writer
    prompt: "Summarize {topic}."
session "Merge the findings + draft into a final answer."
context: { findings, draft }
```
--------------------------------
### Install and Use Node.js with fnm
Source: https://docs.openclaw.ai/install/node
Demonstrates installing and switching to Node.js version 24 using fnm, a fast and cross-platform Node.js version manager. This is useful for managing multiple Node.js versions.
```bash
fnm install 24
fnm use 24
```
--------------------------------
### OpenClaw Channels: Add/Remove Accounts
Source: https://docs.openclaw.ai/cli/channels
Demonstrates how to add and remove chat channel accounts using the 'openclaw channels add' and 'openclaw channels remove' commands. It covers adding accounts for platforms like Telegram and Nostr with necessary authentication tokens or private keys. It also mentions the interactive wizard for guided setup and the preservation of existing configurations.
```bash
openclaw channels add --channel telegram --token <bot-token>
openclaw channels add --channel nostr --private-key "$NOSTR_PRIVATE_KEY"
openclaw channels remove --channel telegram --delete
```
--------------------------------
### Manage Google Cloud VM Instances
Source: https://docs.openclaw.ai/install/gcp
Commands to manage Google Cloud Compute Engine virtual machine instances. This includes changing the machine type and starting a VM. Ensure you have the gcloud CLI installed and authenticated.
```bash
gcloud compute instances set-machine-type openclaw-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small
```
```bash
gcloud compute instances start openclaw-gateway --zone=us-central1-a
```
--------------------------------
### Configure Kimi Coding Provider
Source: https://docs.openclaw.ai/concepts/model-providers
Example configuration for setting up Kimi Coding with an API key and default model in the OpenClaw environment.
```json5
{
  env: { KIMI_API_KEY: "sk-..." },
  agents: {
    defaults: { model: { primary: "kimi-coding/k2p5" } },
  },
}
```
--------------------------------
### Switch OpenClaw installation from npm to git
Source: https://docs.openclaw.ai/help/faq
Steps to migrate an existing npm-based installation to a source-based git installation, including building the project and updating the gateway service.
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
openclaw doctor
openclaw gateway restart
```
--------------------------------
### Install OpenClaw via Script (macOS/Linux)
Source: https://docs.openclaw.ai/help/faq
Installs OpenClaw using a curl script. Supports installing the beta version or installing from the development (git) channel. Ensure you have bash and curl installed.
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --beta
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --install-method git
```
--------------------------------
### SSH into macOS VM
Source: https://docs.openclaw.ai/install/macos-vm
Establishes an SSH connection to the macOS VM. Replace 'youruser' with the username created during the VM setup and '192.168.64.X' with the actual IP address obtained from the 'lume get' command.
```bash
ssh youruser@192.168.64.X
```
--------------------------------
### OpenClaw Configuration Example
Source: https://docs.openclaw.ai/
An example JSON configuration for OpenClaw, demonstrating how to set up channel-specific rules, such as allowing specific phone numbers for WhatsApp and requiring mentions in group chats.
```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": { "*": { "requireMention": true } },
    },
  },
  "messages": { "groupChat": { "mentionPatterns": ["@openclaw"] } },
}
```
--------------------------------
### Install OpenClaw CLI
Source: https://docs.openclaw.ai/
Installs the OpenClaw command-line interface globally using npm. This is the first step to setting up the OpenClaw gateway.
```bash
npm install -g openclaw@latest
```
--------------------------------
### Install OpenClaw Prerequisites and Repository
Source: https://docs.openclaw.ai/install/ansible
Commands to update system packages, install Ansible and Git, and clone the OpenClaw repository to the local environment.
```bash
sudo apt update && sudo apt install -y ansible git
git clone https://github.com/openclaw/openclaw-ansible.git
cd openclaw-ansible
```
--------------------------------
### Setup OpenClaw DNS
Source: https://docs.openclaw.ai/cli/dns
Initializes the DNS helper configuration. The --apply flag can be used to immediately execute the configuration changes.
```bash
openclaw dns setup
openclaw dns setup --apply
```
--------------------------------
### Workflow File Example (.lobster)
Source: https://docs.openclaw.ai/tools/lobster
An example of a Lobster workflow file defining steps for inbox triage.
```APIDOC
## Workflow files (.lobster)
Lobster can run YAML/JSON workflow files with `name`, `args`, `steps`, `env`, `condition`, and `approval` fields. In OpenClaw tool calls, set `pipeline` to the file path.
```yaml
name: inbox-triage
args:
  tag:
    default: "family"
steps:
  - id: collect
    command: inbox list --json
  - id: categorize
    command: inbox categorize --json
    stdin: $collect.stdout
  - id: approve
    command: inbox apply --approve
    stdin: $categorize.stdout
    approval: required
  - id: execute
    command: inbox apply --execute
    stdin: $categorize.stdout
    condition: $approve.approved
```
Notes:
* `stdin: $step.stdout` and `stdin: $step.json` pass a prior step’s output.
* `condition` (or `when`) can gate steps on `$step.approved`.
```
--------------------------------
### Install OpenClaw via PowerShell
Source: https://docs.openclaw.ai/install/installer
Various methods to execute the OpenClaw installation script on Windows using PowerShell. Includes options for git-based installation, custom directories, dry runs, and debugging.
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -InstallMethod git
```
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -Tag main
```
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -InstallMethod git -GitDir "C:\openclaw"
```
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -DryRun
```
```powershell
Set-PSDebug -Trace 1
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
Set-PSDebug -Trace 0
```
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```
--------------------------------
### Environment Variable Setup
Source: https://docs.openclaw.ai/tools/gemini-search
Instructions on how to set the GEMINI_API_KEY environment variable for authentication.
```APIDOC
## Environment Variable Setup for Gemini API Key
### Description
Set the `GEMINI_API_KEY` environment variable to authenticate with the Gemini API. This is an alternative to providing the API key directly in the configuration.
### Method
Environment Variable Configuration
### Endpoint
N/A
### Parameters
#### Environment Variable
- **GEMINI_API_KEY** (string) - Required - Your Gemini API key obtained from Google AI Studio.
### Usage Example
```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```
### Notes
- For gateway installations, this can be set in `~/.openclaw/.env`.
- If `GEMINI_API_KEY` is set, it will be used by default, and the `apiKey` field in the configuration can be omitted.
```
--------------------------------
### Location Get Command CLI Example
Source: https://docs.openclaw.ai/nodes/location-command
Demonstrates how to invoke the `location.get` command using the OpenClaw CLI. This command requires a specified node ID.
```bash
openclaw nodes location get --node <id>
```
--------------------------------
### Verify Docker Installation
Source: https://docs.openclaw.ai/install/hetzner
Checks if Docker and Docker Compose have been installed correctly by displaying their versions. This confirms the successful execution of the Docker installation script.
```bash
docker --version
docker compose version
```
--------------------------------
### Diffs Plugin Usage Examples
Source: https://docs.openclaw.ai/tools/diffs
Examples demonstrating how to call the diffs plugin with different input types and modes.
```APIDOC
## Input Examples
### Using `before` and `after` text
This example shows how to generate a diff using the `before` and `after` text fields, with the mode set to `"view"`.
```json
{
  "before": "# Hello\n\nOne",
  "after": "# Hello\n\nTwo",
  "path": "docs/example.md",
  "mode": "view"
}
```
### Using `patch` text
This example demonstrates generating a diff using a unified `patch` string, with the mode set to `"both"`.
```json
{
  "patch": "diff --git a/src/example.ts b/src/example.ts\n--- a/src/example.ts\n+++ b/src/example.ts\n@@ -1 +1 @@\n-const x = 1;\n+const x = 2;\n",
  "mode": "both"
}
```
```
--------------------------------
### Install signal-cli on Linux
Source: https://docs.openclaw.ai/channels/signal
Downloads and installs the latest native Linux version of signal-cli to /opt and creates a symbolic link in /usr/local/bin.
```bash
VERSION=$(curl -Ls -o /dev/null -w %{url_effective} https://github.com/AsamK/signal-cli/releases/latest | sed -e 's/^.*\/v//')
curl -L -O "https://github.com/AsamK/signal-cli/releases/download/v${VERSION}/signal-cli-${VERSION}-Linux-native.tar.gz"
sudo tar xf "signal-cli-${VERSION}-Linux-native.tar.gz" -C /opt
sudo ln -sf /opt/signal-cli /usr/local/bin/
signal-cli --version
```
--------------------------------
### Start SSH Tunnel for Remote Gateway
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme
Initiate an SSH tunnel to the remote gateway. The '-N' flag prevents remote command execution, and '&' runs the process in the background.
```bash
ssh -N remote-gateway &
```
--------------------------------
### Interactive Venice AI Onboarding
Source: https://docs.openclaw.ai/providers/venice
Launches the interactive OpenClaw setup wizard to configure Venice AI authentication and default model selection.
```bash
openclaw onboard --auth-choice venice-api-key
```
--------------------------------
### Configure Multi-platform Agent Setup
Source: https://docs.openclaw.ai/gateway/configuration-examples
Sets up the agent workspace and configures multiple communication channels like WhatsApp, Telegram, and Discord, including specific access controls for each.
```json5
{
  agent: { workspace: "~/.openclaw/workspace" },
  channels: {
    whatsapp: { allowFrom: ["+15555550123"] },
    telegram: {
      enabled: true,
      botToken: "YOUR_TOKEN",
      allowFrom: ["123456789"],
    },
    discord: {
      enabled: true,
      token: "YOUR_TOKEN",
      dm: { allowFrom: ["123456789012345678"] },
    },
  },
}
```
--------------------------------
### Switch OpenClaw installation from git to npm
Source: https://docs.openclaw.ai/help/faq
Steps to migrate from a git source checkout to a global npm package installation.
```bash
npm install -g openclaw@latest
openclaw doctor
openclaw gateway restart
```
--------------------------------
### DM and Room Policy Example
Source: https://docs.openclaw.ai/channels/matrix
Example configuration for setting DM and room policies in Matrix, including allowlist settings and group-specific configurations.
```APIDOC
## DM and room policy example
```json5
{
  "channels": {
    "matrix": {
      "dm": {
        "policy": "allowlist",
        "allowFrom": ["@admin:example.org"],
      },
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["@admin:example.org"],
      "groups": {
        "!roomid:example.org": {
          "requireMention": true,
        },
      },
    },
  },
}
```
See [Groups](/channels/groups) for mention-gating and allowlist behavior.
Pairing example for Matrix DMs:
```bash
openclaw pairing list matrix
openclaw pairing approve matrix <CODE>
```
If an unapproved Matrix user keeps messaging you before approval, OpenClaw reuses the same pending pairing code and may send a reminder reply again after a short cooldown instead of minting a new code.
See [Pairing](/channels/pairing) for the shared DM pairing flow and storage layout.
```
--------------------------------
### Example Teams Manifest
Source: https://docs.openclaw.ai/channels/msteams
A minimal, valid example of a Teams app manifest file with required fields.
```APIDOC
## Example Teams Manifest (redacted)
Minimal, valid example with the required fields. Replace IDs and URLs.
```json5
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
  "manifestVersion": "1.23",
  "version": "1.0.0",
  "id": "00000000-0000-0000-0000-000000000000",
  "name": { "short": "OpenClaw" },
  "developer": {
    "name": "Your Org",
    "websiteUrl": "https://example.com",
    "privacyUrl": "https://example.com/privacy",
    "termsOfUseUrl": "https://example.com/terms",
  },
  "description": { "short": "OpenClaw in Teams", "full": "OpenClaw in Teams" },
  "icons": { "outline": "outline.png", "color": "color.png" },
  "accentColor": "#5B6DEF",
  "bots": [
    {
      "botId": "11111111-1111-1111-1111-111111111111",
      "scopes": ["personal", "team", "groupChat"],
      "isNotificationOnly": false,
      "supportsCalling": false,
      "supportsVideo": false,
      "supportsFiles": true,
    },
  ],
  "webApplicationInfo": {
    "id": "11111111-1111-1111-1111-111111111111",
  },
  "authorization": {
    "permissions": {
      "resourceSpecific": [
        { "name": "ChannelMessage.Read.Group", "type": "Application" },
        { "name": "ChannelMessage.Send.Group", "type": "Application" },
        { "name": "Member.Read.Group", "type": "Application" },
        { "name": "Owner.Read.Group", "type": "Application" },
        { "name": "ChannelSettings.Read.Group", "type": "Application" },
        { "name": "TeamMember.Read.Group", "type": "Application" },
        { "name": "TeamSettings.Read.Group", "type": "Application" },
        { "name": "ChatMessage.Read.Chat", "type": "Application" },
      ],
    },
  },
}
```
```
--------------------------------
### Run Multiple Gateway Instances
Source: https://docs.openclaw.ai/gateway
Demonstrates how to launch multiple gateway instances on the same host by specifying unique configuration paths, state directories, and ports.
```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json OPENCLAW_STATE_DIR=~/.openclaw-a openclaw gateway --port 19001
OPENCLAW_CONFIG_PATH=~/.openclaw/b.json OPENCLAW_STATE_DIR=~/.openclaw-b openclaw gateway --port 19002
```
--------------------------------
### Install OpenClaw Gateway CLI
Source: https://docs.openclaw.ai/platforms/linux
Commands to install the OpenClaw CLI globally and onboard the Gateway service. This is the primary method for setting up the Gateway on a Linux system.
```bash
npm i -g openclaw@latest
openclaw onboard --install-daemon
```
```bash
openclaw gateway install
```
```bash
openclaw configure
```
--------------------------------
### Update System and Install Dependencies
Source: https://docs.openclaw.ai/install/raspberry-pi
Updates the package repository and installs essential build tools and utilities.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential
# Set timezone (important for cron and reminders)
sudo timedatectl set-timezone America/Chicago
```
--------------------------------
### Load macOS Launch Agent for SSH Tunnel
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme
Load the created Launch Agent into the macOS system. This command registers the agent, causing it to start automatically on subsequent logins and manage the SSH tunnel.
```bash
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.openclaw.ssh-tunnel.plist
```
--------------------------------
### Install OpenClaw from GitHub Main
Source: https://docs.openclaw.ai/install
Installs the latest version of OpenClaw directly from the main branch of the GitHub repository using npm.
```bash
npm install -g github:openclaw/openclaw#main
```
--------------------------------
### Install Node.js with Homebrew (macOS)
Source: https://docs.openclaw.ai/install/node
Installs Node.js using Homebrew, the recommended package manager for macOS. This ensures Node.js is installed and available in your system's PATH.
```bash
brew install node
```
--------------------------------
### Install Homebrew and OpenClaw dependencies
Source: https://docs.openclaw.ai/help/faq
Commands to install the Homebrew package manager on Linux and configure the shell environment to ensure installed tools are accessible.
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
brew install <formula>
```
--------------------------------
### Install Hook Packs via CLI
Source: https://docs.openclaw.ai/cli/hooks
Install hook packs using the unified plugins installer. Supports local paths, archives, and registry-based npm packages with optional version pinning.
```bash
openclaw plugins install <package>        # ClawHub first, then npm
openclaw plugins install <package> --pin  # pin version
openclaw plugins install <path>           # local path
openclaw plugins install ./my-hook-pack
openclaw plugins install ./my-hook-pack.zip
openclaw plugins install @openclaw/my-hook-pack
openclaw plugins install -l ./my-hook-pack
```
--------------------------------
### Create macOS Launch Agent for SSH Tunnel
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme
Define a macOS Launch Agent configuration file to automatically start and manage the SSH tunnel. This ensures the tunnel is active on login and restarts if it fails.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.openclaw.ssh-tunnel</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/ssh</string>
        <string>-N</string>
        <string>remote-gateway</string>
    </array>
    <key>KeepAlive</key>
    <true/>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```
--------------------------------
### Install Mattermost Plugin from Local Checkout
Source: https://docs.openclaw.ai/channels/mattermost
Installs the OpenClaw Mattermost plugin from a local git repository checkout using the OpenClaw CLI.
```bash
openclaw plugins install ./extensions/mattermost
```
--------------------------------
### Agent CLI Examples with JSON Output and Thinking Level
Source: https://docs.openclaw.ai/tools/agent-send
Demonstrates advanced usage of the agent CLI, including obtaining structured JSON output, setting the thinking level for more nuanced responses, and overriding delivery channels.
```bash
# Simple turn with JSON output
openclaw agent --to +15555550123 --message "Trace logs" --verbose on --json
# Turn with thinking level
openclaw agent --session-id 1234 --message "Summarize inbox" --thinking medium
# Deliver to a different channel than the session
openclaw agent --agent ops --message "Alert" --deliver --reply-channel telegram --reply-to "@admin"
```
--------------------------------
### Setup and Execute Gmail Webhooks
Source: https://docs.openclaw.ai/cli/webhooks
Commands to initialize and run Gmail webhook integrations. Requires an authenticated account email address to configure the Pub/Sub service.
```bash
openclaw webhooks gmail setup --account you@example.com
openclaw webhooks gmail run
```
--------------------------------
### Install Project Dependencies with pnpm
Source: https://docs.openclaw.ai/platforms/mac/dev-setup
Installs all project-wide dependencies required for development using the pnpm package manager. Ensure Node.js and pnpm are installed before running this command.
```bash
pnpm install
```
--------------------------------
### Initialize OpenClaw Onboarding via CLI
Source: https://docs.openclaw.ai/start/onboarding-overview
This command initiates the interactive onboarding wizard in the terminal. It is the recommended path for most users, supporting automated installations when the --non-interactive flag is used.
```bash
openclaw onboard
```
```bash
openclaw onboard --install-daemon
```
--------------------------------
### Install and Manage Plugin Bundles via CLI
Source: https://docs.openclaw.ai/plugins/bundles
Commands to install plugin bundles from local directories, archives, or marketplaces, and verify their status within the OpenClaw environment.
```bash
# Local directory
openclaw plugins install ./my-bundle
# Archive
openclaw plugins install ./my-bundle.tgz
# Claude marketplace
openclaw plugins marketplace list <marketplace-name>
openclaw plugins install <plugin-name>@<marketplace-name>
```
--------------------------------
### Web Search Examples
Source: https://docs.openclaw.ai/tools/web
Code examples demonstrating how to use the web search tool for various search queries and configurations.
```APIDOC
## Examples
```javascript
// Basic search
await web_search({ query: "OpenClaw plugin SDK" });
// German-specific search
await web_search({ query: "TV online schauen", country: "DE", language: "de" });
// Recent results (past week)
await web_search({ query: "AI developments", freshness: "week" });
// Date range
await web_search({
  query: "climate research",
  date_after: "2024-01-01",
  date_before: "2024-06-30",
});
// Domain filtering (Perplexity only)
await web_search({
  query: "product reviews",
  domain_filter: ["-reddit.com", "-pinterest.com"],
});
```
```
--------------------------------
### Start OpenClaw Gateway
Source: https://docs.openclaw.ai/platforms/android
Starts the OpenClaw Gateway service on the host machine to listen for incoming node connections.
```bash
openclaw gateway --port 18789 --verbose
```
--------------------------------
### Authenticate OpenClaw with Anthropic Setup Token
Source: https://docs.openclaw.ai/providers/anthropic
These commands demonstrate how to authenticate OpenClaw with Anthropic using a setup token. The first command is run on the gateway host, while the second is used if the token was generated on a different machine. Both require the Anthropic provider and the setup token as input.
```bash
openclaw models auth setup-token --provider anthropic
```
```bash
openclaw models auth paste-token --provider anthropic
```
--------------------------------
### Provisioning and Managing exe.dev VMs
Source: https://docs.openclaw.ai/install/exe-dev
Commands to create a new virtual machine on exe.dev and connect to it via SSH.
```bash
ssh exe.dev new
ssh <vm-name>.exe.xyz
```
--------------------------------
### Tune Session Maintenance for Large Installs
Source: https://docs.openclaw.ai/concepts/session
This JSON configuration provides an example of tuning session maintenance for larger installations. It enforces cleanup, prunes entries after 14 days, caps entries at 2000, rotates session files at 25MB, sets a maximum disk size of 2GB, and a high water mark at 1.6GB. This policy balances session data retention with storage management for high-volume scenarios.
```json
{
  "session": {
    "maintenance": {
      "mode": "enforce",
      "pruneAfter": "14d",
      "maxEntries": 2000,
      "rotateBytes": "25mb",
      "maxDiskBytes": "2gb",
      "highWaterBytes": "1.6gb"
    }
  }
}
```
--------------------------------
### Install Voice Call Plugin
Source: https://docs.openclaw.ai/plugins/voice-call
Commands to install the OpenClaw voice-call plugin via npm or from a local development folder. Ensure the Gateway is restarted after installation.
```bash
openclaw plugins install @openclaw/voice-call
```
```bash
openclaw plugins install ./extensions/voice-call
cd ./extensions/voice-call && pnpm install
```
--------------------------------
### POST /start
Source: https://docs.openclaw.ai/tools/browser
Starts the browser session managed by the OpenClaw Gateway.
```APIDOC
## POST /start
### Description
Starts the browser session managed by the OpenClaw Gateway.
### Method
POST
### Endpoint
/start
### Parameters
#### Query Parameters
- **profile** (string) - Optional - The name of the browser profile to use.
### Request Example
POST /start?profile=default
### Response
#### Success Response (200)
- **status** (string) - Confirmation of the browser start status.
#### Response Example
{
  "status": "started"
}
```
--------------------------------
### Define Skill Installer Specifications
Source: https://docs.openclaw.ai/tools/skills
Configures automated installation paths for external dependencies, such as Homebrew formulas, to ensure required binaries are available for the skill.
```markdown
---
name: gemini
description: Use Gemini CLI for coding assistance and Google search lookups.
metadata:
  {
    "openclaw":
      {
        "emoji": "♊️",
        "requires": { "bins": ["gemini"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "gemini-cli",
              "bins": ["gemini"],
              "label": "Install Gemini CLI (brew)",
            },
          ],
      },
  }
---
```
--------------------------------
### Manually Start Snap Chromium for OpenClaw
Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting
Manually launches a Chromium browser instance with specific flags required for OpenClaw's attach-only mode. This command ensures the browser is running with the necessary remote debugging port and user data directory.
```bash
chromium-browser --headless --no-sandbox --disable-gpu \
  --remote-debugging-port=18800 \
  --user-data-dir=$HOME/.openclaw/browser/openclaw/user-data \
  about:blank &
```
--------------------------------
### Onboard Model Studio Standard Plan
Source: https://docs.openclaw.ai/providers/modelstudio
Commands to initialize the Model Studio provider using the pay-as-you-go Standard plan for either China or Global regions.
```bash
# China endpoint
openclaw onboard --auth-choice modelstudio-standard-api-key-cn
# Global/Intl endpoint
openclaw onboard --auth-choice modelstudio-standard-api-key
```
--------------------------------
### Install OpenClaw inside WSL (Bash)
Source: https://docs.openclaw.ai/platforms/windows
Steps to clone the OpenClaw repository, install its dependencies using pnpm, build the project, and onboard the application within the WSL environment. This assumes WSL2 with systemd enabled is already set up.
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build # auto-installs UI deps on first run
pnpm build
openclaw onboard
```
--------------------------------
### Install OpenClaw and Daemon
Source: https://docs.openclaw.ai/install/macos-vm
Installs the latest version of OpenClaw globally within the macOS VM using npm and then initiates the onboard process to install the OpenClaw daemon. This prepares OpenClaw for use and background operation.
```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```
--------------------------------
### Install Node.js on Fedora/RHEL
Source: https://docs.openclaw.ai/install/node
Installs Node.js on Fedora and RHEL-based systems using the DNF package manager. This command directly installs the nodejs package from the system's default repositories.
```bash
sudo dnf install nodejs
```
--------------------------------
### Start OpenClaw Gateway
Source: https://docs.openclaw.ai/channels/slack
Command to initialize the OpenClaw gateway process.
```bash
openclaw gateway
```
--------------------------------
### Install claude-max-api-proxy
Source: https://docs.openclaw.ai/providers/claude-max-api-proxy
Installs the claude-max-api-proxy globally using npm. Requires Node.js 20+ and the Claude Code CLI to be installed and authenticated.
```bash
# Requires Node.js 20+ and Claude Code CLI
npm install -g claude-max-api-proxy
# Verify Claude CLI is authenticated
claude --version
```
--------------------------------
### Using the /card Command for Flex Messages
Source: https://docs.openclaw.ai/channels/line
This example shows how to use the convenience `/card` command to quickly generate LINE Flex messages.
```APIDOC
## Using the /card Command
### Description
The `/card` command provides a shortcut for creating predefined LINE Flex messages.
### Command
`/card <type> <title> [subtitle]`
### Parameters
- **type** (string) - Required - The type of card to create (e.g., "info").
- **title** (string) - Required - The main title of the card.
- **subtitle** (string) - Optional - A subtitle or description for the card.
### Example
```
/card info "Welcome" "Thanks for joining!"
```
### Result
This command generates a Flex Message payload that can be sent via the channel data.
```
--------------------------------
### Verify Lume Installation
Source: https://docs.openclaw.ai/install/macos-vm
Checks if the Lume command-line tool is installed and accessible by displaying its version. This is a verification step after installation or PATH modification.
```bash
lume --version
```
--------------------------------
### Sandbox Configuration Reference
Source: https://docs.openclaw.ai/gateway/sandboxing
Details on configuring the sandbox environment, including setup commands and execution context.
```APIDOC
## Configuration: Sandbox Setup
### Description
Defines the one-time setup command executed within the sandbox container upon creation. This is used for environment preparation such as package installation.
### Parameters
#### Configuration Paths
- **agents.defaults.sandbox.docker.setupCommand** (string) - Global default setup command.
- **agents.list[].sandbox.docker.setupCommand** (string) - Per-agent specific setup command.
### Implementation Notes
- Executes via `sh -lc`.
- Ensure `docker.network` allows egress if installing packages.
- Set `readOnlyRoot: false` if the setup command requires filesystem writes.
### Request Example
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "non-main",
        "scope": "session",
        "workspaceAccess": "none"
      }
    }
  }
}
```
--------------------------------
### Install and Enable ACPX Plugin (Bash)
Source: https://docs.openclaw.ai/tools/acp-agents
These bash commands demonstrate how to install the ACPX plugin for OpenClaw and then enable it via the configuration. This is the standard procedure for integrating the ACPX backend.
```bash
openclaw plugins install acpx
openclaw config set plugins.entries.acpx.enabled true
```
--------------------------------
### Install and Configure Tailscale for Remote Access
Source: https://docs.openclaw.ai/help/faq
Commands to install Tailscale on a Linux VPS and initiate the connection to a tailnet, enabling secure remote access to the gateway.
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```
--------------------------------
### Agent Runtime Helpers: Identity, Directories, and Session Management
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Provides examples of using api.runtime.agent helpers to manage agent identity, resolve directory paths (working directory, workspace), get default settings like thinking level and timeout, ensure workspace existence, and run embedded agents. It also covers session store operations like resolving paths, loading, saving, and managing session files.
```typescript
// Resolve the agent's working directory
const agentDir = api.runtime.agent.resolveAgentDir(cfg);
// Resolve agent workspace
const workspaceDir = api.runtime.agent.resolveAgentWorkspaceDir(cfg);
// Get agent identity
const identity = api.runtime.agent.resolveAgentIdentity(cfg);
// Get default thinking level
const thinking = api.runtime.agent.resolveThinkingDefault(cfg, provider, model);
// Get agent timeout
const timeoutMs = api.runtime.agent.resolveAgentTimeoutMs(cfg);
// Ensure workspace exists
await api.runtime.agent.ensureAgentWorkspace(cfg);
// Run an embedded Pi agent
const agentDir = api.runtime.agent.resolveAgentDir(cfg);
const result = await api.runtime.agent.runEmbeddedPiAgent({
  sessionId: "my-plugin:task-1",
  runId: crypto.randomUUID(),
  sessionFile: path.join(agentDir, "sessions", "my-plugin-task-1.jsonl"),
  workspaceDir: api.runtime.agent.resolveAgentWorkspaceDir(cfg),
  prompt: "Summarize the latest changes",
  timeoutMs: api.runtime.agent.resolveAgentTimeoutMs(cfg),
});
```
```typescript
const storePath = api.runtime.agent.session.resolveStorePath(cfg);
const store = api.runtime.agent.session.loadSessionStore(cfg);
await api.runtime.agent.session.saveSessionStore(cfg, store);
const filePath = api.runtime.agent.session.resolveSessionFilePath(cfg, sessionId);
```
--------------------------------
### CLI Setup for Xiaomi MiMo API Key
Source: https://docs.openclaw.ai/providers/xiaomi
Command-line interface commands to onboard the Xiaomi MiMo provider using an API key. This can be done interactively or non-interactively by providing the API key directly.
```bash
openclaw onboard --auth-choice xiaomi-api-key
# or non-interactive
openclaw onboard --auth-choice xiaomi-api-key --xiaomi-api-key "$XIAOMI_API_KEY"
```
--------------------------------
### Install Opik Plugin
Source: https://docs.openclaw.ai/plugins/community
Installs the '@opik/opik-openclaw' plugin, the official OpenClaw plugin for exporting agent traces to Opik. This allows monitoring agent behavior, cost, tokens, and errors.
```bash
openclaw plugins install @opik/opik-openclaw
```
--------------------------------
### Onboard BlueBubbles via CLI
Source: https://docs.openclaw.ai/channels/bluebubbles
Command to initiate the BlueBubbles onboarding process. It prompts for server URL, password, and optional webhook path and DM policy.
```bash
openclaw onboard
```
--------------------------------
### Install Node.js LTS with Chocolatey (Windows)
Source: https://docs.openclaw.ai/install/node
Installs the Node.js LTS version on Windows using the Chocolatey package manager. This provides an alternative to winget for managing Node.js installations.
```powershell
choco install nodejs-lts
```
--------------------------------
### Onboard Ollama with OpenClaw CLI
Source: https://docs.openclaw.ai/providers/ollama
Initiates the OpenClaw onboarding process, guiding the user to select and configure Ollama as a local LLM provider. Supports interactive and non-interactive modes, with options for custom base URLs and models.
```bash
openclaw onboard
```
```bash
openclaw onboard --non-interactive \
  --auth-choice ollama \
  --accept-risk
```
```bash
openclaw onboard --non-interactive \
  --auth-choice ollama \
  --custom-base-url "http://ollama-host:11434" \
  --custom-model-id "qwen3.5:27b" \
  --accept-risk
```
--------------------------------
### Install and test OpenClaw plugins
Source: https://docs.openclaw.ai/plugins/building-plugins
Commands to install external plugins via the CLI and run tests for local in-repo plugins.
```bash
openclaw plugins install @myorg/openclaw-my-plugin
```
```bash
pnpm test -- extensions/my-plugin/
```
--------------------------------
### Configure OpenClaw to Use Google Chrome
Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting
Updates the OpenClaw configuration file to point to the installed Google Chrome executable. This enables OpenClaw's browser control features using the recommended browser. Ensure the `executablePath` is correct for your system.
```json
{
  "browser": {
    "enabled": true,
    "executablePath": "/usr/bin/google-chrome-stable",
    "headless": true,
    "noSandbox": true
  }
}
```
--------------------------------
### Install OpenClaw Plugins
Source: https://docs.openclaw.ai/automation/hooks
Command to install a hook pack using the OpenClaw CLI. It accepts a path or a registry specifier.
```bash
openclaw plugins install <path-or-spec>
```
--------------------------------
### Rich OpenClaw Plugin Manifest Example (JSON)
Source: https://docs.openclaw.ai/plugins/manifest
An extensive `openclaw.plugin.json` example showcasing various fields for detailed plugin configuration, including name, version, provider information, authentication methods, UI hints, and a comprehensive config schema.
```json
{
  "id": "openrouter",
  "name": "OpenRouter",
  "description": "OpenRouter provider plugin",
  "version": "1.0.0",
  "providers": ["openrouter"],
  "cliBackends": ["openrouter-cli"],
  "providerAuthEnvVars": {
    "openrouter": ["OPENROUTER_API_KEY"]
  },
  "providerAuthChoices": [
    {
      "provider": "openrouter",
      "method": "api-key",
      "choiceId": "openrouter-api-key",
      "choiceLabel": "OpenRouter API key",
      "groupId": "openrouter",
      "groupLabel": "OpenRouter",
      "optionKey": "openrouterApiKey",
      "cliFlag": "--openrouter-api-key",
      "cliOption": "--openrouter-api-key <key>",
      "cliDescription": "OpenRouter API key",
      "onboardingScopes": ["text-inference"]
    }
  ],
  "uiHints": {
    "apiKey": {
      "label": "API key",
      "placeholder": "sk-or-v1-ப்படாத",
      "sensitive": true
    }
  },
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "apiKey": {
        "type": "string"
      }
    }
  }
}
```
--------------------------------
### Installing Prerequisites on Ubuntu
Source: https://docs.openclaw.ai/install/exe-dev
System commands to update package lists and install essential dependencies like git, curl, and jq required for OpenClaw.
```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```
--------------------------------
### OpenClaw Onboarding with LiteLLM
Source: https://docs.openclaw.ai/providers/litellm
Initiate the onboarding process for LiteLLM integration with OpenClaw using the command-line interface.
```APIDOC
## OpenClaw Onboarding with LiteLLM
### Description
Initiates the onboarding process for LiteLLM integration with OpenClaw.
### Method
CLI Command
### Endpoint
N/A
### Parameters
None
### Request Example
```bash
openclaw onboard --auth-choice litellm-api-key
```
### Response
N/A
```
--------------------------------
### Configure Safe Bins and Profiles (JSON5)
Source: https://docs.openclaw.ai/tools/exec-approvals
Example JSON5 configuration for OpenClaw's `safeBins` and `safeBinProfiles`. This demonstrates how to specify executables for safe bin usage and define custom profiles to control their arguments and behavior. Note that `jq` is included in `safeBins`, but its use with potentially sensitive commands like `env` is still restricted without explicit allowlisting.
```json5
{
  tools: {
    exec: {
      safeBins: ["jq", "myfilter"],
      safeBinProfiles: {
        myfilter: {
          minPositional: 0,
          maxPositional: 0,
          allowedValueFlags: ["-n", "--limit"],
          deniedFlags: ["-f", "--file", "-c", "--command"],
        },
      },
    },
  },
}
```
--------------------------------
### Run Dockerized Onboarding E2E Test
Source: https://docs.openclaw.ai/reference/test
Executes a full cold-start onboarding flow within a clean Linux container. This script simulates the interactive wizard, verifies essential configuration and session files, and then starts the gateway to run an `openclaw health` check. It is intended for containerized onboarding smoke tests.
```bash
scripts/e2e/onboard-docker.sh
```
--------------------------------
### Create and Configure GCP Project
Source: https://docs.openclaw.ai/install/gcp
Creates a new GCP project, sets it as the active configuration, and enables the Compute Engine API required for VM management.
```bash
gcloud projects create my-openclaw-project --name="OpenClaw Gateway"
gcloud config set project my-openclaw-project
gcloud services enable compute.googleapis.com
```
--------------------------------
### Configure VM Resources and Quotas
Source: https://docs.openclaw.ai/install/azure
Sets VM sizing parameters and provides commands to query available VM SKUs and current subscription usage quotas.
```bash
VM_SIZE="Standard_B2as_v2"
OS_DISK_SIZE_GB=64
az vm list-skus --location "${LOCATION}" --resource-type virtualMachines -o table
az vm list-usage --location "${LOCATION}" -o table
```
--------------------------------
### Openclaw AI Recommended Starter Configuration (JSON5)
Source: https://docs.openclaw.ai/gateway/configuration-examples
A recommended starter configuration for Openclaw AI, including identity settings, a primary model, and more detailed channel configurations like WhatsApp group settings.
```json5
{
  identity: {
    name: "Clawd",
    theme: "helpful assistant",
    emoji: "🦞",
  },
  agent: {
    workspace: "~/.openclaw/workspace",
    model: { primary: "anthropic/claude-sonnet-4-6" },
  },
  channels: {
    whatsapp: {
      allowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },
  },
}
```
--------------------------------
### Install Openclaw Node Host as a Service (Bash)
Source: https://docs.openclaw.ai/cli/node
Command to install and run the Openclaw node host as a background service. It supports specifying the gateway host, port, TLS, and runtime environment.
```bash
openclaw node install --host <gateway-host> --port 18789
```
--------------------------------
### Tick Event Example
Source: https://docs.openclaw.ai/concepts/typebox
Example of a `tick` event frame sent by the Gateway to clients.
```APIDOC
## Event: tick
### Description
Server-sent event indicating a regular time-based update or heartbeat.
### Method
WebSocket Frame (Event)
### Endpoint
WebSocket Connection
### Response
#### Event Payload
- **type** (string) - Description: Must be "event".
- **event** (string) - Description: Must be "tick".
- **payload** (object) - Description: Event-specific data.
  - **ts** (integer) - Description: Timestamp of the tick event (Unix epoch seconds).
- **seq** (integer) - Optional - Sequence number for the event.
- **stateVersion** (object) - Optional - Version information for different state components.
### Response Example
```json
{ "type": "event", "event": "tick", "payload": { "ts": 1730000000 }, "seq": 12 }
```
```
--------------------------------
### Initialize Azure CLI and SSH Extension
Source: https://docs.openclaw.ai/install/azure
Authenticates the user with Azure and installs the required SSH extension to enable native tunneling via Azure Bastion.
```bash
az login
az extension add -n ssh
```
--------------------------------
### Onboard OpenClaw with LiteLLM API Key
Source: https://docs.openclaw.ai/providers/litellm
Initiates the onboarding process for OpenClaw, specifically choosing the LiteLLM API key authentication method.
```bash
openclaw onboard --auth-choice litellm-api-key
```
--------------------------------
### Mattermost Multi-Account Configuration
Source: https://docs.openclaw.ai/channels/mattermost
Example configuration for setting up multiple Mattermost accounts.
```APIDOC
## Multi-Account
Mattermost supports configuring multiple accounts under `channels.mattermost.accounts`.
```json
{
  "channels": {
    "mattermost": {
      "accounts": {
        "default": {"name": "Primary", "botToken": "mm-token", "baseUrl": "https://chat.example.com"},
        "alerts": {"name": "Alerts", "botToken": "mm-token-2", "baseUrl": "https://alerts.example.com"}
      }
    }
  }
}
```
```
--------------------------------
### CLI Poll Creation Examples
Source: https://docs.openclaw.ai/automation/poll
Examples of creating polls using the Openclaw CLI for different supported channels.
```APIDOC
## CLI Poll Creation Examples
This section provides examples of how to create polls using the Openclaw CLI for various messaging platforms.
### Telegram
```bash
# Basic poll
openclaw message poll --channel telegram --target 123456789 \
  --poll-question "Ship it?" --poll-option "Yes" --poll-option "No"
# Poll in a specific topic with duration
openclaw message poll --channel telegram --target -1001234567890:topic:42 \
  --poll-question "Pick a time" --poll-option "10am" --poll-option "2pm" \
  --poll-duration-seconds 300
```
### WhatsApp
```bash
# Poll with multiple options
openclaw message poll --target +15555550123 \
  --poll-question "Lunch today?" --poll-option "Yes" --poll-option "No" --poll-option "Maybe"
# Poll allowing multiple selections
openclaw message poll --target 123456789@g.us \
  --poll-question "Meeting time?" --poll-option "10am" --poll-option "2pm" --poll-option "4pm" --poll-multi
```
### Discord
```bash
# Basic poll in a channel
openclaw message poll --channel discord --target channel:123456789 \
  --poll-question "Snack?" --poll-option "Pizza" --poll-option "Sushi"
# Poll with a duration and multi-select enabled
openclaw message poll --channel discord --target channel:123456789 \
  --poll-question "Plan?" --poll-option "A" --poll-option "B" --poll-duration-hours 48
```
### Microsoft Teams
```bash
# Poll in a conversation thread
openclaw message poll --channel msteams --target conversation:19:abc@thread.tacv2 \
  --poll-question "Lunch?" --poll-option "Pizza" --poll-option "Sushi"
```
### CLI Options
*   `--channel`: Specifies the messaging channel (`whatsapp` (default), `telegram`, `discord`, or `msteams`).
*   `--poll-multi`: Allows users to select multiple options (behavior varies by channel).
*   `--poll-duration-hours`: Sets poll duration in hours (Discord-only, defaults to 24).
*   `--poll-duration-seconds`: Sets poll duration in seconds (Telegram-only, 5-600 seconds).
*   `--poll-anonymous` / `--poll-public`: Sets poll visibility (Telegram-only).
```
--------------------------------
### Onboard to Cloudflare AI Gateway (Interactive)
Source: https://docs.openclaw.ai/providers/cloudflare-ai-gateway
Initiates the onboarding process for the Cloudflare AI Gateway using an interactive command-line interface. This command prompts the user for necessary authentication details.
```bash
openclaw onboard --auth-choice cloudflare-ai-gateway-api-key
```
--------------------------------
### Install WSL2 and Ubuntu (PowerShell)
Source: https://docs.openclaw.ai/platforms/windows
Commands to install the Windows Subsystem for Linux (WSL2) and a specific Linux distribution, Ubuntu-24.04, using PowerShell as an administrator. This is the initial step for setting up a Linux environment within Windows.
```powershell
wsl --install
# Or pick a distro explicitly:
wsl --list --online
wsl --install -d Ubuntu-24.04
```
--------------------------------
### Install and Update OpenClaw Skills
Source: https://docs.openclaw.ai/help/faq
Commands to install a specific skill by its slug and to update all installed skills. These commands are essential for managing the skill set available to the OpenClaw agent.
```bash
openclaw skills install <skill-slug>
openclaw skills update --all
```
--------------------------------
### Non-Interactive Gateway Token Onboarding
Source: https://docs.openclaw.ai/cli/onboard
Provides examples for configuring gateway tokens in non-interactive mode, using either plaintext tokens or environment variable references for security. It highlights mutual exclusivity and requirements for token configuration.
```bash
export OPENCLAW_GATEWAY_TOKEN="your-token"
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice skip \
  --gateway-auth token \
  --gateway-token-ref-env OPENCLAW_GATEWAY_TOKEN \
  --accept-risk
```
--------------------------------
### Install LINE Plugin for OpenClaw
Source: https://docs.openclaw.ai/channels/line
Commands to install the LINE plugin for OpenClaw, either from the official registry or a local git repository.
```bash
openclaw plugins install @openclaw/line
```
```bash
openclaw plugins install ./extensions/line
```
--------------------------------
### Install New Skills with ClawHub CLI
Source: https://docs.openclaw.ai/tools/clawhub
Shows how to install a new skill pack from the ClawHub registry. This is a fundamental command for adding functionality to your OpenClaw environment.
```bash
clawhub install my-skill-pack
```
--------------------------------
### LiteLLM Configuration File
Source: https://docs.openclaw.ai/providers/litellm
Example JSON configuration file for LiteLLM, specifying providers and models.
```APIDOC
## LiteLLM Configuration File
### Description
Example JSON configuration file for LiteLLM, specifying providers, models, and default agent settings.
### Method
Configuration File (JSON)
### Endpoint
N/A
### Parameters
None
### Request Example
```json
{
  "models": {
    "providers": {
      "litellm": {
        "baseUrl": "http://localhost:4000",
        "apiKey": "${LITELLM_API_KEY}",
        "api": "openai-completions",
        "models": [
          {
            "id": "claude-opus-4-6",
            "name": "Claude Opus 4.6",
            "reasoning": true,
            "input": ["text", "image"],
            "contextWindow": 200000,
            "maxTokens": 64000
          },
          {
            "id": "gpt-4o",
            "name": "GPT-4o",
            "reasoning": false,
            "input": ["text", "image"],
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {"primary": "litellm/claude-opus-4-6"}
    }
  }
}
```
### Response
N/A
```
--------------------------------
### Install Lume Script
Source: https://docs.openclaw.ai/install/macos-vm
This script installs the Lume tool, which is used for managing macOS VMs. It downloads and executes the installation script from the official CUA repository. Ensure your environment is prepared for script execution.
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/trycua/cua/main/libs/lume/scripts/install.sh)"
```
--------------------------------
### POST /plugins/install
Source: https://docs.openclaw.ai/plugins/building-plugins
Installs a plugin package from ClawHub or npm into the OpenClaw environment.
```APIDOC
## POST /plugins/install
### Description
Installs a plugin package by name. The system first searches ClawHub and falls back to npm if the package is not found.
### Method
POST
### Endpoint
openclaw plugins install <package-name>
### Parameters
#### Path Parameters
- **package-name** (string) - Required - The name of the npm package or ClawHub plugin to install.
### Request Example
openclaw plugins install @myorg/openclaw-my-plugin
### Response
#### Success Response (200)
- **status** (string) - Confirmation of successful installation.
```
--------------------------------
### Install Nostr Plugin via CLI
Source: https://docs.openclaw.ai/channels/nostr
Commands to install the Nostr plugin either from the registry or a local development path.
```bash
openclaw plugins install @openclaw/nostr
```
```bash
openclaw plugins install --link <path-to-openclaw>/extensions/nostr
```
--------------------------------
### Install Zalo Plugin via CLI
Source: https://docs.openclaw.ai/channels/zalo
Commands to install the Zalo plugin into the OpenClaw environment. Users can install from the official registry or a local source directory.
```bash
# Install from registry
openclaw plugins install @openclaw/zalo
# Install from local source
openclaw plugins install ./extensions/zalo
```
--------------------------------
### Openclaw AI Configuration Example (JSON5)
Source: https://docs.openclaw.ai/gateway/configuration-examples
An extensive example of an Openclaw AI configuration file using JSON5 syntax. This configuration covers environment variables, authentication profiles, identity settings, logging preferences, message formatting, routing and queue management, tool configurations for audio and video processing, session behavior, and detailed settings for various communication channels (WhatsApp, Telegram, Discord, Slack). It also includes agent runtime defaults and model configurations.
```json5
theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  // Environment + shell
  env: {
    OPENROUTER_API_KEY: "sk-or-.",
    vars: {
      GROQ_API_KEY: "gsk-.",
    },
    shellEnv: {
      enabled: true,
      timeoutMs: 15000,
    },
  },
  // Auth profile metadata (secrets live in auth-profiles.json)
  auth: {
    profiles: {
      "anthropic:me@example.com": {
        provider: "anthropic",
        mode: "oauth",
        email: "me@example.com",
      },
      "anthropic:work": { provider: "anthropic", mode: "api_key" },
      "openai:default": { provider: "openai", mode: "api_key" },
      "openai-codex:default": { provider: "openai-codex", mode: "oauth" },
    },
    order: {
      anthropic: ["anthropic:me@example.com", "anthropic:work"],
      openai: ["openai:default"],
      "openai-codex": ["openai-codex:default"],
    },
  },
  // Identity
  identity: {
    name: "Samantha",
    theme: "helpful sloth",
    emoji: "🦥",
  },
  // Logging
  logging: {
    level: "info",
    file: "/tmp/openclaw/openclaw.log",
    consoleLevel: "info",
    consoleStyle: "pretty",
    redactSensitive: "tools",
  },
  // Message formatting
  messages: {
    messagePrefix: "[openclaw]",
    responsePrefix: ">",
    ackReaction: "👀",
    ackReactionScope: "group-mentions",
  },
  // Routing + queue
  routing: {
    groupChat: {
      mentionPatterns: ["@openclaw", "openclaw"],
      historyLimit: 50,
    },
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,
      drop: "summarize",
      byChannel: {
        whatsapp: "collect",
        telegram: "collect",
        discord: "collect",
        slack: "collect",
        signal: "collect",
        imessage: "collect",
        webchat: "collect",
      },
    },
  },
  // Tooling
  tools: {
    media: {
      audio: {
        enabled: true,
        maxBytes: 20971520,
        models: [
          { provider: "openai", model: "gpt-4o-mini-transcribe" },
          // Optional CLI fallback (Whisper binary):
          // { type: "cli", command: "whisper", args: ["--model", "base", "{{MediaPath}}"] }
        ],
        timeoutSeconds: 120,
      },
      video: {
        enabled: true,
        maxBytes: 52428800,
        models: [{ provider: "google", model: "gemini-3-flash-preview" }],
      },
    },
  },
  // Session behavior
  session: {
    scope: "per-sender",
    reset: {
      mode: "daily",
      atHour: 4,
      idleMinutes: 60,
    },
    resetByChannel: {
      discord: { mode: "idle", idleMinutes: 10080 },
    },
    resetTriggers: ["/new", "/reset"],
    store: "~/.openclaw/agents/default/sessions/sessions.json",
    maintenance: {
      mode: "warn",
      pruneAfter: "30d",
      maxEntries: 500,
      rotateBytes: "10mb",
      resetArchiveRetention: "30d", // duration or false
      maxDiskBytes: "500mb", // optional
      highWaterBytes: "400mb", // optional (defaults to 80% of maxDiskBytes)
    },
    typingIntervalSeconds: 5,
    sendPolicy: {
      default: "allow",
      rules: [{ action: "deny", match: { channel: "discord", chatType: "group" } }],
    },
  },
  // Channels
  channels: {
    whatsapp: {
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },
    telegram: {
      enabled: true,
      botToken: "YOUR_TELEGRAM_BOT_TOKEN",
      allowFrom: ["123456789"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["123456789"],
      groups: { "*": { requireMention: true } },
    },
    discord: {
      enabled: true,
      token: "YOUR_DISCORD_BOT_TOKEN",
      dm: { enabled: true, allowFrom: ["123456789012345678"] },
      guilds: {
        "123456789012345678": {
          slug: "friends-of-openclaw",
          requireMention: false,
          channels: {
            general: { allow: true },
            help: { allow: true, requireMention: true },
          },
        },
      },
    },
    slack: {
      enabled: true,
      botToken: "xoxb-REPLACE_ME",
      appToken: "xapp-REPLACE_ME",
      channels: {
        "#general": { allow: true, requireMention: true },
      },
      dm: { enabled: true, allowFrom: ["U123"] },
      slashCommand: {
        enabled: true,
        name: "openclaw",
        sessionPrefix: "slack:slash",
        ephemeral: true,
      },
    },
  },
  // Agent runtime
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace",
      userTimezone: "America/Chicago",
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: ["anthropic/claude-opus-4-6", "openai/gpt-5.2"],
      },
      imageModel: {
        primary: "openrouter/anthropic/claude-sonnet-4-6",
      },
      models: {
        "anthropic/claude-opus-4-6": { alias: "opus" },
      }
    }
  }
}
```
--------------------------------
### Anthropic Model Authentication Setup
Source: https://docs.openclaw.ai/cli
Commands to set up authentication tokens for Anthropic models. This includes setting up tokens via the CLI and checking the status of model authentication.
```bash
claude setup-token
openclaw models auth setup-token --provider anthropic
openclaw models status
```
--------------------------------
### Update Plugin
Source: https://docs.openclaw.ai/cli/plugins
Updates tracked plugin installs and hook-pack installs.
```APIDOC
## Update Plugin
### Description
Updates tracked installs in `plugins.installs` and tracked hook-pack installs in `hooks.internal.installs`. When a plugin ID is provided, OpenClaw reuses the recorded install spec. For npm installs, an explicit npm package spec can be provided. OpenClaw resolves the package name, updates the plugin, and records the new npm spec. A warning is issued if the fetched artifact hash differs from a stored integrity hash, requiring confirmation unless `--yes` is used.
### Method
CLI Command
### Endpoint
N/A (CLI command)
### Parameters
#### Path Parameters
- **id-or-npm-spec** (string) - Required - The ID of the plugin or an npm package specifier (e.g., `@openclaw/voice-call@beta`).
#### Query Parameters
- **--all** (boolean) - Optional - Updates all tracked plugins.
- **--dry-run** (boolean) - Optional - Simulate the update process without making changes.
- **--yes** (boolean) - Optional - Bypass confirmation prompts in non-interactive runs (e.g., CI).
### Request Example
```bash
openclaw plugins update <id-or-npm-spec>
openclaw plugins update --all
openclaw plugins update <id-or-npm-spec> --dry-run
openclaw plugins update @openclaw/voice-call@beta
```
### Response
(CLI output indicating the status of the update operation.)
#### Success Response (200)
(Indication that the plugin(s) were successfully updated.)
#### Response Example
(Example CLI output showing a successful update)
```
--------------------------------
### OpenClaw Onboarding Shortcut
Source: https://docs.openclaw.ai/gateway/authentication
A shortcut command for onboarding OpenClaw with a specific authentication choice, such as Anthropic CLI. This simplifies the initial setup process for users who prefer this authentication method.
```bash
openclaw onboard --auth-choice anthropic-cli
```
--------------------------------
### Sync and Backup Multiple Skills using ClawHub CLI
Source: https://docs.openclaw.ai/tools/clawhub
Demonstrates how to scan local skill directories and publish new or updated skills to the registry. The `--all` flag uploads everything without prompts.
```bash
clawhub sync --all
```
--------------------------------
### Generate Anthropic Setup Token with Claude CLI
Source: https://docs.openclaw.ai/providers/anthropic
This command generates a setup token using the Claude Code CLI. This token is essential for authenticating with Anthropic services within OpenClaw. No specific inputs are required, and the output is the setup token itself.
```bash
claude setup-token
```
--------------------------------
### POST /gateway
Source: https://docs.openclaw.ai/cli
Starts the WebSocket Gateway service.
```APIDOC
## POST /gateway
### Description
Initializes and runs the WebSocket Gateway for external communication.
### Method
POST
### Endpoint
gateway
### Parameters
#### Request Body
- **port** (integer) - Optional - Port to bind the gateway to
- **auth** (string) - Optional - Authentication method (token or password)
- **dev** (boolean) - Optional - Enable development mode
### Request Example
openclaw gateway --port 8080 --auth token
### Response
#### Success Response (200)
- **status** (string) - Gateway running status
```
--------------------------------
### Install Feishu Plugin for OpenClaw
Source: https://docs.openclaw.ai/channels/feishu
Installs the Feishu plugin for OpenClaw. This is required if your OpenClaw release does not include it bundled.
```bash
openclaw plugins install @openclaw/feishu
```
--------------------------------
### POST /node/run
Source: https://docs.openclaw.ai/nodes
Start a remote node host to execute commands on a secondary machine.
```APIDOC
## POST /node/run
### Description
Starts a node host process that connects to a gateway to receive and execute system commands.
### Method
POST
### Endpoint
/node/run
### Parameters
#### Request Body
- **host** (string) - Required - The hostname or IP of the gateway.
- **port** (integer) - Required - The port the gateway is listening on.
- **display-name** (string) - Optional - A human-readable name for the node.
### Request Example
{
  "host": "127.0.0.1",
  "port": 18789,
  "display-name": "Build Node"
}
### Response
#### Success Response (200)
- **message** (string) - Status indicating the node host has started successfully.
```
--------------------------------
### Install Mattermost Plugin via CLI
Source: https://docs.openclaw.ai/channels/mattermost
Installs the OpenClaw Mattermost plugin from the npm registry using the OpenClaw CLI.
```bash
openclaw plugins install @openclaw/mattermost
```
--------------------------------
### Configure Session Key Security Policies
Source: https://docs.openclaw.ai/automation/webhook
Examples for configuring session key security, showing both the recommended restrictive approach and legacy compatibility settings.
```json5
// Recommended configuration
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    defaultSessionKey: "hook:ingress",
    allowRequestSessionKey: false,
    allowedSessionKeyPrefixes: ["hook:"],
  },
}
// Legacy compatibility configuration
{
  hooks: {
    enabled: true,
    token: "${OPENCLAW_HOOKS_TOKEN}",
    allowRequestSessionKey: true,
    allowedSessionKeyPrefixes: ["hook:"],
  },
}
```
--------------------------------
### Minimal Remote OpenShell Setup (JSON5)
Source: https://docs.openclaw.ai/gateway/openshell
This configuration sets up OpenShell in 'remote' mode with minimal required settings. It specifies the sandbox backend and the source for initial workspace creation.
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "openshell",
      },
    },
  },
  plugins: {
    entries: {
      openshell: {
        enabled: true,
        config: {
          from: "openclaw",
          mode: "remote",
        },
      },
    },
  },
}
```
--------------------------------
### Onboard to Cloudflare AI Gateway (Non-Interactive)
Source: https://docs.openclaw.ai/providers/cloudflare-ai-gateway
Performs a non-interactive onboarding for the Cloudflare AI Gateway, suitable for automated setups. It requires all necessary parameters, including account ID, gateway ID, and API key, to be provided as arguments.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice cloudflare-ai-gateway-api-key \
  --cloudflare-ai-gateway-account-id "your-account-id" \
  --cloudflare-ai-gateway-gateway-id "your-gateway-id" \
  --cloudflare-ai-gateway-api-key "$CLOUDFLARE_AI_GATEWAY_API_KEY"
```
--------------------------------
### Install and Verify imsg CLI
Source: https://docs.openclaw.ai/channels/imessage
Installs the 'imsg' command-line interface using Homebrew and verifies its installation by displaying the help message. This is the first step in setting up the iMessage integration.
```bash
brew install steipete/tap/imsg
imsg rpc --help
```
--------------------------------
### Install ClawDock Shell Helpers
Source: https://docs.openclaw.ai/install/docker
Installs the ClawDock script to the user's home directory and sources it in the .zshrc file to enable convenient CLI management commands.
```bash
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/openclaw/openclaw/main/scripts/shell-helpers/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
echo 'source ~/.clawdock/clawdock-helpers.sh' >> ~/.zshrc && source ~/.zshrc
```
--------------------------------
### Dry Run Success and Failure Examples
Source: https://docs.openclaw.ai/cli/config
JSON response examples for successful and failed dry-run operations.
```json
{
  "ok": true,
  "operations": 1,
  "configPath": "~/.openclaw/openclaw.json",
  "inputModes": ["builder"],
  "checks": {
    "schema": false,
    "resolvability": true,
    "resolvabilityComplete": true
  },
  "refsChecked": 1,
  "skippedExecRefs": 0
}
{
  "ok": false,
  "operations": 1,
  "configPath": "~/.openclaw/openclaw.json",
  "inputModes": ["builder"],
  "checks": {
    "schema": false,
    "resolvability": true,
    "resolvabilityComplete": true
  },
  "refsChecked": 1,
  "skippedExecRefs": 0,
  "errors": [
    {
      "kind": "resolvability",
      "message": "Error: Environment variable \"MISSING_TEST_SECRET\" is not set.",
      "ref": "env:default:MISSING_TEST_SECRET"
    }
  ]
}
```
--------------------------------
### Generate iOS Pairing QR and Setup Code (Bash)
Source: https://docs.openclaw.ai/cli/qr
Generates an iOS pairing QR code and setup code from the current Gateway configuration. Supports options to customize the output, such as specifying a setup code only, emitting JSON, overriding URLs, or using remote gateway credentials.
```bash
openclaw qr
openclaw qr --setup-code-only
openclaw qr --json
openclaw qr --remote
openclaw qr --url wss://gateway.example/ws
```
--------------------------------
### Add Multiple Cron Jobs for Efficient Automation
Source: https://docs.openclaw.ai/automation/cron-vs-heartbeat
This section provides examples of setting up multiple cron jobs for efficient automation. It includes a daily morning briefing, a weekly project review, and a one-shot reminder. These examples demonstrate the use of different cron schedules, models, and session types to manage various automated tasks.
```bash
# Daily morning briefing at 7am
openclaw cron add --name "Morning brief" --cron "0 7 * * *" --session isolated --message "..." --announce
# Weekly project review on Mondays at 9am
openclaw cron add --name "Weekly review" --cron "0 9 * * 1" --session isolated --message "..." --model opus
# One-shot reminder
openclaw cron add --name "Call back" --at "2h" --session main --system-event "Call back the client" --wake now
```
--------------------------------
### Setup Gmail Pub/Sub Webhooks
Source: https://docs.openclaw.ai/cli
Commands for setting up and running Gmail Pub/Sub hooks for real-time notifications. Supports various configuration options for accounts, projects, topics, and endpoints.
```bash
openclaw webhooks gmail setup --account <email> [--project <project>] [--topic <topic>] [--subscription <subscription>] [--label <label>] [--hook-url <url>] [--hook-token <token>] [--push-token <token>] [--bind <bind>] [--port <port>] [--path <path>] [--include-body] [--max-bytes <bytes>] [--renew-minutes <minutes>] [--tailscale] [--tailscale-path <path>] [--tailscale-target <target>] [--push-endpoint <endpoint>] [--json]
openclaw webhooks gmail run (runtime overrides for the same flags)
```
--------------------------------
### Install OpenClaw Twitch Plugin
Source: https://docs.openclaw.ai/channels/twitch
Commands to install the Twitch plugin via the CLI, either from the npm registry or a local git repository checkout.
```bash
openclaw plugins install @openclaw/twitch
```
```bash
openclaw plugins install ./extensions/twitch
```
--------------------------------
### OpenClaw Tool Policy Configuration Example (JSON5)
Source: https://docs.openclaw.ai/gateway/sandbox-vs-tool-policy-vs-elevated
This JSON5 snippet demonstrates how to configure tool policies, specifically using tool groups for runtime, file system, session, and memory operations within a sandboxed environment.
```json5
{
  tools: {
    sandbox: {
      tools: {
        allow: ["group:runtime", "group:fs", "group:sessions", "group:memory"],
      },
    },
  },
}
```
--------------------------------
### Install Node.js LTS with winget (Windows)
Source: https://docs.openclaw.ai/install/node
Installs the Node.js Long Term Support (LTS) version on Windows using the winget package manager. This is the recommended method for Windows users.
```powershell
winget install OpenJS.NodeJS.LTS
```
--------------------------------
### GET /readyz
Source: https://docs.openclaw.ai/install/docker
Checks the readiness of the OpenClaw AI container.
```APIDOC
## GET /readyz
### Description
Returns the readiness status of the container, indicating if it is prepared to accept traffic. This endpoint is unauthenticated.
### Method
GET
### Endpoint
http://127.0.0.1:18789/readyz
### Response
#### Success Response (200)
- **status** (string) - Returns OK if the container is ready.
```
--------------------------------
### Launch OpenClaw Gateway
Source: https://docs.openclaw.ai/install/podman
Starts the OpenClaw Gateway container manually or initiates the onboarding wizard for interactive configuration.
```bash
./scripts/run-openclaw-podman.sh launch
./scripts/run-openclaw-podman.sh launch setup
```
--------------------------------
### Gateway Local Startup
Source: https://docs.openclaw.ai/gateway
Commands to start the OpenClaw Gateway locally for development and testing.
```APIDOC
## Gateway Local Startup
### Description
Commands to start the OpenClaw Gateway locally for development and testing.
### Method
CLI Command
### Endpoint
N/A
### Parameters
#### Command Line Arguments
- **--port** (integer) - Optional - Specifies the port for the Gateway to listen on. Defaults to 18789.
- **--verbose** (boolean) - Optional - Enables debug/trace logging mirrored to stdio.
- **--force** (boolean) - Optional - Forces the listener to be killed on the selected port before starting.
### Request Example
```bash
openclaw gateway --port 18789
openclaw gateway --port 18789 --verbose
openclaw gateway --force
```
### Response
N/A (This is a command-line operation)
### Error Handling
- If the port is already in use and `--force` is not used, the command may fail.
- Verbose output can help diagnose startup issues.
```
--------------------------------
### Update Installed Skills using ClawHub CLI
Source: https://docs.openclaw.ai/tools/clawhub
Illustrates how to update all installed skills to their latest available versions. This ensures your skills are up-to-date with the latest features and fixes.
```bash
clawhub update --all
```
--------------------------------
### Install OpenClaw CLI globally
Source: https://docs.openclaw.ai/platforms/mac/bundled-gateway
Installs the OpenClaw CLI globally using npm. This is a prerequisite for running the Gateway in local mode on macOS.
```bash
npm install -g openclaw@<version>
```
--------------------------------
### OpenClaw Session Configuration Example
Source: https://docs.openclaw.ai/concepts/session
An example JSON5 configuration file for OpenClaw, demonstrating session settings such as scope, identity links, and detailed reset policies (daily, idle, per-type, and per-channel). It also specifies the session store path and main key.
```json5
// ~/.openclaw/openclaw.json
{
  session: {
    scope: "per-sender", // keep group keys separate
    dmScope: "main", // DM continuity (set per-channel-peer/per-account-channel-peer for shared inboxes)
    identityLinks: {
      alice: ["telegram:123456789", "discord:987654321012345678"],
    },
    reset: {
      // Defaults: mode=daily, atHour=4 (gateway host local time).
      // If you also set idleMinutes, whichever expires first wins.
      mode: "daily",
      atHour: 4,
      idleMinutes: 120,
    },
    resetByType: {
      thread: { mode: "daily", atHour: 4 },
      direct: { mode: "idle", idleMinutes: 240 },
      group: { mode: "idle", idleMinutes: 120 },
    },
    resetByChannel: {
      discord: { mode: "idle", idleMinutes: 10080 },
    },
    resetTriggers: ["/new", "/reset"],
    store: "~/.openclaw/agents/{agentId}/sessions/sessions.json",
    mainKey: "main",
  },
}
```
--------------------------------
### Install OpenClaw using pnpm
Source: https://docs.openclaw.ai/install
Installs OpenClaw globally using pnpm. This method requires approving build scripts and then onboarding the OpenClaw daemon. It's an alternative to npm for users who prefer pnpm.
```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```
--------------------------------
### Install OpenClaw via Bash for CI/CD
Source: https://docs.openclaw.ai/install/installer
Non-interactive installation commands for Linux/macOS environments using bash scripts. These are suitable for automated CI/CD pipelines.
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-prompt --no-onboard
```
```bash
OPENCLAW_INSTALL_METHOD=git OPENCLAW_NO_PROMPT=1 \
  curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --json --prefix /opt/openclaw
```
--------------------------------
### Quick Start: Running Claude and Codex CLIs
Source: https://docs.openclaw.ai/gateway/cli-backends
Demonstrates the basic command to run Claude and Codex CLIs directly using OpenClaw without any prior configuration. This serves as a beginner-friendly introduction to using local CLIs as AI models.
```bash
openclaw agent --message "hi" --model claude-cli/opus-4.6
```
```bash
openclaw agent --message "hi" --model codex-cli/gpt-5.4
```
--------------------------------
### Configure Shared Models and Overrides (JSON5)
Source: https://docs.openclaw.ai/nodes/media-understanding
This example shows a comprehensive configuration for OpenClaw's media understanding tools. It defines a shared list of models, including provider-based and CLI-based options, and specifies capabilities for each. It also includes overrides for audio attachment handling and video character limits.
```json5
{
  tools: {
    media: {
      models: [
        { provider: "openai", model: "gpt-5.2", capabilities: ["image"] },
        {
          provider: "google",
          model: "gemini-3-flash-preview",
          capabilities: ["image", "audio", "video"],
        },
        {
          type: "cli",
          command: "gemini",
          args: [
            "-m",
            "gemini-3-flash",
            "--allowed-tools",
            "read_file",
            "Read the media at {{MediaPath}} and describe it in <= {{MaxChars}} characters.",
          ],
          capabilities: ["image", "video"],
        },
      ],
      audio: {
        attachments: { mode: "all", maxAttachments: 2 },
      },
      video: {
        maxChars: 500,
      },
    },
  },
}
```
--------------------------------
### Configure OpenClaw Skills
Source: https://docs.openclaw.ai/tools/skills
Example of how to define and configure skills in the ~/.openclaw/openclaw.json file. It demonstrates enabling/disabling skills, setting environment variables, and providing custom configuration endpoints.
```json5
{
  skills: {
    entries: {
      "image-lab": {
        enabled: true,
        apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" },
        env: {
          GEMINI_API_KEY: "GEMINI_KEY_HERE",
        },
        config: {
          endpoint: "https://example.invalid",
          model: "nano-pro",
        },
      },
      peekaboo: { enabled: true },
      sag: { enabled: false },
    },
  },
}
```
--------------------------------
### Comprehensive Assistant Configuration
Source: https://docs.openclaw.ai/start/openclaw
A complete configuration example for an AI assistant, including model selection, heartbeat settings, channel restrictions, and session reset logic.
```json
{
  "logging": { "level": "info" },
  "agent": {
    "model": "anthropic/claude-opus-4-6",
    "workspace": "~/.openclaw/workspace",
    "thinkingDefault": "high",
    "timeoutSeconds": 1800,
    "heartbeat": { "every": "0m" }
  },
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": {
        "*": { "requireMention": true }
      }
    }
  },
  "routing": {
    "groupChat": {
      "mentionPatterns": ["@openclaw", "openclaw"]
    }
  },
  "session": {
    "scope": "per-sender",
    "resetTriggers": ["/new", "/reset"],
    "reset": {
      "mode": "daily",
      "atHour": 4,
      "idleMinutes": 10080
    }
  }
}
```
--------------------------------
### Install Playwright Browsers in Container
Source: https://docs.openclaw.ai/install/docker
Installs required browser binaries within the running container environment for headless automation tasks.
```bash
docker compose run --rm openclaw-cli \
  node /app/node_modules/playwright-core/cli.js install chromium
```
--------------------------------
### Build OpenClaw from Source
Source: https://docs.openclaw.ai/help/faq
Clones the repository and builds the project from source, suitable for contributors. It includes installing dependencies and building the UI assets.
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
pnpm ui:build
openclaw onboard
```
--------------------------------
### Execute OpenClaw Installer Scripts
Source: https://docs.openclaw.ai/install/installer
Commands to trigger the installation of OpenClaw on Unix-like systems and Windows. These commands fetch the script from the official server and execute it in the shell environment.
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --help
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --help
```
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -Tag beta -NoOnboard -DryRun
```
--------------------------------
### Install OpenClaw Plugin
Source: https://docs.openclaw.ai/plugins/community
Installs a community plugin for OpenClaw. The command first checks ClawHub and then falls back to npm if the package is not found on ClawHub.
```bash
openclaw plugins install <package-name>
```
--------------------------------
### Install QQbot Plugin
Source: https://docs.openclaw.ai/plugins/community
Installs the '@sliverp/qqbot' plugin to connect OpenClaw to QQ via the QQ Bot API. It supports private chats, group mentions, channel messages, and rich media like voice, images, videos, and files.
```bash
openclaw plugins install @sliverp/qqbot
```
--------------------------------
### Install OpenClaw Plugins
Source: https://docs.openclaw.ai/plugins/sdk-setup
Commands to install plugins from external registries. It supports automatic source detection or explicit source selection between ClawHub and npm.
```bash
openclaw plugins install @myorg/openclaw-my-plugin
openclaw plugins install clawhub:@myorg/openclaw-my-plugin
openclaw plugins install npm:@myorg/openclaw-my-plugin
```
--------------------------------
### Update and Install Build Tools (Bash)
Source: https://docs.openclaw.ai/install/oracle
Connects to the OCI instance via SSH and updates the package list, upgrades existing packages, and installs the build-essential package. This is necessary for compiling certain dependencies on ARM architecture.
```bash
ssh ubuntu@YOUR_PUBLIC_IP
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential
```
--------------------------------
### Update OpenClaw Plugin
Source: https://docs.openclaw.ai/cli/plugins
Updates tracked plugin installs and hook-pack installs. It can update a specific plugin by its ID or an NPM package specification, or update all installed plugins. When updating by ID, OpenClaw uses the previously recorded install spec. For NPM installs, an explicit spec can be provided, which OpenClaw resolves and records for future updates. Integrity hash mismatches trigger warnings and require confirmation unless bypassed with `--yes`.
```bash
openclaw plugins update <id-or-npm-spec>
openclaw plugins update --all
openclaw plugins update <id-or-npm-spec> --dry-run
openclaw plugins update @openclaw/voice-call@beta
```
--------------------------------
### Invoke Tool via HTTP POST Request
Source: https://docs.openclaw.ai/gateway/tools-invoke-http-api
This example demonstrates how to invoke a tool using the /tools/invoke HTTP endpoint. It includes the necessary headers for authorization and content type, along with a JSON payload specifying the tool, action, and arguments.
```bash
curl -sS http://127.0.0.1:18789/tools/invoke \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "tool": "sessions_list",
    "action": "json",
    "args": {}
  }'
```
--------------------------------
### Message Logger Hook Example
Source: https://docs.openclaw.ai/automation/hooks
An example of how to create a message logger hook to process received and sent messages.
```APIDOC
## Message Logger Hook Example
This example demonstrates how to implement a handler function that logs received and sent messages based on event types.
### Code Example
```typescript
const isMessageReceivedEvent = (event: { type: string; action: string }) =>
  event.type === "message" && event.action === "received";
const isMessageSentEvent = (event: { type: string; action: string }) =>
  event.type === "message" && event.action === "sent";
const handler = async (event) => {
  if (isMessageReceivedEvent(event as { type: string; action: string })) {
    console.log(`[message-logger] Received from ${event.context.from}: ${event.context.content}`);
  } else if (isMessageSentEvent(event as { type: string; action: string })) {
    console.log(`[message-logger] Sent to ${event.context.to}: ${event.context.content}`);
  }
};
export default handler;
```
```
--------------------------------
### OpenClaw Plugin with Deferred Loading
Source: https://docs.openclaw.ai/plugins/architecture
Configures a channel plugin to use a separate setup entry during the gateway's pre-listen phase, even if the channel is already configured. This is useful for optimizing startup performance by deferring the full plugin load.
```json
{
  "name": "@scope/my-channel",
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "startup": {
      "deferConfiguredChannelFullLoadUntilAfterListen": true
    }
  }
}
```
--------------------------------
### Start OpenClaw Gateway
Source: https://docs.openclaw.ai/channels/irc
Command to start or restart the OpenClaw gateway service, which is necessary for the IRC integration to become active after configuration changes.
```bash
openclaw gateway run
```
--------------------------------
### Manage Plugins via CLI
Source: https://docs.openclaw.ai/tools/plugin
Provides common command-line interface commands for listing, installing, updating, and toggling the status of plugins.
```bash
openclaw plugins list
openclaw plugins inspect <id>
openclaw plugins inspect <id> --json
openclaw plugins status
openclaw plugins doctor
openclaw plugins install <package>
openclaw plugins install clawhub:<pkg>
openclaw plugins install <path>
openclaw plugins install -l <path>
openclaw plugins update <id>
openclaw plugins update --all
openclaw plugins enable <id>
openclaw plugins disable <id>
```
--------------------------------
### Install OpenClaw via Git Checkout
Source: https://docs.openclaw.ai/help/faq
Installs OpenClaw from a git repository, allowing AI agents to inspect the source code and documentation for better troubleshooting. This method is recommended for debugging environment-specific issues.
```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git
```
--------------------------------
### Enable and Start Systemd User Service
Source: https://docs.openclaw.ai/platforms/linux
Commands to enable and start the OpenClaw Gateway systemd user service. This ensures the Gateway is active upon user login and restarts automatically.
```bash
systemctl --user enable --now openclaw-gateway[-<profile>].service
```
--------------------------------
### System Echo Method
Source: https://docs.openclaw.ai/concepts/typebox
Example implementation of a custom system method that echoes provided text.
```APIDOC
## POST system.echo
### Description
Returns the provided text back to the client.
### Method
WebSocket Message (JSON)
### Parameters
#### Request Body
- **text** (string) - Required - The string to be echoed
### Request Example
{
  "type": "req",
  "id": "h1",
  "method": "system.echo",
  "params": { "text": "hello" }
}
### Response
#### Success Response (200)
- **ok** (boolean) - Status of the operation
- **text** (string) - The echoed text
#### Response Example
{
  "type": "res",
  "id": "h1",
  "ok": true,
  "payload": { "ok": true, "text": "hello" }
}
```
--------------------------------
### Non-Interactive Onboarding with Secret References
Source: https://docs.openclaw.ai/cli/onboard
Demonstrates non-interactive onboarding where provider keys are stored as environment variable references instead of plaintext. This enhances security by avoiding direct key exposure.
```bash
openclaw onboard --non-interactive \
  --auth-choice openai-api-key \
  --secret-input-mode ref \
  --accept-risk
```
--------------------------------
### Set Session Execution Overrides
Source: https://docs.openclaw.ai/tools/exec
Example of using the /exec command to configure host, security, and node parameters for the current session.
```text
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```
--------------------------------
### Troubleshoot OpenClaw Installation
Source: https://docs.openclaw.ai/platforms/linux
Command to run the OpenClaw doctor utility, which helps diagnose and repair issues with the OpenClaw installation.
```bash
openclaw doctor
```
--------------------------------
### Non-Interactive Custom Provider Onboarding
Source: https://docs.openclaw.ai/cli/onboard
Illustrates non-interactive onboarding for a custom provider using API keys. It shows how to specify the base URL, model ID, and API key, including options for plaintext or environment variable secrets.
```bash
openclaw onboard --non-interactive \
  --auth-choice custom-api-key \
  --custom-base-url "https://llm.example.com/v1" \
  --custom-model-id "foo-large" \
  --custom-api-key "$CUSTOM_API_KEY" \
  --secret-input-mode plaintext \
  --custom-compatibility openai
```
--------------------------------
### Start the Gateway Service
Source: https://docs.openclaw.ai/gateway
Commands to initialize the OpenClaw Gateway service. Includes options for verbose logging and forced port binding.
```bash
openclaw gateway --port 18789
# debug/trace mirrored to stdio
openclaw gateway --port 18789 --verbose
# force-kill listener on selected port, then start
openclaw gateway --force
```
--------------------------------
### Install OpenClaw via Shell Script
Source: https://docs.openclaw.ai/install/installer
Executes the OpenClaw installation script on Unix-like systems. Supports various flags for custom prefixes, version selection, and onboarding automation.
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --prefix /opt/openclaw --version latest
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --json --prefix /opt/openclaw
```
```bash
curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install-cli.sh | bash -s -- --onboard
```
--------------------------------
### Install ACPX Plugin Locally for Development (Bash)
Source: https://docs.openclaw.ai/tools/acp-agents
This bash command is used during local development to install the ACPX plugin from a local path. This allows for testing changes to the plugin without publishing it.
```bash
openclaw plugins install ./extensions/acpx
```
--------------------------------
### Install OpenClaw Matrix Plugin
Source: https://docs.openclaw.ai/channels/matrix
Commands to install the Matrix plugin for OpenClaw from npm or a local checkout. This plugin extends OpenClaw's functionality to interact with Matrix.
```bash
openclaw plugins install @openclaw/matrix
```
```bash
openclaw plugins install ./extensions/matrix
```
--------------------------------
### Invoke Media Understanding Runtime Helpers
Source: https://docs.openclaw.ai/plugins/architecture
Provides examples for describing media files and transcribing audio using the shared media understanding runtime interface.
```typescript
const image = await api.runtime.mediaUnderstanding.describeImageFile({
  filePath: "/tmp/inbound-photo.jpg",
  cfg: api.config,
  agentDir: "/tmp/agent",
});
const video = await api.runtime.mediaUnderstanding.describeVideoFile({
  filePath: "/tmp/inbound-video.mp4",
  cfg: api.config,
});
const { text } = await api.runtime.mediaUnderstanding.transcribeAudioFile({
  filePath: "/tmp/inbound-audio.ogg",
  cfg: api.config,
  mime: "audio/ogg",
});
```
--------------------------------
### Brave Search API Configuration
Source: https://docs.openclaw.ai/tools/brave-search
Configuration example for setting up Brave Search as a web search provider in OpenClaw.
```APIDOC
## Brave Search API Configuration
### Description
Configuration for integrating Brave Search as a web search provider. This includes setting the API key and defining search parameters.
### Method
N/A (Configuration)
### Endpoint
N/A (Configuration)
### Parameters
#### Request Body (Configuration)
- **plugins.entries.brave.config.webSearch.apiKey** (string) - Required - Your Brave Search API key.
- **tools.web.search.provider** (string) - Optional - Set to "brave" to use Brave Search.
- **tools.web.search.maxResults** (integer) - Optional - Maximum number of results to return (default: 5).
- **tools.web.search.timeoutSeconds** (integer) - Optional - Timeout for the search request in seconds (default: 30).
### Request Example
```json
{
  "plugins": {
    "entries": {
      "brave": {
        "config": {
          "webSearch": {
            "apiKey": "YOUR_BRAVE_API_KEY"
          }
        }
      }
    }
  },
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "maxResults": 5,
        "timeoutSeconds": 30
      }
    }
  }
}
```
### Response
N/A (Configuration)
```
--------------------------------
### Automated OpenClaw Installation
Source: https://docs.openclaw.ai/install/ansible
Executes the automated installation script to deploy OpenClaw and its dependencies, including Tailscale, UFW, and Docker, on supported Linux distributions.
```bash
curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw-ansible/main/install.sh | bash
```
--------------------------------
### Manage Browser via CLI
Source: https://docs.openclaw.ai/tools/browser
Use the OpenClaw CLI to check the status, start the browser, navigate to URLs, and capture snapshots of the managed browser profile.
```bash
openclaw browser --browser-profile openclaw status
openclaw browser --browser-profile openclaw start
openclaw browser --browser-profile openclaw open https://example.com
openclaw browser --browser-profile openclaw snapshot
```
--------------------------------
### Configure Hardened Exec Provider
Source: https://docs.openclaw.ai/cli/config
Example of setting up an exec-based secret provider with security constraints such as trusted directories and command arguments.
```bash
openclaw config set secrets.providers.vault \
  --provider-source exec \
  --provider-command /usr/local/bin/openclaw-vault \
  --provider-arg read \
  --provider-arg openai/api-key \
  --provider-json-only \
  --provider-pass-env VAULT_TOKEN \
  --provider-trusted-dir /usr/local/bin \
  --provider-timeout-ms 5000
```
--------------------------------
### Heartbeat Checklist Example (Markdown)
Source: https://docs.openclaw.ai/automation/cron-vs-heartbeat
An example of a Heartbeat checklist written in Markdown. This defines tasks the agent should perform during its periodic awareness checks.
```markdown
# Heartbeat checklist
- Check email for urgent messages
- Review calendar for events in next 2 hours
- If a background task finished, summarize results
- If idle for 8+ hours, send a brief check-in
```
--------------------------------
### Configure Media Understanding Tools
Source: https://docs.openclaw.ai/gateway/configuration-reference
Sets up processing for audio and video media. It supports multiple providers and CLI-based tools, with granular control over concurrency and scope.
```json5
{
  tools: {
    media: {
      concurrency: 2,
      audio: {
        enabled: true,
        maxBytes: 20971520,
        scope: {
          default: "deny",
          rules: [{ action: "allow", match: { chatType: "direct" } }],
        },
        models: [
          { provider: "openai", model: "gpt-4o-mini-transcribe" },
          { type: "cli", command: "whisper", args: ["--model", "base", "{{MediaPath}}"] },
        ],
      },
      video: {
        enabled: true,
        maxBytes: 52428800,
        models: [{ provider: "google", model: "gemini-3-flash-preview" }],
      },
    },
  },
}
```
--------------------------------
### Install Lossless Claw (LCM) Plugin
Source: https://docs.openclaw.ai/plugins/community
Installs the '@martian-engineering/lossless-claw' plugin, which offers Lossless Context Management for OpenClaw. It uses DAG-based conversation summarization with incremental compaction to preserve context fidelity while reducing token usage.
```bash
openclaw plugins install @martian-engineering/lossless-claw
```
--------------------------------
### Onboard to Together AI with Openclaw CLI
Source: https://docs.openclaw.ai/providers/together
This command initiates the onboarding process for Together AI, allowing you to set up your API key and configure default settings for using their models through the Openclaw platform. It's the recommended first step for integrating Together AI services.
```bash
openclaw onboard --auth-choice together-api-key
```
--------------------------------
### Configure Context Engine via JSON5
Source: https://docs.openclaw.ai/concepts/context-engine
Example configuration snippet for selecting the active context engine within the OpenClaw plugin slots.
```json5
{
  plugins: {
    slots: {
      contextEngine: "legacy",
    },
  },
}
```
--------------------------------
### Create Local Nix Flake for OpenClaw
Source: https://docs.openclaw.ai/install/nix
This snippet demonstrates the initial steps to set up a local Nix flake for OpenClaw using the agent-first template from the nix-openclaw repository. It involves creating a directory and copying template files.
```bash
mkdir -p ~/code/openclaw-local
# Copy templates/agent-first/flake.nix from the nix-openclaw repo
```
--------------------------------
### Run OpenClaw Gateway from Source
Source: https://docs.openclaw.ai/start/setup
Starts the OpenClaw Gateway in verbose mode, listening on a specified port. This is useful for development and debugging.
```bash
node openclaw.mjs gateway --port 18789 --verbose
```
--------------------------------
### Configuring and Running Plugin Tests with Vitest
Source: https://docs.openclaw.ai/plugins/sdk-testing
Illustrates various ways to run tests using Vitest, including running all tests, targeting specific plugin files, filtering tests by name, and enabling coverage reports. It also shows how to configure environment variables for low-memory environments.
```bash
# Run all tests
pnpm test
# Run specific plugin tests
pnpm test -- extensions/my-channel/src/channel.test.ts
# Run with a specific test name filter
pnpm test -- extensions/my-channel/ -t "resolves account"
# Run with coverage
pnpm test:coverage
# Run in low memory environment
OPENCLAW_TEST_PROFILE=low OPENCLAW_TEST_SERIAL_GATEWAY=1 pnpm test
```
--------------------------------
### Multi-Account Configuration
Source: https://docs.openclaw.ai/channels/synology-chat
Example of configuring multiple Synology Chat accounts within the OpenClaw configuration file.
```json5
{
  channels: {
    "synology-chat": {
      enabled: true,
      accounts: {
        default: {
          token: "token-a",
          incomingUrl: "https://nas-a.example.com/...token=..."
        },
        alerts: {
          token: "token-b",
          incomingUrl: "https://nas-b.example.com/...token=...",
          webhookPath: "/webhook/synology-alerts",
          dmPolicy: "allowlist",
          allowedUserIds: ["987654"]
        }
      }
    }
  }
}
```
--------------------------------
### Verify OpenClaw Installation
Source: https://docs.openclaw.ai/install
Commands to verify that OpenClaw has been installed correctly and is functioning as expected. These commands check the CLI version, system configuration, and the status of the OpenClaw Gateway.
```bash
openclaw --version      # confirm the CLI is available
openclaw doctor         # check for config issues
openclaw gateway status # verify the Gateway is running
```
--------------------------------
### Initialize OpenClaw Gateway and Channels
Source: https://docs.openclaw.ai/start/openclaw
Commands to authenticate the WhatsApp channel and launch the OpenClaw gateway service on a specific port.
```bash
openclaw channels login
openclaw gateway --port 18789
```
--------------------------------
### Install Microsoft Teams Plugin
Source: https://docs.openclaw.ai/channels/msteams
Commands to install the Microsoft Teams plugin into the OpenClaw environment using either the npm registry or a local git checkout path.
```bash
openclaw plugins install @openclaw/msteams
```
```bash
openclaw plugins install ./extensions/msteams
```
--------------------------------
### Troubleshoot Docker Sandbox
Source: https://docs.openclaw.ai/install/ansible
Commands to verify the Docker daemon status, list existing sandbox images, and re-run the setup script if the image is missing.
```bash
sudo systemctl status docker
sudo docker images | grep openclaw-sandbox
cd /opt/openclaw/openclaw
sudo -u openclaw ./scripts/sandbox-setup.sh
```
--------------------------------
### Non-interactive CLI Onboarding
Source: https://docs.openclaw.ai/cli/onboard
Demonstrates how to onboard the OpenClaw CLI in a non-interactive environment using the Mistral provider. This is ideal for CI/CD pipelines or automated scripts.
```bash
openclaw onboard --non-interactive \
  --auth-choice mistral-api-key \
  --mistral-api-key "$MISTRAL_API_KEY"
```
--------------------------------
### Troubleshoot sharp build errors with npm
Source: https://docs.openclaw.ai/install
A workaround for `sharp` build errors that may occur due to a globally installed libvips. This command installs OpenClaw while ignoring the global libvips dependency.
```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```
--------------------------------
### Complete Broadcast Configuration Example (JSON)
Source: https://docs.openclaw.ai/channels/broadcast-groups
This comprehensive JSON example shows a full OpenClaw configuration including agent definitions and broadcast settings. It demonstrates parallel processing for multiple group chats and a direct message, showcasing diverse use cases.
```json
{
  "agents": {
    "list": [
      {
        "id": "code-reviewer",
        "name": "Code Reviewer",
        "workspace": "/path/to/code-reviewer",
        "sandbox": { "mode": "all" }
      },
      {
        "id": "security-auditor",
        "name": "Security Auditor",
        "workspace": "/path/to/security-auditor",
        "sandbox": { "mode": "all" }
      },
      {
        "id": "docs-generator",
        "name": "Documentation Generator",
        "workspace": "/path/to/docs-generator",
        "sandbox": { "mode": "all" }
      }
    ]
  },
  "broadcast": {
    "strategy": "parallel",
    "120363403215116621@g.us": ["code-reviewer", "security-auditor", "docs-generator"],
    "120363424282127706@g.us": ["support-en", "support-de"],
    "+15555550123": ["assistant", "logger"]
  }
}
```
--------------------------------
### Image Input Example (JSON)
Source: https://docs.openclaw.ai/gateway/openresponses-http-api
This JSON snippet shows how to provide image input to the API. It supports base64 or URL sources and specifies the image type and its source details.
```json
{
  "type": "input_image",
  "source": { "type": "url", "url": "https://example.com/image.png" }
}
```
--------------------------------
### Start claude-max-api-proxy Server
Source: https://docs.openclaw.ai/providers/claude-max-api-proxy
Starts the local API proxy server. The server will be accessible at http://localhost:3456.
```bash
claude-max-api
# Server runs at http://localhost:3456
```
--------------------------------
### Plugin Configuration Schema Example (JSON5)
Source: https://docs.openclaw.ai/plugins/sdk-setup
Illustrates how users configure plugins using a JSON structure, specifying plugin-specific settings like webhook secrets. This configuration is accessed via `api.pluginConfig`.
```json5
{
  plugins: {
    entries: {
      "my-plugin": {
        config: {
          webhookSecret: "abc123",
        },
      },
    },
  },
}
```
--------------------------------
### defineSetupPluginEntry
Source: https://docs.openclaw.ai/plugins/sdk-entrypoints
Used for lightweight setup-entry.ts files when full plugin loading is not required.
```APIDOC
## defineSetupPluginEntry
### Description
Returns a minimal plugin entry for deferred loading or unconfigured channels.
### Parameters
#### Request Body
- **plugin** (ChannelPlugin) - Required - The plugin instance.
### Request Example
```typescript
import { defineSetupPluginEntry } from "openclaw/plugin-sdk/core";
export default defineSetupPluginEntry(myChannelPlugin);
```
```
--------------------------------
### Verify Plugin Bundle Detection
Source: https://docs.openclaw.ai/plugins/bundles
Commands to list installed plugins and inspect specific plugin details to confirm they have been correctly identified as bundles.
```bash
openclaw plugins list
openclaw plugins inspect <id>
```
--------------------------------
### Non-interactive Onboarding with Openclaw CLI
Source: https://docs.openclaw.ai/reference/wizard
Automates the Openclaw AI onboarding process using the command-line interface. Supports various options for authentication, gateway configuration, and daemon installation. The `--json` flag provides machine-readable output.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-skills
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice skip \
  --gateway-auth token \
  --gateway-token-ref-env OPENCLAW_GATEWAY_TOKEN
```
--------------------------------
### Registering a Context Engine Plugin
Source: https://docs.openclaw.ai/tools/capability-cookbook
Demonstrates how to register a custom context engine plugin using `api.registerContextEngine`. This example shows a 'lossless-claw' engine that owns its compaction logic.
```APIDOC
## Register Context Engine
### Description
Register a custom context engine plugin to manage session context orchestration (ingest, assembly, compaction). Select the active engine using `plugins.slots.contextEngine`.
### Method
`api.registerContextEngine(id, factory)`
### Parameters
- **id** (string) - Required - A unique identifier for the context engine.
- **factory** (function) - Required - A function that returns the context engine object.
### Context Engine Object
- **info** (object) - Required - Information about the engine.
  - **id** (string) - Required - The engine's unique identifier.
  - **name** (string) - Required - The engine's display name.
  - **ownsCompaction** (boolean) - Required - Indicates if the engine handles its own compaction.
- **ingest** (function) - Optional - Handles the ingestion process.
- **assemble** (function) - Optional - Handles the assembly of messages.
- **compact** (function) - Optional - Handles the compaction process.
### Request Example
```javascript
export default function (api) {
  api.registerContextEngine("lossless-claw", () => ({
    info: { id: "lossless-claw", name: "Lossless Claw", ownsCompaction: true },
    async ingest() {
      return { ingested: true };
    },
    async assemble({ messages }) {
      return { messages, estimatedTokens: 0 };
    },
    async compact() {
      return { ok: true, compacted: false };
    },
  }));
}
```
```
--------------------------------
### Chat Command Examples for Approving Executions
Source: https://docs.openclaw.ai/tools/exec-approvals
Examples of commands used in chat interfaces to approve or deny pending interpreter/runtime command executions. These commands utilize an approval ID to reference specific requests.
```bash
/approve <id> allow-once
/approve <id> allow-always
/approve <id> deny
```
--------------------------------
### Manage Skills via CLI
Source: https://docs.openclaw.ai/help/faq
Standard commands for searching, installing, and updating skills within the OpenClaw environment on Linux systems.
```bash
openclaw skills search "calendar"
openclaw skills install <skill-slug>
openclaw skills update --all
```
--------------------------------
### Start and Open Browser via CLI
Source: https://docs.openclaw.ai/tools/browser-login
Commands to start the OpenClaw browser and open a specific URL. Supports specifying a browser profile. The default profile is 'openclaw'.
```bash
openclaw browser start
openclaw browser open https://x.com
```
--------------------------------
### Install DingTalk Plugin
Source: https://docs.openclaw.ai/plugins/community
Installs the '@largezhou/ddingtalk' plugin for integrating OpenClaw with DingTalk enterprise robots using Stream mode. It supports text, image, and file messages.
```bash
openclaw plugins install @largezhou/ddingtalk
```
--------------------------------
### Configure Claude CLI as Backend Provider
Source: https://docs.openclaw.ai/providers/anthropic
Sets up the OpenClaw agent to use the local Claude CLI binary for model inference. Includes examples for default configuration and custom binary paths.
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "claude-cli/claude-sonnet-4-6",
      },
      models: {
        "claude-cli/claude-sonnet-4-6": {},
      },
      sandbox: { mode: "off" },
    },
  },
}
```
```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "claude-cli": {
          command: "/opt/homebrew/bin/claude",
        },
      },
    },
  },
}
```
--------------------------------
### Publish a Single Skill using ClawHub CLI
Source: https://docs.openclaw.ai/tools/clawhub
Provides an example of publishing a single skill to the ClawHub registry. This command requires specifying the skill's path, slug, name, version, and tags.
```bash
clawhub publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0 --tags latest
```
--------------------------------
### Install Tlon Plugin from Local Checkout
Source: https://docs.openclaw.ai/channels/tlon
Installs the Tlon plugin from a local git repository checkout. This is useful for development or when using a specific unreleased version of the plugin.
```bash
openclaw plugins install ./extensions/tlon
```
--------------------------------
### Initialize DNS Server for Wide-Area Discovery
Source: https://docs.openclaw.ai/gateway/bonjour
Automatically installs and configures CoreDNS on the gateway host to serve discovery records for the specified domain.
```bash
openclaw dns setup --apply
```
--------------------------------
### Install gateway services per profile
Source: https://docs.openclaw.ai/gateway/multiple-gateways
Shows the command to install the OpenClaw gateway as a service for specific profiles, ensuring each instance is managed independently.
```bash
openclaw --profile main gateway install
openclaw --profile rescue gateway install
```
--------------------------------
### Generate and Install Shell Completion Scripts
Source: https://docs.openclaw.ai/cli/completion
This snippet demonstrates how to generate shell completion scripts for the 'openclaw' CLI and install them into your shell profile. It supports different shells like zsh, bash, fish, and powershell. The `--install` flag automatically adds the necessary configuration to your shell's profile file.
```bash
openclaw completion --shell zsh
openclaw completion --shell fish --install
openclaw completion --shell bash --install
```
--------------------------------
### Anthropic Setup Token Authentication
Source: https://docs.openclaw.ai/gateway/authentication
Authenticates with Anthropic using a setup token obtained from the `claude setup-token` command. This flow is used for subscription-based authentication with Anthropic. The token is then provided to OpenClaw via a command.
```bash
claude setup-token
openclaw models auth setup-token --provider anthropic
```
--------------------------------
### Windows PowerShell Installer
Source: https://docs.openclaw.ai/help/faq
Installs OpenClaw on Windows using a PowerShell script. Note that the install.ps1 script may not have a dedicated -Verbose flag yet, and debugging is enabled manually.
```powershell
# install.ps1 has no dedicated -Verbose flag yet.
Set-PSDebug -Trace 1
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
Set-PSDebug -Trace 0
```
--------------------------------
### Start and Verify Ollama Service
Source: https://docs.openclaw.ai/providers/ollama
Commands to initialize the Ollama server and verify that the API is reachable via a local curl request.
```bash
ollama serve
curl http://localhost:11434/api/tags
```
--------------------------------
### Registering a Custom Context Engine
Source: https://docs.openclaw.ai/plugins/architecture
Demonstrates how to register a custom context engine using api.registerContextEngine. The example shows both a standalone engine that handles its own compaction and one that delegates compaction to the runtime.
```typescript
export default function (api) {
  api.registerContextEngine("lossless-claw", () => ({
    info: { id: "lossless-claw", name: "Lossless Claw", ownsCompaction: true },
    async ingest() {
      return { ingested: true };
    },
    async assemble({ messages }) {
      return { messages, estimatedTokens: 0 };
    },
    async compact() {
      return { ok: true, compacted: false };
    },
  }));
}
```
```typescript
import { delegateCompactionToRuntime } from "openclaw/plugin-sdk/core";
export default function (api) {
  api.registerContextEngine("my-memory-engine", () => ({
    info: {
      id: "my-memory-engine",
      name: "My Memory Engine",
      ownsCompaction: false,
    },
    async ingest() {
      return { ingested: true };
    },
    async assemble({ messages }) {
      return { messages, estimatedTokens: 0 };
    },
    async compact(params) {
      return await delegateCompactionToRuntime(params);
    },
  }));
}
```
--------------------------------
### Send Message with Buttons using 'message action=send'
Source: https://docs.openclaw.ai/channels/mattermost
This example demonstrates how to send a message with buttons using the 'message action=send' command. It specifies the channel, target, and the buttons as a 2D array, where each button has text and a callback data identifier.
```shell
message action=send channel=mattermost target=channel:<channelId> buttons=[[{"text":"Yes","callback_data":"yes"},{"text":"No","callback_data":"no"}]]
```
--------------------------------
### Non-interactive Openclaw Initialization with Gemini API Key
Source: https://docs.openclaw.ai/providers/google
This command performs a non-interactive setup for Openclaw, specifying local mode, Google API key authentication, and the Gemini API key. It's useful for automated or script-based deployments.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice google-api-key \
  --gemini-api-key "$GEMINI_API_KEY"
```
--------------------------------
### Update OpenClaw to Development Channel
Source: https://docs.openclaw.ai/help/faq
Updates the OpenClaw installation to the development channel by switching to the 'main' branch and building from source. This command is used after an initial installation.
```bash
openclaw update --channel dev
```
--------------------------------
### Configure Qwen as Default with Cheapest and Fastest Variants
Source: https://docs.openclaw.ai/providers/huggingface
This example sets Qwen3 8B as the default model and also configures its 'cheapest' and 'fastest' variants. Aliases are provided for each.
```json5
{
  agents: {
    defaults: {
      model: { primary: "huggingface/Qwen/Qwen3-8B" },
      models: {
        "huggingface/Qwen/Qwen3-8B": { alias: "Qwen3 8B" },
        "huggingface/Qwen/Qwen3-8B:cheapest": { alias: "Qwen3 8B (cheapest)" },
        "huggingface/Qwen/Qwen3-8B:fastest": { alias: "Qwen3 8B (fastest)" },
      },
    },
  },
}
```
--------------------------------
### Reference Environment Variables in Configuration
Source: https://docs.openclaw.ai/help/environment
Illustrates how to use environment variables within configuration file values using the `${VAR_NAME}` syntax. This allows for dynamic configuration based on the runtime environment.
```json5
{
  models: {
    providers: {
      "vercel-gateway": {
        apiKey: "${VERCEL_GATEWAY_API_KEY}",
      },
    },
  },
}
```
--------------------------------
### CLI Setup for Anthropic API Key in OpenClaw
Source: https://docs.openclaw.ai/providers/anthropic
Demonstrates how to onboard and configure OpenClaw to use an Anthropic API key via the command-line interface. This can be done interactively or non-interactively by providing the API key directly.
```bash
openclaw onboard
# choose: Anthropic API key
# or non-interactive
openclaw onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```
--------------------------------
### OpenClaw Web Search Tool Usage Examples
Source: https://docs.openclaw.ai/tools/web
Examples of using the OpenClaw web search tool with different parameters. These snippets showcase basic searches, country and language-specific searches, filtering by freshness, date ranges, and domain filtering. They require the web_search function to be available in the environment.
```javascript
// Basic search
await web_search({ query: "OpenClaw plugin SDK" });
```
```javascript
// German-specific search
await web_search({ query: "TV online schauen", country: "DE", language: "de" });
```
```javascript
// Recent results (past week)
await web_search({ query: "AI developments", freshness: "week" });
```
```javascript
// Date range
await web_search({
  query: "climate research",
  date_after: "2024-01-01",
  date_before: "2024-06-30",
});
```
```javascript
// Domain filtering (Perplexity only)
await web_search({
  query: "product reviews",
  domain_filter: ["-reddit.com", "-pinterest.com"],
});
```
--------------------------------
### Set Elevated Mode via Slash Command
Source: https://docs.openclaw.ai/tools/elevated
Examples of using slash commands to control Elevated Mode. The first example sets the mode for the entire session, while the second applies it only to a single message.
```bash
/elevated full
```
```bash
/elevated on run the deployment script
```
--------------------------------
### OpenRouter / Sonar Compatibility Configuration
Source: https://docs.openclaw.ai/tools/perplexity-search
Configuration example for using Perplexity via OpenRouter/Sonar compatibility with OpenClaw.
```APIDOC
## OpenRouter / Sonar Compatibility Configuration
### Description
This configuration allows OpenClaw to use Perplexity through OpenRouter or Sonar compatibility.
### Method
N/A (Configuration)
### Endpoint
N/A (Configuration)
### Parameters
N/A
### Request Example
```json
{
  "plugins": {
    "entries": {
      "perplexity": {
        "config": {
          "webSearch": {
            "apiKey": "<openrouter-api-key>",
            "baseUrl": "https://openrouter.ai/api/v1",
            "model": "perplexity/sonar-pro"
          }
        }
      }
    }
  },
  "tools": {
    "web": {
      "search": {
        "provider": "perplexity"
      }
    }
  }
}
```
### Response
N/A (Configuration)
```
--------------------------------
### Cron Job Management CLI
Source: https://docs.openclaw.ai/automation/cron-jobs
Examples of using the Openclaw CLI to add, list, and run cron jobs.
```APIDOC
## Cron Job Management CLI
### Description
This section provides examples of using the `openclaw cron` command-line interface to manage cron jobs. You can add new jobs, list existing ones, and manually trigger their execution.
### Commands
#### Add a One-Shot Reminder Job
This command adds a one-shot job that will run at a specific time and then delete itself.
```bash
openclaw cron add \
  --name "Reminder" \
  --at "2026-02-01T16:00:00Z" \
  --session main \
  --system-event "Reminder: check the cron docs draft" \
  --wake now \
  --delete-after-run
```
#### List All Cron Jobs
This command lists all currently scheduled cron jobs.
```bash
openclaw cron list
```
#### Run a Specific Cron Job
This command manually triggers the execution of a cron job using its ID.
```bash
openclaw cron run <job-id>
```
#### View Runs for a Specific Job
This command shows the execution history for a given cron job ID.
```bash
openclaw cron runs --id <job-id>
```
#### Schedule a Recurring Isolated Job with Delivery
This command schedules a recurring job that runs in an isolated session and announces its completion via Slack.
```bash
openclaw cron add \
  --name "Morning brief" \
  --cron "0 7 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Summarize overnight updates." \
  --announce \
  --channel slack \
  --to "channel:C1234567890"
```
### Parameters
- `--name` (string): A human-readable name for the cron job.
- `--at` (string): The specific timestamp (ISO 8601 format) for a one-shot job.
- `--cron` (string): A cron expression for scheduling recurring jobs (e.g., "0 7 * * *").
- `--tz` (string): The timezone for the cron schedule (e.g., "America/Los_Angeles").
- `--session` (string): The session target for the job ('main', 'isolated', 'current', 'session:<custom-id>').
- `--system-event` (string): The system event payload for 'main' session jobs.
- `--message` (string): The message payload for 'isolated' session jobs.
- `--wake` (string): Specifies when the job should wake ('now' or 'next heartbeat').
- `--delete-after-run` (boolean): If true, the job is deleted after successful execution (default for one-shot jobs).
- `--announce` (boolean): If true, the job's completion will be announced.
- `--channel` (string): The channel type for delivery (e.g., 'slack').
- `--to` (string): The destination for the delivery (e.g., 'channel:C1234567890').
### Notes
- Legacy jobs with `notify: true` and `cron.webhook` set will be migrated to webhook delivery mode.
- Use `openclaw doctor --fix` to normalize legacy cron store fields.
```
--------------------------------
### Example HEARTBEAT.md Content (Markdown)
Source: https://docs.openclaw.ai/gateway/heartbeat
This is an example of the content for a HEARTBEAT.md file. This file serves as a 'heartbeat checklist' for the agent, containing small, stable, and safe items to be included in heartbeat checks. The content can include reminders or checklists, and the agent will skip running the heartbeat if the file is effectively empty.
```markdown
# Heartbeat checklist
- Quick scan: anything urgent in inboxes?
- If it’s daytime, do a lightweight check-in if nothing else is pending.
- If a task is blocked, write down _what is missing_ and ask Peter next time.
```
--------------------------------
### Configure OpenClaw Daemon
Source: https://docs.openclaw.ai/install/digitalocean
Runs the interactive onboarding wizard to configure authentication, channels, and systemd daemon registration.
```bash
openclaw onboard --install-daemon
```
--------------------------------
### Mattermost Multi-Account Configuration
Source: https://docs.openclaw.ai/channels/mattermost
JSON configuration example for setting up multiple Mattermost accounts within the application. This allows for distinct connections and bot tokens for different Mattermost instances.
```json
{
  "channels": {
    "mattermost": {
      "accounts": {
        "default": { "name": "Primary", "botToken": "mm-token", "baseUrl": "https://chat.example.com" },
        "alerts": { "name": "Alerts", "botToken": "mm-token-2", "baseUrl": "https://alerts.example.com" }
      }
    }
  }
}
```
--------------------------------
### Enable MiniMax via OAuth CLI
Source: https://docs.openclaw.ai/providers/minimax
Commands to enable the MiniMax plugin and initiate the OAuth onboarding process. This method is recommended for users with a MiniMax Coding Plan as it avoids manual API key management.
```bash
openclaw plugins enable minimax
openclaw gateway restart
openclaw onboard --auth-choice minimax-portal
```
--------------------------------
### Gateway and System Status Operations
Source: https://docs.openclaw.ai/cli
Commands to start the WebSocket Gateway and check the health and usage status of the system.
```bash
openclaw gateway --port 8080 --bind lan
openclaw status --usage
openclaw health --json
```
--------------------------------
### Brave Search API Configuration Example (JSON5)
Source: https://docs.openclaw.ai/tools/brave-search
This JSON5 configuration demonstrates how to set up the Brave Search API as a web search provider within OpenClaw. It specifies the API key, default search parameters like max results and timeout, and provider settings.
```json5
{
  plugins: {
    entries: {
      brave: {
        config: {
          webSearch: {
            apiKey: "BRAVE_API_KEY_HERE",
          },
        },
      },
    },
  },
  tools: {
    web: {
      search: {
        provider: "brave",
        maxResults: 5,
        timeoutSeconds: 30,
      },
    },
  },
}
```
--------------------------------
### Trigger Wake Action via Webhook
Source: https://docs.openclaw.ai/automation/webhook
This example demonstrates how to send a POST request to the /hooks/wake endpoint to trigger an immediate action. It requires an Authorization header and a JSON payload specifying the text and mode.
```bash
curl -X POST http://127.0.0.1:18789/hooks/wake \
  -H 'Authorization: Bearer SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"text":"New email received","mode":"now"}'
```
--------------------------------
### Modularize Configuration with Includes
Source: https://docs.openclaw.ai/gateway/configuration
Demonstrates how to split large configuration files into smaller, manageable pieces using the $include directive. Supports single file replacement, array-based merging, and nested includes.
```json5
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/a.json5", "./clients/b.json5"],
  },
}
```
--------------------------------
### Brave Search API Usage Examples (JavaScript)
Source: https://docs.openclaw.ai/tools/brave-search
These JavaScript examples illustrate how to perform various types of searches using the `web_search` function with the Brave Search API. They cover country and language-specific searches, recent result filtering, and date range queries.
```javascript
// Country and language-specific search
await web_search({
  query: "renewable energy",
  country: "DE",
  language: "de",
});
```
```javascript
// Recent results (past week)
await web_search({
  query: "AI news",
  freshness: "week",
});
```
```javascript
// Date range search
await web_search({
  query: "AI developments",
  date_after: "2024-01-01",
  date_before: "2024-06-30",
});
```
--------------------------------
### Troubleshoot 'openclaw' not found: Check Node.js and PATH
Source: https://docs.openclaw.ai/install
Diagnose why the 'openclaw' command might not be recognized after installation. This involves checking Node.js installation, the location of global npm packages, and verifying if the global binary directory is included in the system's PATH environment variable.
```bash
node -v
npm prefix -g
echo "$PATH"
```
--------------------------------
### Define Bedrock Provider and Model in OpenClaw
Source: https://docs.openclaw.ai/providers/bedrock
Example configuration for adding an Amazon Bedrock provider and a specific model to the OpenClaw configuration file.
```json5
{
  models: {
    providers: {
      "amazon-bedrock": {
        baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
        api: "bedrock-converse-stream",
        auth: "aws-sdk",
        models: [
          {
            id: "us.anthropic.claude-opus-4-6-v1:0",
            name: "Claude Opus 4.6 (Bedrock)",
            reasoning: true,
            input: ["text", "image"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 200000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
  agents: {
    defaults: {
      model: { primary: "amazon-bedrock/us.anthropic.claude-opus-4-6-v1:0" },
    },
  },
}
```
--------------------------------
### Trigger Agent Action via Webhook
Source: https://docs.openclaw.ai/automation/webhook
This example shows how to send a POST request to the /hooks/agent endpoint to initiate an agent-based task. It requires an x-openclaw-token header and a JSON payload with the message, name, and wakeMode.
```bash
curl -X POST http://127.0.0.1:18789/hooks/agent \
  -H 'x-openclaw-token: SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"message":"Summarize inbox","name":"Email","wakeMode":"next-heartbeat"}'
```
--------------------------------
### Build and Launch Docker Compose
Source: https://docs.openclaw.ai/install/docker-vm-runtime
Commands to build the Docker image and launch the OpenClaw gateway service using Docker Compose. It also includes troubleshooting tips for memory issues during installation and verification steps for the gateway.
```bash
docker compose build
docker compose up -d openclaw-gateway
```
--------------------------------
### Debug OpenClaw Service and Permissions
Source: https://docs.openclaw.ai/install/ansible
Commands to inspect systemd logs, verify directory permissions, and attempt a manual service start as the openclaw user.
```bash
sudo journalctl -u openclaw -n 100
sudo ls -la /opt/openclaw
sudo -i -u openclaw
cd ~/openclaw
openclaw gateway run
```
--------------------------------
### Spawn ACP agents via slash commands
Source: https://docs.openclaw.ai/tools/acp-agents
Examples of using the /acp spawn command to initialize agents with different modes and threading configurations.
```text
/acp spawn codex --mode persistent --thread auto
/acp spawn codex --mode oneshot --thread off
/acp spawn codex --thread here
```
--------------------------------
### Configure apply_patch Tool
Source: https://docs.openclaw.ai/tools/exec
Configures the apply_patch subtool for the exec tool. This example shows how to enable it only for specific models and within the workspace.
```json5
{
  tools: {
    exec: {
      applyPatch: { workspaceOnly: true, allowModels: ["gpt-5.2"] },
    },
  },
}
```
--------------------------------
### Install Tlon Plugin via CLI
Source: https://docs.openclaw.ai/channels/tlon
Installs the Tlon plugin from the npm registry using the OpenClaw CLI. This is the standard method for adding the Tlon functionality to your OpenClaw instance.
```bash
openclaw plugins install @openclaw/tlon
```
--------------------------------
### Onboard Model Studio Coding Plan
Source: https://docs.openclaw.ai/providers/modelstudio
Commands to initialize the Model Studio provider using the subscription-based Coding plan for either China or Global regions.
```bash
# China endpoint
openclaw onboard --auth-choice modelstudio-api-key-cn
# Global/Intl endpoint
openclaw onboard --auth-choice modelstudio-api-key
```
--------------------------------
### Install Wecom Plugin
Source: https://docs.openclaw.ai/plugins/community
Installs the '@wecom/wecom-openclaw-plugin' for OpenClaw Enterprise WeCom Channel integration. This bot plugin uses WeCom AI Bot WebSocket connections and supports direct messages, group chats, streaming replies, and proactive messaging.
```bash
openclaw plugins install @wecom/wecom-openclaw-plugin
```
--------------------------------
### Unit Testing Channel Plugins
Source: https://docs.openclaw.ai/plugins/sdk-testing
Shows how to test channel plugin setup and account inspection logic, ensuring secrets are not exposed during inspection.
```typescript
import { describe, it, expect } from "vitest";
describe("my-channel plugin", () => {
  it("should resolve account from config", () => {
    const cfg = { channels: { "my-channel": { token: "test-token", allowFrom: ["user1"] } } };
    const account = myPlugin.setup.resolveAccount(cfg, undefined);
    expect(account.token).toBe("test-token");
  });
  it("should inspect account without materializing secrets", () => {
    const cfg = { channels: { "my-channel": { token: "test-token" } } };
    const inspection = myPlugin.setup.inspectAccount(cfg, undefined);
    expect(inspection.configured).toBe(true);
    expect(inspection.tokenStatus).toBe("available");
    expect(inspection).not.toHaveProperty("token");
  });
});
```
--------------------------------
### Manage Gateway and Pairing
Source: https://docs.openclaw.ai/channels/feishu
Commands to start the OpenClaw gateway and approve user pairing requests for bot interaction.
```bash
openclaw gateway
openclaw pairing list feishu
openclaw pairing approve feishu <CODE>
```
--------------------------------
### Switch to Nix Configuration
Source: https://docs.openclaw.ai/install/nix
This command applies the Nix configuration managed by Home Manager. It's used after setting up the flake and configuring secrets to activate the OpenClaw installation.
```bash
home-manager switch
```
--------------------------------
### Example: Email Triage with Lobster
Source: https://docs.openclaw.ai/tools/lobster
Compares email triage without Lobster to a streamlined process using Lobster.
```APIDOC
## Example: Email triage
Without Lobster:
```
User: "Check my email and draft replies"
→ openclaw calls gmail.list
→ LLM summarizes
→ User: "draft replies to #2 and #5"
→ LLM drafts
→ User: "send #2"
→ openclaw calls gmail.send
(repeat daily, no memory of what was triaged)
```
With Lobster:
```json
{
  "action": "run",
  "pipeline": "email.triage --limit 20",
  "timeoutMs": 30000
}
```
Returns a JSON envelope (truncated):
```json
{
  "ok": true,
  "status": "needs_approval",
  "output": [{ "summary": "5 need replies, 2 need action" }],
  "requiresApproval": {
    "type": "approval_request",
    "prompt": "Send 2 draft replies?",
    "items": [],
    "resumeToken": "..."
  }
}
```
User approves → resume:
```json
{
  "action": "resume",
  "token": "<resumeToken>",
  "approve": true
}
```
One workflow. Deterministic. Safe.
```
--------------------------------
### Implement and Test Hook Handlers
Source: https://docs.openclaw.ai/automation/hooks
Examples for creating a hook handler with logging and writing unit tests for handlers using Vitest.
```typescript
const handler: HookHandler = async (event) => {
  console.log("[my-handler] Triggered:", event.type, event.action);
};
```
```typescript
import { test } from "vitest";
import myHandler from "./hooks/my-hook/handler.js";
test("my handler works", async () => {
  const event = { type: "command", action: "new", sessionKey: "test-session", timestamp: new Date(), messages: [], context: { foo: "bar" } };
  await myHandler(event);
});
```
--------------------------------
### Configuring Default CLI Backends
Source: https://docs.openclaw.ai/gateway/cli-backends
Shows how to configure default CLI backends, specifically for 'claude-cli', within the OpenClaw configuration file. This example illustrates setting the command path for the CLI executable.
```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "claude-cli": {
          command: "/opt/homebrew/bin/claude",
        },
      },
    },
  },
}
```
--------------------------------
### List Available VM Images
Source: https://docs.openclaw.ai/install/azure
Lists available Ubuntu server images from Canonical to help in selecting a specific version for VM deployment. This is useful for reproducibility when the 'latest' tag is not desired.
```bash
az vm image list \
  --publisher Canonical --offer ubuntu-24_04-lts \
  --sku server --all -o table
```
--------------------------------
### Per-Agent Heartbeat Configuration Example
Source: https://docs.openclaw.ai/gateway/heartbeat
Demonstrates how to configure heartbeats for specific agents, overriding global defaults. This example shows how to enable heartbeats only for the 'ops' agent with a different frequency and target, while the 'main' agent does not run heartbeats.
```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last", // explicit delivery to last contact (default is "none")
      },
    },
    list: [
      { id: "main", default: true },
      {
        id: "ops",
        heartbeat: {
          every: "1h",
          target: "whatsapp",
          to: "+15551234567",
          prompt: "Read HEARTBEAT.md if it exists (workspace context). Follow it strictly. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply HEARTBEAT_OK.",
        },
      },
    ],
  },
}
```
--------------------------------
### Initialize gcloud CLI
Source: https://docs.openclaw.ai/install/gcp
Authenticates the local machine with Google Cloud Platform to enable command-line management of cloud resources.
```bash
gcloud init
gcloud auth login
```
--------------------------------
### Non-Interactive Onboarding
Source: https://docs.openclaw.ai/providers/together
Perform a non-interactive onboarding of the Together AI provider, suitable for automated setups.
```APIDOC
## Non-Interactive Onboarding for Together AI
### Description
This command allows for non-interactive onboarding of the Together AI provider, useful for scripting and automated environments. It sets the default model and provides the API key directly.
### Method
CLI Command
### Endpoint
N/A
### Parameters
#### CLI Arguments
- `--non-interactive` - Flag - Enables non-interactive mode.
- `--mode` (string) - Required - Sets the operational mode, e.g., `local`.
- `--auth-choice` (string) - Required - Specifies the authentication method, e.g., `together-api-key`.
- `--together-api-key` (string) - Required - Your Together AI API key.
### Request Example
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice together-api-key \
  --together-api-key "$TOGETHER_API_KEY"
```
### Response
N/A
```
--------------------------------
### Define UI Hints for Configuration Fields
Source: https://docs.openclaw.ai/plugins/manifest
The uiHints object maps configuration field names to metadata for UI rendering. This example demonstrates how to label a sensitive API key field with help text and a placeholder.
```json
{
  "uiHints": {
    "apiKey": {
      "label": "API key",
      "help": "Used for OpenRouter requests",
      "placeholder": "sk-or-v1-...",
      "sensitive": true
    }
  }
}
```
--------------------------------
### GET /tools/catalog
Source: https://docs.openclaw.ai/gateway/protocol
Fetches the runtime tool catalog for an agent, including provenance metadata and tool grouping.
```APIDOC
## GET /tools/catalog
### Description
Fetches the runtime tool catalog for an agent. The response includes grouped tools and provenance metadata.
### Method
GET
### Endpoint
/tools/catalog
### Parameters
None
### Response
#### Success Response (200)
- **tools** (array) - List of available tools
- **source** (string) - 'core' or 'plugin'
- **pluginId** (string) - Owner ID if source is 'plugin'
- **optional** (boolean) - Whether the tool is optional
#### Response Example
{
  "tools": [
    { "name": "example_tool", "source": "core", "optional": false }
  ]
}
```
--------------------------------
### Verify Binaries and Gateway
Source: https://docs.openclaw.ai/install/docker-vm-runtime
Commands to verify that the installed binaries (gog, goplaces, wacli) are accessible within the running OpenClaw gateway container and to check the gateway's log output for confirmation of successful startup.
```bash
docker compose exec openclaw-gateway which gog
docker compose exec openclaw-gateway which goplaces
docker compose exec openclaw-gateway which wacli
```
```bash
docker compose logs -f openclaw-gateway
```
--------------------------------
### Configure Synology Chat Channel
Source: https://docs.openclaw.ai/channels/synology-chat
Example configuration for the Synology Chat channel, including token, webhook URL, and DM policy settings.
```json5
{
  channels: {
    "synology-chat": {
      enabled: true,
      token: "synology-outgoing-token",
      incomingUrl: "https://nas.example.com/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=...",
      webhookPath: "/webhook/synology",
      dmPolicy: "allowlist",
      allowedUserIds: ["123456"],
      rateLimitPerMinute: 30,
      allowInsecureSsl: false
    }
  }
}
```
--------------------------------
### Perplexity Search API Configuration
Source: https://docs.openclaw.ai/tools/perplexity-search
Configuration example for using the native Perplexity Search API with OpenClaw.
```APIDOC
## Native Perplexity Search API Configuration
### Description
This configuration enables OpenClaw to use the native Perplexity Search API.
### Method
N/A (Configuration)
### Endpoint
N/A (Configuration)
### Parameters
N/A
### Request Example
```json
{
  "plugins": {
    "entries": {
      "perplexity": {
        "config": {
          "webSearch": {
            "apiKey": "pplx-..."
          }
        }
      }
    }
  },
  "tools": {
    "web": {
      "search": {
        "provider": "perplexity"
      }
    }
  }
}
```
### Response
N/A (Configuration)
```
--------------------------------
### Configure Shared Sandbox and Tool Profiles
Source: https://docs.openclaw.ai/tools/multi-agent-sandbox-tools
Shows how to configure a shared sandbox workspace for work-related tasks and how to apply tool profiles to agents to manage permission sets efficiently.
```json
{
  "agents": {
    "list": [
      {
        "id": "personal",
        "workspace": "~/.openclaw/workspace-personal",
        "sandbox": { "mode": "off" }
      },
      {
        "id": "work",
        "workspace": "~/.openclaw/workspace-work",
        "sandbox": {
          "mode": "all",
          "scope": "shared",
          "workspaceRoot": "/tmp/work-sandboxes"
        },
        "tools": {
          "allow": ["read", "write", "apply_patch", "exec"],
          "deny": ["browser", "gateway", "discord"]
        }
      }
    ]
  }
}
```
```json
{
  "tools": { "profile": "coding" },
  "agents": {
    "list": [
      {
        "id": "support",
        "tools": { "profile": "messaging", "allow": ["slack"] }
      }
    ]
  }
}
```
--------------------------------
### Install Codex App Server Bridge Plugin
Source: https://docs.openclaw.ai/plugins/community
Installs the 'openclaw-codex-app-server' plugin, which provides an independent OpenClaw bridge for Codex App Server conversations. This plugin allows binding chats to Codex threads and controlling them with chat-native commands.
```bash
openclaw plugins install openclaw-codex-app-server
```
--------------------------------
### Configure Gemini Embedding Models
Source: https://docs.openclaw.ai/reference/memory-config
Sets up native Gemini embedding providers. Includes examples for standard models and the preview model with configurable output dimensionality.
```json5
agents: {
  defaults: {
    memorySearch: {
      provider: "gemini",
      model: "gemini-embedding-001",
      remote: {
        apiKey: "YOUR_GEMINI_API_KEY"
      }
    }
  }
}
```
```json5
agents: {
  defaults: {
    memorySearch: {
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      outputDimensionality: 3072,
      remote: {
        apiKey: "YOUR_GEMINI_API_KEY"
      }
    }
  }
}
```
--------------------------------
### Configure Headless WSL2 Auto-start
Source: https://docs.openclaw.ai/platforms/windows
Commands to enable user services to persist without login and configure Windows to boot WSL2 automatically at system startup.
```bash
sudo loginctl enable-linger "$(whoami)"
openclaw gateway install
```
```powershell
schtasks /create /tn "WSL Boot" /tr "wsl.exe -d Ubuntu --exec /bin/true" /sc onstart /ru SYSTEM
wsl --list --verbose
```
--------------------------------
### Openclaw Skills CLI Commands
Source: https://docs.openclaw.ai/cli/skills
A collection of bash commands for managing Openclaw skills. These commands allow users to search for skills on ClawHub, install or update specific skills with version control, list available skills locally, and check skill configurations. Installation commands target the active workspace's 'skills/' directory.
```bash
openclaw skills search "calendar"
openclaw skills install <slug>
openclaw skills install <slug> --version <version>
openclaw skills update <slug>
openclaw skills update --all
openclaw skills list
openclaw skills list --eligible
openclaw skills info <name>
openclaw skills check
```
--------------------------------
### POST /onboard
Source: https://docs.openclaw.ai/providers/google
Initializes the Google Gemini provider authentication using an API key.
```APIDOC
## POST /onboard
### Description
Configures the OpenClaw environment to use the Google Gemini API provider.
### Method
POST
### Endpoint
/onboard
### Parameters
#### Query Parameters
- **auth-choice** (string) - Required - Must be set to 'google-api-key'
### Request Example
openclaw onboard --auth-choice google-api-key
### Response
#### Success Response (200)
- **status** (string) - Authentication successful and provider configured.
```
--------------------------------
### Manage OpenClaw Gateway Service on Windows
Source: https://docs.openclaw.ai/platforms/windows
Commands to install the gateway service on native Windows and check its status in JSON format.
```powershell
openclaw gateway install
openclaw gateway status --json
```
--------------------------------
### Manage Openclaw Node Host Service (Bash)
Source: https://docs.openclaw.ai/cli/node
Provides commands to manage the status, start, stop, restart, and uninstall the Openclaw node host service.
```bash
openclaw node status
openclaw node stop
openclaw node restart
openclaw node uninstall
```
--------------------------------
### Configure and run multiple gateways using profiles
Source: https://docs.openclaw.ai/gateway/multiple-gateways
Demonstrates how to initialize and start multiple OpenClaw gateway instances using the --profile flag to automatically handle state and configuration isolation.
```bash
# main
openclaw --profile main setup
openclaw --profile main gateway --port 18789
# rescue
openclaw --profile rescue setup
openclaw --profile rescue gateway --port 19001
```
--------------------------------
### MiniMax M2.7 as Fallback Configuration
Source: https://docs.openclaw.ai/providers/minimax
Example configuration for setting MiniMax M2.7 as a fallback model in OpenClaw.
```APIDOC
## MiniMax M2.7 as Fallback Configuration
### Description
This configuration demonstrates how to set MiniMax M2.7 as a fallback model, ensuring that if your primary model (e.g., Opus) is unavailable, the request will be routed to MiniMax.
### Method
JSON configuration
### Endpoint
N/A (Configuration setting)
### Parameters
N/A
### Request Example
```json5
{
  env: { MINIMAX_API_KEY: "sk-..." },
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": { alias: "primary" },
        "minimax/MiniMax-M2.7": { alias: "minimax" },
      },
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["minimax/MiniMax-M2.7"],
      },
    },
  },
}
```
### Response
This configuration enables a failover mechanism to MiniMax M2.7.
```
--------------------------------
### Install Zalo Personal Plugin - OpenClaw CLI
Source: https://docs.openclaw.ai/channels/zalouser
Installs the Zalo Personal plugin for OpenClaw AI using the command-line interface. This plugin enables the automation of personal Zalo accounts.
```bash
openclaw plugins install @openclaw/zalouser
```
```bash
openclaw plugins install ./extensions/zalouser
```
--------------------------------
### Execute Background Command with Polling
Source: https://docs.openclaw.ai/tools/exec
Starts a command in the background and then polls for its completion. This is suitable for long-running tasks like builds.
```json
{"tool":"exec","command":"npm run build","yieldMs":1000}
```
```json
{"tool":"process","action":"poll","sessionId":"<id>"}
```
--------------------------------
### GET /exec
Source: https://docs.openclaw.ai/tools/exec
Retrieves the current execution session defaults, including host, security, ask, and node configurations.
```APIDOC
## GET /exec
### Description
Returns the current session-specific execution configuration.
### Method
GET
### Endpoint
/exec
### Response
#### Success Response (200)
- **host** (string) - The current execution host (gateway, sandbox, or node).
- **security** (string) - The current security policy (e.g., allowlist, full).
- **ask** (string) - Approval requirement status (on-miss, etc.).
- **node** (string) - The currently bound node identifier.
#### Response Example
{
  "host": "gateway",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```
--------------------------------
### MiniMax M2.7 (API Key) Configuration
Source: https://docs.openclaw.ai/providers/minimax
Guide to configuring the MiniMax M2.7 model using an API key for Anthropic-compatible API access.
```APIDOC
## MiniMax M2.7 (API Key) Configuration
### Description
This method is for setting up the hosted MiniMax M2.7 model with an Anthropic-compatible API. Configuration is done via the CLI.
### Method
CLI configuration
### Endpoint
`https://api.minimax.io/anthropic` (default for Anthropic-compatible API)
### Parameters
N/A (Configuration is done interactively or via JSON)
### Request Example
Configure via CLI:
1. Run `openclaw configure`.
2. Select **Model/auth**.
3. Choose a **MiniMax** auth option.
Example configuration JSON:
```json5
{
  env: { MINIMAX_API_KEY: "sk-..." },
  agents: { defaults: { model: { primary: "minimax/MiniMax-M2.7" } } },
  models: {
    mode: "merge",
    providers: {
      minimax: {
        baseUrl: "https://api.minimax.io/anthropic",
        apiKey: "${MINIMAX_API_KEY}",
        api: "anthropic-messages",
        models: [
          {
            id: "MiniMax-M2.7",
            name: "MiniMax M2.7",
            reasoning: true,
            input: ["text"],
            cost: { input: 0.3, output: 1.2, cacheRead: 0.03, cacheWrite: 0.12 },
            contextWindow: 200000,
            maxTokens: 8192,
          },
          {
            id: "MiniMax-M2.7-highspeed",
            name: "MiniMax M2.7 Highspeed",
            reasoning: true,
            input: ["text"],
            cost: { input: 0.3, output: 1.2, cacheRead: 0.03, cacheWrite: 0.12 },
            contextWindow: 200000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```
### Response
Successful configuration will allow you to use MiniMax models.
### Notes
* Model refs are `minimax/<model>`.
* Default text model: `MiniMax-M2.7`.
* Alternate text model: `MiniMax-M2.7-highspeed`.
```
--------------------------------
### Define Secret Providers Configuration
Source: https://docs.openclaw.ai/gateway/secrets
Example configuration for defining multiple secret providers including environment variables, local files, and external executable resolvers.
```json5
{
  secrets: {
    providers: {
      default: { source: "env" },
      filemain: {
        source: "file",
        path: "~/.openclaw/secrets.json",
        mode: "json",
      },
      vault: {
        source: "exec",
        command: "/usr/local/bin/openclaw-vault-resolver",
        args: ["--profile", "prod"],
        passEnv: ["PATH", "VAULT_ADDR"],
        jsonOnly: true,
      },
    },
    defaults: {
      env: "default",
      file: "filemain",
      exec: "vault",
    },
    resolution: {
      maxProviderConcurrency: 4,
      maxRefsPerProvider: 512,
      maxBatchBytes: 262144,
    },
  },
}
```
--------------------------------
### JSON Output for Listing Sessions
Source: https://docs.openclaw.ai/cli/sessions
Provides an example of the JSON output when listing sessions with the `--all-agents --json` flags. This structured output details the session stores, agent IDs, paths, and session information, useful for programmatic access.
```json
{
  "path": null,
  "stores": [
    { "agentId": "main", "path": "/home/user/.openclaw/agents/main/sessions/sessions.json" },
    { "agentId": "work", "path": "/home/user/.openclaw/agents/work/sessions/sessions.json" }
  ],
  "allAgents": true,
  "count": 2,
  "activeMinutes": null,
  "sessions": [
    { "agentId": "main", "key": "agent:main:main", "model": "gpt-5" },
    { "agentId": "work", "key": "agent:work:main", "model": "claude-opus-4-6" }
  ]
}
```
--------------------------------
### Verify Venice AI Setup
Source: https://docs.openclaw.ai/providers/venice
Tests the connection to a specific Venice model by sending a test message through the OpenClaw agent.
```bash
openclaw agent --model venice/kimi-k2-5 --message "Hello, are you working?"
```
--------------------------------
### Perform Web Search with Content Extraction using Exa
Source: https://docs.openclaw.ai/tools/exa-search
This JavaScript example demonstrates how to perform a web search using the Exa provider within OpenClaw. It includes specifying the search query, search type, and enabling content extraction for text, highlights, and summaries.
```javascript
await web_search({
  query: "transformer architecture explained",
  type: "neural",
  contents: {
    text: true, // full page text
    highlights: { numSentences: 3 }, // key sentences
    summary: true, // AI summary
  },
});
```
--------------------------------
### Plugin Management Commands
Source: https://docs.openclaw.ai/cli/plugins
A collection of CLI commands for managing OpenClaw plugins, including listing, installing, enabling, and updating plugins.
```APIDOC
## CLI Commands for Plugins
### Description
Use these commands to manage Gateway plugins, hook packs, and compatible bundles within the OpenClaw environment.
### Commands
- **list**: List all installed plugins.
- **install <path-or-spec>**: Install a new plugin from a path or specification.
- **inspect <id>**: View details of a specific plugin.
- **enable <id>**: Activate a disabled plugin.
- **disable <id>**: Deactivate an active plugin.
- **uninstall <id>**: Remove an installed plugin.
- **doctor**: Run diagnostic checks on plugin configurations.
- **update <id>**: Update a specific plugin or use --all for all plugins.
- **marketplace list <marketplace>**: List available plugins from a specific marketplace.
### Requirements
- Native plugins must include an `openclaw.plugin.json` file.
- Bundled plugins are shipped with OpenClaw but require manual activation via `plugins enable`.
```
--------------------------------
### Configure LINE Channel Access Token and Secret
Source: https://docs.openclaw.ai/channels/line
Configuration examples for setting up LINE channel access token and secret in OpenClaw, using JSON5 format. Supports direct values or file paths.
```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "LINE_CHANNEL_ACCESS_TOKEN",
      channelSecret: "LINE_CHANNEL_SECRET",
      dmPolicy: "pairing",
    },
  },
}
```
```json5
{
  channels: {
    line: {
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
    },
  },
}
```
```json5
{
  channels: {
    line: {
      accounts: {
        marketing: {
          channelAccessToken: "...",
          channelSecret: "...",
          webhookPath: "/line/marketing",
        },
      },
    },
  },
}
```
--------------------------------
### Initialize Openclaw with Google Gemini API Key
Source: https://docs.openclaw.ai/providers/google
This command initializes Openclaw and sets up authentication using a Google API key. It's the first step to connect to Google's Gemini models.
```bash
openclaw onboard --auth-choice google-api-key
```
--------------------------------
### Configure Nostr Channel in JSON5
Source: https://docs.openclaw.ai/channels/nostr
Example configuration for the Nostr channel, including profile metadata and access control policies.
```json5
{
  channels: {
    nostr: {
      privateKey: "${NOSTR_PRIVATE_KEY}",
    },
  },
}
```
```json5
{
  channels: {
    nostr: {
      privateKey: "${NOSTR_PRIVATE_KEY}",
      profile: {
        name: "openclaw",
        displayName: "OpenClaw",
        about: "Personal assistant DM bot",
        picture: "https://example.com/avatar.png",
        banner: "https://example.com/banner.png",
        website: "https://example.com",
        nip05: "openclaw@example.com",
        lud16: "openclaw@example.com",
      },
    },
  },
}
```
```json5
{
  channels: {
    nostr: {
      privateKey: "${NOSTR_PRIVATE_KEY}",
      dmPolicy: "allowlist",
      allowFrom: ["npub1abc...", "npub1xyz..."],
    },
  },
}
```
--------------------------------
### Configure Agent Environment Variables
Source: https://docs.openclaw.ai/help/faq
Example configuration snippet for defining model providers and environment variables within the OpenClaw agent configuration.
```javascript
models: { "zai/glm-5": {} },
},
},
env: { ZAI_API_KEY: "..." }
```
--------------------------------
### GET /browser/snapshot
Source: https://docs.openclaw.ai/tools/browser
Retrieves the current state of the browser as a stable UI tree or pixel-based screenshot.
```APIDOC
## GET /browser/snapshot
### Description
Returns a stable representation of the current page UI (AI or ARIA tree) or a visual screenshot for analysis.
### Method
GET
### Endpoint
/browser/snapshot
### Parameters
#### Query Parameters
- **type** (string) - Optional - The format of the snapshot: "tree" (default) or "screenshot".
- **profile** (string) - Optional - The browser profile to use (e.g., "openclaw", "chrome").
### Request Example
GET /browser/snapshot?type=tree
### Response
#### Success Response (200)
- **data** (object) - The UI tree structure or base64 image data.
#### Response Example
{
  "data": { "id": "root", "children": [...] }
}
```
--------------------------------
### Configure Multi-Account Matrix Setup
Source: https://docs.openclaw.ai/channels/matrix
Defines a Matrix channel configuration with multiple named accounts. It specifies a default account and configures individual accounts with their own homeserver, access tokens, and specific DM policies. This allows OpenClaw to manage different Matrix identities and access controls.
```json
{
  "channels": {
    "matrix": {
      "enabled": true,
      "defaultAccount": "assistant",
      "dm": {"policy": "pairing"},
      "accounts": {
        "assistant": {
          "homeserver": "https://matrix.example.org",
          "accessToken": "syt_assistant_xxx",
          "encryption": true
        },
        "alerts": {
          "homeserver": "https://matrix.example.org",
          "accessToken": "syt_alerts_xxx",
          "dm": {
            "policy": "allowlist",
            "allowFrom": ["@ops:example.org"]
          }
        }
      }
    }
  }
}
```
--------------------------------
### Onboard AI Providers via CLI
Source: https://docs.openclaw.ai/start/wizard-cli-automation
Configures OpenClaw in local mode using specific provider API keys or custom endpoints. These commands use the --non-interactive flag for automated setup.
```bash
openclaw onboard --non-interactive --mode local --auth-choice gemini-api-key --gemini-api-key "$GEMINI_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice zai-api-key --zai-api-key "$ZAI_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice ai-gateway-api-key --ai-gateway-api-key "$AI_GATEWAY_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice cloudflare-ai-gateway-api-key --cloudflare-ai-gateway-account-id "your-account-id" --cloudflare-ai-gateway-gateway-id "your-gateway-id" --cloudflare-ai-gateway-api-key "$CLOUDFLARE_AI_GATEWAY_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice moonshot-api-key --moonshot-api-key "$MOONSHOT_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice mistral-api-key --mistral-api-key "$MISTRAL_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice synthetic-api-key --synthetic-api-key "$SYNTHETIC_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice opencode-zen --opencode-zen-api-key "$OPENCODE_API_KEY" --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice ollama --custom-model-id "qwen3.5:27b" --accept-risk --gateway-port 18789 --gateway-bind loopback
```
```bash
openclaw onboard --non-interactive --mode local --auth-choice custom-api-key --custom-base-url "https://llm.example.com/v1" --custom-model-id "foo-large" --custom-api-key "$CUSTOM_API_KEY" --custom-provider-id "my-custom" --custom-compatibility anthropic --gateway-port 18789 --gateway-bind loopback
```
```bash
export CUSTOM_API_KEY="your-key"
openclaw onboard --non-interactive --mode local --auth-choice custom-api-key --custom-base-url "https://llm.example.com/v1" --custom-model-id "foo-large" --secret-input-mode ref --custom-provider-id "my-custom" --custom-compatibility anthropic --gateway-port 18789 --gateway-bind loopback
```
--------------------------------
### Common CLI Configuration Commands
Source: https://docs.openclaw.ai/cli/onboard
Essential commands for managing the OpenClaw environment after initial setup. Use these to update configuration settings or add new agents to the project.
```bash
openclaw configure
openclaw agents add <name>
```
--------------------------------
### Execute OpenClaw Ansible Playbook
Source: https://docs.openclaw.ai/install/ansible
Commands to install required Ansible collections and execute the deployment playbook, either via the helper script or directly with sudo privileges.
```bash
ansible-galaxy collection install -r requirements.yml
./run-playbook.sh
# Alternative execution
ansible-playbook playbook.yml --ask-become-pass
```
--------------------------------
### Generate Diffs via Unified Patch
Source: https://docs.openclaw.ai/tools/diffs
Example input for generating a diff using a standard unified patch format.
```json
{
  "patch": "diff --git a/src/example.ts b/src/example.ts\n--- a/src/example.ts\n+++ b/src/example.ts\n@@ -1 +1 @@\n-const x = 1;\n+const x = 2;\n",
  "mode": "both"
}
```
--------------------------------
### GET /healthz
Source: https://docs.openclaw.ai/install/docker
Checks the liveness of the OpenClaw AI container.
```APIDOC
## GET /healthz
### Description
Returns the liveness status of the container. This endpoint is unauthenticated.
### Method
GET
### Endpoint
http://127.0.0.1:18789/healthz
### Response
#### Success Response (200)
- **status** (string) - Returns OK if the container is alive.
```
--------------------------------
### Configure Twitch Plugin
Source: https://docs.openclaw.ai/channels/twitch
Configuration examples for the Twitch plugin, including basic channel settings, access control using user IDs, and advanced token refresh settings.
```json5
{
  channels: {
    twitch: {
      enabled: true,
      username: "openclaw",
      accessToken: "oauth:abc123...",
      clientId: "xyz789...",
      channel: "vevisk",
      allowFrom: ["123456789"]
    }
  }
}
```
```json5
{
  channels: {
    twitch: {
      clientSecret: "your_client_secret",
      refreshToken: "your_refresh_token"
    }
  }
}
```
--------------------------------
### Minimal JSON5 Configuration
Source: https://docs.openclaw.ai/gateway/configuration
An example of a basic OpenClaw configuration file using JSON5 syntax. It defines default workspace paths and restricts WhatsApp channel access to specific phone numbers.
```json5
// ~/.openclaw/openclaw.json
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```
--------------------------------
### Implement OpenClaw Channel Plugin with TypeScript
Source: https://docs.openclaw.ai/plugins/sdk-channel-plugins
Builds a `ChannelPlugin` object using the OpenClaw SDK in TypeScript. This example demonstrates setting up account resolution, inspecting account status, configuring DM security, pairing, threading, and outbound message sending using a platform API client.
```typescript
import {
  createChatChannelPlugin,
  createChannelPluginBase,
} from "openclaw/plugin-sdk/core";
import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
import { acmeChatApi } from "./client.js"; // your platform API client
type ResolvedAccount = {
  accountId: string | null;
  token: string;
  allowFrom: string[];
  dmPolicy: string | undefined;
};
function resolveAccount(
  cfg: OpenClawConfig,
  accountId?: string | null,
): ResolvedAccount {
  const section = (cfg.channels as Record<string, any>)?.["acme-chat"];
  const token = section?.token;
  if (!token) throw new Error("acme-chat: token is required");
  return {
    accountId: accountId ?? null,
    token,
    allowFrom: section?.allowFrom ?? [],
    dmPolicy: section?.dmSecurity,
  };
}
export const acmeChatPlugin = createChatChannelPlugin<ResolvedAccount>({
  base: createChannelPluginBase({
    id: "acme-chat",
    setup: {
      resolveAccount,
      inspectAccount(cfg, accountId) {
        const section =
          (cfg.channels as Record<string, any>)?.["acme-chat"];
        return {
          enabled: Boolean(section?.token),
          configured: Boolean(section?.token),
          tokenStatus: section?.token ? "available" : "missing",
        };
      },
    },
  }),
  // DM security: who can message the bot
  security: {
    dm: {
      channelKey: "acme-chat",
      resolvePolicy: (account) => account.dmPolicy,
      resolveAllowFrom: (account) => account.allowFrom,
      defaultPolicy: "allowlist",
    },
  },
  // Pairing: approval flow for new DM contacts
  pairing: {
    text: {
      idLabel: "Acme Chat username",
      message: "Send this code to verify your identity:",
      notify: async ({ target, code }) => {
        await acmeChatApi.sendDm(target, `Pairing code: ${code}`);
      },
    },
  },
  // Threading: how replies are delivered
  threading: { topLevelReplyToMode: "reply" },
  // Outbound: send messages to the platform
  outbound: {
    attachedResults: {
      sendText: async (params) => {
        const result = await acmeChatApi.sendMessage(
          params.to,
          params.text,
        );
        return { messageId: result.id };
      },
    },
    base: {
      sendMedia: async (params) => {
        await acmeChatApi.sendFile(params.to, params.filePath);
      },
    },
  },
});
```
--------------------------------
### Build OpenClaw Docker Image
Source: https://docs.openclaw.ai/install/docker
Builds the OpenClaw gateway Docker image locally using the provided setup script. Optionally, you can specify a pre-built image from the GitHub Container Registry.
```bash
./scripts/docker/setup.sh
```
```bash
export OPENCLAW_IMAGE="ghcr.io/openclaw/openclaw:latest"
./scripts/docker/setup.sh
```
--------------------------------
### GET /models/status
Source: https://docs.openclaw.ai/gateway/authentication
Checks the status of configured models and authentication profiles.
```APIDOC
## GET /models/status
### Description
Displays the status of current models, including candidates, next auth profiles, and provider endpoint details.
### Method
GET
### Endpoint
/models/status
### Request Example
`openclaw models status`
### Response
#### Success Response (200)
- **status** (object) - Detailed status report of configured providers and their associated credentials.
```
--------------------------------
### Configure OpenCode API Key
Source: https://docs.openclaw.ai/start/wizard-cli-reference
Prompts for OPENCODE_API_KEY or OPENCODE_ZEN_API_KEY to enable OpenCode access, allowing selection between Zen or Go catalogs.
```shell
export OPENCODE_API_KEY='your-opencode-api-key'
```
```shell
export OPENCODE_ZEN_API_KEY='your-opencode-zen-api-key'
```
--------------------------------
### Configure Interactive Discord Components
Source: https://docs.openclaw.ai/channels/discord
Provides a JSON configuration example for sending interactive components, including action rows with buttons, select menus, and modal forms. It demonstrates how to set reusable components and restrict user access via the allowedUsers property.
```json
{
  channel: "discord",
  action: "send",
  to: "channel:123456789012345678",
  message: "Optional fallback text",
  components: {
    reusable: true,
    text: "Choose a path",
    blocks: [
      {
        type: "actions",
        buttons: [
          {
            label: "Approve",
            style: "success",
            allowedUsers: ["123456789012345678"]
          },
          { label: "Decline", style: "danger" }
        ]
      },
      {
        type: "actions",
        select: {
          type: "string",
          placeholder: "Pick an option",
          options: [
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" }
          ]
        }
      }
    ],
    modal: {
      title: "Details",
      triggerLabel: "Open form",
      fields: [
        { type: "text", label: "Requester" },
        {
          type: "select",
          label: "Priority",
          options: [
            { label: "Low", value: "low" },
            { label: "High", value: "high" }
          ]
        }
      ]
    }
  }
}
```
--------------------------------
### Create macOS VM with Lume
Source: https://docs.openclaw.ai/install/macos-vm
Creates a new macOS virtual machine named 'openclaw' using the latest available IPSW image. This command initiates the download of the macOS image and the VM setup process.
```bash
lume create openclaw --os macos --ipsw latest
```
--------------------------------
### Define HOOK.md Metadata
Source: https://docs.openclaw.ai/automation/hooks
Example of the YAML frontmatter and Markdown structure required for each hook's documentation and metadata.
```markdown
---
name: my-hook
description: "Short description of what this hook does"
homepage: https://docs.openclaw.ai/automation/hooks#my-hook
metadata:
  { "openclaw": { "emoji": "🔗", "events": ["command:new"], "requires": { "bins": ["node"] } } }
---
# My Hook
Detailed documentation goes here...
## What It Does
- Listens for `/new` commands
- Performs some action
- Logs the result
## Requirements
- Node.js must be installed
## Configuration
No configuration needed.
```
--------------------------------
### Manage Skills via CLI
Source: https://docs.openclaw.ai/tools/skills
Common command-line operations for installing and updating skills within an OpenClaw workspace using the native CLI tools.
```bash
# Install a skill into your workspace
openclaw skills install <skill-slug>
# Update all installed skills
openclaw skills update --all
# Sync skills via ClawHub
clawhub sync --all
```
--------------------------------
### Configure Remote CDP URL with Authentication (JSON5)
Source: https://docs.openclaw.ai/tools/browser
This example illustrates how to set the `cdpUrl` for a browser profile to connect to a remote Chromium instance. It shows how to include authentication details like query tokens or HTTP Basic auth directly in the URL.
```json5
// Example with query token
{
  browser: {
    profiles: {
      remote: { cdpUrl: "https://provider.example?token=<token>", color: "#00AA00" },
    }
  }
}
// Example with HTTP Basic auth
{
  browser: {
    profiles: {
      remote: { cdpUrl: "https://user:pass@provider.example", color: "#00AA00" },
    }
  }
}
```
--------------------------------
### Function Call Output Example (JSON)
Source: https://docs.openclaw.ai/gateway/openresponses-http-api
This JSON snippet demonstrates the structure for sending tool results back to the model. It includes the type, call ID, and the output of a function call, which is typically a JSON string.
```json
{
  "type": "function_call_output",
  "call_id": "call_123",
  "output": "{\"temperature\": \"72F\"}"
}
```
--------------------------------
### Testing Plugin Capability Contracts
Source: https://docs.openclaw.ai/plugins/architecture
Example of a contract test to ensure that plugin registration and ownership remain explicit and verified.
```typescript
expect(findVideoGenerationProviderIdsForPlugin("openai")).toEqual(["openai"]);
```
--------------------------------
### GET /tools
Source: https://docs.openclaw.ai/tools/slash-commands
Retrieves a list of tools currently available to the agent in the active conversation.
```APIDOC
## GET /tools
### Description
Returns the runtime tools accessible to the agent. Results are session-scoped and depend on the current agent, channel, and authorization context.
### Method
GET
### Endpoint
/tools
### Parameters
#### Query Parameters
- **mode** (string) - Optional - Set to 'verbose' for short descriptions, or omit for compact view.
### Response
#### Success Response (200)
- **tools** (array) - List of available tools including core, plugin, and channel-owned tools.
#### Response Example
{
  "tools": ["web_search", "calculator", "code_interpreter"]
}
```
--------------------------------
### Initialize Skill Directory
Source: https://docs.openclaw.ai/tools/creating-skills
Creates the necessary directory structure for a new skill within the OpenClaw workspace.
```bash
mkdir -p ~/.openclaw/workspace/skills/hello-world
```
--------------------------------
### Implement Custom Context Engine
Source: https://docs.openclaw.ai/concepts/context-engine
Example implementation of a custom context engine using the OpenClaw plugin API, defining lifecycle methods for ingestion, assembly, and compaction.
```typescript
export default function register(api) {
  api.registerContextEngine("my-engine", () => ({
    info: {
      id: "my-engine",
      name: "My Context Engine",
      ownsCompaction: true,
    },
    async ingest({ sessionId, message, isHeartbeat }) {
      return { ingested: true };
    },
    async assemble({ sessionId, messages, tokenBudget }) {
      return {
        messages: buildContext(messages, tokenBudget),
        estimatedTokens: countTokens(messages),
        systemPromptAddition: "Use lcm_grep to search history...",
      };
    },
    async compact({ sessionId, force }) {
      return { ok: true, compacted: true };
    },
  }));
}
```
--------------------------------
### Configure Sub-agent Tool Access
Source: https://docs.openclaw.ai/tools/subagents
Example configuration for overriding default sub-agent tool permissions. The configuration supports explicit 'deny' lists to restrict access to specific system tools.
```json5
{
  agents: {
    defaults: {
      subagents: {
        maxConcurrent: 1,
      },
    },
  },
  tools: {
    subagents: {
      tools: {
        // deny wins
        deny: ["gateway", "cron"],
      },
    },
  },
}
```
--------------------------------
### Set MiniMax as Fallback Model
Source: https://docs.openclaw.ai/providers/minimax
Example configuration demonstrating how to set a primary model (e.g., Claude Opus) and assign MiniMax M2.7 as a fallback for reliability.
```json5
{
  env: { MINIMAX_API_KEY: "sk-..." },
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": { alias: "primary" },
        "minimax/MiniMax-M2.7": { alias: "minimax" },
      },
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["minimax/MiniMax-M2.7"],
      },
    },
  },
}
```
--------------------------------
### GET /models/auth/order
Source: https://docs.openclaw.ai/gateway/authentication
Retrieves the current authentication profile order for a specific provider.
```APIDOC
## GET /models/auth/order
### Description
Retrieves the configured authentication profile order for a specified provider to determine which credentials are used for API requests.
### Method
GET
### Endpoint
/models/auth/order
### Parameters
#### Query Parameters
- **provider** (string) - Required - The provider name (e.g., anthropic).
### Request Example
`openclaw models auth order get --provider anthropic`
### Response
#### Success Response (200)
- **order** (array) - List of configured auth profiles in priority order.
#### Response Example
{
  "provider": "anthropic",
  "order": ["anthropic:default", "anthropic:work"]
}
```
--------------------------------
### Non-Interactive Ollama Onboarding
Source: https://docs.openclaw.ai/cli/onboard
Shows how to perform non-interactive onboarding with Ollama. This includes specifying the base URL and model ID, with defaults provided for the base URL if not explicitly set.
```bash
openclaw onboard --non-interactive \
  --auth-choice ollama \
  --custom-base-url "http://ollama-host:11434" \
  --custom-model-id "qwen3.5:27b" \
  --accept-risk
```
--------------------------------
### Example .gitignore for Openclaw Workspace
Source: https://docs.openclaw.ai/concepts/agent-workspace
A starter .gitignore file to prevent sensitive or unnecessary files from being committed to your Git repository. It includes common patterns for secrets, environment files, and system-generated files.
```gitignore
.DS_Store
.env
**/*.key
**/*.pem
**/secrets*
```
--------------------------------
### Manage Ollama Models
Source: https://docs.openclaw.ai/providers/ollama
Commands to list currently installed models and pull new ones from the Ollama registry to ensure they are available for use.
```bash
ollama list
ollama pull glm-4.7-flash
ollama pull gpt-oss:20b
ollama pull llama3.3
```
--------------------------------
### SecretRef Contract Example
Source: https://docs.openclaw.ai/gateway/secrets
Demonstrates the universal object shape for SecretRefs, specifying the source, provider, and ID for referencing secrets.
```json
{
  "source": "env" | "file" | "exec",
  "provider": "default",
  "id": "..."
}
```
--------------------------------
### Pre-download QMD Models with Bash
Source: https://docs.openclaw.ai/reference/memory-config
This bash script demonstrates how to manually pre-download QMD models and warm the index used by OpenClaw. It sets the necessary XDG environment variables to ensure QMD uses the same state directory as OpenClaw, then runs update, embed, and query commands.
```bash
# Pick the same state dir OpenClaw uses
STATE_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"
export XDG_CONFIG_HOME="$STATE_DIR/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$STATE_DIR/agents/main/qmd/xdg-cache"
# (Optional) force an index refresh + embeddings
qmd update
qmd embed
# Warm up / trigger first-time model downloads
qmd query "test" -c memory-root --json >/dev/null 2>&1
```
--------------------------------
### GET /nodes/status
Source: https://docs.openclaw.ai/nodes/index
Retrieves the current connection and pairing status of all registered nodes.
```APIDOC
## GET /nodes/status
### Description
Returns a list of all nodes currently connected to the gateway, including their pairing status and identity.
### Method
GET
### Endpoint
/nodes/status
### Parameters
None
### Request Example
N/A
### Response
#### Success Response (200)
- **nodes** (array) - List of node objects containing id, name, and pairing status.
#### Response Example
{
  "nodes": [
    { "id": "node-123", "name": "Build Node", "paired": true }
  ]
}
```
--------------------------------
### Configure OpenClaw Channels
Source: https://docs.openclaw.ai/install/macos-vm
This JSON snippet shows an example configuration for OpenClaw channels, specifically for WhatsApp and Telegram. It includes settings for message policies and bot tokens. Users should edit '~/.openclaw/openclaw.json' to customize their channel settings.
```json
{
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"],
    },
    telegram: {
      botToken: "YOUR_BOT_TOKEN",
    },
  },
}
```
--------------------------------
### Get Channel Information
Source: https://docs.openclaw.ai/cli/message
Retrieves information about a specific channel. Requires the target channel ID.
```bash
openclaw channel info --target channel:1234567890
```
--------------------------------
### Build and Test Plugin (Bash)
Source: https://docs.openclaw.ai/plugins/sdk-migration
Commands to build the plugin using pnpm and then run tests specifically for the migrated plugin. This is the final step after updating imports to ensure the plugin functions correctly.
```bash
pnpm build
pnpm test -- my-plugin/
```
--------------------------------
### Safe Bins vs. Allowlist
Source: https://docs.openclaw.ai/tools/exec-approvals
Compares the goals, matching types, argument scope, typical examples, and best use cases for OpenClaw's safe bins and allowlist features.
```APIDOC
## Safe Bins vs. Allowlist
This section outlines the differences between the `tools.exec.safeBins` feature and the explicit allowlist (`exec-approvals.json`).
### Comparison Table
| Topic            | `tools.exec.safeBins`                                  | Allowlist (`exec-approvals.json`)                            |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| Goal             | Auto-allow narrow stdin filters                        | Explicitly trust specific executables                        |
| Match type       | Executable name + safe-bin argv policy                 | Resolved executable path glob pattern                        |
| Argument scope   | Restricted by safe-bin profile and literal-token rules | Path match only; arguments are otherwise your responsibility |
| Typical examples | `head`, `tail`, `tr`, `wc`                             | `jq`, `python3`, `node`, `ffmpeg`, custom CLIs               |
| Best use         | Low-risk text transforms in pipelines                  | Any tool with broader behavior or side effects               |
### Configuration Locations
*   **`safeBins`**: Configured via `tools.exec.safeBins` (global) or per-agent `agents.list[].tools.exec.safeBins`.
*   **`safeBinTrustedDirs`**: Configured via `tools.exec.safeBinTrustedDirs` (global) or per-agent `agents.list[].tools.exec.safeBinTrustedDirs`.
*   **`safeBinProfiles`**: Configured via `tools.exec.safeBinProfiles` (global) or per-agent `agents.list[].tools.exec.safeBinProfiles`. Per-agent profiles override global ones.
*   **Allowlist entries**: Stored in `~/.openclaw/exec-approvals.json` under `agents.<id>.allowlist` (or managed via Control UI / `openclaw approvals allowlist ...`).
### CLI Auditing and Fixing
*   `openclaw security audit` warns about interpreter/runtime bins in `safeBins` without profiles (`tools.exec.safe_bins_interpreter_unprofiled`).
*   `openclaw doctor --fix` can scaffold empty `safeBinProfiles.<bin>` entries (review and tighten afterward). Interpreter/runtime bins are not auto-scaffolded.
### Custom Profile Example
```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "myfilter"],
      "safeBinProfiles": {
        "myfilter": {
          "minPositional": 0,
          "maxPositional": 0,
          "allowedValueFlags": ["-n", "--limit"],
          "deniedFlags": ["-f", "--file", "-c", "--command"]
        }
      }
    }
  }
}
```
**Note**: Even if `jq` is in `safeBins`, using it with `env` (e.g., `jq -n env`) will still be rejected without an explicit allowlist entry or approval prompt, as the `env` builtin is not trusted by default in safe-bin mode.
```
--------------------------------
### ContextEngine Configuration
Source: https://docs.openclaw.ai/concepts/context-engine
How to configure the active context engine via the OpenClaw configuration file.
```APIDOC
## Configuration: Context Engine Selection
### Description
Use the `plugins.slots.contextEngine` setting to select the active engine for the runtime.
### Configuration Example
```json
{
  "plugins": {
    "slots": {
      "contextEngine": "legacy"
    }
  }
}
```
### Notes
- The `contextEngine` slot is exclusive; only one engine is resolved per run.
- Set `ownsCompaction: true` to implement custom compaction logic, or `false` to delegate to the runtime.
```
--------------------------------
### GET /api/plugins/inspect
Source: https://docs.openclaw.ai/tools/capability-cookbook
Inspects a loaded plugin to retrieve its shape, capability breakdown, and compatibility signals.
```APIDOC
## GET /api/plugins/inspect
### Description
Retrieves the internal shape and capability registration details for a specific plugin ID.
### Method
GET
### Endpoint
/api/plugins/inspect?id={plugin_id}
### Parameters
#### Query Parameters
- **id** (string) - Required - The unique ID of the plugin to inspect
### Request Example
GET /api/plugins/inspect?id=openai
### Response
#### Success Response (200)
- **shape** (string) - The classification of the plugin (e.g., hybrid-capability)
- **capabilities** (array) - List of registered capabilities
- **signal** (string) - Compatibility status signal
#### Response Example
{
  "shape": "hybrid-capability",
  "capabilities": ["text_inference", "speech", "media_understanding"],
  "signal": "config valid"
}
```
--------------------------------
### Markdown to IR Conversion Example
Source: https://docs.openclaw.ai/concepts/markdown-formatting
Illustrates the conversion of a simple Markdown string with bold text and a link into an intermediate representation (IR) containing text, styles, and links.
```markdown
Hello **world** — see [docs](https://docs.openclaw.ai).
```
```json
{
  "text": "Hello world — see docs.",
  "styles": [{ "start": 6, "end": 11, "style": "bold" }],
  "links": [{ "start": 19, "end": 23, "href": "https://docs.openclaw.ai" }]
}
```
--------------------------------
### Manage Agent Skills
Source: https://docs.openclaw.ai/gateway/configuration-reference
Configures how skills are loaded, installed, and enabled. It supports environment variable management and specific skill-level overrides.
```json5
skills: {
  allowBundled: ["gemini", "peekaboo"],
  load: {
    extraDirs: ["~/Projects/agent-scripts/skills"]
  },
  install: {
    preferBrew: true,
    nodeManager: "npm"
  },
  entries: {
    "image-lab": {
      apiKey: { source: "env", provider: "default", id: "GEMINI_API_KEY" },
      env: { GEMINI_API_KEY: "GEMINI_KEY_HERE" }
    },
    peekaboo: { enabled: true },
    sag: { enabled: false }
  }
}
```
--------------------------------
### Bootstrap Matrix Server-Side Backup
Source: https://docs.openclaw.ai/install/migrating-matrix
Initializes a new server-side key backup for future recovery operations if none currently exists.
```bash
openclaw matrix verify bootstrap
```
--------------------------------
### Plugin Manifest with Empty Schema
Source: https://docs.openclaw.ai/plugins/sdk-setup
An example of an openclaw.plugin.json manifest for a plugin that requires no configuration, featuring an empty but valid JSON schema.
```json
{
  "id": "my-plugin",
  "configSchema": {
    "type": "object",
    "additionalProperties": false
  }
}
```
--------------------------------
### Optimize OpenClaw Startup Performance on Linux
Source: https://docs.openclaw.ai/vps
Configures Node.js module compilation caching and disables respawn behavior to reduce startup latency on low-power or ARM-based Linux servers.
```bash
grep -q 'NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache' ~/.bashrc || cat >> ~/.bashrc <<'EOF'
export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache
mkdir -p /var/tmp/openclaw-compile-cache
export OPENCLAW_NO_RESPAWN=1
EOF
source ~/.bashrc
```
--------------------------------
### Generate Diffs via Before and After Text
Source: https://docs.openclaw.ai/tools/diffs
Example input for generating a diff using original and updated text strings.
```json
{
  "before": "# Hello\n\nOne",
  "after": "# Hello\n\nTwo",
  "path": "docs/example.md",
  "mode": "view"
}
```
--------------------------------
### Onboard DeepSeek via CLI
Source: https://docs.openclaw.ai/providers/deepseek
Configures the DeepSeek API key and sets the default model using an interactive command-line prompt.
```bash
openclaw onboard --auth-choice deepseek-api-key
```
--------------------------------
### CLI Configuration Management
Source: https://docs.openclaw.ai/gateway/configuration
One-liner commands to get, set, or unset specific configuration keys. Useful for quick adjustments without opening the configuration file.
```bash
openclaw config get agents.defaults.workspace
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config unset plugins.entries.brave.config.webSearch.apiKey
```
--------------------------------
### Model Selection Commands
Source: https://docs.openclaw.ai/tools/slash-commands
Examples of using the /model directive to list, select, or check the status of available AI models. These commands allow users to switch between model providers and verify current endpoint configurations.
```text
/model
/model list
/model 3
/model openai/gpt-5.2
/model opus@anthropic:default
/model status
```
--------------------------------
### Handle Outbound Media Attachments
Source: https://docs.openclaw.ai/start/openclaw
This example demonstrates how an agent can send outbound media attachments. The `MEDIA:` prefix followed by a URL or local path on a new line indicates that the content should be sent as a media attachment alongside the text message.
```text
Here’s the screenshot.
MEDIA:https://example.com/screenshot.png
```
--------------------------------
### Configure WhatsApp Accounts and Agent Bindings
Source: https://docs.openclaw.ai/concepts/multi-agent
This JSON5 configuration sets up WhatsApp accounts and defines bindings for routing messages to different agents. It includes agent definitions with workspaces and optional agent directories, as well as deterministic routing rules based on channel, account ID, and peer information. Agent-to-agent messaging can also be configured.
```json5
{
  agents: {
    list: [
      {
        id: "home",
        default: true,
        name: "Home",
        workspace: "~/.openclaw/workspace-home",
        agentDir: "~/.openclaw/agents/home/agent",
      },
      {
        id: "work",
        name: "Work",
        workspace: "~/.openclaw/workspace-work",
        agentDir: "~/.openclaw/agents/work/agent",
      },
    ],
  },
  bindings: [
    { agentId: "home", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "biz" } },
    {
      agentId: "work",
      match: {
        channel: "whatsapp",
        accountId: "personal",
        peer: { kind: "group", id: "1203630...@g.us" },
      },
    },
  ],
  tools: {
    agentToAgent: {
      enabled: false,
      allow: ["home", "work"],
    },
  },
  channels: {
    whatsapp: {
      accounts: {
        personal: {
          // authDir: "~/.openclaw/credentials/whatsapp/personal",
        },
        biz: {
          // authDir: "~/.openclaw/credentials/whatsapp/biz",
        },
      },
    },
  },
}
```
--------------------------------
### Set Environment Variable for Discord Bot Token
Source: https://docs.openclaw.ai/channels/discord
Example of setting the Discord bot token as an environment variable for fallback configuration.
```bash
DISCORD_BOT_TOKEN=...
```
--------------------------------
### Update OpenClaw via Package Managers
Source: https://docs.openclaw.ai/install/updating
Manual update instructions for users who installed OpenClaw via npm or pnpm.
```bash
npm i -g openclaw@latest
pnpm add -g openclaw@latest
```
--------------------------------
### Manage OpenClaw Skills
Source: https://docs.openclaw.ai/cli
Commands for interacting with skills, including searching, installing, updating, listing, and retrieving information about skills from ClawHub.
```bash
openclaw skills search [query...]
openclaw skills install <slug>
openclaw skills update <slug|--all>
openclaw skills list
openclaw skills info <name>
openclaw skills check
```
--------------------------------
### Configure Agent with Full Access (No Sandbox)
Source: https://docs.openclaw.ai/gateway/security
This configuration defines an agent with 'personal' ID that has full access and no sandbox restrictions. It specifies a dedicated workspace for this agent. This setup is suitable for personal agents where unrestricted access is desired.
```json
{
  "agents": {
    "list": [
      {
        "id": "personal",
        "workspace": "~/.openclaw/workspace-personal",
        "sandbox": { "mode": "off" }
      }
    ]
  }
}
```
--------------------------------
### Delegating Compaction to Runtime
Source: https://docs.openclaw.ai/tools/capability-cookbook
Shows how to register a context engine that does not own the compaction algorithm, delegating it to the runtime using `delegateCompactionToRuntime`.
```APIDOC
## Register Context Engine with Delegated Compaction
### Description
Register a context engine that does not handle its own compaction. The `compact` function should delegate to the runtime using `delegateCompactionToRuntime`.
### Method
`api.registerContextEngine(id, factory)`
### Parameters
- **id** (string) - Required - A unique identifier for the context engine.
- **factory** (function) - Required - A function that returns the context engine object.
### Context Engine Object (Partial)
- **info.ownsCompaction** (boolean) - Set to `false`.
- **compact** (function) - Required - Delegates compaction to the runtime.
### Request Example
```javascript
import { delegateCompactionToRuntime } from "openclaw/plugin-sdk/core";
export default function (api) {
  api.registerContextEngine("my-memory-engine", () => ({
    info: {
      id: "my-memory-engine",
      name: "My Memory Engine",
      ownsCompaction: false,
    },
    async ingest() {
      return { ingested: true };
    },
    async assemble({ messages }) {
      return { messages, estimatedTokens: 0 };
    },
    async compact(params) {
      return await delegateCompactionToRuntime(params);
    },
  }));
}
```
```
--------------------------------
### Heartbeat Configuration Example (JSON5)
Source: https://docs.openclaw.ai/automation/cron-vs-heartbeat
Configuration for the heartbeat mechanism in JSON5 format. It specifies the interval, alert delivery target, and active hours for heartbeats.
```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m", // interval
        target: "last", // explicit alert delivery target (default is "none")
        activeHours: { start: "08:00", end: "22:00" }, // optional
      },
    },
  },
}
```
--------------------------------
### Initialize and Pair OpenClaw Gateway
Source: https://docs.openclaw.ai/platforms/ios
Commands to start the gateway service and manage device pairing requests. These steps are required to establish a secure connection between the iOS app and the host machine.
```bash
openclaw gateway --port 18789
openclaw devices list
openclaw devices approve <requestId>
```
--------------------------------
### GET /v1/models
Source: https://docs.openclaw.ai/providers/huggingface
Retrieves a list of available AI models and their configurations. This endpoint is used to hydrate model display names and to get the full list of model IDs for provider selection.
```APIDOC
## GET /v1/models
### Description
Retrieves a list of available AI models, including their IDs, names, and other relevant configuration details. This endpoint is crucial for dynamically updating model display names in the UI and CLI, and for understanding the full catalog of models supported by the router.
### Method
GET
### Endpoint
/v1/models
### Parameters
#### Query Parameters
- **provider** (string) - Optional - Filters models by a specific provider.
- **search** (string) - Optional - Filters models by a search query.
### Request Example
```
GET /v1/models
```
### Response
#### Success Response (200)
- **data** (array) - A list of model objects.
  - **id** (string) - The unique identifier for the model.
  - **object** (string) - The type of object returned (e.g., "model").
  - **created** (integer) - Timestamp of model creation.
  - **owned_by** (string) - The owner of the model.
  - **permission** (array) - Permissions associated with the model.
  - **root** (string) - The root model ID.
  - **parent** (string) - The parent model ID, if applicable.
  - **name** (string) - The display name of the model.
  - **description** (string) - A brief description of the model.
  - **tags** (array) - Tags associated with the model.
#### Response Example
```json
{
  "data": [
    {
      "id": "deepseek-ai/DeepSeek-R1",
      "object": "model",
      "created": 1677610602,
      "owned_by": "owner",
      "permission": [],
      "root": "deepseek-ai/DeepSeek-R1",
      "parent": null,
      "name": "DeepSeek R1",
      "description": "A powerful language model.",
      "tags": ["text-generation", "large-language-model"]
    }
  ],
  "object": "list"
}
```
```
--------------------------------
### Private/LAN Homeservers Configuration
Source: https://docs.openclaw.ai/channels/matrix
Instructions and examples for configuring OpenClaw to connect to private or LAN-based Matrix homeservers, including enabling `allowPrivateNetwork`.
```APIDOC
## Private/LAN homeservers
By default, OpenClaw blocks private/internal Matrix homeservers for SSRF protection unless you
explicitly opt in per account.
If your homeserver runs on localhost, a LAN/Tailscale IP, or an internal hostname, enable
`allowPrivateNetwork` for that Matrix account:
```json5
{
  "channels": {
    "matrix": {
      "homeserver": "http://matrix-synapse:8008",
      "allowPrivateNetwork": true,
      "accessToken": "syt_internal_xxx",
    },
  },
}
```
CLI setup example:
```bash
openclaw matrix account add \
  --account ops \
  --homeserver http://matrix-synapse:8008 \
  --allow-private-network \
  --access-token syt_ops_xxx
```
This opt-in only allows trusted private/internal targets. Public cleartext homeservers such as
`http://matrix.example.org:8008` remain blocked. Prefer `https://` whenever possible.
```
--------------------------------
### Configure Audio Processing for Deepgram or Mistral
Source: https://docs.openclaw.ai/nodes/audio
Examples for configuring specific cloud providers like Deepgram or Mistral for audio transcription tasks.
```json5
{
  tools: {
    media: {
      audio: {
        enabled: true,
        models: [{ provider: "deepgram", model: "nova-3" }],
      },
    },
  },
}
```
```json5
{
  tools: {
    media: {
      audio: {
        enabled: true,
        models: [{ provider: "mistral", model: "voxtral-mini-latest" }],
      },
    },
  },
}
```
--------------------------------
### Onboard and install a rescue bot instance
Source: https://docs.openclaw.ai/gateway/multiple-gateways
Provides the workflow for setting up a secondary 'rescue' bot instance with isolated configuration and ports to ensure system redundancy.
```bash
# Main bot
openclaw onboard
openclaw gateway install
# Rescue bot
openclaw --profile rescue onboard
openclaw --profile rescue gateway install
```
--------------------------------
### Reset OpenClaw System
Source: https://docs.openclaw.ai/help/faq
Commands to reset the OpenClaw installation. Includes options for interactive, non-interactive full resets, and re-onboarding.
```bash
openclaw reset
openclaw reset --scope full --yes --non-interactive
openclaw onboard --install-daemon
```
--------------------------------
### Health Check Request and Response
Source: https://docs.openclaw.ai/concepts/typebox
Example of a simple `health` method request and its corresponding success response.
```APIDOC
## POST /health (WebSocket)
### Description
Requests the health status of the Gateway.
### Method
WebSocket Frame (Request)
### Endpoint
WebSocket Connection
### Request Body
- **type** (string) - Required - Must be "req".
- **id** (string) - Required - Unique identifier for the request.
- **method** (string) - Required - Must be "health".
### Request Example
```json
{ "type": "req", "id": "r1", "method": "health" }
```
### Response
#### Success Response (200)
- **type** (string) - Description: Must be "res".
- **id** (string) - Description: The ID of the original `health` request.
- **ok** (boolean) - Description: True if the request was successful.
- **payload** (object) - Description: The health status payload.
  - **ok** (boolean) - Description: Indicates if the Gateway is healthy.
#### Response Example
```json
{ "type": "res", "id": "r1", "ok": true, "payload": { "ok": true } }
```
```
--------------------------------
### Sending Files in Group Chats/Channels
Source: https://docs.openclaw.ai/channels/msteams
Explains the process and setup required for sending files in group chats and channels, which differs from DMs due to storage and permissions.
```APIDOC
## Sending Files in Group Chats/Channels
Bots can send files in DMs using the FileConsentCard flow. However, sending files in group chats/channels requires additional setup involving uploading to SharePoint and sharing a link.
### Method
N/A (Conceptual process)
### Endpoint
N/A
### Parameters
N/A
### Request Body
N/A
### Response
N/A
## Setup for Group Chats/Channels
To send files in group chats/channels, you need to configure your application with Microsoft Graph API permissions and obtain a SharePoint Site ID.
### 1. Add Graph API Permissions
In Entra ID (Azure AD) → App Registration, add the following Application permissions:
- `Sites.ReadWrite.All`: To upload files to SharePoint.
- `Chat.Read.All` (Optional): Enables per-user sharing links for enhanced security.
### 2. Grant Admin Consent
Ensure that admin consent is granted for the added permissions within the tenant.
### 3. Get SharePoint Site ID
You can obtain the SharePoint Site ID using the Graph API. Replace `{hostname}` and `{site-path}` with your specific details.
#### Request Example (Graph API)
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://graph.microsoft.com/v1.0/sites/{hostname}:/{site-path}"
# Example for a site at "contoso.sharepoint.com/sites/BotFiles"
curl -H "Authorization: Bearer $TOKEN" \
  "https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/BotFiles"
```
#### Response Example (Graph API)
```json
{
  "id": "contoso.sharepoint.com,guid1,guid2"
}
```
### 4. Configure OpenClaw
Update your OpenClaw configuration with the obtained `sharePointSiteId`.
#### Request Example (OpenClaw Config)
```json
{
  "channels": {
    "msteams": {
      "sharePointSiteId": "contoso.sharepoint.com,guid1,guid2"
    }
  }
}
```
### Sharing Behavior
The sharing behavior depends on the Graph API permissions granted:
| Permission                                      | Sharing Behavior                                       |
| ----------------------------------------------- | ------------------------------------------------------ |
| `Sites.ReadWrite.All` only                      | Organization-wide sharing link                         |
| `Sites.ReadWrite.All` + `Chat.Read.All`         | Per-user sharing link (only chat members can access)   |
### Fallback Behavior
| Scenario                                               | Result                                                 |
| ------------------------------------------------------ | ------------------------------------------------------ |
| Group chat + file + `sharePointSiteId` configured      | Upload to SharePoint, send sharing link                |
| Group chat + file + no `sharePointSiteId`              | Attempt OneDrive upload (may fail), send text only     |
| Personal chat + file                                   | FileConsentCard flow (works without SharePoint)        |
| Any context + image                                    | Base64-encoded inline (works without SharePoint)       |
### Files Stored Location
Uploaded files are stored in the `/OpenClawShared/` folder within the configured SharePoint site's default document library.
```
--------------------------------
### Slack Configuration and Manifest
Source: https://docs.openclaw.ai/channels/slack
Guidelines for configuring Slack app manifests and event subscriptions for OpenClaw integration.
```APIDOC
## Slack App Manifest Configuration
### Description
Defines the required scopes and event subscriptions for the OpenClaw Slack application to function correctly.
### Required Scopes
- **bot** (array) - Includes: `chat:write`, `channels:history`, `channels:read`, `assistant:write`, `reactions:write`, `commands`, etc.
### Event Subscriptions
- **bot_events** (array) - Must include: `app_mention`, `message.channels`, `reaction_added`, `reaction_removed`, `member_joined_channel`, `pin_added`.
### Manifest Example
{
  "oauth_config": {
    "scopes": {
      "bot": ["chat:write", "assistant:write", "reactions:write"]
    }
  },
  "settings": {
    "event_subscriptions": {
      "bot_events": ["app_mention", "message.channels"]
    }
  }
}
```
--------------------------------
### Start Local Nostr Relay with Docker
Source: https://docs.openclaw.ai/channels/nostr
Deploys a local strfry relay instance using Docker for development and testing purposes. The relay is exposed on port 7777.
```bash
docker run -p 7777:7777 ghcr.io/hoytech/strfry
```
--------------------------------
### iMessage SSH Wrapper Example
Source: https://docs.openclaw.ai/gateway/configuration-reference
This bash script demonstrates how to create an SSH wrapper for the iMessage CLI. It allows OpenClaw to execute iMessage commands remotely via SSH, facilitating secure communication and attachment fetching.
```bash
#!/usr/bin/env bash
exec ssh -T gateway-host imsg "$@"
```
--------------------------------
### Register Example Proxy Provider in TypeScript
Source: https://docs.openclaw.ai/plugins/architecture
Registers a custom provider named 'example-proxy' with OpenClaw. This includes defining authentication methods, cataloging services, resolving dynamic models, and implementing specific logic for preparing runtime authentication and fetching usage snapshots. It relies on external functions like `exchangeToken` and `fetchExampleProxyUsage`.
```typescript
api.registerProvider({
  id: "example-proxy",
  label: "Example Proxy",
  auth: [],
  catalog: {
    order: "simple",
    run: async (ctx) => {
      const apiKey = ctx.resolveProviderApiKey("example-proxy").apiKey;
      if (!apiKey) {
        return null;
      }
      return {
        provider: {
          baseUrl: "https://proxy.example.com/v1",
          apiKey,
          api: "openai-completions",
          models: [{ id: "auto", name: "Auto" }],
        },
      };
    },
  },
  resolveDynamicModel: (ctx) => ({
    id: ctx.modelId,
    name: ctx.modelId,
    provider: "example-proxy",
    api: "openai-completions",
    baseUrl: "https://proxy.example.com/v1",
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128000,
    maxTokens: 8192,
  }),
  prepareRuntimeAuth: async (ctx) => {
    const exchanged = await exchangeToken(ctx.apiKey);
    return {
      apiKey: exchanged.token,
      baseUrl: exchanged.baseUrl,
      expiresAt: exchanged.expiresAt,
    };
  },
  resolveUsageAuth: async (ctx) => {
    const auth = await ctx.resolveOAuthToken();
    return auth ? { token: auth.token } : null;
  },
  fetchUsageSnapshot: async (ctx) => {
    return await fetchExampleProxyUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn);
  },
});
```
--------------------------------
### Skills Management Commands
Source: https://docs.openclaw.ai/cli/skills
Commands to interact with the skills system, including searching, installing, updating, listing, and checking skills.
```APIDOC
## Skills Management Commands
### Description
This section outlines the various commands available for managing skills within the Openclaw ecosystem. These commands allow users to interact with local skills and manage them from ClawHub.
### Commands
- `openclaw skills search "<query>"`: Searches for skills on ClawHub.
- `openclaw skills install <slug>`: Installs a skill from ClawHub.
- `openclaw skills install <slug> --version <version>`: Installs a specific version of a skill.
- `openclaw skills update <slug>`: Updates a specific installed skill.
- `openclaw skills update --all`: Updates all installed skills.
- `openclaw skills list`: Lists all locally installed skills.
- `openclaw skills list --eligible`: Lists skills eligible for installation or update.
- `openclaw skills info <name>`: Displays detailed information about a specific skill.
- `openclaw skills check`: Checks the status and integrity of installed skills.
### Usage Notes
- `search`, `install`, and `update` commands interact directly with ClawHub and install skills into the active workspace's `skills/` directory.
- `list`, `info`, and `check` commands inspect skills visible to the current workspace and configuration.
```
--------------------------------
### Check npm Global Bin Path (Windows)
Source: https://docs.openclaw.ai/help/faq
Checks the configured prefix for npm global installations. This is useful for troubleshooting 'openclaw is not recognized' errors on Windows by verifying if the npm bin directory is included in the system's PATH.
```powershell
npm config get prefix
```
--------------------------------
### Skills API
Source: https://docs.openclaw.ai/web/control-ui
Endpoints for managing skills, including checking status, enabling/disabling, installing, and updating API keys.
```APIDOC
## GET /skills/status
### Description
Retrieves the status of all installed skills.
### Method
GET
### Endpoint
/skills/status
### Response
#### Success Response (200)
- **skills** (object) - An object mapping skill names to their status.
#### Response Example
```json
{
  "skill-name-1": {
    "status": "enabled"
  },
  "skill-name-2": {
    "status": "disabled"
  }
}
```
## POST /skills/install
### Description
Installs a new skill.
### Method
POST
### Endpoint
/skills/install
### Parameters
#### Request Body
- **skillUrl** (string) - Required - The URL to the skill package.
### Request Example
```json
{
  "skillUrl": "http://example.com/skills/my-skill.zip"
}
```
### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
#### Response Example
```json
{
  "message": "Skill installed successfully."
}
```
```
--------------------------------
### Verify Anthropic Setup Token (Bash)
Source: https://docs.openclaw.ai/help/testing
Verifies the Anthropic Claude Code CLI setup-token integration. This involves setting environment variables to specify the token source (profile or raw value) and the model, then running a live test to ensure the token can complete an Anthropic prompt.
```bash
openclaw models auth paste-token --provider anthropic --profile-id anthropic:setup-token-test
export OPENCLAW_LIVE_SETUP_TOKEN=1
export OPENCLAW_LIVE_SETUP_TOKEN_PROFILE=anthropic:setup-token-test
pnpm test:live src/agents/anthropic.setup-token.live.test.ts
```
```bash
export OPENCLAW_LIVE_SETUP_TOKEN=1
export OPENCLAW_LIVE_SETUP_TOKEN_VALUE=sk-ant-oat01-...
export OPENCLAW_LIVE_SETUP_TOKEN_MODEL=anthropic/claude-opus-4-6
pnpm test:live src/agents/anthropic.setup-token.live.test.ts
```
--------------------------------
### Authenticate with Volcengine API
Source: https://docs.openclaw.ai/providers/volcengine
Uses the Openclaw CLI to initiate the onboarding process and configure the Volcengine API key authentication.
```bash
openclaw onboard --auth-choice volcengine-api-key
```
--------------------------------
### Audit and Configure OpenCLAW Secrets
Source: https://docs.openclaw.ai/cli/secrets
This example demonstrates a common workflow of auditing secrets for plaintext findings and then configuring them. It involves running an audit check, followed by the interactive configuration process, and then re-auditing to confirm resolution.
```bash
openclaw secrets audit --check
openclaw secrets configure
openclaw secrets audit --check
```
--------------------------------
### Initialize OpenClaw Workspace
Source: https://docs.openclaw.ai/reference/AGENTS.default
Commands to create the default workspace directory and populate it with necessary configuration templates for the agent.
```bash
mkdir -p ~/.openclaw/workspace
cp docs/reference/templates/AGENTS.md ~/.openclaw/workspace/AGENTS.md
cp docs/reference/templates/SOUL.md ~/.openclaw/workspace/SOUL.md
cp docs/reference/templates/TOOLS.md ~/.openclaw/workspace/TOOLS.md
```
--------------------------------
### GET /nodes/status
Source: https://docs.openclaw.ai/nodes
Retrieve the current status of all connected nodes.
```APIDOC
## GET /nodes/status
### Description
Returns a list of all nodes currently connected to the gateway and their pairing status.
### Method
GET
### Endpoint
/nodes/status
### Response
#### Success Response (200)
- **nodes** (array) - List of node objects containing id, name, and connection status.
#### Response Example
{
  "nodes": [
    { "id": "node-123", "name": "Build Node", "status": "paired" }
  ]
}
```
--------------------------------
### Define Token in Global .env File
Source: https://docs.openclaw.ai/help/faq
Example of adding a GitHub Copilot token to the global OpenClaw environment file for persistent access across service restarts.
```bash
COPILOT_GITHUB_TOKEN=...
```
--------------------------------
### Tail Gateway logs using OpenClaw CLI
Source: https://docs.openclaw.ai/cli/logs
Demonstrates various ways to tail logs using the openclaw logs command. Includes options for real-time following, JSON formatting, line limiting, and local timezone conversion.
```bash
openclaw logs
openclaw logs --follow
openclaw logs --json
openclaw logs --limit 500
openclaw logs --local-time
openclaw logs --follow --local-time
```
--------------------------------
### Clone Repo and Create Fly App
Source: https://docs.openclaw.ai/install/fly
Clones the Openclaw repository, creates a new application on Fly.io, and provisions a persistent volume for data storage. Ensure you have the Fly.io CLI installed and are logged in.
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
fly apps create my-openclaw
fly volumes create openclaw_data --size 1 --region iad
```
--------------------------------
### Retrieve Structured JSON Output
Source: https://docs.openclaw.ai/tools/browser
Examples of using the --json flag to retrieve structured data from the browser, useful for scripting and automated tooling integration.
```bash
openclaw browser status --json
openclaw browser snapshot --interactive --json
openclaw browser requests --filter api --json
openclaw browser cookies --json
```
--------------------------------
### Configure Moonshot AI Provider (Kimi)
Source: https://docs.openclaw.ai/gateway/configuration-reference
This configuration sets up the Moonshot AI provider for the Kimi K2.5 model. It includes environment variable setup for the API key, default agent configuration, and detailed model parameters such as context window and cost. It also provides an option for the China endpoint.
```json5
{
  env: { MOONSHOT_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "moonshot/kimi-k2.5" },
      models: { "moonshot/kimi-k2.5": { alias: "Kimi K2.5" } },
    },
  },
  models: {
    mode: "merge",
    providers: {
      moonshot: {
        baseUrl: "https://api.moonshot.ai/v1",
        apiKey: "${MOONSHOT_API_KEY}",
        api: "openai-completions",
        models: [
          {
            id: "kimi-k2.5",
            name: "Kimi K2.5",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 256000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Spawn ACP Session via Tool Call
Source: https://docs.openclaw.ai/tools/acp-agents
Example of initiating an ACP session from an agent turn or tool call. The runtime must be explicitly set to 'acp' to trigger the correct session initialization flow.
```json
{
  "task": "Open the repo and summarize failing tests",
  "runtime": "acp",
  "agentId": "codex",
  "thread": true,
  "mode": "session"
}
```
--------------------------------
### Configure Agent Sandbox for Docker
Source: https://docs.openclaw.ai/install/docker
Enables the agent sandbox mode via environment variables before running the setup script. Supports custom Docker socket paths for rootless environments.
```bash
export OPENCLAW_SANDBOX=1
./scripts/docker/setup.sh
```
```bash
export OPENCLAW_SANDBOX=1
export OPENCLAW_DOCKER_SOCKET=/run/user/1000/docker.sock
./scripts/docker/setup.sh
```
--------------------------------
### Configure npm global prefix for Linux
Source: https://docs.openclaw.ai/install/node
Sets up a user-writable directory for global npm packages and updates the PATH accordingly. This resolves EACCES permission errors during global npm installs on Linux systems.
```bash
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
```
--------------------------------
### Get Role Information in Discord
Source: https://docs.openclaw.ai/cli/message
Retrieves information about a specific role in a Discord guild. Requires the guild ID.
```bash
openclaw role info --guild-id 1234567890
```
--------------------------------
### Login to WhatsApp Accounts
Source: https://docs.openclaw.ai/concepts/multi-agent
These bash commands are used to log in and authenticate your WhatsApp accounts with Openclaw. This step is necessary before starting the gateway to ensure proper communication.
```bash
openclaw channels login --channel whatsapp --account personal
openclaw channels login --channel whatsapp --account biz
```
--------------------------------
### Initialize Gateway and Approve Pairing
Source: https://docs.openclaw.ai/channels/telegram
Commands to start the OpenClaw gateway and manage pairing requests. These CLI commands allow the user to list pending pairing requests and approve them using a specific code.
```bash
openclaw gateway
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```
--------------------------------
### Non-interactive Openclaw Onboarding for Together AI
Source: https://docs.openclaw.ai/providers/together
This command provides a non-interactive method to onboard with Together AI using Openclaw. It allows you to specify the API key and set a default model directly from the command line, useful for scripting and automated setups.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice together-api-key \
  --together-api-key "$TOGETHER_API_KEY"
```
--------------------------------
### GET /logs
Source: https://docs.openclaw.ai/cli/logs
Retrieves or tails gateway logs via the OpenClaw CLI. This command supports various flags for real-time monitoring and formatting.
```APIDOC
## GET /logs
### Description
Tail Gateway file logs over RPC. This command is used to stream or retrieve historical logs from the remote gateway.
### Method
GET
### Endpoint
openclaw logs
### Parameters
#### Query Parameters
- **--follow** (boolean) - Optional - Stream logs in real-time.
- **--json** (boolean) - Optional - Output logs in JSON format.
- **--limit** (integer) - Optional - Limit the number of log lines returned.
- **--local-time** (boolean) - Optional - Render timestamps in the local timezone.
### Request Example
openclaw logs --follow --json --limit 100
### Response
#### Success Response (200)
- **log_entry** (string) - The log line content.
#### Response Example
{
  "timestamp": "2023-10-27T10:00:00Z",
  "level": "info",
  "message": "Gateway connection established"
}
```
--------------------------------
### Uninstall Plugin
Source: https://docs.openclaw.ai/cli/plugins
Removes plugin records and optionally files from the Openclaw installation.
```APIDOC
## Uninstall Plugin
### Description
Removes plugin records from `plugins.entries`, `plugins.installs`, the plugin allowlist, and linked `plugins.load.paths` entries. For active memory plugins, the memory slot resets to `memory-core`. By default, uninstall also removes the plugin install directory. Use `--keep-files` to retain files on disk. `--keep-config` is a deprecated alias for `--keep-files`.
### Method
CLI Command
### Endpoint
N/A (CLI command)
### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the plugin to uninstall.
#### Query Parameters
- **--dry-run** (boolean) - Optional - Simulate the uninstall process without making changes.
- **--keep-files** (boolean) - Optional - Prevents the removal of plugin files from the disk.
- **--keep-config** (boolean) - Optional - Deprecated alias for `--keep-files`.
### Request Example
```bash
openclaw plugins uninstall <id>
openclaw plugins uninstall <id> --dry-run
openclaw plugins uninstall <id> --keep-files
```
### Response
(CLI output indicating success or failure of the uninstall operation)
#### Success Response (200)
(Indication that the plugin was successfully uninstalled.)
#### Response Example
(Example CLI output showing successful uninstallation)
```
--------------------------------
### Openclaw Gateway Service Management
Source: https://docs.openclaw.ai/gateway/troubleshooting
Commands to force install and restart the Openclaw gateway service. This is useful for resolving discrepancies between service configuration and runtime states by reinstalling service metadata.
```bash
openclaw gateway install --force
openclaw gateway restart
```
--------------------------------
### Modular Configuration using $include
Source: https://docs.openclaw.ai/gateway/configuration-reference
Demonstrates how to split OpenClaw AI configuration into multiple files using the $include directive. It supports single file replacement, deep-merging of arrays, and nested inclusion up to 10 levels.
```json5
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/mueller.json5", "./clients/schmidt.json5"],
  },
}
```
--------------------------------
### Mount Custom Host Paths into Group Sandboxes
Source: https://docs.openclaw.ai/channels/groups
This configuration extends the sandbox setup by mounting specific host directories into the container, allowing groups to access shared files without granting full filesystem permissions.
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "session",
        workspaceAccess: "none",
        docker: {
          binds: [
            "/home/user/FriendsShared:/data:ro",
          ],
        },
      },
    },
  },
}
```
--------------------------------
### GET /plugins/diffs/view/{artifactId}/{token}
Source: https://docs.openclaw.ai/tools/diffs
Retrieves the diff viewer interface for a specific artifact using a secure tokenized path.
```APIDOC
## GET /plugins/diffs/view/{artifactId}/{token}
### Description
Accesses the rendered diff viewer for a specific artifact. This route is protected by a token and enforces strict CSP policies.
### Method
GET
### Endpoint
/plugins/diffs/view/{artifactId}/{token}
### Parameters
#### Path Parameters
- **artifactId** (string) - Required - The 20-character hex ID of the artifact.
- **token** (string) - Required - The 48-character hex validation token.
### Response
#### Success Response (200)
- **HTML** (text/html) - The rendered viewer interface.
#### Error Response (429)
- **Too Many Requests** - Returned when remote access is enabled and the request rate limit is exceeded.
```
--------------------------------
### Sending Rich Messages with Channel Data
Source: https://docs.openclaw.ai/channels/line
This example demonstrates how to send rich messages, including quick replies, location data, Flex cards, and template messages, using the `channelData.line` object.
```APIDOC
## POST /api/messages (Example)
### Description
Send a message to a LINE user, including rich message types.
### Method
POST
### Endpoint
/api/messages
### Parameters
#### Request Body
- **text** (string) - Required - The main text content of the message.
- **channelData** (object) - Required - Contains LINE-specific channel data.
  - **line** (object) - Required - LINE channel data.
    - **quickReplies** (array of strings) - Optional - An array of quick reply buttons.
    - **location** (object) - Optional - Location data for a map message.
      - **title** (string) - Required - The title of the location.
      - **address** (string) - Required - The address of the location.
      - **latitude** (number) - Required - The latitude coordinate.
      - **longitude** (number) - Required - The longitude coordinate.
    - **flexMessage** (object) - Optional - A Flex Message object.
      - **altText** (string) - Required - Alternative text for the Flex Message.
      - **contents** (object) - Required - The Flex Message content payload.
    - **templateMessage** (object) - Optional - A Template Message object.
      - **type** (string) - Required - The type of template message (e.g., "confirm").
      - **text** (string) - Required - The main text of the template message.
      - **confirmLabel** (string) - Required - The label for the confirm button.
      - **confirmData** (string) - Required - The data associated with the confirm button.
      - **cancelLabel** (string) - Optional - The label for the cancel button.
      - **cancelData** (string) - Optional - The data associated with the cancel button.
### Request Example
```json
{
  "text": "Here you go",
  "channelData": {
    "line": {
      "quickReplies": ["Status", "Help"],
      "location": {
        "title": "Office",
        "address": "123 Main St",
        "latitude": 35.681236,
        "longitude": 139.767125
      },
      "flexMessage": {
        "altText": "Status card",
        "contents": { /* Flex payload */ }
      },
      "templateMessage": {
        "type": "confirm",
        "text": "Proceed?",
        "confirmLabel": "Yes",
        "confirmData": "yes",
        "cancelLabel": "No",
        "cancelData": "no"
      }
    }
  }
}
```
### Response
#### Success Response (200)
- **messageId** (string) - The ID of the sent message.
#### Response Example
```json
{
  "messageId": "1234567890"
}
```
```
--------------------------------
### GET /status
Source: https://docs.openclaw.ai/cli
Retrieves the health status of the linked session and provider usage.
```APIDOC
## GET /status
### Description
Displays linked session health, recent recipients, and provider usage quotas.
### Method
GET
### Endpoint
status
### Parameters
#### Query Parameters
- **json** (boolean) - Optional - Return output in JSON format
- **usage** (boolean) - Optional - Show full provider usage breakdown
### Request Example
openclaw status --usage --json
### Response
#### Success Response (200)
- **health** (object) - Status of gateway and node host
- **usage** (object) - Provider quota information
```
--------------------------------
### Check Xcode and Swift Toolchain Versions
Source: https://docs.openclaw.ai/platforms/mac/dev-setup
Verifies the installed versions of Xcode and the Swift toolchain. This is crucial for ensuring compatibility with the macOS app build, which requires the latest macOS SDK and Swift toolchain.
```bash
xcodebuild -version
sicrun swift --version
```
--------------------------------
### Customize Cron Retention and Log Limits
Source: https://docs.openclaw.ai/automation/cron-jobs
Examples of how to adjust session retention and log pruning settings for different operational requirements, such as high-volume usage or extended audit windows.
```json5
// Keep run sessions for a week and allow bigger run logs
{
  cron: {
    sessionRetention: "7d",
    runLog: {
      maxBytes: "10mb",
      keepLines: 5000
    }
  }
}
```
```json5
// Disable isolated run-session pruning but keep run-log pruning
{
  cron: {
    sessionRetention: false,
    runLog: {
      maxBytes: "5mb",
      keepLines: 3000
    }
  }
}
```
```json5
// Tune for high-volume cron usage
{
  cron: {
    sessionRetention: "12h",
    runLog: {
      maxBytes: "3mb",
      keepLines: 1500
    }
  }
}
```
--------------------------------
### Configure Per-Agent Sandbox and Tool Policies
Source: https://docs.openclaw.ai/concepts/multi-agent
This configuration demonstrates setting up distinct sandbox modes and tool restrictions for different agents. The 'personal' agent has sandboxing turned off, while the 'family' agent is always sandboxed with specific tool limitations and an optional Docker setup command for initial container configuration.
```javascript
{
  agents: {
    list: [
      {
        id: "personal",
        workspace: "~/.openclaw/workspace-personal",
        sandbox: {
          mode: "off",  // No sandbox for personal agent
        },
        // No tool restrictions - all tools available
      },
      {
        id: "family",
        workspace: "~/.openclaw/workspace-family",
        sandbox: {
          mode: "all",     // Always sandboxed
          scope: "agent",  // One container per agent
          docker: {
            // Optional one-time setup after container creation
            setupCommand: "apt-get update && apt-get install -y git curl",
          },
        },
        tools: {
          allow: ["read"],                    // Only read tool
          deny: ["exec", "write", "edit", "apply_patch"],    // Deny others
        },
      },
    ],
  },
}
```
--------------------------------
### Get OpenClaw Gateway Token
Source: https://docs.openclaw.ai/cli/devices
Retrieves the current gateway token configuration. This is part of the token drift recovery checklist.
```bash
openclaw config get gateway.auth.token
```
--------------------------------
### GET /v1/models
Source: https://docs.openclaw.ai/providers/claude-max-api-proxy
Retrieves the list of available Claude models supported by the proxy.
```APIDOC
## GET /v1/models
### Description
Returns a list of available models that can be used with the proxy.
### Method
GET
### Endpoint
http://localhost:3456/v1/models
### Response
#### Success Response (200)
- **data** (array) - List of model objects containing the model ID.
#### Response Example
{
  "data": [
    {"id": "claude-opus-4"},
    {"id": "claude-sonnet-4"},
    {"id": "claude-haiku-4"}
  ]
}
```
--------------------------------
### Verify Browser Session with OpenClaw CLI
Source: https://docs.openclaw.ai/tools/browser
A series of CLI commands to start, check status, list tabs, and take snapshots of an existing browser session. These commands are used to verify that the connection to the browser profile is successful.
```bash
openclaw browser --browser-profile user start
openclaw browser --browser-profile user status
openclaw browser --browser-profile user tabs
openclaw browser --browser-profile user snapshot --format ai
```
--------------------------------
### Apply Full Configuration with openclaw CLI
Source: https://docs.openclaw.ai/gateway/configuration
Applies the entire configuration by replacing the existing one and restarting the Gateway. It requires capturing the base hash from a `config.get` call and provides parameters for session key and restart delay.
```bash
openclaw gateway call config.get --params '{}'  # capture payload.hash
openclaw gateway call config.apply --params '{ 
  "raw": "{ agents: { defaults: { workspace: \"~/.openclaw/workspace\" } } }",
  "baseHash": "<hash>",
  "sessionKey": "agent:main:whatsapp:direct:+15555550123"
}'
```
--------------------------------
### React to Signal Messages
Source: https://docs.openclaw.ai/channels/signal
Examples of using the message action to react to specific Signal messages. These commands support direct messages, group messages, and removing existing reactions.
```text
message action=react channel=signal target=uuid:123e4567-e89b-12d3-a456-426614174000 messageId=1737630212345 emoji=🔥
message action=react channel=signal target=+15551234567 messageId=1737630212345 emoji=🔥 remove=true
message action=react channel=signal target=signal:group:<groupId> targetAuthor=uuid:<sender-uuid> messageId=1737630212345 emoji=✅
```
--------------------------------
### Agent Configuration Format
Source: https://docs.openclaw.ai/cli/agents
Example JSON configuration structure for defining agent identities within the OpenClaw system.
```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "OpenClaw",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/openclaw.png",
        },
      },
    ],
  },
}
```
--------------------------------
### Custom Provider Configuration (Interactive)
Source: https://docs.openclaw.ai/start/wizard-cli-reference
Interactive onboarding for custom providers compatible with OpenAI or Anthropic endpoints. Supports pasting API keys or using secret references.
```shell
Follow the interactive prompts for API key or secret reference input.
```
--------------------------------
### Switching and Setting Default Models in OpenClaw
Source: https://docs.openclaw.ai/help/faq
Demonstrates how to switch between different language models for daily tasks and coding, and how to set a primary default model. It covers quick session switching and persistent default settings.
```bash
/model gpt-5.2
/model openai-codex/gpt-5.4
```
```json5
{
  agents: {
    defaults: {
      model: { primary: "openai/gpt-5.2" },
    }
  }
}
```
--------------------------------
### Configure OpenClaw CLI for Native Windows
Source: https://docs.openclaw.ai/platforms/windows
Commands for using the OpenClaw CLI on Windows without installing the gateway service or skipping health checks.
```powershell
openclaw onboard --non-interactive --skip-health
openclaw gateway run
```
--------------------------------
### Integrating OpenRouter and Z.AI Models in OpenClaw
Source: https://docs.openclaw.ai/help/faq
Provides configuration examples for integrating models from third-party providers like OpenRouter and Z.AI. This includes setting the primary model and defining the model in `agents.defaults.models`, along with necessary environment variables for API keys.
```json5
{
  agents: {
    defaults: {
      model: { primary: "openrouter/anthropic/claude-sonnet-4-6" },
      models: { "openrouter/anthropic/claude-sonnet-4-6": {} },
    },
  },
  env: { OPENROUTER_API_KEY: "sk-or-..." },
}
```
```json5
{
  agents: {
    defaults: {
      model: { primary: "zai/glm-5" },
    },
  },
}
```
--------------------------------
### Deferred Loading Configuration for Channel Plugins
Source: https://docs.openclaw.ai/plugins/sdk-setup
Enables deferred loading for channel plugins by setting 'deferConfiguredChannelFullLoadUntilAfterListen' to true within the 'startup' object in package.json's 'openclaw' field.
```json
{
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "startup": {
      "deferConfiguredChannelFullLoadUntilAfterListen": true
    }
  }
}
```
--------------------------------
### Query Configuration Paths
Source: https://docs.openclaw.ai/cli/config
Demonstrates how to use dot and bracket notation to access nested configuration values or specific array elements.
```bash
openclaw config get agents.defaults.workspace
openclaw config get agents.list[0].id
openclaw config get agents.list
openclaw config set agents.list[1].tools.exec.node "node-id-or-name"
```
--------------------------------
### Start OpenClaw Gateway in Development Mode
Source: https://docs.openclaw.ai/help/debugging
Launches the OpenClaw gateway using a dedicated development profile and dev bootstrap mode. This isolates state, defaults the gateway port, and auto-creates a default configuration and workspace if missing, simplifying debugging.
```bash
pnpm gateway:dev
OPENCLAW_PROFILE=dev openclaw tui
# Or with explicit flags:
OPENCLAW_PROFILE=dev openclaw gateway --dev --reset
```
--------------------------------
### Check Node.js Version
Source: https://docs.openclaw.ai/install/node
This command checks the currently installed Node.js version. OpenClaw requires Node 22.14 or newer, with Node 24 being the recommended default.
```bash
node -v
```
--------------------------------
### SSH into VM Instance
Source: https://docs.openclaw.ai/install/gcp
Establishes a secure shell connection to the provisioned GCP virtual machine.
```bash
gcloud compute ssh openclaw-gateway --zone=us-central1-a
```
--------------------------------
### Gemini Search Configuration
Source: https://docs.openclaw.ai/tools/gemini-search
Configuration settings for enabling Gemini Search with Google Search grounding. This includes API key setup and model selection.
```APIDOC
## Gemini Search Configuration
### Description
Configure the Gemini Search plugin to utilize Google Search grounding for AI-synthesized answers with citations.
### Method
Configuration
### Endpoint
N/A
### Parameters
#### Request Body
- **plugins.entries.google.config.webSearch.apiKey** (string) - Optional - Your Google API key. If not provided, `GEMINI_API_KEY` environment variable will be used.
- **plugins.entries.google.config.webSearch.model** (string) - Optional - The Gemini model to use for search. Defaults to `gemini-2.5-flash`.
- **tools.web.search.provider** (string) - Required - Set to `gemini` to enable Gemini as the web search provider.
### Request Example
```json
{
  "plugins": {
    "entries": {
      "google": {
        "config": {
          "webSearch": {
            "apiKey": "YOUR_GOOGLE_API_KEY",
            "model": "gemini-2.5-flash"
          }
        }
      }
    }
  },
  "tools": {
    "web": {
      "search": {
        "provider": "gemini"
      }
    }
  }
}
```
### Response
#### Success Response (200)
Configuration is applied.
#### Response Example
N/A (Configuration update)
```
--------------------------------
### Configure Audio Processing with Provider and CLI Fallback
Source: https://docs.openclaw.ai/nodes/audio
Sets up audio processing with a primary OpenAI provider and a Whisper CLI fallback. It includes a 20MB file size limit and a 45-second timeout for the CLI execution.
```json5
{
  tools: {
    media: {
      audio: {
        enabled: true,
        maxBytes: 20971520,
        models: [
          { provider: "openai", model: "gpt-4o-mini-transcribe" },
          {
            type: "cli",
            command: "whisper",
            args: ["--model", "base", "{{MediaPath}}"],
            timeoutSeconds: 45,
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Openclaw Gateway with Tailscale Serve
Source: https://docs.openclaw.ai/web/control-ui
Starts the Openclaw gateway with Tailscale Serve enabled, allowing secure access via Tailscale's DNS and HTTPS proxy. It supports authentication via Tailscale identity headers when configured.
```bash
openclaw gateway --tailscale serve
```
--------------------------------
### Configure Local Models Only Setup
Source: https://docs.openclaw.ai/gateway/configuration-examples
Configures the agent to use only local models, specifying the workspace and the primary model. It details the configuration for the LM Studio provider, including API endpoint, key, and model specifics.
```json5
{
  agent: {
    workspace: "~/.openclaw/workspace",
    model: { primary: "lmstudio/minimax-m2.5-gs32" },
  },
  models: {
    mode: "merge",
    providers: {
      lmstudio: {
        baseUrl: "http://127.0.0.1:1234/v1",
        apiKey: "lmstudio",
        api: "openai-responses",
        models: [
          {
            id: "minimax-m2.5-gs32",
            name: "MiniMax M2.5 GS32",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 196608,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Get Member Information
Source: https://docs.openclaw.ai/cli/message
Retrieves information about a specific member. Requires the user ID. For Discord, the guild ID is also required.
```bash
openclaw member info --user-id 1122334455
```
```bash
openclaw member info --guild-id 1234567890 --user-id 1122334455
```
--------------------------------
### Automate OpenClaw Onboarding with Reference-based Auth
Source: https://docs.openclaw.ai/start/wizard-cli-automation
Executes the OpenClaw onboarding process using reference-based secret management. This approach is more secure as it avoids storing plaintext keys in configuration files, relying instead on environment variables.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice openai-api-key \
  --secret-input-mode ref \
  --accept-risk
```
--------------------------------
### Configure Optional One-Time NickServ Registration
Source: https://docs.openclaw.ai/channels/irc
Enable automatic registration with NickServ upon connecting to the IRC network. This is useful for initial setup to register a new nick. It requires setting 'register' to true and providing an email address for the registration process.
```json
{
  "channels": {
    "irc": {
      "nickserv": {
        "register": true,
        "registerEmail": "bot@example.com"
      }
    }
  }
}
```
--------------------------------
### Configure Group Access Control
Source: https://docs.openclaw.ai/channels/msteams
Examples for managing group chat access using allowlists and specific team/channel scoping to control where the bot can interact.
```json5
{
  channels: {
    msteams: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["user@org.com"],
    },
  },
}
```
```json5
{
  channels: {
    msteams: {
      groupPolicy: "allowlist",
      teams: {
        "My Team": {
          channels: {
            General: { requireMention: true },
          },
        },
      },
    },
  },
}
```
--------------------------------
### Configure Model Allowlist in JSON5
Source: https://docs.openclaw.ai/concepts/models
Example configuration for the 'agents.defaults.models' key, which acts as an allowlist for models. This JSON5 snippet demonstrates how to specify primary models and define aliases for different Anthropic Claude models.
```json5
{
  agent: {
    model: { primary: "anthropic/claude-sonnet-4-6" },
    models: {
      "anthropic/claude-sonnet-4-6": { alias: "Sonnet" },
      "anthropic/claude-opus-4-6": { alias: "Opus" },
    },
  },
}
```
--------------------------------
### Non-interactive DeepSeek Configuration
Source: https://docs.openclaw.ai/providers/deepseek
Automates the onboarding process for DeepSeek by passing the API key directly via flags, suitable for CI/CD or automated deployment scripts.
```bash
openclaw onboard --non-interactive --mode local --auth-choice deepseek-api-key --deepseek-api-key "$DEEPSEEK_API_KEY" --skip-health --accept-risk
```
--------------------------------
### Tool Parameters: `run`
Source: https://docs.openclaw.ai/tools/lobster
Details on how to use the `run` action to execute pipelines and workflow files.
```APIDOC
## Tool parameters
### `run`
Run a pipeline in tool mode.
```json
{
  "action": "run",
  "pipeline": "gog.gmail.search --query 'newer_than:1d' | email.triage",
  "cwd": "workspace",
  "timeoutMs": 30000,
  "maxStdoutBytes": 512000
}
```
Run a workflow file with args:
```json
{
  "action": "run",
  "pipeline": "/path/to/inbox-triage.lobster",
  "argsJson": "{\"tag\":\"family\"}"
}
```
```
--------------------------------
### Handle Gmail Pub/Sub Payload
Source: https://docs.openclaw.ai/automation/webhook
This example shows a POST request to a /hooks/gmail endpoint, likely used for processing Gmail notifications. It includes an Authorization header and a JSON payload containing source and message details.
```bash
curl -X POST http://127.0.0.1:18789/hooks/gmail \
  -H 'Authorization: Bearer SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"source":"gmail","messages":[{"from":"Ada","subject":"Hello","snippet":"Hi"}]}'
```
--------------------------------
### POST /config.apply
Source: https://docs.openclaw.ai/gateway/configuration
Performs a full replacement of the gateway configuration. This method validates the provided JSON5 payload, writes the new configuration, and triggers a gateway restart.
```APIDOC
## POST /config.apply
### Description
Validates and writes the full configuration, replacing the existing one entirely. Triggers a gateway restart unless specific exceptions apply.
### Method
POST
### Endpoint
config.apply
### Parameters
#### Request Body
- **raw** (string) - Required - JSON5 payload for the entire configuration.
- **baseHash** (string) - Optional - Config hash obtained from config.get (required if config exists).
- **sessionKey** (string) - Optional - Session key for post-restart wake-up ping.
- **note** (string) - Optional - Note for the restart sentinel.
- **restartDelayMs** (integer) - Optional - Delay in milliseconds before restart (default: 2000).
### Request Example
{
  "raw": "{ agents: { defaults: { workspace: \"~/.openclaw/workspace\" } } }",
  "baseHash": "<hash>",
  "sessionKey": "agent:main:whatsapp:direct:+15555550123"
}
```
--------------------------------
### Non-Interactive OpenClaw Onboarding with Hugging Face
Source: https://docs.openclaw.ai/providers/huggingface
Performs a non-interactive OpenClaw onboarding setup, specifying local mode, Hugging Face API key authentication, and setting a default model.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice huggingface-api-key \
  --huggingface-api-key "$HF_TOKEN"
```
--------------------------------
### OpenClaw Post-Installation and Management
Source: https://docs.openclaw.ai/install/ansible
Essential commands for managing the OpenClaw service, including switching users, logging into messaging channels, and monitoring system status.
```bash
sudo -i -u openclaw
openclaw channels login
sudo systemctl status openclaw
sudo journalctl -u openclaw -f
sudo systemctl restart openclaw
```
--------------------------------
### Run Multiple OpenClaw Gateway Instances
Source: https://docs.openclaw.ai/gateway/configuration-reference
Demonstrates how to isolate multiple gateway instances on a single host by specifying unique configuration paths, state directories, and ports using environment variables.
```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json \
OPENCLAW_STATE_DIR=~/.openclaw-a \
openclaw gateway --port 19001
```
--------------------------------
### GET /health
Source: https://docs.openclaw.ai/providers/claude-max-api-proxy
Performs a health check on the proxy server.
```APIDOC
## GET /health
### Description
Checks if the proxy server is running and responsive.
### Method
GET
### Endpoint
http://localhost:3456/health
### Response
#### Success Response (200)
- **status** (string) - Indicates the server is healthy.
```
--------------------------------
### OpenClaw Channel Plugin Metadata
Source: https://docs.openclaw.ai/plugins/architecture
Includes metadata for channel plugins, such as display labels, documentation paths, and installation hints. This allows for a richer catalog experience without cluttering the core catalog data.
```json
{
  "name": "@openclaw/nextcloud-talk",
  "openclaw": {
    "extensions": ["./index.ts"],
    "channel": {
      "id": "nextcloud-talk",
      "label": "Nextcloud Talk",
      "selectionLabel": "Nextcloud Talk (self-hosted)",
      "docsPath": "/channels/nextcloud-talk",
      "docsLabel": "nextcloud-talk",
      "blurb": "Self-hosted chat via Nextcloud Talk webhook bots.",
      "order": 65,
      "aliases": ["nc-talk", "nc"]
    },
    "install": {
      "npmSpec": "@openclaw/nextcloud-talk",
      "localPath": "extensions/nextcloud-talk",
      "defaultChoice": "npm"
    }
  }
}
```
--------------------------------
### Configure Heartbeat Settings in OpenClaw
Source: https://docs.openclaw.ai/gateway/heartbeat
A JSON configuration example demonstrating how to define heartbeat intervals, delivery targets, and session isolation for an agent.
```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last", // explicit delivery to last contact (default is "none")
        directPolicy: "allow", // default: allow direct/DM targets; set "block" to suppress
        lightContext: true, // optional: only inject HEARTBEAT.md from bootstrap files
        isolatedSession: true, // optional: fresh session each run (no conversation history)
        // activeHours: { start: "08:00", end: "24:00" },
        // includeReasoning: true, // optional: send separate `Reasoning:` message too
      },
    },
  },
}
```
--------------------------------
### Run Gateway in Dev Mode
Source: https://docs.openclaw.ai/pi-dev
Starts the OpenClaw gateway in development mode, enabling interactive debugging and testing. This command is part of the manual testing workflow. Dependencies include Node.js and pnpm.
```bash
pnpm gateway:dev
```
--------------------------------
### Verify OpenClaw Gateway Installation (Bash)
Source: https://docs.openclaw.ai/install/oracle
Checks the OpenClaw version, the status of the OpenClaw gateway user service, the status of Tailscale Serve, and attempts to access the gateway locally via curl. It also provides the URL format for accessing the Control UI via Tailscale.
```bash
openclaw --version
systemctl --user status openclaw-gateway
tailscale serve status
curl http://localhost:18789
```
--------------------------------
### Configure Qianfan via OpenClaw CLI
Source: https://docs.openclaw.ai/providers/qianfan
Initializes the OpenClaw environment for the Qianfan provider. This command prompts the user to input their Qianfan API key to authenticate the connection.
```bash
openclaw onboard --auth-choice qianfan-api-key
```
--------------------------------
### Integrate OpenClaw ACP with Zed Editor
Source: https://docs.openclaw.ai/cli/acp
Configures the Zed editor to use OpenClaw as a custom ACP agent. Includes examples for both default and specific gateway/session configurations.
```json
{
  "agent_servers": {
    "OpenClaw ACP": {
      "type": "custom",
      "command": "openclaw",
      "args": ["acp"],
      "env": {}
    }
  }
}
```
```json
{
  "agent_servers": {
    "OpenClaw ACP": {
      "type": "custom",
      "command": "openclaw",
      "args": [
        "acp",
        "--url",
        "wss://gateway-host:18789",
        "--token",
        "<token>",
        "--session",
        "agent:design:main"
      ],
      "env": {}
    }
  }
}
```
--------------------------------
### Define Skill Metadata and Instructions
Source: https://docs.openclaw.ai/tools/creating-skills
The SKILL.md file uses YAML frontmatter for metadata and markdown for agent instructions.
```markdown
---
name: hello_world
description: A simple skill that says hello.
---
# Hello World Skill
When the user asks for a greeting, use the `echo` tool to say
"Hello from your custom skill!".
```
--------------------------------
### Auto-Start claude-max-api-proxy on macOS
Source: https://docs.openclaw.ai/providers/claude-max-api-proxy
Creates a macOS LaunchAgent plist file to automatically start the claude-max-api-proxy on system load. It specifies the Node.js executable and the proxy server script path.
```bash
cat > ~/Library/LaunchAgents/com.claude-max-api.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.claude-max-api</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/usr/local/lib/node_modules/claude-max-api-proxy/dist/server/standalone.js</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/usr/local/bin:/opt/homebrew/bin:~/.local/bin:/usr/bin:/bin</string>
  </dict>
</dict>
</plist>
EOF
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.claude-max-api.plist
```
--------------------------------
### Execute PDF Analysis
Source: https://docs.openclaw.ai/tools/pdf
Examples of invoking the PDF tool for single files, multiple files, and specific page ranges with model overrides.
```json
{
  "pdf": "/tmp/report.pdf",
  "prompt": "Summarize this report in 5 bullets"
}
```
```json
{
  "pdfs": ["/tmp/q1.pdf", "/tmp/q2.pdf"],
  "prompt": "Compare risks and timeline changes across both documents"
}
```
```json
{
  "pdf": "https://example.com/report.pdf",
  "pages": "1-3,7",
  "model": "openai/gpt-5-mini",
  "prompt": "Extract only customer-impacting incidents"
}
```
--------------------------------
### Enable Google Chat Plugin
Source: https://docs.openclaw.ai/channels/googlechat
This bash command checks the status of installed plugins and filters for 'googlechat'. If the plugin is disabled, it indicates a potential cause for integration issues.
```bash
openclaw plugins list | grep googlechat
```
--------------------------------
### Install/Reinstall OpenClaw Gateway Service
Source: https://docs.openclaw.ai/help/faq
Installs or forces a reinstallation of the OpenClaw Gateway service. This is useful for resolving configuration mismatches between the CLI and the running service, especially when dealing with profiles or state directories.
```bash
openclaw gateway install --force
```
--------------------------------
### Build Default OpenClaw Sandbox Docker Image
Source: https://docs.openclaw.ai/gateway/sandboxing
Executes a script to build the default OpenClaw sandbox Docker image. This image is a base image and may not include runtimes like Node.js. Custom images or setup commands can be used for additional tooling.
```bash
scripts/sandbox-setup.sh
```
--------------------------------
### OpenClaw Channels: Capabilities Probe
Source: https://docs.openclaw.ai/cli/channels
Explains how to fetch provider capability hints, including intents and scopes, as well as static feature support for chat channels. This command helps in understanding the specific features and permissions available for each channel, with options to probe all channels or specific ones.
```bash
openclaw channels capabilities
openclaw channels capabilities --channel discord --target channel:123
```
--------------------------------
### GET /secrets/audit
Source: https://docs.openclaw.ai/cli/secrets
Scans the OpenClaw state for plaintext secrets, unresolved references, precedence drift, and legacy residues.
```APIDOC
## GET /secrets/audit
### Description
Performs a read-only scan of configuration, auth, and generated model stores to identify security risks like plaintext secrets or unresolved refs.
### Method
GET
### Endpoint
/secrets/audit
### Parameters
#### Query Parameters
- **check** (boolean) - Optional - If true, returns a non-zero exit code on findings.
- **json** (boolean) - Optional - Returns the audit report in JSON format.
- **allow-exec** (boolean) - Optional - Includes execution-based references in the scan.
### Response
#### Success Response (200)
- **status** (string) - One of: clean, findings, unresolved.
- **summary** (object) - Contains counts for plaintextCount, unresolvedRefCount, shadowedRefCount, and legacyResidueCount.
#### Response Example
{
  "status": "findings",
  "summary": {
    "plaintextCount": 1,
    "unresolvedRefCount": 0,
    "shadowedRefCount": 0,
    "legacyResidueCount": 0
  }
}
```
--------------------------------
### Generate Shell Completion Scripts to Standard Output
Source: https://docs.openclaw.ai/cli/completion
This snippet illustrates how to generate shell completion scripts and print them to standard output. This is the default behavior when neither `--install` nor `--write-state` is specified. The output can be redirected to a file or piped to another command for further processing.
```bash
openclaw completion
openclaw completion --shell zsh
```
--------------------------------
### Subagent Runtime Helpers: Launching and Managing Background Runs
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Illustrates the use of api.runtime.subagent helpers for initiating, monitoring, and managing background subagent processes. This includes starting runs, waiting for completion, retrieving messages, and deleting sessions. Model overrides are mentioned with a note on operator opt-in.
```typescript
// Start a subagent run
const { runId } = await api.runtime.subagent.run({
  sessionKey: "agent:main:subagent:search-helper",
  message: "Expand this query into focused follow-up searches.",
  provider: "openai", // optional override
  model: "gpt-4.1-mini", // optional override
  deliver: false,
});
// Wait for completion
const result = await api.runtime.subagent.waitForRun({ runId, timeoutMs: 30000 });
// Read session messages
const { messages } = await api.runtime.subagent.getSessionMessages({
  sessionKey: "agent:main:subagent:search-helper",
  limit: 10,
});
// Delete a session
await api.runtime.subagent.deleteSession({
  sessionKey: "agent:main:subagent:search-helper",
});
```
--------------------------------
### Per-Agent Sandbox and Tool Configuration
Source: https://docs.openclaw.ai/concepts/multi-agent
Demonstrates how to configure individual sandbox modes and tool restrictions for different agents.
```APIDOC
## Per-Agent Sandbox and Tool Configuration
Each agent can have its own sandbox and tool restrictions.
### Configuration Examples
#### Personal Agent (No Sandbox, All Tools)
```json
{
  "agents": {
    "list": [
      {
        "id": "personal",
        "workspace": "~/.openclaw/workspace-personal",
        "sandbox": {
          "mode": "off" 
        }
      }
    ]
  }
}
```
#### Family Agent (Sandboxed, Restricted Tools)
```json
{
  "agents": {
    "list": [
      {
        "id": "family",
        "workspace": "~/.openclaw/workspace-family",
        "sandbox": {
          "mode": "all",
          "scope": "agent",
          "docker": {
            "setupCommand": "apt-get update && apt-get install -y git curl"
          }
        },
        "tools": {
          "allow": ["read"],
          "deny": ["exec", "write", "edit", "apply_patch"]
        }
      }
    ]
  }
}
```
### Notes
*   `setupCommand` lives under `sandbox.docker` and runs once on container creation.
*   Per-agent `sandbox.docker.*` overrides are ignored when the resolved scope is `"shared"`.
*   `tools.elevated` is **global** and sender-based; it is not configurable per agent. Use `agents.list[].tools` to deny `exec` for per-agent boundaries.
*   Use `agents.list[].groupChat.mentionPatterns` for group targeting to map @mentions to the intended agent.
```
--------------------------------
### Run Gmail Push Handler
Source: https://docs.openclaw.ai/automation/gmail-pubsub
Starts a local server to handle incoming Pub/Sub push notifications from Gmail. It requires a shared token for authentication and maps hooks to the OpenClaw backend.
```bash
gog gmail watch serve \
  --account openclaw@gmail.com \
  --bind 127.0.0.1 \
  --port 8788 \
  --path /gmail-pubsub \
  --token <shared> \
  --hook-url http://127.0.0.1:18789/hooks/gmail \
  --hook-token OPENCLAW_HOOK_TOKEN \
  --include-body \
  --max-bytes 20000
```
--------------------------------
### Cron Jobs: Adding Scheduled Tasks
Source: https://docs.openclaw.ai/automation/cron-vs-heartbeat
This section details how to add cron jobs for scheduled tasks, including examples for daily briefings and one-shot reminders.
```APIDOC
## POST /cron/add
### Description
Adds a new cron job to the system for scheduled task execution.
### Method
POST
### Endpoint
/cron/add
### Parameters
#### Query Parameters
- **name** (string) - Required - A descriptive name for the cron job.
- **cron** (string) - Optional - The cron schedule string (e.g., "0 7 * * *"). Use only if --at is not specified.
- **at** (string) - Optional - A relative time string for one-shot reminders (e.g., "20m"). Use only if --cron is not specified.
- **tz** (string) - Optional - The timezone for the cron schedule (e.g., "America/New_York"). Defaults to system timezone.
- **session** (string) - Optional - The session type ('isolated' or 'main'). Defaults to 'main'.
- **message** (string) - Optional - The message or prompt to execute.
- **system-event** (string) - Optional - A system event to trigger.
- **model** (string) - Optional - The model to use for the task (e.g., 'opus').
- **announce** (boolean) - Optional - Whether to announce the result.
- **channel** (string) - Optional - The channel for announcement (e.g., 'whatsapp').
- **to** (string) - Optional - The recipient for the announcement (e.g., a phone number).
- **wake** (string) - Optional - Specifies when to wake the system (e.g., 'now').
- **delete-after-run** (boolean) - Optional - Whether to delete the cron job after it runs once.
### Request Example
```bash
openclaw cron add \
  --name "Morning briefing" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate today's briefing: weather, calendar, top emails, news summary." \
  --model opus \
  --announce \
  --channel whatsapp \
  --to "+15551234567"
```
```bash
openclaw cron add \
  --name "Meeting reminder" \
  --at "20m" \
  --session main \
  --system-event "Reminder: standup meeting starts in 10 minutes." \
  --wake now \
  --delete-after-run
```
### Response
#### Success Response (200)
- **status** (string) - Indicates the success of the operation (e.g., "added").
#### Response Example
```json
{
  "status": "added"
}
```
```
--------------------------------
### Configuration Snippet for OpenCode Go
Source: https://docs.openclaw.ai/providers/opencode-go
This JSON5 configuration snippet demonstrates how to set up environment variables and default agent models for OpenCode Go. It includes the necessary OPENCODE_API_KEY and specifies the primary model to be used.
```json5
{
  env: { OPENCODE_API_KEY: "YOUR_API_KEY_HERE" }, // pragma: allowlist secret
  agents: { defaults: { model: { primary: "opencode-go/kimi-k2.5" } } },
}
```
--------------------------------
### Find global npm prefix
Source: https://docs.openclaw.ai/install/node
This command helps locate the directory where npm installs global packages. It's crucial for troubleshooting 'command not found' errors by ensuring this directory is in your system's PATH.
```bash
npm prefix -g
```
--------------------------------
### Launchctl Commands for macOS Gateway Service
Source: https://docs.openclaw.ai/platforms/macos
These commands are used to manage the OpenClaw macOS Gateway service via `launchctl`. `kickstart` forcefully starts the service, while `bootout` stops and unloads it. The service label is typically `ai.openclaw.gateway` or `ai.openclaw.<profile>` for named profiles.
```bash
launchctl kickstart -k gui/$UID/ai.openclaw.gateway
launchctl bootout gui/$UID/ai.openclaw.gateway
```
--------------------------------
### Openclaw Android Command Examples (Various)
Source: https://docs.openclaw.ai/platforms/android
This section outlines various commands available for Android devices through Openclaw, categorized by functionality. These commands cover device status, permissions, notifications, photos, contacts, calendar events, call logs, SMS messages, and motion activity. Availability depends on the specific device and granted permissions.
```text
Device Commands:
  device.status
  device.info
  device.permissions
  device.health
Notifications Commands:
  notifications.list
  notifications.actions
Photos Commands:
  photos.latest
Contacts Commands:
  contacts.search
  contacts.add
Calendar Commands:
  calendar.events
  calendar.add
Call Log Commands:
  callLog.search
SMS Commands:
  sms.search
Motion Commands:
  motion.activity
  motion.pedometer
```
--------------------------------
### Channel Plugin package.json Metadata
Source: https://docs.openclaw.ai/plugins/sdk-setup
Defines the 'openclaw' field in package.json for a channel plugin, specifying extensions, setup entry, and channel-specific metadata like ID, label, and blurb.
```json
{
  "name": "@myorg/openclaw-my-channel",
  "version": "1.0.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "channel": {
      "id": "my-channel",
      "label": "My Channel",
      "blurb": "Short description of the channel."
    }
  }
}
```
--------------------------------
### Configure Kimi Web Search Provider
Source: https://docs.openclaw.ai/tools/kimi-search
This configuration snippet shows how to set up Kimi as the web search provider in OpenClaw. It includes options for API key management and specifying Kimi as the search tool. The configuration can be done via a JSON file or environment variables.
```json
{
  "plugins": {
    "entries": {
      "moonshot": {
        "config": {
          "webSearch": {
            "apiKey": "sk-..." // optional if KIMI_API_KEY or MOONSHOT_API_KEY is set
          }
        }
      }
    }
  },
  "tools": {
    "web": {
      "search": {
        "provider": "kimi"
      }
    }
  }
}
```
--------------------------------
### Run OpenClaw Diagnostic Tool
Source: https://docs.openclaw.ai/install/raspberry-pi
Executes the OpenClaw diagnostic tool in non-interactive mode to automatically check for common configuration and setup problems. This command is used to troubleshoot service startup issues.
```bash
openclaw doctor --non-interactive
```
--------------------------------
### Checking OpenClaw Update Status (Bash)
Source: https://docs.openclaw.ai/install/development-channels
Command to check the current status of OpenClaw updates, including the active channel, installation type, current version, and source.
```bash
openclaw update status
```
--------------------------------
### Manage Devices via CLI
Source: https://docs.openclaw.ai/install/docker
Commands to list and approve devices in the OpenClaw dashboard using the CLI tool.
```bash
docker compose run --rm openclaw-cli dashboard --no-open
docker compose run --rm openclaw-cli devices list
docker compose run --rm openclaw-cli devices approve <requestId>
```
--------------------------------
### Enable OpenProse Plugin
Source: https://docs.openclaw.ai/prose
Command to enable the OpenProse plugin within the OpenClaw environment. This command requires restarting the Gateway after execution. For local development, an alternative installation command is provided.
```bash
openclaw plugins enable open-prose
```
--------------------------------
### OpenClaw Web Search Configuration
Source: https://docs.openclaw.ai/tools/web
Configuration for the OpenClaw web search tool. It enables the search functionality and specifies the provider or allows for auto-detection. Dependencies include the core OpenClaw setup. Inputs are configuration parameters, and outputs are the tool's operational state.
```json5
{
  tools: {
    web: {
      search: {
        enabled: true, // default: true
        provider: "brave", // or omit for auto-detection
        maxResults: 5,
        timeoutSeconds: 30,
        cacheTtlMinutes: 15,
      },
    },
  },
}
```
--------------------------------
### View OpenClaw Service Logs
Source: https://docs.openclaw.ai/install/raspberry-pi
Retrieves the last 100 lines of logs for the OpenClaw service to help diagnose startup failures or other runtime errors. This is essential for understanding why a service might not be starting.
```bash
journalctl -u openclaw --no-pager -n 100
```
--------------------------------
### Trigger Agent Action with Custom Model
Source: https://docs.openclaw.ai/automation/webhook
This example demonstrates overriding the default model for an agent action by including the 'model' field in the JSON payload sent to the /hooks/agent endpoint.
```bash
curl -X POST http://127.0.0.1:18789/hooks/agent \
  -H 'x-openclaw-token: SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"message":"Summarize inbox","name":"Email","model":"openai/gpt-5.2-mini"}'
```
--------------------------------
### Manage TTS via Slash Commands
Source: https://docs.openclaw.ai/tools/tts
Examples of using the /tts slash command to configure TTS settings, toggle modes, and generate one-off audio messages. These commands require authorized sender permissions.
```text
/tts off
/tts always
/tts inbound
/tts tagged
/tts status
/tts provider openai
/tts limit 2000
/tts summary off
/tts audio Hello from OpenClaw
```
--------------------------------
### Canvas Agent API CLI Commands
Source: https://docs.openclaw.ai/platforms/mac/canvas
Command-line interface examples for interacting with the Canvas agent API. These commands allow showing/hiding the panel, navigating to URLs, evaluating JavaScript, and capturing snapshots.
```bash
openclaw nodes canvas present --node <id>
openclaw nodes canvas navigate --node <id> --url "/"
openclaw nodes canvas eval --node <id> --js "document.title"
openclaw nodes canvas snapshot --node <id>
```
--------------------------------
### Memory Tool Factories (TypeScript)
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Provides factories for creating memory-based tools, including get and search tools, and utilities for registering memory-related command-line interface (CLI) components.
```typescript
const getTool = api.runtime.tools.createMemoryGetTool(/* ... */);
const searchTool = api.runtime.tools.createMemorySearchTool(/* ... */);
api.runtime.tools.registerMemoryCli(/* ... */);
```
--------------------------------
### Configure Moonshot AI Custom Provider
Source: https://docs.openclaw.ai/concepts/model-providers
Example configuration for adding Moonshot AI as a custom provider in models.json. It defines the base URL, API key reference, and available models.
```json5
{
  agents: {
    defaults: { model: { primary: "moonshot/kimi-k2.5" } },
  },
  models: {
    mode: "merge",
    providers: {
      moonshot: {
        baseUrl: "https://api.moonshot.ai/v1",
        apiKey: "${MOONSHOT_API_KEY}",
        api: "openai-completions",
        models: [{ id: "kimi-k2.5", name: "Kimi K2.5" }],
      },
    },
  },
}
```
--------------------------------
### Runtime Store Management
Source: https://docs.openclaw.ai/plugins/sdk-runtime
How to use createPluginRuntimeStore to manage and access plugin runtime references across different files.
```APIDOC
## Runtime Store Management
### Description
Use `createPluginRuntimeStore` to store the runtime reference for use outside the `register` callback. This ensures that the runtime can be safely accessed or checked for initialization status in other parts of the plugin.
### Implementation
```typescript
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
const store = createPluginRuntimeStore<PluginRuntime>("my-plugin runtime not initialized");
// In your entry point
export default defineChannelPluginEntry({
  id: "my-plugin",
  name: "My Plugin",
  description: "Example",
  plugin: myPlugin,
  setRuntime: store.setRuntime,
});
// In other files
export function getRuntime() {
  return store.getRuntime(); // throws if not initialized
}
export function tryGetRuntime() {
  return store.tryGetRuntime(); // returns null if not initialized
}
```
```
--------------------------------
### Configure LM Studio with MiniMax M2.5 for OpenClaw AI
Source: https://docs.openclaw.ai/gateway/local-models
This JSON configuration sets up LM Studio to use the MiniMax M2.5 model as the primary local model for OpenClaw AI. It specifies model aliases, provider details including the local server URL and API key, and model parameters like context window and max tokens. This setup uses the Responses API for separating reasoning from final text.
```json5
{
  "theme": {"light": "min-light", "dark": "min-dark"}
}
{
  "agents": {
    "defaults": {
      "model": { "primary": "lmstudio/minimax-m2.5-gs32" },
      "models": {
        "anthropic/claude-opus-4-6": { "alias": "Opus" },
        "lmstudio/minimax-m2.5-gs32": { "alias": "Minimax" },
      },
    },
  },
  "models": {
    "mode": "merge",
    "providers": {
      "lmstudio": {
        "baseUrl": "http://127.0.0.1:1234/v1",
        "apiKey": "lmstudio",
        "api": "openai-responses",
        "models": [
          {
            "id": "minimax-m2.5-gs32",
            "name": "MiniMax M2.5 GS32",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 196608,
            "maxTokens": 8192,
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Configure Audio and Video Processing
Source: https://docs.openclaw.ai/nodes/media-understanding
Defines the configuration for enabling audio and video processing using specific models and CLI tools like Whisper and Gemini. This setup allows the system to transcribe audio and describe video content.
```json5
{
  tools: {
    media: {
      audio: {
        enabled: true,
        models: [
          { provider: "openai", model: "gpt-4o-mini-transcribe" },
          {
            type: "cli",
            command: "whisper",
            args: ["--model", "base", "{{MediaPath}}"],
          },
        ],
      },
      video: {
        enabled: true,
        maxChars: 500,
        models: [
          { provider: "google", model: "gemini-3-flash-preview" },
          {
            type: "cli",
            command: "gemini",
            args: [
              "-m",
              "gemini-3-flash",
              "--allowed-tools",
              "read_file",
              "Read the media at {{MediaPath}} and describe it in <= {{MaxChars}} characters.",
            ],
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Configuration Snippet for Xiaomi MiMo Provider
Source: https://docs.openclaw.ai/providers/xiaomi
A JSON configuration snippet to set up the Xiaomi MiMo provider within the OpenClaw system. This includes environment variable setup for the API key, default model selection, and detailed provider model configurations.
```json
{
  env: { XIAOMI_API_KEY: "your-key" },
  agents: { defaults: { model: { primary: "xiaomi/mimo-v2-flash" } } },
  models: {
    mode: "merge",
    providers: {
      xiaomi: {
        baseUrl: "https://api.xiaomimimo.com/v1",
        api: "openai-completions",
        apiKey: "XIAOMI_API_KEY",
        models: [
          {
            id: "mimo-v2-flash",
            name: "Xiaomi MiMo V2 Flash",
            reasoning: false,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 262144,
            maxTokens: 8192,
          },
          {
            id: "mimo-v2-pro",
            name: "Xiaomi MiMo V2 Pro",
            reasoning: true,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 1048576,
            maxTokens: 32000,
          },
          {
            id: "mimo-v2-omni",
            name: "Xiaomi MiMo V2 Omni",
            reasoning: true,
            input: ["text", "image"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 262144,
            maxTokens: 32000,
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Configure Model Providers
Source: https://docs.openclaw.ai/gateway/configuration-reference
Defines the model provider configuration, including API keys, base URLs, and model-specific parameters like cost and context windows. This setup allows for merging multiple providers for fallback or load balancing.
```json5
models: {
  mode: "merge",
  providers: {
    minimax: {
      baseUrl: "https://api.minimax.io/anthropic",
      apiKey: "${MINIMAX_API_KEY}",
      api: "anthropic-messages",
      models: [
        {
          id: "MiniMax-M2.7",
          name: "MiniMax M2.7",
          reasoning: true,
          input: ["text"],
          cost: { input: 0.3, output: 1.2, cacheRead: 0.03, cacheWrite: 0.12 },
          contextWindow: 200000,
          maxTokens: 8192
        }
      ]
    }
  }
}
```
--------------------------------
### Per-Agent OpenShell with Custom Gateway (JSON5)
Source: https://docs.openclaw.ai/gateway/openshell
This configuration demonstrates setting up OpenShell for a specific agent with a custom gateway and endpoint. It also includes policy enforcement for sandbox creation.
```json5
{
  agents: {
    defaults: {
      sandbox: { mode: "off" },
    },
    list: [
      {
        id: "researcher",
        sandbox: {
          mode: "all",
          backend: "openshell",
          scope: "agent",
          workspaceAccess: "rw",
        },
      },
    ],
  },
  plugins: {
    entries: {
      openshell: {
        enabled: true,
        config: {
          from: "openclaw",
          mode: "remote",
          gateway: "lab",
          gatewayEndpoint: "https://lab.example",
          policy: "strict",
        },
      },
    },
  },
}
```
--------------------------------
### Execute Pipeline with Lobster
Source: https://docs.openclaw.ai/tools/lobster
Demonstrates how to chain CLI commands using JSON pipes and define a workflow execution with a timeout. This approach ensures deterministic execution and allows for approval gates.
```bash
inbox list --json
inbox categorize --json
inbox apply --json
```
```json
{
  "action": "run",
  "pipeline": "exec --json --shell 'inbox list --json' | exec --stdin json --shell 'inbox categorize --json' | exec --stdin json --shell 'inbox apply --json' | approve --preview-from-stdin --limit 5 --prompt 'Apply changes?'",
  "timeoutMs": 30000
}
```
--------------------------------
### Configure Cache Warmth with Heartbeat
Source: https://docs.openclaw.ai/reference/token-use
YAML configuration example for an agent to maintain a warm cache by setting a heartbeat interval shorter than the provider's cache TTL.
```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-6"
    models:
      "anthropic/claude-opus-4-6":
        params:
          cacheRetention: "long"
    heartbeat:
      every: "55m"
```
--------------------------------
### OpenClaw CLI for Model Management
Source: https://docs.openclaw.ai/concepts/model-providers
Command-line interface commands for onboarding, listing, and setting default models in OpenClaw. These helpers streamline the process of managing available model providers.
```bash
openclaw onboard
openclaw models list
openclaw models set <provider/model>
```
--------------------------------
### Dry Run for OpenClaw Updates (Bash)
Source: https://docs.openclaw.ai/install/development-channels
Examples of using the --dry-run flag with 'openclaw update' to preview changes without making any modifications. This includes dry runs with different channels, tags, and JSON output.
```bash
openclaw update --dry-run
openclaw update --channel beta --dry-run
openclaw update --tag 2026.3.26 --dry-run
openclaw update --dry-run --json
```
--------------------------------
### Onboard Together AI Provider
Source: https://docs.openclaw.ai/providers/together
This snippet shows how to onboard the Together AI provider using the Openclaw CLI, setting up authentication.
```APIDOC
## Onboard Together AI Provider
### Description
This command initiates the onboarding process for the Together AI provider, guiding you through authentication setup.
### Method
CLI Command
### Endpoint
N/A
### Parameters
#### CLI Arguments
- `--auth-choice` (string) - Required - Specifies the authentication method, e.g., `together-api-key`.
### Request Example
```bash
openclaw onboard --auth-choice together-api-key
```
### Response
N/A
```
--------------------------------
### Build Control UI Assets
Source: https://docs.openclaw.ai/web
Builds the static files for the Control UI from the source code.
```bash
pnpm ui:build
```
--------------------------------
### Record Screen from Nodes
Source: https://docs.openclaw.ai/nodes/index
Record the screen of supported nodes, with options for duration, frames per second, and disabling audio. Screen recordings are clamped to a maximum of 60 seconds. Supports selecting a specific display if multiple screens are available.
```bash
openclaw nodes screen record --node <idOrNameOrIp> --duration 10s --fps 10
openclaw nodes screen record --node <idOrNameOrIp> --duration 10s --fps 10 --no-audio
```
--------------------------------
### Configure Minimal Sandbox Settings
Source: https://docs.openclaw.ai/gateway/sandboxing
This JSON configuration demonstrates how to enable a minimal sandbox environment for agents. It sets the sandbox mode to non-main and restricts workspace access to none.
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "session",
        workspaceAccess: "none",
      },
    },
  },
}
```
--------------------------------
### Execute Command with acpx and OpenClaw Target
Source: https://docs.openclaw.ai/cli/acp
Example of using the `acpx` tool to execute a command within an OpenClaw ACP session. This allows coding agents like Codex or Claude Code to interact with your OpenClaw bot.
```bash
# One-shot request into your default OpenClaw ACP session
acpx openclaw exec "Summarize the active OpenClaw session state."
```
--------------------------------
### Create a Discord Event
Source: https://docs.openclaw.ai/cli/message
Creates a new event in a Discord guild. Requires the guild ID, event name, and start time. Optional parameters include end time, description, channel ID, location, and event type.
```bash
openclaw event create --guild-id 1234567890 --event-name "Team Meeting" --start-time "2024-08-15T10:00:00Z"
```
--------------------------------
### Manage Auth Profile Order with OpenClaw CLI
Source: https://docs.openclaw.ai/help/faq
This section demonstrates how to manage the order in which OpenClaw tries authentication profiles for a given provider. It covers getting the current order, setting a specific profile, defining a fallback order, clearing overrides, and targeting specific agents. This functionality does not store secrets but configures rotation and fallback behavior.
```bash
openclaw models auth order get --provider anthropic
openclaw models auth order set --provider anthropic anthropic:default
openclaw models auth order set --provider anthropic anthropic:work anthropic:default
openclaw models auth order clear --provider anthropic
openclaw models auth order set --provider anthropic --agent main anthropic:default
```
--------------------------------
### Write Configuration File via SSH
Source: https://docs.openclaw.ai/install/fly
Demonstrates two methods for writing a configuration file to the Fly.io machine: using 'echo' and 'tee' for direct input, and using 'fly sftp shell' for file transfers. The 'tee' method pipes local data to the remote file.
```bash
# Use echo + tee (pipe from local to remote)
echo '{"your":"config"}' | fly ssh console -C "tee /data/openclaw.json"
# Or use sftp
fly sftp shell
> put /local/path/config.json /data/openclaw.json
```
--------------------------------
### Configure WhatsApp Channel Settings
Source: https://docs.openclaw.ai/channels/whatsapp
JSON configuration for the WhatsApp channel, specifying direct message policies, allowed senders, and group chat policies. This configuration is part of the OpenClaw gateway setup.
```json
{
  channels: {
    whatsapp: {
      dmPolicy: "pairing",
      allowFrom: ["+15551234567"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15551234567"]
    }
  }
}
```
--------------------------------
### Set Gateway Token Environment Variable
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme
Set the necessary environment variable on the client machine to authenticate with the remote gateway. This token is required for the connection to be established.
```bash
launchctl setenv OPENCLAW_GATEWAY_TOKEN "<your-token>"
```
--------------------------------
### One-off OpenClaw Version/Tag Targeting (Bash)
Source: https://docs.openclaw.ai/install/development-channels
Demonstrates how to perform a single OpenClaw update to a specific version, dist-tag, or package spec without changing the default channel. This functionality applies only to package (npm) installs.
```bash
# Install a specific version
openclaw update --tag 2026.3.26
# Install from the beta dist-tag (one-off, does not persist)
openclaw update --tag beta
# Install from GitHub main branch (npm tarball)
openclaw update --tag main
# Install a specific npm package spec
openclaw update --tag openclaw@2026.3.26
```
--------------------------------
### Allowlist Web Fetch Tool
Source: https://docs.openclaw.ai/tools/web-fetch
Shows how to add web_fetch to the tool allowlist within the project configuration.
```json5
{
  tools: {
    allow: ["web_fetch"]
  }
}
```
--------------------------------
### OpenShell Sandbox Lifecycle Management (Bash)
Source: https://docs.openclaw.ai/gateway/openshell
These bash commands demonstrate how to manage OpenShell sandboxes, including listing, inspecting, and recreating them. Recreating is crucial for 'remote' mode to reset the workspace.
```bash
# List all sandbox runtimes (Docker + OpenShell)
openclaw sandbox list
# Inspect effective policy
openclaw sandbox explain
# Recreate (deletes remote workspace, re-seeds on next use)
openclaw sandbox recreate --all
```
--------------------------------
### Twitch Account Configuration (JSON5)
Source: https://docs.openclaw.ai/channels/twitch
This JSON5 configuration defines settings for a Twitch account, including authentication details, channel information, and access control for users and roles. It supports both single-account and multi-account setups.
```json5
{
  channels: {
    twitch: {
      enabled: true,
      username: "openclaw",
      accessToken: "oauth:abc123...",
      clientId: "xyz789...",
      channel: "vevisk",
      clientSecret: "secret123...",
      refreshToken: "refresh456...",
      allowFrom: ["123456789"],
      allowedRoles: ["moderator", "vip"],
      accounts: {
        default: {
          username: "mybot",
          accessToken: "oauth:abc123...",
          clientId: "xyz789...",
          channel: "your_channel",
          enabled: true,
          clientSecret: "secret123...",
          refreshToken: "refresh456...",
          expiresIn: 14400,
          obtainmentTimestamp: 1706092800000,
          allowFrom: ["123456789", "987654321"],
          allowedRoles: ["moderator"],
        },
      },
    },
  },
}
```
--------------------------------
### Perform Web Search via Runtime API
Source: https://docs.openclaw.ai/plugins/architecture
Demonstrates how to list available search providers and execute a search query using the OpenClaw runtime. This approach allows plugins to access search functionality without relying on agent-specific tool wrappers.
```typescript
const providers = api.runtime.webSearch.listProviders({
  config: api.config,
});
const result = await api.runtime.webSearch.search({
  config: api.config,
  args: {
    query: "OpenClaw plugin runtime helpers",
    count: 5,
  },
});
```
--------------------------------
### Configure SSH Backend for Remote Sandboxing
Source: https://docs.openclaw.ai/gateway/sandboxing
Configures the OpenClaw agent to use an SSH backend for sandboxing. This setup defines the remote host, workspace root, and authentication methods using local files or secret references.
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "ssh",
        scope: "session",
        workspaceAccess: "rw",
        ssh: {
          target: "user@gateway-host:22",
          workspaceRoot: "/tmp/openclaw-sandboxes",
          strictHostKeyChecking: true,
          updateHostKeys: true,
          identityFile: "~/.ssh/id_ed25519",
          certificateFile: "~/.ssh/id_ed25519-cert.pub",
          knownHostsFile: "~/.ssh/known_hosts",
        },
      },
    },
  },
}
```
--------------------------------
### ACP Agent Binding Configuration
Source: https://docs.openclaw.ai/channels/discord
Configure ACP (Agent Communication Protocol) agents to manage communication channels like Discord. This example shows how to bind an agent to a specific Discord channel.
```APIDOC
## ACP Agent Binding Configuration
### Description
This configuration sets up an ACP agent named 'codex-main' to handle messages from a specific Discord channel ('222222222222222222') within the guild '111111111111111111'. The agent is set to 'persistent' mode.
### Method
N/A (Configuration)
### Endpoint
N/A (Configuration)
### Parameters
N/A
### Request Example
```json
{
  "acp": {
    "agent": "codex",
    "backend": "acpx",
    "mode": "persistent",
    "cwd": "/workspace/openclaw"
  }
}
```
### Response
N/A (Configuration)
### Notes
- Thread messages can inherit the parent channel ACP binding.
- In a bound channel or thread, `/new` and `/reset` reset the same ACP session in place.
- Temporary thread bindings still work and can override target resolution while active.
- See [ACP Agents](/tools/acp-agents) for binding behavior details.
```
--------------------------------
### Wait for Browser Conditions
Source: https://docs.openclaw.ai/tools/browser
Demonstrates how to combine multiple wait conditions including URL patterns, load states, and custom JavaScript predicates to ensure the page is ready for interaction.
```bash
openclaw browser wait "#main" \
  --url "**/dash" \
  --load networkidle \
  --fn "window.ready===true" \
  --timeout-ms 15000
```
--------------------------------
### Registering Model Provider Catalogs in OpenClaw
Source: https://docs.openclaw.ai/concepts/model-providers
Example of how provider plugins can inject their model catalogs into OpenClaw. The `registerProvider` function merges the provided catalog into OpenClaw's internal model registry before writing to `models.json`.
```javascript
registerProvider({ catalog })
// OpenClaw merges that output into models.providers before writing models.json
```
--------------------------------
### List Slack Peers and Send Message
Source: https://docs.openclaw.ai/cli/directory
Demonstrates how to list Slack peers using a query and then send a message to a specific target. This showcases the integration between directory lookups and message sending functionalities.
```bash
openclaw directory peers list --channel slack --query "U0"
openclaw message send --channel slack --target user:U012ABCDEF --message "hello"
```
--------------------------------
### Implement Session Patch Logger Hook
Source: https://docs.openclaw.ai/automation/hooks
An example of a hook handler that listens for session patch events. It validates the event type and action before logging the session key and the specific changes applied in the patch.
```typescript
const handler = async (event) => {
  if (event.type !== "session" || event.action !== "patch") {
    return;
  }
  const { patch } = event.context;
  console.log(`[session-patch] Session updated: ${event.sessionKey}`);
  console.log(`[session-patch] Changes:`, patch);
};
export default handler;
```
--------------------------------
### Run Pi Tests with Live Provider Exercise
Source: https://docs.openclaw.ai/pi-dev
Executes Pi tests including the live provider exercise by setting the OPENCLAW_LIVE_TEST environment variable. This is useful for testing live data interactions. Dependencies include Node.js and pnpm.
```bash
OPENCLAW_LIVE_TEST=1 pnpm test -- src/agents/pi-embedded-runner-extraparams.live.test.ts
```
--------------------------------
### OpenClaw Gateway Reverse Proxy Configuration (YAML)
Source: https://docs.openclaw.ai/gateway/security
Example YAML configuration for the OpenClaw gateway to properly detect client IP addresses when running behind a reverse proxy. It specifies trusted proxies and fallback behavior for real IP detection.
```yaml
gateway:
  trustedProxies:
    - "127.0.0.1" # if your proxy runs on localhost
  # Optional. Default false.
  # Only enable if your proxy cannot provide X-Forwarded-For.
  allowRealIpFallback: false
  auth:
    mode: password
    password: ${OPENCLAW_GATEWAY_PASSWORD}
```
--------------------------------
### Configure Swap Memory
Source: https://docs.openclaw.ai/install/raspberry-pi
Creates and enables a 2GB swap file to assist devices with low RAM and optimizes swappiness.
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
# Reduce swappiness for low-RAM devices
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```
--------------------------------
### Anthropic Token + API Key with MiniMax Fallback
Source: https://docs.openclaw.ai/gateway/configuration-examples
Configures Anthropic authentication using both subscription token and API key, with MiniMax as a fallback model provider. This setup is useful for ensuring model availability.
```json5
{
  auth: {
    profiles: {
      "anthropic:subscription": {
        provider: "anthropic",
        mode: "oauth",
        email: "user@example.com",
      },
      "anthropic:api": {
        provider: "anthropic",
        mode: "api_key",
      },
    },
    order: {
      anthropic: ["anthropic:subscription", "anthropic:api"],
    },
  },
  models: {
    providers: {
      minimax: {
        baseUrl: "https://api.minimax.io/anthropic",
        api: "anthropic-messages",
        apiKey: "${MINIMAX_API_KEY}",
      },
    },
  },
  agent: {
    workspace: "~/.openclaw/workspace",
    model: {
      primary: "anthropic/claude-opus-4-6",
      fallbacks: ["minimax/MiniMax-M2.7"],
    },
  },
}
```
--------------------------------
### Media Understanding Runtime Helpers (JavaScript)
Source: https://docs.openclaw.ai/tools/capability-cookbook
Provides access to core media understanding functionalities for describing images, transcribing audio, and describing videos directly from files. The `api.runtime.mediaUnderstanding` surface is preferred, with `api.runtime.stt` available as a compatibility alias for audio transcription.
```javascript
const image = await api.runtime.mediaUnderstanding.describeImageFile({
  filePath: "/tmp/inbound-photo.jpg",
  cfg: api.config,
  agentDir: "/tmp/agent",
});
const video = await api.runtime.mediaUnderstanding.describeVideoFile({
  filePath: "/tmp/inbound-video.mp4",
  cfg: api.config,
});
const { text } = await api.runtime.mediaUnderstanding.transcribeAudioFile({
  filePath: "/tmp/inbound-audio.ogg",
  cfg: api.config,
  // Optional when MIME cannot be inferred reliably:
  mime: "audio/ogg",
});
```
--------------------------------
### Configuring Optional Tools in JSON5
Source: https://docs.openclaw.ai/plugins/building-plugins
Shows how a user can enable optional tools provided by a plugin. By adding the tool name to the `tools.allow` array in the configuration, users can explicitly permit the use of specific optional tools.
```json5
{
  tools: { allow: ["workflow_tool"] },
}
```
--------------------------------
### Configure Anthropic API Key
Source: https://docs.openclaw.ai/start/wizard-cli-reference
Sets up the Anthropic API key by checking for the ANTHROPIC_API_KEY environment variable or prompting the user. The key is then saved for daemon use.
```shell
export ANTHROPIC_API_KEY='your-api-key'
```
--------------------------------
### Minimal Tlon Plugin Configuration
Source: https://docs.openclaw.ai/channels/tlon
A minimal configuration for the Tlon plugin, setting up a single account with essential details like ship URL and login code. This is the basic setup required to connect to an Urbit ship.
```json
{
  "channels": {
    "tlon": {
      "enabled": true,
      "ship": "~sampel-palnet",
      "url": "https://your-ship-host",
      "code": "lidlut-tabwed-pillex-ridrup",
      "ownerShip": "~your-main-ship" // recommended: your ship, always allowed
    }
  }
}
```
--------------------------------
### OpenProse Slash Commands
Source: https://docs.openclaw.ai/prose
Common commands available through the OpenProse slash command in OpenClaw. These commands allow users to manage and execute OpenProse programs, access examples, and update the system.
```bash
/prose help
/prose run <file.prose>
/prose run <handle/slug>
/prose run <https://example.com/file.prose>
/prose compile <file.prose>
/prose examples
/prose update
```
--------------------------------
### OpenClaw CLI Plugin Management Commands
Source: https://docs.openclaw.ai/cli/plugins
A collection of bash commands for managing OpenClaw plugins and extensions. These commands allow users to list, install, inspect, enable, disable, uninstall, doctor, and update plugins. They also support managing marketplace plugin listings.
```bash
openclaw plugins list
openclaw plugins install <path-or-spec>
openclaw plugins inspect <id>
openclaw plugins enable <id>
openclaw plugins disable <id>
openclaw plugins uninstall <id>
openclaw plugins doctor
openclaw plugins update <id>
openclaw plugins update --all
openclaw plugins marketplace list <marketplace>
```
--------------------------------
### Troubleshooting Tips
Source: https://docs.openclaw.ai/logging
Common troubleshooting steps for Openclaw AI issues.
```APIDOC
## Troubleshooting Tips
### Gateway Not Reachable
- **Action**: Run `openclaw doctor` first to diagnose potential issues.
### Logs Empty
- **Check**: Ensure the Gateway is running and verify that it is writing to the file path specified in `logging.file`.
### Need More Detail
- **Action**: Set `logging.level` to `debug` or `trace` and attempt the operation again to gather more verbose logs.
```
--------------------------------
### Manage Azure VM State for Cost Optimization
Source: https://docs.openclaw.ai/install/azure
Commands to deallocate an Azure VM to stop compute billing and start it later. Disk charges still apply when the VM is deallocated. The OpenClaw Gateway will be unreachable when the VM is deallocated.
```bash
az vm deallocate -g "${RG}" -n "${VM_NAME}"
az vm start -g "${RG}" -n "${VM_NAME}"   # restart later
```
--------------------------------
### List Available Models (Bash)
Source: https://docs.openclaw.ai/help/testing
Lists available models supported by Openclaw, including their provider and model IDs. This command is useful for understanding which models can be selected for live testing and for configuring specific provider/model combinations.
```bash
openclaw models list
```
```bash
openclaw models list --json
```
--------------------------------
### Configure Feishu Group Policy and Mention Requirement (JSON5)
Source: https://docs.openclaw.ai/channels/feishu
These examples demonstrate how to configure Feishu group chat settings using JSON5. They cover allowing all groups with or without mention requirements, and allowing only specific groups.
```json5
{
  channels: {
    feishu: {
      groupPolicy: "open",
    },
  },
}
```
```json5
{
  channels: {
    feishu: {
      groupPolicy: "open",
      requireMention: true,
    },
  },
}
```
```json5
{
  channels: {
    feishu: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["oc_xxx", "oc_yyy"],
    },
  },
}
```
--------------------------------
### Perform Gateway Readiness Checks
Source: https://docs.openclaw.ai/gateway
Commands to verify the current status, channel health, and general operational readiness of the gateway.
```bash
openclaw gateway status
openclaw channels status --probe
openclaw health
```
--------------------------------
### Bundled Hook: Session Memory Output (Markdown)
Source: https://docs.openclaw.ai/automation/hooks
This markdown example shows the typical output format for the 'session-memory' bundled hook in OpenCLAW. It includes session metadata like date, time, key, ID, and source, along with extracted conversation messages.
```markdown
# Session: 2026-01-16 14:30:00 UTC
- **Session Key**: agent:main:main
- **Session ID**: abc123def456
- **Source**: telegram
```
--------------------------------
### MiniMax Configuration
Source: https://docs.openclaw.ai/start/wizard-cli-reference
Auto-writes configuration for MiniMax, with 'MiniMax-M2.7' as the hosted default and 'MiniMax-M2.5' remaining available.
```shell
Configuration is auto-written upon setup.
```
--------------------------------
### OpenClaw Agent-Specific Prompt Cache Overrides
Source: https://docs.openclaw.ai/providers/anthropic
Illustrates how to configure a baseline prompt cache retention for Anthropic models and then override it for specific agents. In this example, the 'alerts' agent disables caching while other agents maintain a 'long' cache.
```json5
{
  agents: {
    defaults: {
      model: { primary: "anthropic/claude-opus-4-6" },
      models: {
        "anthropic/claude-opus-4-6": {
          params: { cacheRetention: "long" }, // baseline for most agents
        },
      },
    },
    list: [
      { id: "research", default: true },
      { id: "alerts", params: { cacheRetention: "none" } }, // override for this agent only
    ],
  },
}
```
--------------------------------
### Start Chrome with Remote Debugging on Windows
Source: https://docs.openclaw.ai/tools/browser-wsl2-windows-remote-cdp-troubleshooting
Command to launch the Windows Chrome process with the necessary flag to expose the CDP endpoint on port 9222.
```powershell
chrome.exe --remote-debugging-port=9222
```
--------------------------------
### Pushing A2UI v0.8 Messages to Canvas
Source: https://docs.openclaw.ai/platforms/mac/canvas
CLI example for pushing A2UI v0.8 server-to-client messages to the Canvas panel. This demonstrates sending structured updates for rendering surfaces and data models.
```bash
cat > /tmp/a2ui-v0.8.jsonl <<'EOFA2'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","content"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"Canvas (A2UI v0.8)"},"usageHint":"h1"}}},{"id":"content","component":{"Text":{"text":{"literalString":"If you can read this, A2UI push works."},"usageHint":"body"}}}]}}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOFA2
openclaw nodes canvas a2ui push --jsonl /tmp/a2ui-v0.8.jsonl --node <id>
```
--------------------------------
### Configure Broadcast Groups with Multiple Agents (JSON)
Source: https://docs.openclaw.ai/channels/broadcast-groups
This JSON configuration demonstrates how to set up broadcast groups, mapping WhatsApp peer IDs to lists of agent IDs. It shows a basic setup where multiple agents will process messages in a specific group chat.
```json
{
  "broadcast": {
    "120363403215116621@g.us": ["alfred", "baerbel", "assistant3"]
  }
}
```
--------------------------------
### Configure package.json and openclaw.plugin.json for OpenClaw Channel Plugin
Source: https://docs.openclaw.ai/plugins/sdk-channel-plugins
Defines the essential configuration files for an OpenClaw channel plugin. `package.json` specifies plugin metadata and entry points, while `openclaw.plugin.json` details the plugin's kind, channels, and configuration schema, including API token and access control settings.
```json
{
  "name": "@myorg/openclaw-acme-chat",
  "version": "1.0.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"],
    "setupEntry": "./setup-entry.ts",
    "channel": {
      "id": "acme-chat",
      "label": "Acme Chat",
      "blurb": "Connect OpenClaw to Acme Chat."
    }
  }
}
```
```json
{
  "id": "acme-chat",
  "kind": "channel",
  "channels": ["acme-chat"],
  "name": "Acme Chat",
  "description": "Acme Chat channel plugin",
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "acme-chat": {
        "type": "object",
        "properties": {
          "token": { "type": "string" },
          "allowFrom": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    }
  }
}
```
--------------------------------
### Define Multi-Agent Broadcast Configurations
Source: https://docs.openclaw.ai/channels/broadcast-groups
JSON configurations for orchestrating agent teams. These examples demonstrate how to define parallel and sequential processing strategies for specific peer identifiers.
```json
{
  "broadcast": {
    "strategy": "parallel",
    "120363403215116621@g.us": [
      "code-formatter",
      "security-scanner",
      "test-coverage",
      "docs-checker"
    ]
  },
  "agents": {
    "list": [
      { "id": "code-formatter", "workspace": "~/agents/formatter", "tools": { "allow": ["read", "write"] } },
      { "id": "security-scanner", "workspace": "~/agents/security", "tools": { "allow": ["read", "exec"] } },
      { "id": "test-coverage", "workspace": "~/agents/testing", "tools": { "allow": ["read", "exec"] } },
      { "id": "docs-checker", "workspace": "~/agents/docs", "tools": { "allow": ["read"] } }
    ]
  }
}
```
```json
{
  "broadcast": {
    "strategy": "sequential",
    "+15555550123": ["detect-language", "translator-en", "translator-de"]
  },
  "agents": {
    "list": [
      { "id": "detect-language", "workspace": "~/agents/lang-detect" },
      { "id": "translator-en", "workspace": "~/agents/translate-en" },
      { "id": "translator-de", "workspace": "~/agents/translate-de" }
    ]
  }
}
```
--------------------------------
### Provision Compute Engine VM
Source: https://docs.openclaw.ai/install/gcp
Deploys a Debian 12 virtual machine instance on GCP with specified hardware resources and disk size.
```bash
gcloud compute instances create openclaw-gateway \
  --zone=us-central1-a \
  --machine-type=e2-small \
  --boot-disk-size=20GB \
  --image-family=debian-12 \
  --image-project=debian-cloud
```
--------------------------------
### Tailscale Serve Integration
Source: https://docs.openclaw.ai/web/control-ui
Instructions for integrating with Tailscale Serve for secure access to the gateway.
```APIDOC
## Gateway Command with Tailscale Serve
### Description
Starts the Openclaw gateway with Tailscale Serve enabled, allowing secure HTTPS access.
### Command
```bash
openclaw gateway --tailscale serve
```
### Access
Open `https://<magicdns>/` or your configured `gateway.controlUi.basePath`.
### Authentication
By default, Control UI/WebSocket Serve requests can authenticate via Tailscale identity headers (`tailscale-user-login`) when `gateway.auth.allowTailscale` is `true`. OpenClaw verifies the identity by resolving the `x-forwarded-for` address with `tailscale whois` and matching it to the header. Tokenless Serve auth assumes the gateway host is trusted. If untrusted local code may run on that host, require token/password auth by setting `gateway.auth.allowTailscale: false` or forcing `gateway.auth.mode: "password"`.
```
--------------------------------
### Enable Web Search and Fetch Tools
Source: https://docs.openclaw.ai/help/faq
Configures the web search plugin with a Brave API key and enables both search and fetch capabilities within OpenClaw.
```json5
{
  plugins: {
    entries: {
      brave: {
        config: {
          webSearch: {
            apiKey: "BRAVE_API_KEY_HERE"
          }
        }
      }
    }
  },
  tools: {
    web: {
      search: {
        enabled: true,
        provider: "brave",
        maxResults: 5
      },
      fetch: {
        enabled: true
      }
    }
  }
}
```
--------------------------------
### Create Virtual Network and Subnets
Source: https://docs.openclaw.ai/install/azure
Sets up a virtual network (VNet) with a subnet for the VM and a dedicated subnet named 'AzureBastionSubnet' for Azure Bastion. The NSG is attached to the VM subnet to enforce security rules.
```bash
az network vnet create \
  -g "${RG}" -n "${VNET_NAME}" -l "${LOCATION}" \
  --address-prefixes "${VNET_PREFIX}" \
  --subnet-name "${VM_SUBNET_NAME}" \
  --subnet-prefixes "${VM_SUBNET_PREFIX}"
# Attach the NSG to the VM subnet
az network vnet subnet update \
  -g "${RG}" --vnet-name "${VNET_NAME}" \
  -n "${VM_SUBNET_NAME}" --nsg "${NSG_NAME}"
# AzureBastionSubnet — name is required by Azure
az network vnet subnet create \
  -g "${RG}" --vnet-name "${VNET_NAME}" \
  -n AzureBastionSubnet \
  --address-prefixes "${BASTION_SUBNET_PREFIX}"
```
--------------------------------
### Onboard Model Studio Provider
Source: https://docs.openclaw.ai/providers/qwen_modelstudio
Commands to initialize the Model Studio provider in OpenClaw. Choose between Standard and Coding plans for either China or Global regions.
```bash
# Standard (pay-as-you-go)
openclaw onboard --auth-choice modelstudio-standard-api-key-cn
openclaw onboard --auth-choice modelstudio-standard-api-key
# Coding Plan (subscription)
openclaw onboard --auth-choice modelstudio-api-key-cn
openclaw onboard --auth-choice modelstudio-api-key
```
--------------------------------
### Example Microsoft Teams App Manifest
Source: https://docs.openclaw.ai/channels/msteams
A minimal, valid JSON manifest for a Microsoft Teams application. It includes essential fields like bot ID, scopes, file support, and resource-specific permissions required for integrating with Teams.
```json
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
  "manifestVersion": "1.23",
  "version": "1.0.0",
  "id": "00000000-0000-0000-0000-000000000000",
  "name": { "short": "OpenClaw" },
  "developer": {
    "name": "Your Org",
    "websiteUrl": "https://example.com",
    "privacyUrl": "https://example.com/privacy",
    "termsOfUseUrl": "https://example.com/terms"
  },
  "description": { "short": "OpenClaw in Teams", "full": "OpenClaw in Teams" },
  "icons": { "outline": "outline.png", "color": "color.png" },
  "accentColor": "#5B6DEF",
  "bots": [
    {
      "botId": "11111111-1111-1111-1111-111111111111",
      "scopes": ["personal", "team", "groupChat"],
      "isNotificationOnly": false,
      "supportsCalling": false,
      "supportsVideo": false,
      "supportsFiles": true
    }
  ],
  "webApplicationInfo": {
    "id": "11111111-1111-1111-1111-111111111111"
  },
  "authorization": {
    "permissions": {
      "resourceSpecific": [
        { "name": "ChannelMessage.Read.Group", "type": "Application" },
        { "name": "ChannelMessage.Send.Group", "type": "Application" },
        { "name": "Member.Read.Group", "type": "Application" },
        { "name": "Owner.Read.Group", "type": "Application" },
        { "name": "ChannelSettings.Read.Group", "type": "Application" },
        { "name": "TeamMember.Read.Group", "type": "Application" },
        { "name": "TeamSettings.Read.Group", "type": "Application" },
        { "name": "ChatMessage.Read.Chat", "type": "Application" }
      ]
    }
  }
}
```
--------------------------------
### Copy SSH Public Key to Remote Machine
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme
Securely copy your SSH public key to the remote gateway machine. This allows passwordless authentication for subsequent SSH connections.
```bash
ssh-copy-id -i ~/.ssh/id_rsa <REMOTE_USER>@<REMOTE_IP>
```
--------------------------------
### Connect to Hetzner VPS via SSH
Source: https://docs.openclaw.ai/install/hetzner
Establishes an SSH connection to the Hetzner VPS using the root user. This is the initial step for server configuration.
```bash
ssh root@YOUR_VPS_IP
```
--------------------------------
### Process OpenClaw Security Audit JSON Output
Source: https://docs.openclaw.ai/cli/security
Examples of using `jq` to parse the JSON output of the `openclaw security audit` command. This allows for programmatic analysis of audit results, such as extracting summary information or critical findings.
```bash
openclaw security audit --json | jq '.summary'
openclaw security audit --deep --json | jq '.findings[] | select(.severity=="critical") | .checkId'
openclaw security audit --fix --json | jq '{fix: .fix.ok, summary: .report.summary}'
```
--------------------------------
### Configure Kilo Gateway via CLI
Source: https://docs.openclaw.ai/providers/kilocode
Commands to authenticate with the Kilo Gateway. The first method uses the CLI onboarding command, while the second sets the API key as an environment variable for session-based access.
```bash
openclaw onboard --kilocode-api-key <key>
```
```bash
export KILOCODE_API_KEY="<your-kilocode-api-key>"
```
--------------------------------
### Set HSTS Header for Proxy TLS Termination
Source: https://docs.openclaw.ai/gateway/trusted-proxy-auth
An example of the Strict-Transport-Security header value recommended for use at the reverse proxy level to ensure secure connections.
```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
--------------------------------
### Configure NVIDIA API via CLI
Source: https://docs.openclaw.ai/providers/nvidia
Sets the NVIDIA API key as an environment variable and initializes the OpenClaw CLI to use a specific Nemotron model. This is the recommended approach to avoid exposing tokens in shell history.
```bash
export NVIDIA_API_KEY="nvapi-..."
openclaw onboard --auth-choice skip
openclaw models set nvidia/nvidia/llama-3.1-nemotron-70b-instruct
```
--------------------------------
### Manage Gmail Watch Service
Source: https://docs.openclaw.ai/automation/gmail-pubsub
Commands to start, check the status of, and stop the Gmail watch service using the gog CLI. These commands manage the lifecycle of the notification subscription for a specific account.
```bash
gog gmail watch start --account openclaw@gmail.com --label INBOX --topic projects/<project-id>/topics/gog-gmail-watch
gog gmail watch status --account openclaw@gmail.com
gog gmail watch stop --account openclaw@gmail.com
```
--------------------------------
### Get VM IP Address
Source: https://docs.openclaw.ai/install/macos-vm
Retrieves the IP address assigned to the 'openclaw' virtual machine. This IP address is crucial for establishing SSH connections to the VM.
```bash
lume get openclaw
```
--------------------------------
### Troubleshoot and Manage SSH Tunnel
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme
Commands to check if the SSH tunnel is running, restart it if necessary, or stop it completely. These utilities help in diagnosing connection issues and managing the tunnel's lifecycle.
```bash
ps aux | grep "ssh -N remote-gateway" | grep -v grep
lsof -i :18789
```
```bash
launchctl kickstart -k gui/$UID/ai.openclaw.ssh-tunnel
```
```bash
launchctl bootout gui/$UID/ai.openclaw.ssh-tunnel
```
--------------------------------
### Search for Skills using ClawHub CLI
Source: https://docs.openclaw.ai/tools/clawhub
Demonstrates how to search for skills within the ClawHub registry using a keyword query. This command is essential for discovering available skills.
```bash
clawhub search "postgres backups"
```
--------------------------------
### Create and Configure Service Account for Deployment
Source: https://docs.openclaw.ai/install/gcp
Steps to create a dedicated service account for automation and grant it necessary permissions. This follows security best practices by adhering to the principle of least privilege. Requires gcloud CLI and project permissions.
```bash
gcloud iam service-accounts create openclaw-deploy \
  --display-name="OpenClaw Deployment"
```
```bash
gcloud projects add-iam-policy-binding my-openclaw-project \
  --member="serviceAccount:openclaw-deploy@my-openclaw-project.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1"
```
--------------------------------
### Manage IPs for Private Deployment (Bash)
Source: https://docs.openclaw.ai/install/fly
These commands manage IP addresses for a Fly.io deployment to achieve a private setup. It involves listing current IPs, releasing public IPv4 and IPv6 addresses, and allocating a private-only IPv6 address. This process ensures the deployment is not discoverable via public IP scanners.
```bash
# List current IPs
fly ips list -a my-openclaw
# Release public IPs
fly ips release <public-ipv4> -a my-openclaw
fly ips release <public-ipv6> -a my-openclaw
# Switch to private config so future deploys don't re-allocate public IPs
# (remove [http_service] or deploy with the private template)
fly deploy -c fly.private.toml
# Allocate private-only IPv6
fly ips allocate-v6 --private -a my-openclaw
```
--------------------------------
### POST /onboard/non-interactive
Source: https://docs.openclaw.ai/providers/google
Configures the Google Gemini provider in a non-interactive environment using environment variables.
```APIDOC
## POST /onboard
### Description
Automated setup for CI/CD or daemon environments using direct API key injection.
### Method
POST
### Endpoint
/onboard
### Parameters
#### Query Parameters
- **non-interactive** (flag) - Required - Enables non-interactive mode
- **mode** (string) - Required - Execution mode (e.g., 'local')
- **auth-choice** (string) - Required - 'google-api-key'
- **gemini-api-key** (string) - Required - The API key for Google AI Studio
### Request Example
openclaw onboard --non-interactive --mode local --auth-choice google-api-key --gemini-api-key "$GEMINI_API_KEY"
### Response
#### Success Response (200)
- **status** (string) - Provider successfully initialized.
```
--------------------------------
### Tailscale Serve Mode Configuration (JSON)
Source: https://docs.openclaw.ai/gateway/tailscale
Configures the OpenClaw Gateway to use Tailscale Serve mode, binding to loopback and enabling Tailnet-only access. This mode requires Tailscale CLI to be installed and logged in.
```json
{
  "gateway": {
    "bind": "loopback",
    "tailscale": { "mode": "serve" },
  },
}
```
--------------------------------
### Local-First OpenClaw AI Config with Hosted Safety Net
Source: https://docs.openclaw.ai/gateway/local-models
This configuration prioritizes a local model as primary, with hosted models (Anthropic Claude Sonnet or Opus) as fallbacks. It's designed for users who prefer local processing but need a reliable backup. The `models.mode: "merge"` ensures that fallbacks are available when the local setup is down.
```json5
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "lmstudio/minimax-m2.5-gs32",
        "fallbacks": ["anthropic/claude-sonnet-4-6", "anthropic/claude-opus-4-6"],
      },
      "models": {
        "lmstudio/minimax-m2.5-gs32": { "alias": "MiniMax Local" },
        "anthropic/claude-sonnet-4-6": { "alias": "Sonnet" },
        "anthropic/claude-opus-4-6": { "alias": "Opus" },
      },
    },
  },
  "models": {
    "mode": "merge",
    "providers": {
      "lmstudio": {
        "baseUrl": "http://127.0.0.1:1234/v1",
        "apiKey": "lmstudio",
        "api": "openai-responses",
        "models": [
          {
            "id": "minimax-m2.5-gs32",
            "name": "MiniMax M2.5 GS32",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 196608,
            "maxTokens": 8192,
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Send Telegram Message with Buttons
Source: https://docs.openclaw.ai/channels/telegram
Example of sending a Telegram message with interactive buttons. The message includes text and a structured array of buttons, each with text and a callback data payload. Callback data is passed to the agent as text.
```json5
theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  action: "send",
  channel: "telegram",
  to: "123456789",
  message: "Choose an option:",
  buttons: [
    [
      { text: "Yes", callback_data: "yes" },
      { text: "No", callback_data: "no" },
    ],
    [{ text: "Cancel", callback_data: "cancel" }],
  ],
}
```
--------------------------------
### Pull Local Models with Ollama CLI
Source: https://docs.openclaw.ai/providers/ollama
Demonstrates how to pull specific open-source LLM models to your local machine using the Ollama command-line interface, making them available for OpenClaw.
```bash
ollama pull glm-4.7-flash
```
```bash
ollama pull gpt-oss:20b
```
```bash
ollama pull llama3.3
```
--------------------------------
### State and Configuration
Source: https://docs.openclaw.ai/tools/browser
Commands to manage cookies, storage, geolocation, and browser settings.
```APIDOC
## CLI COMMAND: openclaw browser set [setting] [value]
### Description
Configures browser environment settings such as geolocation, timezone, or device emulation.
### Examples
- `openclaw browser set geo 37.7749 -122.4194`
- `openclaw browser set device "iPhone 14"`
- `openclaw browser set timezone America/New_York`
```
--------------------------------
### Tools Invoke API Request Body Example
Source: https://docs.openclaw.ai/gateway/tools-invoke-http-api
This JSON object represents the structure of the request body for the /tools/invoke endpoint. It specifies the tool to be invoked ('sessions_list'), the action ('json'), and an empty arguments object. Optional fields like sessionKey and dryRun can also be included.
```json
{
  "tool": "sessions_list",
  "action": "json",
  "args": {},
  "sessionKey": "main",
  "dryRun": false
}
```
--------------------------------
### Configure Claude CLI Backend
Source: https://docs.openclaw.ai/providers/anthropic
Setting up the Claude CLI as a message provider for local inference.
```APIDOC
## Configuration: Claude CLI Backend
### Description
Configures OpenClaw to use the local Claude CLI binary for model inference instead of the Anthropic API.
### Requirements
- Claude CLI installed and authenticated on the gateway host.
- Claude CLI binary available on PATH or defined via absolute path.
### Configuration Snippet
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "claude-cli/claude-sonnet-4-6"
      },
      "cliBackends": {
        "claude-cli": {
          "command": "/opt/homebrew/bin/claude"
        }
      }
    }
  }
}
```
--------------------------------
### Hardened OpenClaw Baseline Configuration
Source: https://docs.openclaw.ai/gateway/security
This JSON configuration sets up a secure baseline for OpenClaw, restricting gateway access to local-only, isolating DMs, and disabling sensitive tools by default. It's designed to be a starting point, with tools selectively re-enabled as needed.
```json5
theme={
  "theme": {
    "light": "min-light",
    "dark": "min-dark"
  }
}
{
  gateway: {
    mode: "local",
    bind: "loopback",
    auth: { mode: "token", token: "replace-with-long-random-token" },
  },
  session: {
    dmScope: "per-channel-peer",
  },
  tools: {
    profile: "messaging",
    deny: ["group:automation", "group:runtime", "group:fs", "sessions_spawn", "sessions_send"],
    fs: { workspaceOnly: true },
    exec: { security: "deny", ask: "always" },
    elevated: { enabled: false },
  },
  channels: {
    whatsapp: { dmPolicy: "pairing", groups: { "*": { requireMention: true } } },
  },
}
```
--------------------------------
### Manual environment configuration for gateways
Source: https://docs.openclaw.ai/gateway/multiple-gateways
Illustrates how to manually define environment variables to isolate configuration paths and state directories for multiple gateway instances.
```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/main.json \
OPENCLAW_STATE_DIR=~/.openclaw-main \
openclaw gateway --port 18789
OPENCLAW_CONFIG_PATH=~/.openclaw/rescue.json \
OPENCLAW_STATE_DIR=~/.openclaw-rescue \
openclaw gateway --port 19001
```
--------------------------------
### Configure Kimi Coding Provider
Source: https://docs.openclaw.ai/gateway/configuration-reference
This configuration sets up the Kimi Coding provider, which is Anthropic-compatible. It specifies the default model and requires the KIMI_API_KEY environment variable. This provider is built-in and offers a shortcut for onboarding.
```json5
{
  env: { KIMI_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "kimi-coding/k2p5" },
      models: { "kimi-coding/k2p5": { alias: "Kimi K2.5" } },
    },
  },
}
```
--------------------------------
### Configure Media Understanding Tools
Source: https://docs.openclaw.ai/nodes/media-understanding
This JSON configuration outlines the structure for setting up media understanding tools within OpenClaw. It includes shared models, capability-specific overrides for image, audio, and video, and options for audio transcript echoing.
```json
{
  tools: {
    media: {
      models: [
        /* shared list */
      ],
      image: {
        /* optional overrides */
      },
      audio: {
        /* optional overrides */
        echoTranscript: true,
        echoFormat: '📝 "{transcript}"'
      },
      video: {
        /* optional overrides */
      }
    }
  }
}
```
--------------------------------
### OpenClaw Matrix Multi-Account Command Execution
Source: https://docs.openclaw.ai/channels/matrix
Execute OpenClaw Matrix CLI commands targeting specific accounts using the `--account` flag. This is essential in multi-account setups to ensure operations like verification or backup restore are applied to the intended account.
```bash
openclaw matrix verify status --account assistant
```
```bash
openclaw matrix verify backup restore --account assistant
```
```bash
openclaw matrix devices list --account assistant
```
--------------------------------
### Perform Environment Variable Substitution
Source: https://docs.openclaw.ai/gateway/configuration
Demonstrates how to reference environment variables within configuration strings using the ${VAR_NAME} syntax. This allows dynamic injection of secrets or paths into the configuration.
```json5
{
  gateway: { auth: { token: "${OPENCLAW_GATEWAY_TOKEN}" } },
  models: { providers: { custom: { apiKey: "${CUSTOM_API_KEY}" } } },
}
```
--------------------------------
### Recommended Mixed Traffic Tuning Pattern (YAML)
Source: https://docs.openclaw.ai/reference/prompt-caching
An example configuration for mixed traffic scenarios, recommending a long-lived cache retention for the main agent and disabling caching for bursty notifier agents. It also includes heartbeat settings for the 'research' agent.
```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-6"
    models:
      "anthropic/claude-opus-4-6":
        params:
          cacheRetention: "long"
  list:
    - id: "research"
      default: true
      heartbeat:
        every: "55m"
    - id: "alerts"
      params:
        cacheRetention: "none"
```
--------------------------------
### Setting Up CLI Backends as Fallbacks
Source: https://docs.openclaw.ai/gateway/cli-backends
Illustrates how to integrate CLI backends into the fallback model list in OpenClaw's agent configuration. This ensures that CLI models are used only when primary API providers fail.
```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["claude-cli/opus-4.6", "claude-cli/opus-4.5"],
      },
      models: {
        "anthropic/claude-opus-4-6": { alias: "Opus" },
        "claude-cli/opus-4.6": {},
        "claude-cli/opus-4.5": {},
      },
    },
  },
}
```
--------------------------------
### Define Global Defaults and Agent Overrides
Source: https://docs.openclaw.ai/tools/multi-agent-sandbox-tools
Illustrates the use of 'agents.defaults' to set global sandbox policies while allowing specific agents to override these settings.
```json
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "non-main",
        "scope": "session"
      }
    },
    "list": [
      {
        "id": "main",
        "workspace": "~/.openclaw/workspace",
        "sandbox": {
          "mode": "off"
        }
      },
      {
        "id": "public",
        "workspace": "~/.openclaw/workspace-public",
        "sandbox": {
          "mode": "all",
          "scope": "agent"
        },
        "tools": {
          "allow": ["read"],
          "deny": ["exec", "write", "edit", "apply_patch"]
        }
      }
    ]
  }
}
```
--------------------------------
### GET /v1/models
Source: https://docs.openclaw.ai/providers/vllm
Retrieves the list of available models from the vLLM server. OpenClaw uses this endpoint for auto-discovery when the vLLM provider is not explicitly configured.
```APIDOC
## GET /v1/models
### Description
Fetches a list of all models currently loaded and available on the vLLM server. This is used by OpenClaw to automatically populate available model options.
### Method
GET
### Endpoint
{base_url}/v1/models
### Parameters
None
### Request Example
curl http://127.0.0.1:8000/v1/models
### Response
#### Success Response (200)
- **object** (json) - Contains a list of model objects including IDs and metadata.
#### Response Example
{
  "object": "list",
  "data": [
    {
      "id": "your-model-id",
      "object": "model",
      "owned_by": "vllm"
    }
  ]
}
```
--------------------------------
### Execute Web Fetch Request
Source: https://docs.openclaw.ai/tools/web-fetch
Demonstrates how to invoke the web_fetch tool programmatically to retrieve content from a specified URL.
```javascript
await web_fetch({ url: "https://example.com/article" });
```
--------------------------------
### Configure Tool Access with Allow/Deny Lists
Source: https://docs.openclaw.ai/tools
This JSON configuration snippet demonstrates how to control which tools the agent can access using 'allow' and 'deny' lists. It specifies that file system operations (group:fs), browser, and web_search are permitted, while 'exec' is explicitly denied. Deny rules take precedence over allow rules.
```json
{
  "tools": {
    "allow": ["group:fs", "browser", "web_search"],
    "deny": ["exec"]
  }
}
```
--------------------------------
### Manage OpenClaw Gateway Configuration and Devices
Source: https://docs.openclaw.ai/install/gcp
CLI commands to configure allowed origins, fetch dashboard tokens, and manage device pairing requests.
```bash
docker compose run --rm openclaw-cli config set gateway.controlUi.allowedOrigins '["http://127.0.0.1:18789"]' --strict-json
docker compose run --rm openclaw-cli dashboard --no-open
docker compose run --rm openclaw-cli devices list
docker compose run --rm openclaw-cli devices approve <requestId>
```
--------------------------------
### Configure xAI (Grok) API Key
Source: https://docs.openclaw.ai/start/wizard-cli-reference
Prompts the user for the XAI_API_KEY to configure xAI as a model provider.
```shell
export XAI_API_KEY='your-xai-api-key'
```
--------------------------------
### Manage Voice Calls via CLI
Source: https://docs.openclaw.ai/cli/voicecall
Commands to interact with the voicecall plugin for checking status, initiating calls, continuing active sessions, and terminating calls. These commands require the voice-call plugin to be installed and enabled.
```bash
openclaw voicecall status --call-id <id>
openclaw voicecall call --to "+15555550123" --message "Hello" --mode notify
openclaw voicecall continue --call-id <id> --message "Any questions?"
openclaw voicecall end --call-id <id>
```
--------------------------------
### Configuration Management (TypeScript)
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Handles loading and writing configuration files for the runtime environment. It allows fetching the current configuration and persisting changes.
```typescript
const cfg = await api.runtime.config.loadConfig();
await api.runtime.config.writeConfigFile(cfg);
```
--------------------------------
### Plugin SDK Entry Points
Source: https://docs.openclaw.ai/plugins/sdk-overview
Defines the core entry points for initializing plugins and channel-specific logic within the OpenClaw AI ecosystem.
```APIDOC
## MODULE plugin-sdk/plugin-entry
### Description
Primary entry point for defining a new plugin.
### Key Exports
- **definePluginEntry** (Function) - Initializes the plugin entry configuration.
## MODULE plugin-sdk/core
### Description
Core utilities for channel plugin development.
### Key Exports
- **defineChannelPluginEntry** (Function) - Defines a channel-specific plugin entry.
- **createChatChannelPlugin** (Function) - Factory for chat-based channel plugins.
- **createChannelPluginBase** (Function) - Base class/factory for channel plugins.
- **defineSetupPluginEntry** (Function) - Defines setup-specific plugin entry.
- **buildChannelConfigSchema** (Function) - Helper to construct configuration schemas.
```
--------------------------------
### Define General Plugin Entry Point (TypeScript)
Source: https://docs.openclaw.ai/plugins/sdk-entrypoints
Use `definePluginEntry` to create an entry point for provider, tool, or hook plugins. It requires an ID, name, description, and a `register` function to hook into the API. Dependencies include the 'openclaw/plugin-sdk/plugin-entry' module.
```typescript
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
export default definePluginEntry({
  id: "my-plugin",
  name: "My Plugin",
  description: "Short summary",
  register(api) {
    api.registerProvider({
      /* ... */
    });
    api.registerTool({
      /* ... */
    });
  },
});
```
--------------------------------
### Force Specific Backend with :provider Suffix
Source: https://docs.openclaw.ai/providers/huggingface
This example demonstrates how to force a specific backend provider for a model by appending the ':provider' suffix to the model name. Here, DeepSeek R1 is configured to use the 'together' provider.
```json5
{
  agents: {
    defaults: {
      model: { primary: "huggingface/deepseek-ai/DeepSeek-R1:together" },
      models: {
        "huggingface/deepseek-ai/DeepSeek-R1:together": { alias: "DeepSeek R1 (Together)" },
      },
    },
  },
}
```
--------------------------------
### Test OpenClaw Browser Browsing Functionality
Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting
Tests the core browsing functionality of OpenClaw. The first command initiates a browsing session, and the second retrieves a list of currently open tabs, confirming that the browser control is operational.
```bash
curl -s -X POST http://127.0.0.1:18791/start
curl -s http://127.0.0.1:18791/tabs
```
--------------------------------
### Get Node Location using OpenClaw CLI
Source: https://docs.openclaw.ai/nodes
Retrieves the location data for a specified node. Requires Location to be enabled in settings. Supports specifying accuracy and timeout parameters.
```bash
openclaw nodes location get --node <idOrNameOrIp>
openclaw nodes location get --node <idOrNameOrIp> --accuracy precise --max-age 15000 --location-timeout 10000
```
--------------------------------
### Enable Lightweight Context
Source: https://docs.openclaw.ai/cli/cron
Configures an isolated cron job to use lightweight bootstrap context, reducing resource overhead.
```bash
openclaw cron edit <job-id> --light-context
```
--------------------------------
### Get Self Information (Zalo User)
Source: https://docs.openclaw.ai/cli/directory
Retrieves information about the current user ('self') for the 'zalouser' channel. This is useful for understanding the context of the current account within the Zalo platform.
```bash
openclaw directory self --channel zalouser
```
--------------------------------
### Initialize Workspace Version Control
Source: https://docs.openclaw.ai/reference/AGENTS.default
Commands to initialize a Git repository within the workspace to ensure agent memory and configuration files are backed up.
```bash
cd ~/.openclaw/workspace
git init
git add AGENTS.md
git commit -m "Add Clawd workspace"
```
--------------------------------
### Set Up Webhooks
Source: https://docs.openclaw.ai/gateway/configuration
Configures HTTP webhook endpoints for the gateway. This includes defining security tokens, request paths, and mapping incoming requests to specific internal agents.
```json5
{
  hooks: {
    enabled: true,
    token: "shared-secret",
    path: "/hooks",
    defaultSessionKey: "hook:ingress",
    allowRequestSessionKey: false,
    allowedSessionKeyPrefixes: ["hook:"],
    mappings: [
      {
        match: { path: "gmail" },
        action: "agent",
        agentId: "main",
        deliver: true,
      },
    ],
  },
}
```
--------------------------------
### Generate Shell Completion Scripts to State Directory
Source: https://docs.openclaw.ai/cli/completion
This snippet shows how to generate shell completion scripts and write them directly to the `$OPENCLAW_STATE_DIR/completions` directory without printing to standard output. This is useful for automated setups or when you want to manage completion scripts programmatically. It supports specifying the target shell.
```bash
openclaw completion --write-state
openclaw completion --shell bash --write-state
```
--------------------------------
### Configure Message Queue Modes (OpenClaw)
Source: https://docs.openclaw.ai/help/faq
Queue mode determines how new messages interact with ongoing tasks. Use the '/queue' command to switch between modes like 'steer', 'followup', 'collect', 'steer-backlog', and 'interrupt'. Additional options like 'debounce', 'cap', and 'drop' can be added for 'followup' modes.
```bash
/queue steer
/queue followup
/queue collect
/queue steer-backlog
/queue interrupt
/queue followup debounce:2s cap:25 drop:summarize
```
--------------------------------
### Check OpenClaw Gateway Status and Stop Process
Source: https://docs.openclaw.ai/platforms/mac/dev-setup
Commands to check the status of the OpenClaw gateway and stop any running gateway processes. This is useful for troubleshooting scenarios where the gateway remains in a 'Starting...' state indefinitely, potentially due to a zombie process holding the port.
```bash
openclaw gateway status
openclaw gateway stop
lsof -nP -iTCP:18789 -sTCP:LISTEN
```
--------------------------------
### Inspect OpenClaw Plugin Details
Source: https://docs.openclaw.ai/cli/plugins
Provides deep introspection for a single plugin, displaying its identity, load status, source, registered capabilities, hooks, tools, commands, services, gateway methods, HTTP routes, policy flags, diagnostics, and install metadata. The `--json` flag outputs a machine-readable report suitable for scripting and auditing. `info` is an alias for `inspect`.
```bash
openclaw plugins inspect <id>
openclaw plugins inspect <id> --json
```
--------------------------------
### Manually Paste Anthropic Token
Source: https://docs.openclaw.ai/gateway/authentication
Manually pastes an Anthropic authentication token into OpenClaw. This is useful when the token was generated on a different machine or when direct command-line input is preferred over interactive setup.
```bash
openclaw models auth paste-token --provider anthropic
```
--------------------------------
### Approve OpenClaw Device Pairing Request
Source: https://docs.openclaw.ai/cli/devices
Approves a pending device pairing request. If no request ID is provided, it approves the most recent one using the --latest flag. Use `openclaw devices list` beforehand to get the current request ID.
```bash
openclaw devices approve
openclaw devices approve <requestId>
openclaw devices approve --latest
```
--------------------------------
### Non-Interactive Z.AI Endpoint Onboarding
Source: https://docs.openclaw.ai/cli/onboard
Shows non-interactive onboarding for Z.AI endpoints, including options for selecting specific endpoints like 'zai-coding-global' or 'zai-coding-cn'. The system auto-detects the best endpoint if not specified.
```bash
# Promptless endpoint selection
openclaw onboard --non-interactive \
  --auth-choice zai-coding-global \
  --zai-api-key "$ZAI_API_KEY"
# Other Z.AI endpoint choices:
# --auth-choice zai-coding-cn
# --auth-choice zai-global
```
--------------------------------
### Run OpenClaw Gateway with File Watcher
Source: https://docs.openclaw.ai/help/debugging
Starts the OpenClaw gateway in watch mode for fast iteration during development. This mode automatically restarts the gateway when relevant files change, mapping to a script that monitors source files, extension configurations, and build-related files.
```bash
pnpm gateway:watch
# Equivalent to:
node scripts/watch-node.mjs gateway --force
```
--------------------------------
### Provider-Specific Tool Restrictions (JSON5)
Source: https://docs.openclaw.ai/tools
Demonstrates how to restrict tools for specific providers using the `tools.byProvider` configuration. This allows for fine-grained control over tool availability per provider without altering global defaults.
```json5
{
  tools: {
    profile: "coding",
    byProvider: {
      "google-antigravity": { profile: "minimal" },
    },
  },
}
```
--------------------------------
### Setting Up Default and Session-Specific Model Aliases in OpenClaw
Source: https://docs.openclaw.ai/help/faq
Illustrates how to configure default models and define aliases for easier switching. This includes setting a primary default model and mapping specific model IDs to short aliases for use with the `/model` command.
```json5
{
  env: { MINIMAX_API_KEY: "sk-...", OPENAI_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "minimax/MiniMax-M2.7" },
      models: {
        "minimax/MiniMax-M2.7": { alias: "minimax" },
        "openai/gpt-5.2": { alias: "gpt" },
      },
    },
  },
}
/model gpt
```
--------------------------------
### Multi-Account Channel Heartbeat Configuration
Source: https://docs.openclaw.ai/gateway/heartbeat
Illustrates how to target a specific account on a multi-account channel like Telegram. This example configures the 'ops' agent's heartbeat to use the 'ops-bot' account and provides the necessary bot token configuration for the Telegram channel.
```json5
{
  agents: {
    list: [
      {
        id: "ops",
        heartbeat: {
          every: "1h",
          target: "telegram",
          to: "12345678:topic:42", // optional: route to a specific topic/thread
          accountId: "ops-bot",
        },
      },
    ],
  },
  channels: {
    telegram: {
      accounts: {
        "ops-bot": { botToken: "YOUR_TELEGRAM_BOT_TOKEN" },
      },
    },
  },
}
```
--------------------------------
### Importing Plugin SDK Test Utilities
Source: https://docs.openclaw.ai/plugins/sdk-testing
Demonstrates how to import helper functions and types from the openclaw/plugin-sdk/testing package for use in test suites.
```typescript
import { installCommonResolveTargetErrorCases, shouldAckReaction, removeAckReactionAfterReply } from "openclaw/plugin-sdk/testing";
import type { ChannelAccountSnapshot, ChannelGatewayContext, OpenClawConfig, PluginRuntime, RuntimeEnv, MockFn } from "openclaw/plugin-sdk/testing";
```
--------------------------------
### Update OpenClaw CLI
Source: https://docs.openclaw.ai/cli/update
Commands to trigger updates, switch channels, or perform dry runs. These commands manage the versioning and installation state of the OpenClaw gateway.
```bash
openclaw update
openclaw update status
openclaw update wizard
openclaw update --channel beta
openclaw update --channel dev
openclaw update --tag beta
openclaw update --tag main
openclaw update --dry-run
openclaw update --no-restart
openclaw update --json
openclaw --update
```
--------------------------------
### Storing API Keys
Source: https://docs.openclaw.ai/tools/web
Instructions on how to store API keys for web search providers, either in the configuration file or via environment variables.
```APIDOC
### Storing API keys
<Tabs>
  <Tab title="Config file">
    Run `openclaw configure --section web` or set the key directly:
    ```json5
    {
      plugins: {
        entries: {
          brave: {
            config: {
              webSearch: {
                apiKey: "YOUR_KEY", // pragma: allowlist secret
              },
            },
          },
        },
      },
    }
    ```
  </Tab>
  <Tab title="Environment variable">
    Set the provider env var in the Gateway process environment:
    ```bash
    export BRAVE_API_KEY="YOUR_KEY"
    ```
    For a gateway install, put it in `~/.openclaw/.env`.
    See [Env vars](/help/faq#env-vars-and-env-loading).
  </Tab>
</Tabs>
```
--------------------------------
### Trigger Permissions Prompts for Headless Gateway
Source: https://docs.openclaw.ai/channels/imessage
Example bash commands to trigger macOS permission prompts (Full Disk Access, Automation) when the OpenClaw gateway is running in a headless context like a LaunchAgent or SSH session. This ensures the necessary permissions are granted.
```bash
imsg chats --limit 1
# or
imsg send <handle> "test"
```
--------------------------------
### Tool Parameters: `resume`
Source: https://docs.openclaw.ai/tools/lobster
Details on how to use the `resume` action to continue halted workflows.
```APIDOC
### `resume`
Continue a halted workflow after approval.
```json
{
  "action": "resume",
  "token": "<resumeToken>",
  "approve": true
}
```
```
--------------------------------
### UI Hints Configuration
Source: https://docs.openclaw.ai/plugins/manifest
Defines the structure for UI rendering hints associated with configuration fields.
```APIDOC
## GET /uiHints
### Description
Provides a map of configuration field names to rendering hints, allowing the UI to customize labels, help text, and input behavior.
### Parameters
#### Request Body
- **label** (string) - Optional - User-facing field label.
- **help** (string) - Optional - Short helper text.
- **tags** (string[]) - Optional - Optional UI tags.
- **advanced** (boolean) - Optional - Marks the field as advanced.
- **sensitive** (boolean) - Optional - Marks the field as secret or sensitive.
- **placeholder** (string) - Optional - Placeholder text for form inputs.
### Request Example
{
  "uiHints": {
    "apiKey": {
      "label": "API key",
      "help": "Used for OpenRouter requests",
      "placeholder": "sk-or-v1-...",
      "sensitive": true
    }
  }
}
```
--------------------------------
### Configure Synthetic Provider (Anthropic-compatible)
Source: https://docs.openclaw.ai/gateway/configuration-reference
This configuration sets up the Synthetic provider for Anthropic-compatible models, specifically MiniMax M2.5. It requires the SYNTHETIC_API_KEY and specifies the base URL and API type. Note that the base URL should not include '/v1'.
```json5
{
  env: { SYNTHETIC_API_KEY: "sk-..." },
  agents: {
    defaults: {
      model: { primary: "synthetic/hf:MiniMaxAI/MiniMax-M2.5" },
      models: { "synthetic/hf:MiniMaxAI/MiniMax-M2.5": { alias: "MiniMax M2.5" } },
    },
  },
  models: {
    mode: "merge",
    providers: {
      synthetic: {
        baseUrl: "https://api.synthetic.new/anthropic",
        apiKey: "${SYNTHETIC_API_KEY}",
        api: "anthropic-messages",
        models: [
          {
            id: "hf:MiniMaxAI/MiniMax-M2.5",
            name: "MiniMax M2.5",
            reasoning: true,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 192000,
            maxTokens: 65536,
          },
        ],
      },
    },
  },
}
```
--------------------------------
### Run Gmail Watcher Daemon Manually
Source: https://docs.openclaw.ai/automation/gmail-pubsub
This bash command manually starts the Gmail watcher daemon. This daemon monitors Gmail for new messages and forwards them to the configured OpenClaw webhook endpoint. It also handles auto-renewal of the watch subscription.
```bash
openclaw webhooks gmail run
```
--------------------------------
### Initialize OpenClaw Workspace
Source: https://docs.openclaw.ai/cli/setup
Initializes the ~/.openclaw/openclaw.json configuration file and the agent workspace. You can optionally specify a custom workspace path using the --workspace flag.
```bash
openclaw setup
openclaw setup --workspace ~/.openclaw/workspace
```
--------------------------------
### Integrate Caddy with OpenClaw
Source: https://docs.openclaw.ai/gateway/trusted-proxy-auth
Sets up OpenClaw to accept identity headers from Caddy using the caddy-security plugin. Includes the gateway configuration and the Caddyfile snippet.
```json5
{
  gateway: {
    bind: "lan",
    trustedProxies: ["127.0.0.1"],
    auth: {
      mode: "trusted-proxy",
      trustedProxy: {
        userHeader: "x-forwarded-user",
      },
    },
  },
}
```
```caddy
openclaw.example.com {
    authenticate with oauth2_provider
    authorize with policy1
    reverse_proxy openclaw:18789 {
        header_up X-Forwarded-User {http.auth.user.email}
    }
}
```
--------------------------------
### Gateway WebSocket Protocol Message Frames
Source: https://docs.openclaw.ai/concepts/typebox
Examples of standard JSON frames used in the Gateway WebSocket protocol, including connection handshake, server responses, method requests, and event notifications.
```json
{
  "type": "req",
  "id": "c1",
  "method": "connect",
  "params": {
    "minProtocol": 2,
    "maxProtocol": 2,
    "client": {
      "id": "openclaw-macos",
      "displayName": "macos",
      "version": "1.0.0",
      "platform": "macos 15.1",
      "mode": "ui",
      "instanceId": "A1B2"
    }
  }
}
```
```json
{
  "type": "res",
  "id": "c1",
  "ok": true,
  "payload": {
    "type": "hello-ok",
    "protocol": 2,
    "server": { "version": "dev", "connId": "ws-1" },
    "features": { "methods": ["health"], "events": ["tick"] },
    "snapshot": {
      "presence": [],
      "health": {},
      "stateVersion": { "presence": 0, "health": 0 },
      "uptimeMs": 0
    },
    "policy": { "maxPayload": 1048576, "maxBufferedBytes": 1048576, "tickIntervalMs": 30000 }
  }
}
```
```json
{
  "type": "req",
  "id": "r1",
  "method": "health"
}
```
```json
{
  "type": "res",
  "id": "r1",
  "ok": true,
  "payload": { "ok": true }
}
```
```json
{
  "type": "event",
  "event": "tick",
  "payload": { "ts": 1730000000 },
  "seq": 12
}
```
--------------------------------
### Low-Level Media Utilities (TypeScript)
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Provides essential utilities for handling media, including loading web media, detecting MIME types, identifying media kinds, checking audio compatibility, extracting image metadata, and resizing images to JPEG format.
```typescript
const webMedia = await api.runtime.media.loadWebMedia(url);
const mime = await api.runtime.media.detectMime(buffer);
const kind = api.runtime.media.mediaKindFromMime("image/jpeg"); // "image"
const isVoice = api.runtime.media.isVoiceCompatibleAudio(filePath);
const metadata = await api.runtime.media.getImageMetadata(filePath);
const resized = await api.runtime.media.resizeToJpeg(buffer, { maxWidth: 800 });
```
--------------------------------
### OpenRouter Configuration Snippet
Source: https://docs.openclaw.ai/providers/openrouter
A configuration snippet showing how to set up OpenRouter with a default model.
```APIDOC
## Config snippet
### Description
This JSON5 snippet configures the environment variable for your OpenRouter API key and sets a default model for agents.
### Method
Configuration File
### Endpoint
N/A
### Parameters
#### Path Parameters
None
#### Query Parameters
None
#### Request Body
- **env** (object) - Required - Environment variables.
  - **OPENROUTER_API_KEY** (string) - Required - Your OpenRouter API key.
- **agents** (object) - Required - Agent configurations.
  - **defaults** (object) - Required - Default agent settings.
    - **model** (object) - Required - Default model configuration.
      - **primary** (string) - Required - The primary model to use, e.g., `openrouter/anthropic/claude-sonnet-4-6`.
### Request Example
```json5
{
  "env": { "OPENROUTER_API_KEY": "sk-or-..." },
  "agents": {
    "defaults": {
      "model": { "primary": "openrouter/anthropic/claude-sonnet-4-6" },
    },
  },
}
```
### Response
#### Success Response (200)
Configuration is applied.
#### Response Example
None
```
--------------------------------
### Configure Delegate Agent Bindings
Source: https://docs.openclaw.ai/concepts/delegate-architecture
This JSON configuration defines how inbound messages are routed to different agents based on channel and account identifiers. It sets up a 'delegate' agent for specific channels like WhatsApp and Discord, while routing all other WhatsApp messages to a 'main' agent. Dependencies include the Openclaw framework.
```json5
{
  agents: {
    list: [
      { id: "main", workspace: "~/.openclaw/workspace" },
      {
        id: "delegate",
        workspace: "~/.openclaw/workspace-delegate",
        tools: {
          deny: ["browser", "canvas"],
        },
      },
    ],
  },
  bindings: [
    // Route a specific channel account to the delegate
    {
      agentId: "delegate",
      match: { channel: "whatsapp", accountId: "org" },
    },
    // Route a Discord guild to the delegate
    {
      agentId: "delegate",
      match: { channel: "discord", guildId: "123456789012345678" },
    },
    // Everything else goes to the main personal agent
    { agentId: "main", match: { channel: "whatsapp" } },
  ],
}
```
--------------------------------
### Get Authenticated Health Snapshot from Openclaw Gateway
Source: https://docs.openclaw.ai/install/docker
This command retrieves a deep health snapshot from the Openclaw gateway using its internal node script. It requires the OPENCLAW_GATEWAY_TOKEN environment variable for authentication.
```bash
docker compose exec openclaw-gateway node dist/index.js health --token "$OPENCLAW_GATEWAY_TOKEN"
```
--------------------------------
### Configure Live Test with Specific Models
Source: https://docs.openclaw.ai/help/testing
Run live tests focusing on specific models or providers. This allows for targeted testing of individual model integrations or broader coverage across multiple providers through the gateway.
```bash
OPENCLAW_LIVE_MODELS="openai/gpt-5.2" pnpm test:live src/agents/models.profiles.live.test.ts
```
```bash
OPENCLAW_LIVE_GATEWAY_MODELS="openai/gpt-5.2" pnpm test:live src/gateway/gateway-models.profiles.live.test.ts
```
```bash
OPENCLAW_LIVE_GATEWAY_MODELS="openai/gpt-5.2,anthropic/claude-opus-4-6,google/gemini-3-flash-preview,zai/glm-4.7,minimax/MiniMax-M2.7" pnpm test:live src/gateway/gateway-models.profiles.live.test.ts
```
```bash
OPENCLAW_LIVE_GATEWAY_MODELS="google/gemini-3-flash-preview" pnpm test:live src/gateway/gateway-models.profiles.live.test.ts
```
```bash
OPENCLAW_LIVE_GATEWAY_MODELS="google-antigravity/claude-opus-4-6-thinking,google-antigravity/gemini-3-pro-high" pnpm test:live src/gateway/gateway-models.profiles.live.test.ts
```
--------------------------------
### Proxy macOS Binaries via SSH for OpenClaw Skills
Source: https://docs.openclaw.ai/help/faq
This snippet demonstrates how to create an SSH wrapper for macOS binaries to be used on a Linux host. It includes creating the wrapper script and overriding skill metadata to allow Linux execution. This is useful for running macOS-only skills on a Linux Gateway.
```bash
#!/usr/bin/env bash
set -euo pipefail
exec ssh -T user@mac-host /opt/homebrew/bin/memo "$@"
```
```markdown
---
name: apple-notes
description: Manage Apple Notes via the memo CLI on macOS.
metadata: { "openclaw": { "os": ["darwin", "linux"], "requires": { "bins": ["memo"] } } }
---
```
--------------------------------
### Interact with Node Camera and Screen Recording
Source: https://docs.openclaw.ai/nodes
Commands to capture photos, record video clips from node cameras, and perform screen recordings on supported node platforms.
```bash
openclaw nodes camera snap --node <idOrNameOrIp> --facing front
openclaw nodes camera clip --node <idOrNameOrIp> --duration 10s
openclaw nodes screen record --node <idOrNameOrIp> --duration 10s --fps 10
```
--------------------------------
### Device Management
Source: https://docs.openclaw.ai/nodes
Commands for listing and approving devices.
```APIDOC
## Device Management
### List Devices
Lists available devices.
### Method
GET
### Endpoint
/devices
### Parameters
None
### Response
#### Success Response (200)
- **devices** (array) - List of devices.
### Response Example
```json
{
  "devices": [
    {
      "requestId": "req_123",
      "name": "Node 1",
      "status": "pending"
    }
  ]
}
```
## POST /devices/approve
Approves a device request.
### Method
POST
### Endpoint
/devices/approve
### Parameters
#### Query Parameters
- **requestId** (string) - Required - The ID of the request to approve.
### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
### Response Example
```json
{
  "message": "Device approved successfully."
}
```
```
--------------------------------
### Generate Virtual Key for OpenClaw with Spend Limits
Source: https://docs.openclaw.ai/providers/litellm
Creates a dedicated virtual key for OpenClaw via the LiteLLM API, setting a maximum monthly budget for usage.
```bash
curl -X POST "http://localhost:4000/key/generate" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "key_alias": "openclaw",
    "max_budget": 50.00,
    "budget_duration": "monthly"
  }'
```
--------------------------------
### Configure User and Hostname (Bash)
Source: https://docs.openclaw.ai/install/oracle
Sets the hostname for the OCI instance to 'openclaw', allows the 'ubuntu' user to set a new password, and enables user lingering to ensure services run after logout.
```bash
sudo hostnamectl set-hostname openclaw
sudo passwd ubuntu
sudo loginctl enable-linger ubuntu
```
--------------------------------
### Define Environment Variables
Source: https://docs.openclaw.ai/install/gcp
Sets up the .env file with necessary configuration parameters for the OpenClaw application, including image tags and directory paths.
```bash
OPENCLAW_IMAGE=openclaw:latest
OPENCLAW_GATEWAY_TOKEN=change-me-now
OPENCLAW_GATEWAY_BIND=lan
OPENCLAW_GATEWAY_PORT=18789
OPENCLAW_CONFIG_DIR=/home/$USER/.openclaw
OPENCLAW_WORKSPACE_DIR=/home/$USER/.openclaw/workspace
```
--------------------------------
### Configuration
Source: https://docs.openclaw.ai/nodes
Commands for setting CLI configuration values.
```APIDOC
## Configuration
### Set Configuration Value
Sets a configuration value for the Openclaw CLI.
### Method
POST
### Endpoint
/config/set
### Parameters
#### Query Parameters
- **key** (string) - Required - The configuration key (e.g., `tools.exec.host`).
- **value** (string) - Required - The value to set for the key.
### Response
#### Success Response (200)
- **message** (string) - Confirmation message.
### Response Example
```json
{
  "message": "Configuration updated successfully."
}
```
```
--------------------------------
### OpenClaw MiniMax Configuration Options
Source: https://docs.openclaw.ai/providers/minimax
Detailed list of configuration options available for the MiniMax provider in OpenClaw.
```APIDOC
## OpenClaw MiniMax Configuration Options
### Description
This section outlines the various configuration parameters available for the MiniMax provider within OpenClaw, allowing for fine-tuning of model behavior and API interaction.
### Method
Configuration file (`models.json`) or CLI (`openclaw configure`)
### Endpoint
N/A
### Parameters
* `models.providers.minimax.baseUrl`: The base URL for the MiniMax API. Prefer `https://api.minimax.io/anthropic` for Anthropic-compatible payloads. `https://api.minimax.io/v1` is an option for OpenAI-compatible payloads.
* `models.providers.minimax.api`: The API type to use. Prefer `anthropic-messages` for Anthropic-compatible payloads. `openai-completions` is an option for OpenAI-compatible payloads.
* `models.providers.minimax.apiKey`: Your MiniMax API key. It is recommended to set this via the `MINIMAX_API_KEY` environment variable.
* `models.providers.minimax.models`: An array defining the specific MiniMax models available. Each model object can include:
    * `id` (string): Unique identifier for the model.
    * `name` (string): User-friendly name of the model.
    * `reasoning` (boolean): Whether the model supports reasoning capabilities.
    * `input` (array of strings): Supported input modalities (e.g., `["text"]`).
    * `cost` (object): Pricing information for model usage (input, output, cacheRead, cacheWrite).
    * `contextWindow` (integer): The maximum context window size in tokens.
    * `maxTokens` (integer): The maximum number of tokens the model can generate.
* `agents.defaults.models`: An object used to alias models, making them easier to reference within agent configurations.
* `models.mode`: Determines how provider configurations are merged. Use `merge` to add MiniMax alongside other built-in models.
```
--------------------------------
### Enable Shell Environment Import
Source: https://docs.openclaw.ai/gateway/configuration
Configures OpenClaw to execute the user's login shell to fetch missing environment variables. This is useful for environments where variables are managed by shell startup scripts.
```json5
{
  env: {
    shellEnv: { enabled: true, timeoutMs: 15000 },
  },
}
```
--------------------------------
### Configure OpenClaw Environment Variables
Source: https://docs.openclaw.ai/install/hetzner
Sets up the `.env` file with essential environment variables for OpenClaw, including image name, gateway token, and directory paths. It also includes instructions for generating strong secrets and a warning not to commit this file.
```bash
OPENCLAW_IMAGE=openclaw:latest
OPENCLAW_GATEWAY_TOKEN=change-me-now
OPENCLAW_GATEWAY_BIND=lan
OPENCLAW_GATEWAY_PORT=18789
OPENCLAW_CONFIG_DIR=/root/.openclaw
OPENCLAW_WORKSPACE_DIR=/root/.openclaw/workspace
GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.openclaw
```
```bash
openssl rand -hex 32
```
--------------------------------
### Select Agents using Session Keys
Source: https://docs.openclaw.ai/cli/acp
Demonstrates how to target specific agents by using agent-scoped session keys with the `openclaw acp` command. Each session key maps to a single Gateway session.
```bash
openclaw acp --session agent:main:main
openclaw acp --session agent:design:main
openclaw acp --session agent:qa:bug-123
```
--------------------------------
### Configure OpenAI Primary with ElevenLabs Fallback
Source: https://docs.openclaw.ai/tools/tts
Sets up OpenAI as the primary TTS engine with ElevenLabs as a fallback, including specific model and voice parameters for both.
```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "openai",
      summaryModel: "openai/gpt-4.1-mini",
      modelOverrides: {
        enabled: true,
      },
      providers: {
        openai: {
          apiKey: "openai_api_key",
          baseUrl: "https://api.openai.com/v1",
          model: "gpt-4o-mini-tts",
          voice: "alloy",
        },
        elevenlabs: {
          apiKey: "elevenlabs_api_key",
          baseUrl: "https://api.elevenlabs.io",
          voiceId: "voice_id",
          modelId: "eleven_multilingual_v2",
          seed: 42,
          applyTextNormalization: "auto",
          languageCode: "en",
          voiceSettings: {
            stability: 0.5,
            similarityBoost: 0.75,
            style: 0.0,
            useSpeakerBoost: true,
            speed: 1.0,
          },
        },
      },
    },
  },
}
```
--------------------------------
### POST /node.invoke (camera.list)
Source: https://docs.openclaw.ai/nodes/camera
Retrieves a list of available camera devices connected to the node.
```APIDOC
## POST /node.invoke (camera.list)
### Description
Returns an array of available camera devices including their ID, name, position, and type.
### Method
POST
### Endpoint
/node.invoke
### Request Body
- **command** (string) - Required - "camera.list"
### Response
#### Success Response (200)
- **devices** (array) - List of objects containing {id, name, position, deviceType}
#### Response Example
{
  "devices": [
    { "id": "front_cam", "name": "Front Camera", "position": "front", "deviceType": "built-in" }
  ]
}
```
--------------------------------
### Enable PluralKit Support
Source: https://docs.openclaw.ai/channels/discord
Enables integration with PluralKit to resolve proxied messages to system member identities. Includes an optional token for private systems.
```json5
{
  channels: {
    discord: {
      pluralkit: {
        enabled: true,
        token: "pk_live_...",
      },
    },
  },
}
```
--------------------------------
### Configure Plugins
Source: https://docs.openclaw.ai/gateway/configuration-reference
Manages plugin loading, security hooks, and provider-specific configurations. This allows for extending core functionality with custom extensions.
```json5
plugins: {
  enabled: true,
  allow: ["voice-call"],
  deny: [],
  load: {
    paths: ["~/Projects/oss/voice-call-extension"]
  },
  entries: {
    "voice-call": {
      enabled: true,
      hooks: {
        allowPromptInjection: false
      },
      config: { provider: "twilio" }
    }
  }
}
```
--------------------------------
### Extract Channel ID from Teams URL (CLI)
Source: https://docs.openclaw.ai/channels/msteams
This example shows how to extract a Channel ID from a Microsoft Teams URL for configuration. The ID is located in the URL path segment after '/channel/' and requires URL decoding.
```bash
# Channel URL:
# https://teams.microsoft.com/l/channel/19%3A15bc...%40thread.tacv2/ChannelName?groupId=...
# Channel ID (URL-decode this):
# 19:15bc...@thread.tacv2
```
--------------------------------
### Docker Recipe for Live CLI Backend Test
Source: https://docs.openclaw.ai/help/testing
This command initiates a live CLI-backend smoke test within a Docker container. It ensures the test runs in an isolated environment, mimicking production conditions and handling potential permission issues when running as a root user.
```bash
pnpm test:docker:live-cli-backend
```
--------------------------------
### Non-Interactive Venice AI Configuration
Source: https://docs.openclaw.ai/providers/venice
Automates the OpenClaw onboarding process for Venice AI by passing credentials as command-line arguments.
```bash
openclaw onboard --non-interactive --auth-choice venice-api-key --venice-api-key "vapi_xxxxxxxxxxxx"
```
--------------------------------
### Configure iMessage Remote Mac Integration
Source: https://docs.openclaw.ai/channels/imessage
Example configuration for connecting OpenClaw to a remote Mac via SSH and the corresponding shell wrapper script for executing imsg commands.
```json
{
  "channels": {
    "imessage": {
      "enabled": true,
      "cliPath": "~/.openclaw/scripts/imsg-ssh",
      "remoteHost": "bot@mac-mini.tailnet-1234.ts.net",
      "includeAttachments": true,
      "dbPath": "/Users/bot/Library/Messages/chat.db"
    }
  }
}
```
```bash
#!/usr/bin/env bash
exec ssh -T bot@mac-mini.tailnet-1234.ts.net imsg "$@"
```
--------------------------------
### Remove Gateway Lock File via SSH
Source: https://docs.openclaw.ai/install/fly
Command to remove the gateway's PID lock file using an SSH console. This is a troubleshooting step for 'already running' errors when the gateway fails to start.
```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
```
--------------------------------
### Get Telegram User ID via Third-Party Bot
Source: https://docs.openclaw.ai/help/faq
This method uses a third-party Telegram bot (e.g., @userinfobot or @getidsbot) to obtain a user's numeric Telegram ID. This is less private than other methods.
```bash
DM @userinfobot or @getidsbot
```
--------------------------------
### Manage OpenClaw Configuration via CLI
Source: https://docs.openclaw.ai/cli/config
Basic commands for interacting with the openclaw.json file, including retrieving, setting, and validating configuration values.
```bash
openclaw config file
openclaw config schema
openclaw config get browser.executablePath
openclaw config set browser.executablePath "/usr/bin/google-chrome"
openclaw config set agents.defaults.heartbeat.every "2h"
openclaw config set agents.list[0].tools.exec.node "node-id-or-name"
openclaw config unset plugins.entries.brave.config.webSearch.apiKey
openclaw config validate
```
--------------------------------
### Set Twitch Access Token via Environment Variable
Source: https://docs.openclaw.ai/channels/twitch
Setting the Twitch access token using an environment variable for the default account.
```bash
OPENCLAW_TWITCH_ACCESS_TOKEN=oauth:abc123...
```
--------------------------------
### Set Max Characters for Agent Bootstrap Files in OpenClaw AI
Source: https://docs.openclaw.ai/gateway/configuration-reference
Defines the maximum number of characters allowed per individual workspace bootstrap file before it gets truncated. The default value is 20000 characters.
```json5
{
  agents: { defaults: { bootstrapMaxChars: 20000 } },
}
```
--------------------------------
### ContextEngine Interface Definition
Source: https://docs.openclaw.ai/concepts/context-engine
Overview of the required and optional methods for implementing a custom ContextEngine.
```APIDOC
## ContextEngine Interface
### Description
The ContextEngine interface is the primary contract for managing LLM context. It handles message storage, context assembly for model runs, and compaction strategies.
### Required Members
- **info** (Property) - Engine metadata including id, name, version, and ownsCompaction flag.
- **ingest(params)** (Method) - Stores a single message into the engine.
- **assemble(params)** (Method) - Builds the context for a model run. Returns an `AssembleResult` object.
- **compact(params)** (Method) - Summarizes or reduces the context size.
### AssembleResult Structure
- **messages** (Array) - The ordered messages to send to the model.
- **estimatedTokens** (number) - The engine's estimate of total tokens.
- **systemPromptAddition** (string, optional) - Content prepended to the system prompt.
### Optional Lifecycle Methods
- **bootstrap(params)** - Initialize engine state for a session.
- **ingestBatch(params)** - Ingest a completed turn as a batch.
- **afterTurn(params)** - Post-run lifecycle work.
- **prepareSubagentSpawn(params)** - Setup shared state for child sessions.
- **onSubagentEnded(params)** - Cleanup after a subagent ends.
- **dispose()** - Release resources during shutdown.
```
--------------------------------
### Text-to-Speech (TTS) Runtime Helpers
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Demonstrates the usage of api.runtime.tts helpers for text-to-speech synthesis. It covers standard TTS, telephony-optimized TTS, and listing available voices. The helpers utilize core configuration and return PCM audio buffers with sample rates.
```typescript
// Standard TTS
const clip = await api.runtime.tts.textToSpeech({
  text: "Hello from OpenClaw",
  cfg: api.config,
});
// Telephony-optimized TTS
const telephonyClip = await api.runtime.tts.textToSpeechTelephony({
  text: "Hello from OpenClaw",
  cfg: api.config,
});
// List available voices
const voices = await api.runtime.tts.listVoices({
  provider: "elevenlabs",
  cfg: api.config,
});
```
--------------------------------
### Connect to Raspberry Pi via SSH
Source: https://docs.openclaw.ai/install/raspberry-pi
Establishes a secure shell connection to the gateway host.
```bash
ssh user@gateway-host
```
--------------------------------
### PluralKit Support Configuration
Source: https://docs.openclaw.ai/channels/discord
Enable and configure PluralKit support to map proxied messages to system member identity.
```APIDOC
## PluralKit Support Configuration
### Description
Enable PluralKit resolution to map proxied messages to system member identity. An optional token can be provided for private systems.
### Method
N/A (Configuration)
### Endpoint
N/A (Configuration)
### Parameters
- **enabled** (boolean) - Required - `true` to enable PluralKit support.
- **token** (string) - Optional - PluralKit API token, needed for private systems.
### Request Example
```json
{
  "channels": {
    "discord": {
      "pluralkit": {
        "enabled": true,
        "token": "pk_live_..."
      }
    }
  }
}
```
### Response
N/A (Configuration)
### Notes
- Allowlists can use `pk:<memberId>`.
- Member display names are matched by name/slug only when `channels.discord.dangerouslyAllowNameMatching: true`.
- Lookups use original message ID and are time-window constrained.
- If lookup fails, proxied messages are treated as bot messages and dropped unless `allowBots=true`.
```
--------------------------------
### Configure Session Memory Search (Experimental)
Source: https://docs.openclaw.ai/reference/memory-config
This configuration enables experimental session memory search, allowing indexing of session transcripts. It specifies sources for memory search and can be configured with delta thresholds for asynchronous indexing.
```json5
agents: {
  defaults: {
    memorySearch: {
      experimental: { sessionMemory: true },
      sources: ["memory", "sessions"]
    }
  }
}
```
```json5
agents: {
  defaults: {
    memorySearch: {
      sync: {
        sessions: {
          deltaBytes: 100000,   // ~100 KB
          deltaMessages: 50     // JSONL lines
        }
      }
    }
  }
}
```
--------------------------------
### Extract Team ID from Teams URL (CLI)
Source: https://docs.openclaw.ai/channels/msteams
This example demonstrates how to extract a Team ID from a Microsoft Teams URL, which is necessary for configuration purposes. The ID is found in the URL path segment after '/team/' and needs to be URL-decoded.
```bash
# Team URL:
# https://teams.microsoft.com/l/team/19%3ABk4j...%40thread.tacv2/conversations?groupId=...
# Team ID (URL-decode this):
# 19:Bk4j...@thread.tacv2
```
--------------------------------
### Initialize Git Repository for Openclaw Workspace
Source: https://docs.openclaw.ai/concepts/agent-workspace
Initializes a new Git repository in the Openclaw workspace directory. This command adds essential agent workspace files and creates an initial commit. Ensure you are in the correct directory before running.
```bash
cd ~/.openclaw/workspace
git init
git add AGENTS.md SOUL.md TOOLS.md IDENTITY.md USER.md HEARTBEAT.md memory/
git commit -m "Add agent workspace"
```
--------------------------------
### Execute Secrets Apply CLI Commands
Source: https://docs.openclaw.ai/gateway/secrets-plan-contract
These commands demonstrate how to validate a plan file using dry-run mode and how to perform the actual application of secrets. It also shows how to include the --allow-exec flag for plans containing executable providers.
```bash
# Validate plan without writes
openclaw secrets apply --from /tmp/openclaw-secrets-plan.json --dry-run
# Then apply for real
openclaw secrets apply --from /tmp/openclaw-secrets-plan.json
# For exec-containing plans, opt in explicitly in both modes
openclaw secrets apply --from /tmp/openclaw-secrets-plan.json --dry-run --allow-exec
openclaw secrets apply --from /tmp/openclaw-secrets-plan.json --allow-exec
```
--------------------------------
### Enable Bundled Hooks
Source: https://docs.openclaw.ai/cli/hooks
Enable specific bundled hooks such as session-memory, bootstrap-extra-files, command-logger, and boot-md using the hooks enable command.
```bash
openclaw hooks enable session-memory
openclaw hooks enable bootstrap-extra-files
openclaw hooks enable command-logger
openclaw hooks enable boot-md
```
--------------------------------
### Configure IRC Channel with NickServ
Source: https://docs.openclaw.ai/gateway/configuration-reference
Sets up the IRC channel with specific DM policies and NickServ authentication. It uses environment variables for secure password handling.
```json5
{
  channels: {
    irc: {
      enabled: true,
      dmPolicy: "pairing",
      configWrites: true,
      nickserv: {
        enabled: true,
        service: "NickServ",
        password: "${IRC_NICKSERV_PASSWORD}",
        register: false,
        registerEmail: "bot@example.com",
      },
    },
  },
}
```
--------------------------------
### Device and Media Commands
Source: https://docs.openclaw.ai/platforms/android
Overview of available command families for device status, media capture, and system interaction.
```APIDOC
## COMMAND FAMILIES
### Description
Additional command sets available for Android nodes depending on device permissions.
### Available Commands
- **Canvas**: canvas.eval, canvas.snapshot, canvas.navigate, canvas.a2ui.push, canvas.a2ui.reset
- **Camera**: camera.snap (jpg), camera.clip (mp4)
- **Device**: device.status, device.info, device.permissions, device.health
- **System**: notifications.list, photos.latest, contacts.search, calendar.events, sms.search
### Usage Note
Commands are foreground-only. Camera commands are permission-gated.
```
--------------------------------
### Tail Logs via CLI
Source: https://docs.openclaw.ai/logging
Use the OpenClaw CLI to follow logs in real-time or troubleshoot connectivity issues.
```bash
openclaw logs --follow
openclaw doctor
```
--------------------------------
### Perform Non-interactive Onboarding
Source: https://docs.openclaw.ai/providers/vercel-ai-gateway
Automates the OpenClaw onboarding process for CI/CD or daemonized environments. It requires passing the API key directly as an environment variable.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice ai-gateway-api-key \
  --ai-gateway-api-key "$AI_GATEWAY_API_KEY"
```
--------------------------------
### Lobster: Deterministic Workflows
Source: https://docs.openclaw.ai/automation/cron-vs-heartbeat
Information on using Lobster for multi-step, deterministic workflows that require approvals and resumable execution.
```APIDOC
## Lobster Workflows
### Description
Lobster is a workflow runtime designed for multi-step tool pipelines that require deterministic execution and explicit human approvals. It allows for resumable workflows with checkpoints.
### When to Use Lobster
- **Multi-step automation**: When tasks involve a fixed sequence of tool calls rather than a single agent turn.
- **Approval gates**: When side effects of a workflow need to be paused for human approval before resuming.
- **Resumable runs**: To continue a paused workflow from the point of interruption without re-executing prior steps.
### Integration with Heartbeat and Cron
- **Heartbeat/Cron**: These services determine *when* a workflow run is initiated.
- **Lobster**: Defines the sequence of steps executed *after* a run begins.
Scheduled workflows can be triggered by cron or heartbeat, which then call Lobster. Ad-hoc workflows can call Lobster directly.
### Operational Notes
- Lobster runs as a local subprocess via the `lobster` CLI in tool mode, returning a JSON envelope.
- If a tool returns `needs_approval`, the workflow can be resumed using a `resumeToken` and the `approve` flag.
- The `lobster` CLI must be available on the system's PATH.
- It's recommended to enable Lobster as a tool plugin via `tools.alsoAllow: ["lobster"]`.
### Example Workflow Trigger (Conceptual)
```bash
# Using cron to trigger a Lobster workflow
openclaw cron add \
  --name "Approve Report Generation" \
  --cron "0 10 * * 5" \
  --session isolated \
  --message "Start the weekly report generation workflow using Lobster."
```
See [Lobster](/tools/lobster) for full usage and examples.
```
--------------------------------
### Enable Multimodal Memory Indexing
Source: https://docs.openclaw.ai/reference/memory-config
Configures the Gemini provider to index image and audio files from specified extra paths. This requires the gemini-embedding-2-preview model and specific modality settings.
```json5
agents: {
  defaults: {
    memorySearch: {
      provider: "gemini",
      model: "gemini-embedding-2-preview",
      extraPaths: ["assets/reference", "voice-notes"],
      multimodal: {
        enabled: true,
        modalities: ["image", "audio"],
        maxFileBytes: 10000000
      },
      remote: {
        apiKey: "YOUR_GEMINI_API_KEY"
      }
    }
  }
}
```
--------------------------------
### Configure OpenClaw Browser Settings (JSON5)
Source: https://docs.openclaw.ai/tools/browser
This snippet shows the structure of the `openclaw.json` configuration file for browser settings. It includes options for enabling the browser, SSRF policies, CDP timeouts, default profiles, and specific profile configurations like CDP ports and user data directories.
```json5
{
  browser: {
    enabled: true, // default: true
    ssrfPolicy: {
      dangerouslyAllowPrivateNetwork: true, // default trusted-network mode
      // allowPrivateNetwork: true, // legacy alias
      // hostnameAllowlist: ["*.example.com", "example.com"],
      // allowedHostnames: ["localhost"],
    },
    // cdpUrl: "http://127.0.0.1:18792", // legacy single-profile override
    remoteCdpTimeoutMs: 1500, // remote CDP HTTP timeout (ms)
    remoteCdpHandshakeTimeoutMs: 3000, // remote CDP WebSocket handshake timeout (ms)
    defaultProfile: "openclaw",
    color: "#FF4500",
    headless: false,
    noSandbox: false,
    attachOnly: false,
    executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    profiles: {
      openclaw: { cdpPort: 18800, color: "#FF4500" },
      work: { cdpPort: 18801, color: "#0066CC" },
      user: {
        driver: "existing-session",
        attachOnly: true,
        color: "#00AA00",
      },
      brave: {
        driver: "existing-session",
        attachOnly: true,
        userDataDir: "~/Library/Application Support/BraveSoftware/Brave-Browser",
        color: "#FB542B",
      },
      remote: { cdpUrl: "http://10.0.0.42:9222", color: "#00AA00" },
    },
  },
}
```
--------------------------------
### Configuring Local OpenAI-Compatible Providers
Source: https://docs.openclaw.ai/gateway/local-models
This configuration block demonstrates how to integrate a local LLM server into the OpenClaw AI provider settings.
```APIDOC
## POST /v1/chat/completions (Proxy Integration)
### Description
This endpoint allows the OpenClaw AI gateway to communicate with local model servers (e.g., vLLM, LiteLLM) that expose an OpenAI-compatible API.
### Method
POST
### Endpoint
{baseUrl}/v1/chat/completions
### Request Body
- **model** (string) - Required - The ID of the local model (e.g., "my-local-model").
- **messages** (array) - Required - The conversation history.
### Request Example
{
  "model": "my-local-model",
  "messages": [{"role": "user", "content": "Hello!"}]
}
### Response
#### Success Response (200)
- **id** (string) - Unique identifier for the completion.
- **choices** (array) - List of generated responses.
#### Response Example
{
  "id": "chatcmpl-123",
  "choices": [{"message": {"role": "assistant", "content": "Hello there!"}}]
}
```
--------------------------------
### Send Keys to Process (tmux-style)
Source: https://docs.openclaw.ai/tools/exec
Sends key sequences to a running process, similar to tmux keybindings. Supports individual keys, combinations like Ctrl+C, and sequences.
```json
{"tool":"process","action":"send-keys","sessionId":"<id>","keys":["Enter"]}
```
```json
{"tool":"process","action":"send-keys","sessionId":"<id>","keys":["C-c"]}
```
```json
{"tool":"process","action":"send-keys","sessionId":"<id>","keys":["Up","Up","Enter"]}
```
--------------------------------
### Webhook Configuration and Gmail Integration
Source: https://docs.openclaw.ai/gateway/configuration-examples
Sets up webhooks for event handling, including path, token, and transformation directories. It details specific mappings for services like Gmail, including message templating, delivery options, and transform module configuration.
```javascript
{
  enabled: true,
  path: "/hooks",
  token: "shared-secret",
  presets: ["gmail"],
  transformsDir: "~/.openclaw/hooks/transforms",
  mappings: [
    {
      id: "gmail-hook",
      match: { path: "gmail" },
      action: "agent",
      wakeMode: "now",
      name: "Gmail",
      sessionKey: "hook:gmail:{{messages[0].id}}",
      messageTemplate: "From: {{messages[0].from}}\nSubject: {{messages[0].subject}}",
      textTemplate: "{{messages[0].snippet}}",
      deliver: true,
      channel: "last",
      to: "+15555550123",
      thinking: "low",
      timeoutSeconds: 300,
      transform: {
        module: "gmail.js",
        export: "transformGmail",
      },
    },
  ],
  gmail: {
    account: "openclaw@gmail.com",
    label: "INBOX",
    topic: "projects/<project-id>/topics/gog-gmail-watch",
    subscription: "gog-gmail-watch-push",
    pushToken: "shared-push-token",
    hookUrl: "http://127.0.0.1:18789/hooks/gmail",
    includeBody: true,
    maxBytes: 20000,
    renewEveryMinutes: 720,
    serve: { bind: "127.0.0.1", port: 8788, path: "/" },
    tailscale: { mode: "funnel", path: "/gmail-pubsub" },
  },
}
```
--------------------------------
### Enable Secure DM Mode for Multi-user Inboxes
Source: https://docs.openclaw.ai/gateway/configuration-examples
Configures secure DM mode to ensure DMs from different senders do not share a context by default, recommended for multi-user or sensitive DM agents. Examples for WhatsApp and Discord are provided.
```json5
{
  // Secure DM mode (recommended for multi-user or sensitive DM agents)
  session: { dmScope: "per-channel-peer" },
  channels: {
    // Example: WhatsApp multi-user inbox
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15555550123", "+15555550124"],
    },
    // Example: Discord multi-user inbox
    discord: {
      enabled: true,
      token: "YOUR_DISCORD_BOT_TOKEN",
      dm: { enabled: true, allowFrom: ["123456789012345678", "987654321098765432"] },
    },
  },
}
```
--------------------------------
### Clone Repository and Configure Persistence
Source: https://docs.openclaw.ai/install/gcp
Downloads the OpenClaw source code and creates local directories on the host machine to ensure data persistence across container restarts.
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
mkdir -p ~/.openclaw
mkdir -p ~/.openclaw/workspace
```
--------------------------------
### Automate OpenClaw Onboarding with Plaintext Auth
Source: https://docs.openclaw.ai/start/wizard-cli-automation
Executes the OpenClaw onboarding process in a non-interactive mode using plaintext API keys. This is suitable for automated CI/CD pipelines where environment variables are directly injected.
```bash
openclaw onboard --non-interactive \
  --mode local \
  --auth-choice apiKey \
  --anthropic-api-key "$ANTHROPIC_API_KEY" \
  --secret-input-mode plaintext \
  --gateway-port 18789 \
  --gateway-bind loopback \
  --install-daemon \
  --daemon-runtime node \
  --skip-skills
```
--------------------------------
### Manage Model Status and Configuration
Source: https://docs.openclaw.ai/cli/models
Commands to inspect the current model state, list available models, set the active model, and scan for provider configurations. These commands help verify authentication status and model resolution.
```bash
openclaw models status
openclaw models list
openclaw models set <model-or-alias>
openclaw models scan
```
--------------------------------
### Verify Hook Directory Structure and Configuration
Source: https://docs.openclaw.ai/automation/hooks
Commands to inspect the file system structure of hooks and validate their configuration files.
```bash
ls -la ~/.openclaw/hooks/my-hook/
cat ~/.openclaw/hooks/my-hook/HOOK.md
```
--------------------------------
### Configure OpenCode Provider
Source: https://docs.openclaw.ai/gateway/configuration-reference
This configuration sets up the OpenCode provider, primarily for the Claude Opus model. It defines default agents and models. Users need to set the OPENCODE_API_KEY or OPENCODE_ZEN_API_KEY environment variable. It supports references for both Zen and Go catalogs.
```json5
{
  agents: {
    defaults: {
      model: { primary: "opencode/claude-opus-4-6" },
      models: { "opencode/claude-opus-4-6": { alias: "Opus" } },
    },
  },
}
```
--------------------------------
### Storing API Keys for OpenClaw Web Search
Source: https://docs.openclaw.ai/tools/web
Demonstrates how to store API keys for the OpenClaw web search tool, either in a configuration file or as an environment variable. This is crucial for authentication with various search providers. The output is the configured API key.
```json5
{
  plugins: {
    entries: {
      brave: {
        config: {
          webSearch: {
            apiKey: "YOUR_KEY", // pragma: allowlist secret
          },
        },
      },
    },
  },
}
```
```bash
export BRAVE_API_KEY="YOUR_KEY"
```
--------------------------------
### GET https://router.huggingface.co/v1/models
Source: https://docs.openclaw.ai/providers/huggingface
Retrieves the list of available models from the Hugging Face Inference router. This endpoint is used by OpenClaw to populate the model selection dropdown and refresh the model catalog.
```APIDOC
## GET https://router.huggingface.co/v1/models
### Description
Fetches a list of available models compatible with the Hugging Face Inference API. OpenClaw uses this to dynamically populate model selection lists.
### Method
GET
### Endpoint
https://router.huggingface.co/v1/models
### Parameters
#### Query Parameters
- **None**
### Request Headers
- **Authorization** (string) - Optional - Bearer token (HUGGINGFACE_HUB_TOKEN or HF_TOKEN) to access the full list of models.
### Response
#### Success Response (200)
- **object** (string) - The type of the response (e.g., "list").
- **data** (array) - A list of model objects containing model IDs and metadata.
#### Response Example
{
  "object": "list",
  "data": [
    {
      "id": "Qwen/Qwen3-8B",
      "owned_by": "Qwen"
    }
  ]
}
```
--------------------------------
### Manage Cron Jobs via CLI
Source: https://docs.openclaw.ai/automation/cron-jobs
Demonstrates how to create, list, and manually trigger cron jobs using the OpenClaw CLI. These commands allow for immediate execution of one-shot reminders and verification of existing scheduled tasks.
```bash
openclaw cron add \
  --name "Reminder" \
  --at "2026-02-01T16:00:00Z" \
  --session main \
  --system-event "Reminder: check the cron docs draft" \
  --wake now \
  --delete-after-run
openclaw cron list
openclaw cron run <job-id>
openclaw cron runs --id <job-id>
```
--------------------------------
### Configure vLLM Provider
Source: https://docs.openclaw.ai/concepts/model-providers
Enables auto-discovery for local vLLM OpenAI-compatible servers by setting the VLLM_API_KEY environment variable. The snippet then shows how to specify a model from the vLLM server.
```bash
export VLLM_API_KEY="vllm-local"
```
```json
{
  "agents": {
    "defaults": { "model": { "primary": "vllm/your-model-id" } },
  },
}
```
--------------------------------
### Add SSH Config for Remote Gateway
Source: https://docs.openclaw.ai/gateway/remote-gateway-readme
Configure your SSH client to establish a connection to the remote gateway. This involves specifying the host, hostname, user, local port forwarding, and the identity file for authentication.
```ssh
Host remote-gateway
    HostName <REMOTE_IP>          # e.g., 172.27.187.184
    User <REMOTE_USER>            # e.g., jefferson
    LocalForward 18789 127.0.0.1:18789
    IdentityFile ~/.ssh/id_rsa
```
--------------------------------
### Invoke llm-task Tool in Lobster Workflow
Source: https://docs.openclaw.ai/tools/llm-task
Example of invoking the 'llm-task' tool within a Lobster workflow. It specifies the prompt, thinking preset, input data, and a JSON schema for output validation.
```lobster
openclaw.invoke --tool llm-task --action json --args-json '{ 
  "prompt": "Given the input email, return intent and draft.",
  "thinking": "low",
  "input": {
    "subject": "Hello",
    "body": "Can you help?"
  },
  "schema": {
    "type": "object",
    "properties": {
      "intent": { "type": "string" },
      "draft": { "type": "string" }
    },
    "required": ["intent", "draft"],
    "additionalProperties": false
  }
}'
```
--------------------------------
### Configure Ollama Provider
Source: https://docs.openclaw.ai/start/wizard-cli-reference
Sets up the Ollama provider by prompting for a base URL (defaulting to http://127.0.0.1:11434) and selecting between Cloud + Local or Local modes.
```shell
OLLAMA_BASE_URL=http://127.0.0.1:11434 ollama setup
```
--------------------------------
### Registering Plugin API Runtime
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Demonstrates how to access the runtime object provided by the API during plugin registration. This is the entry point for utilizing runtime helpers.
```typescript
register(api) {
  const runtime = api.runtime;
}
```
--------------------------------
### List OpenClaw Devices and Pairing Requests
Source: https://docs.openclaw.ai/cli/devices
Lists pending device pairing requests and already paired devices. The --json flag provides output in JSON format, which is recommended for scripting.
```bash
openclaw devices list
openclaw devices list --json
```
--------------------------------
### Active Hours Heartbeat Configuration
Source: https://docs.openclaw.ai/gateway/heartbeat
Configures heartbeats to run only within specified active hours and timezone. This example sets the heartbeat frequency and target, and restricts execution to between 9 AM and 10 PM Eastern Time.
```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last", // explicit delivery to last contact (default is "none")
        activeHours: {
          start: "09:00",
          end: "22:00",
          timezone: "America/New_York", // optional; uses your userTimezone if set, otherwise host tz
        },
      },
    },
  },
}
```
--------------------------------
### Manage Node Pairing and Status via CLI
Source: https://docs.openclaw.ai/nodes
Commands to list, approve, or reject device pairing requests and check the status of connected nodes. These commands are essential for onboarding new nodes to the gateway.
```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw devices reject <requestId>
openclaw nodes status
openclaw nodes describe --node <idOrNameOrIp>
```
--------------------------------
### Load LaunchAgent via launchctl
Source: https://docs.openclaw.ai/channels/bluebubbles
Shell commands to unload and reload the LaunchAgent configuration for the Messages.app poke script.
```bash
launchctl unload ~/Library/LaunchAgents/com.user.poke-messages.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.user.poke-messages.plist
```
--------------------------------
### Importing Plugin SDK Modules
Source: https://docs.openclaw.ai/plugins/sdk-overview
Demonstrates the recommended import convention for OpenClaw plugin development. By importing from specific subpaths, developers ensure modularity and prevent circular dependency issues.
```typescript
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { defineChannelPluginEntry } from "openclaw/plugin-sdk/core";
```
--------------------------------
### Get Telegram User ID via Bot API
Source: https://docs.openclaw.ai/help/faq
This method retrieves the numeric Telegram user ID by directly calling the Telegram Bot API. After a user DMs the bot, this command can be used to fetch updates and extract the 'message.from.id'.
```bash
curl https://api.telegram.org/bot<bot_token>/getUpdates
```
--------------------------------
### Location Get Command Parameters (JSON)
Source: https://docs.openclaw.ai/nodes/location-command
Defines the parameters for the `location.get` command, including timeout, maximum age of cached data, and desired accuracy. The `desiredAccuracy` can be set to 'coarse', 'balanced', or 'precise'.
```json
{
  "timeoutMs": 10000,
  "maxAgeMs": 15000,
  "desiredAccuracy": "coarse|balanced|precise"
}
```
--------------------------------
### Configure Firecrawl for Web Search
Source: https://docs.openclaw.ai/tools/firecrawl
This configuration enables Firecrawl as the provider for web search within OpenClaw. It specifies the provider and configures the Firecrawl plugin with an API key and base URL. This setup allows OpenClaw to use Firecrawl for search queries.
```json5
{
  tools: {
    web: {
      search: {
        provider: "firecrawl",
      },
    },
  },
  plugins: {
    entries: {
      firecrawl: {
        enabled: true,
        config: {
          webSearch: {
            apiKey: "FIRECRAWL_API_KEY_HERE",
            baseUrl: "https://api.firecrawl.dev",
          },
        },
      },
    },
  },
}
```
--------------------------------
### Control UI for Exec Approvals
Source: https://docs.openclaw.ai/tools/exec-approvals
Instructions on how to manage executable approvals and allowlists using the OpenClaw Control UI.
```APIDOC
## Control UI Editing
The Control UI provides a graphical interface for managing executable approvals.
### Accessing Exec Approvals
Navigate to **Control UI → Nodes → Exec approvals**.
### Management Options
*   **Scope**: Select **Defaults** for global settings or a specific agent.
*   **Policy Tweaking**: Adjust the security policy as needed.
*   **Allowlist Management**: Add or remove executable patterns from the allowlist.
*   **Saving**: Click **Save** to apply changes.
The UI displays **last used** metadata for each pattern, aiding in list maintenance.
### Target Selection
*   **Gateway**: Manages local approvals.
*   **Node**: Requires nodes to advertise `system.execApprovals.get/set` capabilities (e.g., macOS app or headless node host).
If a node does not yet support exec approvals via its API, you must edit its local `~/.openclaw/exec-approvals.json` file directly.
### CLI Alternative
The `openclaw approvals` command also supports gateway or node editing. Refer to the [Approvals CLI](/cli/approvals) documentation for details.
```
--------------------------------
### Run a Simple Agent Turn
Source: https://docs.openclaw.ai/tools/agent-send
Executes a single agent turn by sending a message through the Gateway and printing the reply. This is the most basic usage of the agent CLI.
```bash
openclaw agent --message "What is the weather today?"
```
--------------------------------
### Tool Configuration and Permissions
Source: https://docs.openclaw.ai/gateway/configuration-examples
Defines allowed and denied tools, along with specific configurations for execution timeouts and cleanup. It also details elevated tool permissions, specifying which communication channels and users are permitted.
```javascript
{
  allow: ["exec", "process", "read", "write", "edit", "apply_patch"],
  deny: ["browser", "canvas"],
  exec: {
    backgroundMs: 10000,
    timeoutSec: 1800,
    cleanupMs: 1800000,
  },
  elevated: {
    enabled: true,
    allowFrom: {
      whatsapp: ["+15555550123"],
      telegram: ["123456789"],
      discord: ["123456789012345678"],
      slack: ["U123"],
      signal: ["+15555550123"],
      imessage: ["user@example.com"],
      webchat: ["session:demo"],
    },
  },
}
```
--------------------------------
### Configure Secure DM Scoping in OpenClaw
Source: https://docs.openclaw.ai/concepts/session
Configures the dmScope setting in the OpenClaw configuration file to isolate DM sessions per channel and sender. This prevents context leakage between different users in multi-user setups.
```json5
// ~/.openclaw/openclaw.json
{
  session: {
    // Secure DM mode: isolate DM context per channel + sender.
    dmScope: "per-channel-peer",
  },
}
```
--------------------------------
### Minimal Mattermost Configuration
Source: https://docs.openclaw.ai/channels/mattermost
Provides a minimal configuration for Mattermost integration, including enabling the plugin, bot token, and base URL.
```json
{
  "channels": {
    "mattermost": {
      "enabled": true,
      "botToken": "mm-token",
      "baseUrl": "https://chat.example.com",
      "dmPolicy": "pairing"
    }
  }
}
```
--------------------------------
### Apply Patch Tool Configuration
Source: https://docs.openclaw.ai/tools/apply-patch
This JSON snippet demonstrates the structure required to invoke the apply_patch tool. It includes the tool name and the input string formatted with the required patch markers and hunk changes.
```json
{
  "tool": "apply_patch",
  "input": "*** Begin Patch\n*** Update File: src/index.ts\n@@\n-const foo = 1\n+const foo = 2\n*** End Patch"
}
```
--------------------------------
### Verify Device and Reset Backup Baseline
Source: https://docs.openclaw.ai/install/migrating-matrix
Commands to manually verify a device or reset the backup baseline if old history is unrecoverable.
```bash
openclaw matrix verify device "<your-recovery-key>"
openclaw matrix verify backup reset --yes
```
--------------------------------
### Deploy OpenClaw with Private Configuration (Bash)
Source: https://docs.openclaw.ai/install/fly
This command deploys the OpenClaw application using a private configuration file (`fly.private.toml`). This is essential for creating a hardened deployment with no public IP exposure. Ensure the `fly.private.toml` file is correctly set up in your project directory.
```bash
fly deploy -c fly.private.toml
```
--------------------------------
### Manage and Test Skills via CLI
Source: https://docs.openclaw.ai/tools/creating-skills
Commands to restart the agent, list available skills, and trigger a test message to verify functionality.
```bash
# Restart the gateway to load new skills
openclaw gateway restart
# Verify the skill is loaded
openclaw skills list
# Test the skill with a message
openclaw agent --message "give me a greeting"
```
--------------------------------
### Set Broadcast Strategy to Sequential (JSON)
Source: https://docs.openclaw.ai/channels/broadcast-groups
This JSON configuration sets the broadcast strategy to 'sequential'. With this setting, agents will process messages in the order they are listed, with each agent waiting for the previous one to complete before starting.
```json
{
  "broadcast": {
    "strategy": "sequential",
    "120363403215116621@g.us": ["alfred", "baerbel"]
  }
}
```
--------------------------------
### Get OpenClaw Model Status as JSON
Source: https://docs.openclaw.ai/automation/auth-monitoring
This command retrieves the status of OpenClaw models in JSON format. This is useful for programmatic parsing of the authentication status, allowing for more sophisticated automation and alerting. It serves as the source of truth for other scripts.
```bash
openclaw models status --json
```
--------------------------------
### Navigate Node to Gateway Canvas Host (Bash)
Source: https://docs.openclaw.ai/platforms/android
This command navigates an Android node to the Gateway canvas host, allowing the agent to edit web content directly on disk. It requires the gateway hostname and uses a specific port. The command injects a live-reload client for immediate feedback on file changes.
```bash
openclaw nodes invoke --node "<Android Node>" --command canvas.navigate --params '{"url":"http://<gateway-hostname>.local:18789/__openclaw__/canvas/"}'
```
--------------------------------
### Deploy Openclaw AI Kubernetes Resources
Source: https://docs.openclaw.ai/install/kubernetes
Executes the deployment script to apply all Kubernetes manifests, including creating namespaces, secrets, and deploying the application. This command is used to apply initial configurations or updates.
```bash
./scripts/k8s/deploy.sh
```
--------------------------------
### Override Cache Retention Per Agent (YAML)
Source: https://docs.openclaw.ai/reference/prompt-caching
Configures `cacheRetention` for a specific agent identified by its `id`. This allows for granular control over caching behavior, overriding default settings. In this example, the 'alerts' agent has caching disabled.
```yaml
agents:
  list:
    - id: "alerts"
      params:
        cacheRetention: "none"
```
--------------------------------
### Manage Node Device Pairing via CLI
Source: https://docs.openclaw.ai/channels/pairing
Commands to list, approve, or reject pending node device pairing requests. These commands allow administrators to authorize new devices to join the gateway network.
```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw devices reject <requestId>
```
--------------------------------
### Location Get Command Response Payload (JSON)
Source: https://docs.openclaw.ai/nodes/location-command
Details the structure of the response payload for the `location.get` command. It includes latitude, longitude, accuracy, altitude, speed, heading, timestamp, precision status, and the data source.
```json
{
  "lat": 48.20849,
  "lon": 16.37208,
  "accuracyMeters": 12.5,
  "altitudeMeters": 182.0,
  "speedMps": 0.0,
  "headingDeg": 270.0,
  "timestamp": "2026-01-03T12:34:56.000Z",
  "isPrecise": true,
  "source": "gps|wifi|cell|unknown"
}
```
--------------------------------
### POST /tools/web_search (Exa Provider)
Source: https://docs.openclaw.ai/tools/exa-search
Executes a web search using the Exa AI provider with support for neural, keyword, and hybrid search modes, along with optional content extraction.
```APIDOC
## POST /tools/web_search
### Description
Performs a web search query using the Exa AI engine. Supports various search modes and content extraction options like text, highlights, and summaries.
### Method
POST
### Endpoint
/tools/web_search
### Parameters
#### Query Parameters
- **query** (string) - Required - The search query string.
- **count** (integer) - Optional - Number of results to return (1-100).
- **type** (string) - Optional - Search mode: auto, neural, fast, deep, deep-reasoning, or instant.
- **freshness** (string) - Optional - Time filter: day, week, month, or year.
- **date_after** (string) - Optional - Filter results after YYYY-MM-DD.
- **date_before** (string) - Optional - Filter results before YYYY-MM-DD.
- **contents** (object) - Optional - Configuration for content extraction (text, highlights, summary).
### Request Example
{
  "query": "transformer architecture explained",
  "type": "neural",
  "contents": {
    "text": true,
    "highlights": { "numSentences": 3 },
    "summary": true
  }
}
### Response
#### Success Response (200)
- **results** (array) - List of search results containing highlights, summaries, and extracted text.
#### Response Example
{
  "results": [
    {
      "title": "Understanding Transformers",
      "url": "https://example.com",
      "summary": "An AI-generated summary of the page.",
      "highlights": ["Key sentence 1", "Key sentence 2"]
    }
  ]
}
```
--------------------------------
### Configure Feishu via Environment Variables
Source: https://docs.openclaw.ai/channels/feishu
Sets Feishu credentials using system environment variables, useful for containerized or automated deployments.
```bash
export FEISHU_APP_ID="cli_xxx"
export FEISHU_APP_SECRET="xxx"
```
--------------------------------
### List Aliases and Fallbacks
Source: https://docs.openclaw.ai/cli/models
Commands to retrieve the current configuration for model aliases and fallback logic, ensuring proper model routing when the primary choice is unavailable.
```bash
openclaw models aliases list
openclaw models fallbacks list
```
--------------------------------
### Configure Anthropic Provider via CLI
Source: https://docs.openclaw.ai/help/faq
Commands to register an Anthropic setup-token or perform a CLI-based login on the OpenClaw gateway host. These commands ensure the gateway is authorized to communicate with Anthropic models.
```bash
openclaw models auth paste-token --provider anthropic
openclaw models auth login --provider anthropic --method cli --set-default
```
--------------------------------
### Session Management: Main vs. Isolated
Source: https://docs.openclaw.ai/automation/cron-vs-heartbeat
Explanation of the differences between 'main' and 'isolated' sessions when using Heartbeat and Cron.
```APIDOC
## Session Types: Main vs. Isolated
### Description
This section compares the behavior of 'main' and 'isolated' sessions when interacting with Heartbeat and Cron jobs.
| Feature         | Heartbeat (Main Session)                                  |
|-----------------|-----------------------------------------------------------|
| Session         | Main                                                      |
| History         | Shared                                                    |
| Context         | Full                                                      |
| Model           | Main session model                                        |
| Output          | Delivered if not `HEARTBEAT_OK`                           |
| Feature         | Cron (Main Session)                                       |
|-----------------|-----------------------------------------------------------|
| Session         | Main (via system event)                                   |
| History         | Shared                                                    |
| Context         | Full                                                      |
| Model           | Main session model                                        |
| Output          | Heartbeat prompt + event                                  |
| Feature         | Cron (Isolated Session)                                   |
|-----------------|-----------------------------------------------------------|
| Session         | `cron:<jobId>` or custom session                          |
| History         | Fresh each run (isolated) / Persistent (custom)           |
| Context         | None (isolated) / Cumulative (custom)                     |
| Model           | Can override                                              |
| Output          | Announce summary (default)                                |
**Key Differences:**
- **History & Context**: Isolated sessions start fresh, while main sessions share history and context.
- **Model Flexibility**: Isolated sessions allow overriding the default model.
- **Output Handling**: Isolated sessions default to announcing summaries, whereas main sessions handle output differently.
```
--------------------------------
### Persistent ACP Topic Binding Configuration
Source: https://docs.openclaw.ai/channels/telegram
Configuration for pinning ACP harness sessions to specific Telegram forum topics using typed ACP bindings. This example shows how to bind an agent ('codex') to a particular group and topic ID, enabling persistent sessions.
```json5
theme={"theme":{"light":"min-light","dark":"min-dark"}}
{
  agents: {
    list: [
      {
        id: "codex",
        runtime: {
          type: "acp",
          acp: {
            agent: "codex",
            backend: "acpx",
            mode: "persistent",
            cwd: "/workspace/openclaw",
          },
        },
      },
    ],
  },
  bindings: [
    {
      type: "acp",
      agentId: "codex",
      match: {
        channel: "telegram",
        accountId: "default",
        peer: { kind: "group", id: "-1001234567890:topic:42" },
      },
    },
  ],
  channels: {
    telegram: {
      groups: {
        "-1001234567890": {
          topics: {
            "42": {
              requireMention: false,
            },
          },
        },
      },
    },
  },
}
```
--------------------------------
### Reset Local Configuration and State with Openclaw CLI
Source: https://docs.openclaw.ai/cli/reset
The `openclaw reset` command is used to clear local configuration, credentials, and session states. It is recommended to run `openclaw backup create` beforehand to ensure a restorable snapshot. Options include `--dry-run` for a preview and `--scope` to specify what to reset, along with `--yes` and `--non-interactive` for automation.
```bash
openclaw backup create
openclaw reset
openclaw reset --dry-run
openclaw reset --scope config+creds+sessions --yes --non-interactive
```
--------------------------------
### Configure Provider-Specific Tool Profiles
Source: https://docs.openclaw.ai/gateway/configuration-reference
Allows fine-grained control over tool access for different providers or models. It defines a base profile and can override it with provider-specific profiles or allow/deny lists. The order of precedence is base profile, then provider profile, then allow/deny.
```json5
{
  tools: {
    profile: "coding",
    byProvider: {
      "google-antigravity": { profile: "minimal" },
      "openai/gpt-5.2": { allow: ["group:fs", "sessions_list"] },
    },
  },
}
```
--------------------------------
### Configure Heartbeat Visibility via YAML
Source: https://docs.openclaw.ai/gateway/heartbeat
Example configuration for controlling heartbeat acknowledgment and alert visibility across different channels and accounts. This YAML structure demonstrates how to override default behaviors for specific platforms like Telegram and WhatsApp.
```yaml
channels:
  defaults:
    heartbeat:
      showOk: false # Hide HEARTBEAT_OK (default)
      showAlerts: true # Show alert messages (default)
      useIndicator: true # Emit indicator events (default)
  telegram:
    heartbeat:
      showOk: true # Show OK acknowledgments on Telegram
  whatsapp:
    accounts:
      work:
        heartbeat:
          showAlerts: false # Suppress alert delivery for this account
```
--------------------------------
### Configure Zalo Group Access - OpenClaw Configuration
Source: https://docs.openclaw.ai/channels/zalouser
Sets up access control for Zalo groups within the OpenClaw Zalo Personal integration. This example configures the group policy to 'allowlist' and specifies allowed senders and groups.
```json5
{
  channels: {
    zalouser: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["1471383327500481391"],
      groups: {
        "123456789": { allow: true },
        "Work Chat": { allow: true },
      },
    },
  },
}
```
--------------------------------
### Configure QMD Memory Backend
Source: https://docs.openclaw.ai/reference/memory-config
Defines the QMD memory backend settings, including update intervals, search limits, and access control rules for session keys. This configuration allows for granular control over how the system indexes and scopes local Markdown files.
```json5
memory: {
  backend: "qmd",
  citations: "auto",
  qmd: {
    includeDefaultMemory: true,
    update: { interval: "5m", debounceMs: 15000 },
    limits: { maxResults: 6, timeoutMs: 4000 },
    scope: {
      default: "deny",
      rules: [
        { action: "allow", match: { chatType: "direct" } },
        { action: "deny", match: { keyPrefix: "discord:channel:" } },
        { action: "deny", match: { rawKeyPrefix: "agent:main:discord:" } }
      ]
    },
    paths: [
      { name: "docs", path: "~/notes", pattern: "**/*.md" }
    ]
  }
}
```
--------------------------------
### Check OpenClaw Browser Status
Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting
Verifies the status of the OpenClaw browser control server. This command sends a request to the local server and parses the JSON response to check if the browser is running, its process ID, and the chosen browser executable.
```bash
curl -s http://127.0.0.1:18791/ | jq '{running, pid, chosenBrowser}'
```
--------------------------------
### Uninstall OpenClaw Plugin
Source: https://docs.openclaw.ai/cli/plugins
Removes plugin records and optionally plugin files from the OpenClaw installation. It targets entries in `plugins.entries`, `plugins.installs`, the plugin allowlist, and linked `plugins.load.paths`. For active memory plugins, the memory slot is reset. By default, plugin files are removed from the extensions root.
```bash
openclaw plugins uninstall <id>
openclaw plugins uninstall <id> --dry-run
openclaw plugins uninstall <id> --keep-files
```
--------------------------------
### Organizational Assistant Delegate Configuration
Source: https://docs.openclaw.ai/concepts/delegate-architecture
This JSON configuration sets up a comprehensive organizational assistant delegate agent. It defines the agent's identity, workspace, allowed and denied tools, and specific channel bindings for Signal and WhatsApp. This configuration is designed for autonomous operations and integrates with cron jobs for scheduling. Dependencies include the Openclaw framework.
```json5
{
  agents: {
    list: [
      { id: "main", default: true, workspace: "~/.openclaw/workspace" },
      {
        id: "org-assistant",
        name: "[Organization] Assistant",
        workspace: "~/.openclaw/workspace-org",
        agentDir: "~/.openclaw/agents/org-assistant/agent",
        identity: { name: "[Organization] Assistant" },
        tools: {
          allow: ["read", "exec", "message", "cron", "sessions_list", "sessions_history"],
          deny: ["write", "edit", "apply_patch", "browser", "canvas"],
        },
      },
    ],
  },
  bindings: [
    {
      agentId: "org-assistant",
      match: { channel: "signal", peer: { kind: "group", id: "[group-id]" } },
    },
    { agentId: "org-assistant", match: { channel: "whatsapp", accountId: "org" } },
    { agentId: "main", match: { channel: "whatsapp" } },
    { agentId: "main", match: { channel: "signal" } },
  ],
}
```
--------------------------------
### Configure QMD Memory Backend
Source: https://docs.openclaw.ai/reference/memory-config
Defines the QMD memory backend settings, including update intervals, scope rules, and path indexing.
```APIDOC
## POST /config/memory/qmd
### Description
Configures the QMD memory backend for the OpenClaw AI agent.
### Method
POST
### Endpoint
/config/memory/qmd
### Request Body
- **backend** (string) - Required - Must be 'qmd'
- **citations** (string) - Optional - Citation mode ('auto', 'on', 'off')
- **qmd** (object) - Required - QMD specific settings including update intervals, limits, and scope rules.
### Request Example
{
  "memory": {
    "backend": "qmd",
    "qmd": {
      "update": { "interval": "5m", "debounceMs": 15000 },
      "paths": [{ "name": "docs", "path": "~/notes", "pattern": "**/*.md" }]
    }
  }
}
```
--------------------------------
### Execute Low-Level RPC Calls
Source: https://docs.openclaw.ai/cli/gateway
Helper commands to invoke specific RPC methods on the gateway with optional parameters.
```bash
openclaw gateway call status
openclaw gateway call logs.tail --params '{"sinceMs": 60000}'
```
--------------------------------
### Create Agent Session with Pi SDK - TypeScript
Source: https://docs.openclaw.ai/pi
Creates a new agent session using the pi SDK. It configures resource loading, authentication, model registry, and tools. Requires parameters like workspace, agent directory, and settings.
```typescript
import {
  createAgentSession,
  DefaultResourceLoader,
  SessionManager,
  SettingsManager,
} from "@mariozechner/pi-coding-agent";
const resourceLoader = new DefaultResourceLoader({
  cwd: resolvedWorkspace,
  agentDir,
  settingsManager,
  additionalExtensionPaths,
});
await resourceLoader.reload();
const { session } = await createAgentSession({
  cwd: resolvedWorkspace,
  agentDir,
  authStorage: params.authStorage,
  modelRegistry: params.modelRegistry,
  model: params.model,
  thinkingLevel: mapThinkingLevel(params.thinkLevel),
  tools: builtInTools,
  customTools: allCustomTools,
  sessionManager,
  settingsManager,
  resourceLoader,
});
applySystemPromptOverrideToSession(session, systemPromptOverride);
```
--------------------------------
### Configure OpenClaw for Snap Chromium Attach-Only Mode
Source: https://docs.openclaw.ai/tools/browser-linux-troubleshooting
Configures OpenClaw to attach to an already running Chromium browser instance instead of launching it directly. This is useful when using snap Chromium, which has confinement issues. It requires manual browser startup.
```json
{
  "browser": {
    "enabled": true,
    "attachOnly": true,
    "headless": true,
    "noSandbox": true
  }
}
```
--------------------------------
### Config API
Source: https://docs.openclaw.ai/plugins/sdk-runtime
Handles loading and writing plugin configuration files.
```APIDOC
## GET /api/runtime/config/loadConfig
### Description
Loads the current configuration settings.
### Method
GET
### Response Example
{
  "apiKey": "secret-key",
  "model": "gpt-4"
}
```
--------------------------------
### Implement plugin entry point with TypeScript
Source: https://docs.openclaw.ai/plugins/building-plugins
Uses the OpenClaw SDK to define a plugin entry point and register a custom tool with TypeBox schema validation.
```typescript
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";
export default definePluginEntry({
  id: "my-plugin",
  name: "My Plugin",
  description: "Adds a custom tool to OpenClaw",
  register(api) {
    api.registerTool({
      name: "my_tool",
      description: "Do a thing",
      parameters: Type.Object({ input: Type.String() }),
      async execute(_id, params) {
        return { content: [{ type: "text", text: `Got: ${params.input}` }] };
      },
    });
  },
});
```
--------------------------------
### Configure Web Search and Fetch Tools
Source: https://docs.openclaw.ai/gateway/configuration-reference
Configures web search and content fetching capabilities. It allows setting API keys, timeouts, cache TTLs, and user agents for web interactions.
```json5
{
  tools: {
    web: {
      search: {
        enabled: true,
        apiKey: "brave_api_key",
        maxResults: 5,
        timeoutSeconds: 30,
        cacheTtlMinutes: 15,
      },
      fetch: {
        enabled: true,
        maxChars: 50000,
        maxCharsCap: 50000,
        timeoutSeconds: 30,
        cacheTtlMinutes: 15,
        userAgent: "custom-ua",
      },
    },
  },
}
```
--------------------------------
### POST /tabs/open
Source: https://docs.openclaw.ai/tools/browser
Opens a new tab in the managed browser instance.
```APIDOC
## POST /tabs/open
### Description
Opens a new tab in the managed browser instance.
### Method
POST
### Endpoint
/tabs/open
### Parameters
#### Request Body
- **url** (string) - Optional - The URL to navigate to upon opening the tab.
### Request Example
{
  "url": "https://example.com"
}
### Response
#### Success Response (200)
- **tabId** (string) - The unique identifier for the newly opened tab.
#### Response Example
{
  "tabId": "tab-123"
}
```
--------------------------------
### OpenClaw Channels: Common Commands
Source: https://docs.openclaw.ai/cli/channels
Provides a list of common commands for managing chat channels, including listing channels, checking their status, and retrieving capabilities. It also shows how to filter capabilities for specific channels and targets, and how to resolve channel/user names to IDs.
```bash
openclaw channels list
openclaw channels status
openclaw channels capabilities
openclaw channels capabilities --channel discord --target channel:123
openclaw channels resolve --channel slack "#general" "@jane"
openclaw channels logs --channel all
```
--------------------------------
### Unit Testing Provider Plugins
Source: https://docs.openclaw.ai/plugins/sdk-testing
Demonstrates testing provider plugins for dynamic model resolution and catalog retrieval.
```typescript
import { describe, it, expect } from "vitest";
describe("my-provider plugin", () => {
  it("should resolve dynamic models", () => {
    const model = myProvider.resolveDynamicModel({ modelId: "custom-model-v2" });
    expect(model.id).toBe("custom-model-v2");
  });
  it("should return catalog when API key is available", async () => {
    const result = await myProvider.catalog.run({ resolveProviderApiKey: () => ({ apiKey: "test-key" }) });
    expect(result?.provider?.models).toHaveLength(2);
  });
});
```
--------------------------------
### Disable Unified Logging Private Data for OpenClaw on macOS
Source: https://docs.openclaw.ai/platforms/mac/logging
This command removes the previously installed plist file that enabled private data logging for the 'ai.openclaw' subsystem. It is crucial to disable this feature after debugging to protect sensitive information. Optionally, a command to force logd to reload its configuration is provided.
```bash
sudo rm /Library/Preferences/Logging/Subsystems/ai.openclaw.plist
sudo log config --reload
```
--------------------------------
### Configure GCP Environment for Gmail Watch
Source: https://docs.openclaw.ai/automation/gmail-pubsub
Initializes the GCP project environment, enables required APIs, creates a Pub/Sub topic, and grants the Gmail service account permission to publish messages.
```bash
gcloud auth login
gcloud config set project <project-id>
gcloud services enable gmail.googleapis.com pubsub.googleapis.com
gcloud pubsub topics create gog-gmail-watch
gcloud pubsub topics add-iam-policy-binding gog-gmail-watch \
  --member=serviceAccount:gmail-api-push@system.gserviceaccount.com \
  --role=roles/pubsub.publisher
```