// app/page.tsx
import LoginForm from '@/components/LoginForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              <h1 className="text-2xl font-bold text-gray-800">EduBridge</h1>
            </div>
            <div className="text-sm text-gray-600">
              Learning Platform • Rwanda 🇷🇼
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Learn in Your Language
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get help with homework in Kinyarwanda or English. Understand concepts, not just answers.
          </p>
          
          {/* ADD THIS DASHBOARD LINK */}
          <div className="text-center mb-8 mt-6">
            <a 
              href="/dashboard" 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              🚀 Go to Learning Platform
            </a>
            <p className="text-sm text-gray-500 mt-2">Test the main learning interface</p>
          </div>
        </div>
        
        <LoginForm />
        
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Why EduBridge?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl mb-3">📚</div>
              <h4 className="font-semibold mb-2">Learn in Kinyarwanda</h4>
              <p className="text-sm text-gray-600">Understand concepts in your mother tongue</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold mb-2">AI-Powered Help</h4>
              <p className="text-sm text-gray-600">Get instant explanations for homework questions</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
              <h4 className="font-semibold mb-2">Parent Tracking</h4>
              <p className="text-sm text-gray-600">Monitor your child's progress easily</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}