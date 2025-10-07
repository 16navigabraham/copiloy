'use client';

import { useState, useEffect } from 'react';
import { WalletProvider } from '@/context/WalletContext';
import { useWallet } from '@/hooks/useWallet';
import Header from '@/components/Header';
import PortfolioCard from '@/components/PortfolioCard';
import TransactionsList from '@/components/TransactionsList';
import AIChat from '@/components/AIChat';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Activity,
  DollarSign,
  Droplets,
  Zap,
} from 'lucide-react';
import type { PortfolioSummary, Transaction } from '@/lib/types';
import { getPortfolioSummary, getRecentTransactions } from '@/lib/envio';
import { Skeleton } from '@/components/ui/skeleton';

function Dashboard() {
  const { address } = useWallet();
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (address) {
        setLoading(true);
        const [summaryData, transactionsData] = await Promise.all([
          getPortfolioSummary(address),
          getRecentTransactions(address),
        ]);
        setSummary(summaryData);
        setTransactions(transactionsData);
        setLoading(false);
      }
    }
    fetchData();
  }, [address]);

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <PortfolioCard
              title="Total Balance"
              value={`$${summary?.totalValue.toFixed(2)}`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              description={`${summary?.ethBalance.toFixed(4)} MONAD`}
            />
            <PortfolioCard
              title="Tokens Held"
              value={summary?.tokenCount.toString() ?? '0'}
              icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
              description="Across Monad Testnet"
            />
            <PortfolioCard
              title="Total Transactions"
              value={summary?.txnCount.toString() ?? '0'}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              description="In the last 30 days"
            />
            <PortfolioCard
              title="Gas Spent"
              value={`$${summary?.gasSpent.toFixed(2)}`}
              icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
              description="Mostly gasless with Smart Accounts"
            />
          </>
        )}
      </div>
      <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TransactionsList transactions={transactions} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <AIChat />
        </div>
      </div>
    </div>
  );
}

function HomePageContent() {
  const { isConnected, connectWallet } = useWallet();

  if (!isConnected) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center p-4">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5f396,transparent)]"></div></div>
        <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 to-neutral-500 py-4">
          Meet Your Portfolio Copilot
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Connect your MetaMask Smart Account on Monad testnet to get AI-powered insights into your portfolio, transactions, and spending patterns.
        </p>
        <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg" onClick={connectWallet}>
          <Zap className="mr-2 h-5 w-5" /> Connect Wallet
        </Button>
      </div>
    );
  }

  return <Dashboard />;
}

export default function Home() {
  return (
    <WalletProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1">
          <HomePageContent />
        </main>
      </div>
    </WalletProvider>
  );
}
