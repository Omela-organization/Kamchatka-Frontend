'use client';

import styles from "./page.module.css"
import MapView from "./components/MapViewPoints/MapViewPoints"
import Calendar from "./components/Calendar/Calendar"


import { years, months, monthData } from './components/Calendar/calendarData';

export default function Home() {
  return (
    <main className={styles.main}>
      <Calendar years={years} months={months} monthData={monthData}/>
      <MapView />
    </main>
  );
}
