'use client';

import type { Transaction } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface TransactionsListProps {
  transactions: Transaction[] | null;
  loading: boolean;
}

const formatAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default function TransactionsList({ transactions, loading }: TransactionsListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>Your latest 5 transactions on Monad Testnet.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>From/To</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && transactions && transactions.map((tx) => (
              <TableRow key={tx.hash}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {tx.type === 'send' ? (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant={tx.type === 'send' ? 'destructive' : 'default'} className="capitalize bg-opacity-20 border-none">
                      {tx.type}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm">{formatAddress(tx.type === 'send' ? tx.to : tx.from)}</div>
                  <div className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</div>
                </TableCell>
                <TableCell className="text-right font-medium font-mono">{`${tx.amount.toFixed(4)} ${tx.token}`}</TableCell>
              </TableRow>
            ))}
             {!loading && (!transactions || transactions.length === 0) && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No transactions found.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
