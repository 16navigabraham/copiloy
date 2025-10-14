import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl font-headline">Portfolio Copilot</span>
        </Link>
        {/* The ConnectWallet button was here. It's removed to centralize connection on the main page. */}
      </div>
    </header>
  );
}
