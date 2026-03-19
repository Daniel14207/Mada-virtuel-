import { Menu, ShoppingCart } from 'lucide-react';

export default function TopBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#131324] text-white">
      <button className="p-2 bg-[#facc15] rounded-md text-black">
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-medium">{title}</h1>
      <div className="relative">
        <button className="p-2 bg-[#facc15] rounded-md text-black">
          <ShoppingCart size={24} />
        </button>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          1
        </span>
      </div>
    </div>
  );
}
