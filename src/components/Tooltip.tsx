import { useState } from 'react';

interface Props {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: Props) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center gap-1">
      {children}
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-blue-400 hover:text-blue-300 text-xs leading-none cursor-help"
        aria-label="Información"
      >
        ⓘ
      </button>
      {show && (
        <span className="absolute z-50 bottom-full left-0 mb-1 w-64 rounded bg-gray-800 text-white text-xs p-2 shadow-lg dark:bg-gray-700">
          {text}
        </span>
      )}
    </span>
  );
}
