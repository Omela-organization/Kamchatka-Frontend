'use client'

import ReportsTable from "../components/TableComponent/TableComponent";
import MapViewReports from "../components/MapViewReports/MapViewReports";
import { useState } from "react";

const ReportsPage: React.FC = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
  return (
    <>
      <MapViewReports selectedCoordinates={selectedCoordinates}/>
      <ReportsTable setSelectedCoordinates={setSelectedCoordinates}/>
    </>
    
  );
};

export default ReportsPage;
