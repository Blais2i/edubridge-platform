import Logo from "@/components/Logo";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">

        <div className="flex justify-center mb-4">
          <Logo size={70} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Created!</h1>

        <p className="text-gray-600 text-sm mb-6">
          Welcome to Blaise AI. Your learning journey starts now.
        </p>

        <Link
          href="/chat"
          className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
        >
          Start learning
        </Link>
      </div>
    </div>
  );
}
