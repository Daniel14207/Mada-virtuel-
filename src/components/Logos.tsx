import React from 'react';

export function TeamLogo({ name, className = "w-5 h-5" }: { name: string, className?: string }) {
  const initials = name.substring(0, 2).toUpperCase();
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  return (
    <div className={`${className} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}

export function LeagueLogo({ name, className = "w-6 h-6" }: { name: string, className?: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return (
    <div className={`${className} bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 rounded flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}
