// app/page.tsx
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Logo size={64} />
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">BLAISE AI</h1>
              <p className="text-sm text-gray-500">Your everyday learning companion — Kinyarwanda first.</p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 rounded-md border border-transparent hover:border-cyan-300">Login</Link>
            <Link href="/register" className="px-4 py-2 rounded-md bg-cyan-500 text-white shadow-sm hover:brightness-95">Register</Link>
          </nav>
        </header>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Learn in your language. Understand the concept.</h2>
            <p className="text-gray-600 mb-6">
              Blaise AI explains school topics in Kinyarwanda first, then English. Short steps, local examples and gentle practice questions — built for P1–S6.
            </p>

            <div className="flex gap-3">
              <Link href="/chat" className="inline-block px-6 py-3 rounded-md bg-cyan-500 text-white shadow hover:scale-[0.997]">
                🚀 Start learning
              </Link>
              <Link href="/register" className="inline-block px-6 py-3 rounded-md border border-cyan-200 text-cyan-700">
                Create account
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">Kinyarwanda-first explanations</h3>
              <p className="text-sm text-gray-600">Short, school-level language and simple examples from Rwanda.</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">Save your progress</h3>
              <p className="text-sm text-gray-600">Conversations are stored so students can continue and revise later.</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold mb-2">Easy for parents</h3>
              <p className="text-sm text-gray-600">A simple interface for parents to monitor learning.</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-3">
            <Logo size={28} />
            <span>Made in Rwanda • Blaise AI</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
