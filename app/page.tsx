import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="min-h-screen bg-white sm:bg-linear-to-b sm:from-white sm:to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="flex items-center gap-3">
            <Logo size={48} />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                BLAISE AI
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Your everyday learning companion — Kinyarwanda first.
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/login"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-md border border-gray-300 hover:border-cyan-300 text-gray-900 bg-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="flex-1 sm:flex-none text-center px-4 py-2 rounded-md bg-cyan-500 text-white shadow-sm hover:bg-cyan-600 transition-colors"
            >
              Register
            </Link>
          </nav>
        </header>

        <section className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-900 leading-tight">
              Learn in your language. Understand the concept.
            </h2>
            <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
              Blaise AI explains school topics in Kinyarwanda first, then English.
              Short steps, local examples and gentle practice questions — built
              for P1–S6.
            </p>

            <div className="flex gap-3">
              <Link
                href="/register"
                className="inline-block px-6 py-3 rounded-md bg-cyan-500 text-white shadow-sm hover:bg-cyan-600 transition-colors font-medium"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 sm:p-6 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg transition">
              <h3 className="font-semibold mb-2 text-gray-900">
                Kinyarwanda-first explanations
              </h3>
              <p className="text-sm text-gray-700">
                Short, school-level language and simple examples from Rwanda.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg transition">
              <h3 className="font-semibold mb-2 text-gray-900">Save your progress</h3>
              <p className="text-sm text-gray-700">
                Conversations are stored so students can continue and revise
                later.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white rounded-xl shadow border border-gray-100 hover:shadow-lg transition">
              <h3 className="font-semibold mb-2 text-gray-900">Easy for parents</h3>
              <p className="text-sm text-gray-700">
                A simple interface for parents to monitor learning.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-12 sm:mt-16 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-3">
            <Logo size={28} />
            <span>Made in Rwanda • Blaise AI</span>
          </div>
        </footer>
      </div>
    </main>
  );
}