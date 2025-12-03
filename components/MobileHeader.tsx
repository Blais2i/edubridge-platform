'use client';

interface MobileHeaderProps {
  userType: 'student' | 'parent';
  onUserTypeChange: (type: 'student' | 'parent') => void;
}

export default function MobileHeader({ userType, onUserTypeChange }: MobileHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">EduBridge Learn</h1>
              <p className="text-sm text-gray-600">Learning Platform • Student View</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onUserTypeChange(userType === 'student' ? 'parent' : 'student')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {userType === 'student' ? '👨‍👩‍👧‍👦 Parent View' : '👨‍🎓 Student View'}
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">RW</span>
              <div className="relative">
                <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Kinyarwanda</option>
                  <option>English</option>
                </select>
              </div>
            </div>
            
            <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              👤
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
