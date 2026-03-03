# TaskDropper

A minimal peer-to-peer task board built on the Trac Network / Intercom stack.

## Architecture

- **Frontend**: `index.html` — fully self-contained static web app using localStorage for persistence. No backend API required.
- **CLI Backend**: `index.js` — Node.js terminal app using Hyperswarm/HyperDHT for true P2P networking between peers.
- **Contract layer**: `contract/` — Trac peer contract and protocol definitions.
- **Features**: `features/` — Sidechannel, SC-bridge, and timer feature modules for the Trac peer.

## Running

- **Web UI**: `npm start` — serves `index.html` on port 5000 using `serve`
- **CLI peer**: `node index.js` — joins the `taskdropper` P2P channel and presents an interactive prompt

## Key Files

- `index.html` — static frontend with full task board UI
- `index.js` — CLI terminal peer (ESM, uses Hyperswarm)
- `package.json` — `"type": "module"` (ESM), `npm start` runs `serve`
- `contract/contract.js` — Trac smart contract definition
- `contract/protocol.js` — Trac protocol definition
- `features/sidechannel/index.js` — P2P sidechannel feature
- `features/sc-bridge/index.js` — Sidechannel bridge feature
- `features/timer/index.js` — Timer feature for oracle injection

## Deployment

Configured as a static deployment serving the root directory (`.`).
