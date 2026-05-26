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
