// components/SubjectCard.tsx
'use client';

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export default function SubjectCard({ subject, isSelected, onSelect }: SubjectCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-green-500 bg-green-50 transform scale-105'
          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="text-3xl mb-2">{subject.icon}</div>
        <h3 className="font-semibold text-gray-800 mb-1">{subject.name}</h3>
        <p className="text-sm text-gray-600">{subject.description}</p>
      </div>
    </button>
  );
}