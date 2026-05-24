# Gmonad Wall

A simple on-chain message wall for the Monad community.

---

## Live Links

| | |
|---|---|
| **Live App** | https://gmonad-wall.vercel.app |
| **GitHub Repo** | https://github.com/cryptobro-nad/Gmonad-Loyal |
| **Contract Address** | `0xe1497c438c30EaE98992f33CE08c4deA857cd870` |
| **Explorer** | https://testnet.monadvision.com/address/0xe1497c438c30EaE98992f33CE08c4deA857cd870 |
| **Network** | Monad Testnet — Chain ID `10143` |

---

## Features

- Connect with Rabby, MetaMask, or any injected browser wallet
- WalletConnect support for mobile and hardware wallets
- Automatic Monad Testnet detection — prompts to switch if on the wrong network
- Post a message to the wall (stored permanently on-chain)
- Latest messages displayed in real time with block timestamps
- Anonymous labels: each address is shown as **Anon Monad #ID**
- 120-byte message limit enforced on-chain
- 5-minute cooldown between posts per address
- `hideMessage` owner moderation to remove spam
- Stats bar showing total message count

---

## Why I Built It

To learn the full dApp shipping flow on Monad Testnet — from writing and testing a Solidity contract, deploying to a live testnet, building a React frontend with wallet integration, to deploying the whole thing to production on Vercel.

---

## Tech Stack

| Layer | Tools |
|---|---|
| Smart contract | Solidity, Hardhat |
| Contract types | TypeChain, TypeScript |
| Frontend | React 18, Vite, Tailwind CSS |
| Wallet | wagmi v2, viem, WalletConnect v2 |
| Hosting | Vercel |
| Network | Monad Testnet |

---

## Smart Contract Overview

**File:** `contracts/GmonadWall.sol`

| Function | Description |
|---|---|
| `postMessage(string calldata text)` | Posts a message; enforces 120-byte limit and 5-min cooldown |
| `getMessageCount()` | Returns total number of messages ever posted |
| `getLatestMessages(uint256 limit)` | Returns up to `limit` most recent messages (hard cap: 50) |
| `getCooldownRemaining(address user)` | Returns seconds until `user` can post again (0 if ready) |
| `hideMessage(uint256 id, bool hidden)` | Owner-only: show or hide a specific message |

| Event | Emitted when |
|---|---|
| `event MessagePosted(uint256 indexed id, address indexed author, uint256 timestamp)` | A new message is posted |
| `MessageHidden(uint256 id, bool hidden)` | A message is shown or hidden by the owner |

### On-chain limits

- Message body: **120 bytes** max
- Cooldown: **5 minutes** between posts per address
- `getLatestMessages`: returns latest **25** by default, hard cap **50**

---

## Local Setup

**Prerequisites:** Node.js 18+, npm

```bash
# Clone
git clone https://github.com/cryptobro-nad/Gmonad-Loyal.git
cd Gmonad-Loyal

# Install Hardhat dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment variables

Create `.env` in the project root:

```
PRIVATE_KEY=your_deployer_private_key
```

Create `frontend/.env`:

```
VITE_CONTRACT_ADDRESS=0xe1497c438c30EaE98992f33CE08c4deA857cd870
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Run locally

```bash
# Run contract tests
npx hardhat test

# Start frontend dev server
cd frontend && npm run dev
```

---

## Deployment

### Contract (already deployed)

```bash
npx hardhat run scripts/deploy.ts --network monadTestnet
```

Contract is live at `0xe1497c438c30EaE98992f33CE08c4deA857cd870` on Monad Testnet.

### Frontend

```bash
cd frontend
npm run build
vercel --prod
```

---

## Testing

```
34 passing
```

Tests cover: `postMessage` (success, reverts, cooldown, byte limit), `getLatestMessages` (ordering, pagination, read cap), `getCooldownRemaining` (timing), `hideMessage` (access control, events, edge cases).

---

## Safety Note

This is an **educational project** deployed to a public testnet. All messages are stored publicly on-chain and visible to anyone. Do not post private information. The contract owner can hide messages but cannot delete them — they remain in chain history permanently.

---

## Future Improvements

- Paginated message history beyond the latest 25
- Emoji reactions stored on-chain
- ENS / identity resolution for author labels
- Mainnet deployment once Monad launches
- Anti-spam improvements (stake-to-post, proof-of-humanity)