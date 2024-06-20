'use client'

import ReportsTable from "../components/TableComponent/TableComponent";
import { useState } from "react";
import dynamic from 'next/dynamic';

// Динамический импорт компонента MapViewReports с отключением SSR
const DynamicMapViewReports = dynamic(() => import('../components/MapViewReports/MapViewReports'), {
  ssr: false // Отключаем серверный рендеринг для этого компонента
});

const ReportsPage: React.FC = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);

  return (
    <>
      <DynamicMapViewReports selectedCoordinates={selectedCoordinates}/>
      <ReportsTable setSelectedCoordinates={setSelectedCoordinates}/>
    </>
  );
};

export default ReportsPage;
