'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import Calendar from './components/Calendar/Calendar';
import { years, months, monthData } from './components/Calendar/calendarData';

const DynamicMapViewPoints = dynamic(() => import('./components/MapViewPoints/MapViewPoints'), {
  ssr: false
});

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <main className={styles.main}>
      <Calendar years={years} months={months} monthData={monthData} />
      <DynamicMapViewPoints />
    </main>
  );
}
