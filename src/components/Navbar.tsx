'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserProfileButton from './UserProfileButton';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">NotesAI</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Home
            </Link>
            <Link
              href="/notes"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/notes' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Notes
            </Link>
          </nav>
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
}