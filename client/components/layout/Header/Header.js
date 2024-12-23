import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header = ({ currentUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [burgerLineClass, setBurgerLineClass] = useState(
    `${styles.burgerLine} ${styles.unclicked}`
  );
  const [burgerMenuClass, setBurgerMenuClass] = useState(
    `${styles.burgerMenu} ${styles.hidden}`
  );
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleBurgerMenu = () => {
    if (isBurgerOpen) {
      setBurgerLineClass(`${styles.burgerLine} ${styles.unclicked}`);
      setBurgerMenuClass(`${styles.burgerMenu} ${styles.hidden}`);
    } else {
      setBurgerLineClass(`${styles.burgerLine} ${styles.clicked}`);
      setBurgerMenuClass(`${styles.burgerMenu} ${styles.visible}`);
    }
    setIsBurgerOpen(!isBurgerOpen);
  };

  const mainLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]
    .filter(Boolean)
    .map(({ label, href }) => (
      <li key={href} className={styles.navbarItem}>
        <Link href={href} legacyBehavior>
          <a className={styles.navbarLink}>{label}</a>
        </Link>
      </li>
    ));

  const accountLinks = [
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    currentUser && { label: 'Dashboard', href: '/dashboard/' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(Boolean)
    .map(({ label, href }) => (
      <li key={href}>
        <Link href={href} legacyBehavior>
          <a className={styles.menuItem}>{label}</a>
        </Link>
      </li>
    ));

  const burgerMainLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]
    .filter(Boolean)
    .map(({ label, href }) => (
      <li key={href}>
        <Link href={href} legacyBehavior>
          <a className={styles.burgerMenuLink}>{label}</a>
        </Link>
      </li>
    ));

  const burgerAccountLinks = [
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    currentUser && { label: 'Dashboard', href: '/dashboard/' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(Boolean)
    .map(({ label, href }) => (
      <li key={href}>
        <Link href={href} legacyBehavior>
          <a className={styles.burgerMenuLink}>{label}</a>
        </Link>
      </li>
    ));

  return (
    <header className={styles.header}>
      <Link href="/" legacyBehavior>
        <a className={styles.logo}>
          <img
            src="/imgs/logo.png"
            alt="GreenHive"
            className={styles.logoIcon}
          />
          <h1>GreenHive</h1>
        </a>
      </Link>

      <nav className={`${styles.navbar} ${styles.desktop}`}>
        <ul className={styles.navbarItems}>{mainLinks}</ul>
      </nav>

      <nav className={`${styles.navbar} ${styles.desktop}`}>
        {currentUser && (
          <div className={styles.iconWrapper} onClick={toggleMenu}>
            <p className={styles.navbarLink}>Account</p>
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320l-64 0c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3l64 0c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" />
            </svg>
          </div>
        )}

        {!currentUser && (
          <div className={styles.iconWrapper} onClick={toggleMenu}>
            <p className={styles.navbarLink}>Sign In/Up</p>
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
            </svg>
          </div>
        )}

        {isMenuOpen && (
          <ul className={`${styles.menu} ${styles.desktop}`}>{accountLinks}</ul>
        )}
      </nav>

      <div className={`${styles.burgerIcon} ${styles.mobile}`}>
        <div className={burgerLineClass} onClick={toggleBurgerMenu} />
        <div className={burgerLineClass} onClick={toggleBurgerMenu} />
        <div className={burgerLineClass} onClick={toggleBurgerMenu} />
      </div>

      <nav className={burgerMenuClass}>
        <div className={styles.burgerMenuSection}>
          <h2 className={styles.burgerMenuTitle}>Main Links</h2>
          <ul className={styles.burgerMenuLinks}>{burgerMainLinks}</ul>
        </div>
        <div className={styles.burgerMenuSection}>
          <h2 className={styles.burgerMenuTitle}>Account Links</h2>
          <ul className={styles.burgerMenuLinks}>{burgerAccountLinks}</ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
