// components/ProgressSidebar.tsx
'use client';

export default function ProgressSidebar() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Parent Dashboard</h2>
      <p className="text-gray-600 mb-8">Monitor your child's learning progress</p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-xl">
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-xl font-bold mb-2">Learning Time</h3>
          <div className="text-3xl font-bold text-green-600">2h 15m</div>
          <p className="text-sm text-gray-600">This week</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2">Concepts Mastered</h3>
          <div className="text-3xl font-bold text-blue-600">18</div>
          <p className="text-sm text-gray-600">Across all subjects</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Accuracy Rate</h3>
          <div className="text-3xl font-bold text-purple-600">85%</div>
          <p className="text-sm text-gray-600">Practice questions</p>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { subject: 'Mathematics', time: 'Today, 3:45 PM', activity: 'Solved area problems' },
            { subject: 'Science', time: 'Today, 2:30 PM', activity: 'Learned water cycle' },
            { subject: 'English', time: 'Yesterday', activity: 'Practiced past tense' },
          ].map((item, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                📚
              </div>
              <div>
                <h4 className="font-semibold">{item.subject}</h4>
                <p className="text-sm text-gray-600">{item.activity} • {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}