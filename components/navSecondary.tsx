'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon?: JSX.Element;
  text: string;
  href: string;
}

interface Props {
  navItems: NavItem[];
}

export default function NavSecondary(props: Props) {
  const pathname = usePathname();

  return (
    <nav className="nav-secondary">
      <ul>
        <li className="back-to">
          <Link href="/dashboard" className="nav-link icon-action">
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
        </li>
        {props.navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={`nav-link icon-action${item.href === pathname ? ' active' : ''}`}>
              {item.icon}
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
