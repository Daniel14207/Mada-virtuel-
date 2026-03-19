export default function DateSelector({ variant = 'tips' }: { variant?: 'tips' | 'premium' }) {
  const dates = [
    { day: 'Fri', date: 'Mar 13' },
    { day: 'Sat', date: 'Mar 14' },
    { day: 'Sun', date: 'Mar 15' },
    { day: 'Mon', date: 'Mar 16' },
    { day: 'Tue', date: 'Mar 17', active: true },
    { day: 'Wed', date: 'Mar 18' },
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar bg-[#131324] py-3 px-2 gap-2">
      {dates.map((d, i) => (
        <div 
          key={i} 
          className={`flex flex-col items-center justify-center min-w-[70px] py-2 rounded-md cursor-pointer
            ${d.active && variant === 'premium' ? 'bg-[#facc15] text-black' : 
              d.active && variant === 'tips' ? 'bg-[#1e1e38] text-[#facc15]' : 
              'bg-[#1e1e38] text-gray-300'}`}
        >
          <span className="text-sm">{d.day}</span>
          <span className="text-xs opacity-80">{d.date}</span>
        </div>
      ))}
    </div>
  );
}
