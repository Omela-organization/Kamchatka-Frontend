'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css'

const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation_container}>
      <Link href="/" className={`${styles.navigation_button} ${pathname === '/' ? styles.active : ''}`}>Карта</Link>
      <Link href="/reports" className={`${styles.navigation_button} ${pathname === '/reports' ? styles.active : ''}`}>Анализ</Link>
      <Link href="/visits" className={`${styles.navigation_button} ${pathname === '/visits' ? styles.active : ''}`}>Запросы</Link>
    </nav>
  );
};

export default Navigation;