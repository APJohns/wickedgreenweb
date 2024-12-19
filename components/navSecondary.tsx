'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface NavItem {
  icon?: JSX.Element;
  text: string;
  href: string;
  exact?: boolean;
}

interface Props {
  navItems: NavItem[];
  header?: string;
}

export default function NavSecondary(props: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const doesURLMatch = (href: string, exact: boolean) => {
    return exact ? pathname === href : pathname.includes(href);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button type="button" className="menu-open" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
        Menu
      </button>
      <nav className={`nav-secondary ${isOpen ? 'open' : ''}`}>
        <div>
          <Link href="/dashboard" className="nav-link icon-action back-to">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </Link>
          {props.header && <div className="nav-header">{props.header}</div>}
          <ul className="nav-list">
            {props.navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link icon-action${doesURLMatch(item.href, item.exact || false) ? ' active' : ''}`}
                >
                  {item.icon}
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
