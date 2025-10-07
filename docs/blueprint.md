# **App Name**: Portfolio Copilot

## Core Features:

- Wallet Connection via MetaMask Smart Account: Connect to the app using MetaMask Smart Accounts and display the user's address and Monad testnet balance.
- Portfolio Dashboard: Display the user's token balances and recent transactions fetched using Envio's HyperSync or GraphQL endpoint.
- AI Portfolio Analyst: Chat interface that summarizes the user's portfolio, spending habits, and any unusual activity, using the OpenAI GPT-4 API. The LLM uses a 'tool' to decide when or if to incorporate information in its output.
- Smart Account Action Suggestion: The AI suggests actions such as sending testETH to another wallet, with a button to execute the transaction gaslessly.
- Envio Indexer Integration: Integrate and display data fetched from at least one Envio indexer, such as Transfer, Approval, or Deposit events.

## Style Guidelines:

- Primary color: Lemon Green (#E0FF00) for a vibrant, tech-forward feel.
- Background color: Desaturated Lemon Green (#F5FFE6) to maintain a clean and light aesthetic.
- Accent color: Electric Blue (#7DF9FF) to highlight interactive elements and CTAs.
- Body text: 'Inter', a grotesque-style sans-serif, provides a modern, neutral look suitable for body text.
- Headline text: 'Space Grotesk' adds a techy feel, pairing well with 'Inter'.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use clean, outlined icons for a minimalist dashboard style.
- Subtle, smooth animations for wallet connection and data loading to enhance the user experience.