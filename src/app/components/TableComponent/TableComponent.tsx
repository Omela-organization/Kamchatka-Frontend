"use client"

import React, { useState, useEffect } from 'react';
import { useTable, Column } from 'react-table';
import Modal from 'react-modal';
import styles from './styles.module.css';

import statusesData from '../../../../public/data/reports/status.json';
import problemsData from '../../../../public/data/reports/problems.json';
import photosData from '../../../../public/data/reports/photos.json';
import MapViewReports from '../MapViewReports/MapViewReports';

interface Status {
  id: number;
  name: string;
}

interface Problem {
  id: number;
  title: string;
  created_at: string;
  status_id: number;
  longitude: number;
  latitude: number;
  photos: string[];
  viewed: boolean;
}

interface Photo {
  id: string;
  path_to_photo: string;
}

interface TableData {
  id: number;
  title: string;
  created_at: string;
  status: string;
  coordinates: string;
  longitude: number;
  latitude: number;
  photos: string[];
  viewed: string;
}

interface ReportsTableProps {
  setSelectedCoordinates: (coordinates: { latitude: number, longitude: number }) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ setSelectedCoordinates }) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photoModalIsOpen, setPhotoModalIsOpen] = useState(false);
  const [viewedModalIsOpen, setViewedModalIsOpen] = useState(false);
  const [statusModalIsOpen, setStatusModalIsOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [selectedViewedStatus, setSelectedViewedStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const problemsWithViewed = problemsData.map(problem => ({ ...problem, viewed: false }));
    setStatuses(statusesData);
    setProblems(problemsWithViewed);
    setPhotos(photosData);
  }, []);

  const openModal = (photos: string[]) => {
    setSelectedPhotos(photos);
    setPhotoModalIsOpen(true);
  };

  const closeModal = () => {
    setPhotoModalIsOpen(false);
    setSelectedPhotos([]);
  };

  const openModalViewed = (problemId: number, viewed: boolean) => {
    setSelectedProblemId(problemId);
    setSelectedViewedStatus(viewed);
    setViewedModalIsOpen(true);
  };

  const closeModalViewed = () => {
    setViewedModalIsOpen(false);
    setSelectedProblemId(null);
    setSelectedViewedStatus(null);
  };

  const openModalStatus = (problemId: number, statusId: number) => {
    setSelectedProblemId(problemId);
    setSelectedStatusId(statusId);
    setStatusModalIsOpen(true);
  };

  const closeModalStatus = () => {
    setStatusModalIsOpen(false);
    setSelectedProblemId(null);
    setSelectedStatusId(null);
  };

  const updateStatus = async () => {
    if (!selectedProblemId || selectedStatusId === null) return;

    try {
      await fetch(`/api/reports/${selectedProblemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status_id: selectedStatusId }),
      });

      const updatedReports = problems.map((problem) =>
        problem.id === selectedProblemId ? { ...problem, status_id: selectedStatusId } : problem
      );
      setProblems(updatedReports);

      closeModalStatus();
    } catch (error) {
      console.error('Ошибка при обновлении статуса проверки:', error);
    }
  };

  const updateViewedStatus = async () => {
    if (!selectedProblemId || selectedViewedStatus === null) return;

    try {
      await fetch(`/api/reports/${selectedProblemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ viewed: selectedViewedStatus }),
      });

      const updatedReports = problems.map((problem) =>
        problem.id === selectedProblemId ? { ...problem, viewed: selectedViewedStatus } : problem
      );
      setProblems(updatedReports);

      closeModalViewed(); 
    } catch (error) {
      console.error('Ошибка при обновлении статуса просмотра:', error);
    }
  };

  const data: TableData[] = React.useMemo(
    () =>
      problems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        created_at: problem.created_at,
        status: statuses.find((status) => status.id === problem.status_id)?.name || 'Неизвестный статус',
        coordinates: `${problem.latitude}, ${problem.longitude}`,
        latitude: problem.latitude,
        longitude: problem.longitude,
        photos: problem.photos,
        viewed: problem.viewed ? 'Просмотрено' : 'Не просмотрено',
      })),
    [problems, statuses]
  );

  const columns: Column<TableData>[] = React.useMemo(
    () => [
      {
        Header: 'Просмотрено/Не просмотрено',
        accessor: 'viewed',
        Cell: ({ cell: { value, row } }) => (
          <div onClick={() => openModalViewed(row.original.id, row.original.viewed === 'Просмотрено')}>
            {value} 
          </div>
        ),
      },
      {
        Header: 'Дата',
        accessor: 'created_at',
      },
      {
        Header: 'Тип нарушения',
        accessor: 'title',
      },
      {
        Header: 'Координаты',
        accessor: 'coordinates',
      },
      {
        Header: 'Фотографии',
        accessor: 'photos',
        Cell: ({ cell: { value } }) => (
          <button className={styles.photoButton} onClick={() => openModal(value)}>
            Открыть фото
          </button>
        ),
      },
      {
        Header: 'Статус проверки',
        accessor: 'status',
        Cell: ({ cell: { value, row } }) => (
          <div onClick={() => openModalStatus(row.original.id, row.original.id)} className={styles.status}>
            {value} 
          </div>
        ),
      },
      {
        Header: 'Карта',
        id: 'mapButton',
        Cell: ({ cell: { row } }) => (
          <button
            className={styles.mapButton}
            onClick={() => setSelectedCoordinates({ latitude: row.original.latitude, longitude: row.original.longitude })}
          >
            Показать на карте
          </button>
        ),
      },
    ],
    [statuses]
  );

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const modalStyle: ReactModal.Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      height: 'auto',
      zIndex: '1000',    
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  const modalButtonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  };

  return (
    <div>
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal isOpen={photoModalIsOpen} onRequestClose={closeModal} style={modalStyle}>
        <h2>Фотографии</h2>
        {selectedPhotos.map((photo, index) => (
          <img key={index} src={photo} alt={`Photo ${index + 1}`} className={styles.photo} />
        ))}
        <div style={modalButtonContainerStyle}>
          <button onClick={closeModal} className={styles.modalButton}>Закрыть</button>
        </div>
      </Modal>

      <Modal isOpen={viewedModalIsOpen} onRequestClose={closeModalViewed} style={modalStyle}>
        <h2>Изменить статус просмотра</h2>
        <div>
          <input
            type="radio"
            id="viewed_true"
            name="viewed"
            value="true"
            checked={selectedViewedStatus === true}
            onChange={() => setSelectedViewedStatus(true)}
          />
          <label htmlFor="viewed_true">Просмотрено</label>
        </div>
        <div>
          <input
            type="radio"
            id="viewed_false"
            name="viewed"
            value="false"
            checked={selectedViewedStatus === false}
            onChange={() => setSelectedViewedStatus(false)}
          />
          <label htmlFor="viewed_false">Не просмотрено</label>
        </div>
        <div style={modalButtonContainerStyle}>
          <button onClick={updateViewedStatus} className={styles.modalButton}>Сохранить</button>
          <button onClick={closeModalViewed} className={styles.modalButton}>Отмена</button>
        </div>
         </Modal>

      <Modal isOpen={statusModalIsOpen} onRequestClose={closeModalStatus} style={modalStyle}>
        <h2>Изменить статус проверки</h2>
        {statuses.map((status) => (
          <div key={status.id}>
            <input
              type="radio"
              id={`status_${status.id}`}
              name="status"
              value={status.id}
              checked={selectedStatusId === status.id}
              onChange={() => setSelectedStatusId(status.id)}
            />
            <label htmlFor={`status_${status.id}`}>{status.name}</label>
          </div>
        ))}
        <div style={modalButtonContainerStyle}>
          <button onClick={updateStatus} className={styles.modalButton}>Сохранить</button>
          <button onClick={closeModalStatus} className={styles.modalButton}>Отмена</button>
        </div>
      </Modal>
    </div>
  );
};

export default ReportsTable;
