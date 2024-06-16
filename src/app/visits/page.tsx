'use client'

import React, { useState, useEffect } from 'react';
import VisitDetailsModal from '../components/VisitsDetailsModal/VisitsDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';
import styles from './styles.module.css';

export interface Visitor {
  surname: string;
  name: string;
  patronymic: string;
  birthday: string;
  citizenship: string;
  registration_region: string;
  gender: string;
  passport: string;
  email: string;
  phone: string;
  purpose_visit: string;
  car_plate: string;
}

export interface Visit {
  id: number;
  creator_id: number;
  admin_id: number;
  territory_id: number;
  track_id: number;
  start_date: string;
  end_date: string;
  visitors: Visitor[];
  status: string;
}

const VisitsPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showPastVisits, setShowPastVisits] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    const fetchVisitorsData = async () => {
      try {
        const response = await fetch('/data/visitors/visitors.json');
        if (!response.ok) {
          throw new Error('Failed to fetch visitors data');
        }
        const data = await response.json();
        setVisits(data.map((visit: Visit) => ({ ...visit, status: 'На рассмотрении' })));
      } catch (error) {
        console.error('Error fetching visitors data:', error);
      }
    };

    fetchVisitorsData();
  }, []);

  const handleRowClick = (visit: Visit) => {
    setSelectedVisit(visit);
  };

  const handleCloseModal = () => {
    setSelectedVisit(null);
  };

  const handleApprove = () => {
    setConfirmationAction('approve');
    setShowConfirmation(true);
  };

  const handleReject = () => {
    setConfirmationAction('reject');
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedVisit) {
      const updatedVisits = visits.map((visit) =>
        visit.id === selectedVisit.id
          ? { ...visit, status: confirmationAction === 'approve' ? 'Одобрено' : 'Отклонено' }
          : visit
      );
      setVisits(updatedVisits);
      setSelectedVisit(null);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'Одобрено':
        return styles.approved;
      case 'Отклонено':
        return styles.rejected;
      default:
        return '';
    }
  };

  const filterVisits = (visit: Visit) => {
    const today = new Date().toISOString().split('T')[0];
    if (showPastVisits) {
      return true;
    }
    return visit.end_date >= today;
  };


  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Запросы на посещение</h1>
        <label className={styles.labelCheckbox}>
          Показывать прошлые запросы
          <input type="checkbox" checked={showPastVisits} onChange={() => setShowPastVisits(!showPastVisits)} />
        </label>
      </div>
        
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Дата запроса</th>
            <th>Регион регистрации</th>
            <th>Дата посещения</th>
            <th>Количество посетителей</th>
            <th>Детали</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {visits.filter(filterVisits).map((visit) => (
              <tr
                key={visit.id}
                className={getStatusClassName(visit.status)}
                onClick={() => handleRowClick(visit)}
              >
                <td>{visit.start_date}</td>
                <td>{visit.visitors[0]?.registration_region}</td>
                <td>{visit.end_date}</td>
                <td>{visit.visitors.length}</td>
                <td>Смотреть</td>
                <td>{visit.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {selectedVisit && (
        <VisitDetailsModal
          visitDetails={selectedVisit}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      {showConfirmation && (
        <ConfirmationModal
          message={confirmationAction === 'approve' ? 'Одобрить запрос?' : 'Отклонить запрос?'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default VisitsPage;
