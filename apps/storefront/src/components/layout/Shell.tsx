import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      {/* 
        We add a top padding to account for the sticky header.
        Adjust the padding values if the header height changes.
      */}
      <main className="flex-1 w-full pt-[72px] md:pt-[88px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
