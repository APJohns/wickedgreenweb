'use client';

import { signOutAction } from '@/app/actions/auth';
import Link from 'next/link';
import Dropdown from './dropdown';
import Logo from './logo';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  isLoggedIn?: boolean;
}

export default function NavPrimary({ isLoggedIn = false }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const accountNavItems = (
    <>
      <li className="account-item">
        <Link href="/dashboard" className="nav-link dropdown-item">
          Dashboard
        </Link>
      </li>
      <li className="account-item">
        <Link href="/account" className="nav-link dropdown-item">
          Account settings
        </Link>
      </li>
      <li className="account-item">
        <Link href="https://forms.gle/uYqhTrC33fTRTXTY9" target="_blank" className="nav-link dropdown-item">
          Give feedback
        </Link>
      </li>
      <li className="account-item">
        <form action={signOutAction}>
          <button type="submit" className="nav-link dropdown-item">
            Sign out
          </button>
        </form>
      </li>
    </>
  );

  return (
    <nav className="nav nav-primary">
      <div className="nav-header">
        <Link href="/" className="nav-link logo">
          <span className="visually-hidden">Home</span>
          <Logo hasSRText={false} />
        </Link>
        <button
          type="button"
          className={`button-subtle icon-action menu-toggle ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          Menu
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li>
            <Link href="/plans" className="nav-link">
              Plans
            </Link>
          </li>
          <li>
            <Link href="/faq" className="nav-link">
              FAQ
            </Link>
          </li>
          {!isLoggedIn && (
            <li className="account-item">
              <Link href="/sign-in" className="nav-link">
                Sign in
              </Link>
            </li>
          )}
          {isLoggedIn && accountNavItems}
        </ul>
      </div>
      <div className="account-action">
        {!isLoggedIn && (
          <Link href="/sign-in" className="nav-link">
            Sign in
          </Link>
        )}
        {isLoggedIn && <Dropdown triggerText="Account">{accountNavItems}</Dropdown>}
      </div>
    </nav>
  );
}
