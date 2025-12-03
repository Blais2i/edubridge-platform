// Replace the entire Dashboard component with this mobile-optimized version
'use client';

import { useState } from 'react';
import SubjectCard from '@/components/SubjectCard';
import ChatInterface from '@/components/ChatInterface';
import ProgressSidebar from '@/components/ProgressSidebar';

const subjects = [
  { id: 'math', name: 'Mathematics', icon: '📊', description: 'Ibibazo by\'uburinganire' },
  { id: 'science', name: 'Science', icon: '🔬', description: 'Soyesiyeri' },
  { id: 'social', name: 'Social Studies', icon: '🌍', description: 'Ibimenyane n\'abandi' },
  { id: 'english', name: 'English', icon: '📝', description: 'Icyongereza' },
  { id: 'kinyarwanda', name: 'Kinyarwanda', icon: '🇷🇼', description: 'Indimi z\'Abanyarwanda' },
  { id: 'est', name: 'EST', icon: '🔧', description: 'Engineering Science & Technology' },
];

export default function Dashboard() {
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [userType, setUserType] = useState<'student' | 'parent'>('student');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex justify-between items-center">
            {/* Logo - Smaller on mobile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800">EduBridge Learn</h1>
                <p className="text-xs text-gray-600">Student View</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-md font-bold text-gray-800">EduBridge</h1>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <span className="text-xl">☰</span>
            </button>

            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center space-x-3">
              <button 
                onClick={() => setUserType(userType === 'student' ? 'parent' : 'student')}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                {userType === 'student' ? '👪 Parent' : '👨‍🎓 Student'}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <select className="bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option>RW</option>
                    <option>EN</option>
                  </select>
                </div>
              </div>
              
              <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                👤
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-3 p-4 bg-white border rounded-lg shadow-lg">
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setUserType(userType === 'student' ? 'parent' : 'student');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Switch to {userType === 'student' ? 'Parent' : 'Student'} View
                </button>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Language:</span>
                  <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1">
                    <option>Kinyarwanda</option>
                    <option>English</option>
                  </select>
                </div>
                
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Profile Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 py-4">
        {userType === 'student' ? (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4">
            {/* Left: Subject Selection - Hidden on small mobile, show as swipeable */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Choose Subject</h2>
                <p className="text-gray-600 text-sm mb-4">Select a subject to get help</p>
                
                {/* Grid: 2 columns on mobile, 2 on tablet, 2 on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                  {subjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      isSelected={selectedSubject === subject.id}
                      onSelect={() => {
                        setSelectedSubject(subject.id);
                        if (window.innerWidth < 1024) {
                          // On mobile, scroll chat into view after selection
                          document.getElementById('chat-interface')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Progress Summary - Simpler on mobile */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Today's Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Learning Time</span>
                      <span className="font-medium">25 min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Concepts Mastered</span>
                      <span className="font-medium">3/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Chat Interface - Full width on mobile */}
            <div className="lg:col-span-2 mt-4 lg:mt-0" id="chat-interface">
              <ChatInterface selectedSubject={selectedSubject} />
            </div>
          </div>
        ) : (
          /* Parent View - Optimized for mobile */
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Parent Dashboard</h2>
            <p className="text-gray-600 mb-6">Monitor your child's learning progress</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="text-lg font-bold mb-1">Learning Time</h3>
                <div className="text-2xl font-bold text-green-600">2h 15m</div>
                <p className="text-xs text-gray-600">This week</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-bold mb-1">Concepts</h3>
                <div className="text-2xl font-bold text-blue-600">18</div>
                <p className="text-xs text-gray-600">Mastered</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-bold mb-1">Accuracy</h3>
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <p className="text-xs text-gray-600">Practice</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { subject: 'Mathematics', time: 'Today, 3:45 PM', activity: 'Solved area problems' },
                  { subject: 'Science', time: 'Today, 2:30 PM', activity: 'Learned water cycle' },
                  { subject: 'English', time: 'Yesterday', activity: 'Practiced past tense' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-sm">
                      📚
                    </div>
                    <div className="flex-1 min-w-0"> {/* Added for text truncation */}
                      <h4 className="font-semibold truncate">{item.subject}</h4>
                      <p className="text-xs text-gray-600 truncate">{item.activity} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center">
            <span className="text-xl">📚</span>
            <span className="text-xs mt-1">Subjects</span>
          </button>
          <button className="flex flex-col items-center">
            <span className="text-xl">💬</span>
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button className="flex flex-col items-center">
            <span className="text-xl">📊</span>
            <span className="text-xs mt-1">Progress</span>
          </button>
          <button className="flex flex-col items-center">
            <span className="text-xl">👤</span>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}