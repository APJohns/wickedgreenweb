'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  triggerText: string;
  children: JSX.Element | JSX.Element[];
}

export default function Dropdown(props: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  return (
    <div className={`dropdown${isExpanded ? '' : ' collapsed'}`}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {props.triggerText}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
      </button>
      <ul className="dropdown-menu" role="menu">
        {props.children}
      </ul>
    </div>
  );
}
