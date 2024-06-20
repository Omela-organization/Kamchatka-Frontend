import React, { useState, useEffect } from 'react';
import styles from './styles.module.css'; 
import { years, months, monthData, MonthData, isLeapYear } from './calendarData';

interface CalendarProps {
  years: number[];
  months: string[];
  monthData: MonthData[];
}

const getInitialDate = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  if (typeof window !== 'undefined') {
    const savedYear = localStorage.getItem('selectedYear');
    const savedMonthIndex = localStorage.getItem('selectedMonthIndex');
    const savedDate = localStorage.getItem('selectedDate');

    return {
      year: savedYear ? parseInt(savedYear, 10) : currentYear,
      monthIndex: savedMonthIndex ? parseInt(savedMonthIndex, 10) : currentMonth,
      date: savedDate || `${currentMonth + 1}/${currentDate}`
    };
  }
  return {
    year: currentYear,
    monthIndex: currentMonth,
    date: `${currentMonth + 1}/${currentDate}`
  };
};

const Calendar: React.FC<CalendarProps> = ({ years, months, monthData }) => {

  const initialDate = getInitialDate();
  const [selectedYear, setSelectedYear] = useState<number>(initialDate.year);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(initialDate.monthIndex);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate.date);

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedYear', selectedYear.toString());
      localStorage.setItem('selectedMonthIndex', selectedMonthIndex.toString());
      localStorage.setItem('selectedDate', selectedDate);
    }
  }, [selectedYear, selectedMonthIndex, selectedDate]);

  const handleYearClick = (year: number) => {
    console.log(`Year clicked: ${year}`);
    setSelectedYear(year);
  };

  const handleMonthClick = (index: number) => {
    console.log(`Month clicked: ${months[index]}`);
    setSelectedMonthIndex(index);
  };

  const handleDayClick = (date: string, isFuture: boolean) => {
    if (!isFuture) {
      console.log(`Date clicked: ${date}`);
      setSelectedDate(date);
    }
  };

  const getMonthDays = (month: MonthData, year: number): number => {
    if (month.name === 'Февраль') {
      return isLeapYear(year) ? 29 : 28;
    }
    return month.days;
  };
  return (
    <div className={styles.container}>
        <div className={styles.container_years_months}>
            {/* Displaying Years */}
            <div className={styles.container_years}>
                {years.map((year) => (
                <span
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`${styles.year} ${selectedYear === year ? styles.selected : ''}`}
                >
                    {year}
                </span>
                ))}
            </div>
            {/* Displaying Months */}
            <div className={styles.container_months}>
                {months.map((month, index) => (
                <span
                    key={index}
                    onClick={() => handleMonthClick(index)}
                    className={`${styles.month} ${selectedMonthIndex === index ? styles.selected : ''}`}
                >
                    {month}
                </span>
                ))}
            </div>
        </div>
      {/* Displaying Days */}
      <div className={styles.container_days}>
      {Array.from({ length: getMonthDays(monthData[selectedMonthIndex], selectedYear) }, (_, day) => {
          const date = `${selectedMonthIndex + 1}/${day + 1}`;
          const isFuture =
            selectedYear > todayYear ||
            (selectedYear === todayYear && selectedMonthIndex > todayMonth) ||
            (selectedYear === todayYear && selectedMonthIndex === todayMonth && day + 1 > todayDate);
          return (
            <span
              key={day}
              className={`${styles.day} ${selectedDate === date ? styles.selected : ''} ${
                isFuture ? styles.futureDay : ''
              }`} 
              onClick={() => handleDayClick(date, isFuture)}
            >
              {day + 1}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;