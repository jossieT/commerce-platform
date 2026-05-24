import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-brand-50">
      <Header />
      {/* Top padding accounts for fixed header height (~72px on mobile, ~80px on desktop) */}
      <main className="flex-1 w-full pt-20 md:pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
