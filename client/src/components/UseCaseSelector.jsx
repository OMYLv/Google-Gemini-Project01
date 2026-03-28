import { Heart, Car, Cloud, Newspaper, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const USE_CASES = [
  {
    id: 'medical',
    name: 'Medical',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'Emergency triage & health analysis'
  },
  {
    id: 'traffic',
    name: 'Traffic',
    icon: Car,
    color: 'from-orange-500 to-yellow-500',
    description: 'Incident reporting & route analysis'
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
    description: 'Alert processing & safety recommendations'
  },
  {
    id: 'news',
    name: 'News',
    icon: Newspaper,
    color: 'from-purple-500 to-indigo-500',
    description: 'Article analysis & fact checking'
  },
  {
    id: 'general',
    name: 'General',
    icon: Sparkles,
    color: 'from-slate-500 to-gray-500',
    description: 'Universal input processing'
  }
];

export default function UseCaseSelector({ selected, onSelect }) {
  return (
    <div className="card border-2 border-white/20">
      <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1.5 h-8 rounded-full animate-pulse"></span>
        Select Use Case
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {USE_CASES.map((useCase) => {
          const Icon = useCase.icon;
          const isSelected = selected === useCase.id;
          
          return (
            <button
              key={useCase.id}
              onClick={() => onSelect(useCase.id)}
              className={clsx(
                'relative p-6 rounded-2xl transition-all duration-300 border-2 group overflow-hidden',
                isSelected
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/50 scale-105 bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                  : 'border-white/20 hover:border-purple-400/50 hover:shadow-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
              <div className="relative">
                <div className={clsx(
                  'w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:rotate-6',
                  isSelected 
                    ? `bg-gradient-to-br ${useCase.color} shadow-purple-500/50` 
                    : 'bg-white/10 backdrop-blur-lg group-hover:bg-white/20'
                )}>
                  <Icon className={clsx(
                    'w-7 h-7 transition-all duration-300 group-hover:scale-110',
                    isSelected ? 'text-white animate-pulse' : 'text-purple-300 group-hover:text-white'
                  )} strokeWidth={2.5} />
                </div>
                <p className={clsx(
                  'font-bold text-base mb-1 transition-all duration-300',
                  isSelected ? 'text-white' : 'text-purple-200 group-hover:text-white'
                )}>
                  {useCase.name}
                </p>
                <p className={clsx(
                  'text-xs transition-all duration-300',
                  isSelected ? 'text-purple-200' : 'text-purple-300/70 group-hover:text-purple-200'
                )}>
                  {useCase.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
