## 11. V2 Contract Upgrade Lessons

### Contract design
- Always include postsByWallet mapping from day one — avoids expensive full scans later
- Use cursor-based pagination (getPostsBefore) not offset — offsets break when new posts arrive
- Make cooldown configurable by owner with safe min/max bounds
- Include optional media fields in struct even if UI doesn't use them yet — avoids v3
- Use viaIR: true + optimizer in hardhat.config.ts if you get stack-too-deep errors from large tuple returns

### Deployment
- Never overwrite v1 deployment files — create separate deployments/monadTestnet-v2.json
- Add new deploy script as scripts/deployV2.ts — never overwrite scripts/deploy.ts
- Add new package.json script: "deploy:testnet-v2" alongside existing one

### Frontend dual-contract integration
- Use VITE_CONTRACT_ADDRESS_V1 and VITE_CONTRACT_ADDRESS_V2 — never reuse a single VITE_CONTRACT_ADDRESS
- Update .env.example with new variable names before committing
- Never commit frontend/.env
- Add v2 ABI as a separate file — never overwrite v1 ABI
- Keep v1 read hooks — add v2 hooks alongside, don't replace
- All new writes go to v2 only — v1 becomes permanently read-only
- Merge v1 + v2 posts client-side: fetch both, normalize, sort by timestamp descending
- Deploy to Vercel preview first — test fully before promoting to production
- Add both env vars to Vercel before staging deploy

### Labeling merged posts
- v1 posts: use "Post #messageId" — message IDs are not wallet identities
- v2 posts: use "Nad #nadId" — permanent wallet-based identity
- Never call v1 message IDs "Nad #" — causes confusing duplicate labels
- Never expose v1/v2/contract/legacy language in the public UI
- The app should always feel like one continuous wall

### Staging workflow
- Always deploy preview first: vercel (without --prod)
- Test wallet connect, posting, merged wall, labels on preview URL
- Only promote after visual approval: vercel --prod
- Keep the same public URL — users should never notice the upgrade

## 12. Pagination Lessons

### Contract prerequisites
- Cursor-based pagination (getPostsBefore) must be in the contract from day one — retrofitting it requires a new deployment
- If the function exists in the contract but is missing from the hand-written ABI file, add it before wiring the frontend — read the Solidity source to confirm the exact return types
- getPostsBefore(beforeId, limit) returns posts with IDs strictly < beforeId, newest-first — no overlap possible with a correct cursor

### Hook design
- Use usePublicClient({ chainId }) for imperative reads (button-triggered) — useReadContract is reactive and doesn't suit manual fetch-on-click patterns
- The fetchBefore function returns raw contract data; normalize to UnifiedPost[] in the component alongside existing normalization logic
- Always pass chainId to usePublicClient — do not rely on the default chain

### State management
- Three state vars are enough: extraV2Posts, hasMoreV2, isLoadingMore
- Add loadMoreAttempted (default false) — set to true on first click — to suppress "All posts loaded" before the user ever clicks
- Reset all four state vars when v2Data refreshes (after a new post) — prevents stale extra posts and incorrect hasMore state
- Detect hasMore from the initial page size: ids.length >= FETCH_LIMIT — avoids showing the button when all posts fit in the first load

### Cursor correctness
- The pagination cursor must use only v2 post IDs — never include v1 IDs in the min() reduction
- allV2 = [...v2Posts, ...extraV2Posts] — v1Posts must not appear here
- oldestId = minimum id among allV2, not the oldest unified post

### Deduplication
- The contract's cursor logic makes duplicates structurally impossible (IDs strictly < cursor)
- Add a Set-based composite key dedup anyway as a safety net: key = `${post.source}-${post.id}`
- Fold dedup into the existing filter pass — no extra loop needed
- Run dedup before sorting, not after

### UI rules
- Button text: "Load older posts" — no v1/v2/contract language
- Loading state: "Loading older posts…" with animate-pulse
- End state: "All posts loaded" — only shown after loadMoreAttempted is true
- Show nothing at the bottom when wall has fewer posts than the initial page size
- isNewest badge stays pinned to index 0 of the merged array — no change needed

### Owner-configurable limits
- Use a Hardhat script (scripts/setMaxTextLength.ts) to call owner functions on the deployed contract — no redeployment needed
- Verify before and after: log maxTextLength() both sides of the tx
- Update the frontend MAX_BYTES constant to match — a single constant change in MessageInput.tsx
- Delete or leave the admin script untracked — do not commit throwaway scripts
