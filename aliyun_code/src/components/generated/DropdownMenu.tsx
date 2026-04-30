import { useState } from 'react';
import { Link } from 'react-router-dom';

interface DropdownItem {
  label: string;
  labelEn?: string;
  path: string;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export function DropdownMenu({ trigger, items, className = '' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      {isOpen && (
        <div className="absolute top-full right-0 pt-4 z-50">
          <div className="bg-black/95 backdrop-blur-2xl border border-white/10 min-w-[280px] py-2 overflow-hidden shadow-2xl">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 tracking-[0.15em] relative overflow-hidden group hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
